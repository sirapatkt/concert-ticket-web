"use client";

import { useState, useEffect } from "react";
import { 
  CalendarDays, MapPin, Eye, Check, X, Search, Filter, 
  User, FileText, CreditCard, DollarSign, Clock, 
  RotateCcw, MessageSquare, Edit, Trash2, Save, ImageIcon,
  PlusCircle, MinusCircle, Tag, CalendarClock, Ticket 
} from "lucide-react";

// ✅ 1. Interface (คงเดิม)
interface TicketType {
  id: number;
  zone: string;
  price: number;
  totalSeats: number;
}

interface EventType {
  id: number;
  title: string;
  organizer: string;
  date: string;
  endDate?: string;
  time: string;
  venue: string;
  image: string;
  description: string;
  category: string;
  approvalStatus: "pending" | "approved" | "rejected" | "changes_requested" | "cancelled"; 
  adminFeedback?: string; 
  paymentStatus: "paid" | "unpaid"; 
  publishDate: string;
  saleStartDate?: string;
  depositAmount: string;
  tickets: TicketType[];
}

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<"pending" | "all">("pending");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);

  // ✅ เปลี่ยน State เริ่มต้นให้ว่างเปล่า เพื่อรอรับข้อมูลจาก DB
  const [events, setEvents] = useState<EventType[]>([]);

  // ✅ ดึงข้อมูลจาก DB เมื่อโหลดหน้า (เปลี่ยนให้ชี้ไปหา Laravel Port 8000)
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/admin/events', {
            headers: { "Accept": "application/json" }
        });
        if (res.ok) {
          const data = await res.json();
          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (activeTab === "pending") {
      return matchesSearch && (event.approvalStatus === "pending" || event.approvalStatus === "changes_requested");
    }
    return matchesSearch;
  });

  // ✅ Actions - ปรับปรุงให้ยิง API ไปอัปเดต DB (แก้เป็น Port 8000)
  const handleApprove = async (id: number) => {
    if (confirm("ยืนยันการอนุมัติเนื้อหาอีเวนต์นี้?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/events/${id}/status`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ approvalStatus: "approved" })
        });
        if (res.ok) {
          setEvents(events.map(e => e.id === id ? { ...e, approvalStatus: "approved" } : e));
          setSelectedEvent(null); 
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  const handleReject = async (id: number) => {
    if (confirm("ยืนยันการปฏิเสธคำขอ (ไม่อนุมัติ)?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/events/${id}/status`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ approvalStatus: "rejected" })
        });
        if (res.ok) {
          setEvents(events.map(e => e.id === id ? { ...e, approvalStatus: "rejected" } : e));
          setSelectedEvent(null); 
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  const handleRequestChanges = async (id: number) => {
    const reason = prompt("กรุณาระบุสิ่งที่ต้องการให้แก้ไข:");
    if (reason && reason.trim() !== "") {
      try {
        const res = await fetch(`http://localhost:8000/api/events/${id}/status`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({ approvalStatus: "changes_requested", adminFeedback: reason })
        });
        if (res.ok) {
          setEvents(events.map(e => e.id === id ? { ...e, approvalStatus: "changes_requested", adminFeedback: reason } : e));
          alert("ส่งคำขอแก้ไขเรียบร้อย ✅");
          setSelectedEvent(null);
        }
      } catch (error) {
        console.error("Error updating status:", error);
      }
    }
  };

  const handleEdit = (event: EventType) => {
    setEditingEvent({ 
      ...event, 
      tickets: event.tickets ? event.tickets.map(t => ({...t})) : [] 
    });
    setSelectedEvent(null);
  };

  const handleSaveEdit = async () => {
    if (!editingEvent) return;
    try {
      const res = await fetch(`http://localhost:8000/api/events/${editingEvent.id}`, {
        method: 'PUT', 
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(editingEvent)
      });
      if (res.ok) {
        setEvents(prev => prev.map(e => e.id === editingEvent.id ? editingEvent : e));
        setEditingEvent(null);
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล");
      }
    } catch (error) {
      console.error("Error saving event:", error);
    }
  };

  const handleDelete = async (id: number, status: string) => {
    if (status === "approved" || status === "paid") {
        if(confirm("⚠️ งานนี้ได้รับการอนุมัติแล้ว! การลบอาจกระทบผู้ใช้งาน \n\nต้องการเปลี่ยนสถานะเป็น 'ยกเลิก (Cancelled)' หรือไม่?")) {
            try {
              const res = await fetch(`http://localhost:8000/api/events/${id}/status`, {
                method: 'PATCH',
                headers: { 
                  'Content-Type': 'application/json',
                  'Accept': 'application/json'
                },
                body: JSON.stringify({ approvalStatus: "cancelled" })
              });
              if (res.ok) {
                setEvents(events.map(e => e.id === id ? { ...e, approvalStatus: "cancelled" } : e));
                setSelectedEvent(null);
              }
            } catch (error) {
              console.error("Error cancelling event:", error);
            }
        }
    } else {
        if(confirm("ยืนยันการลบรายการนี้ถาวร?")) {
            try {
              const res = await fetch(`http://localhost:8000/api/events/${id}`, {
                method: 'DELETE',
                headers: {
                  'Accept': 'application/json'
                }
              });
              if (res.ok) {
                setEvents(events.filter(e => e.id !== id));
                setSelectedEvent(null);
              }
            } catch (error) {
              console.error("Error deleting event:", error);
            }
        }
    }
  };

  // ✅ ฟังก์ชันการจัดการ Ticket (ทำงานบน Client ก่อนเซฟ) - คงเดิม
  const updateTicket = <K extends keyof TicketType>(index: number, field: K, value: TicketType[K]) => {
    if (!editingEvent) return;
    const newTickets = [...editingEvent.tickets];
    newTickets[index] = { ...newTickets[index], [field]: value };
    setEditingEvent({ ...editingEvent, tickets: newTickets });
  };

  const addTicket = () => {
    if (!editingEvent) return;
    setEditingEvent({
        ...editingEvent,
        tickets: [...editingEvent.tickets, { id: Date.now(), zone: "New Zone", price: 0, totalSeats: 0 }]
    });
  };

  const removeTicket = (index: number) => {
    if (!editingEvent) return;
    const newTickets = editingEvent.tickets.filter((_, i) => i !== index);
    setEditingEvent({ ...editingEvent, tickets: newTickets });
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white min-h-screen relative pb-10">
      
      {/* Header & Tabs */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CalendarDays className="text-purple-500" /> จัดการอีเวนต์ (Events)
        </h1>
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
                type="text" 
                placeholder="ค้นหาชื่องาน..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-[#161B22] border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:border-purple-500 transition-all w-full md:w-64"
            />
        </div>
      </div>

      <div className="flex gap-6 border-b border-white/10">
        <button 
          onClick={() => setActiveTab("pending")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "pending" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          งานที่ต้องจัดการ
          {events.filter(e => e.approvalStatus === "pending" || e.approvalStatus === "changes_requested").length > 0 && (
            <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
              {events.filter(e => e.approvalStatus === "pending" || e.approvalStatus === "changes_requested").length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab("all")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "all" ? "border-purple-500 text-purple-500" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          รายการทั้งหมด
        </button>
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div key={event.id} className="bg-[#161B22] border border-white/5 p-4 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 hover:border-white/20 transition-all group">
              <div className="flex gap-4 items-center flex-1">
                <img src={event.image} alt="cover" className="w-16 h-16 rounded-xl object-cover bg-gray-800 shrink-0" />
                <div>
                  <h3 className="font-bold text-lg text-white group-hover:text-purple-400 transition-colors">{event.title}</h3>
                  <div className="text-sm text-gray-400 space-y-1">
                      <p className="flex items-center gap-1"><User size={12}/> {event.organizer}</p>
                      <p className="flex items-center gap-2 text-xs mt-1">
                         <span className="flex items-center gap-1 text-blue-400"><Tag size={12}/> {event.category}</span>
                         <span className="text-gray-600">|</span>
                         <span className="flex items-center gap-1 text-gray-400"><Clock size={12}/> Publish: {event.publishDate}</span>
                      </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4 self-end md:self-center">
                <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  event.approvalStatus === 'approved' ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                  event.approvalStatus === 'pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                  event.approvalStatus === 'changes_requested' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                  event.approvalStatus === 'cancelled' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                  'bg-red-500/10 text-red-400 border-red-500/20'
                }`}>
                  {event.approvalStatus === 'approved' ? 'อนุมัติแล้ว' : 
                   event.approvalStatus === 'pending' ? 'รอตรวจสอบ' : 
                   event.approvalStatus === 'changes_requested' ? 'ส่งแก้ไข' : 
                   event.approvalStatus === 'cancelled' ? 'ยกเลิก' : 'ไม่อนุมัติ'}
                </span>

                <div className="flex gap-2">
                  <button onClick={() => setSelectedEvent(event)} className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-white hover:text-black transition-colors" title="ดูรายละเอียด">
                    <Eye size={18} />
                  </button>

                  {event.approvalStatus === 'pending' ? (
                    <>
                      <button onClick={() => handleApprove(event.id)} className="p-2 bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500 hover:text-white border border-green-500/20" title="อนุมัติ"><Check size={18} /></button>
                      <button onClick={() => handleRequestChanges(event.id)} className="p-2 bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500 hover:text-black border border-yellow-500/20" title="ส่งแก้"><Edit size={18} /></button>
                      <button onClick={() => handleReject(event.id)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white border border-red-500/20" title="ปฏิเสธ"><X size={18} /></button>
                    </>
                  ) : (
                      <>
                        <button onClick={() => handleEdit(event)} className="p-2 bg-blue-500/10 text-blue-400 rounded-lg hover:bg-blue-500 hover:text-white border border-blue-500/20" title="แก้ไข">
                            <Edit size={18}/>
                        </button>
                        <button onClick={() => handleDelete(event.id, event.approvalStatus)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white border border-red-500/20" title="ลบ/ยกเลิก">
                            <Trash2 size={18}/>
                        </button>
                      </>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 text-gray-500 border border-dashed border-white/10 rounded-2xl bg-[#161B22]/50">
            <Filter className="mx-auto mb-3 opacity-50" size={40} />
            <p>ไม่พบรายการอีเวนต์ในหมวดนี้</p>
          </div>
        )}
      </div>

      {/* 👁️ MODAL 1: รายละเอียด (View Mode) */}
      {selectedEvent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="bg-[#161B22] w-full max-w-3xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
              
              {/* Header Image */}
              <div className="relative h-56 sm:h-64 shrink-0 bg-gray-800">
                  {selectedEvent.image ? (
                    <img src={selectedEvent.image} className="w-full h-full object-cover opacity-90"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon size={48}/></div>
                  )}
                  
                  <button onClick={() => setSelectedEvent(null)} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-white hover:text-black transition-colors">
                    <X size={20} />
                  </button>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#161B22] to-transparent p-6 pt-20">
                      <div className="flex items-end justify-between gap-4">
                        <div>
                            <span className="px-2 py-1 rounded bg-blue-500/20 text-blue-300 text-xs font-bold border border-blue-500/30 mb-2 inline-block">
                                {selectedEvent.category}
                            </span>
                            <h2 className="text-3xl font-bold text-white shadow-black drop-shadow-md">{selectedEvent.title}</h2>
                        </div>
                        {/* Status Badge */}
                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold border shadow-lg ${
                            selectedEvent.approvalStatus === 'approved' ? 'bg-green-500 text-black border-green-400' :
                            selectedEvent.approvalStatus === 'pending' ? 'bg-orange-500 text-white border-orange-400' : 
                            'bg-red-500 text-white border-red-400'
                        }`}>
                            {selectedEvent.approvalStatus.toUpperCase()}
                        </div>
                      </div>
                  </div>
              </div>

              {/* Scrollable Content */}
              <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                  
                  {/* 1. ข้อมูลหลัก (Grid Layout) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-[#0B0F14] p-4 rounded-xl border border-white/5 flex items-start gap-3">
                          <User className="text-blue-500 mt-1" size={18} />
                          <div>
                             <p className="text-xs text-gray-500 font-bold uppercase">ผู้จัดงาน (Organizer)</p>
                             <p className="text-white font-medium">{selectedEvent.organizer}</p>
                          </div>
                      </div>
                      <div className="bg-[#0B0F14] p-4 rounded-xl border border-white/5 flex items-start gap-3">
                          <MapPin className="text-red-500 mt-1" size={18} />
                          <div>
                             <p className="text-xs text-gray-500 font-bold uppercase">สถานที่ (Venue)</p>
                             <p className="text-white font-medium">{selectedEvent.venue}</p>
                          </div>
                      </div>
                      <div className="bg-[#0B0F14] p-4 rounded-xl border border-white/5 flex items-start gap-3">
                          <CalendarDays className="text-purple-500 mt-1" size={18} />
                          <div>
                             <p className="text-xs text-gray-500 font-bold uppercase">วันแสดง</p>
                             <p className="text-white font-medium">{selectedEvent.date} {selectedEvent.endDate ? `- ${selectedEvent.endDate}` : ''}</p>
                          </div>
                      </div>
                      <div className="bg-[#0B0F14] p-4 rounded-xl border border-white/5 flex items-start gap-3">
                          <Clock className="text-yellow-500 mt-1" size={18} />
                          <div>
                             <p className="text-xs text-gray-500 font-bold uppercase">เวลา</p>
                             <p className="text-white font-medium">{selectedEvent.time}</p>
                          </div>
                      </div>
                  </div>

                  {/* 2. รายละเอียดงาน */}
                  <div>
                      <h3 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                        <FileText size={16}/> รายละเอียด
                      </h3>
                      <div className="text-gray-400 text-sm bg-[#0B0F14] p-4 rounded-xl border border-white/5 leading-relaxed whitespace-pre-line">
                        {selectedEvent.description || "ไม่มีรายละเอียดระบุ"}
                      </div>
                  </div>

                  {/* 3. ✅ ข้อมูลบัตรและราคา */}
                  <div>
                      <h3 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                        <Ticket size={16}/> บัตรและราคา (Tickets)
                      </h3>
                      <div className="border border-white/10 rounded-xl overflow-hidden">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                                <tr>
                                    <th className="p-3 pl-4">Zone</th>
                                    <th className="p-3 text-right">Price</th>
                                    <th className="p-3 text-right pr-4">Seats</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-white/5 bg-[#0B0F14]">
                                {selectedEvent.tickets?.length > 0 ? (
                                    selectedEvent.tickets.map((t, i) => (
                                        <tr key={i}>
                                            <td className="p-3 pl-4 font-medium text-white">{t.zone}</td>
                                            <td className="p-3 text-right text-green-400">฿{t.price.toLocaleString()}</td>
                                            <td className="p-3 text-right pr-4 text-gray-400">{t.totalSeats.toLocaleString()} ใบ</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr><td colSpan={3} className="p-4 text-center text-gray-500">ไม่มีข้อมูลบัตร</td></tr>
                                )}
                            </tbody>
                        </table>
                      </div>
                  </div>

                  {/* Action Buttons */}
                  {selectedEvent.approvalStatus === 'pending' && (
                      <div className="flex gap-3 pt-4 border-t border-white/10">
                          <button 
                            onClick={() => handleApprove(selectedEvent.id)} 
                            className="flex-1 py-3 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl shadow-lg shadow-green-900/20 transition-all active:scale-95"
                          >
                             ✅ อนุมัติทันที
                          </button>
                          <button 
                            onClick={() => handleRequestChanges(selectedEvent.id)} 
                            className="flex-1 py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl shadow-lg shadow-yellow-900/20 transition-all active:scale-95"
                          >
                             ⚠️ ส่งแก้ไข
                          </button>
                      </div>
                  )}

                  <div className="flex justify-center pt-2">
                      <button onClick={() => setSelectedEvent(null)} className="text-gray-500 hover:text-white text-sm">ปิดหน้าต่าง</button>
                  </div>
              </div>
           </div>
        </div>
      )}

      {/* ✅ MODAL 2: แก้ไขข้อมูล (Edit Mode) */}
      {editingEvent && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#161B22] border border-white/10 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#0B0F14]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Edit size={20} className="text-blue-500"/> แก้ไขข้อมูลอีเวนต์
                    </h2>
                    <button onClick={() => setEditingEvent(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>

                {/* Form Body */}
                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    
                    {/* 1. Image & Basic Info */}
                    <div className="flex gap-4 items-start">
                        <div className="w-32 h-20 bg-gray-800 rounded-lg overflow-hidden border border-white/10 shrink-0">
                            {editingEvent.image ? <img src={editingEvent.image} className="w-full h-full object-cover" /> : <div className="flex items-center justify-center h-full"><ImageIcon className="text-gray-600"/></div>}
                        </div>
                        <div className="flex-1 space-y-2">
                            <input type="text" placeholder="URL รูปภาพปก" value={editingEvent.image} onChange={(e) => setEditingEvent({...editingEvent, image: e.target.value})} className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"/>
                             <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">ชื่องาน *</label>
                                    <input type="text" value={editingEvent.title} onChange={(e) => setEditingEvent({...editingEvent, title: e.target.value})} className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"/>
                                </div>
                                <div>
                                    <label className="text-xs text-gray-400 font-bold uppercase block mb-1">ผู้จัดงาน</label>
                                    <input type="text" value={editingEvent.organizer} onChange={(e) => setEditingEvent({...editingEvent, organizer: e.target.value})} className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"/>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 2. Date/Time/Venue */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs text-gray-400 font-bold uppercase block mb-1">วันเริ่มแสดง</label>
                            <input type="date" value={editingEvent.date} onChange={(e) => setEditingEvent({...editingEvent, date: e.target.value})} className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none [color-scheme:dark]"/>
                        </div>
                         <div>
                            <label className="text-xs text-gray-400 font-bold uppercase block mb-1">วันสิ้นสุด (Optional)</label>
                            <input type="date" value={editingEvent.endDate || ''} onChange={(e) => setEditingEvent({...editingEvent, endDate: e.target.value})} className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none [color-scheme:dark]"/>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase block mb-1">เวลา</label>
                            <input type="text" value={editingEvent.time} onChange={(e) => setEditingEvent({...editingEvent, time: e.target.value})} className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"/>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase block mb-1">หมวดหมู่</label>
                            <select value={editingEvent.category} onChange={(e) => setEditingEvent({...editingEvent, category: e.target.value})} className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none">
                                <option value="Concert">Concert</option>
                                <option value="Music Festival">Music Festival</option>
                                <option value="Theater">Theater</option>
                                <option value="Festival">Festival</option>
                                <option value="Jazz">Jazz</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>
                    </div>
                    <textarea rows={3} placeholder="รายละเอียดงาน..." value={editingEvent.description} onChange={(e) => setEditingEvent({...editingEvent, description: e.target.value})} className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none resize-none"></textarea>

                    {/* 3. ✅ จัดการบัตรและราคา (Ticket Management) */}
                    <div className="bg-[#0B0F14] border border-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                             <h3 className="text-sm font-bold text-white flex items-center gap-2"><DollarSign size={16} className="text-green-500"/> จัดการบัตรและราคา (Tickets)</h3>
                             <button onClick={addTicket} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><PlusCircle size={14}/> เพิ่มโซน</button>
                        </div>
                        
                        <div className="space-y-2">
                             {/* หัวตาราง */}
                             {editingEvent.tickets?.length > 0 && (
                                 <div className="flex gap-2 text-[10px] text-gray-500 uppercase font-bold px-1">
                                     <span className="w-1/3">ชื่อโซน</span>
                                     <span className="w-1/4">ราคา</span>
                                     <span className="w-1/4">จำนวนที่นั่ง</span>
                                     <span className="w-6"></span>
                                 </div>
                             )}

                             {editingEvent.tickets?.map((ticket, index) => (
                                <div key={ticket.id} className="flex gap-2 items-center animate-in fade-in slide-in-from-left-2 duration-300">
                                    <input 
                                        type="text" 
                                        placeholder="ชื่อโซน" 
                                        value={ticket.zone} 
                                        onChange={(e) => updateTicket(index, 'zone', e.target.value)}
                                        className="w-1/3 bg-[#161B22] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="ราคา" 
                                        value={ticket.price} 
                                        onChange={(e) => updateTicket(index, 'price', parseInt(e.target.value))}
                                        className="w-1/4 bg-[#161B22] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                                    />
                                    <input 
                                        type="number" 
                                        placeholder="จำนวน" 
                                        value={ticket.totalSeats} 
                                        onChange={(e) => updateTicket(index, 'totalSeats', parseInt(e.target.value))}
                                        className="w-1/4 bg-[#161B22] border border-white/10 rounded px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none"
                                    />
                                    <button onClick={() => removeTicket(index)} className="text-red-500 hover:text-red-400 p-1"><MinusCircle size={16}/></button>
                                </div>
                             ))}
                             {(!editingEvent.tickets || editingEvent.tickets.length === 0) && (
                                 <p className="text-xs text-gray-500 text-center py-4 border border-dashed border-white/10 rounded">ยังไม่มีข้อมูลบัตร กดเพิ่มโซนด้านบน</p>
                             )}
                        </div>
                    </div>

                     {/* 4. Sales Settings */}
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="text-xs text-blue-400 font-bold uppercase block mb-1">วันเปิดขายบัตร (Sale Start)</label>
                            <div className="relative">
                                <CalendarClock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400"/>
                                <input 
                                    type="text" 
                                    placeholder="เช่น 05 Dec 2024, 10:00"
                                    value={editingEvent.saleStartDate || ''} 
                                    onChange={(e) => setEditingEvent({...editingEvent, saleStartDate: e.target.value})} 
                                    className="w-full bg-[#0B0F14] border border-blue-500/30 rounded pl-9 pr-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="text-xs text-gray-400 font-bold uppercase block mb-1">สถานะ</label>
                            <select 
                                value={editingEvent.approvalStatus} 
                                // ✅ ใส่ type assertion ให้ถูกต้อง
                                onChange={(e) => setEditingEvent({...editingEvent, approvalStatus: e.target.value as EventType["approvalStatus"]})}
                                className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="changes_requested">Changes Requested</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-white/10 bg-[#0B0F14] flex justify-end gap-3">
                    <button onClick={() => setEditingEvent(null)} className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors">ยกเลิก</button>
                    <button onClick={handleSaveEdit} className="px-6 py-2 rounded-lg text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-900/20 transition-all active:scale-95 flex items-center gap-2">
                        <Save size={16} /> บันทึกการแก้ไข
                    </button>
                </div>
            </div>
        </div>
      )}

    </div>
  );
}