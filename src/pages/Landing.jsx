import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Sun, Moon, Bell, Images } from 'lucide-react';
import {
  Sparkles,
  Zap,
  Calendar,
  TrendingUp,
  Image,
  MessageSquare,
  Type,
  Lightbulb,
  Check,
  ChevronRight,
  ChevronLeft,
  Star,
  ArrowRight,
  Play,
  Menu,
  X
} from 'lucide-react';
import { useTypewriter } from '../hooks/useTypewriter';
const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
  // { label: 'Pricing', href: '#pricing' },
];

const FEATURES = [
  {
    icon: MessageSquare,
    color: 'from-violet-500 to-purple-600',
    glow: 'shadow-violet-500/25',
    title: 'AI Content Assistant',
    desc: 'Chat with your personal AI to brainstorm, refine, and strategize your content like having a creative director on call 24/7.',
  },
  {
    icon: Type,
    color: 'from-pink-500 to-rose-600',
    glow: 'shadow-pink-500/25',
    title: 'Caption Generator',
    desc: 'Generate 4 platform perfect captions in seconds. Tuned for Instagram hooks, LinkedIn authority, TikTok punches, and more.',
  },
  {
    icon: Lightbulb,
    color: 'from-amber-400 to-orange-500',
    glow: 'shadow-amber-400/25',
    title: 'Viral Post Ideas',
    desc: 'Never run out of ideas. Get 8 tailored, trend aware content ideas for your niche on any platform  instantly.',
  },
  {
    icon: Image,
    color: 'from-cyan-400 to-blue-500',
    glow: 'shadow-cyan-400/25',
    title: 'AI Image Generator',
    desc: 'Turn a text description into stunning visuals. Upload a reference image for style matched results your audience will love.',
  },
  {
    icon: Calendar,
    color: 'from-green-400 to-emerald-500',
    glow: 'shadow-green-400/25',
    title: 'Content Calendar',
    desc: 'Schedule posts, get reminders, and visualize your entire content pipeline so you never miss a posting window.',
  },
  {
    icon: TrendingUp,
    color: 'from-red-400 to-pink-500',
    glow: 'shadow-red-400/25',
    title: 'Trends Dashboard',
    desc: 'Stay ahead of the curve. See what\'s trending on each platform and save ideas directly to your content calendar.',
  },
];

const STEPS = [
  {
    num: '01',
    title: 'Tell us about your brand',
    desc: 'Quick onboarding captures your niche, tone, platforms, and goals so every output feels like you, not like a robot.',
  },
  {
    num: '02',
    title: 'Generate content in seconds',
    desc: 'Pick a tool captions, ideas, images, or just chat. The AI crafts platform specific content tailored to your brand voice.',
  },
  {
    num: '03',
    title: 'Schedule & grow',
    desc: 'Add posts to your calendar, track trends, and build a consistent presence that turns followers into fans.',
  },
];

const TESTIMONIALS = [
  {
    name: 'Amara Okafor',
    handle: '@amarastyle',
    platform: 'Fashion Creator · 82k followers',
    avatar: 'AO',
    color: 'from-pink-500 to-rose-500',
    quote: 'IlliaAi replaced my entire content team for captions. I generate 20 captions in the time it used to take me to write one. My engagement went up 40% in 3 weeks.',
  },
  {
    name: 'Taiwo Adeyemi',
    handle: '@techwithtaiwo',
    platform: 'Tech Educator · 210k followers',
    avatar: 'TA',
    color: 'from-violet-500 to-purple-600',
    quote: 'The trends dashboard is insane. I see what\'s blowing up on LinkedIn before it peaks and create content around it. That\'s my secret weapon right now.',
  },
  {
    name: 'Chisom Eze',
    handle: '@chisomcooks',
    platform: 'Food Creator · 55k followers',
    avatar: 'CE',
    color: 'from-amber-400 to-orange-500',
    quote: 'I used to dread writing captions. Now I just describe my dish, pick a vibe, and boom 4 captions ready to post. This app is genuinely magic.',
  },
  {
    name: 'Kunle Balogun',
    handle: '@kunlegrowth',
    platform: 'Business Coach · 120k followers',
    avatar: 'KB',
    color: 'from-cyan-400 to-blue-500',
    quote: 'The content calendar alone is worth it. I can see my entire month at a glance. No more scrambling for ideas at midnight. IlliaAi is non-negotiable.',
  },
];

const PLANS = [
  {
    name: 'Free',
    price: '₦0',
    period: '/month',
    desc: 'Perfect for getting started',
    cta: 'Start Free',
    highlight: false,
    features: [
      '5 AI captions per day',
      'Post idea generator',
      'AI chat assistant',
      'Content calendar (5 posts)',
      'Basic templates',
    ],
  },
  {
    name: 'Creator',
    price: '₦4,999',
    period: '/month',
    desc: 'For serious content creators',
    cta: 'Get Started',
    highlight: true,
    badge: 'Most Popular',
    features: [
      'Unlimited AI captions',
      'Unlimited post ideas',
      'AI image generation',
      'Full content calendar',
      'Trends dashboard',
      'Media library',
      'Priority support',
    ],
  },
  {
    name: 'Agency',
    price: '₦14,999',
    period: '/month',
    desc: 'For teams and agencies',
    cta: 'Contact Us',
    highlight: false,
    features: [
      'Everything in Creator',
      'Multiple brand profiles',
      'Team collaboration',
      'Custom tone presets',
      'Advanced analytics',
      'Dedicated account manager',
    ],
  },
];

function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        let start = 0;
        const step = target / 60;
        const timer = setInterval(() => {
          start += step;
          if (start >= target) { setCount(target); clearInterval(timer); }
          else setCount(Math.floor(start));
        }, 16);
      }
    });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}
  // Add this above `export default function Landing()`, alongside your other helper components

const HERO_PHRASES = ['That Connects.','In Minutes.', 'Easily.', 'Anytime.', 'Anywhere.'];

function CyclingHeroText() {
  const [phraseIndex, setPhraseIndex] = useState(0);
  const { displayed } = useTypewriter(HERO_PHRASES[phraseIndex], {
    speed: 150,
    onComplete: () => {
      setTimeout(() => {
        setPhraseIndex(i => (i + 1) % HERO_PHRASES.length);
      }, 1200);
    },
  });

  return (
    <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
      {displayed}
      <span className=" w-[3px] h-[0.85em] bg-primary ml-1 align-middle animate-pulse" />
    </span>
  );
}

export default function Landing() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
    const [currentImage, setCurrentImage] = useState(0);
    const PLATFORMS = [
  {
    name: 'Instagram',
    d: 'M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5zm0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3H7zm5 3.5a4.5 4.5 0 1 1 0 9 4.5 4.5 0 0 1 0-9zm0 2a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM17.2 5.8a1.1 1.1 0 1 1 0 2.2 1.1 1.1 0 0 1 0-2.2z',
  },
  {
    name: 'TikTok',
    d: 'M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z',
  },
  {
    name: 'LinkedIn',
    d: 'M4 2h16a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2zm1.6 7.5V19h3V9.5h-3zM7.1 5a1.75 1.75 0 1 0 0 3.5 1.75 1.75 0 0 0 0-3.5zM10.5 9.5V19h3v-5c0-1.3.6-2.2 1.8-2.2s1.6.9 1.6 2.2v5h3v-5.7c0-2.5-1.3-4-3.4-4-1.3 0-2.2.6-3 1.6V9.5h-3z',
  },
  {
    name: 'Twitter / X',
    d: 'M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z',
  },
   {
    name: 'Facebook',
    d: 'M14 22v-8.5h2.9l.5-3.4H14V8c0-1 .4-1.7 1.8-1.7h1.7V3.3c-.3 0-1.4-.2-2.6-.2-2.6 0-4.3 1.6-4.3 4.4v2.6H7.7v3.4h2.9V22z',
  },
  {
    name: 'YouTube',
    d: 'M21.6 7.2a2.6 2.6 0 0 0-1.8-1.8C18.2 5 12 5 12 5s-6.2 0-7.8.4A2.6 2.6 0 0 0 2.4 7.2C2 8.8 2 12 2 12s0 3.2.4 4.8a2.6 2.6 0 0 0 1.8 1.8C5.8 19 12 19 12 19s6.2 0 7.8-.4a2.6 2.6 0 0 0 1.8-1.8C22 15.2 22 12 22 12s0-3.2-.4-4.8zM10 15V9l5.2 3L10 15z',
  },
];

const Group = ({ hidden = false }) => (
  <div
    className="flex shrink-0 items-center gap-12 pr-12"
    aria-hidden={hidden}
  >
    {PLATFORMS.map((platform) => (
      <div
        key={platform.name}
        className="group flex items-center gap-3 whitespace-nowrap font-display font-bold text-lg text-foreground/60 transition-all duration-300 hover:text-foreground"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-7 w-7 fill-current transition-transform duration-300 group-hover:scale-110"
          aria-hidden="true"
        >
          <path
            d={platform.d}
            fillRule={platform.fillRule}
          />
        </svg>

        <span>{platform.name}</span>
      </div>
    ))}
  </div>
);

// Image Reels
const images = [
    "/AI.jpeg",
    "/Blogger.jpeg",
    "/Illia.jpeg",
    "/Aii.jpeg"
  ];

 const nextImage = () => {
  setCurrentImage((prev) => (prev + 1) % images.length)
 };
 
 const previousImage = () => {
  setCurrentImage((prev) => (prev + 1) % images.length)
 };
 // Auto move
useEffect(() => {
  const interval = setInterval(() => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  }, 5000); // changes every 4 seconds

  return () => clearInterval(interval);
}, []);


  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light');
      root.classList.remove('dark');
    } else {
      root.classList.add('dark');
      root.classList.remove('light');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);



  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

    const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

    


  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">

      {/* NAV */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? ' backdrop-blur-xl border-b border-border' : 'bg-transparent'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-lg text-foreground">IlliaAi</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">{l.label}</a>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-3">
              <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            title={theme === 'light' ? 'Switch to dark Mode' : 'Switch to light Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Log In</Link>
            <Link to="/register" className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold hover:opacity-90 transition-opacity shadow-lg shadow-primary/30">
              Get Started Free
            </Link>
          </div>
          <button onClick={() => setMobileOpen(v => !v)} className="md:hidden p-2 text-muted-foreground">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        {mobileOpen && (
          <div className="md:hidden bg-background/95 backdrop-blur-xl border-b border-border px-4 pb-4 space-y-4">
            {NAV_LINKS.map(l => (
              <a key={l.label} href={l.href} onClick={() => setMobileOpen(false)} className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-2">{l.label}</a>
            ))}
            <Link to="/login" className="block w-full text-center px-4 py-2.5 rounded-lg bg-gradient-to-r from-primary to-secondary text-white text-sm font-semibold">
              Get Started Free
            </Link>
          </div>
        )}
      </nav>
        
      {/* HERO */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background glows */}
          <div className="absolute inset-0 pointer-events-none">
    <div className="absolute top-20 left-1/4 w-72 h-72 bg-primary/20 rounded-full blur-3xl" />
    <div className="absolute top-40 right-1/4 w-72 h-72 bg-secondary/20 rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-64 bg-accent/10 rounded-full blur-3xl" />
  </div> 

       {/* HERO CONTENT */}
<div className="max-w-7xl mx-auto relative z-10 grid lg:grid-cols-2 gap-12 items-center">

  {/* LEFT - TEXT */}
  <div>

    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-8">
      <Zap className="w-3.5 h-3.5" />
      Content creation tools for African creators
    </div>

    <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl text-foreground leading-[1.05] mb-6">
      Create Content <br />

      <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
        <CyclingHeroText />
      </span>
    </h1>

    <p className="text-xl text-muted-foreground max-w-xl mb-10 leading-relaxed">
      IlliaAi is your AI studio for generating captions, viral post ideas,
      stunning images, and a full content strategy in seconds, not hours.
    </p>

    <div className="flex flex-col sm:flex-row gap-4">

      <Link
        to="/login"
        className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl
        bg-gradient-to-r from-primary to-secondary
        text-white font-bold text-lg
        hover:opacity-90 transition-all
        shadow-xl shadow-primary/30 hover:scale-105"
      >
        Start Creating Free
        <ArrowRight className="w-5 h-5" />
      </Link>

      <a
        href="#how-it-works"
        className="flex items-center justify-center gap-2 px-8 py-4 rounded-xl
        border border-border text-foreground font-semibold text-lg
        hover:bg-muted transition-colors"
      >
        <Play className="w-4 h-4" />
        See How It Works
      </a>

    </div>

  </div>


 {/* RIGHT - SLIDING IMAGE CAROUSEL */}
<div className="flex justify-center lg:justify-end">
  <div className="relative w-full max-w-xl">

    {/* Carousel window */}
    <div className="overflow-hidden rounded-2xl">

      {/* Sliding track */}
      <div
        className="flex transition-transform duration-700 ease-in-out"
        style={{
          transform: `translateX(-${currentImage * 100}%)`,
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className="w-full min-w-full flex-shrink-0"
          >
            <img
              src={image}
              alt={`IlliaAi ${index + 1}`}
              className="w-full h-[420px] lg:h-[500px] object-cover"
            />
          </div>
        ))}
      </div>

    </div>

    {/* LEFT ARROW */}
    <button
      onClick={previousImage}
      className="
        absolute left-3 top-1/2 -translate-y-1/2
        w-11 h-11 rounded-full
        bg-black/50 backdrop-blur-md
        border border-white/20
        text-white
        flex items-center justify-center
        hover:bg-black/70
        hover:scale-110
        transition-all
        z-10
      "
    >
      <ChevronLeft className="w-5 h-5" />
    </button>

    {/* RIGHT ARROW */}
    <button
      onClick={nextImage}
      className="
        absolute right-3 top-1/2 -translate-y-1/2
        w-11 h-11 rounded-full
        bg-black/50 backdrop-blur-md
        border border-white/20
        text-white
        flex items-center justify-center
        hover:bg-black/70
        hover:scale-110
        transition-all
        z-10
      "
    >
      <ChevronRight className="w-5 h-5" />
    </button>

    {/* DOTS */}
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
      {images.map((_, index) => (
        <button
          key={index}
          onClick={() => setCurrentImage(index)}
          className={`h-2 rounded-full transition-all ${
            currentImage === index
              ? "w-6 bg-white"
              : "w-2 bg-white/50"
          }`}
        />
      ))}
    </div>

  </div>
</div>

</div>

        {/* Hero app mockup */}
        <div className="max-w-4xl mx-auto mt-16 relative">
          <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-black/40">
            <div className="flex items-center gap-2 px-4 py-3 bg-muted border-b border-border">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
              <div className="w-3 h-3 rounded-full bg-green-500/60" />
              <div className="flex-1 mx-4 h-6 bg-background rounded flex items-center px-3">
                <span className="text-xs text-muted-foreground">illia-ai.app/studio</span>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {/* Simulated caption output */}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="flex-1 h-4 bg-muted rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'Monday motivation hits different when your morning routine is actually serving you. What\'s the one habit that changed everything? 👇 #MindsetShift #MondayMotivation',
                  'They said consistency is boring. I said consistency built my entire brand. 3 years later, here\'s what that looks like... 🔥 #CreatorLife',
                ].map((txt, i) => (
                  <div key={i} className="bg-muted rounded-xl p-4 text-xs text-muted-foreground leading-relaxed border border-border">
                    {txt}
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                {['✨ Casual', '💼 Professional', '😂 Funny', '📚 Educational'].map(chip => (
                  <span key={chip} className={`text-xs px-3 py-1 rounded-full border ${chip === '✨ Casual' ? 'bg-primary/10 border-primary/30 text-primary' : 'bg-muted border-border text-muted-foreground'}`}>{chip}</span>
                ))}
              </div>
            </div>
          </div>
          {/* Floating cards */}
          <div className="absolute -left-8 top-12 hidden lg:block">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-xl w-44">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-semibold text-foreground">Trending Now</span>
              </div>
              <div className="space-y-1.5">
                {['#CreatorEconomy', '#AIContent', '#LinkedInTips'].map(t => (
                  <div key={t} className="text-xs text-muted-foreground">{t}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="absolute -right-8 bottom-12 hidden lg:block">
            <div className="bg-card border border-border rounded-2xl p-4 shadow-xl w-44">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <Calendar className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="text-xs font-semibold text-foreground">Next Post</span>
              </div>
              <div className="text-xs text-muted-foreground">Tomorrow, 9:00 AM</div>
              <div className="text-xs font-medium text-foreground mt-1 truncate">Monday Motivation 🔥</div>
              <div className="flex gap-1 mt-2">
                <span className="w-2 h-2 rounded-full bg-pink-500" />
                <span className="w-2 h-2 rounded-full bg-blue-500" />
                <span className="w-2 h-2 rounded-full bg-sky-400" />
              </div>
            </div>
          </div>
        </div>
      </section>

                <section className="py-12 px-4 border-y border-border bg-muted/30 overflow-hidden">

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

      <div className="max-w-5xl mx-auto text-center">

        <p className="text-sm text-muted-foreground mb-8">
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

            <Group />

            <Group hidden />

          </div>
        </div>

      </div>
    </section>

      {/* FEATURES */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-4">
              <Zap className="w-3.5 h-3.5" /> Packed with tools
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">Everything you need to<br />dominate your niche</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">Six powerful AI tools, one seamless platform. Built specifically for content creators who want results.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="group bg-card border border-border rounded-2xl p-6 hover:border-primary/30 hover:bg-card/80 transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${f.color} flex items-center justify-center mb-4 shadow-lg ${f.glow}`}>
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-display font-bold text-lg text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
              Simple process
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">Up and running in minutes</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">No learning curve. Just plug in your niche and start creating content that resonates.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-10 left-[calc(33%+2rem)] right-[calc(33%+2rem)] h-px bg-gradient-to-r from-primary/40 via-secondary/40 to-accent/40" />
            {STEPS.map((step, i) => (
              <div key={step.num} className="text-center relative">
                <div className={`w-20 h-20 rounded-2xl mx-auto mb-6 flex items-center justify-center text-2xl font-display font-black shadow-lg ${
                  i === 0 ? 'bg-gradient-to-br from-primary to-secondary text-white shadow-primary/30' :
                  i === 1 ? 'bg-gradient-to-br from-secondary to-accent text-white shadow-secondary/30' :
                  'bg-gradient-to-br from-accent to-primary text-white shadow-accent/30'
                }`}>
                  {step.num}
                </div>
                <h3 className="font-display font-bold text-xl text-foreground mb-3">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
              <Star className="w-3.5 h-3.5 fill-current" /> Creator stories
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">Real creators, real results</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">Thousands of creators use IlliaAi to grow faster and stress less.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {TESTIMONIALS.map((t) => (
              <div key={t.name} className="bg-card border border-border rounded-2xl p-6 hover:border-primary/20 transition-colors">
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <p className="text-foreground leading-relaxed mb-6 text-sm">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {t.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-foreground">{t.name}</div>
                    <div className="text-xs text-muted-foreground">{t.platform}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      {/* <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-muted/20">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-sm font-medium mb-4">
              Simple pricing
            </div>
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-foreground mb-4">Invest in your growth</h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">Start free. Upgrade when you're ready to unlock the full studio.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map((plan) => (
              <div key={plan.name} className={`relative rounded-2xl p-6 flex flex-col ${plan.highlight
                ? 'bg-gradient-to-b from-primary/20 to-secondary/10 border-2 border-primary/50 shadow-2xl shadow-primary/20'
                : 'bg-card border border-border'}`}>
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="px-4 py-1 rounded-full bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold">
                      {plan.badge}
                    </span>
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-display font-bold text-xl text-foreground mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{plan.desc}</p>
                  <div className="flex items-end gap-1">
                    <span className="font-display font-black text-4xl text-foreground">{plan.price}</span>
                    <span className="text-muted-foreground mb-1">{plan.period}</span>
                  </div>
                </div>
                <ul className="space-y-3 flex-1 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-foreground">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${plan.highlight ? 'bg-primary/20' : 'bg-muted'}`}>
                        <Check className={`w-3 h-3 ${plan.highlight ? 'text-primary' : 'text-muted-foreground'}`} />
                      </div>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/studio" className={`w-full text-center px-4 py-3 rounded-xl font-semibold text-sm transition-all ${plan.highlight
                  ? 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-lg shadow-primary/30'
                  : 'bg-muted text-foreground hover:bg-muted/80 border border-border'}`}>
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section> */}

      {/* CTA SECTION */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 pointer-events-none" />
        <div className="absolute top-0 left-1/3 w-72 h-72 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/3 w-72 h-72 bg-secondary/20 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center relative z-10">
          <h2 className="font-display font-black text-5xl sm:text-6xl text-foreground mb-6">
            Ready to create content{' '}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              that pops?
            </span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Join  creators who stopped struggling with content and started showing up consistently with IlliaAi.
          </p>
          <Link to="/studio" className="inline-flex items-center gap-3 px-10 py-5 rounded-2xl bg-gradient-to-r from-primary to-secondary text-white font-bold text-xl hover:opacity-90 transition-all shadow-2xl shadow-primary/30 hover:scale-105">
            <Sparkles className="w-6 h-6" /> Start Creating  It's Free
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">No credit card required. Start in 60 seconds.</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-border py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-foreground">IlliaAi</span>
          </div>
          <p className="text-sm text-muted-foreground">© 2026 IlliaAi. Built for African creators. 🌍</p>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
            <a href="#" className="hover:text-foreground transition-colors">Terms</a>
            <a href="#" className="hover:text-foreground transition-colors">Support</a>
          </div>
        </div>
      </footer>

    </div>
  );
}