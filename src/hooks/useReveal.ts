'use client';

import { useEffect, useState } from 'react';

/**
 * Scroll-reveal for a section. Returns a callback ref for the container.
 *
 * The container gets `data-reveal="hidden"` only if it is still below the fold
 * when it mounts, and `data-reveal="shown"` once it scrolls into view; CSS in
 * globals.css animates its `.rv-item` descendants. Content is never hidden when
 * JS is off, before hydration, when already on screen, or under reduced motion.
 */
export function useReveal<T extends HTMLElement = HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);

  useEffect(() => {
    if (!node || typeof IntersectionObserver === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (node.getBoundingClientRect().top < window.innerHeight * 0.9) return;

    node.dataset.reveal = 'hidden';
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          node.dataset.reveal = 'shown';
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -10% 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return setNode;
}

/** Inline style for a staggered `.rv-item` (delay capped so long grids don't drag). */
export function rvDelay(index: number): React.CSSProperties {
  return { '--rv-i': Math.min(index, 6) } as React.CSSProperties;
}
