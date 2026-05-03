import { Language } from "../types.ts";
import { LANG_CONFIG } from "../config.ts";

// Format an ISO date into a human-readable string, e.g. "April 12, 2026, 3:45 PM"
export function formatDate(iso: string, lang: Language = 'en'): string {
  // We append 'Z' to the string if it's missing to force
  // JavaScript to treat it as a "neutral" UTC time.
  const dateString = iso.endsWith('Z') ? iso : `${iso}Z`;
  const d = new Date(dateString);

  if (Number.isNaN(d.getTime())) return iso;

  const locale = LANG_CONFIG[lang].locale;

  return d.toLocaleString(locale, {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    // Most European locales prefer 24h, while US prefers 12h
    hour12: lang === 'en',
    timeZone: "UTC" // This forces the display to match the string exactly
  });
}

// Format relative to base path so assets work under any GitHub Pages subpath.
// Accepts "/images/foo.jpg", "images/foo.jpg" or absolute URLs.
export function asset(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "")
  const clean = path.replace(/^\//, "")
  return `${base}/${clean}`
}
