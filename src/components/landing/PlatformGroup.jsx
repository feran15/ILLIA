import { PLATFORMS } from '../../components/data/landingData';

export default function PlatformGroup({ hidden = false }) {
  return (
    <div
      className="flex shrink-0 items-center gap-12 pr-12"
      aria-hidden={hidden}
    >
      {PLATFORMS.map((platform) => (
        <div
          key={platform.name}
          className="group flex items-center gap-3 whitespace-nowrap font-display text-lg font-bold text-foreground/60 transition-all duration-300 hover:text-foreground"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-7 w-7 fill-current transition-transform duration-300 group-hover:scale-110"
            aria-hidden="true"
          >
            <path d={platform.d} />
          </svg>

          <span>{platform.name}</span>
        </div>
      ))}
    </div>
  );
}