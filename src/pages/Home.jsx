import { useState, useEffect, useRef } from 'react';
import QuickStarts from '../components/QuickStarts';
import StreakBadge from '../components/StreakBadge';
import PaywallModal, { LockedFeatureModal } from '../components/paywall/PaywallModal';
import UsageBar from '../components/paywall/UsageBar';
import SoftBanner from '../components/paywall/SoftBanner';
import UpgradeSuccess from '../components/paywall/UpgradeSuccess';
import { usePaywall } from '../components/paywall/usePaywall';
import { openPaystack } from '../components/paywall/PaystackButton';
import { useQuery } from '@tanstack/react-query';
import { Link, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Send, Copy, BookmarkPlus, Loader2, Lightbulb, Type, MessageSquare, Check, CalendarDays, ChevronRight, ChevronDown, Image, Paperclip, X, Upload, Download, Lock } from 'lucide-react';
import { base44 } from '@/api/base44Client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

const PLATFORMS = ['linkedin', 'instagram', 'twitter', 'facebook', 'tiktok'];
const TONES = ['professional', 'casual', 'funny', 'inspirational', 'educational', 'storytelling'];

const PURPOSE_CONTEXT = {
  personal: 'personal brand/lifestyle content with first-person relatable energy',
  fashion: 'fashion and beauty business with style expressions and product-reveal energy',
  food: 'food and catering business with appetite-building sensory language',
  tech: 'tech or service business with confident, authoritative tone',
  fun: 'casual fun content, light and playful',
  other: 'general content creation',
};

const PLATFORM_RULES = {
  instagram: 'Instagram style: can be longer, use emojis freely, leave space for hashtags at the end.',
  tiktok: 'TikTok style: hook MUST be in the first 5 words, keep it punchy and fast.',
  whatsapp: 'WhatsApp style: under 2 sentences, casual and warm.',
  twitter: 'X/Twitter style: under 260 characters, conversational, end with a question or reaction prompt.',
  facebook: 'Facebook style: warmer community tone, slightly longer is fine.',
  linkedin: 'LinkedIn style: professional, insightful, with a clear call-to-action.',
};

function getGreeting(name) {
  const h = new Date().getHours();
  const n = name ? `, ${name}` : '';
  if (h >= 5 && h < 12) return `Good morning${n}! Ready to post something fire today? 🔥`;
  if (h >= 12 && h < 17) return `Afternoon${n}! Your audience dey wait o. 👀`;
  if (h >= 17 && h < 21) return `Evening${n}! Perfect time to drop a caption. ✨`;
  return `Night owl mode${n}! Let's create something. 🌙`;
}

function getDailyCount() {
  const today = new Date().toISOString().split('T')[0];
  const stored = JSON.parse(localStorage.getItem('cf_daily') || '{}');
  return stored.date === today ? (stored.count || 0) : 0;
}

function incrementDailyCount() {
  const today = new Date().toISOString().split('T')[0];
  const stored = JSON.parse(localStorage.getItem('cf_daily') || '{}');
  const count = stored.date === today ? (stored.count || 0) + 1 : 1;
  localStorage.setItem('cf_daily', JSON.stringify({ date: today, count }));
  return count;
}

function updateStreak() {
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
  const stored = JSON.parse(localStorage.getItem('cf_streak') || '{}');
  if (stored.lastDate === today) return stored.count || 1;
  const count = stored.lastDate === yesterday ? (stored.count || 0) + 1 : 1;
  localStorage.setItem('cf_streak', JSON.stringify({ lastDate: today, count }));
  return count;
}

function formatAI(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^#{1,3}\s+/gm, '')
    .trim();
}

function ChatMessage({ msg, onResend }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(msg.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const paragraphs = msg.role === 'assistant'
    ? formatAI(msg.content).split('\n').filter(l => l.trim())
    : null;
  return (
    <div className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} mb-4`}>
      {msg.role === 'assistant' && (
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-3 shrink-0 mt-1">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
      )}
      <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm ${
        msg.role === 'user'
          ? 'bg-gradient-to-r from-primary to-secondary text-white rounded-br-sm'
          : 'bg-card border border-border text-foreground rounded-bl-sm'
      }`}>
        {msg.imageUrl && (
          <img src={msg.imageUrl} alt="attachment" className="rounded-xl mb-2 max-h-48 object-cover w-full" />
        )}
        {paragraphs ? (
          <div className="space-y-2">
            {paragraphs.map((p, i) => (
              <p key={i} className={`leading-relaxed ${i === 0 ? 'font-medium' : 'text-foreground/90 font-normal'}`}>{p}</p>
            ))}
          </div>
        ) : (
          <p className="leading-relaxed">{msg.content}</p>
        )}
        {msg.role === 'assistant' && (
          <button onClick={copy} className="mt-2 flex items-center gap-1 text-xs text-muted-foreground hover:text-primary transition-colors">
            {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
            {copied ? 'Copied!' : 'Copy'}
          </button>
        )}
        {msg.role === 'user' && (
          <div className="mt-2 flex items-center gap-2 justify-end">
            <button onClick={copy} className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
              {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
              {copied ? 'Copied' : 'Copy'}
            </button>
            <button onClick={() => onResend(msg.content)} className="flex items-center gap-1 text-xs text-white/60 hover:text-white transition-colors">
              <Send className="w-3 h-3" /> Resend
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function IdeaCard({ idea, index, platform, onSave }) {
  const queryClient = useQueryClient();
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  const addToCalendar = useMutation({
    mutationFn: async () => {
      const caption = await base44.integrations.Core.InvokeLLM({
        prompt: `Write a complete, ready-to-post ${platform} caption for this content idea. Title: "${idea.title}". About: ${idea.description}. Make it platform-appropriate (${platform} style), engaging, natural-sounding, with relevant hashtags and emojis. No markdown. Just the caption, ready to copy and post.`
      });
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return base44.entities.ScheduledPost.create({
        title: idea.title,
        content: caption,
        platforms: [platform],
        scheduled_date: tomorrow.toISOString().split('T')[0],
        scheduled_time: '10:00',
        publish_mode: 'reminder',
        status: 'draft',
        ai_generated: true,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scheduledPosts'] });
      setAdded(true);
      toast.success('Added to Content Calendar as a draft!');
    }
  });

  const explainIdea = async () => {
    if (details) { setExpanded(v => !v); return; }
    setExpanded(true);
    setLoading(true);
    const res = await base44.integrations.Core.InvokeLLM({
      prompt: `Explain this content idea for a ${platform} creator. No asterisks or markdown.\nTitle: "${idea.title}"\nBrief: ${idea.description}\n\nCover: 1) Why it works 2) How to execute it 3) Best format and timing. Be concise and actionable.`
    });
    setDetails(formatAI(res));
    setLoading(false);
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-colors">
      <div className="flex items-start gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">{index + 1}</div>
        <div className="flex-1">
          <p className="font-display font-semibold text-sm text-foreground mb-1">{idea.title}</p>
          <p className="text-xs text-muted-foreground leading-relaxed">{idea.description}</p>
        </div>
        <button onClick={onSave} className="p-1.5 text-muted-foreground hover:text-accent transition-colors shrink-0">
          <BookmarkPlus className="w-4 h-4" />
        </button>
        <button
          onClick={() => addToCalendar.mutate()}
          disabled={added || addToCalendar.isPending}
          title="Add to Content Calendar"
          className={`p-1.5 transition-colors shrink-0 ${added ? 'text-green-400' : 'text-muted-foreground hover:text-green-400'}`}
        >
          {added ? <Check className="w-4 h-4" /> : addToCalendar.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <CalendarDays className="w-4 h-4" />}
        </button>
      </div>
      <button onClick={explainIdea} className="mt-3 flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium transition-colors">
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        {expanded ? 'Hide details' : 'Explain this idea'}
      </button>
      {expanded && (
        <div className="mt-3 pt-3 border-t border-border">
          {loading ? (
            <div className="flex items-center gap-2 text-xs text-muted-foreground"><Loader2 className="w-3 h-3 animate-spin" /> Getting details...</div>
          ) : (
            <div className="space-y-1.5">
              {details.split('\n').filter(l => l.trim()).map((line, i) => (
                <p key={i} className={`text-xs leading-relaxed ${i === 0 ? 'font-semibold text-foreground' : 'text-muted-foreground'}`}>{line}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  // Chat
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "Hey there! 👋 I'm your AI content assistant. Ask me anything about content creation, social media strategy, audience growth, or let me help you write captions and post ideas!" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const [chatImage, setChatImage] = useState(null); // { file, previewUrl, uploadedUrl }
  const [chatImageUploading, setChatImageUploading] = useState(false);
  const chatFileRef = useRef(null);

  // Image generator
  const [imgPrompt, setImgPrompt] = useState('');
  const [imgRefImage, setImgRefImage] = useState(null); // { file, previewUrl, uploadedUrl }
  const [imgRefUploading, setImgRefUploading] = useState(false);
  const [imgGenerating, setImgGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState([]);
  const imgFileRef = useRef(null);

  const { user: paywallUser, isPaid, dailyCount, isAtLimit, showSoftBanner, shouldShowFullPaywall, consecutiveLimitDays, incrementCount, dismissPaywall, dismissBanner, upgradeToPaid } = usePaywall();

  const [showPaywall, setShowPaywall] = useState(false);
  const [paywallLoading, setPaywallLoading] = useState(false);
  const [showUpgradeSuccess, setShowUpgradeSuccess] = useState(false);
  const [lockedFeature, setLockedFeature] = useState(null); // 'hashtag' | 'saved' | 'brandvoice'

  const [userProfile, setUserProfile] = useState(null);
  const [streak, setStreak] = useState(0);
  const [toneUsageCount, setToneUsageCount] = useState(0);
  const [suggestTone, setSuggestTone] = useState(null);
  const toneUsageRef = useRef({});

  // Caption
  const [captionTopic, setCaptionTopic] = useState('');
  const [captionTone, setCaptionTone] = useState('casual');

  useEffect(() => {
    base44.auth.me().then(u => {
      if (!u) return;
      setUserProfile(u);
      if (u.defaultTone) setCaptionTone(u.defaultTone);
      // load streak from localStorage
      const s = JSON.parse(localStorage.getItem('cf_streak') || '{}');
      setStreak(s.count || 0);
      // load tone usage tracking
      const tu = JSON.parse(localStorage.getItem('cf_tone_usage') || '{}');
      toneUsageRef.current = tu;
      setToneUsageCount(Object.values(tu).reduce((a, b) => a + b, 0));
    }).catch(() => {});
  }, []);

  const handleToneChange = (newTone) => {
    setCaptionTone(newTone);
    // track tone usage
    const tu = { ...toneUsageRef.current, [newTone]: (toneUsageRef.current[newTone] || 0) + 1 };
    toneUsageRef.current = tu;
    localStorage.setItem('cf_tone_usage', JSON.stringify(tu));
    const totalUses = Object.values(tu).reduce((a, b) => a + b, 0);
    setToneUsageCount(totalUses);
    // after 10 uses, if they always pick a non-default tone, suggest
    if (totalUses >= 10 && userProfile?.defaultTone && newTone !== userProfile.defaultTone) {
      const nonDefaultUses = Object.entries(tu).filter(([k]) => k !== userProfile.defaultTone).reduce((a, [,v]) => a + v, 0);
      if (nonDefaultUses / totalUses > 0.8) setSuggestTone(newTone);
    }
  };
  const [captionPlatform, setCaptionPlatform] = useState('instagram');
  const [captions, setCaptions] = useState([]);
  const [captionLoading, setCaptionLoading] = useState(false);

  // Post Ideas
  const [ideaNiche, setIdeaNiche] = useState('');
  const [ideaPlatform, setIdeaPlatform] = useState('instagram');
  const [ideas, setIdeas] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(false);

  const { data: upcomingPosts = [] } = useQuery({
    queryKey: ['scheduledPosts'],
    queryFn: () => base44.entities.ScheduledPost.list('-scheduled_date', 100),
    select: (posts) => posts
      .filter(p => p.status !== 'published' && p.scheduled_date >= new Date().toISOString().split('T')[0])
      .sort((a, b) => (a.scheduled_date + a.scheduled_time).localeCompare(b.scheduled_date + b.scheduled_time))
      .slice(0, 4),
  });

  const saveContent = useMutation({
    mutationFn: (data) => base44.entities.SavedContent.create(data),
    onSuccess: () => { toast.success('Saved to your library!'); queryClient.invalidateQueries({ queryKey: ['savedContent'] }); }
  });

  const handleChatImageSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setChatImage({ file, previewUrl, uploadedUrl: null });
    setChatImageUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setChatImage({ file, previewUrl, uploadedUrl: file_url });
    setChatImageUploading(false);
  };

  const sendChat = async () => {
    if (!chatInput.trim() && !chatImage) return;
    const uploadedUrl = chatImage?.uploadedUrl;
    const userMsg = { role: 'user', content: chatInput || 'What can you tell me about this image?', imageUrl: chatImage?.previewUrl };
    setMessages(prev => [...prev, userMsg]);
    setChatInput('');
    setChatImage(null);
    setChatLoading(true);
    const history = [...messages, userMsg].map(m => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`).join('\n');
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `You are CreatorAI, an expert AI assistant for content creators, social media managers, and influencers. You help with content strategy, captions, post ideas, audience growth, platform tips, and anything content-related. Be concise, actionable, and inspiring.\n\nConversation history:\n${history}\n\nRespond to the user's last message helpfully.`,
      ...(uploadedUrl ? { file_urls: [uploadedUrl] } : {}),
    });
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setChatLoading(false);
  };

  const handleImgRefSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const previewUrl = URL.createObjectURL(file);
    setImgRefImage({ file, previewUrl, uploadedUrl: null });
    setImgRefUploading(true);
    const { file_url } = await base44.integrations.Core.UploadFile({ file });
    setImgRefImage({ file, previewUrl, uploadedUrl: file_url });
    setImgRefUploading(false);
  };

  const generateImage = async () => {
    if (!imgPrompt.trim()) return toast.error('Enter a prompt first!');
    setImgGenerating(true);
    const result = await base44.integrations.Core.GenerateImage({
      prompt: imgPrompt,
      ...(imgRefImage?.uploadedUrl ? { existing_image_urls: [imgRefImage.uploadedUrl] } : {}),
    });
    setGeneratedImages(prev => [{ url: result.url, prompt: imgPrompt }, ...prev]);
    setImgGenerating(false);
  };

  const handleUpgradeClick = async () => {
    setPaywallLoading(true);
    openPaystack({
      email: paywallUser?.email || '',
      amount: 1500,
      onSuccess: async () => {
        await upgradeToPaid();
        setPaywallLoading(false);
        setShowPaywall(false);
        setLockedFeature(null);
        setShowUpgradeSuccess(true);
      },
      onClose: () => setPaywallLoading(false),
    });
  };

  const handleDismissPaywall = async () => {
    await dismissPaywall();
    setShowPaywall(false);
    setLockedFeature(null);
  };

  const generateCaptions = async () => {
    if (!captionTopic.trim()) return toast.error('Enter a topic first!');
    // Daily limit check for free users
    if (!isPaid && isAtLimit) { setShowPaywall(true); return; }
    if (!isPaid) {
      const allowed = await incrementCount();
      if (!allowed) { setShowPaywall(true); return; }
    }
    setCaptionLoading(true);
    const newStreak = updateStreak(); setStreak(newStreak);
    // Build personalised context
    const purposeArr = userProfile?.contentPurpose || [];
    const businessCtx = purposeArr.map(p => PURPOSE_CONTEXT[p]).filter(Boolean).join(', ') || 'general content creation';
    const platformRule = PLATFORM_RULES[captionPlatform] || '';
    const userName = userProfile?.onboardingName || userProfile?.full_name || '';
    const useNameInCaption = userName && purposeArr.some(p => ['fashion','food','tech','personal'].includes(p)) && Math.random() < 0.2;
    const nameHint = useNameInCaption ? `Optionally, naturally weave the creator's name "${userName}" into one caption (e.g. "${userName}'s ..."). Only if it sounds organic.` : '';
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate 4 unique, ready-to-post captions for ${captionPlatform} about: "${captionTopic}".\n\nCreator context: ${businessCtx}.\nTone: ${captionTone}.\n${platformRule}\n${nameHint}\nMake each caption feel natural and distinct. Include relevant hashtags and emojis. No markdown formatting. Return JSON.`,
      response_json_schema: { type: 'object', properties: { captions: { type: 'array', items: { type: 'string' } } } }
    });
    setCaptions(response.captions || []);
    setCaptionLoading(false);
  };

  const generateIdeas = async () => {
    if (!ideaNiche.trim()) return toast.error('Enter your niche first!');
    setIdeasLoading(true);
    const response = await base44.integrations.Core.InvokeLLM({
      prompt: `Generate 8 creative, viral-worthy content ideas for ${ideaPlatform} in the niche: "${ideaNiche}". Each idea should have a catchy title and a brief 1-sentence description. Return JSON.`,
      response_json_schema: { type: 'object', properties: { ideas: { type: 'array', items: { type: 'object', properties: { title: { type: 'string' }, description: { type: 'string' } } } } } }
    });
    setIdeas(response.ideas || []);
    setIdeasLoading(false);
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 md:pb-0">
      {/* Soft reminder banner */}
      {showSoftBanner && (
        <SoftBanner onUpgrade={() => setShowPaywall(true)} onDismiss={dismissBanner} />
      )}

      {/* Paid renewal reminder */}
      {isPaid && paywallUser?.planRenewalDate && (() => {
        const daysLeft = Math.ceil((new Date(paywallUser.planRenewalDate) - new Date()) / (1000 * 60 * 60 * 24));
        if (daysLeft > 3) return null;
        return (
          <div className="mb-4 px-4 py-2.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-sm text-amber-400">
            Your plan renews in {daysLeft} day{daysLeft !== 1 ? 's' : ''} — make sure your card is ready.
          </div>
        );
      })()}

      {/* Upcoming Posts Strip */}
      {upcomingPosts.length > 0 && (
        <div className="mb-6 bg-card border border-border rounded-2xl p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-green-400" />
              <span className="font-display font-semibold text-sm text-foreground">Upcoming Scheduled Posts</span>
            </div>
            <Link to="/studio/calendar" className="flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors">
              View Calendar <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {upcomingPosts.map(post => (
              <div key={post.id} className="shrink-0 bg-muted border border-border rounded-xl p-3 min-w-[160px] max-w-[180px]">
                <p className="font-semibold text-xs text-foreground truncate mb-1">{post.title}</p>
                <p className="text-xs text-muted-foreground">{post.scheduled_date}</p>
                <p className="text-xs text-muted-foreground">{post.scheduled_time}</p>
                <div className="flex gap-1 mt-2">
                  {post.platforms?.slice(0, 3).map(p => (
                    <span key={p} className={`w-2 h-2 rounded-full ${{ linkedin: 'bg-blue-500', instagram: 'bg-pink-500', twitter: 'bg-sky-400', facebook: 'bg-blue-600', tiktok: 'bg-red-500' }[p] || 'bg-muted'}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Paywall modals */}
      {(showPaywall || (shouldShowFullPaywall && !showUpgradeSuccess)) && (
        <PaywallModal
          user={paywallUser || userProfile}
          consecutiveLimitDays={consecutiveLimitDays}
          onClose={() => setShowPaywall(false)}
          onUpgrade={handleUpgradeClick}
          onDismiss={handleDismissPaywall}
          loading={paywallLoading}
        />
      )}
      {lockedFeature && (
        <LockedFeatureModal
          featureKey={lockedFeature}
          onClose={() => setLockedFeature(null)}
          onUpgrade={handleUpgradeClick}
          onDismiss={handleDismissPaywall}
        />
      )}
      {showUpgradeSuccess && (
        <UpgradeSuccess user={paywallUser || userProfile} onClose={() => setShowUpgradeSuccess(false)} />
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/30">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">AI Studio</h1>
              <p className="text-muted-foreground text-sm">
                {userProfile?.onboardingComplete
                  ? getGreeting(userProfile.onboardingName || userProfile.full_name)
                  : 'Your creative powerhouse for content'}
              </p>
            </div>
          </div>
          <StreakBadge streak={streak} name={userProfile?.onboardingName || userProfile?.full_name} />
        </div>
      </div>

      <Tabs defaultValue="chat" className="w-full">
        <TabsList className="bg-muted border border-border mb-6 p-1">
          <TabsTrigger value="chat" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white gap-2">
            <MessageSquare className="w-4 h-4" /> Ask AI
          </TabsTrigger>
          <TabsTrigger value="captions" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white gap-2" onClick={() => { if (userProfile?.platforms?.[0] && PLATFORMS.includes(userProfile.platforms[0])) setCaptionPlatform(userProfile.platforms[0]); }}>
            <Type className="w-4 h-4" /> Captions
          </TabsTrigger>
          <TabsTrigger value="ideas" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-secondary data-[state=active]:text-white gap-2">
            <Lightbulb className="w-4 h-4" /> Post Ideas
          </TabsTrigger>
          <TabsTrigger value="images" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-pink-500 data-[state=active]:to-rose-600 data-[state=active]:text-white gap-2">
            <Image className="w-4 h-4" /> Images
          </TabsTrigger>
        </TabsList>

        {/* CHAT TAB */}
        <TabsContent value="chat">
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <div className="h-[420px] overflow-y-auto p-6">
              {messages.map((msg, i) => <ChatMessage key={i} msg={msg} onResend={(text) => { setChatInput(text); }} />)}
              {chatLoading && (
                <div className="flex justify-start mb-4">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center mr-3">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                    <Loader2 className="w-4 h-4 animate-spin text-primary" />
                  </div>
                </div>
              )}
            </div>
            {chatImage && (
              <div className="px-4 pt-3 flex items-center gap-2">
                <div className="relative inline-block">
                  <img src={chatImage.previewUrl} alt="attachment" className="h-16 w-16 object-cover rounded-xl border border-border" />
                  {chatImageUploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                      <Loader2 className="w-4 h-4 text-white animate-spin" />
                    </div>
                  )}
                  <button onClick={() => setChatImage(null)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
                    <X className="w-3 h-3 text-white" />
                  </button>
                </div>
              </div>
            )}
            <div className="border-t border-border p-4 flex gap-2">
              <input ref={chatFileRef} type="file" accept="image/*,video/*" className="hidden" onChange={handleChatImageSelect} />
              <button
                onClick={() => chatFileRef.current?.click()}
                className="shrink-0 self-end p-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                title="Attach image"
              >
                <Paperclip className="w-5 h-5" />
              </button>
              <Textarea
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(); } }}
                placeholder="Ask anything, or attach an image for context..."
                className="resize-none bg-muted border-border text-foreground placeholder:text-muted-foreground"
                rows={2}
              />
              <Button onClick={sendChat} disabled={chatLoading || (!chatInput.trim() && !chatImage) || chatImageUploading} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white self-end shadow-lg shadow-primary/30">
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </TabsContent>

        {/* CAPTIONS TAB */}
        <TabsContent value="captions">
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Platform</label>
                <Select value={captionPlatform} onValueChange={setCaptionPlatform}>
                  <SelectTrigger className="bg-muted border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {PLATFORMS.map(p => <SelectItem key={p} value={p} className="capitalize text-foreground">{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Tone</label>
                <Select value={captionTone} onValueChange={handleToneChange}>
                  <SelectTrigger className="bg-muted border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {TONES.map(t => <SelectItem key={t} value={t} className="capitalize text-foreground">{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-1 flex flex-col justify-end">
                <Button onClick={generateCaptions} disabled={captionLoading || !captionTopic.trim() || (!isPaid && isAtLimit)} className="w-full bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/30">
                  {captionLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Sparkles className="w-4 h-4 mr-2" />}
                  Generate
                </Button>
              </div>
            </div>
            {suggestTone && (
              <div className="mb-3 flex items-center gap-3 p-3 rounded-xl bg-primary/5 border border-primary/20">
                <p className="text-xs text-foreground flex-1">We noticed you always use <strong>{suggestTone}</strong> — want to make it your default?</p>
                <button onClick={async () => { await base44.auth.updateMe({ defaultTone: suggestTone }); setUserProfile(u => ({ ...u, defaultTone: suggestTone })); setSuggestTone(null); toast.success('Default tone updated!'); }} className="text-xs text-primary font-semibold hover:underline">Yes</button>
                <button onClick={() => setSuggestTone(null)} className="text-xs text-muted-foreground hover:text-foreground">No</button>
              </div>
            )}
            <QuickStarts contentPurpose={userProfile?.contentPurpose} onSelect={setCaptionTopic} />
            <Textarea
              value={captionTopic}
              onChange={e => setCaptionTopic(e.target.value)}
              placeholder={userProfile?.onboardingName ? `Tell us what you want to say today, ${userProfile.onboardingName} — we're going to make it sound like you.` : "Describe your post topic, e.g. 'Monday morning productivity tips for remote workers'..."}
              className="resize-none bg-muted border-border text-foreground placeholder:text-muted-foreground"
              rows={3}
            />
            {!isPaid && <UsageBar dailyCount={dailyCount} />}
          </div>
          {captions.length > 0 && (
            <div className="space-y-4">
              {captions.map((caption, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-4 group hover:border-primary/40 transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <p className="text-sm text-foreground leading-relaxed flex-1 whitespace-pre-wrap">{caption}</p>
                    <div className="flex gap-2 shrink-0">
                      <Button size="sm" variant="ghost" onClick={() => { navigator.clipboard.writeText(caption); toast.success('Copied!'); }} className="text-muted-foreground hover:text-primary">
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => saveContent.mutate({ title: `Caption ${i+1}: ${captionTopic.slice(0,30)}`, content: caption, content_type: 'caption', platform: captionPlatform })} className="text-muted-foreground hover:text-accent">
                        <BookmarkPlus className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <Badge className="mt-2 bg-primary/10 text-primary border-primary/20 text-xs capitalize">{captionPlatform}</Badge>
                </div>
              ))}
            </div>
          )}
          {captions.length === 0 && !captionLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <Type className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-display font-semibold">Your captions will appear here</p>
              <p className="text-sm">Fill in the details above and hit Generate ✨</p>
            </div>
          )}

          {/* Locked features for free users */}
          {!isPaid && (
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { key: 'hashtag', label: 'Hashtag Generator', desc: '15–20 matched hashtags per caption' },
                { key: 'saved', label: 'Saved Library', desc: 'Bookmark your best captions' },
                { key: 'brandvoice', label: 'Brand Voice', desc: 'AI trained to sound like you' },
              ].map(f => (
                <button
                  key={f.key}
                  onClick={() => setLockedFeature(f.key)}
                  className="flex items-center gap-3 p-4 rounded-xl border border-dashed border-border bg-muted/40 opacity-60 hover:opacity-80 transition-opacity text-left"
                >
                  <Lock className="w-4 h-4 text-muted-foreground shrink-0" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">{f.label}</p>
                    <p className="text-xs text-muted-foreground">{f.desc}</p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </TabsContent>

        {/* POST IDEAS TAB */}
        <TabsContent value="ideas">
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-1">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Platform</label>
                <Select value={ideaPlatform} onValueChange={setIdeaPlatform}>
                  <SelectTrigger className="bg-muted border-border text-foreground"><SelectValue /></SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    {PLATFORMS.map(p => <SelectItem key={p} value={p} className="capitalize text-foreground">{p}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Your Niche / Topic</label>
                <div className="flex gap-3">
                  <input
                    value={ideaNiche}
                    onChange={e => setIdeaNiche(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && generateIdeas()}
                    placeholder="e.g. fitness, personal finance, cooking, tech reviews..."
                    className="flex-1 bg-muted border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                  <Button onClick={generateIdeas} disabled={ideasLoading || !ideaNiche.trim()} className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white shadow-lg shadow-primary/30">
                    {ideasLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lightbulb className="w-4 h-4" />}
                  </Button>
                </div>
              </div>
            </div>
          </div>
          {ideas.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {ideas.map((idea, i) => (
                <IdeaCard key={i} idea={idea} index={i} platform={ideaPlatform}
                  onSave={() => saveContent.mutate({ title: idea.title, content: idea.description, content_type: 'post_idea', platform: ideaPlatform })} />
              ))}
            </div>
          )}
          {ideas.length === 0 && !ideasLoading && (
            <div className="text-center py-12 text-muted-foreground">
              <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-display font-semibold">Fresh ideas, coming right up</p>
              <p className="text-sm">Enter your niche and let AI do the thinking 🧠</p>
            </div>
          )}
        </TabsContent>

        {/* IMAGES TAB */}
        <TabsContent value="images">
          <div className="bg-card border border-border rounded-2xl p-6 mb-6">
            <h2 className="font-display font-bold text-lg text-foreground mb-4 flex items-center gap-2">
              <Image className="w-5 h-5 text-pink-400" /> AI Image Generator
            </h2>

            {/* Prompt */}
            <div className="mb-4">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Describe your image</label>
              <Textarea
                value={imgPrompt}
                onChange={e => setImgPrompt(e.target.value)}
                placeholder="e.g. A vibrant flat-lay of fashion accessories on a white marble surface, warm studio lighting..."
                className="resize-none bg-muted border-border text-foreground placeholder:text-muted-foreground"
                rows={3}
              />
            </div>

            {/* Reference image upload */}
            <div className="mb-5">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">Reference image (optional)</label>
              <input ref={imgFileRef} type="file" accept="image/*" className="hidden" onChange={handleImgRefSelect} />
              {imgRefImage ? (
                <div className="flex items-center gap-3">
                  <div className="relative inline-block">
                    <img src={imgRefImage.previewUrl} alt="reference" className="h-20 w-20 object-cover rounded-xl border border-border" />
                    {imgRefUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                        <Loader2 className="w-4 h-4 text-white animate-spin" />
                      </div>
                    )}
                    <button onClick={() => setImgRefImage(null)} className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-destructive flex items-center justify-center">
                      <X className="w-3 h-3 text-white" />
                    </button>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {imgRefUploading ? 'Uploading...' : 'AI will use this as style reference'}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => imgFileRef.current?.click()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-dashed border-border hover:border-primary/50 hover:bg-primary/5 text-sm text-muted-foreground hover:text-primary transition-all"
                >
                  <Upload className="w-4 h-4" /> Upload reference image
                </button>
              )}
            </div>

            <Button
              onClick={generateImage}
              disabled={imgGenerating || !imgPrompt.trim() || imgRefUploading}
              className="w-full bg-gradient-to-r from-pink-500 to-rose-600 hover:opacity-90 text-white shadow-lg shadow-pink-500/30"
            >
              {imgGenerating ? <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Generating...</> : <><Sparkles className="w-4 h-4 mr-2" /> Generate Image</>}
            </Button>
          </div>

          {/* Generated images */}
          {generatedImages.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {generatedImages.map((img, i) => (
                <div key={i} className="bg-card border border-border rounded-2xl overflow-hidden">
                  <img src={img.url} alt={img.prompt} className="w-full object-cover" />
                  <div className="p-3 flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground truncate flex-1">{img.prompt}</p>
                    <a href={img.url} download target="_blank" rel="noreferrer" className="shrink-0 p-1.5 rounded-lg text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                      <Download className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          )}

          {generatedImages.length === 0 && !imgGenerating && (
            <div className="text-center py-10 text-muted-foreground">
              <Image className="w-12 h-12 mx-auto mb-3 opacity-20" />
              <p className="font-display font-semibold">Your generated images appear here</p>
              <p className="text-sm">Enter a prompt and optionally a reference image ✨</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}