"use client";

import { useState } from "react";

export function ResortLogo({ src, className = "" }: { src: string; className?: string }) {
  const [failedSource, setFailedSource] = useState<string | null>(null);
  return (
    <div className={`resort-logo ${className}`}>
      {src && failedSource !== src ? (
        <img src={src} alt="Upavan Resort" onError={() => setFailedSource(src)} decoding="async" />
      ) : (
        <span className="wordmark-fallback">
          UPAVAN<small>R E S O R T</small>
        </span>
      )}
    </div>
  );
}
