/* eslint-disable */
"use client";

import { useState, useEffect } from "react";
import { 
  Search, 
  MessageSquareWarning, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  MessageCircle,
  Trash2,
  RefreshCcw,
  X,
  Send
} from "lucide-react";

// --- Mock Data ---
const initialTickets: any[] = [
  {
    id: "TK-1024",
    user: "Somchai Jai-dee",
    email: "somchai@gmail.com",
    category: "Payment",
    subject: "โอนเงินแล้วแต่สถานะยังไม่เปลี่ยน",
    priority: "High",
    status: "Pending",
    date: "10 Feb 2026, 10:30",
    avatar: "S"
  },
  {
    id: "TK-1023",
    user: "Kanda J.",
    email: "kanda@hotmail.com",
    category: "Account",
    subject: "เข้าสู่ระบบไม่ได้ ลืมรหัสผ่าน",
    priority: "Medium",
    status: "In Progress",
    date: "09 Feb 2026, 15:45",
    avatar: "K"
  },
  {
    id: "TK-1022",
    user: "John Doe",
    email: "john.d@gmail.com",
    category: "Bug Report",
    subject: "กดจองบัตรแล้วหน้าเว็บค้าง",
    priority: "High",
    status: "Resolved",
    date: "08 Feb 2026, 09:20",
    avatar: "J"
  },
  {
    id: "TK-1021",
    user: "Alice Wonderland",
    email: "alice@yahoo.com",
    category: "General",
    subject: "สอบถามรายละเอียดงาน Big Mountain",
    priority: "Low",
    status: "Pending",
    date: "08 Feb 2026, 08:00",
    avatar: "A"
  },
  {
    id: "TK-1020",
    user: "Bobby Rock",
    email: "bob@music.com",
    category: "Refund",
    subject: "ขอยกเลิกบัตรและขอคืนเงิน",
    priority: "Medium",
    status: "Resolved",
    date: "07 Feb 2026, 18:30",
    avatar: "B"
  }
];

export default function SupportPage() {
  const [tickets, setTickets] = useState<any[]>(initialTickets);
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchTerm, setSearchTerm] = useState<string>("");

  // ✅ State สำหรับ Modal ตอบกลับ
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [currentTicket, setCurrentTicket] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState("");

  // Load Data
  useEffect(() => {
    const savedTickets = localStorage.getItem('beatpass_tickets');
    if (savedTickets) {
      try {
        const parsedData = JSON.parse(savedTickets);
        if (Array.isArray(parsedData)) {
            setTickets((prev: any[]) => {
                const newUniqueTickets = parsedData.filter(
                    (newT: any) => !prev.some((oldT: any) => oldT.id === newT.id)
                );
                return [...newUniqueTickets, ...prev];
            });
        }
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }, []);

  // Update & Save Helper
  const saveToStorage = (newTickets: any[]) => {
      setTickets(newTickets);
      localStorage.setItem('beatpass_tickets', JSON.stringify(newTickets));
  };

  // 1. Resolve Action
  const handleResolve = (id: string) => {
    if(confirm("ยืนยันเปลี่ยนสถานะเป็น 'เสร็จสิ้น' (Resolved)?")) {
      const updated = tickets.map((t: any) => t.id === id ? { ...t, status: "Resolved" } : t);
      saveToStorage(updated);
    }
  };

  // 2. Delete Action
  const handleDelete = (id: string) => {
    if(confirm("ยืนยันการลบรายการนี้?")) {
      const remaining = tickets.filter((t: any) => t.id !== id);
      saveToStorage(remaining);
    }
  };

  // ✅ 3. Open Reply Modal (เปิดหน้าต่างตอบกลับ)
  const openReplyModal = (ticket: any) => {
    setCurrentTicket(ticket);
    setReplyMessage(""); // ล้างข้อความเก่า
    setIsReplyOpen(true);
  };

  // ✅ 4. Send Reply Action (กดส่งข้อความ)
  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    
    // จำลองการส่ง (Simulate Sending)
    setTimeout(() => {
        // อัปเดตสถานะเป็น "In Progress" อัตโนมัติ เพราะเราตอบแล้ว
        const updated = tickets.map((t: any) => 
            t.id === currentTicket.id ? { ...t, status: "In Progress" } : t
        );
        saveToStorage(updated);
        
        setIsReplyOpen(false);
        alert(`ตอบกลับคุณ ${currentTicket.user} เรียบร้อยแล้ว!`);
    }, 500);
  };

  // 5. Reset Data
  const handleResetData = () => {
      if(confirm("รีเซ็ตข้อมูลทั้งหมด?")) {
          localStorage.removeItem('beatpass_tickets');
          setTickets(initialTickets);
          window.location.reload();
      }
  }

  // Filter Logic
  const filteredTickets = tickets.filter((ticket: any) => {
    const searchLower = searchTerm.toLowerCase();
    const matchesSearch = 
      ticket.subject.toLowerCase().includes(searchLower) || 
      ticket.user.toLowerCase().includes(searchLower) ||
      ticket.id.toLowerCase().includes(searchLower);
    
    const matchesFilter = filterStatus === "All" ? true : ticket.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans animate-in fade-in duration-500 relative">
      
      {/* Header */}
      <div className="mb-8 flex justify-between items-end">
        <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquareWarning className="text-red-500" /> รับแจ้งปัญหา (Support Tickets)
            </h1>
            <p className="text-gray-400 text-sm mt-1">จัดการคำร้องเรียนและช่วยเหลือผู้ใช้งาน</p>
        </div>
        <button onClick={handleResetData} className="text-xs text-gray-500 hover:text-red-400 flex items-center gap-1 transition-colors">
            <RefreshCcw size={12}/> รีเซ็ตข้อมูล
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-[#161B22] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-yellow-500/10 rounded-full text-yellow-500"><Clock size={24}/></div>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase">รอการตอบกลับ</p>
            <h2 className="text-2xl font-black text-white">{tickets.filter((t: any) => t.status === 'Pending').length}</h2>
          </div>
        </div>
        <div className="bg-[#161B22] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><AlertCircle size={24}/></div>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase">กำลังดำเนินการ</p>
            <h2 className="text-2xl font-black text-blue-400">{tickets.filter((t: any) => t.status === 'In Progress').length}</h2>
          </div>
        </div>
        <div className="bg-[#161B22] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
          <div className="p-3 bg-green-500/10 rounded-full text-green-500"><CheckCircle2 size={24}/></div>
          <div>
            <p className="text-gray-400 text-xs font-bold uppercase">แก้ไขเสร็จสิ้น</p>
            <h2 className="text-2xl font-black text-green-400">{tickets.filter((t: any) => t.status === 'Resolved').length}</h2>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-[#161B22] p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input 
            type="text" placeholder="ค้นหา Ticket ID, ชื่อผู้ใช้, หรือหัวข้อ..." 
            className="w-full bg-[#0B0F14] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-red-500 transition-colors placeholder:text-gray-600"
            value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2 bg-[#0B0F14] p-1 rounded-lg border border-white/5 overflow-x-auto">
           {['All', 'Pending', 'In Progress', 'Resolved'].map((status) => (
             <button key={status} onClick={() => setFilterStatus(status)} 
                className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase whitespace-nowrap transition-all ${filterStatus === status ? 'bg-red-600 text-white shadow-lg' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
               {status}
             </button>
           ))}
        </div>
      </div>

      {/* Ticket Table */}
      <div className="bg-[#161B22] border border-white/5 rounded-2xl overflow-hidden shadow-xl min-h-[400px]">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0B0F14] text-gray-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4 pl-6">Ticket Info</th>
              <th className="p-4">ผู้แจ้ง (User)</th>
              <th className="p-4 text-center">ความสำคัญ</th>
              <th className="p-4 text-center">สถานะ</th>
              <th className="p-4 text-right pr-6">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filteredTickets.length > 0 ? filteredTickets.map((ticket: any) => (
              <tr key={ticket.id} className="hover:bg-white/[0.02] transition-colors group">
                <td className="p-4 pl-6 max-w-xs">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-mono text-gray-500 mb-1">{ticket.id} • {ticket.category}</span>
                        <p className="font-bold text-white text-base truncate pr-4">{ticket.subject}</p>
                        <p className="text-gray-500 text-xs mt-1 flex items-center gap-1"><Clock size={10}/> {ticket.date}</p>
                    </div>
                </td>
                <td className="p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-700 to-gray-800 flex items-center justify-center text-white text-xs font-bold border border-white/10">{ticket.avatar}</div>
                        <div>
                            <p className="font-medium text-gray-200">{ticket.user}</p>
                            <p className="text-gray-500 text-xs">{ticket.email}</p>
                        </div>
                    </div>
                </td>
                <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase border ${
                        ticket.priority === 'High' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 
                        ticket.priority === 'Medium' ? 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20' : 
                        'text-blue-400 bg-blue-500/10 border-blue-500/20'
                    }`}>{ticket.priority}</span>
                </td>
                <td className="p-4 text-center">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                        ticket.status === 'Resolved' ? 'text-green-400 bg-green-500/10 border-green-500/20' : 
                        ticket.status === 'In Progress' ? 'text-blue-400 bg-blue-500/10 border-blue-500/20' : 
                        'text-yellow-400 bg-yellow-500/10 border-yellow-500/20'
                    }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'Resolved' ? 'bg-green-400' : ticket.status === 'In Progress' ? 'bg-blue-400' : 'bg-yellow-400 animate-pulse'}`}></span>
                        {ticket.status}
                    </span>
                </td>
                <td className="p-4 text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                        {/* ปุ่มเปิด Modal Reply */}
                        <button onClick={() => openReplyModal(ticket)} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors" title="ตอบกลับ">
                            <MessageCircle size={16} />
                        </button>
                        {ticket.status !== 'Resolved' && (
                            <button onClick={() => handleResolve(ticket.id)} className="p-2 rounded-lg bg-green-500/10 hover:bg-green-500/20 text-green-400 hover:text-green-300 transition-colors border border-green-500/20" title="เสร็จสิ้นงาน">
                                <CheckCircle2 size={16} />
                            </button>
                        )}
                        <button onClick={() => handleDelete(ticket.id)} className="p-2 rounded-lg bg-white/5 hover:bg-red-500/20 text-gray-500 hover:text-red-500 transition-colors" title="ลบรายการ">
                            <Trash2 size={16} />
                        </button>
                    </div>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan={5} className="p-12 text-center text-gray-500">
                        <div className="flex flex-col items-center gap-3">
                            <MessageSquareWarning size={48} className="opacity-20"/>
                            <p>ไม่พบรายการแจ้งปัญหา</p>
                        </div>
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ✅ REPLY MODAL (หน้าต่างตอบกลับ) */}
      {isReplyOpen && currentTicket && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
            <div className="bg-[#161B22] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl p-6 relative">
                
                {/* Close Button */}
                <button onClick={() => setIsReplyOpen(false)} className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors">
                    <X size={20} />
                </button>

                {/* Modal Header */}
                <h3 className="text-xl font-bold mb-1 flex items-center gap-2">
                    <Send className="text-red-500" size={20}/> ตอบกลับผู้ใช้งาน
                </h3>
                <p className="text-sm text-gray-400 mb-6">
                    กำลังตอบกลับคุณ <span className="text-white font-bold">{currentTicket.user}</span> (Ticket: {currentTicket.id})
                </p>

                {/* Reply Form */}
                <form onSubmit={handleSendReply}>
                    <div className="mb-4">
                        <label className="block text-xs font-bold text-gray-400 uppercase mb-2">ข้อความตอบกลับ</label>
                        <textarea 
                            autoFocus
                            rows={5}
                            className="w-full bg-[#0B0F14] border border-white/10 rounded-xl p-4 text-sm text-white focus:outline-none focus:border-red-500 transition-colors resize-none placeholder:text-gray-700"
                            placeholder="พิมพ์ข้อความที่นี่..."
                            value={replyMessage}
                            onChange={(e) => setReplyMessage(e.target.value)}
                            required
                        ></textarea>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button 
                            type="button" 
                            onClick={() => setIsReplyOpen(false)}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            ยกเลิก
                        </button>
                        <button 
                            type="submit"
                            className="px-6 py-2 rounded-lg text-sm font-bold bg-red-600 text-white hover:bg-red-500 shadow-lg shadow-red-900/20 transition-all active:scale-95"
                        >
                            ส่งข้อความ
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}

    </div>
  );
}