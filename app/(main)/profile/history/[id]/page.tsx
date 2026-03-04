"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Ticket, Calendar, MapPin, CheckCircle2, Receipt, CreditCard, QrCode, XCircle } from "lucide-react";
import Link from "next/link";

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.id; // ดึง ID จาก URL

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        // ⭐️ 1. ดึง Token เพื่อยืนยันตัวตน
        const token = localStorage.getItem("token");

        // ⭐️ 2. ยิง API ไปหา Laravel (ระบุ orderId ที่ต้องการดึงข้อมูล)
        const res = await fetch(`http://127.0.0.1:8000/api/orders/${orderId}`, {
          method: "GET",
          headers: { 
            "Authorization": `Bearer ${token}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
          }
        });

        // ⭐️ 3. ตรวจสอบว่าดึงข้อมูลสำเร็จไหม
        if (res.ok) {
          const data = await res.json();
          setOrder(data); // เอาข้อมูลจาก DB ยัดใส่ State
        } else {
          console.error("Failed to fetch order details:", res.status);
          setOrder(null);
        }

      } catch (error) {
        console.error("Fetch error:", error);
        setOrder(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0B0F14] flex flex-col items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-[#00B4D8] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-gray-400 font-bold tracking-widest animate-pulse">LOADING DETAILS...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4 text-[#E60023]">ไม่พบข้อมูลคำสั่งซื้อ</h1>
        <button onClick={() => router.back()} className="px-6 py-2 bg-[#161B22] hover:bg-gray-800 transition-colors rounded-lg font-bold">กลับหน้าก่อนหน้า</button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0F14] pt-24 pb-16 px-4 md:px-8 font-sans text-white">
      <div className="max-w-4xl mx-auto">
        
        {/* Navigation ย้อนกลับ */}
        <button 
          onClick={() => router.push('/profile/history')} 
          className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors font-bold"
        >
          <ArrowLeft size={20} /> กลับไปหน้าประวัติการสั่งซื้อ
        </button>

        {/* Header และ สถานะ */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black uppercase text-white mb-2">รายละเอียดคำสั่งซื้อ</h1>
            <p className="text-gray-400 font-mono tracking-widest">Order ID: <span className="text-white">{order.order_number || order.id}</span></p>
          </div>
          <div>
            {order.status === 'success' ? (
              <div className="inline-flex items-center gap-2 text-[#76FF03] bg-[#76FF03]/10 px-4 py-2 rounded-full border border-[#76FF03]/20 font-bold">
                <CheckCircle2 size={18} /> ชำระเงินสำเร็จ
              </div>
            ) : order.status === 'completed' ? (
              <div className="inline-flex items-center gap-2 text-gray-400 bg-gray-500/10 px-4 py-2 rounded-full border border-gray-500/20 font-bold">
                <CheckCircle2 size={18} /> จบงานแล้ว
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 text-[#E60023] bg-[#E60023]/10 px-4 py-2 rounded-full border border-[#E60023]/20 font-bold">
                <XCircle size={18} /> ชำระเงินล้มเหลว
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* คอลัมน์ซ้าย: ข้อมูลงานและตั๋ว */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-[#00B4D8]" />
              
              <div className="flex items-start gap-4 mb-6">
                <div className="w-12 h-12 bg-[#00B4D8]/20 rounded-xl flex items-center justify-center shrink-0">
                  <Ticket className="text-[#00B4D8]" size={24} />
                </div>
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-1 text-white">{order.event_name}</h2>
                  <p className="text-[#00B4D8] font-bold text-sm">{order.ticket_count} TICKETS</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="flex gap-3 text-gray-300">
                  <Calendar size={18} className="text-gray-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">วันที่และเวลา</p>
                    <p className="text-sm font-medium text-white">{order.event_date}</p>
                    <p className="text-sm">{order.event_time}</p>
                  </div>
                </div>
                <div className="flex gap-3 text-gray-300">
                  <MapPin size={18} className="text-gray-500 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-bold mb-1">สถานที่</p>
                    <p className="text-sm font-medium text-white">{order.venue}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#0B0F14] rounded-xl p-4 border border-white/5 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">โซนและที่นั่ง</p>
                  <p className="font-bold text-white text-lg">Zone {order.zone} <span className="text-gray-500 font-normal mx-2">|</span> {order.seats}</p>
                </div>
              </div>
            </div>

            {/* ปุ่มกดดู E-Ticket (แสดงเฉพาะเมื่อจ่ายเงินสำเร็จ) */}
            {order.status === 'success' && (
              <Link href={`/ticket?bookingId=${order.booking_id}`}>
                <div className="bg-gradient-to-r from-[#00B4D8] to-[#0096B4] rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:shadow-[0_0_30px_rgba(0,180,216,0.3)] transition-all">
                  <div>
                    <h3 className="text-xl font-black uppercase tracking-tight mb-1 text-white">แสดง E-Ticket</h3>
                    <p className="text-white/80 text-sm">สแกน QR Code นี้เพื่อเข้างาน</p>
                  </div>
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white group-hover:text-[#00B4D8] transition-colors">
                    <QrCode size={24} />
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* คอลัมน์ขวา: สรุปใบเสร็จ */}
          <div className="lg:col-span-1">
            <div className="bg-[#161B22] border border-white/10 rounded-2xl p-6 sticky top-24">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2 border-b border-white/10 pb-4">
                <Receipt size={20} className="text-gray-400" /> สรุปยอดชำระเงิน
              </h3>

              <div className="space-y-4 text-sm mb-6 border-b border-white/10 pb-6 text-gray-300">
                <div className="flex justify-between">
                  <span>ค่าบัตร ({order.ticket_count} ใบ)</span>
                  <span className="text-white font-medium">{order.subtotal?.toLocaleString()} THB</span>
                </div>
                <div className="flex justify-between">
                  <span>ค่าธรรมเนียมระบบ</span>
                  <span className="text-white font-medium">{order.fee?.toLocaleString()} THB</span>
                </div>
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-dashed border-gray-600">
                  <span className="font-bold text-white uppercase tracking-widest">ยอดรวมทั้งสิ้น</span>
                  <span className="text-2xl font-black text-[#76FF03]">{order.total?.toLocaleString()} THB</span>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">ช่องทางการชำระเงิน</p>
                  <p className="text-sm font-medium flex items-center gap-2 text-white">
                    <CreditCard size={16} className="text-gray-400" /> {order.payment_method}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-bold mb-1">วันที่ทำรายการ</p>
                  <p className="text-sm font-medium text-white">{order.transaction_date}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}