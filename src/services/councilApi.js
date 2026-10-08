import { auth } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Resolve a valid Firebase ID token.
 * Firebase tokens expire after 1 hour, so we always ask Firebase for a
 * current token instead of blindly reusing the one saved at login time.
 * Falls back to the passed-in token if the auth session is not ready yet.
 */
async function resolveToken(fallbackToken) {
  try {
    // Wait until Firebase has restored the auth session (fast if already ready)
    await auth.authStateReady();
    if (auth.currentUser) {
      // getIdToken() returns the cached token when still valid,
      // and automatically refreshes it when expired / about to expire.
      return await auth.currentUser.getIdToken();
    }
  } catch (err) {
    console.warn("Could not refresh Firebase token, using stored one", err);
  }
  return fallbackToken;
}

export async function askCouncil(token, question) {
  const authToken = await resolveToken(token);

  let response;
  try {
    response = await fetch(`${API_URL}/api/council/ask`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",

        // 🔑 THIS LINE IS NON-NEGOTIABLE
        Authorization: `Bearer ${authToken}`,
      },
      body: JSON.stringify({ question }),
    });
  } catch {
    // fetch itself failed → backend unreachable (not running / wrong URL)
    throw new Error(
      "Cannot reach the server. Make sure the backend is running on port 8080."
    );
  }

  if (response.status === 401) {
    throw new Error("Your session has expired. Please log out and log back in.");
  }
  if (response.status === 429) {
    const retryAfter = response.headers.get("Retry-After");
    const wait = retryAfter ? ` Try again in about ${retryAfter} seconds.` : "";
    throw new Error(`You're asking questions faster than the free model tiers allow.${wait}`);
  }
  if (!response.ok) {
    throw new Error(`Veritas request failed (server returned ${response.status})`);
  }

  return response.json();
}
