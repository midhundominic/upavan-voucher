"use client";

import { useLayoutEffect, useRef } from "react";

// Fixed text areas preserve the print composition, including unusually long names.
export function FitText({
  text,
  className,
  maxSize,
  minSize = 14,
  height,
}: {
  text: string;
  className: string;
  maxSize: number;
  minSize?: number;
  height: number;
}) {
  const element = useRef<HTMLParagraphElement>(null);
  useLayoutEffect(() => {
    let active = true;
    function fit() {
      if (!active || !element.current) return;
      const node = element.current;
      let size = maxSize;
      node.style.fontSize = `${size}px`;
      while (
        (node.scrollHeight > node.clientHeight + 1 || node.scrollWidth > node.clientWidth + 1) &&
        size > minSize
      ) {
        size -= 0.5;
        node.style.fontSize = `${size}px`;
      }
    }
    fit();
    void document.fonts.ready.then(fit);
    return () => {
      active = false;
    };
  }, [text, maxSize, minSize, height]);
  return (
    <p ref={element} className={className} style={{ fontSize: maxSize, height }}>
      {text}
    </p>
  );
}
