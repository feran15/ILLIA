import { auth } from '../Firebase/auth';

const API =
  import.meta.env.VITE_API_URL;

export async function api(
  endpoint,
  options = {}
) {
  const user =
    auth.currentUser;

  let token = null;

  if (user) {
    token =
      await user.getIdToken();
  }

  const response =
    await fetch(
      `${API}${endpoint}`,
      {
        ...options,
        headers: {
          'Content-Type':
            'application/json',

          ...(token && {
            Authorization:
              `Bearer ${token}`
          }),

          ...options.headers
        }
      }
    );

  if (!response.ok) {
    throw new Error(
      `API Error: ${response.status}`
    );
  }

  return response.json();
}