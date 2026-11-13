"use client";

import { Phone, Mail, MessageCircle } from "lucide-react";
import type { Guest } from "@/lib/types";
import { getInviteTheme } from "../themes";
import InviteCard from "./InviteCard";

// TODO: replace the placeholder phone, email and profile links with real ones
const CONTACTS = [
  { href: "tel:0914177448", label: "Điện thoại", icon: <Phone size={22} />, iconColor: "text-[var(--sky-blue-deep)]" },
  { href: "mailto:tvlamtruong@gmail.com", label: "Email", icon: <Mail size={22} />, iconColor: "text-rose-500" },
  { href: "https://www.facebook.com/lamtruong.tranvo.94", label: "Facebook", icon: <MessageCircle size={22} />, iconColor: "text-blue-600" },
  { href: "https://zalo.me", label: "Zalo", icon: <span className="font-black text-lg leading-none">Z</span>, iconColor: "text-blue-500" },
];

export default function ContactCard({ guest }: { guest: Guest }) {
  const { copy } = getInviteTheme(guest.type);

  return (
    <InviteCard icon="🆘" title={copy.lostContact}>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {CONTACTS.map(({ href, label, icon, iconColor }) => (
          <a
            key={label}
            href={href}
            target={href.startsWith("http") ? "_blank" : undefined}
            rel={href.startsWith("http") ? "noreferrer" : undefined}
            className="flex flex-col items-center gap-2 p-4 rounded-[20px] bg-[var(--soft-box)] hover:bg-[var(--soft-box-hover)] transition-colors text-[var(--dark-text)]"
          >
            <span className={`bg-white w-12 h-12 rounded-full shadow-sm flex items-center justify-center ${iconColor}`}>
              {icon}
            </span>
            <span className="text-sm font-bold">{label}</span>
          </a>
        ))}
      </div>
    </InviteCard>
  );
}
