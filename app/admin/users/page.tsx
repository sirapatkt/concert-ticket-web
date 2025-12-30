"use client";
import { useState } from "react";
import { Search, MoreHorizontal, User, Shield, Ban, CheckCircle } from "lucide-react";

export default function UsersPage() {
  const [users, setUsers] = useState([
    { id: 1, name: "Somchai Jai-dee", email: "somchai@gmail.com", role: "Member", status: "Active", joined: "12 Jan 2024" },
    { id: 2, name: "Alice Wonderland", email: "alice@yahoo.com", role: "Member", status: "Banned", joined: "15 Feb 2024" },
    { id: 3, name: "Admin Nut", email: "nut@beatpass.com", role: "Admin", status: "Active", joined: "01 Jan 2024" },
  ]);

  const toggleStatus = (id: number) => {
    setUsers(prev => prev.map(u => 
      u.id === id ? { ...u, status: u.status === "Active" ? "Banned" : "Active" } : u
    ));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <User className="text-blue-500" /> จัดการผู้ใช้งาน (Users)
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
          <input type="text" placeholder="ค้นหาชื่อ, อีเมล..." className="bg-[#161B22] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-blue-500" />
        </div>
      </div>

      <div className="bg-[#161B22] border border-white/5 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-[#0B0F14] text-gray-200 uppercase text-xs font-bold">
            <tr>
              <th className="p-4">ชื่อ - นามสกุล</th>
              <th className="p-4">อีเมล</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4 text-right">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 font-medium text-white">{user.name}</td>
                <td className="p-4">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold ${user.status === 'Active' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                    {user.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <button onClick={() => toggleStatus(user.id)} className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors" title={user.status === "Active" ? "แบนผู้ใช้" : "ปลดแบน"}>
                    {user.status === "Active" ? <Ban size={18} className="text-red-400" /> : <CheckCircle size={18} className="text-green-400" />}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}