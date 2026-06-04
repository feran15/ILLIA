import { X, Sparkles } from 'lucide-react';

const PURPOSE_MESSAGES = {
  fashion: (name) => `You've used all 5 captions today${name ? `, ${name}` : ''}. Serious fashion sellers don't stop at 5. Upgrade for ₦1,500/month — unlimited captions, hashtag generator, and brand voice mode.`,
  food: (name) => `5 captions done${name ? `, ${name}` : ''}! Your food content deserves no limits. Upgrade for ₦1,500/month — unlimited captions, every day.`,
  personal: (name) => `You're on fire today${name ? `, ${name}` : ''}! 5 captions already. Upgrade for ₦1,500/month and never stop mid-flow again.`,
  tech: (name) => `5 captions in${name ? `, ${name}` : ''}. Your content game is serious — keep it going. Upgrade for ₦1,500/month for unlimited output.`,
  fun: (name) => `5 captions done${name ? ` ${name}` : ''}! You dey enjoy am. Upgrade for ₦1,500/month — unlimited vibes, any time.`,
  default: (name) => `You've hit today's free limit${name ? `, ${name}` : ''}. Upgrade for ₦1,500/month for unlimited captions every day.`,
};

export default function UpgradeModal({ name, contentPurpose, onClose }) {
  const primaryPurpose = Array.isArray(contentPurpose) ? contentPurpose[0] : null;
  const getMessage = PURPOSE_MESSAGES[primaryPurpose] || PURPOSE_MESSAGES.default;
  const message = getMessage(name);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="w-full max-w-sm bg-card border border-border rounded-2xl p-6 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X className="w-4 h-4" />
        </button>
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h2 className="font-display text-xl font-bold text-foreground mb-3">Daily limit reached</h2>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6">{message}</p>
        <button className="w-full py-3 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity mb-3">
          Upgrade Now — ₦1,500/month
        </button>
        <button onClick={onClose} className="w-full py-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
          Maybe later
        </button>
      </div>
    </div>
  );
}