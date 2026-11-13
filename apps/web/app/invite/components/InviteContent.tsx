"use client";

import type { Guest } from "@/lib/types";
import { getInviteTheme } from "../themes";
import HeroSection from "./HeroSection";
import InvitationCard from "./InvitationCard";
import TimeCard from "./TimeCard";
import PlaceCard from "./PlaceCard";
import RSVPForm from "./RSVPForm";
import DirectionsCard from "./DirectionsCard";
import ContactCard from "./ContactCard";
import SideDecor from "./SideDecor";

// Sections in the order a guest needs them: who invites me → when + where → how to get there → reply → help.
// Each big group gets generous space; time and place sit tight together as one group.
export default function InviteContent({ guest, shared = false }: { guest: Guest; shared?: boolean }) {
  const { copy } = getInviteTheme(guest.type);

  return (
    <>
      <SideDecor type={guest.type} />
      <main className="max-w-3xl mx-auto relative z-10 pb-24">
        <HeroSection />

        <div className="px-4 space-y-12 sm:space-y-16">
          <InvitationCard guest={guest} />
          <div className="space-y-3">
            <TimeCard guest={guest} />
            <PlaceCard />
          </div>
          <DirectionsCard />
          <RSVPForm guest={guest} shared={shared} />
          <ContactCard guest={guest} />
        </div>

        <footer className="text-center pt-16">
          <p className="text-[var(--dark-text)] font-medium text-sm">{copy.footer}</p>
          <p className="text-[var(--light-text)] text-xs mt-2">© 2026 Lâm Trường</p>
        </footer>
      </main>
    </>
  );
}
