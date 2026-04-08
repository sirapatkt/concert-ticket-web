"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // 📍 1. เพิ่ม import useRouter
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const router = useRouter(); // 📍 2. เรียกใช้งาน useRouter สำหรับเปลี่ยนหน้า

  const [currentEmail, setCurrentEmail] = useState("กำลังโหลด..."); 
  const [displayName, setDisplayName] = useState("Loading");

  // 📍 3. สร้างฟังก์ชันสำหรับการออกจากระบบโดยเฉพาะ
  const handleLogout = () => {
    setIsOpen(false);
    localStorage.removeItem("token"); // ลบ Token ออกจาก Local Storage
    // ถ้ามีการเก็บข้อมูลอื่นใน localStorage เช่น user data ก็สามารถลบเพิ่มได้ตรงนี้
    // localStorage.removeItem("userData"); 
    
    // Redirect กลับไปหน้า Login (สามารถเปลี่ยน "/login" เป็น path ที่คุณใช้งานจริงได้ เช่น "/organizer/login")
    router.push("/login"); 
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem("token"); 
        if (!token) {
          setCurrentEmail("organizer@beatpass.com");
          setDisplayName("BEATPASS Organizer");
          return;
        }

        const res = await fetch("http://127.0.0.1:8000/api/organizer/profile", {
          headers: { Authorization: `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          console.log("ข้อมูลจาก DB:", data); 
          
          const userEmail = data?.emailOG || "organizer@beatpass.com";
          setCurrentEmail(userEmail);
          
          if (data?.compName) {
             setDisplayName(data.compName); 
          } else if (data?.firstnameOG) {
             setDisplayName(data.firstnameOG); 
          } else {
             setDisplayName(userEmail.split('@')[0]);
          }
        }
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };

    fetchUserProfile();

    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-700 bg-[#1E293B] hover:bg-slate-800 text-slate-200 transition-all text-sm"
      >
        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white uppercase">
          {displayName.substring(0, 2)}
        </div>
        <span>ผู้จัดงาน</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#0F172A] border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-sm font-bold text-white capitalize">{displayName}</p>
            <p className="text-xs text-slate-400 truncate">{currentEmail}</p>
          </div>
          <div className="py-1">
            <Link 
              href="/organizer/profile" 
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-[#1E293B] hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <User size={16} /> โปรไฟล์ของฉัน
            </Link>
            <Link 
              href="/organizer/settings" 
              className="flex items-center gap-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-[#1E293B] hover:text-white transition-colors"
              onClick={() => setIsOpen(false)}
            >
              <Settings size={16} /> ตั้งค่าบัญชี
            </Link>
          </div>
          <div className="border-t border-slate-700 py-1">
            {/* 📍 4. เปลี่ยนมาเรียกใช้ฟังก์ชัน handleLogout ที่สร้างไว้ */}
            <button 
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-[#1E293B] hover:text-red-300 transition-colors text-left"
              onClick={handleLogout}
            >
              <LogOut size={16} /> ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}