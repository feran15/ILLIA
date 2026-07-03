// lib/api.js
import { auth } from '../Firebase/auth';

const API = import.meta.env.VITE_API_URL;

export async function api(endpoint, options = {}) {
  const user = auth.currentUser;

  const token = user
    ? await user.getIdToken()
    : null;

  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(token && {
      Authorization: `Bearer ${token}`,
    }),
    ...options.headers,
  };

  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API}${endpoint}`, {
    ...options,
    headers,
  });

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

// NEW
api.updateMe = async (userData) => {
  return api('/users/me', {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};
api.auth = {
  me: () => api('/auth/me'),
};


export default api;