import { auth } from "./firebase";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * A fresh Firebase ID token for the signed-in user, or null.
 * getIdToken() reuses the cached token while valid and refreshes it when it
 * is about to expire, so callers never send a stale token.
 */
export async function currentIdToken(forceRefresh = false) {
  await auth.authStateReady().catch(() => {});
  const user = auth.currentUser;
  return user ? user.getIdToken(forceRefresh) : null;
}

/** Error thrown when the backend cannot be reached at all. */
export class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = "NetworkError";
  }
}

/**
 * fetch() against the backend with the user's bearer token and a timeout.
 * Throws NotSignedIn (code "NOT_SIGNED_IN") if there is no Firebase session.
 */
export async function apiFetch(path, { timeoutMs = 30000, headers, ...options } = {}) {
  const token = await currentIdToken();
  if (!token) {
    const err = new Error("You're signed out. Please sign in again.");
    err.code = "NOT_SIGNED_IN";
    throw err;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(`${API_URL}${path}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
        ...(headers || {}),
      },
    });
  } catch (err) {
    if (err?.name === "AbortError") {
      throw new NetworkError(
        "The server took too long to respond. It may be waking up after being idle — please try again in a moment."
      );
    }
    throw new NetworkError(
      "Can't reach the Veritas server right now. It may be starting up — please try again in about a minute."
    );
  } finally {
    clearTimeout(timer);
  }
}
