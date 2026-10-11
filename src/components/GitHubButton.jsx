import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { loginWithGitHub, syncOAuthProvider } from '../services/auth';

/** The GitHub "mark" (Octocat silhouette path), drawn inline so no asset is needed. */
function GitHubMark({ className }) {
  return (
    <svg viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8Z" />
    </svg>
  );
}

/**
 * "Continue with GitHub" button. On success the backend is told to trust the
 * address (GitHub emails arrive pre-verified) and the caller lands on /council.
 * Failures surface as the page's own error message via onError.
 */
export default function GitHubButton({ onError, label = 'Continue with GitHub' }) {
  const [busy, setBusy] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  async function handleClick() {
    if (busy) return;
    setBusy(true);
    try {
      const token = await loginWithGitHub();
      login(token);
      // Best-effort: if the sync fails, /council's own gate redirects to
      // /verify-email rather than stranding the user.
      await syncOAuthProvider().catch(() => null);
      navigate('/council');
    } catch (err) {
      if (err?.code === 'auth/account-exists-with-different-credential') {
        onError?.('That GitHub email already has a password account. Sign in with your email and password instead.');
      } else if (err?.code === 'auth/popup-closed-by-user') {
        // Deliberate dismiss — not an error worth showing.
      } else if (err?.code === 'auth/unauthorized-domain') {
        onError?.('This site isn\'t authorised for GitHub sign-in yet. The domain needs adding in Firebase Authentication → Settings.');
      } else {
        onError?.('GitHub sign-in failed. Try again or use email instead.');
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 border border-border bg-background text-foreground hover:bg-card transition disabled:opacity-60"
    >
      <GitHubMark className="w-4 h-4" />
      {busy ? 'Connecting…' : label}
    </button>
  );
}
