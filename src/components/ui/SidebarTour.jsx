import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ChevronRight, ChevronLeft, Sparkles } from 'lucide-react';

const TOUR_KEY = 'illiaai_sidebar_tour_completed';

export const SIDEBAR_TOUR_STEPS = [
  {
    target: '[data-tour="brand"]',
    title: 'Welcome to IlliaAi 👋',
    body: "Let's take a 30-second look around your new content studio.",
    placement: 'bottom',
  },
  {
    target: '[data-tour="nav-ai-studio"]',
    title: 'AI Studio',
    body: 'Your command center — chat with the AI, generate captions, and get post ideas in one place.',
    placement: 'right',
  },
  {
    target: '[data-tour="nav-trends"]',
    title: 'Trends',
    body: "See what's blowing up on each platform right now, so you're never late to a trend.",
    placement: 'right',
  },
  {
    target: '[data-tour="nav-calendar"]',
    title: 'Calendar',
    body: 'Plan and schedule your posts here. Never miss a posting window again.',
    placement: 'right',
  },
  {
    target: '[data-tour="nav-profile"]',
    title: 'Profile',
    body: 'Set your brand voice, niche, and tone so every generated post sounds like you.',
    placement: 'right',
  },
  {
    target: '[data-tour="pro-tip"]',
    title: 'Keep an eye here',
    body: "We'll drop quick tips here as you use the app — worth a glance every so often.",
    placement: 'top',
  },
];

function useTargetRect(selector, active) {
  const [rect, setRect] = useState(null);

  const update = useCallback(() => {
    if (!selector) return;
    const el = document.querySelector(selector);
    if (el) setRect(el.getBoundingClientRect());
  }, [selector]);

  useEffect(() => {
    if (!active) return;
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    const id = setInterval(update, 300); // catches late-mounted/animated elements
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
      clearInterval(id);
    };
  }, [active, update]);

  return rect;
}

export default function SidebarTour({ steps = SIDEBAR_TOUR_STEPS, run, onFinish }) {
  const [stepIndex, setStepIndex] = useState(0);
  const step = steps[stepIndex];
  const rect = useTargetRect(step?.target, run);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (run) setStepIndex(0);
  }, [run]);

  if (!run || !step) return null;

  const finish = () => {
    localStorage.setItem(TOUR_KEY, 'true');
    onFinish?.();
  };

  const next = () => (stepIndex === steps.length - 1 ? finish() : setStepIndex(i => i + 1));
  const back = () => setStepIndex(i => Math.max(0, i - 1));

  const pad = 8;
  const spot = rect
    ? {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;

  let tooltipStyle = {};
  if (spot) {
    switch (step.placement) {
      case 'right':
        tooltipStyle = { top: spot.top, left: spot.left + spot.width + 16 };
        break;
      case 'top':
        tooltipStyle = { top: spot.top - 16, left: spot.left, transform: 'translateY(-100%)' };
        break;
      default:
        tooltipStyle = { top: spot.top + spot.height + 16, left: spot.left };
    }
  }

  return (
    <div className="fixed inset-0 z-[100]">
      {spot && (
        <div
          className="absolute rounded-xl transition-all duration-300 ease-out pointer-events-none"
          style={{
            top: spot.top,
            left: spot.left,
            width: spot.width,
            height: spot.height,
            boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)',
            border: '2px solid rgba(139,92,246,0.8)',
          }}
        />
      )}

      <div className="absolute inset-0" />

      {spot && (
        <div
          ref={tooltipRef}
          className="absolute w-72 bg-card border border-border rounded-2xl shadow-2xl p-5 transition-all duration-300 ease-out"
          style={tooltipStyle}
        >
          <div className="flex items-start justify-between gap-3 mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center shrink-0">
                <Sparkles className="w-3.5 h-3.5 text-white" />
              </div>
              <h3 className="font-display font-bold text-sm text-foreground">{step.title}</h3>
            </div>
            <button onClick={finish} className="text-muted-foreground hover:text-foreground transition-colors shrink-0" aria-label="Skip tour">
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-4">{step.body}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {steps.map((_, i) => (
                <span key={i} className={`w-1.5 h-1.5 rounded-full transition-colors ${i === stepIndex ? 'bg-primary' : 'bg-muted'}`} />
              ))}
            </div>
            <div className="flex items-center gap-2">
              {stepIndex > 0 && (
                <button onClick={back} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors" aria-label="Back">
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
              <button onClick={next} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-xs font-semibold hover:opacity-90 transition-opacity">
                {stepIndex === steps.length - 1 ? 'Done' : 'Next'}
                {stepIndex < steps.length - 1 && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function hasTourCompleted() {
  return localStorage.getItem(TOUR_KEY) === 'true';
}