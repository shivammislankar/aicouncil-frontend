import { useEffect } from "react";

const SITE_URL = "https://ai-council-one-livid.vercel.app";

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Sets the per-page <title>, meta description, canonical URL and the
 * Open Graph / Twitter tags as the user moves between routes.
 *
 * index.html carries the homepage values so crawlers that don't execute
 * JavaScript still see correct metadata on first paint.
 *
 *   usePageMeta({
 *     title: "Frequently Asked Questions | Veritas",
 *     description: "How Veritas works, what it costs, and how your data is handled.",
 *     path: "/faq",
 *   });
 */
export default function usePageMeta({ title, description, path }) {
  const canonical = path ? `${SITE_URL}${path === "/" ? "/" : path}` : SITE_URL;

  useEffect(() => {
    if (title) document.title = title;

    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:url", canonical);
    setMeta("name", "twitter:title", title);
    setMeta("name", "twitter:description", description);

    let link = document.head.querySelector('link[rel="canonical"]');
    if (!link) {
      link = document.createElement("link");
      link.setAttribute("rel", "canonical");
      document.head.appendChild(link);
    }
    link.setAttribute("href", canonical);
  }, [title, description, canonical]);
}
