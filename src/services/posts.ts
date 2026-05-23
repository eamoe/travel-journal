import type { Post } from "../types"
import { asset } from "../lib/format"

export async function loadPosts(): Promise<Post[]> {
    const response = await fetch(`${asset("posts.json")}?v=${__BUILD_TS__}`)

    if (!response.ok) {
        throw new Error(`Failed to load posts (${response.status})`)
    }

    const data = (await response.json()) as Post[]

    return [...data].sort(
        (a, b) =>
            new Date(b.date).getTime() -
            new Date(a.date).getTime(),
    )
}
