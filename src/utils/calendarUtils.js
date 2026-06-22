import {
  isSameDay,
  parseISO
} from "date-fns";

export function getPostsOnDay(posts, day) {
  const safe = Array.isArray(posts) ? posts : [];

  return safe.filter((p) => {
    if (!p.scheduled_date) return false;

    return isSameDay(
      parseISO(p.scheduled_date),
      day
    );
  });
}

export function getUpcomingPosts(posts) {
  const safe = Array.isArray(posts) ? posts : [];

  return safe
    .filter((p) => p.status !== "published")
    .sort(
      (a, b) =>
        (a.scheduled_date + a.scheduled_time)
          .localeCompare(
            b.scheduled_date + b.scheduled_time
          )
    )
    .slice(0, 10);
}