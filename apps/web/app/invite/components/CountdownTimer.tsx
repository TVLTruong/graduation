"use client";

import { Fragment, useState, useEffect } from "react";

import { EVENT } from "../event";

export const EVENT_DATE = new Date(EVENT.startsAt).getTime();

const SECOND = 1000;
const MINUTE = 60 * SECOND;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function getTimeLeft() {
  const distance = EVENT_DATE - Date.now();
  if (distance <= 0) return "ended" as const;
  return [
    { label: "Ngày", value: Math.floor(distance / DAY) },
    { label: "Giờ", value: Math.floor((distance % DAY) / HOUR) },
    { label: "Phút", value: Math.floor((distance % HOUR) / MINUTE) },
    { label: "Giây", value: Math.floor((distance % MINUTE) / SECOND) },
  ];
}

export default function CountdownTimer({ title }: { title: string }) {
  // null until mounted, so server and client render the same markup
  const [timeLeft, setTimeLeft] = useState<ReturnType<typeof getTimeLeft> | null>(null);

  useEffect(() => {
    const tick = () => {
      const next = getTimeLeft();
      setTimeLeft(next);
      if (next === "ended") clearInterval(interval);
    };
    const interval = setInterval(tick, SECOND);
    tick();
    return () => clearInterval(interval);
  }, []);

  // Nothing to count down to once the ceremony has started
  if (!timeLeft || timeLeft === "ended") return null;

  return (
    <div className="text-center">
      <p className="text-sm font-semibold text-[var(--light-text)] mb-3">{title}</p>
      <div className="flex justify-center items-start gap-2 sm:gap-3">
        {timeLeft.map(({ label, value }, i) => (
          <Fragment key={label}>
            {i > 0 && <span className="font-heading text-2xl font-bold text-[var(--sky-blue-light)] pt-2">:</span>}
            <div className="flex flex-col items-center min-w-[56px] rounded-2xl bg-[var(--soft-box)] py-2">
              <span className="font-heading text-3xl font-bold text-[var(--grass-green)] tabular-nums">
                {String(value).padStart(2, "0")}
              </span>
              <span className="text-xs text-[var(--light-text)]">{label}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
