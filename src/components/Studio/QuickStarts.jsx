import { Zap } from 'lucide-react';

const STARTERS_BY_PURPOSE = {
  fashion: [
    ["New collection just dropped", "Behind the scenes of my process", "Customer review moment"],
    ["This look was made for you", "My top 3 styling tips this week", "Before vs after transformation"],
    ["Let the outfit do the talking", "Limited pieces — grab yours", "Style inspo for this season"],
  ],
  food: [
    ["Today's special is ready", "Watch me make this from scratch", "This one sold out in 2 hours"],
    ["Fresh batch just cooked", "Secret ingredient reveal", "Customer reaction says it all"],
    ["Menu drop this week", "Behind the kitchen scenes", "Why people keep coming back"],
  ],
  personal: [
    ["Current mood", "Something I learned this week", "My honest opinion on..."],
    ["A day in my life", "Unpopular opinion thread", "What nobody tells you about..."],
    ["Real talk moment", "This changed everything for me", "Behind the scenes of my week"],
  ],
  tech: [
    ["New feature just launched", "Why most people get this wrong", "My honest review"],
    ["Problem solved — here's how", "The tool I wish I knew earlier", "Behind the product build"],
    ["Tech tip of the week", "What I built this month", "Why I chose this approach"],
  ],
  fun: [
    ["No thoughts, just vibes", "This made my whole week", "Mood forever"],
    ["Tell me I'm not alone", "Unexplainable energy today", "Plot twist incoming"],
    ["Chaotic but make it cute", "Sending this to your bestie", "Weekend energy loading"],
  ],
};

const DEFAULT_STARTERS = [
  ["What's on your mind today", "Share something you love", "Quick update for your audience"],
  ["Morning motivation drop", "Behind the scenes peek", "Something new this week"],
  ["Your audience is waiting", "Tell your story today", "Drop some value today"],
];

function getStarters(contentPurpose) {
  const purposeArr = Array.isArray(contentPurpose) ? contentPurpose : [];
  const primary = purposeArr[0];
  const pool = STARTERS_BY_PURPOSE[primary] || DEFAULT_STARTERS;
  return pool[Math.floor(Math.random() * pool.length)];
}

export default function QuickStarts({ contentPurpose, onSelect }) {
  const starters = getStarters(contentPurpose);

  return (
    <div className="mb-4">
      <div className="flex items-center gap-2 mb-2">
        <Zap className="w-3.5 h-3.5 text-primary" />
        <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Quick start</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {starters.map((s, i) => (
          <button
            key={i}
            onClick={() => onSelect(s)}
            className="px-3 py-1.5 rounded-full bg-muted border border-border text-xs text-foreground hover:border-primary/50 hover:bg-primary/5 hover:text-primary transition-all"
          >
            {s}
          </button>
        ))}
      </div>
    </div>
  );
}