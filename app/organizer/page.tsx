"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowUpRight, Loader2 } from 'lucide-react';

// --- (ส่วนประกอบ StatCard) ---
interface StatCardProps { 
  title: string; 
  value: string | number; 
  unit: string; 
  trend: string; 
  subtext?: string; 
  color: 'cyan' | 'purple' | 'pink'; 
}

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

// --- (สร้าง Interface สำหรับข้อมูล Event) ---
interface EventData {
  id: number | string;
  name: string;
  date: string;
  salesStatus: string;
  revenue: number;
  totalRevenue: number;
  ticketsSold: number;
  totalTickets: number;
  progress: number;
}

// --- (ส่วนประกอบ EventTable) ---
function EventTable() {
  const [events, setEvents] = useState<EventData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // ⚠️ เปลี่ยน URL ให้เป็น API จริง
        const response = await fetch('/api/organizer/events'); 
        
        if (!response.ok) {
          throw new Error('ไม่สามารถดึงข้อมูลอีเวนต์ได้');
        }
        
        const data = await response.json();
        setEvents(data);
      } catch (err: unknown) {
        // จัดการ Error แบบ TypeScript Strict Mode (ไม่ใช้ any)
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden shadow-xl mt-6 md:mt-8 flex flex-col h-full">
      <div className="p-4 md:p-6 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-lg md:text-2xl font-bold text-white">รายการอีเวนต์</h2>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-slate-300 min-w-[700px]">
          <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-800 text-xs md:text-sm">
            <tr>
              <th className="p-3 md:p-4 pl-4 md:pl-6 font-medium">Event name</th>
              <th className="p-3 md:p-4 font-medium">Date</th>
              <th className="p-3 md:p-4 font-medium">Status</th>
              <th className="p-3 md:p-4 font-medium">Revenue</th>
              <th className="p-3 md:p-4 font-medium">Progress</th>
              <th className="p-3 md:p-4 font-medium text-right pr-4 md:pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm md:text-base">
            
            {isLoading && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <Loader2 className="w-6 h-6 animate-spin text-cyan-500" />
                    <span>กำลังโหลดข้อมูลอีเวนต์...</span>
                  </div>
                </td>
              </tr>
            )}

            {!isLoading && error && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-red-400">
                  <p>เกิดข้อผิดพลาด: {error}</p>
                </td>
              </tr>
            )}

            {!isLoading && !error && events.length === 0 && (
              <tr>
                <td colSpan={6} className="p-8 text-center text-slate-400">
                  ยังไม่มีรายการอีเวนต์ กรุณาสร้างอีเวนต์ใหม่
                </td>
              </tr>
            )}

            {!isLoading && !error && events.length > 0 && events.map((ev) => (
              <tr key={ev.id} className="hover:bg-slate-800/50 transition-colors">
                <td className="p-3 md:p-4 pl-4 md:pl-6 font-medium text-white max-w-[150px] md:max-w-xs truncate">{ev.name}</td>
                <td className="p-3 md:p-4 text-slate-300 whitespace-nowrap">{ev.date}</td>
                
                <td className="p-3 md:p-4">
                  <span className={`px-2 py-1 md:px-3 md:py-1 rounded text-[10px] md:text-xs font-medium whitespace-nowrap border ${
                    ev.salesStatus === 'เปิดขาย' 
                      ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                  }`}>
                    {ev.salesStatus}
                  </span>
                </td>

                <td className="p-3 md:p-4 whitespace-nowrap">
                  <span className="font-medium text-white">฿{ev.revenue?.toLocaleString() || 0}</span>
                  <span className="text-slate-400 text-xs ml-1">/ ฿{ev.totalRevenue?.toLocaleString() || 0}</span>
                </td>

                <td className="p-3 md:p-4">
                  <div className="flex flex-col gap-1 w-full max-w-[140px]">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-white">{ev.progress}%</span>
                      <span className="text-slate-400 text-[10px]">({ev.ticketsSold?.toLocaleString() || 0}/{ev.totalTickets?.toLocaleString() || 0})</span>
                    </div>
                    <div className="w-full bg-slate-800 rounded-full h-1.5 mt-0.5 overflow-hidden">
                      <div 
                        className={`h-1.5 rounded-full transition-all duration-500 ${ev.progress >= 100 ? 'bg-green-500' : 'bg-cyan-500'}`}
                        style={{ width: `${ev.progress}%` }}
                      ></div>
                    </div>
                  </div>
                </td>

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