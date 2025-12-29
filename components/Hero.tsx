"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Calendar, MapPin } from "lucide-react";
// ✅ 1. Import Hook
import { useLanguage } from "@/context/LanguageContext";

export default function Hero() {
  const { language } = useLanguage();
  const [current, setCurrent] = useState(0);

  // Mock Data
  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1920&auto=format&fit=crop",
      title: { th: "THE GRAND SYMPHONY 2026", en: "THE GRAND SYMPHONY 2026" },
      subtitle: { th: "สัมผัสประสบการณ์ดนตรีออร์เคสตราสุดยิ่งใหญ่แห่งปี", en: "Experience the greatest orchestral music of the year" },
      date: "15 JAN 2026",
      venue: { th: "มหิดลสิทธาคาร", en: "Prince Mahidol Hall" },
      category: { th: "คลาสสิก", en: "Classical" },
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1459749411177-d4a428c389f5?q=80&w=1920&auto=format&fit=crop",
      title: { th: "NEON VIBES FESTIVAL", en: "NEON VIBES FESTIVAL" },
      subtitle: { th: "ปลดปล่อยความมันส์กับ DJ ระดับโลกตลอด 3 วันเต็ม", en: "Unleash the fun with world-class DJs for 3 full days" },
      date: "12-14 FEB 2026",
      venue: { th: "อิมแพ็ค อารีน่า", en: "Impact Arena" },
      category: { th: "เฟสติวัล", en: "Festival" },
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1503095392237-5985e5a9536e?q=80&w=1920&auto=format&fit=crop",
      title: { th: "PHANTOM OF THE OPERA", en: "PHANTOM OF THE OPERA" },
      subtitle: { th: "ละครเวทีอมตะนิรันดร์กาล กลับมาอีกครั้งที่เมืองไทย", en: "The timeless musical returns to Thailand" },
      date: "01 MAR 2026",
      venue: { th: "เมืองไทยรัชดาลัย", en: "Muangthai Rachadalai" },
      category: { th: "ละครเวที", en: "Musical" },
    },
  ];

  // Auto Slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const prevSlide = () => setCurrent(current === 0 ? slides.length - 1 : current - 1);
  const nextSlide = () => setCurrent(current === slides.length - 1 ? 0 : current + 1);

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
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/50 to-transparent"></div>
        </div>
      ))}

      {/* Content (Text) */}
      <div className="absolute inset-0 flex items-center justify-center px-4 mt-16">
        <div className="text-center max-w-4xl space-y-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
          
          {/* Badge: เปลี่ยนเป็นสี Cyan สว่างๆ */}
          <span className="inline-block px-4 py-1 rounded-full border border-cyan-500/30 text-cyan-400 text-sm font-bold tracking-wider uppercase bg-cyan-500/10 backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)]">
            {slides[current].category[language]}
          </span>

          {/* Title: เพิ่ม Glow สีฟ้าอมม่วง */}
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter drop-shadow-[0_0_25px_rgba(139,92,246,0.6)]">
            {slides[current].title[language]}
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-2xl text-gray-200 font-light drop-shadow-md">
            {slides[current].subtitle[language]}
          </p>

          {/* Info & Button */}
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 mt-8">
            <div className="flex items-center gap-2 text-gray-300">
              {/* Calendar Icon: สี Cyan */}
              <Calendar className="text-cyan-400" size={20} />
              <span>{slides[current].date}</span>
            </div>
            <div className="flex items-center gap-2 text-gray-300">
              {/* MapPin Icon: สี Pink (แทนสีแดง) */}
              <MapPin className="text-pink-500" size={20} />
              <span>{slides[current].venue[language]}</span>
            </div>
          </div>

          <div className="pt-4">
            {/* Button: เปลี่ยนเป็น Gradient ฟ้า->ม่วง */}
            <button className="px-10 py-3.5 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white font-bold rounded-full transition-all shadow-[0_0_20px_rgba(124,58,237,0.4)] hover:shadow-[0_0_30px_rgba(124,58,237,0.6)] transform hover:-translate-y-1">
              {language === "th" ? "ซื้อบัตรเลย" : "Buy Ticket"}
            </button>
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

      {/* Dots Indicators: สี Gradient */}
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