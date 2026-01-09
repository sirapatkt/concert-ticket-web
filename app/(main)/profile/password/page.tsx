"use client";
import { Lock, Eye, EyeOff, ShieldCheck, CheckCircle, AlertCircle } from "lucide-react";
import { useState } from "react";

export default function ChangePasswordPage() {
  // State สำหรับเก็บค่าใน Input
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // State สำหรับเปิด/ปิดตา (Visibility)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // State สำหรับสถานะการทำงาน
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // ล้าง Error เดิมก่อน

    // 1. ตรวจสอบว่ากรอกครบไหม
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    // 2. ตรวจสอบรหัสผ่านใหม่ต้องไม่เหมือนเดิม
    if (currentPassword === newPassword) {
      setError("รหัสผ่านใหม่ต้องไม่ซ้ำกับรหัสผ่านปัจจุบัน");
      return;
    }

    // 3. ตรวจสอบความยาวรหัสผ่าน (ขั้นต่ำ 8 ตัว)
    if (newPassword.length < 8) {
      setError("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    // 4. ตรวจสอบว่ารหัสผ่านยืนยันตรงกันไหม
    if (newPassword !== confirmPassword) {
      setError("รหัสผ่านยืนยันไม่ตรงกับรหัสผ่านใหม่");
      return;
    }

    // 5. จำลองการส่งข้อมูลไป Server
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        setShowSuccessAlert(true);
        
        // รีเซ็ตค่าในฟอร์ม
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
    }, 1500);
  };

  const closeAlert = () => {
    setShowSuccessAlert(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] pt-24 pb-12 px-4 md:px-8 font-sans text-white relative">
      
      {/* ✅ Custom Success Alert (ดีไซน์เดียวกับหน้าแก้ไขข้อมูล) */}
      {showSuccessAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#161B22] border border-white/10 rounded-3xl p-12 max-w-md w-full mx-6 shadow-2xl transform transition-all scale-100 flex flex-col items-center text-center relative">
            <div className="absolute inset-0 bg-green-500/10 blur-[60px] rounded-full pointer-events-none" />
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-green-500/20 relative z-10">
              <CheckCircle size={48} className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
            <h3 className="text-3xl font-black text-white mb-3 tracking-tight relative z-10">เปลี่ยนรหัสผ่านสำเร็จ!</h3>
            <p className="text-gray-400 text-lg mb-10 relative z-10">รหัสผ่านของคุณถูกอัปเดตเรียบร้อยแล้ว</p>
            <button 
              onClick={closeAlert}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-green-900/30 active:scale-95 relative z-10"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Lock className="text-orange-500" /> เปลี่ยนรหัสผ่าน
        </h1>
        <p className="text-gray-400 mb-8">กำหนดรหัสผ่านใหม่เพื่อความปลอดภัยของบัญชี</p>

        <form onSubmit={handleSubmit} className="bg-[#161B22] border border-white/10 rounded-2xl p-8 space-y-6 shadow-2xl">
            
            <div className="space-y-5">
                
                {/* Current Password */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">รหัสผ่านปัจจุบัน</label>
                    <div className="relative group">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                        <input 
                            type={showCurrent ? "text" : "password"} 
                            placeholder="••••••••"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 pl-12 pr-12 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-700" 
                        />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                            {showCurrent ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">รหัสผ่านใหม่</label>
                    <div className="relative group">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                        <input 
                            type={showNew ? "text" : "password"} 
                            placeholder="••••••••" 
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 pl-12 pr-12 text-white focus:outline-none focus:border-orange-500 transition-all placeholder:text-gray-700" 
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                            {showNew ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>
                </div>

                {/* Confirm New Password */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">ยืนยันรหัสผ่านใหม่</label>
                    <div className="relative group">
                        <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-orange-500 transition-colors" size={18} />
                        <input 
                            type={showConfirm ? "text" : "password"} 
                            placeholder="••••••••" 
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`w-full bg-[#0B0F14] border rounded-xl px-4 py-3.5 pl-12 pr-12 text-white focus:outline-none transition-all placeholder:text-gray-700 ${
                                confirmPassword && newPassword !== confirmPassword 
                                ? "border-red-500 focus:border-red-500" // กรอบแดงถ้าไม่ตรง
                                : "border-white/10 focus:border-orange-500"
                            }`} 
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                            {showConfirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                        </button>
                    </div>
                    {/* Error Text Realtime */}
                    {confirmPassword && newPassword !== confirmPassword && (
                        <p className="text-xs text-red-500 mt-1 pl-1">* รหัสผ่านไม่ตรงกัน</p>
                    )}
                </div>
            </div>

            {/* Error Message Global */}
            {error && (
                <div className="flex items-center gap-2 bg-red-500/10 border border-red-500/20 p-4 rounded-xl text-sm text-red-400 animate-in slide-in-from-top-2">
                    <AlertCircle size={18} /> {error}
                </div>
            )}

            {/* Hint Box */}
            <div className="bg-orange-500/10 border border-orange-500/20 p-4 rounded-xl flex items-start gap-3">
                <AlertCircle size={18} className="text-orange-500 mt-0.5 flex-shrink-0" />
                <p className="text-xs text-orange-200 leading-relaxed">
                    รหัสผ่านควรมีความยาวอย่างน้อย 8 ตัวอักษร และประกอบด้วยตัวอักษรพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข เพื่อความปลอดภัยสูงสุด
                </p>
            </div>

            <button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-gradient-to-r from-orange-500 to-pink-600 hover:from-orange-400 hover:to-pink-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-900/20 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? "กำลังอัปเดต..." : "อัปเดตรหัสผ่าน"}
            </button>
        </form>
      </div>
    </div>
  );
}