
import { auth } from "../Firebase/config";

// Worker URLs
const CORE_API_URL = (
  import.meta.env.VITE_CORE_API_URL ||
  import.meta.env.VITE_API_URL
)?.replace(/\/+$/, "");

const AI_API_URL = import.meta.env.VITE_AI_API_URL?.replace(/\/+$/, "");

if (!CORE_API_URL) {
  console.error("Core Worker URL is missing.");
}

if (!AI_API_URL) {
  console.error("AI Worker URL is missing.");
}

async function apiRequest(baseURL, endpoint, options = {}, retry = true) {
  if (!baseURL) {
    throw new Error("Backend API URL is not configured.");
  }

  const user = auth.currentUser;

  if (!user) {
    throw new Error("You must be logged in to continue.");
  }

  const token = await user.getIdToken();

  const isFormData = options.body instanceof FormData;

  const headers = {
    Authorization: `Bearer ${token}`,
    ...(!isFormData && options.body !== undefined
      ? { "Content-Type": "application/json" }
      : {}),
    ...options.headers,
  };

  const url = `${baseURL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Refresh expired Firebase token once
  if (response.status === 401 && retry) {
    await user.getIdToken(true);
    return apiRequest(baseURL, endpoint, options, false);
  }

  const contentType = response.headers.get("content-type");

  const data = contentType?.includes("application/json")
    ? await response.json().catch(() => ({}))
    : await response.text().catch(() => "");

  if (!response.ok) {
    throw new Error(
      typeof data === "object"
        ? data.error || data.message || "Something went wrong."
        : data || "Something went wrong."
    );
  }

  return data;
}

// Create an API client for each worker
function createAPI(baseURL) {
  return {
    get: (endpoint, options = {}) =>
      apiRequest(baseURL, endpoint, {
        ...options,
        method: "GET",
      }),

    post: (endpoint, body, options = {}) =>
      apiRequest(baseURL, endpoint, {
        ...options,
        method: "POST",
        body:
          body instanceof FormData
            ? body
            : JSON.stringify(body),
      }),

    put: (endpoint, body, options = {}) =>
      apiRequest(baseURL, endpoint, {
        ...options,
        method: "PUT",
        body:
          body instanceof FormData
            ? body
            : JSON.stringify(body),
      }),

    patch: (endpoint, body, options = {}) =>
      apiRequest(baseURL, endpoint, {
        ...options,
        method: "PATCH",
        body:
          body instanceof FormData
            ? body
            : JSON.stringify(body),
      }),

    delete: (endpoint, options = {}) =>
      apiRequest(baseURL, endpoint, {
        ...options,
        method: "DELETE",
      }),

    upload: (endpoint, formData, options = {}) =>
      apiRequest(baseURL, endpoint, {
        ...options,
        method: "POST",
        body: formData,
      }),
  };
};

// Core Worker: profiles, calendar, analytics, trends, social accounts
export const api = createAPI(CORE_API_URL);

// AI Worker: chat, threads, projects
export const aiApi = createAPI(AI_API_URL);
