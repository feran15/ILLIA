import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Bell, CalendarDays, TrendingUp, Mail, Loader2, X, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationPanel({ onClose }) {
  const [sendingSchedule, setSendingSchedule] = useState(false);
  const [sendingTrends, setSendingTrends] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: posts = [] } = useQuery({
    queryKey: ['scheduledPosts'],
    queryFn: () => base44.entities.ScheduledPost.list('-scheduled_date', 100),
    select: (posts) => {
      const today = new Date().toISOString().split('T')[0];
      return posts.filter(p => p.scheduled_date === today && p.status !== 'published');
    }
  });

  const sendScheduleSummary = async () => {
    if (!user?.email) return toast.error('No email found on your account.');
    setSendingSchedule(true);
    const postList = posts.length > 0
      ? posts.map(p => `• ${p.title} — ${p.scheduled_time} on ${p.platforms?.join(', ')}`).join('\n')
      : 'No posts scheduled for today.';
    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `📅 CreatorAI — Today's Scheduled Posts (${new Date().toLocaleDateString()})`,
      body: `Hi there!\n\nHere's your daily content summary for today:\n\n${postList}\n\nStay consistent and keep creating! 🚀\n\n— CreatorAI`
    });
    setSendingSchedule(false);
    toast.success('Schedule summary sent to your email!');
  };

  const checkAndAlertTrends = async () => {
    if (!user?.email) return toast.error('No email found on your account.');
    setSendingTrends(true);
    const result = await base44.integrations.Core.InvokeLLM({
      prompt: `What are the top 3 MAJOR new trends emerging RIGHT NOW on social media in ${new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}? Focus only on truly significant, viral, or newly breaking trends — not ongoing evergreen topics. For each: give a title, why it's major right now, and a content idea to leverage it. Be concise.`,
      add_context_from_internet: true,
    });
    await base44.integrations.Core.SendEmail({
      to: user.email,
      subject: `🔥 CreatorAI — Major Trend Alert!`,
      body: `New major trends detected!\n\n${result}\n\nAct fast — trends move quickly! 💨\n\n— CreatorAI`
    });
    setSendingTrends(false);
    toast.success('Trend alert sent to your email!');
  };

  return (
    <div className="w-80 bg-card border border-border rounded-2xl shadow-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bell className="w-4 h-4 text-primary" />
          <p className="font-display font-bold text-sm text-foreground">Notifications</p>
        </div>
        <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Today's Schedule */}
      <div className="mb-4 p-3 rounded-xl bg-muted border border-border">
        <div className="flex items-center gap-2 mb-2">
          <CalendarDays className="w-4 h-4 text-green-400" />
          <p className="text-xs font-semibold text-foreground">Today's Posts</p>
          {posts.length > 0 && (
            <span className="ml-auto text-xs bg-green-500/10 text-green-400 px-2 py-0.5 rounded-full font-medium">{posts.length} scheduled</span>
          )}
        </div>
        {posts.length === 0 ? (
          <p className="text-xs text-muted-foreground">No posts scheduled for today.</p>
        ) : (
          <div className="space-y-1">
            {posts.slice(0, 3).map(p => (
              <div key={p.id} className="text-xs text-foreground flex items-center gap-1">
                <Check className="w-3 h-3 text-green-400 shrink-0" />
                <span className="truncate">{p.title}</span>
                <span className="text-muted-foreground ml-auto shrink-0">{p.scheduled_time}</span>
              </div>
            ))}
          </div>
        )}
        <button
          onClick={sendScheduleSummary}
          disabled={sendingSchedule}
          className="mt-3 w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg bg-green-500/10 text-green-400 hover:bg-green-500/20 transition-colors font-medium disabled:opacity-50"
        >
          {sendingSchedule ? <Loader2 className="w-3 h-3 animate-spin" /> : <Mail className="w-3 h-3" />}
          {sendingSchedule ? 'Sending...' : 'Email me today\'s summary'}
        </button>
      </div>

      {/* Trend Alert */}
      <div className="p-3 rounded-xl bg-muted border border-border">
        <div className="flex items-center gap-2 mb-2">
          <TrendingUp className="w-4 h-4 text-orange-400" />
          <p className="text-xs font-semibold text-foreground">Trend Alert</p>
        </div>
        <p className="text-xs text-muted-foreground mb-3">Get an email with today's major emerging social media trends.</p>
        <button
          onClick={checkAndAlertTrends}
          disabled={sendingTrends}
          className="w-full flex items-center justify-center gap-2 text-xs py-2 rounded-lg bg-orange-500/10 text-orange-400 hover:bg-orange-500/20 transition-colors font-medium disabled:opacity-50"
        >
          {sendingTrends ? <Loader2 className="w-3 h-3 animate-spin" /> : <TrendingUp className="w-3 h-3" />}
          {sendingTrends ? 'Checking trends...' : 'Alert me to new trends'}
        </button>
        <p className="text-xs text-muted-foreground mt-2 text-center">Uses AI web search · costs integration credits</p>
      </div>
    </div>
  );
}