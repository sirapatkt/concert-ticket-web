// 📂 ไฟล์: app/organizer/page.tsx
"use client";

import Link from 'next/link';
import { 
  ArrowUpRight, 
} from 'lucide-react';

// --- 1. แก้ไขเรื่อง Type (แก้ any แดง) ---
interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend: string;
  subtext?: string; // ? แปลว่ามีหรือไม่มีก็ได้
  color: 'cyan' | 'purple' | 'pink'; // ล็อคค่าสีให้ถูกต้อง
}

// --- 2. ส่วนประกอบ StatCard ---
function StatCard({ title, value, unit, trend, subtext, color }: StatCardProps) {
  // กำหนด Type ให้ key ของ object นี้
  const colorStyles: Record<string, string> = {
    cyan: "border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]",
    purple: "border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
    pink: "border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
  };

  return (
    <div className={`bg-[#0F172A] p-6 rounded-2xl border ${colorStyles[color]} relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300`}>
      <h3 className="text-white text-lg font-medium mb-2">{title}</h3>
      <div className="flex items-baseline gap-2 mb-2">
        <span className="text-4xl font-bold text-white">{value}</span>
        <span className="text-lg text-white/60">{unit}</span>
      </div>
      <div className="flex flex-col">
        <div className={`flex items-center text-sm font-medium ${trend.includes('+') ? 'text-cyan-400' : 'text-white/60'}`}>
          {trend.includes('+') && <ArrowUpRight size={16} className="mr-1" />}
          {trend}
        </div>
        {subtext && <span className="text-xs text-slate-500 mt-1">{subtext}</span>}
      </div>
      <div className={`absolute -right-6 -bottom-6 w-24 h-24 rounded-full blur-3xl opacity-20 bg-current pointer-events-none ${
        color === 'cyan' ? 'bg-cyan-500' : color === 'purple' ? 'bg-purple-500' : 'bg-pink-500'
      }`}></div>
    </div>
  );
}

// --- 3. ส่วนประกอบ EventTable ---
function EventTable() {
  const events = [
    { id: 1, name: "2024 TREASURE RELAY TOUR", date: "23-26 พ.ค. 2567", status: "เสร็จสิ้น", progress: 100 },
    { id: 2, name: "BABYMONSTER FANMEET", date: "27-28 ธ.ค. 2568", status: "กำลังจะจัด", progress: 72 },
  ];

  return (
    <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden shadow-xl mt-8 flex flex-col h-full">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-2xl font-bold text-white">รายการอีเวนต์</h2>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-slate-300">
          <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4 pl-6 font-medium">Event name</th>
              <th className="p-4 font-medium">Date</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Progress</th>
              <th className="p-4 font-medium text-right pr-6"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {events.map((ev) => (
              <tr key={ev.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-4 pl-6 font-medium text-white">{ev.name}</td>
                <td className="p-4 text-slate-300">{ev.date}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded text-xs font-bold 
                    ${ev.status === 'เสร็จสิ้น' ? 'bg-green-500 text-black' : 'bg-yellow-400 text-black'}`}>
                    {ev.status}
                  </span>
                </td>
                <td className="p-4 font-bold text-white">{ev.progress}%</td>
                <td className="p-4 text-right pr-6">
                  <button className="text-xs border border-purple-500/50 text-purple-300 hover:bg-purple-500 hover:text-white px-3 py-1.5 rounded transition-all">
                    ดูรายละเอียด
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-6 border-t border-slate-800 flex justify-center bg-slate-900/30">
        <Link href="/organizer/create" className="px-6 py-2 rounded-lg bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all font-medium text-sm">
          สร้างอีเวนต์ใหม่
        </Link>
      </div>
    </div>
  );
}

// --- 4. หน้าจอหลัก (สะอาดแล้ว ไม่มี Sidebar ซ้อน) ---
export default function OrganizerDashboard() {
  return (
    // ❌ ไม่ต้องมี div className="flex" หรือ <Sidebar /> แล้ว เพราะ layout.tsx จัดการให้
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold text-white">แดชบอร์ดผู้จัดงาน</h1>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="ยอดขายรวม" value="25,000" unit="บาท" trend="↑ +15% (ใน 30 วันล่าสุด)" color="cyan" />
        <StatCard title="จำนวนบัตรที่ขายได้" value="180" unit="ใบ" trend="(90% of total)" subtext="" color="purple" />
        <StatCard title="งานที่กำลังเปิดขาย" value="2" unit="งาน" trend="" subtext="" color="pink" />
      </div>
      
      <EventTable />
    </div>
  );
}