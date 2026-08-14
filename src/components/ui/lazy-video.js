"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Attaches src and plays a muted loop only while the tile is on screen.
 * Off-screen clips pause so a grid does not keep decoding in the background.
 */
export function LazyVideo({
  src,
  poster,
  className = "",
  title,
  "aria-label": ariaLabel,
  threshold = 0.2,
}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold, rootMargin: "80px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return undefined;

    const play = () => {
      el.play().catch(() => {});
    };
    if (el.readyState >= 2) play();
    else el.addEventListener("canplay", play);

    return () => {
      el.removeEventListener("canplay", play);
      el.pause();
    };
  }, [inView]);

  return (
    <video
      ref={ref}
      className={className}
      src={inView ? src : undefined}
      poster={poster}
      muted
      loop
      playsInline
      preload={inView ? "auto" : "none"}
      title={title}
      aria-label={ariaLabel}
    />
  );
}
