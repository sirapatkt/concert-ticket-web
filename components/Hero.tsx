"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, MapPin, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

// Interface สำหรับข้อมูล API
interface ApiEvent {
  Event_id: number;
  eventName: string;
  rental_start: string;
  bannerImage: string | null;
  eventStatus: string;
  eventType?: string;
  hall?: {
    Hall_Name: string;
  };
}

interface SlideData {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  date: string;
  venue: string;
  category: string;
}

export default function Hero() {
  const { language } = useLanguage();
  const [current, setCurrent] = useState(0);
  
  // State สำหรับเก็บข้อมูลจริงจาก API
  const [slides, setSlides] = useState<SlideData[]>([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchHeroEvents = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/public/events");
        if (!res.ok) throw new Error("Failed to fetch");
        
        const data: ApiEvent[] = await res.json();

        // 1. กรองสถานะที่ไม่ต้องการออก (เหมือนที่ทำในหน้า Home)
        // 2. เลือกมาแค่ 3 งานล่าสุด (.slice(0, 3)) เพื่อทำเป็นแบนเนอร์สไลด์
        const validEvents = data
          .filter((item) => item.eventStatus !== "กำลังเตรียม" && item.eventStatus !== "กำลังจะเตรียม")
          .slice(0, 3);

        const mappedSlides = validEvents.map((item) => {
          // แปลงวันที่
          const dateObj = new Date(item.rental_start);
          const dateStr = dateObj.toLocaleDateString("en-GB", {
            day: "2-digit", month: "short", year: "numeric",
          }).toUpperCase();

          // จัดการรูปภาพ (ดึงจาก Storage)
          const imageUrl = item.bannerImage 
            ? (item.bannerImage.startsWith('http') 
                ? item.bannerImage 
                : `http://127.0.0.1:8000/storage/${item.bannerImage}`) 
            : "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=1920&q=80"; // รูปสำรอง

          return {
            id: item.Event_id,
            image: imageUrl,
            title: item.eventName,
            // ใน DB เราไม่มี Subtitle ผมเลยใส่ข้อความเชิญชวนแบบ Dynamic ให้แทน
            subtitle: language === "th" ? "ห้ามพลาดกับประสบการณ์สุดพิเศษที่กำลังจะเกิดขึ้น!" : "Don't miss out on this spectacular experience!",
            date: dateStr,
            venue: item.hall?.Hall_Name || "TBA",
            category: item.eventType || "CONCERT",
          };
        });

        setSlides(mappedSlides);
      } catch (error) {
        console.error("Error fetching hero events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeroEvents();
  }, [language]);

  // Auto Slide (ทำงานเมื่อโหลดสไลด์เสร็จแล้ว)
  useEffect(() => {
    if (slides.length === 0) return;
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);
  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);

  // แสดงตอนกำลังโหลดข้อมูล
  if (loading) {
    return (
      <div className="w-full h-[600px] flex flex-col items-center justify-center bg-[#0B0F14] text-cyan-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p className="animate-pulse">Loading Highlight Events...</p>
      </div>
    );
  }

  // เผื่อกรณีที่ดึงมาแล้วไม่มีงานจัดแสดงเลย
  if (slides.length === 0) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-[#0B0F14] text-gray-500">
        No highlight events available.
      </div>
    );
  }

  return (
    <div className="relative w-full h-[600px] overflow-hidden group">
      {/* Background Images */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            index === current ? "opacity-100" : "opacity-0"
          }`}
        >
          {/* Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat transform transition-transform duration-[5000ms] scale-105"
            style={{ backgroundImage: `url(${slide.image})` }}
          ></div>
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/50 to-[#0B0F14]/20"></div>
        </div>
      ))}

      {/* Content (Text) */}
      <div className="absolute inset-0 flex items-center justify-center px-4 mt-16">
        <div className="text-center max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Badge */}
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm font-bold tracking-wider uppercase bg-cyan-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            {slides[current].category}
          </span>

          {/* Title */}
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(139,92,246,0.6)] uppercase line-clamp-2 leading-tight">
            {slides[current].title}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-gray-200 font-light drop-shadow-md">
            {slides[current].subtitle}
          </p>

          {/* Info & Button */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-gray-300">
              <Calendar className="text-cyan-400" size={20} />
              <span>{slides[current].date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              <MapPin className="text-pink-500" size={20} />
              <span>{slides[current].venue}</span>
            </div>
          </div>

          <div className="pt-4">
            <Link href={`/event/${slides[current].id}`}>
                <button className="px-10 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transform hover:-translate-y-1 cursor-pointer active:scale-95">
                {language === "th" ? "ซื้อบัตรเลย" : "Buy Ticket"}
                </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 hover:bg-black/50 border border-white/10 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110">
        <ChevronLeft size={30} />
      </button>
      <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-black/20 hover:bg-black/50 border border-white/10 text-white rounded-full backdrop-blur-md transition-all opacity-0 group-hover:opacity-100 hover:scale-110">
        <ChevronRight size={30} />
      </button>

      {/* Dots Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrent(index)}
            className={`h-3 rounded-full transition-all duration-300 ${
              index === current 
                ? "bg-gradient-to-r from-blue-500 to-pink-500 w-8" 
                : "bg-white/30 hover:bg-white w-3"
            }`}
          />
        ))}
      </div>
    </div>
  );
}