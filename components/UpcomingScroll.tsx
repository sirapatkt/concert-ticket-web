"use client";
import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
// ✅ 1. Import Hook
import { useLanguage } from "@/context/LanguageContext";

export default function UpcomingScroll() {
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // ✅ 2. เรียกใช้ Hook
  const { language, t } = useLanguage();

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

  // ✅ 3. ปรับแก้ Mock Data ให้รองรับ 2 ภาษา
  const upcomingEvents = [
    { 
      id: 101, 
      title: "Pop Star Live", 
      date: { th: "พรุ่งนี้", en: "Tomorrow" }, 
      image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=300&q=80" 
    },
    { 
      id: 102, 
      title: "Indie Night", 
      date: { th: "อาทิตย์หน้า", en: "Next Week" }, 
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&q=80" 
    },
    { 
      id: 103, 
      title: "Jazz Club", 
      date: { th: "15 ม.ค.", en: "15 Jan" }, 
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=300&q=80" 
    },
    { 
      id: 104, 
      title: "Rock Fest", 
      date: { th: "20 ม.ค.", en: "20 Jan" }, 
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=300&q=80" 
    },
    { 
      id: 105, 
      title: "Piano Solo", 
      date: { th: "1 ก.พ.", en: "1 Feb" }, 
      image: "https://images.unsplash.com/photo-1503095392237-5985e5a9536e?w=300&q=80" 
    },
  ];

  return (
    <div className="py-8 relative group">
      <div className="flex items-center justify-between mb-4 px-2">
        {/* ✅ ใช้ตัวแปร t.upcoming_events */}
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
        {upcomingEvents.map((event) => (
          <Link key={event.id} href={`/event/${event.id}`} className="min-w-[200px] md:min-w-[240px] snap-start group/card">
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 group-hover/card:border-blue-500/50 transition-all">
              <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              <div className="absolute bottom-3 left-3">
                {/* ✅ เลือกภาษาให้วันที่ */}
                <span className="text-xs font-bold text-blue-400 bg-black/50 px-2 py-0.5 rounded backdrop-blur-sm mb-1 inline-block">
                  {event.date[language]}
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