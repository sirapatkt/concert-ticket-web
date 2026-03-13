"use client";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useState, useEffect } from "react";
import { 
  Mic2, Drama, Music2, Ticket, MapPin, Calendar, 
  ArrowLeft, Users, Music, Clock, ChevronRight, Tag
} from "lucide-react";
import React from "react"; 

// ✅ 1. ฟังก์ชันแยกประเภทจากชื่อคอนเสิร์ต (Keyword Matching)
const getEventType = (name: string) => {
  const text = (name || "").toLowerCase(); 
  
  if (text.includes("fest") || text.includes("festival") || text.includes("เทศกาลดนตรี")) {
    return "เทศกาลดนตรี";
  }
  if (text.includes("fan") || text.includes("meet") || text.includes("แฟนมีต")) {
    return "แฟนมีตติ้ง";
  }
  if (text.includes("musical") || text.includes("stage") || text.includes("ละครเวที")) {
    return "ละครเวที";
  }
  if (text.includes("orchestra") || text.includes("symphony") || text.includes("philharmonic") || text.includes("ออร์เคสตรา")) {
    return "ออร์เคสตรา";
  }
  
  return "คอนเสิร์ต"; 
};

interface CategoryConfigData {
  title: string;
  subtitle: string;
  gradient: string;
  shadow: string;
  icon: React.ReactNode;
}

export default function CategoryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  
  const slug = params?.slug as string || 'all';
  const venue = searchParams?.get('venue'); 

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        // ✅ 2. ดึงข้อมูลทั้งหมดมาก่อน แล้วให้ Frontend จัดการกรองเอง
        let url = 'http://localhost:8000/api/public/events';
          
        // ถ้ามีการค้นหาด้วยสถานที่ (กดจาก dropdown) ค่อยแนบสถานที่ไป
        if (venue) {
            url += `?venue=${venue}`;
        }
          
        const res = await fetch(url);
        
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [venue]);

  // ตั้งค่าสีและข้อความส่วนหัว
  const categoryConfig: Record<string, CategoryConfigData> = {
    concert: { 
      title: "คอนเสิร์ต", 
      subtitle: "มันส์ไปกับศิลปินระดับโลกและโชว์สุดอลังการ",
      gradient: "from-blue-600 via-cyan-500 to-teal-400",
      shadow: "shadow-blue-500/20",
      icon: <Mic2 size={40} className="text-white" />,
    },
    fanmeet: { 
      title: "แฟนมีตติ้ง",
      subtitle: "โมเมนต์สุดฟิน ใกล้ชิดศิลปินคนโปรด",
      gradient: "from-pink-600 via-rose-500 to-red-400",
      shadow: "shadow-pink-500/20",
      icon: <Users size={40} className="text-white" />,
    },
    festival: { 
      title: "เทศกาลดนตรี",
      subtitle: "สนุกสุดเหวี่ยงกับบรรยากาศเฟสติวัล",
      gradient: "from-red-600 via-orange-500 to-yellow-400",
      shadow: "shadow-red-500/20",
      icon: <Music size={40} className="text-white" />,
    },
    theater: {
      title: "ละครเวที & วาไรตี้",
      subtitle: "เรื่องราวสุดประทับใจและศาสตร์แห่งการแสดง",
      gradient: "from-purple-600 via-fuchsia-500 to-pink-400",
      shadow: "shadow-purple-500/20",
      icon: <Drama size={40} className="text-white" />,
    },
    classical: {
      title: "ออร์เคสตรา & คลาสสิก",
      subtitle: "สุนทรียภาพทางดนตรีคลาสสิก",
      gradient: "from-cyan-600 via-sky-500 to-blue-400",
      shadow: "shadow-cyan-500/20",
      icon: <Music2 size={40} className="text-white" />,
    },
    orchestra: {
      title: "ออร์เคสตรา & คลาสสิก",
      subtitle: "สุนทรียภาพทางดนตรีคลาสสิก",
      gradient: "from-cyan-600 via-sky-500 to-blue-400",
      shadow: "shadow-cyan-500/20",
      icon: <Music2 size={40} className="text-white" />,
    },
    "concert-fanmeet": {
        title: "คอนเสิร์ต & แฟนมีต",
        subtitle: "รวมทุกความประทับใจ ทั้งคอนเสิร์ตและแฟนมีตติ้ง",
        gradient: "from-violet-600 via-purple-500 to-fuchsia-400",
        shadow: "shadow-purple-500/20",
        icon: <Mic2 size={40} className="text-white" />,
    },
    all: {
      title: "งานแสดงทั้งหมด",
      subtitle: venue ? `ค้นหางานที่: ${venue}` : "ค้นพบอีเวนต์ที่น่าสนใจรอบตัวคุณ",
      gradient: "from-gray-700 via-slate-600 to-zinc-500",
      shadow: "shadow-gray-500/20",
      icon: <Ticket size={40} className="text-white" />,
    },
  };

  const config = categoryConfig[slug] || categoryConfig.all;

  // ✅ 3. ระบบกรองหมวดหมู่จาก Keyword
  const validEvents = events.filter((event) => event && event.Event_id);
  
  const displayEvents = validEvents.filter((event) => {
    // ถ้าดูทั้งหมด ให้โชว์ทุกงาน
    if (slug === 'all') return true;
    
    // หาสถานะหมวดหมู่จากชื่อ
    const type = getEventType(event.eventName);
    
    // จับคู่ URL Slug ให้ตรงกับประเภทที่กรองได้
    if (slug === 'concert-fanmeet') return type === 'คอนเสิร์ต' || type === 'แฟนมีตติ้ง';
    if (slug === 'concert') return type === 'คอนเสิร์ต';
    if (slug === 'fanmeet') return type === 'แฟนมีตติ้ง';
    if (slug === 'festival') return type === 'เทศกาลดนตรี';
    if (slug === 'theater') return type === 'ละครเวที';
    if (slug === 'classical' || slug === 'orchestra') return type === 'ออร์เคสตรา';
    
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white pt-20 pb-10">
      
      {/* --- Header Banner --- */}
      <div className="relative mb-12">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-b ${config.gradient} opacity-20 blur-[120px] rounded-full pointer-events-none`}></div>

        <div className="container mx-auto px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} /> กลับหน้าหลัก
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg shadow-black/50 shrink-0`}>
              {config.icon}
            </div>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight uppercase">{config.title}</h1>
              <p className="text-gray-400 text-lg">{config.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Event List Grid --- */}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" /> อีเวนต์ที่กำลังจะเกิดขึ้น
          </h2>
          {!loading && <div className="text-sm text-gray-500">พบ {displayEvents.length} รายการ</div>}
        </div>

        {loading ? (
          <div className="py-20 text-center text-blue-400 font-bold animate-pulse">กำลังโหลดข้อมูลอีเวนต์...</div>
        ) : displayEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            
            {displayEvents.map((event, index) => {
              const lowestPrice = event.ticket_zones && event.ticket_zones.length > 0 
                ? Math.min(...event.ticket_zones.map((z: any) => parseFloat(z.priceperTick) || 0)) 
                : 0;
                
              // ดึงชื่อประเภทมาโชว์ในป้าย Badge
              const eventType = getEventType(event.eventName);

              return (
                <Link 
                  key={event.Event_id || `event-${index}`} 
                  href={`/event/${event.Event_id}`}
                  className="group bg-[#161B22] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
                >
                  {/* รูปภาพ */}
                  <div className="relative h-48 overflow-hidden bg-white/5 flex items-center justify-center">
                    {event.bannerImage ? (
                      <img 
                        src={event.bannerImage.startsWith('http') ? event.bannerImage : `http://localhost:8000/storage/${event.bannerImage}`} 
                        alt={event.eventName} 
                        className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" 
                      />
                    ) : (
                      <span className="text-gray-500 text-xs font-mono">ไม่มีรูปภาพ</span>
                    )}

                    {/* ✅ Category Badge โชว์คำที่ดึงมาจากชื่องานเลย */}
                    <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white border border-white/10 flex items-center gap-1">
                      <Tag size={10} /> {eventType}
                    </div>

                    {/* Status Badge */}
                    {(event.eventStatus === 'บัตรขายหมด') && (
                       <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                          SOLD OUT
                       </div>
                    )}
                  </div>

                  {/* เนื้อหา */}
                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
                      {event.eventName || "ไม่ระบุชื่องาน"} 
                    </h3>
                    
                    <div className="space-y-2 text-sm text-gray-500 mb-4 mt-4">
                      <div className="flex items-center gap-2">
                        <Calendar size={14} className="shrink-0" /> 
                        {event.rental_start ? new Date(event.rental_start).toLocaleDateString('th-TH') : "-"}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="shrink-0" /> 
                        <span className="truncate">{event.hall?.Hall_Name || "ไม่ระบุสถานที่"}</span>
                      </div>
                    </div>

                    {/* Price & CTA */}
                    <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                      <div>
                          <span className="text-[10px] text-gray-500 block uppercase tracking-wider">ราคาเริ่มต้น</span>
                          <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`}>
                          {lowestPrice > 0 ? lowestPrice : "0"} THB
                          </span>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                          <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}

          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5 text-gray-400">
            <Ticket size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">ยังไม่มีอีเวนต์ในหมวดหมู่นี้เร็วๆ นี้</p>
            <Link href="/" className="text-sm text-blue-400 hover:underline mt-2 inline-block">กลับไปดูอีเวนต์ทั้งหมด</Link>
          </div>
        )}
      </div>
    </div>
  );
}