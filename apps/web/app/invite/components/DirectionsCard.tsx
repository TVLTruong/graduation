"use client";

import { useState } from "react";
import Image from "next/image";
import InviteCard, { InviteCardSubheading } from "./InviteCard";

const MAP_EMBED_URL =
  "https://maps.google.com/maps?q=Trường%20Đại%20học%20Công%20nghệ%20Thông%20tin%20ĐHQG%20HCM&t=&z=15&ie=UTF8&iwloc=&output=embed";
const MAP_LINK = "https://maps.app.goo.gl/M4rA6K7oVnJpSgJ9A";

const GATES = [
  {
    name: "Cổng 1 - Đường Hàn Thuyên (Recommend)",
    note: "Gần bãi đỗ xe và tòa A.",
    steps: [
      "Vào Cổng 1 (đường Hàn Thuyên), quẹo trái hướng về bãi xe sinh viên.",
      "Nhận vé từ chú bảo vệ (4k/lượt).",
      "Chạy thẳng vào bãi xe và đi theo hướng dẫn của chú bảo vệ tìm chỗ đậu phù hợp.",
      "Đi bộ qua tòa A ra sảnh trước tòa E, có thể theo dõi lễ ở thư viện (tòa A) hoặc xem trực tiếp ở tầng 3 tòa A.",
    ],
  },
  {
    name: "Cổng 2 - Xa lộ Hà Nội",
    note: "Gần tòa D, căn-tin và sân thể thao.",
    steps: [
      "Vào Cổng 2 (Xa Lộ Hà Nội).",
      "Rẽ phải chạy theo đường giữa tòa C và sân thể thao, đi thẳng tới gần cổng 1 rồi rẽ phải ở đi tới nhà xe.",
      "Nhận vé từ chú bảo vệ (4k/lượt).",
      "Chạy thẳng vào bãi xe và đi theo hướng dẫn của chú bảo vệ tìm chỗ đậu phù hợp.",
      "Đi bộ qua tòa A ra sảnh trước tòa E, có thể theo dõi lễ ở thư viện (tòa A) hoặc xem trực tiếp ở tầng 3 tòa A.",
    ],
  },
];

// Everything about getting there, in the order a guest needs it: arrive, park, walk
export default function DirectionsCard() {
  const [gateIdx, setGateIdx] = useState(0);
  const gate = GATES[gateIdx];

  return (
    <InviteCard icon="🧭" title="Đường đến UIT">
      <div className="rounded-[16px] overflow-hidden border-2 border-[var(--sky-blue-soft)]">
        <iframe
          src={MAP_EMBED_URL}
          title="Bản đồ đường đến UIT"
          width="100%"
          height="260"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <div className="text-center mt-4">
        <a
          href={MAP_LINK}
          target="_blank"
          rel="noreferrer"
          className="bubbly-button inline-flex items-center gap-2"
        >
          📍 Mở Google Maps
        </a>
      </div>

      <div className="border-t border-[var(--sky-blue-soft)] my-6" />

      <InviteCardSubheading icon="🛵">Gửi xe và di chuyển</InviteCardSubheading>
      <div role="tablist" aria-label="Chọn cổng" className="grid grid-cols-2 gap-2 mb-3">
        {GATES.map(({ name }, i) => (
          <button
            key={name}
            type="button"
            role="tab"
            id={`gate-tab-${i}`}
            aria-selected={i === gateIdx}
            aria-controls="gate-panel"
            onClick={() => setGateIdx(i)}
            className={`rounded-full py-2.5 font-bold transition-colors ${
              i === gateIdx
                ? "bg-[var(--grass-green-dark)] text-white shadow-md"
                : "bg-[var(--soft-box)] text-[var(--dark-text)] hover:bg-[var(--sky-blue-soft)]"
            }`}
          >
            {name}
          </button>
        ))}
      </div>
      <div id="gate-panel" role="tabpanel" aria-labelledby={`gate-tab-${gateIdx}`}>
        <p className="text-sm text-[var(--muted-text)] mb-4">{gate.note}</p>
        <ol className="space-y-4">
          {gate.steps.map((step, idx) => (
            <li key={step} className="flex gap-4 relative">
              <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[var(--soft-box)] text-[var(--sky-blue-deep)] flex items-center justify-center font-bold relative z-10 border border-[var(--sky-blue-soft)]">
                {idx + 1}
              </span>
              <span className="pt-1 text-[var(--dark-text)]">{step}</span>
              {idx < gate.steps.length - 1 && (
                <span className="absolute left-4 top-8 bottom-[-16px] w-[2px] bg-[var(--soft-box)]" aria-hidden />
              )}
            </li>
          ))}
        </ol>
      </div>

      <div className="border-t border-[var(--sky-blue-soft)] my-6" />

      <InviteCardSubheading icon="🏫">Sơ đồ khuôn viên</InviteCardSubheading>
      <div className="rounded-[16px] overflow-hidden bg-white border-2 border-[var(--sky-blue-soft)]">
        <Image
          src="/Designer.png"
          alt="Sơ đồ khuôn viên UIT"
          width={1254}
          height={1254}
          className="w-full h-auto"
        />
      </div>
    </InviteCard>
  );
}
