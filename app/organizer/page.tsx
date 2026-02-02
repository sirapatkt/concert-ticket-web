// 📂 ไฟล์: app/organizer/page.tsx
"use client";

import Link from 'next/link';
import { 
  ArrowUpRight,
  User 
} from 'lucide-react';

// --- (ส่วนประกอบ StatCard) ---
interface StatCardProps { title: string; value: string | number; unit: string; trend: string; subtext?: string; color: 'cyan' | 'purple' | 'pink'; }
function StatCard({ title, value, unit, trend, subtext, color }: StatCardProps) {
  const colorStyles: Record<string, string> = {
    cyan: "border-cyan-500 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]",
    purple: "border-purple-500 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.2)]",
    pink: "border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)]"
  };
  return (
    <div className={`bg-[#0F172A] p-4 md:p-6 rounded-2xl border ${colorStyles[color]} relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between h-full min-h-[140px]`}>
      <div>
        <h3 className="text-white text-base md:text-lg font-medium mb-2">{title}</h3>
        <div className="flex items-baseline gap-2 mb-2 flex-wrap">
          <span className="text-3xl md:text-4xl font-bold text-white">{value}</span>
          <span className="text-sm md:text-lg text-white/60">{unit}</span>
        </div>
      </div>
      <div className="flex flex-col mt-auto z-10">
        <div className={`flex items-center text-xs md:text-sm font-medium ${trend.includes('+') ? 'text-cyan-400' : 'text-white/60'}`}>
          {trend.includes('+') && <ArrowUpRight size={16} className="mr-1" />}
          {trend}
        </div>
        {subtext && <span className="text-[10px] md:text-xs text-slate-500 mt-1">{subtext}</span>}
      </div>
      <div className={`absolute -right-6 -bottom-6 w-16 h-16 md:w-24 md:h-24 rounded-full blur-3xl opacity-20 bg-current pointer-events-none ${
        color === 'cyan' ? 'bg-cyan-500' : color === 'purple' ? 'bg-purple-500' : 'bg-pink-500'
      }`}></div>
    </div>
  );
}

// --- (ส่วนประกอบ EventTable) ---
function EventTable() {
  const events = [
    { id: 1, name: "2024 TREASURE RELAY TOUR", date: "23-26 พ.ค. 2567", status: "เสร็จสิ้น", progress: 100 },
    { id: 2, name: "BABYMONSTER FANMEET", date: "27-28 ธ.ค. 2568", status: "กำลังจะจัด", progress: 72 },
  ];
  return (
    <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden shadow-xl mt-6 md:mt-8 flex flex-col h-full">
      <div className="p-4 md:p-6 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-lg md:text-2xl font-bold text-white">รายการอีเวนต์</h2>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-slate-300 min-w-[600px]">
          <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-800 text-xs md:text-sm">
            <tr>
              <th className="p-3 md:p-4 pl-4 md:pl-6 font-medium">Event name</th>
              <th className="p-3 md:p-4 font-medium">Date</th>
              <th className="p-3 md:p-4 font-medium">Status</th>
              <th className="p-3 md:p-4 font-medium">Progress</th>
              <th className="p-3 md:p-4 font-medium text-right pr-4 md:pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm md:text-base">
            {events.map((ev) => (
              <tr key={ev.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-3 md:p-4 pl-4 md:pl-6 font-medium text-white max-w-[150px] md:max-w-xs truncate">{ev.name}</td>
                <td className="p-3 md:p-4 text-slate-300 whitespace-nowrap">{ev.date}</td>
                <td className="p-3 md:p-4">
                  <span className={`px-2 py-1 md:px-3 md:py-1 rounded text-[10px] md:text-xs font-bold whitespace-nowrap ${ev.status === 'เสร็จสิ้น' ? 'bg-green-500 text-black' : 'bg-yellow-400 text-black'}`}>{ev.status}</span>
                </td>
                <td className="p-3 md:p-4 font-bold text-white">{ev.progress}%</td>
                <td className="p-3 md:p-4 text-right pr-4 md:pr-6">
                  <Link href={`/organizer/event/${ev.id}`} className="inline-block text-xs border border-purple-500/50 text-purple-300 hover:bg-purple-500 hover:text-white px-2 py-1 md:px-3 md:py-1.5 rounded transition-all whitespace-nowrap">ดูรายละเอียด</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="p-4 md:p-6 border-t border-slate-800 flex justify-center bg-slate-900/30">
        <Link href="/organizer/create" className="px-6 py-2 rounded-lg bg-transparent border border-cyan-500 text-cyan-400 hover:bg-cyan-500 hover:text-black hover:shadow-[0_0_15px_rgba(34,211,238,0.5)] transition-all font-medium text-sm">+ สร้างอีเวนต์ใหม่</Link>
      </div>
    </div>
  );
}

// --- (Main Layout) ---
export default function OrganizerDashboard() {
  return (
    <div className="relative flex flex-col gap-6 md:gap-8 p-4 md:p-8 w-full max-w-[1920px] mx-auto">
      
      {/* ✅ แก้ไขเป็น -top-2 ตามที่รีเควสครับ */}
      <div className="absolute -top-2 right-4 md:-top-2 md:right-8 z-20 hidden sm:block">
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg border border-slate-700 bg-[#020617] text-slate-300 hover:bg-slate-800 hover:text-white transition-all text-sm font-medium shadow-lg">
             <User size={18} />
             <span>ผู้จัดงาน</span>
        </button>
      </div>

      <div className="flex flex-col gap-1 mt-4 sm:pr-32">
        <h1 className="text-2xl md:text-3xl font-bold text-white">แดชบอร์ดผู้จัดงาน</h1>
        <p className="text-slate-400 text-sm md:text-base mt-1">ยินดีต้อนรับกลับสู่ BEATPASS</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 pt-2">
        <StatCard title="ยอดขายรวม" value="25,000" unit="บาท" trend="↑ +15% (ใน 30 วันล่าสุด)" color="cyan" />
        <StatCard title="จำนวนบัตรที่ขายได้" value="180" unit="ใบ" trend="(90% of total)" subtext="" color="purple" />
        <StatCard title="งานที่กำลังเปิดขาย" value="2" unit="งาน" trend="" subtext="" color="pink" />
      </div>
      
      <EventTable />
    </div>
  );
}