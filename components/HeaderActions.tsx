"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Bell, 
  HelpCircle, 
  FileText, 
  MessageCircle, 
  ExternalLink, 
  Check 
} from "lucide-react";

export default function HeaderActions() {
  const [openNoti, setOpenNoti] = useState(false);
  const [openHelp, setOpenHelp] = useState(false);

  // --- Mock Data: ข้อมูลแจ้งเตือน ---
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "ขายบัตรได้แล้ว! 🎉",
      desc: "Order #8823 - VIP Standing (2 ใบ)",
      time: "2 นาทีที่แล้ว",
      read: false,
    },
    {
      id: 2,
      title: "อนุมัติอีเวนต์สำเร็จ",
      desc: "งาน 'Cat Expo 99' ออนไลน์บนหน้าเว็บแล้ว",
      time: "1 ชม. ที่แล้ว",
      read: false,
    },
    {
      id: 3,
      title: "เงินโอนเข้าบัญชี",
      desc: "ยอด 15,000 บาท เข้าบัญชี KBANK แล้ว",
      time: "เมื่อวานนี้",
      read: true,
    }
  ]);

  const unreadCount = notifications.filter(n => !n.read).length;

  // Ref สำหรับเช็คการกดนอกพื้นที่ (Click Outside)
  const notiRef = useRef<HTMLDivElement>(null);
  const helpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) {
        setOpenNoti(false);
      }
      if (helpRef.current && !helpRef.current.contains(event.target as Node)) {
        setOpenHelp(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="flex items-center gap-3">
      
      {/* =======================
         ปุ่มช่วยเหลือ (?) 
      ======================== */}
      <div className="relative" ref={helpRef}>
        <button 
          onClick={() => setOpenHelp(!openHelp)}
          suppressHydrationWarning={true} // ✅ เติมป้องกัน Error
          className={`p-2 rounded-full transition-all duration-200 border ${
            openHelp 
              ? 'bg-slate-800 text-white border-slate-700' 
              : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
          }`}
        >
          <HelpCircle size={20} />
        </button>

        {/* Dropdown Menu */}
        {openHelp && (
          <div className="absolute right-0 mt-3 w-56 bg-[#0f172a] border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="py-1">
              <Link href="/organizer/manual" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <FileText size={18} /> 
                <span>คู่มือการใช้งาน</span>
              </Link>
              
              <Link href="/organizer/contact" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <MessageCircle size={18} /> 
                <span>ติดต่อทีมงาน</span>
              </Link>
              
              <div className="h-[1px] bg-slate-800 my-1 mx-2"></div>

              <Link href="/organizer/faq" className="flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:bg-slate-800 hover:text-white transition-colors">
                <ExternalLink size={18} /> 
                <span>FAQ คำถามที่พบบ่อย</span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* =======================
         ปุ่มแจ้งเตือน (Bell) 
      ======================== */}
      <div className="relative" ref={notiRef}>
        <button 
          onClick={() => setOpenNoti(!openNoti)}
          suppressHydrationWarning={true} // ✅ เติมป้องกัน Error
          className={`p-2 rounded-full transition-all duration-200 border relative ${
            openNoti 
              ? 'bg-slate-800 text-white border-slate-700' 
              : 'text-slate-400 border-transparent hover:text-white hover:bg-slate-800'
          }`}
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#020617]"></span>
          )}
        </button>

        {/* Dropdown Menu */}
        {openNoti && (
          <div className="absolute right-0 mt-3 w-80 sm:w-96 bg-[#0f172a] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-900/50">
              <h3 className="font-semibold text-sm text-white">การแจ้งเตือน ({unreadCount})</h3>
              {unreadCount > 0 && (
                <button 
                  onClick={markAllRead} 
                  className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1 hover:underline"
                >
                  <Check size={12} /> อ่านทั้งหมด
                </button>
              )}
            </div>

            {/* Notification List */}
            <div className="max-h-[350px] overflow-y-auto custom-scrollbar">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">ไม่มีการแจ้งเตือนใหม่</div>
              ) : (
                notifications.map((item) => (
                  <div 
                    key={item.id} 
                    className={`px-4 py-3 border-b border-slate-800 hover:bg-slate-800/50 transition-colors cursor-pointer group ${
                      item.read ? 'opacity-60 bg-transparent' : 'bg-slate-800/20'
                    }`}
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h4 className={`text-sm font-medium group-hover:text-blue-400 transition-colors ${item.read ? 'text-slate-400' : 'text-white'}`}>
                        {item.title}
                      </h4>
                      <span className="text-[10px] text-slate-500 whitespace-nowrap ml-2">{item.time}</span>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{item.desc}</p>
                  </div>
                ))
              )}
            </div>
            
            {/* Footer */}
            <div className="p-2 border-t border-slate-800 bg-slate-900/50 text-center">
              <Link href="/organizer/notifications" className="text-xs text-slate-400 hover:text-white transition-colors w-full py-1 block">
                ดูประวัติทั้งหมด
              </Link>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}