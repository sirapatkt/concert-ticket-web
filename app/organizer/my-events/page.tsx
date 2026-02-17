"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, Calendar, MoreHorizontal, 
  Edit, Trash2, Eye, Building2, Loader2 
} from "lucide-react";

export default function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState("All");

  // ✅ ฟังก์ชันดึงข้อมูลจาก Backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch('http://127.0.0.1:8000/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  // ฟังก์ชันกรองข้อมูลตามสถานะ
  const filteredEvents = events.filter((ev: any) => {
    if (filterStatus === "All") return true;
    // รองรับทั้งสถานะภาษาไทยและอังกฤษ
    if (filterStatus === "On Sale") return ev.status === "กำลังจะจัด" || ev.status === "On Sale";
    if (filterStatus === "Pending") return ev.status === "กำลังเตรียม" || ev.status === "Pending";
    if (filterStatus === "Ended") return ev.status === "จบแล้ว" || ev.status === "Ended";
    return ev.status === filterStatus;
  });

  // ฟังก์ชันเลือกสีป้ายสถานะ
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "กำลังจะจัด": 
      case "On Sale": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "กำลังเตรียม":
      case "Pending": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "จบแล้ว":
      case "Ended": return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-slate-500/20";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-20 font-sans">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            อีเวนต์ของฉัน
          </h1>
          <p className="text-slate-400 mt-1">จัดการคอนเสิร์ต ตรวจสอบยอดขาย และสถานะงานทั้งหมด</p>
        </div>
        <Link 
          href="/organizer/create" 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          + สร้างงานใหม่
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อคอนเสิร์ต..." 
            className="w-full bg-[#0F172A] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
          />
        </div>

        <div className="flex bg-[#0F172A] p-1 rounded-lg border border-slate-800 overflow-x-auto">
          {["All", "On Sale", "Pending", "Ended"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap
                ${filterStatus === status 
                  ? "bg-slate-700 text-white shadow" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
            >
              {status === "All" ? "ทั้งหมด" : status}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-6xl mx-auto space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>กำลังโหลดข้อมูลอีเวนต์...</p>
          </div>
        ) : filteredEvents.length > 0 ? filteredEvents.map((event: any) => (
          <div 
            key={event.id} 
            className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-6 hover:border-slate-600 transition-all group shadow-lg"
          >
            {/* Image Section */}
            <div className="w-full md:w-48 h-32 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 relative">
               <img 
                 src={event.image || "https://images.unsplash.com/photo-1459749411177-d4a428c3e8cb?w=800&q=80"} 
                 alt={event.title} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
               />
               <div className="absolute top-2 left-2">
                 <span className={`px-2 py-1 rounded text-[10px] font-bold border ${getStatusBadge(event.status)}`}>
                   {event.status || "Pending"}
                 </span>
               </div>
            </div>

            {/* Content Section */}
            <div className="flex-1 py-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {event.title || "ไม่ระบุชื่องาน"}
                  </h3>
                  <div className="flex flex-col gap-1.5 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-500" /> 
                      {event.date ? new Date(event.date).toLocaleDateString('th-TH', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      }) : "ยังไม่กำหนดวันที่"}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Building2 size={14} className="text-blue-400" /> {event.location || "ไม่ระบุสถานที่"}
                    </div>
                  </div>
                </div>
                
                <button className="md:hidden text-slate-400 hover:text-white transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Progress Bar & Sales Info */}
              <div className="mt-5">
                <div className="flex justify-between text-[11px] mb-2">
                  <span className="text-slate-400 font-medium">ยอดขายบัตรปัจจุบัน</span>
                  <span className="text-white font-bold">
                    {event.capacity > 0 ? Math.round(((event.sold || 0) / event.capacity) * 100) : 0}% 
                    <span className="text-slate-500 font-normal ml-1">
                      ({(event.sold ?? 0).toLocaleString()}/{(event.capacity ?? 0).toLocaleString()})
                    </span>
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${event.status === 'Ended' || event.status === 'จบแล้ว' ? 'bg-slate-500' : 'bg-gradient-to-r from-blue-600 to-cyan-400'}`} 
                    style={{ width: `${event.capacity > 0 ? ((event.sold || 0) / event.capacity) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex flex-col justify-center gap-2 pl-6 border-l border-slate-800 min-w-[150px]">
              <button className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold border border-blue-500/20">
                <Eye size={14} /> ดูข้อมูล
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-xs font-bold border border-slate-700">
                <Edit size={14} /> แก้ไขงาน
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold border border-red-500/10">
                <Trash2 size={14} /> ลบ
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-24 bg-[#0F172A] rounded-2xl border-2 border-dashed border-slate-800">
            <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-slate-600" />
            </div>
            <h3 className="text-white font-bold mb-1">ไม่พบข้อมูลอีเวนต์</h3>
            <p className="text-slate-500 text-sm">คุณยังไม่มีการสร้างอีเวนต์ในระบบ หรือไม่มีงานในสถานะที่เลือก</p>
            <Link href="/organizer/create" className="text-blue-400 text-sm mt-4 inline-block hover:underline">+ เริ่มสร้างอีเวนต์แรกของคุณ</Link>
          </div>
        )}
      </div>
    </div>
  );
}