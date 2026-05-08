import { useEffect, useRef, useState } from "react"
import type { Language, Post } from "../types"
import { asset, buildImageSources } from "../lib/format"
import { UI_STRINGS } from "../translations.ts"
import PostImage from "./PostImage"

const basename = (p: string) => p.split("/").pop() ?? p

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
  const t = UI_STRINGS[lang]

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

  // activeIndex may be stale from a previous (larger) post on the first
  // render after `post` changes — the resetting useEffect runs after commit.
  // Clamp synchronously so we never index out of bounds.
  const safeIndex = total > 0 ? Math.min(Math.max(activeIndex, 0), total - 1) : 0
  const image = post.images[safeIndex]
  const currentAlt = image.alt[lang]
  const atStart = safeIndex === 0
  const atEnd = safeIndex === total - 1

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Image ${safeIndex + 1} of ${total}: ${currentAlt}`}
      className="lightbox-fade lightbox-overlay fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-8"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="absolute right-4 top-4 z-10 flex items-center gap-2 sm:right-6 sm:top-6">
        <a
          href={asset(image.src)}
          download={basename(image.src)}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t.downloadImage}
          title={t.downloadImage}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md transition-all hover:scale-110 hover:bg-paper"
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
            <path d="M12 3v12" />
            <path d="m6 11 6 6 6-6" />
            <path d="M5 21h14" />
          </svg>
        </a>
        <button
          ref={closeBtnRef}
          type="button"
          onClick={onClose}
          aria-label={t.closeImage}
          title={t.closeImage}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md transition-all hover:scale-110 hover:bg-paper"
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
      </div>

      {hasMany && (
        <>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={atStart}
            aria-label={t.previousImage}
            title={t.previousImage}
            className="absolute left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md transition-all hover:scale-110 hover:bg-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:inline-flex sm:left-4"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5" aria-hidden="true">
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setActiveIndex((i) => Math.min(total - 1, i + 1))}
            disabled={atEnd}
            aria-label={t.nextImage}
            title={t.nextImage}
            className="absolute right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md transition-all hover:scale-110 hover:bg-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100 sm:inline-flex sm:right-4"
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
        <PostImage
          src={image.src}
          alt={currentAlt}
          sizes="100vw"
          loading="eager"
          draggable={false}
          style={{ willChange: "transform, opacity" }}
          className="mx-auto block max-h-[88vh] w-auto rounded-md object-contain shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)] sm:max-h-[82vh]"
        />
        <figcaption className="mt-4 text-center">
          <div className="font-serif text-[15px] tracking-tight text-paper">
            {post.location.name[lang]}
          </div>
          <div className="mt-1 text-[12px] uppercase tracking-[0.12em] text-paper/50">
            {currentAlt}
          </div>
          {hasMany && (() => {
            const dotsCounter = (
              <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-paper/60">
                {total <= 8 ? (
                  <span className="inline-flex items-center gap-1.5">
                    {post.images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => setActiveIndex(i)}
                        aria-label={t.goToImage.replace("{n}", String(i + 1))}
                        aria-current={i === safeIndex || undefined}
                        className={`block h-2 w-2 rounded-full transition-colors ${i === safeIndex ? "bg-paper" : "bg-paper/30 hover:bg-paper/60"}`}
                      />
                    ))}
                  </span>
                ) : null}
                <span>{safeIndex + 1} / {total}</span>
              </span>
            )
            return (
              <>
                {/* Mobile: [prev] [dots/counter] [next] in a single row. */}
                <div className="mt-3 flex items-center justify-between gap-3 sm:hidden">
                  <button
                    type="button"
                    onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                    disabled={atStart}
                    aria-label={t.previousImage}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md transition-all hover:scale-110 hover:bg-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                      <path d="m15 18-6-6 6-6" />
                    </svg>
                  </button>
                  {dotsCounter}
                  <button
                    type="button"
                    onClick={() => setActiveIndex((i) => Math.min(total - 1, i + 1))}
                    disabled={atEnd}
                    aria-label={t.nextImage}
                    className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper/90 text-ink shadow-md transition-all hover:scale-110 hover:bg-paper disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:scale-100"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4" aria-hidden="true">
                      <path d="m9 18 6-6-6-6" />
                    </svg>
                  </button>
                </div>
                {/* Desktop: dots/counter centred (edge buttons handle nav). */}
                <div className="mt-3 hidden items-center justify-center sm:flex">
                  {dotsCounter}
                </div>
              </>
            )
          })()}
        </figcaption>
      </figure>
    </div>
  )
}
