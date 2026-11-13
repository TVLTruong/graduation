"use client";

import { useState, useRef, useEffect } from "react";

interface MusicPlayerProps {
  autoPlay?: boolean;
}

export default function MusicPlayer({ autoPlay = false }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (autoPlay && audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((e) => {
        console.warn("Auto-play prevented by browser", e);
      });
    }
  }, [autoPlay]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  return (
    <>
      <audio ref={audioRef} src="/music.mp3" loop />
      <button
        onClick={togglePlay}
        className={`fixed bottom-6 right-6 w-[50px] h-[50px] rounded-full bg-white shadow-lg flex items-center justify-center text-2xl z-40 transition-all duration-300 ${
          isPlaying ? "border-2 border-[var(--grass-green)] animate-[spin_4s_linear_infinite]" : "border border-gray-200"
        }`}
        aria-label="Toggle music"
      >
        🎵
      </button>
    </>
  );
}
