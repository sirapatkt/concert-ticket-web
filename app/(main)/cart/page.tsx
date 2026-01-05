"use client";
import Link from "next/link";
import { ShoppingCart, ArrowRight, Ticket } from "lucide-react";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const { cartCount } = useCart();

  // 🛡️ เช็คว่าถ้าไม่มีของในตะกร้า ให้โชว์หน้า Empty State
  if (cartCount === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 relative overflow-hidden">
        
        {/* แสง Ambient Glow ด้านหลัง */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* Icon ตะกร้าแบบมีแสง Glow */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 via-purple-600/30 to-pink-600/30 blur-3xl rounded-full"></div>
          <div className="relative w-24 h-24 bg-[#1A1F26] border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
            <ShoppingCart size={40} className="text-white" />
            
            {/* Badge เลข 0 สีแดงชมพู */}
            <div className="absolute top-0 right-0 w-6 h-6 bg-[#FF2D55] rounded-full border-2 border-[#1A1F26] flex items-center justify-center text-[10px] font-bold text-white translate-x-1/4 -translate-y-1/4">
              0
            </div>
          </div>

          {/* ✅ แก้ไข: เพิ่ม animate-bounce ให้ตัวโน้ตด้านบนเหมือนด้านล่างแล้วครับ */}
          <div className="absolute -top-2 -left-6 text-yellow-500/80 animate-bounce text-xl drop-shadow-sm">♫</div>
          <div className="absolute -bottom-2 -right-6 text-blue-500/80 animate-bounce text-xl drop-shadow-sm">♪</div>
        </div>

        {/* หัวข้อแบบ Normal (ตัวตรง) พร้อมไล่เฉดสี */}
        <h2 className="text-3xl font-black uppercase tracking-tighter mb-4 text-white">
          ตะกร้าของคุณ<span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4FACFE] via-[#A855F7] to-[#FF2D55] block">ยังว่างอยู่</span>
        </h2>
        
        <p className="text-gray-400 max-w-md mb-10 leading-relaxed">
          ดูเหมือนว่าคุณยังไม่ได้เลือกงานแสดงที่น่าสนใจเลย ลองไปดูงานแสดงยอดฮิตตอนนี้สิ!
        </p>

        {/* ปุ่มกลับหน้าหลัก - สีสันตามดีไซน์ */}
        <Link href="/">
          <button className="px-8 py-4 bg-gradient-to-r from-[#4FACFE] via-[#A855F7] to-[#FF2D55] rounded-full font-bold text-white hover:scale-105 transition-all shadow-lg shadow-purple-500/20 flex items-center gap-2 group">
            ไปเลือกชมงานแสดง <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </Link>

        {/* แนะนำหมวดหมู่สั้นๆ */}
        <div className="mt-16 flex gap-6 text-gray-500 text-sm font-bold uppercase tracking-widest overflow-x-auto w-full justify-center opacity-50">
           <span className="flex items-center gap-1"><Ticket size={14}/> คอนเสิร์ต</span>
           <span className="flex items-center gap-1"><Ticket size={14}/> แฟนมีตติ้ง</span>
           <span className="flex items-center gap-1"><Ticket size={14}/> ละครเวที</span>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 px-6">
      <h1 className="text-white">หน้าสรุปรายการสินค้าในตะกร้า (เมื่อมีของแล้ว)</h1>
    </div>
  );
}