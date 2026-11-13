"use client";

import { useEffect, useRef, useState } from "react";
import * as htmlToImage from "html-to-image";
import { Download, X } from "lucide-react";
import type { Guest } from "@/lib/types";
import InviteImageCard, { CARD_RATIOS, CARD_WIDTH, getCardHeight, type CardRatio } from "./InviteImageCard";
import InviteImageCardFilm from "./InviteImageCardFilm";

type Design = "film" | "magazine";
const DESIGNS: { value: Design; label: string }[] = [
  { value: "film", label: "Cuộn phim" },
  { value: "magazine", label: "Tạp chí" },
];

const PREVIEW_MAX = { w: 420, h: 540 };

// Wait for web fonts and every <img> so the PNG doesn't capture a half-rendered card
async function waitForAssets(node: HTMLElement) {
  await document.fonts.ready;
  await Promise.all(
    Array.from(node.querySelectorAll("img")).map((img) =>
      img.complete
        ? undefined
        : new Promise<void>((resolve) => {
            img.addEventListener("load", () => resolve(), { once: true });
            img.addEventListener("error", () => resolve(), { once: true });
          }),
    ),
  );
}

export default function InviteImageDialog({ guest, onClose }: { guest: Guest; onClose: () => void }) {
  const [ratio, setRatio] = useState<CardRatio>("4:5");
  const [design, setDesign] = useState<Design>("film");
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const height = getCardHeight(ratio);
  const scale = Math.min(PREVIEW_MAX.w / CARD_WIDTH, PREVIEW_MAX.h / height);
  const url = `${window.location.origin}/invite/${guest.shortId}`;

  const download = async () => {
    const node = cardRef.current;
    if (!node) return;
    setExporting(true);
    setError("");
    try {
      await waitForAssets(node);
      // Capture at natural size: the preview's scale transform is overridden on the clone
      const dataUrl = await htmlToImage.toPng(node, {
        width: CARD_WIDTH,
        height,
        pixelRatio: 1,
        cacheBust: true,
        style: { transform: "none", transformOrigin: "top left" },
      });
      const safeName = guest.name.replace(/[\\/:*?"<>|]+/g, "").trim() || guest.shortId;
      const link = document.createElement("a");
      link.download = `Thiep_Moi_${safeName}_${design}_${ratio.replace(":", "x")}.png`;
      link.href = dataUrl;
      link.click();
    } catch (e) {
      console.error(e);
      setError("Không tạo được ảnh, vui lòng thử lại.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-label="Tạo ảnh thiệp"
      onClick={onClose}
    >
      <div
        className="flex max-h-full flex-col gap-4 overflow-y-auto rounded-2xl bg-white p-5 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-6">
          <div>
            <h3 className="text-lg font-bold">Ảnh thiệp cho {guest.name}</h3>
            <p className="text-sm text-slate-500">Chọn tỷ lệ rồi tải ảnh PNG ({CARD_WIDTH}px)</p>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-500 hover:bg-slate-100" title="Đóng">
            <X size={20} />
          </button>
        </div>

        <div className="flex gap-2">
          {DESIGNS.map((d) => (
            <button
              key={d.value}
              onClick={() => setDesign(d.value)}
              className={`flex-1 rounded-xl border-2 px-3 py-1.5 text-sm transition ${
                design === d.value
                  ? "border-purple-600 bg-purple-50 font-semibold text-purple-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {d.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          {CARD_RATIOS.map((r) => (
            <button
              key={r.value}
              onClick={() => setRatio(r.value)}
              className={`flex-1 rounded-xl border-2 px-3 py-2 text-sm transition ${
                ratio === r.value
                  ? "border-blue-600 bg-blue-50 font-semibold text-blue-700"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              {r.label}
              <span className="block text-xs font-normal text-slate-500">{r.hint}</span>
            </button>
          ))}
        </div>

        <div className="mx-auto overflow-hidden rounded-xl border border-slate-200" style={{ width: CARD_WIDTH * scale, height: height * scale }}>
          <div style={{ width: CARD_WIDTH, height, transform: `scale(${scale})`, transformOrigin: "top left" }}>
            {design === "film" ? (
              <InviteImageCardFilm ref={cardRef} guest={guest} url={url} ratio={ratio} />
            ) : (
              <InviteImageCard ref={cardRef} guest={guest} url={url} ratio={ratio} />
            )}
          </div>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          onClick={download}
          disabled={exporting}
          className="flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:opacity-60"
        >
          <Download size={18} />
          {exporting ? "Đang tạo ảnh..." : "Tải ảnh PNG"}
        </button>
      </div>
    </div>
  );
}
