"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { isAxiosError } from "axios";
import { api } from "@/lib/api";
import type { Guest } from "@/lib/types";
import { getInviteTheme } from "../themes";
import { EVENT } from "../event";
import InviteCard from "./InviteCard";

type ConfettiPiece = { id: number; left: string; color: string; animationDuration: string; delay: string };

type RsvpPayload = { isAttending: boolean; wish: string };

// The shared link has no guest record: the first RSVP creates one, and we remember
// its shortId in this browser so resubmitting updates it instead of adding a duplicate
const SHARED_RSVP_KEY = "sharedRsvpShortId";

function readStoredShortId() {
  try {
    return localStorage.getItem(SHARED_RSVP_KEY);
  } catch {
    return null;
  }
}

function storeShortId(shortId: string) {
  try {
    localStorage.setItem(SHARED_RSVP_KEY, shortId);
  } catch {
    // Storage unavailable (e.g. private mode): a resubmit would create a new guest
  }
}

async function submitSharedRsvp(name: string, payload: RsvpPayload) {
  const storedShortId = readStoredShortId();
  if (storedShortId) {
    try {
      await api.patch(`/guests/${storedShortId}/rsvp`, payload);
      return;
    } catch (error) {
      // Guest was deleted by the admin: fall through and create a new one
      if (!isAxiosError(error) || error.response?.status !== 404) throw error;
    }
  }
  const res = await api.post<Guest>("/guests/rsvp", { name, ...payload });
  storeShortId(res.data.shortId);
}

export default function RSVPForm({ guest, shared = false }: { guest: Guest; shared?: boolean }) {
  const { confettiColors, copy } = getInviteTheme(guest.type);

  const [name, setName] = useState(guest.name || "");
  const [isAttending, setIsAttending] = useState<boolean | null>(guest.isAttending);
  const [wish, setWish] = useState<string>(guest.wish || "");
  const [loading, setLoading] = useState(false);
  // What was just sent; while set, the thank-you message replaces the form
  const [sent, setSent] = useState<RsvpPayload | null>(null);
  const [confetti, setConfetti] = useState<ConfettiPiece[]>([]);
  const thanksRef = useRef<HTMLDivElement>(null);

  const triggerConfetti = () => {
    const newConfetti = Array.from({ length: 80 }).map((_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      color: confettiColors[Math.floor(Math.random() * confettiColors.length)],
      animationDuration: `${2 + Math.random() * 3}s`, // 2-5s
      delay: `${Math.random() * 0.5}s`,
    }));
    setConfetti(newConfetti);

    // Clear confetti after 5s
    setTimeout(() => {
      setConfetti([]);
    }, 5000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isAttending === null || !name.trim()) return;

    setLoading(true);
    try {
      const payload = { isAttending, wish: wish.trim() };
      if (shared) {
        await submitSharedRsvp(name.trim(), payload);
      } else {
        await api.patch(`/guests/${guest.shortId}/rsvp`, payload);
      }

      setSent(payload);
      // Celebrate only when they're coming
      if (isAttending) triggerConfetti();
      requestAnimationFrame(() => thanksRef.current?.scrollIntoView({ behavior: "smooth", block: "center" }));
    } catch (error) {
      console.error(error);
      alert("Có lỗi xảy ra, vui lòng thử lại sau.");
    } finally {
      setLoading(false);
    }
  };

  const reply = sent ? (sent.isAttending ? copy.thanks.yes : copy.thanks.no) : null;

  return (
    <InviteCard id="rsvp" className="relative overflow-hidden">
      {sent && reply ? (
        <motion.div
          ref={thanksRef}
          role="status"
          aria-live="polite"
          className="relative z-10 text-center py-4"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
        >
          <div className="text-6xl mb-3" aria-hidden>
            {reply.emoji}
          </div>
          <h2 className="font-heading text-2xl font-bold text-[var(--sky-blue-deep)]">{reply.title}</h2>
          <p className="text-[var(--dark-text)] mt-3 leading-relaxed">{reply.body}</p>

          {sent.isAttending && (
            <p className="mt-4 inline-block rounded-2xl bg-[var(--soft-box)] px-4 py-2 text-sm font-semibold text-[var(--dark-text)]">
              ⏰ {EVENT.time} · {EVENT.weekday}, {EVENT.dateShort}
              <br />
              📍 {EVENT.place}, {EVENT.org}
            </p>
          )}

          {sent.wish && (
            <div className="mt-6 text-left rounded-2xl border-2 border-[var(--sky-blue-soft)] bg-white/70 p-4">
              <p className="text-sm font-semibold text-[var(--light-text)]">{copy.thanks.wish}</p>
              <p className="mt-2 italic text-[var(--dark-text)] whitespace-pre-wrap break-words">“{sent.wish}”</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setSent(null)}
            className="mt-6 text-sm font-semibold text-[var(--light-text)] underline underline-offset-4 hover:text-[var(--dark-text)]"
          >
            Sửa lại câu trả lời
          </button>
        </motion.div>
      ) : (
        <>
          <div className="text-center mb-8">
            <h2 className="font-heading text-2xl font-bold text-[var(--sky-blue-deep)] flex justify-center items-center gap-2">
              <span>💌</span> Xác Nhận Tham Dự
            </h2>
            <p className="text-sm text-[var(--light-text)] mt-2">{copy.rsvpPrompt}</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
            <div>
              <label className="block text-sm font-medium text-[var(--dark-text)] mb-2">
                Tên của bạn <span className="text-red-500">*</span>
              </label>
              {/* Personal invites show the guest's name read-only, since their RSVP doesn't save the name.
                  The shared link edits just the name, which is what gets saved. */}
              <input
                type="text"
                maxLength={100}
                required
                readOnly={!shared}
                value={shared ? name : guest.name}
                onChange={(e) => setName(e.target.value)}
                placeholder={copy.namePlaceholder}
                className={`w-full rounded-xl border-2 border-[var(--sky-blue-soft)] p-3 focus:ring-2 focus:ring-[var(--sky-blue-deep)] outline-none bg-white/80 transition-all ${shared ? "" : "font-semibold text-[var(--dark-text)] cursor-default"}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setIsAttending(true)}
                className={`py-4 rounded-2xl border-[3px] transition-all font-bold flex flex-col items-center justify-center gap-2 ${
                  isAttending === true
                    ? "border-[var(--grass-green)] bg-[var(--grass-green-light)] text-[var(--grass-green-dark)] scale-[1.02] shadow-md"
                    : "border-white bg-white/50 text-[var(--light-text)] hover:border-[var(--grass-green-light)]"
                }`}
              >
                <span className="text-3xl">{copy.yes.emoji}</span>
                <span>{copy.yes.label}</span>
              </button>

              <button
                type="button"
                onClick={() => setIsAttending(false)}
                className={`py-4 rounded-2xl border-[3px] transition-all font-bold flex flex-col items-center justify-center gap-2 ${
                  isAttending === false
                    ? "border-red-400 bg-red-50 text-red-600 scale-[1.02] shadow-md"
                    : "border-white bg-white/50 text-[var(--light-text)] hover:border-red-100"
                }`}
              >
                <span className="text-3xl">{copy.no.emoji}</span>
                <span>{copy.no.label}</span>
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-[var(--dark-text)] mb-2">
                Lời nhắn nhủ (tùy chọn)
              </label>
              <textarea
                maxLength={1000}
                value={wish}
                onChange={(e) => setWish(e.target.value)}
                className="w-full rounded-xl border-2 border-[var(--sky-blue-soft)] p-4 focus:ring-2 focus:ring-[var(--sky-blue-deep)] resize-none outline-none bg-white/80 transition-all"
                rows={3}
                placeholder={copy.wishPlaceholder}
              />
            </div>

            <button
              type="submit"
              disabled={loading || isAttending === null || !name.trim()}
              className="w-full bubbly-button py-4 text-lg"
            >
              {loading ? "Đang gửi..." : "GỬI XÁC NHẬN"}
            </button>
          </form>
        </>
      )}

      {/* Confetti Container */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {confetti.map((c) => (
          <div
            key={c.id}
            className="absolute top-[-20px] w-[10px] h-[20px] rounded-[2px]"
            style={{
              left: c.left,
              backgroundColor: c.color,
              animation: `driftDown ${c.animationDuration} linear forwards`,
              animationDelay: c.delay,
            }}
          />
        ))}
      </div>
    </InviteCard>
  );
}
