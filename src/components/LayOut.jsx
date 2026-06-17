import { Outlet } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import NotificationPanel from './NotificationPanel';
import Onboarding from './Onboarding';
import GuidedTour from './GuidedTour';
import { Sun, Moon, Bell } from 'lucide-react';
import { base44 } from '@/api/base44Client';

export default function Layout() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showTour, setShowTour] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u) return;
      setUserProfile(u);
      if (!u.onboardingComplete) {
        setShowOnboarding(true);
      } else if (!u.tourComplete) {
        // Small delay so the page renders before the tour overlay appears
        setTimeout(() => setShowTour(true), 800);
      }
    }).catch(() => {});
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

  const toggleTheme = () => setTheme(t => t === 'dark' ? 'light' : 'dark');

  const handleOnboardingComplete = async () => {
    const u = await base44.auth.me().catch(() => null);
    setUserProfile(u);
    setShowOnboarding(false);
    // Start tour after onboarding
    setTimeout(() => setShowTour(true), 600);
  };

  const displayName = userProfile?.onboardingName || userProfile?.full_name || '';
  const countryFlag = userProfile?.countryFlag || '';

  return (
    <div className="min-h-screen bg-background flex font-body">
      {showOnboarding && <Onboarding onComplete={handleOnboardingComplete} />}
      {showTour && !showOnboarding && (
        <GuidedTour onComplete={() => setShowTour(false)} />
      )}

      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-auto">
        {/* Mobile top bar */}
        <div className="md:hidden">
          <MobileNav />
        </div>

        {/* Top-right controls */}
        <div className="flex justify-end items-center gap-2 px-4 md:px-8 pt-4 md:pt-6">
          {displayName && (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border text-sm text-foreground">
              {countryFlag && <span className="text-base">{countryFlag}</span>}
              <span className="font-medium hidden sm:inline">{displayName}</span>
            </div>
          )}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(v => !v)}
              className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-12 z-50">
                <NotificationPanel onClose={() => setShowNotifications(false)} />
              </div>
            )}
          </div>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
        </div>

        <div className="flex-1 p-4 md:p-8 pt-2 md:pt-4">
          <Outlet />
        </div>
      </main>
    </div>
  );
}