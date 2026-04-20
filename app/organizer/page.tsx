"use client";

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { ArrowUpRight, Loader2, Trophy, CheckCircle2, Calendar } from 'lucide-react';

// --- 🌟 1. Custom Hook สำหรับแอนิเมชันตัวเลขวิ่ง ---
function useCountUp(endValue: number | undefined, duration: number = 2000) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!endValue) {
      return;
    }
    
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 5);
      setCount(Math.floor(easeOut * endValue));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    window.requestAnimationFrame(step);
  }, [endValue, duration]);

  return count;
}

// --- 🌟 2. Interfaces ---
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

interface DashboardSummary {
  overview: {
    totalRevenue: number;
    revenueTrend: string;
    totalTicketsSold: number;
    totalTickets: number;
    statusActive: number;
    statusPending: number;
    statusClosed: number;
  };
  topEvent: EventData | null;
  latestApproval: {
    id: string | number;
    name: string;
    isToday: boolean;
  } | null;
  events: EventData[];
}

interface StatCardProps {
  title: string;
  value: string | number;
  unit: string;
  trend?: string;
  subtext?: string;
  color: 'cyan' | 'purple' | 'pink';
  isLoading?: boolean;
}

interface EventStatusCardProps {
  active?: number;
  pending?: number;
  closed?: number;
  isLoading?: boolean;
}

// --- 🌟 3. Component ต่างๆ ---

function StatCard({ title, value, unit, trend, subtext, color, isLoading }: StatCardProps) {
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
          {isLoading ? (
             <Loader2 className="w-6 h-6 animate-spin text-white/50" />
          ) : (
            <>
              <span className="text-3xl md:text-4xl font-bold text-white">{value}</span>
              <span className="text-sm md:text-lg text-white/60">{unit}</span>
            </>
          )}
        </div>
      </div>
      <div className="flex flex-col mt-auto z-10">
        <div className={`flex items-center text-xs md:text-sm font-medium ${trend?.includes('+') ? 'text-cyan-400' : 'text-white/60'}`}>
          {trend?.includes('+') && <ArrowUpRight size={16} className="mr-1" />}
          {trend || '-'} 
        </div>
        {subtext && <span className="text-[10px] md:text-xs text-slate-500 mt-1">{subtext}</span>}
      </div>
      <div className={`absolute -right-6 -bottom-6 w-16 h-16 md:w-24 md:h-24 rounded-full blur-3xl opacity-20 pointer-events-none ${
        color === 'cyan' ? 'bg-cyan-500' : color === 'purple' ? 'bg-purple-500' : 'bg-pink-500'
      }`}></div>
    </div>
  );
}

function EventStatusCard({ active = 0, pending = 0, closed = 0, isLoading }: EventStatusCardProps) {
  return (
    <div className="bg-[#0F172A] p-4 md:p-6 rounded-2xl border border-pink-500 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.2)] relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 flex flex-col justify-between h-full min-h-[140px]">
      <div>
        <h3 className="text-white text-base md:text-lg font-medium mb-4">สรุปสถานะอีเวนต์</h3>
        {isLoading ? (
           <div className="flex justify-center py-2"><Loader2 className="w-6 h-6 animate-spin text-pink-400/50" /></div>
        ) : (
          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col items-center p-2 bg-slate-900/50 rounded-lg border border-slate-700">
              <span className="text-2xl font-bold text-green-400">{active}</span>
              <span className="text-xs text-slate-400 mt-1">เปิดขาย</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-slate-900/50 rounded-lg border border-slate-700">
              <span className="text-2xl font-bold text-yellow-400">{pending}</span>
              <span className="text-xs text-slate-400 mt-1">รอขาย</span>
            </div>
            <div className="flex flex-col items-center p-2 bg-slate-900/50 rounded-lg border border-slate-700">
              <span className="text-2xl font-bold text-slate-300">{closed}</span>
              <span className="text-xs text-slate-400 mt-1">ปิดการขาย</span>
            </div>
          </div>
        )}
      </div>
      <div className="absolute -right-6 -bottom-6 w-16 h-16 md:w-24 md:h-24 rounded-full blur-3xl opacity-20 bg-pink-500 pointer-events-none"></div>
    </div>
  );
}

function EventTable({ events, isLoading, error }: { events: EventData[], isLoading: boolean, error: string | null }) {
  return (
    <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden shadow-xl flex flex-col h-full">
      <div className="p-4 md:p-6 border-b border-slate-800 flex justify-between items-center">
        <h2 className="text-lg md:text-2xl font-bold text-white">รายการอีเวนต์ทั้งหมด</h2>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-left text-slate-300 min-w-[700px]">
          <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-800 text-xs md:text-sm">
            <tr>
              <th className="p-3 md:p-4 pl-4 md:pl-6 font-medium">Event name</th>
              <th className="p-3 md:p-4 font-medium">Date</th>
              <th className="p-3 md:p-4 font-medium">Status</th>
              <th className="p-3 md:p-4 font-medium">Revenue</th>
              <th className="p-3 md:p-4 font-medium">Tickets & Progress</th>
              <th className="p-3 md:p-4 font-medium text-right pr-4 md:pr-6">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-sm md:text-base">
            {isLoading && (
              <tr><td colSpan={6} className="p-8 text-center text-slate-400"><Loader2 className="w-6 h-6 animate-spin mx-auto mb-2" /> กำลังโหลด...</td></tr>
            )}
            {!isLoading && error && (
              <tr><td colSpan={6} className="p-8 text-center text-red-400">เกิดข้อผิดพลาด: {error}</td></tr>
            )}
            {!isLoading && !error && (!events || events.length === 0) && (
              <tr><td colSpan={6} className="p-8 text-center text-slate-400">ไม่พบรายการอีเวนต์ในช่วงเวลานี้</td></tr>
            )}
            {!isLoading && !error && events?.length > 0 && events.map((ev) => {
              const ticketsRemaining = ev.totalTickets - ev.ticketsSold;
              return (
                <tr key={ev.id} className="hover:bg-slate-800/50 transition-colors">
                  <td className="p-3 md:p-4 pl-4 md:pl-6 font-medium text-white max-w-[150px] md:max-w-xs truncate">{ev.name}</td>
                  <td className="p-3 md:p-4 text-slate-300 whitespace-nowrap">{ev.date}</td>
                  <td className="p-3 md:p-4">
                    <span className={`px-2 py-1 md:px-3 md:py-1 rounded text-[10px] md:text-xs font-medium whitespace-nowrap border ${
                      ev.salesStatus === 'เปิดขาย' ? 'bg-green-500/10 text-green-400 border-green-500/20' 
                      : ev.salesStatus === 'รอขาย' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                      : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}>{ev.salesStatus}</span>
                  </td>
                  <td className="p-3 md:p-4 whitespace-nowrap"><span className="font-medium text-white">฿{ev.revenue?.toLocaleString() || 0}</span></td>
                  <td className="p-3 md:p-4">
                    <div className="flex flex-col gap-1 w-full max-w-[180px]">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-bold text-white">{ev.progress}%</span>
                        <span className="text-slate-400 text-[11px]">ขายได้ <span className="text-cyan-400">{ev.ticketsSold}</span> / เหลือ <span className="text-pink-400">{ticketsRemaining}</span></span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-1.5 mt-0.5 overflow-hidden">
                        <div className={`h-1.5 rounded-full transition-all duration-500 ${ev.progress >= 100 ? 'bg-green-500' : 'bg-cyan-500'}`} style={{ width: `${ev.progress}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-3 md:p-4 text-right pr-4 md:pr-6">
                    <Link href={`/organizer/event/${ev.id}`} className="inline-block text-xs border border-purple-500/50 text-purple-300 hover:bg-purple-500 hover:text-white px-2 py-1 md:px-3 md:py-1.5 rounded transition-all whitespace-nowrap">จัดการ</Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- 🌟 4. Main Layout ---
export default function OrganizerDashboard() {
  const [dateFilter, setDateFilter] = useState('30days');
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem('token'); 

        const response = await fetch(`http://127.0.0.1:8000/api/organizer/dashboard?range=${dateFilter}`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}` 
          }
        }); 
        if (!response.ok) throw new Error('ไม่สามารถดึงข้อมูลแดชบอร์ดได้');
        const result = await response.json();
        setData(result);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError('เกิดข้อผิดพลาดในการโหลดข้อมูล');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [dateFilter]);

  const animatedRevenue = useCountUp(data?.overview?.totalRevenue, 1500);
  const topEventRevenue = useCountUp(data?.topEvent?.revenue, 1500);
  const topEventProgress = useCountUp(data?.topEvent?.progress, 1500);
  
  const [progressWidth, setProgressWidth] = useState(0);
  useEffect(() => {
    const currentProgress = data?.topEvent?.progress;
    if (currentProgress) {
      const timer = setTimeout(() => setProgressWidth(currentProgress), 100);
      return () => clearTimeout(timer);
    } else {
      setProgressWidth(0);
    }
  }, [data?.topEvent?.progress]);

  return (
    <div className="relative flex flex-col gap-6 md:gap-8 p-4 md:p-8 w-full max-w-[1920px] mx-auto min-h-screen bg-[#020617]">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes customShimmer { 0% { transform: translateX(-150%) skewX(-15deg); } 100% { transform: translateX(300%) skewX(-15deg); } }
        @keyframes gradient-x { 0%, 100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        .animate-gradient-text { background-size: 200% auto; animation: gradient-x 3s linear infinite; }
        
        /* 🌟 คลาสใหม่สำหรับแสงวิ่งเฉพาะตอน Hover */
        .shimmer-hover-only { opacity: 0; transition: opacity 0.3s ease-in-out; }
        .group:hover .shimmer-hover-only { opacity: 1; animation: customShimmer 2s infinite linear; }
      `}} />

      {/* Header & Date Range Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mt-4 mb-8">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl md:text-3xl font-bold text-white">แดชบอร์ดผู้จัดงาน</h1>
          <p className="text-slate-400 text-sm md:text-base mt-1">ยินดีต้อนรับกลับสู่ BEATPASS</p>
        </div>

        <div className="flex items-center gap-2 bg-[#0F172A] border border-slate-700/80 rounded-xl px-4 py-2 shadow-sm hover:border-cyan-500/50 transition-colors group cursor-pointer relative z-10 h-[40px]">
          <Calendar size={16} className="text-cyan-400 group-hover:text-cyan-300 transition-colors" />
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-transparent text-sm font-medium text-slate-200 focus:outline-none cursor-pointer appearance-none pr-6 w-full relative z-10"
            style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
          >
            <option value="today" className="bg-slate-800 text-white">วันนี้</option>
            <option value="7days" className="bg-slate-800 text-white">7 วันล่าสุด</option>
            <option value="30days" className="bg-slate-800 text-white">30 วันล่าสุด</option>
            <option value="this_month" className="bg-slate-800 text-white">เดือนนี้</option>
            <option value="all" className="bg-slate-800 text-white">ทั้งหมด</option>
          </select>
          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-500 group-hover:text-cyan-400 transition-colors z-0">
            <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
      </div>
      
      {/* Top Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        <StatCard title="ยอดขายรวมทั้งหมด" value={animatedRevenue.toLocaleString()} unit="บาท" trend={data?.overview?.revenueTrend || ''} color="cyan" isLoading={isLoading} />
        <StatCard title="จำนวนบัตรที่ขายได้รวม" value={data?.overview?.totalTicketsSold?.toLocaleString() || '0'} unit="ใบ" subtext={`(จากทั้งหมด ${data?.overview?.totalTickets?.toLocaleString() || '0'} ใบ)`} color="purple" isLoading={isLoading} />
        <EventStatusCard active={data?.overview?.statusActive} pending={data?.overview?.statusPending} closed={data?.overview?.statusClosed} isLoading={isLoading} />
      </div>

      {/* Middle Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
        
        {/* Top Performing Event */}
        <div className="lg:col-span-2 bg-[#0F172A] rounded-2xl border border-slate-800 p-4 md:p-6 shadow-lg flex flex-col justify-center group hover:shadow-[0_0_20px_rgba(250,204,21,0.15)] hover:border-yellow-500/30 transition-all duration-500 z-0">
          <div className="flex items-center gap-2 mb-4">
            <div><Trophy className="text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)] transition-all" size={24} /></div>
            <h3 className="text-white font-bold text-lg">อีเวนต์ที่ทำยอดขายดีที่สุด (Top Performing)</h3>
          </div>
          
          {isLoading ? (
             <div className="flex justify-center py-6"><Loader2 className="w-8 h-8 animate-spin text-cyan-500" /></div>
          ) : data?.topEvent ? (
            <div className="bg-[#151f32] rounded-xl p-4 md:p-5 border border-slate-700/50 flex flex-col md:flex-row md:items-center justify-between gap-5 group-hover:bg-[#1a263d] transition-colors duration-500 shadow-inner">
              <div className="flex-shrink-0">
                <p className="text-cyan-400 font-bold text-sm md:text-base mb-1">{data.topEvent.name}</p>
                <p className="text-slate-400 text-xs flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>ขายบัตรไปแล้ว {data.topEvent.ticketsSold} / {data.topEvent.totalTickets} ใบ</p>
              </div>
              <div className="flex-1 w-full max-w-md">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-300">ความคืบหน้า</span>
                  <span className="text-green-400 font-bold text-sm">{topEventProgress}%</span>
                </div>
                <div className="w-full bg-slate-800/80 rounded-full h-2.5 relative overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-500 via-emerald-400 to-green-400 h-2.5 rounded-full absolute top-0 left-0 transition-all duration-1500" style={{ width: `${progressWidth}%` }}></div>
                  <div className="absolute top-0 left-0 h-full w-[40%] bg-gradient-to-r from-transparent via-white/40 to-transparent shimmer-hover-only"></div>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-black text-2xl md:text-3xl bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-500 to-orange-400 animate-gradient-text drop-shadow-sm">฿{topEventRevenue.toLocaleString()}</p>
                <p className="text-slate-400 text-[10px] md:text-xs mt-0.5">ยอดเงินรวม</p>
              </div>
            </div>
          ) : <div className="text-center py-6 text-slate-500 text-sm">ยังไม่มีข้อมูลการขายในช่วงเวลานี้</div>}
        </div>

        {/* Latest Approvals */}
        <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-4 md:p-6 shadow-lg flex flex-col h-full z-0">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="text-cyan-400" size={20} />
            <h3 className="text-white font-bold text-lg">อัปเดตการอนุมัติล่าสุด</h3>
          </div>
          <div className="flex-1 flex flex-col gap-3">
            {isLoading ? (
               <div className="flex justify-center py-4"><Loader2 className="w-6 h-6 animate-spin text-green-500" /></div>
            ) : data?.latestApproval?.isToday ? (
              <Link href={`/organizer/event/${data.latestApproval.id}`} className="block group">
                <div className="flex items-start gap-3 p-3 bg-green-500/10 border border-green-500/20 rounded-xl group-hover:bg-green-500/20 transition-all cursor-pointer">
                  <CheckCircle2 className="text-green-400 mt-0.5 shrink-0" size={16} />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-white text-sm font-bold truncate max-w-[150px]">{data.latestApproval.name}</p>
                      <span className="text-[10px] bg-green-500 text-white px-1.5 py-0.5 rounded-full animate-pulse">ใหม่</span>
                    </div>
                    <p className="text-slate-400 text-xs">แอดมินอนุมัติแล้ว คลิกเพื่อเริ่มตั้งค่าเปิดขายบัตรได้ทันที</p>
                  </div>
                  <ArrowUpRight size={16} className="text-green-400 opacity-0 group-hover:opacity-100 transition-transform transform group-hover:translate-x-1 group-hover:-translate-y-1"/>
                </div>
              </Link>
            ) : (
              <div className="flex flex-col items-center justify-center h-full opacity-50 py-4">
                 <p className="text-slate-400 text-sm italic">ไม่มีรายการอนุมัติใหม่ในวันนี้</p>
              </div>
            )}
          </div>
          <p className="text-[10px] text-slate-500 mt-4 italic text-center">* ข้อมูลจะแสดงเฉพาะอีเวนต์ที่ได้รับการอนุมัติในวันนี้เท่านั้น</p>
        </div>
      </div>
      
      {/* Event Table */}
      <EventTable events={data?.events || []} isLoading={isLoading} error={error} />
    </div>
  );
}