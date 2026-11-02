
import React from "react";

export function Icon({ d, className = "w-5 h-5" }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}

export function ThemeButton({ dark, onToggle }) {
  const sun =
    "M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8M12 2v2M12 20v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2 12h2M20 12h2M4.6 19.4 6 18M18 6l1.4-1.4";

  const moon =
    "M20 14.3A8.3 8.3 0 1 1 9.7 4a6.6 6.6 0 0 0 10.3 10.3z";

  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="grid h-10 w-10 place-items-center rounded-full border-[1.5px] border-line bg-surf hover:border-vio"
    >
      <Icon
        d={dark ? sun : moon}
        className="h-[18px] w-[18px]"
      />
    </button>
  );
}

export function Card({ children, className = "" }) {
  return (
    <div
      className={`rounded-[18px] border border-line bg-surf p-5 ${className}`}
    >
      {children}
    </div>
  );
}

export function SectionHead({ title, link, onViewAll }) {
  return (
    <div className="mb-4 flex items-center justify-between">
      <h2 className="text-[16.5px] font-extrabold tracking-tight">
        {title}
      </h2>

      {link && (
        <button
          type="button"
          onClick={onViewAll}
          className="text-[13px] font-bold text-violet-700 hover:underline dark:text-violet-200"
        >
          View all
        </button>
      )}
    </div>
  );
}
