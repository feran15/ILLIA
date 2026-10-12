
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  Image as ImageIcon,
  CalendarDays,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  Check,
  Bell,
  Moon,
  Clock,
  ChevronRight,
  Zap,
  MessageCircle,
} from "lucide-react";

const features = [
  {
    number: "01",
    label: "AI CONTENT ASSISTANT",
    title: "Turn your ideas into",
    highlight: "content that connects.",
    description:
      "Create engaging captions, fresh content ideas, and platform-ready posts without spending hours staring at a blank screen.",
    icon: Sparkles,
    points: [
      "Generate captions in seconds",
      "Create ideas for every platform",
      "Find your unique brand voice",
    ],
    screenTitle: "AI Assistant",
    screenSubtitle: "Your next great idea starts here.",
  },
  {
    number: "02",
    label: "AI IMAGE GENERATOR",
    title: "Bring your creative",
    highlight: "vision to life.",
    description:
      "Transform your ideas into stunning visuals that capture attention and make your brand stand out on social media.",
    icon: ImageIcon,
    points: [
      "Generate original visuals",
      "Create eye-catching content",
      "Give your ideas a visual identity",
    ],
    screenTitle: "AI Image Studio",
    screenSubtitle: "Turn your imagination into visuals.",
  },
  {
    number: "03",
    label: "CONTENT CALENDAR",
    title: "Stay consistent,",
    highlight: "without the stress.",
    description:
      "Plan your content ahead, organize upcoming posts, and build a posting routine that works for you.",
    icon: CalendarDays,
    points: [
      "Plan your content in advance",
      "Organize upcoming posts",
      "Keep your content on track",
    ],
    screenTitle: "Content Calendar",
    screenSubtitle: "Your content, perfectly planned.",
  },
  {
    number: "04",
    label: "CONTENT ANALYTICS",
    title: "Understand what",
    highlight: "actually works.",
    description:
      "Track your content activity, understand your publishing habits, and make smarter decisions about your content strategy.",
    icon: TrendingUp,
    points: [
      "Monitor your posting activity",
      "See your connected platforms",
      "Make data-informed decisions",
    ],
    screenTitle: "Analytics",
    screenSubtitle: "How your content is performing.",
  },
];

const slideTransition = {
  duration: 0.4,
  ease: "easeOut",
};

function MiniStat({ icon: Icon, value, label }) {
  return (
    <div className="min-w-0 rounded-xl border border-gray-200/90 bg-white p-2.5 sm:p-3">
      <span className="mb-2 flex h-7 w-7 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
        <Icon size={15} />
      </span>
      <p className="text-lg font-extrabold text-gray-900">{value}</p>
      <p className="text-[9px] leading-4 text-gray-500 sm:text-[10px]">
        {label}
      </p>
    </div>
  );
}

function AnalyticsScreen() {
  const bars = [35, 55, 42, 78, 58, 92, 72];

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-2">
        <MiniStat icon={CalendarDays} value="12" label="Posts in range" />
        <MiniStat icon={Clock} value="08" label="Upcoming posts" />
        <MiniStat icon={TrendingUp} value="04" label="Connected platforms" />
        <MiniStat icon={Zap} value="86%" label="Posting consistency" />
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <div className="flex items-center justify-between gap-2">
          <p className="text-[11px] font-bold text-gray-900">
            Posting activity
          </p>
          <span className="text-[9px] text-gray-400">Last 7 days</span>
        </div>

        <div className="mt-4 flex h-24 items-end justify-around gap-2">
          {bars.map((height, index) => (
            <motion.div
              key={index}
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ duration: 0.6, delay: index * 0.06 }}
              className="w-full max-w-6 rounded-t-md bg-gradient-to-t from-violet-600 to-pink-400"
            />
          ))}
        </div>

        <div className="mt-2 flex justify-around text-[9px] text-gray-400">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <span key={index}>{day}</span>
          ))}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <p className="text-[11px] font-bold text-gray-900">
          Content by platform
        </p>

        <div className="mt-3 flex items-center gap-3">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-[7px] border-purple-500 border-r-pink-400">
            <span className="text-[9px] font-bold text-gray-700">72%</span>
          </div>
          <div className="min-w-0 flex-1 space-y-2">
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-600">Instagram</span>
              <span className="font-semibold text-gray-800">72%</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-600">TikTok</span>
              <span className="font-semibold text-gray-800">48%</span>
            </div>
            <div className="flex items-center justify-between text-[10px]">
              <span className="text-gray-600">LinkedIn</span>
              <span className="font-semibold text-gray-800">35%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AssistantScreen() {
  return (
    <div className="space-y-3">
      <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-pink-500 p-4 text-white">
        <Sparkles size={22} />
        <p className="mt-4 text-lg font-extrabold leading-tight">
          What are we creating today?
        </p>
        <p className="mt-2 text-[11px] leading-5 text-white/80">
          Your personal AI creative partner is ready to help.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <p className="text-[11px] font-bold text-gray-900">
          Suggested for you
        </p>

        {[
          "Create an Instagram caption",
          "Generate viral post ideas",
          "Build a content strategy",
        ].map((item, index) => (
          <div
            key={item}
            className="mt-2 flex items-center gap-2 rounded-lg bg-purple-50/70 p-3"
          >
            <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white text-purple-600">
              {index === 0 ? (
                <MessageCircle size={14} />
              ) : index === 1 ? (
                <Zap size={14} />
              ) : (
                <TrendingUp size={14} />
              )}
            </span>
            <span className="min-w-0 flex-1 text-[10px] font-medium text-gray-700">
              {item}
            </span>
            <ChevronRight size={14} className="text-purple-500" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <p className="text-[10px] text-gray-400">Your creative workspace</p>
        <div className="mt-2 flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-pink-500 text-white">
            <Sparkles size={15} />
          </span>
          <p className="text-[10px] leading-4 text-gray-600">
            Fresh ideas. Better captions. More consistent content.
          </p>
        </div>
      </div>
    </div>
  );
}

function ImageGeneratorScreen() {
  return (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-2xl bg-gradient-to-br from-violet-600 via-purple-500 to-pink-400 p-4 text-white">
        <ImageIcon size={22} />
        <p className="mt-4 text-lg font-extrabold">Imagine it. Create it.</p>
        <p className="mt-2 text-[11px] leading-5 text-white/85">
          Turn a simple prompt into a visual concept for your next post.
        </p>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <p className="text-[11px] font-bold text-gray-900">
          Your creative canvas
        </p>

        <div className="relative mt-3 grid aspect-[4/3] grid-cols-2 gap-2 overflow-hidden rounded-xl bg-purple-50 p-2">
          <div className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-pink-300 via-purple-300 to-violet-600 p-2 text-center">
            <Sparkles size={22} className="text-white" />
            <span className="mt-2 text-[10px] font-bold text-white">
              Your ideas
            </span>
          </div>
          <div className="flex flex-col items-center justify-center rounded-lg bg-gradient-to-br from-orange-200 via-pink-300 to-purple-500 p-2 text-center">
            <ImageIcon size={22} className="text-white" />
            <span className="mt-2 text-[10px] font-bold text-white">
              Your vision
            </span>
          </div>
          <div className="absolute bottom-3 left-1/2 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-xl border-2 border-white bg-purple-600 text-white shadow-lg">
            <Sparkles size={17} />
          </div>
        </div>

        <p className="mt-3 text-[10px] leading-5 text-gray-500">
          Create visuals that match your content and brand identity.
        </p>
      </div>

      <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-white p-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
          <Zap size={16} />
        </span>
        <div>
          <p className="text-[10px] font-bold text-gray-800">
            Ready for your next post?
          </p>
          <p className="text-[9px] text-gray-500">
            Your creativity has no limits.
          </p>
        </div>
      </div>
    </div>
  );
}

function CalendarScreen() {
  const days = Array.from({ length: 35 }, (_, index) => index - 2);
  const scheduled = [5, 9, 12, 16, 20, 23, 27, 30];

  return (
    <div className="space-y-3">
      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-extrabold text-gray-900">
              October 2026
            </p>
            <p className="mt-1 text-[9px] text-gray-400">
              Plan your next move
            </p>
          </div>
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100 text-purple-600">
            <CalendarDays size={19} />
          </span>
        </div>

        <div className="mt-4 grid grid-cols-7 gap-1 text-center">
          {["M", "T", "W", "T", "F", "S", "S"].map((day, index) => (
            <span
              key={`${day}-${index}`}
              className="py-1 text-[9px] font-semibold text-gray-400"
            >
              {day}
            </span>
          ))}

          {days.map((day, index) => {
            const valid = day >= 1 && day <= 31;
            const selected = day === 12;
            const hasPost = scheduled.includes(day);

            return (
              <div
                key={index}
                className={`relative flex h-8 items-center justify-center rounded-lg text-[10px] ${
                  selected
                    ? "bg-purple-600 font-bold text-white"
                    : valid
                      ? "text-gray-700"
                      : "text-transparent"
                }`}
              >
                {valid ? day : ""}
                {valid && hasPost && !selected && (
                  <span className="absolute bottom-1 h-1 w-1 rounded-full bg-pink-500" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="rounded-xl border border-gray-200 bg-white p-3">
        <p className="text-[11px] font-bold text-gray-900">
          Upcoming posts
        </p>

        {[
          ["09:00 AM", "Instagram post", "Published"],
          ["02:30 PM", "TikTok video", "Upcoming"],
          ["06:00 PM", "LinkedIn update", "Upcoming"],
        ].map(([time, title, status]) => (
          <div
            key={title}
            className="mt-3 flex items-center gap-2 border-b border-gray-100 pb-3 last:border-0 last:pb-0"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-purple-50 text-purple-600">
              <Clock size={15} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold text-gray-800">
                {title}
              </p>
              <p className="mt-1 text-[9px] text-gray-400">{time}</p>
            </div>
            <span
              className={`text-[9px] ${
                status === "Published" ? "text-green-600" : "text-purple-600"
              }`}
            >
              {status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function PhoneScreen({ active, setActive }) {
  const current = features[active];
  const ScreenIcon = current.icon;

  return (
    <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[370px]">
      {/* Phone frame */}
      <div className="rounded-[3.2rem] border-[5px] border-[#17151c] bg-[#111015] p-[7px] shadow-[0_30px_80px_rgba(91,33,182,0.22)]">
        <div className="relative overflow-hidden rounded-[2.65rem] bg-[#faf9ff]">
          {/* Phone status bar */}
          <div className="relative flex h-11 items-center justify-between px-6 pt-1 text-[10px] font-bold text-gray-900">
            <span>9:41</span>
            <span className="absolute left-1/2 top-2 h-6 w-[76px] -translate-x-1/2 rounded-full bg-black" />
            <span className="text-[9px]">●  Wi-Fi  ▰</span>
          </div>

          {/* IlliaAi app header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 text-white">
                <Sparkles size={17} />
              </span>
              <span className="text-sm font-black tracking-tight text-gray-900">
                ILLIA
              </span>
            </div>

            <div className="flex items-center gap-3 text-gray-500">
              <Bell size={16} />
              <Moon size={16} />
            </div>
          </div>

          {/* Dynamic screen title */}
          <div className="px-4 pb-2 pt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={`title-${active}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={slideTransition}
              >
                <div className="flex items-center gap-2">
                  <h4 className="text-xl font-extrabold tracking-tight text-gray-900">
                    {current.screenTitle}
                  </h4>
                  <ScreenIcon size={18} className="text-purple-600" />
                </div>
                <p className="mt-1 min-h-8 text-[10px] leading-5 text-gray-500">
                  {current.screenSubtitle}
                </p>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* The actual carousel content */}
          <div className="relative min-h-[430px] overflow-hidden px-3 pb-3 sm:min-h-[455px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`screen-${active}`}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={slideTransition}
              >
                {active === 0 && <AssistantScreen />}
                {active === 1 && <ImageGeneratorScreen />}
                {active === 2 && <CalendarScreen />}
                {active === 3 && <AnalyticsScreen />}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Interactive carousel navigation */}
          <div className="border-t border-gray-200 bg-white px-4 py-3">
            <div className="flex items-center justify-center gap-2">
              {features.map((feature, index) => (
                <button
                  key={feature.number}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Show ${feature.label}`}
                  aria-pressed={active === index}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    active === index
                      ? "w-7 bg-gradient-to-r from-violet-600 to-pink-500"
                      : "w-2 bg-gray-300 hover:bg-purple-300"
                  }`}
                />
              ))}
            </div>
            <p className="mt-2 text-center text-[9px] text-gray-400">
              Your creative studio, all in one place
            </p>
          </div>
        </div>
      </div>

      {/* Side buttons */}
      <div className="absolute -left-[3px] top-28 h-12 w-[4px] rounded-l bg-gray-600" />
      <div className="absolute -left-[3px] top-44 h-16 w-[4px] rounded-l bg-gray-600" />
      <div className="absolute -right-[3px] top-36 h-20 w-[4px] rounded-r bg-gray-600" />

      {/* Phone glow */}
      <div className="pointer-events-none absolute -inset-8 -z-10 rounded-full bg-gradient-to-br from-purple-300/40 to-pink-300/40 blur-3xl" />
    </div>
  );
}

export default function AnalyticsShowcase() {
  const [active, setActive] = useState(0);

  const current = features[active];

  // Automatically advance through the features.
  // Clicking a feature immediately changes both the text and phone.
  useEffect(() => {
    const interval = window.setInterval(() => {
      setActive((previous) => (previous + 1) % features.length);
    }, 6000);

    return () => window.clearInterval(interval);
  }, []);

  return (
    <section
      id="features"
      className="relative overflow-hidden bg-[#fbf8ff] px-5 py-24 text-[#171321] sm:px-8 lg:py-32"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute left-[-140px] top-40 h-80 w-80 rounded-full bg-purple-300/20 blur-[100px]" />
      <div className="pointer-events-none absolute right-[-100px] top-20 h-96 w-96 rounded-full bg-pink-300/20 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto mb-20 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white px-4 py-2 text-xs font-bold tracking-[0.16em] text-purple-700 shadow-sm">
            <Sparkles size={14} />
            YOUR CREATIVE STUDIO
          </span>

          <h2 className="mt-6 text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Everything you need.
            <br />
            <span className="bg-gradient-to-r from-violet-600 via-purple-600 to-pink-500 bg-clip-text text-transparent">
              All in one place.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-base leading-7 text-gray-600 sm:text-lg">
            From your first idea to your next big post, IlliaAi gives you
            the tools to create smarter and grow consistently.
          </p>
        </div>

        {/* Main showcase */}
        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-20">
          {/* LEFT: Feature content */}
          <div className="relative">
            <div className="mb-10">
              <p className="text-sm font-semibold text-gray-500">
                A smarter way to create
              </p>
              <h3 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                Meet your new creative workflow.
              </h3>
            </div>

            {/* Feature navigation */}
            <div className="mb-10 grid grid-cols-4 gap-2">
              {features.map((feature, index) => {
                const FeatureIcon = feature.icon;
                const selected = active === index;

                return (
                  <button
                    key={feature.number}
                    type="button"
                    onClick={() => setActive(index)}
                    aria-label={`Show ${feature.label}`}
                    aria-pressed={selected}
                    className={`group flex flex-col items-center gap-2 rounded-2xl border p-3 transition-all duration-300 ${
                      selected
                        ? "border-purple-300 bg-white shadow-lg shadow-purple-100"
                        : "border-transparent bg-white/50 hover:border-purple-100 hover:bg-white"
                    }`}
                  >
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl transition-colors ${
                        selected
                          ? "bg-gradient-to-br from-violet-600 to-pink-500 text-white"
                          : "bg-purple-50 text-gray-500 group-hover:text-purple-600"
                      }`}
                    >
                      <FeatureIcon size={19} />
                    </span>
                    <span className="text-[10px] font-bold text-gray-500 sm:text-xs">
                      {feature.number}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Animated feature text */}
            <div className="relative min-h-[390px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.number}
                  initial={{ opacity: 0, y: 25 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={slideTransition}
                >
                  <p className="mb-5 text-xs font-extrabold tracking-[0.2em] text-purple-600">
                    {current.number} / {current.label}
                  </p>

                  <h3 className="max-w-xl text-4xl font-black leading-[1.12] tracking-tight sm:text-5xl">
                    {current.title}
                    <span className="mt-2 block bg-gradient-to-r from-violet-600 to-pink-500 bg-clip-text text-transparent">
                      {current.highlight}
                    </span>
                  </h3>

                  <p className="mt-6 max-w-lg text-base leading-8 text-gray-600 sm:text-lg">
                    {current.description}
                  </p>

                  <div className="mt-7 space-y-3">
                    {current.points.map((point) => (
                      <div
                        key={point}
                        className="flex items-center gap-3 text-sm font-medium text-gray-700 sm:text-base"
                      >
                        <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-700">
                          <Check size={14} strokeWidth={3} />
                        </span>
                        {point}
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      window.location.href = "/register";
                    }}
                    className="mt-9 inline-flex items-center gap-3 rounded-full bg-[#171321] px-6 py-4 text-sm font-bold text-white shadow-lg shadow-purple-200 transition-all duration-300 hover:-translate-y-1 hover:bg-purple-700"
                  >
                    Start creating free
                    <ArrowUpRight size={18} />
                  </button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Feature progress indicators */}
            <div className="mt-8 flex gap-2">
              {features.map((feature, index) => (
                <button
                  key={feature.number}
                  type="button"
                  onClick={() => setActive(index)}
                  aria-label={`Go to feature ${feature.number}`}
                  aria-pressed={active === index}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active === index
                      ? "w-12 bg-gradient-to-r from-violet-600 to-pink-500"
                      : "w-5 bg-purple-200 hover:bg-purple-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Interactive phone carousel */}
          <div className="relative flex items-start justify-center lg:sticky lg:top-24">
            {/* Floating workspace card */}
            <motion.div
              animate={{ y: [0, -9, 0] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -left-1 top-24 z-10 hidden rounded-2xl border border-white/80 bg-white/90 p-4 shadow-xl shadow-purple-200/40 backdrop-blur-md sm:block lg:-left-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-100 text-purple-700">
                  <BarChart3 size={20} />
                </span>
                <div>
                  <p className="text-xs text-gray-500">Your workspace</p>
                  <p className="text-sm font-extrabold">All in one place</p>
                </div>
              </div>
            </motion.div>

            {/* Phone with changing screen */}
            <motion.div
              initial={{ opacity: 0, y: 35, rotate: 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-0 w-full max-w-[340px] sm:max-w-[390px]"
            >
              <PhoneScreen active={active} setActive={setActive} />
            </motion.div>

            {/* Floating status card */}
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 3.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -right-1 bottom-24 z-10 hidden rounded-2xl border border-white bg-white/95 p-4 shadow-xl shadow-purple-200/40 backdrop-blur-md sm:block lg:-right-5"
            >
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-pink-500 text-white">
                  <Sparkles size={19} />
                </span>
                <div>
                  <p className="text-xs text-gray-500">Your next idea</p>
                  <p className="text-sm font-extrabold">Starts with Illia</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
