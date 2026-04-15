"use client";

import { useEffect, useRef, useState } from "react";

type VideoSectionProps = {
  title: string;
  description: string;
  videoUrl: string;
};

export default function VideoSection({ title, description, videoUrl }: VideoSectionProps) {
  const localFallbackVideo = "/gallery/video2.mp4";
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);
  const [autoplayBlocked, setAutoplayBlocked] = useState(false);
  const [activeVideoSrc, setActiveVideoSrc] = useState(videoUrl || localFallbackVideo);

  useEffect(() => {
    setActiveVideoSrc(videoUrl || localFallbackVideo);
  }, [videoUrl]);

  const safePlay = async (video: HTMLVideoElement) => {
    try {
      await video.play();
      setAutoplayBlocked(false);
      return true;
    } catch {
      setAutoplayBlocked(true);
      return false;
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    video.muted = isMuted;
    video.volume = isMuted ? 0 : 1;

    if (!video.paused) {
      return;
    }

    void safePlay(video);
  }, [isMuted]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (!entry) {
          return;
        }

        if (entry.isIntersecting) {
          void safePlay(video);
        } else {
          video.pause();
        }
      },
      { threshold: 0.5 },
    );

    observer.observe(video);

    return () => {
      observer.disconnect();
    };
  }, []);

  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) {
      return;
    }

    const nextMuted = !video.muted;
    setIsMuted(nextMuted);
    video.muted = nextMuted;
    video.volume = nextMuted ? 0 : 1;

    if (nextMuted) {
      void safePlay(video);
      return;
    }

    void safePlay(video).then((ok) => {
      if (!ok) {
        video.muted = true;
        video.volume = 0;
        setIsMuted(true);
      }
    });
  };

  const handleVideoError = () => {
    if (activeVideoSrc !== localFallbackVideo) {
      setActiveVideoSrc(localFallbackVideo);
      return;
    }

    setAutoplayBlocked(true);
  };

  return (
    <section className="relative px-6 py-28 lg:px-12" id="video">
      <div className="mx-auto grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_1fr] lg:items-end">
        <div data-reveal className="space-y-5">
          <p className="font-sans text-xs uppercase tracking-[0.35em] text-accent/70">Product Motion</p>
          <h2 className="font-display text-4xl text-stone-100 sm:text-5xl">{title}</h2>
          <p className="max-w-xl text-base leading-relaxed text-stone-300 sm:text-lg">{description}</p>
        </div>

        <div data-reveal className="overflow-hidden rounded-2xl border border-stone-400/20 bg-black/40 shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
          <div className="relative aspect-video w-full overflow-hidden bg-[radial-gradient(circle_at_30%_20%,rgba(230,190,106,0.18),transparent_28%),linear-gradient(135deg,#15191f_0%,#0a0d10_100%)]">
            <video
              ref={videoRef}
              className="absolute inset-0 z-0 h-full w-full object-contain object-center"
              src={activeVideoSrc}
              loop
              autoPlay
              muted={isMuted}
              playsInline
              preload="auto"
              onError={handleVideoError}
            />
            <div className="absolute inset-0 z-10 bg-[linear-gradient(100deg,transparent_0%,rgba(255,255,255,0.03)_48%,transparent_100%)]" />
            <div className="absolute inset-x-10 top-10 z-10 h-px bg-gradient-to-r from-transparent via-amber-200/40 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-black via-black/25 to-transparent" />
            <div className="absolute left-6 top-6 z-20 rounded-full border border-white/15 bg-black/35 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-stone-200/80 backdrop-blur-sm">
              Product reel
            </div>
            <button
              type="button"
              onClick={toggleMute}
              className="absolute right-6 top-6 z-20 rounded-full border border-white/15 bg-black/40 px-3 py-1 text-[10px] uppercase tracking-[0.3em] text-stone-200/85 backdrop-blur-sm transition hover:bg-black/55"
            >
              {isMuted ? "Sound on" : "Sound off"}
            </button>
            <div className="absolute bottom-6 right-6 z-20 max-w-xs rounded-2xl border border-white/10 bg-black/40 p-4 backdrop-blur-md">
              <p className="font-sans text-[10px] uppercase tracking-[0.35em] text-amber-200/70">
                Product showcase
              </p>
              <p className="mt-2 text-sm leading-relaxed text-stone-200/90">
                {autoplayBlocked
                  ? "Autoplay with sound was blocked. Tap Sound on to retry."
                  : "Scroll-triggered playback starts muted so the product reel loads cleanly on first visit."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
