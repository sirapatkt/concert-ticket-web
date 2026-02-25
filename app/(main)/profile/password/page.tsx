"use client";
import { Lock, Eye, EyeOff, CheckCircle, AlertTriangle, X } from "lucide-react";
import { useState } from "react";

export default function ChangePasswordPage() {
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  
  // State จัดการการแสดงรหัสผ่าน (รูปตา)
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    // เช็คเบื้องต้นก่อนส่งไปหลังบ้าน
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMessage("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    if (formData.newPassword.length < 8) {
      setErrorMessage("รหัสผ่านใหม่ต้องมีความยาวอย่างน้อย 8 ตัวอักษร");
      return;
    }

    setLoading(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("http://127.0.0.1:8000/api/profile/password", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json"
        },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword
        })
      });

      const data = await res.json();

      if (res.ok) {
        setShowSuccessAlert(true);
        // ล้างช่องกรอกเมื่อสำเร็จ
        setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
      } else {
        setErrorMessage(data.message || "เกิดข้อผิดพลาดในการเปลี่ยนรหัสผ่าน");
      }
    } catch (error) {
      setErrorMessage("ไม่สามารถเชื่อมต่อกับเซิร์ฟเวอร์ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] pt-24 pb-12 px-4 md:px-8 font-sans text-white relative">
      
      {/* Popup แจ้งเตือนความสำเร็จ */}
      {showSuccessAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#161B22] border border-white/10 rounded-3xl p-12 max-w-md w-full mx-6 shadow-2xl flex flex-col items-center text-center">
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-green-500/20">
              <CheckCircle size={48} className="text-green-500" />
            </div>
            <h3 className="text-3xl font-black text-white mb-3">สำเร็จ!</h3>
            <p className="text-gray-400 text-lg mb-10">รหัสผ่านของคุณถูกเปลี่ยนเรียบร้อยแล้ว</p>
            <button 
              onClick={() => setShowSuccessAlert(false)}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg active:scale-95"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}

      {/* Popup แจ้งเตือน Error */}
      {errorMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in slide-in-from-top-4">
          <div className="bg-[#161B22] border border-red-500/30 text-white px-6 py-5 rounded-2xl shadow-2xl flex items-start gap-4">
            <div className="p-2 bg-red-500/20 rounded-xl text-red-500"><AlertTriangle size={24} /></div>
            <div className="flex-1 mt-0.5">
              <h3 className="font-bold text-red-400">แจ้งเตือน</h3>
              <p className="text-gray-300 text-sm">{errorMessage}</p>
            </div>
            <button onClick={() => setErrorMessage("")} className="text-gray-500 hover:text-white"><X size={20} /></button>
          </div>
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Lock className="text-orange-500" /> เปลี่ยนรหัสผ่าน
        </h1>
        <p className="text-gray-400 mb-8">กำหนดรหัสผ่านใหม่เพื่อความปลอดภัยของบัญชี</p>

        <form onSubmit={handleSave} className="bg-[#161B22] border border-white/10 rounded-2xl p-6 md:p-10 space-y-6 shadow-2xl">
            
            {/* รหัสผ่านปัจจุบัน */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">รหัสผ่านปัจจุบัน</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type={showCurrent ? "text" : "password"} 
                        value={formData.currentPassword}
                        onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
                        required
                        className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 pl-12 pr-12 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            {/* รหัสผ่านใหม่ */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">รหัสผ่านใหม่</label>
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type={showNew ? "text" : "password"} 
                        value={formData.newPassword}
                        onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                        required
                        className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 pl-12 pr-12 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            {/* ยืนยันรหัสผ่านใหม่ */}
            <div className="space-y-2">
                <label className="text-sm font-bold text-gray-300">ยืนยันรหัสผ่านใหม่</label>
                <div className="relative">
                    <CheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                    <input 
                        type={showConfirm ? "text" : "password"} 
                        value={formData.confirmPassword}
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        required
                        className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 pl-12 pr-12 text-white focus:border-orange-500 focus:outline-none transition-colors"
                        placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                        {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>
            </div>

            <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 flex gap-3 text-sm text-orange-200/70 mt-4">
                <AlertTriangle size={18} className="text-orange-500 shrink-0 mt-0.5" />
                <p>รหัสผ่านควรมีความยาวอย่างน้อย 8 ตัวอักษร เพื่อความปลอดภัยสูงสุด</p>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-400 hover:to-pink-400 text-white font-bold py-4 rounded-xl transition-all shadow-lg active:scale-95 mt-6">
                {loading ? "กำลังบันทึก..." : "อัปเดตรหัสผ่าน"}
            </button>
        </form>
      </div>
    </div>
  );
}