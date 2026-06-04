import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, Clock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const PLATFORMS = ['linkedin', 'instagram', 'twitter', 'facebook', 'tiktok'];

const BEST_TIMES = {
  linkedin: '08:00–10:00 AM (Tue–Thu)',
  instagram: '11:00 AM–1:00 PM (Mon, Wed)',
  twitter: '12:00–3:00 PM (Weekdays)',
  facebook: '1:00–4:00 PM (Wed–Fri)',
  tiktok: '7:00–9:00 PM (Daily)',
};

export default function PostFormModal({ open, onClose, post }) {
  const queryClient = useQueryClient();
  const isEdit = !!post;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [platforms, setPlatforms] = useState([]);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('12:00');
  const [publishMode, setPublishMode] = useState('reminder');
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    if (post) {
      setTitle(post.title || '');
      setContent(post.content || '');
      setPlatforms(post.platforms || []);
      setDate(post.scheduled_date || '');
      setTime(post.scheduled_time || '12:00');
      setPublishMode(post.publish_mode || 'reminder');
    } else {
      setTitle(''); setContent(''); setPlatforms([]); setDate(''); setTime('12:00'); setPublishMode('reminder');
    }
  }, [post, open]);

  const createPost = useMutation({
    mutationFn: (data) => isEdit ? base44.entities.ScheduledPost.update(post.id, data) : base44.entities.ScheduledPost.create(data),
    onSuccess: () => {
      toast.success(isEdit ? 'Post updated!' : 'Post scheduled! You\'ll get reminders before it\'s time to post 🔔');
      queryClient.invalidateQueries({ queryKey: ['scheduledPosts'] });
      onClose();
    }
  });

  const togglePlatform = (p) => {
    setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]);
  };

  const generateWithAI = async () => {
    if (!title.trim()) return toast.error('Add a title/topic first!');
    setAiLoading(true);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Write an engaging social media post about: "${title}". Make it compelling, with a hook, value, and call-to-action. Include relevant hashtags. Keep it under 300 words.`
    });
    setContent(response);
    setAiLoading(false);
  };

  const handleSave = () => {
    if (!title.trim() || !content.trim() || platforms.length === 0 || !date || !time) {
      return toast.error('Please fill in all fields and select at least one platform.');
    }
    createPost.mutate({ title, content, platforms, scheduled_date: date, scheduled_time: time, publish_mode: publishMode, status: 'scheduled', ai_generated: false });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border text-foreground max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-xl font-bold">{isEdit ? 'Edit Post' : 'Schedule New Post'}</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 mt-2">
          {/* Title */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Post Title / Topic</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="What's this post about?" className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>

          {/* Content */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Post Content</label>
              <Button size="sm" variant="ghost" onClick={generateWithAI} disabled={aiLoading} className="text-primary hover:bg-primary/10 text-xs gap-1">
                {aiLoading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Write with AI
              </Button>
            </div>
            <Textarea value={content} onChange={e => setContent(e.target.value)} placeholder="Write your post content here..." rows={5} className="resize-none bg-muted border-border text-foreground placeholder:text-muted-foreground" />
          </div>

          {/* Platforms */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Platforms</label>
            <div className="flex flex-wrap gap-2">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => togglePlatform(p)} className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-all ${platforms.includes(p) ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md' : 'bg-muted text-muted-foreground hover:text-foreground border border-border'}`}>
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Best Times Hint */}
          {platforms.length > 0 && (
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-3">
              <p className="text-xs font-semibold text-primary flex items-center gap-1 mb-2"><Clock className="w-3 h-3" /> AI-Recommended Best Times</p>
              <div className="space-y-1">
                {platforms.map(p => (
                  <div key={p} className="flex justify-between text-xs">
                    <span className="text-muted-foreground capitalize">{p}</span>
                    <span className="text-foreground font-medium">{BEST_TIMES[p]}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Date</label>
              <input type="date" value={date} onChange={e => setDate(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
            <div>
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Time</label>
              <input type="time" value={time} onChange={e => setTime(e.target.value)} className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
            </div>
          </div>

          {/* Publish Mode */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Publish Mode</label>
            <Select value={publishMode} onValueChange={setPublishMode}>
              <SelectTrigger className="bg-muted border-border text-foreground"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                <SelectItem value="reminder" className="text-foreground">🔔 Reminder Only — I'll post manually</SelectItem>
                <SelectItem value="auto_publish" className="text-foreground">⚡ Auto-Publish — Post automatically</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">You'll receive reminders at 4 hours, 2 hours, and 5 minutes before your post time.</p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={onClose} className="flex-1 border-border text-foreground hover:bg-muted">Cancel</Button>
            <Button onClick={handleSave} disabled={createPost.isPending} className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/30">
              {createPost.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
              {isEdit ? 'Save Changes' : 'Schedule Post'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}