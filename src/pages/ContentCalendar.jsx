  import { useState } from 'react';
  import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
  import { base44 } from '@/api/base44Client';
  import { Button } from '@/components/ui/button';
  import { Badge } from '@/components/ui/badge';
  import { CalendarDays, Plus, ChevronLeft, ChevronRight, Edit2, Trash2, Clock, Bell } from 'lucide-react';
  import PostFormModal from '@/components/PostFormModal';
  import { toast } from 'sonner';
  import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, parseISO, addMonths, subMonths, isToday } from 'date-fns';

  const PLATFORM_COLORS = {
    linkedin: 'bg-blue-500',
    instagram: 'bg-pink-500',
    twitter: 'bg-sky-400',
    facebook: 'bg-blue-600',
    tiktok: 'bg-red-500',
  };

  export default function ContentCalendar() {
    const queryClient = useQueryClient();
    const [currentMonth, setCurrentMonth] = useState(new Date());
    const [showModal, setShowModal] = useState(false);
    const [editingPost, setEditingPost] = useState(null);
    const [selectedDay, setSelectedDay] = useState(null);

   const { data: posts = [], isLoading } = useQuery({
  queryKey: ['scheduledPosts'],
  queryFn: async () => {
    const res = await api('/api/calendar/posts');

    console.log('calendar response:', res);

    return Array.isArray(res)
      ? res
      : Array.isArray(res?.data)
      ? res.data
      : [];
  },
});

    const deletePost = useMutation({
      mutationFn: (id) => base44.entities.ScheduledPost.delete(id),
      onSuccess: () => { toast.success('Post deleted.'); queryClient.invalidateQueries({ queryKey: ['scheduledPosts'] }); }
    });

    const sendReminder = useMutation({
      mutationFn: async (post) => {
        await base44.integrations.Core.SendEmail({
          to: (await base44.auth.me()).email,
          subject: `⏰ Reminder: "${post.title}" is scheduled soon!`,
          body: `Hey there!\n\nThis is a reminder that your post "${post.title}" is scheduled for ${post.scheduled_date} at ${post.scheduled_time}.\n\nPlatforms: ${post.platforms?.join(', ')}\n\nPost content:\n${post.content}\n\n${post.publish_mode === 'reminder' ? 'Remember to post manually!' : 'This will auto-publish at the scheduled time.'}\n\nStay consistent! 🚀\n— CreatorAI`
        });
        return post;
      },
      onSuccess: (post) => toast.success(`Test reminder sent for "${post.title}"! Check your email.`)
    });

    const days = eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) });
    const startDow = startOfMonth(currentMonth).getDay();

    const postsOnDay = (day) => posts.filter(p => {
      if (!p.scheduled_date) return false;
      return isSameDay(parseISO(p.scheduled_date), day);
    });
console.log('posts:', posts);
console.log('type:', typeof posts);
console.log('isArray:', Array.isArray(posts));
    const upcomingPosts = posts.filter(p => p.status !== 'published' && p.scheduled_date >= new Date().toISOString().split('T')[0])
      .sort((a, b) => (a.scheduled_date + a.scheduled_time).localeCompare(b.scheduled_date + b.scheduled_time))
      .slice(0, 10);

    const selectedDayPosts = selectedDay ? postsOnDay(selectedDay) : [];

    return (
      <div className="max-w-7xl mx-auto pb-20 md:pb-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
              <CalendarDays className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="font-display text-3xl font-bold text-foreground">Content Calendar</h1>
              <p className="text-muted-foreground text-sm">{posts.length} posts scheduled</p>
            </div>
          </div>
          <Button onClick={() => { setEditingPost(null); setShowModal(true); }} className="bg-gradient-to-r from-green-400 to-emerald-500 hover:opacity-90 text-black font-semibold shadow-lg shadow-green-500/30">
            <Plus className="w-4 h-4 mr-2" /> Schedule Post
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-2xl p-6">
              {/* Month Nav */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                </button>
                <h2 className="font-display font-bold text-lg text-foreground">{format(currentMonth, 'MMMM yyyy')}</h2>
                <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="p-2 rounded-lg hover:bg-muted transition-colors">
                  <ChevronRight className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                  <div key={d} className="text-center text-xs font-semibold text-muted-foreground py-2">{d}</div>
                ))}
              </div>

              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array(startDow).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
                {days.map(day => {
                  const dayPosts = postsOnDay(day);
                  const isSelected = selectedDay && isSameDay(day, selectedDay);
                  return (
                    <button
                      key={day.toISOString()}
                      onClick={() => setSelectedDay(isSelected ? null : day)}
                      className={`relative min-h-[60px] p-1 rounded-xl text-left transition-all border ${
                        isSelected ? 'bg-primary/20 border-primary/50' :
                        isToday(day) ? 'bg-gradient-to-br from-primary/10 to-accent/10 border-primary/30' :
                        'hover:bg-muted border-transparent'
                      }`}
                    >
                      <span className={`text-xs font-medium block text-center mb-1 ${isToday(day) ? 'text-primary font-bold' : 'text-muted-foreground'}`}>
                        {format(day, 'd')}
                      </span>
                      <div className="space-y-0.5">
                        {dayPosts.slice(0, 2).map((post, i) => (
                          <div key={i} className={`w-full h-1.5 rounded-full ${post.platforms?.[0] ? PLATFORM_COLORS[post.platforms[0]] : 'bg-primary'} opacity-80`} />
                        ))}
                        {dayPosts.length > 2 && <span className="text-[10px] text-muted-foreground">+{dayPosts.length - 2}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Day Posts */}
              {selectedDay && (
                <div className="mt-6 border-t border-border pt-4">
                  <h3 className="font-display font-semibold text-sm text-foreground mb-3">{format(selectedDay, 'MMMM d, yyyy')}</h3>
                  {selectedDayPosts.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No posts scheduled for this day.</p>
                  ) : (
                    <div className="space-y-2">
                      {selectedDayPosts.map(post => (
                        <PostRow key={post.id} post={post} onEdit={() => { setEditingPost(post); setShowModal(true); }} onDelete={() => deletePost.mutate(post.id)} onReminder={() => sendReminder.mutate(post)} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Upcoming Posts */}
          <div>
            <div className="bg-card border border-border rounded-2xl p-6">
              <h2 className="font-display font-bold text-base text-foreground mb-4 flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Upcoming Posts
              </h2>
              {isLoading && <div className="text-center py-8 text-muted-foreground text-sm">Loading...</div>}
              {!isLoading && upcomingPosts.length === 0 && (
                <div className="text-center py-8">
                  <CalendarDays className="w-10 h-10 mx-auto mb-2 text-muted-foreground opacity-30" />
                  <p className="text-sm text-muted-foreground">No upcoming posts yet.</p>
                  <p className="text-xs text-muted-foreground">Schedule your first post! ✨</p>
                </div>
              )}
              <div className="space-y-3">
                {upcomingPosts.map(post => (
                  <div key={post.id} className="border border-border rounded-xl p-3 hover:border-primary/30 transition-colors">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-semibold text-xs text-foreground truncate">{post.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{post.scheduled_date} · {post.scheduled_time}</p>
                        <div className="flex flex-wrap gap-1 mt-1.5">
                          {post.platforms?.slice(0, 3).map(p => (
                            <span key={p} className={`w-2 h-2 rounded-full inline-block ${PLATFORM_COLORS[p]}`} title={p} />
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => sendReminder.mutate(post)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors" title="Send test reminder">
                          <Bell className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => { setEditingPost(post); setShowModal(true); }} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-primary transition-colors">
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => deletePost.mutate(post.id)} className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive transition-colors">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <PostFormModal open={showModal} onClose={() => { setShowModal(false); setEditingPost(null); }} post={editingPost} />
      </div>
    );
  }

  function PostRow({ post, onEdit, onDelete, onReminder }) {
    return (
      <div className="flex items-center justify-between p-3 bg-muted rounded-xl">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-foreground truncate">{post.title}</p>
          <p className="text-xs text-muted-foreground">{post.scheduled_time} · {post.platforms?.join(', ')}</p>
        </div>
        <div className="flex gap-1 shrink-0 ml-2">
          <button onClick={onReminder} className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-primary transition-colors"><Bell className="w-3.5 h-3.5" /></button>
          <button onClick={onEdit} className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-primary transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
          <button onClick={onDelete} className="p-1.5 rounded-lg hover:bg-card text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-3.5 h-3.5" /></button>
        </div>
      </div>
    );
  }