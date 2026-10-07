
import React from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Image,
  CalendarDays,
  TrendingUp,
  ArrowUpRight,
} from "lucide-react";

const features = [
  {
    id: 1,
    title: "AI Content Assistant",
    description:
      "Create captions, hooks and post ideas designed for your audience in seconds.",
    icon: Sparkles,
    type: "content",
  },
  {
    id: 2,
    title: "AI Image Studio",
    description:
      "Generate stunning visuals for your content without needing a designer.",
    icon: Image,
    type: "image",
  },
  {
    id: 3,
    title: "Content Calendar",
    description:
      "Plan, organize and keep your content schedule consistent from one place.",
    icon: CalendarDays,
    type: "calendar",
  },
  {
    id: 4,
    title: "Trend Intelligence",
    description:
      "Discover what's trending and turn those trends into content opportunities.",
    icon: TrendingUp,
    type: "trends",
  },
];

/* ----------------------------------------
   FEATURE VISUALS
----------------------------------------- */

const FeatureVisual = ({ type }) => {
  /* CONTENT */
  if (type === "content") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#11100b]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/[0.08] via-transparent to-transparent" />

        <div className="absolute left-6 right-6 top-8 rounded-2xl border border-white/[0.08] bg-white/[0.04] p-5 backdrop-blur-sm">
          <div className="mb-5 flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-400/10">
              <Sparkles size={14} className="text-orange-300" />
            </div>

            <span className="text-xs text-white/40">
              Illia AI Assistant
            </span>
          </div>

          <p className="mb-2 text-xs text-white/30">
            Create a caption for:
          </p>

          <p className="text-sm leading-6 text-white/80">
            "New collection dropping this weekend..."
          </p>
        </div>

        {/* <div className="absolute bottom-12 left-6 right-6 rounded-2xl border border-white/[0.08] bg-white/[0.05] p-5 backdrop-blur-sm">
          <div className="mb-3 flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-orange-400" />

            <span className="text-[10px] uppercase tracking-wider text-white/30">
              Generated caption
            </span>
          </div>

          <p className="text-sm leading-6 text-white/70">
            Fresh looks. New energy. Your next favorite fit is almost
            here. ✨
          </p>
        </div> */}
      </div>
    );
  }

  /* IMAGE */
  if (type === "image") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#11100b]">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-purple-500/20" />

        <motion.div
          animate={{ y: [0, -8, 0], rotate: [-6, -4, -6] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute left-[22%] top-[15%] h-64 w-44 rounded-3xl border border-white/10 bg-white/[0.06] p-2 shadow-2xl backdrop-blur"
        >
          <div className="h-full rounded-2xl bg-gradient-to-br from-orange-300/40 via-red-500/20 to-purple-500/40" />

          <div className="absolute bottom-5 left-5 right-5 h-16 rounded-xl bg-black/20 backdrop-blur-md" />
        </motion.div>

        <motion.div
          animate={{ y: [0, 8, 0], rotate: [8, 6, 8] }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 0.5,
          }}
          className="absolute left-[42%] top-[20%] h-64 w-44 rounded-3xl border border-white/10 bg-white/[0.06] p-2 shadow-2xl backdrop-blur"
        >
          <div className="h-full rounded-2xl bg-gradient-to-br from-yellow-200/30 via-orange-500/20 to-pink-500/40" />

          <div className="absolute bottom-5 left-5 right-5 h-16 rounded-xl bg-black/20 backdrop-blur-md" />
        </motion.div>

        <div className="absolute bottom-7 left-7 rounded-full border border-white/10 bg-black/40 px-4 py-2 text-xs text-white/70 backdrop-blur-md">
          ✦ AI Generated
        </div>
      </div>
    );
  }

  /* CALENDAR */
  if (type === "calendar") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#11100b] p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.06] via-transparent to-transparent" />

        <div className="relative h-full rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/30">Content Calendar</p>

              <p className="mt-1 text-lg text-white">
                October 2026
              </p>
            </div>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/[0.06]">
              <CalendarDays size={16} className="text-white/50" />
            </div>
          </div>

          <div className="grid grid-cols-7 gap-2">
            {Array.from({ length: 35 }).map((_, index) => {
              const day = index + 1;

              const activeDays = [3, 7, 12, 17, 21, 25];

              return (
                <div
                  key={index}
                  className={`
                    flex aspect-square items-center justify-center rounded-lg text-[10px]
                    ${
                      activeDays.includes(day)
                        ? "bg-white text-black"
                        : "bg-white/[0.04] text-white/30"
                    }
                  `}
                >
                  {day <= 31 ? day : ""}
                </div>
              );
            })}
          </div>

          <div className="mt-5 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-orange-400" />

            <span className="text-[10px] text-white/30">
              6 posts scheduled
            </span>
          </div>
        </div>
      </div>
    );
  }

  /* TRENDS */
  if (type === "trends") {
    return (
      <div className="absolute inset-0 overflow-hidden bg-[#11100b] p-6">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/[0.08] via-transparent to-transparent" />

        <div className="relative rounded-3xl border border-white/[0.08] bg-white/[0.035] p-5 backdrop-blur-sm">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/30">
                Trend Intelligence
              </p>

              <p className="mt-1 text-lg text-white">
                Trending in Nigeria
              </p>
            </div>

            <TrendingUp
              size={18}
              className="text-emerald-400"
            />
          </div>

          <div className="space-y-3">
            {[
              ["Afrobeats", "+82%"],
              ["Fashion", "+64%"],
              ["Football", "+51%"],
              ["Lifestyle", "+43%"],
            ].map(([name, growth], index) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{
                  delay: index * 0.08,
                }}
                className="flex items-center justify-between rounded-xl border border-white/[0.05] bg-white/[0.04] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  <span className="text-xs text-white/20">
                    0{index + 1}
                  </span>

                  <span className="text-sm text-white/70">
                    {name}
                  </span>
                </div>

                <span className="text-xs text-emerald-400">
                  {growth}
                </span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return null;
};

/* ----------------------------------------
   FEATURE CARDS
----------------------------------------- */

export default function FeatureCards() {
  return (
    <section className="bg-[#0d0c07] px-5 py-24 text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">

        {/* HEADER */}
        <div className="mb-12 max-w-2xl">
          <p className="mb-4 text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            Everything in one place
          </p>

          <h2 className="font-serif text-4xl leading-tight sm:text-5xl lg:text-6xl">
            Your entire content
            <br />

            <span className="text-white/40">
              workflow, powered by ILLIA.
            </span>
          </h2>
        </div>

        {/* CARDS */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;

            return (
              <motion.div
                key={feature.id}
                whileHover="hover"
                initial="rest"
                animate="rest"
                className="
                  group
                  relative
                  min-h-[520px]
                  cursor-pointer
                  overflow-hidden
                  rounded-[30px]
                  border
                  border-white/[0.08]
                  bg-[#15140d]
                "
              >
                {/* VISUAL */}
                <FeatureVisual type={feature.type} />

                {/* DARK OVERLAY */}
                <motion.div
                  variants={{
                    rest: {
                      opacity: 0.15,
                    },
                    hover: {
                      opacity: 0.75,
                    },
                  }}
                  transition={{
                    duration: 0.4,
                  }}
                  className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"
                />

                {/* TOP ICON */}
                <motion.div
                  variants={{
                    rest: {
                      y: 0,
                      opacity: 1,
                    },
                    hover: {
                      y: -4,
                    },
                  }}
                  className="absolute left-6 top-6 z-10"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30 backdrop-blur-md">
                    <Icon
                      size={18}
                      className="text-white/80"
                    />
                  </div>
                </motion.div>

                {/* ARROW */}
                <motion.div
                  variants={{
                    rest: {
                      opacity: 0,
                      scale: 0.8,
                      x: 10,
                    },
                    hover: {
                      opacity: 1,
                      scale: 1,
                      x: 0,
                    },
                  }}
                  transition={{
                    duration: 0.3,
                  }}
                  className="absolute right-6 top-6 z-10"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-black">
                    <ArrowUpRight size={18} />
                  </div>
                </motion.div>

                {/* TEXT */}
                <div className="absolute bottom-0 left-0 right-0 z-10 p-6 sm:p-7">

                  <motion.div
                    variants={{
                      rest: {
                        y: 35,
                      },
                      hover: {
                        y: 0,
                      },
                    }}
                    transition={{
                      duration: 0.45,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <h3 className="font-serif text-3xl leading-tight sm:text-[32px]">
                      {feature.title}
                    </h3>

                    <motion.p
                      variants={{
                        rest: {
                          opacity: 0,
                          y: 15,
                        },
                        hover: {
                          opacity: 1,
                          y: 0,
                        },
                      }}
                      transition={{
                        duration: 0.35,
                        delay: 0.05,
                      }}
                      className="mt-3 max-w-sm text-sm leading-6 text-white/60"
                    >
                      {feature.description}
                    </motion.p>
                  </motion.div>

                </div>

                {/* HOVER BORDER */}
                <motion.div
                  variants={{
                    rest: {
                      opacity: 0,
                    },
                    hover: {
                      opacity: 1,
                    },
                  }}
                  transition={{ duration: 0.4 }}
                  className="pointer-events-none absolute inset-0 rounded-[30px] border border-white/20"
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}