
import { api } from "../lib/api";

// GET all scheduled posts
export const getPosts = async () => {
  const res = await api.get("/api/calendar/posts");
  return res.posts || [];
};

// CREATE a post
export const createPost = async (payload) => {
  const res = await api.post("/api/calendar/posts", {
    topic: payload.title,
    content: payload.content,
    platforms: payload.platforms,
    date: payload.scheduled_at.split("T")[0],
    time: payload.scheduled_at.split("T")[1]?.slice(0, 5),
    mode: payload.publish_mode === "auto_publish" ? "auto" : "reminder",
    ai_generated: payload.ai_generated ?? false,
  });

  return res.post || res;
};
// UPDATE a post
export const updatePost = async (id, payload) => {
  const res = await api.put(`/api/calendar/posts/${id}`, payload);
  return res.post || res;
};

// DELETE a post
export const deletePost = async (id) => {
  return api.delete(`/api/calendar/posts/${id}`);
};

// SEND reminder
export const sendReminder = async (id) => {
  return api.post(`/api/calendar/posts/${id}/remind`, {});
};

export { api };
