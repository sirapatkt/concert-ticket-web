"use client";

import { Mail, Phone, MessageSquare, Clock, Send } from "lucide-react";

export default function ContactPage() {
  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white">ติดต่อทีมงาน (Contact Support)</h1>
        <p className="text-slate-400 mt-2">ทีมงานพร้อมช่วยเหลือคุณตลอด 24 ชั่วโมง</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Contact Info (Left Column) */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-green-500/10 p-3 rounded-lg text-green-400">
                <MessageSquare size={24} />
              </div>
              <div>
                <h3 className="text-white font-medium">Line Official</h3>
                <p className="text-slate-400 text-sm mt-1">@beatpass_support</p>
                <button className="text-green-400 text-sm mt-2 hover:underline">แอดไลน์เลย</button>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-blue-500/10 p-3 rounded-lg text-blue-400">
                <Mail size={24} />
              </div>
              <div>
                <h3 className="text-white font-medium">Email Support</h3>
                <p className="text-slate-400 text-sm mt-1">support@beatpass.com</p>
                <p className="text-slate-500 text-xs mt-1">ตอบกลับภายใน 24 ชม.</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="bg-orange-500/10 p-3 rounded-lg text-orange-400">
                <Phone size={24} />
              </div>
              <div>
                <h3 className="text-white font-medium">Call Center</h3>
                <p className="text-slate-400 text-sm mt-1">02-123-4567</p>
                <div className="flex items-center gap-1 text-slate-500 text-xs mt-1">
                  <Clock size={12} /> <span>09:00 - 18:00 (จันทร์-ศุกร์)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Form (Right Column) */}
        <div className="lg:col-span-2">
          <form className="bg-[#0f172a] border border-slate-800 rounded-2xl p-8 space-y-6">
            <h2 className="text-xl font-semibold text-white mb-6">ส่งข้อความหาเรา</h2>
            
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-slate-300">ชื่อผู้ติดต่อ</label>
                <input type="text" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="ชื่อ-นามสกุล" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-slate-300">เบอร์โทรศัพท์</label>
                <input type="tel" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="08x-xxx-xxxx" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">หัวข้อเรื่อง</label>
              <select className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500">
                <option>แจ้งปัญหาการใช้งาน</option>
                <option>สอบถามเรื่องการเงิน/ภาษี</option>
                <option>ขอเพิ่มฟีเจอร์</option>
                <option>อื่นๆ</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-slate-300">รายละเอียด</label>
              <textarea rows={5} className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500" placeholder="อธิบายปัญหาที่คุณพบ..."></textarea>
            </div>

            <button type="button" className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 w-full transition-colors">
              <Send size={18} /> ส่งข้อความ
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}