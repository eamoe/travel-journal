import { useEffect, useState } from "react";
import type { Post } from "../types";
import { loadPosts } from "../services/posts.ts";


export function usePosts() {
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let cancelled = false;

        loadPosts()
            .then((data) => {
                if (cancelled) return;
                setPosts(data);
            })
            .catch((e: unknown) => {
                if (cancelled) return;

                setError(e instanceof Error ? e.message : "Failed to load posts");
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false);
                }
            })

        return () => {
            cancelled = true;
        }
    }, []);

    return {
        posts,
        error,
        loading
    };
}
