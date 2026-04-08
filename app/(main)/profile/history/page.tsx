"use client";
import React, { useState, useEffect } from "react";
// ⭐️ เพิ่ม Timer เข้ามาใน import
import { History, CheckCircle, XCircle, ChevronRight, Loader2, Timer } from "lucide-react";
import Link from "next/link";

export default function OrderHistoryPage() {
  // ⭐️ 1. สร้าง State สำหรับเก็บข้อมูลที่ดึงมาจาก DB
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // ⭐️ 2. ใช้ useEffect ดึงข้อมูลเมื่อหน้าจอโหลด
  useEffect(() => {
          const fetchOrders = async () => {
        try {
          // ⭐️ ดึง Token จาก LocalStorage (ที่คุณเก็บไว้ตอน Login)
          const token = localStorage.getItem("token"); 

          const response = await fetch("http://127.0.0.1:8000/api/orders", {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Content-Type": "application/json",
              "Authorization": `Bearer ${token}` // ⭐️ ส่ง Token ยืนยันตัวตน
            }
          });

          const data = await response.json();
          if (response.ok) {
            setOrders(data);
          }
        } catch (error) {
          console.error("Failed to fetch orders:", error);
        } finally {
          setIsLoading(false);
        }
      };

    fetchOrders();
  }, []);

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

        {/* Table Card */}
        <div className="bg-[#161B22] border border-white/10 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            {isLoading ? (
              // แสดง Loader ตอนกำลังโหลดข้อมูล
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="animate-spin text-purple-500 mb-4" size={40} />
                <p className="text-gray-400 animate-pulse">กำลังโหลดประวัติการสั่งซื้อ...</p>
              </div>
            ) : orders.length > 0 ? (
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
                        <Link href={`/profile/history/${order.id}`} className="font-mono text-blue-400 hover:text-blue-300 font-bold underline-offset-4 hover:underline">
                          {order.order_number || order.id}
                        </Link>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">{order.event_name || order.event}</td>
                      <td className="px-6 py-4">{order.created_at || order.date}</td>
                      <td className="px-6 py-4 text-white font-bold">{order.total_amount || order.amount} THB</td>
                      <td className="px-6 py-4 text-center flex justify-center gap-2">
                        {order.status === 'success' && <span className="inline-flex items-center gap-1.5 text-green-400 bg-green-500/10 px-2.5 py-1 rounded-full text-xs font-bold border border-green-500/20"><CheckCircle size={12}/> สำเร็จ</span>}
                        {order.status === 'failed' && <span className="inline-flex items-center gap-1.5 text-red-400 bg-red-500/10 px-2.5 py-1 rounded-full text-xs font-bold border border-red-500/20"><XCircle size={12}/> ล้มเหลว</span>}
                        {/* ⭐️ เพิ่มสถานะ Pending ตรงนี้ */}
                        {order.status === 'pending' && <span className="inline-flex items-center gap-1.5 text-yellow-500 bg-yellow-500/10 px-2.5 py-1 rounded-full text-xs font-bold border border-yellow-500/20"><Timer size={12}/> รอชำระเงิน</span>}
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
            ) : (
              // กรณีไม่มีข้อมูลใน DB
              <div className="py-20 text-center text-gray-500">ไม่พบประวัติการสั่งซื้อ</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}