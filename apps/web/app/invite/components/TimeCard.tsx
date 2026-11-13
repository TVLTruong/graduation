"use client";

import type { Guest } from "@/lib/types";
import { getInviteTheme } from "../themes";
import InviteCard from "./InviteCard";
import CountdownTimer from "./CountdownTimer";
import { EVENT } from "../event";

// When the ceremony starts, plus how long is left
export default function TimeCard({ guest }: { guest: Guest }) {
  const { copy } = getInviteTheme(guest.type);

  return (
    <InviteCard icon="⏰" title="Thời gian">
      <div className="rounded-[20px] bg-[var(--soft-box)] px-5 py-6 text-center">
        <p className="font-heading text-5xl font-bold text-[var(--sky-blue-deep)] leading-none">{EVENT.time}</p>
        <p className="mt-3 text-lg font-bold text-[var(--dark-text)]">{EVENT.dateLong}</p>
      </div>

      <div className="mt-6">
        <CountdownTimer title={copy.countdownTitle} />
      </div>

      <p className="text-sm text-center text-[var(--muted-text)] mt-5">{copy.timeNote}</p>
    </InviteCard>
  );
}
