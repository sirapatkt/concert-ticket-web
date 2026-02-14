"use client";

import { useState } from "react";
import { 
  Search, User, Ban, CheckCircle, 
  Mail, Calendar, Download, X, Phone, Ticket, 
  Eye, ShoppingBag, Unlock, Clock, MapPin, Send 
} from "lucide-react";

// --- Interface ---
interface OrderType {
  id: string;
  event: string;
  seat: string;
  price: number;
  date: string;
  time: string;
  venue: string;
  status: string;
  poster: string;
}

interface UserType {
  id: number;
  name: string;
  email: string;
  role: string;
  status: string;
  joined: string;
  spent: number;
  avatar: string;
  phone?: string;
  birthDate?: string;
  orders?: OrderType[];
}

// --- ✅ Mock Data: เหลือไว้ 1 ตัวอย่าง เพื่อเป็น Template โครงสร้างข้อมูล ---
const initialUsers: UserType[] = [
  { 
    id: 1, 
    name: "Somchai Jai-dee", 
    email: "somchai@gmail.com", 
    role: "Member", 
    status: "Active", 
    joined: "12 Jan 2024", 
    spent: 4500, 
    avatar: "S", 
    phone: "081-111-1111", 
    birthDate: "15 Aug 1995",
    orders: [
       { 
         id: "ORD-8821", 
         event: "Jeff Satur Space Shuttle", 
         seat: "A1 / U7", 
         price: 2500, 
         date: "15 Jan 2026", 
         time: "19:00", 
         venue: "UOB Live, Emsphere", 
         status: "Paid",
         poster: "https://thestandard.co/wp-content/uploads/2024/01/Jeff-Satur-Space-Shuttle-No.8-Asia-Tour.jpg"
       },
       { 
         id: "ORD-7742", 
         event: "Big Mountain 14", 
         seat: "VIP", 
         price: 2000, 
         date: "10 Dec 2025", 
         time: "12:00", 
         venue: "The Ocean Khao Yai", 
         status: "Used", 
         poster: "https://s.isanook.com/jo/0/ud/489/2446729/bmmf13.jpg"
       }
    ]
  }
];

export default function UsersPage() {
  const [users, setUsers] = useState<UserType[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<OrderType | null>(null);

  const members = users.filter(acc => acc.role === "Member");

  const filteredMembers = members.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "All" ? true : user.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const toggleStatus = (id: number) => {
    if(confirm(`ยืนยันเปลี่ยนสถานะ?`)) {
       setUsers(prev => prev.map(u => u.id === id ? { ...u, status: u.status === "Active" ? "Banned" : "Active" } : u));
       if (selectedUser?.id === id) {
           setSelectedUser(prev => prev ? { ...prev, status: prev.status === "Active" ? "Banned" : "Active" } : null);
       }
    }
  };

  // ✅ ฟังก์ชันจำลองการส่งเมล
  const handleResendEmail = () => {
      alert(`✅ ระบบได้ส่ง E-Ticket ไปยังอีเมลของลูกค้าแล้ว!`);
  };

  const handleExport = () => {
    const header = "ID,Name,Email,Phone,Role,Status,Joined Date,Total Spent\n";
    const rows = filteredMembers.map(u => `${u.id},"${u.name}",${u.email},"${u.phone || '-'}",${u.role},${u.status},${u.joined},${u.spent}`).join("\n");
    const csvContent = "\uFEFF" + header + rows;
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `beatpass_members_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8 min-h-screen bg-[#0B0F14] text-white space-y-8 font-sans animate-in fade-in duration-500">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <User className="text-blue-500" /> จัดการลูกค้า (Members)
          </h1>
          <p className="text-gray-400 text-sm mt-1">รายชื่อลูกค้าทั่วไปที่สมัครสมาชิกเพื่อซื้อบัตร</p>
        </div>
        <button onClick={handleExport} className="flex items-center gap-2 bg-[#161B22] border border-white/10 px-4 py-2 rounded-lg text-sm hover:bg-white/5 transition-colors text-gray-300 hover:text-white active:scale-95">
            <Download size={16}/> Export CSV
        </button>
      </div>

      {/* Stats Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#161B22] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><User size={24}/></div>
            <div><p className="text-gray-400 text-xs font-bold uppercase">ลูกค้าทั้งหมด</p><h2 className="text-2xl font-black text-white">{members.length}</h2></div>
        </div>
        <div className="bg-[#161B22] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-green-500/10 rounded-full text-green-500"><CheckCircle size={24}/></div>
            <div><p className="text-gray-400 text-xs font-bold uppercase">สถานะปกติ</p><h2 className="text-2xl font-black text-green-400">{members.filter(u => u.status === 'Active').length}</h2></div>
        </div>
        <div className="bg-[#161B22] p-6 rounded-2xl border border-white/5 flex items-center gap-4">
            <div className="p-3 bg-red-500/10 rounded-full text-red-500"><Ban size={24}/></div>
            <div><p className="text-gray-400 text-xs font-bold uppercase">ถูกระงับบัญชี</p><h2 className="text-2xl font-black text-red-400">{members.filter(u => u.status === 'Banned').length}</h2></div>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-[#161B22] p-4 rounded-xl border border-white/5 flex flex-col md:flex-row gap-4 justify-between">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
          <input type="text" placeholder="ค้นหาลูกค้า..." className="w-full bg-[#0B0F14] border border-white/10 rounded-lg pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
        <div className="flex gap-2 bg-[#0B0F14] p-1 rounded-lg border border-white/5 w-fit">
           {['All', 'Active', 'Banned'].map((status) => (
             <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-1.5 rounded-md text-xs font-bold uppercase transition-all ${filterStatus === status ? 'bg-white/10 text-white shadow-sm' : 'text-gray-500 hover:text-gray-300'}`}>{status}</button>
           ))}
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-[#161B22] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
        <table className="w-full text-left border-collapse">
          <thead className="bg-[#0B0F14] text-gray-400 text-xs uppercase font-bold tracking-wider">
            <tr>
              <th className="p-4 pl-6">ลูกค้า (Member Info)</th>
              <th className="p-4">วันที่สมัคร</th>
              <th className="p-4 text-right">ยอดซื้อสะสม</th>
              <th className="p-4 text-center">สถานะ</th>
              <th className="p-4 text-right pr-6">จัดการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-sm">
            {filteredMembers.map((user) => (
              <tr key={user.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer" onClick={() => setSelectedUser(user)}>
                <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-sm shadow-lg">{user.avatar}</div>
                        <div>
                            <p className="font-bold text-white group-hover:text-blue-400 transition-colors">{user.name}</p>
                            <div className="flex items-center gap-1.5 text-gray-500 text-xs"><Mail size={10}/> {user.email}</div>
                        </div>
                    </div>
                </td>
                <td className="p-4 text-gray-400"><div className="flex items-center gap-2"><Calendar size={14} className="text-gray-600"/> {user.joined}</div></td>
                <td className="p-4 text-right font-mono text-white">฿{user.spent.toLocaleString()}</td>
                <td className="p-4 text-center">
                    {user.status === 'Active' ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-500 text-xs font-bold border border-green-500/20"><span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span> Active</span> : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-bold border border-red-500/20"><Ban size={12}/> Banned</span>}
                </td>
                <td className="p-4 text-right pr-6">
                    <button onClick={(e) => { e.stopPropagation(); toggleStatus(user.id); }} className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border flex items-center gap-1 ml-auto ${user.status === 'Active' ? 'border-red-500/20 text-red-400 hover:bg-red-500/10' : 'border-green-500/20 text-green-400 hover:bg-green-500/10'}`}>
                        {user.status === 'Active' ? <><Ban size={14}/> ระงับบัญชี</> : <><CheckCircle size={14}/> ปลดแบน</>}
                    </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMembers.length === 0 && <div className="p-12 text-center text-gray-500 flex flex-col items-center"><Search size={48} className="opacity-20 mb-4"/><p>ไม่พบข้อมูลลูกค้าที่ค้นหา</p></div>}
      </div>

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="absolute inset-0" onClick={() => setSelectedUser(null)}></div>
           <div className="relative bg-[#161B22] w-full max-w-2xl rounded-2xl border border-white/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto custom-scrollbar">
               
               {/* Header */}
               <div className="p-6 border-b border-white/10 flex justify-between items-start bg-[#0B0F14] sticky top-0 z-10">
                   <div className="flex gap-4">
                       <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg shrink-0">{selectedUser.avatar}</div>
                       <div>
                           <h2 className="text-xl font-bold text-white flex items-center gap-2">{selectedUser.name}{selectedUser.status === 'Banned' && <span className="text-xs bg-red-500 text-white px-2 py-0.5 rounded">BANNED</span>}</h2>
                           <p className="text-gray-400 text-sm flex items-center gap-2 mt-1"><Mail size={14}/> {selectedUser.email}</p>
                           <div className="flex gap-4 mt-2 text-xs text-gray-500">
                               <p className="flex items-center gap-1"><Phone size={12}/> {selectedUser.phone || "-"}</p>
                               <p className="flex items-center gap-1"><Calendar size={12}/> {selectedUser.birthDate || "-"}</p>
                           </div>
                       </div>
                   </div>
                   <button onClick={() => setSelectedUser(null)} className="p-2 bg-white/5 rounded-full hover:bg-white/10 text-gray-400 hover:text-white transition-colors"><X size={20}/></button>
               </div>

               {/* Action Bar */}
               <div className="px-6 py-3 bg-[#1C2128] border-b border-white/5 flex gap-3 justify-end">
                   <button onClick={() => toggleStatus(selectedUser.id)} className={`flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-medium transition-colors ${selectedUser.status === 'Active' ? 'bg-red-500/10 border-red-500/20 text-red-400 hover:bg-red-500 hover:text-white' : 'bg-green-500/10 border-green-500/20 text-green-400 hover:bg-green-500 hover:text-white'}`}>
                       {selectedUser.status === 'Active' ? <><Ban size={14}/> ระงับบัญชี</> : <><Unlock size={14}/> ปลดแบน</>}
                   </button>
               </div>

               {/* Order History */}
               <div className="p-6">
                   <h3 className="font-bold text-white mb-4 flex items-center gap-2"><Ticket size={18} className="text-pink-500"/> ประวัติการสั่งซื้อ (Order History)</h3>
                   <div className="bg-[#0B0F14] border border-white/5 rounded-xl overflow-hidden">
                       <table className="w-full text-sm text-left">
                           <thead className="bg-white/5 text-gray-400 text-xs uppercase">
                               <tr>
                                   <th className="p-3 pl-4">วันที่</th>
                                   <th className="p-3">ชื่องาน</th>
                                   <th className="p-3">ที่นั่ง</th>
                                   <th className="p-3 text-right">ราคา</th>
                                   <th className="p-3 text-center">สถานะ</th>
                                   <th className="p-3 text-right"></th>
                               </tr>
                           </thead>
                           <tbody className="divide-y divide-white/5">
                               {selectedUser.orders && selectedUser.orders.length > 0 ? (
                                   selectedUser.orders.map((order) => (
                                       <tr key={order.id} className="group hover:bg-white/5 transition-colors">
                                           <td className="p-3 pl-4 text-gray-400 text-xs">{order.date}</td>
                                           <td className="p-3 text-white font-medium">{order.event}</td>
                                           <td className="p-3 font-mono text-xs text-yellow-500 bg-white/5 px-2 py-0.5 rounded w-fit">{order.seat}</td>
                                           <td className="p-3 text-right font-mono">฿{order.price.toLocaleString()}</td>
                                           <td className="p-3 text-center">
                                               <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${order.status === 'Paid' ? 'text-green-400 bg-green-500/10 border-green-500/20' : order.status === 'Used' ? 'text-gray-400 bg-gray-500/10 border-gray-500/20' : 'text-red-400'}`}>{order.status}</span>
                                           </td>
                                           <td className="p-3 text-right">
                                               <button onClick={() => setSelectedTicket(order)} className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded" title="ดู E-Ticket"><Eye size={16}/></button>
                                           </td>
                                       </tr>
                                   ))
                               ) : (
                                   <tr><td colSpan={6} className="p-8 text-center text-gray-500"><ShoppingBag size={32} className="mx-auto mb-2 opacity-20"/>ไม่พบประวัติการสั่งซื้อ</td></tr>
                               )}
                           </tbody>
                       </table>
                       <div className="p-3 bg-white/5 border-t border-white/5 flex justify-between items-center text-sm px-6">
                           <span className="text-gray-400">ยอดซื้อสะสมทั้งหมด</span>
                           <span className="font-bold text-lg text-green-400">฿{selectedUser.spent.toLocaleString()}</span>
                       </div>
                   </div>
               </div>
           </div>
        </div>
      )}

      {/* ✅ E-TICKET MODAL (Admin View) - Integrated */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
          <div className="absolute inset-0" onClick={() => setSelectedTicket(null)}></div>
          
          <div className="relative w-full max-w-sm bg-[#1C2128] rounded-3xl overflow-hidden shadow-2xl border border-white/10">
            {/* Poster Header */}
            <div className="relative h-48 bg-gray-800">
              {selectedTicket.poster ? (
                  <img src={selectedTicket.poster} alt="Poster" className="w-full h-full object-cover opacity-80" />
              ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-800"><Ticket size={48} className="opacity-20"/></div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-[#1C2128] via-transparent to-transparent"></div>
              <button onClick={() => setSelectedTicket(null)} className="absolute top-4 right-4 bg-black/50 hover:bg-white text-white hover:text-black p-2 rounded-full backdrop-blur-md transition-all"><X size={18} /></button>
              <div className="absolute top-4 left-4 px-3 py-1 bg-green-500 text-black text-xs font-black uppercase rounded-full shadow-lg tracking-wider">{selectedTicket.status === 'Paid' ? 'Ready to Use' : 'Used'}</div>
            </div>

            {/* Content */}
            <div className="px-6 py-4 -mt-12 relative z-10">
              <h2 className="text-xl font-black leading-tight text-white mb-4 drop-shadow-md">{selectedTicket.event}</h2>
              <div className="space-y-3 bg-[#0B0F14] p-4 rounded-xl border border-white/5">
                <div className="flex items-center gap-3 text-sm text-gray-300"><Calendar size={16} className="text-blue-500" /><span>{selectedTicket.date}</span></div>
                <div className="flex items-center gap-3 text-sm text-gray-300"><Clock size={16} className="text-blue-500" /><span>{selectedTicket.time || "18:00"}</span></div>
                <div className="flex items-center gap-3 text-sm text-gray-300"><MapPin size={16} className="text-red-500" /><span>{selectedTicket.venue || "TBA"}</span></div>
              </div>

              <div className="mt-4 flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                <div><p className="text-[10px] text-gray-500 uppercase font-bold">Zone / Seat</p><p className="text-2xl font-black text-yellow-400">{selectedTicket.seat}</p></div>
                <div className="text-right"><p className="text-[10px] text-gray-500 uppercase font-bold">Order ID</p><p className="text-sm font-mono text-gray-300">{selectedTicket.id}</p></div>
              </div>

              {/* Dashed Line */}
              <div className="relative my-6 h-px w-full bg-white/10">
                <div className="absolute -left-8 -top-3 w-6 h-6 bg-[#0B0F14] rounded-full"></div>
                <div className="absolute -right-8 -top-3 w-6 h-6 bg-[#0B0F14] rounded-full"></div>
              </div>

              {/* QR Code */}
              <div className="text-center pb-4">
                <div className="bg-white p-2 rounded-xl inline-block mx-auto mb-3 shadow-lg shadow-white/5">
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${selectedTicket.id}`} alt="QR Code" className="w-32 h-32 opacity-90 mix-blend-multiply" />
                </div>
                <p className="text-[10px] text-gray-500 uppercase tracking-widest animate-pulse">Scan to enter</p>
              </div>

              {/* Footer Actions (Resend Email) */}
              <div className="grid grid-cols-1 gap-3 mt-2">
                <button 
                    onClick={handleResendEmail} 
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 text-xs font-bold transition-colors border border-blue-600/30"
                >
                    <Send size={14} /> ส่งอีเมล E-Ticket ซ้ำให้ลูกค้า (Resend Email)
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}