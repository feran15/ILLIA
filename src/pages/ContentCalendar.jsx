import { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { AlertCircle, Bell, CalendarDays, ChevronLeft, ChevronRight, Clock, Pencil, Plus, Trash2, X } from 'lucide-react';
import { toast } from 'sonner';
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  isTomorrow,
  parseISO,
  startOfMonth,
  subMonths,
} from 'date-fns';
import PostFormModal from '../components/Studio/PostFormModal';
import api from '../lib/api';

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */

const PLATFORMS = {
  linkedin: { label: 'LinkedIn', color: '#3B82F6' },
  instagram: { label: 'Instagram', color: '#EC4899' },
  twitter: { label: 'X / Twitter', color: '#38BDF8' },
  facebook: { label: 'Facebook', color: '#6366F1' },
  tiktok: { label: 'TikTok', color: '#F43F5E' },
};
const FALLBACK_COLOR = '#8B5CF6';

const platformOf = (id) =>
  PLATFORMS[String(id).toLowerCase()] || { label: String(id), color: FALLBACK_COLOR };
const colorOf = (post) => (post.platforms?.[0] ? platformOf(post.platforms[0]).color : FALLBACK_COLOR);

function formatTime(t) {
  const m = String(t ?? '').match(/^(\d{1,2}):(\d{2})/);
  if (!m) return t || '';
  const h = Number(m[1]);
  return `${h % 12 || 12}:${m[2]} ${h >= 12 ? 'PM' : 'AM'}`;
}

function dayLabel(dateStr) {
  const d = parseISO(dateStr);
  if (isToday(d)) return 'Today';
  if (isTomorrow(d)) return 'Tomorrow';
  return format(d, 'EEE, d MMM');
}

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/* ------------------------------------------------------------------ */
/* Post card                                                           */
/* ------------------------------------------------------------------ */

function PostCard({ post, showDate, onEdit, onDelete, onReminder }) {
  const when = [showDate && dayLabel(post.scheduled_date), formatTime(post.scheduled_time)]
    .filter(Boolean)
    .join(' · ');
  const published = post.status === 'published';

  const iconBtn =
    'grid h-9 w-9 place-items-center rounded-lg text-[#A49BAF] transition hover:bg-[#F8F5FC]';

  return (
    <li className="rounded-2xl border border-[#EEE9F2] bg-white p-3.5 transition hover:border-violet-200">
      <div className="flex items-start gap-3">
        <span className="mt-0.5 h-11 w-1 shrink-0 rounded-full" style={{ background: colorOf(post) }} />

        <div className="min-w-0 flex-1">
          <p className="truncate text-[13.5px] font-bold">{post.title || 'Untitled post'}</p>
          {when && (
            <p className="mt-0.5 flex items-center gap-1.5 text-xs text-[#8F869D]">
              <Clock size={12} /> {when}
            </p>
          )}
          <div className="mt-2 flex flex-wrap items-center gap-1.5">
            {post.platforms?.map((p) => {
              const info = platformOf(p);
              return (
                <span
                  key={p}
                  className="inline-flex items-center gap-1.5 rounded-full bg-[#F8F5FC] px-2 py-1 text-[11px] font-semibold text-[#6E647C]"
                >
                  <span className="h-1.5 w-1.5 rounded-full" style={{ background: info.color }} />
                  {info.label}
                </span>
              );
            })}
            <span
              className={`rounded-full px-2 py-1 text-[11px] font-bold ${
                published ? 'bg-emerald-50 text-emerald-700' : 'bg-violet-50 text-violet-700'
              }`}
            >
              {published ? 'Published' : 'Scheduled'}
            </span>
          </div>
        </div>

        <div className="flex shrink-0">
          <button type="button" onClick={onReminder} aria-label="Send reminder" className={`${iconBtn} hover:text-violet-700`}>
            <Bell size={15} />
          </button>
          <button type="button" onClick={onEdit} aria-label="Edit post" className={`${iconBtn} hover:text-violet-700`}>
            <Pencil size={15} />
          </button>
          <button type="button" onClick={onDelete} aria-label="Delete post" className={`${iconBtn} hover:text-rose-500`}>
            <Trash2 size={15} />
          </button>
        </div>
      </div>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ContentCalendar() {
  const queryClient = useQueryClient();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ['scheduledPosts'],
    queryFn: async () => {
      const res = await api('/api/calendar/posts');
      return Array.isArray(res?.posts) ? res.posts : [];
    },
  });
  const posts = Array.isArray(data) ? data : [];

  const deletePost = useMutation({
    mutationFn: (id) => api(`/api/calendar/posts/${id}`, { method: 'DELETE' }),
    onSuccess: () => {
      toast.success('Post deleted.');
      queryClient.invalidateQueries({ queryKey: ['scheduledPosts'] });
    },
    onError: () => toast.error("Couldn't delete that post. Try again."),
  });

  // Placeholder from the original page: it only shows a toast, it does not send anything yet.
  const sendReminder = useMutation({
    mutationFn: async (post) => post,
    onSuccess: (post) => toast.success(`Reminder sent for "${post.title}"`),
  });

  const days = useMemo(
    () => eachDayOfInterval({ start: startOfMonth(currentMonth), end: endOfMonth(currentMonth) }),
    [currentMonth]
  );
  const startDow = startOfMonth(currentMonth).getDay();

  const postsOnDay = (day) =>
    posts.filter((p) => p.scheduled_date && isSameDay(parseISO(p.scheduled_date), day));

  const monthCount = posts.filter(
    (p) => p.scheduled_date && isSameMonth(parseISO(p.scheduled_date), currentMonth)
  ).length;

  // local date, not UTC, so evenings in Nigeria don't count as "tomorrow"
  const today = format(new Date(), 'yyyy-MM-dd');
  const upcomingPosts = posts
    .filter((p) => p.scheduled_date && p.status !== 'published' && p.scheduled_date >= today)
    .sort((a, b) =>
      `${a.scheduled_date}${a.scheduled_time ?? ''}`.localeCompare(`${b.scheduled_date}${b.scheduled_time ?? ''}`)
    )
    .slice(0, 10);

  const selectedDayPosts = selectedDay ? postsOnDay(selectedDay) : [];
  const panelPosts = selectedDay ? selectedDayPosts : upcomingPosts;

  const openNew = () => {
    setEditingPost(null);
    setShowModal(true);
  };
  const openEdit = (post) => {
    setEditingPost(post);
    setShowModal(true);
  };
  const confirmDelete = (post) => {
    if (window.confirm(`Delete "${post.title || 'this post'}"?`)) deletePost.mutate(post.id);
  };

  return (
    // pt-16 on phones leaves room for the sidebar's fixed menu button
    <div className="min-h-screen w-full bg-white px-3 pb-10 pt-16 text-[#292035] sm:px-6 lg:px-10 lg:pt-8">
      <div className="mx-auto w-full max-w-[1200px]">
        {/* Header */}
        <header className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div className="min-w-0">
            <h1 className="flex items-center gap-3 text-[28px] font-black tracking-[-0.8px] sm:text-[34px]">
              <CalendarDays className="text-violet-600" size={30} />
              Calendar
            </h1>
            <p className="mt-1.5 text-sm text-[#8F869D]">
              {posts.length === 0 && !isLoading
                ? 'Plan your posts and never miss a day.'
                : `${posts.length} ${posts.length === 1 ? 'post' : 'posts'} planned in total.`}
            </p>
          </div>

          <button
            type="button"
            onClick={openNew}
            className="inline-flex h-11 items-center gap-2 rounded-xl bg-[#2A1733] px-4 text-[13px] font-extrabold text-white hover:bg-[#3A2447]"
          >
            <Plus size={16} />
            Schedule post
          </button>
        </header>

        {error && (
          <p className="mb-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-2.5 text-[13px] text-rose-700">
            <AlertCircle size={16} className="shrink-0" />
            Couldn't load your posts. {error.message}
          </p>
        )}

        <div className="grid grid-cols-1 items-start gap-5 lg:grid-cols-[minmax(0,1fr)_360px]">
          {/* Calendar */}
          <section className="rounded-[24px] border border-[#EEE9F2] bg-white p-3 sm:p-6">
            <div className="mb-5 flex items-center justify-between gap-2">
              <div className="min-w-0">
                <h2 className="text-lg font-extrabold">{format(currentMonth, 'MMMM yyyy')}</h2>
                <p className="text-xs text-[#8F869D]">
                  {monthCount} {monthCount === 1 ? 'post' : 'posts'} this month
                </p>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentMonth(new Date());
                    setSelectedDay(new Date());
                  }}
                  className="h-10 rounded-xl border border-[#E9E1F3] px-3.5 text-[13px] font-bold text-[#4A3D5A] hover:bg-[#FAF8FD]"
                >
                  Today
                </button>
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-[#E9E1F3] text-[#6E647C] hover:bg-[#FAF8FD]"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                  className="grid h-10 w-10 place-items-center rounded-xl border border-[#E9E1F3] text-[#6E647C] hover:bg-[#FAF8FD]"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="mb-1 grid grid-cols-7">
              {WEEKDAYS.map((d) => (
                <div key={d} className="py-2 text-center text-[11px] font-bold text-[#A49BAF]">
                  <span className="sm:hidden">{d[0]}</span>
                  <span className="hidden sm:inline">{d}</span>
                </div>
              ))}
            </div>

            <div className={`grid grid-cols-7 gap-1 sm:gap-1.5 ${isLoading ? 'opacity-60' : ''}`}>
              {Array(startDow)
                .fill(null)
                .map((_, i) => (
                  <div key={`empty-${i}`} />
                ))}

              {days.map((day) => {
                const dayPosts = postsOnDay(day);
                const selected = selectedDay && isSameDay(day, selectedDay);
                const todayCell = isToday(day);

                return (
                  <button
                    key={day.toISOString()}
                    type="button"
                    onClick={() => setSelectedDay(selected ? null : day)}
                    aria-label={`${format(day, 'EEEE d MMMM')}, ${dayPosts.length} posts`}
                    aria-pressed={Boolean(selected)}
                    className={`flex min-h-[52px] flex-col items-center rounded-xl border p-1 text-left transition sm:min-h-[92px] sm:items-stretch sm:p-1.5 ${
                      selected
                        ? 'border-violet-400 bg-violet-50'
                        : 'border-transparent hover:border-[#E9E1F3] hover:bg-[#FAF8FD]'
                    }`}
                  >
                    <span
                      className={`grid h-6 w-6 place-items-center rounded-full text-xs font-bold sm:h-7 sm:w-7 sm:text-[13px] ${
                        todayCell ? 'bg-violet-600 text-white' : 'text-[#4A3D5A]'
                      }`}
                    >
                      {format(day, 'd')}
                    </span>

                    {/* phones: dots */}
                    <div className="mt-1 flex flex-wrap justify-center gap-0.5 sm:hidden">
                      {dayPosts.slice(0, 3).map((p, i) => (
                        <span key={i} className="h-1.5 w-1.5 rounded-full" style={{ background: colorOf(p) }} />
                      ))}
                    </div>

                    {/* larger screens: short titles */}
                    <div className="mt-1 hidden space-y-1 sm:block">
                      {dayPosts.slice(0, 2).map((p, i) => (
                        <p
                          key={i}
                          className="truncate rounded-md px-1.5 py-0.5 text-[10.5px] font-semibold text-[#4A3D5A]"
                          style={{ background: `color-mix(in srgb, ${colorOf(p)} 16%, white)` }}
                        >
                          {p.title || 'Untitled'}
                        </p>
                      ))}
                      {dayPosts.length > 2 && (
                        <p className="px-1 text-[10.5px] font-semibold text-[#8F869D]">+{dayPosts.length - 2} more</p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          {/* Side panel: selected day, or what's coming up */}
          <aside className="rounded-[24px] border border-[#EEE9F2] bg-white p-4 sm:p-5 lg:sticky lg:top-6">
            <div className="mb-4 flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-base font-extrabold">
                  {selectedDay ? format(selectedDay, 'EEEE, d MMMM') : 'Coming up'}
                </h2>
                <p className="mt-0.5 text-xs text-[#8F869D]">
                  {selectedDay
                    ? `${selectedDayPosts.length} ${selectedDayPosts.length === 1 ? 'post' : 'posts'} on this day`
                    : 'Your next scheduled posts'}
                </p>
              </div>
              {selectedDay && (
                <button
                  type="button"
                  onClick={() => setSelectedDay(null)}
                  className="inline-flex h-8 shrink-0 items-center gap-1 rounded-lg px-2.5 text-xs font-bold text-violet-700 hover:bg-violet-50"
                >
                  <X size={13} /> Upcoming
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="space-y-3" aria-busy="true">
                {[0, 1, 2].map((i) => (
                  <div key={i} className="h-[88px] animate-pulse rounded-2xl bg-[#F3EFF8]" />
                ))}
              </div>
            ) : panelPosts.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#DCD2EA] px-5 py-10 text-center">
                <span className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-600">
                  <CalendarDays size={22} />
                </span>
                <p className="text-sm font-extrabold">
                  {selectedDay ? 'Nothing scheduled for this day' : 'No upcoming posts yet'}
                </p>
                <p className="mt-1 text-xs text-[#8F869D]">
                  {selectedDay ? 'Pick another day, or add a post.' : 'Schedule your first post to see it here.'}
                </p>
                <button
                  type="button"
                  onClick={openNew}
                  className="mt-4 inline-flex h-10 items-center gap-2 rounded-xl bg-[#2A1733] px-4 text-[13px] font-extrabold text-white hover:bg-[#3A2447]"
                >
                  <Plus size={15} /> Schedule post
                </button>
              </div>
            ) : (
              <ul className="space-y-3">
                {panelPosts.map((post) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    showDate={!selectedDay}
                    onEdit={() => openEdit(post)}
                    onDelete={() => confirmDelete(post)}
                    onReminder={() => sendReminder.mutate(post)}
                  />
                ))}
              </ul>
            )}
          </aside>
        </div>
      </div>

      <PostFormModal
        open={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingPost(null);
        }}
        post={editingPost}
      />
    </div>
  );
}