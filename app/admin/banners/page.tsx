"use client";

import { useState } from "react";
import { 
  Plus, Image as ImageIcon, Trash2, Edit2, 
  Eye, EyeOff, Link as LinkIcon, UploadCloud 
} from "lucide-react";

// Mock Data
const initialBanners = [
  { 
    id: 1, 
    title: "Jeff Satur: Space Shuttle No.8 Concert", 
    image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000",
    link: "/event/jeff-satur-space-shuttle", 
    status: "active",
    order: 1
  },
  { 
    id: 2, 
    title: "Summer Sonic Bangkok 2024", 
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000", 
    link: "/event/summer-sonic-bkk", 
    status: "active",
    order: 2
  },
  { 
    id: 3, 
    title: "Early Bird Promotion -50% Off All Tickets", 
    image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000", 
    link: "/promotion/earlybird", 
    status: "inactive",
    order: 3
  },
];

export default function BannerManagementPage() {
  const [banners, setBanners] = useState(initialBanners);

  const toggleStatus = (id: number) => {
    setBanners(prev => prev.map(banner => 
      banner.id === id 
        ? { ...banner, status: banner.status === "active" ? "inactive" : "active" }
        : banner
    ));
  };

  const handleDelete = (id: number) => {
    if(confirm("คุณต้องการลบแบนเนอร์นี้ใช่หรือไม่?")) {
      setBanners(prev => prev.filter(b => b.id !== id));
    }
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-[#0B0F14] text-white font-sans animate-in fade-in">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ImageIcon className="text-pink-500" /> จัดการแบนเนอร์
          </h1>
          <p className="text-gray-400 text-sm mt-1">จัดการรูปภาพสไลด์หน้าแรกของเว็บไซต์</p>
        </div>
        
        <button className="w-full sm:w-auto flex justify-center items-center gap-2 bg-[#E60023] hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-900/20 active:scale-95 text-sm">
          <Plus size={18} /> เพิ่มแบนเนอร์ใหม่
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* รายการแบนเนอร์ */}
        <div className="xl:col-span-2 space-y-4">
          {banners.map((banner) => (
            <div 
              key={banner.id} 
              className={`group bg-[#161B22] border ${banner.status === 'active' ? 'border-white/10' : 'border-white/5 opacity-60'} rounded-2xl p-4 flex flex-col md:flex-row gap-5 items-start transition-all hover:border-pink-500/30 hover:shadow-lg`}
            >
              
              {/* Image Section */}
              <div className="w-full md:w-56 h-40 md:h-36 rounded-xl overflow-hidden bg-black relative shrink-0 border border-white/5">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                
                <div className="absolute top-2 left-2">
                    {banner.status === 'active' ? (
                        <span className="px-2 py-1 rounded-md text-[10px] bg-green-500 text-white font-bold shadow-sm">ACTIVE</span>
                    ) : (
                        <span className="px-2 py-1 rounded-md text-[10px] bg-black/80 text-gray-300 font-bold border border-white/10">HIDDEN</span>
                    )}
                </div>
              </div>

              {/* Content Section */}
              <div className="flex-1 w-full min-w-0 flex flex-col justify-between h-full py-1">
                <div>
                  <h3 className="font-bold text-lg text-gray-100 leading-snug line-clamp-2 mb-2" title={banner.title}>
                      {banner.title}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-400 bg-black/20 px-3 py-2 rounded-lg w-full md:w-fit max-w-full mb-4 border border-white/5">
                      <LinkIcon size={14} className="shrink-0 text-gray-500" /> 
                      <span className="truncate">{banner.link}</span>
                  </div>
                </div>

                {/* Buttons Group: แก้ตรงนี้ครับ ให้เรียงกัน 3 ปุ่มสวยๆ */}
                <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/5 mt-auto">
                    {/* ปุ่ม 1: ซ่อน/แสดง */}
                    <button 
                        onClick={() => toggleStatus(banner.id)}
                        className={`flex-1 sm:flex-none justify-center h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${
                            banner.status === 'active' 
                            ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                            : 'bg-green-600 text-white hover:bg-green-500'
                        }`}
                    >
                        {banner.status === 'active' ? <><EyeOff size={14}/> ซ่อน</> : <><Eye size={14}/> แสดง</>}
                    </button>
                    
                    {/* ปุ่ม 2: แก้ไข */}
                    <button className="flex-1 sm:flex-none justify-center h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-2 bg-blue-500/10 text-blue-400 hover:bg-blue-500 hover:text-white transition-all">
                        <Edit2 size={14}/> แก้ไข
                    </button>
                    
                    {/* ปุ่ม 3: ลบ (ปรับให้เหมือนเพื่อนแล้ว!) */}
                    <button 
                        onClick={() => handleDelete(banner.id)}
                        // เอา sm:ml-auto ออก และใส่ flex-1 sm:flex-none เข้าไปแทน
                        className="flex-1 sm:flex-none justify-center h-9 px-4 rounded-lg text-xs font-bold flex items-center gap-2 bg-red-500/10 text-red-400 hover:bg-red-600 hover:text-white transition-all"
                    >
                        <Trash2 size={14}/> ลบ
                    </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar (Right) */}
        <div className="space-y-6">
            <div className="bg-[#161B22] p-6 rounded-2xl border border-white/10 text-center sticky top-8">
                <div className="border-2 border-dashed border-gray-700 rounded-xl p-8 hover:border-pink-500/50 hover:bg-pink-500/5 transition-all cursor-pointer group">
                    <UploadCloud size={32} className="mx-auto text-gray-500 group-hover:text-pink-500 transition-colors mb-3" />
                    <p className="text-sm font-bold text-gray-300">คลิกเพื่ออัปโหลด</p>
                    <p className="text-xs text-gray-500 mt-1">หรือลากไฟล์มาวางที่นี่</p>
                </div>
            </div>

            <div className="hidden xl:block bg-[#161B22] p-6 rounded-2xl border border-white/5">
                <h3 className="font-bold mb-4 text-gray-300 text-sm">💡 ข้อแนะนำ</h3>
                <ul className="text-xs text-gray-400 space-y-3 list-disc pl-4 marker:text-pink-500">
                    <li>ขนาดภาพแนะนำ <strong>1920 x 600 px</strong></li>
                    <li>ขนาดไฟล์ไม่เกิน <strong>2MB</strong></li>
                </ul>
            </div>
        </div>

      </div>
    </div>
  );
}