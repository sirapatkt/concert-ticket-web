"use client";

import { Search, Filter, UserCheck, UserX, Mail } from 'lucide-react';

export default function CustomersPage() {
  const customers = [
    { id: 1, name: "สมชาย ใจดี", email: "somchai@email.com", ticket: "VIP Standing", event: "2024 TREASURE RELAY", checkIn: true },
    { id: 2, name: "Alice Smith", email: "alice.s@test.com", ticket: "Regular Seat A12", event: "BABYMONSTER FANMEET", checkIn: false },
    { id: 3, name: "กานดา มานะ", email: "kanda@work.com", ticket: "Regular Seat B05", event: "2024 TREASURE RELAY", checkIn: true },
    { id: 4, name: "John Doe", email: "john.doe@email.com", ticket: "VIP Standing", event: "2024 TREASURE RELAY", checkIn: false },
  ];

  return (
    <div className="space-y-8">
      {/* หัวข้อ + ช่องค้นหา */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">ผู้เข้าร่วมงาน (Attendees)</h1>
          <p className="text-slate-400">จัดการข้อมูลลูกค้าและการเช็คอินเข้างาน</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={20} />
            <input 
              type="text" 
              placeholder="ค้นหาชื่อ, อีเมล, รหัสบัตร..." 
              className="bg-[#0F172A] border border-slate-700 text-white pl-10 pr-4 py-2 rounded-lg focus:outline-none focus:border-blue-500 w-64"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#0F172A] border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800">
            <Filter size={18} /> กรอง
          </button>
        </div>
      </div>

      {/* ตารางรายชื่อ */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4 pl-6">ชื่อ-นามสกุล</th>
              <th className="p-4">ประเภทบัตร</th>
              <th className="p-4">งานอีเวนต์</th>
              <th className="p-4 text-center">สถานะเช็คอิน</th>
              <th className="p-4 pr-6 text-right">ติดต่อ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {customers.map((c) => (
              <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                <td className="p-4 pl-6">
                  <div className="flex flex-col">
                    <span className="text-white font-medium">{c.name}</span>
                    <span className="text-xs text-slate-500">{c.email}</span>
                  </div>
                </td>
                <td className="p-4">
                  <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-700">
                    {c.ticket}
                  </span>
                </td>
                <td className="p-4">{c.event}</td>
                <td className="p-4 text-center">
                  {c.checkIn ? (
                    <span className="inline-flex items-center gap-1 text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-xs font-bold">
                      <UserCheck size={14} /> เช็คอินแล้ว
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-slate-400 bg-slate-700/50 px-3 py-1 rounded-full text-xs font-bold">
                      <UserX size={14} /> ยังไม่มา
                    </span>
                  )}
                </td>
                <td className="p-4 pr-6 text-right">
                  <button className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-full transition-all">
                    <Mail size={18} />
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