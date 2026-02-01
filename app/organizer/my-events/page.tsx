// 📂 ไฟล์: app/organizer/my-events/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Search, Filter, Calendar, MapPin, MoreHorizontal, 
  Edit, Trash2, Eye, Building2 
} from "lucide-react";

export default function MyEventsPage() {
  // ✅ แก้ไข: ปรับข้อมูล Mock Data ให้สถานที่ตรงกับที่เราบังคับเลือก
  const [events, setEvents] = useState([
    { 
      id: 1, 
      title: "Cat Expo 99", 
      date: "23-26 พ.ค. 2569", 
      location: "IMPACT ARENA (Grand Hall)", // แก้ให้ตรงเงื่อนไข
      status: "On Sale",
      sold: 12500,
      capacity: 15000,
      image: "https://images.unsplash.com/photo-1459749411177-d4a428c3e8cb?w=800&q=80"
    },
    { 
      id: 2, 
      title: "Rock Mountain 2026", 
      date: "10 ก.พ. 2569", 
      location: "Prince Mahidol Hall (Medium Hall)", // แก้ให้ตรงเงื่อนไข
      status: "Pending", 
      sold: 0,
      capacity: 2000,
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&q=80"
    },
    { 
      id: 3, 
      title: "Lakorn Rong The Musical", 
      date: "14 ก.พ. 2569", 
      location: "เมืองไทยรัชดาลัย เธียเตอร์ (Small Hall)", // แก้ให้ตรงเงื่อนไข
      status: "Ended", 
      sold: 500,
      capacity: 500,
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=800&q=80"
    },
  ]);

  const [filterStatus, setFilterStatus] = useState("All");

  // ฟังก์ชันกรองข้อมูล
  const filteredEvents = events.filter(ev => 
    filterStatus === "All" ? true : ev.status === filterStatus
  );

  // ฟังก์ชันเลือกสีป้ายสถานะ
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "On Sale": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "Pending": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      case "Ended": return "bg-slate-500/10 text-slate-400 border-slate-500/20";
      default: return "bg-slate-500/10 text-slate-400";
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-20">
      
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
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
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
        {filteredEvents.map((event) => (
          <div 
            key={event.id} 
            className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-6 hover:border-slate-600 transition-all group"
          >
            {/* Image */}
            <div className="w-full md:w-48 h-32 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 relative">
               <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
               <div className="absolute top-2 left-2">
                 <span className={`px-2 py-1 rounded text-xs font-bold border ${getStatusBadge(event.status)}`}>
                   {event.status}
                 </span>
               </div>
            </div>

            {/* Content */}
            <div className="flex-1 py-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                  <div className="flex flex-col gap-1 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-500" /> {event.date}
                    </div>
                    {/* ✅ แสดงไอคอนตึกและชื่อสถานที่ให้ถูกต้อง */}
                    <div className="flex items-center gap-2 text-slate-300">
                      <Building2 size={14} className="text-blue-400" /> {event.location}
                    </div>
                  </div>
                </div>
                
                <button className="md:hidden text-slate-400">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-slate-400">ยอดขายบัตร</span>
                  <span className="text-white font-medium">{Math.round((event.sold / event.capacity) * 100)}% ({event.sold.toLocaleString()}/{event.capacity.toLocaleString()})</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${event.status === 'Ended' ? 'bg-slate-500' : 'bg-gradient-to-r from-blue-500 to-cyan-400'}`} 
                    style={{ width: `${(event.sold / event.capacity) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="hidden md:flex flex-col justify-center gap-2 pl-6 border-l border-slate-800 min-w-[140px]">
              <button className="flex items-center justify-center gap-2 w-full py-1.5 rounded bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors text-sm font-medium border border-blue-500/20">
                <Eye size={16} /> ดูข้อมูล
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-1.5 rounded bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors text-sm font-medium">
                <Edit size={16} /> แก้ไข
              </button>
              <button className="flex items-center justify-center gap-2 w-full py-1.5 rounded bg-red-500/5 text-red-400 hover:bg-red-500/10 transition-colors text-sm font-medium">
                <Trash2 size={16} /> ลบ
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}