
import { useEffect, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Zap,
  ArrowUpRight,
  PenLine,
  Lightbulb,
  Image as ImageIcon,
} from 'lucide-react';

import { IMAGES } from '../../components/data/landingData';
import CyclingHeroText from './CyclingHeroText';

export default function Hero({ onNavigate }) {
  const [currentImage, setCurrentImage] = useState(0);
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');

  const validateEmail = (value) => {
    setEmail(value);

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!value) {
      setEmailError('Email is required');
    } else if (!emailPattern.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();

    if (!email || emailError) {
      validateEmail(email);
      return;
    }

    onNavigate('/register', {
      state: { email },
    });
  };

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % IMAGES.length);
  };

  const previousImage = () => {
    setCurrentImage(
      (prev) => (prev - 1 + IMAGES.length) % IMAGES.length
    );
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % IMAGES.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden px-4 pb-24 pt-28 sm:px-6 lg:px-8 lg:pt-32">

      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">

        {/* Main glow */}

        <div className="absolute left-1/2 top-24 h-[500px] w-[700px] -translate-x-1/2 rounded-full bg-primary/10 blur-[140px]" />

        <div className="absolute left-[10%] top-[35%] h-72 w-72 rounded-full bg-secondary/10 blur-[120px]" />

        <div className="absolute right-[5%] top-[45%] h-72 w-72 rounded-full bg-accent/10 blur-[120px]" />

        {/* Subtle grid */}

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)',
            backgroundSize: '70px 70px',
          }}
        />

      </div>

      {/* =====================================================
          HERO CONTENT
      ====================================================== */}

      <div className="relative z-10 mx-auto max-w-7xl">

        {/* Badge */}

        <div className="flex justify-center">

          <div className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-2 text-sm font-medium text-primary backdrop-blur-xl transition-all hover:border-primary/40 hover:bg-primary/10">

            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-white">
              <Sparkles className="h-3 w-3" />
            </span>

            Content creation tools for African creators

            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

          </div>

        </div>

        {/* =================================================
            MAIN HEADING
        ================================================== */}

        <div className="mx-auto mt-9 max-w-5xl text-center">

          <h1 className="font-display text-[3.4rem] font-bold leading-[0.94] tracking-[-0.055em] text-foreground sm:text-6xl md:text-7xl lg:text-[6.5rem]">

            Create content

            <span className="mt-3 block">

              <CyclingHeroText />

            </span>

          </h1>

          <p className="mx-auto mt-8 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">

            Illia is your AI creative studio for generating
            captions, viral ideas, stunning visuals, and
            content strategies in seconds.

          </p>

        </div>

        {/* =================================================
            EMAIL CTA
        ================================================== */}

        <form
          onSubmit={handleEmailSubmit}
          noValidate
          className="mx-auto mt-8 max-w-lg"
        >

          <div
            className={`flex items-center rounded-2xl border bg-background/80 p-1.5 shadow-xl shadow-black/5 backdrop-blur-xl transition-all ${
              emailError
                ? 'border-red-500/60'
                : email
                ? 'border-green-500/60'
                : 'border-border hover:border-foreground/20'
            }`}
          >

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => validateEmail(e.target.value)}
              aria-invalid={!!emailError}
              aria-describedby="email-error"
              className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground sm:text-base"
            />

            <button
              type="submit"
              className="group flex shrink-0 items-center gap-2 rounded-xl bg-foreground px-5 py-3 text-sm font-semibold text-background transition-all hover:-translate-y-0.5 hover:shadow-lg sm:px-6"
            >
              Start creating

              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </button>

          </div>

          <p
            id="email-error"
            className={`mt-2 min-h-[20px] text-left text-xs ${
              emailError
                ? 'text-red-500'
                : 'text-transparent'
            }`}
          >
            {emailError || ' '}
          </p>

        </form>

        {/* Trust */}

        <div className="mt-1 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">

          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            Free to get started
          </span>

          <span>•</span>

          <span>No credit card required</span>

          <span>•</span>

          <span>Made for creators</span>

        </div>

        {/* =================================================
            PRODUCT VISUAL
        ================================================== */}

        <div className="relative mx-auto mt-16 max-w-6xl sm:mt-20">

          {/* Glow behind product */}

          <div className="absolute left-1/2 top-1/2 h-[65%] w-[75%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/15 blur-[100px]" />

          {/* Floating left card */}

          <div className="absolute -left-4 top-24 z-20 hidden w-52 rounded-2xl border border-border/60 bg-background/90 p-4 shadow-2xl backdrop-blur-xl lg:block">

            <div className="mb-3 flex items-center justify-between">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <PenLine className="h-4 w-4" />
              </div>

              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                AI powered
              </span>

            </div>

            <p className="text-sm font-semibold text-foreground">
              Caption Generator
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Create captions that sound natural and fit your brand.
            </p>

          </div>

          {/* Floating right card */}

          <div className="absolute -right-4 bottom-28 z-20 hidden w-52 rounded-2xl border border-border/60 bg-background/90 p-4 shadow-2xl backdrop-blur-xl lg:block">

            <div className="mb-3 flex items-center justify-between">

              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-500">
                <Lightbulb className="h-4 w-4" />
              </div>

              <Zap className="h-4 w-4 text-primary" />

            </div>

            <p className="text-sm font-semibold text-foreground">
              Viral ideas
            </p>

            <p className="mt-1 text-xs leading-5 text-muted-foreground">
              Get fresh post ideas based on your audience and niche.
            </p>

          </div>

          {/* =================================================
              MAIN PRODUCT FRAME
          ================================================== */}

          <div className="relative overflow-hidden rounded-[2rem] border border-border/70 bg-background/80 p-2 shadow-2xl shadow-black/10 backdrop-blur-xl sm:rounded-[2.5rem] sm:p-3">

            {/* Browser top bar */}

            <div className="flex h-11 items-center justify-between px-3 sm:px-5">

              <div className="flex items-center gap-1.5">

                <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />

                <span className="h-2.5 w-2.5 rounded-full bg-yellow-400/80" />

                <span className="h-2.5 w-2.5 rounded-full bg-green-400/80" />

              </div>

              <div className="rounded-full border border-border/50 bg-muted/50 px-5 py-1.5 text-[10px] font-medium text-muted-foreground">
                illia.ai
              </div>

              <div className="flex w-[45px] justify-end">
                <Sparkles className="h-4 w-4 text-primary/60" />
              </div>

            </div>

            {/* Main image */}

            <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem]">

              <div
                className="flex transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentImage * 100}%)`,
                }}
              >

                {IMAGES.map((image, index) => (

                  <div
                    key={index}
                    className="relative min-w-full"
                  >

                    <img
                      src={image}
                      alt={`Illia AI workspace ${index + 1}`}
                      className="h-[360px] w-full object-cover sm:h-[500px] md:h-[580px] lg:h-[650px]"
                    />

                    {/* Image overlay */}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/5" />

                  </div>

                ))}

              </div>

              {/* Product label */}

              <div className="absolute left-5 top-5">

                <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/40 px-3 py-2 text-xs font-medium text-white backdrop-blur-xl">

                  <Sparkles className="h-3.5 w-3.5" />

                  Illia AI Studio

                </div>

              </div>

              {/* Bottom content */}

              <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between sm:bottom-7 sm:left-7 sm:right-7">

                <div>

                  <div className="mb-1 flex items-center gap-2 text-xs text-white/60">

                    <ImageIcon className="h-3.5 w-3.5" />

                    Creative workspace

                  </div>

                  <p className="text-lg font-semibold text-white sm:text-xl">
                    Turn ideas into content.
                  </p>

                </div>

                <div className="rounded-full border border-white/20 bg-black/40 px-3 py-1.5 text-xs text-white backdrop-blur-xl">

                  {currentImage + 1} / {IMAGES.length}

                </div>

              </div>

              {/* Previous */}

              <button
                onClick={previousImage}
                aria-label="Previous image"
                className="absolute left-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-xl transition-all hover:scale-110 hover:bg-black/70"
              >

                <ChevronLeft className="h-4 w-4" />

              </button>

              {/* Next */}

              <button
                onClick={nextImage}
                aria-label="Next image"
                className="absolute right-4 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white backdrop-blur-xl transition-all hover:scale-110 hover:bg-black/70"
              >

                <ChevronRight className="h-4 w-4" />

              </button>

              {/* Indicators */}

              <div className="absolute bottom-7 left-1/2 flex -translate-x-1/2 gap-1.5">

                {IMAGES.map((_, index) => (

                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    aria-label={`Show image ${index + 1}`}
                    className={`h-1.5 rounded-full transition-all ${
                      currentImage === index
                        ? 'w-7 bg-white'
                        : 'w-1.5 bg-white/40'
                    }`}
                  />

                ))}

              </div>

            </div>

          </div>

          {/* Bottom floating badge */}

          <div className="absolute -bottom-5 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap rounded-full border border-border/60 bg-background/95 px-5 py-2.5 text-xs font-medium text-foreground shadow-xl backdrop-blur-xl">

            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">
              <Zap className="h-3 w-3" />
            </span>

            From idea to publish-ready content

          </div>

        </div>

        {/* =================================================
            FEATURE STRIP
        ================================================== */}

        <div className="mx-auto mt-24 max-w-5xl border-t border-border/50 pt-10">

          <div className="grid grid-cols-2 gap-y-8 sm:grid-cols-4 sm:gap-y-0">

            <div className="text-center sm:border-r sm:border-border/50">
              <p className="text-lg font-semibold text-foreground">
                Captions
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                That sound like you
              </p>
            </div>

            <div className="text-center sm:border-r sm:border-border/50">
              <p className="text-lg font-semibold text-foreground">
                Viral Ideas
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Built for your audience
              </p>
            </div>

            <div className="text-center sm:border-r sm:border-border/50">
              <p className="text-lg font-semibold text-foreground">
                AI Images
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Create stunning visuals
              </p>
            </div>

            <div className="text-center">
              <p className="text-lg font-semibold text-foreground">
                Strategy
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Plan your content
              </p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}