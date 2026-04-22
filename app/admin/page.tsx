"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Users, Building2, Ticket, DollarSign, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  CheckCircle, XCircle, Clock, Calendar, ChevronDown, Check, TrendingUp, TrendingDown, PlayCircle, Star
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

// Interface สำหรับ Top Event
interface TopEvent {
  id: number;
  name: string;
  sold: number;
  total: number;
  status: string;
  percent?: number; 
  revenue?: number; 
}

// 💡 Interface สำหรับข้อมูลอีเวนต์ย่อยใน Top Organizer
interface OrgEvent {
  name: string;
  sold: number;
  total: number;
  revenue: number;
  status: string;
}

// 💡 Interface สำหรับ Top Organizer (เพิ่ม email, phone, events)
interface TopOrganizer {
  id: number;
  name: string;
  email?: string;
  phone?: string;
  event_count: number;
  success_rate: number;
  revenue: number;
  events?: OrgEvent[]; // 👈 เก็บรายชื่ออีเวนต์ที่เขาจัด
}

export default function AdminDashboard() {
  const router = useRouter(); 
  
  // State UI
  const [dateRange, setDateRange] = useState("วันนี้");
  const [isDateMenuOpen, setIsDateMenuOpen] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null as number | null);

  // 💡 State สำหรับ Popup Modal รายละเอียดอีเวนต์
  const [selectedEvent, setSelectedEvent] = useState<TopEvent | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 💡 State สำหรับ Popup Modal รายละเอียดผู้จัดงาน
  const [selectedOrganizer, setSelectedOrganizer] = useState<TopOrganizer | null>(null);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);

  const dateOptions = ["วันนี้", "7 วันล่าสุด",  "เดือนนี้", "ปีนี้"];

  // --- ส่วนข้อมูล (Data) ---

  // 1. สถิติรวม
  const [currentStat, setCurrentStat] = useState({ 
    revenue: "0", 
    platformRevenue: "0", // 👈 เพิ่ม State เก็บรายได้แพลตฟอร์ม
    users: "0", 
    events: "0", 
    revChange: "0%", 
    userChange: "0%", 
    evtChange: "0%" 
  });

  // 2. ข้อมูลผู้จัดงานรอตรวจสอบ 
  const [pendingOrganizers, setPendingOrganizers] = useState<Organizer[]>([]); 

  // 3. ข้อมูลธุรกรรมล่าสุด 
  const [transactions, setTransactions] = useState<Transaction[]>([]); 

  // 4. ข้อมูลอีเวนต์ยอดเยี่ยม และ ต้องปรับปรุง
  const [bestEvents, setBestEvents] = useState<TopEvent[]>([]);
  const [worstEvents, setWorstEvents] = useState<TopEvent[]>([]);

  // 5. ข้อมูลอีเวนต์ที่เปิดขายวันนี้
  const [todayEvents, setTodayEvents] = useState<TopEvent[]>([]);

  // 6. ข้อมูลผู้จัดงานที่มีงานจัดมากที่สุด Top 3
  const [topOrganizers, setTopOrganizers] = useState<TopOrganizer[]>([]);

  // 💡 7. ข้อมูลงานที่เพิ่งจัดจบไป
  const [completedEventsList, setCompletedEventsList] = useState<TopEvent[]>([]);

  // 🟢 ดึงข้อมูลจาก API Laravel
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await fetch("http://localhost:8000/api/admin/dashboard-stats");
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data = await res.json();

        // Format ตัวเงิน
        const formatMoney = (amount: number) => 
            new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount || 0);

        // เซ็ตค่าสถิติด้านบน
        setCurrentStat({
          revenue: formatMoney(data.stats.revenue),
          platformRevenue: formatMoney(data.stats.platformRevenue), // 👈 รับค่ารายได้แพลตฟอร์ม
          users: data.stats.users.toLocaleString(),
          events: data.stats.events.toString(),
          revChange: "0%", 
          userChange: "0%", 
          evtChange: "0%" 
        });

        // ✅ เซ็ตค่าตารางผู้จัดงาน
        const formattedOrgs = data.organizers.map((org: any) => {
          const isWaiting = org.firstnameOG && org.firstnameOG.startsWith('WAITING_');
          
          return {
            id: org.Org_id,
            name: org.compName || "ไม่ระบุ",
            email: org.emailOG || "ไม่ระบุ",
            date: org.created_at ? new Date(org.created_at).toLocaleDateString('th-TH') : "-",
            status: isWaiting ? "รออนุมัติ" : "อนุมัติแล้ว" 
          };
        });
        setPendingOrganizers(formattedOrgs);

        // เซ็ตค่าตารางธุรกรรม
        const formattedTx = data.transactions.map((tx: any) => ({
          id: tx.Booking_id.toString(),
          user: tx.firstnameMB || "Unknown User",
          action: `ซื้อบัตร ${tx.quantity || 0} ใบ`,
          time: tx.BKDate ? new Date(tx.BKDate).toLocaleString('th-TH') : "-",
          amount: formatMoney(tx.totalPrice),
          status: tx.BKStatus || "-"
        }));
        setTransactions(formattedTx);

        // ✅ ลอจิกแยก Top 3 (ยอดเยี่ยม) และ Bottom 3 (ปรับปรุง) จากเปอร์เซ็นต์ยอดขาย
        const rawEvents = data.topEvents || []; 
        
        // คำนวณเปอร์เซ็นต์แต่ละงาน
        const processedEvents = rawEvents.map((evt: any) => ({
            ...evt,
            percent: evt.total > 0 ? Math.round((evt.sold / evt.total) * 100) : 0
        }));

        // 1. จัดอันดับจากมากไปน้อย (Top 3)
        const best = [...processedEvents].sort((a, b) => b.percent - a.percent).slice(0, 3);
        setBestEvents(best);

        // 2. ดึง ID ของงานที่ติด Top 3 ไปแล้วเก็บไว้ เพื่อไม่ให้ไปโชว์ซ้ำฝั่งแย่
        const bestIds = best.map(e => e.id);

        // 3. จัดอันดับจากน้อยไปมาก (Bottom 3)
        const worst = [...processedEvents]
            .filter(e => !bestIds.includes(e.id)) // กรองเอาเฉพาะตัวที่ไม่ติด Top 3
            .sort((a, b) => a.percent - b.percent)
            .slice(0, 3);
            
        setWorstEvents(worst);

        // เซ็ตค่าข้อมูลอีเวนต์ที่เปิดขายวันนี้
        if (data.todayEvents) {
            setTodayEvents(data.todayEvents);
        }

        // เซ็ตค่าข้อมูลผู้จัดงาน Top 3
        if (data.topOrganizers) {
            // เพิ่มการจัดเรียง: 1. จำนวนงานมากไปน้อย -> 2. ถ้าง่านเท่ากันเอายอดขายมากไปน้อย
            const sortedOrganizers = [...data.topOrganizers]
                .sort((a, b) => {
                    if (b.event_count !== a.event_count) {
                        return b.event_count - a.event_count; 
                    }
                    return b.revenue - a.revenue; 
                })
                .slice(0, 3); // บังคับตัดแค่ 3 อันดับแรก
                
            setTopOrganizers(sortedOrganizers);
        }

        // 💡 เซ็ตค่าข้อมูลงานที่จบไปแล้ว
        if (data.completedEventsList) {
            setCompletedEventsList(data.completedEventsList);
        }

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchDashboardData();
  }, []);

  const handleUpdateStatus = (id: number, newStatus: string) => {
    console.log(`Update org ${id} to ${newStatus}`);
    setOpenMenuId(null);
  };

  // 💡 ฟังก์ชันเปิด/ปิด Modal สำหรับ Event
  const openModal = (event: TopEvent) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedEvent(null), 200); 
  };

  // 💡 ฟังก์ชันเปิด/ปิด Modal สำหรับ Organizer
  const openOrgModal = (org: TopOrganizer) => {
    setSelectedOrganizer(org);
    setIsOrgModalOpen(true);
  };
  const closeOrgModal = () => {
    setIsOrgModalOpen(false);
    setTimeout(() => setSelectedOrganizer(null), 200); 
  };

  // โครงสร้างการ์ดสถิติ (เพิ่มรายได้แพลตฟอร์มเป็นใบแรก)
  const stats = [
    { title: "รายได้ของแพลตฟอร์ม (฿20/ใบ)", value: currentStat.platformRevenue, change: "+2%", isUp: true, icon: <Star size={20} />, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { title: "ผู้ใช้งานทั้งหมด", value: currentStat.users, change: currentStat.userChange, isUp: true, icon: <Users size={20} />, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "รออนุมัติผู้จัด", value: pendingOrganizers.filter(org => org.status === "รออนุมัติ").length.toString(), change: "Pending", isUp: true, icon: <Building2 size={20} />, color: "text-orange-400", bg: "bg-orange-500/10" },
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
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-4 z-10 relative">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#161B22] p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all shadow-lg">
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
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-8">

            {/* อีเวนต์ที่เปิดขายวันนี้ */}
            <div className="bg-[#161B22] rounded-2xl border border-pink-500/20 overflow-hidden shadow-[0_0_15px_rgba(236,72,153,0.1)] relative">
                {/* Badge เล็กๆ ตรงมุม */}
                <div className="absolute top-0 right-0 bg-pink-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-xl">
                    🔥 HOT TODAY
                </div>
                
                <div className="p-6 border-b border-white/5 flex items-center gap-2">
                    <PlayCircle size={20} className="text-pink-500" />
                    <h3 className="font-bold text-lg text-white">อีเวนต์ที่เปิดขายวันนี้</h3>
                </div>
                
                <div className="p-2 space-y-2">
                    {todayEvents.length > 0 ? (
                        todayEvents.map((event) => (
                            <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1C2128] rounded-xl border border-white/5">
                                <div>
                                    <h4 className="text-white font-bold text-base flex items-center gap-2">
                                        {event.name}
                                    </h4>
                                    <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                        <Clock size={12} /> เริ่มขายแล้ววันนี้
                                    </p>
                                </div>
                                <div className="mt-3 sm:mt-0 text-left sm:text-right">
                                    <span className="inline-block px-3 py-1 bg-green-500/10 text-green-400 border border-green-500/20 rounded-full text-xs font-bold">
                                        ขายแล้ว {event.sold} ใบ
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-24 text-gray-500 text-sm pb-4">
                            <p>ยังไม่มีอีเวนต์คิวเปิดขายในวันนี้</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ผู้จัดงาน Top 3 (จัดงานมากที่สุด) */}
            <div className="bg-[#161B22] rounded-2xl border border-white/5 overflow-hidden shadow-xl min-h-[250px]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Building2 size={20} className="text-blue-400" />
                        <h3 className="font-bold text-lg text-white">ผู้จัดงานที่มีงานจัดมากที่สุด (Top 3)</h3>
                    </div>
                </div>
                <div className="p-2 space-y-2">
                    {topOrganizers.length > 0 ? (
                        topOrganizers.map((org, index) => (
                            <div 
                                key={org.id} 
                                onClick={() => openOrgModal(org)} 
                                className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1C2128] rounded-xl border border-white/5 cursor-pointer hover:border-white/10 hover:bg-white/5 transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-bold text-base">{org.name}</h4>
                                        <p className="text-xs text-gray-400 mt-1 flex items-center gap-2">
                                            <Ticket size={12} /> สร้างแล้ว {org.event_count} งาน
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-3 sm:mt-0 flex gap-6 text-right">
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">ผลสำเร็จ</p>
                                        <span className={`text-sm font-bold ${org.success_rate >= 50 ? 'text-green-400' : 'text-orange-400'}`}>
                                            {org.success_rate}%
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-xs text-gray-400 mb-1">ยอดขายรวม</p>
                                        <span className="text-sm font-bold text-white">
                                            {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(org.revenue)}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center h-24 text-gray-500 text-sm pb-4">
                            <p>ยังไม่มีข้อมูลผู้จัดงาน</p>
                        </div>
                    )}
                </div>
            </div>

            {/* 💡 สรุปอีเวนต์ที่จัดเสร็จสิ้น (เพิ่งจบ) */}
            <div className="bg-[#161B22] rounded-2xl border border-white/5 overflow-hidden shadow-xl min-h-[250px]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <CheckCircle size={20} className="text-purple-400" />
                        <h3 className="font-bold text-lg text-white">สรุปอีเวนต์ที่จัดเสร็จสิ้นแล้ว</h3>
                    </div>
                    <span className="bg-purple-500/10 text-purple-400 text-xs px-2 py-0.5 rounded-full font-bold">
                        {currentStat.events} งาน
                    </span>
                </div>
                <div className="p-2 space-y-2">
                    {completedEventsList.length > 0 ? (
                        completedEventsList.map((event) => {
                            const isSoldOut = event.sold >= event.total;
                            const percent = Math.round((event.sold / event.total) * 100) || 0;
                            return (
                                <div key={event.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-[#1C2128] rounded-xl border border-white/5">
                                    <div className="flex-1 pr-4">
                                        <h4 className="text-white font-bold text-base line-clamp-1" title={event.name}>
                                            {event.name}
                                        </h4>
                                        <div className="flex items-center gap-3 mt-2">
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${isSoldOut ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-300'}`}>
                                                {isSoldOut ? 'Sold Out 🎉' : 'ไม่ Sold Out'}
                                            </span>
                                            <span className="text-xs text-gray-400">ขายได้ {percent}% ({event.sold}/{event.total})</span>
                                        </div>
                                    </div>
                                    <div className="mt-3 sm:mt-0 text-left sm:text-right shrink-0">
                                        <p className="text-xs text-gray-400 mb-0.5">ยอดขายรวม</p>
                                        <span className="text-sm font-bold text-purple-400">
                                            {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(event.revenue || 0)}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="flex flex-col items-center justify-center h-24 text-gray-500 text-sm pb-4">
                            <p>ยังไม่มีอีเวนต์ที่จัดเสร็จสิ้น</p>
                        </div>
                    )}
                </div>
            </div>

        </div>

        {/* Right Column (Event Performance Comparison) */}
        <div className="space-y-8">
            
            {/* Top 3 Best Performers */}
            <div className="bg-[#161B22] rounded-2xl border border-white/5 p-6 min-h-[250px]">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-white">
                    <span className="text-xl">🏆</span> อีเวนต์ยอดเยี่ยม (Top 3)
                </h3>
                
                {bestEvents.length > 0 ? (
                    <div className="space-y-4">
                        {bestEvents.map((event, index) => (
                            <div 
                                key={event.id} 
                                onClick={() => openModal(event)} 
                                className="flex items-center justify-between p-4 bg-[#1C2128] rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 cursor-pointer transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-green-500/10 text-green-500 flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm line-clamp-1" title={event.name}>{event.name}</h4>
                                        <p className="text-xs text-gray-400 mt-1">ขายแล้ว {event.sold} / {event.total}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-green-400 font-bold text-sm flex items-center gap-1">
                                        <TrendingUp size={14}/> {event.percent}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm">
                        <Ticket size={32} className="mb-2 opacity-50"/>
                        <p>ยังไม่มีข้อมูลอีเวนต์ที่กำลังเปิดขาย</p>
                    </div>
                )}
            </div>

            {/* Bottom 3 Needs Improvement */}
            <div className="bg-[#161B22] rounded-2xl border border-white/5 p-6 min-h-[250px]">
                <h3 className="font-bold text-lg mb-6 flex items-center gap-2 text-white">
                    <span className="text-xl">⚠️</span> ต้องปรับปรุง (Bottom 3)
                </h3>
                
                {worstEvents.length > 0 ? (
                    <div className="space-y-4">
                        {worstEvents.map((event, index) => (
                            <div 
                                key={event.id} 
                                onClick={() => openModal(event)} 
                                className="flex items-center justify-between p-4 bg-[#1C2128] rounded-xl border border-white/5 hover:border-white/10 hover:bg-white/5 cursor-pointer transition-all"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-8 h-8 shrink-0 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center font-bold text-sm">
                                        {index + 1}
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium text-sm line-clamp-1" title={event.name}>{event.name}</h4>
                                        <p className="text-xs text-gray-400 mt-1">ขายแล้ว {event.sold} / {event.total}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-red-400 font-bold text-sm flex items-center gap-1">
                                        <TrendingDown size={14}/> {event.percent}%
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-32 text-gray-500 text-sm">
                        <Ticket size={32} className="mb-2 opacity-50"/>
                        <p>ยังไม่มีข้อมูลอีเวนต์ที่กำลังเปิดขาย</p>
                    </div>
                )}
                
                <Link href="/admin/events" className="block w-full mt-6">
                  <button className="w-full py-3 rounded-xl border border-white/10 text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all cursor-pointer">
                      ดูรายงานฉบับเต็ม
                  </button>
                </Link>
            </div>

        </div>

      </div>

      {/* 💡 Popup (Modal) สำหรับดูข้อมูลเจาะลึกอีเวนต์ */}
      {isModalOpen && selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1C2128] border border-white/10 rounded-2xl p-6 w-11/12 max-w-md shadow-2xl animate-in zoom-in-95 duration-200 relative">
                
                {/* ปุ่มปิด */}
                <button onClick={closeModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <XCircle size={24} />
                </button>

                <h2 className="text-lg font-bold text-white mb-6 pr-6 leading-relaxed">
                    <span className="text-pink-500 mr-2">📌</span> {selectedEvent.name}
                </h2>
                
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-[#161B22] rounded-xl border border-white/5">
                        <span className="text-gray-400 text-sm flex items-center gap-2"><Ticket size={16}/> ยอดขายบัตร</span>
                        <span className="text-white font-bold">{selectedEvent.sold} / {selectedEvent.total} ใบ</span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-[#161B22] rounded-xl border border-white/5">
                        <span className="text-gray-400 text-sm flex items-center gap-2"><TrendingUp size={16}/> ผลสำเร็จ</span>
                        <span className={`font-bold ${selectedEvent.percent && selectedEvent.percent >= 50 ? 'text-green-400' : 'text-red-400'}`}>
                            {selectedEvent.percent}%
                        </span>
                    </div>

                    <div className="flex justify-between items-center p-3 bg-pink-500/5 rounded-xl border border-pink-500/20">
                        <span className="text-gray-300 text-sm flex items-center gap-2"><DollarSign size={16}/> รายได้รวมสุทธิ</span>
                        <span className="text-pink-400 font-bold text-lg">
                            {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(selectedEvent.revenue || 0)}
                        </span>
                    </div>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 text-center">
                    <Link href={`/admin/events`} className="text-sm text-gray-400 hover:text-white transition-colors underline">
                        ไปที่หน้ารายงานแบบละเอียด
                    </Link>
                </div>
            </div>
        </div>
      )}

      {/* 💡 Popup (Modal) สำหรับดูข้อมูลเจาะลึกผู้จัดงาน */}
      {isOrgModalOpen && selectedOrganizer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#1C2128] border border-white/10 rounded-2xl p-6 w-11/12 max-w-lg shadow-2xl animate-in zoom-in-95 duration-200 relative max-h-[85vh] overflow-y-auto scrollbar-hide">
                
                {/* ปุ่มปิด */}
                <button onClick={closeOrgModal} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
                    <XCircle size={24} />
                </button>

                <h2 className="text-xl font-bold text-white mb-2 pr-6 flex items-center gap-2">
                    <Building2 size={20} className="text-blue-400"/> {selectedOrganizer.name}
                </h2>
                <div className="text-sm text-gray-400 mb-6 flex flex-col gap-1">
                    <p>อีเมล: <span className="text-white">{selectedOrganizer.email}</span></p>
                    <p>เบอร์โทร: <span className="text-white">{selectedOrganizer.phone}</span></p>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-[#161B22] p-4 rounded-xl border border-white/5">
                        <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><TrendingUp size={12}/> ผลสำเร็จรวม</p>
                        <p className={`text-xl font-bold ${selectedOrganizer.success_rate >= 50 ? 'text-green-400' : 'text-orange-400'}`}>
                            {selectedOrganizer.success_rate}%
                        </p>
                    </div>
                    <div className="bg-[#161B22] p-4 rounded-xl border border-white/5">
                        <p className="text-xs text-gray-400 mb-1 flex items-center gap-1"><DollarSign size={12}/> ยอดขายรวมสุทธิ</p>
                        <p className="text-xl font-bold text-white">
                            {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(selectedOrganizer.revenue || 0)}
                        </p>
                    </div>
                </div>

                <h3 className="font-bold text-white text-sm mb-3 border-b border-white/10 pb-2">งานอีเวนต์ที่จัด ({selectedOrganizer.event_count} งาน)</h3>
                
                <div className="space-y-3">
                    {selectedOrganizer.events && selectedOrganizer.events.length > 0 ? (
                        selectedOrganizer.events.map((evt, idx) => (
                            <div key={idx} className="bg-[#161B22] p-3 rounded-xl border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-sm font-bold text-white line-clamp-1" title={evt.name}>{evt.name}</p>
                                    <p className="text-xs text-gray-400 mt-1">ขายได้ {evt.sold} / {evt.total} ใบ</p>
                                </div>
                                <div className="text-right shrink-0 ml-4">
                                    <p className="text-sm font-bold text-green-400">
                                        {new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(evt.revenue || 0)}
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-0.5">{evt.status || 'Pending'}</p>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-sm text-gray-500 text-center py-4">ไม่พบข้อมูลรายละเอียดงาน</p>
                    )}
                </div>

            </div>
        </div>
      )}
      
    </div>
  );
}