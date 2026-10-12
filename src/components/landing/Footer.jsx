
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ArrowUpRight,
  Globe,
  Mail,
  Heart,
  MessageCircle,
} from 'lucide-react';

const FOOTER_LINKS = {
  Product: [
    { label: 'Features', href: '#features' },
    { label: 'How It Works', href: '#how-it-works' },
    { label: 'Pricing', href: '#pricing' },
  ],
  Company: [
    { label: 'About IlliaAi', href: '#about' },
    { label: 'Contact', href: 'mailto:support@illiaai.com' },
    { label: 'Support', href: 'mailto:support@illiaai.com' },
  ],
  Legal: [
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
};

const SOCIAL_LINKS = [
  {
    label: 'Website',
    href: '/',
    Icon: Globe,
  },
  {
    label: 'Email',
    href: 'mailto:support@illiaai.com',
    Icon: Mail,
  },
  {
    label: 'Contact',
    href: 'mailto:support@illiaai.com',
    Icon: MessageCircle,
  },
];

export default function Footer() {
  return (
    <footer
      id="footer"
      className="relative overflow-hidden border-t border-border bg-background"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 h-64 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 pb-6 pt-14 sm:px-8 sm:pt-20 lg:px-10">
        <div className="grid gap-12 pb-12 sm:grid-cols-2 lg:grid-cols-5 lg:gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link
              to="/"
              aria-label="IlliaAi homepage"
              className="inline-flex items-center gap-2.5"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/20">
                <Sparkles className="h-5 w-5 text-white" />
              </div>

              <span className="font-display text-xl font-bold tracking-tight text-foreground">
                Illia<span className="text-primary">Ai</span>
              </span>
            </Link>

            <p className="mt-5 max-w-sm text-sm leading-7 text-muted-foreground">
              Your creative partner for captions, viral ideas, AI-generated
              visuals, and content planning. Create more, stress less.
            </p>

            <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
              Built for African creators
              <span aria-hidden="true">🌍</span>
            </div>

            {/* Contact links */}
            <div className="mt-6 flex items-center gap-3">
              {SOCIAL_LINKS.map(({ label, href, Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all duration-200 hover:-translate-y-1 hover:border-primary/40 hover:bg-primary/10 hover:text-primary"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer navigation */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h3 className="mb-5 text-sm font-semibold text-foreground">
                {heading}
              </h3>

              <ul className="space-y-3.5">
                {links.map(({ label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      className="group inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100" />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-border py-6 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p className="text-xs leading-6 text-muted-foreground">
            © {new Date().getFullYear()} IlliaAi. All rights reserved.
          </p>

          <p className="inline-flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
            Made with
            <Heart className="h-3.5 w-3.5 fill-red-500 text-red-500" />
            for creators across Africa.
          </p>

          <a
            href="#top"
            className="text-xs font-medium text-muted-foreground transition-colors hover:text-primary"
          >
            Back to top ↑
          </a>
        </div>
      </div>
    </footer>
  );
}