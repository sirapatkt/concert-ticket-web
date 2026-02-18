"use client";

import { useState } from "react";
import { Plus, Minus } from "lucide-react";

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      question: "ฉันจะได้รับเงินค่าบัตรเมื่อไหร่?",
      answer: "ระบบจะทำการโอนเงินให้ผู้จัดงานภายใน 7 วันทำการหลังจากจบงานอีเวนต์ โดยจะหักค่าธรรมเนียมแพลตฟอร์ม 3% เรียบร้อยแล้ว"
    },
    {
      question: "สามารถแก้ไขผังที่นั่งหลังจากเปิดขายไปแล้วได้ไหม?",
      answer: "ไม่ได้ครับ เพื่อป้องกันความสับสนของลูกค้า หากเปิดขายบัตรไปแล้ว คุณจะไม่สามารถเปลี่ยนโครงสร้างผังที่นั่งได้ แต่ยังสามารถ เพิ่ม/ลด โควต้าบัตรในโซนนั้นๆ ได้"
    },
    {
      question: "ต้องเสียค่าธรรมเนียมเท่าไหร่ในการขายบัตร?",
      answer: "BEATPASS คิดค่าธรรมเนียม 3% จากยอดขายบัตร (รวม VAT แล้ว) โดยไม่มีค่าใช้จ่ายแอบแฝงอื่นๆ ในการเปิดใช้งานระบบ"
    },
    {
      question: "ระบบ Check-in รองรับ Offline Mode ไหม?",
      answer: "รองรับครับ แอปพลิเคชัน Check-in ของเราสามารถทำงานได้แม้ไม่มีอินเทอร์เน็ต โดยระบบจะทำการ Sync ข้อมูลทันทีเมื่อกลับมาเชื่อมต่อเน็ตได้"
    },
    {
      question: "จำกัดจำนวนทีมงานที่เข้าสู่ระบบไหม?",
      answer: "ไม่จำกัดครับ คุณสามารถเชิญทีมงานเข้ามาช่วยจัดการได้ไม่จำกัดจำนวน โดยสามารถกำหนดสิทธิ์ (Permission) แยกรายบุคคลได้ที่หน้าตั้งค่า"
    }
  ];

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-white">คำถามที่พบบ่อย (FAQ)</h1>
        <p className="text-slate-400 mt-2">รวบรวมคำถามยอดฮิตจากผู้จัดงาน</p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div 
            key={index} 
            className={`bg-[#0f172a] border rounded-xl overflow-hidden transition-all duration-300 ${
              openIndex === index ? 'border-blue-500/50 shadow-lg shadow-blue-900/10' : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
              <span className={`font-medium text-lg ${openIndex === index ? 'text-blue-400' : 'text-white'}`}>
                {faq.question}
              </span>
              <span className="text-slate-400 ml-4">
                {openIndex === index ? <Minus size={20} /> : <Plus size={20} />}
              </span>
            </button>
            
            <div 
              className={`px-6 text-slate-400 overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-40 pb-6 opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <p className="leading-relaxed border-t border-slate-800 pt-4">{faq.answer}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-12 text-center p-8 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
        <p className="text-slate-300 mb-4">ยังไม่เจอคำตอบที่คุณต้องการ?</p>
        <a href="/organizer/contact" className="inline-block bg-white text-black px-6 py-2 rounded-full font-medium hover:bg-slate-200 transition-colors">
          ติดต่อทีมงาน
        </a>
      </div>
    </div>
  );
}