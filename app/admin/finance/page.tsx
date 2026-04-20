"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, DollarSign, ArrowUpRight, Clock, CheckCircle, 
  Search, Calendar, Filter, FileText, XCircle, Eye 
} from "lucide-react";

export default function FinancePage() {
  // ✅ 1. เพิ่ม State เช็คว่าเว็บโหลดฝั่ง Client หรือยัง (แก้ปัญหา Hydration)
  const [isMounted, setIsMounted] = useState(false);
  
  const [activeTab, setActiveTab] = useState<"payouts" | "orders">("payouts");
  const [searchTerm, setSearchTerm] = useState("");

  const [payoutList, setPayoutList] = useState<any[]>([]);
  const [transactionList, setTransactionList] = useState<any[]>([]);

  // ✅ เพิ่ม State เก็บข้อมูลสรุปรายได้และสถานะกดดูรายละเอียด
  const [financeSummary, setFinanceSummary] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    // ✅ 2. สั่งให้เป็น true เมื่อโหลดบนเบราว์เซอร์เสร็จแล้ว
    setIsMounted(true);

    const fetchFinanceData = async () => {
      try {
        const resPayouts = await fetch('http://localhost:8000/api/admin/payouts');
        if (resPayouts.ok) {
          const data = await resPayouts.json();
          if(data && data.length > 0) setPayoutList(data); 
        }

        const resOrders = await fetch('http://localhost:8000/api/admin/orders');
        if (resOrders.ok) {
          const data = await resOrders.json();
          if(data && data.length > 0) setTransactionList(data);
        }

        // ✅ เพิ่มการดึงข้อมูลสรุปรายได้ (Finance Summary)
        const resSummary = await fetch('http://localhost:8000/api/admin/finance-summary');
        if (resSummary.ok) {
            const data = await resSummary.json();
            setFinanceSummary(data);
        }
      } catch (error) {
        console.error("API Error:", error);
      }
    };

    fetchFinanceData();
  }, []);

  const totalSales = transactionList.reduce((sum, order) => sum + Number(order.amount), 0);
  const totalPendingPayout = payoutList
    .filter(p => p.status === "Pending")
    .reduce((sum, item) => sum + Number(item.amount), 0);
  
  // (เก็บตัวแปรเดิมไว้ไม่ให้กระทบการทำงานส่วนอื่น)
  const platformRevenue = totalSales * 0.03; 

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('th-TH', { style: 'currency', currency: 'THB', minimumFractionDigits: 0 }).format(amount);
  };

  const handleApprove = async (id: number) => {
    if (confirm("ยืนยันการโอนเงินให้ผู้จัดงานรายนี้?")) {
      try {
        const res = await fetch(`http://localhost:8000/api/admin/payouts/${id}/approve`, {
          method: 'PATCH',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          }
        });

        if (res.ok) {
          setPayoutList(prev => prev.map(item => 
            item.id === id ? { ...item, status: "Completed" } : item
          ));
          alert("✅ ดำเนินการโอนเงินสำเร็จ!");
        } else {
          alert("❌ เกิดข้อผิดพลาดในการโอนเงิน");
        }
      } catch (error) {
         console.error("Error:", error);
      }
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

  // ✅ 3. ถ้ายังไม่โหลดบน Client ให้โชว์หน้าเปล่าไปก่อนแว้บนึง (แก้ Hydration Error 100%)
  if (!isMounted) {
    return null; 
  }

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
        
        {/* ✅ การ์ดสีเขียวที่ถูกปรับแก้ให้กดดูรายละเอียดและลิสต์รายชื่อคอนเสิร์ตได้ */}
        <div 
          onClick={() => setShowDetail(!showDetail)} 
          className="bg-gradient-to-br from-green-900/40 to-[#161B22] p-6 rounded-2xl border border-green-500/20 shadow-lg relative overflow-hidden cursor-pointer hover:border-green-500/50 transition-all"
        >
            <div className="absolute top-0 right-0 p-4 opacity-10 text-green-500"><FileText size={64} /></div>
            <p className="text-green-400 text-sm font-medium mb-1">รายได้สุทธิ (Platform)</p>
            <h2 className="text-3xl font-black text-green-400">
                {formatCurrency(financeSummary?.total_net_revenue || 0)}
            </h2>
            
            {/* ส่วนที่บอกว่ามาจากไหน */}
            <div className="mt-3 space-y-1">
                {showDetail ? (
                    <div className="animate-in fade-in slide-in-from-top-1 duration-300">
                        <div className="flex justify-between text-[11px] text-gray-300 border-t border-green-500/20 pt-3 mb-1">
                            <span>ค่าธรรมเนียมตั๋ว ({financeSummary?.breakdown?.total_tickets || 0} ใบ):</span>
                            <span className="font-bold text-white">{formatCurrency(financeSummary?.breakdown?.service_fee || 0)}</span>
                        </div>
                        <div className="flex justify-between text-[11px] text-gray-300 mb-2">
                            <span>ส่วนแบ่งเป้าหมาย (GP):</span>
                            <span className="font-bold text-white">{formatCurrency(financeSummary?.breakdown?.commission || 0)}</span>
                        </div>

                        {/* โชว์รายชื่อคอนเสิร์ตที่ได้ GP */}
                        {financeSummary?.breakdown?.events && financeSummary.breakdown.events.length > 0 && (
                            <div className="bg-black/30 rounded-lg p-2 mt-2">
                                <p className="text-[10px] text-green-400 mb-1 border-b border-green-500/20 pb-1">ได้ส่วนแบ่ง GP จากงาน:</p>
                                {financeSummary.breakdown.events.map((ev: any, idx: number) => (
                                    <div key={idx} className="flex justify-between items-center text-[10px] text-gray-400 mt-1">
                                        <span className="truncate w-32" title={ev.name}>• {ev.name} ({ev.percent}%)</span>
                                        <span className="text-gray-300">{formatCurrency(ev.commission)}</span>
                                    </div>
                                ))}
                            </div>
                        )}

                        <p className="text-[10px] text-green-500/70 mt-3 text-center">* คลิกเพื่อพับเก็บ</p>
                    </div>
                ) : (
                    <p className="text-xs text-gray-400 mt-2">คลิกเพื่อดูที่มาของรายได้</p>
                )}
            </div>
        </div>

        <div className="bg-[#161B22] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-orange-500"><Clock size={64} /></div>
          <p className="text-orange-400 text-sm font-medium mb-1">ยอดรอโอนให้ผู้จัด</p>
          <h2 className="text-3xl font-bold text-white">{formatCurrency(totalPendingPayout)}</h2>
          <p className="text-xs text-gray-400 mt-2">รายการที่รอการอนุมัติ</p>
        </div>

        <div className="bg-[#161B22] border border-white/5 p-6 rounded-2xl relative overflow-hidden">
           <div className="absolute top-0 right-0 p-4 opacity-10 text-blue-500"><ArrowUpRight size={64} /></div>
          <p className="text-blue-400 text-sm font-medium mb-1">ยอดขายรวม (GMV)</p>
          <h2 className="text-3xl font-bold text-white">{formatCurrency(totalSales)}</h2>
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
               {activeTab === "payouts" && payoutList.filter(i => (i.organizer || "").includes(searchTerm) || (i.event || "").includes(searchTerm)).map((item) => (
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
               {activeTab === "orders" && transactionList.filter(i => (i.user || "").includes(searchTerm) || (i.event || "").includes(searchTerm)).map((item) => (
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
           
           {/* Empty States */}
           {activeTab === "payouts" && payoutList.length === 0 && (
              <div className="p-8 text-center text-gray-500">ไม่มีคำขอเบิกเงิน</div>
           )}
           {activeTab === "orders" && transactionList.length === 0 && (
              <div className="p-8 text-center text-gray-500">ไม่มีรายการคำสั่งซื้อ</div>
           )}
        </div>
      </div>
    </div>
  );
}