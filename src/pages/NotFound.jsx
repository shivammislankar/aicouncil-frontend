import { Link } from "react-router-dom";
import usePageMeta from "../hooks/usePageMeta";

/**
 * Client-side safety net. Hard 404s (page reloads, crawler requests) are served
 * the static public/404.html with a real HTTP 404 status by Vercel — this only
 * renders if something navigates to an unmatched route without a full reload,
 * so the user never sees a blank screen.
 */
export default function NotFound() {
  usePageMeta({
    title: "Page not found | Veritas",
    description: "That page doesn't exist. Head back to Veritas and ask five AI agents instead.",
    path: "/404",
  });

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 px-4 text-center bg-background text-foreground">
      <p className="text-7xl md:text-9xl font-extrabold tracking-tighter">404</p>
      <h1 className="text-2xl font-bold">Page not found</h1>
      <p className="text-muted-foreground max-w-md leading-relaxed">
        That link points at a page that doesn&rsquo;t exist — it may have moved, or
        the address might have a typo.
      </p>
      <nav className="flex flex-wrap gap-3 justify-center" aria-label="Not found">
        <Link
          to="/"
          className="px-7 py-3 rounded-full bg-foreground text-background font-semibold hover:opacity-90 transition"
        >
          Back to home
        </Link>
        <Link
          to="/faq"
          className="px-7 py-3 rounded-full border border-border font-semibold hover:bg-card transition"
        >
          Frequently asked questions
        </Link>
        <Link
          to="/privacy"
          className="px-7 py-3 rounded-full border border-border font-semibold hover:bg-card transition"
        >
          Privacy policy
        </Link>
      </nav>
    </main>
  );
}
