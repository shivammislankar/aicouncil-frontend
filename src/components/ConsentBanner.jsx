import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { analyticsConfigured, initAnalytics } from "../lib/analytics";

const STORAGE_KEY = "analytics_consent";

/**
 * Cookie / analytics consent banner.
 *
 * GA4 is only ever loaded after an explicit "Accept" — never before — which is
 * what EU, UK and Swiss visitors require. "Decline" stores the refusal and the
 * site works exactly the same without analytics.
 *
 * Renders nothing at all until VITE_GA_ID is configured, so today's visitors
 * see no banner.
 */
export default function ConsentBanner() {
  // Decide visibility synchronously during the first render rather than in an
  // effect, so this never trips react-hooks/set-state-in-effect.
  const [visible, setVisible] = useState(() => {
    if (!analyticsConfigured()) return false;
    try {
      return localStorage.getItem(STORAGE_KEY) === null;
    } catch {
      // storage blocked (private mode / strict cookies) - ask anyway
      return true;
    }
  });

  useEffect(() => {
    if (!analyticsConfigured()) return;
    try {
      if (localStorage.getItem(STORAGE_KEY) === "granted") initAnalytics();
    } catch {
      /* ignore */
    }
  }, []);

  function decide(choice) {
    try {
      localStorage.setItem(STORAGE_KEY, choice);
    } catch {
      /* ignore */
    }
    setVisible(false);
    if (choice === "granted") initAnalytics();
  }

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Analytics consent"
      className="fixed bottom-0 inset-x-0 z-50 p-4 sm:p-5"
    >
      <div className="max-w-3xl mx-auto p-5 rounded-2xl border border-border bg-card shadow-2xl text-foreground">
        <p className="font-semibold">Can we count your visit?</p>
        <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">
          Veritas uses Google Analytics to see how many people use the site and
          which pages they visit. Nothing is loaded until you accept, no
          advertising cookies are set, and declining changes nothing about how the
          site works.{" "}
          <Link to="/privacy" className="text-accent hover:underline">
            See the privacy policy
          </Link>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            onClick={() => decide("granted")}
            className="px-5 py-2 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition"
          >
            Accept analytics
          </button>
          <button
            onClick={() => decide("denied")}
            className="px-5 py-2 rounded-full border border-border text-sm font-semibold hover:bg-background transition"
          >
            Decline
          </button>
        </div>
      </div>
    </div>
  );
}
