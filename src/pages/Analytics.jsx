
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  ChevronDown,
  Eye,
//   Instagram,
  Lightbulb,
  MessageCircle,
  MoreHorizontal,
  MousePointer2,
  Play,
  Share2,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react";

const performanceData = {
  "7 days": {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    reach: [32, 45, 38, 64, 52, 78, 91],
    engagement: [18, 28, 22, 39, 32, 49, 58],
  },
  "30 days": {
    labels: ["Oct 5", "Oct 10", "Oct 15", "Oct 20", "Oct 25", "Oct 30"],
    reach: [35, 48, 42, 68, 59, 88],
    engagement: [20, 31, 25, 43, 37, 56],
  },
  "90 days": {
    labels: ["Aug", "Mid Aug", "Sep", "Mid Sep", "Oct", "Nov"],
    reach: [24, 37, 33, 53, 69, 91],
    engagement: [13, 23, 20, 34, 43, 58],
  },
};

const platforms = [
  {
    name: "Instagram",
    handle: "@yourcreatorpage",
    color: "#E4405F",
    initials: "IG",
    reach: "24.8K",
    engagement: "6.8%",
    growth: "+18.4%",
    width: "82%",
  },
  {
    name: "TikTok",
    handle: "@yourtiktok",
    color: "#252525",
    initials: "TK",
    reach: "18.2K",
    engagement: "8.2%",
    growth: "+24.6%",
    width: "66%",
  },
  {
    name: "Facebook",
    handle: "Your Facebook page",
    color: "#1877F2",
    initials: "FB",
    reach: "12.6K",
    engagement: "4.1%",
    growth: "+12.3%",
    width: "48%",
  },
  {
    name: "LinkedIn",
    handle: "Your LinkedIn profile",
    color: "#0A66C2",
    initials: "in",
    reach: "8.4K",
    engagement: "5.3%",
    growth: "+9.7%",
    width: "34%",
  },
];

const topPosts = [
  {
    type: "REEL",
    title: "Things I wish I knew before becoming a creator",
    platform: "Instagram",
    reach: "12,840",
    likes: "1,248",
    engagement: "9.7%",
    icon: Play,
    color: "#FCE7EF",
  },
  {
    type: "VIDEO",
    title: "A day in my life as a Nigerian creator",
    platform: "TikTok",
    reach: "9,620",
    likes: "864",
    engagement: "8.9%",
    icon: Play,
    color: "#EDE9FE",
  },
  {
    type: "CAROUSEL",
    title: "5 content ideas you can start today",
    platform: "Instagram",
    reach: "6,480",
    likes: "516",
    engagement: "7.4%",
    icon: BarChart3,
    color: "#FEF3C7",
  },
];

function MetricCard({
  title,
  value,
  change,
  description,
  icon: Icon,
  accent,
  negative = false,
}) {
  return (
    <div className="rounded-2xl border border-[#EDE8F0] bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-[#77717F]">{title}</p>
          <h3 className="mt-3 text-2xl font-bold tracking-tight text-[#241528] sm:text-3xl">
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

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold ${
            negative
              ? "bg-red-50 text-red-600"
              : "bg-emerald-50 text-emerald-700"
          }`}
        >
          {negative ? (
            <ArrowDownRight size={13} />
          ) : (
            <ArrowUpRight size={13} />
          )}
          {change}
        </span>
        <span className="text-xs text-[#98919F]">{description}</span>
      </div>
    </div>
  );
}

function PerformanceChart({ data, showEngagement }) {
  const width = 700;
  const height = 250;
  const left = 8;
  const right = 8;
  const top = 16;
  const bottom = 26;
  const plotWidth = width - left - right;
  const plotHeight = height - top - bottom;

  const makePoints = (values) =>
    values
      .map((value, index) => {
        const x =
          left + (index / Math.max(values.length - 1, 1)) * plotWidth;
        const y = top + plotHeight - (value / 100) * plotHeight;
        return `${x},${y}`;
      })
      .join(" ");

  const reachPoints = makePoints(data.reach);
  const engagementPoints = makePoints(data.engagement);
  const firstX = left;
  const lastX = width - right;
  const bottomY = height - bottom;

  const areaPath = `M ${reachPoints
    .split(" ")
    .join(" L ")} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;

  return (
    <div className="w-full">
      <div className="flex flex-wrap items-center gap-5 text-xs text-[#77717F]">
        <span className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[#8B5CF6]" />
          Reach
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
          aria-label="Illustrative reach and engagement trend chart"
        >
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

          <path d={areaPath} fill="url(#reachGradient)" />

          <defs>
            <linearGradient id="reachGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#8B5CF6" stopOpacity=".22" />
              <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0" />
            </linearGradient>
          </defs>

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

          {data.labels.map((label, index) => {
            const x =
              left + (index / Math.max(data.labels.length - 1, 1)) * plotWidth;

            return (
              <text
                key={label}
                x={x}
                y={height - 5}
                textAnchor="middle"
                fontSize="11"
                fill="#99919F"
              >
                {label}
              </text>
            );
          })}
        </svg>
      </div>

      <p className="mt-2 text-[11px] text-[#A19AA7]">
        Illustrative index, not actual platform impressions.
      </p>
    </div>
  );
}

export default function Analytics() {
  const [period, setPeriod] = useState("30 days");
  const [showEngagement, setShowEngagement] = useState(true);
  const [platformFilter, setPlatformFilter] = useState("All platforms");

  const chartData = useMemo(() => performanceData[period], [period]);

  const filteredPosts = topPosts.filter(
    (post) =>
      platformFilter === "All platforms" ||
      post.platform === platformFilter
  );

  return (
    <main className="min-h-screen bg-[#FBF9FC] px-4 py-6 text-[#241528] sm:px-6 lg:px-8">
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
            className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-[#E7DFEC] bg-white px-4 py-3 text-sm font-semibold transition hover:bg-[#F6F0FA] sm:self-auto"
          >
            <BarChart3 size={17} />
            Export report
          </button>
        </header>

        {/* Sample data notice */}
        <div className="flex items-start gap-3 rounded-xl border border-violet-100 bg-violet-50/70 p-4">
          <Sparkles className="mt-0.5 shrink-0 text-violet-600" size={18} />
          <div>
            <p className="text-sm font-semibold text-violet-950">
              Your creator overview
            </p>
            <p className="mt-1 text-xs leading-5 text-violet-800">
              Demo figures below are illustrative. Connect your social
              accounts and analytics API to show your real performance data.
            </p>
          </div>
        </div>

        {/* Date filter */}
        <section className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-lg font-bold">Performance overview</h2>
            <p className="mt-1 text-xs text-[#8D8594]">
              A snapshot of your creator activity
            </p>
          </div>

          <div className="flex w-full gap-1 rounded-xl border border-[#EAE3EE] bg-white p-1 sm:w-auto">
            {["7 days", "30 days", "90 days"].map((item) => (
              <button
                key={item}
                onClick={() => setPeriod(item)}
                className={`flex-1 rounded-lg px-3 py-2 text-xs font-semibold transition sm:flex-none ${
                  period === item
                    ? "bg-[#241528] text-white shadow-sm"
                    : "text-[#77717F] hover:bg-[#F7F3F9]"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        {/* Metrics */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard
            title="Total reach"
            value="64.2K"
            change="+18.6%"
            description="vs. previous period"
            icon={Eye}
            accent="#F0E8FF"
          />
          <MetricCard
            title="Engagement rate"
            value="6.84%"
            change="+1.2%"
            description="vs. previous period"
            icon={HeartIcon}
            accent="#FCE7F3"
          />
          <MetricCard
            title="New followers"
            value="+1,284"
            change="+12.8%"
            description="vs. previous period"
            icon={Users}
            accent="#E6F7EF"
          />
          <MetricCard
            title="Total interactions"
            value="8,492"
            change="+22.4%"
            description="vs. previous period"
            icon={MousePointer2}
            accent="#FFF1DB"
          />
        </section>

        {/* Main chart + publishing card */}
        <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
          <div className="rounded-2xl border border-[#EDE8F0] bg-white p-5 sm:p-6 xl:col-span-2">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">Reach & engagement</h2>
                <p className="mt-1 text-xs text-[#8D8594]">
                  How your content is trending over time
                </p>
              </div>

              <button
                onClick={() => setShowEngagement((current) => !current)}
                className="rounded-lg border border-[#ECE5F0] px-3 py-2 text-xs font-medium text-[#62596B] hover:bg-[#FAF7FC]"
              >
                {showEngagement ? "Hide engagement" : "Show engagement"}
              </button>
            </div>

            <div className="mt-6">
              <PerformanceChart
                data={chartData}
                showEngagement={showEngagement}
              />
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#F0ECF3] pt-5">
              <div>
                <p className="text-xs text-[#8D8594]">Best performing day</p>
                <p className="mt-1 text-sm font-bold">Saturday</p>
              </div>
              <div>
                <p className="text-xs text-[#8D8594]">Growth direction</p>
                <p className="mt-1 flex items-center gap-1 text-sm font-bold text-emerald-600">
                  <TrendingUp size={15} />
                  Trending upward
                </p>
              </div>
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

              <p className="mt-3 text-sm leading-6 text-white/65">
                Turn your content performance into a smarter publishing
                strategy with recommendations tailored to your audience.
              </p>

              <div className="mt-6 space-y-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex gap-3">
                    <CalendarDays
                      size={18}
                      className="mt-0.5 shrink-0 text-[#D8B4FE]"
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        Build a consistent schedule
                      </p>
                      <p className="mt-1 text-xs leading-5 text-white/60">
                        Test a regular posting schedule and compare results.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex gap-3">
                    <MessageCircle
                      size={18}
                      className="mt-0.5 shrink-0 text-[#F9A8D4]"
                    />
                    <div>
                      <p className="text-sm font-semibold">
                        Create conversation starters
                      </p>
                      <p className="mt-1 text-xs leading-5 text-white/60">
                        Test relevant questions that encourage genuine
                        comments and replies.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <button
                onClick={() =>
                  window.dispatchEvent(
                    new CustomEvent("illia:analytics-insights")
                  )
                }
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-[#241528] transition hover:bg-[#F3E8FF]"
              >
                <Sparkles size={16} />
                Explore AI insights
              </button>

              <p className="mt-3 text-center text-[10px] leading-4 text-white/40">
                Demo recommendations until real analytics are connected.
              </p>
            </div>
          </div>
        </section>

        {/* Platform performance */}
        <section className="rounded-2xl border border-[#EDE8F0] bg-white p-5 sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold">Platform performance</h2>
              <p className="mt-1 text-xs text-[#8D8594]">
                Compare your connected social channels
              </p>
            </div>

            <button className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-[#62596B] hover:bg-[#F7F3F9]">
              All platforms <ChevronDown size={14} />
            </button>
          </div>

          <div className="mt-5 space-y-5">
            {platforms.map((platform) => (
              <div
                key={platform.name}
                className="grid grid-cols-1 gap-3 border-b border-[#F2EEF4] pb-5 last:border-0 last:pb-0 md:grid-cols-[1.4fr_1fr_1fr_1.5fr] md:items-center"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white"
                    style={{ backgroundColor: platform.color }}
                  >
                    {platform.initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold">{platform.name}</p>
                    <p className="truncate text-xs text-[#98919F]">
                      {platform.handle}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-[11px] text-[#98919F]">Reach</p>
                  <p className="mt-1 text-sm font-bold">{platform.reach}</p>
                </div>

                <div>
                  <p className="text-[11px] text-[#98919F]">Engagement</p>
                  <p className="mt-1 text-sm font-bold">
                    {platform.engagement}
                  </p>
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="text-[11px] text-[#98919F]">
                      Reach distribution
                    </span>
                    <span className="text-xs font-semibold text-emerald-600">
                      {platform.growth}
                    </span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[#F0ECF3]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#8B5CF6] to-[#EC4899]"
                      style={{ width: platform.width }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-5 text-[11px] text-[#A19AA7]">
            Platform figures are sample values, not connected account data.
          </p>
        </section>

        {/* Top content */}
        <section className="rounded-2xl border border-[#EDE8F0] bg-white p-5 sm:p-6">
          <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-lg font-bold">Your top content</h2>
              <p className="mt-1 text-xs text-[#8D8594]">
                Posts with the strongest illustrative engagement
              </p>
            </div>

            <select
              value={platformFilter}
              onChange={(event) => setPlatformFilter(event.target.value)}
              className="rounded-xl border border-[#EAE3EE] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#8B5CF6]"
            >
              <option>All platforms</option>
              <option>Instagram</option>
              <option>TikTok</option>
            </select>
          </div>

          <div className="mt-5 space-y-3">
            {filteredPosts.map((post, index) => {
              const PostIcon = post.icon;

              return (
                <div
                  key={post.title}
                  className="flex flex-col gap-4 rounded-xl border border-[#F0ECF3] p-4 transition hover:border-[#DCCAF4] sm:flex-row sm:items-center"
                >
                  <div
                    className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: post.color }}
                  >
                    <PostIcon size={23} className="text-[#6D28D9]" />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="mb-1 flex flex-wrap items-center gap-2">
                      <span className="text-[10px] font-bold tracking-wider text-[#8B5CF6]">
                        {post.type}
                      </span>
                      <span className="text-[10px] text-[#A19AA7]">•</span>
                      <span className="text-[10px] text-[#8D8594]">
                        {post.platform}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold leading-5">
                      {post.title}
                    </h3>
                  </div>

                  <div className="grid grid-cols-3 gap-4 sm:gap-6">
                    <div>
                      <p className="text-[10px] text-[#98919F]">Reach</p>
                      <p className="mt-1 text-sm font-bold">{post.reach}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#98919F]">Likes</p>
                      <p className="mt-1 text-sm font-bold">{post.likes}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-[#98919F]">Engagement</p>
                      <p className="mt-1 text-sm font-bold text-emerald-600">
                        {post.engagement}
                      </p>
                    </div>
                  </div>

                  <button
                    aria-label={`More information about ${post.title}`}
                    className="hidden rounded-lg p-2 text-[#98919F] hover:bg-[#F7F3F9] sm:block"
                  >
                    <MoreHorizontal size={19} />
                  </button>
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

        {/* Footer */}
        <footer className="flex flex-col justify-between gap-2 border-t border-[#EDE8F0] py-5 text-xs text-[#98919F] sm:flex-row">
          <p>ILLIA Studio · Built for African creators.</p>
          <p>Demo analytics · Connect accounts to enable live reporting.</p>
        </footer>
      </div>
    </main>
  );
}

function HeartIcon(props) {
  return <Activity {...props} />;
}
