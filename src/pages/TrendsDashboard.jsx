import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, RefreshCw, Loader2, Sparkles, Flame, ArrowUpRight } from 'lucide-react';
import { toast } from 'sonner';
import api from '../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const PLATFORMS = [
  { id: 'twitter', label: 'X / Twitter', color: 'from-sky-500 to-blue-600', dot: 'bg-sky-400' },
  { id: 'instagram', label: 'Instagram', color: 'from-pink-500 to-purple-600', dot: 'bg-pink-400' },
  { id: 'linkedin', label: 'LinkedIn', color: 'from-blue-600 to-blue-800', dot: 'bg-blue-400' },
  { id: 'tiktok', label: 'TikTok', color: 'from-red-500 to-pink-600', dot: 'bg-red-400' },
  { id: 'facebook', label: 'Facebook', color: 'from-blue-500 to-indigo-600', dot: 'bg-indigo-400' },
];

export default function TrendsDashboard() {
  const queryClient = useQueryClient();
  const [activePlatform, setActivePlatform] = useState('twitter');
  const [trends, setTrends] = useState({});
  const [loadingPlatforms, setLoadingPlatforms] = useState({});

const saveContent = useMutation({
  mutationFn: async (data) => {
    console.log('Saving idea:', data);

    // TODO:
    // await api('/api/content/save', {
    //   method: 'POST',
    //   body: JSON.stringify(data),
    // });

    return data;
  },

  onSuccess: () => {
    toast.success(
      'Saved! Check your AI Studio to craft a post.'
    );
  },

  onError: (err) => {
    toast.error(err.message);
  },
});
  const fetchTrends = async (platformId) => {
  try {
    setLoadingPlatforms(prev => ({
      ...prev,
      [platformId]: true,
    }));

    const res = await api(`/api/trends/${platformId}`);

    console.log('TRENDS RESPONSE:', res);

    setTrends(prev => ({
      ...prev,
      [platformId]: res.trends || [],
    }));
  } catch (err) {
    console.error(err);

    toast.error(
      err.message || 'Failed to load trends'
    );
  } finally {
    setLoadingPlatforms(prev => ({
      ...prev,
      [platformId]: false,
    }));
  }
};

  const platform = PLATFORMS.find(p => p.id === activePlatform);
  const currentTrends = trends[activePlatform] || [];
  const isLoading = loadingPlatforms[activePlatform];

  const engagementColor = (level) => {
    if (!level) return 'text-muted-foreground';
    if (level.toLowerCase().includes('viral')) return 'text-red-400';
    if (level.toLowerCase().includes('high')) return 'text-yellow-400';
    return 'text-green-400';
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 md:pb-0">
      {/* Header */}
      <div className="mb-8 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Trends Dashboard</h1>
              <p className="text-muted-foreground text-sm">Real-time top 10 trending topics per platform</p>
            </div>
          </div>
        </div>
        <Button
          onClick={() => fetchTrends(activePlatform)}
          disabled={isLoading}
          className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:opacity-90 text-black font-semibold shadow-lg shadow-orange-500/30"
        >
          {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
          Refresh Trends
        </Button>
      </div>

      {/* Platform Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {PLATFORMS.map(p => (
          <button
            key={p.id}
            onClick={() => { setActivePlatform(p.id); if (!trends[p.id]) fetchTrends(p.id); }}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
              activePlatform === p.id
                ? `bg-gradient-to-r ${p.color} text-white shadow-lg`
                : 'bg-muted text-muted-foreground hover:text-foreground border border-border'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${activePlatform === p.id ? 'bg-white' : p.dot}`} />
            {p.label}
          </button>
        ))}
        <input type="text" className='p-2 text-black background-black mt-2 border border-border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500' placeholder='Search trends...' />
      </div>

      {/* Trends Grid */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400/20 to-orange-500/20 flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
          </div>
          <p className="font-display font-semibold text-foreground">Scanning {platform.label} trends...</p>
          <p className="text-sm text-muted-foreground">Fetching real-time data from the web</p>
        </div>
      )}

      {!isLoading && currentTrends.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-yellow-400/10 to-orange-500/10 flex items-center justify-center">
            <Flame className="w-8 h-8 text-orange-400 opacity-50" />
          </div>
          <p className="font-display font-semibold text-foreground">No trends loaded yet</p>
          <p className="text-sm text-muted-foreground">Click "Refresh Trends" to see what's hot on {platform.label} 🔥</p>
          <Button onClick={() => fetchTrends(activePlatform)} className={`bg-gradient-to-r ${platform.color} text-white`}>
            Load Trends
          </Button>
        </div>
      )}

      {!isLoading && currentTrends.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {currentTrends.map((trend, i) => (
            <div key={i} className={`bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-all duration-200 group`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${platform.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-display font-semibold text-foreground text-sm leading-tight">{trend.title}</p>
                    {trend.engagement?.toLowerCase().includes('viral') && (
                      <Flame className="w-4 h-4 text-red-400 shrink-0" />
                    )}
                  </div>
                  {trend.hashtag && (
                    <span className="text-xs text-primary font-medium">{trend.hashtag.startsWith('#') ? trend.hashtag : `#${trend.hashtag}`}</span>
                  )}
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{trend.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge className={`text-xs ${engagementColor(trend.engagement)} bg-transparent border-0 px-0 font-medium`}>
                      ↑ {trend.engagement || 'trending'}
                    </Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => saveContent.mutate({ title: `Trend: ${trend.title}`, content: `${trend.description}\n\nHashtag: ${trend.hashtag || ''}`, content_type: 'idea', platform: activePlatform })}
                      className="text-xs text-muted-foreground hover:text-primary gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Sparkles className="w-3 h-3" /> Save idea
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { window.open(`https://www.google.com/search?q=${encodeURIComponent(trend.title)}`, '_blank'); }}
                      className="text-xs text-muted-foreground hover:text-foreground gap-1"
                    >
                      <ArrowUpRight className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}