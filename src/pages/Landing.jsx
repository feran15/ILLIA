import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Navbar from '../components/landing/NavBar';
import Hero from '../components/landing/Hero';
import PlatformMarquee from '../components/landing/PlatformMarquee';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowitWorks';
import Testimonials from '../components/landing/Testimonials';
import CTA from '../components/landing/CTA';
import AnalyticsShowcase from '../components/landing/AnalyticsShowcase';
import Footer from '../components/landing/Footer';

export default function Landing() {
  const navigate = useNavigate();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const [theme, setTheme] = useState(
    () => localStorage.getItem('theme') || 'light'
  );

  // Theme
  useEffect(() => {
    const root = document.documentElement;

    root.classList.toggle(
      'dark',
      theme === 'dark'
    );

    root.classList.toggle(
      'light',
      theme === 'light'
    );

    localStorage.setItem('theme', theme);
  }, [theme]);

  // Scroll
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', onScroll);

    return () => {
      window.removeEventListener(
        'scroll',
        onScroll
      );
    };
  }, []);

  const toggleTheme = () => {
    setTheme((current) =>
      current === 'dark'
        ? 'light'
        : 'dark'
    );
  };

  const handleNavigate = (path, options) => {
    navigate(path, options);
  };

  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-foreground">

      {/* NAVBAR */}
      <Navbar
        theme={theme}
        mobileOpen={mobileOpen}
        scrolled={scrolled}
        toggleTheme={toggleTheme}
        setMobileOpen={setMobileOpen}
      />

      {/* HERO */}
      <Hero
        onNavigate={handleNavigate}
      />

      {/* PLATFORMS */}
      <PlatformMarquee />
      {/* Analytics */}
        <AnalyticsShowcase/>

      {/* FEATURES */}
      {/* <Features /> */}

      {/* HOW IT WORKS */}
      <HowItWorks
        onCtaClick={() => navigate('/register')}
      />

      {/* TESTIMONIALS */}
      <Testimonials />

        
      {/* CTA */}
      <CTA />

      {/* FOOTER */}
      <Footer />

    </div>
  );
}