"use client";

import { useState, useEffect } from "react";
import { adminApi } from "@/lib/api";
import { GUEST_TYPES, type Guest } from "@/lib/types";
import { Copy, Eye, Image as ImageIcon, Download, Plus, Trash2 } from "lucide-react";
import * as XLSX from "xlsx";
import InviteImageDialog from "./InviteImageDialog";

export default function GuestList({ password }: { password: string }) {
  const [guests, setGuests] = useState<Guest[]>([]);
  const [loading, setLoading] = useState(true);
  const [imageGuest, setImageGuest] = useState<Guest | null>(null);

  // New manual entry
  const [newName, setNewName] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newType, setNewType] = useState<string>("Bạn bè");

  const [reloadKey, setReloadKey] = useState(0);
  const reloadGuests = () => setReloadKey((key) => key + 1);

  useEffect(() => {
    adminApi(password)
      .get<Guest[]>("/guests")
      .then((res) => setGuests(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [password, reloadKey]);

  const handleManualCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminApi(password).post("/guests", {
        name: newName,
        title: newTitle,
        type: newType,
      });
      setNewName("");
      setNewTitle("");
      reloadGuests();
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json<Record<string, string>>(ws);

      const formattedData = data.map((row) => ({
        name: row["Họ Tên"] || row.name,
        title: row["Danh xưng"] || row.title,
        type: row["Loại thiệp"] || row.type || "Bạn bè",
      }));

      try {
        await adminApi(password).post("/guests/bulk", formattedData);
        alert("Import thành công!");
        reloadGuests();
      } catch (error) {
        console.error(error);
        alert("Lỗi khi import file.");
      }
    };
    reader.readAsBinaryString(file);
  };

  const copyLink = (shortId: string) => {
    const link = `${window.location.origin}/invite/${shortId}`;
    navigator.clipboard.writeText(link);
    alert("Đã copy link!");
  };

  const viewLink = (shortId: string) => {
    window.open(`/invite/${shortId}`, "_blank");
  };

  const handleDelete = async (shortId: string, name: string) => {
    if (!window.confirm(`Bạn có chắc chắn muốn xóa khách mời "${name}" không?`)) {
      return;
    }
    try {
      await adminApi(password).delete(`/guests/${shortId}`);
      reloadGuests();
    } catch (error) {
      console.error(error);
      alert("Lỗi khi xóa khách mời.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <h2 className="text-xl font-bold">Danh sách khách mời</h2>
        <div>
          <input
            type="file"
            accept=".xlsx, .xls, .csv"
            id="file-upload"
            className="hidden"
            onChange={handleFileUpload}
          />
          <label
            htmlFor="file-upload"
            className="cursor-pointer bg-green-600 text-white px-4 py-2 rounded-xl flex items-center gap-2 hover:bg-green-700 transition"
          >
            <Download size={18} />
            Import Excel/CSV
          </label>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <form onSubmit={handleManualCreate} className="flex gap-4 mb-6">
          <input
            type="text"
            placeholder="Họ Tên"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="border p-2 rounded-xl flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Danh xưng (VD: Bạn)"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border p-2 rounded-xl flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
          <select
            value={newType}
            onChange={(e) => setNewType(e.target.value)}
            className="border p-2 rounded-xl flex-1 focus:ring-2 focus:ring-blue-500 outline-none"
          >
            {GUEST_TYPES.map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
          <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-xl flex items-center gap-2 hover:bg-blue-700 transition">
            <Plus size={18} /> Thêm
          </button>
        </form>

        {loading ? (
          <p>Đang tải...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-slate-100 text-slate-500 text-sm">
                  <th className="py-3 px-4">Tên</th>
                  <th className="py-3 px-4">Danh xưng</th>
                  <th className="py-3 px-4">Loại</th>
                  <th className="py-3 px-4">Phản hồi</th>
                  <th className="py-3 px-4 text-right">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {guests.map((g) => (
                  <tr key={g.id} className="border-b border-slate-50 hover:bg-slate-50 transition">
                    <td className="py-3 px-4 font-medium">{g.name}</td>
                    <td className="py-3 px-4">{g.title}</td>
                    <td className="py-3 px-4">
                      <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs">
                        {g.type}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {g.isAttending === true ? (
                        <span className="bg-green-50 text-green-700 px-2 py-1 rounded text-xs font-medium">Có tham dự</span>
                      ) : g.isAttending === false ? (
                        <span className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-medium">Không tham dự</span>
                      ) : (
                        <span className="bg-slate-50 text-slate-500 px-2 py-1 rounded text-xs">Chưa phản hồi</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right space-x-2">
                      <button onClick={() => viewLink(g.shortId)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition" title="Xem">
                        <Eye size={18} />
                      </button>
                      <button onClick={() => copyLink(g.shortId)} className="p-2 text-slate-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition" title="Copy Link">
                        <Copy size={18} />
                      </button>
                      <button onClick={() => setImageGuest(g)} className="p-2 text-slate-500 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition" title="Tạo ảnh thiệp">
                        <ImageIcon size={18} />
                      </button>
                      <button onClick={() => handleDelete(g.shortId, g.name)} className="p-2 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition" title="Xóa">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {imageGuest && <InviteImageDialog guest={imageGuest} onClose={() => setImageGuest(null)} />}
    </div>
  );
}
