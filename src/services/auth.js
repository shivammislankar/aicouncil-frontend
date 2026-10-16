import { signInWithPopup, GithubAuthProvider } from "firebase/auth";
import { auth } from "./firebase";
import { apiFetch, currentIdToken } from "./http";

/**
 * GitHub sign-in via Firebase (the GitHub provider must be enabled in the
 * Firebase console). Firebase keeps the session; nothing is stored here.
 */
export async function loginWithGitHub() {
  return signInWithPopup(auth, new GithubAuthProvider());
}

async function authed(path, options = {}) {
  const response = await apiFetch(path, options);
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

/**
 * Ask the backend to email a fresh 6-digit code to the signed-in account's
 * own address. The server takes the address from the ID token, never from
 * the request, so it can't be pointed at someone else's inbox.
 */
export async function requestOtp() {
  return authed("/api/auth/otp/request", { method: "POST" });
}

/** Check the code for the signed-in account's own address. */
export async function verifyOtp(code) {
  const result = await authed("/api/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
  if (result.response.ok && result.data.verified) {
    // The server marked the email verified in Firebase; refresh the ID token
    // so later requests carry email_verified=true.
    await currentIdToken(true).catch(() => null);
  }
  return result;
}

/** Tell the backend to trust this email if the sign-in arrived through GitHub. */
export async function syncOAuthProvider() {
  const result = await authed("/api/auth/oauth-sync", { method: "POST" });
  if (result.response.ok && result.data.verified) {
    await currentIdToken(true).catch(() => null);
  }
  return result;
}

/** Does this account still owe us a verified address? */
export async function verificationStatus() {
  const { data } = await authed("/api/auth/verification-status");
  return data;
}
