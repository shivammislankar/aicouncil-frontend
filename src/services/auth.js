import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GithubAuthProvider,
} from "firebase/auth";
import { auth } from "./firebase";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

export async function login(email, password) {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  const token = await userCredential.user.getIdToken();
  return token;
}

/**
 * GitHub sign-in via Firebase (the GitHub provider must be enabled in the
 * Firebase console). Returns a fresh ID token for the signed-in user.
 */
export async function loginWithGitHub() {
  const provider = new GithubAuthProvider();
  const userCredential = await signInWithPopup(auth, provider);
  return userCredential.user.getIdToken();
}

async function authed(path, options = {}) {
  await auth.authStateReady().catch(() => {});
  const token = auth.currentUser
    ? await auth.currentUser.getIdToken()
    : localStorage.getItem("token");

  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

/** Public: ask the backend to email a fresh 6-digit code. */
export async function requestOtp(email) {
  const response = await fetch(`${API_URL}/api/auth/otp/request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  const data = await response.json().catch(() => ({}));
  return { response, data };
}

/** Authenticated: check the code for the signed-in account's own address. */
export async function verifyOtp(code) {
  return authed("/api/auth/otp/verify", {
    method: "POST",
    body: JSON.stringify({ code }),
  });
}

/**
 * Authenticated: tell the backend to trust this email if the sign-in arrived
 * through GitHub. Call once right after a GitHub login.
 */
export async function syncOAuthProvider() {
  return authed("/api/auth/oauth-sync", { method: "POST" });
}

/** Authenticated: does this account still owe us a verified address? */
export async function verificationStatus() {
  const { data } = await authed("/api/auth/verification-status");
  return data;
}
