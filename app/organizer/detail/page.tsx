"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation"; 
import { 
  ArrowLeft, Calendar, MapPin, Ticket, Clock, 
  AlignLeft, Users, Loader2, Map 
} from "lucide-react";

// ✅ นำเข้า Modal ผังที่นั่ง
import SeatPreviewModal from "@/components/SeatPreviewModal";

function EventDetailContent() {
  const searchParams = useSearchParams(); 
  const eventId = searchParams?.get("id"); 

  const [event, setEvent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State สำหรับควบคุมการเปิด/ปิด Modal ผังที่นั่ง
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (!eventId) return; 

      try {
        setLoading(true);
        const token = localStorage.getItem("token");
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

  // ====================================================================
  // ✅ วิธีแก้: คำนวณจากวันที่ขายบัตรจริงๆ (เลิกเชื่อ string เก่าจาก DB)
  // ====================================================================
  type EventStatusType = "กำลังเตรียม" | "กำลังจะจัด" | "เปิดขาย" | "กำลังจัด" | "ปิดการขาย" | "บัตรขายหมด" | "เสร็จสิ้น" | "ยกเลิกงาน";

  const getThaiStatus = (eventData: any): EventStatusType => {
    if (!eventData) return 'กำลังเตรียม';

    // 1. เช็คสถานะบังคับยกเลิกก่อน
    const rawStatus = eventData.status || eventData.eventStatus || '';
    if (rawStatus === 'ยกเลิก' || rawStatus === 'ยกเลิกงาน') return 'ยกเลิกงาน';

    // 2. คำนวณจากวันที่ขายบัตรจริง (แม่นยำ 100%)
    if (eventData.event_date_times && eventData.event_date_times.length > 0) {
      const now = new Date();
      let isSelling = false;
      let isWaiting = false;
      let isEnded = true;

      for (const round of eventData.event_date_times) {
        const saleStart = new Date(round.Sale_startDT);
        const saleEnd = new Date(round.Sale_endDT);
        const eventEnd = new Date(round.endDT);

        if (now < eventEnd) isEnded = false; 
        if (now >= saleStart && now <= saleEnd) isSelling = true; // อยู่ในช่วงเปิดขาย
        if (now < saleStart) isWaiting = true; // ยังไม่เปิดขาย
      }

      if (isEnded) return 'เสร็จสิ้น';
      if (isSelling) return 'เปิดขาย';
      if (isWaiting) return 'กำลังจะจัด';
      return 'ปิดการขาย';
    }

    // 3. Fallback กรณีไม่มีรอบการแสดง
    if (rawStatus === 'กำลังเตรียม') return 'กำลังเตรียม';
    if (rawStatus === 'กำลังจะจัด') return 'กำลังจะจัด';
    if (rawStatus === 'เปิดขาย' || rawStatus === 'เปิดขายบัตร' || rawStatus?.toUpperCase() === 'ON SALE') return 'เปิดขาย'; 
    if (rawStatus === 'ปิดการขาย') return 'ปิดการขาย';
    if (rawStatus === 'กำลังจัด') return 'กำลังจัด';
    if (rawStatus === 'บัตรขายหมด') return 'บัตรขายหมด';
    if (rawStatus === 'เสร็จสิ้น') return 'เสร็จสิ้น';
    
    return 'กำลังเตรียม'; 
  };

  const getStatusStyles = (eventData: any) => {
    const thaiStatus = getThaiStatus(eventData);
  
    switch (thaiStatus) {
      case 'เปิดขาย': 
        return "border-2 border-emerald-500 bg-emerald-600 text-white shadow-lg";
      case 'ปิดการขาย':
        return "border-2 border-red-900 bg-red-800 text-white";
      case 'กำลังจัด':
        return "border-2 border-pink-500 bg-pink-600 text-white animate-pulse";
      case 'กำลังเตรียม':
        return "border-2 border-amber-400 bg-amber-500 text-white";
      case 'กำลังจะจัด':
        return "border-2 border-blue-500 bg-blue-600 text-white";
      case 'บัตรขายหมด':
        return "border-2 border-orange-500 bg-orange-600 text-white";
      case 'เสร็จสิ้น':
        return "border-2 border-slate-500 bg-slate-600 text-white";
      case 'ยกเลิกงาน':
        return "border-2 border-red-500 bg-red-600 text-white";
      default:
        return "border-2 border-slate-600 bg-slate-700 text-white";
    }
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

  // ============================================================================
  // 🌟 บังคับจัดเรียงลำดับโซนใหม่ เพื่อให้รูปผังใน Modal สีไม่เพี้ยนและถูกตำแหน่ง
  // ============================================================================
  const correctZoneOrder = [
    "A1", "A2", "A3", "A4", "A5", "A6", "A7",
    "SB", "SC", "SD", "SE", "SF", "SG", "SH", "SI", "SJ", "SK", "SL", "SM", "SN",
    "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T"
  ];

  const formattedTickets = event.ticket_zones?.map((zone: any) => ({
    zoneName: zone.zoneName,
    price: zone.priceperTick,
    quantity: zone.totalSeat,
  })).sort((a: any, b: any) => {
    // เทียบชื่อโซนกับ Array ด้านบน จัดเรียงให้เข้าที่
    const indexA = correctZoneOrder.indexOf(a.zoneName.toUpperCase().trim());
    const indexB = correctZoneOrder.indexOf(b.zoneName.toUpperCase().trim());
    
    // ถ้าหาชื่อโซนไม่เจอ (เช่น โซนแปลกๆ) ให้เตะไปอยู่ท้ายสุด (999)
    const posA = indexA === -1 ? 999 : indexA;
    const posB = indexB === -1 ? 999 : indexB;
    
    return posA - posB;
  }) || [];

  const detectVenueSize = (hallId: string, tickets: any[]) => {
    const zoneCount = tickets.length;

    if (hallId === "1") { 
      if (zoneCount > 20) return "Large";
      if (zoneCount > 8) return "Medium";
      return "Small";
    } 
    else if (hallId === "2") { 
      if (zoneCount > 6) return "Large";   
      if (zoneCount > 3) return "Medium";  
      return "Small";                      
    } 
    else if (hallId === "3") { 
      if (zoneCount > 12) return "Large";  
      if (zoneCount > 6) return "Medium";  
      return "Small";                      
    }
    
    return "Small"; 
  };

  const currentHallId = event.Hall_id?.toString() || event.hall?.Hall_id?.toString() || "3";

  let activeVenueSize = event.venueSize || event.venue_size;
  if (!activeVenueSize) {
    activeVenueSize = detectVenueSize(currentHallId, formattedTickets);
  }

  const formattedVenueSize = activeVenueSize.charAt(0).toUpperCase() + activeVenueSize.slice(1).toLowerCase();

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
              
              {/* ✅ ป้ายสถานะจะอิงจากการคำนวณเวลาจริงๆ แล้ว ✅ */}
              <div className="absolute top-2 left-2">
                <span className={`px-2 py-1 rounded text-[10px] font-black ${getStatusStyles(event)}`}>
                  {getThaiStatus(event)}
                </span>
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
                  <div className="font-bold text-pink-400 mb-3">รอบที่ {round.roundNumber}</div>
                  
                  <ul className="space-y-2 text-xs text-slate-400 mb-3">
                    <li className="flex gap-2"><Clock size={14} className="text-slate-500"/> เริ่มแสดง: <span className="text-white">{formatDate(round.startDT)}</span></li>
                    <li className="flex gap-2"><Clock size={14} className="text-slate-500"/> จบการแสดง: <span className="text-white">{formatDate(round.endDT)}</span></li>
                  </ul>

                  <div className="pt-3 border-t border-slate-700/50">
                    <div className="text-[10px] font-bold text-slate-500 mb-2">ช่วงเวลาขายบัตร</div>
                    <ul className="space-y-2 text-xs text-slate-400">
                      <li className="flex gap-2"><Ticket size={14} className="text-yellow-500"/> เปิดขาย: <span className="text-yellow-400">{formatDate(round.Sale_startDT)}</span></li>
                      <li className="flex gap-2"><Ticket size={14} className="text-red-400"/> ปิดขาย: <span className="text-red-400">{formatDate(round.Sale_endDT)}</span></li>
                    </ul>
                  </div>

                </div>
              ))}
            </div>
          </div>

          {/* โซนบัตร */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            {/* หัวตาราง และ ปุ่มเปิด Modal */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white flex items-center gap-2">
                <Ticket size={18} className="text-yellow-400"/> โซนและราคาบัตร
              </h3>
              
              <button 
                onClick={() => setIsPreviewModalOpen(true)} 
                type="button" 
                className="text-sm bg-cyan-500/10 text-cyan-400 border border-cyan-500/50 hover:bg-cyan-500 hover:text-white px-4 py-1.5 rounded-lg flex items-center gap-2 transition-all shadow-sm"
              >
                <Map size={16} /> ดูผังที่นั่ง
              </button>
            </div>

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

      <SeatPreviewModal 
        isOpen={isPreviewModalOpen} 
        onClose={() => setIsPreviewModalOpen(false)} 
        tickets={formattedTickets} 
        hallId={currentHallId} 
        venueSize={formattedVenueSize}
      />
    </div>
  );
}

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