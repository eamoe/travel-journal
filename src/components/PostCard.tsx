import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import type { Language, Post } from "../types"
import { asset, formatDate } from "../lib/format"
import { UI_STRINGS } from "../translations.ts";

interface PostCardProps {
  post: Post
  index: number
  onOpenImage: (post: Post) => void
  currentLang: Language
}

export default function PostCard({ post, index, onOpenImage, currentLang }: PostCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [needsCollapse, setNeedsCollapse] = useState(false)
  const [visible, setVisible] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLElement>(null)
  const t = UI_STRINGS[currentLang];

  // Determine if the content overflows the collapsed height (so we only
  // show "Read more" when there's actually more to read).
  useEffect(() => {
    const el = contentRef.current
    if (!el) return
    const check = () => {
      // The collapsed wrapper has max-height; compare scrollHeight against it.
      const collapsedMax = 7.5 * 16 // ~7.5rem in px (about 4 lines of serif body)
      setNeedsCollapse(el.scrollHeight > collapsedMax + 4)
    }
    check()
    const ro = new ResizeObserver(check)
    ro.observe(el)
    return () => ro.disconnect()
  }, [post.content, currentLang])

  // Reveal-on-scroll entrance.
  useEffect(() => {
    const el = articleRef.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setVisible(true)
            io.disconnect()
            break
          }
        }
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <article
      ref={articleRef}
      className={`scroll-mt-28 ${visible ? "journal-rise" : "opacity-0"}`}
      style={{ animationDelay: visible ? `${Math.min(index, 3) * 60}ms` : undefined }}
      aria-labelledby={`post-${post.id}-heading`}
    >
      <h2 id={`post-${post.id}-heading`} className="sr-only">
        {post.location} — {formatDate(post.date, currentLang)}
      </h2>

      {/* Image */}
      <button
        type="button"
        onClick={() => onOpenImage(post)}
        className="group relative block w-full overflow-hidden rounded-md bg-muted/40 ring-0 transition-shadow duration-300 hover:shadow-[0_8px_30px_-12px_rgba(31,31,31,0.18)] focus-visible:outline-none"
        aria-label={`Open image: ${post.alt[currentLang]}`}
      >
        <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-[3/2]">
          <img
            src={asset(post.image) || "/placeholder.svg"}
            alt={post.alt[currentLang]}
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.025]"
          />
        </div>
      </button>

      {/* Metadata */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.location)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/loc inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[12px] font-medium tracking-wide text-accent transition-all hover:bg-accent/20 hover:border-accent/50"
        >
          <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-3.5 w-3.5 transition-transform group-hover/loc:scale-110"
              aria-hidden="true"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          {post.location}
        </a>

        <time dateTime={post.date} className="text-[12.5px] uppercase tracking-[0.14em] text-ink/55">
          {formatDate(post.date, currentLang)}
        </time>
      </div>

      {/* Content */}
      <div className="mt-4">
        <div
          className="relative overflow-hidden transition-[max-height] duration-500 ease-in-out"
          style={{
            maxHeight: expanded || !needsCollapse ? "5000px" : "7.5rem",
          }}
        >
          <div ref={contentRef} className="prose-journal">
            <ReactMarkdown>{post.content[currentLang]}</ReactMarkdown>
          </div>
          {!expanded && needsCollapse && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 bottom-0 h-16"
              style={{
                background:
                  "linear-gradient(to bottom, rgba(248, 246, 242, 0) 0%, rgba(248, 246, 242, 0.95) 75%, var(--color-paper) 100%)",
              }}
            />
          )}
        </div>

        {needsCollapse && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-medium text-accent transition-colors hover:text-[#a85829]"
          >
            <span>{expanded ? t.showLess : t.readMore}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`h-3.5 w-3.5 transition-transform duration-300 ${expanded ? "rotate-180" : ""}`}
              aria-hidden="true"
            >
              <path d="m6 9 6 6 6-6" />
            </svg>
          </button>
        )}
      </div>
    </article>
  )
}
