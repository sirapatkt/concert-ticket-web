"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; // ✅ 1. เปลี่ยนมาใช้ useSearchParams
import { 
  ArrowLeft, Calendar, MapPin, Ticket, Clock, 
  AlignLeft, Users, Loader2 
} from "lucide-react";

// สร้าง Component ย่อยเพื่อแยกส่วนที่เรียกใช้ search parameters
function EventDetailContent() {
  const searchParams = useSearchParams(); 
  // ✅ 2. ดึงค่า ID จาก URL ที่เป็น ?id=...
  const eventId = searchParams?.get("id"); 

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      // ถ้ายังไม่ได้ ID มา ให้หยุดรอก่อน
      if (!eventId) return; 

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        // ยิง API ไปหาหลังบ้าน
        const res = await fetch(`http://127.0.0.1:8000/api/events/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          }
        });

        if (res.ok) {
          const data = await res.json();
          setEvent(data);
        } else {
          alert("ไม่พบข้อมูลอีเวนต์");
        }
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('th-TH', {
      year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit'
    }) + " น.";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-blue-400">
        <Loader2 className="animate-spin" size={40} />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-[#020617] text-white p-6 text-center pt-20">
        <h1 className="text-2xl font-bold mb-4">ไม่พบข้อมูลอีเวนต์</h1>
        <Link href="/organizer/my-events" className="text-blue-400 hover:underline flex items-center justify-center gap-2">
          <ArrowLeft size={16} /> กลับไปหน้าอีเวนต์ของฉัน
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header & Back Button */}
      <div className="flex items-center gap-4 mb-8">
        <Link href="/organizer/my-events" className="p-2 bg-[#0F172A] border border-slate-800 rounded-xl text-slate-400 hover:text-white hover:border-slate-600 transition-all">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            รายละเอียดอีเวนต์
          </h1>
          <p className="text-slate-400 text-sm mt-1">รหัสอ้างอิง (ID): {event.Event_id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* ซ้าย: โปสเตอร์และข้อมูลหลัก */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0F172A] p-4 rounded-2xl border border-slate-800 shadow-xl">
            <div className="aspect-[3/4] rounded-xl overflow-hidden bg-slate-800 mb-4 relative">
              <img 
                src={event.bannerImage ? (event.bannerImage.startsWith('http') ? event.bannerImage : `http://127.0.0.1:8000/storage/${event.bannerImage}`) : "https://images.unsplash.com/photo-1459749411177-d4a428c3e8cb?w=800&q=80"} 
                alt={event.eventName} 
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 bg-blue-600 px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                {event.eventStatus}
              </div>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">{event.eventName}</h2>
            <div className="space-y-3 text-sm text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin size={16} className="text-cyan-400 mt-0.5" />
                <span>{event.hall?.Hall_Name || "ไม่ระบุสถานที่"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ขวา: รายละเอียด, รอบการแสดง, โซนบัตร */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* รายละเอียด */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <AlignLeft size={18} className="text-purple-400"/> รายละเอียดงาน
            </h3>
            <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
              {event.eventDescription ? event.eventDescription.split('||GRID_DATA||')[0] : "ไม่มีรายละเอียดเพิ่มเติม"}
            </div>
          </div>

          {/* รอบการแสดง */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Calendar size={18} className="text-pink-400"/> รอบการแสดง ({event.event_date_times?.length || 0} รอบ)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {event.event_date_times?.map((round: any, index: number) => (
                <div key={index} className="bg-[#1E293B]/50 p-4 rounded-xl border border-slate-700/50">
                  <div className="font-bold text-pink-400 mb-2">รอบที่ {round.roundNumber}</div>
                  <ul className="space-y-2 text-xs text-slate-400">
                    <li className="flex gap-2"><Clock size={14} className="text-slate-500"/> เริ่ม: <span className="text-white">{formatDate(round.startDT)}</span></li>
                    <li className="flex gap-2"><Clock size={14} className="text-slate-500"/> จบ: <span className="text-white">{formatDate(round.endDT)}</span></li>
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* โซนบัตร */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Ticket size={18} className="text-yellow-400"/> โซนและราคาบัตร
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-[#1E293B]/80 border-b border-slate-700">
                  <tr>
                    <th className="px-4 py-3 rounded-tl-lg">ชื่อโซน</th>
                    <th className="px-4 py-3">ราคา (บาท)</th>
                    <th className="px-4 py-3 text-center">ที่นั่งทั้งหมด</th>
                    <th className="px-4 py-3 text-center rounded-tr-lg">เหลือที่นั่ง</th>
                  </tr>
                </thead>
                <tbody>
                  {event.ticket_zones?.map((zone: any, index: number) => (
                    <tr key={index} className="border-b border-slate-800/50 hover:bg-[#1E293B]/30 transition-colors">
                      <td className="px-4 py-3 font-medium text-white">{zone.zoneName}</td>
                      <td className="px-4 py-3 text-yellow-400">{zone.priceperTick?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center text-slate-300">{zone.totalSeat?.toLocaleString()}</td>
                      <td className="px-4 py-3 text-center font-bold text-green-400">{zone.remainSeat?.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

// ✅ 3. ครอบด้วย Suspense เพื่อป้องกัน Error ของ Next.js ตอนใช้ useSearchParams
export default function EventDetailPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-20 font-sans">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-screen">
          <Loader2 className="animate-spin text-blue-400" size={40} />
        </div>
      }>
        <EventDetailContent />
      </Suspense>
    </div>
  );
}