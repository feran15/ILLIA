import {
  Calendar,
  Image,
  Lightbulb,
  MessageSquare,
  TrendingUp,
  Type,
} from 'lucide-react';

export const NAV_LINKS = [
  { label: 'Features', href: '#features' },
  { label: 'How It Works', href: '#how-it-works' },
  { label: 'Testimonials', href: '#testimonials' },
];

export const FEATURES = [
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
    desc: 'Never run out of ideas. Get 8 tailored, trend aware content ideas for your niche on any platform instantly.',
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
    desc: "Stay ahead of the curve. See what's trending on each platform and save ideas directly to your content calendar.",
  },
];

export const TESTIMONIALS = [
  {
    name: 'Amara Okafor',
    platform: 'Fashion Creator · 82k followers',
    avatar: 'AO',
    color: 'from-pink-500 to-rose-500',
    quote:
      'IlliaAi replaced my entire content team for captions. I generate 20 captions in the time it used to take me to write one. My engagement went up 40% in 3 weeks.',
  },
  {
    name: 'Taiwo Adeyemi',
    platform: 'Tech Educator · 210k followers',
    avatar: 'TA',
    color: 'from-violet-500 to-purple-600',
    quote:
      "The trends dashboard is insane. I see what's blowing up on LinkedIn before it peaks and create content around it. That's my secret weapon right now.",
  },
  {
    name: 'Chisom Eze',
    platform: 'Food Creator · 55k followers',
    avatar: 'CE',
    color: 'from-amber-400 to-orange-500',
    quote:
      'I used to dread writing captions. Now I just describe my dish, pick a vibe, and boom 4 captions ready to post. This app is genuinely magic.',
  },
  {
    name: 'Kunle Balogun',
    platform: 'Business Coach · 120k followers',
    avatar: 'KB',
    color: 'from-cyan-400 to-blue-500',
    quote:
      'The content calendar alone is worth it. I can see my entire month at a glance. No more scrambling for ideas at midnight. IlliaAi is non-negotiable.',
  },
];

export const PLATFORMS = [
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

export const IMAGES = ['/PG1.jpeg', '/PG2.jpeg'];

export const HERO_PHRASES = [
  'That Connects.',
  'In Minutes.',
  'Easily.',
  'Anytime.',
  'Anywhere.',
];

export const DEFAULT_PEOPLE = [
  { x: 6, y: 19, src:"/creator.jpeg", delay:0},
  { x: 17, y: 4, src:"/AI.jpeg", delay:0.5 },
  { x: 2, y: 53, src:"/Aii.jpeg", delay:1 },
  { x: 19, y: 49, src:"/Blogger.jpeg", delay:1.5 },
  { x: 91, y: 7, src:"/Illia.jpeg", delay:2 },
  { x: 80, y: 18, src:"/PG1.jpeg", delay:2.5 },
  { x: 77, y: 53, src:"/PG2.jpeg" },
  { x: 93, y: 56, src:"/creator.jpeg" },
];