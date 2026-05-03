import { useEffect, useRef } from "react"
import type {Language, Post} from "../types"
import { asset } from "../lib/format"

interface LightboxProps {
  post: Post | null
  lang: Language
  onClose: () => void
}

export default function Lightbox({ post, lang, onClose }: LightboxProps) {
  const closeBtnRef = useRef<HTMLButtonElement>(null)
  const open = post !== null

  // Keyboard close + focus management + scroll lock.
  useEffect(() => {
    if (!open) return

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }
    document.addEventListener("keydown", onKey)

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"

    // Focus the close button for accessibility.
    const t = window.setTimeout(() => closeBtnRef.current?.focus(), 0)

    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = previousOverflow
      window.clearTimeout(t)
    }
  }, [open, onClose])

  if (!open || !post) return null

  const currentAlt = post.alt[lang]

  return (
      <div
          role="dialog"
          aria-modal="true"
          aria-label={`Image: ${currentAlt}`}
          /* Replace inline style with .lightbox-overlay */
          className="lightbox-fade lightbox-overlay fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8"
          onClick={(e) => {
            // Close when clicking the backdrop, not the image itself.
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

        <figure className="lightbox-zoom relative max-h-full max-w-[1100px] w-full">
          <img
              src={asset(post.image) || "/placeholder.svg"}
              alt={currentAlt}
              className="mx-auto block max-h-[82vh] w-auto rounded-md object-contain shadow-[0_20px_60px_-20px_rgba(0,0,0,0.6)]"
              style={{ willChange: "transform, opacity" }}
          />
          <figcaption className="mt-4 text-center">
            <div className="font-serif text-[15px] tracking-tight text-paper">
              {post.location[lang]}
            </div>
            <div className="mt-1 text-[12px] uppercase tracking-[0.12em] text-paper/50">
              {currentAlt}
            </div>
          </figcaption>
        </figure>
    </div>
  )
}
