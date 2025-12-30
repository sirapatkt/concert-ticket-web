"use client";
import { useState } from "react";
import { Settings, Save, Power, Globe, Bell, Lock, RefreshCw } from "lucide-react";

export default function SettingsPage() {
  // State สำหรับ Mock การทำงาน
  const [isMaintenance, setIsMaintenance] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันกดบันทึก
  const handleSave = () => {
    setIsLoading(true);
    
    // จำลองการโหลด 1 วินาที
    setTimeout(() => {
      setIsLoading(false);
      alert("✅ บันทึกการตั้งค่าเรียบร้อยแล้ว!");
    }, 1000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2 text-white">
          <Settings className="text-gray-400" /> ตั้งค่าระบบ (System Settings)
        </h1>
        <p className="text-gray-400 text-sm mt-1">จัดการข้อมูลพื้นฐานและการตั้งค่าความปลอดภัยของเว็บไซต์</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: General Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Card 1: Site Info */}
          <div className="bg-[#161B22] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
              <Globe size={18} className="text-blue-500" /> ข้อมูลทั่วไป
            </h3>
            
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">ชื่อเว็บไซต์ (Site Title)</label>
                  <input type="text" defaultValue="BEATPASS" className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1.5">คำอธิบาย (Description)</label>
                  <input type="text" defaultValue="Concert Ticket Platform" className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">อีเมลติดต่อ Admin (Support Email)</label>
                <input type="email" defaultValue="support@beatpass.com" className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">ค่าธรรมเนียมระบบ (Service Fee %)</label>
                <div className="relative">
                  <input type="number" defaultValue="7" className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500">%</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">* หักจากยอดขายบัตรคอนเสิร์ตทุกใบ</p>
              </div>
            </div>
          </div>

          {/* Button Save */}
          <button 
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-blue-900/20 active:scale-[0.98]"
          >
            {isLoading ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
            {isLoading ? "กำลังบันทึก..." : "บันทึกการตั้งค่า"}
          </button>
        </div>

        {/* Right Column: Danger Zone & Status */}
        <div className="space-y-6">
          
          {/* Card: Maintenance Mode */}
          <div className={`border rounded-2xl p-6 transition-all ${isMaintenance ? 'bg-orange-500/10 border-orange-500/20' : 'bg-[#161B22] border-white/5'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${isMaintenance ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400'}`}>
                <Power size={24} />
              </div>
              <button 
                onClick={() => setIsMaintenance(!isMaintenance)}
                className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${isMaintenance ? 'bg-orange-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform duration-300 ${isMaintenance ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            
            <h3 className={`font-bold text-lg mb-1 ${isMaintenance ? 'text-orange-400' : 'text-white'}`}>Maintenance Mode</h3>
            <p className="text-sm text-gray-400 mb-4">
              {isMaintenance 
                ? "⚠️ เว็บไซต์ปิดปรับปรุงอยู่ ผู้ใช้งานทั่วไปจะไม่สามารถเข้าถึงได้" 
                : "เว็บไซต์เปิดให้บริการตามปกติ"}
            </p>
            
            <div className="text-xs font-mono bg-[#0B0F14] p-3 rounded-lg text-gray-500 border border-white/5">
              Status: <span className={isMaintenance ? "text-orange-500" : "text-green-500"}>{isMaintenance ? "OFFLINE" : "ONLINE"}</span>
            </div>
          </div>

          {/* Card: Notifications */}
          <div className="bg-[#161B22] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-white mb-4 flex items-center gap-2">
              <Bell size={18} className="text-yellow-500" /> การแจ้งเตือน
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">แจ้งเตือนอีเมลเมื่อมีคนสมัคร</span>
                <input type="checkbox" defaultChecked className="accent-blue-500 w-4 h-4" />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">แจ้งเตือนเมื่อมีการถอนเงิน</span>
                <input type="checkbox" defaultChecked className="accent-blue-500 w-4 h-4" />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-400">สรุปยอดรายวัน (Daily Report)</span>
                <input type="checkbox" className="accent-blue-500 w-4 h-4" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}