"use client";
import { useState, useEffect } from "react";
import { Search, Building2, Mail, Phone, MoreHorizontal, UserCheck, X, Calendar, Ticket, ChevronDown, ExternalLink } from "lucide-react";
import Link from "next/link"; // 👈 เพิ่ม Import Link

// อัปเดต Interface ให้รองรับข้อมูล Events จาก Backend
interface EventDetail {
  Event_id: number;
  eventName: string;
}

interface Organizer {
  id: number;
  org_code: string;
  person_name: string;
  company_name: string;
  email: string;
  phone: string;
  event_count: number;
  events?: EventDetail[]; // 👈 รับค่า Array ของอีเวนต์
  created_at: string;
  status: "Pending" | "Active" | "Suspended";
}

export default function AdminOrganizersPage() {
  const [organizers, setOrganizers] = useState<Organizer[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("All");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organizer | null>(null);
  const [showEventList, setShowEventList] = useState(false); // State ควบคุมการกางลิสต์อีเวนต์

  useEffect(() => {
    const fetchOrganizers = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token'); 
        const res = await fetch("http://localhost:8000/api/admin/organizers", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json"
          }
        });

        if (res.ok) {
          const data = await res.json();
          setOrganizers(data);
        } else {
          console.error("Failed to fetch organizers");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrganizers();
  }, []);

  const filteredOrganizers = organizers.filter((org) => {
    const matchesSearch = 
      org.person_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      org.email.toLowerCase().includes(searchQuery.toLowerCase());
      
    const matchesTab = activeTab === "All" || org.status === activeTab;
    return matchesSearch && matchesTab;
  });

  const tabs = ["All", "Pending", "Active", "Suspended"];

  const openModal = (org: Organizer) => {
    setSelectedOrg(org);
    setShowEventList(false); // รีเซ็ตลิสต์ให้หุบไว้ก่อนเสมอตอนเปิด Modal
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedOrg(null);
    setShowEventList(false);
  };

  const handleUpdateStatus = (id: number, newStatus: "Active" | "Suspended" | "Pending", actionName: string) => {
    if (confirm(`คุณแน่ใจหรือไม่ที่จะ ${actionName} ผู้จัดงานรายนี้?`)) {
      setOrganizers(prev => prev.map(org => org.id === id ? { ...org, status: newStatus } : org));
      alert(`${actionName} สำเร็จ!`);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full text-white">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-3">
          <Building2 className="text-blue-500" size={28} />
          อนุมัติผู้จัดงาน (Organizers)
        </h1>
        <p className="text-gray-400 text-sm mt-1">ตรวจสอบและอนุมัติบัญชีผู้จัดงานคอนเสิร์ต</p>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-[#161B22] p-4 rounded-xl border border-white/5">
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
          <input
            type="text"
            placeholder="ค้นหาชื่อคน, บริษัท, อีเมล..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#0B0F14] text-white text-sm px-4 py-2.5 pl-11 rounded-lg border border-white/10 focus:outline-none focus:border-blue-500 transition-colors placeholder:text-gray-600"
          />
        </div>

        <div className="flex bg-[#0B0F14] p-1 rounded-lg border border-white/10">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                activeTab === tab ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="bg-[#161B22] rounded-xl border border-white/5 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="text-xs text-gray-400 uppercase bg-[#0B0F14]/50 border-b border-white/5">
              <tr>
                <th className="px-6 py-4 font-medium">ผู้ขอใช้งาน (PERSON)</th>
                <th className="px-6 py-4 font-medium">สังกัด / องค์กร</th>
                <th className="px-6 py-4 font-medium">ข้อมูลติดต่อ</th>
                <th className="px-6 py-4 font-medium text-center">อีเวนต์</th>
                <th className="px-6 py-4 font-medium">วันที่สมัคร</th>
                <th className="px-6 py-4 font-medium">สถานะ</th>
                <th className="px-6 py-4 font-medium text-center">จัดการ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">กำลังโหลดข้อมูล...</td>
                </tr>
              ) : filteredOrganizers.length > 0 ? (
                filteredOrganizers.map((org) => (
                  <tr key={org.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                          <UserCheck size={16} />
                        </div>
                        <div>
                          <p className="font-bold text-gray-200 group-hover:text-white transition-colors">{org.person_name}</p>
                          <p className="text-[11px] text-gray-500">ID: {org.org_code}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-pink-400 bg-pink-500/10 w-fit px-2 py-1 rounded">
                        <Building2 size={14} />
                        <span className="font-medium text-xs">{org.company_name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1 text-gray-400 text-xs">
                        <span className="flex items-center gap-2"><Mail size={12} /> {org.email}</span>
                        <span className="flex items-center gap-2"><Phone size={12} /> {org.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="bg-white/10 text-gray-300 text-xs font-bold px-2 py-1 rounded">{org.event_count}</span>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-xs">
                      {new Date(org.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 text-xs font-medium w-fit px-2.5 py-1 rounded-full border ${
                        org.status === 'Active' ? 'text-green-400 border-green-500/20 bg-green-500/10' :
                        org.status === 'Pending' ? 'text-yellow-400 border-yellow-500/20 bg-yellow-500/10' :
                        'text-red-400 border-red-500/20 bg-red-500/10'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          org.status === 'Active' ? 'bg-green-400' :
                          org.status === 'Pending' ? 'bg-yellow-400' : 'bg-red-400'
                        }`}></span>
                        {org.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button 
                          onClick={() => openModal(org)} 
                          className="text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 px-3 py-1.5 rounded transition-colors text-xs font-medium border border-blue-500/20"
                        >
                          ดูข้อมูล
                        </button>
                        {org.status === 'Pending' && (
                          <>
                            <button onClick={() => handleUpdateStatus(org.id, 'Active', 'อนุมัติ')} className="bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500 hover:text-white px-3 py-1.5 rounded transition-all text-xs font-medium">
                              อนุมัติ
                            </button>
                            <button onClick={() => handleUpdateStatus(org.id, 'Suspended', 'ไม่อนุมัติ')} className="bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500 hover:text-white px-3 py-1.5 rounded transition-all text-xs font-medium">
                              ไม่อนุมัติ
                            </button>
                          </>
                        )}
                        {org.status === 'Active' && (
                          <button onClick={() => handleUpdateStatus(org.id, 'Suspended', 'ระงับสิทธิ์')} className="bg-orange-500/10 text-orange-400 border border-orange-500/20 hover:bg-orange-500 hover:text-white px-3 py-1.5 rounded transition-all text-xs font-medium">
                            ระงับสิทธิ์
                          </button>
                        )}
                        {org.status === 'Suspended' && (
                          <button onClick={() => handleUpdateStatus(org.id, 'Active', 'คืนสิทธิ์')} className="bg-gray-500/10 text-gray-400 border border-gray-500/20 hover:bg-gray-500 hover:text-white px-3 py-1.5 rounded transition-all text-xs font-medium">
                            คืนสิทธิ์
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-gray-500">ไม่พบข้อมูลผู้จัดงาน</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && selectedOrg && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-[#12161B] border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between p-5 border-b border-white/5 bg-white/5">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <UserCheck className="text-blue-500" size={20} />
                ข้อมูลผู้จัดงาน
              </h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-white transition-colors p-1 rounded-md hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              <div className="bg-white/5 p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-500">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">องค์กร / สังกัด</p>
                    <p className="font-bold text-white">{selectedOrg.company_name}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <UserCheck size={16} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">ชื่อผู้ดูแล (Admin)</p>
                    <p className="text-sm font-medium text-gray-200">{selectedOrg.person_name} <span className="text-xs text-gray-500 ml-1">({selectedOrg.org_code})</span></p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail size={16} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">อีเมล</p>
                    <p className="text-sm font-medium text-gray-200">{selectedOrg.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone size={16} className="text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500">เบอร์โทรศัพท์</p>
                    <p className="text-sm font-medium text-gray-200">{selectedOrg.phone}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                <div className="bg-white/5 p-3 rounded-lg border border-white/5 text-center">
                  <Calendar size={16} className="text-gray-400 mx-auto mb-1" />
                  <p className="text-[10px] text-gray-500">วันที่สมัคร</p>
                  <p className="text-sm font-bold text-gray-300">
                    {new Date(selectedOrg.created_at).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
                  </p>
                </div>

                <button 
                  onClick={() => setShowEventList(!showEventList)}
                  className="bg-white/5 p-3 rounded-lg border border-white/5 text-center hover:bg-white/10 transition-colors group flex flex-col items-center w-full"
                >
                  <div className="flex items-center gap-1 mx-auto mb-1 text-blue-400">
                    <Ticket size={16} />
                  </div>
                  <p className="text-[10px] text-gray-500">จำนวนอีเวนต์ที่จัด</p>
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-sm font-bold text-blue-400">{selectedOrg.event_count} งาน</p>
                    {selectedOrg.event_count > 0 && (
                      <ChevronDown size={14} className={`text-blue-400 transition-transform ${showEventList ? "rotate-180" : ""}`} />
                    )}
                  </div>
                </button>
              </div>

              {/* ลิสต์รายชื่องานที่ซ่อนอยู่ */}
              {showEventList && selectedOrg.event_count > 0 && (
                <div className="p-3 bg-black/30 rounded-lg border border-white/5 max-h-40 overflow-y-auto custom-scrollbar animate-in slide-in-from-top-2 duration-200">
                  <h4 className="text-xs font-bold text-gray-400 mb-2 pb-2 border-b border-white/5">รายการอีเวนต์:</h4>
                  <ul className="space-y-1.5">
                    {selectedOrg.events?.map((ev, idx) => (
                      <li key={idx}>
                        <Link 
                          href={`/admin/organizers/${ev.Event_id}`}
                          className="text-sm text-gray-300 hover:text-blue-400 transition-colors flex items-center justify-between group"
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className="w-1 h-1 bg-blue-500 rounded-full flex-shrink-0"></span>
                            <span className="truncate">{ev.eventName}</span>
                          </div>
                          <ExternalLink size={12} className="text-gray-600 group-hover:text-blue-400 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
}