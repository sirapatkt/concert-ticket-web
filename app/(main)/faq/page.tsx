"use client";
import { useState } from "react";
import { HelpCircle, ChevronDown, CreditCard, Ticket, AlertCircle, User, MapPin, QrCode } from "lucide-react";
import React from "react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      category: "การซื้อบัตรและการชำระเงิน",
      icon: <CreditCard />,
      items: [
        { q: "มีช่องทางการชำระเงินอะไรบ้าง?", a: "ขณะนี้เรารองรับการชำระเงินผ่าน **QR PromptPay (สแกนจ่าย)** เท่านั้นครับ เพื่อความสะดวก รวดเร็ว และสามารถยืนยันยอดเงินได้ทันทีโดยไม่ต้องส่งสลิป" },
        { q: "จำกัดจำนวนการซื้อบัตรต่อครั้งหรือไม่?", a: "โดยปกติจะจำกัดที่ 4-6 ใบต่อ 1 บัญชีผู้ใช้ เพื่อกระจายบัตรให้ทั่วถึง ทั้งนี้ขึ้นอยู่กับเงื่อนไขของผู้จัดงานแต่ละคอนเสิร์ตครับ" },
        { q: "มีเวลาในการชำระเงินกี่นาที?", a: "หลังจากกดจองที่นั่ง ท่านมีเวลา 15 นาทีในการสแกน QR Code เพื่อชำระเงิน หากเกินเวลา ระบบจะปล่อยที่นั่งให้ผู้อื่นทันทีครับ" },
        { q: "ขอใบกำกับภาษีได้ไหม?", a: "ได้ครับ ในขั้นตอนการชำระเงิน ท่านสามารถเลือก 'ขอใบกำกับภาษี' และกรอกข้อมูลได้เลย ระบบจะส่ง E-Tax Invoice ให้ทางอีเมล" }
      ]
    },
    {
      category: "การรับบัตรและการเข้างาน",
      icon: <Ticket />,
      items: [
        { q: "จะได้รับบัตรคอนเสิร์ตทางไหน?", a: "ท่านจะได้รับ E-Ticket ทางอีเมลที่ลงทะเบียนไว้ และสามารถเปิดดู QR Code ได้ในเมนู 'My Tickets' บนเว็บไซต์ได้ตลอดเวลาครับ" },
        { q: "E-Ticket ใช้อย่างไร?", a: "สามารถแสดง QR Code จากมือถือให้เจ้าหน้าที่สแกนที่หน้างานได้เลย โดยไม่ต้องปริ้นท์กระดาษครับ สะดวกและรวดเร็ว" },
        { q: "ถ้าเลือกรับบัตรแข็ง (บัตรพลาสติก) ต้องทำอย่างไร?", a: "สำหรับบางงานที่มีบัตรแข็ง ท่านสามารถนำหลักฐานการจอง + บัตรประชาชนตัวจริง ไปแลกรับได้ที่จุดรับบัตรหน้างาน (Ticket Booth) ก่อนเวลาแสดง 2 ชั่วโมงครับ" }
      ]
    },
    {
      category: "การเลื่อน/ยกเลิก และคืนเงิน",
      icon: <AlertCircle />,
      items: [
        { q: "ซื้อบัตรแล้วเปลี่ยนใจ คืนเงินได้ไหม?", a: "ทางเราสงวนสิทธิ์ไม่รับคืนเงินทุกกรณี (Non-Refundable) ยกเว้นกรณีที่งานคอนเสิร์ตถูกยกเลิกหรือเลื่อนวันแสดงโดยผู้จัดงานเท่านั้นครับ" },
        { q: "ถ้างานถูกยกเลิก จะได้รับเงินคืนอย่างไร?", a: "ระบบจะทำการคืนเงินเข้าสู่บัญชีธนาคารที่ท่านแจ้งไว้ ภายใน 14-30 วันทำการครับ โดยจะมีอีเมลแจ้งเตือนสถานะการคืนเงินให้ทราบ" }
      ]
    },
    {
      category: "บัญชีผู้ใช้และสมาชิก",
      icon: <User />,
      items: [
        { q: "ลืมรหัสผ่าน ต้องทำอย่างไร?", a: "กดที่เมนู 'เข้าสู่ระบบ' แล้วเลือก 'ลืมรหัสผ่าน' ระบบจะส่งลิงก์สำหรับตั้งรหัสผ่านใหม่ไปที่อีเมลของท่านครับ" },
        { q: "สมัครสมาชิกเสียค่าใช้จ่ายไหม?", a: "สมัครสมาชิก BEATPASS ฟรี! ไม่มีค่าใช้จ่ายตลอดชีพ พร้อมรับสิทธิพิเศษมากมาย" }
      ]
    },
    {
      category: "สถานที่และกฎระเบียบ",
      icon: <MapPin />,
      items: [
        { q: "นำกล้องถ่ายรูปเข้างานได้ไหม?", a: "โดยทั่วไปอนุญาตเฉพาะมือถือเท่านั้นครับ ห้ามนำกล้องโปร (DSLR/Mirrorless), ไม้เซลฟี่, แท็บเล็ตขนาดใหญ่ หรือป้ายไฟขนาดใหญ่เข้างาน (กรุณาตรวจสอบกฎเฉพาะของแต่ละงานอีกครั้ง)" },
        { q: "มีที่จอดรถรองรับหรือไม่?", a: "สถานที่จัดงานหลักๆ เช่น อิมแพ็ค, รัชดาลัย, ไบเทค มีอาคารจอดรถรองรับครับ แต่อาจมีค่าบริการตามอัตราของสถานที่นั้นๆ แนะนำให้เผื่อเวลาเดินทางครับ" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#05070A] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 text-white mb-6 shadow-lg shadow-blue-500/20">
            <HelpCircle size={32} />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">คำถามที่พบบ่อย</h1>
          <p className="text-gray-400">รวมทุกข้อสงสัยเกี่ยวกับการจองบัตรคอนเสิร์ตกับ BEATPASS</p>
        </div>

        {/* FAQ List */}
        <div className="space-y-10">
          {faqs.map((section, sIndex) => (
            <div key={sIndex}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6 pl-2">
                 <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                    {section.icon}
                 </div>
                 <h3 className="text-xl font-bold text-white uppercase tracking-wide">
                    {section.category}
                 </h3>
              </div>

              {/* Accordion Items */}
              <div className="space-y-3">
                {section.items.map((item, iIndex) => {
                  const globalIndex = sIndex * 100 + iIndex;
                  const isOpen = openIndex === globalIndex;
                  
                  return (
                    <div 
                      key={globalIndex}
                      className={`bg-[#12141a] border rounded-2xl transition-all duration-300 ${isOpen ? "border-blue-500/50 bg-[#161a23]" : "border-white/5 hover:border-white/20"}`}
                    >
                      <button 
                        onClick={() => setOpenIndex(isOpen ? null : globalIndex)}
                        className="w-full flex items-center justify-between p-6 text-left"
                      >
                        <span className={`font-medium text-lg pr-4 ${isOpen ? "text-blue-400" : "text-gray-200"}`}>
                          {item.q}
                        </span>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-all ${isOpen ? "bg-blue-500 text-white rotate-180" : "bg-white/5 text-gray-500"}`}>
                          <ChevronDown size={18} />
                        </div>
                      </button>
                      
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${isOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}
                      >
                        <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                          {item.a}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}