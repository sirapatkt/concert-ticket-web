"use client";
import { useRef, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/context/LanguageContext";

// Interface สำหรับข้อมูล API
interface ApiEvent {
  Event_id: number;
  eventName: string;
  rental_start: string;
  bannerImage: string | null;
  eventStatus: string;
}

export default function UpcomingScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { language, t } = useLanguage();
  
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { current } = scrollRef;
      const scrollAmount = 300;
      if (direction === "left") {
        current.scrollBy({ left: -scrollAmount, behavior: "smooth" });
      } else {
        current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    }
  };

  // ฟังก์ชันคำนวณและแสดงผลวันที่ (พรุ่งนี้, สัปดาห์หน้า, หรือ วัน/เดือน)
  const formatUpcomingDate = (dateString: string, lang: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const targetDate = new Date(dateString);
    targetDate.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return lang === "th" ? "วันนี้" : "Today";
    if (diffDays === 1) return lang === "th" ? "พรุ่งนี้" : "Tomorrow";
    if (diffDays > 1 && diffDays <= 7) return lang === "th" ? "สัปดาห์หน้า" : "Next Week";

    // กรณีเกิน 7 วัน ให้แสดงเป็น วันที่ และ เดือนแบบย่อ
    const thMonths = ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."];
    const enMonths = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    const day = targetDate.getDate();
    const month = targetDate.getMonth();

    return lang === "th" ? `${day} ${thMonths[month]}` : `${day} ${enMonths[month]}`;
  };

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/public/events");
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data: ApiEvent[] = await res.json();
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        // 1. กรองสถานะ "กำลังเตรียม" ออก
        // 2. เอาเฉพาะงานที่ "ยังไม่ผ่านไป" (วันที่จัดงาน >= วันนี้)
        const upcoming = data
          .filter((item) => {
             const eventDate = new Date(item.rental_start);
             return item.eventStatus !== "กำลังเตรียม" && 
                    item.eventStatus !== "กำลังจะเตรียม" && 
                    eventDate >= today;
          })
          // 3. เรียงลำดับจากงานที่ใกล้จะถึงที่สุดไปหางานที่ไกลที่สุด
          .sort((a, b) => new Date(a.rental_start).getTime() - new Date(b.rental_start).getTime())
          .slice(0, 8); // ดึงมาแค่ 8 งานเพื่อแสดงในแถบเลื่อน

        const formattedEvents = upcoming.map((item) => {
          const imageUrl = item.bannerImage 
            ? (item.bannerImage.startsWith('http') 
                ? item.bannerImage 
                : `http://127.0.0.1:8000/storage/${item.bannerImage}`) 
            : "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&q=80";

          return {
            id: item.Event_id,
            title: item.eventName,
            dateTh: formatUpcomingDate(item.rental_start, "th"),
            dateEn: formatUpcomingDate(item.rental_start, "en"),
            image: imageUrl,
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  if (loading) {
    return (
      <div className="py-8 flex justify-center items-center h-40">
        <Loader2 className="animate-spin text-blue-500" size={30} />
      </div>
    );
  }

  if (events.length === 0) return null; // ถ้าไม่มีงานใหม่ๆ เลย ให้ซ่อนแถบนี้ไปเลย

  return (
    <div className="py-8 relative group">
      <div className="flex items-center justify-between mb-4 px-2">
        <h3 className="text-white font-bold text-lg">{t.upcoming_events}</h3>
        <div className="flex gap-2">
          <button onClick={() => scroll("left")} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"><ChevronLeft size={18} /></button>
          <button onClick={() => scroll("right")} className="p-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"><ChevronRight size={18} /></button>
        </div>
      </div>

      <div 
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {events.map((event) => (
          <Link key={event.id} href={`/event/${event.id}`} className="min-w-[200px] md:min-w-[240px] snap-start group/card">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group-hover/card:border-blue-500/50 transition-all">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-3 left-3">
                {/* ดึงวันที่ตามภาษาที่เลือกไว้ */}
                <span className="text-xs font-bold text-blue-400 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm mb-1 inline-block">
                  {language === "th" ? event.dateTh : event.dateEn}
                </span>
                <h4 className="text-white font-bold text-sm truncate w-40">{event.title}</h4>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}