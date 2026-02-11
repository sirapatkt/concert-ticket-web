"use client";
import { useState } from "react";
import Link from "next/link";
import { Mail, Lock, ArrowLeft, User, Building2 } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // ✅ เพิ่ม State สำหรับเลือกบทบาท (Role)
  const [role, setRole] = useState("member"); 

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const isOrganizer = role === "organizer";

    try {
      // 1. ส่งข้อมูลไปตาม API ของแต่ละบทบาท
      const res = await fetch(isOrganizer ? "http://127.0.0.1:8000/api/organizer/login" : "http://127.0.0.1:8000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        // ✨ ถ้าเป็นผู้จัดงาน ส่ง emailOG/passwordOG ถ้าเป็นสมาชิก ส่ง email/password
        body: JSON.stringify(isOrganizer ? {
          emailOG: email,
          passwordOG: password
        } : {
          email: email,
          password: password
        }),
      });

      const data = await res.json();

      // 2. ถ้าเข้าสู่ระบบสำเร็จ
      if (res.ok) {
        alert("✅ เข้าสู่ระบบสำเร็จ!");
        
        // เก็บ Token ลง localStorage
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role);

        if (data.user) {
          localStorage.setItem("user_name", isOrganizer ? (data.user.compName || data.user.firstnameOG) : data.user.name);
        }

        // แยกทางไปหน้าต่างๆ ตามบทบาท
        if (isOrganizer) {
          window.location.href = "/organizer/create"; 
        } else {
          window.location.href = "/"; 
        }

      } else {
        alert("❌ เข้าสู่ระบบไม่สำเร็จ: " + (data.message || "อีเมลหรือรหัสผ่านผิด"));
      }
    } catch (error) {
      console.error("Login Error:", error);
      alert("เชื่อมต่อ Server ไม่ได้ (อย่าลืมเปิด Laravel นะ)");
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#161B22] p-8 rounded-2xl border border-white/10 shadow-xl">
        
        <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold mb-2">ยินดีต้อนรับ</h1>
            <p className="text-gray-400 text-sm">เข้าสู่ระบบเพื่อใช้งาน BEATPASS</p>
        </div>

        {/* ✅ ส่วนเลือก Role (Tab Switcher) */}
        <div className="flex bg-[#0B0F14] p-1 rounded-xl mb-8 border border-white/5">
          <button 
            onClick={() => setRole("member")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${role === "member" ? "bg-[#161B22] text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
          >
            <User size={18} /> สมาชิกทั่วไป
          </button>
          <button 
            onClick={() => setRole("organizer")}
            className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-medium transition-all ${role === "organizer" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg" : "text-gray-500 hover:text-gray-300"}`}
          >
            <Building2 size={18} /> ผู้จัดงาน
          </button>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">อีเมล</label>
            <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">
                    <Mail size={20} />
                </div>
                <input 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)} 
                  placeholder="name@example.com"
                  className="w-full bg-[#0B0F14] border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-all" 
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
                  type="password" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  placeholder="••••••••"
                  className="w-full bg-[#0B0F14] border border-white/10 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:border-purple-500 transition-all" 
                  required 
                />
            </div>
          </div>

          <button 
            type="submit" 
            className={`w-full py-3.5 mt-4 rounded-xl font-bold text-lg text-white transition-all active:scale-[0.98] shadow-lg ${role === "organizer" ? "bg-gradient-to-r from-purple-600 to-orange-500 shadow-purple-600/20" : "bg-blue-600 hover:bg-blue-500 shadow-blue-600/20"}`}
          >
            เข้าสู่ระบบ{role === "organizer" ? "ผู้จัดงาน" : ""}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          ยังไม่มีบัญชีใช่ไหม? 
          <Link href={role === "organizer" ? "/organizer/register" : "/register"} className="ml-1 text-purple-400 hover:text-purple-300 font-bold hover:underline">
            สมัครสมาชิกที่นี่
          </Link>
        </div>
        
        <div className="mt-4 text-center">
            <Link href="/" className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors text-sm">
                <ArrowLeft size={16} /> กลับหน้าหลัก
            </Link>
        </div>

      </div>
    </div>
  );
}