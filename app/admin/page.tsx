"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, Building2, Ticket, DollarSign, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  CheckCircle, XCircle, Clock, Calendar, ChevronDown, Check
} from "lucide-react";

// Interface สำหรับข้อมูล
interface Organizer {
  id: number;
  name: string;
  email: string;
  date: string;
  status: string;
}

interface Transaction {
  id: string;
  user: string;
  action: string;
  time: string;
  amount: string;
  status: string;
}

export default function AdminDashboard() {
  const router = useRouter(); 
  
  // State UI
  const [dateRange, setDateRange] = useState("วันนี้");
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null as number | null);

  const dateOptions = ["วันนี้", "7 วันล่าสุด",  "เดือนนี้", "ปีนี้"];

  // --- ส่วนข้อมูล (Data) ที่ล้างค่าออกแล้ว (รอต่อ API) ---

  // 1. สถิติรวม (ตั้งเป็น 0 ไว้ก่อน)
  const currentStat = { 
    revenue: "0", 
    users: "0", 
    events: "0", 
    revChange: "0%", 
    userChange: "0%", 
    evtChange: "0%" 
  };

  // 2. ข้อมูลผู้จัดงานรอตรวจสอบ (อาเรย์ว่าง)
  const [pendingOrganizers, setPendingOrganizers] = useState<Organizer[]>([]); 

  // 3. ข้อมูลธุรกรรมล่าสุด (อาเรย์ว่าง)
  const transactions: Transaction[] = []; 

  // ฟังก์ชันจัดการสถานะ (คงไว้สำหรับใช้ต่อกับ API)
  const handleUpdateStatus = (id: number, newStatus: string) => {
    // TODO: เรียก API อัปเดตสถานะตรงนี้
    console.log(`Update org ${id} to ${newStatus}`);
    setOpenMenuId(null);
  };

  // โครงสร้างการ์ดสถิติ
  const stats = [
    { title: "รายได้รวม", value: currentStat.revenue, change: currentStat.revChange, isUp: true, icon: <DollarSign size={20} />, color: "text-green-400", bg: "bg-green-500/10" },
    { title: "ผู้ใช้งานทั้งหมด", value: currentStat.users, change: currentStat.userChange, isUp: true, icon: <Users size={20} />, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "อีเวนต์ที่จัดแล้ว", value: currentStat.events, change: currentStat.evtChange, isUp: true, icon: <Ticket size={20} />, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "รออนุมัติผู้จัด", value: pendingOrganizers.length.toString(), change: "Pending", isUp: true, icon: <Building2 size={20} />, color: "text-orange-400", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="p-6 lg:p-8 min-h-screen space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" onClick={() => { setOpenMenuId(null); setIsDateMenuOpen(false); }}>
      
      {/* Header & Date Picker */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-white">ภาพรวมระบบ</h1>
          <p className="text-gray-400 text-sm">ยินดีต้อนรับกลับ, Admin 👋 สถานะระบบ: <span className="text-white font-bold">{dateRange}</span></p>
        </div>
        
        {/* Date Filter UI */}
        <div className="flex items-center gap-3 relative z-20">
            <div className="relative">
                <button onClick={(e) => { e.stopPropagation(); setIsDateMenuOpen(!isDateMenuOpen); }} className={`flex items-center gap-2 bg-[#161B22] border hover:border-pink-500/50 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all shadow-sm ${isDateMenuOpen ? 'border-pink-500 ring-2 ring-pink-500/20' : 'border-white/10'}`}>
                    <Calendar size={16} className="text-pink-500"/>
                    <span className="min-w-[60px] text-left">{dateRange}</span>
                    <ChevronDown size={14} className={`text-gray-400 ml-2 transition-transform duration-200 ${isDateMenuOpen ? 'rotate-180' : ''}`}/>
                </button>
                {isDateMenuOpen && (
                    <div className="absolute right-0 top-12 w-48 bg-[#1C2128] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <div className="py-1">
                            {dateOptions.map((option) => (
                                <button key={option} onClick={() => { setDateRange(option); setIsDateMenuOpen(false); }} className={`w-full text-left px-4 py-2.5 text-sm flex items-center justify-between hover:bg-white/5 transition-colors ${dateRange === option ? 'text-pink-400 font-bold bg-pink-500/5' : 'text-gray-300'}`}>
                                    {option}
                                    {dateRange === option && <Check size={14} />}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-xs font-bold flex items-center gap-1">
                <span className="relative flex h-2 w-2 mr-1"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span></span> Online
            </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 z-10 relative">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#161B22] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
               <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.change.includes('+') ? 'bg-green-500/10 text-green-400' : 'bg-gray-500/10 text-gray-400'}`}>
                  {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {stat.change}
               </span>
            </div>
            <p className="text-gray-400 text-xs mb-1 font-medium">{stat.title}</p>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 z-0 relative">
        
        {/* Left Column (Transactions & Organizers) */}
        <div className="xl:col-span-2 space-y-8">
            
            {/* Recent Transactions */}
            <div className="bg-[#161B22] rounded-2xl border border-white/5 overflow-hidden min-h-[200px]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                        <DollarSign size={18} className="text-green-400"/> ธุรกรรมล่าสุด
                    </h3>
                    <Link href="/admin/finance" className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer">
                        ดูทั้งหมด
                    </Link>
                </div>
                <div>
                    {transactions.length > 0 ? (
                        transactions.map((tx, i) => (
                            <div key={i} onClick={() => router.push(`/admin/finance/${tx.id}`)} className="flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5 last:border-0 transition-all cursor-pointer group">
                                {/* ... Transaction Item Layout ... */}
                                <div className="text-white">{tx.action}</div>
                            </div>
                        ))
                    ) : (
                        <div className="p-8 text-center text-gray-500 text-sm">
                            ยังไม่มีรายการธุรกรรมในขณะนี้
                        </div>
                    )}
                </div>
            </div>

            {/* Pending Organizers Table */}
            <div className="bg-[#161B22] border border-white/5 rounded-2xl overflow-hidden shadow-xl min-h-[200px]" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-lg text-white">คำขอสมัครผู้จัดงาน</h2>
                        <span className="bg-orange-500/10 text-orange-500 text-xs px-2 py-0.5 rounded-full border border-orange-500/20 font-bold">
                            {pendingOrganizers.length}
                        </span>
                    </div>
                    <Link href="/admin/organizers" className="text-sm text-blue-400 hover:text-blue-300 font-medium hover:underline">
                        ดูทั้งหมด
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-gray-400">
                        <thead className="bg-[#0B0F14] text-gray-200 uppercase text-xs font-bold">
                            <tr>
                                <th className="px-6 py-4">ชื่อทีมงาน</th>
                                <th className="px-6 py-4">อีเมล</th>
                                <th className="px-6 py-4">เวลา</th>
                                <th className="px-6 py-4">สถานะ</th>
                                <th className="px-6 py-4 text-right">จัดการ</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                            {pendingOrganizers.length > 0 ? (
                                pendingOrganizers.map((org) => (
                                    <tr key={org.id} className="hover:bg-white/5 transition-colors">
                                        <td className="px-6 py-4 font-bold text-white">{org.name}</td>
                                        <td className="px-6 py-4 text-gray-400">{org.email}</td>
                                        <td className="px-6 py-4 flex items-center gap-2"><Clock size={14} className="text-gray-600" /> {org.date}</td>
                                        <td className="px-6 py-4">
                                            <span className="text-orange-400">{org.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-right relative">
                                            <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === org.id ? null : org.id); }} className="p-2 text-gray-400 hover:text-white">
                                                <MoreHorizontal size={18} />
                                            </button>
                                            {/* Context Menu would go here */}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="p-8 text-center text-gray-500 text-sm">
                                        ไม่พบคำขอที่รอการตรวจสอบ
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Right Column (Top Events - Empty State) */}
        <div className="space-y-8">
            <div className="bg-[#161B22] rounded-2xl border border-white/5 p-6 min-h-[300px]">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-white"><span className="text-xl">🏆</span> อีเวนต์ยอดนิยม</h3>
                <div className="flex flex-col items-center justify-center h-40 text-gray-500 text-sm">
                    <Ticket size={32} className="mb-2 opacity-50"/>
                    <p>ยังไม่มีข้อมูลอีเวนต์</p>
                </div>
                <Link href="/admin/events" className="block w-full mt-6">
                  <button className="w-full py-3 rounded-xl border border-white/10 text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all cursor-pointer">ดูรายงานฉบับเต็ม</button>
                </Link>
            </div>
        </div>

      </div>
    </div>
  );
}