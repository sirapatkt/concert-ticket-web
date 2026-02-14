"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { User, LogOut, Settings, ChevronDown } from "lucide-react";

export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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
        <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white">
            OR
        </div>
        <span>ผู้จัดงาน</span>
        <ChevronDown size={14} className={`transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-[#0F172A] border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden">
          <div className="px-4 py-3 border-b border-slate-700">
            <p className="text-sm font-bold text-white">BEATPASS Organizer</p>
            <p className="text-xs text-slate-400 truncate">organizer@beatpass.com</p>
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
            <button 
              className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-[#1E293B] hover:text-red-300 transition-colors text-left"
              onClick={() => {
                  setIsOpen(false);
                  alert("ออกจากระบบเรียบร้อย"); 
              }}
            >
              <LogOut size={16} /> ออกจากระบบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}