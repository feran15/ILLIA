import { useState } from 'react';
import { useTypewriter } from '../../hooks/useTypewriter';
import { HERO_PHRASES } from '../../components/data/landingData';

export default function CyclingHeroText() {
  const [phraseIndex, setPhraseIndex] = useState(0);

  const { displayed } = useTypewriter(HERO_PHRASES[phraseIndex], {
    speed: 150,
    onComplete: () => {
      setTimeout(() => {
        setPhraseIndex((i) => (i + 1) % HERO_PHRASES.length);
      }, 1200);
    },
  });

  return (
    <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
      {displayed}
      <span className="ml-1 inline-block h-[0.85em] w-[3px] animate-pulse bg-primary align-middle" />
    </span>
  );
}