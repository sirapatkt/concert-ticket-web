"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
  Building2, 
  CalendarDays, 
  CreditCard, 
  Settings, 
  LogOut, 
  ShieldCheck,
  Image as ImageIcon,
  MessageSquareWarning 
} from "lucide-react";
import Cookies from "js-cookie";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // 🔴 เช็คว่าหน้าปัจจุบันคือหน้า Login หรือไม่
  const isLoginPage = pathname === "/admin/login";

  // Admin Menu Items
  const menuItems = [
    { name: "ภาพรวมระบบ", href: "/admin", icon: <LayoutDashboard size={20} /> },
    { name: "จัดการผู้ใช้งาน", href: "/admin/users", icon: <Users size={20} /> },
    { name: "อนุมัติผู้จัดงาน", href: "/admin/organizers", icon: <Building2 size={20} /> },
    { name: "รายการอีเวนต์", href: "/admin/events", icon: <CalendarDays size={20} /> },
    { name: "จัดการแบนเนอร์", href: "/admin/banners", icon: <ImageIcon size={20} /> },
    { name: "ธุรกรรมการเงิน", href: "/admin/finance", icon: <CreditCard size={20} /> },
    { name: "รับแจ้งปัญหา", href: "/admin/support", icon: <MessageSquareWarning size={20} /> },
    { name: "ตั้งค่าระบบ", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  const handleLogout = () => {
    Cookies.remove("user_role");
    // แนะนำนิดนึงครับ: ถ้าหน้าล็อกอินของแอดมินคือ /admin/login อาจจะต้องแก้ตรงนี้จาก "/login" เป็น "/admin/login" ครับ
    router.push("/admin/login"); 
  };

  // 🔴 ถ้าเป็นหน้า Login ให้เรนเดอร์แค่เนื้อหาข้างใน (ไม่เอา Sidebar)
  if (isLoginPage) {
    return <div className="min-h-screen bg-[#050505] text-white font-sans">{children}</div>;
  }

  // 🟢 ถ้าเป็นหน้าอื่นใน Admin ให้เรนเดอร์ตามปกติ (มี Sidebar)
  return (
    <div className="flex min-h-screen bg-[#0B0F14] text-white font-sans">
      
      {/* 🔴 Sidebar (Left Menu) */}
      <aside className="w-64 bg-[#161B22] border-r border-white/5 flex flex-col fixed h-full z-10">
        
        {/* Admin Logo */}
        <div className="h-20 flex items-center px-6 border-b border-white/5 gap-3">
          <div className="p-2 bg-red-500/10 rounded-lg text-red-500">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h1 className="font-bold text-lg tracking-tight">BEATPASS</h1>
            <span className="text-[10px] bg-red-500 text-white px-1.5 py-0.5 rounded uppercase font-bold tracking-wider">
              Admin Panel
            </span>
          </div>
        </div>

        {/* Menu List */}
        <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => {
            // เช็คว่าเมนูนี้ถูกเลือกอยู่หรือไม่ (Active State)
            const isActive = pathname === item.href;
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm group ${
                  isActive 
                    ? "bg-red-600 text-white shadow-lg shadow-red-900/20" 
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <span className={`transition-colors ${isActive ? "text-white" : "group-hover:text-white"}`}>
                   {item.icon}
                </span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-gray-400 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-all text-sm font-medium"
          >
            <LogOut size={20} />
            ออกจากระบบ
          </button>
        </div>
      </aside>

      {/* 🟢 Content Area (Right Content) */}
      <main className="flex-1 ml-64 p-8">
        {children}
      </main>

    </div>
  );
}