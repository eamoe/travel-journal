import { useEffect, useState } from "react"
import Header from "./components/Header"
import PostCard from "./components/PostCard"
import Lightbox from "./components/Lightbox"
import ScrollToTop from "./components/ScrollToTop"
import type { Post } from "./types"
import { asset } from "./lib/format"

export default function App() {
  const [posts, setPosts] = useState<Post[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activePost, setActivePost] = useState<Post | null>(null)

  useEffect(() => {
    let cancelled = false
    fetch(asset("posts.json"))
      .then((r) => {
        if (!r.ok) throw new Error(`Failed to load posts (${r.status})`)
        return r.json() as Promise<Post[]>
      })
      .then((data) => {
        if (cancelled) return
        // Sort reverse-chronologically (newest → oldest).
        const sorted = [...data].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        )
        setPosts(sorted)
      })
      .catch((e: unknown) => {
        if (cancelled) return
        setError(e instanceof Error ? e.message : "Failed to load posts")
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-paper text-ink">
      <Header />

      <main className="mx-auto w-full max-w-[700px] px-5 pb-32 pt-10 sm:pt-14">
        {error && (
          <p role="alert" className="text-sm text-accent">
            {error}
          </p>
        )}

        {!error && !posts && (
          <div className="space-y-12" aria-hidden="true">
            {[0, 1].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/2] w-full rounded-md bg-muted/60" />
                <div className="mt-5 h-4 w-40 rounded bg-muted/60" />
                <div className="mt-3 h-3 w-full rounded bg-muted/50" />
                <div className="mt-2 h-3 w-11/12 rounded bg-muted/50" />
                <div className="mt-2 h-3 w-9/12 rounded bg-muted/50" />
              </div>
            ))}
          </div>
        )}

        {posts && posts.length > 0 && (
          <ol className="flex flex-col gap-20 sm:gap-24">
            {posts.map((post, i) => (
              <li key={post.id}>
                <PostCard post={post} index={i} onOpenImage={setActivePost} />
              </li>
            ))}
          </ol>
        )}

        {posts && posts.length === 0 && (
          <p className="text-center text-sm text-ink/60">No entries yet.</p>
        )}
      </main>

      <footer className="border-t border-muted/70 bg-paper">
        <div className="mx-auto max-w-[700px] px-5 py-10 text-center">
          <p className="font-serif text-[15px] italic text-ink/60">
            Until the next journey.
          </p>
          <p className="mt-2 text-[11.5px] uppercase tracking-[0.2em] text-ink/40">
            The Italian Journal · 2026
          </p>
        </div>
      </footer>

      <Lightbox post={activePost} onClose={() => setActivePost(null)} />
      <ScrollToTop />
    </div>
  )
}
