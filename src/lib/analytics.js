const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_ID;

/**
 * Google Analytics 4 loader.
 *
 * GA4 is dormant until VITE_GA_ID is set in Vercel — without it nothing is
 * injected and nothing is sent, so the site is fully functional before you
 * create the property.
 *
 * Must only be called after the visitor has accepted analytics (see
 * ConsentBanner), because EU / UK / Swiss visitors need consent first.
 */
export function initAnalytics() {
  if (!GA_MEASUREMENT_ID) return false;
  if (typeof window === "undefined") return false;
  if (window.gtag) return true; // already loaded

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { anonymize_ip: true });

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  return true;
}

/**
 * Marks the /thank-you-style outcome as a key event. Used when a council
 * question comes back successfully, so you can count real usage in GA4.
 */
export function trackEvent(name, params = {}) {
  if (!GA_MEASUREMENT_ID || !window.gtag) return;
  window.gtag("event", name, params);
}

export function analyticsConfigured() {
  return Boolean(GA_MEASUREMENT_ID);
}
