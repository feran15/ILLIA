import { Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function UpgradeSuccess({ user, onClose }) {
  const name = user?.onboardingName || user?.full_name?.split(' ')[0] || 'Creator';
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-card border border-green-500/40 rounded-2xl p-8 max-w-sm w-full shadow-2xl text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-400/40">
          <Sparkles className="w-8 h-8 text-white" />
        </div>
        <h2 className="font-display font-black text-2xl text-foreground mb-3">
          You're now on Starter, {name}!
        </h2>
        <p className="text-muted-foreground text-sm mb-6">Unlimited captions, always. Let's go. 🚀</p>
        <Button onClick={onClose} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold">
          Start Creating
        </Button>
      </div>
    </div>
  );
}