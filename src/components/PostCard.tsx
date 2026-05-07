import { useEffect, useRef, useState } from "react"
import ReactMarkdown from "react-markdown"
import type { Language, Post } from "../types"
import { asset, buildImageSources, formatDate } from "../lib/format"
import { UI_STRINGS } from "../translations.ts";

interface PostCardProps {
  post: Post
  index: number
  onOpenImage: (post: Post, index: number) => void
  currentLang: Language
}

export default function PostCard({ post, index, onOpenImage, currentLang }: PostCardProps) {
  const [expanded, setExpanded] = useState(false)
  const [needsCollapse, setNeedsCollapse] = useState(false)
  const [visible, setVisible] = useState(false)
  const contentRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLElement>(null)
  const t = UI_STRINGS[currentLang];
  const currentLocation = post.location.name[currentLang];

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
          style={{
            animationDelay: visible ? `${Math.min(index, 5) * 80}ms` : undefined,
            willChange: "transform, opacity, filter"
          }}
          aria-labelledby={`post-${post.id}-heading`}
      >
      <h2 id={`post-${post.id}-heading`} className="sr-only">
        {currentLocation} — {formatDate(post.date, currentLang)}
      </h2>

      {/* Image */}
      {(() => {
        const hero = post.images[0]
        const heroSources = buildImageSources(hero.src)
        const thumbs = post.images.slice(1, 5)
        const extraCount = Math.max(0, post.images.length - 5)
        return (
          <>
            <button
              type="button"
              onClick={() => onOpenImage(post, 0)}
              className="group relative block w-full overflow-hidden rounded-md bg-muted/40 ring-0 transition-shadow duration-300 hover:shadow-[0_8px_30px_-12px_rgba(31,31,31,0.18)] focus-visible:outline-none"
              aria-label={`Open image: ${hero.alt[currentLang]}`}
            >
              <div className="aspect-[4/3] w-full overflow-hidden sm:aspect-[3/2]">
                <picture>
                  {heroSources.avif && <source type="image/avif" srcSet={heroSources.avif} sizes="(min-width: 700px) 700px, 100vw" />}
                  {heroSources.webp && <source type="image/webp" srcSet={heroSources.webp} sizes="(min-width: 700px) 700px, 100vw" />}
                  <img
                    src={heroSources.fallback || asset(hero.src) || "/placeholder.svg"}
                    srcSet={heroSources.jpg || undefined}
                    sizes="(min-width: 700px) 700px, 100vw"
                    alt={hero.alt[currentLang]}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.025]"
                  />
                </picture>
              </div>
            </button>

            {thumbs.length > 0 && (
              <ul className="mt-3 grid grid-cols-4 gap-2 sm:gap-3">
                {thumbs.map((img, i) => {
                  const fullIndex = i + 1
                  const t = buildImageSources(img.src)
                  const isLast = i === thumbs.length - 1 && extraCount > 0
                  return (
                    <li key={`${post.id}-thumb-${fullIndex}`}>
                      <button
                        type="button"
                        onClick={() => onOpenImage(post, fullIndex)}
                        className="group relative block w-full overflow-hidden rounded-md bg-muted/40 ring-0 transition-shadow duration-300 hover:shadow-[0_4px_18px_-8px_rgba(31,31,31,0.25)] focus-visible:outline-none"
                        aria-label={`Open image: ${img.alt[currentLang]}`}
                      >
                        <div className="aspect-square w-full overflow-hidden">
                          <picture>
                            {t.avif && <source type="image/avif" srcSet={t.avif} sizes="120px" />}
                            {t.webp && <source type="image/webp" srcSet={t.webp} sizes="120px" />}
                            <img
                              src={t.fallback || asset(img.src) || "/placeholder.svg"}
                              srcSet={t.jpg || undefined}
                              sizes="120px"
                              alt={img.alt[currentLang]}
                              loading="lazy"
                              decoding="async"
                              className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                            />
                          </picture>
                          {isLast && (
                            <div
                              aria-hidden="true"
                              className="absolute inset-0 flex items-center justify-center bg-ink/45 font-serif text-[18px] tracking-tight text-paper"
                            >
                              +{extraCount}
                            </div>
                          )}
                        </div>
                      </button>
                    </li>
                  )
                })}
              </ul>
            )}
          </>
        )
      })()}

      {/* Metadata */}
      <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2">
        <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(currentLocation)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="group/loc inline-flex items-center gap-1.5 rounded-full border border-accent/30 bg-accent/10 px-2.5 py-1 text-[12px] font-medium tracking-wide text-accent transition-all duration-300 hover:-translate-y-0.5 hover:bg-accent/20 hover:shadow-sm"
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
          {currentLocation}
        </a>

        <time
            dateTime={post.date}
            className="font-serif text-[14.5px] tracking-tight text-ink/45"
        >
          {formatDate(post.date, currentLang)}
        </time>
      </div>

      {/* Content */}
      <div className="mt-4">
        <div
            className={`relative overflow-hidden transition-[max-height] transition-editorial`}
            style={{
              maxHeight: expanded || !needsCollapse ? "1000px" : "7.5rem",
            }}
        >
          <div ref={contentRef} className="prose-journal">
            <ReactMarkdown>{post.content[currentLang].description}</ReactMarkdown>
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
