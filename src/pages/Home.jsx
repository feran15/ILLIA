import { useMemo, useState } from "react";
import {
  Activity,
  ArrowRight,
  ArrowUpRight,
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  FileText,
  Hash,
  Image as ImageIcon,
  Lightbulb,
  MessageCircle,
  MoreHorizontal,
  PenLine,
  Plus,
  Search,
  Sparkles,
  Target,
  TrendingUp,
  Users,
  WandSparkles,
} from "lucide-react";

// NOTE: Sidebar import removed. LayOut.jsx already renders the Sidebar.

const stats = [
  {
    label: "Content created",
    value: "12",
    change: "+18%",
    note: "vs. last week",
    icon: PenLine,
    color: "violet",
  },
  {
    label: "Audience reached",
    value: "2.4k",
    change: "+12%",
    note: "across your platforms",
    icon: Users,
    color: "blue",
  },
  {
    label: "Engagement rate",
    value: "6.8%",
    change: "+8%",
    note: "average engagement",
    icon: Activity,
    color: "orange",
  },
  {
    label: "Weekly goal",
    value: "3 of 5",
    change: "60%",
    note: "2 posts remaining",
    icon: Target,
    color: "green",
  },
];

const ideas = [
  {
    category: "CONTENT IDEA",
    title: "Show the work behind the magic",
    description:
      "Take your audience behind the scenes. Share your process, little wins, and what people don't usually see.",
    tag: "Behind the scenes",
    icon: ImageIcon,
    color: "violet",
  },
  {
    category: "CAPTION STARTER",
    title: "Here's what I wish I knew earlier...",
    description:
      "Share a lesson your audience can learn from. Keep it personal, practical, and relatable.",
    tag: "Storytelling",
    icon: MessageCircle,
    color: "orange",
  },
  {
    category: "GROWTH STRATEGY",
    title: "One idea. Five pieces of content.",
    description:
      "Turn one strong idea into a Reel, carousel, story, text post, and educational tip.",
    tag: "Repurposing",
    icon: WandSparkles,
    color: "green",
  },
];

const trends = [
  {
    title: "Behind-the-scenes content",
    category: "Creator strategy",
    growth: "+32%",
    color: "violet",
  },
  {
    title: "Personal storytelling",
    category: "Content format",
    growth: "+24%",
    color: "orange",
  },
  {
    title: "Educational carousels",
    category: "Engagement",
    growth: "+18%",
    color: "green",
  },
];

const recentWork = [
  {
    title: "5 lessons I learned building my brand",
    type: "Caption",
    date: "Yesterday",
    icon: FileText,
    color: "violet",
  },
  {
    title: "A week in my creative life",
    type: "Post idea",
    date: "2 days ago",
    icon: Lightbulb,
    color: "pink",
  },
  {
    title: "Why consistency beats perfection",
    type: "Caption",
    date: "3 days ago",
    icon: PenLine,
    color: "orange",
  },
];

const upcomingPosts = [
  {
    day: "28",
    month: "OCT",
    title: "My creative process",
    platform: "Instagram",
    time: "10:30 AM",
    color: "pink",
  },
  {
    day: "29",
    month: "OCT",
    title: "Three tips for beginners",
    platform: "LinkedIn",
    time: "2:00 PM",
    color: "blue",
  },
];

const quickActions = [
  { label: "Write a caption", icon: PenLine },
  { label: "Generate ideas", icon: Lightbulb },
  { label: "Create an image", icon: ImageIcon },
  { label: "Find a trend", icon: TrendingUp },
];

const colorStyles = {
  violet: {
    icon: "bg-violet-100 text-violet-700",
    tag: "bg-violet-50 text-violet-700",
    panel: "bg-[#F2EDFF]",
    bar: "bg-violet-600",
  },
  blue: {
    icon: "bg-blue-100 text-blue-700",
    tag: "bg-blue-50 text-blue-700",
    panel: "bg-[#EEF4FF]",
    bar: "bg-blue-600",
  },
  orange: {
    icon: "bg-orange-100 text-orange-700",
    tag: "bg-orange-50 text-orange-700",
    panel: "bg-[#FFF2E9]",
    bar: "bg-orange-500",
  },
  green: {
    icon: "bg-emerald-100 text-emerald-700",
    tag: "bg-emerald-50 text-emerald-700",
    panel: "bg-[#EAF8F0]",
    bar: "bg-emerald-600",
  },
  pink: {
    icon: "bg-pink-100 text-pink-700",
    tag: "bg-pink-50 text-pink-700",
    panel: "bg-[#FFF0F5]",
    bar: "bg-pink-600",
  },
};

function Topbar({ search, setSearch }) {
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 flex h-[72px] items-center justify-between gap-3 border-b border-[#EEE9F2] bg-[#FCFBFD]/95 px-4 backdrop-blur-xl sm:px-7 xl:px-10">
      <div className="pl-12 text-[12px] text-[#9A91A5] lg:pl-0">
        Workspace <ChevronRight size={13} className="mx-1 inline" />
        <span className="font-bold text-[#392D45]">Home</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <label className="relative hidden md:block">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A69DB3]"
          />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search your workspace..."
            aria-label="Search your workspace"
            className="h-10 w-48 rounded-xl border border-[#EEE9F2] bg-white pl-10 pr-3 text-[11px] outline-none focus:border-violet-300 focus:ring-4 focus:ring-violet-50 xl:w-64"
          />
        </label>

        <div className="relative">
          <button
            type="button"
            onClick={() => setNotificationsOpen((value) => !value)}
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-[#EEE9F2] bg-white text-[#6E647C] hover:text-violet-700"
          >
            <Bell size={18} />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-white bg-fuchsia-500" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-12 z-50 w-64 rounded-2xl border border-[#EEE9F2] bg-white p-4 shadow-xl">
              <p className="text-sm font-extrabold text-[#30243C]">
                Notifications
              </p>
              <p className="mt-2 text-xs leading-5 text-[#898094]">
                You're all caught up. Connect your accounts to receive activity
                updates here.
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setProfileOpen((value) => !value)}
            aria-expanded={profileOpen}
            className="flex items-center gap-2 rounded-xl p-1.5 hover:bg-white"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-amber-200 via-pink-200 to-violet-200 text-xs font-black text-[#5D365F]">
              PA
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-xs font-extrabold text-[#33283F]">
                Creator
              </span>
              <span className="mt-0.5 block text-[10px] text-[#9C93A9]">
                Free plan
              </span>
            </span>
            <ChevronDown
              size={14}
              className="hidden text-[#9C93A9] sm:block"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 z-50 w-44 rounded-xl border border-[#EEE9F2] bg-white p-2 shadow-xl">
              <a
                href="/profile/"
                className="block rounded-lg px-3 py-2 text-xs font-semibold text-[#5F546D] hover:bg-violet-50"
              >
                Your profile
              </a>
              <a
                href="/settings/"
                className="block rounded-lg px-3 py-2 text-xs font-semibold text-[#5F546D] hover:bg-violet-50"
              >
                Settings
              </a>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

function SectionHeading({ title, subtitle, action, href = "/create/" }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div className="min-w-0">
        <h2 className="text-[15px] font-extrabold tracking-[-0.4px] text-[#2A2135]">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 text-[11px] leading-5 text-[#968DA2]">
            {subtitle}
          </p>
        )}
      </div>

      {action && (
        <a
          href={href}
          className="inline-flex shrink-0 items-center gap-1 text-[11px] font-extrabold text-violet-700 hover:gap-2"
        >
          {action} <ArrowRight size={13} />
        </a>
      )}
    </div>
  );
}

function WelcomeBanner() {
  return (
    <section className="relative isolate mb-7 overflow-hidden rounded-[28px] bg-[#241832] p-6 text-white sm:p-8 xl:p-10">
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-20 -top-32 h-80 w-80 rounded-full bg-violet-600/35 blur-[80px]" />
        <div className="absolute right-[28%] top-16 h-48 w-48 rounded-full bg-fuchsia-500/20 blur-[70px]" />
        <div className="absolute -bottom-32 left-[30%] h-56 w-56 rounded-full bg-indigo-500/20 blur-[80px]" />
      </div>

      <div className="grid items-center gap-8 lg:grid-cols-[1fr_230px]">
        <div>
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[9px] font-bold tracking-[1.3px] text-violet-100">
            <Sparkles size={13} />
            YOUR CREATIVE WORKSPACE
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          </div>

          <h1 className="max-w-2xl text-[32px] font-black leading-[1.12] tracking-[-1.5px] sm:text-[40px] xl:text-[47px]">
            Big ideas start
            <br className="hidden sm:block" /> with a little{" "}
            <span className="text-fuchsia-300">inspiration.</span>
          </h1>

          <p className="mt-4 max-w-lg text-[12px] leading-6 text-white/65 sm:text-[13px]">
            Good morning, Creator. Turn your thoughts into content your
            audience will love. Your next great post starts here.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <a
              href="/create/"
              className="inline-flex h-11 items-center gap-2 rounded-xl bg-white px-4 text-[11px] font-extrabold text-[#352443] hover:bg-violet-50"
            >
              <Sparkles size={15} className="text-violet-700" />
              Start creating <ArrowRight size={14} />
            </a>
            <a
              href="/calendar/"
              className="inline-flex h-11 items-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-4 text-[11px] font-bold text-white hover:bg-white/10"
            >
              <CalendarDays size={15} />
              Plan your content
            </a>
          </div>
        </div>

        <div className="relative hidden min-h-[205px] items-center justify-center lg:flex">
          <div className="absolute h-44 w-44 rounded-full border border-white/10" />
          <div className="absolute h-32 w-32 rounded-full border border-white/10" />

          <div className="relative flex h-[105px] w-[105px] rotate-[-8deg] items-center justify-center rounded-[30px] border border-white/20 bg-gradient-to-br from-violet-500 via-purple-600 to-fuchsia-500 shadow-2xl">
            <Sparkles size={44} strokeWidth={1.5} />
          </div>

          <div className="absolute right-0 top-5 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md">
            <p className="text-[9px] text-white/55">Keep growing</p>
            <p className="text-[11px] font-extrabold">One post at a time</p>
          </div>

          <div className="absolute bottom-4 left-0 rounded-2xl border border-white/10 bg-white/10 px-3 py-3 backdrop-blur-md">
            <p className="text-[9px] text-white/55">Your next idea</p>
            <p className="text-[11px] font-extrabold">Starts right here</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({ stat }) {
  const Icon = stat.icon;
  const colors = colorStyles[stat.color];

  return (
    <article className="rounded-[20px] border border-[#EEE9F2] bg-white p-4 transition hover:-translate-y-1 hover:shadow-lg sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`flex h-10 w-10 items-center justify-center rounded-[13px] ${colors.icon}`}
        >
          <Icon size={19} />
        </span>

        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-1 text-[9px] font-extrabold text-emerald-700">
          <ArrowUpRight size={12} />
          {stat.change}
        </span>
      </div>

      <p className="mt-5 text-[11px] font-semibold text-[#92899F]">
        {stat.label}
      </p>
      <p className="mt-1 text-[27px] font-black tracking-[-1.2px] text-[#292035]">
        {stat.value}
      </p>
      <p className="mt-1 text-[10px] text-[#A69DB1]">{stat.note}</p>
    </article>
  );
}

function Composer({ prompt, setPrompt }) {
  const [selectedAction, setSelectedAction] = useState("");

  function startCreating() {
    const cleanPrompt = prompt.trim();

    if (cleanPrompt) {
      sessionStorage.setItem("illia_home_prompt", cleanPrompt);
    } else if (selectedAction) {
      sessionStorage.setItem("illia_home_prompt", selectedAction);
    }

    window.location.href = "/create/";
  }

  return (
    <section className="rounded-[23px] border border-[#E9E1F3] bg-white p-5 sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-11 w-11 items-center justify-center rounded-[15px] bg-violet-100 text-violet-700">
          <WandSparkles size={21} />
        </span>
        <div>
          <h2 className="text-[14px] font-extrabold text-[#2A2135]">
            What are we creating today?
          </h2>
          <p className="mt-1 text-[11px] text-[#9A92A6]">
            Start with a thought. ILLIA helps you shape it.
          </p>
        </div>
      </div>

      <div className="rounded-[17px] border border-[#EAE5F0] bg-[#FCFBFE] p-2 focus-within:border-violet-300 focus-within:ring-4 focus-within:ring-violet-50">
        <textarea
          rows={3}
          value={prompt}
          onChange={(event) => {
            setPrompt(event.target.value);
            setSelectedAction("");
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter" && !event.shiftKey) {
              event.preventDefault();
              startCreating();
            }
          }}
          placeholder="e.g. Help me create a post about growing my small business in Nigeria..."
          aria-label="Describe the content you want to create"
          className="min-h-[92px] w-full resize-y bg-transparent px-3 py-3 text-[12px] leading-6 outline-none placeholder:text-[#AAA2B5]"
        />

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EEE9F2] px-2 pt-3">
          <span className="text-[10px] text-[#A39AAF]">
            Press Enter to start
          </span>

          <button
            type="button"
            onClick={startCreating}
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-500 px-4 text-[11px] font-extrabold text-white"
          >
            <Sparkles size={15} />
            Create with AI <ArrowRight size={14} />
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickActions.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => {
              setSelectedAction(label);
              setPrompt(label);
            }}
            className={`inline-flex items-center gap-2 rounded-xl border px-3 py-2.5 text-[10px] font-bold ${
              selectedAction === label
                ? "border-violet-300 bg-violet-50 text-violet-700"
                : "border-[#EEE9F2] bg-white text-[#756B84] hover:bg-violet-50"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>
    </section>
  );
}

function RecommendationCard({ item }) {
  const Icon = item.icon;
  const colors = colorStyles[item.color];

  return (
    <article className="overflow-hidden rounded-[20px] border border-[#EEE9F2] bg-white transition hover:-translate-y-1 hover:shadow-lg">
      <div
        className={`flex h-[96px] items-center justify-between px-5 ${colors.panel}`}
      >
        <span
          className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-sm ${colors.icon}`}
        >
          <Icon size={23} />
        </span>
        <span className="text-[9px] font-extrabold tracking-[1px] text-[#81748F]">
          {item.category}
        </span>
        <Sparkles size={19} className="text-[#A49AB5]" />
      </div>

      <div className="p-5">
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-extrabold ${colors.tag}`}
        >
          {item.tag}
        </span>
        <h3 className="mt-3 text-[13px] font-extrabold leading-5 text-[#30263B]">
          {item.title}
        </h3>
        <p className="mt-2 text-[11px] leading-[1.8] text-[#8F869D]">
          {item.description}
        </p>

        <a
          href="/create/"
          onClick={() => sessionStorage.setItem("illia_home_prompt", item.title)}
          className="mt-5 inline-flex items-center gap-2 text-[11px] font-extrabold text-violet-700"
        >
          Use this idea <ArrowRight size={14} />
        </a>
      </div>
    </article>
  );
}

function ProgressPanel() {
  const progress = 60;
  const circumference = 2 * Math.PI * 34;
  const offset = circumference * (1 - progress / 100);

  return (
    <section className="rounded-[22px] border border-[#EEE9F2] bg-white p-5">
      <SectionHeading
        title="Your weekly rhythm"
        subtitle="Little steps add up."
        action="View calendar"
        href="/calendar/"
      />

      <div className="flex items-center gap-4 py-3">
        <div className="relative flex h-[90px] w-[90px] shrink-0 items-center justify-center">
          <svg className="-rotate-90" viewBox="0 0 80 80">
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#F0ECF5"
              strokeWidth="7"
            />
            <circle
              cx="40"
              cy="40"
              r="34"
              fill="none"
              stroke="#8B5CF6"
              strokeWidth="7"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
            />
          </svg>
          <span className="absolute text-[19px] font-black text-[#30263B]">
            {progress}%
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-[12px] font-extrabold text-[#30263B]">
            You're building momentum
          </p>
          <p className="mt-1 text-[10px] leading-5 text-[#9A92A6]">
            Keep creating to reach your weekly content goal.
          </p>
          <span className="mt-2 inline-flex rounded-lg bg-violet-50 px-2 py-1 text-[10px] font-extrabold text-violet-700">
            3 of 5 posts
          </span>
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-[#F0ECF5] pt-4 text-[10px]">
        <span className="text-[#9A92A6]">Weekly target</span>
        <span className="font-extrabold text-[#5D526B]">2 posts to go</span>
      </div>
    </section>
  );
}

function TrendPanel() {
  return (
    <section className="rounded-[22px] border border-[#EEE9F2] bg-white p-5">
      <SectionHeading
        title="Trending in your world"
        subtitle="Inspiration for your next post"
        action="Explore trends"
        href="/trends/"
      />

      <div className="space-y-1">
        {trends.map((trend, index) => {
          const colors = colorStyles[trend.color];

          return (
            <a
              href="/trends/"
              key={trend.title}
              className="group flex items-center gap-3 rounded-xl px-2 py-3 hover:bg-[#FAF8FD]"
            >
              <span className="w-4 text-[10px] font-extrabold text-[#B2A9BE]">
                0{index + 1}
              </span>
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${colors.icon}`}
              >
                <Hash size={17} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[11px] font-extrabold text-[#3B3048]">
                  {trend.title}
                </span>
                <span className="mt-1 block text-[10px] text-[#A49BAF]">
                  {trend.category}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1 text-[10px] font-extrabold text-emerald-600">
                <ArrowUpRight size={12} /> {trend.growth}
              </span>
            </a>
          );
        })}
      </div>

      <p className="mt-3 rounded-xl bg-[#F8F5FC] px-3 py-2.5 text-[10px] leading-5 text-[#8E829F]">
        <Sparkles size={12} className="mr-1 inline text-violet-600" />
        Sample trends for the UI preview. Connect your trends service for live
        data.
      </p>
    </section>
  );
}

function UpcomingPanel() {
  return (
    <section className="rounded-[22px] border border-[#EEE9F2] bg-white p-5">
      <SectionHeading
        title="Coming up"
        subtitle="Your next planned posts"
        action="View calendar"
        href="/calendar/"
      />

      <div className="space-y-3">
        {upcomingPosts.map((post) => {
          const colors = colorStyles[post.color];

          return (
            <div
              key={post.title}
              className="flex items-center gap-3 rounded-xl border border-[#F0ECF5] p-3"
            >
              <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-xl bg-[#F7F4FB]">
                <span className="text-base font-black leading-5 text-[#392B49]">
                  {post.day}
                </span>
                <span className="text-[8px] font-extrabold tracking-wide text-[#9C91AC]">
                  {post.month}
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-[11px] font-extrabold text-[#3B3048]">
                  {post.title}
                </p>
                <p className="mt-1 flex items-center gap-1 text-[10px] text-[#9A92A6]">
                  <Clock3 size={11} /> {post.time} · {post.platform}
                </p>
              </div>

              <span
                className={`hidden rounded-lg px-2 py-1 text-[9px] font-bold sm:inline-flex ${colors.tag}`}
              >
                Planned
              </span>

              <a
                href="/calendar/"
                aria-label={`View ${post.title} in calendar`}
                className="rounded-lg p-1.5 text-[#A49BAF] hover:bg-[#F8F5FC]"
              >
                <MoreHorizontal size={17} />
              </a>
            </div>
          );
        })}
      </div>

      <a
        href="/calendar/"
        className="mt-4 flex h-10 items-center justify-center gap-2 rounded-xl border border-dashed border-[#DCD2EA] text-[11px] font-extrabold text-violet-700 hover:bg-violet-50"
      >
        <Plus size={15} /> Add to calendar
      </a>
    </section>
  );
}

function RecentWork({ search }) {
  const filtered = recentWork.filter((work) =>
    `${work.title} ${work.type}`.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="rounded-[22px] border border-[#EEE9F2] bg-white p-5 sm:p-6">
      <SectionHeading
        title="Pick up where you left off"
        subtitle="Your latest creative work"
        action="Open creator studio"
        href="/create/"
      />

      {filtered.length ? (
        <div className="divide-y divide-[#F0ECF5]">
          {filtered.map((work) => {
            const Icon = work.icon;
            const colors = colorStyles[work.color];

            return (
              <a
                href="/create/"
                onClick={() =>
                  sessionStorage.setItem("illia_home_prompt", work.title)
                }
                key={work.title}
                className="group flex items-center gap-3 py-3.5"
              >
                <span
                  className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] ${colors.icon}`}
                >
                  <Icon size={19} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[12px] font-extrabold text-[#3B3048]">
                    {work.title}
                  </span>
                  <span className="mt-1.5 block text-[10px] text-[#A49BAF]">
                    {work.type} · Edited {work.date.toLowerCase()}
                  </span>
                </span>
                <ChevronRight
                  size={16}
                  className="shrink-0 text-[#B5ADBF] group-hover:translate-x-1 group-hover:text-violet-600"
                />
              </a>
            );
          })}
        </div>
      ) : (
        <p className="py-8 text-center text-xs text-[#9A92A6]">
          No matching work found.
        </p>
      )}
    </section>
  );
}

function InsightCard() {
  return (
    <section className="rounded-[22px] border border-violet-100 bg-gradient-to-br from-[#F5F0FF] via-[#FBF5FF] to-[#FFF1F7] p-5">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-violet-700 shadow-sm">
        <Sparkles size={18} />
      </span>
      <p className="mt-4 text-[9px] font-extrabold tracking-[1.3px] text-violet-700">
        A LITTLE CREATOR INSIGHT
      </p>
      <h3 className="mt-2 text-[16px] font-black leading-6 text-[#382747]">
        Consistency beats waiting for inspiration.
      </h3>
      <p className="mt-2 text-[11px] leading-5 text-[#85758F]">
        Start with one useful idea, share it clearly, and give your audience a
        reason to come back.
      </p>
      <a
        href="/create/"
        onClick={() =>
          sessionStorage.setItem(
            "illia_home_prompt",
            "Create a post about why consistency beats waiting for inspiration."
          )
        }
        className="mt-4 inline-flex items-center gap-2 text-[11px] font-extrabold text-violet-700"
      >
        Turn this into a post <ArrowRight size={13} />
      </a>
    </section>
  );
}

export default function Home() {
  const [prompt, setPrompt] = useState("");
  const [search, setSearch] = useState("");

  const formattedDate = useMemo(
    () =>
      new Intl.DateTimeFormat("en-NG", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date()),
    []
  );

  // No <Sidebar /> and no <main> here: LayOut.jsx already provides both.
  return (
    <div className="min-h-screen bg-[#FCFBFD] text-[#292035]">
      <Topbar search={search} setSearch={setSearch} />

      <div className="mx-auto max-w-[1600px] px-4 pb-28 pt-6 sm:px-6 sm:pt-8 lg:px-8 lg:pb-10 xl:px-10">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-[10px] font-extrabold uppercase tracking-[1.5px] text-violet-700">
              Your workspace
            </p>
            <p className="mt-1 text-[11px] text-[#9A92A6]">{formattedDate}</p>
          </div>

          <a
            href="/create/"
            className="inline-flex h-9 items-center gap-2 rounded-xl border border-[#E9E1F3] bg-white px-3 text-[10px] font-bold text-[#665774] hover:text-violet-700"
          >
            <Plus size={14} /> New project
          </a>
        </div>

        <WelcomeBanner />

        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-[15px] font-extrabold text-[#2A2135]">
              Your overview
            </h2>
            <p className="mt-1 text-[11px] text-[#9A92A6]">
              A quick look at your creative progress.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 xl:grid-cols-4 xl:gap-4">
            {stats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>
        </section>

        <div className="grid items-start gap-6 2xl:grid-cols-[minmax(0,1.55fr)_minmax(340px,.85fr)]">
          <div className="min-w-0 space-y-8">
            <Composer prompt={prompt} setPrompt={setPrompt} />

            <section>
              <SectionHeading
                title="Picked for you"
                subtitle="Fresh inspiration to get your creativity moving."
                action="Explore ideas"
                href="/ideas/"
              />
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {ideas.map((item) => (
                  <RecommendationCard key={item.title} item={item} />
                ))}
              </div>
            </section>

            <RecentWork search={search} />
          </div>

          <div className="min-w-0 space-y-6">
            <ProgressPanel />
            <TrendPanel />
            <UpcomingPanel />
            <InsightCard />
          </div>
        </div>

        <footer className="mt-10 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEE9F2] pt-5 text-[10px] text-[#A49BAF]">
          <span>© {new Date().getFullYear()} ILLIA · Made for creators</span>
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            Your creative workspace
          </span>
        </footer>
      </div>
    </div>
  );
}