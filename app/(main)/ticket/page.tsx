"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Home, Download, MapPin, Calendar, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import QRCode from "qrcode";

export default function TicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const ticketRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [eventData, setEventData] = useState<any>(null);
  const [qrImages, setQrImages] = useState<string[]>([]);

  // ⭐️ 1. ดึง bookingId จาก URL แทนการรับค่าอื่นๆ
  const bookingId = searchParams.get("bookingId");

  useEffect(() => {
    const fetchTickets = async () => {
      // ถ้าไม่มี bookingId หรือเป็นค่าว่างๆ ให้กลับไปหน้าแรก (กันคนแอบเข้า)
      if (!bookingId || bookingId === "null" || bookingId === "-") {
         alert("ไม่พบข้อมูลการจอง");
         router.push("/");
         return;
      }
      
      try {
        // ⭐️ 2. ยิง API ไปขอข้อมูลตั๋วจริงๆ จาก Laravel
        const res = await fetch(`http://127.0.0.1:8000/api/tickets/${bookingId}`);
        const data = await res.json();
        
        if (res.ok) {
          setEventData(data);
          
         // ⭐️ 3. สร้าง QR Code โดยฝัง "ลิงก์" แทนข้อความ
          const qrPromises = data.tickets.map(async (tkt: any) => {
            
            // ✅ สร้าง URL ลิงก์ไปหาหน้า Verify ของเรา 
            // เปลี่ยน localhost:3000 เป็น Domain จริงของคุณในอนาคต
            const textForQR = `http://localhost:3000/verify?ticketId=${tkt.ticketId}&bookingId=${bookingId}`;
            
            try {
              // โยนลิงก์เข้าไปสร้าง QR
              return await QRCode.toDataURL(textForQR, { 
                margin: 2, 
                width: 300,
                color: {
                  dark: '#000000',
                  light: '#FFFFFF' 
                }
              });
            } catch (err) {
              console.error(err);
              return "";
            }
          });

          const images = await Promise.all(qrPromises);
          setQrImages(images);
        } else {
           alert("เกิดข้อผิดพลาด: " + data.message);
           router.push("/");
        }
      } catch (error) {
        console.error("Fetch tickets error:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [bookingId, router]);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      for (let i = 0; i < eventData.tickets.length; i++) {
        const element = ticketRefs.current[i];
        if (element) {
          const dataUrl = await toPng(element, { 
            cacheBust: true, 
            pixelRatio: 2, 
            backgroundColor: 'transparent',
          });
          const link = document.createElement("a");
          link.href = dataUrl;
          link.download = `BEATPASS-Ticket-${eventData.tickets[i].seat}.png`;
          link.click();
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsDownloading(false);
    }
  };

  // ⏳ หน้าจอตอนกำลังโหลดข้อมูล
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center text-white">
        <Loader2 size={40} className="animate-spin text-[#00B4D8] mb-4" />
        <p className="font-bold tracking-widest animate-pulse">GENERATING YOUR TICKETS...</p>
      </div>
    );
  }

  // ❌ ถ้าโหลดเสร็จแล้วแต่ไม่มีข้อมูล (เผื่อหลุดมา)
  if (!eventData) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl text-[#E60023] font-bold mb-4">ไม่พบข้อมูลตั๋ว</h1>
        <button onClick={() => router.push("/")} className="px-6 py-2 bg-gray-800 rounded-full font-bold hover:bg-gray-700">กลับหน้าแรก</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-20 pt-24 relative overflow-x-hidden flex flex-col items-center">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#76FF03]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-10 text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-[#76FF03] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(118,255,3,0.4)]">
          <CheckCircle2 size={40} className="text-black" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">จองบัตรสำเร็จ!</h1>
        <p className="text-gray-400 text-sm">คุณมีบัตรทั้งหมด <span className="text-[#76FF03] font-bold">{eventData.tickets.length} ใบ</span> พร้อมใช้งานแล้ว</p>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch pb-8">
        {eventData.tickets.map((tkt: any, index: number) => {
          const qrSrc = qrImages[index];

          return (
            <div key={index} ref={(el) => { ticketRefs.current[index] = el; }} className="w-full max-w-sm drop-shadow-2xl flex flex-col h-full mx-auto">
              
              {/* TICKET TOP */}
              <div className="bg-[#161B22] rounded-t-3xl p-6 border-x border-t border-white/10 relative overflow-hidden flex-1 flex flex-col">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#00B4D8]/20 rounded-full blur-xl" />
                <div className="relative flex-1 flex flex-col">
                  <h2 className="text-lg font-black leading-tight mb-6 uppercase text-[#00B4D8] tracking-tight break-words">
                    {eventData.eventName}
                  </h2>
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-start gap-3 text-xs text-gray-300">
                      <Calendar size={14} className="mt-0.5 text-[#76FF03] shrink-0" />
                      <span>{eventData.eventDate} | {eventData.eventTime}</span>
                    </div>
                    <div className="flex items-start gap-3 text-xs text-gray-300">
                      <MapPin size={14} className="mt-0.5 text-[#E60023] shrink-0" />
                      <span>{eventData.venue}</span>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
                    <div className="bg-[#0B0F14] border border-white/10 rounded-xl p-2 flex-1 text-center">
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">โซน</p>
                      <p className="text-xl font-black text-white">{eventData.zone}</p>
                    </div>
                    <div className="bg-[#0B0F14] border border-white/10 rounded-xl p-2 flex-[2] text-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[#00B4D8]/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest relative z-10">เลขที่นั่ง</p>
                      <p className="text-xl font-black text-[#00B4D8] relative z-10">{tkt.seat}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* TICKET CUTOUT */}
              <div className="relative bg-[#161B22] border-x border-white/10 shrink-0">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0B0F14] rounded-full z-10" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0B0F14] rounded-full z-10" />
                  <div className="border-t-2 border-dashed border-gray-600/30 mx-6 h-4" />
              </div>

              {/* TICKET BOTTOM (QR CODE) */}
              <div className="bg-white text-black rounded-b-3xl p-6 flex flex-col items-center justify-center relative shrink-0">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Scan To Enter</p>
                  
                  {qrSrc ? (
                    <img src={qrSrc} alt="QR Code" className="w-40 h-40 mb-3 mix-blend-multiply" />
                  ) : (
                    <div className="w-40 h-40 bg-gray-200 animate-pulse mb-3 rounded-lg" />
                  )}
                  
                  <p className="font-mono text-[10px] text-gray-500 font-bold tracking-widest mb-4">{tkt.ticketId}</p>
                  <div className="w-full bg-[#76FF03]/20 py-2 rounded-lg flex items-center justify-center gap-2 border border-[#76FF03]/50">
                      <ShieldCheck size={16} className="text-[#008000]" />
                      <span className="text-[10px] font-black text-[#008000] uppercase tracking-widest">Verified Ticket</span>
                  </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* BUTTONS */}
      <div className="mt-8 flex gap-4 relative z-10 px-4 mb-10">
        <button onClick={() => router.push("/")} className="px-6 py-3 bg-[#161B22] hover:bg-[#202630] border border-white/10 rounded-xl font-bold flex items-center gap-2 text-sm transition-all">
          <Home size={18} /> หน้าแรก
        </button>
        <button onClick={handleDownload} disabled={isDownloading || qrImages.length === 0} className="px-6 py-3 bg-[#00B4D8] hover:bg-[#0096B4] text-white rounded-xl font-bold flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(0,180,216,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed">
          {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          {isDownloading ? `กำลังบันทึก ${eventData.tickets.length} ใบ...` : "บันทึกแยกใบ"}
        </button>
      </div>
    </div>
  );
}