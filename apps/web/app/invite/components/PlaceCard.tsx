"use client";

import Image from "next/image";
import InviteCard from "./InviteCard";
import { EVENT } from "../event";

// Where the ceremony takes place: the building photo is the card background, the text sits on top
export default function PlaceCard() {
  return (
    <InviteCard className="overflow-hidden">
      <div className="relative -m-6 sm:-m-8 h-56 sm:h-64">
        <Image
          src="/images.jpg"
          alt="Hình ảnh địa điểm tổ chức"
          fill
          sizes="(min-width: 768px) 768px, 100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0.25) 55%, rgba(0,0,0,0.1))" }}
        />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 text-white">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/85">📍 Địa điểm</p>
          <p className="font-heading text-3xl sm:text-4xl font-extrabold leading-tight mt-1 drop-shadow">
            {EVENT.place}
          </p>
          <p className="font-semibold mt-1">{EVENT.org}</p>
          <p className="text-sm text-white/85 mt-1">{EVENT.placeNote}</p>
        </div>
      </div>
    </InviteCard>
  );
}
