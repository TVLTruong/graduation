"use client";

import { getInviteTheme } from "../themes";

// Fixed positions (% of each side gap) so the layout is stable between renders
const LEFT: { top: number; x: number; size: number; rot: number }[] = [
  { top: 12, x: 40, size: 64, rot: -14 },
  { top: 38, x: 15, size: 44, rot: 10 },
  { top: 64, x: 50, size: 56, rot: -8 },
  { top: 86, x: 20, size: 40, rot: 16 },
];
const RIGHT: typeof LEFT = [
  { top: 22, x: 45, size: 52, rot: 12 },
  { top: 48, x: 15, size: 64, rot: -10 },
  { top: 72, x: 50, size: 44, rot: 14 },
  { top: 92, x: 25, size: 40, rot: -12 },
];
const CONFETTI: { top: number; x: number; rot: number }[] = [
  { top: 5, x: 20, rot: 25 },
  { top: 26, x: 60, rot: -30 },
  { top: 52, x: 70, rot: 40 },
  { top: 78, x: 15, rot: -20 },
  { top: 95, x: 65, rot: 35 },
];

// Faint graduation motifs (cap, confetti) in the empty space beside the cards on wide screens
export default function SideDecor({ type }: { type: string }) {
  const { floatingEmojis, confettiColors } = getInviteTheme(type);
  const cap = "🎓";
  const icons = [cap, ...floatingEmojis.filter((e) => e !== cap)];

  const side = (items: typeof LEFT, align: "left" | "right", offset: number) => (
    <div
      className="absolute inset-y-0 w-[calc((100vw-48rem)/2)]"
      style={{ [align]: 0 }}
    >
      {items.map((item, i) => (
        <span
          key={`e${i}`}
          className="absolute select-none"
          style={{
            top: `${item.top}%`,
            [align]: `${item.x}%`,
            fontSize: item.size,
            transform: `rotate(${item.rot}deg)`,
          }}
        >
          {i === 0 ? cap : icons[(i + offset) % icons.length]}
        </span>
      ))}
      {CONFETTI.map((c, i) => (
        <span
          key={`c${i}`}
          className="absolute rounded-[2px]"
          style={{
            top: `${c.top}%`,
            [align]: `${c.x}%`,
            width: 10,
            height: 20,
            transform: `rotate(${c.rot}deg)`,
            background: confettiColors[(i + offset) % confettiColors.length],
          }}
        />
      ))}
    </div>
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 hidden overflow-hidden opacity-30 lg:block" aria-hidden>
      {side(LEFT, "left", 0)}
      {side(RIGHT, "right", 2)}
    </div>
  );
}
