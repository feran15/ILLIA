import PlatformGroup from './PlatformGroup';

export default function PlatformMarquee() {
  return (
    <section className="overflow-hidden border-y border-border bg-muted/30 px-4 py-12">

      <style>{`
        @keyframes logo-marquee {
          from {
            transform: translateX(0);
          }

          to {
            transform: translateX(-50%);
          }
        }

        .logo-marquee-track {
          animation: logo-marquee 30s linear infinite;
          will-change: transform;
        }

        .logo-marquee:hover .logo-marquee-track {
          animation-play-state: paused;
        }

        @media (prefers-reduced-motion: reduce) {
          .logo-marquee-track {
            animation: none;
          }
        }
      `}</style>

      <div className="mx-auto max-w-5xl text-center">
        <p className="mb-8 text-sm text-muted-foreground">
          Trusted by creators across every major platform
        </p>

        <div
          className="logo-marquee overflow-hidden"
          style={{
            WebkitMaskImage:
              'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)',
            maskImage:
              'linear-gradient(90deg, transparent 0%, black 10%, black 90%, transparent 100%)',
          }}
        >
          <div className="logo-marquee-track flex w-max">
            <PlatformGroup />
            <PlatformGroup hidden />
          </div>
        </div>
      </div>
    </section>
  );
}