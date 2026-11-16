import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import {
  Activity,
  AlertCircle,
  BarChart3,
  CalendarDays,
  Eye,
  Heart,
  Loader2,
  MessageCircle,
  MousePointer2,
  RefreshCw,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";
import { auth } from "../Firebase/auth";

// Base URL of the ILLIA core Worker
const API_BASE = "https://core.illiasmartai.workers.dev";

// Calls the Worker with the signed-in user's Firebase ID token.
// (Same helper as Profile.jsx. Move it to a shared file if you like.)
async function api(path, options = {}) {
  const user = auth.currentUser;
  if (!user) throw new Error("Please sign in again");

  const token = await user.getIdToken();
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error = new Error(data.error || `Request failed (${response.status})`);
    error.status = response.status;
    throw error;
  }
  return data;
}

const PERIODS = [
  { label: "7 days", days: 7 },
  { label: "30 days", days: 30 },
  { label: "90 days", days: 90 },
];

const PLATFORM_META = {
  instagram: { name: "Instagram", color: "#E4405F", initials: "IG" },
  twitter: { name: "X / Twitter", color: "#202020", initials: "X" },
  linkedin: { name: "LinkedIn", color: "#0A66C2", initials: "in" },
  tiktok: { name: "TikTok", color: "#252525", initials: "TK" },
  facebook: { name: "Facebook", color: "#1877F2", initials: "FB" },
};

function platformMeta(key) {
  return (
    PLATFORM_META[key] || {
      name: key ? key.charAt(0).toUpperCase() + key.slice(1) : "Other",
      color: "#6D28D9",
      initials: (key || "?").slice(0, 2).toUpperCase(),
    }
  );
}

const compact = new Intl.NumberFormat("en", {
  notation: "compact",
  maximumFractionDigits: 1,
});
const formatNumber = (n) => compact.format(Number(n) || 0);
const formatPercent = (n) => `${(Number(n) || 0).toFixed(1)}%`;

const FALLBACK_TIPS = [
  {
    title: "Build a consistent schedule",
    body: "Test a regular posting schedule and compare results week to week.",
  },
  {
    title: "Create conversation starters",
    body: "Ask relevant questions that encourage genuine comments and replies.",
  },
];

function MetricCard({ title, value, description, icon: Icon, accent }) {
  return (
    <div className="min-w-0 rounded-2xl border border-[#EDE8F0] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-[#77717F]">{title}</p>
          <h3 className="mt-3 truncate text-2xl font-bold tracking-tight text-[#241528] sm:text-3xl">
            {value}
          </h3>
        </div>

        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
          style={{ backgroundColor: accent }}
        >
          <Icon size={19} className="text-[#6D28D9]" />
        </div>
      </div>

      <p className="mt-4 text-xs text-[#98919F]">{description}</p>
    </div>
  );
}

function formatDay(iso) {
  const date = new Date(`${iso}T00:00:00Z`);
  if (isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat("en", {
    day: "numeric",
    month: "short",
    timeZone: "UTC",
  }).format(date);
}

// timeline: [{ date: "YYYY-MM-DD", impressions, engagement }]
function PerformanceChart({ timeline, showEngagement }) {
  const width = 700;
  const height = 250;
  const left = 8;
  const right = 8;
  const top = 16;
  const bottom = 26;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const maxImpressions = Math.max(...timeline.map((d) => d.impressions), 1);
  const maxEngagement = Math.max(...timeline.map((d) => d.engagement), 1);

  const xAt = (index) =>
    left + (index / Math.max(timeline.length - 1, 1)) * plotWidth;
  const yAt = (value, max) => top + plotHeight - (value / max) * plotHeight;

  const reachPoints = timeline
    .map((d, i) => `${xAt(i)},${yAt(d.impressions, maxImpressions)}`)
    .join(" ");
  const engagementPoints = timeline
    .map((d, i) => `${xAt(i)},${yAt(d.engagement, maxEngagement)}`)
    .join(" ");

  const bottomY = height - bottom;
  const areaPath = `M ${reachPoints.split(" ").join(" L ")} L ${xAt(
    timeline.length - 1
  )},${bottomY} L ${xAt(0)},${bottomY} Z`;

  // Show at most 6 evenly spaced x labels so they never collide on phones
  const step = Math.max(1, Math.ceil(timeline.length / 6));
  const showDots = timeline.length <= 14;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-5 text-xs text-[#77717F]">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
          Impressions
        </span>
        {showEngagement && (
          <span className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#EC4899]" />
            Engagement
          </span>
        )}
      </div>

      <div className="mt-5 w-full">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label="Impressions and engagement by posting date"
        >
          <defs>
            <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity=".22" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 25, 50, 75, 100].map((value) => {
            const y = top + plotHeight - (value / 100) * plotHeight;
            return (
              <line
                key={value}
                x1={left}
                x2={width - right}
                y1={y}
                y2={y}
                stroke="#F0ECF3"
                strokeDasharray="4 5"
              />
            );
          })}

          {timeline.length > 1 && (
            <path d={areaPath} fill="url(#reachGradient)" />
          )}

          <polyline
            points={reachPoints}
            fill="none"
            stroke="#8B5CF6"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {showEngagement && (
            <polyline
              points={engagementPoints}
              fill="none"
              stroke="#EC4899"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {showDots &&
            timeline.map((d, i) => (
              <circle
                key={`r-${d.date}`}
                cx={xAt(i)}
                cy={yAt(d.impressions, maxImpressions)}
                r="3.5"
                fill="#8B5CF6"
              />
            ))}

          {showDots &&
            showEngagement &&
            timeline.map((d, i) => (
              <circle
                key={`e-${d.date}`}
                cx={xAt(i)}
                cy={yAt(d.engagement, maxEngagement)}
                r="3"
                fill="#EC4899"
              />
            ))}

          {timeline.map((d, i) =>
            i % step === 0 || i === timeline.length - 1 ? (
              <text
                key={d.date}
                x={xAt(i)}
                y={height - 5}
                textAnchor={
                  i === 0 ? "start" : i === timeline.length - 1 ? "end" : "middle"
                }
                fontSize="11"
                fill="#99919F"
              >
                {formatDay(d.date)}
              </text>
            ) : null
          )}
        </svg>
      </div>

      <p className="mt-2 text-[11px] text-[#A19AA7]">
        Grouped by posting date. Each line is scaled to its own peak, so compare
        the shapes rather than the heights.
      </p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-dashed border-[#DCCAF4] bg-white p-8 text-center sm:p-12">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-100 text-violet-700">
        <BarChart3 size={22} />
      </div>
      <h2 className="mt-4 text-lg font-bold text-[#241528]">
        No analytics yet
      </h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#77717F]">
        Once you publish a post through a connected account, its impressions,
        likes, comments and shares will show up here. Numbers can take a little
        while to arrive after a post goes live.
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        <a
          href="/profile/"
          className="inline-flex h-11 items-center justify-center rounded-xl bg-[#7C3AED] px-5 text-sm font-semibold text-white hover:bg-[#6D28D9]"
        >
          Connect an account
        </a>
        <a
          href="/calendar/"
          className="inline-flex h-11 items-center justify-center rounded-xl border border-[#E7DFEC] bg-white px-5 text-sm font-semibold text-[#50465B] hover:bg-[#F6F0FA]"
        >
          Schedule a post
        </a>
      </div>
    </div>
  );
}

export default function Analytics() {
  const [user, setUser] = useState(null);
  const [authChecked, setAuthChecked] = useState(false);

  const [days, setDays] = useState(30);
  const [data, setData] = useState(null);
  const [status, setStatus] = useState("loading"); // loading | ready | error
  const [error, setError] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [refreshError, setRefreshError] = useState("");

  const [showEngagement, setShowEngagement] = useState(true);
  const [platformFilter, setPlatformFilter] = useState("all");

  // The endpoint is limited to 10 calls/hour/user, so remember each range
  // for the session instead of re-fetching when the user flips between tabs.
  const cache = useRef({});
  const requestId = useRef(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthChecked(true);
    });
    return unsubscribe;
  }, []);

  const load = useCallback(async (range, { force = false } = {}) => {
    if (!force && cache.current[range]) {
      setData(cache.current[range]);
      setStatus("ready");
      setError("");
      return;
    }

    const id = ++requestId.current;
    if (force) {
      setRefreshing(true);
      setRefreshError("");
    } else {
      setStatus("loading");
    }

    try {
      const result = await api("/api/analytics/insights", {
        method: "POST",
        body: JSON.stringify({ range }),
      });
      if (id !== requestId.current) return; // a newer request took over

      cache.current[range] = result;
      setData(result);
      setStatus("ready");
      setError("");
    } catch (err) {
      if (id !== requestId.current) return;
      console.error(err);

      const message =
        err.status === 429
          ? "You've refreshed a lot. Please wait a bit and try again."
          : err.message || "Couldn't load your analytics";

      if (force && cache.current[range]) {
        setRefreshError(message); // keep showing the data we already have
      } else {
        setError(message);
        setStatus("error");
      }
    } finally {
      if (id === requestId.current) setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!authChecked) return;
    if (!user) {
      setStatus("error");
      setError("Please sign in to see your analytics");
      return;
    }
    load(days);
  }, [authChecked, user, days, load]);

  const totals = data?.totals || {
    impressions: 0,
    likes: 0,
    comments: 0,
    shares: 0,
  };
  const interactions = totals.likes + totals.comments + totals.shares;
  const engagementRate = totals.impressions
    ? (interactions / totals.impressions) * 100
    : 0;

  const platformRows = useMemo(() => {
    const entries = Object.entries(data?.byPlatform || {}).map(([key, v]) => {
      const platformInteractions = v.likes + v.comments + v.shares;
      return {
        key,
        ...platformMeta(key),
        posts: v.posts,
        impressions: v.impressions,
        interactions: platformInteractions,
        rate: v.impressions ? (platformInteractions / v.impressions) * 100 : 0,
      };
    });
    entries.sort((a, b) => b.impressions - a.impressions);
    return entries;
  }, [data]);

  const maxPlatformImpressions = Math.max(
    ...platformRows.map((p) => p.impressions),
    1
  );

  const topPosts = useMemo(() => data?.topPosts || [], [data]);
  const filteredPosts = topPosts.filter(
    (post) => platformFilter === "all" || post.platform === platformFilter
  );
  const platformOptions = useMemo(
    () => [...new Set(topPosts.map((p) => p.platform).filter(Boolean))],
    [topPosts]
  );

  const timeline = Array.isArray(data?.timeline) ? data.timeline : [];

  const hasData =
    !!data &&
    (totals.impressions > 0 ||
      interactions > 0 ||
      platformRows.length > 0 ||
      topPosts.length > 0);

  const aiSummary = data?.insights?.summary || null;
  const aiActions =
    Array.isArray(data?.insights?.actions) && data.insights.actions.length
      ? data.insights.actions
      : null;
  const coachTips = aiActions || FALLBACK_TIPS;
  const coachIcons = [CalendarDays, MessageCircle, TrendingUp];

  return (
    // LayOut already provides <main>, so this is a plain div
    <div className="min-h-screen bg-[#FBF9FC] px-4 py-6 text-[#241528] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1500px] space-y-7">
        {/* Header */}
        <header className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-[#8B5CF6]">
              <Activity size={15} />
              Creator intelligence
            </div>

            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Your analytics<span className="text-[#8B5CF6]">.</span>
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#77717F]">
              Understand your growth, discover what resonates, and make your
              next post count.
            </p>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#E7DFEC] bg-white px-4 py-3 text-sm font-semibold transition hover:bg-[#F6F0FA] sm:self-auto print:hidden"
          >
            <BarChart3 size={17} />
            Export report
          </button>
        </header>

        {/* Date filter */}
        <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold">Performance overview</h2>
            <p className="mt-1 text-xs text-[#8D8594]">
              Based on posts published through your connected accounts
            </p>
          </div>

          <div className="flex w-full items-center gap-2 sm:w-auto">
            <div className="flex flex-1 gap-1 rounded-xl border border-[#EAE3EE] bg-white p-1 sm:flex-none">
              {PERIODS.map((item) => (
                <button
                  key={item.days}
                  onClick={() => setDays(item.days)}
                  className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition sm:flex-none ${
                    days === item.days
                      ? "bg-[#241528] text-white shadow-sm"
                      : "text-[#77717F] hover:bg-[#F7F3F9]"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            <button
              onClick={() => load(days, { force: true })}
              disabled={refreshing || status === "loading"}
              aria-label="Refresh analytics"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#EAE3EE] bg-white text-[#77717F] hover:bg-[#F7F3F9] disabled:opacity-60 print:hidden"
            >
              <RefreshCw
                size={16}
                className={refreshing ? "animate-spin" : ""}
              />
            </button>
          </div>
        </section>

        {refreshError && (
          <div className="flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
            <AlertCircle size={16} className="mt-0.5 shrink-0" />
            {refreshError}
          </div>
        )}

        {/* Loading */}
        {status === "loading" && (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-7 w-7 animate-spin text-[#7C3AED]" />
          </div>
        )}

        {/* Error */}
        {status === "error" && (
          <div className="rounded-2xl border border-red-100 bg-white p-8 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600">
              <AlertCircle size={22} />
            </div>
            <h2 className="mt-4 text-lg font-bold">
              We couldn't load your analytics
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm text-[#77717F]">
              {error}
            </p>
            <button
              onClick={() => load(days, { force: true })}
              className="mt-5 inline-flex h-11 items-center justify-center rounded-xl bg-[#7C3AED] px-5 text-sm font-semibold text-white hover:bg-[#6D28D9]"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {status === "ready" && !hasData && <EmptyState />}

        {/* Data */}
        {status === "ready" && hasData && (
          <>
            {/* Metrics */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <MetricCard
                title="Total impressions"
                value={formatNumber(totals.impressions)}
                description={`Last ${data.rangeDays} days`}
                icon={Eye}
                accent="#F0E8FF"
              />
              <MetricCard
                title="Engagement rate"
                value={formatPercent(engagementRate)}
                description="Interactions ÷ impressions"
                icon={Heart}
                accent="#FCE7F3"
              />
              <MetricCard
                title="Total followers"
                value={formatNumber(data.followerTotal)}
                description="Across connected accounts"
                icon={Users}
                accent="#E6F7EF"
              />
              <MetricCard
                title="Total interactions"
                value={formatNumber(interactions)}
                description={`${formatNumber(totals.likes)} likes · ${formatNumber(
                  totals.comments
                )} comments · ${formatNumber(totals.shares)} shares`}
                icon={MousePointer2}
                accent="#FFF1DB"
              />
            </section>

            {/* Chart + AI coach */}
            <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <div className="min-w-0 rounded-2xl border border-[#EDE8F0] bg-white p-5 sm:p-6 xl:col-span-2">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">
                      Impressions & engagement
                    </h2>
                    <p className="mt-1 text-xs text-[#8D8594]">
                      How your content is trending over time
                    </p>
                  </div>

                  {timeline.length > 0 && (
                    <button
                      onClick={() => setShowEngagement((current) => !current)}
                      className="rounded-lg border border-[#ECE5F0] px-3 py-2 text-xs font-medium text-[#62596B] hover:bg-[#FAF7FC]"
                    >
                      {showEngagement ? "Hide engagement" : "Show engagement"}
                    </button>
                  )}
                </div>

                <div className="mt-6">
                  {timeline.length > 0 ? (
                    <PerformanceChart
                      timeline={timeline}
                      showEngagement={showEngagement}
                    />
                  ) : (
                    <p className="rounded-xl bg-[#F8F5FC] px-4 py-10 text-center text-sm text-[#8E829F]">
                      The trend chart appears once daily data comes in.
                    </p>
                  )}
                </div>
              </div>

              <div className="relative overflow-hidden rounded-2xl bg-[#241528] p-6 text-white">
                <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-[#7C3AED]/30 blur-3xl" />
                <div className="absolute -bottom-12 -left-12 h-40 w-40 rounded-full bg-[#EC4899]/20 blur-3xl" />

                <div className="relative">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10">
                    <Zap size={22} className="text-[#D8B4FE]" />
                  </div>

                  <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-[#D8B4FE]">
                    Your AI growth coach
                  </p>

                  <h2 className="mt-2 text-2xl font-bold leading-tight">
                    Small insights.
                    <br />
                    Bigger impact.
                  </h2>

                  <p className="mt-3 text-sm leading-6 text-white/70">
                    {aiSummary ||
                      "Personalised insights will appear here when your account has enough post data."}
                  </p>

                  <div className="mt-6 space-y-4">
                    {coachTips.slice(0, 3).map((tip, index) => {
                      const TipIcon = coachIcons[index % coachIcons.length];
                      return (
                        <div
                          key={`${tip.title}-${index}`}
                          className="rounded-xl border border-white/10 bg-white/[0.06] p-4"
                        >
                          <div className="flex gap-3">
                            <TipIcon
                              size={18}
                              className="mt-0.5 shrink-0 text-[#D8B4FE]"
                            />
                            <div className="min-w-0">
                              <p className="text-sm font-semibold">
                                {tip.title}
                              </p>
                              <p className="mt-1 text-xs leading-5 text-white/60">
                                {tip.body}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {!aiActions && (
                    <p className="mt-3 text-[11px] leading-4 text-white/45">
                      General tips. AI insights weren't available this time.
                    </p>
                  )}

                  <button
                    onClick={() => load(days, { force: true })}
                    disabled={refreshing}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#241528] transition hover:bg-[#F3E8FF] disabled:opacity-70 print:hidden"
                  >
                    {refreshing ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      <Sparkles size={16} />
                    )}
                    Refresh insights
                  </button>
                </div>
              </div>
            </section>

            {/* Platform performance */}
            <section className="rounded-2xl border border-[#EDE8F0] bg-white p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold">Platform performance</h2>
                <p className="mt-1 text-xs text-[#8D8594]">
                  Compare your connected social channels
                </p>
              </div>

              {platformRows.length > 0 ? (
                <div className="mt-5 space-y-5">
                  {platformRows.map((platform) => (
                    <div
                      key={platform.key}
                      className="grid grid-cols-2 gap-3 border-b border-[#F2EEF4] pb-5 last:border-0 last:pb-0 md:grid-cols-[1.4fr_1fr_1fr_1.5fr] md:items-center"
                    >
                      <div className="col-span-2 flex items-center gap-3 md:col-span-1">
                        <div
                          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                          style={{ backgroundColor: platform.color }}
                        >
                          {platform.initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-bold">{platform.name}</p>
                          <p className="truncate text-xs text-[#98919F]">
                            {platform.posts}{" "}
                            {platform.posts === 1 ? "post" : "posts"}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[11px] text-[#98919F]">
                          Impressions
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {formatNumber(platform.impressions)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] text-[#98919F]">
                          Engagement
                        </p>
                        <p className="mt-1 text-sm font-bold">
                          {formatPercent(platform.rate)}
                        </p>
                      </div>

                      <div className="col-span-2 md:col-span-1">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-[11px] text-[#98919F]">
                            Share of impressions
                          </span>
                          <span className="text-xs font-semibold text-[#6D28D9]">
                            {formatNumber(platform.interactions)} interactions
                          </span>
                        </div>
                        <div className="h-2 overflow-hidden rounded-full bg-[#F0ECF3]">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]"
                            style={{
                              width: `${Math.max(
                                (platform.impressions / maxPlatformImpressions) *
                                  100,
                                platform.impressions > 0 ? 3 : 0
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-[#8D8594]">
                  No platform data in this period.
                </p>
              )}
            </section>

            {/* Top content */}
            <section className="rounded-2xl border border-[#EDE8F0] bg-white p-5 sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <h2 className="text-lg font-bold">Your top content</h2>
                  <p className="mt-1 text-xs text-[#8D8594]">
                    Posts with the most likes, comments and shares
                  </p>
                </div>

                {platformOptions.length > 1 && (
                  <select
                    value={platformFilter}
                    onChange={(event) => setPlatformFilter(event.target.value)}
                    aria-label="Filter by platform"
                    className="rounded-xl border border-[#EAE3EE] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#8B5CF6]"
                  >
                    <option value="all">All platforms</option>
                    {platformOptions.map((key) => (
                      <option key={key} value={key}>
                        {platformMeta(key).name}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="mt-5 space-y-3">
                {filteredPosts.map((post) => {
                  const meta = platformMeta(post.platform);
                  const postInteractions =
                    (post.likes || 0) + (post.comments || 0) + (post.shares || 0);
                  const postRate = post.impressions
                    ? (postInteractions / post.impressions) * 100
                    : 0;

                  return (
                    <div
                      key={post.id}
                      className="flex flex-col gap-4 rounded-xl border border-[#F0ECF3] p-4 transition hover:border-[#DCCAF4] sm:flex-row sm:items-center"
                    >
                      <div
                        className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                        style={{ backgroundColor: meta.color }}
                      >
                        {meta.initials}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="text-[11px] font-bold tracking-wider text-[#8B5CF6]">
                            {meta.name.toUpperCase()}
                          </span>
                          {post.postDate && (
                            <>
                              <span className="text-[11px] text-[#A19AA7]">
                                •
                              </span>
                              <span className="text-[11px] text-[#8D8594]">
                                {formatDay(String(post.postDate).slice(0, 10))}
                              </span>
                            </>
                          )}
                        </div>

                        <h3 className="line-clamp-2 text-sm font-bold leading-5">
                          {post.title || `Post on ${meta.name}`}
                        </h3>
                      </div>

                      <div className="grid grid-cols-3 gap-4 sm:gap-6">
                        <div>
                          <p className="text-[11px] text-[#98919F]">
                            Impressions
                          </p>
                          <p className="mt-1 text-sm font-bold">
                            {formatNumber(post.impressions)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#98919F]">Likes</p>
                          <p className="mt-1 text-sm font-bold">
                            {formatNumber(post.likes)}
                          </p>
                        </div>
                        <div>
                          <p className="text-[11px] text-[#98919F]">
                            Engagement
                          </p>
                          <p className="mt-1 text-sm font-bold text-emerald-600">
                            {formatPercent(postRate)}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredPosts.length === 0 && (
                  <p className="py-8 text-center text-sm text-[#8D8594]">
                    No posts available for this platform.
                  </p>
                )}
              </div>
            </section>
          </>
        )}

        {/* Footer */}
        <footer className="flex flex-col justify-between gap-2 border-t border-[#EDE8F0] py-5 text-xs text-[#98919F] sm:flex-row">
          <p>ILLIA Studio · Built for African creators.</p>
          <p>Figures come from your connected accounts.</p>
        </footer>
      </div>
    </div>
  );
}