"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Calendar, MapPin, Users, Ticket } from 'lucide-react';
import Link from "next/link";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id; // ดึง ID จาก URL
  
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        // ยิง API ไปดึงข้อมูลอีเวนต์ตาม ID
        const res = await fetch(`http://127.0.0.1:8000/api/organizer/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEventData(data);
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEventDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-slate-400">
        <Loader2 className="animate-spin mb-4" size={40} />
        <p>กำลังโหลดข้อมูลอีเวนต์...</p>
      </div>
    );
  }

  if (!eventData) {
    return (
      <div className="p-8 text-center text-white">
        <h2 className="text-2xl font-bold text-red-400 mb-4">ไม่พบข้อมูลอีเวนต์</h2>
        <button onClick={() => router.back()} className="text-cyan-400 hover:underline flex items-center justify-center gap-2 mx-auto">
          <ArrowLeft size={16} /> กลับไปหน้าแดชบอร์ด
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 w-full max-w-[1920px] mx-auto space-y-6">
      
      {/* ปุ่มย้อนกลับ */}
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-slate-400 hover:text-white transition-colors w-fit group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
        กลับไปหน้าแดชบอร์ด
      </button>

      {/* ส่วนหัวอีเวนต์ */}
      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">{eventData.eventName}</h1>
            <span className={`px-3 py-1 rounded text-xs font-bold ${
              eventData.eventStatus === 'เสร็จสิ้น' ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 
              eventData.eventStatus === 'กำลังเตรียม' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
              'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30'
            }`}>
              สถานะ: {eventData.eventStatus}
            </span>
          </div>
          
          {/* ปุ่ม Action เพิ่มเติม (เช่น แก้ไขงาน) */}
          <div className="flex gap-3">
             <button className="px-4 py-2 rounded-lg bg-slate-800 text-white hover:bg-slate-700 transition-colors text-sm">
               แก้ไขข้อมูลงาน
             </button>
          </div>
        </div>

        {/* ข้อมูลพื้นฐาน */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8 border-t border-slate-800 pt-8">
          <div className="flex items-start gap-3">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg"><Calendar size={24} /></div>
            <div>
              <p className="text-slate-500 text-xs font-medium">วันที่จัดงาน</p>
              <p className="text-white font-medium mt-1">{new Date(eventData.rental_start).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg"><MapPin size={24} /></div>
            <div>
              <p className="text-slate-500 text-xs font-medium">สถานที่</p>
              <p className="text-white font-medium mt-1">{eventData.hall?.Hall_Name || 'ไม่ระบุสถานที่'}</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="p-3 bg-pink-500/10 text-pink-400 rounded-lg"><Ticket size={24} /></div>
            <div>
              <p className="text-slate-500 text-xs font-medium">จำกัดการซื้อต่อคน</p>
              <p className="text-white font-medium mt-1">{eventData.MaxTicketsPerMember} ใบ / บัญชี</p>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}