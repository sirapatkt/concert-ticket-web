"use client";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Ticket, User, Info, Building2, AlignLeft, Image as ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";

// ✅ 1. เพิ่ม bannerImage และ image เข้าไปใน Interface เพื่อรองรับชื่อจาก Database
interface EventDetailResponse {
  event: {
    id: number;
    name: string;
    date: string;
    location: string;
    description: string; 
    status: string;
    poster_url?: string | null; 
    bannerImage?: string | null; 
    image?: string | null;       
  };
  organizer: {
    id: number;
    name: string;
    code: string;
  };
  sales: {
    total_tickets: number;
    sold_tickets: number;
    total_revenue: number;
  };
}

export default function AdminEventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.detail_ad || params.id; // เผื่อชื่อพารามิเตอร์

  const [loading, setLoading] = useState(true);
  const [eventData, setEventData] = useState<EventDetailResponse | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const fetchEventDetail = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        const res = await fetch(`http://localhost:8000/api/admin/events/${eventId}`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });

        if (res.ok) {
          const data = await res.json();
          setEventData(data);
        } else {
          console.error("Failed to fetch event detail");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [eventId]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB' }).format(amount);
  };

  // ✅ 2. ฟังก์ชันจัดการ URL รูปภาพให้ถูกต้องเสมอ
  const getPosterUrl = () => {
    if (!eventData) return null;
    const rawUrl = eventData.event.poster_url || eventData.event.bannerImage || eventData.event.image;
    if (!rawUrl) return null;
    if (rawUrl.startsWith('http')) return rawUrl;
    return `http://127.0.0.1:8000/storage/${rawUrl}`;
  };

  const finalPosterSrc = getPosterUrl();

  return (
    <div className="p-8 max-w-7xl mx-auto w-full text-white animate-in fade-in duration-300 font-sans">
      
      <button 
        onClick={() => router.back()} 
        className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-6 group w-fit"
      >
        <div className="bg-white/5 p-1.5 rounded-lg group-hover:bg-white/10 transition-colors">
          <ArrowLeft size={18} />
        </div>
        <span className="text-sm font-medium">ย้อนกลับ</span>
      </button>

      {/* หัวข้อหน้า */}
      <div className="mb-8 flex items-start justify-between border-b border-white/5 pb-6">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            รายละเอียดอีเวนต์
            <span className="text-sm font-normal bg-blue-500/10 text-blue-400 border border-blue-500/20 px-3 py-1 rounded-full">
              ID: {eventId}
            </span>
            {/* ป้ายบอกสถานะงาน */}
            {eventData && (
              <span className={`text-sm font-medium px-3 py-1 rounded-full border ${
                eventData.event.status === 'Active' || eventData.event.status === 'Selling' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                eventData.event.status === 'Pending' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                'bg-red-500/10 text-red-400 border-red-500/20'
              }`}>
                {eventData.event.status}
              </span>
            )}
          </h1>
          <p className="text-slate-400 text-sm mt-2 leading-relaxed">ดูข้อมูลการจัดการ ยอดขาย และสถานะของอีเวนต์นี้ เพื่อทำการตรวจสอบและอนุมัติ</p>
        </div>

        <div className="flex gap-3">
           <button className="bg-white/5 text-slate-300 hover:bg-red-500/20 hover:text-red-400 px-5 py-2.5 rounded-xl transition-all text-sm font-medium border border-white/10">
              ระงับการขาย
           </button>
           <button className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl transition-all text-sm font-medium shadow-[0_0_15px_rgba(59,130,246,0.4)]">
              อนุญาตให้ขายตั๋ว
           </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400">กำลังโหลดข้อมูล...</div>
      ) : !eventData ? (
        <div className="flex justify-center items-center py-20 text-red-400">ไม่พบข้อมูลอีเวนต์</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* ✅ 3. ส่วนแสดงโปสเตอร์งาน (Poster) */}
          <div className="lg:col-span-1 space-y-4">
             <div className="flex items-center gap-2 mb-3">
               <ImageIcon size={18} className="text-blue-500" />
               <h3 className="text-lg font-bold text-white">โปสเตอร์งาน (Poster)</h3>
             </div>
             <div className="bg-[#161B22] p-2 rounded-2xl border border-white/5 shadow-xl">
               {finalPosterSrc ? (
                 <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-[#0B0F14]">
                   {/* ใช้ <img> มาตรฐานเพื่อลดปัญหาจุกจิกของ Next Image */}
                   <img 
                     src={finalPosterSrc}
                     alt={`Poster for ${eventData.event.name}`}
                     className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                   />
                 </div>
               ) : (
                 <div className="flex flex-col items-center justify-center aspect-[3/4] bg-[#0B0F14] rounded-xl border-2 border-dashed border-white/10 text-slate-600 space-y-2">
                    <ImageIcon size={40} strokeWidth={1} />
                    <p className="text-xs">ไม่มีรูปโปสเตอร์</p>
                 </div>
               )}
             </div>
          </div>

          <div className="lg:col-span-3 space-y-8">
            
            {/* ข้อมูลทั่วไป */}
            <div className="bg-[#161B22] p-7 rounded-2xl border border-white/5 shadow-lg">
              <h3 className="text-lg font-bold flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                <Info className="text-blue-500" size={20} />
                ข้อมูลทั่วไป
              </h3>
              <div className="space-y-6">
                 <div className="bg-[#0B0F14] p-5 rounded-xl border border-white/5">
                    <p className="text-xs text-slate-500 mb-1.5">ชื่องาน (Event Name)</p>
                    <p className="text-xl font-bold text-white leading-tight">{eventData.event.name}</p>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-5">
                    <div className="flex items-start gap-3.5 bg-[#0B0F14] p-4 rounded-xl border border-white/5">
                      <div className="mt-1 bg-white/5 p-2 rounded-lg text-blue-400"><Calendar size={18} /></div>
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">วันที่แสดง</p>
                        <p className="text-sm font-medium text-white">{eventData.event.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3.5 bg-[#0B0F14] p-4 rounded-xl border border-white/5">
                      <div className="mt-1 bg-white/5 p-2 rounded-lg text-blue-400"><MapPin size={18} /></div>
                      <div>
                        <p className="text-xs text-slate-500 mb-0.5">สถานที่จัดงาน</p>
                        <p className="text-sm font-medium text-white">{eventData.event.location}</p>
                      </div>
                    </div>
                 </div>

                 {/* ส่วนรายละเอียดงาน (Description) */}
                 <div className="mt-7 border-t border-white/5 pt-6">
                   <div className="flex items-center gap-2 mb-3.5">
                     <AlignLeft size={17} className="text-slate-400" />
                     <p className="text-sm font-medium text-slate-300">รายละเอียดงาน (Description)</p>
                   </div>
                   <div className="bg-[#0B0F14] p-5 rounded-xl border border-white/5">
                     <p className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap custom-scrollbar max-h-60 overflow-y-auto">
                       {/* ดักเผื่อมี ||GRID_DATA|| ติดมาด้วยให้ตัดออก */}
                       {eventData.event.description?.split("||GRID_DATA||")[0]}
                     </p>
                   </div>
                 </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* ข้อมูลผู้จัดงาน */}
                <div className="md:col-span-1 bg-[#161B22] p-6 rounded-2xl border border-white/5 h-fit shadow-lg">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                    <Building2 className="text-pink-500" size={20} />
                    ผู้จัดงาน (Organizer)
                  </h3>
                  <div className="space-y-4">
                     <div className="flex items-center gap-3.5 bg-[#0B0F14] p-4 rounded-xl border border-white/5">
                       <div className="w-11 h-11 bg-pink-500/10 text-pink-500 rounded-full flex items-center justify-center shrink-0">
                         <User size={22} />
                       </div>
                       <div className="overflow-hidden">
                         <p className="text-sm font-bold text-white truncate">{eventData.organizer.name}</p>
                         <p className="text-xs text-slate-500 mt-0.5 truncate">{eventData.organizer.code}</p>
                       </div>
                     </div>
                     <button onClick={() => router.back()} className="w-full text-xs text-center py-2.5 bg-white/5 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors mt-2 font-medium border border-white/5">
                       ย้อนกลับไปดูข้อมูลผู้จัดงาน
                     </button>
                  </div>
                </div>

                {/* ข้อมูลยอดขาย (สรุป) */}
                <div className="md:col-span-2 bg-[#161B22] p-6 rounded-2xl border border-white/5 shadow-lg">
                  <h3 className="text-lg font-bold flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                    <Ticket className="text-emerald-500" size={20} />
                    สรุปยอดขายตั๋ว (Overview)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                     <div className="bg-[#0B0F14] p-5 rounded-xl border border-white/5 text-center">
                        <p className="text-xs text-slate-500 mb-2">ตั๋วทั้งหมด (ใบ)</p>
                        <p className="text-2xl font-bold text-white">{eventData.sales.total_tickets.toLocaleString()}</p>
                     </div>
                     <div className="bg-[#0B0F14] p-5 rounded-xl border border-white/5 text-center border-b-2 border-b-emerald-500/50">
                        <p className="text-xs text-slate-500 mb-2">ขายแล้ว (ใบ)</p>
                        <p className="text-2xl font-bold text-emerald-400">{eventData.sales.sold_tickets.toLocaleString()}</p>
                     </div>
                     <div className="bg-[#0B0F14] p-5 rounded-xl border border-white/5 text-center border-b-2 border-b-blue-500/50">
                        <p className="text-xs text-slate-500 mb-2">รายได้รวม (THB)</p>
                        <p className="text-2xl font-bold text-blue-400">{formatCurrency(eventData.sales.total_revenue)}</p>
                     </div>
                  </div>
                  <div className="mt-5 text-center text-xs text-slate-500 bg-[#0B0F14] p-3 rounded-lg border border-white/5">
                    * ข้อมูลยอดขายเป็นข้อมูลจำลองชั่วคราว จนกว่าระบบขายตั๋วจะเสร็จสมบูรณ์
                  </div>
                </div>

            </div>

          </div>

        </div>
      )}
    </div>
  );
}