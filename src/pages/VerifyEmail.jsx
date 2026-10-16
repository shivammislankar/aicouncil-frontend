import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MailCheck, AlertCircle, ArrowRight, LogOut } from 'lucide-react';
import { auth } from '../services/firebase';
import { useAuth } from '../context/AuthContext';
import { requestOtp, verifyOtp, verificationStatus } from '../services/auth';
import usePageMeta from '../hooks/usePageMeta';
import Footer from '../components/Footer';

const RESEND_COOLDOWN_SECONDS = 60;

export default function VerifyEmail() {
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [sending, setSending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [email, setEmail] = useState('');

  const navigate = useNavigate();
  const { logout } = useAuth();

  usePageMeta({
    title: 'Verify your email | Veritas',
    description: 'Enter the 6-digit code sent to your inbox to activate your Veritas account.',
    path: '/verify-email',
  });

  // If there is no session, or the address is already verified, this page
  // has nothing to do — bounce to the right place.
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await auth.authStateReady().catch(() => {});
      const user = auth.currentUser;
      if (cancelled) return;
      if (!user) {
        navigate('/signup', { replace: true });
        return;
      }
      setEmail(user.email || '');
      try {
        const status = await verificationStatus();
        if (!cancelled && status.verified) navigate('/council', { replace: true });
      } catch {
        /* status check is best-effort; the verify call is authoritative */
      }
    })();
    return () => { cancelled = true; };
  }, [navigate]);

  useEffect(() => {
    if (cooldown <= 0) return;
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  async function handleVerify(e) {
    e.preventDefault();
    setError('');
    setInfo('');
    if (!/^\d{6}$/.test(code.trim())) {
      setError('Enter the 6-digit code from the email.');
      return;
    }
    setVerifying(true);
    try {
      const { response, data } = await verifyOtp(code.trim());
      if (response.ok && data.verified) {
        navigate('/council', { replace: true });
      } else {
        setCode('');
        setError(data.error || 'That code didn\'t work. Try again.');
      }
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setVerifying(false);
    }
  }

  async function handleResend() {
    if (sending || cooldown > 0 || !email) return;
    setError('');
    setInfo('');
    setSending(true);
    try {
      const { response, data } = await requestOtp();
      if (response.ok) {
        setInfo('A fresh code is on its way. Check your inbox (and spam folder).');
        setCooldown(RESEND_COOLDOWN_SECONDS);
      } else if (response.status === 429) {
        setError(data.error || 'Too many codes requested. Wait a few minutes.');
      } else if (response.status === 503) {
        setError('Email verification isn\'t switched on yet. Your account works without it for now — head to the council.');
      } else {
        setError(data.error || 'Could not send a new code. Try again in a minute.');
      }
    } catch {
      setError('Could not reach the server. Check your connection and try again.');
    } finally {
      setSending(false);
    }
  }

  async function handleLogout() {
    await logout().catch(() => {});
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md bg-card border border-border rounded-xl shadow-xl">
          <div className="px-6 pt-8 pb-6 border-b border-border text-center">
            <div className="w-10 h-10 bg-accent/20 rounded-lg mx-auto flex items-center justify-center">
              <MailCheck className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-2xl font-bold mt-3">Check your inbox</h1>
            <p className="text-sm text-muted-foreground mt-1">
              {email ? (
                <>We sent a 6-digit code to <span className="font-semibold text-foreground">{email}</span>. It expires in 10 minutes.</>
              ) : (
                <>We sent a 6-digit code to your email. It expires in 10 minutes.</>
              )}
            </p>
          </div>

          <form onSubmit={handleVerify} className="p-6 space-y-4">
            <div>
              <label htmlFor="otp-code" className="text-sm font-medium text-foreground">
                Verification code
              </label>
              <input
                id="otp-code"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={6}
                placeholder="123456"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                required
                className="mt-1 w-full px-4 py-2.5 rounded-lg border border-border bg-input text-foreground text-center text-xl tracking-[0.5em] font-mono"
              />
            </div>

            {error && (
              <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded">
                <AlertCircle className="w-4 h-4 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}
            {info && (
              <div className="p-3 bg-accent/10 border border-border rounded">
                <p className="text-sm text-foreground">{info}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={verifying}
              className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 bg-accent text-background hover:opacity-90 transition disabled:opacity-60"
            >
              {verifying ? 'Verifying…' : <>Verify email <ArrowRight className="w-4 h-4" /></>}
            </button>

            <div className="flex items-center justify-between text-sm">
              <button
                type="button"
                onClick={handleResend}
                disabled={sending || cooldown > 0}
                className="text-accent hover:underline disabled:no-underline disabled:text-muted-foreground"
              >
                {cooldown > 0
                  ? `Resend code in ${cooldown}s`
                  : sending ? 'Sending…' : 'Resend code'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-3.5 h-3.5" /> Use a different account
              </button>
            </div>

            <p className="text-sm text-center text-muted-foreground">
              <Link to="/" className="text-accent hover:underline">Back to home</Link>
            </p>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
