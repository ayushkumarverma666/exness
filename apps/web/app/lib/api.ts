import axios, { AxiosError } from "axios";

/**
 * By default the web app talks to the API through its own origin (`/api`, proxied
 * by Next.js), so session cookies are first-party. Set NEXT_PUBLIC_API_URL when the
 * API lives on another domain; the bearer token then keeps the session working
 * even where third-party cookies are blocked.
 */
export const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";
const TOKEN_KEY = "session_token";

export const session = {
  get(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  },
  set(token: string | null) {
    try {
      if (token) localStorage.setItem(TOKEN_KEY, token);
      else localStorage.removeItem(TOKEN_KEY);
    } catch {
      /* storage unavailable */
    }
  },
};

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  timeout: 12_000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = typeof window !== "undefined" ? session.get() : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export function apiError(error: unknown, fallback = "Something went wrong") {
  if (error instanceof AxiosError) {
    if (!error.response) return "Cannot reach the server. Check your connection.";
    return (error.response.data as { error?: string })?.error || fallback;
  }
  return fallback;
}
