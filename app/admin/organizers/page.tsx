"use client";

import { useState } from "react";
import { 
  Building2, Search, CheckCircle, XCircle, 
  User, Phone, Mail, MoreHorizontal, ShieldAlert, X // ✅ เพิ่ม X ตรงนี้ครับ
} from "lucide-react";

// Interface
interface OrganizerType {
  id: number;
  personName: string;  
  companyName: string; 
  email: string;
  phone: string;
  status: string;
  events: number;
  joined: string;
}

export default function OrganizersPage() {
  
  // Mock Data
  const [organizers, setOrganizers] = useState<OrganizerType[]>([
    { id: 1, personName: "คุณสมชาย ใจดี", companyName: "GMM Grammy", email: "contact@gmm.com", phone: "02-669-9000", status: "Active", events: 12, joined: "12 Jan 2024" },
    { id: 2, personName: "คุณวิชัย รักดนตรี", companyName: "RS Group", email: "info@rs.co.th", phone: "02-511-0555", status: "Active", events: 8, joined: "15 Jan 2024" },
    { id: 3, personName: "คุณกานดา มาหา", companyName: "Indie Music TH", email: "booking@indie.th", phone: "089-123-4567", status: "Pending", events: 0, joined: "Yesterday" },
    { id: 4, personName: "นายสมศักดิ์ ขี้โกง", companyName: "Scammer Fest", email: "fake@scam.com", phone: "099-999-9999", status: "Suspended", events: 0, joined: "2 Days ago" },
    { id: 5, personName: "แอดมินเพจ", companyName: "Love Is Ent", email: "contact@loveis.com", phone: "02-123-4567", status: "Pending", events: 0, joined: "Today" },
  ]);

  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrg, setSelectedOrg] = useState<OrganizerType | null>(null);

  // Filter Logic
  const filteredOrganizers = organizers.filter(org => {
    const matchesSearch = org.personName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          org.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          org.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" ? true : org.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Status Change Logic
  const handleStatusChange = (id: number, newStatus: string) => {
    if(confirm(`ยืนยันการเปลี่ยนสถานะเป็น ${newStatus}?`)) {
      setOrganizers(prev => prev.map(org => {
        if (org.id === id) {
           if (selectedOrg?.id === id) setSelectedOrg({ ...org, status: newStatus });
           return { ...org, status: newStatus };
        }
        return org;
      }));
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen text-white p-8 bg-[#0B0F14]">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="text-blue-500" /> อนุมัติผู้จัดงาน (Organizers)
          </h1>
          <p className="text-gray-400 text-sm">ตรวจสอบและอนุมัติบัญชีผู้จัดงานคอนเสิร์ต</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row gap-4 bg-[#161B22] p-4 rounded-2xl border border-white/5">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ค้นหาชื่อคน, บริษัท, อีเมล..." 
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
                <th className="p-4 border-b border-white/5 pl-6">ผู้ขอใช้งาน (Person)</th>
                <th className="p-4 border-b border-white/5">สังกัด / องค์กร</th>
                <th className="p-4 border-b border-white/5">ข้อมูลติดต่อ</th>
                <th className="p-4 border-b border-white/5 text-center">อีเวนต์</th>
                <th className="p-4 border-b border-white/5">วันที่สมัคร</th>
                <th className="p-4 border-b border-white/5">สถานะ</th>
                <th className="p-4 border-b border-white/5 text-right pr-6">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredOrganizers.map((org) => (
                <tr 
                    key={org.id} 
                    className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                    onClick={() => setSelectedOrg(org)}
                >
                  
                  <td className="p-4 pl-6">
                    <div className="font-bold text-white text-base group-hover:text-blue-400 transition-colors flex items-center gap-2">
                        <User size={16} className="text-blue-500"/> {org.personName}
                    </div>
                    <div className="text-xs text-gray-500 font-mono mt-0.5 ml-6">ID: ORG-{org.id.toString().padStart(4, '0')}</div>
                  </td>

                  <td className="p-4">
                    <div className="flex items-center gap-2 text-gray-300">
                         <Building2 size={14} className="text-pink-500"/> 
                         <span className="font-medium">{org.companyName}</span>
                     </div>
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

                  <td className="p-4 text-right pr-6">
                    <button className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors">
                        <MoreHorizontal size={16}/>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredOrganizers.length === 0 && (
             <div className="p-12 text-center text-gray-500">
                 <Building2 size={48} className="mx-auto mb-3 opacity-20"/>
                 ไม่พบข้อมูลผู้จัดงาน
             </div>
          )}
        </div>
      </div>

      {/* ✅ Modal ตรวจสอบข้อมูล */}
      {selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="absolute inset-0" onClick={() => setSelectedOrg(null)}></div>
            <div className="relative bg-[#161B22] w-full max-w-lg rounded-2xl border border-white/10 shadow-2xl overflow-hidden">
                
                {/* Modal Header */}
                <div className="p-6 border-b border-white/10 bg-[#0B0F14] flex justify-between items-start">
                    <div>
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            {selectedOrg.personName}
                            <span className={`text-[10px] px-2 py-0.5 rounded border uppercase ${
                                selectedOrg.status === 'Pending' ? 'text-orange-400 border-orange-500/30' : 
                                selectedOrg.status === 'Active' ? 'text-green-400 border-green-500/30' : 'text-red-400 border-red-500/30'
                            }`}>
                                {selectedOrg.status}
                            </span>
                        </h2>
                        <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                             <Building2 size={14} className="text-pink-500"/> {selectedOrg.companyName}
                        </p>
                    </div>
                    {/* ✅ ใช้ X ที่ import มาแล้ว */}
                    <button onClick={() => setSelectedOrg(null)} className="p-2 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-full transition-colors">
                        <X size={20}/>
                    </button>
                </div>

                {/* Body: ข้อมูลผู้สมัคร */}
                <div className="p-6 space-y-4">
                    
                    {/* ข้อมูลผู้ติดต่อ */}
                    <div className="bg-[#0B0F14] p-4 rounded-xl border border-white/5">
                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                             <User size={14} className="text-blue-500"/> ข้อมูลผู้ติดต่อ (Contact Person)
                        </h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-gray-500 text-xs">ชื่อ-นามสกุล</p>
                                <p className="text-white font-medium">{selectedOrg.personName}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">เบอร์โทรศัพท์</p>
                                <p className="text-white font-medium font-mono">{selectedOrg.phone}</p>
                            </div>
                        </div>
                    </div>

                    {/* ข้อมูลองค์กร */}
                    <div className="bg-[#0B0F14] p-4 rounded-xl border border-white/5">
                        <h3 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
                             <Building2 size={14} className="text-pink-500"/> ข้อมูลองค์กร (Organization)
                        </h3>
                        <div className="space-y-3">
                            <div>
                                <p className="text-gray-500 text-xs">ชื่อบริษัท / องค์กร</p>
                                <p className="text-white font-medium">{selectedOrg.companyName}</p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">อีเมลองค์กร</p>
                                <p className="text-white font-medium flex items-center gap-2">
                                    <Mail size={14}/> {selectedOrg.email}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-500 text-xs">วันที่สมัคร</p>
                                <p className="text-white font-medium">{selectedOrg.joined}</p>
                            </div>
                        </div>
                    </div>
                    
                    {/* หมายเหตุสำหรับ Admin */}
                    <div className="p-3 bg-yellow-500/5 border border-yellow-500/10 rounded-lg">
                        <p className="text-xs text-yellow-500 flex items-center gap-2">
                            ⚠️ กรุณาตรวจสอบชื่อบริษัทและเบอร์โทรศัพท์ก่อนกดอนุมัติ
                        </p>
                    </div>
                </div>

                {/* Modal Footer (Actions) */}
                <div className="p-4 bg-[#1C2128] border-t border-white/5 flex justify-end gap-3">
                    {selectedOrg.status === 'Pending' ? (
                        <>
                            <button 
                                onClick={() => handleStatusChange(selectedOrg.id, 'Suspended')}
                                className="px-4 py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 text-sm font-bold transition-colors"
                            >
                                <XCircle size={16} className="inline mr-2"/> ปฏิเสธ
                            </button>
                            <button 
                                onClick={() => handleStatusChange(selectedOrg.id, 'Active')}
                                className="px-4 py-2 rounded-lg bg-green-600 hover:bg-green-500 text-white text-sm font-bold transition-colors shadow-lg shadow-green-900/20"
                            >
                                <CheckCircle size={16} className="inline mr-2"/> อนุมัติ
                            </button>
                        </>
                    ) : (
                        <button 
                             onClick={() => handleStatusChange(selectedOrg.id, selectedOrg.status === 'Active' ? 'Suspended' : 'Active')}
                             className={`px-4 py-2 rounded-lg border text-sm font-bold transition-colors ${
                                 selectedOrg.status === 'Active' 
                                 ? 'border-red-500/30 text-red-400 hover:bg-red-500/10' 
                                 : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                             }`}
                        >
                             {selectedOrg.status === 'Active' ? <><ShieldAlert size={16} className="inline mr-2"/> ระงับบัญชี</> : 'เปิดใช้งานบัญชี'}
                        </button>
                    )}
                </div>

            </div>
        </div>
      )}

    </div>
  );
}