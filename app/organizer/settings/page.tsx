"use client";

import { useState, useEffect } from "react";
import { 
  Save, User, Building, CreditCard, Lock, Bell, 
  Camera, CheckCircle, Loader2 
} from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  // ✅ รวม State ให้ตรงกับ Database (organizers table)
  const [profile, setProfile] = useState({
    compName: "",
    firstnameOG: "",
    lastnameOG: "",
    telOG: "",
    emailOG: "",
    bio: "", // หมายเหตุ: ถ้าใน DB ไม่มี column bio ให้ระวังตรงนี้
    
    // ส่วนบัญชีธนาคาร (ถ้า DB ยังไม่มีตารางแยก ให้เก็บเป็น JSON หรือ mock ไว้ก่อน)
    bankName: "KBANK",
    accountName: "",
    accountNumber: ""
  });

  const [notifications, setNotifications] = useState({
    emailAlert: true,
    saleSummary: true
  });

  // ✅ 1. ดึงข้อมูล Profile จาก API เมื่อเปิดหน้า
  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await fetch("http://127.0.0.1:8000/api/organizer/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        if (res.ok) {
          const data = await res.json();
          // Map ข้อมูลจาก API เข้า State
          setProfile(prev => ({
            ...prev,
            compName: data.compName || "",
            firstnameOG: data.firstnameOG || "",
            lastnameOG: data.lastnameOG || "",
            telOG: data.telOG || "",
            emailOG: data.emailOG || "",
            bio: data.bio || "", // ถ้ามี
            // ถ้า Database มีเก็บเลขบัญชี ก็ดึงมาใส่ตรงนี้ได้เลย
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // ✅ 2. ฟังก์ชันบันทึกข้อมูลลง Database
  const handleSave = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/organizer/profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          compName: profile.compName,
          firstnameOG: profile.firstnameOG,
          lastnameOG: profile.lastnameOG,
          telOG: profile.telOG,
          bio: profile.bio,
          // bankInfo: ... (ถ้า Backend รองรับการบันทึกธนาคาร ให้ส่งไปด้วย)
        })
      });

      if (res.ok) {
        const data = await res.json();
        alert("✅ บันทึกข้อมูลเรียบร้อยแล้ว!");
        // อัปเดตชื่อใน LocalStorage เผื่อ Header เรียกใช้
        localStorage.setItem("user_name", profile.compName || profile.firstnameOG);
      } else {
        alert("❌ บันทึกไม่สำเร็จ");
      }
    } catch (err) {
      console.error(err);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
        <div className="min-h-screen bg-[#020617] flex items-center justify-center text-slate-400">
            <Loader2 className="animate-spin mr-2" /> กำลังโหลดข้อมูล...
        </div>
    );
  }

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
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />} 
          {loading ? "กำลังบันทึก..." : "บันทึกการแก้ไข"}
        </button>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* คอลัมน์ซ้าย: เมนูย่อย */}
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
              <h2 className="text-lg font-bold text-white">{profile.compName || profile.firstnameOG}</h2>
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
                  value={profile.compName}
                  onChange={(e) => setProfile({...profile, compName: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                />
              </div>
              
              {/* แยกชื่อ-นามสกุล เพื่อให้ตรง DB */}
              <div>
                <label className="text-sm text-slate-400 mb-1 block">ชื่อจริง</label>
                <input 
                  type="text" 
                  value={profile.firstnameOG}
                  onChange={(e) => setProfile({...profile, firstnameOG: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-slate-400 mb-1 block">นามสกุล</label>
                <input 
                  type="text" 
                  value={profile.lastnameOG}
                  onChange={(e) => setProfile({...profile, lastnameOG: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="text-sm text-slate-400 mb-1 block">เบอร์โทรศัพท์</label>
                <input 
                  type="text" 
                  value={profile.telOG}
                  onChange={(e) => setProfile({...profile, telOG: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-slate-400 mb-1 block">อีเมล (สำหรับติดต่องาน)</label>
                <input 
                  type="email" 
                  value={profile.emailOG}
                  disabled // ไม่ให้แก้ email
                  className="w-full bg-[#1E293B]/50 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-500 cursor-not-allowed"
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

          {/* 2. ข้อมูลบัญชีรับเงิน (ส่วนนี้ยัง Mockup เพราะ DB อาจยังไม่มีตารางเก็บเลขบัญชี) */}
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
                  value={profile.bankName}
                  onChange={(e) => setProfile({...profile, bankName: e.target.value})}
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
                  value={profile.accountNumber}
                  onChange={(e) => setProfile({...profile, accountNumber: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 outline-none font-mono"
                />
              </div>
              <div className="col-span-2">
                <label className="text-sm text-slate-400 mb-1 block">ชื่อบัญชี</label>
                <input 
                  type="text" 
                  value={profile.accountName}
                  onChange={(e) => setProfile({...profile, accountName: e.target.value})}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-green-500 outline-none"
                />
              </div>
            </div>
          </section>

          {/* 3. การแจ้งเตือน (UI เท่านั้น ยังไม่เชื่อม DB) */}
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