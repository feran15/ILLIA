import { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { Sparkles, Check, Loader2 } from 'lucide-react';
import {  Link } from "react-router-dom"
const PURPOSE_OPTIONS = [
  { id: 'personal', label: 'My personal brand / lifestyle', emoji: '✨' },
  { id: 'fashion', label: 'My fashion or beauty business', emoji: '👗' },
  { id: 'food', label: 'My food or catering business', emoji: '🍽️' },
  { id: 'tech', label: 'My tech or service business', emoji: '💻' },
  { id: 'fun', label: 'Just for fun and vibes', emoji: '🎉' },
  { id: 'other', label: 'Other', emoji: '🌟' },
];

const PLATFORM_OPTIONS = [
  { id: 'instagram', label: 'Instagram', emoji: '📷' },
  { id: 'tiktok', label: 'TikTok', emoji: '🎵' },
  { id: 'whatsapp', label: 'WhatsApp', emoji: '💬' },
  { id: 'twitter', label: 'X (Twitter)', emoji: '𝕏' },
  { id: 'facebook', label: 'Facebook', emoji: '👤' },
];

const TONE_OPTIONS = [
  { id: 'hype', label: 'Hype', desc: 'Big energy, loud, exciting', emoji: '🔥' },
  { id: 'savage', label: 'Savage', desc: 'Sharp, witty, no filter', emoji: '😏' },
  { id: 'sweet', label: 'Sweet', desc: 'Warm, soft, relatable', emoji: '🥰' },
  { id: 'motivational', label: 'Motivational', desc: 'Inspiring, powerful, uplifting', emoji: '💪' },
  { id: 'pidgin', label: 'Pidgin', desc: 'Full Naija Pidgin — raw and real', emoji: '🇳🇬' },
  { id: 'yoruba', label: 'Yoruba Flavour', desc: 'Sprinkled with Yoruba expressions', emoji: '🌺' },
];

function ProgressBar({ step, total }) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold text-muted-foreground">Step {step} of {total}</span>
        <span className="text-xs text-muted-foreground">{Math.round((step / total) * 100)}%</span>
      </div>
      <div className="h-1.5 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
          style={{ width: `${(step / total) * 100}%` }}
        />
      </div>
    </div>
  );
}

function OptionCard({ label, emoji, selected, onClick, description }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-3 ${
        selected
          ? 'border-primary bg-primary/10'
          : 'border-border bg-card hover:border-primary/40 hover:bg-muted/50'
      }`}
    >
      <span className="text-xl shrink-0">{emoji}</span>
      <div>
        <p className={`font-semibold text-sm ${selected ? 'text-primary' : 'text-foreground'}`}>{label}</p>
        {description && <p className="text-xs text-muted-foreground mt-0.5">{description}</p>}
      </div>
      {selected && <Check className="w-4 h-4 text-primary ml-auto shrink-0 mt-0.5" />}
    </button>
  );
}

export default function Onboarding({ onComplete }) {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [purposes, setPurposes] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [tone, setTone] = useState('');
  const [saving, setSaving] = useState(false);

  const toggleArr = (arr, setter, id) => {
    setter(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const finish = async () => {
    setSaving(true);
    await base44.auth.updateMe({
      onboardingComplete: true,
      onboardingDate: new Date().toISOString(),
      onboardingName: name,
      contentPurpose: purposes,
      platforms,
      defaultTone: tone,
      niche: purposes.join(', ')
    });
    setSaving(false);
    setStep(7);
  };

  const skip = () => setStep(s => s + 1);

  return (
    <div className="fixed inset-0 z-50 bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* SCREEN 1: Welcome */}
        {step === 1 && (
          <div className="text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-primary/40">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-3">Welcome to CreatorFlow</h1>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              The only AI that helps write content the way you actually talk.
            </p>
            <button
              onClick={() => setStep(2)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg shadow-xl shadow-green-500/30 hover:opacity-90 transition-opacity"
            >
              Let's go 🚀
            </button>
          </div>
        )}

        {/* SCREEN 2: Name */}
        {step === 2 && (
          <div>
            <ProgressBar step={1} total={5} />
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">First things first — what do we call you?</h2>
            <p className="text-muted-foreground mb-6">We're going to use this to personalise your experience.</p>
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your first name or nickname..."
              className="w-full bg-muted border-2 border-border rounded-xl px-4 py-3 text-base text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary transition-colors mb-6"
            />
            <button
              onClick={() => setStep(3)}
              disabled={!name.trim()}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity disabled:opacity-40"
            >
              Continue →
            </button>
            <button onClick={skip} className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
              Skip for now
            </button>
          </div>
        )}

        {/* SCREEN 3: Purpose */}
        {step === 3 && (
          <div>
            <ProgressBar step={2} total={5} />
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">What are you creating content for?</h2>
            <p className="text-muted-foreground mb-6">Pick all that apply — the more you tell us, the better your captions will be.</p>
            <div className="space-y-2 mb-6 max-h-80 overflow-y-auto pr-1">
              {PURPOSE_OPTIONS.map(opt => (
                <OptionCard
                  key={opt.id}
                  label={opt.label}
                  emoji={opt.emoji}
                  selected={purposes.includes(opt.id)}
                  onClick={() => toggleArr(purposes, setPurposes, opt.id)}
                />
              ))}
            </div>
            <button
              onClick={() => setStep(4)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
            >
              Continue →
            </button>
            <button onClick={skip} className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
              Skip for now
            </button>
          </div>
        )}

        {/* SCREEN 4: Platforms */}
        {step === 4 && (
          <div>
            <ProgressBar step={3} total={5} />
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">Where do you post the most?</h2>
            <p className="text-muted-foreground mb-6">We're going to make sure your captions always fit the platform you're using.</p>
            <div className="space-y-2 mb-6">
              {PLATFORM_OPTIONS.map(opt => (
                <OptionCard
                  key={opt.id}
                  label={opt.label}
                  emoji={opt.emoji}
                  selected={platforms.includes(opt.id)}
                  onClick={() => toggleArr(platforms, setPlatforms, opt.id)}
                />
              ))}
            </div>
            <button
              onClick={() => setStep(5)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity"
            >
              Continue →
            </button>
            <button onClick={skip} className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
              Skip for now
            </button>
          </div>
        )}

        {/* SCREEN 5: Tone */}
        {step === 5 && (
          <div>
            <ProgressBar step={4} total={5} />
            <h2 className="font-display text-3xl font-bold text-foreground mb-2">What's your natural posting energy?</h2>
            <p className="text-muted-foreground mb-6">You can always change this when generating — this is just your starting point.</p>
            <div className="space-y-2 mb-6 max-h-80 overflow-y-auto pr-1">
              {TONE_OPTIONS.map(opt => (
                <OptionCard
                  key={opt.id}
                  label={opt.label}
                  emoji={opt.emoji}
                  description={opt.desc}
                  selected={tone === opt.id}
                  onClick={() => setTone(opt.id)}
                />
              ))}
            </div>
            <Link to="/studio">
            <button
              onClick={finish}
              disabled={!tone || saving}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-base shadow-lg shadow-primary/30 hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
            >
              {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Finish setup ✨'}
            </button></Link>
            <button onClick={() => { finish(); }} className="hidden" />
            <button onClick={skip} className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground transition-colors py-2">
              Skip for now
            </button>
          </div>
        )}

        {/* CELEBRATION */}
        {step === 7 && (
          <div className="text-center">
            <div className="text-6xl mb-6">🎉</div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-3">
              You're all set{name ? `, ${name}` : ''}!
            </h1>
            <p className="text-muted-foreground text-lg mb-10 leading-relaxed">
              Your CreatorFlow experience is ready. Let's go.
            </p>
            <button
              onClick={onComplete}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-primary to-accent text-white font-bold text-lg shadow-xl shadow-primary/40 hover:opacity-90 transition-opacity"
            >
              Start generating 🚀
            </button>
          </div>
        )}
      </div>
    </div>
  );
}