"use client";
import { useState } from "react";
import Navbar from "../../components/Navbar"; // อย่าลืม import Navbar ที่เราทำเสร็จแล้วมาใส่ด้วยนะครับ
import { ChevronDown, HelpCircle, CreditCard, Ticket, AlertCircle, User, MapPin } from "lucide-react";

export default function FAQPage() {
  // State สำหรับเก็บว่าคำถามข้อไหนกำลังเปิดอยู่ (เก็บเป็น index ของหมวดหมู่และข้อคำถาม)
  const [openItem, setOpenItem] = useState<{ categoryIndex: number; questionIndex: number } | null>(null);

  const toggleItem = (categoryIndex: number, questionIndex: number) => {
    if (openItem?.categoryIndex === categoryIndex && openItem?.questionIndex === questionIndex) {
      setOpenItem(null); // ถ้ากดซ้ำให้ปิด
    } else {
      setOpenItem({ categoryIndex, questionIndex }); // เปิดข้อที่กด
    }
  };

  // ข้อมูล FAQ แบ่งตามหมวดหมู่
  const faqData = [
    {
      title: "การซื้อบัตรและการชำระเงิน",
      icon: <CreditCard className="text-blue-500" />,
      questions: [
        { q: "มีช่องทางการชำระเงินอะไรบ้าง?", a: "เรารองรับการชำระเงินผ่านบัตรเครดิต/เดบิต (Visa, Mastercard), QR PromptPay และ TrueMoney Wallet ครับ" },
        { q: "จำกัดจำนวนการซื้อบัตรต่อครั้งหรือไม่?", a: "โดยปกติจะจำกัดที่ 4-6 ใบต่อ 1 บัญชีผู้ใช้ ขึ้นอยู่กับเงื่อนไขของผู้จัดงานแต่ละคอนเสิร์ตครับ" },
        { q: "มีเวลาในการชำระเงินกี่นาที?", a: "หลังจากกดจองที่นั่ง ท่านมีเวลา 15 นาทีในการชำระเงิน หากเกินเวลา ระบบจะปล่อยที่นั่งให้ผู้อื่นทันทีครับ" },
      ]
    },
    {
      title: "การรับบัตรและการเข้างาน",
      icon: <Ticket className="text-blue-500" />,
      questions: [
        { q: "จะได้รับบัตรคอนเสิร์ตทางไหน?", a: "ท่านจะได้รับ E-Ticket ทางอีเมลที่ลงทะเบียนไว้ และสามารถเปิดดู QR Code ได้ในเมนู 'My Tickets' บนเว็บไซต์ครับ" },
        { q: "E-Ticket ใช้อย่างไร?", a: "สามารถแสดง QR Code จากมือถือให้เจ้าหน้าที่สแกนที่หน้างานได้เลย โดยไม่ต้องปริ้นท์กระดาษครับ" },
        { q: "ถ้าเลือกรับบัตรพลาสติก ต้องทำอย่างไร?", a: "สามารถนำหลักฐานการจอง + บัตรประชาชนตัวจริง ไปรับได้ที่จุดรับบัตรหน้างาน (Ticket Booth) ก่อนเวลาแสดง 2 ชั่วโมงครับ" },
      ]
    },
    {
      title: "การเลื่อน/ยกเลิก และคืนเงิน",
      icon: <AlertCircle className="text-blue-500" />,
      questions: [
        { q: "ซื้อบัตรแล้วเปลี่ยนใจ คืนเงินได้ไหม?", a: "ทางเราสงวนสิทธิ์ไม่รับคืนเงินทุกกรณี ยกเว้นกรณีที่งานคอนเสิร์ตถูกยกเลิกหรือเลื่อนวันแสดงโดยผู้จัดงานเท่านั้นครับ" },
        { q: "ถ้างานถูกยกเลิก จะได้รับเงินคืนอย่างไร?", a: "ระบบจะทำการคืนเงินเข้าสู่ช่องทางเดิมที่ท่านชำระมา ภายใน 14-30 วันทำการครับ" },
      ]
    },
    {
      title: "บัญชีผู้ใช้และสมาชิก",
      icon: <User className="text-blue-500" />,
      questions: [
        { q: "ลืมรหัสผ่าน ต้องทำอย่างไร?", a: "กดที่เมนู 'เข้าสู่ระบบ' แล้วเลือก 'ลืมรหัสผ่าน' ระบบจะส่งลิงก์ตั้งรหัสใหม่ไปที่อีเมลของท่านครับ" },
        { q: "สมัครสมาชิกเสียค่าใช้จ่ายไหม?", a: "สมัครสมาชิกฟรี ไม่มีค่าใช้จ่ายครับ" },
      ]
    },
    {
      title: "สถานที่และกฎระเบียบ",
      icon: <MapPin className="text-blue-500" />,
      questions: [
        { q: "นำกล้องถ่ายรูปเข้างานได้ไหม?", a: "อนุญาตเฉพาะมือถือเท่านั้นครับ ห้ามนำกล้องโปร (DSLR/Mirrorless), ไม้เซลฟี่ หรือแท็บเล็ตขนาดใหญ่เข้างานครับ" },
        { q: "มีที่จอดรถรองรับหรือไม่?", a: "ทั้ง อิมแพ็ค, รัชดาลัย และ มหิดลสิทธาคาร มีอาคารจอดรถรองรับครับ แต่อาจมีค่าบริการตามอัตราของสถานที่นั้นๆ ครับ" },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white">
      {/* ใส่ Navbar ไว้ด้านบน */}
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-28 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 flex items-center justify-center gap-3">
            <HelpCircle size={40} className="text-blue-500" /> 
            คำถามที่พบบ่อย (FAQ)
          </h1>
          <p className="text-gray-400">รวมทุกข้อสงสัยเกี่ยวกับการจองบัตรคอนเสิร์ตกับ BEATPASS</p>
        </div>

        {/* FAQ Sections */}
        <div className="space-y-8">
          {faqData.map((category, catIndex) => (
            <div key={catIndex} className="bg-[#12161B] rounded-2xl p-6 border border-white/5 shadow-xl">
              
              {/* Category Title */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-white/5">
                <div className="p-2 bg-blue-500/10 rounded-lg">
                  {category.icon}
                </div>
                <h2 className="text-xl font-bold text-blue-400">{category.title}</h2>
              </div>

              {/* Questions List */}
              <div className="space-y-3">
                {category.questions.map((item, qIndex) => {
                  const isOpen = openItem?.categoryIndex === catIndex && openItem?.questionIndex === qIndex;

                  return (
                    <div key={qIndex} className="group">
                      <button
                        onClick={() => toggleItem(catIndex, qIndex)}
                        className={`w-full flex items-center justify-between p-4 rounded-xl text-left transition-all duration-200 ${
                          isOpen ? "bg-blue-600 text-white" : "bg-[#0B0F14] hover:bg-[#1C2128] text-gray-200"
                        }`}
                      >
                        <span className="font-medium pr-4">{item.q}</span>
                        <ChevronDown 
                          size={20} 
                          className={`flex-shrink-0 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} 
                        />
                      </button>
                      
                      {/* Answer Area (Animation) */}
                      <div 
                        className={`overflow-hidden transition-all duration-300 ease-in-out ${
                          isOpen ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"
                        }`}
                      >
                        <div className="p-4 bg-[#1C2128]/50 rounded-xl text-gray-400 text-sm leading-relaxed border border-white/5">
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

        {/* Contact Footer */}
        <div className="mt-16 text-center pt-8 border-t border-white/5">
          <p className="text-gray-400 mb-4">ยังไม่พบคำตอบที่ต้องการ?</p>
          <button className="bg-white text-black font-bold py-3 px-8 rounded-full hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)]">
            ติดต่อเรา (Contact Support)
          </button>
        </div>

      </main>
    </div>
  );
}