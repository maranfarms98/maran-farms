"use client";

import { useEffect, useRef, useState } from "react";

function unlockPlayback(el) {
  if (!el) return;
  el.muted = true;
  el.defaultMuted = true;
  el.playsInline = true;
  el.setAttribute("playsinline", "");
  el.setAttribute("webkit-playsinline", "true");
}

function tryPlay(el) {
  unlockPlayback(el);
  const play = el.play();
  if (play) play.catch(() => {});
}

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

    unlockPlayback(el);
    el.src = src;
    el.load();

    const play = () => tryPlay(el);
    play();
    el.addEventListener("canplay", play);
    el.addEventListener("loadeddata", play);

    const onVis = () => {
      if (document.visibilityState === "visible") play();
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      el.removeEventListener("canplay", play);
      el.removeEventListener("loadeddata", play);
      document.removeEventListener("visibilitychange", onVis);
      el.pause();
    };
  }, [inView, src]);

  return (
    <video
      ref={ref}
      className={className}
      poster={poster}
      muted
      autoPlay
      loop
      playsInline
      preload={inView ? "auto" : "none"}
      title={title}
      aria-label={ariaLabel}
      disablePictureInPicture
      disableRemotePlayback
    />
  );
}
