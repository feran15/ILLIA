import { useState, useEffect, useRef } from 'react';
import { base44 } from '@/api/base44Client';
import { X, ChevronRight } from 'lucide-react';

const STEPS = [
  {
    target: 'tour-ai-studio-tab',
    title: '🤖 AI Studio — your home base',
    text: 'Everything starts here. Generate captions, post ideas, images, and chat with your AI assistant. Four powerful tools in one tab.',
    placement: 'bottom',
  },
  {
    target: 'tour-caption-input',
    title: '✍️ Describe your post',
    text: 'Type anything — a product, a mood, a moment. The AI reads your niche and tone to write captions that sound like you.',
    placement: 'top',
  },
  {
    target: 'tour-tone-selector',
    title: '🎭 Tone selector',
    text: 'Pidgin sounds like your best friend. Hype sounds like opening night. Sweet is warm and relatable. Pick your energy before generating.',
    placement: 'bottom',
  },
  {
    target: 'tour-platform-selector',
    title: '📱 Platform selector',
    text: 'The AI rewrites style and length per platform automatically — Instagram hooks, TikTok punches, LinkedIn authority, Twitter brevity.',
    placement: 'bottom',
  },
  {
    target: 'tour-generate-btn',
    title: '⚡ Generate button',
    text: 'One tap gives you 4 unique captions. Don\'t like them? Tap again — the AI always has more. Copy, save, or send to calendar in one click.',
    placement: 'top',
  },
  {
    target: 'tour-chat-tab',
    title: '💬 Ask AI anything',
    text: 'Stuck? Switch to Ask AI. Chat freely — brainstorm strategies, roast your draft caption, get platform-specific advice, or attach an image for context.',
    placement: 'bottom',
  },
  {
    target: 'tour-ideas-tab',
    title: '💡 Post Ideas',
    text: 'Running dry? Get 8 tailored, viral-worthy content ideas for your niche and platform in seconds. Each idea can be expanded and added to your calendar.',
    placement: 'bottom',
  },
  {
    target: 'tour-images-tab',
    title: '🖼️ AI Image Generator',
    text: 'Turn a text description into scroll-stopping visuals. Upload a reference image for style-matched results. Download and post anywhere.',
    placement: 'bottom',
  },
  {
    target: 'tour-trends-nav',
    title: '📈 Trends Dashboard',
    text: 'See what\'s trending in YOUR country — filtered to your niche. Nigerian users see Afrobeats, AFCON, Nollywood. Ghanaian users see Accra events, Black Stars. Tap any trend to auto-generate a caption.',
    placement: 'right',
  },
  {
    target: 'tour-calendar-nav',
    title: '📅 Content Calendar',
    text: 'Schedule posts with dates and times. Set it to "Reminder" (you post manually) or "Draft" mode. Never miss a posting window again.',
    placement: 'right',
  },
  {
    target: 'tour-templates-nav',
    title: '📋 Templates',
    text: 'Save your best captions as reusable templates. Build a library of content formats that work for your niche — never start from scratch.',
    placement: 'right',
  },
  {
    target: 'tour-media-nav',
    title: '🗂️ Media Library',
    text: 'All your generated and uploaded images in one place. Tag them, download them, and reuse them across posts.',
    placement: 'right',
  },
  {
    target: 'tour-locked-features',
    title: '🔒 Locked features',
    text: 'Hashtag Generator, Saved Library, and Brand Voice unlock on Starter plan. Start free — upgrade when you\'re ready for more power.',
    placement: 'top',
  },
];

function getSpotlightStyle(rect) {
  if (!rect) return {};
  return {
    top: rect.top + window.scrollY - 8,
    left: rect.left - 8,
    width: rect.width + 16,
    height: rect.height + 16,
  };
}

function getTooltipPosition(rect, placement) {
  if (!rect) return { top: '50%', left: '50%', transform: 'translate(-50%,-50%)' };
  const GAP = 14;
  const TW = 320;

  const centerX = Math.min(
    Math.max(rect.left + rect.width / 2 - TW / 2, 12),
    window.innerWidth - TW - 12
  );

  if (placement === 'top') {
    return { top: rect.top + window.scrollY - GAP, left: centerX, transform: 'translateY(-100%)' };
  }
  if (placement === 'bottom') {
    return { top: rect.bottom + window.scrollY + GAP, left: centerX };
  }
  if (placement === 'right') {
    return {
      top: rect.top + window.scrollY + rect.height / 2 - 80,
      left: rect.right + GAP,
    };
  }
  return { top: rect.bottom + window.scrollY + GAP, left: centerX };
}

export default function GuidedTour({ onComplete }) {
  const [step, setStep] = useState(0);
  const [rect, setRect] = useState(null);
  const rafRef = useRef(null);

  const current = STEPS[step];

  const measureTarget = () => {
    const el = document.getElementById(current?.target);
    if (el) {
      setRect(el.getBoundingClientRect());
    } else {
      setRect(null);
    }
  };

  useEffect(() => {
    measureTarget();
    // Also scroll target into view
    const el = document.getElementById(current?.target);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

    window.addEventListener('resize', measureTarget);
    window.addEventListener('scroll', measureTarget, true);
    return () => {
      window.removeEventListener('resize', measureTarget);
      window.removeEventListener('scroll', measureTarget, true);
    };
  }, [step]);

  const next = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      finish();
    }
  };

  const finish = async () => {
    await base44.auth.updateMe({ tourComplete: true });
    onComplete();
  };

  const tooltipStyle = getTooltipPosition(rect, current?.placement);
  const spotlightStyle = getSpotlightStyle(rect);

  return (
    <div className="fixed inset-0 z-[999] pointer-events-none">
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/65 pointer-events-auto" onClick={() => {}} />

      {/* Spotlight cutout */}
      {rect && (
        <div
          className="absolute rounded-xl ring-2 ring-primary shadow-[0_0_0_9999px_rgba(0,0,0,0.65)] pointer-events-none transition-all duration-300"
          style={spotlightStyle}
        />
      )}

      {/* Tooltip */}
      <div
        className="absolute z-10 pointer-events-auto transition-all duration-300"
        style={{ ...tooltipStyle, width: 320 }}
      >
        <div className="bg-card border border-border rounded-2xl p-5 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex gap-1">
              {STEPS.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-5 bg-primary' : i < step ? 'w-2 bg-primary/40' : 'w-2 bg-muted'}`}
                />
              ))}
            </div>
            <button onClick={finish} className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-lg hover:bg-muted">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="font-display font-bold text-foreground text-sm mb-1.5">{current?.title}</p>
          <p className="text-sm text-muted-foreground leading-relaxed mb-4">{current?.text}</p>

          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">{step + 1} of {STEPS.length}</span>
            <button
              onClick={next}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold hover:opacity-90 transition-opacity"
            >
              {step === STEPS.length - 1 ? "Let's go! 🚀" : <>Next <ChevronRight className="w-3.5 h-3.5" /></>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}