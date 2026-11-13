"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import type { GuestStats } from "@/lib/types";
import { Users, LayoutList, BarChart, LogOut } from "lucide-react";
import GuestList from "./GuestList";
import WishesTab from "./WishesTab";
import StatsTab from "./StatsTab";

type Tab = "list" | "wishes" | "stats";

const TABS = [
  { id: "list", label: "Khách mời", icon: Users },
  { id: "wishes", label: "Lời chúc", icon: LayoutList },
  { id: "stats", label: "Thống kê", icon: BarChart },
] as const;

export default function AdminDashboard({ password, onLogout }: { password: string; onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState<Tab>("list");
  const [stats, setStats] = useState<GuestStats | null>(null);
  const [statsReloadKey, setStatsReloadKey] = useState(0);

  useEffect(() => {
    adminApi(password)
      .get<GuestStats>("/guests/stats")
      .then((res) => setStats(res.data))
      .catch(console.error);
  }, [password, statsReloadKey]);

  const selectTab = (tab: Tab) => {
    setActiveTab(tab);
    if (tab === "stats") setStatsReloadKey((key) => key + 1);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      <aside className="w-64 bg-white border-r border-slate-200 p-6 flex flex-col">
        <h2 className="text-xl font-bold mb-8 text-slate-800">Admin Panel</h2>
        <nav className="flex-1 space-y-2">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => selectTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                activeTab === id ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-600 hover:bg-slate-50"
              }`}
            >
              <Icon size={20} />
              {label}
            </button>
          ))}
        </nav>
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 transition-colors mt-auto"
        >
          <LogOut size={20} />
          Đăng xuất
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          {activeTab === "list" && <GuestList password={password} />}
          {activeTab === "wishes" && <WishesTab password={password} />}
          {activeTab === "stats" && <StatsTab stats={stats} />}
        </div>
      </main>
    </div>
  );
}
