// Format an ISO date into a human-readable string, e.g. "April 12, 2026"
export function formatDate(iso: string): string {
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return iso
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

// Format relative to base path so assets work under any GitHub Pages subpath.
// Accepts "/images/foo.jpg", "images/foo.jpg" or absolute URLs.
export function asset(path: string): string {
  if (/^https?:\/\//i.test(path)) return path
  const base = (import.meta.env.BASE_URL || "/").replace(/\/$/, "")
  const clean = path.replace(/^\//, "")
  return `${base}/${clean}`
}
