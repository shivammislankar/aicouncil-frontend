import { Link } from "react-router-dom";

/**
 * Public site footer. Also satisfies two checklist items at once:
 *   - item 6  internal links between pages, with descriptive link text
 *   - item 13 privacy policy reachable from every page's footer
 */
export default function Footer() {
  return (
    <footer className="border-t border-border/50 bg-background text-foreground">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col gap-8 md:flex-row md:justify-between">
          <div className="max-w-sm space-y-2">
            <p className="font-bold tracking-wide">VERITAS</p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Five specialised AI roles deliberate on your question and return one
              transparent, well-reasoned answer.
            </p>
          </div>

          <nav aria-label="Footer" className="flex flex-col gap-3 md:gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Product
            </p>
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition">
              Home
            </Link>
            <Link
              to="/signup"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Create a free account
            </Link>
            <Link
              to="/login"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Sign in to your account
            </Link>
          </nav>

          <nav aria-label="Support" className="flex flex-col gap-3 md:gap-2">
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Information
            </p>
            <Link to="/faq" className="text-sm text-muted-foreground hover:text-foreground transition">
              Frequently asked questions
            </Link>
            <Link
              to="/privacy"
              className="text-sm text-muted-foreground hover:text-foreground transition"
            >
              Privacy policy
            </Link>
          </nav>
        </div>

        <p className="mt-8 pt-6 border-t border-border/50 text-xs text-muted-foreground">
          © {new Date().getFullYear()} Veritas. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
