import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Star } from 'lucide-react';
import { toast } from 'sonner';

const TYPES = ['caption', 'post_idea', 'tweet', 'announcement', 'story', 'thread'];
const PLATFORMS = ['linkedin', 'instagram', 'twitter', 'facebook', 'tiktok'];

export default function TemplateFormModal({ open, onClose, template }) {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({ name: '', content: '', type: 'caption', platforms: [], tags: [], is_favorite: false });

  useEffect(() => {
    if (template) setForm({ name: template.name || '', content: template.content || '', type: template.type || 'caption', platforms: template.platforms || [], tags: template.tags || [], is_favorite: template.is_favorite || false });
    else setForm({ name: '', content: '', type: 'caption', platforms: [], tags: [], is_favorite: false });
  }, [template, open]);

const save = useMutation({ mutationFn: async (data) => {
    if (template) {
      return api(`/api/templates/${template.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });
    }

    return api('/api/templates', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  onSuccess: async () => {
    toast.success(
      template
        ? 'Template updated!'
        : 'Template created!'
    );

    await queryClient.invalidateQueries({
      queryKey: ['contentTemplates'],
    });

    onClose();
  },

  onError: (err) => {
    console.error(err);

    toast.error(
      err.data?.error ||
      err.message ||
      'Something went wrong'
    );
  },
});
  const togglePlatform = (p) => setForm(f => ({ ...f, platforms: f.platforms.includes(p) ? f.platforms.filter(x => x !== p) : [...f.platforms, p] }));

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="bg-card border-border max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-display text-foreground">{template ? 'Edit Template' : 'New Template'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Template Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="e.g. Engaging Hook Caption" className="w-full bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50" />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Type</label>
            <Select value={form.type} onValueChange={v => setForm(f => ({ ...f, type: v }))}>
              <SelectTrigger className="bg-muted border-border text-foreground"><SelectValue /></SelectTrigger>
              <SelectContent className="bg-card border-border">
                {TYPES.map(t => <SelectItem key={t} value={t} className="capitalize text-foreground">{t}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Template Content</label>
            <Textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your template here. Use [TREND], [YOUR TAKE], [HASHTAGS] as placeholders..." className="resize-none bg-muted border-border text-foreground min-h-[100px]" rows={4} />
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Platforms</label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map(p => (
              <button
  type="button"
  key={p}
  onClick={() => togglePlatform(p)}
  className={`px-3 py-1 rounded-full text-xs font-medium capitalize transition-all border ${
    form.platforms.includes(p)
      ? 'bg-primary/20 border-primary text-primary'
      : 'bg-muted border-border text-muted-foreground hover:text-foreground'
  }`}
>
  {p}
</button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setForm(f => ({ ...f, is_favorite: !f.is_favorite }))} className={`flex items-center gap-2 text-sm transition-colors ${form.is_favorite ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`}>
              <Star className={`w-4 h-4 ${form.is_favorite ? 'fill-yellow-400' : ''}`} /> Mark as Favorite
            </button>
          </div>
          <Button onClick={() => save.mutate(form)} disabled={save.isPending || !form.name.trim() || !form.content.trim()} className="w-full bg-gradient-to-r from-violet-500 to-purple-700 hover:opacity-90 text-white">
            {save.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {template ? 'Save Changes' : 'Create Template'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}