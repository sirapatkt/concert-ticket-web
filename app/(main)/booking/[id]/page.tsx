"use client";

import React from "react";
import { useRouter, useParams, useSearchParams } from "next/navigation";
import { Plus, Minus, RotateCcw, X, Check, Calendar, MapPin, ChevronLeft, TimerOff } from "lucide-react";

// --- ประกาศ Type ---
type SeatStatus = "available" | "selected" | "reserved" | "sold";
type Seat = {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  price: number;
};

const SeatIcon = ({ status, label }: { status: SeatStatus; label: string }) => {
  let bodyFill = "transparent";   
  let bodyStroke = "none";        
  let contentOverlay = <span className="text-[10px] font-bold text-white">{label}</span>;

  if (status === "available") {
    bodyFill = "#00B4D8"; 
    contentOverlay = <span className="text-[18px] font-extrabold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">{label}</span>;
  } else if (status === "selected") {
    bodyFill = "#76FF03"; 
    contentOverlay = <Check size={28} className="text-black stroke-[4]" />;
  } else if (status === "sold") {
    bodyFill = "#FFFFFF"; 
    bodyStroke = "#E5E7EB"; 
    contentOverlay = <X size={32} className="text-[#DC2626] stroke-[3]" />;
  }

  return (
    <div className={`relative w-full h-full flex items-center justify-center transition-all duration-200 ${status === 'available' ? 'hover:scale-110 cursor-pointer' : ''}`}>
      <svg viewBox="0 0 40 40" className="w-full h-full drop-shadow-sm">
        <rect x="2" y="2" width="36" height="36" rx="6" fill={bodyFill} stroke={bodyStroke} strokeWidth={status === 'sold' ? 1 : 0} />
      </svg>
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10">{contentOverlay}</div>
    </div>
  );
};

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();

  // ✅ 1. ดึงข้อมูลงาน โซน และรายละเอียดจาก URL
  const eventName = searchParams.get("name") || "2060 MOTHERSHIP TALK STAGE: Before the End of the World";
  const eventDate = searchParams.get("date") || "เสาร์, 15 มกราคม 2026";
  const eventTime = searchParams.get("time") || "19:00 - 22:00 น.";
  const eventVenue = searchParams.get("venue") || "Impact Arena, Bangkok";
  const eventZone = searchParams.get("zone") || "A1"; 

  const [seats, setSeats] = React.useState<Seat[]>(() => {
    const rows = ["U", "T", "S", "R", "Q", "P", "O", "N"];
    const seatsPerRow = 14;
    const initialSeats: Seat[] = [];
    rows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        initialSeats.push({ id: `${row}${i}`, row, number: i, status: "available", price: 1500 });
      }
    });
    return initialSeats;
  });

  const [scale, setScale] = React.useState(0.8);
  const [timeLeft, setTimeLeft] = React.useState(300);
  const [isTimeout, setIsTimeout] = React.useState(false); 
  const [position, setPosition] = React.useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = React.useState(false);
  const dragStart = React.useRef({ x: 0, y: 0 });

  // ✅ 2. เพิ่มฟังก์ชัน handleReset เพื่อแก้ Error
  const handleReset = () => {
    setScale(0.8);
    setPosition({ x: 0, y: 0 });
  };

  React.useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimeout(true); 
      setSeats(prev => prev.map(s => s.status === 'selected' ? { ...s, status: 'available' } : s));
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleSeat = (seatId: string) => {
    if (isDragging || isTimeout) return; 
    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.id !== seatId) return seat;
        if (seat.status === "sold" || seat.status === "reserved") return seat;
        return { ...seat, status: seat.status === "available" ? "selected" : "available" };
      })
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    const newScale = scale - e.deltaY * 0.001;
    setScale(Math.min(Math.max(newScale, 0.4), 3));
  };

  const selectedSeats = seats.filter((s) => s.status === "selected");
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="h-screen w-full bg-[#0B0F14] text-white flex pt-16 overflow-hidden font-sans select-none relative">
      
      {isTimeout && (
        <div className="fixed inset-0 z-[100] bg-[#0B0F14]/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
          <div className="max-w-sm w-full bg-[#161B22] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
            <TimerOff size={40} className="mx-auto mb-6 text-red-500" />
            <h2 className="text-2xl font-black mb-2 uppercase tracking-tight text-white">หมดเวลาทำรายการ</h2>
            <button onClick={() => {setIsTimeout(false); setTimeLeft(300);}} className="w-full py-4 bg-white text-black rounded-2xl font-black">เลือกที่นั่งใหม่</button>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <div className="w-[350px] bg-[#161B22] border-r border-white/5 flex flex-col z-20 shadow-2xl shrink-0 text-white">
        <div className="p-4 border-b border-white/5">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-bold">
                <ChevronLeft size={18} /> กลับ
            </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
            <h1 className="text-xl font-black leading-tight mb-4 uppercase tracking-tight">{eventName}</h1>
            <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 text-sm text-gray-400">
                    <Calendar size={16} className="mt-0.5 text-[#00B4D8]" />
                    <span>{eventDate}<br/><span className="text-xs text-gray-500">{eventTime}</span></span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                    <MapPin size={16} className="mt-0.5 text-pink-500" />
                    <span>{eventVenue}</span>
                </div>
            </div>
            <div className="border-t border-white/10 my-6"></div>
            <div>
                {/* ✅ ส่วนแสดงโซน */}
                <p className="text-xs font-bold text-[#00B4D8] uppercase tracking-[0.2em] mb-1">Zone</p>
                <p className="text-2xl font-black text-white mb-6 tracking-tighter uppercase">{eventZone}</p>
                
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">ที่นั่ง ({selectedSeats.length})</p>
                <div className="flex flex-wrap gap-2">
                    {selectedSeats.length > 0 ? (
                        selectedSeats.map((s) => (
                            <span key={s.id} className="bg-[#00B4D8] text-[#0B0F14] px-3 py-1 rounded-md text-xs font-black shadow-lg shadow-blue-500/20">{s.id}</span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-600 italic">ยังไม่ได้เลือกที่นั่ง</span>
                    )}
                </div>
            </div>
        </div>
        <div className="p-6 bg-[#0B0F14] border-t border-white/10">
            <div className="flex justify-between items-end mb-4">
                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">ราคารวม</span>
                <span className="text-3xl font-black text-white">฿{totalPrice.toLocaleString()}</span>
            </div>
            <button 
                onClick={() => {
                  const query = new URLSearchParams({
                    name: eventName,
                    date: eventDate,
                    time: eventTime,
                    venue: eventVenue,
                    zone: eventZone,
                    amount: totalPrice.toString(),
                    seats: selectedSeats.map(s => s.id).join(", ")
                  }).toString();
                  router.push(`/booking_detail?${query}`);
                }}
                disabled={selectedSeats.length === 0}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all transform active:scale-95 ${selectedSeats.length > 0 ? "bg-[#E60023] text-white shadow-[0_10px_30px_rgba(230,0,35,0.3)]" : "bg-gray-800 text-gray-500 cursor-not-allowed"}`}
            >
                ชำระเงิน
            </button>
        </div>
      </div>

      {/* RIGHT SIDE MAP AREA */}
      <div className="flex-1 h-full relative bg-[#0B0F14] overflow-hidden bg-dots-pattern">
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-8 py-4 pointer-events-none">
            {/* TIMER */}
            <div className="bg-[#161B22]/90 backdrop-blur border border-white/10 px-6 py-2 rounded-full pointer-events-auto shadow-xl">
                <span className="text-red-500 font-bold font-mono text-xl tracking-tighter">{formatTime(timeLeft)}</span>
            </div>

            {/* ✅ LEGEND (คำอธิบายสถานะ) แก้ไขใหม่ */}
            <div className="flex gap-4 bg-[#161B22]/90 backdrop-blur border border-white/10 px-6 py-2 rounded-full pointer-events-auto shadow-xl items-center">
                {/* ว่าง: สีฟ้าเดิม ขยายขนาด */}
                <div className="flex items-center gap-2 text-sm uppercase font-bold text-gray-400">
                    <div className="w-6 h-6 bg-[#00B4D8] rounded-sm shadow-sm"></div> 
                    <span>ว่าง</span>
                </div>
                
                {/* เลือก: สีเขียว + ติ๊กถูกสีดำ */}
                <div className="flex items-center gap-2 text-sm uppercase font-bold text-gray-400">
                    <div className="w-6 h-6 bg-[#76FF03] rounded-sm flex items-center justify-center shadow-sm">
                        <Check size={16} className="text-black stroke-[4]" />
                    </div> 
                    <span>เลือก</span>
                </div>
                
                {/* ขายแล้ว: สีขาว + กากบาทสีแดง */}
                <div className="flex items-center gap-2 text-sm uppercase font-bold text-gray-400">
                    <div className="w-6 h-6 bg-white rounded-sm flex items-center justify-center shadow-sm">
                        <X size={16} className="text-[#DC2626] stroke-[3]" />
                    </div> 
                    <span>ขายแล้ว</span>
                </div>
            </div>
        </div>

        <div className="w-full h-full relative flex items-center justify-center" 
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}
             onWheel={handleWheel}>
             <div className={`flex flex-col items-center ${isDragging ? 'duration-0' : 'duration-300'} transition-transform shadow-blue-500/5`} 
                  style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}>
                <div className="w-[600px] h-32 bg-gradient-to-b from-gray-700 to-gray-800 mb-20 rounded-sm flex items-center justify-center text-white/20 font-black text-4xl tracking-[1em] shadow-2xl relative shrink-0">
                    STAGE
                    <div className="absolute bottom-0 w-full h-1 bg-blue-500 shadow-[0_0_30px_#3B82F6]"></div>
                </div>
                <div className="grid gap-2 w-max mx-auto px-40" style={{ gridTemplateColumns: `repeat(14, 60px)` }}>
                    {seats.map((seat) => (
                        <button key={seat.id} onClick={() => toggleSeat(seat.id)} disabled={seat.status === "sold"} className="relative w-[50px] h-[50px] focus:outline-none group shrink-0">
                            <SeatIcon status={seat.status} label={seat.id} />
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Controls */}
        <div className="absolute right-6 bottom-6 flex flex-col gap-2 bg-[#161B22] p-2 rounded-xl border border-white/10 shadow-xl z-10 text-white">
            <button onClick={() => setScale(s => Math.min(s + 0.1, 3))} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Plus size={20} /></button>
            <button onClick={() => setScale(s => Math.max(s - 0.1, 0.4))} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Minus size={20} /></button>
            <button onClick={handleReset} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><RotateCcw size={20} /></button>
        </div>
      </div>
    </div>
  );
}