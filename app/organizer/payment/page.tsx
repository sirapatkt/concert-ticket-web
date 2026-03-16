"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronLeft, 
  Timer, 
  CheckCircle2, 
  Loader2, 
  Receipt, 
  Building2,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  ChevronRight,
  Store,
  Eye
} from "lucide-react";

// 🌟 1. สร้าง Interface เพื่อกำหนด Type แทนการใช้ any
interface ZoneData {
  name?: string;
  zone_name?: string;
  price: number | string;
  total?: number;
  capacity?: number;
  remaining?: number;
}

interface EventData {
  name?: string;
  title?: string;
  description?: string;
  poster_url?: string;
  image?: string;
  location_name?: string;
  venue?: string;
  show_start_date?: string;
  show_end_date?: string;
  sale_start_date?: string;
  sale_end_date?: string;
  zones?: ZoneData[];
}

function OrganizerPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // รับค่า ID ของงาน และค่าธรรมเนียมจาก URL (เช่น ?id=52&amount=1500)
  const eventId = searchParams.get("id") || searchParams.get("eventId");
  const feeAmount = parseFloat(searchParams.get("amount") || "1500");

  // State สำหรับการชำระเงิน (QR Code & Timer)
  const [timeLeft, setTimeLeft] = useState(259200); // 259200 วินาที = 3 วัน
  const [isPaid, setIsPaid] = useState(false);
  const [loadingQr, setLoadingQr] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  // 🌟 2. เปลี่ยนจาก any เป็น EventData และ ZoneData ที่เราสร้างไว้ 🌟
  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [zones, setZones] = useState<ZoneData[]>([]);

  useEffect(() => {
    // 🚀 ยิง API ดึง QR Code จาก Omise
    const fetchOmiseQR = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/generate-promptpay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: feeAmount }),
        });
        const data = await response.json();

        if (data.success) {
          setQrCodeUrl(data.qr_code);
        } else {
          setError(data.error || 'เกิดข้อผิดพลาดในการสร้าง QR Code');
        }
      } catch (err) {
        setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ Laravel ได้');
      } finally {
        setLoadingQr(false);
      }
    };

    // 🚀 ยิง API ดึงข้อมูลอีเวนต์และโซนที่นั่งจาก Database
    const fetchEventDetails = async () => {
      if (!eventId) {
        setLoadingEvent(false);
        return;
      }
      try {
        // 🛑 แก้ URL นี้ให้ตรงกับ Route API ฝั่ง Laravel ของคุณนะครับ
        const response = await fetch(`http://localhost:8000/api/events/${eventId}`);
        const data = await response.json();
        
        if (response.ok) {
          // นำข้อมูลจาก DB มาใส่ใน State
          setEventData(data.event || data);
          setZones(data.zones || data.event?.zones || []);
        }
      } catch (err) {
        console.error("ไม่สามารถดึงข้อมูลอีเวนต์จากฐานข้อมูลได้", err);
      } finally {
        setLoadingEvent(false);
      }
    };

    fetchOmiseQR();
    fetchEventDetails();

    // Timer นับถอยหลัง
    const timer = setInterval(() => setTimeLeft(p => p <= 1 ? 0 : p - 1), 1000);
    return () => clearInterval(timer);
  }, [feeAmount, eventId]);

  // ฟังก์ชันแปลงวินาที เป็น วัน:ชั่วโมง:นาที:วินาที
  const formatTime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");

    if (days > 0) return `${days} วัน ${hours}:${minutes}:${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-200 pb-20 animate-in fade-in duration-500 font-sans">
      
      {/* 🌟 1. Header & ปุ่มกลับ */}
      <div className="max-w-6xl mx-auto pt-8 px-6">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 transition-colors text-sm font-medium border border-slate-700/50">
          <ChevronLeft size={16} /> กลับไปหน้าแดชบอร์ด
        </button>

        <div className="flex flex-col items-center justify-center text-center mt-8 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-purple-500/20">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3 tracking-wide">ชำระค่าบริการเปิดระบบ</h1>
          <p className="text-slate-400 text-sm max-w-md">งานของคุณได้รับการอนุมัติแล้ว กรุณาชำระเงินเพื่อเผยแพร่งานและเปิดระบบให้ผู้ซื้อสามารถกดบัตรได้</p>
          
          {!isPaid && (
            <div className="mt-6 inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-500 px-5 py-2.5 rounded-full font-mono font-bold text-lg">
              <Timer size={20} /> {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </div>

      {/* 🌟 2. Content Grid */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* =========================================
            🎟️ ฝั่งซ้าย: บิลชำระเงิน QR Code
        ========================================== */}
        <div className="lg:col-span-5 w-full">
          <div className="bg-[#161B22] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 bg-gradient-to-r from-purple-900/40 to-orange-900/20 border-b border-white/5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] text-purple-400 font-bold tracking-widest uppercase mb-1">EVENT PUBLISHING FEE</p>
                        <h2 className="text-lg font-bold text-white leading-snug">
                          {eventData?.name || eventData?.title || "กำลังโหลด..."}
                        </h2>
                    </div>
                    <Receipt size={24} className="text-gray-500" />
                </div>
            </div>
            
            <div className="p-8 flex flex-col items-center bg-white text-black min-h-[350px] justify-center relative">
                {loadingQr ? (
                  <div className="flex flex-col items-center text-slate-400">
                    <Loader2 className="animate-spin mb-3 text-purple-500" size={40} />
                    <p className="font-medium text-sm">กำลังสร้าง QR Code จาก Omise...</p>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center font-bold px-4 py-3 bg-red-50 rounded-lg w-full">{error}</div>
                ) : (
                  <div className={`transition-all duration-500 ${isPaid ? "opacity-30 blur-sm scale-95" : ""}`}>
                     {qrCodeUrl && <img src={qrCodeUrl} alt="Omise PromptPay QR" className="w-[220px] h-[220px] object-contain drop-shadow-sm" />}
                  </div>
                )}
                
                {isPaid && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 animate-in zoom-in duration-300">
                    <div className="bg-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/50">
                        <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <p className="text-emerald-600 font-bold mt-2">ชำระเงินสำเร็จ!</p>
                  </div>
                )}

                <div className="mt-8 text-center border-t-2 border-dashed border-slate-200 pt-6 w-full">
                    <p className="text-slate-500 text-sm font-bold">ยอดชำระสุทธิ</p>
                    <p className="text-5xl font-black text-purple-950 mt-1 tracking-tighter">฿{feeAmount.toLocaleString()}</p>
                </div>
            </div>
          </div>
        </div>

        {/* =========================================
            📋 ฝั่งขวา: สรุปรายละเอียดอีเวนต์ (ดึงจาก DB)
        ========================================== */}
        <div className="lg:col-span-7 space-y-6">
          
          {loadingEvent ? (
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="animate-spin mb-3 text-cyan-500" size={32} />
              <p>กำลังโหลดข้อมูลงานจากฐานข้อมูล...</p>
            </div>
          ) : (
            <>
              {/* Card 1: รูปภาพ + คำอธิบาย */}
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/3 shrink-0">
                  {eventData?.poster_url || eventData?.image ? (
                    <img 
                      src={eventData.poster_url || eventData.image} 
                      alt="Event Poster" 
                      className="w-full aspect-[4/5] object-cover rounded-xl shadow-lg border border-slate-700"
                    />
                  ) : (
                    <div className="w-full aspect-[4/5] bg-slate-800/40 rounded-xl shadow-inner border border-slate-700 flex flex-col items-center justify-center text-slate-500">
                      <Store size={40} className="mb-2 opacity-30" />
                      <span className="text-[10px] font-medium tracking-wide">รอรูปภาพจากฐานข้อมูล</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    รายละเอียดงาน
                  </h2>
                  
                  <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {eventData?.description || "ไม่พบรายละเอียดงาน"}
                  </div>

                  <div className="mt-6 flex items-center gap-2 text-sm text-cyan-400 font-medium bg-cyan-400/10 px-3 py-2 rounded-lg w-fit">
                    <MapPin size={16} /> {eventData?.location_name || eventData?.venue || "ระบุสถานที่"}
                  </div>
                </div>
              </div>

              {/* Card 2: ข้อมูลรอบการแสดง */}
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-pink-400 mb-4">รอบการแสดง</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-slate-300">
                      <Calendar size={18} className="text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-500 text-xs mb-0.5">เริ่มแสดง</p>
                        <p className="font-medium">{eventData?.show_start_date || "-"}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-slate-300">
                      <Clock size={18} className="text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-500 text-xs mb-0.5">จบการแสดง</p>
                        <p className="font-medium">{eventData?.show_end_date || "-"}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                    <p className="text-yellow-400 text-xs font-bold mb-3 flex items-center gap-1.5">
                      <Ticket size={14} /> ช่วงเวลาขายบัตร
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">เปิดขาย:</span>
                        <span className="text-white font-medium">{eventData?.sale_start_date || "-"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">ปิดขาย:</span>
                        <span className="text-white font-medium">{eventData?.sale_end_date || "-"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3: โซนและราคาบัตร */}
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                    <Ticket size={20} /> โซนและราคาบัตร
                  </h3>
                  <button className="text-xs text-cyan-400 hover:text-cyan-300 font-medium bg-cyan-400/10 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors">
                    <Eye size={14} /> ดูผังที่นั่ง
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-slate-400 border-b border-slate-700/50">
                      <tr>
                        <th className="pb-3 font-medium px-4">ชื่อโซน</th>
                        <th className="pb-3 font-medium px-4">ราคา (บาท)</th>
                        <th className="pb-3 font-medium px-4 text-center">ที่นั่งทั้งหมด</th>
                        <th className="pb-3 font-medium px-4 text-right">เหลือที่นั่ง</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {zones.length > 0 ? (
                        zones.map((zone, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-4 font-bold text-white">{zone.name || zone.zone_name}</td>
                            <td className="py-3 px-4 text-yellow-400 font-mono">{Number(zone.price).toLocaleString()}</td>
                            <td className="py-3 px-4 text-slate-400 text-center font-mono">{zone.total || zone.capacity}</td>
                            <td className="py-3 px-4 text-emerald-400 text-right font-mono font-bold">{zone.remaining ?? zone.capacity}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-500">ไม่พบข้อมูลโซนที่นั่ง</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}

export default function OrganizerPublishPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent flex items-center justify-center text-purple-500"><Loader2 className="animate-spin" size={40} /></div>}>
      <OrganizerPaymentContent />
    </Suspense>
  );
}