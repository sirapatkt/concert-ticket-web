"use client";

import { useState, useEffect } from "react";
import { 
  CalendarDays, MapPin, Eye, Check, X, Search, Filter, 
  User, FileText, CreditCard, DollarSign, Clock, 
  RotateCcw, MessageSquare, Edit, Trash2, Save, ImageIcon,
  PlusCircle, MinusCircle, Tag, CalendarClock, Ticket 
} from "lucide-react";

// ✅ 1. Interface
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
  approvalStatus: "pending" | "approved" | "rejected" | "changes_requested" | "cancelled" | "ended"; 
  adminFeedback?: string; 
  paymentStatus: "paid" | "unpaid"; 
  publishDate: string;
  saleStartDate?: string;
  depositAmount: string;
  tickets: TicketType[];
  sold_tickets?: number;
  total_tickets?: number;
}

export default function EventsPage() {
  // ✅ เพิ่มตัวแปร isMounted เพื่อแก้ Hydration Error
  const [isMounted, setIsMounted] = useState(false);

  const [activeTab, setActiveTab] = useState<string>("action_required");
  
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventType | null>(null);

  const [events, setEvents] = useState<EventType[]>([]);
  
  const [selectedEventSales, setSelectedEventSales] = useState<any>(null);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);
  };

  useEffect(() => {
    // ✅ บอก Next.js ว่าโหลดฝั่ง Client เสร็จแล้ว
    setIsMounted(true);

    const fetchEvents = async () => {
      try {
        const res = await fetch('http://localhost:8000/api/admin/events', {
            headers: { "Accept": "application/json" }
        });
        
        if (res.ok) {
          let data = await res.json();

          try {
              const salesRes = await fetch('http://localhost:8000/api/admin/events-list');
              if (salesRes.ok) {
                  const salesData = await salesRes.json();
                  data = data.map((event: any) => {
                      const saleInfo = salesData.find((s: any) => s.id === event.id);
                      return {
                          ...event,
                          sold_tickets: saleInfo ? saleInfo.sold_tickets : 0,
                          total_tickets: saleInfo ? saleInfo.total_tickets : 0,
                      };
                  });
              }
          } catch (e) {
              console.error("Error merging sales data", e);
          }

          setEvents(data);
        }
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };
    fetchEvents();
  }, []);

  const handleViewDetails = async (event: EventType) => {
    setSelectedEvent(event);
    setSelectedEventSales(null); 
    try {
        const res = await fetch(`http://localhost:8000/api/admin/events/${event.id}/sales`);
        if (res.ok) {
            const data = await res.json();
            setSelectedEventSales(data);
        }
    } catch (error) {
        console.error("Error fetching event sales details:", error);
    }
  };

  const filteredEvents = events.filter((event) => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          event.organizer.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;

    const status = event.approvalStatus ? event.approvalStatus.toLowerCase() : "";
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const eventDate = new Date(event.endDate || event.date);

    // ✅ กลับมาใช้ "pending" ในการกรองข้อมูล เพื่อให้ดึงงานจาก Database ขึ้นมาได้ถูกต้อง
    if (activeTab === "action_required") return status === "pending";
    if (activeTab === "all") return true;
    if (activeTab === "pending") return status === "pending"; 
    
    if (activeTab === "published") {
        return status === "approved" && eventDate >= today;
    }
    
    if (activeTab === "ended") {
        return status === "ended" || (status === "approved" && eventDate < today);
    }
    
    if (activeTab === "cancelled") return status === "cancelled";

    return true;
  });

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

  // ✅ ป้องกัน Hydration Error โดยรอให้ Component Mount ก่อน
  if (!isMounted) {
    return null; 
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 text-white min-h-screen relative pb-10">
      
      {/* Header & Search */}
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

      {/* แถบตัวกรอง */}
      <div className="flex flex-wrap items-center gap-3 pb-4 border-b border-white/10">
        
        {/* แท็บ: งานที่ต้องจัดการ */}
        <button 
          onClick={() => setActiveTab("action_required")}
          className={`pb-1.5 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeTab === "action_required" ? "border-orange-500 text-orange-500" : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          งานที่ต้องจัดการ
          {/* ✅ กลับมานับจำนวนงานจากสถานะ "pending" */}
          {events.filter(e => e.approvalStatus === "pending").length > 0 && (
             <span className="bg-orange-500 text-white text-[10px] px-1.5 py-0.5 rounded-full">
                {events.filter(e => e.approvalStatus === "pending").length}
            </span>
          )}
        </button>

        {/* เส้นคั่นบางๆ (Divider) */}
        <div className="w-px h-5 bg-white/10 mx-1"></div>

        {/* ปุ่มสถานะขอบมน (Pills) */}
        {[
          { id: "all", label: "ทั้งหมด" },
          { id: "pending", label: "รออนุมัติ (กำลังเตรียม)" }, // ชื่อแสดงผลภาษาไทย
          { id: "published", label: "เปิดขาย/กำลังจัด" },
          { id: "ended", label: "สิ้นสุดแล้ว" },
          { id: "cancelled", label: "ยกเลิก" },
        ].map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveTab(filter.id)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border ${
              activeTab === filter.id 
                ? "bg-purple-600 text-white border-purple-500 shadow-md shadow-purple-900/30" 
                : "bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Events List */}
      <div className="grid gap-4">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const status = event.approvalStatus ? event.approvalStatus.toLowerCase() : "";
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const eventDate = new Date(event.endDate || event.date);
            
            const isEnded = status === 'ended' || (status === 'approved' && eventDate < today);
            const isPublished = status === 'approved' && eventDate >= today;

            return (
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

                {/* แถบ Progress ยอดขายในหน้าตาราง */}
                <div className="hidden lg:flex flex-col w-48 shrink-0 mr-4 bg-[#0B0F14] p-2 rounded-lg border border-white/5">
                    <div className="flex justify-between text-xs mb-1.5">
                        <span className="text-gray-400">ขายได้ <strong className="text-white">{event.sold_tickets || 0}</strong> / {event.total_tickets || 0}</span>
                        <span className="text-green-400 font-bold">{event.total_tickets ? Math.round(((event.sold_tickets || 0) / event.total_tickets) * 100) : 0}%</span>
                    </div>
                    <div className="w-full bg-white/5 h-1.5 rounded-full overflow-hidden shadow-inner">
                        <div 
                            className="bg-gradient-to-r from-green-500 to-green-400 h-full transition-all duration-700" 
                            style={{ width: `${event.total_tickets ? ((event.sold_tickets || 0) / event.total_tickets) * 100 : 0}%` }}
                        ></div>
                    </div>
                </div>
                
                <div className="flex items-center gap-4 self-end md:self-center">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    isPublished ? 'bg-green-500/10 text-green-400 border-green-500/20' :
                    isEnded ? 'bg-purple-500/10 text-purple-400 border-purple-500/20' :
                    status === 'pending' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : 
                    status === 'changes_requested' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20' :
                    status === 'cancelled' ? 'bg-gray-500/10 text-gray-400 border-gray-500/20' :
                    'bg-red-500/10 text-red-400 border-red-500/20'
                  }`}>
                    {/* ✅ แก้ไขข้อความในการ์ดให้เป็นภาษาไทยตามที่คุณต้องการ */}
                    {isPublished ? 'เปิดขาย/กำลังจัด' : 
                     isEnded ? 'สิ้นสุดแล้ว' : 
                     status === 'pending' ? 'รออนุมัติ (กำลังเตรียม)' : 
                     status === 'changes_requested' ? 'ส่งแก้ไข' : 
                     status === 'cancelled' ? 'ยกเลิก' : 
                     'ไม่อนุมัติ'}
                  </span>

                  <div className="flex gap-2">
                    <button onClick={() => handleViewDetails(event)} className="p-2 bg-gray-800 text-gray-400 rounded-lg hover:bg-white hover:text-black transition-colors" title="ดูรายละเอียด">
                      <Eye size={18} />
                    </button>

                    {status === 'pending' ? (
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
                          <button onClick={() => handleDelete(event.id, status)} className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500 hover:text-white border border-red-500/20" title="ลบ/ยกเลิก">
                              <Trash2 size={18}/>
                          </button>
                        </>
                    )}
                  </div>
                </div>
              </div>
            );
          })
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
                        <div className={`px-4 py-1.5 rounded-full text-sm font-bold border shadow-lg ${
                            (() => {
                              const s = selectedEvent.approvalStatus?.toLowerCase();
                              const eventDate = new Date(selectedEvent.endDate || selectedEvent.date);
                              const today = new Date();
                              today.setHours(0,0,0,0);
                              const ended = s === 'ended' || (s === 'approved' && eventDate < today);
                              const published = s === 'approved' && eventDate >= today;

                              if (published) return 'bg-green-500 text-black border-green-400';
                              if (ended) return 'bg-purple-500 text-white border-purple-400';
                              if (s === 'pending') return 'bg-orange-500 text-white border-orange-400';
                              return 'bg-red-500 text-white border-red-400';
                            })()
                        }`}>
                            {(() => {
                              const s = selectedEvent.approvalStatus?.toLowerCase();
                              const eventDate = new Date(selectedEvent.endDate || selectedEvent.date);
                              const today = new Date();
                              today.setHours(0,0,0,0);
                              if (s === 'ended' || (s === 'approved' && eventDate < today)) return "สิ้นสุดแล้ว";
                              if (s === 'approved' && eventDate >= today) return "เปิดขาย/กำลังจัด";
                              if (s === 'pending') return "รออนุมัติ (กำลังเตรียม)"; 
                              return s.toUpperCase();
                            })()}
                        </div>
                      </div>
                  </div>
              </div>

              <div className="p-6 overflow-y-auto space-y-6 custom-scrollbar">
                  
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

                  <div>
                      <h3 className="text-sm font-bold text-gray-300 mb-2 flex items-center gap-2">
                        <FileText size={16}/> รายละเอียด
                      </h3>
                      <div className="text-gray-400 text-sm bg-[#0B0F14] p-4 rounded-xl border border-white/5 leading-relaxed whitespace-pre-line">
                        {selectedEvent.description || "ไม่มีรายละเอียดระบุ"}
                      </div>
                  </div>

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

                  {selectedEventSales && selectedEventSales.zones && selectedEventSales.zones.length > 0 && (
                      <div className="mt-6 border-t border-white/10 pt-6">
                          <h3 className="text-sm font-bold text-green-400 mb-3 flex items-center gap-2">
                              <DollarSign size={16}/> รายงานยอดขายรายโซน (Real-time)
                          </h3>
                          <div className="grid grid-cols-1 gap-3">
                              {selectedEventSales.zones.map((zone: any, idx: number) => (
                                  <div key={idx} className="bg-gradient-to-r from-[#0B0F14] to-[#161B22] p-4 rounded-xl flex justify-between items-center border border-white/5 shadow-md">
                                      <div>
                                          <p className="text-blue-400 font-bold">{zone.zone_name}</p>
                                          <p className="text-xs text-gray-400 mt-1">ราคา {formatCurrency(zone.price)}</p>
                                      </div>
                                      <div className="text-right">
                                          <p className="text-white font-mono text-sm">{zone.sold} <span className="text-gray-500">/ {zone.capacity} ใบ</span></p>
                                          <p className="text-xs text-green-400 mt-1">รายได้ {formatCurrency(zone.revenue)}</p>
                                      </div>
                                  </div>
                              ))}
                          </div>
                          <div className="mt-4 p-4 bg-green-500/10 border border-green-500/20 rounded-xl flex justify-between items-center shadow-lg">
                              <span className="font-bold text-green-400 text-sm">ยอดขายรวมเฉพาะค่าตั๋ว:</span>
                              <span className="text-2xl font-black text-white">{formatCurrency(selectedEventSales.total_revenue)}</span>
                          </div>
                      </div>
                  )}

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
                
                <div className="px-6 py-4 border-b border-white/10 flex justify-between items-center bg-[#0B0F14]">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Edit size={20} className="text-blue-500"/> แก้ไขข้อมูลอีเวนต์
                    </h2>
                    <button onClick={() => setEditingEvent(null)} className="text-gray-400 hover:text-white"><X size={24} /></button>
                </div>

                <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
                    
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

                    <div className="bg-[#0B0F14] border border-white/10 rounded-xl p-4 space-y-3">
                        <div className="flex justify-between items-center border-b border-white/10 pb-2">
                             <h3 className="text-sm font-bold text-white flex items-center gap-2"><DollarSign size={16} className="text-green-500"/> จัดการบัตรและราคา (Tickets)</h3>
                             <button onClick={addTicket} className="text-xs text-blue-400 hover:text-blue-300 flex items-center gap-1"><PlusCircle size={14}/> เพิ่มโซน</button>
                        </div>
                        
                        <div className="space-y-2">
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
                                onChange={(e) => setEditingEvent({...editingEvent, approvalStatus: e.target.value as EventType["approvalStatus"]})}
                                className="w-full bg-[#0B0F14] border border-white/10 rounded px-3 py-2 text-sm text-white focus:border-blue-500 focus:outline-none"
                            >
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                                <option value="changes_requested">Changes Requested</option>
                                <option value="cancelled">Cancelled</option>
                                <option value="ended">Ended</option>
                            </select>
                        </div>
                    </div>
                </div>

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