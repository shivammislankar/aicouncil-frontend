import { apiFetch } from "./http";

/** The backend gives one council run up to 150s; allow for a cold start on top. */
const COUNCIL_TIMEOUT_MS = 200000;

export async function askCouncil(question) {
  const response = await apiFetch("/api/council/ask", {
    method: "POST",
    body: JSON.stringify({ question }),
    timeoutMs: COUNCIL_TIMEOUT_MS,
  });

  const data = await response.json().catch(() => ({}));

  if (response.status === 401) {
    const err = new Error("Your session has expired. Please sign in again.");
    err.code = "NOT_SIGNED_IN";
    throw err;
  }
  if (response.status === 403 && data.error === "EMAIL_NOT_VERIFIED") {
    // Unverified password accounts are bounced to /verify-email by the caller.
    const err = new Error(data.message || "Verify your email address first.");
    err.code = "EMAIL_NOT_VERIFIED";
    throw err;
  }
  if (response.status === 429) {
    const retryAfter = Number(response.headers.get("Retry-After"));
    let wait = "";
    if (retryAfter > 0 && retryAfter < 120) wait = ` Try again in about ${retryAfter} seconds.`;
    else if (retryAfter >= 120) wait = ` Try again in about ${Math.ceil(retryAfter / 3600)} hour(s).`;
    throw new Error((data.error || "You're asking questions too quickly.") + wait);
  }
  if (!response.ok) {
    throw new Error(data.error || `Veritas request failed (server returned ${response.status}).`);
  }

  return data;
}
