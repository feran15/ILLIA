import { X } from 'lucide-react';

export default function SoftBanner({ onUpgrade, onDismiss }) {
  return (
    <div className="flex items-center justify-between gap-3 px-4 py-2.5 bg-green-600 text-white text-sm rounded-xl mb-4">
      <span className="font-medium">Unlimited captions — ₦1,500/month</span>
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={onUpgrade}
          className="underline font-semibold hover:no-underline transition-all"
        >
          Upgrade
        </button>
        <button onClick={onDismiss} className="hover:opacity-70 transition-opacity">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}