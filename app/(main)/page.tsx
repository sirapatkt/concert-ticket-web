"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Hero from "@/components/Hero";
import EventCard from "@/components/EventCard";
import CategoryIcons from "@/components/CategoryIcons";
import UpcomingScroll from "@/components/UpcomingScroll";
import { useLanguage } from "@/context/LanguageContext";

// 1. Interface สำหรับรับข้อมูลดิบจาก API (Laravel)
interface ApiEvent {
  Event_id: number;
  eventName: string;
  rental_start: string;
  bannerImage: string | null;
  eventStatus: string;
  hall?: {
    Hall_Name: string;
  };
  ticket_zones?: {
    priceperTick: number;
  }[];
}

// 2. Interface ของ EventCard (ต้องตรงกับไฟล์ Component EventCard.tsx)
interface EventCardProps {
  id: number;
  title: string;
  date: string;
  venueTh: string;
  venueEn: string;
  price: string;
  image: string;
  // ✅ กำหนด Type ให้ตรงเป๊ะๆ (แก้เส้นแดง)
  status: "Available" | "Sold Out" | "Selling Fast"; 
}

// 3. ฟังก์ชันแปลงสถานะจาก ไทย -> อังกฤษ (แก้เส้นแดง)
const mapStatusToEnglish = (thaiStatus: string): "Available" | "Sold Out" | "Selling Fast" => {
  const statusMap: Record<string, "Available" | "Sold Out" | "Selling Fast"> = {
    'กำลังจะจัด': 'Available',
    'กำลังเตรียม': 'Available',
    'On Sale': 'Available',
    'เปิดขายบัตร': 'Available',
    'Available': 'Available',
    
    'Selling': 'Selling Fast',
    'กำลังจัดแสดง': 'Selling Fast',
    'Selling Fast': 'Selling Fast',
    
    'Sold Out': 'Sold Out',
    'จบแล้ว': 'Sold Out'
  };
  
  // ถ้าไม่เจอคำไหนเลย ให้ Default เป็น Available ไว้ก่อนกัน Error
  return statusMap[thaiStatus] || 'Available'; 
};

export default function Home() {
  const { t, language } = useLanguage();
  
  const [events, setEvents] = useState<EventCardProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // ✅ ตรวจสอบ URL ให้ถูกต้อง (ต้องตรงกับ routes/api.php)
        const res = await fetch("http://127.0.0.1:8000/api/public/events");
        
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data: ApiEvent[] = await res.json();

        // แปลงข้อมูล
        const formattedEvents: EventCardProps[] = data.map((item) => {
          // หาบัตรราคาถูกสุด
          const minPrice = item.ticket_zones?.length 
            ? Math.min(...item.ticket_zones.map(z => z.priceperTick)) 
            : 0;

          // จัดรูปแบบวันที่
          const dateObj = new Date(item.rental_start);
          const dateStr = dateObj.toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          });

          return {
            id: item.Event_id,
            title: item.eventName,
            date: dateStr.toUpperCase(),
            venueTh: item.hall?.Hall_Name || "ไม่ระบุสถานที่",
            venueEn: item.hall?.Hall_Name || "Venue not specified",
            price: minPrice > 0 ? `฿${minPrice.toLocaleString()}` : "Coming Soon",
            image: item.bannerImage 
              ? `http://127.0.0.1:8000/storage/${item.bannerImage}`
              : "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=400&q=80",
            
            // ✅ เรียกฟังก์ชันแปลงสถานะ
            status: mapStatusToEnglish(item.eventStatus), 
          };
        });

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  return (
    <main className="min-h-screen bg-[#0B0F14] relative overflow-hidden selection:bg-pink-500/30 selection:text-white pt-20">
      
      {/* Background Effect */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
          <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10">
        <Hero />

        <div className="max-w-7xl mx-auto px-6 py-8 pb-16">
          
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

          {/* Grid แสดงข้อมูล */}
          {loading ? (
            <div className="text-white text-center py-20 animate-pulse">กำลังโหลดข้อมูลคอนเสิร์ต...</div>
          ) : events.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {events.slice(0, 5).map((event) =>(
                 // ✅ แก้ไข: ส่ง Props ทีละตัวแทนการใช้ {...event} (แก้ Error เส้นแดง)
                 <EventCard 
                    key={event.id}
                    id={event.id}
                    title={event.title}
                    date={event.date}
                    venueTh={event.venueTh}
                    venueEn={event.venueEn}
                    price={event.price}
                    image={event.image}
                    status={event.status} 
                 />
              ))}
            </div>
          ) : (
             <div className="text-gray-500 text-center py-20">ยังไม่มีรายการคอนเสิร์ตในขณะนี้</div>
          )}

          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8"></div>
          <UpcomingScroll />
          
          <div className="mt-2">
            <CategoryIcons />
          </div>

        </div>
      </div>
    </main>
  );
}