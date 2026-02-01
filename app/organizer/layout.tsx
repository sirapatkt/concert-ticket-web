"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  Home, 
  LayoutList, 
  PlusCircle, 
  Ticket, 
  Users, 
  Settings, 
  LogOut 
} from 'lucide-react';

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();

  const menuItems = [
    { name: "หน้าหลัก", href: "/organizer", icon: Home },
    { name: "อีเวนต์ของฉัน", href: "/organizer/my-events", icon: LayoutList },
    { name: "สร้างอีเวนต์ใหม่", href: "/organizer/create", icon: PlusCircle },
    { name: "สรุปยอดขาย", href: "/organizer/sales", icon: Ticket },
    { name: "ผู้เข้าร่วม/ลูกค้า", href: "/organizer/customers", icon: Users },
    { name: "ตั้งค่าบัญชี", href: "/organizer/settings", icon: Settings },
  ];

  return (
    <div className="flex bg-[#020617] min-h-screen font-sans text-white">
      {/* --- ส่วน Sidebar (เมนูซ้าย) --- */}
      <div className="w-64 min-h-screen bg-[#020617] border-r border-slate-800 flex flex-col sticky top-0 shrink-0">
        <div className="p-6 mb-2">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent cursor-default">
            BEATPASS
          </h1>
          <p className="text-xs text-slate-500 mt-1">Organizer Panel</p>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" 
                    : "text-slate-400 hover:bg-slate-800 hover:text-white"
                }`}
              >
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
      </div>

      {/* --- ส่วนเนื้อหา (Content) --- */}
      <main className="flex-1 overflow-y-auto h-screen p-8">
        {children}
      </main>
    </div>
  );
}