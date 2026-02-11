"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, Mail, Lock, CheckCircle, User, Phone, Building, Eye, EyeOff 
} from "lucide-react";

export default function OrganizerRegister() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstName: "",
    lastName: "",
    phone: "",
    company: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ 1. ใส่ async ตรงนี้
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    // ✅ 2. เอา try...catch มาไว้ "ข้างใน" ฟังก์ชัน handleSubmit
    try {  
      // วิ่งไปหา Laravel
      const res = await fetch("http://127.0.0.1:8000/api/organizer/register", {
        method: "POST",
        headers: {
          "Content-Type" : "application/json",
          "Accept" : "application/json",
        },
        body: JSON.stringify({ 
          emailOG : formData.email,
          passwordOG : formData.password,
          passwordOG_confirmation: formData.confirmPassword,
          firstnameOG: formData.firstName,
          lastnameOG: formData.lastName,
          telOG : formData.phone,
          compName: formData.company,
        }),
      });

      // รอรับคำตอบ
      const data = await res.json();

      // เช็คสถานะ
      if (res.ok){
        alert("✅ ส่งข้อมูลสำเร็จ! กรุณารอแอดมินตรวจสอบและอนุมัติบัญชีของคุณภายใน 24 ชม.");
        window.location.href = "/login?role=organizer";
      } else {
        alert("❌ สมัครไม่ผ่าน: " + (data.message || "เช็คข้อมูลอีกครั้ง"));
      }

    } catch (error) {
      console.error("Connection Error:", error);
      alert("เชื่อมต่อ Server ไม่ได้");
    }
  }; // ✅ 3. ปิดฟังก์ชัน handleSubmit ตรงนี้ที่เดียวครับ!

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans flex justify-center py-10 px-4">
      
      <div className="w-full max-w-2xl">
        
        {/* Header & Back Button */}
        <div className="mb-8">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 text-sm">
                <ArrowLeft size={18} /> กลับหน้าหลัก
            </Link>
            <h1 className="text-3xl font-bold mb-2">สมัครสมาชิกผู้จัดงาน</h1>
            <p className="text-gray-400 text-sm">กรุณากรอกข้อมูลบริษัทหรือทีมงานให้ครบถ้วน</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">อีเมล</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  name="email"
                  placeholder="name@company.com"
                  className="w-full bg-[#161B22] border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">รหัสผ่าน</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Lock size={20} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="••••••••"
                  className="w-full bg-[#161B22] border border-white/10 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">ยืนยันรหัสผ่าน</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <CheckCircle size={20} />
                </div>
                <input 
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="••••••••"
                  className="w-full bg-[#161B22] border border-white/10 rounded-xl py-3 pl-12 pr-12 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
          </div>

          {/* Name Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">ชื่อ</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <User size={20} />
                    </div>
                    <input 
                      type="text" 
                      name="firstName"
                      placeholder="John"
                      className="w-full bg-[#161B22] border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                      value={formData.firstName}
                      onChange={handleChange}
                      required
                    />
                </div>
             </div>
             <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">นามสกุล</label>
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                        <User size={20} />
                    </div>
                    <input 
                      type="text" 
                      name="lastName"
                      placeholder="Doe"
                      className="w-full bg-[#161B22] border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                      value={formData.lastName}
                      onChange={handleChange}
                      required
                    />
                </div>
             </div>
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">เบอร์โทรศัพท์มือถือ</label>
            <div className="relative flex">
                <div className="flex items-center justify-center bg-[#161B22] border border-white/10 border-r-0 rounded-l-xl px-4 text-gray-300 text-sm whitespace-nowrap">
                   🇹🇭 +66
                </div>
                <input 
                  type="tel" 
                  name="phone"
                  placeholder="81 234 5678"
                  className="w-full bg-[#161B22] border border-white/10 rounded-r-xl py-3 pl-4 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
            </div>
          </div>

          {/* Company */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">บริษัท / องค์กร</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Building size={20} />
                </div>
                <input 
                  type="text" 
                  name="company"
                  placeholder="Your Company Name Co., Ltd."
                  className="w-full bg-[#161B22] border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all placeholder:text-gray-600"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button 
              type="submit"
              className="w-full py-3.5 rounded-xl font-bold text-lg text-white bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-500 hover:to-orange-400 shadow-lg shadow-purple-600/20 transition-all active:scale-[0.98]"
            >
              สมัครสมาชิกผู้จัดงาน
            </button>
          </div>
          
          <div className="text-center">
             <span className="text-gray-500 text-sm">หากคุณมีบัญชีผู้จัดงานอยู่แล้ว </span>
             
             {/* ✅ แก้ลิงก์ให้ส่ง query param เพื่อบอกหน้า Login ว่าให้เปิดแท็บ Organizer */}
             <Link href="/login?role=organizer" className="text-pink-500 font-bold hover:underline text-sm">
                เข้าสู่ระบบผู้จัดงาน
             </Link>
          </div>

        </form>
      </div>
    </div>
  );
}