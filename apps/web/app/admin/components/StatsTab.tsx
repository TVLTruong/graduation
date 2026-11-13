"use client";

import { Users, CheckCircle2, XCircle, HelpCircle } from "lucide-react";
import type { GuestStats } from "@/lib/types";

const CARDS = [
  { key: "total", label: "Tổng số khách", icon: Users, card: "bg-blue-50 border-blue-100", iconColor: "text-blue-500" },
  { key: "attending", label: "Có tham dự", icon: CheckCircle2, card: "bg-green-50 border-green-100", iconColor: "text-green-500" },
  { key: "notAttending", label: "Không tham dự", icon: XCircle, card: "bg-red-50 border-red-100", iconColor: "text-red-500" },
  { key: "noResponse", label: "Chưa phản hồi", icon: HelpCircle, card: "bg-slate-50 border-slate-200", iconColor: "text-slate-500" },
] as const;

export default function StatsTab({ stats }: { stats: GuestStats | null }) {
  if (!stats) return <p>Đang tải...</p>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
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
    </div>
  );
}
