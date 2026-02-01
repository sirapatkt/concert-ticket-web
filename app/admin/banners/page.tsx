"use client";

import { useState } from "react";
import { 
  Plus, Image as ImageIcon, Trash2, Edit2, 
  Eye, EyeOff, Link as LinkIcon, UploadCloud 
} from "lucide-react";

// Mock Data: ข้อมูลแบนเนอร์จำลอง
const initialBanners = [
  { 
    id: 1, 
    title: "Jeff Satur: Space Shuttle No.8", 
    image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000",
    link: "/event/1", 
    status: "active",
    order: 1
  },
  { 
    id: 2, 
    title: "Summer Sonic Bangkok 2024", 
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000", 
    link: "/event/5", 
    status: "active",
    order: 2
  },
  { 
    id: 3, 
    title: "Early Bird Promotion -50%", 
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000", 
    link: "/promotion/earlybird", 
    status: "inactive",
    order: 3
  },
];

export default function BannerManagementPage() {
  const [banners, setBanners] = useState(initialBanners);

  // ฟังก์ชันสลับสถานะ (Active <-> Inactive)
  const toggleStatus = (id: number) => {
    setBanners(prev => prev.map(banner => 
      banner.id === id 
        ? { ...banner, status: banner.status === "active" ? "inactive" : "active" }
        : banner
    ));
  };

  // ฟังก์ชันลบ
  const handleDelete = (id: number) => {
    if(confirm("คุณต้องการลบแบนเนอร์นี้ใช่หรือไม่?")) {
      setBanners(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <div className="p-8 min-h-screen bg-[#0B0F14] text-white space-y-8 font-sans animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="text-pink-500" /> จัดการแบนเนอร์ (Banners)
          </h1>
          <p className="text-gray-400 text-sm mt-1">จัดการรูปภาพสไลด์หน้าแรกของเว็บไซต์</p>
        </div>
        
        <button className="flex items-center gap-2 bg-[#E60023] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 active:scale-95">
          <Plus size={20} /> เพิ่มแบนเนอร์ใหม่
        </button>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* ฝั่งซ้าย: รายการแบนเนอร์ */}
        <div className="lg:col-span-2 space-y-4">
          {banners.map((banner) => (
            <div 
              key={banner.id} 
              className={`group relative bg-[#161B22] border ${banner.status === 'active' ? 'border-white/10' : 'border-white/5 opacity-60'} rounded-2xl p-4 flex gap-4 items-center transition-all hover:border-pink-500/30 hover:shadow-lg`}
            >
              {/* Drag Handle (ตกแต่ง) */}
              <div className="flex flex-col gap-1 px-2 cursor-grab text-gray-600 hover:text-gray-400">
                 <div className="w-1 h-1 rounded-full bg-current"></div>
                 <div className="w-1 h-1 rounded-full bg-current"></div>
                 <div className="w-1 h-1 rounded-full bg-current"></div>
              </div>

              {/* รูปภาพ */}
              <div className="w-48 h-28 rounded-xl overflow-hidden bg-black relative shrink-0">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                {banner.status === 'inactive' && (
                    <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                        <EyeOff className="text-gray-400" />
                    </div>
                )}
              </div>

              {/* ข้อมูล */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg truncate">{banner.title}</h3>
                    {banner.status === 'active' ? (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-green-500/20 text-green-400 font-bold border border-green-500/20">ACTIVE</span>
                    ) : (
                        <span className="px-2 py-0.5 rounded text-[10px] bg-gray-700 text-gray-400 font-bold border border-gray-600">HIDDEN</span>
                    )}
                </div>
                
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-3 bg-black/20 px-3 py-1.5 rounded-lg w-fit">
                    <LinkIcon size={12} /> 
                    <span className="truncate max-w-[200px]">{banner.link}</span>
                </div>

                {/* ปุ่ม Action */}
                <div className="flex gap-3">
                    <button 
                        onClick={() => toggleStatus(banner.id)}
                        className={`text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold transition-colors ${
                            banner.status === 'active' 
                            ? 'bg-gray-800 hover:bg-gray-700 text-gray-300' 
                            : 'bg-green-600 hover:bg-green-500 text-white'
                        }`}
                    >
                        {banner.status === 'active' ? <><EyeOff size={14}/> ซ่อน</> : <><Eye size={14}/> แสดง</>}
                    </button>
                    
                    <button className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                        <Edit2 size={14}/> แก้ไข
                    </button>
                    
                    <button 
                        onClick={() => handleDelete(banner.id)}
                        className="text-xs flex items-center gap-1 px-3 py-1.5 rounded-lg font-bold bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all ml-auto"
                    >
                        <Trash2 size={14}/> ลบ
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ฝั่งขวา: Preview / คำแนะนำ */}
        <div className="space-y-6">
            <div className="bg-gradient-to-b from-[#161B22] to-[#0B0F14] p-6 rounded-2xl border border-white/10 text-center">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <UploadCloud size={32} />
                </div>
                <h3 className="text-lg font-bold mb-2">อัปโหลดด่วน</h3>
                <p className="text-sm text-gray-400 mb-6">ลากไฟล์มาวางที่นี่ หรือกดเพื่อเลือกรูปภาพ<br/>(ขนาดแนะนำ 1920 x 600 px)</p>
                <button className="w-full py-3 border-2 border-dashed border-gray-600 rounded-xl text-gray-400 hover:border-pink-500 hover:text-pink-500 transition-colors font-bold text-sm">
                    เลือกรูปภาพ
                </button>
            </div>

            <div className="bg-[#161B22] p-6 rounded-2xl border border-white/5">
                <h3 className="font-bold mb-4 text-gray-300">💡 คำแนะนำ</h3>
                <ul className="text-sm text-gray-400 space-y-3 list-disc pl-4">
                    <li>ควรใช้รูปภาพแนวนอน อัตราส่วน <strong>16:9</strong> หรือ <strong>21:9</strong></li>
                    <li>ขนาดไฟล์ไม่ควรเกิน <strong>2MB</strong> เพื่อความเร็วในการโหลด</li>
                    <li>สามารถลากวาง (Drag & Drop) เพื่อจัดลำดับการแสดงผลได้</li>
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
}