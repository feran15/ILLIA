
import { useState } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Sparkles } from 'lucide-react';

const FAQS = [
  {
    question: 'Can I cancel my paid subscription at any time?',
    answer:
      "Yes. You can cancel from your account settings whenever you like, and you'll keep access until the end of the period you've already paid for.",
  },
  {
    question: 'Which platforms can I create content for?',
    answer:
      'IlliaAi helps you create content for Instagram, TikTok, LinkedIn, X, Facebook and YouTube. Pick a platform before you generate and the tone, format and length adjust to fit.',
  },
  {
    question: 'Can I plan my posts in advance?',
    answer:
      'Yes. The IlliaAi content calendar lets you schedule posts, set reminders, and see your content plan in one place so you never miss a posting window.',
  },
  {
    question: 'Do I need writing or design experience?',
    answer:
      'No. Describe what you want to create, pick a tone, and IlliaAi generates captions, post ideas and creative concepts for you. You can edit everything before publishing.',
  },
];

const AVATARS = [
  { src: '/creator.jpeg', alt: 'Creator' },
  { src: '/AI.jpeg', alt: 'Creator using IlliaAi' },
  { src: '/Blogger.jpeg', alt: 'Blogger' },
  { src: '/PG1.jpeg', alt: 'Content creator' },
];

/* =========================================================
   PERSON AVATAR
========================================================= */

function PersonAvatar({ src, alt }) {
  return (
    <div className="h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-white sm:h-[60px] sm:w-[60px]">
      <img
        src={src}
        alt={alt}
        className="h-full w-full object-cover"
      />
    </div>
  );
}

/* =========================================================
   BRAND BADGE
========================================================= */

function BrandBadge({ className = '' }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-full   text-[#2d1b2b] ${className}`}
    >
      <Sparkles
        className="h-1/2 w-1/2"
        strokeWidth={2.5}
        aria-hidden="true"
      />
    </div>
  );
}

/* =========================================================
   FAQ
========================================================= */

export default function Faq({
  id = 'faq',
  title = 'Frequently asked questions',
  items = FAQS,
}) {
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (index) => {
    setOpenIndex((current) =>
      current === index ? null : index
    );
  };

  return (
    <>
      {/* =====================================================
          FAQ INTRO
      ===================================================== */}

      <section
        id={id}
        className="px-4 pb-24 pt-20 sm:px-6 lg:px-8"
      >
        {/* CENTERED HEADING */}
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <h2
            className="
              font-display
              text-4xl
              font-black
              uppercase
              tracking-tight
              text-[#2d1b2b]
              dark:text-white
              sm:text-5xl
              lg:text-6xl
            "
          >
            YOU ASKED? ILLIA ANSWERS
          </h2>

          <p
            className="
              mx-auto
              mt-4
              max-w-2xl
              text-base
              leading-relaxed
              text-[#2d1b2b]/60
              dark:text-white/60
              sm:text-lg
            "
          >
            Everything you need to know about creating, planning,
            and growing with IlliaAi.
          </p>
        </div>

        <MotionConfig reducedMotion="user">
          <div
            className="
              mx-auto
              max-w-5xl
              overflow-hidden
              rounded-[2rem]
              bg-[#e3ecec]
              shadow-sm
              dark:bg-[#211b1e]
            "
          >
            {/* =================================================
                FAQ HEADER
            ================================================= */}

            <header
              className="
                flex
                items-center
                gap-4
                bg-[#2d1b2b]
                px-5
                py-4
                sm:gap-5
                sm:px-8
                sm:py-5
              "
            >
              <BrandBadge
                className="h-12 w-12 sm:h-[60px] sm:w-[60px]"
              />

              <h3
                className="
                  font-display
                  text-base
                  font-medium
                  uppercase
                  tracking-tight
                  text-white
                  sm:text-xl
                "
              >
                {title}
              </h3>
            </header>

            {/* =================================================
                FAQ LIST
            ================================================= */}

            <ul className="space-y-3 p-3 sm:space-y-4 sm:p-6">
              {items.map(({ question, answer }, i) => {
                const isOpen = openIndex === i;
                const panelId = `${id}-panel-${i}`;

                return (
                  <li
                    key={question}
                    className="space-y-3"
                  >
                    {/* QUESTION */}

                    <button
                      type="button"
                      onClick={() => toggle(i)}
                      aria-expanded={isOpen}
                      aria-controls={panelId}
                      className="
                        group
                        flex
                        w-fit
                        max-w-full
                        items-center
                        gap-4
                        rounded-[1.75rem]
                        bg-white
                        p-3
                        pr-6
                        text-left
                        text-[#2d1b2b]
                        shadow-sm
                        transition-all
                        duration-300
                        hover:-translate-y-0.5
                        hover:shadow-lg
                        focus-visible:outline
                        focus-visible:outline-2
                        focus-visible:outline-offset-2
                        focus-visible:outline-[#2d1b2b]
                        dark:bg-[#f5f1e8]
                      "
                    >
                      <PersonAvatar
                        {...AVATARS[i % AVATARS.length]}
                      />

                      <span className="text-base font-medium sm:text-xl">
                        {question}
                      </span>

                      <motion.span
                        animate={{
                          rotate: isOpen ? 45 : 0,
                        }}
                        transition={{ duration: 0.2 }}
                        className="
                          ml-auto
                          hidden
                          text-2xl
                          font-light
                          opacity-40
                          sm:block
                        "
                      >
                        +
                      </motion.span>
                    </button>

                    {/* ANSWER */}

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          id={panelId}
                          role="region"
                          aria-label={question}
                          initial={{
                            opacity: 0,
                            height: 0,
                            y: -8,
                          }}
                          animate={{
                            opacity: 1,
                            height: 'auto',
                            y: 0,
                          }}
                          exit={{
                            opacity: 0,
                            height: 0,
                            y: -8,
                          }}
                          transition={{
                            duration: 0.35,
                            ease: [0.22, 1, 0.36, 1],
                          }}
                          className="overflow-hidden"
                        >
                          <div
                            className="
                              ml-auto
                              flex
                              w-fit
                              max-w-[94%]
                              items-end
                              gap-4
                              rounded-[1.75rem]
                              bg-[#c9dadf]
                              p-4
                              text-[#2d1b2b]
                              shadow-sm
                              sm:max-w-[80%]
                              sm:p-5
                            "
                          >
                            <p className="flex-1 text-sm leading-relaxed sm:text-base">
                              {answer}
                            </p>

                            <BrandBadge className="h-9 w-9" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </li>
                );
              })}
            </ul>
          </div>
        </MotionConfig>
      </section>

      {/* =====================================================
          CTA SECTION
      ===================================================== */}

      <section
        className="
          relative
          overflow-hidden
          px-4
          py-24
          sm:px-6
          lg:px-8
        "
      >
        {/* BACKGROUND */}

        <div
          className="
            pointer-events-none
            absolute
            inset-0
            bg-gradient-to-r
            from-primary/10
            via-secondary/10
            to-accent/10
          "
        />

        {/* DECORATIVE GLOW */}

        <div
          className="
            pointer-events-none
            absolute
            left-1/3
            top-0
            h-72
            w-72
            rounded-full
            bg-primary/20
            blur-3xl
          "
        />

        <div
          className="
            pointer-events-none
            absolute
            bottom-0
            right-1/3
            h-72
            w-72
            rounded-full
            bg-secondary/20
            blur-3xl
          "
        />

        {/* CTA CONTENT */}

        <div
          className="
            relative
            z-10
            mx-auto
            max-w-3xl
            text-center
          "
        >
          {/* BADGE */}

          <div
            className="
              mb-6
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-border
              bg-background/70
              px-4
              py-2
              text-sm
              font-medium
              text-foreground
              backdrop-blur
            "
          >
            <Sparkles className="h-4 w-4" />

            AI-powered content creation
          </div>

          {/* HEADING */}

          <h2
            className="
              mb-6
              font-display
              text-5xl
              font-black
              text-foreground
              sm:text-6xl
            "
          >
            Ready to create content{' '}

            <span
              className="
                bg-gradient-to-r
                from-primary
                via-secondary
                to-accent
                bg-clip-text
                text-transparent
              "
            >
              that pops?
            </span>
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              mx-auto
              mb-10
              max-w-2xl
              text-lg
              leading-relaxed
              text-muted-foreground
              sm:text-xl
            "
          >
            Join creators who stopped struggling with content
            and started showing up consistently with IlliaAi.
          </p>

          {/* CTA BUTTON */}

          <Link
            to="/studio"
            className="
              inline-flex
              items-center
              gap-3
              rounded-2xl
              bg-gradient-to-r
              from-primary
              to-secondary
              px-10
              py-5
              text-xl
              font-bold
              text-white
              shadow-2xl
              shadow-primary/30
              transition-all
              duration-300
              hover:scale-105
              hover:opacity-90
            "
          >
            <Sparkles className="h-6 w-6" />

            Start Creating, It's Free
          </Link>

          {/* SMALL TEXT */}

          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required. Start in 60 seconds.
          </p>
        </div>
      </section>
    </>
  );
}
