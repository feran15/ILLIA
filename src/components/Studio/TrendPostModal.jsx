import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, BookmarkPlus, CalendarPlus, Star, Copy } from 'lucide-react';
import { toast } from 'sonner';

const PLATFORM_COLORS = {
  linkedin: 'bg-blue-500', instagram: 'bg-pink-500',
  twitter: 'bg-sky-400', facebook: 'bg-blue-600', tiktok: 'bg-red-500',
};

export default function TrendPostModal({ open, onClose, trend, platform }) {
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [generatedPost, setGeneratedPost] = useState('');
  const [generating, setGenerating] = useState(false);

  const { data: templates = [] } = useQuery({
    queryKey: ['contentTemplates'],
    queryFn: () => base44.entities.ContentTemplate.list('-is_favorite', 50),
    enabled: open,
  });

  const saveContent = useMutation({
    mutationFn: (data) => base44.entities.SavedContent.create(data),
    onSuccess: () => { toast.success('Saved to library!'); queryClient.invalidateQueries({ queryKey: ['savedContent'] }); }
  });

  const schedulePost = useMutation({
    mutationFn: (data) => base44.entities.ScheduledPost.create(data),
    onSuccess: () => { toast.success('Added to calendar!'); queryClient.invalidateQueries({ queryKey: ['scheduledPosts'] }); onClose(); }
  });

  const incrementUse = useMutation({
    mutationFn: (tmpl) => base44.entities.ContentTemplate.update(tmpl.id, { use_count: (tmpl.use_count || 0) + 1 }),
  });

  const generate = async () => {
    if (!trend) return;
    setGenerating(true);
    const templateHint = selectedTemplate
      ? `Use this template style/format as inspiration:\n"${selectedTemplate.content}"\n\n`
      : '';
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `${templateHint}Write an engaging ${platform} post about this trending topic:\nTitle: "${trend.title}"\nContext: ${trend.description}\nHashtag: ${trend.hashtag || ''}\n\nMake it concise, platform-optimized, and include relevant hashtags. Return only the post text.`
    });
    setGeneratedPost(response);
    if (selectedTemplate) incrementUse.mutate(selectedTemplate);
    setGenerating(false);
  };

  const handleSchedule = () => {
    if (!generatedPost) return;
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 1);
    schedulePost.mutate({
      title: trend.title,
      content: generatedPost,
      platforms: [platform],
      scheduled_date: tomorrow.toISOString().split('T')[0],
      scheduled_time: '10:00',
      publish_mode: 'reminder',
      status: 'scheduled',
      ai_generated: true,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Generate Post from Trend
          </DialogTitle>
        </DialogHeader>

        {trend && (
          <div className="bg-muted rounded-xl p-3 mb-4">
            <p className="font-semibold text-sm text-foreground">{trend.title}</p>
            <p className="text-xs text-muted-foreground mt-1">{trend.description}</p>
            {trend.hashtag && <span className="text-xs text-primary">{trend.hashtag.startsWith('#') ? trend.hashtag : `#${trend.hashtag}`}</span>}
          </div>
        )}

        {/* Template Selection */}
        <div className="mb-4">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Choose a Template (optional)</p>
          {templates.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No templates yet. Create some in the Templates page!</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {templates.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTemplate(selectedTemplate?.id === t.id ? null : t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all flex items-center gap-1 ${
                    selectedTemplate?.id === t.id
                      ? 'bg-primary/20 border-primary text-primary'
                      : 'bg-muted border-border text-muted-foreground hover:text-foreground hover:border-primary/40'
                  }`}
                >
                  {t.is_favorite && <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />}
                  {t.name}
                </button>
              ))}
            </div>
          )}
        </div>

        <Button onClick={generate} disabled={generating} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/30 mb-4">
          {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
          {generating ? 'Generating...' : 'Generate Post'}
        </Button>

        {generatedPost && (
          <div className="space-y-3">
            <Textarea
              value={generatedPost}
              onChange={e => setGeneratedPost(e.target.value)}
              className="resize-none bg-muted border-border text-foreground min-h-[120px]"
              rows={5}
            />
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => { navigator.clipboard.writeText(generatedPost); toast.success('Copied!'); }} className="border-border text-foreground">
                <Copy className="w-3.5 h-3.5 mr-1" /> Copy
              </Button>
              <Button size="sm" variant="outline" onClick={() => saveContent.mutate({ title: trend.title, content: generatedPost, content_type: 'post_idea', platform })} className="border-border text-foreground">
                <BookmarkPlus className="w-3.5 h-3.5 mr-1" /> Save
              </Button>
              <Button size="sm" onClick={handleSchedule} className="bg-gradient-to-r from-green-400 to-emerald-500 text-black font-semibold ml-auto">
                <CalendarPlus className="w-3.5 h-3.5 mr-1" /> Add to Calendar
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}