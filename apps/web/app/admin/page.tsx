"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import AdminDashboard from "./components/AdminDashboard";

const STORAGE_KEY = "adminPassword";

async function verifyPassword(password: string) {
  try {
    const res = await adminApi(password).post("/auth/login", { password });
    return Boolean(res.data.success);
  } catch (error) {
    console.error("Login failed", error);
    return false;
  }
}

export default function AdminPage() {
  const [password, setPassword] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);

  const applyAuthResult = (pwd: string, ok: boolean) => {
    setIsAuthenticated(ok);
    if (ok) localStorage.setItem(STORAGE_KEY, pwd);
    else localStorage.removeItem(STORAGE_KEY);
  };

  // Restore a saved session
  useEffect(() => {
    const savedPassword = localStorage.getItem(STORAGE_KEY);
    if (!savedPassword) return;
    verifyPassword(savedPassword).then((ok) => {
      if (ok) setPassword(savedPassword);
      applyAuthResult(savedPassword, ok);
    });
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    applyAuthResult(password, await verifyPassword(password));
    setLoading(false);
  };

  if (isAuthenticated) {
    return <AdminDashboard password={password} onLogout={() => applyAuthResult(password, false)} />;
  }

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl p-8 max-w-sm w-full shadow-2xl">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
