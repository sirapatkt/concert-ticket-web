"use client";
import { History, CheckCircle, XCircle, ChevronRight } from "lucide-react"; // ❌ ลบ Search icon ออก
import Link from "next/link"; 

export default function OrderHistoryPage() {
  const orders = [
    { id: "ORD-2026-001", event: "The Grand Symphony 2026", date: "10 JAN 2026", amount: "2,500 THB", status: "success" },
    { id: "ORD-2025-089", event: "Neon Music Festival", date: "25 DEC 2025", amount: "1,800 THB", status: "success" },
    { id: "ORD-2025-055", event: "Rock Legend Live", date: "15 NOV 2025", amount: "3,200 THB", status: "failed" },
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14] pt-24 pb-12 px-4 md:px-8 font-sans text-white">
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <History className="text-purple-500" /> ประวัติการสั่งซื้อ
            </h1>
            <p className="text-gray-400">รายการธุรกรรมทั้งหมดที่คุณทำผ่าน BEATPASS</p>
        </div>

        {/* ❌ ตัดส่วน Search Filter ออกไปเลย */}

        {/* Table Card */}
        <div className="bg-[#161B22] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
              <thead className="bg-[#1F242C] text-gray-200 uppercase font-bold text-xs border-b border-white/5">
                <tr>
                  <th className="px-6 py-4">หมายเลขคำสั่งซื้อ</th>
                  <th className="px-6 py-4">อีเวนต์</th>
                  <th className="px-6 py-4">วันที่ทำรายการ</th>
                  <th className="px-6 py-4">ยอดเงิน</th>
                  <th className="px-6 py-4 text-center">สถานะ</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {orders.map((order) => (
                  <tr key={order.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      {/* ✅ ลิงก์ไปหน้า Detail */}
                      <Link href={`/profile/history/${order.id}`} className="font-mono text-blue-400 hover:text-blue-300 font-bold underline-offset-4 hover:underline">
                        {order.id}
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-white font-medium">{order.event}</td>
                    <td className="px-6 py-4">{order.date}</td>
                    <td className="px-6 py-4 text-white font-bold">{order.amount}</td>
                    <td className="px-6 py-4 text-center">
                      {order.status === 'success' && <span className="inline-flex items-center gap-1.5 text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full text-xs font-bold border border-green-500/20"><CheckCircle size={12}/> สำเร็จ</span>}
                      {order.status === 'failed' && <span className="inline-flex items-center gap-1.5 text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full text-xs font-bold border border-red-500/20"><XCircle size={12}/> ล้มเหลว</span>}
                    </td>
                    <td className="px-6 py-4 text-right">
                       <Link href={`/profile/history/${order.id}`} className="text-gray-600 group-hover:text-white transition-colors">
                          <ChevronRight size={18} />
                       </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}