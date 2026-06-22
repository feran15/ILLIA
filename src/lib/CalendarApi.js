import { api } from "@/lib/api";

// GET all posts
export const getPosts = async () => {
  const res = await api("/api/calendar/posts");
  return res.posts || [];
};

// CREATE post
export const createPost = async (payload) => {
  const res = await api("/api/calendar/posts", {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return res.post;
};

// DELETE post
export const deletePost = async (id) => {
  return api(`/api/calendar/posts/${id}`, {
    method: "DELETE",
  });
};

// SEND reminder
export const sendReminder = async (id) => {
  return api(`/api/calendar/posts/${id}/remind`, {
    method: "POST",
  });
};

export {api}