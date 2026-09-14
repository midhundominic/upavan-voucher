"use client";

import { Leaf } from "lucide-react";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="fallback-page">
      <Leaf size={32} strokeWidth={1.3} />
      <h1>A moment to reconnect.</h1>
      <p>We couldn’t open the designer. Please try again.</p>
      <button className="button button-primary" onClick={reset}>
        Try again
      </button>
    </main>
  );
}
