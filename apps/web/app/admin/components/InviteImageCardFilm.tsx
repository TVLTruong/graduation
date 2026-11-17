"use client";

import { useEffect, useState } from "react";
import { QRCodeSVG } from "qrcode.react";
import type { Guest } from "@/lib/types";
import { getInviteTheme } from "@/app/invite/themes";
import { CARD_PHOTO, CARD_WIDTH, EVENT, nameFontSize, type CardRatio } from "./InviteImageCard";

type Layout = {
  height: number;
  s: number; // scale for text inside the frames
  photoH: number;
  gap: number; // space between frames
  nameBase: number;
};

// All sizes are px on a 1080px-wide canvas; the dialog scales it down for preview
const LAYOUTS: Record<CardRatio, Layout> = {
  "4:5": { height: 1350, s: 0.94, photoH: 350, gap: 26, nameBase: 88 },
  "1:1": { height: 1080, s: 0.7, photoH: 250, gap: 18, nameBase: 70 },
  "9:16": { height: 1920, s: 1.2, photoH: 640, gap: 32, nameBase: 108 },
};

const STRIP_W = 940;
const FRAME_W = 760; // picture area; the rest of the strip is sprocket holes and edge print
const FILM_BASE = "#14110f";
const EDGE_ORANGE = "#ff9a3c";

// Sprocket holes and the printed edge markings that run down both sides of the strip
function Edge({ side, length }: { side: "left" | "right"; length: number }) {
  const holes = Math.ceil(length / 48) + 1;
  const marks = Array.from({ length: 40 }, (_, i) => `▸ ${i + 1}   ${i + 1}A`).join("     ");
  return (
    <>
      <div
        className="absolute flex flex-col"
        style={{ [side]: 14, top: 0, bottom: 0, width: 30, gap: 26, paddingTop: 10, overflow: "hidden" }}
      >
        {Array.from({ length: holes }, (_, i) => (
          <div
            key={i}
            className="shrink-0"
            style={{ width: 30, height: 22, borderRadius: 5, background: "var(--sky-blue-soft)" }}
          />
        ))}
      </div>
      <div
        className="absolute overflow-hidden whitespace-nowrap"
        style={{
          [side]: 56,
          top: 0,
          bottom: 0,
          width: 28,
          writingMode: "vertical-rl",
          fontFamily: "var(--font-geist-mono)",
          fontSize: 15,
          letterSpacing: "0.18em",
          color: EDGE_ORANGE,
          opacity: 0.85,
        }}
        aria-hidden
      >
        {marks}
      </div>
    </>
  );
}

function Frame({
  children,
  bg,
  minHeight,
  height,
  className,
}: {
  children: React.ReactNode;
  bg: string;
  minHeight?: number;
  height?: number;
  className?: string;
}) {
  return (
    <div
      className={`relative shrink-0 overflow-hidden ${className ?? ""}`}
      style={{
        width: FRAME_W,
        height,
        minHeight,
        background: bg,
        borderRadius: 8,
        boxShadow: "inset 0 0 0 3px rgba(0,0,0,0.35)",
      }}
    >
      {children}
    </div>
  );
}

function FrameLabel({ n }: { n: number }) {
  return (
    <div
      className="flex justify-between"
      style={{
        width: FRAME_W,
        height: 0,
        fontFamily: "var(--font-geist-mono)",
        fontSize: 15,
        letterSpacing: "0.16em",
        color: EDGE_ORANGE,
        opacity: 0.9,
        position: "relative",
      }}
      aria-hidden
    >
      <span className="absolute left-0" style={{ top: -3 }}>
        ▸{n}A
      </span>
      <span className="absolute right-0" style={{ top: -3 }}>
        GRADUATION 400
      </span>
    </div>
  );
}

function PhotoFrame({ height, s }: { height: number; s: number }) {
  const [missing, setMissing] = useState(false);

  // <img onError> can fire before React attaches it, so probe the file separately
  useEffect(() => {
    const probe = new Image();
    probe.onerror = () => setMissing(true);
    probe.src = CARD_PHOTO;
  }, []);

  const corner = (pos: React.CSSProperties, borders: React.CSSProperties) => (
    <div className="absolute" style={{ width: 46 * s, height: 46 * s, border: "0 solid rgba(255,255,255,0.92)", ...pos, ...borders }} />
  );
  const inset = 24 * s;
  const bw = 5 * s;

  return (
    <Frame bg="#222" height={height}>
      {missing ? (
        <div
          className="flex h-full w-full items-center justify-center"
          style={{
            background:
              "linear-gradient(160deg, var(--sky-blue-mid), var(--sky-blue-deep))",
            fontSize: height * 0.4,
          }}
        >
          🎓
        </div>
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- plain <img> so html-to-image can inline it
        <img
          src={CARD_PHOTO}
          alt=""
          className="h-full w-full object-contain"
          style={{ objectPosition: "50% 50%" }}
          onError={() => setMissing(true)}
        />
      )}

      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(to top, rgba(0,0,0,0.78), rgba(0,0,0,0) 58%)" }}
      />

      {/* Viewfinder corners */}
      {corner({ top: inset, left: inset }, { borderTopWidth: bw, borderLeftWidth: bw })}
      {corner({ top: inset, right: inset }, { borderTopWidth: bw, borderRightWidth: bw })}
      {corner({ bottom: inset, left: inset }, { borderBottomWidth: bw, borderLeftWidth: bw })}
      {corner({ bottom: inset, right: inset }, { borderBottomWidth: bw, borderRightWidth: bw })}

      <div
        className="absolute flex items-center font-bold"
        style={{
          top: inset + 10 * s,
          left: inset + 22 * s,
          gap: 10 * s,
          fontFamily: "var(--font-geist-mono)",
          fontSize: 22 * s,
          letterSpacing: "0.14em",
          color: "#fff",
          textShadow: "0 2px 6px rgba(0,0,0,0.6)",
        }}
      >
        <span style={{ width: 16 * s, height: 16 * s, borderRadius: "50%", background: "#ff3b30" }} />
        REC · LỄ TỐT NGHIỆP
      </div>

      <div className="absolute" style={{ left: inset + 22 * s, bottom: inset + 16 * s, color: "#fff" }}>
        <p
          className="font-heading font-extrabold uppercase leading-none"
          style={{ fontSize: 76 * s }}
        >
          Lâm Trường
        </p>
        <p className="font-semibold" style={{ fontSize: 24 * s, marginTop: 6 * s }}>
          Cử nhân Khoa học Máy tính · UIT
        </p>
      </div>

      {/* Old-camera date imprint */}
      <p
        className="absolute"
        style={{
          right: inset + 22 * s,
          top: inset + 8 * s,
          fontFamily: "var(--font-geist-mono)",
          fontSize: 30 * s,
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: EDGE_ORANGE,
          textShadow: `0 0 12px ${EDGE_ORANGE}`,
        }}
      >
        &apos;26 11 26
      </p>
    </Frame>
  );
}

// Film-strip version of the invite, rendered at a fixed 1080px width for PNG export
export default function InviteImageCardFilm({
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
  const s = L.s;
  const nameSize = nameFontSize(guest.name, L.nameBase, FRAME_W - 90 * s);
  const stripH = L.height + 320;
  const label = (n: number) => <FrameLabel n={n} />;

  return (
    <div
      ref={ref}
      data-guest-theme={theme.key}
      className="font-sans relative overflow-hidden"
      style={{
        width: CARD_WIDTH,
        height: L.height,
        background:
          "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.4), rgba(255,255,255,0) 62%), linear-gradient(165deg, var(--sky-blue-deep), color-mix(in srgb, var(--sky-blue-deep) 55%, #000))",
      }}
    >
      {/* A second strip behind, for depth */}
      <div
        className="absolute"
        style={{
          left: (CARD_WIDTH - STRIP_W) / 2,
          top: -160,
          width: STRIP_W,
          height: stripH,
          background: FILM_BASE,
          opacity: 0.5,
          borderRadius: 8,
          transform: "rotate(5deg)",
        }}
      />

      <div
        className="absolute flex flex-col items-center justify-center"
        style={{
          left: (CARD_WIDTH - STRIP_W) / 2,
          top: -160,
          width: STRIP_W,
          height: stripH,
          background: FILM_BASE,
          borderRadius: 8,
          boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
          transform: "rotate(-3deg)",
        }}
      >
        <Edge side="left" length={stripH} />
        <Edge side="right" length={stripH} />

        <div className="flex flex-col items-center" style={{ gap: L.gap }}>
          {label(12)}
          <PhotoFrame height={L.photoH} s={s} />

          {label(13)}
          {/* Greeting + name (light frame) */}
          <Frame bg="#fff" minHeight={230 * s} className="flex flex-col items-center justify-center py-6 text-center">
            <p
              className="font-bold uppercase"
              style={{ fontSize: 26 * s, letterSpacing: "0.3em", color: "var(--light-text)" }}
            >
              {theme.copy.greeting}
            </p>
            <p
              className="font-heading font-extrabold"
              style={{
                fontSize: nameSize,
                lineHeight: 1.05,
                color: "var(--title-ink)",
                textWrap: "balance",
                padding: `0 ${30 * s}px`,
              }}
            >
              {guest.name}
            </p>
            <p
              className="font-semibold"
              style={{ fontSize: 28 * s, color: "var(--dark-text)", marginTop: 6 * s, padding: `0 ${40 * s}px`, textWrap: "balance" }}
            >
              {theme.copy.inviteBody}
            </p>
          </Frame>

          {label(14)}
          {/* When + where (blue frame, two equal halves) */}
          <Frame bg="var(--sky-blue-deep)" minHeight={240 * s} className="flex items-stretch">
            <div
              className="flex flex-1 flex-col items-center justify-center text-center"
              style={{ padding: `${24 * s}px ${20 * s}px`, color: "#fff" }}
            >
              <p className="font-mono font-bold uppercase" style={{ fontSize: 18 * s, letterSpacing: "0.2em", opacity: 0.8 }}>
                Giờ
              </p>
              <p className="font-heading font-extrabold leading-none whitespace-nowrap" style={{ fontSize: 124 * s }}>
                {EVENT.time}
              </p>
              <p className="font-bold whitespace-nowrap" style={{ fontSize: 26 * s, marginTop: 8 * s }}>
                {EVENT.weekday}, {EVENT.date}
              </p>
            </div>
            <div
              className="flex flex-1 flex-col items-center justify-center text-center"
              style={{
                margin: `${24 * s}px 0`,
                padding: `0 ${20 * s}px`,
                borderLeft: "4px dashed rgba(255,255,255,0.55)",
                color: "#fff",
              }}
            >
              <p className="font-mono font-bold uppercase" style={{ fontSize: 18 * s, letterSpacing: "0.2em", opacity: 0.8 }}>
                Địa điểm
              </p>
              <p className="font-extrabold leading-tight" style={{ fontSize: 40 * s }}>
                {EVENT.place}
              </p>
              <p className="leading-snug" style={{ fontSize: 24 * s, marginTop: 4 * s }}>
                {EVENT.org}
              </p>
            </div>
          </Frame>

          {label(15)}
          {/* QR (light frame, with room around the code) */}
          <Frame bg="#fff" minHeight={260 * s} className="flex items-center justify-center">
            <div className="flex items-center" style={{ gap: 40 * s, padding: `${44 * s}px ${48 * s}px` }}>
              <div className="shrink-0" style={{ border: "4px solid var(--dark-text)", padding: 10 * s, borderRadius: 12 }}>
                <QRCodeSVG value={url} size={Math.round(130 * s)} level="H" bgColor="#ffffff" fgColor="#1a1a1a" />
              </div>
              <p
                className="font-heading font-extrabold leading-snug"
                style={{ fontSize: 34 * s, color: "var(--dark-text)", textWrap: "balance" }}
              >
                Quét mã QR để xem bản đồ &amp; xác nhận tham dự
              </p>
            </div>
          </Frame>
        </div>
      </div>
    </div>
  );
}
