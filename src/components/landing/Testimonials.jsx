
import { useState } from "react";

const CREATORS = [
  {
    id: "amara",
    initials: "AO",
    color: "#ec4899",
    name: "Amara Okafor",
    niche: "Fashion",
    followers: "82k",
    delta: "+40%",
    deltaLabel: "engagement in 3 weeks",
    start: 8,
    series: [3.1, 3.0, 3.3, 3.2, 3.1, 3.4, 3.2, 3.3, 3.6, 4.1, 4.5, 4.7],
    before: {
      text: "New drop is live. Link in bio.",
      stat: "3.3% engagement",
      time: "Took 25 min to write",
    },
    after: {
      text: "She walked in, the room went quiet, and the blazer did the talking. Which colour should I restock first? Tell me below.",
      stat: "4.7% engagement",
      time: "Generated in 90 seconds",
    },
  },
  {
    id: "taiwo",
    initials: "TA",
    color: "#7c3aed",
    name: "Taiwo Adeyemi",
    niche: "Tech education",
    followers: "210k",
    delta: "6 hrs",
    deltaLabel: "saved every week",
    start: 4,
    series: [2.2, 2.1, 2.3, 2.2, 2.4, 2.7, 2.9, 3.0, 3.2, 3.1, 3.4, 3.5],
    before: {
      text: "Here is a thread about Git branching.",
      stat: "2.2% engagement",
      time: "Posted 2 days a week",
    },
    after: {
      text: "Git branches explained with a pizza. Save this for the next time you break main.",
      stat: "3.5% engagement",
      time: "Posted 5 days a week",
    },
  },
  {
    id: "chisom",
    initials: "CE",
    color: "#d97706",
    name: "Chisom Eze",
    niche: "Food",
    followers: "55k",
    delta: "2x",
    deltaLabel: "saves per recipe",
    start: 6,
    series: [4.0, 4.2, 4.1, 4.3, 4.2, 4.4, 4.9, 5.6, 6.2, 6.8, 7.3, 7.9],
    before: {
      text: "Jollof rice recipe. Enjoy!",
      stat: "180 saves",
      time: "Generic caption",
    },
    after: {
      text: "Party jollof, smoky bottom and all. Save it now, you will want it by Friday.",
      stat: "360 saves",
      time: "Written in her voice",
    },
  },
  {
    id: "kunle",
    initials: "KB",
    color: "#0891b2",
    name: "Kunle Balogun",
    niche: "Business coaching",
    followers: "120k",
    delta: "5 days",
    deltaLabel: "posting per week, up from 2",
    start: 5,
    series: [2.8, 2.7, 2.9, 2.8, 2.9, 3.0, 3.3, 3.4, 3.7, 3.6, 3.9, 4.2],
    before: {
      text: "Consistency is key to growing your business.",
      stat: "2 posts a week",
      time: "Dreaded the blank page",
    },
    after: {
      text: "Your first 10 customers will not come from an ad. Here is where mine came from.",
      stat: "5 posts a week",
      time: "Drafts waiting every morning",
    },
  },
];

const W = 260;
const H = 56;
const PAD = 4;

function geometry(series) {
  const min = Math.min(...series);
  const max = Math.max(...series);

  const x = (i) =>
    PAD + (i * (W - PAD * 2)) / Math.max(series.length - 1, 1);

  const y = (value) =>
    H - PAD - ((value - min) / (max - min || 1)) * (H - PAD * 2);

  const d = series
    .map(
      (value, index) =>
        `${index === 0 ? "M" : "L"}${x(index).toFixed(1)} ${y(value).toFixed(1)}`
    )
    .join(" ");

  return { x, y, d };
}

function Line({ creator }) {
  const { x, y, d } = geometry(creator.series);
  const last = creator.series.length - 1;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="h-auto w-full overflow-visible"
      role="img"
      aria-label={`Illustrative engagement trend for ${creator.name}`}
    >
      <line
        x1={x(creator.start)}
        x2={x(creator.start)}
        y1="0"
        y2={H}
        stroke="currentColor"
        strokeOpacity="0.3"
        strokeDasharray="3 3"
      />

      <path
        d={d}
        fill="none"
        stroke={creator.color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <circle
        cx={x(last)}
        cy={y(creator.series[last])}
        r="4"
        fill={creator.color}
      />
    </svg>
  );
}

export default function Results() {
  const [open, setOpen] = useState(CREATORS[0].id);

  return (
    <section
      id="results"
      className="px-4 py-16 text-[#17140d] sm:px-6 sm:py-20 lg:px-8 lg:py-24"
    >
      <div className="mx-auto max-w-6xl">
        {/* Section heading */}
        <header className="mx-auto mb-12 max-w-2xl text-center">
          <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e8e1d4] bg-white/70 px-4 py-2 text-xs font-bold tracking-wider text-violet-700">
            <span className="h-2 w-2 rounded-full bg-violet-500" />
            THE ILLIA AI DIFFERENCE
          </span>

          <h2 className="mb-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
            Same creators. Same posts. <span className="text-[#AD39D3] font-semibold">Better captions.</span> 
          </h2>

          <p className="mx-auto max-w-xl text-base leading-7 text-[#716d63] sm:text-lg">
            Great content starts with the right words. Explore these
            illustrative examples to see how stronger captions can make
            content more engaging and easier to create.
          </p>
        </header>

        {/* Creator list */}
        <ul className="m-0 list-none border-t border-[#e8e1d4] p-0">
          {CREATORS.map((creator) => {
            const isOpen = open === creator.id;
            const panelId = `rs-panel-${creator.id}`;

            return (
              <li
                key={creator.id}
                className="border-b border-[#e8e1d4]"
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={panelId}
                  onClick={() =>
                    setOpen(isOpen ? null : creator.id)
                  }
                  className="grid w-full grid-cols-[44px_minmax(0,1fr)_20px] items-center gap-x-4 gap-y-4 rounded-xl px-2 py-5 text-left transition-colors hover:bg-white/50 focus-visible:outline-2 focus-visible:outline-violet-500 sm:grid-cols-[48px_minmax(140px,1.1fr)_minmax(150px,260px)_minmax(120px,1fr)_20px] sm:gap-5 sm:py-6"
                >
                  <span
                    className="flex h-11 w-11 items-center justify-center rounded-full text-sm font-bold text-white sm:h-12 sm:w-12"
                    style={{ backgroundColor: creator.color }}
                    aria-hidden="true"
                  >
                    {creator.initials}
                  </span>

                  <span className="flex min-w-0 flex-col gap-1">
                    <strong className="text-sm font-bold sm:text-base">
                      {creator.name}
                    </strong>

                    <span className="text-xs leading-5 text-[#716d63] sm:text-sm">
                      {creator.niche} · {creator.followers} followers
                    </span>
                  </span>

                  <span className="col-span-3 sm:col-span-1">
                    <Line creator={creator} />
                  </span>

                  <span className="col-span-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 sm:col-span-1 sm:flex-col sm:items-start sm:gap-1">
                    <strong
                      className="text-xl font-bold tracking-tight sm:text-2xl"
                      style={{ color: creator.color }}
                    >
                      {creator.delta}
                    </strong>

                    <span className="text-xs leading-5 text-[#716d63] sm:text-sm">
                      {creator.deltaLabel}
                    </span>
                  </span>

                  <span
                    className={`col-start-3 row-start-1 h-2.5 w-2.5 justify-self-center border-b-2 border-r-2 border-[#716d63] transition-transform duration-200 ${
                      isOpen
                        ? "rotate-[225deg]"
                        : "rotate-45"
                    }`}
                    aria-hidden="true"
                  />
                </button>

                {/* Before and after comparison */}
                <div
                  id={panelId}
                  aria-hidden={!isOpen}
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div className="grid grid-cols-1 gap-4 pb-6 sm:grid-cols-2 sm:gap-5 sm:pl-16 sm:pr-2">
                      {/* Before */}
                      <article className="flex flex-col gap-4 rounded-2xl border border-dashed border-[#dcd3c2] bg-[#f7f3e9] p-5 sm:p-6">
                        <span className="text-xs font-bold tracking-wider text-[#716d63]">
                          BEFORE ILLIAAI
                        </span>

                        <p className="m-0 flex-1 text-base leading-7 text-[#716d63]">
                          {creator.before.text}
                        </p>

                        <dl className="m-0 flex flex-col gap-1 border-t border-[#e8e1d4] pt-4 text-sm">
                          <dt className="font-bold text-[#17140d]">
                            {creator.before.stat}
                          </dt>

                          <dd className="m-0 text-[#716d63]">
                            {creator.before.time}
                          </dd>
                        </dl>
                      </article>

                      {/* With IlliaAi */}
                      <article
                        className="flex flex-col gap-4 rounded-2xl border-2 bg-white p-5 shadow-sm sm:p-6"
                        style={{ borderColor: creator.color }}
                      >
                        <span
                          className="text-xs font-bold tracking-wider"
                          style={{ color: creator.color }}
                        >
                          WITH ILLIAAI
                        </span>

                        <p className="m-0 flex-1 text-base leading-7 text-[#17140d]">
                          {creator.after.text}
                        </p>

                        <dl className="m-0 flex flex-col gap-1 border-t border-[#e8e1d4] pt-4 text-sm">
                          <dt className="font-bold text-[#17140d]">
                            {creator.after.stat}
                          </dt>

                          <dd className="m-0 text-[#716d63]">
                            {creator.after.time}
                          </dd>
                        </dl>
                      </article>
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>

        <p className="mt-5 text-center text-xs leading-5 text-[#716d63]">
          Illustrative examples for demonstration purposes. Actual results
          may vary.
        </p>
      </div>
    </section>
  );
}
