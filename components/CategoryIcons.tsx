"use client";
import Link from "next/link";
import { Mic2, Music, Users, Drama, Music2 } from "lucide-react";
// ✅ 1. Import Hook
import { useLanguage } from "@/context/LanguageContext";

export default function CategoryIcons() {
  // ✅ 2. เรียกใช้ Hook
  const { t } = useLanguage();

  const categories = [
    { 
      id: "concert", 
      name: t.cat_concert, 
      icon: <Mic2 size={28} />, 
      theme: {
        hoverBorder: "group-hover:border-blue-500",
        hoverText: "group-hover:text-blue-400",
        hoverShadow: "group-hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]",
        hoverBg: "group-hover:bg-blue-500/20"
      },
      // ✅ แก้ลิงก์ให้ไปหน้า Category ตาม slug เพื่อแยกหมวดหมู่
      link: "/category/concert" 
    },
    { 
      id: "fest", 
      name: t.cat_fest, 
      icon: <Music size={28} />, 
      theme: {
        hoverBorder: "group-hover:border-red-500",
        hoverText: "group-hover:text-red-400",
        hoverShadow: "group-hover:shadow-[0_0_25px_rgba(239,68,68,0.8)]",
        hoverBg: "group-hover:bg-red-500/20"
      },
      link: "/category/festival" 
    },
    { 
      id: "fanmeet", 
      name: t.cat_fanmeet, 
      icon: <Users size={28} />, 
      theme: {
        hoverBorder: "group-hover:border-pink-500",
        hoverText: "group-hover:text-pink-400",
        hoverShadow: "group-hover:shadow-[0_0_25px_rgba(236,72,153,0.8)]",
        hoverBg: "group-hover:bg-pink-500/20"
      },
      link: "/category/fanmeet" 
    },
    { 
      id: "theater", 
      name: t.cat_theater, 
      icon: <Drama size={28} />, 
      theme: {
        hoverBorder: "group-hover:border-purple-500",
        hoverText: "group-hover:text-purple-400",
        hoverShadow: "group-hover:shadow-[0_0_25px_rgba(168,85,247,0.8)]",
        hoverBg: "group-hover:bg-purple-500/20"
      },
      link: "/category/theater" 
    },
    { 
      id: "orch", 
      name: t.cat_orch, 
      icon: <Music2 size={28} />, 
      theme: {
        hoverBorder: "group-hover:border-cyan-500",
        hoverText: "group-hover:text-cyan-400",
        hoverShadow: "group-hover:shadow-[0_0_25px_rgba(6,182,212,0.8)]",
        hoverBg: "group-hover:bg-cyan-500/20"
      },
      link: "/category/orchestra" 
    },
  ];

  return (
    <div className="py-10 w-full">
      <h3 className="text-white font-bold text-xl mb-4 px-2 flex items-center gap-3">
        <span className="w-1.5 h-6 bg-gradient-to-b from-blue-500 to-purple-600 rounded-full inline-block"></span>
        {t.browse_category} 
      </h3>
      
      {/* Design เดิมที่คุณต้องการ เป๊ะตามรูปภาพที่ส่งมา */}
      <div className="flex overflow-x-auto pt-10 pb-6 gap-4 md:flex md:justify-center md:gap-12 scrollbar-hide px-4">
        {categories.map((cat) => (
          <Link key={cat.id} href={cat.link} className="flex flex-col items-center gap-4 group min-w-[90px]">
            
            <div className={`
              relative w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center
              border-2 border-white/5 bg-[#1A1F26] text-gray-500
              transition-all duration-300 ease-out
              group-hover:scale-110 group-hover:-translate-y-2
              ${cat.theme.hoverBorder}
              ${cat.theme.hoverText}
              ${cat.theme.hoverShadow}
              ${cat.theme.hoverBg}
            `}>
              <div className="transition-transform duration-300 group-hover:scale-110">
                {cat.icon}
              </div>
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            
            <span className="text-sm text-gray-500 font-medium transition-colors group-hover:text-white text-center tracking-wide">
              {cat.name}
            </span>
            
          </Link>
        ))}
      </div>
    </div>
  );
}