"use client";
import Link from "next/link"; 
import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import CategoryIcons from "@/components/CategoryIcons";
import UpcomingScroll from "@/components/UpcomingScroll";
import { useLanguage } from "@/context/LanguageContext";

export default function Home() {
  const { t, language } = useLanguage();

  // Mock Data (เปลี่ยนตามภาษา)
  const events = [
    {
      id: 1,
      title: language === "th" ? "เดอะ แกรนด์ ซิมโฟนี 2026" : "THE GRAND SYMPHONY 2026 : Live in Bangkok",
      date: "15 JAN 2026",
      venue: language === "th" ? "มหิดลสิทธาคาร" : "Prince Mahidol Hall",
      price: "฿1,500",
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&q=80",
      status: "Selling Fast" as const,
    },
    {
      id: 2,
      title: "NEON VIBES FESTIVAL 2026",
      date: "12 FEB 2026",
      venue: language === "th" ? "อิมแพ็ค อารีน่า" : "Impact Arena",
      price: "฿2,500",
      image: "https://images.unsplash.com/photo-1459749411177-d4a428c389f5?w=400&q=80",
      status: "Available" as const,
    },
    {
      id: 3,
      title: language === "th" ? "แฟนธอม ออฟ ดิ โอเปร่า" : "PHANTOM OF THE OPERA : The Musical",
      date: "01 MAR 2026",
      venue: language === "th" ? "เมืองไทยรัชดาลัย" : "Muangthai Rachadalai",
      price: "฿3,000",
      image: "https://images.unsplash.com/photo-1503095392237-5985e5a9536e?w=400&q=80",
      status: "Available" as const,
    },
    {
      id: 4,
      title: "ROCK LEGENDS REUNION",
      date: "20 MAR 2026",
      venue: language === "th" ? "ธันเดอร์โดม" : "Thunder Dome",
      price: "฿1,800",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=400&q=80",
      status: "Sold Out" as const,
    },
    {
      id: 5,
      title: "JAZZ NIGHT AT THE PARK",
      date: "25 MAR 2026",
      venue: language === "th" ? "สวนเบญจกิติ" : "Benjakitti Park",
      price: "฿800",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?w=400&q=80",
      status: "Available" as const,
    },
  ];

  return (
    <main className="min-h-screen bg-[#0B0F14] relative overflow-hidden selection:bg-pink-500/30 selection:text-white">
      
      {/* 🌟 Background Ambient Light */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
         <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[150px] animate-pulse delay-2000"></div>
         <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-orange-500/5 rounded-full blur-[180px]"></div>
      </div>

      {/* ✅ เนื้อหาเว็บ */}
      <div className="relative z-10">
        
        <Hero />

        <div className="max-w-7xl mx-auto px-6 py-8 pb-16">
          
          {/* === ส่วนที่ 1: งานแสดงยอดฮิต (Popular Events) === */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              🔥 {t.popular_events} 
              <span className="text-gray-500 text-lg font-normal hidden sm:inline-block">
                {language === 'th' && "(Popular Events)"}
              </span>
            </h2>
            
            <Link 
              href="/explore" 
              className="px-4 py-2 border border-white/20 rounded-full text-sm text-gray-300 hover:text-white hover:border-white transition-all backdrop-blur-sm block"
            >
              {t.see_all} &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {events.map((event) => (
              // ✅ แก้ไข: ลบ Link ตัวนอกออก (เพราะใน EventCard มี Link อยู่แล้ว) 
              // ใส่ key ไว้ที่ EventCard แทน
              <EventCard key={event.id} {...event} />
            ))}
          </div>

          {/* ⚡️ ลดระยะห่างเส้นคั่น */}
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8"></div>

          {/* === ส่วนที่ 2: Components ด้านล่าง === */}
          <UpcomingScroll />
          
          {/* ⚡️ ลดระยะห่างหมวดหมู่ */}
          <div className="mt-2">
            <CategoryIcons />
          </div>

        </div>
      </div>
    </main>
  );
}