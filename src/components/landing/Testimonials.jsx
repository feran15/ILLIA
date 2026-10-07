import { useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Quote, Star } from 'lucide-react';
import { TESTIMONIALS } from '../../components/data/landingData';
// import './Testimonials.css';

const AUTOPLAY_MS = 7000;

function Stars({ count = 5 }) {
  return (
    <div className="mb-6 flex items-center gap-1" role="img" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }, (_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

function AvatarBadge({ testimonial, className = 'h-10 w-10 text-sm' }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} font-bold text-white ${className}`}
    >
      {testimonial.avatar}
    </div>
  );
}

export default function Testimonials() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduceMotion = useReducedMotion();
  const tabRefs = useRef([]);

  const count = TESTIMONIALS.length;
  const active = TESTIMONIALS[index];
  const advance = () => setIndex((i) => (i + 1) % count);

  // Roving tabindex + arrow keys, as expected for a tablist
  const handleKeyDown = (e) => {
    const step = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 }[e.key];
    if (!step) return;
    e.preventDefault();
    const next = (index + step + count) % count;
    setIndex(next);
    tabRefs.current[next]?.focus();
  };

  return (
    <section id="testimonials" className="px-4 py-24 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
            <Star className="h-3.5 w-3.5 fill-current" />
            Creator stories
          </div>
          <h2 className="mb-4 font-display text-4xl font-bold text-foreground sm:text-5xl">Real creators, real results</h2>
          <p className="mx-auto max-w-xl text-lg text-muted-foreground">
            Thousands of creators use IlliaAi to grow faster and stress less.
          </p>
        </div>

        {/* Autoplay pauses while the pointer or keyboard focus is anywhere in here */}
        <div
          className={`grid gap-6 lg:grid-cols-[320px_1fr] ${paused ? 't-paused' : ''}`}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onFocus={() => setPaused(true)}
          onBlur={() => setPaused(false)}
        >
          {/* Creator selector */}
          <div
            role="tablist"
            aria-label="Creator stories"
            aria-orientation="vertical"
            onKeyDown={handleKeyDown}
            className="flex gap-3 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0"
          >
            {TESTIMONIALS.map((t, i) => {
              const isActive = i === index;
              return (
                <button
                  key={t.name}
                  ref={(el) => (tabRefs.current[i] = el)}
                  id={`testimonial-tab-${i}`}
                  role="tab"
                  type="button"
                  aria-selected={isActive}
                  aria-controls="testimonial-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setIndex(i)}
                  className={`relative flex min-w-[230px] items-center gap-3 overflow-hidden rounded-2xl border p-4 text-left transition-all duration-300 lg:min-w-0 ${
                    isActive
                      ? 'border-border bg-card shadow-lg'
                      : 'border-transparent opacity-60 hover:opacity-100 focus-visible:opacity-100'
                  }`}
                >
                  <AvatarBadge testimonial={t} />
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-foreground">{t.name}</div>
                    <div className="truncate text-xs text-muted-foreground">{t.platform}</div>
                  </div>

                  {isActive && !reduceMotion && (
                    <span
                      key={i}
                      onAnimationEnd={advance}
                      style={{ '--dur': `${AUTOPLAY_MS}ms` }}
                      className="t-progress absolute inset-x-0 bottom-0 h-0.5 bg-gradient-to-r from-primary to-secondary"
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Featured story */}
          <div
            id="testimonial-panel"
            role="tabpanel"
            aria-labelledby={`testimonial-tab-${index}`}
            className="relative min-h-[360px] overflow-hidden rounded-3xl border border-border bg-card p-8 sm:p-12"
          >
            <AnimatePresence mode="wait">
              <motion.figure
                key={active.name}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="relative flex h-full flex-col"
              >
                {/* Glow takes the active creator's colour */}
                <div
                  className={`pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gradient-to-br ${active.color} opacity-20 blur-3xl`}
                />

                <Quote className="relative mb-6 h-10 w-10 text-primary/40" aria-hidden="true" />
                <Stars />
                <blockquote className="relative mb-10 font-display text-2xl leading-snug text-foreground sm:text-3xl">
                  {active.quote}
                </blockquote>

                <figcaption className="relative mt-auto flex items-center gap-4">
                  <AvatarBadge testimonial={active} className="h-14 w-14 text-base" />
                  <div>
                    <div className="font-semibold text-foreground">{active.name}</div>
                    <div className="text-sm text-muted-foreground">{active.platform}</div>
                  </div>
                </figcaption>
              </motion.figure>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}


// import { Star } from 'lucide-react';
// import { TESTIMONIALS } from '../../components/data/landingData';

// export default function Testimonials() {
//   return (
//     <section
//       id="testimonials"
//       className="px-4 py-24 sm:px-6 lg:px-8"
//     >
//       <div className="mx-auto max-w-7xl">

//         <div className="mb-16 text-center">

//           <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
//             <Star className="h-3.5 w-3.5 fill-current" />
//             Creator stories
//           </div>

//           <h2 className="mb-4 font-display text-4xl font-bold text-foreground sm:text-5xl">
//             Real creators, real results
//           </h2>

//           <p className="mx-auto max-w-xl text-lg text-muted-foreground">
//             Thousands of creators use IlliaAi to grow faster
//             and stress less.
//           </p>
//         </div>

//         <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
//           {TESTIMONIALS.map((testimonial) => (
//             <div
//               key={testimonial.name}
//               className="rounded-2xl border border-border bg-card p-6 transition-colors hover:border-primary/20"
//             >

//               <div className="mb-4 flex items-center gap-1">
//                 {[...Array(5)].map((_, index) => (
//                   <Star
//                     key={index}
//                     className="h-4 w-4 fill-amber-400 text-amber-400"
//                   />
//                 ))}
//               </div>

//               <p className="mb-6 text-sm leading-relaxed text-foreground">
//                 "{testimonial.quote}"
//               </p>

//               <div className="flex items-center gap-3">

//                 <div
//                   className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${testimonial.color} text-sm font-bold text-white`}
//                 >
//                   {testimonial.avatar}
//                 </div>

//                 <div>
//                   <div className="text-sm font-semibold text-foreground">
//                     {testimonial.name}
//                   </div>

//                   <div className="text-xs text-muted-foreground">
//                     {testimonial.platform}
//                   </div>
//                 </div>

//               </div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </section>
//   );
// }