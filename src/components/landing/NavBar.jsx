
import { Link } from 'react-router-dom';
import {
  Menu,
  Moon,
  Sparkles,
  Sun,
  X,
  ArrowUpRight,
} from 'lucide-react';

import { NAV_LINKS } from '../../components/data/landingData';

export default function Navbar({
  theme,
  mobileOpen,
  scrolled,
  toggleTheme,
  setMobileOpen,
}) {
  return (
    <>
      {/* =====================================================
          DESKTOP / MAIN NAVBAR
      ====================================================== */}

      <nav className="fixed left-0 right-0 top-0 z-50 px-3 pt-3 sm:px-5 lg:px-8">

        <div
          className={`mx-auto max-w-6xl transition-all duration-500 ${
            scrolled
              ? 'rounded-2xl border border-border/70 bg-background/80 shadow-lg shadow-black/5 backdrop-blur-2xl'
              : 'rounded-2xl border border-transparent bg-transparent'
          }`}
        >

          <div className="flex h-[68px] items-center justify-between px-3 sm:px-4">

            {/* =================================================
                LOGO
            ================================================== */}

            <Link
              to="/"
              className="group flex items-center gap-2.5"
            >

              <div className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-xl bg-foreground shadow-sm transition-transform duration-300 group-hover:scale-105">

                <div className="absolute inset-0 bg-gradient-to-br from-primary via-secondary to-accent opacity-90" />

                <Sparkles className="relative h-4 w-4 text-white" />

              </div>

              <div className="flex items-center gap-2">

                <span className="font-display text-lg font-bold tracking-tight text-foreground">
                  IlliaAi
                </span>

                {/* <span className="hidden rounded-full border border-border bg-muted/50 px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-muted-foreground sm:inline-flex">
                  AI Studio
                </span> */}

              </div>

            </Link>

            {/* =================================================
                DESKTOP NAVIGATION
            ================================================== */}

            <div className="hidden items-center gap-1 rounded-full border border-border/50 bg-background/40 p-1 backdrop-blur-md md:flex">

              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-4 py-2 text-xs font-medium text-muted-foreground transition-all duration-200 hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}

            </div>

            {/* =================================================
                DESKTOP ACTIONS
            ================================================== */}

            <div className="hidden items-center gap-2 md:flex">

              {/* Theme */}

              <button
                onClick={toggleTheme}
                title={
                  theme === 'light'
                    ? 'Switch to dark mode'
                    : 'Switch to light mode'
                }
                aria-label={
                  theme === 'light'
                    ? 'Switch to dark mode'
                    : 'Switch to light mode'
                }
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60 bg-background/60 text-muted-foreground transition-all duration-200 hover:border-primary/30 hover:bg-muted hover:text-foreground"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </button>

              {/* Login */}

              <Link
                to="/login"
                className="rounded-full px-3.5 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>

              {/* CTA */}

              <Link
                to="/register"
                className="group flex items-center gap-1.5 rounded-full bg-foreground px-4 py-2.5 text-xs font-semibold text-background shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg"
              >
                Start creating

                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>

            </div>

            {/* =================================================
                MOBILE BUTTON
            ================================================== */}

            <button
              onClick={() => setMobileOpen((v) => !v)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-border/60 bg-background/70 text-foreground backdrop-blur-md transition-all hover:bg-muted md:hidden"
              aria-label="Toggle menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

          </div>

        </div>

        {/* =====================================================
            MOBILE MENU
        ====================================================== */}

        {mobileOpen && (
          <div className="mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl border border-border/70 bg-background/95 shadow-2xl backdrop-blur-2xl md:hidden">

            <div className="p-3">

              {/* Navigation */}

              <div className="space-y-1">

                {NAV_LINKS.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    {link.label}

                    <ArrowUpRight className="h-4 w-4 opacity-40" />
                  </a>
                ))}

              </div>

              {/* Divider */}

              <div className="my-3 h-px bg-border/60" />

              {/* Theme */}

              <button
                onClick={toggleTheme}
                className="flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >

                <span>
                  {theme === 'light'
                    ? 'Dark mode'
                    : 'Light mode'}
                </span>

                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-border">

                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4" />
                  ) : (
                    <Moon className="h-4 w-4" />
                  )}

                </span>

              </button>

              {/* Login */}

              <Link
                to="/login"
                onClick={() => setMobileOpen(false)}
                className="mt-1 block rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                Log in
              </Link>

              {/* CTA */}

              <Link
                to="/register"
                onClick={() => setMobileOpen(false)}
                className="group mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-foreground px-4 py-3 text-sm font-semibold text-background transition-all hover:opacity-90"
              >
                Start creating

                <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />

              </Link>

            </div>

          </div>
        )}

      </nav>
    </>
  );
}