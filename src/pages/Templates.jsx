import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../lib/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LayoutTemplate, Plus, Star, Trash2, Edit2, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import TemplateFormModal from '@/components/TemplateFormModal';

const PLATFORM_COLORS = {
  linkedin: 'bg-blue-500', instagram: 'bg-pink-500',
  twitter: 'bg-sky-400', facebook: 'bg-blue-600', tiktok: 'bg-red-500',
};

const TYPE_COLORS = {
  caption: 'bg-primary/10 text-primary border-primary/20',
  post_idea: 'bg-accent/10 text-accent border-accent/20',
  tweet: 'bg-sky-500/10 text-sky-400 border-sky-400/20',
  announcement: 'bg-yellow-500/10 text-yellow-400 border-yellow-400/20',
  story: 'bg-pink-500/10 text-pink-400 border-pink-400/20',
  thread: 'bg-orange-500/10 text-orange-400 border-orange-400/20',
};

export default function Templates() {
  const queryClient = useQueryClient();
  const [showModal, setShowModal] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState(null);
  const [filterType, setFilterType] = useState('all');

  const { data: templates = [],isLoading,} = useQuery({
  queryKey: ['contentTemplates'],
  queryFn: async () => {
    const res = await api('/api/templates');

    console.log('Templates:', res);

    return Array.isArray(res.templates)
      ? res.templates
      : [];
  },
});

const deleteTemplate = useMutation({ mutationFn: async (id) => {
    await api(`/api/templates/${id}`, {
      method: 'DELETE',
    });
  },

  onSuccess: async () => {
    toast.success('Template deleted.');

    await queryClient.invalidateQueries({
      queryKey: ['contentTemplates'],
    });
  },

  onError: (err) => {
    toast.error(err.message);
  },
});

const toggleFavorite = useMutation({ mutationFn: async (template) => {
    await api(`/api/templates/${template.id}`, {
      method: 'PUT',

      body: JSON.stringify({
        is_favorite: !template.is_favorite,
      }),
    });
  },

  onSuccess: async () => {
    await queryClient.invalidateQueries({
      queryKey: ['contentTemplates'],
    });
  },

  onError: (err) => {
    toast.error(err.message);
  },
});
  const types = ['all', ...new Set(templates.map(t => t.type).filter(Boolean))];
  const filtered = filterType === 'all' ? templates : templates.filter(t => t.type === filterType);
  const favorites = filtered.filter(t => t.is_favorite);
  const rest = filtered.filter(t => !t.is_favorite);

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-0">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg shadow-violet-500/30">
            <LayoutTemplate className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Templates</h1>
            <p className="text-muted-foreground text-sm">{templates.length} saved formats for faster creation</p>
          </div>
        </div>
        <Button onClick={() => { setEditingTemplate(null); setShowModal(true); }} className="bg-gradient-to-r from-violet-500 to-purple-700 hover:opacity-90 text-white font-semibold shadow-lg shadow-violet-500/30">
          <Plus className="w-4 h-4 mr-2" /> New Template
        </Button>
      </div>

      {/* Type Filter */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {types.map(type => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all capitalize ${
              filterType === type
                ? 'bg-gradient-to-r from-violet-500 to-purple-700 text-white shadow-lg'
                : 'bg-muted text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            {type}
          </button>
        ))}
      </div>

      {isLoading && <div className="text-center py-16 text-muted-foreground">Loading templates...</div>}

      {!isLoading && templates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-700/10 flex items-center justify-center">
            <LayoutTemplate className="w-8 h-8 text-violet-400 opacity-50" />
          </div>
          <p className="font-display font-semibold text-foreground">No templates yet</p>
          <p className="text-sm text-muted-foreground">Create your first template to speed up content creation</p>
          <Button onClick={() => setShowModal(true)} className="bg-gradient-to-r from-violet-500 to-purple-700 text-white">
            Create Template
          </Button>
        </div>
      )}

      {/* Favorites Section */}
      {favorites.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <h2 className="font-display font-semibold text-sm text-foreground">Favorites</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {favorites.map(t => <TemplateCard key={t.id} template={t} onEdit={() => { setEditingTemplate(t); setShowModal(true); }} onDelete={() => deleteTemplate.mutate(t.id)} onFavorite={() => toggleFavorite.mutate(t)} />)}
          </div>
        </div>
      )}

      {/* All Templates */}
      {rest.length > 0 && (
        <div>
          {favorites.length > 0 && <h2 className="font-display font-semibold text-sm text-foreground mb-3">All Templates</h2>}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rest.map(t => <TemplateCard key={t.id} template={t} onEdit={() => { setEditingTemplate(t); setShowModal(true); }} onDelete={() => deleteTemplate.mutate(t.id)} onFavorite={() => toggleFavorite.mutate(t)} />)}
          </div>
        </div>
      )}

      <TemplateFormModal open={showModal} onClose={() => { setShowModal(false); setEditingTemplate(null); }} template={editingTemplate} />
    </div>
  );
}

function TemplateCard({ template, onEdit, onDelete, onFavorite }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(template.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all group">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="font-display font-semibold text-sm text-foreground">{template.name}</p>
          {template.type && <Badge className={`text-xs capitalize border ${TYPE_COLORS[template.type] || 'bg-muted text-muted-foreground'}`}>{template.type}</Badge>}
        </div>
        <div className="flex gap-1 shrink-0">
          <button onClick={onFavorite} className={`p-1.5 rounded-lg transition-colors ${template.is_favorite ? 'text-yellow-400' : 'text-muted-foreground hover:text-yellow-400'}`}>
            <Star className={`w-3.5 h-3.5 ${template.is_favorite ? 'fill-yellow-400' : ''}`} />
          </button>
          <button onClick={onEdit} className="p-1.5 rounded-lg text-muted-foreground hover:text-primary transition-colors">
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button onClick={onDelete} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mb-3 line-clamp-3 whitespace-pre-wrap">{template.content}</p>
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {template.platforms?.slice(0, 4).map(p => <span key={p} className={`w-2 h-2 rounded-full ${PLATFORM_COLORS[p] || 'bg-muted'}`} title={p} />)}
        </div>
        <div className="flex items-center gap-2">
          {template.use_count > 0 && <span className="text-xs text-muted-foreground">Used {template.use_count}×</span>}
          <button onClick={copy} className="flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
            {copied ? <Check className="w-3 h-3 text-green-400" /> : null}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}