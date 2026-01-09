"use client";
import { User, Mail, Phone, Save, Pencil, CreditCard, ChevronDown, CheckCircle, X } from "lucide-react";
import { useState, useRef } from "react";
// ✅ 1. Import useUser Context เพื่อเชื่อมต่อข้อมูล
import { useUser } from "@/context/UserContext";

export default function EditProfilePage() {
  const [loading, setLoading] = useState(false);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  
  // ✅ 2. ดึงฟังก์ชัน setProfileImage จาก Context
  const { profileImage, setProfileImage } = useUser();
  
  // ใช้ State ภายในสำหรับ Preview ก่อนกดบันทึก
  // ถ้ามีรูปใน Context ให้เอามาแสดงก่อน ถ้าไม่มีให้เป็น null
  const [previewImage, setPreviewImage] = useState<string | null>(profileImage);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    email: "user@beatpass.com",
    firstName: "John",
    lastName: "Doe",
    phone: "81 234 5678",
    birthDay: "11",
    birthMonth: "เมษายน",
    birthYear: "2565",
    gender: "male",
    idCard: "1-2345-XXXXX-XX-X"
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewImage(imageUrl); // แสดง Preview ในหน้านี้ทันที
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
        setLoading(false);
        
        // ✅ 3. ส่งรูปภาพไปยัง Navbar ผ่าน Context เมื่อบันทึกสำเร็จ
        if (previewImage) {
            setProfileImage(previewImage);
        }

        setShowSuccessAlert(true);
    }, 1500);
  };

  const closeAlert = () => {
    setShowSuccessAlert(false);
  };

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i + 543);

  return (
    <div className="min-h-screen bg-[#0B0F14] pt-24 pb-12 px-4 md:px-8 font-sans text-white relative">
      
      {/* ✅ Custom Success Alert (ขนาดใหญ่) */}
      {showSuccessAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-[#161B22] border border-white/10 rounded-3xl p-12 max-w-md w-full mx-6 shadow-2xl transform transition-all scale-100 flex flex-col items-center text-center relative">
            <div className="absolute inset-0 bg-green-500/10 blur-[60px] rounded-full pointer-events-none" />
            <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border-2 border-green-500/20 relative z-10">
              <CheckCircle size={48} className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
            </div>
            <h3 className="text-3xl font-black text-white mb-3 tracking-tight relative z-10">บันทึกสำเร็จ!</h3>
            <p className="text-gray-400 text-lg mb-10 relative z-10">ข้อมูลของคุณถูกอัปเดตเรียบร้อยแล้ว</p>
            <button 
              onClick={closeAlert}
              className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold text-lg py-4 rounded-xl transition-all shadow-lg shadow-green-900/30 active:scale-95 relative z-10"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Pencil className="text-green-500" /> แก้ไขข้อมูลส่วนตัว
        </h1>
        <p className="text-gray-400 mb-8">อัปเดตข้อมูลของคุณให้เป็นปัจจุบันเพื่อความสะดวกในการจองบัตร</p>

        <form onSubmit={handleSave} className="bg-[#161B22] border border-white/10 rounded-2xl p-6 md:p-10 space-y-8 shadow-2xl">
            
            {/* Upload Profile */}
            <div className="flex flex-col items-center justify-center mb-6">
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange} 
                    className="hidden" 
                    accept="image/*"
                />
                <div className="relative group cursor-pointer" onClick={triggerFileInput}>
                    <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-[#161B22] group-hover:border-blue-500 transition-all shadow-xl">
                        {previewImage ? (
                            <img src={previewImage} alt="Profile Preview" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white">
                                <User size={48} />
                            </div>
                        )}
                    </div>
                    <div className="absolute bottom-0 right-0 p-2 bg-blue-500 rounded-full border-4 border-[#161B22] group-hover:scale-110 transition-transform">
                        <Pencil size={14} className="text-white" />
                    </div>
                </div>
                <p className="mt-3 text-sm text-gray-400 group-hover:text-blue-400 transition-colors cursor-pointer" onClick={triggerFileInput}>
                    แตะเพื่อเปลี่ยนรูปโปรไฟล์
                </p>
            </div>

            <div className="space-y-6">
                {/* Email */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">อีเมล</label>
                    <div className="relative opacity-60">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="email" 
                            value={formData.email} 
                            disabled 
                            className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-gray-400 cursor-not-allowed focus:outline-none" 
                        />
                    </div>
                </div>

                {/* Name */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">ชื่อ :</label>
                        <div className="relative">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                            <input 
                                type="text" 
                                value={formData.firstName}
                                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                                className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white focus:border-blue-500 focus:outline-none transition-colors"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-gray-300">นามสกุล :</label>
                        <input 
                            type="text" 
                            value={formData.lastName}
                            onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                            className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">เบอร์โทรศัพท์มือถือ :</label>
                    <div className="flex gap-4">
                        <div className="w-32 bg-[#0B0F14] border border-white/10 rounded-xl flex items-center justify-center gap-2 px-3 py-3.5 text-white">
                            <img src="https://flagcdn.com/w20/th.png" alt="TH" className="w-5 rounded-sm" />
                            <span>+66</span>
                            <ChevronDown size={14} className="text-gray-500" />
                        </div>
                        <input 
                            type="tel" 
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            className="flex-1 bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>

                {/* Birth Date */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">วันเกิด ( วัน/เดือน/ปีพ.ศ. ) :</label>
                    <div className="grid grid-cols-3 gap-4">
                        <select className="bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer">
                            <option value="">DD</option>
                            {days.map(d => <option key={d} value={d}>{d}</option>)}
                        </select>
                        <select className="bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer">
                            <option value="">Month</option>
                            {months.map((m, i) => <option key={i} value={m}>{m}</option>)}
                        </select>
                        <select className="bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer">
                            <option value="">Year</option>
                            {years.map(y => <option key={y} value={y}>{y}</option>)}
                        </select>
                    </div>
                </div>

                {/* Gender */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">เพศ :</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <select className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white focus:border-blue-500 focus:outline-none appearance-none cursor-pointer">
                            <option value="">กรุณาเลือก</option>
                            <option value="male">ชาย</option>
                            <option value="female">หญิง</option>
                            <option value="other">อื่นๆ</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" size={18} />
                    </div>
                </div>

                {/* ID Card */}
                <div className="space-y-2">
                    <label className="text-sm font-bold text-gray-300">บัตรประชาชน / พาสปอร์ต :</label>
                    <div className="relative">
                        <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input 
                            type="text" 
                            value={formData.idCard}
                            onChange={(e) => setFormData({...formData, idCard: e.target.value})}
                            className="w-full bg-[#0B0F14] border border-white/10 rounded-xl px-4 py-3.5 pl-12 text-white focus:border-blue-500 focus:outline-none transition-colors"
                        />
                    </div>
                </div>
            </div>

            <hr className="border-white/5 my-6" />

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-900/20 active:scale-95">
                {loading ? "กำลังบันทึก..." : <><Save size={20} /> บันทึกการเปลี่ยนแปลง</>}
            </button>
        </form>
      </div>
    </div>
  );
}