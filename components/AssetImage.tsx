"use client";

import { useState, type CSSProperties } from "react";
import { ImageIcon, Leaf } from "lucide-react";

interface AssetImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: CSSProperties;
  loading?: "eager" | "lazy";
  fallback?: "photo" | "thumbnail" | "none";
}

export function AssetImage({
  src,
  alt,
  className = "",
  style,
  loading = "eager",
  fallback = "photo",
}: AssetImageProps) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  if (!src || failedSource === src) {
    if (fallback === "none") return null;
    return (
      <div
        className={`image-placeholder ${className}`}
        style={style}
        role="img"
        aria-label={`${alt} — no image selected`}
      >
        {fallback === "thumbnail" ? (
          <ImageIcon size={19} strokeWidth={1.3} />
        ) : (
          <>
            <Leaf size={34} strokeWidth={1} />
            <span>A space to unwind</span>
          </>
        )}
      </div>
    );
  }
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading={loading}
      decoding="async"
      onError={() => setFailedSource(src)}
    />
  );
}
