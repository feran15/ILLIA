import { useState, useEffect, useCallback } from 'react';
import { base44 } from '@/api/base44Client';

const FREE_LIMIT = 5;

function getTodayWAT() {
  // WAT is UTC+1
  const now = new Date();
  const wat = new Date(now.getTime() + 60 * 60 * 1000);
  return wat.toISOString().split('T')[0];
}

export function usePaywall() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const u = await base44.auth.me();
    setUser(u);
    setLoading(false);
    return u;
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // Check and reset daily count on load
  useEffect(() => {
    if (!user) return;
    const today = getTodayWAT();
    if (user.lastResetDate !== today) {
      base44.auth.updateMe({ dailyCount: 0, lastResetDate: today }).then(() => {
        setUser(u => ({ ...u, dailyCount: 0, lastResetDate: today }));
      });
    }
  }, [user?.id]);

  const isPaid = user?.plan === 'starter' || user?.plan === 'pro';
  const dailyCount = user?.dailyCount || 0;
  const isAtLimit = !isPaid && dailyCount >= FREE_LIMIT;

  // Soft banner logic: dismissed between 24-72h ago, not dismissed today
  const showSoftBanner = (() => {
    if (!user || isPaid) return false;
    const today = getTodayWAT();
    if (user.bannerDismissedDate === today) return false;
    if (!user.paywallDismissedAt) return false;
    const dismissedMs = new Date(user.paywallDismissedAt).getTime();
    const nowMs = Date.now();
    const hoursAgo = (nowMs - dismissedMs) / (1000 * 60 * 60);
    return hoursAgo >= 24 && hoursAgo <= 72;
  })();

  const shouldShowFullPaywall = (() => {
    if (!user || isPaid) return false;
    if (!user.paywallDismissedAt) return isAtLimit;
    const dismissedMs = new Date(user.paywallDismissedAt).getTime();
    const hoursAgo = (Date.now() - dismissedMs) / (1000 * 60 * 60);
    return isAtLimit && hoursAgo >= 24;
  })();

  const incrementCount = useCallback(async () => {
    if (isPaid) return true;
    const today = getTodayWAT();
    const yesterday = new Date(Date.now() - 86400000 + 60 * 60 * 1000).toISOString().split('T')[0];
    const newCount = dailyCount + 1;
    const updates = { dailyCount: newCount, lastResetDate: today };

    // Track consecutive limit days
    if (newCount >= FREE_LIMIT) {
      const lastLimit = user?.lastLimitDate;
      const consec = lastLimit === yesterday ? (user?.consecutiveLimitDays || 0) + 1 : 1;
      updates.consecutiveLimitDays = consec;
      updates.lastLimitDate = today;
    }

    // await base44.auth.updateMe(updates);
    setUser(u => ({ ...u, ...updates }));
    return newCount <= FREE_LIMIT;
  }, [isPaid, dailyCount, user]);

  const dismissPaywall = useCallback(async () => {
    const ts = new Date().toISOString();
    await base44.auth.updateMe({ paywallDismissedAt: ts });
    setUser(u => ({ ...u, paywallDismissedAt: ts }));
  }, []);

  const dismissBanner = useCallback(async () => {
    const today = getTodayWAT();
    await base44.auth.updateMe({ bannerDismissedDate: today });
    setUser(u => ({ ...u, bannerDismissedDate: today }));
  }, []);

  const upgradeToPaid = useCallback(async () => {
    const today = getTodayWAT();
    const renewalDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const updates = { plan: 'starter', planStartDate: today, planRenewalDate: renewalDate };
    await base44.auth.updateMe(updates);
    setUser(u => ({ ...u, ...updates }));
  }, []);

  return {
    user,
    loading,
    isPaid,
    dailyCount,
    isAtLimit,
    showSoftBanner,
    shouldShowFullPaywall,
    incrementCount,
    dismissPaywall,
    dismissBanner,
    upgradeToPaid,
    refetchUser: fetchUser,
    consecutiveLimitDays: user?.consecutiveLimitDays || 0,
  };
}