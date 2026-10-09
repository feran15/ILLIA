
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Image as ImageIcon,
  CalendarDays,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  Check,
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
  },
];

export default function AnalyticsShowcase() {
  const [active, setActive] = useState(0);

  const current = features[active];
  const Icon = current.icon;

  return (
    <section className="relative overflow-hidden bg-[#fbf8ff] px-5 py-24 text-[#171321] sm:px-8 lg:py-32">
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
            From your first idea to your next big post, IlliaAi
            gives you the tools to create smarter and grow consistently.
          </p>
        </div>

        {/* Main showcase */}
        <div className="grid items-start gap-16 lg:grid-cols-2 lg:gap-20">

          {/* LEFT: Scrolling feature content */}
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
                  initial={{ opacity: 0, y: 35 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -25 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
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

            {/* Progress indicator */}
            <div className="mt-8 flex gap-2">
              {features.map((feature, index) => (
                <button
                  key={feature.number}
                  onClick={() => setActive(index)}
                  aria-label={`Go to feature ${feature.number}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    active === index
                      ? "w-12 bg-gradient-to-r from-violet-600 to-pink-500"
                      : "w-5 bg-purple-200 hover:bg-purple-400"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Phone mockup */}
          <div className="relative flex items-start justify-center lg:sticky lg:top-24">
            {/* Glow behind phone */}
            <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-purple-300/40 to-pink-300/40 blur-[90px] sm:h-96 sm:w-96" />

            {/* Decorative floating card */}
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

            {/* Phone image */}
            <motion.div
              initial={{ opacity: 0, y: 35, rotate: 2 }}
              whileInView={{ opacity: 1, y: 0, rotate: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="relative z-0 w-full max-w-[340px] sm:max-w-[390px]"
            >
              <img
                src="/Analytics.png"
                alt="IlliaAi mobile analytics dashboard showing content performance"
                className="h-auto w-full object-contain drop-shadow-[0_30px_45px_rgba(91,33,182,0.18)]"
                loading="lazy"
              />
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
