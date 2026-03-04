"use client";

import { useState, useEffect } from "react";
import { TrendingUp, DollarSign, CreditCard, Calendar, Loader2 } from 'lucide-react';

interface Transaction {
  id: string;
  customer: string;
  event: string;
  amount: string;
  date: string;
  status: string;
}

interface SalesStats {
  revenueToday: string;
  revenueMonth: string;
  totalBills: number;
  avgPerDay: string;
}

export default function SalesPage() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stats, setStats] = useState<SalesStats>({
    revenueToday: "0",
    revenueMonth: "0",
    totalBills: 0,
    avgPerDay: "0"
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/organizer/sales", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setStats(data.stats);
          setTransactions(data.transactions);
        }
      } catch (err) {
        console.error("Error fetching sales data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSalesData();
  }, []);

  return (
    <div className="space-y-8">
      {/* ส่วนหัวข้อ */}
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">สรุปยอดขาย (Sales Analytics)</h1>
        <p className="text-slate-400">ภาพรวมรายได้และการเงินของอีเวนต์ทั้งหมด</p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20 text-slate-400">
          <Loader2 className="animate-spin mr-3" size={30} /> กำลังโหลดข้อมูล...
        </div>
      ) : (
        <>
          {/* การ์ดสถิติ 4 ใบ */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-green-500/20 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-slate-800/50 text-green-400">
                  <TrendingUp size={24} />
                </div>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">Live</span>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">รายได้วันนี้</p>
                <h3 className="text-2xl font-bold text-white mt-1">฿{stats.revenueToday}</h3>
              </div>
            </div>

            <div className="bg-[#0F172A] p-6 rounded-2xl border border-blue-500/20 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-slate-800/50 text-blue-400">
                  <DollarSign size={24} />
                </div>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">Month</span>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">รายได้รวมเดือนนี้</p>
                <h3 className="text-2xl font-bold text-white mt-1">฿{stats.revenueMonth}</h3>
              </div>
            </div>

            <div className="bg-[#0F172A] p-6 rounded-2xl border border-purple-500/20 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-slate-800/50 text-purple-400">
                  <CreditCard size={24} />
                </div>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">Total</span>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">จำนวนบิลที่ขายได้</p>
                <h3 className="text-2xl font-bold text-white mt-1">{stats.totalBills} บิล</h3>
              </div>
            </div>

            <div className="bg-[#0F172A] p-6 rounded-2xl border border-orange-500/20 flex flex-col justify-between">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 rounded-lg bg-slate-800/50 text-orange-400">
                  <Calendar size={24} />
                </div>
                <span className="text-xs text-slate-500 bg-slate-900 px-2 py-1 rounded">Avg</span>
              </div>
              <div>
                <p className="text-slate-400 text-sm font-medium">ยอดเฉลี่ยต่อวัน</p>
                <h3 className="text-2xl font-bold text-white mt-1">฿{stats.avgPerDay}</h3>
              </div>
            </div>
          </div>

          {/* ตารางรายการคำสั่งซื้อ */}
          <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">รายการสั่งซื้อล่าสุด</h3>
              <button className="text-sm text-blue-400 hover:text-blue-300">ดูทั้งหมด</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4 pl-6">Order ID</th>
                    <th className="p-4">ลูกค้า</th>
                    <th className="p-4">อีเวนต์</th>
                    <th className="p-4">ยอดชำระ</th>
                    <th className="p-4">วันที่</th>
                    <th className="p-4 pr-6 text-right">สถานะ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-300">
                  {transactions.map((t) => (
                    <tr key={t.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 pl-6 font-mono text-slate-500">{t.id}</td>
                      <td className="p-4 text-white font-medium">{t.customer}</td>
                      <td className="p-4">{t.event}</td>
                      <td className="p-4 text-white">฿{t.amount}</td>
                      <td className="p-4 text-slate-500">{t.date}</td>
                      <td className="p-4 pr-6 text-right">
                        <span className={`px-3 py-1 rounded text-xs font-bold ${
                          t.status === 'สำเร็จ' ? 'bg-green-500/20 text-green-400' :
                          t.status === 'รอตรวจสอบ' ? 'bg-yellow-500/20 text-yellow-400' :
                          'bg-red-500/20 text-red-400'
                        }`}>
                          {t.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {transactions.length === 0 && (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-500">
                        ยังไม่มีรายการสั่งซื้อ
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}