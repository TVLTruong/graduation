"use client";

import type { Guest } from "@/lib/types";
import { getInviteTheme } from "../themes";
import InviteCard from "./InviteCard";

// The personal invitation: who is invited and the personal message
export default function InvitationCard({ guest }: { guest: Guest }) {
  const { copy, ornament } = getInviteTheme(guest.type);

  return (
    <InviteCard className="text-center">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--light-text)]">
        {copy.greeting}
      </p>
      <p className="font-heading text-3xl sm:text-4xl font-bold text-[var(--grass-green)] mt-2 leading-tight">
        {guest.name}
      </p>

      {/* Thin divider with a small themed icon under the name */}
      <div className="flex items-center justify-center gap-3 mt-3 mb-4" aria-hidden>
        <span className="h-px w-12 bg-[var(--sky-blue-light)]" />
        <span className="text-lg">{ornament}</span>
        <span className="h-px w-12 bg-[var(--sky-blue-light)]" />
      </div>

      <p className="text-lg text-[var(--dark-text)] font-medium">{copy.inviteBody}</p>

      <div className="flex items-center justify-center gap-3 my-6 text-[var(--sky-blue-light)]" aria-hidden>
        <span className="h-px w-16 bg-current" />
        <span className="text-[var(--sparkle-yellow)]">✦</span>
        <span className="h-px w-16 bg-current" />
      </div>

      <p className="text-[15px] italic text-[var(--muted-text)] leading-relaxed">{copy.closingLine}</p>
    </InviteCard>
  );
}
