import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Moon, Sun, X, ArrowUpRight } from 'lucide-react';

import { NAV_LINKS } from '../../components/data/landingData';

const MOBILE_MENU_ID = 'mobile-menu';

// Internal routes ("/pricing") use the router; anchors ("#features") and
// external URLs use a normal <a> so they don't trigger a full reload by mistake
// or break in-page scrolling.
function NavItem({ href, className, onClick, children }) {
  const isRoute = href.startsWith('/') && !href.startsWith('//');
  if (isRoute) {
    return (
      <Link to={href} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} className={className} onClick={onClick}>
      {children}
    </a>
  );
}

export default function Navbar({
  theme,
  mobileOpen,
  scrolled,
  toggleTheme,
  setMobileOpen,
}) {
  const closeMenu = () => setMobileOpen(false);
  const themeLabel =
    theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode';

  // Close on Escape + lock page scroll while the mobile menu is open.
  useEffect(() => {
    if (!mobileOpen) return undefined;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen, setMobileOpen]);

  // Close the menu if the viewport grows past the mobile breakpoint.
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e) => {
      if (e.matches) setMobileOpen(false);
    };
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [setMobileOpen]);

  return (
    <nav className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 lg:px-8">
      {/* Main bar */}
      <div
        className={`mx-auto max-w-6xl rounded-2xl border transition-all duration-500 ${
          scrolled || mobileOpen
            ? 'border-border/70 bg-background/80 shadow-lg shadow-black/5 backdrop-blur-2xl'
            : 'border-transparent bg-transparent'
        }`}
      >
        <div className="flex h-[68px] items-center justify-between px-3 sm:px-4">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="ILLIA home"
            className="group flex items-center"
          >
            <img
              src="/ILLIA.png"
              alt="ILLIA"
              className="w-[150px] transition-transform duration-300 group-hover:scale-105"
            />
          </Link>

          {/* Desktop navigation */}
          <div className="hidden items-center gap-1 rounded-full border border-border/50 bg-background/40 p-1 backdrop-blur-md md:flex">
            {NAV_LINKS.map((link) => (
              <NavItem
                key={link.label}
                href={link.href}
                className="rounded-full px-4 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
              >
                {link.label}
              </NavItem>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden items-center gap-2 md:flex">
            <button
              type="button"
              onClick={toggleTheme}
              title={themeLabel}
              aria-label={themeLabel}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-muted hover:text-foreground"
            >
              {theme === 'dark' ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </button>

            <Link
              to="/login"
              className="rounded-full px-3.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              Log in
            </Link>

            <Link
              to="/register"
              className="group flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-xs font-semibold text-background shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
            >
              Start creating
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground backdrop-blur-md transition-all hover:bg-muted md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls={MOBILE_MENU_ID}
          >
            {mobileOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu (always mounted so it can animate; hidden from
          keyboard and screen readers while closed) */}
      <div
        id={MOBILE_MENU_ID}
        aria-hidden={!mobileOpen}
        className={`mx-auto max-w-6xl md:hidden grid transition-all duration-300 ${
          mobileOpen
            ? 'visible mt-2 grid-rows-[1fr] opacity-100'
            : 'invisible mt-0 grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-2xl backdrop-blur-2xl">
          <div className="max-h-[calc(100vh-7rem)] overflow-y-auto p-3">
            <div className="space-y-1">
              {NAV_LINKS.map((link) => (
                <NavItem
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                  <ArrowUpRight className="h-4 w-4 opacity-40" />
                </NavItem>
              ))}
            </div>

            <div className="my-3 h-px bg-border/60" />

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={themeLabel}
              className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <span>{theme === 'light' ? 'Dark mode' : 'Light mode'}</span>
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border">
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </span>
            </button>

            <Link
              to="/login"
              onClick={closeMenu}
              className="mt-1 block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              Log in
            </Link>

            <Link
              to="/register"
              onClick={closeMenu}
              className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-all hover:opacity-90"
            >
              Start creating
              <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}