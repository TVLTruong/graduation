"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Guest } from "@/lib/types";
import InviteContent from "../components/InviteContent";

export default function InviteAllPage() {
  const [name, setName] = useState("");
  const [submitted, setSubmitted] = useState(false);

  // Mock guest data once they enter their name
  const guest: Guest = {
    shortId: "all",
    name: name,
    title: "Bạn",
    type: "Tất cả",
    isAttending: null,
    wish: "",
  };

  return (
    <div data-guest-theme="everyone" className="min-h-screen sky-bg font-sans">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div 
            key="name-input"
            className="min-h-screen flex items-center justify-center p-6"
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="glass-card bg-white/95 rounded-[24px] p-8 max-w-sm w-full text-center">
              <h1 className="font-heading text-3xl font-bold text-[var(--sky-blue-deep)] mb-2">Chào bạn! 👋</h1>
              <p className="text-[var(--light-text)] mb-6">Cho mình biết bạn là ai nhé?</p>
              
              <form onSubmit={(e) => {
                e.preventDefault();
                if (name.trim()) setSubmitted(true);
              }}>
                <input
                  type="text"
                  maxLength={100}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Nhập tên của bạn..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-[var(--sky-blue-soft)] focus:outline-none focus:ring-2 focus:ring-[var(--sky-blue-deep)] mb-6 text-center text-lg"
                  autoFocus
                  required
                />
                <button
                  type="submit"
                  className="w-full bubbly-button py-3 text-lg"
                >
                  Mở Thiệp
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="invitation"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <InviteContent guest={guest} shared />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
