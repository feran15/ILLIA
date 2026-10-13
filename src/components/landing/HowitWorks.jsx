import { useState } from 'react';
import Avatar from './Avatar';
import { DEFAULT_PEOPLE } from '../../components/data/landingData';

export default function HowItWorks({
  onCtaClick,
}) {
  const [clicked, setClicked] = useState(false);

  const handleClick = (e) => {
    if (onCtaClick) {
      onCtaClick(e);
    } else {
      setClicked(true);
    }
  };

  return (
    <section
      id="how-it-works"
      className="relative mx-auto min-h-[460px] w-full max-w-[1680px] overflow-hidden  px-6 py-24 text-[#1a1408] dark:bg-[#17140d] dark:text-[#f3eedf] sm:min-h-[495px]"
    >
      {DEFAULT_PEOPLE.map((person, index) => (
        <Avatar
          key={index}
          person={person}
        />
      ))}

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center pt-8 text-center sm:pt-14">

        <h2 className="font-serif text-[2.5rem] font-normal leading-[1.1] tracking-tight sm:text-6xl">
          Create content that connects,
          every single day
        </h2>

        <button
          type="button"
          onClick={handleClick}
          className="mt-14 rounded-full bg-[#1a1408] px-6 py-3.5 font-sans text-lg font-medium text-[#fbf8ef] transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1a1408] active:scale-95 dark:bg-[#f3eedf] dark:text-[#17140d] dark:focus-visible:outline-[#f3eedf]"
        >
          {!onCtaClick && clicked
            ? "You're in"
            : 'Start Creating Free'}
        </button>
      </div>
    </section>
  );
}