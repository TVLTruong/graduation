"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Guest } from "@/lib/types";
import { getInviteTheme } from "@/app/invite/themes";
import { EVENT as SHARED_EVENT } from "@/app/invite/event";

// Stand-in portrait (apps/web/public/ava.png). Once the real graduation photo exists, save it as
// apps/web/public/card-photo.jpg (portrait, face in the upper half) and change this to "/card-photo.jpg".
export const CARD_PHOTO = "/ava.png";

export type CardRatio = "4:5" | "1:1" | "9:16";

export const CARD_RATIOS: { value: CardRatio; label: string; hint: string }[] = [
  { value: "4:5", label: "4:5", hint: "Zalo / Messenger" },
  { value: "1:1", label: "1:1", hint: "Vuông" },
  { value: "9:16", label: "9:16", hint: "Story" },
];

export const CARD_WIDTH = 1080;

type Layout = {
  height: number;
  padX: number;
  padTop: number;
  padBottom: number;
  mast: number; // masthead font size
  photoH: number;
  sideW: number; // width of the headline column beside the photo
  nameSize: number;
  bodySize: number;
  footerBottom: number;
  qr: number;
  time: number;
  text: number;
  sub: number;
  burst: number; // diameter of the "special issue" sticker
};

// All sizes are px on a 1080px-wide canvas; the dialog scales it down for preview
const LAYOUTS: Record<CardRatio, Layout> = {
  "4:5": {
    height: 1350,
    padX: 64,
    padTop: 56,
    padBottom: 70,
    mast: 136,
    photoH: 770,
    sideW: 330,
    nameSize: 78,
    bodySize: 32,
    footerBottom: 22,
    qr: 180,
    time: 80,
    text: 30,
    sub: 23,
    burst: 170,
  },
  "1:1": {
    height: 1080,
    padX: 48,
    padTop: 40,
    padBottom: 56,
    mast: 120,
    photoH: 600,
    sideW: 340,
    nameSize: 62,
    bodySize: 26,
    footerBottom: 18,
    qr: 140,
    time: 64,
    text: 26,
    sub: 20,
    burst: 140,
  },
  "9:16": {
    height: 1920,
    padX: 64,
    padTop: 170,
    padBottom: 210,
    mast: 136,
    photoH: 1000,
    sideW: 330,
    nameSize: 90,
    bodySize: 36,
    footerBottom: 120,
    qr: 190,
    time: 84,
    text: 32,
    sub: 25,
    burst: 200,
  },
};

export const getCardHeight = (ratio: CardRatio) => LAYOUTS[ratio].height;

// Same details as TimeCard / PlaceCard on the invite page
export const EVENT = {
  time: SHARED_EVENT.time,
  weekday: SHARED_EVENT.weekday,
  date: SHARED_EVENT.dateShort,
  place: SHARED_EVENT.place,
  org: SHARED_EVENT.org,
};

// Shrink long names so they fit on at most two lines of the available width
export function nameFontSize(name: string, base: number, width: number) {
  const fit = (width * 2 * 0.9) / (0.6 * Math.max(name.length, 1));
  return Math.round(Math.max(base * 0.5, Math.min(base, fit)));
}

// 16-point starburst for the sticker
const BURST_CLIP = (() => {
  const points: string[] = [];
  const spikes = 16;
  for (let i = 0; i < spikes * 2; i++) {
    const radius = i % 2 ? 41 : 50;
    const angle = (Math.PI * i) / spikes;
    points.push(`${(50 + radius * Math.cos(angle)).toFixed(1)}% ${(50 + radius * Math.sin(angle)).toFixed(1)}%`);
  }
  return `polygon(${points.join(",")})`;
})();

// x%, y%, size px, rotation deg — confetti behind the content
const CONFETTI: [number, number, number, number][] = [
  [6, 5, 26, 20],
  [93, 8, 22, -25],
  [3, 38, 20, 40],
  [96, 52, 28, 15],
  [8, 70, 24, -15],
  [90, 88, 22, 30],
  [50, 3, 18, -10],
  [30, 96, 24, 25],
];

function Photo({ width, height, burst }: { width: number; height: number; burst: number }) {
  const [photoMissing, setPhotoMissing] = useState(false);

  // <img onError> can fire before React attaches it, so probe the file separately
  useEffect(() => {
    const probe = new Image();
    probe.onerror = () => setPhotoMissing(true);
    probe.src = CARD_PHOTO;
  }, []);

  return (
    <div
      className="relative shrink-0 overflow-hidden"
      style={{
        width,
        height,
        border: "8px solid #fff",
        borderRadius: 28,
        boxShadow: "16px 16px 0 var(--sparkle-yellow)",
        background: "var(--sky-blue-soft)",
      }}
    >
      {photoMissing ? (
        <div
          className="relative flex h-full w-full items-center justify-center overflow-hidden"
          style={{
            background:
              "linear-gradient(160deg, var(--sky-blue-light), var(--sky-blue-soft) 55%, var(--grass-green-light))",
          }}
        >
          <div
            className="absolute rounded-full"
            style={{
              width: width * 1.1,
              height: width * 1.1,
              background: "var(--sky-blue-mid)",
              opacity: 0.35,
              bottom: -width * 0.45,
            }}
          />
          <span className="relative" style={{ fontSize: width * 0.42 }}>
            🎓
          </span>
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- plain <img> so html-to-image can inline it
        <img src={CARD_PHOTO} alt="" className="h-full w-full object-cover" style={{ objectPosition: "50% 25%" }} onError={() => setPhotoMissing(true)} />
      )}

      <div
        className="font-heading absolute flex flex-col items-center justify-center text-center font-extrabold uppercase"
        style={{
          top: 18,
          right: 18,
          width: burst,
          height: burst,
          clipPath: BURST_CLIP,
          background: "var(--grass-green)",
          color: "#fff",
          transform: "rotate(12deg)",
          fontSize: burst * 0.15,
          lineHeight: 1.05,
        }}
      >
        <span>Số đặc biệt</span>
        <span style={{ fontSize: burst * 0.24 }}>26.11</span>
      </div>
    </div>
  );
}

function Headline({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ borderLeft: "8px solid var(--sparkle-yellow)", paddingLeft: 16 }}>
      <p
        className="font-semibold uppercase"
        style={{ fontSize: 18, letterSpacing: "0.18em", color: "rgba(255,255,255,0.75)", marginBottom: 4 }}
      >
        {label}
      </p>
      {children}
    </div>
  );
}

// "Magazine cover" version of the invite, rendered at a fixed 1080px width for PNG export
export default function InviteImageCard({
  guest,
  url,
  ratio,
  ref,
}: {
  guest: Guest;
  url: string;
  ratio: CardRatio;
  ref?: React.Ref<HTMLDivElement>;
}) {
  const theme = getInviteTheme(guest.type);
  const L = LAYOUTS[ratio];
  const contentW = CARD_WIDTH - L.padX * 2;
  const photoW = contentW - L.sideW - 36;
  const bannerW = photoW + 40;
  const nameSize = nameFontSize(guest.name, L.nameSize, bannerW - 64);

  return (
    <div
      ref={ref}
      data-guest-theme={theme.key}
      className="font-sans relative overflow-hidden"
      style={{
        width: CARD_WIDTH,
        height: L.height,
        color: "#fff",
        background:
          "linear-gradient(165deg, var(--sky-blue-deep), color-mix(in srgb, var(--sky-blue-deep) 62%, #000))",
      }}
    >
      {/* Background: big circles, diagonal stripes, confetti */}
      <div
        className="absolute rounded-full"
        style={{
          width: 900,
          height: 900,
          right: -330,
          top: L.height * 0.12,
          background: "var(--sky-blue-mid)",
          opacity: 0.28,
        }}
      />
      <div
        className="absolute rounded-full"
        style={{
          width: 640,
          height: 640,
          left: -260,
          bottom: -120,
          background: "var(--grass-green)",
          opacity: 0.35,
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "repeating-linear-gradient(135deg, rgba(255,255,255,0.05) 0 3px, transparent 3px 36px)",
        }}
      />
      {CONFETTI.map(([x, y, size, rot], i) => (
        <span
          key={i}
          className="absolute"
          style={{
            left: `${x}%`,
            top: `${y}%`,
            width: size,
            height: size * 0.5,
            borderRadius: 3,
            transform: `rotate(${rot}deg)`,
            background: theme.confettiColors[i % theme.confettiColors.length],
          }}
        />
      ))}

      <div
        className="absolute inset-0 flex flex-col justify-between"
        style={{ padding: `${L.padTop}px ${L.padX}px ${L.padBottom}px` }}
      >
        {/* Masthead */}
        <div>
          <div
            className="flex justify-between font-bold uppercase"
            style={{ fontSize: 21, letterSpacing: "0.22em", paddingBottom: 8, borderBottom: "4px solid #fff" }}
          >
            <span>The Graduation Issue</span>
            <span>Nº 2026</span>
          </div>
          <p
            className="font-heading whitespace-nowrap text-center font-extrabold uppercase"
            style={{
              fontSize: L.mast,
              lineHeight: 1.12,
              marginTop: 6,
            }}
          >
            Lâm Trường
          </p>
        </div>

        {/* Photo + headlines + name banner */}
        <div className="relative flex items-stretch" style={{ gap: 36, marginBottom: 76 }}>
          <Photo width={photoW} height={L.photoH} burst={L.burst} />

          <div className="flex flex-1 flex-col justify-between" style={{ paddingTop: 4, paddingBottom: 4 }}>
            <Headline label="Giờ">
              <p
                className="font-heading whitespace-nowrap font-extrabold leading-none"
                style={{ fontSize: L.time }}
              >
                {EVENT.time}
              </p>
            </Headline>
            <Headline label="Ngày">
              <p className="font-bold leading-tight" style={{ fontSize: L.text }}>
                {EVENT.weekday}
                <br />
                {EVENT.date}
              </p>
            </Headline>
            <Headline label="Địa điểm">
              <p className="font-bold leading-tight" style={{ fontSize: L.text }}>
                {EVENT.place}
              </p>
              <p className="leading-snug" style={{ fontSize: L.sub, color: "rgba(255,255,255,0.8)" }}>
                {EVENT.org}
              </p>
            </Headline>

            <div
              className="flex flex-col items-center self-start"
              style={{ background: "#fff", borderRadius: 22, padding: 12, gap: 8, color: "var(--dark-text)" }}
            >
              <QRCodeSVG value={url} size={L.qr} level="H" bgColor="#ffffff" fgColor="#1a1a1a" />
              <p
                className="text-center font-bold uppercase leading-tight"
                style={{ fontSize: Math.round(L.sub * 0.78), letterSpacing: "0.06em", width: L.qr }}
              >
                Quét để xem thiệp
              </p>
            </div>
          </div>

          <div
            className="absolute text-center"
            style={{
              left: -20,
              bottom: -76,
              width: bannerW,
              background: "var(--sparkle-yellow)",
              color: "var(--dark-text)",
              padding: "14px 32px 18px",
              transform: "rotate(-2deg)",
              boxShadow: "10px 10px 0 var(--dark-text)",
              borderRadius: 8,
            }}
          >
            <p
              className="font-bold uppercase"
              style={{ fontSize: Math.round(L.bodySize * 0.8), letterSpacing: "0.22em" }}
            >
              {theme.copy.greeting}
            </p>
            <p
              className="font-heading font-extrabold"
              style={{ fontSize: nameSize, lineHeight: 1.08, textWrap: "balance" }}
            >
              {guest.name}
            </p>
          </div>
        </div>

        {/* Tagline */}
        <p
          className="text-center font-semibold"
          style={{ fontSize: L.bodySize, lineHeight: 1.35, textWrap: "balance", padding: "0 40px" }}
        >
          {theme.copy.inviteBody}
        </p>
      </div>

      <p
        className="absolute left-0 w-full text-center font-medium"
        style={{ bottom: L.footerBottom, fontSize: 20, color: "rgba(255,255,255,0.7)" }}
      >
        {theme.copy.footer}
      </p>
    </div>
  );
}
