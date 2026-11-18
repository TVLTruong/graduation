"use client";

import { useEffect, useState } from "react";
import { Users, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import { adminApi } from "@/lib/api";
import type { Guest, GuestStats } from "@/lib/types";

const CARDS = [
  { key: "total", label: "Tổng số khách", icon: Users, card: "bg-blue-50 border-blue-100", iconColor: "text-blue-500" },
  { key: "attending", label: "Có tham dự", icon: CheckCircle2, card: "bg-green-50 border-green-100", iconColor: "text-green-500" },
  { key: "notAttending", label: "Không tham dự", icon: XCircle, card: "bg-red-50 border-red-100", iconColor: "text-red-500" },
  { key: "noResponse", label: "Chưa phản hồi", icon: HelpCircle, card: "bg-slate-50 border-slate-200", iconColor: "text-slate-500" },
] as const;

const GROUPS = [
  { title: "Có tham dự", icon: CheckCircle2, iconColor: "text-green-500", match: (g: Guest) => g.isAttending === true },
  { title: "Không tham dự", icon: XCircle, iconColor: "text-red-500", match: (g: Guest) => g.isAttending === false },
  { title: "Chưa phản hồi", icon: HelpCircle, iconColor: "text-slate-500", match: (g: Guest) => g.isAttending === null },
] as const;

export default function StatsTab({ stats, password }: { stats: GuestStats | null; password: string }) {
  const [guests, setGuests] = useState<Guest[] | null>(null);

  useEffect(() => {
    adminApi(password)
      .get<Guest[]>("/guests")
      .then((res) => setGuests(res.data))
      .catch(console.error);
  }, [password]);

  if (!stats) return <p>Đang tải...</p>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6">Thống kê Tham Dự</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CARDS.map(({ key, label, icon: Icon, card, iconColor }) => (
            <div key={key} className={`${card} p-6 rounded-2xl border flex flex-col items-center justify-center text-center`}>
              <Icon size={32} className={`${iconColor} mb-3`} />
              <p className="text-4xl font-bold text-slate-800">{stats[key]}</p>
              <p className="text-slate-600 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6">Chi tiết từng người</h2>

        {!guests ? (
          <p>Đang tải...</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {GROUPS.map(({ title, icon: Icon, iconColor, match }) => {
              const list = guests.filter(match);
              return (
                <div key={title}>
                  <h3 className="font-semibold text-slate-700 flex items-center gap-2 mb-3">
                    <Icon size={18} className={iconColor} />
                    {title} ({list.length})
                  </h3>
                  {list.length === 0 ? (
                    <p className="text-sm text-slate-400">Chưa có ai</p>
                  ) : (
                    <ul className="divide-y divide-slate-100 rounded-xl border border-slate-100">
                      {list.map((g) => (
                        <li key={g.shortId} className="flex items-center justify-between gap-2 px-3 py-2 text-sm">
                          <span className="font-medium text-slate-800">{g.name}</span>
                          <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded text-xs shrink-0">{g.type}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
