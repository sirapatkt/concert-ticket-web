"use client";

import { useState } from "react";
import { 
  CreditCard, DollarSign, ArrowUpRight, Clock, CheckCircle, 
  Search, Calendar, Filter, FileText, XCircle, Eye 
} from "lucide-react";

// --- Mock Data: ข้อมูลเริ่มต้น ---
const initialPayouts = [
  { id: 1, organizer: "GMM Grammy", event: "Jeff Satur Concert", amount: 1500000, bank: "KBANK •••• 8829", date: "10 นาทีที่แล้ว", status: "Pending" },
  { id: 2, organizer: "RS Group", event: "Kamikaze Party", amount: 500000, bank: "SCB •••• 1234", date: "2 ชั่วโมงที่แล้ว", status: "Completed" },
  { id: 3, organizer: "What The Duck", event: "Indie Night", amount: 300000, bank: "BBL •••• 5678", date: "1 วันที่แล้ว", status: "Pending" },
];

const initialTransactions = [
  { id: "ORD-8821", user: "สมชาย ใจดี", event: "Jeff Satur Concert", method: "บัตรเครดิต", amount: 2500, status: "Success", date: "18/01/2026 10:30" },
  { id: "ORD-8822", user: "อลิซ วงศ์", event: "Jeff Satur Concert", method: "PromptPay", amount: 4500, status: "Success", date: "18/01/2026 10:35" },
  { id: "ORD-8823", user: "จอห์น โด", event: "Kamikaze Party", method: "TrueMoney", amount: 3500, status: "Failed", date: "18/01/2026 11:00" },
  { id: "ORD-8824", user: "ณเดชน์ ค.", event: "The Boyz Tour", method: "บัตรเครดิต", amount: 5500, status: "Success", date: "17/01/2026 14:20" },
];

export default function FinancePage() {
  const [activeTab, setActiveTab] = useState<"payouts" | "orders">("payouts");
  const [payoutList, setPayoutList] = useState(initialPayouts);
  const [searchTerm, setSearchTerm] = useState("");

  // ฟังก์ชันจัดรูปแบบเงิน
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);
  };

  // ฟังก์ชันจำลองการอนุมัติโอนเงิน
  const handleApprove = (id: number) => {
    if (confirm("ยืนยันการโอนเงินให้ผู้จัดงานรายนี้?")) {
      setPayoutList(prev => prev.map(item => 
        item.id === id ? { ...item, status: "Completed" } : item
      ));
      alert("✅ ดำเนินการโอนเงินสำเร็จ!");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Success":
      case "Completed":
        return <span className="px-2 py-1 bg-green-500/10 text-green-500 rounded text-xs font-medium border border-green-500/20 flex items-center gap-1 w-fit"><CheckCircle size={12}/> สำเร็จ</span>;
      case "Pending":
        return <span className="px-2 py-1 bg-yellow-500/10 text-yellow-500 rounded text-xs font-medium border border-yellow-500/20 flex items-center gap-1 w-fit"><Clock size={12}/> รอตรวจสอบ</span>;
      case "Failed":
      case "Rejected":
        return <span className="px-2 py-1 bg-red-500/10 text-red-500 rounded text-xs font-medium border border-red-500/20 flex items-center gap-1 w-fit"><XCircle size={12}/> ล้มเหลว</span>;
      default:
        return <span className="text-gray-400">-</span>;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 min-h-screen text-white p-4 md:p-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <CreditCard className="text-green-500" /> ธุรกรรมการเงิน (Finance)
          </h1>
          <p className="text-gray-400 text-sm mt-1">จัดการการเบิกจ่ายและตรวจสอบรายรับของระบบ</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-green-900/40 to-[#161B22] p-6 rounded-2xl border border-green-500/20 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-green-500"><FileText size={64} /></div>
          <p className="text-green-400 text-sm font-medium mb-1">รายได้สุทธิ (Platform)</p>
          <h2 className="text-3xl font-black text-green-400">฿1,250,400</h2>
          <p className="text-xs text-gray-400 mt-2">กำไรจริงหลังหักค่าโอนแล้ว</p>
        </div>
        
        <div className="bg-[#161B22] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-orange-500"><Clock size={64} /></div>
          <p className="text-orange-400 text-sm font-medium mb-1">ยอดรอโอนให้ผู้จัด</p>
          <h2 className="text-3xl font-bold text-white">฿3,500,000</h2>
          <p className="text-xs text-gray-400 mt-2">รายการที่รอการอนุมัติ</p>
        </div>

        <div className="bg-[#161B22] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-500"><ArrowUpRight size={64} /></div>
          <p className="text-blue-400 text-sm font-medium mb-1">ยอดขายรวม (GMV)</p>
          <h2 className="text-3xl font-bold text-white">฿4,750,400</h2>
          <p className="text-xs text-gray-400 mt-2">ยอดเงินหมุนเวียนทั้งหมดในระบบ</p>
        </div>
      </div>

      {/* Main Content Box */}
      <div className="bg-[#161B22] border border-white/5 rounded-2xl overflow-hidden">
        
        {/* Tabs & Toolbar */}
        <div className="p-4 border-b border-white/5 flex flex-col lg:flex-row justify-between items-center gap-4">
          
          {/* Tabs */}
          <div className="flex bg-black/20 p-1 rounded-lg self-start lg:self-auto">
            <button 
              onClick={() => setActiveTab("payouts")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "payouts" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
            >
              คำขอเบิกเงิน (Payouts)
            </button>
            <button 
              onClick={() => setActiveTab("orders")}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${activeTab === "orders" ? "bg-white/10 text-white shadow-sm" : "text-gray-400 hover:text-white"}`}
            >
              รายการคำสั่งซื้อ (Orders)
            </button>
          </div>

          {/* Search */}
          <div className="flex gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
              <input 
                type="text" 
                placeholder="ค้นหา..." 
                className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="flex items-center gap-2 bg-black/20 border border-white/10 px-3 py-2 rounded-lg text-gray-400 hover:text-white text-sm"><Filter size={16} /></button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
           <table className="w-full text-left text-sm text-gray-400">
             <thead className="bg-[#0B0F14] text-gray-200 uppercase text-xs font-semibold">
               <tr>
                 {activeTab === "payouts" ? (
                    <>
                      <th className="p-4">ผู้จัดงาน</th>
                      <th className="p-4">ชื่องาน</th>
                      <th className="p-4 text-right">จำนวนเงิน</th>
                      <th className="p-4">บัญชีปลายทาง</th>
                      <th className="p-4">วันที่แจ้ง</th>
                      <th className="p-4 text-center">สถานะ</th>
                      <th className="p-4 text-right">จัดการ</th>
                    </>
                 ) : (
                    <>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">ลูกค้า</th>
                      <th className="p-4">งานที่ซื้อ</th>
                      <th className="p-4">ช่องทางชำระ</th>
                      <th className="p-4 text-right">จำนวนเงิน</th>
                      <th className="p-4">วันที่ซื้อ</th>
                      <th className="p-4 text-center">สถานะ</th>
                    </>
                 )}
               </tr>
             </thead>
             <tbody className="divide-y divide-white/5">
               
               {/* TAB 1: PAYOUTS */}
               {activeTab === "payouts" && payoutList.filter(i => i.organizer.includes(searchTerm) || i.event.includes(searchTerm)).map((item) => (
                 <tr key={item.id} className="hover:bg-white/5 transition-colors">
                   <td className="p-4 font-bold text-white">{item.organizer}</td>
                   <td className="p-4 text-gray-400">{item.event}</td>
                   <td className="p-4 text-right text-white font-mono">{formatCurrency(item.amount)}</td>
                   <td className="p-4 text-xs font-mono">{item.bank}</td>
                   <td className="p-4 text-xs">{item.date}</td>
                   <td className="p-4 flex justify-center">{getStatusBadge(item.status)}</td>
                   <td className="p-4 text-right">
                     {item.status === 'Pending' ? (
                       <button 
                         onClick={() => handleApprove(item.id)}
                         className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-lg active:scale-95"
                       >
                         ยืนยันการโอน
                       </button>
                     ) : (
                       <span className="text-gray-500 text-xs">เสร็จสิ้น</span>
                     )}
                   </td>
                 </tr>
               ))}

               {/* TAB 2: ORDERS */}
               {activeTab === "orders" && initialTransactions.filter(i => i.user.includes(searchTerm) || i.event.includes(searchTerm)).map((item) => (
                 <tr key={item.id} className="hover:bg-white/5 transition-colors">
                   <td className="p-4 font-mono text-blue-400">{item.id}</td>
                   <td className="p-4 text-white">{item.user}</td>
                   <td className="p-4 text-gray-400">{item.event}</td>
                   <td className="p-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-blue-500"></span> {item.method}</td>
                   <td className="p-4 text-right font-mono text-white">{formatCurrency(item.amount)}</td>
                   <td className="p-4 text-xs">{item.date}</td>
                   <td className="p-4 flex justify-center">{getStatusBadge(item.status)}</td>
                 </tr>
               ))}

             </tbody>
           </table>
           
           {/* Empty State */}
           {activeTab === "payouts" && payoutList.length === 0 && (
              <div className="p-8 text-center text-gray-500">ไม่มีคำขอเบิกเงิน</div>
           )}
        </div>
      </div>
    </div>
  );
}