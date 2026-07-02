import { Link, useLocation } from 'react-router-dom';
import { Sparkles, TrendingUp, CalendarDays, User, Zap, LayoutTemplate, Image } from 'lucide-react';
import { cn } from '@/lib/utils';

const nav = [
  { href: '/studio', label: 'AI', icon: Sparkles },
  { href: '/studio/trends', label: 'Trends', icon: TrendingUp },
  { href: '/studio/calendar', label: 'Calendar', icon: CalendarDays },
  // { href: '/studio/templates', label: 'Templates', icon: LayoutTemplate },
  // { href: '/studio/media', label: 'Media', icon: Image },
  { href: '/studio/profile', label: 'Profile', icon: User },
  { href: '/', label: 'SignOut', icon: User },
];

export default function MobileNav() {
  const location = useLocation();
  return (
    <>
      <div className="flex items-center gap-2 px-4 py-4 border-b border-border bg-[hsl(240,20%,7%)]">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <Zap className="w-4 h-4 text-white" />
        </div>
        <span className="font-display font-bold text-lg text-foreground">Illia<span className="text-primary">Ai</span></span>
      </div>
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[hsl(240,20%,7%)] border-t border-border flex justify-around py-2">
        {nav.map(({ href, label, icon: Icon }) => {
          const active = href === '/studio' ? location.pathname === href : location.pathname.startsWith(href);
          return (
            <Link key={href} to={href} className={cn('flex flex-col items-center gap-1 px-3 py-2 rounded-lg text-xs transition-colors', active ? 'text-primary' : 'text-muted-foreground')}>
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>
    </>
  );
}