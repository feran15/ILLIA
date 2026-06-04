import { useState } from 'react';
import { X, Check, Sparkles, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';

const FEATURES = [
  'Unlimited caption generations',
  'Hashtag generator',
  'Save your best captions',
  'Brand voice customisation',
];

function getHeadline(user, consecutiveLimitDays) {
  const name = user?.onboardingName || user?.full_name?.split(' ')[0] || 'Creator';
  if (consecutiveLimitDays >= 3) {
    return `3 days in a row, ${name} — you clearly need more. Upgrade and never hit a limit again.`;
  }
  const purposes = user?.contentPurpose || [];
  if (purposes.includes('fashion') || purposes.includes('beauty')) {
    return `You're on fire, ${name}! Serious fashion sellers don't stop at 5.`;
  }
  if (purposes.includes('food') || purposes.includes('catering')) {
    return `5 captions done, ${name}! Your food content deserves no limits.`;
  }
  if (purposes.includes('tech') || purposes.includes('service')) {
    return `You're building something, ${name} — unlimited captions keep you moving.`;
  }
  if (purposes.includes('fun')) {
    return `You dey enjoy am, ${name}! Don't let limits stop the vibes.`;
  }
  return `You're on a roll, ${name}! Don't stop now.`;
}

// Focused feature-lock modal content
const LOCKED_FEATURES = {
  hashtag: {
    title: 'Hashtag Generator',
    desc: 'Generate 15–20 perfectly matched hashtags for every caption. Available on Starter plan — ₦1,500/month.',
    plan: 'Starter',
  },
  saved: {
    title: 'Saved Caption Library',
    desc: 'Bookmark your favourite captions and build a personal library you can search any time. Available on Starter plan — ₦1,500/month.',
    plan: 'Starter',
  },
  brandvoice: {
    title: 'Brand Voice',
    desc: 'Train the AI to always write in your unique business voice. Available on Pro plan — ₦4,000/month.',
    plan: 'Pro',
  },
};

export function LockedFeatureModal({ featureKey, onClose, onUpgrade, onDismiss }) {
  const feature = LOCKED_FEATURES[featureKey];
  if (!feature) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400" />
            <span className="font-display font-bold text-foreground">{feature.title}</span>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-6 leading-relaxed">{feature.desc}</p>
        <div className="space-y-2">
          <Button onClick={onUpgrade} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold">
            Upgrade now — pay with Paystack
          </Button>
          <Button variant="ghost" onClick={onDismiss} className="w-full text-muted-foreground text-sm">
            Remind me tomorrow
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function PaywallModal({ user, consecutiveLimitDays, onClose, onUpgrade, onDismiss, loading }) {
  const headline = getHeadline(user, consecutiveLimitDays);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-card border border-border rounded-2xl p-7 max-w-md w-full shadow-2xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-green-400/30">
            <Sparkles className="w-7 h-7 text-white" />
          </div>
          <h2 className="font-display font-bold text-xl text-foreground mb-2 leading-tight">{headline}</h2>
          <p className="text-sm text-muted-foreground">Upgrade to Starter for unlimited captions every day.</p>
        </div>

        <ul className="space-y-2.5 mb-6">
          {FEATURES.map(f => (
            <li key={f} className="flex items-center gap-3 text-sm text-foreground">
              <div className="w-5 h-5 rounded-full bg-green-500/20 flex items-center justify-center shrink-0">
                <Check className="w-3 h-3 text-green-400" />
              </div>
              {f}
            </li>
          ))}
        </ul>

        <div className="text-center mb-4">
          <span className="font-display font-black text-3xl text-foreground">₦1,500</span>
          <span className="text-muted-foreground text-sm">/month</span>
        </div>

        <div className="space-y-2">
          <Button
            onClick={onUpgrade}
            disabled={loading}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 text-base shadow-lg shadow-green-600/30"
          >
            {loading ? 'Processing...' : 'Upgrade now — pay with Paystack'}
          </Button>
          <Button
            variant="ghost"
            onClick={onDismiss}
            className="w-full text-muted-foreground text-sm hover:text-foreground"
          >
            Remind me tomorrow
          </Button>
        </div>
      </div>
    </div>
  );
}