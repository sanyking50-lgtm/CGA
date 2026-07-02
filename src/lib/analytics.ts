/* ── Client-side Analytics Utilities ────────────────────────────── */

type GtagEventParams = {
  action: string;
  category: string;
  label?: string;
  value?: number;
};

/**
 * Track a custom event via gtag (GA4).
 * Safe to call on the server — it's a no-op when window is unavailable.
 */
export function trackEvent(
  action: string,
  category: string,
  label?: string,
  value?: number
): void {
  if (typeof window === "undefined") return;

  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
    .gtag;

  if (!gtag) return;

  gtag("event", action, {
    event_category: category,
    event_label: label,
    value: value,
  });
}

/**
 * Type-safe re-export of the GtagEventParams interface for consumers.
 */
export type { GtagEventParams };