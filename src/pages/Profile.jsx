import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Link2, Bell, Check, Loader2, Zap } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { toast } from 'sonner';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', color: 'from-pink-500 to-purple-600', icon: '📷', placeholder: '@yourusername' },
  { id: 'twitter', label: 'X / Twitter', color: 'from-sky-400 to-blue-500', icon: '𝕏', placeholder: '@handle' },
  { id: 'linkedin', label: 'LinkedIn', color: 'from-blue-600 to-blue-800', icon: '💼', placeholder: 'Profile URL or username' },
  { id: 'tiktok', label: 'TikTok', color: 'from-red-500 to-pink-600', icon: '🎵', placeholder: '@tiktokhandle' },
  { id: 'facebook', label: 'Facebook', color: 'from-blue-500 to-indigo-600', icon: '👤', placeholder: 'Page name or URL' },
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [connectedAccounts, setConnectedAccounts] = useState([]);
  const [socialHandles, setSocialHandles] = useState({});
  const [remindersEmail, setRemindersEmail] = useState(true);
  const [remindersInApp, setRemindersInApp] = useState(true);
  const [niche, setNiche] = useState('');
  const [username, setUsername] = useState('');
  const [alertCategories, setAlertCategories] = useState([]);
  const [alertCategoryInput, setAlertCategoryInput] = useState('');
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [checkingTrends, setCheckingTrends] = useState(false);

  useEffect(() => {
    base44.auth.me().then(u => {
      setUser(u);
      setNiche(u?.niche || '');
      setUsername(u?.username || '');
      setConnectedAccounts(u?.connected_accounts || []);
      setSocialHandles(u?.social_handles || {});
      setRemindersEmail(u?.reminders_email !== false);
      setRemindersInApp(u?.reminders_in_app !== false);
      setAlertCategories(u?.alert_categories || []);
      setAlertsEnabled(u?.trend_alerts_enabled || false);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const toggleAccount = (platformId) => {
    setConnectedAccounts(prev =>
      prev.includes(platformId) ? prev.filter(p => p !== platformId) : [...prev, platformId]
    );
  };

  const addAlertCategory = () => {
    const cat = alertCategoryInput.trim();
    if (cat && !alertCategories.includes(cat)) {
      setAlertCategories(prev => [...prev, cat]);
      setAlertCategoryInput('');
    }
  };

  const checkTrendsNow = async () => {
    if (alertCategories.length === 0) return toast.error('Add at least one category first!');
    setCheckingTrends(true);
    const cats = alertCategories.join(', ');
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `What are the top 3 biggest trending topics right now in these categories: ${cats}? Focus on major, breaking, or viral trends from ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}. Return JSON.`,
      add_context_from_internet: true,
      response_json_schema: { type: 'object', properties: { trends: { type: 'array', items: { type: 'object', properties: { category: { type: 'string' }, title: { type: 'string' }, summary: { type: 'string' } } } } } }
    });
    const trendsText = (response.trends || []).map((t, i) => `${i+1}. [${t.category}] ${t.title}\n   ${t.summary}`).join('\n\n');
    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `🔥 Trending Alert: Top Topics in ${cats}`,
      body: `Hey ${user.full_name || 'Creator'}!\n\nHere are today's top trending topics in your categories (${cats}):\n\n${trendsText}\n\nLog in to IlliaAi to generate posts from these trends instantly!\n\n— IlliaAi 🚀`
    });
    await base44.auth.updateMe({ last_trend_alert: new Date().toISOString() });
    toast.success('Trend alert sent to your email!');
    setCheckingTrends(false);
  };

  const saveProfile = async () => {
    setSaving(true);
    await base44.auth.updateMe({ niche, username, connected_accounts: connectedAccounts, social_handles: socialHandles, reminders_email: remindersEmail, reminders_in_app: remindersInApp, alert_categories: alertCategories, trend_alerts_enabled: alertsEnabled });
    toast.success('Profile saved!');
    setSaving(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center py-24">
      <Loader2 className="w-8 h-8 animate-spin text-primary" />
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto pb-20 md:pb-0">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
          <User className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Profile</h1>
          <p className="text-muted-foreground text-sm">Manage your account and preferences</p>
        </div>
      </div>

      {/* Profile Info */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white text-2xl font-bold font-display shadow-lg">
            {user?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-display font-bold text-lg text-foreground">{user?.full_name || 'Creator'}</p>
              {(user?.plan === 'starter' || user?.plan === 'pro') && (
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30 text-xs capitalize">{user.plan}</Badge>
              )}
            </div>
            <p className="text-muted-foreground text-sm">{user?.email}</p>
            <Badge className="mt-1 bg-primary/10 text-primary border-primary/20 text-xs capitalize">{user?.role || 'creator'}</Badge>
            {user?.plan === 'free' && user?.planRenewalDate && new Date(user.planRenewalDate) < new Date() && (
              <p className="text-xs text-muted-foreground mt-1">Your Starter plan ended on {user.planRenewalDate}. You're now on the free plan — 5 captions per day. Upgrade again any time.</p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Display Name / Handle</label>
            <input value={username} onChange={e => setUsername(e.target.value)} placeholder="@yourusername" className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Your Content Niche</label>
            <input value={niche} onChange={e => setNiche(e.target.value)} placeholder="e.g. fitness, personal finance, travel, tech..." className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <p className="text-xs text-muted-foreground mt-1">AI uses this to generate more relevant content ideas for you.</p>
          </div>
        </div>
      </div>

      {/* Connected Accounts */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Link2 className="w-5 h-5 text-primary" />
          <h2 className="font-display font-bold text-base text-foreground">Connected Platforms</h2>
        </div>
        <div className="space-y-3">
          {PLATFORMS.map(platform => {
            const isConnected = connectedAccounts.includes(platform.id);
            return (
              <div key={platform.id} className={`p-3 rounded-xl border transition-all ${isConnected ? 'border-primary/30 bg-primary/5' : 'border-border bg-muted/30'}`}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-white text-sm font-bold`}>
                      {platform.icon}
                    </div>
                    <p className="font-medium text-sm text-foreground">{platform.label}</p>
                  </div>
                  <button
                    onClick={() => toggleAccount(platform.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      isConnected
                        ? 'bg-primary/10 text-primary hover:bg-primary/20 border border-primary/30'
                        : 'bg-muted text-muted-foreground hover:text-foreground border border-border hover:border-primary/30'
                    }`}
                  >
                    {isConnected ? '✓ Connected' : 'Connect'}
                  </button>
                </div>
                <input
                  value={socialHandles[platform.id] || ''}
                  onChange={e => setSocialHandles(prev => ({ ...prev, [platform.id]: e.target.value }))}
                  placeholder={platform.placeholder}
                  className="w-full bg-background border border-border rounded-lg px-3 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Notification Preferences */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Bell className="w-5 h-5 text-accent" />
          <h2 className="font-display font-bold text-base text-foreground">Reminder Preferences</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">You will receive reminders at 4 hours, 2 hours, and 5 minutes before each scheduled post.</p>
        <div className="space-y-3">
          {[
            { key: 'email', label: 'Email Reminders', desc: 'Get reminders in your inbox', value: remindersEmail, set: setRemindersEmail },
            { key: 'inapp', label: 'In-App Notifications', desc: 'Notifications inside IlliaAi', value: remindersInApp, set: setRemindersInApp },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 bg-muted rounded-xl">
              <div>
                <p className="font-medium text-sm text-foreground">{item.label}</p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
              <button
                onClick={() => item.set(!item.value)}
                className={`relative w-11 h-6 rounded-full transition-colors ${item.value ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-border'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${item.value ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Trend Alerts */}
      <div className="bg-card border border-border rounded-2xl p-6 mb-6">
        <div className="flex items-center gap-2 mb-2">
          <Zap className="w-5 h-5 text-yellow-400" />
          <h2 className="font-display font-bold text-base text-foreground">Daily Trend Alerts</h2>
        </div>
        <p className="text-xs text-muted-foreground mb-4">Get an email alert when major trends emerge in your chosen categories.</p>
        <div className="mb-3">
          <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Your Alert Categories</label>
          <div className="flex gap-2 mb-2">
            <input value={alertCategoryInput} onChange={e => setAlertCategoryInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && addAlertCategory()} placeholder="e.g. AI, crypto, fitness..." className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            <Button onClick={addAlertCategory} size="sm" variant="outline" className="border-border text-foreground">Add</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {alertCategories.map(cat => (
              <span key={cat} className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20">
                {cat}
                <button onClick={() => setAlertCategories(prev => prev.filter(c => c !== cat))} className="ml-1 text-primary/60 hover:text-primary">×</button>
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center justify-between p-3 bg-muted rounded-xl mb-3">
          <div>
            <p className="font-medium text-sm text-foreground">Enable Daily Alerts</p>
            <p className="text-xs text-muted-foreground">Auto-check trends and email you daily</p>
          </div>
          <button onClick={() => setAlertsEnabled(!alertsEnabled)} className={`relative w-11 h-6 rounded-full transition-colors ${alertsEnabled ? 'bg-gradient-to-r from-primary to-secondary' : 'bg-border'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${alertsEnabled ? 'translate-x-6' : 'translate-x-1'}`} />
          </button>
        </div>
        <Button onClick={checkTrendsNow} disabled={checkingTrends} variant="outline" className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
          {checkingTrends ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Zap className="w-4 h-4 mr-2" />}
          {checkingTrends ? 'Checking trends...' : 'Check Trends Now & Email Me'}
        </Button>
      </div>

      <Button onClick={saveProfile} disabled={saving} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/30 py-6 text-base font-semibold">
        {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
        Save Changes
      </Button>
    </div>
  );
}