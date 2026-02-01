"use client";

import { useState } from "react";
import { 
  Settings, Save, Power, Globe, Bell, 
  RefreshCw, CreditCard, Percent, ShieldCheck 
} from "lucide-react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  
  // State ค่า Config
  const [config, setConfig] = useState({
    siteTitle: "BEATPASS",
    description: "Concert Ticket Platform",
    supportEmail: "support@beatpass.com",
    serviceFee: 7,     // ค่าธรรมเนียมระบบ (%)
    vat: 7,            // VAT (%)
    gatewayFee: 3,     // ค่าธรรมเนียม Payment Gateway (%)
    maintenanceMode: false
  });

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert("✅ บันทึกการตั้งค่าเรียบร้อยแล้ว!");
    }, 1000);
  };

  return (
    <div className="p-8 min-h-screen bg-[#0B0F14] text-white space-y-8 font-sans animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="text-gray-400" /> ตั้งค่าระบบ (System Settings)
          </h1>
          <p className="text-gray-400 text-sm mt-1">กำหนดค่าพื้นฐาน ค่าธรรมเนียม และสถานะของเว็บไซต์</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-6 py-2.5 rounded-lg font-bold transition-all shadow-lg shadow-blue-900/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? <RefreshCw size={18} className="animate-spin"/> : <Save size={18} />}
          {isLoading ? "กำลังบันทึก..." : "บันทึกการเปลี่ยนแปลง"}
        </button>
      </div>

      {/* Main Content: Grid 2 Columns (ปรับ Layout ใหม่) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl">
        
        {/* Column 1: ข้อมูลทั่วไป & การเงิน */}
        <div className="space-y-6">
          
          {/* 1. General Info */}
          <div className="bg-[#161B22] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
              <Globe size={18} className="text-blue-500" /> ข้อมูลทั่วไป (General)
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">ชื่อเว็บไซต์</label>
                <input 
                  type="text" 
                  value={config.siteTitle}
                  onChange={(e) => setConfig({...config, siteTitle: e.target.value})}
                  className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">คำอธิบาย (SEO)</label>
                <textarea 
                  rows={2}
                  value={config.description}
                  onChange={(e) => setConfig({...config, description: e.target.value})}
                  className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1.5">อีเมลติดต่อ Admin</label>
                <input 
                  type="email" 
                  value={config.supportEmail}
                  onChange={(e) => setConfig({...config, supportEmail: e.target.value})}
                  className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500" 
                />
              </div>
            </div>
          </div>

          {/* 2. Financial Settings */}
          <div className="bg-[#161B22] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
              <CreditCard size={18} className="text-green-500" /> ตั้งค่าการเงิน (Financial)
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-bold">Platform Fee</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={config.serviceFee}
                    onChange={(e) => setConfig({...config, serviceFee: Number(e.target.value)})}
                    className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none font-mono text-lg"
                  />
                  <Percent size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"/>
                </div>
                <p className="text-[10px] text-gray-500">รายได้เข้าแพลตฟอร์ม</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-bold">VAT</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={config.vat}
                    onChange={(e) => setConfig({...config, vat: Number(e.target.value)})}
                    className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none font-mono text-lg"
                  />
                  <Percent size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"/>
                </div>
                <p className="text-[10px] text-gray-500">ภาษีมูลค่าเพิ่ม</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-gray-400 font-bold">Gateway Cost</label>
                <div className="relative">
                  <input 
                    type="number" 
                    value={config.gatewayFee}
                    onChange={(e) => setConfig({...config, gatewayFee: Number(e.target.value)})}
                    className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3 text-white focus:border-green-500 focus:outline-none font-mono text-lg"
                  />
                  <Percent size={14} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500"/>
                </div>
                <p className="text-[10px] text-gray-500">ต้นทุนธนาคาร</p>
              </div>
            </div>
            
            {/* Hint เล็กๆ แทน Simulator */}
            <div className="mt-4 p-3 bg-green-500/5 rounded-lg border border-green-500/10 flex items-start gap-3">
                <ShieldCheck size={16} className="text-green-500 mt-0.5"/>
                <p className="text-xs text-green-400">
                    <strong>Note:</strong> ระบบจะคำนวณกำไรสุทธิอัตโนมัติจาก (Platform Fee - Gateway Cost) ในหน้า Finance
                </p>
            </div>
          </div>
        </div>

        {/* Column 2: สถานะระบบ & แจ้งเตือน */}
        <div className="space-y-6">
          
          {/* 3. System Status (Maintenance) */}
          <div className={`border rounded-2xl p-6 transition-all ${config.maintenanceMode ? 'bg-orange-500/10 border-orange-500/20' : 'bg-[#161B22] border-white/5'}`}>
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${config.maintenanceMode ? 'bg-orange-500 text-white' : 'bg-white/5 text-gray-400'}`}>
                <Power size={24} />
              </div>
              
              {/* Toggle Switch */}
              <button 
                onClick={() => setConfig({...config, maintenanceMode: !config.maintenanceMode})}
                className={`relative w-14 h-8 rounded-full transition-colors duration-300 ${config.maintenanceMode ? 'bg-orange-500' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${config.maintenanceMode ? 'left-7' : 'left-1'}`}></div>
              </button>
            </div>
            
            <h3 className={`font-bold text-lg mb-1 ${config.maintenanceMode ? 'text-orange-400' : 'text-white'}`}>Maintenance Mode</h3>
            <p className="text-sm text-gray-400 mb-4">
              {config.maintenanceMode 
                ? "⚠️ ขณะนี้เว็บไซต์ปิดปรับปรุง (User ทั่วไปจะไม่สามารถเข้าใช้งานได้)" 
                : "✅ เว็บไซต์เปิดให้บริการตามปกติ"}
            </p>
            
            <div className="text-xs font-mono bg-[#0B0F14] p-3 rounded-lg text-gray-500 border border-white/5 flex justify-between">
              <span>Current Status:</span>
              <span className={config.maintenanceMode ? "text-orange-500 font-bold" : "text-green-500 font-bold"}>
                {config.maintenanceMode ? "OFFLINE" : "ONLINE"}
              </span>
            </div>
          </div>

          {/* 4. Notifications (ย้ายมาฝั่งขวา) */}
          <div className="bg-[#161B22] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-white mb-6 flex items-center gap-2">
              <Bell size={18} className="text-yellow-500" /> การแจ้งเตือน (Notifications)
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">แจ้งเตือนทางอีเมลเมื่อมีคนสมัคร Organizer</span>
                <input type="checkbox" defaultChecked className="accent-blue-500 w-4 h-4 rounded cursor-pointer" />
              </div>
              <div className="flex items-center justify-between py-2 border-b border-white/5">
                <span className="text-sm text-gray-400">แจ้งเตือนเมื่อมีการถอนเงิน (Withdraw)</span>
                <input type="checkbox" defaultChecked className="accent-blue-500 w-4 h-4 rounded cursor-pointer" />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-400">ส่งรายงานสรุปยอดขายรายวัน (Daily Report)</span>
                <input type="checkbox" className="accent-blue-500 w-4 h-4 rounded cursor-pointer" />
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}