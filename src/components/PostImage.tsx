import { useEffect, useState, type CSSProperties } from "react"
import { asset, buildImageSources } from "../lib/format"

interface PostImageProps {
  src: string
  alt: string
  sizes: string
  className?: string
  loading?: "lazy" | "eager"
  draggable?: boolean
  style?: CSSProperties
}

// Renders a <picture> with AVIF/WebP/JPG sources for the given post image
// path, falling back to public/images/placeholder.svg if the image fails to
// load (e.g. missing source file or absent optimized variants). The fallback
// state is keyed off `src`, so navigating to a new image in the lightbox
// resets it.
export default function PostImage({
  src,
  alt,
  sizes,
  className,
  loading = "lazy",
  draggable,
  style,
}: PostImageProps) {
  const [errored, setErrored] = useState(false)

  useEffect(() => {
    setErrored(false)
  }, [src])

  if (errored) {
    return (
      <img
        src={asset("images/placeholder.svg")}
        alt={alt}
        loading={loading}
        decoding="async"
        className={className}
        draggable={draggable}
        style={style}
      />
    )
  }

  const sources = buildImageSources(src)
  return (
    <picture>
      {sources.avif && <source type="image/avif" srcSet={sources.avif} sizes={sizes} />}
      {sources.webp && <source type="image/webp" srcSet={sources.webp} sizes={sizes} />}
      <img
        src={sources.fallback || asset(src)}
        srcSet={sources.jpg || undefined}
        sizes={sizes}
        alt={alt}
        loading={loading}
        decoding="async"
        className={className}
        draggable={draggable}
        style={style}
        onError={() => setErrored(true)}
      />
    </picture>
  )
}
