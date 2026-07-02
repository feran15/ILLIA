import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Sparkles,
  TrendingUp,
  CalendarDays,
  User,
  Zap,
  LayoutTemplate,
  Image as ImageIcon,
} from 'lucide-react';
import { signOut } from 'firebase/auth';
import { auth } from '../Firebase/config';
import { cn } from '@/lib/utils';
const nav = [
  { href: '/studio', label: 'AI Studio', icon: Sparkles },
  { href: '/studio/trends', label: 'Trends', icon: TrendingUp },
  { href: '/studio/calendar', label: 'Calendar', icon: CalendarDays },
  // { href: '/studio/templates', label: 'Templates', icon: LayoutTemplate },
  // { href: '/studio/media', label: 'Media Library', icon: ImageIcon },
  { href: '/studio/profile', label: 'Profile', icon: User },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <aside className="w-64 min-h-screen flex flex-col bg-sidebar border-r border-sidebar-border">
      
      {/* Logo */}
      <div className="px-6 py-6 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
          <Zap className="w-5 h-5 text-white" />
        </div>
        <Link to="/">
        <span className="font-display font-extrabold text-xl text-foreground tracking-tight">
          Illia<span className="text-primary">Ai</span>
        </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, label, icon: Icon }) => {
          const active =
            href === '/studio'
              ? location.pathname === href
              : location.pathname.startsWith(href);

          return (
            <Link
              key={href}
              to={href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-gradient-to-r from-primary/20 to-accent/10 text-primary border border-primary/30 shadow-sm'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              <Icon className={cn('w-5 h-5', active && 'text-primary')} />

              <span>{label}</span>

              {active && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4">
        <div className="rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 p-4">
          <p className="text-xs font-semibold text-primary mb-1">
            ✨ Pro Tip
          </p>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Use AI trends to find what's hot and generate captions in seconds.
          </p>
        </div>

        <button
          onClick={handleSignOut}
          className="mt-4 w-full rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600"
        >
          Sign Out
        </button>
      </div>
    </aside>
  );
}