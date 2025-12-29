"use client";
import Link from "next/link";
import { Calendar, MapPin, Ticket } from "lucide-react";
// ✅ 1. Import Hook
import { useLanguage } from "@/context/LanguageContext";

// กำหนดประเภทข้อมูลที่การ์ดรับเข้ามา (Props)
interface EventCardProps {
  id: number;
  title: string;
  date: string;
  venue: string;
  price: string;
  image: string;
  status?: "Available" | "Sold Out" | "Selling Fast";
}

export default function EventCard({ id, title, date, venue, price, image, status = "Available" }: EventCardProps) {
  // ✅ 2. เรียกใช้ Hook
  const { t } = useLanguage();

  return (
    <Link href={`/event/${id}`} className="group block bg-[#161B22] rounded-2xl overflow-hidden border border-white/10 hover:border-purple-500/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(168,85,247,0.2)] hover:-translate-y-1">
      
      {/* ส่วนรูปภาพ */}
      <div className="relative aspect-[3/4] overflow-hidden">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
        />
        
        {/* Badge สถานะบัตร (ปรับสีเล็กน้อยให้สดขึ้น) */}
        <div className="absolute top-3 right-3">
          {status === "Sold Out" && (
            <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wide">Sold Out</span>
          )}
          {status === "Selling Fast" && (
            <span className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded shadow-lg uppercase tracking-wide">Selling Fast</span>
          )}
        </div>

        {/* Overlay ไล่สีดำขึ้นมาจากด้านล่าง */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent opacity-90"></div>
      </div>

      {/* ส่วนเนื้อหา */}
      <div className="p-4 relative -mt-12 bg-gradient-to-t from-[#161B22] via-[#161B22] to-transparent pt-12">
        {/* วันที่ - เปลี่ยนเป็นสี Cyan สว่างๆ */}
        <div className="flex items-center gap-2 text-cyan-400 text-xs font-bold mb-2 uppercase tracking-wider">
          <Calendar size={12} />
          {date}
        </div>

        {/* ชื่อคอนเสิร์ต - Hover แล้วเป็นสีม่วง */}
        <h3 className="text-white text-lg font-bold leading-tight mb-3 group-hover:text-purple-400 transition-colors line-clamp-2 h-14">
          {title}
        </h3>

        {/* สถานที่ */}
        <div className="flex items-center gap-2 text-gray-400 text-sm mb-4">
          <MapPin size={14} className="flex-shrink-0" />
          <span className="truncate">{venue}</span>
        </div>

        {/* เส้นคั่น */}
        <div className="border-t border-white/10 my-3"></div>

        {/* ราคา & ปุ่ม */}
        <div className="flex items-center justify-between">
          <div className="text-gray-300 text-sm">
            {/* ✅ 3. ใช้ตัวแปร t.price_start */}
            {t.price_start} <br />
            <span className="text-white font-bold text-lg">{price}</span>
          </div>
          {/* ปุ่ม Ticket - เปลี่ยนเป็น Gradient ฟ้า-ม่วง */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center text-white group-hover:scale-110 transition-transform shadow-lg">
            <Ticket size={18} />
          </div>
        </div>
      </div>
    </Link>
  );
}