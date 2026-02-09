"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // ✅ เพิ่ม useRouter เพื่อใช้สั่งเปลี่ยนหน้า
import { 
  Users, Building2, Ticket, DollarSign, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  CheckCircle, XCircle, Clock, Calendar, ChevronDown, Check, FileText
} from "lucide-react";

// Interface ข้อมูลสถิติ
interface StatData {
  revenue: string;
  users: string;
  events: string;
  revChange: string;
  userChange: string;
  evtChange: string;
}

export default function AdminDashboard() {
  const router = useRouter(); // ✅ เรียกใช้ Router
  
  // State
  const [dateRange, setDateRange] = useState("วันนี้");
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  const dateOptions = ["วันนี้", "7 วันล่าสุด",  "เดือนนี้", "ปีนี้"];

  // Mock Data สถิติ
  const statsData: Record<string, StatData> = {
    "วันนี้": { revenue: "฿12.5M", users: "45,231", events: "1,204", revChange: "+12.5%", userChange: "+8.2%", evtChange: "-2.4%" },
    "7 วันล่าสุด": { revenue: "฿84.2M", users: "48,150", events: "1,215", revChange: "+25.4%", userChange: "+10.1%", evtChange: "+1.2%" },
    "เดือนนี้": { revenue: "฿340.5M", users: "52,800", events: "1,350", revChange: "+45.2%", userChange: "+15.8%", evtChange: "+5.6%" },
    "ปีนี้": { revenue: "฿4.2B", users: "120,500", events: "2,100", revChange: "+88.5%", userChange: "+42.3%", evtChange: "+24.8%" },
  };
  const currentStat = statsData[dateRange] || statsData["วันนี้"];

  // Mock Data ผู้จัดงาน
  const [pendingOrganizers, setPendingOrganizers] = useState([
    { id: 1, name: "GMM Grammy", email: "contact@gmm.com", date: "10 นาทีที่แล้ว", status: "รอตรวจสอบ" },
    { id: 2, name: "RS Group", email: "admin@rs.co.th", date: "2 ชั่วโมงที่แล้ว", status: "รอตรวจสอบ" },
    { id: 3, name: "Smallroom", email: "info@smallroom.com", date: "1 วันที่แล้ว", status: "เอกสารไม่ครบ" },
  ]);

  const handleUpdateStatus = (id: number, newStatus: string) => {
    setPendingOrganizers(prev => prev.map(org => org.id === id ? { ...org, status: newStatus } : org));
    setOpenMenuId(null);
  };

  // Mock Data ธุรกรรม (เพิ่ม ID เพื่อใช้ทำ Link)
  const transactions = [
    { id: "TX-8821", user: "User #8821", action: "ซื้อบัตร Jeff Satur (Zone A)", time: "2 นาทีที่แล้ว", amount: "+฿6,500", status: "success" },
    { id: "TX-9102", user: "User #9102", action: "ซื้อบัตร Summer Sonic (VIP)", time: "5 นาทีที่แล้ว", amount: "+฿12,000", status: "success" },
    { id: "TX-8811", user: "User #8811", action: "ซื้อบัตร Cat Expo", time: "25 นาทีที่แล้ว", amount: "+฿1,500", status: "success" },
  ];

  const stats = [
    { title: "รายได้รวม", value: currentStat.revenue, change: currentStat.revChange, isUp: true, icon: <DollarSign size={20} />, color: "text-green-400", bg: "bg-green-500/10" },
    { title: "ผู้ใช้งานทั้งหมด", value: currentStat.users, change: currentStat.userChange, isUp: true, icon: <Users size={20} />, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "อีเวนต์ที่จัดแล้ว", value: currentStat.events, change: currentStat.evtChange, isUp: !currentStat.evtChange.includes('-'), icon: <Ticket size={20} />, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "รออนุมัติผู้จัด", value: pendingOrganizers.filter(o => o.status === "รอตรวจสอบ").length.toString(), change: "Action Needed", isUp: true, icon: <Building2 size={20} />, color: "text-orange-400", bg: "bg-orange-500/10" },
  ];

  return (
    <div className="p-6 lg:p-8 min-h-screen space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" onClick={() => { setOpenMenuId(null); setIsDateMenuOpen(false); }}>
      
      {/* Header & Date Picker */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold mb-1 text-white">ภาพรวมระบบ</h1>
          <p className="text-gray-400 text-sm">ยินดีต้อนรับกลับ, Admin 👋 นี่คือสถานะของระบบ <span className="text-white font-bold">{dateRange}</span></p>
        </div>
        <div className="flex items-center gap-3 relative z-20">
            <span className="text-sm text-gray-500 hidden sm:block">ข้อมูลประจำ:</span>
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

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 z-10 relative">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#161B22] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-4">
               <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
               <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${stat.change.includes('+') ? 'bg-green-500/10 text-green-400' : stat.change.includes('-') ? 'bg-red-500/10 text-red-400' : 'bg-orange-500/10 text-orange-400'}`}>
                  {stat.isUp ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />} {stat.change}
               </span>
            </div>
            <p className="text-gray-400 text-xs mb-1 font-medium">{stat.title}</p>
            <h3 className="text-2xl font-bold text-white">{stat.value}</h3>
          </div>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 z-0 relative">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">
            
            {/* 🔴 Recent Transactions (แก้ไขให้คลิกได้) */}
            <div className="bg-[#161B22] rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold text-lg flex items-center gap-2 text-white">
                        <DollarSign size={18} className="text-green-400"/> ธุรกรรมล่าสุด
                    </h3>
                    {/* ✅ ลิงก์ไปหน้า Finance */}
                    <Link href="/admin/finance" className="text-xs text-gray-400 hover:text-white transition-colors cursor-pointer">
                        ดูทั้งหมด
                    </Link>
                </div>
                <div>
                    {transactions.map((tx, i) => (
                        <div 
                            key={i} 
                            // ✅ กดแล้วไปหน้ารายละเอียด (สมมติ ID)
                            onClick={() => router.push(`/admin/finance/${tx.id}`)}
                            className="flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/5 last:border-0 transition-all cursor-pointer group"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-gray-400 font-bold text-xs group-hover:bg-gray-700 group-hover:text-white transition-colors">
                                    {tx.user.substring(0,2)}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{tx.action}</p>
                                    <p className="text-xs text-gray-500 flex items-center gap-1">
                                        {tx.user} • <span className="font-mono text-gray-600">{tx.id}</span> • {tx.time}
                                    </p>
                                </div>
                            </div>
                            <span className={`font-mono font-bold text-sm ${tx.status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                                {tx.amount}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Pending Organizers */}
            <div className="bg-[#161B22] border border-white/5 rounded-2xl overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <h2 className="font-bold text-lg text-white">คำขอสมัครผู้จัดงาน</h2>
                        <span className="bg-orange-500/10 text-orange-500 text-xs px-2 py-0.5 rounded-full border border-orange-500/20 font-bold">
                            {pendingOrganizers.filter(o => o.status === "รอตรวจสอบ").length}
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
                            {pendingOrganizers.map((org) => (
                                <tr key={org.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-bold text-white">{org.name}</td>
                                    <td className="px-6 py-4 text-gray-400">{org.email}</td>
                                    <td className="px-6 py-4 flex items-center gap-2"><Clock size={14} className="text-gray-600" /> {org.date}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${org.status === 'รอตรวจสอบ' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : org.status === 'อนุมัติแล้ว' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : org.status === 'เอกสารไม่ครบ' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                                            {org.status === 'อนุมัติแล้ว' && <CheckCircle size={12} />}
                                            {org.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right relative">
                                        <button onClick={(e) => { e.stopPropagation(); setOpenMenuId(openMenuId === org.id ? null : org.id); }} className={`p-2 rounded-lg transition-colors ${openMenuId === org.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                                            <MoreHorizontal size={18} />
                                        </button>
                                        {openMenuId === org.id && (
                                            <div className="absolute right-8 top-10 w-40 bg-[#1C2128] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                                <button onClick={() => handleUpdateStatus(org.id, "อนุมัติแล้ว")} className="w-full text-left px-4 py-3 text-sm text-green-400 hover:bg-green-500/10 hover:text-green-300 flex items-center gap-2 font-medium"><CheckCircle size={16} /> อนุมัติทันที</button>
                                                <button onClick={() => handleUpdateStatus(org.id, "เอกสารไม่ครบ")} className="w-full text-left px-4 py-3 text-sm text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 flex items-center gap-2 font-medium"><Clock size={16} /> เอกสารขาด</button>
                                                <div className="h-[1px] bg-white/5 my-0"></div>
                                                <button onClick={() => handleUpdateStatus(org.id, "ถูกปฏิเสธ")} className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 font-medium"><XCircle size={16} /> ปฏิเสธ</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        {/* Right Column (Top Events) */}
        <div className="space-y-8">
            <div className="bg-[#161B22] rounded-2xl border border-white/5 p-6">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-white"><span className="text-xl">🏆</span> อีเวนต์ยอดนิยม</h3>
                <div className="space-y-6">
                    {[
                        { title: "Jeff Satur: Space Shuttle", sold: "95%", img: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000" },
                        { title: "Summer Sonic BKK", sold: "82%", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000" },
                        { title: "Cat Expo 10", sold: "64%", img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000" },
                        { title: "NONT TANONT Concert", sold: "45%", img: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000" },
                    ].map((event, index) => (
                        <div key={index} className="flex gap-4 items-center group cursor-pointer">
                            <div className={`font-bold text-lg w-4 text-center ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-300' : index === 2 ? 'text-orange-400' : 'text-gray-600'}`}>{index + 1}</div>
                            <div className="w-12 h-12 rounded-lg bg-gray-800 overflow-hidden shrink-0 border border-white/10 group-hover:border-pink-500 transition-colors">
                                <img src={event.img} alt="" className="w-full h-full object-cover"/>
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="font-bold text-sm truncate text-gray-200 group-hover:text-pink-500 transition-colors">{event.title}</h4>
                                <div className="flex justify-between items-center mt-1">
                                    <div className="w-full bg-gray-800 h-1.5 rounded-full mr-3 overflow-hidden"><div className="bg-gradient-to-r from-pink-500 to-purple-500 h-full rounded-full" style={{width: event.sold}}></div></div>
                                    <span className="text-xs font-bold text-gray-400">{event.sold}</span>
                                </div>
                            </div>
                        </div>
                    ))}
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