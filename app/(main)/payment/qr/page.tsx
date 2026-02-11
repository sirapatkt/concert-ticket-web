"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ChevronLeft, Timer, Download, Share2, ScanLine, CheckCircle2, Loader2 } from "lucide-react";

export default function PaymentQRPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const params = {
    name: searchParams.get("name") || "-",
    date: searchParams.get("date") || "-",
    time: searchParams.get("time") || "-",
    venue: searchParams.get("venue") || "-",
    zone: searchParams.get("zone") || "-",
    seats: searchParams.get("seats") || "-",
    amount: searchParams.get("amount") || "0",
  };

  const [timeLeft, setTimeLeft] = React.useState(300); 
  const [isChecking, setIsChecking] = React.useState(false);
  const [refNo, setRefNo] = React.useState("");

  React.useEffect(() => {
    setRefNo(`BEAT-${Math.floor(100000 + Math.random() * 90000000)}`);
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

  const handleSimulatePayment = () => {
    setIsChecking(true);
    setTimeout(() => {
      const query = new URLSearchParams(params).toString();
      router.push(`/ticket?${query}`); 
    }, 2000);
  };

  const slipText = `PAYMENT SUCCESS%0A%0ARef: ${refNo}%0AAmount: ${params.amount} THB%0A%0A(BeatPass Demo)`;
  const mockSlipUrl = `https://placehold.co/600x800/00B4D8/ffffff/png?text=${slipText}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&margin=10&data=${encodeURIComponent(mockSlipUrl)}`;

  return (
    // ✅ 1. เพิ่ม style={{ paddingTop: '80px' }} เพื่อดันเนื้อหาลงมาแน่นอน 100%
    <div 
      className="min-h-screen bg-[#0B0F14] text-white font-sans pb-20 relative overflow-hidden flex flex-col items-center"
      style={{ paddingTop: '80px' }}
    >
      
      {/* Background Glow */}
      <div className="absolute top-[-20%] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#00B4D8]/10 rounded-full blur-[120px] pointer-events-none" />

      {/* ✅ 2. ปุ่มย้อนกลับ (ลบ sticky ออก เพราะเราดัน padding ตัวแม่ลงมาแล้ว) */}
      <div className="w-full flex items-center px-8 mb-6 z-50">
        <button 
            onClick={() => router.back()} 
            className="flex items-center gap-2 text-gray-400 hover:text-white transition-all text-sm font-bold bg-[#161B22]/80 px-4 py-2 rounded-full border border-white/10 backdrop-blur-md shadow-lg hover:bg-[#252b36]"
        >
          <ChevronLeft size={20} /> ย้อนกลับ
        </button>
      </div>

      <div className="max-w-sm w-full px-6 relative z-10 flex flex-col items-center">
        
        {/* Timer Badge */}
        <div className="bg-[#161B22] border border-[#E60023]/30 px-6 py-2 rounded-full mb-8 flex items-center gap-3 shadow-lg shadow-red-900/10 animate-pulse">
          <Timer size={18} className="text-[#E60023]" />
          <span className="text-[#E60023] font-bold font-mono text-lg">{formatTime(timeLeft)}</span>
          <span className="text-xs text-gray-400">กรุณาชำระเงินภายในเวลา</span>
        </div>

        {/* QR Card */}
        <div className="w-full bg-white text-black rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(0,180,216,0.15)] relative">
            <div className="bg-[#003D6B] p-5 flex items-center gap-4">
                <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center p-1 shrink-0">
                    <div className="w-full h-full border-2 border-[#003D6B] rounded flex flex-col items-center justify-center">
                        <span className="text-[8px] font-bold text-[#003D6B] leading-none">Prompt</span>
                        <span className="text-[10px] font-black text-[#003D6B] leading-none">Pay</span>
                    </div>
                </div>
                <div className="text-white">
                    <p className="font-bold text-lg leading-tight">พร้อมเพย์</p>
                    <p className="text-xs opacity-80">Thai QR Payment</p>
                </div>
            </div>

            <div className="p-8 flex flex-col items-center">
                <div className="relative group">
                    <div className="w-64 h-64 border-4 border-black p-2 rounded-xl bg-white flex flex-wrap content-center justify-center gap-1 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity">
                       <ScanLine size={180} className="text-gray-800 opacity-10 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
                       <img 
                         src={qrCodeUrl} 
                         alt="Payment QR Code" 
                         className="w-full h-full object-contain mix-blend-multiply"
                       />
                    </div>
                    <p className="absolute -bottom-6 w-full text-center text-[10px] text-gray-400 font-mono tracking-wider">Ref: {refNo}</p>
                </div>

                <div className="mt-10 text-center w-full border-t border-gray-100 pt-6">
                    <p className="text-gray-500 text-sm font-bold mb-1">ยอดชำระทั้งหมด</p>
                    <p className="text-4xl font-black text-[#003D6B] tracking-tight">฿{Number(params.amount).toLocaleString()}</p>
                </div>

                <div className="mt-6 w-full bg-gray-50 rounded-xl p-4 text-left space-y-2">
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">ผู้รับเงิน</span>
                        <span className="font-bold text-gray-700">บจก. บีทพาส (ประเทศไทย)</span>
                    </div>
                    <div className="flex justify-between text-xs">
                        <span className="text-gray-500">หมายเลขรายการ</span>
                        <span className="font-bold text-gray-700">TXN-{refNo.split('-')[1]}</span> 
                    </div>
                </div>
            </div>

            <div className="bg-gray-50 p-4 flex gap-3 border-t border-gray-100">
                <button className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                    <Download size={16} /> บันทึก
                </button>
                <button className="flex-1 py-3 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors">
                    <Share2 size={16} /> แชร์
                </button>
            </div>
        </div>

        {/* Payment Simulation Button */}
        <div className="mt-8 w-full space-y-4 pb-10">
            {isChecking ? (
                <button disabled className="w-full py-4 bg-gray-800 text-gray-400 rounded-2xl font-bold flex items-center justify-center gap-3 cursor-wait">
                    <Loader2 size={20} className="animate-spin" /> กำลังตรวจสอบยอดเงิน...
                </button>
            ) : (
                <button 
                    onClick={handleSimulatePayment}
                    className="w-full py-4 bg-[#00B4D8] hover:bg-[#0096B4] text-white rounded-2xl font-black text-lg shadow-[0_0_20px_rgba(0,180,216,0.3)] transition-all transform active:scale-95 flex items-center justify-center gap-2"
                >
                    <CheckCircle2 size={24} /> จำลองการชำระเงินสำเร็จ
                </button>
            )}
            
            <p className="text-center text-xs text-gray-500">
                ระบบจะตรวจสอบยอดเงินอัตโนมัติ <br/>หากมีปัญหาติดต่อ <span className="text-[#00B4D8] underline cursor-pointer">Support</span>
            </p>
        </div>

      </div>
    </div>
  );
}