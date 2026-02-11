"use client";
import { Send, Phone, Mail, MapPin, MessageSquare, Clock } from "lucide-react";
import React from "react";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#05070A] pt-32 pb-20 px-6 relative overflow-hidden">
      {/* Background Decor */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Left Column: Contact Info */}
          <div className="space-y-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 text-xs font-bold uppercase tracking-wider mb-4">
                Contact Support
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                มีคำถามหรือ<br />พบปัญหาการใช้งาน?
              </h1>
              <p className="text-gray-400 text-lg leading-relaxed">
                ทีมงาน BEATPASS พร้อมดูแลคุณตลอด 24 ชั่วโมง ไม่ว่าจะเป็นเรื่องการจองบัตร การชำระเงิน หรือสอบถามข้อมูลเพิ่มเติม
              </p>
            </div>

            <div className="space-y-6">
              <ContactItem 
                icon={<MapPin size={24} />} 
                title="ที่อยู่บริษัท" 
                detail="123 อาคารไซเบอร์ทาวเวอร์ ชั้น 15 ถนนรัชดาภิเษก เขตห้วยขวาง กรุงเทพฯ 10400" 
              />
              <ContactItem 
                icon={<Phone size={24} />} 
                title="เบอร์โทรศัพท์" 
                detail="02-123-4567 (ทุกวัน 09:00 - 22:00 น.)" 
              />
              <ContactItem 
                icon={<Mail size={24} />} 
                title="อีเมล" 
                detail="support@beatpass.com" 
              />
              <ContactItem 
                icon={<Clock size={24} />} 
                title="เวลาทำการ" 
                detail="ฝ่ายบริการลูกค้า: 24 ชั่วโมง" 
              />
            </div>
          </div>

          {/* Right Column: Form */}
          <div className="bg-[#12141a] p-8 md:p-10 rounded-3xl border border-white/5 shadow-2xl">
            <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <MessageSquare className="text-blue-500" /> ส่งข้อความถึงเรา
            </h3>
            
            <form className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">ชื่อ</label>
                  <input type="text" className="w-full bg-[#05070A] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="ชื่อจริง" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">นามสกุล</label>
                  <input type="text" className="w-full bg-[#05070A] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="นามสกุล" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">อีเมล</label>
                <input type="email" className="w-full bg-[#05070A] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none transition-all" placeholder="name@example.com" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">หัวข้อติดต่อ</label>
                <select className="w-full bg-[#05070A] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all appearance-none cursor-pointer">
                  <option>แจ้งปัญหาการชำระเงิน</option>
                  <option>เข้าสู่ระบบไม่ได้ / ลืมรหัสผ่าน</option>
                  <option>ไม่ได้รับบัตร E-Ticket</option>
                  <option>ขอใบกำกับภาษี</option>
                  <option>ติดต่อลงโฆษณา / ผู้จัดงาน</option>
                  <option>อื่นๆ</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">รายละเอียด</label>
                <textarea rows={4} className="w-full bg-[#05070A] border border-white/10 rounded-xl p-3 text-white focus:border-blue-500 outline-none transition-all resize-none" placeholder="อธิบายปัญหาที่คุณพบ..."></textarea>
              </div>

              <button type="button" className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-500/20 mt-4">
                <Send size={20} /> ส่งข้อความ
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}

function ContactItem({ icon, title, detail }: { icon: React.ReactNode, title: string, detail: string }) {
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5">
      <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500 shrink-0">
        {icon}
      </div>
      <div>
        <h4 className="text-white font-bold text-lg mb-1">{title}</h4>
        <p className="text-gray-400 text-sm leading-relaxed">{detail}</p>
      </div>
    </div>
  );
}