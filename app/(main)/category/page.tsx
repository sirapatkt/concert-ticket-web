"use client";
import Link from "next/link";
import { Mic2, Music, Users, Drama, Music2, Sparkles, ArrowRight } from "lucide-react";

export default function CategoryPage() {
  
  const categories = [
    { 
      id: "concert", 
      title: "Concerts", 
      subtitle: "คอนเสิร์ต",
      description: "สัมผัสพลังเสียงและโชว์สุดอลังการจากศิลปินที่คุณรัก",
      icon: <Mic2 size={32} />, 
      color: "from-blue-500 to-cyan-400",
      shadow: "shadow-blue-500/40",
      glow: "group-hover:shadow-blue-500/50",
      link: "/category/concert" 
    },
    { 
      id: "music-festival", 
      title: "Music Festivals", 
      subtitle: "เทศกาลดนตรี",
      description: "สนุกสุดเหวี่ยงไปกับมหกรรมดนตรีและศิลปินมากมาย",
      icon: <Music size={32} />, 
      color: "from-purple-500 to-pink-500",
      shadow: "shadow-purple-500/40",
      glow: "group-hover:shadow-purple-500/50",
      link: "/category/music-festival" 
    },
    { 
      id: "fanmeet", 
      title: "Fan Meetings", 
      subtitle: "แฟนมีตติ้ง",
      description: "ช่วงเวลาสุดพิเศษที่จะได้ใกล้ชิดกับเมนคนโปรดของคุณ",
      icon: <Users size={32} />, 
      color: "from-yellow-400 to-orange-500",
      shadow: "shadow-orange-500/40",
      glow: "group-hover:shadow-orange-500/50",
      link: "/category/fanmeet" 
    },
    { 
      id: "theater", 
      title: "Theater", 
      subtitle: "ละครเวที",
      description: "ตื่นตาตื่นใจไปกับเรื่องราวและการแสดงสดบนเวที",
      icon: <Drama size={32} />, 
      color: "from-red-500 to-rose-400",
      shadow: "shadow-red-500/40",
      glow: "group-hover:shadow-red-500/50",
      link: "/category/theater" 
    },
    { 
      id: "classical", 
      title: "Classical", 
      subtitle: "ออร์เคสตรา",
      description: "ดื่มด่ำกับสุนทรียภาพทางดนตรีคลาสสิกและแจ๊ส",
      icon: <Music2 size={32} />, 
      color: "from-indigo-400 to-blue-600",
      shadow: "shadow-indigo-500/40",
      glow: "group-hover:shadow-indigo-500/50",
      link: "/category/classical" 
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070A] pt-32 pb-20 px-6 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Sparkles size={12} /> Explore Experiences
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            หมวดหมู่งานแสดง <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">ทั้งหมด</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto font-light">
            เลือกประเภทงานที่คุณสนใจ เพื่อค้นหาประสบการณ์ทางดนตรีและการแสดงที่ตรงใจคุณที่สุด
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-center">
          {categories.map((cat, index) => (
            <Link 
              key={cat.id} 
              href={cat.link}
              // ✅ เอา class 'border' ออกทั้งหมด
              className={`
                group relative bg-[#12141a] rounded-2xl p-6 md:p-8 
                transition-all duration-300 overflow-hidden
                hover:bg-[#1A1F2C] hover:-translate-y-2 hover:shadow-2xl hover:scale-[1.02]
                ${cat.glow}
              `}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* แสงพื้นหลัง (Opacity 20%) */}
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
              
              <div className="flex items-start justify-between mb-6">
                {/* Icon Box */}
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cat.color} p-[1px] ${cat.shadow} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                   <div className="w-full h-full bg-[#12141a] rounded-[15px] flex items-center justify-center text-white group-hover:bg-transparent transition-colors">
                      {cat.icon}
                   </div>
                </div>
                
                {/* Arrow */}
                <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-gray-500 group-hover:bg-white group-hover:text-black transition-all">
                  <ArrowRight size={16} className="-rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                </div>
              </div>

              {/* Text Content */}
              <div className="space-y-2 relative z-10">
                <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-200 transition-all">
                  {cat.title}
                </h3>
                <p className="text-sm font-medium text-blue-500/80 uppercase tracking-wider group-hover:text-blue-400">
                  {cat.subtitle}
                </p>
                <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-300 transition-colors pt-2 border-t border-white/5 mt-4 group-hover:border-white/20">
                  {cat.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}