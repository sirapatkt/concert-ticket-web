"use client";
import { useState } from "react";
import { 
  Search, Filter, MoreHorizontal, CheckCircle, XCircle, 
  ShieldAlert, Building2, Mail, Phone 
} from "lucide-react";

export default function OrganizersPage() {
  
  // Mock Data: รายชื่อผู้จัดงาน
  const [organizers, setOrganizers] = useState([
    { id: 1, name: "GMM Grammy", email: "contact@gmm.com", phone: "02-669-9000", status: "Active", events: 12, joined: "12 Jan 2024" },
    { id: 2, name: "RS Group", email: "info@rs.co.th", phone: "02-511-0555", status: "Active", events: 8, joined: "15 Jan 2024" },
    { id: 3, name: "Indie Music TH", email: "booking@indie.th", phone: "089-123-4567", status: "Pending", events: 0, joined: "Yesterday" },
    { id: 4, name: "Scammer Fest", email: "fake@scam.com", phone: "099-999-9999", status: "Suspended", events: 0, joined: "2 Days ago" },
    { id: 5, name: "Love Is Ent", email: "contact@loveis.com", phone: "02-123-4567", status: "Pending", events: 0, joined: "Today" },
  ]);

  const [filterStatus, setFilterStatus] = useState("All");

  // ฟังก์ชันกรองข้อมูล
  const filteredOrganizers = organizers.filter(org => 
    filterStatus === "All" ? true : org.status === filterStatus
  );

  // ฟังก์ชันเปลี่ยนสถานะ (จำลอง)
  const handleStatusChange = (id: number, newStatus: string) => {
    setOrganizers(prev => prev.map(org => org.id === id ? { ...org, status: newStatus } : org));
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Building2 className="text-blue-500" /> อนุมัติผู้จัดงาน (Organizers)
          </h1>
          <p className="text-gray-400 text-sm">ตรวจสอบและอนุมัติบัญชีผู้จัดงานคอนเสิร์ต</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-900/20 transition-all">
          + เพิ่มผู้จัดงานใหม่
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-[#161B22] p-4 rounded-2xl border border-white/5">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อบริษัท, อีเมล..." 
            className="w-full bg-[#0B0F14] border border-white/10 text-white pl-10 pr-4 py-2.5 rounded-xl focus:outline-none focus:border-blue-500 transition-colors text-sm"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex bg-[#0B0F14] p-1 rounded-xl border border-white/10">
          {["All", "Pending", "Active", "Suspended"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                filterStatus === status ? "bg-[#161B22] text-white shadow" : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#161B22] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-[#0B0F14] text-gray-400 text-xs uppercase font-bold tracking-wider">
              <tr>
                <th className="p-4 border-b border-white/5">ชื่อผู้จัดงาน</th>
                <th className="p-4 border-b border-white/5">ข้อมูลติดต่อ</th>
                <th className="p-4 border-b border-white/5 text-center">อีเวนต์</th>
                <th className="p-4 border-b border-white/5">วันที่สมัคร</th>
                <th className="p-4 border-b border-white/5">สถานะ</th>
                <th className="p-4 border-b border-white/5 text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredOrganizers.map((org) => (
                <tr key={org.id} className="hover:bg-white/[0.02] transition-colors group">
                  
                  <td className="p-4">
                    <div className="font-bold text-white">{org.name}</div>
                    <div className="text-xs text-gray-500">ID: ORG-{org.id.toString().padStart(4, '0')}</div>
                  </td>

                  <td className="p-4 space-y-1">
                    <div className="flex items-center gap-2 text-gray-300">
                      <Mail size={12} className="text-gray-500" /> {org.email}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Phone size={12} className="text-gray-500" /> {org.phone}
                    </div>
                  </td>

                  <td className="p-4 text-center">
                    <span className="bg-white/5 px-2 py-1 rounded text-white font-mono">{org.events}</span>
                  </td>

                  <td className="p-4 text-gray-400">{org.joined}</td>

                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                      org.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                      org.status === 'Pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' :
                      'bg-red-500/10 text-red-400 border-red-500/20'
                    }`}>
                      <div className={`w-1.5 h-1.5 rounded-full ${
                        org.status === 'Active' ? 'bg-green-400' :
                        org.status === 'Pending' ? 'bg-orange-400' : 'bg-red-400'
                      }`}></div>
                      {org.status}
                    </span>
                  </td>

                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {org.status === 'Pending' && (
                        <>
                          <button 
                            onClick={() => handleStatusChange(org.id, "Active")}
                            className="p-2 bg-green-500/10 text-green-400 hover:bg-green-500 hover:text-white rounded-lg transition-colors" title="อนุมัติ"
                          >
                            <CheckCircle size={16} />
                          </button>
                          <button 
                            onClick={() => handleStatusChange(org.id, "Suspended")}
                            className="p-2 bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="ไม่อนุมัติ"
                          >
                            <XCircle size={16} />
                          </button>
                        </>
                      )}
                      
                      {org.status === 'Active' && (
                        <button 
                          onClick={() => handleStatusChange(org.id, "Suspended")}
                          className="p-2 bg-gray-700/50 text-gray-400 hover:bg-red-500 hover:text-white rounded-lg transition-colors" title="ระงับการใช้งาน"
                        >
                          <ShieldAlert size={16} />
                        </button>
                      )}

                      <button className="p-2 hover:bg-white/10 text-gray-400 hover:text-white rounded-lg transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOrganizers.length === 0 && (
            <div className="p-12 text-center text-gray-500">
              <Building2 size={48} className="mx-auto mb-3 opacity-20" />
              <p>ไม่พบข้อมูลผู้จัดงานในสถานะนี้</p>
            </div>
          )}
        </div>
      </div>

    </div>
  );
}