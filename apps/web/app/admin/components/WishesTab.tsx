"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import type { Guest } from "@/lib/types";
import { Quote } from "lucide-react";

export default function WishesTab({ password }: { password: string }) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGuests = async () => {
      try {
        const res = await adminApi(password).get<Guest[]>("/guests");
        setGuests(res.data.filter((g) => g.wish?.trim()));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchGuests();
  }, [password]);

  if (loading) return <p>Đang tải...</p>;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold mb-6">Lời chúc từ khách mời</h2>
        
        {guests.length === 0 ? (
          <p className="text-slate-500 text-center py-8">Chưa có lời chúc nào.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {guests.map((g) => (
              <div key={g.id} className="bg-slate-50 p-6 rounded-2xl border border-slate-100 relative">
                <Quote size={32} className="text-blue-100 absolute top-4 right-4" />
                <p className="text-slate-700 italic relative z-10 mb-4 whitespace-pre-wrap leading-relaxed">
                  &quot;{g.wish}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                    {g.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-slate-800">{g.name}</p>
                    <p className="text-sm text-slate-500">{g.title}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
