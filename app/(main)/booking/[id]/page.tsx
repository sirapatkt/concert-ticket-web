"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Plus, Minus, RotateCcw, X, Check, Calendar, MapPin, ChevronLeft } from "lucide-react";

// --- ประกาศ Type ---
type SeatStatus = "available" | "selected" | "reserved" | "sold";
type Seat = {
  id: string;
  row: string;
  number: number;
  status: SeatStatus;
  price: number;
};

// --- Component: ปุ่มที่นั่งแบบสีทึบ (Solid Button) ---
const SeatIcon = ({ status, label }: { status: SeatStatus; label: string }) => {
  // คลาสพื้นฐาน: เป็นปุ่มสี่เหลี่ยมมนๆ ไม่มีขอบ
  const baseClasses = "w-full h-full rounded-lg flex items-center justify-center text-[12px] font-bold transition-all duration-200 shadow-sm";

  let statusClasses = "";
  let content = <span>{label}</span>;

  if (status === "available") {
    // ✅ ว่าง: สีฟ้าทึบ, ตัวหนังสือดำ, เมาส์ชี้แล้วสว่างขึ้น
    statusClasses = "bg-[#00B4D8] text-black hover:bg-[#009ab8] hover:scale-105 hover:shadow-md hover:shadow-cyan-500/40";
  } else if (status === "selected") {
    // ✅ เลือก: สีเขียวทึบ, ตัวหนังสือดำ, มีไอคอนติ๊กถูก, ขยายและมีเงา
    statusClasses = "bg-[#22C55E] text-black scale-105 shadow-lg shadow-green-500/30 z-10";
    content = <Check size={18} className="text-black font-bold" />;
  } else if (status === "sold") {
    // ขายแล้ว: สีเทาทึบ, ตัวหนังสือเทาอ่อน, กากบาท
    statusClasses = "bg-gray-700 text-gray-400 cursor-not-allowed";
    content = <X size={16} />;
  }

  return (
    <div className={`${baseClasses} ${statusClasses}`}>
      {content}
    </div>
  );
};

export default function BookingPage() {
  const router = useRouter();
  const params = useParams();

  // สร้างที่นั่ง (เริ่มต้นว่างหมด)
  const [seats, setSeats] = useState<Seat[]>(() => {
    const rows = ["U", "T", "S", "R", "Q", "P", "O", "N"];
    const seatsPerRow = 14;
    const initialSeats: Seat[] = [];
    
    rows.forEach((row) => {
      for (let i = 1; i <= seatsPerRow; i++) {
        initialSeats.push({
          id: `${row}${i}`,
          row,
          number: i,
          status: "available", // เริ่มต้นว่างหมด
          price: 1500, 
        });
      }
    });
    return initialSeats;
  });

  const [scale, setScale] = useState(1);
  const [timeLeft, setTimeLeft] = useState(300);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleSeat = (seatId: string) => {
    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.id !== seatId) return seat;
        if (seat.status === "sold" || seat.status === "reserved") return seat;
        return {
          ...seat,
          status: seat.status === "available" ? "selected" : "available",
        };
      })
    );
  };

  const selectedSeats = seats.filter((s) => s.status === "selected");
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white flex pt-16 overflow-hidden font-sans">
      
      {/* 👈 LEFT SIDEBAR */}
      <div className="w-[350px] bg-[#161B22] border-r border-white/5 flex flex-col z-20 shadow-2xl relative">
        <div className="p-4 border-b border-white/5">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-bold">
                <ChevronLeft size={18} /> กลับ
            </button>
        </div>

        <div className="p-6 flex-1 overflow-y-auto">
            <h1 className="text-xl font-black leading-tight mb-4 text-white">
                2060 MOTHERSHIP TALK STAGE: Before the End of the World
            </h1>
            
            <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 text-sm text-gray-400">
                    <Calendar size={16} className="mt-0.5 text-[#00B4D8]" />
                    <span>เสาร์, 15 มกราคม 2026<br/><span className="text-xs text-gray-500">19:00 - 22:00 น.</span></span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                    <MapPin size={16} className="mt-0.5 text-pink-500" />
                    <span>Impact Arena, Bangkok</span>
                </div>
            </div>

            <div className="border-t border-white/10 my-6"></div>

            <div className="mb-4">
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">โซนที่เลือก</p>
                <div className="flex items-center gap-2">
                    <span className="bg-white/10 px-3 py-1 rounded text-sm font-bold">A1</span>
                </div>
            </div>

            <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">ที่นั่ง ({selectedSeats.length})</p>
                <div className="flex flex-wrap gap-2">
                    {selectedSeats.length > 0 ? (
                        selectedSeats.map((s) => (
                            <span key={s.id} className="bg-[#00B4D8] text-[#0B0F14] px-3 py-1 rounded-full text-xs font-black shadow-lg shadow-blue-500/20 animate-in zoom-in">
                                {s.id}
                            </span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-600 italic">ยังไม่ได้เลือกที่นั่ง</span>
                    )}
                </div>
            </div>
        </div>

        <div className="p-6 bg-[#0B0F14] border-t border-white/10">
            <div className="flex justify-between items-end mb-4">
                <span className="text-gray-400 text-sm">ราคารวมสุทธิ</span>
                <span className="text-3xl font-black text-white">฿{totalPrice.toLocaleString()}</span>
            </div>
            <button 
                onClick={() => router.push(`/payment?amount=${totalPrice}`)}
                disabled={selectedSeats.length === 0}
                className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform active:scale-95 ${
                    selectedSeats.length > 0 
                    ? "bg-[#E60023] text-white hover:bg-[#C2001E] shadow-red-600/20" 
                    : "bg-gray-800 text-gray-500 cursor-not-allowed"
                }`}
            >
                ชำระเงิน
            </button>
        </div>
      </div>

      {/* 👉 RIGHT SIDE (Map) */}
      <div className="flex-1 flex flex-col relative bg-[#0B0F14]">
        
        {/* Top Bar */}
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-8 py-4 pointer-events-none">
            <div className="bg-[#161B22]/90 backdrop-blur border border-white/10 px-6 py-2 rounded-full pointer-events-auto">
                <span className="text-gray-400 text-sm mr-2">เวลาที่เหลือ</span>
                <span className="text-red-500 font-bold font-mono text-xl w-16 inline-block text-center">{formatTime(timeLeft)}</span>
            </div>

            <div className="flex gap-4 bg-[#161B22]/90 backdrop-blur border border-white/10 px-6 py-2 rounded-full pointer-events-auto">
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-6 h-6"><SeatIcon status="available" label="A1" /></div> ว่าง
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-6 h-6"><SeatIcon status="selected" label="" /></div> เลือก
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-400">
                    <div className="w-6 h-6"><SeatIcon status="sold" label="" /></div> ขายแล้ว
                </div>
            </div>
        </div>

        {/* Map Area */}
        <div className="flex-1 overflow-hidden relative cursor-grab active:cursor-grabbing flex items-center justify-center bg-dots-pattern">
             <div 
                className="transition-transform duration-200 ease-out"
                style={{ transform: `scale(${scale})` }}
            >
                {/* STAGE */}
                <div className="w-[600px] h-32 bg-gradient-to-b from-gray-700 to-gray-800 mx-auto mb-20 rounded-sm flex items-center justify-center text-white/20 font-black text-4xl tracking-[1em] shadow-2xl relative">
                    STAGE
                    <div className="absolute bottom-0 w-full h-1 bg-blue-500 shadow-[0_0_30px_#3B82F6]"></div>
                </div>

                {/* Seats Grid */}
                <div className="grid gap-3 justify-center" style={{ gridTemplateColumns: `repeat(14, minmax(0, 1fr))` }}>
                    {seats.map((seat) => (
                        <button
                            key={seat.id}
                            onClick={() => toggleSeat(seat.id)}
                            disabled={seat.status === "sold" || seat.status === "reserved"}
                            className="relative w-12 h-12 focus:outline-none group"
                        >
                            <SeatIcon status={seat.status} label={seat.id} />
                        </button>
                    ))}
                </div>
            </div>
        </div>

        {/* Zoom Controls */}
        <div className="absolute right-6 bottom-6 flex flex-col gap-2 bg-[#161B22] p-2 rounded-xl border border-white/10 shadow-xl z-10">
            <button onClick={() => setScale(s => Math.min(s + 0.1, 2))} className="p-2 hover:bg-white/10 rounded-lg text-white"><Plus size={20} /></button>
            <button onClick={() => setScale(s => Math.max(s - 0.1, 0.5))} className="p-2 hover:bg-white/10 rounded-lg text-white"><Minus size={20} /></button>
            <button onClick={() => setScale(1)} className="p-2 hover:bg-white/10 rounded-lg text-white"><RotateCcw size={20} /></button>
        </div>

      </div>
    </div>
  );
}