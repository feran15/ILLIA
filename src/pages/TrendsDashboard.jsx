import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { AlertCircle, Copy, PenLine, RefreshCw, Search, TrendingUp } from "lucide-react";
import {auth} from "../Firebase/config"
/* ------------------------------------------------------------------ */
/* Data: wire this part to your existing trends request                */
/* ------------------------------------------------------------------ */

// Set to false once fetchTrends below calls your real API.
const CORE_API_URL = import.meta.env.VITE_CORE_API_URL?.replace(/\/+$/, "");

const SAMPLE = [
  ["Behind-the-scenes content", "Creator strategy", 482000],
  ["Small business tips", "Business", 361000],
  ["Day in my life", "Lifestyle", 295000],
  ["Afrobeats new releases", "Music", 244000],
  ["Personal storytelling", "Content format", 198000],
  ["Educational carousels", "Engagement", 143000],
  ["Side hustle ideas", "Business", 121000],
  ["Get ready with me", "Lifestyle", 96000],
  ["Productivity routines", "Self growth", 74000],
  ["Brand collaborations", "Creator strategy", 52000],
].map(([title, category, volume]) => ({ title, category, volume }));


async function fetchTrends(platformId, { refresh = false } = {}) {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Please sign in to view trends.");
  }

  const token = await user.getIdToken();

  const params = new URLSearchParams({
    platform: platformId,
    region: "NG",
  });

  if (refresh) {
    params.set("refresh", "true");
  }

  const response = await fetch(
    `${CORE_API_URL}/api/trends?${params.toString()}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Unable to fetch trends.");
  }

  return data.items || [];
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const PLATFORMS = [
  { id: "twitter", label: "X / Twitter", color: "#38BDF8" },
  { id: "instagram", label: "Instagram", color: "#F472B6" },
  { id: "linkedin", label: "LinkedIn", color: "#60A5FA" },
  { id: "tiktok", label: "TikTok", color: "#FB7185" },
  { id: "facebook", label: "Facebook", color: "#A5B4FC" },
];

const compact = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 });

function parseVolume(v) {
  if (v == null || v === "") return null;
  if (typeof v === "number") return v;
  const m = String(v).trim().match(/^([\d.,]+)\s*([kmb])?/i);
  if (!m) return null;
  const mult = { k: 1e3, m: 1e6, b: 1e9 }[(m[2] || "").toLowerCase()] || 1;
  return parseFloat(m[1].replace(/,/g, "")) * mult;
}

function normalize(raw, i) {
  const title = raw.title || raw.name || raw.topic || raw.hashtag || String(raw);
  return {
    id: `${i}-${title}`,
    rank: i + 1,
    title,
    category: raw.category || raw.type || "",
    volume: parseVolume(raw.volume ?? raw.tweet_volume ?? raw.posts ?? raw.count),
  };
}

function timeAgo(ts) {
  const mins = Math.floor((Date.now() - ts) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  return `${Math.floor(mins / 60)}h ago`;
}

/* ------------------------------------------------------------------ */
/* Pieces                                                              */
/* ------------------------------------------------------------------ */

function Meta({ trend, className = "" }) {
  const parts = [trend.category, trend.volume != null ? `${compact.format(trend.volume)} posts` : ""].filter(Boolean);
  return parts.length ? <p className={className}>{parts.join(" · ")}</p> : null;
}

function FeaturedTrend({ trend, platform, onCreate, onCopy }) {
  return (
    <section
      className="relative overflow-hidden rounded-[28px] p-5 text-white sm:p-8"
      style={{ background: `linear-gradient(135deg, color-mix(in srgb, ${platform.color} 30%, #241528) 0%, #2A1733 75%)` }}
    >
      <p className="text-[13px] font-bold text-white/70">Number one on {platform.label}</p>
      <h2 className="mt-3 max-w-3xl break-words text-[30px] font-black leading-[1.08] tracking-[-1px] sm:text-[48px]">
        {trend.title}
      </h2>
      <Meta trend={trend} className="mt-3 text-sm text-white/65" />

      <div className="mt-6 flex flex-wrap gap-2.5">
        <button
          type="button"
          onClick={() => onCreate(trend)}
          className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-5 text-[13px] font-extrabold text-[#2A1733] hover:bg-violet-50"
        >
          <PenLine size={16} />
          Write a post about this
        </button>
        <button
          type="button"
          onClick={() => onCopy(trend)}
          className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 px-4 text-[13px] font-bold text-white hover:bg-white/10"
        >
          <Copy size={15} />
          Copy topic
        </button>
      </div>
    </section>
  );
}

function TrendRow({ trend, maxVol, onCreate, onCopy }) {
  const pct = trend.volume && maxVol ? Math.max(4, (trend.volume / maxVol) * 100) : 0;
  return (
    <li className="group flex items-center gap-3 px-3 py-3.5 sm:gap-4 sm:px-5">
      <span className="w-7 shrink-0 text-right text-lg font-black tabular-nums text-[#C5BBD2]">{trend.rank}</span>

      <div className="min-w-0 flex-1">
        <p className="break-words text-[14.5px] font-bold leading-snug">{trend.title}</p>
        <Meta trend={trend} className="mt-0.5 truncate text-xs text-[#8F869D]" />
        {pct > 0 && (
          <div className="mt-2 h-1 w-full max-w-xs overflow-hidden rounded-full bg-[#F0ECF5]">
            <div className="h-full rounded-full bg-[var(--accent)]" style={{ width: `${pct}%` }} />
          </div>
        )}
      </div>

      <button
        type="button"
        aria-label={`Copy ${trend.title}`}
        onClick={() => onCopy(trend)}
        className="hidden h-10 w-10 shrink-0 place-items-center rounded-xl text-[#A49BAF] hover:bg-[#F8F5FC] hover:text-violet-700 sm:grid"
      >
        <Copy size={16} />
      </button>
      <button
        type="button"
        onClick={() => onCreate(trend)}
        aria-label={`Write a post about ${trend.title}`}
        className="inline-flex h-10 shrink-0 items-center gap-2 rounded-xl border border-[#E9E1F3] bg-white px-3 text-[13px] font-bold text-[#4A3D5A] hover:border-[var(--accent)] hover:bg-[#FAF8FD] sm:px-4"
      >
        <PenLine size={15} />
        <span className="hidden sm:inline">Create</span>
      </button>
    </li>
  );
}

function Skeleton() {
  return (
    <div className="space-y-4" aria-busy="true" aria-label="Loading trends">
      <div className="h-[220px] animate-pulse rounded-[28px] bg-[#F3EFF8]" />
      <div className="divide-y divide-[#F0ECF5] rounded-[22px] border border-[#EEE9F2]">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <div className="h-5 w-6 animate-pulse rounded bg-[#F0ECF5]" />
            <div className="h-4 flex-1 animate-pulse rounded bg-[#F0ECF5]" />
          </div>
        ))}
      </div>
    </div>
  );
}

function Notice({ icon: Icon, title, hint, children }) {
  return (
    <div className="flex flex-col items-center rounded-[28px] border border-dashed border-[#DCD2EA] px-6 py-16 text-center">
      <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-violet-50 text-violet-600">
        <Icon size={26} />
      </span>
      <p className="text-lg font-extrabold">{title}</p>
      <p className="mt-1.5 max-w-sm text-sm text-[#8F869D]">{hint}</p>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TrendsDashboard() {
  const navigate = useNavigate();
  const [platformId, setPlatformId] = useState(PLATFORMS[0].id);
  const [cache, setCache] = useState({});
  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [, tick] = useState(0);

  const platform = PLATFORMS.find((p) => p.id === platformId);
  const entry = cache[platformId];
  const loading = loadingId === platformId;

  // keeps "Updated 3m ago" fresh
  useEffect(() => {
    const t = setInterval(() => tick((n) => n + 1), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    setError("");
    setQuery("");
  }, [platformId]);

  const load = useCallback(async () => {
    const id = platformId;
    setLoadingId(id);
    setError("");
    try {
      const raw = await fetchTrends(id);
      const items = (Array.isArray(raw) ? raw : []).slice(0, 10).map(normalize);
      setCache((c) => ({ ...c, [id]: { items, updatedAt: Date.now() } }));
    } catch (e) {
      setError(e?.message || "Couldn't load trends");
    } finally {
      setLoadingId((cur) => (cur === id ? null : cur));
    }
  }, [platformId]);

  const items = entry?.items ?? [];
  const q = query.trim().toLowerCase();
  const filtered = q ? items.filter((t) => `${t.title} ${t.category}`.toLowerCase().includes(q)) : items;
  const featured = !q && filtered.length ? filtered[0] : null;
  const list = featured ? filtered.slice(1) : filtered;
  const maxVol = Math.max(0, ...items.map((t) => t.volume || 0));

  function createFrom(trend) {
    try {
      sessionStorage.setItem(
        "illia_home_prompt",
        `Write a ${platform.label} post about the trending topic "${trend.title}".`
      );
    } catch {
      /* storage blocked */
    }
    navigate("/studio/create");
  }

  function copyTopic(trend) {
    navigator.clipboard.writeText(trend.title).then(() => toast.success("Topic copied"));
  }

  return (
    // pt-16 on phones leaves room for the sidebar's fixed menu button
    <div
      className="min-h-screen w-full bg-white px-3 pb-10 pt-16 text-[#292035] sm:px-6 lg:px-10 lg:pt-8"
      style={{ "--accent": platform.color }}
    >
      <div className="mx-auto w-full max-w-[1000px]">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="flex items-center gap-3 text-[28px] font-black tracking-[-0.8px] sm:text-[34px]">
              <TrendingUp className="text-violet-600" size={30} />
              Trends
            </h1>
            <p className="mt-1.5 text-sm text-[#8F869D]">
              The top 10 topics on each platform right now. Pick one and turn it into a post.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {entry && <span className="text-xs text-[#A49BAF]">Updated {timeAgo(entry.updatedAt)}</span>}
            <button
              type="button"
              onClick={load}
              disabled={loading}
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2A1733] px-4 text-[13px] font-extrabold text-white hover:bg-[#3A2447] disabled:opacity-60"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              {loading ? "Loading" : entry ? "Refresh" : "Load trends"}
            </button>
          </div>
        </header>

        {/* Platforms */}
        <div className="-mx-3 mb-4 overflow-x-auto px-3 pb-1 sm:mx-0 sm:px-0 [scrollbar-width:none]" role="tablist">
          <div className="flex w-max gap-2">
            {PLATFORMS.map((p) => {
              const active = p.id === platformId;
              return (
                <button
                  key={p.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setPlatformId(p.id)}
                  style={{ "--c": p.color }}
                  className={`inline-flex h-11 items-center gap-2 whitespace-nowrap rounded-full border px-4 text-[13.5px] font-bold transition ${
                    active
                      ? "border-[var(--c)] bg-[color-mix(in_srgb,var(--c)_16%,white)] text-[#292035]"
                      : "border-[#EEE9F2] bg-white text-[#6E647C] hover:border-[#D9CFE6] hover:text-[#292035]"
                  }`}
                >
                  <span className="h-2 w-2 rounded-full bg-[var(--c)]" />
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Search */}
        <label className="relative mb-6 block">
          <Search size={17} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A69DB3]" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={`Search ${platform.label} trends`}
            aria-label="Search trends"
            className="h-12 w-full rounded-2xl border border-[#EEE9F2] bg-white pl-11 pr-4 text-base text-[#292035] outline-none placeholder:text-[#A69DB3] focus:border-[var(--accent)] focus:ring-4 focus:ring-violet-50 sm:text-[14.5px]"
          />
        </label>

        {CORE_API_URL && (
          <p className="mb-4 rounded-xl bg-[#F8F5FC] px-3.5 py-2.5 text-xs text-[#8E829F]">
            Showing sample trends. Connect fetchTrends to your trends service for live data.
          </p>
        )}

        {error && entry && (
          <p className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[13px] text-rose-700">
            <AlertCircle size={16} className="shrink-0" />
            Couldn't refresh, showing the last results. {error}
          </p>
        )}

        {/* Content */}
        {loading && !entry ? (
          <Skeleton />
        ) : error && !entry ? (
          <Notice icon={AlertCircle} title="Couldn't load trends" hint={error}>
            <button 
              type="button"
              onClick={load}
              className="mt-5 h-11 rounded-xl bg-[#2A1733] px-5 text-[13px] font-extrabold text-white hover:bg-[#3A2447]"
            >
              Try again
            </button>
          </Notice>
        ) : !entry ? (
          <Notice
            icon={TrendingUp}
            title={`See what's trending on ${platform.label}`}
            hint="Load the top 10 topics, then turn any of them into a post."
          >
            <button
              type="button"
              onClick={load}
              className="mt-5 h-11 rounded-xl bg-[#2A1733] px-5 text-[13px] font-extrabold text-white hover:bg-[#3A2447]"
            >
              Load trends
            </button>
          </Notice>
        ) : filtered.length === 0 ? (
          <Notice icon={Search} title="No trends match your search" hint={`Nothing on ${platform.label} matches “${query}”. Try a shorter word.`} />
        ) : (
          <div className="space-y-4">
            {featured && <FeaturedTrend trend={featured} platform={platform} onCreate={createFrom} onCopy={copyTopic} />}
            {list.length > 0 && (
              <ul className="divide-y divide-[#F0ECF5] overflow-hidden rounded-[22px] border border-[#EEE9F2] bg-white">
                {list.map((t) => (
                  <TrendRow key={t.id} trend={t} maxVol={maxVol} onCreate={createFrom} onCopy={copyTopic} />
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}