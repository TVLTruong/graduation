"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import type { Guest } from "@/lib/types";
import { getInviteTheme } from "../themes";
import InviteContent from "../components/InviteContent";
import IntroOverlay from "../components/IntroOverlay";
import MusicPlayer from "../components/MusicPlayer";

export default function InvitePage() {
  const { shortId } = useParams<{ shortId: string }>();
  const router = useRouter();
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(true);
  const [playMusic, setPlayMusic] = useState(false);
  const [introFinished, setIntroFinished] = useState(false);

  useEffect(() => {
    const fetchGuest = async () => {
      try {
        const res = await api.get<Guest>(`/guests/${shortId}`);
        setGuest(res.data);
      } catch (error) {
        console.error("Guest not found:", error);
        router.push("/404");
      } finally {
        setLoading(false);
      }
    };
    if (shortId) fetchGuest();
  }, [shortId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen sky-bg">
        <div className="animate-[spin_1s_linear_infinite] text-4xl">✨</div>
      </div>
    );
  }

  if (!guest) return null;

  const theme = getInviteTheme(guest.type);

  const handleIntroComplete = () => {
    setIntroFinished(true);
    setPlayMusic(true);
  };

  return (
    <div data-guest-theme={theme.key} className="min-h-screen sky-bg font-sans relative overflow-hidden custom-scrollbar">
      {/* Intro Overlay */}
      {!introFinished && (
        <IntroOverlay guest={guest} onComplete={handleIntroComplete} />
      )}

      {/* Floating Clouds Background */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-40">
        <div className="absolute top-[10%] left-0 text-7xl animate-[floatCloud_30s_linear_infinite]" style={{ animationDelay: '0s' }}>{theme.cloudEmoji}</div>
        <div className="absolute top-[40%] left-0 text-6xl animate-[floatCloud_45s_linear_infinite]" style={{ animationDelay: '-15s' }}>{theme.cloudEmoji}</div>
        <div className="absolute top-[70%] left-0 text-8xl animate-[floatCloud_35s_linear_infinite]" style={{ animationDelay: '-5s' }}>{theme.cloudEmoji}</div>
      </div>

      <InviteContent guest={guest} />

      {/* Music Player */}
      <MusicPlayer autoPlay={playMusic} />
    </div>
  );
}
