import { auth } from '../Firebase/auth';

const API = import.meta.env.VITE_API_URL;

export async function api(
  endpoint,
  options = {}
) {
  const user = auth.currentUser;

  let token = null;

  if (user) {
    token = await user.getIdToken();
  }

  const response = await fetch(
    `${API}${endpoint}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',

        ...(token && {
          Authorization: `Bearer ${token}`
        }),

        ...options.headers
      }
    }
  );

  let data;

  try {
    data = await response.json();
  } catch {
    data = null;
  }

  if (!response.ok) {
    const error = new Error(
      data?.message ||
      data?.error ||
      `API Error: ${response.status}`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

export default api;