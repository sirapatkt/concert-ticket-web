// 📂 ไฟล์: app/organizer/settings/page.tsx
"use client";

import { useState } from "react";
import { 
  Save, User, Building, CreditCard, Lock, Bell, 
  Camera, CheckCircle 
} from "lucide-react";

export default function SettingsPage() {
  // State จำลองข้อมูลผู้ใช้
  const [profile, setProfile] = useState({
    companyName: "GMM Grammy",
    contactName: "คุณสมชาย ใจดี",
    email: "contact@gmm.com",
    phone: "02-669-9000",
    website: "https://www.gmmgrammy.com",
    bio: "บริษัทบันเทิงครบวงจร อันดับ 1 ของประเทศไทย",
  });

  const [bankInfo, setBankInfo] = useState({
    bankName: "KBANK",
    accountName: "บจก. จีเอ็มเอ็ม แกรมมี่",
    accountNumber: "123-4-56789-0"
  });

  const [notifications, setNotifications] = useState({
    emailAlert: true,
    smsAlert: false,
    saleSummary: true
  });

  // ฟังก์ชันบันทึกข้อมูล
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Saved:", { profile, bankInfo, notifications });
    alert("บันทึกข้อมูลเรียบร้อยแล้ว!");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-20">
      
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            ตั้งค่าบัญชี
          </h1>
          <p className="text-slate-400 mt-1">จัดการข้อมูลบริษัท ช่องทางรับเงิน และความปลอดภัย</p>
        </div>
        <button 
          onClick={handleSave}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all"
        >
          <Save size={18} /> บันทึกการแก้ไข
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* คอลัมน์ซ้าย: เมนูย่อย (แบบจำลอง UI) */}
        <div className="space-y-6">
          <div className="bg-[#0F172A] p-4 rounded-xl border border-slate-800 shadow-lg">
            <div className="flex flex-col items-center py-6 border-b border-slate-800 mb-4">
              <div className="w-24 h-24 bg-slate-700 rounded-full mb-3 overflow-hidden border-2 border-blue-500 relative group cursor-pointer">
                <img 
                  src="https://images.unsplash.com/photo-1560179707-f14e90ef3623?w=300&q=80" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Camera size={24} className="text-white" />
                </div>
              </div>
              <h2 className="text-lg font-bold text-white">{profile.companyName}</h2>
              <p className="text-sm text-slate-400">Organizer Account</p>
            </div>
            
            <nav className="space-y-1">
              {[
                { icon: User, label: "ข้อมูลทั่วไป", active: true },
                { icon: CreditCard, label: "บัญชีธนาคาร (รับเงิน)", active: false },
                { icon: Bell, label: "การแจ้งเตือน", active: false },
                { icon: Lock, label: "รหัสผ่าน & ความปลอดภัย", active: false },
              ].map((item, idx) => (
                <button 
                  key={idx}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                    item.active 
                    ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                  }`}
                >
                  <item.icon size={18} /> {item.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* คอลัมน์ขวา: ฟอร์มแก้ไข */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. ข้อมูลบริษัท */}
          <section className="bg-[#0F172A] p-6 rounded-xl border border-slate-800 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Building size={20} className="text-blue-400" /> ข้อมูลบริษัท / ทีมงาน
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm text-slate-400 mb-1 block">ชื่อบริษัท / ทีมผู้จัด</label>
                <input 
                  type="text" 
                  value={profile.companyName}
                  onChange={(e) => setProfile({...profile, companyName: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">ชื่อผู้ติดต่อหลัก</label>
                <input 
                  type="text" 
                  value={profile.contactName}
                  onChange={(e) => setProfile({...profile, contactName: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">เบอร์โทรศัพท์</label>
                <input 
                  type="text" 
                  value={profile.phone}
                  onChange={(e) => setProfile({...profile, phone: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-slate-400 mb-1 block">อีเมล (สำหรับติดต่องาน)</label>
                <input 
                  type="email" 
                  value={profile.email}
                  onChange={(e) => setProfile({...profile, email: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-slate-400 mb-1 block">เกี่ยวกับผู้จัด (Bio)</label>
                <textarea 
                  rows={3}
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none resize-none"
                />
              </div>
            </div>
          </section>

          {/* 2. ข้อมูลบัญชีรับเงิน */}
          <section className="bg-[#0F172A] p-6 rounded-xl border border-slate-800 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <CreditCard size={20} className="text-green-400" /> บัญชีรับเงิน (Revenue)
            </h3>
            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg mb-4 flex items-start gap-3">
              <CheckCircle className="text-green-400 mt-0.5" size={18} />
              <div>
                <p className="text-sm text-green-300 font-medium">ยืนยันบัญชีแล้ว</p>
                <p className="text-xs text-green-400/70">รายได้จากการขายบัตรจะถูกโอนเข้าบัญชีนี้ทุกวันทำการ</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm text-slate-400 mb-1 block">ธนาคาร</label>
                <select 
                  value={bankInfo.bankName}
                  onChange={(e) => setBankInfo({...bankInfo, bankName: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 outline-none"
                >
                  <option value="KBANK">กสิกรไทย (KBANK)</option>
                  <option value="SCB">ไทยพาณิชย์ (SCB)</option>
                  <option value="BBL">กรุงเทพ (BBL)</option>
                </select>
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">เลขที่บัญชี</label>
                <input 
                  type="text" 
                  value={bankInfo.accountNumber}
                  onChange={(e) => setBankInfo({...bankInfo, accountNumber: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 outline-none font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-slate-400 mb-1 block">ชื่อบัญชี</label>
                <input 
                  type="text" 
                  value={bankInfo.accountName}
                  onChange={(e) => setBankInfo({...bankInfo, accountName: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* 3. การแจ้งเตือน */}
          <section className="bg-[#0F172A] p-6 rounded-xl border border-slate-800 shadow-lg">
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
              <Bell size={20} className="text-yellow-400" /> การแจ้งเตือน
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div>
                  <p className="text-white font-medium">แจ้งเตือนทางอีเมล</p>
                  <p className="text-xs text-slate-500">เมื่อมีการสั่งซื้อบัตรสำเร็จ</p>
                </div>
                <div 
                  onClick={() => setNotifications({...notifications, emailAlert: !notifications.emailAlert})}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notifications.emailAlert ? 'bg-blue-600' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${notifications.emailAlert ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>

              <div className="flex justify-between items-center pb-4 border-b border-slate-800">
                <div>
                  <p className="text-white font-medium">สรุปยอดขายรายวัน</p>
                  <p className="text-xs text-slate-500">ส่งอีเมลสรุปยอดขายทุกเที่ยงคืน</p>
                </div>
                <div 
                  onClick={() => setNotifications({...notifications, saleSummary: !notifications.saleSummary})}
                  className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${notifications.saleSummary ? 'bg-blue-600' : 'bg-slate-700'}`}
                >
                  <div className={`w-4 h-4 rounded-full bg-white shadow-sm transform transition-transform ${notifications.saleSummary ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}