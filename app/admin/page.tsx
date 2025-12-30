"use client";
import { 
  Users, Building2, Ticket, DollarSign, 
  ArrowUpRight, ArrowDownRight, MoreHorizontal 
} from "lucide-react";

export default function AdminDashboard() {
  
  // Mock Data: สถิติรวม
  const stats = [
    { title: "รายได้รวม", value: "฿12.5M", change: "+12.5%", isUp: true, icon: <DollarSign size={24} />, color: "bg-green-500" },
    { title: "ผู้ใช้งานทั้งหมด", value: "45,231", change: "+8.2%", isUp: true, icon: <Users size={24} />, color: "bg-blue-500" },
    { title: "อีเวนต์ที่จัดแล้ว", value: "1,204", change: "-2.4%", isUp: false, icon: <Ticket size={24} />, color: "bg-purple-500" },
    { title: "รออนุมัติผู้จัด", value: "12", change: "Action Needed", isUp: true, icon: <Building2 size={24} />, color: "bg-orange-500" },
  ];

  // Mock Data: รายการรอดำเนินการล่าสุด
  const pendingOrganizers = [
    { id: 1, name: "GMM Grammy", email: "contact@gmm.com", date: "10 นาทีที่แล้ว", status: "รอตรวจสอบ" },
    { id: 2, name: "RS Group", email: "admin@rs.co.th", date: "2 ชั่วโมงที่แล้ว", status: "รอตรวจสอบ" },
    { id: 3, name: "Smallroom", email: "info@smallroom.com", date: "1 วันที่แล้ว", status: "เอกสารไม่ครบ" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold mb-1">ภาพรวมระบบ</h1>
          <p className="text-gray-400 text-sm">ยินดีต้อนรับกลับ, Admin 👋 นี่คือสถานะของระบบวันนี้</p>
        </div>
        <div className="flex gap-3">
           <span className="px-3 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20 flex items-center gap-1">
              ● System Online
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
      <div className="bg-[#161B22] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h2 className="font-bold text-lg">คำขอสมัครผู้จัดงาน (ล่าสุด)</h2>
          <button className="text-sm text-blue-400 hover:text-blue-300">ดูทั้งหมด</button>
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
                <tr key={org.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4 font-medium text-white">{org.name}</td>
                  <td className="px-6 py-4">{org.email}</td>
                  <td className="px-6 py-4">{org.date}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      org.status === 'รอตรวจสอบ' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {org.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-gray-400 hover:text-white p-2 hover:bg-white/10 rounded-lg transition-colors">
                      <MoreHorizontal size={18} />
                    </button>
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