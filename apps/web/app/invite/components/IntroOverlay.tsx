"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Guest } from "@/lib/types";
import { getInviteTheme } from "../themes";

function createFloatingEmojis(emojis: string[]) {
  return Array.from({ length: 20 }).map(() => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    animation: `driftDown ${10 + Math.random() * 15}s linear infinite`,
    animationDelay: `-${Math.random() * 20}s`,
    emoji: emojis[Math.floor(Math.random() * emojis.length)],
  }));
}

interface IntroOverlayProps {
  guest: Guest;
  onComplete: () => void;
}

export default function IntroOverlay({ guest, onComplete }: IntroOverlayProps) {
  const theme = getInviteTheme(guest.type);
  const fullText = theme.copy.introText;

  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);
  const [displayedText, setDisplayedText] = useState("");
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  // Randomized once so the emojis don't jump on every typing re-render
  const [floatingEmojis] = useState(() => createFloatingEmojis(theme.floatingEmojis));

  const indexRef = useRef(0);

  useEffect(() => {
    // Lock scroll
    document.body.style.overflow = "hidden";
    
    const interval = setInterval(() => {
      if (indexRef.current < fullText.length) {
        setDisplayedText(fullText.slice(0, indexRef.current + 1));
        indexRef.current++;
      } else {
        clearInterval(interval);
        setIsTypingComplete(true);
      }
    }, 35);

    return () => {
      clearInterval(interval);
      // We don't unlock scroll here, we unlock it when the overlay is removed
    };
  }, [fullText]);

  const handleClick = () => {
    if (!isTypingComplete) {
      // Skip typing
      setDisplayedText(fullText);
      indexRef.current = fullText.length;
      setIsTypingComplete(true);
    } else {
      // Fade out
      setIsFading(true);
      setTimeout(() => {
        setIsVisible(false);
        document.body.style.overflow = "auto";
        onComplete();
      }, 1000);
    }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {!isFading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          onClick={handleClick}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 cursor-pointer"
          style={{
            background: "linear-gradient(to bottom, var(--sky-blue-soft), #ffffff)",
            backgroundImage: "radial-gradient(var(--card-shadow) 15%, transparent 16%), linear-gradient(to bottom, var(--sky-blue-soft), #ffffff)",
            backgroundSize: "16px 16px, 100% 100%"
          }}
        >
          {/* Floating Emojis Background */}
          {floatingEmojis.map(({ emoji, ...style }, i) => (
            <div key={i} className="absolute text-2xl opacity-50" style={style}>
              {emoji}
            </div>
          ))}

          <div
            className="relative bg-white/80 backdrop-blur-md border-[4px] border-[var(--card-border)] rounded-[28px] p-8 max-w-lg w-full text-center shadow-[0_8px_32px_var(--card-shadow-hover)]"
            onClick={(e) => e.stopPropagation()} // Let clicks on the card also trigger the overlay's click by allowing propagation
          >
            <div className="min-h-[150px] flex flex-col justify-center items-center">
              <p className="text-xl md:text-2xl font-medium text-[var(--dark-text)] whitespace-pre-wrap leading-relaxed inline-block">
                {displayedText}
                {!isTypingComplete && (
                  <span className="inline-block w-[3px] h-[1.2em] bg-[var(--sky-blue-deep)] ml-1 align-middle" style={{ animation: "blinkCursor 1s step-end infinite" }} />
                )}
              </p>
            </div>

            <div className="mt-8 h-8">
              {isTypingComplete && (
                <div className="text-[var(--sky-blue-deep)] font-semibold flex flex-col items-center animate-[pulse_2s_infinite]">
                  <span>CLICK ĐỂ TIẾP TỤC</span>
                  <span className="text-2xl mt-2 animate-[bounce_1s_infinite]">👇</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
