"use client";
import { useState } from "react";
import Link from "next/link";
import { 
  Users, Building2, Ticket, DollarSign, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal,
  CheckCircle, XCircle, Clock
} from "lucide-react";

export default function AdminDashboard() {
  
  // 1. เปลี่ยน Mock Data เป็น State (เพื่อให้แก้ไขสถานะได้)
  const [pendingOrganizers, setPendingOrganizers] = useState([
    { id: 1, name: "GMM Grammy", email: "contact@gmm.com", date: "10 นาทีที่แล้ว", status: "รอตรวจสอบ" },
    { id: 2, name: "RS Group", email: "admin@rs.co.th", date: "2 ชั่วโมงที่แล้ว", status: "รอตรวจสอบ" },
    { id: 3, name: "Smallroom", email: "info@smallroom.com", date: "1 วันที่แล้ว", status: "เอกสารไม่ครบ" },
  ]);

  // State สำหรับเก็บว่ากำลังเปิดเมนูของ ID ไหนอยู่ (ถ้าไม่มีคือ null)
  const [openMenuId, setOpenMenuId] = useState<number | null>(null);

  // สถิติรวม (Mock Data)
  const stats = [
    { title: "รายได้รวม", value: "฿12.5M", change: "+12.5%", isUp: true, icon: <DollarSign size={24} />, color: "bg-green-500" },
    { title: "ผู้ใช้งานทั้งหมด", value: "45,231", change: "+8.2%", isUp: true, icon: <Users size={24} />, color: "bg-blue-500" },
    { title: "อีเวนต์ที่จัดแล้ว", value: "1,204", change: "-2.4%", isUp: false, icon: <Ticket size={24} />, color: "bg-purple-500" },
    { title: "รออนุมัติผู้จัด", value: pendingOrganizers.filter(o => o.status === "รอตรวจสอบ").length.toString(), change: "Action Needed", isUp: true, icon: <Building2 size={24} />, color: "bg-orange-500" },
  ];

  // ฟังก์ชันอัปเดตสถานะ (อนุมัติ / ปฏิเสธ)
  const handleUpdateStatus = (id: number, newStatus: string) => {
    setPendingOrganizers(prev => prev.map(org => 
      org.id === id ? { ...org, status: newStatus } : org
    ));
    setOpenMenuId(null); // ปิดเมนูหลังกด
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500" onClick={() => setOpenMenuId(null)}>
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-1">ภาพรวมระบบ</h1>
          <p className="text-gray-400 text-sm">ยินดีต้อนรับกลับ, Admin 👋 นี่คือสถานะของระบบวันนี้</p>
        </div>
        <div className="flex gap-3">
           <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> System Online
           </span>
        </div>
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-[#161B22] border border-white/5 p-6 rounded-2xl hover:border-white/10 transition-all">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${stat.color} bg-opacity-10 text-white`}>
                 <div className={`${stat.color} p-2 rounded-lg`}>{stat.icon}</div>
              </div>
              <span className={`flex items-center text-xs font-bold px-2 py-1 rounded-full ${stat.isUp ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} {stat.change}
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium">{stat.title}</h3>
            <p className="text-2xl font-bold mt-1">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Section: Organizers Pending Approval */}
      <div className="bg-[#161B22] border border-white/5 rounded-2xl overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-lg">คำขอสมัครผู้จัดงาน (ล่าสุด)</h2>
            <span className="bg-orange-500/10 text-orange-500 text-xs px-2 py-0.5 rounded-full border border-orange-500/20 font-bold">
              {pendingOrganizers.filter(o => o.status === "รอตรวจสอบ").length}
            </span>
          </div>
          <Link href="/admin/organizers" className="text-sm text-blue-400 hover:text-blue-300 font-medium hover:underline">
            ดูทั้งหมด
          </Link>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-[#0B0F14] text-gray-200 uppercase text-xs font-bold">
              <tr>
                <th className="px-6 py-4">ชื่อบริษัท / ทีมงาน</th>
                <th className="px-6 py-4">อีเมลติดต่อ</th>
                <th className="px-6 py-4">เวลาที่สมัคร</th>
                <th className="px-6 py-4">สถานะ</th>
                <th className="px-6 py-4 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pendingOrganizers.map((org) => (
                <tr key={org.id} className="hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4 font-bold text-white">{org.name}</td>
                  <td className="px-6 py-4 text-gray-400">{org.email}</td>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <Clock size={14} className="text-gray-600" /> {org.date}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold inline-flex items-center gap-1.5 ${
                      org.status === 'รอตรวจสอบ' ? 'bg-orange-500/10 text-orange-400 border border-orange-500/20' : 
                      org.status === 'อนุมัติแล้ว' ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
                      org.status === 'เอกสารไม่ครบ' ? 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' :
                      'bg-red-500/10 text-red-400 border border-red-500/20'
                    }`}>
                      {org.status === 'อนุมัติแล้ว' && <CheckCircle size={12} />}
                      {org.status}
                    </span>
                  </td>
                  
                  {/* ✅ ส่วนจัดการ (Dropdown Actions) */}
                  <td className="px-6 py-4 text-right relative">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === org.id ? null : org.id);
                      }}
                      className={`p-2 rounded-lg transition-colors ${openMenuId === org.id ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {/* เมนู Dropdown เด้งขึ้นมา */}
                    {openMenuId === org.id && (
                      <div className="absolute right-8 top-10 w-40 bg-[#1C2128] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                        <button 
                          onClick={() => handleUpdateStatus(org.id, "อนุมัติแล้ว")}
                          className="w-full text-left px-4 py-3 text-sm text-green-400 hover:bg-green-500/10 hover:text-green-300 flex items-center gap-2 font-medium"
                        >
                          <CheckCircle size={16} /> อนุมัติทันที
                        </button>
                        <button 
                          onClick={() => handleUpdateStatus(org.id, "เอกสารไม่ครบ")}
                          className="w-full text-left px-4 py-3 text-sm text-yellow-400 hover:bg-yellow-500/10 hover:text-yellow-300 flex items-center gap-2 font-medium"
                        >
                          <Clock size={16} /> แจ้งเอกสารขาด
                        </button>
                        <div className="h-[1px] bg-white/5 my-0"></div>
                        <button 
                          onClick={() => handleUpdateStatus(org.id, "ถูกปฏิเสธ")}
                          className="w-full text-left px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-2 font-medium"
                        >
                          <XCircle size={16} /> ปฏิเสธคำขอ
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}