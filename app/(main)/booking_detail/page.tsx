"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Timer, User, Smartphone, ShieldCheck, X, Check, Loader2 } from "lucide-react";

export default function BookingDetailPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // ข้อมูลแสดงผลจาก URL
  const eventName = searchParams.get("name") || "2060 MOTHERSHIP TALK STAGE";
  const eventDate = searchParams.get("date") || "เสาร์, 15 มกราคม 2026";
  const eventTime = searchParams.get("time") || "19:00 - 23:00";
  const eventVenue = searchParams.get("venue") || "Impact Arena, Bangkok";
  const eventZone = searchParams.get("zone") || "L1";
  const selectedSeatsStr = searchParams.get("seats") || "-";
  const amountStr = searchParams.get("amount") || "0";

  // ข้อมูล Database ID ที่ส่งมาจากหน้าผังที่นั่ง
  const roundId = searchParams.get("roundId");
  const zoneId = searchParams.get("zoneId");
  const seatIdsStr = searchParams.get("seatIds") || "";
  const seatIdsArray = seatIdsStr.split(",").filter(id => id !== "").map(Number);

  // คำนวณยอดเงินจริง
  const ticketPrice = Number(amountStr);
  const seatCount = selectedSeatsStr.split(",").filter(s => s !== "-").length;
  const serviceFee = seatCount * 20; 
  const finalTotal = ticketPrice + serviceFee;

  const [memberData, setMemberData] = useState({ fullName: "กำลังโหลดข้อมูล...", email: "กำลังโหลด..." });
  const [timeLeft, setTimeLeft] = useState(300);
  const [isAgreed, setIsAgreed] = useState(false); 
  const [isProcessing, setIsProcessing] = useState(false); 

  // 🟢 1. ดึงข้อมูล Profile (ใช้โค้ดแบบเดียวกับหน้าแก้ไขโปรไฟล์)
  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token"); // ดึงกุญแจ
      if (!token) {
        setMemberData({ fullName: "ไม่พบข้อมูล (ยังไม่ได้ Login)", email: "-" });
        return;
      }

      try {
        // ยิงไปที่ /api/profile แบบเดียวกับหน้าแก้โปรไฟล์
        const res = await fetch("http://127.0.0.1:8000/api/profile", {
          headers: { 
            "Authorization": `Bearer ${token}`, // แนบกุญแจ
            "Accept": "application/json" 
          }
        });

        if (res.ok) {
          const data = await res.json();
          // เอา firstName กับ lastName มาต่อกัน
          const fullName = `${data.firstName || ""} ${data.lastName || ""}`.trim();
          
          setMemberData({ 
            fullName: fullName || "ผู้ใช้งานระบบ", 
            email: data.email || "-" 
          });
        } else {
          setMemberData({ fullName: "ไม่พบข้อมูลผู้ใช้", email: "-" });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        setMemberData({ fullName: "ข้อผิดพลาดในการเชื่อมต่อ", email: "-" });
      }
    };

    fetchUserData();
  }, []);

  // ระบบจับเวลา
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) { clearInterval(timer); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  // 🟢 2. ฟังก์ชันยืนยันการจอง (แนบ Token ด้วยเสมอ)
  const handleConfirmBooking = async () => {
    setIsProcessing(true);

    if (!roundId || !zoneId || seatIdsArray.length === 0) {
      alert("⚠️ โหมดทดสอบ UI: ที่นั่งนี้ยังไม่มีใน Database ของคุณ ระบบจะพาข้ามไปดูหน้า QR Code จำลองเลยนะครับ!");
      setTimeout(() => {
          router.push(`/payment/qr?bookingId=TEST-001&amount=${finalTotal}`);
          setIsProcessing(false);
      }, 1000);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://127.0.0.1:8000/api/bookings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          ...(token && { "Authorization": `Bearer ${token}` }) // แนบกุญแจตอนซื้อตั๋ว
        },
        body: JSON.stringify({
          Datetime_id: parseInt(roundId),
          Zone_id: parseInt(zoneId),
          seat_ids: seatIdsArray
        })
      });

      if (res.ok) {
        const data = await res.json();
        router.push(`/payment/qr?bookingId=${data.booking_id}&amount=${finalTotal}`);
      } else {
        const errorData = await res.json();
        alert(errorData.message || "ขออภัย ที่นั่งนี้ถูกจองไปแล้วในขณะที่คุณกำลังทำรายการ");
        router.back(); 
      }
    } catch (error) {
      console.error("Confirm Booking Error:", error);
      alert("ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-20 relative overflow-x-hidden">
      
      {/* Modal Timeout */}
      {timeLeft === 0 && (
        <div className="fixed inset-0 z-[100] bg-[#0B0F14]/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
          <div className="max-w-sm w-full bg-[#161B22] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
            <X size={40} className="text-red-500 mx-auto mb-6" />
            <h2 className="text-2xl font-black mb-2 uppercase tracking-tight">หมดเวลาทำรายการ</h2>
            <button onClick={() => router.back()} className="w-full py-4 bg-[#E60023] text-white rounded-2xl font-black text-lg">ตกลง</button>
          </div>
        </div>
      )}

      {/* Navbar */}
      <div className="h-16 border-b border-white/5 flex items-center px-8 bg-[#161B22] sticky top-0 z-50">
        <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white transition-all text-sm font-bold">
          <ChevronLeft size={20} /> กลับไปหน้าเลือกที่นั่ง
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-8">
        {/* Timer */}
        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl mb-8 flex items-center gap-4 animate-pulse">
          <div className="bg-red-500 p-2 rounded-lg"><Timer size={24} className="text-white" /></div>
          <div>
            <span className="text-red-500 font-black text-xl mr-2">{formatTime(timeLeft)}</span>
            <span className="text-sm text-gray-300">กรุณาชำระเงินภายในเวลาที่กำหนด</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            {/* Buyer Info */}
            <section className="bg-[#161B22] rounded-3xl p-8 border border-white/5 shadow-xl">
              <h3 className="text-xl font-black mb-6 flex items-center gap-3"><User className="text-[#00B4D8]" size={24} /> ข้อมูลผู้ซื้อบัตร</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">ชื่อ - นามสกุล</label>
                  <input type="text" readOnly value={memberData.fullName} className="w-full bg-[#0B0F14] border border-white/10 rounded-xl p-4 text-sm font-bold text-gray-300 outline-none cursor-default" />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-gray-500 uppercase mb-2 block tracking-widest">อีเมล</label>
                  <input type="text" readOnly value={memberData.email} className="w-full bg-[#0B0F14] border border-white/10 rounded-xl p-4 text-sm font-bold text-gray-300 outline-none cursor-default" />
                </div>
              </div>
            </section>

            {/* Payment Method */}
            <section className="bg-[#161B22] rounded-3xl p-8 border border-white/5">
              <h3 className="text-xl font-black mb-6 uppercase tracking-tight">เลือกช่องทางชำระเงิน</h3>
              <div className="p-6 rounded-2xl border-2 border-[#00B4D8] bg-[#00B4D8]/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white p-2 rounded-lg text-[#0B0F14] shadow-sm"><Smartphone size={28} /></div>
                  <div>
                    <p className="font-black text-lg">Thai QR Payment</p>
                    <p className="text-xs text-gray-400 font-medium">ฟรีค่าธรรมเนียม</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-[#00B4D8] flex items-center justify-center"><div className="w-3 h-3 bg-[#00B4D8] rounded-full" /></div>
              </div>
            </section>
          </div>

          {/* Right Column: Summary */}
          <div className="space-y-6">
            <div className="bg-[#161B22] rounded-3xl p-8 border border-white/5 sticky top-24 shadow-2xl">
              <h3 className="text-lg font-black mb-6 border-b border-white/5 pb-4 uppercase tracking-widest text-gray-400">สรุปรายการสั่งซื้อ</h3>
              
              <div className="mb-6 space-y-2">
                <p className="text-sm font-black leading-tight text-[#00B4D8] uppercase">{eventName}</p>
                <p className="text-xs text-gray-500">{eventDate} | {eventTime}</p>
                <p className="text-xs text-gray-400 italic font-medium">{eventVenue}</p>
              </div>

              <div className="space-y-3 py-4 border-t border-b border-white/5 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400 font-bold uppercase text-[10px]">โซน</span>
                  <span className="font-bold text-white">{eventZone}</span>
                </div>
                <div className="flex justify-between text-sm items-start">
                  <span className="text-gray-400 font-bold uppercase text-[10px] mt-1">ที่นั่ง ({seatCount})</span>
                  <span className="font-bold text-white text-right max-w-[150px] break-words">{selectedSeatsStr}</span>
                </div>
              </div>

              <div className="space-y-2 mb-6 text-xs">
                <div className="flex justify-between text-gray-400">
                    <span>ราคาบัตร</span>
                    <span>฿{ticketPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                    <span>ค่าธรรมเนียมบริการ ({seatCount}x20)</span>
                    <span>฿{serviceFee.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex justify-between items-end mb-6 pt-4 border-t border-white/5">
                <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">ยอดชำระสุทธิ</span>
                <span className="text-3xl font-black text-white leading-none tracking-tighter">฿{finalTotal.toLocaleString()}</span>
              </div>

              <div className="flex items-start gap-3 mb-6 group cursor-pointer" onClick={() => setIsAgreed(!isAgreed)}>
                <div className={`w-5 h-5 rounded border border-white/20 flex items-center justify-center shrink-0 transition-colors ${isAgreed ? 'bg-[#00B4D8] border-[#00B4D8]' : 'bg-transparent group-hover:border-white/50'}`}>
                    {isAgreed && <Check size={14} className="text-black" />}
                </div>
                <p className="text-[10px] text-gray-400 leading-tight select-none">
                    ฉันยอมรับ <span className="text-white underline hover:text-[#00B4D8]">เงื่อนไขการให้บริการ</span> และ <span className="text-white underline hover:text-[#00B4D8]">นโยบายความเป็นส่วนตัว</span> ของ BEATPASS (ซื้อแล้วไม่รับคืนทุกกรณี)
                </p>
              </div>

              {/* ปุ่มยืนยันการจอง */}
              <button 
                onClick={handleConfirmBooking} 
                disabled={!isAgreed || isProcessing}
                className={`w-full py-5 rounded-2xl font-black text-xl shadow-[0_10px_40px_rgba(230,0,35,0.3)] transition-all transform active:scale-95 flex items-center justify-center gap-2 ${isAgreed && !isProcessing ? 'bg-[#E60023] hover:bg-[#C2001E] text-white' : 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none'}`}
              >
                {isProcessing ? (
                  <>
                    <Loader2 size={24} className="animate-spin" /> กำลังทำรายการ...
                  </>
                ) : (
                  "ยืนยันการจอง"
                )}
              </button>

              <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-gray-600 font-bold uppercase tracking-widest">
                <ShieldCheck size={16} className="text-[#00B4D8]" />
                BEATPASS Secure Checkout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}