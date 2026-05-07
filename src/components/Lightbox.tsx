import { useEffect, useRef, useState } from "react"
import type { Language, Post } from "../types"
import { asset, buildImageSources } from "../lib/format"

interface LightboxProps {
  post: Post | null
  startIndex: number
  lang: Language
  onClose: () => void
}

const SWIPE_THRESHOLD = 50

export default function Lightbox({ post, startIndex, lang, onClose }: LightboxProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const [activeIndex, setActiveIndex] = useState(startIndex)
  const open = post !== null
  const total = post?.images.length ?? 0
  const hasMany = total > 1

  // Reset index whenever a new post opens or startIndex changes.
  useEffect(() => {
    if (open) setActiveIndex(Math.min(Math.max(startIndex, 0), total - 1))
  }, [open, startIndex, total])

  // Keyboard (close + arrows) + focus + scroll lock.
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      } else if (e.key === "ArrowLeft" && hasMany) {
        e.preventDefault()
        setActiveIndex((i) => Math.max(0, i - 1))
      } else if (e.key === "ArrowRight" && hasMany) {
        e.preventDefault()
        setActiveIndex((i) => Math.min(total - 1, i + 1))
      }
    }
    document.addEventListener("keydown", onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0)

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
      window.clearTimeout(t)
    }
  }, [open, onClose, hasMany, total])

  // Preload neighbours for snappy nav. Browser caches the AVIF/WebP/JPG it
  // would have picked anyway based on srcset.
  useEffect(() => {
    if (!open || !post) return
    const neighbours = [activeIndex - 1, activeIndex + 1]
      .filter((i) => i >= 0 && i < total)
      .map((i) => buildImageSources(post.images[i].src).fallback)
    for (const url of neighbours) {
      const img = new Image()
      img.src = url
    }
  }, [open, post, activeIndex, total])

  // Pointer-based swipe.
  const pointer = useRef<{ id: number; x: number; y: number } | null>(null)
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType === "mouse") return
    pointer.current = { id: e.pointerId, x: e.clientX, y: e.clientY }
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const p = pointer.current
    pointer.current = null
    if (!p || p.id !== e.pointerId || !hasMany) return
    const dx = e.clientX - p.x
    const dy = e.clientY - p.y
    if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) <= Math.abs(dy)) return
    if (dx < 0) setActiveIndex((i) => Math.min(total - 1, i + 1))
    else setActiveIndex((i) => Math.max(0, i - 1))
  }

  if (!open || !post) return null

  const image = post.images[activeIndex]
  const currentAlt = image.alt[lang]
  const sources = buildImageSources(image.src)
  const atStart = activeIndex === 0
  const atEnd = activeIndex === total - 1

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${activeIndex + 1} of ${total}: ${currentAlt}`}
      className="lightbox-fade lightbox-overlay fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <button
        ref={closeBtnRef}
        type="button"
        onClick={onClose}
        aria-label="Close image"
        className="absolute right-4 top-4 z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md transition-all hover:scale-110 hover:bg-paper sm:right-6 sm:top-6"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M18 6 6 18" />
          <path d="m6 6 12 12" />
        </svg>
      </button>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={atStart}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md transition-all hover:scale-110 hover:bg-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:left-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => Math.min(total - 1, i + 1))}
            disabled={atEnd}
            aria-label="Next image"
            className="absolute right-2 top-1/2 z-10 inline-flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md transition-all hover:scale-110 hover:bg-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:right-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </>
      )}

      <figure
        className="lightbox-zoom relative max-h-full max-w-[1100px] w-full"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => { pointer.current = null }}
      >
        <picture>
          {sources.avif && <source type="image/avif" srcSet={sources.avif} sizes="100vw" />}
          {sources.webp && <source type="image/webp" srcSet={sources.webp} sizes="100vw" />}
          <img
            key={`${post.id}-${activeIndex}`}
            src={sources.fallback || asset(image.src) || "/placeholder.svg"}
            srcSet={sources.jpg || undefined}
            sizes="100vw"
            alt={currentAlt}
            decoding="async"
            className="mx-auto block max-h-[82vh] w-auto rounded-md object-contain shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
            style={{ willChange: "transform, opacity" }}
            draggable={false}
          />
        </picture>
        <figcaption className="mt-4 text-center">
          <div className="font-serif text-[15px] tracking-tight text-paper">
            {post.location.name[lang]}
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-[0.12em] text-paper/50">
            {currentAlt}
          </div>
          {hasMany && (
            <div className="mt-3 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.18em] text-paper/60">
              {total <= 8 ? (
                <span className="flex items-center gap-1.5" aria-hidden="true">
                  {post.images.map((_, i) => (
                    <span
                      key={i}
                      className={`block h-1.5 w-1.5 rounded-full transition-colors ${i === activeIndex ? "bg-paper" : "bg-paper/30"}`}
                    />
                  ))}
                </span>
              ) : null}
              <span>{activeIndex + 1} / {total}</span>
            </div>
          )}
        </figcaption>
      </figure>
    </div>
  )
}
