
import { useState } from "react";
import { Icon, ThemeButton } from "../UI";

const STEPS = [
  {
    key: "creatorType",
    title: "How would you describe yourself?",
    sub: "This helps ILLIA tailor tone and tools.",
    opts: [
      "Solo creator",
      "Small business owner",
      "Marketing team member",
      "Freelancer or consultant",
      "Agency",
      "Other",
    ],
  },
  {
    key: "niche",
    title: "What's your niche?",
    sub: "ILLIA uses this to keep every idea on brand.",
    chips: true,
    opts: [
      "Fashion & Beauty",
      "Food & Cooking",
      "Fitness & Health",
      "Tech & Startups",
      "Business & Finance",
      "Education",
      "Travel",
      "Entertainment",
      "Lifestyle",
      "Art & Design",
    ],
  },
  {
    key: "platforms",
    title: "Where do you create content?",
    sub: "Choose as many as you like.",
    multi: true,
    opts: [
      "Instagram",
      "TikTok",
      "LinkedIn",
      "Twitter / X",
      "Facebook",
      "YouTube",
    ],
  },
  {
    key: "goal",
    title: "What matters most right now?",
    sub: "Your top goal shapes what ILLIA recommends first.",
    opts: [
      "Grow my audience",
      "Increase engagement",
      "Drive sales or leads",
      "Build authority",
      "Stay consistent",
    ],
  },
  {
    key: "voice",
    title: "How should your content sound?",
    sub: "Pick up to three.",
    chips: true,
    multi: true,
    max: 3,
    opts: [
      "Casual & Friendly",
      "Professional",
      "Funny & Playful",
      "Bold & Confident",
      "Inspirational",
      "Educational",
    ],
  },
  {
    key: "frequency",
    title: "How often do you want to post?",
    sub: "This sets your weekly rhythm.",
    opts: [
      "Daily",
      "A few times a week",
      "A few times a month",
      "Just getting started",
    ],
  },
];

export default function Onboarding({
  name = "Creator",
  dark,
  onToggleTheme,
  onDone,
}) {
  const [i, setI] = useState(-1);

  const [answers, setAnswers] = useState({
    platforms: [],
    voice: [],
  });

  const step = STEPS[i];

  function isSelected(option) {
    if (!step) return false;

    return step.multi
      ? (answers[step.key] || []).includes(option)
      : answers[step.key] === option;
  }

  const canContinue =
    step &&
    (step.multi
      ? (answers[step.key] || []).length > 0
      : Boolean(answers[step.key]));

  function pick(option) {
    if (!step.multi) {
      setAnswers((prev) => ({
        ...prev,
        [step.key]: option,
      }));
      return;
    }

    setAnswers((prev) => {
      const current = prev[step.key] || [];

      if (current.includes(option)) {
        return {
          ...prev,
          [step.key]: current.filter((item) => item !== option),
        };
      }

      if (step.max && current.length >= step.max) {
        return prev;
      }

      return {
        ...prev,
        [step.key]: [...current, option],
      };
    });
  }

  function finish(skipped = false) {
    onDone({
      creatorType: answers.creatorType || "Solo creator",
      niche: answers.niche || "Lifestyle",
      platforms: answers.platforms?.length
        ? answers.platforms
        : ["Instagram"],
      goal: answers.goal || "Stay consistent",
      voice: answers.voice?.length
        ? answers.voice
        : ["Casual & Friendly"],
      frequency: answers.frequency || "A few times a week",
      skipped,
      completedAt: Date.now(),
    });
  }

  function next() {
    if (!canContinue) return;

    if (i === STEPS.length - 1) {
      finish(false);
    } else {
      setI((current) => current + 1);
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between p-5">
        <button
          type="button"
          onClick={() => setI((current) => Math.max(-1, current - 1))}
          aria-label="Go back"
          className={`grid h-[38px] w-[38px] place-items-center rounded-full border-[1.5px] border-line bg-surf ${
            i < 0 ? "invisible" : ""
          }`}
        >
          <Icon d="M15 18l-6-6 6-6" className="h-4 w-4" />
        </button>

        <div className="flex gap-1.5" aria-label={`Step ${Math.max(i + 1, 0)} of 6`}>
          {STEPS.map((_, n) => (
            <span
              key={n}
              className={`h-1 rounded-full transition-all ${
                n === i
                  ? "w-[30px] bg-vio"
                  : n < i
                    ? "w-[22px] bg-vio"
                    : "w-[22px] bg-line"
              }`}
            />
          ))}
        </div>

        <ThemeButton dark={dark} onToggle={onToggleTheme} />
      </header>

      {i < 0 ? (
        <div className="grid flex-1 place-items-center px-6 text-center">
          <div className="flex flex-col items-center gap-6">
            <div className="grad grid h-[52px] w-[52px] place-items-center rounded-2xl text-xl font-extrabold text-white shadow-lg">
              I
            </div>

            <h1 className="text-3xl font-extrabold tracking-tight">
              Hey there, {name} 👋
            </h1>

            <p className="max-w-sm text-mute">
              Six quick questions and ILLIA will already know your niche,
              your voice and what to create first.
            </p>

            <button
              type="button"
              onClick={() => setI(0)}
              className="grad rounded-full px-8 py-4 font-bold text-white shadow-lg shadow-violet-500/30 transition hover:-translate-y-px"
            >
              Let's start →
            </button>
          </div>
        </div>
      ) : (
        <main className="flex flex-1 justify-center px-6 pb-12 pt-4">
          <div className="w-full max-w-[640px]">
            <p className="mb-3 text-xs font-bold uppercase tracking-wide text-faint">
              Step {i + 1} of {STEPS.length}
            </p>

            <h1 className="mb-2 text-[28px] font-extrabold tracking-tight">
              {step.title}
            </h1>

            <p className="mb-7 text-sm text-mute">{step.sub}</p>

            <div
              className={
                step.chips
                  ? "flex flex-wrap gap-2"
                  : "grid gap-3 sm:grid-cols-2"
              }
            >
              {step.opts.map((option) => {
                const selected = isSelected(option);

                return (
                  <button
                    type="button"
                    key={option}
                    aria-pressed={selected}
                    onClick={() => pick(option)}
                    className={[
                      step.chips
                        ? "rounded-full px-[18px] py-[11px]"
                        : "rounded-[14px] p-4 text-left",
                      "border-[1.5px] text-sm font-bold transition",
                      selected
                        ? step.chips
                          ? "border-transparent bg-vio text-white"
                          : "soft border-vio"
                        : "border-line bg-surf hover:border-vio",
                    ].join(" ")}
                  >
                    {option}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 flex flex-col items-start gap-3">
              <button
                type="button"
                disabled={!canContinue}
                onClick={next}
                className="grad rounded-full px-8 py-3 font-bold text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                {i === STEPS.length - 1 ? "Finish" : "Continue"} →
              </button>

              <button
                type="button"
                onClick={() => finish(true)}
                className="self-center text-[13.5px] font-bold text-faint hover:text-mute"
              >
                Skip for now
              </button>
            </div>
          </div>
        </main>
      )}
    </div>
  );
}
