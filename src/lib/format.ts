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

// Widths emitted by scripts/optimize-images.mjs. Keep in sync with that script.
export const IMAGE_WIDTHS = [400, 800, 1600] as const;
export const IMAGE_MAX_WIDTH = IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1];

export interface ImageSources {
  fallback: string;       // largest JPG; for <img src>
  avif: string;           // srcset
  webp: string;           // srcset
  jpg: string;            // srcset
  intrinsicWidth: number; // assumed cap (largest emitted width)
}

// Given a post image path like "images/rome.jpg", build srcsets pointing at
// the variants emitted by scripts/optimize-images.mjs into images/optimized/.
// External URLs (http/https) and non-jpg/png paths fall back to the original.
export function buildImageSources(src: string): ImageSources {
  if (/^https?:\/\//i.test(src)) {
    return { fallback: src, avif: "", webp: "", jpg: "", intrinsicWidth: IMAGE_MAX_WIDTH };
  }

  const m = src.match(/^(.*?)([^/]+)\.(jpe?g|png)$/i);
  if (!m) {
    const url = asset(src);
    return { fallback: url, avif: "", webp: "", jpg: "", intrinsicWidth: IMAGE_MAX_WIDTH };
  }
  const [, dir, stem] = m;
  const base = `${dir}optimized/${stem}`;

  const set = (ext: string) =>
    IMAGE_WIDTHS.map((w) => `${asset(`${base}-${w}.${ext}`)} ${w}w`).join(", ");

  return {
    fallback: asset(`${base}-${IMAGE_MAX_WIDTH}.jpg`),
    avif: set("avif"),
    webp: set("webp"),
    jpg: set("jpg"),
    intrinsicWidth: IMAGE_MAX_WIDTH,
  };
}
