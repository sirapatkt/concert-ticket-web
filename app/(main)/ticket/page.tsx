"use client";

import React, { useRef, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Home, Download, MapPin, Calendar, CheckCircle2, ShieldCheck, Loader2 } from "lucide-react";
import { toPng } from "html-to-image";
import QRCode from "qrcode";

export default function TicketPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ✅ 1. เปลี่ยนจาก Ref ตัวเดียว เป็น Array ของ Ref เพื่อเก็บตั๋วทุกใบ
  const ticketRefs = useRef<(HTMLDivElement | null)[]>([]);

  const [isDownloading, setIsDownloading] = useState(false);
  const [qrImages, setQrImages] = useState<string[]>([]);
  const [ticketIds, setTicketIds] = useState<string[]>([]);

  const getValue = (key: string, defaultValue: string) => {
    const val = searchParams.get(key);
    if (!val || val === "-" || val === "null") return defaultValue;
    return val;
  };

  const eventName = getValue("name", "2060 MOTHERSHIP TALK STAGE: The Longest Event Name in History Before the End of the World");
  const eventDate = getValue("date", "เสาร์, 15 มกราคม 2026");
  const eventTime = getValue("time", "19:00 - 22:00 น.");
  const eventVenue = getValue("venue", "Impact Arena, Bangkok");
  const eventZone = getValue("zone", "A1");
  const selectedSeatsStr = getValue("seats", "U7, U8");

  const seatsArray = selectedSeatsStr.split(",").map((s) => s.trim()).filter((s) => s !== "");

  useEffect(() => {
    const generateData = async () => {
      const ids = seatsArray.map(() => `TKT-${Math.floor(10000000 + Math.random() * 90000000)}`);
      setTicketIds(ids);

      const qrPromises = seatsArray.map(async (seat, index) => {
        const tktId = ids[index];
        const shortEventName = eventName.length > 25 ? eventName.substring(0, 25) + "..." : eventName;
        const scanText = `ACCESS GRANTED (ผ่านประตู)\n\nEvent: ${shortEventName}\nSeat: ${seat} | Zone: ${eventZone}\nTicket ID: ${tktId}\n\n(BeatPass Verified)`;
        const mockScanUrl = `https://placehold.co/600x800/2ecc71/ffffff/png?text=${encodeURIComponent(scanText)}&font=roboto`;
        
        try {
          return await QRCode.toDataURL(mockScanUrl, { margin: 1, width: 250 });
        } catch (err) {
          console.error(err);
          return "";
        }
      });

      const images = await Promise.all(qrPromises);
      setQrImages(images);
    };

    generateData();
  }, []);

  // ✅ 2. ฟังก์ชันใหม่: วนลูปบันทึกทีละใบ
  const handleDownload = async () => {
    setIsDownloading(true);
    
    try {
      // รอให้ Browser พร้อมสักครู่
      await new Promise((resolve) => setTimeout(resolve, 500));

      // วนลูปตั๋วทุกใบใน Ref Array
      for (let i = 0; i < seatsArray.length; i++) {
        const element = ticketRefs.current[i]; // ดึง element ของตั๋วใบที่ i
        
        if (element) {
          const dataUrl = await toPng(element, { 
            cacheBust: true, 
            pixelRatio: 2, 
            backgroundColor: 'transparent', // พื้นหลังโปร่งใสเพื่อให้มุมโค้งสวย (หรือใส่ #0B0F14 ถ้าอยากได้พื้นดำติดไปด้วย)
          });

          const link = document.createElement("a");
          link.href = dataUrl;
          // ตั้งชื่อไฟล์แยกตามเลขที่นั่ง (เช่น BEATPASS-Ticket-U7.png)
          link.download = `BEATPASS-Ticket-${seatsArray[i]}.png`;
          link.click();

          // *สำคัญ* หน่วงเวลานิดนึงระหว่างใบ เพื่อไม่ให้ Browser บล็อกการดาวน์โหลดรัวๆ
          await new Promise((resolve) => setTimeout(resolve, 800));
        }
      }
      
    } catch (error) {
      console.error("Download failed:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-20 pt-24 relative overflow-x-hidden flex flex-col items-center">
      
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[#76FF03]/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="mb-10 text-center relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <div className="w-20 h-20 bg-[#76FF03] rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_40px_rgba(118,255,3,0.4)]">
          <CheckCircle2 size={40} className="text-black" />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-tight mb-2">จองบัตรสำเร็จ!</h1>
        <p className="text-gray-400 text-sm">คุณมีบัตรทั้งหมด <span className="text-[#76FF03] font-bold">{seatsArray.length} ใบ</span> พร้อมใช้งานแล้ว</p>
      </div>

      <div className="relative z-10 w-full max-w-6xl px-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 items-stretch pb-8">
        
        {seatsArray.map((seat, index) => {
          const tktId = ticketIds[index] || "LOADING...";
          const qrSrc = qrImages[index];

          return (
            // ✅ 3. ผูก Ref เข้ากับตั๋วแต่ละใบ (เก็บเข้า Array ตาม index)
            <div 
                key={index} 
                ref={(el) => { ticketRefs.current[index] = el; }}
                className="w-full max-w-sm drop-shadow-2xl flex flex-col h-full mx-auto" 
            >
              
              {/* --- TICKET CARD (เนื้อหาเหมือนเดิม) --- */}
              <div className="bg-[#161B22] rounded-t-3xl p-6 border-x border-t border-white/10 relative overflow-hidden flex-1 flex flex-col">
                <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#00B4D8]/20 rounded-full blur-xl" />
                
                <div className="relative flex-1 flex flex-col">
                  <h2 className="text-lg font-black leading-tight mb-6 uppercase text-[#00B4D8] tracking-tight break-words">
                    {eventName}
                  </h2>
                  
                  <div className="space-y-3 mb-6 flex-1">
                    <div className="flex items-start gap-3 text-xs text-gray-300">
                      <Calendar size={14} className="mt-0.5 text-[#76FF03] shrink-0" />
                      <span>{eventDate} | {eventTime}</span>
                    </div>
                    <div className="flex items-start gap-3 text-xs text-gray-300">
                      <MapPin size={14} className="mt-0.5 text-[#E60023] shrink-0" />
                      <span>{eventVenue}</span>
                    </div>
                  </div>

                  <div className="flex gap-3 mt-auto pt-4 border-t border-white/5">
                    <div className="bg-[#0B0F14] border border-white/10 rounded-xl p-2 flex-1 text-center">
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest">โซน</p>
                      <p className="text-xl font-black text-white">{eventZone}</p>
                    </div>
                    <div className="bg-[#0B0F14] border border-white/10 rounded-xl p-2 flex-[2] text-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-[#00B4D8]/10 translate-y-full group-hover:translate-y-0 transition-transform" />
                      <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest relative z-10">เลขที่นั่ง</p>
                      <p className="text-xl font-black text-[#00B4D8] relative z-10">{seat}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="relative bg-[#161B22] border-x border-white/10 shrink-0">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0B0F14] rounded-full z-10" />
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#0B0F14] rounded-full z-10" />
                  <div className="border-t-2 border-dashed border-gray-600/30 mx-6 h-4" />
              </div>

              <div className="bg-white text-black rounded-b-3xl p-6 flex flex-col items-center justify-center relative shrink-0">
                  <p className="text-[9px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-2">Scan To Enter</p>
                  
                  {qrSrc ? (
                    <img src={qrSrc} alt="QR" className="w-40 h-40 mix-blend-multiply mb-3" />
                  ) : (
                    <div className="w-40 h-40 bg-gray-200 animate-pulse mb-3 rounded-lg" />
                  )}
                  
                  <p className="font-mono text-[10px] text-gray-500 font-bold tracking-widest mb-4">{tktId}</p>
                  <div className="w-full bg-[#76FF03]/20 py-2 rounded-lg flex items-center justify-center gap-2 border border-[#76FF03]/50">
                      <ShieldCheck size={16} className="text-[#008000]" />
                      <span className="text-[10px] font-black text-[#008000] uppercase tracking-widest">Verified Ticket</span>
                  </div>
              </div>
              {/* --- TICKET CARD END --- */}

            </div>
          );
        })}
      </div>

      <div className="mt-8 flex gap-4 relative z-10 px-4 mb-10">
        <button 
          onClick={() => router.push("/")}
          className="px-6 py-3 bg-[#161B22] hover:bg-[#202630] border border-white/10 rounded-xl font-bold flex items-center gap-2 text-sm transition-all"
        >
          <Home size={18} /> หน้าแรก
        </button>
        
        <button 
          onClick={handleDownload}
          disabled={isDownloading || qrImages.length === 0}
          className="px-6 py-3 bg-[#00B4D8] hover:bg-[#0096B4] text-white rounded-xl font-bold flex items-center gap-2 text-sm shadow-[0_0_20px_rgba(0,180,216,0.3)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isDownloading ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
          {isDownloading ? `กำลังบันทึก ${seatsArray.length} ใบ...` : "บันทึกแยกใบ"}
        </button>
      </div>

    </div>
  );
}