import { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Image, Upload, Sparkles, Loader2, Trash2, Download, Video, Plus, Pencil, Check, X } from 'lucide-react';
import { toast } from 'sonner';

export default function MediaLibrary() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState('library');
  const [prompt, setPrompt] = useState('');
  const [generating, setGenerating] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['mediaItems'],
    queryFn: () => base44.entities.MediaItem.list('-created_date', 100),
  });

  const saveItem = useMutation({
    mutationFn: (data) => base44.entities.MediaItem.create(data),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['mediaItems'] }); toast.success('Saved to library!'); }
  });

  const deleteItem = useMutation({
    mutationFn: (id) => base44.entities.MediaItem.delete(id),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['mediaItems'] }); toast.success('Deleted.'); }
  });

  const generateImage = async () => {
    if (!prompt.trim()) return toast.error('Enter a prompt first!');
    setGenerating(true);
    const result = await base44.integrations.Core.GenerateImage({ prompt });
    await saveItem.mutateAsync({ title: prompt.slice(0, 60), file_url: result.url, media_type: 'image', source: 'generated', prompt });
    setPrompt('');
    setTab('library');
    setGenerating(false);
  };

  const handleUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    for (const file of files) {
      const isVideo = file.type.startsWith('video/');
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      await saveItem.mutateAsync({ title: file.name, file_url, media_type: isVideo ? 'video' : 'image', source: 'uploaded' });
    }
    setUploading(false);
    setTab('library');
    toast.success(`${files.length} file(s) uploaded!`);
  };

  const images = items.filter(i => i.media_type === 'image');
  const videos = items.filter(i => i.media_type === 'video');

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center shadow-lg shadow-pink-500/30">
            <Image className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-display text-3xl font-bold text-foreground">Media Library</h1>
            <p className="text-muted-foreground text-sm">{items.length} items — generated &amp; uploaded</p>
          </div>
        </div>
        <div className="flex gap-2">
          <input ref={fileInputRef} type="file" accept="image/*,video/*" multiple className="hidden" onChange={handleUpload} />
          <Button onClick={() => fileInputRef.current?.click()} disabled={uploading} variant="outline" className="border-border text-foreground">
            {uploading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Upload className="w-4 h-4 mr-2" />}
            Upload
          </Button>
          <Button onClick={() => setTab('generate')} className="bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 text-white shadow-lg shadow-pink-500/30">
            <Sparkles className="w-4 h-4 mr-2" /> Generate Image
          </Button>
        </div>
      </div>

      {/* Generate Tab */}
      {tab === 'generate' && (
        <div className="bg-card border border-border rounded-2xl p-6 mb-8">
          <h2 className="font-display font-bold text-foreground mb-4">Generate AI Image</h2>
          <Textarea
            value={prompt}
            onChange={e => setPrompt(e.target.value)}
            placeholder="Describe the image you want... e.g. 'A vibrant flat lay of coffee and a laptop on a minimalist desk, morning light, photography style'"
            className="resize-none bg-muted border-border text-foreground mb-4 min-h-[80px]"
            rows={3}
          />
          <div className="flex gap-3">
            <Button onClick={generateImage} disabled={generating || !prompt.trim()} className="bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 text-white shadow-lg shadow-pink-500/30">
              {generating ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
              {generating ? 'Generating...' : 'Generate'}
            </Button>
            <Button variant="ghost" onClick={() => setTab('library')} className="text-muted-foreground">Cancel</Button>
          </div>
        </div>
      )}

      {isLoading && <div className="text-center py-16 text-muted-foreground">Loading media...</div>}

      {!isLoading && items.length === 0 && tab !== 'generate' && (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-pink-500/10 to-rose-600/10 flex items-center justify-center">
            <Image className="w-8 h-8 text-pink-400 opacity-50" />
          </div>
          <p className="font-display font-semibold text-foreground">No media yet</p>
          <p className="text-sm text-muted-foreground">Generate an AI image or upload your own photos and videos</p>
          <div className="flex gap-3">
            <Button onClick={() => setTab('generate')} className="bg-gradient-to-r from-pink-500 to-rose-600 text-white">
              <Sparkles className="w-4 h-4 mr-2" /> Generate Image
            </Button>
            <Button onClick={() => fileInputRef.current?.click()} variant="outline" className="border-border text-foreground">
              <Upload className="w-4 h-4 mr-2" /> Upload File
            </Button>
          </div>
        </div>
      )}

      {/* Images Grid */}
      {images.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Image className="w-4 h-4 text-pink-400" />
            <h2 className="font-display font-semibold text-sm text-foreground">Images ({images.length})</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(item => (
              <MediaCard key={item.id} item={item} onDelete={() => deleteItem.mutate(item.id)} onRegenerate={item.source === 'generated' ? async (newPrompt) => {
                const result = await base44.integrations.Core.GenerateImage({ prompt: newPrompt });
                await saveItem.mutateAsync({ title: newPrompt.slice(0, 60), file_url: result.url, media_type: 'image', source: 'generated', prompt: newPrompt });
              } : null} />
            ))}
          </div>
        </div>
      )}

      {/* Videos Grid */}
      {videos.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Video className="w-4 h-4 text-purple-400" />
            <h2 className="font-display font-semibold text-sm text-foreground">Videos ({videos.length})</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map(item => (
              <MediaCard key={item.id} item={item} onDelete={() => deleteItem.mutate(item.id)} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function MediaCard({ item, onDelete, onRegenerate }) {
  const [editing, setEditing] = useState(false);
  const [editPrompt, setEditPrompt] = useState(item.prompt || '');
  const [regenerating, setRegenerating] = useState(false);

  const handleRegenerate = async () => {
    if (!editPrompt.trim()) return;
    setRegenerating(true);
    await onRegenerate(editPrompt);
    setRegenerating(false);
    setEditing(false);
  };
  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden group hover:border-pink-500/30 transition-all">
      {item.media_type === 'image' ? (
        <img src={item.file_url} alt={item.title} className="w-full aspect-square object-cover" />
      ) : (
        <video src={item.file_url} controls className="w-full aspect-video object-cover" />
      )}
      <div className="p-3">
        <p className="text-xs font-medium text-foreground truncate mb-1">{item.title || 'Untitled'}</p>
        <div className="flex items-center justify-between">
          <span className={`text-xs px-2 py-0.5 rounded-full ${item.source === 'generated' ? 'bg-pink-500/10 text-pink-400' : 'bg-blue-500/10 text-blue-400'}`}>
            {item.source === 'generated' ? '✨ AI' : '📤 Uploaded'}
          </span>
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <a href={item.file_url} download target="_blank" rel="noreferrer" className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <Download className="w-3.5 h-3.5" />
            </a>
            {onRegenerate && (
              <button onClick={() => setEditing(v => !v)} title="Edit & Regenerate" className={`p-1.5 rounded-lg transition-colors ${editing ? 'text-pink-400' : 'text-muted-foreground hover:text-pink-400'}`}>
                <Pencil className="w-3.5 h-3.5" />
              </button>
            )}
            <button onClick={onDelete} className="p-1.5 rounded-lg text-muted-foreground hover:text-destructive transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
      {editing && (
        <div className="px-3 pb-3">
          <textarea
            value={editPrompt}
            onChange={e => setEditPrompt(e.target.value)}
            rows={2}
            className="w-full bg-muted border border-border rounded-lg px-2 py-1.5 text-xs text-foreground placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-1 focus:ring-pink-500/50 mb-2"
            placeholder="Edit the prompt..."
          />
          <div className="flex gap-2">
            <button
              onClick={handleRegenerate}
              disabled={regenerating || !editPrompt.trim()}
              className="flex-1 flex items-center justify-center gap-1 text-xs py-1.5 rounded-lg bg-gradient-to-r from-pink-500 to-rose-600 text-white font-medium disabled:opacity-50"
            >
              {regenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
              {regenerating ? 'Generating...' : 'Regenerate'}
            </button>
            <button onClick={() => setEditing(false)} className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}