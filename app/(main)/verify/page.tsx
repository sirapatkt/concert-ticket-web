"use client";

import React, { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, XCircle, MapPin, Calendar, User, ShieldCheck, Loader2 } from "lucide-react";

export default function VerifyTicketPage() {
  const searchParams = useSearchParams();
  const ticketId = searchParams.get("ticketId");
  const bookingId = searchParams.get("bookingId");

  const [isLoading, setIsLoading] = useState(true);
  const [ticketData, setTicketData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTicketData = async () => {
      if (!ticketId || !bookingId) {
        setError("ไม่พบข้อมูลรหัสตั๋ว กรุณาสแกนใหม่อีกครั้ง");
        setIsLoading(false);
        return;
      }

      try {
        // ยิง API ไปขอดึงข้อมูลบิล (ใช้ API เดิมที่คุณมีอยู่แล้ว)
        const res = await fetch(`http://192.168.1.45:8000/api/tickets/${bookingId}`);
        const data = await res.json();

        if (res.ok) {
          // ค้นหาตั๋วใบที่ตรงกับ ticketId ที่สแกนมา
          const foundTicket = data.tickets.find((t: any) => t.ticketId === ticketId);

          if (foundTicket) {
            // เอาข้อมูลบิลมารวมกับข้อมูลตั๋วใบนั้น
            setTicketData({
              ...data, // ชื่อคอนเสิร์ต, วันที่, สถานที่
              seat: foundTicket.seat,
              ticketId: foundTicket.ticketId,
            });
          } else {
             setError("รหัสตั๋วไม่ถูกต้อง หรือไม่มีอยู่ในระบบ");
          }
        } else {
          setError("เกิดข้อผิดพลาด: " + data.message);
        }
      } catch (err) {
        setError("ไม่สามารถเชื่อมต่อฐานข้อมูลได้");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTicketData();
  }, [ticketId, bookingId]);

  // ⏳ หน้าจอตอนโหลด
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center text-white">
        <Loader2 size={40} className="animate-spin text-[#00B4D8] mb-4" />
        <p className="font-bold tracking-widest animate-pulse">VERIFYING TICKET...</p>
      </div>
    );
  }

  // ❌ หน้าจอเมื่อเกิด Error (ตั๋วปลอม/หาไม่เจอ)
  if (error || !ticketData) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center text-white px-4 text-center">
        <XCircle size={80} className="text-[#E60023] mb-4" />
        <h1 className="text-3xl font-black uppercase text-[#E60023] mb-2">VERIFY FAILED</h1>
        <p className="text-gray-400 mb-8">{error}</p>
        <div className="w-full max-w-sm bg-[#161B22] border border-[#E60023]/30 rounded-2xl p-6">
             <p className="text-sm text-gray-400">รหัสที่สแกน:</p>
             <p className="font-mono text-lg font-bold text-white break-all">{ticketId || "N/A"}</p>
        </div>
      </div>
    );
  }

  // ✅ หน้าจอเมื่อตั๋วถูกต้อง
  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#76FF03]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-500">
        
        {/* หัวกระดาษ */}
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-[#76FF03]/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-[#76FF03]">
            <CheckCircle2 size={48} className="text-[#76FF03]" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight text-[#76FF03] mb-1">ตั๋วใช้งานได้</h1>
          <p className="text-sm font-bold tracking-[0.2em] text-gray-400">TICKET VERIFIED</p>
        </div>

        {/* บัตรข้อมูล */}
        <div className="bg-[#161B22] rounded-3xl p-6 md:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#00B4D8] to-[#76FF03]" />
          
          <h2 className="text-xl md:text-2xl font-black leading-tight mb-6 uppercase text-white break-words">
            {ticketData.eventName}
          </h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-4">
              <Calendar size={20} className="mt-0.5 text-[#00B4D8] shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">วันและเวลา</p>
                <p className="text-sm font-bold text-gray-200">{ticketData.eventDate}</p>
                <p className="text-sm font-bold text-gray-200">{ticketData.eventTime}</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <MapPin size={20} className="mt-0.5 text-[#E60023] shrink-0" />
              <div>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">สถานที่</p>
                <p className="text-sm font-bold text-gray-200">{ticketData.venue}</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mb-8">
            <div className="bg-[#0B0F14] rounded-2xl p-4 flex-[1.5] border border-white/5">
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-1">โซน</p>
              <p className="text-2xl font-black text-white">{ticketData.zone}</p>
            </div>
            <div className="bg-[#0B0F14] rounded-2xl p-4 flex-[2] border border-[#00B4D8]/30 relative overflow-hidden">
               <div className="absolute inset-0 bg-[#00B4D8]/10" />
              <p className="text-[10px] text-[#00B4D8] font-bold uppercase tracking-widest mb-1 relative z-10">ที่นั่ง</p>
              <p className="text-3xl font-black text-[#00B4D8] relative z-10">{ticketData.seat}</p>
            </div>
          </div>

          <div className="pt-6 border-t border-dashed border-gray-600/50 text-center">
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mb-2">รหัสอ้างอิงตั๋ว (Ticket ID)</p>
            <p className="font-mono text-sm text-gray-300 tracking-wider bg-black/50 py-2 rounded-lg">{ticketData.ticketId}</p>
          </div>
        </div>
      </div>
    </div>
  );
}