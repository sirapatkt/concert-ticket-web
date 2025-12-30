"use client";
// ✅ เพิ่ม CheckCircle เข้าไปใน import นี้ครับ
import { CreditCard, DollarSign, ArrowUpRight, Clock, CheckCircle } from "lucide-react";

export default function FinancePage() {
  const withdrawals = [
    { id: 1, organizer: "GMM Grammy", amount: "฿1,500,000", bank: "KBANK •••• 8829", date: "10 mins ago", status: "Pending" },
    { id: 2, organizer: "RS Group", amount: "฿500,000", bank: "SCB •••• 1234", date: "2 hours ago", status: "Completed" },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <CreditCard className="text-green-500" /> ธุรกรรมการเงิน (Finance)
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 p-6 rounded-2xl text-white shadow-lg">
          <p className="text-green-100 text-sm font-medium mb-1">รายได้สุทธิของระบบ (ค่าธรรมเนียม)</p>
          <h2 className="text-3xl font-bold">฿1,250,400</h2>
        </div>
        <div className="bg-[#161B22] border border-white/5 p-6 rounded-2xl">
          <p className="text-gray-400 text-sm font-medium mb-1">ยอดรอโอนให้ผู้จัด</p>
          <h2 className="text-3xl font-bold text-orange-400">฿3,500,000</h2>
        </div>
      </div>

      {/* Table */}
      <div className="bg-[#161B22] border border-white/5 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/5 font-bold">คำขอถอนเงินล่าสุด</div>
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-[#0B0F14] text-gray-200 uppercase text-xs">
            <tr>
              <th className="p-4">ผู้จัดงาน</th>
              <th className="p-4">จำนวนเงิน</th>
              <th className="p-4">บัญชีปลายทาง</th>
              <th className="p-4">สถานะ</th>
              <th className="p-4 text-right">ดำเนินการ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {withdrawals.map((item) => (
              <tr key={item.id} className="hover:bg-white/5">
                <td className="p-4 text-white font-bold">{item.organizer}</td>
                <td className="p-4 text-white">{item.amount}</td>
                <td className="p-4">{item.bank}</td>
                <td className="p-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 w-fit ${item.status === 'Pending' ? 'bg-orange-500/10 text-orange-400' : 'bg-green-500/10 text-green-400'}`}>
                    {item.status === 'Pending' ? <Clock size={12}/> : <CheckCircle size={12}/>} {item.status}
                  </span>
                </td>
                <td className="p-4 text-right">
                  {item.status === 'Pending' ? (
                    <button className="bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all">
                      ยืนยันการโอน
                    </button>
                  ) : (
                    <span className="text-gray-500 text-xs">โอนแล้ว</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}