"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, LayoutList, PlusCircle, Ticket, Users, Settings, LogOut, 
  Bell, HelpCircle, ChevronRight // ✅ import ไอคอนเพิ่ม
} from 'lucide-react';
import UserDropdown from '@/components/UserDropdown'; 

export default function OrganizerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // --- 1. สร้าง Map ชื่อหน้าเว็บ (Title Mapping) ---
  const getPageTitle = (path: string) => {
    if (path === '/organizer') return 'หน้าหลัก';
    if (path.includes('/create')) return 'สร้างอีเวนต์ใหม่';
    if (path.includes('/my-events')) return 'อีเวนต์ของฉัน';
    if (path.includes('/sales')) return 'สรุปยอดขาย';
    if (path.includes('/customers')) return 'ผู้เข้าร่วม/ลูกค้า';
    if (path.includes('/settings')) return 'ตั้งค่าบัญชี';
    return 'Organizer Panel';
  };

  const menuItems = [
    { name: "หน้าหลัก", href: "/organizer", icon: Home },
    { name: "อีเวนต์ของฉัน", href: "/organizer/my-events", icon: LayoutList },
    { name: "สร้างอีเวนต์ใหม่", href: "/organizer/create", icon: PlusCircle },
    { name: "สรุปยอดขาย", href: "/organizer/sales", icon: Ticket },
    { name: "ผู้เข้าร่วม/ลูกค้า", href: "/organizer/customers", icon: Users },
    { name: "ตั้งค่าบัญชี", href: "/organizer/settings", icon: Settings },
  ];

  return (
    <div className="flex bg-[#020617] h-screen font-sans text-white overflow-hidden">
      
      {/* --- Sidebar (เหมือนเดิม) --- */}
      <aside className="w-64 bg-[#020617] border-r border-slate-800 flex flex-col shrink-0 z-20">
        <div className="p-6 mb-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent cursor-default">
            BEATPASS
          </h1>
          <p className="text-xs text-slate-500 mt-1">Organizer Panel</p>
        </div>
        <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"}`}>
                <item.icon size={20} className={isActive ? "text-white" : "group-hover:text-blue-400 transition-colors"} />
                <span className="font-medium text-sm">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-800">
          <Link href="/login" className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all group">
            <LogOut size={20} className="group-hover:text-red-400" />
            <span className="font-medium text-sm">ออกจากระบบ</span>
          </Link>
        </div>
      </aside>

      {/* --- Main Content --- */}
      <div className="flex-1 flex flex-col min-w-0 relative">
        
        {/* ✅ HEADER BAR: ปรับให้มีของมากขึ้น */}
        {/* justify-between: ดันของไปซ้ายสุด และ ขวาสุด */}
        <header className="h-16 bg-[#020617] border-b border-slate-800 flex items-center justify-between px-8 shrink-0">
           
           {/* ฝั่งซ้าย: Breadcrumbs (บอกตำแหน่งหน้า) */}
           <div className="flex items-center gap-2 text-sm text-slate-400">
              <span className="hover:text-white cursor-pointer transition-colors">Organizer</span>
              <ChevronRight size={16} />
              <span className="text-white font-medium bg-slate-800/50 px-2 py-1 rounded-md">
                {getPageTitle(pathname)}
              </span>
           </div>

           {/* ฝั่งขวา: Icons + User Profile */}
           <div className="flex items-center gap-4">
              {/* ปุ่ม Help */}
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all">
                <HelpCircle size={20} />
              </button>
              
              {/* ปุ่ม Notification พร้อมจุดแดงแจ้งเตือน */}
              <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-[#020617]"></span>
              </button>
              
              {/* ขีดคั่นแนวตั้ง */}
              <div className="h-6 w-[1px] bg-slate-700 mx-1"></div>

              {/* ปุ่ม User Dropdown */}
              <UserDropdown />
           </div>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto px-8 pb-8 pt-6 scroll-smooth">
          {children}
        </main>
        
      </div>
    </div>
  );
}