"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { EVENT } from "../event";

// Stand-in until the real graduation photos exist: add them to public/ and list them here
// (tapping the polaroid cycles through the list)
const PHOTOS = ["/ava.png"];

const FALLBACK_PHOTO = "https://images.unsplash.com/photo-1546410531-bb4caa6b424d?q=80&w=600&auto=format&fit=crop";

export default function HeroSection() {
  const [photoIndex, setPhotoIndex] = useState(0);
  const [sparkles, setSparkles] = useState<{ id: number; x: number; y: number }[]>([]);

  const handlePhotoClick = (e: React.MouseEvent<HTMLDivElement>) => {
    setPhotoIndex((prev) => (prev + 1) % PHOTOS.length);

    // Sparkle where the photo was tapped
    const rect = e.currentTarget.getBoundingClientRect();
    const id = Date.now();
    setSparkles((prev) => [...prev, { id, x: e.clientX - rect.left, y: e.clientY - rect.top }]);
    setTimeout(() => {
      setSparkles((prev) => prev.filter((s) => s.id !== id));
    }, 1000);
  };

  return (
    <section className="relative w-full pt-14 pb-10 flex flex-col items-center text-center z-10">
      <span className="bg-white/85 backdrop-blur-sm border-2 border-[var(--sky-blue-mid)] rounded-full px-5 py-1.5 shadow-sm mb-10 font-bold text-[var(--sky-blue-deep)] tracking-[0.25em] text-xs">
        🎓 LỄ TỐT NGHIỆP
      </span>

      {/* Polaroid */}
      <div className="relative">
        <div className="absolute -top-5 -left-6 text-3xl text-[var(--sparkle-yellow)] animate-[spin_8s_linear_infinite]" aria-hidden>⭐</div>
        <div className="absolute -bottom-3 -right-6 text-2xl text-[var(--sparkle-yellow)] animate-[pulse_3s_infinite]" aria-hidden>✨</div>

        <motion.div
          className="relative bg-white p-3 pb-10 shadow-xl rounded-sm w-[260px] sm:w-[300px] mx-auto cursor-pointer z-10"
          initial={{ rotate: -3 }}
          whileHover={{ rotate: 2, scale: 1.03 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          onClick={handlePhotoClick}
        >
          <div className="relative aspect-[4/5] bg-gray-100 overflow-hidden rounded-sm">
            {/* eslint-disable-next-line @next/next/no-img-element -- falls back to a remote image via onError */}
            <img
              src={PHOTOS[photoIndex]}
              alt="Lâm Trường"
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = FALLBACK_PHOTO;
              }}
            />
            <AnimatePresence>
              {sparkles.map((sparkle) => (
                <motion.div
                  key={sparkle.id}
                  initial={{ opacity: 1, scale: 1, y: 0 }}
                  animate={{ opacity: 0, scale: 0, y: -50 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 1 }}
                  className="absolute text-3xl pointer-events-none"
                  style={{ left: sparkle.x - 15, top: sparkle.y - 15 }}
                >
                  ✨
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
          <p className="absolute bottom-2.5 left-0 w-full text-center font-medium text-gray-500 text-sm italic">
            {EVENT.dateShort}
          </p>
        </motion.div>
      </div>
      {PHOTOS.length > 1 && <p className="text-xs text-[var(--light-text)] mt-3">Chạm vào ảnh để xem thêm ✨</p>}

      {/* Flat, bold wordmark in one solid colour (no outline or drop shadow) */}
      <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mt-8 text-[var(--title-ink)]">
        LÂM TRƯỜNG
      </h1>
      <p className="mt-2 font-semibold text-[var(--dark-text)] bg-white/80 backdrop-blur-sm rounded-full px-4 py-1 text-sm">
        Cử nhân Khoa học Máy tính · UIT
      </p>
    </section>
  );
}
