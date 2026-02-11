"use client";
import { QrCode, Smartphone, Check, ArrowRight, ShieldCheck, Clock } from "lucide-react";
import React from "react";

export default function HowToBuyPage() {
  
  const steps = [
    { 
      id: "01",
      title: "เลือกที่นั่ง", 
      desc: "เลือกโซนที่ใช่ วิวที่ชอบ แล้วกดยืนยันการจอง" 
    },
    { 
      id: "02",
      title: "สแกนจ่าย", 
      desc: "เปิดแอปธนาคาร สแกน QR Code ที่ปรากฏ" 
    },
    { 
      id: "03",
      title: "รับบัตรทันที", 
      desc: "ระบบยืนยันยอดอัตโนมัติ รับ E-Ticket เข้างานได้เลย" 
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070A] pt-32 pb-20 px-6 relative overflow-hidden">
      
      {/* Background Glow (แสงพื้นหลังจางๆ ให้ดูมีมิติ ไม่มืดสนิท) */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[128px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Header: ใช้ตัวหนังสือไล่สี ให้ดู Modern */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
            <ShieldCheck size={14} /> Secure Payment
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            ชำระเงินง่าย <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">ผ่าน QR Code</span>
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            สะดวก รวดเร็ว และปลอดภัย รองรับทุกธนาคาร ยืนยันยอดได้ทันทีตลอด 24 ชม.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: QR Card Demo (ทำให้ดูเหมือนบัตรจริง) */}
          <div className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
            
            <div className="relative bg-[#12141a] border border-white/10 rounded-3xl p-8 overflow-hidden shadow-2xl">
              {/* ตกแต่งพื้นหลังการ์ด */}
              <div className="absolute top-0 right-0 p-3 opacity-10">
                <QrCode size={150} />
              </div>

              <div className="flex flex-col items-center text-center space-y-6 relative z-10">
                <div className="w-20 h-20 bg-white rounded-xl flex items-center justify-center p-2 shadow-lg shadow-blue-500/20">
                  <QrCode className="text-black w-full h-full" />
                </div>
                
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-white">PromptPay QR</h3>
                  <p className="text-blue-400 text-sm">สแกนจ่ายได้ทุกธนาคาร</p>
                </div>

                <div className="w-full bg-white/5 rounded-xl p-4 border border-white/5 space-y-3">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>ผู้รับเงิน</span>
                    <span className="text-white font-medium">BEATPASS Corp.</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>ค่าธรรมเนียม</span>
                    <span className="text-green-400 font-medium">ฟรี (0 บาท)</span>
                  </div>
                  <div className="border-t border-white/10 pt-3 flex justify-between items-center">
                     <span className="text-sm text-gray-400">ยอดชำระ</span>
                     <span className="text-xl font-bold text-white">฿ 2,500.00</span>
                  </div>
                </div>

                <div className="flex gap-2 text-xs text-gray-500">
                   <Clock size={14} /> ระบบจะตรวจสอบยอดเงินอัตโนมัติ
                </div>
              </div>
            </div>
          </div>

          {/* Right: Steps (ทำเป็น Timeline แนวตั้งสวยๆ) */}
          <div className="space-y-8 pl-4 lg:pl-10">
            {steps.map((step, index) => (
              <div key={index} className="flex gap-6 group">
                {/* Number Box */}
                <div className="relative">
                  <div className="w-12 h-12 rounded-2xl bg-[#12141a] border border-white/10 flex items-center justify-center text-xl font-bold text-gray-500 group-hover:text-white group-hover:bg-blue-600 group-hover:border-blue-600 transition-all duration-300 shadow-lg z-10 relative">
                    {step.id}
                  </div>
                  {/* เส้นเชื่อม (Timeline Line) - ซ่อนตัวสุดท้าย */}
                  {index !== steps.length - 1 && (
                    <div className="absolute top-12 left-1/2 w-[2px] h-full bg-white/5 -ml-[1px] -z-0" />
                  )}
                </div>

                {/* Content */}
                <div className="pb-8">
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}

            {/* CTA Button */}
            <div className="pt-4">
              <button className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-blue-500 hover:text-white transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-blue-500/50">
                 ดูรอบการแสดงทั้งหมด <ArrowRight size={18} />
              </button>
            </div>
          </div>

        </div>

        {/* Feature Icons (Grid ด้านล่าง) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-20 border-t border-white/5 pt-12">
           <FeatureItem icon={<Smartphone />} text="รองรับ Mobile Banking" />
           <FeatureItem icon={<Clock />} text="ทำรายการได้ 24 ชม." />
           <FeatureItem icon={<ShieldCheck />} text="ระบบความปลอดภัยสูง" />
           <FeatureItem icon={<Check />} text="ยืนยันยอดทันที" />
        </div>

      </div>
    </div>
  );
}

function FeatureItem({ icon, text }: { icon: React.ReactNode, text: string }) {
  return (
    <div className="flex flex-col items-center gap-3 text-center p-4 rounded-2xl hover:bg-white/5 transition-colors cursor-default">
      <div className="text-gray-500 group-hover:text-white transition-colors">
        {icon}
      </div>
      <span className="text-sm text-gray-400 font-medium">{text}</span>
    </div>
  );
}