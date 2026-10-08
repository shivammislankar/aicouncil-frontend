'use client';

import { useState } from 'react';
import { Lock, Mail, AlertCircle, ArrowRight } from 'lucide-react';
import { useNavigate, Link } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import usePageMeta from "../hooks/usePageMeta";
import Footer from "../components/Footer";

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuth();

  usePageMeta({
    title: "Sign in to Veritas",
    description:
      "Sign in to your Veritas account and pick up your five-agent reasoning conversations where you left off.",
    path: "/login",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const token = await userCredential.user.getIdToken();

      // ✅ Update AuthContext state (not just localStorage) so ProtectedRoute
      //    sees the token and allows the redirect to /council.
      login(token);

      // ✅ Navigate after success
      navigate("/council");

    } catch (err) {
      console.error(err);
      setError("Invalid email or password");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 flex items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-md bg-background text-foreground">
        <div className="bg-card border border-border rounded-xl shadow-2xl overflow-hidden">
          <div className="px-6 pt-8 pb-6 border-b border-border text-center">
            <div className="w-10 h-10 bg-accent/20 rounded-lg mx-auto flex items-center justify-center">
              <Lock className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-2xl font-bold mt-3 ">Welcome Back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to access Veritas
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="text-sm font-medium text-foreground">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-input text-foreground"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-input text-foreground"
                />
              </div>
            </div>

            {error && (
              <div className="flex gap-2 p-3 bg-destructive/10 border border-destructive/30 rounded">
                <AlertCircle className="w-4 h-4 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 rounded-lg font-semibold flex items-center justify-center gap-2 bg-accent text-background hover:opacity-90 transition"
            >
              {isLoading ? "Signing in..." : <>Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>

            <p className="text-sm text-center text-muted-foreground">
              Don't have an account?{' '}
              <Link to="/signup" className="text-accent hover:underline">
                Create one
              </Link>
            </p>
          </form>
        </div>
      </div>
      </div>
      <Footer />
    </div>
  );
}
