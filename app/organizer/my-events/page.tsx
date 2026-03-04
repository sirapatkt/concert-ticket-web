"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Search, Calendar, MoreHorizontal, 
  Edit, Trash2, Eye, Building2, Loader2 
} from "lucide-react";

export default function MyEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  // ตั้งค่าเริ่มต้นของตัวกรองเป็น "ทั้งหมด"
  const [filterStatus, setFilterStatus] = useState("ทั้งหมด");

  // ✅ ฟังก์ชันดึงข้อมูลจาก Backend
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const res = await fetch('http://127.0.0.1:8000/api/events', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

    // เพิ่ม Type นอก Component (บนสุดของไฟล์) เพื่อแก้ Error เส้นแดง
  type EventStatusType = "กำลังเตรียม" | "กำลังจะจัด" | "เปิดขายบัตร" | "กำลังจัด" | "บัตรขายหมด" | "เสร็จสิ้น" | "ยกเลิกงาน";

  // แก้ไขฟังก์ชัน getThaiStatus ให้เช็คคำจาก DB ตรงๆ
  const getThaiStatus = (status: string): EventStatusType => {
    if (!status) return 'กำลังเตรียม';
    if (status === 'กำลังเตรียม') return 'กำลังเตรียม';
    if (status === 'กำลังจะจัด') return 'กำลังจะจัด';
    if (status === 'เปิดขายบัตร' || status.toUpperCase() === 'ON SALE') return 'เปิดขายบัตร'; 
    if (status === 'กำลังจัด') return 'กำลังจัด';
    if (status === 'บัตรขายหมด') return 'บัตรขายหมด';
    if (status === 'เสร็จสิ้น') return 'เสร็จสิ้น';
    return 'กำลังเตรียม'; 
  };

  // ✅ 2. ฟังก์ชันกรองข้อมูลตามสถานะ (มีแค่ตัวเดียวเท่านั้น)
  const filteredEvents = events.filter((ev: any) => {
    if (filterStatus === "ทั้งหมด") return true;
    return getThaiStatus(ev.status) === filterStatus;
  });

  // ✅ แก้ไข Error ตรงนี้: ลบการประกาศฟังก์ชันที่ซ้อนกันออก
  const getStatusStyles = (status: string) => {
    const thaiStatus = getThaiStatus(status);
  
    // ปรับพื้นหลังและขอบเป็นสีตามสถานะ และตัวหนังสือเป็นสีขาว (text-white)
    switch (thaiStatus) {
      case 'เปิดขายบัตร':
        // พื้นหลังเขียว ขอบเขียว ตัวหนังสือขาว
        return "border-2 border-emerald-500 bg-emerald-600 text-white shadow-lg";
      case 'กำลังจัด':
        // พื้นหลังชมพูเข้ม (หรือจะใช้เขียวก็ได้) ขอบชมพู ตัวหนังสือขาว
        return "border-2 border-pink-500 bg-pink-600 text-white animate-pulse";
      case 'กำลังเตรียม':
        // พื้นหลังเหลือง/ส้ม ขอบเหลือง ตัวหนังสือขาว
        return "border-2 border-amber-400 bg-amber-500 text-white";
      case 'กำลังจะจัด':
        // พื้นหลังฟ้าเข้ม ขอบฟ้า ตัวหนังสือขาว
        return "border-2 border-blue-500 bg-blue-600 text-white";
      case 'บัตรขายหมด':
        // พื้นหลังส้ม ขอบส้ม ตัวหนังสือขาว
        return "border-2 border-orange-500 bg-orange-600 text-white";
      case 'เสร็จสิ้น':
        return "border-2 border-slate-500 bg-slate-600 text-white";
      case 'ยกเลิกงาน':
        return "border-2 border-red-500 bg-red-600 text-white";
      default:
        return "border-2 border-slate-600 bg-slate-700 text-white";
    }
  };

  // ✅ ฟังก์ชันลบงาน
  const handleDelete = async (id: number) => {
    // โชว์หน้าต่างยืนยันก่อนลบ
    const confirmDelete = window.confirm("⚠️ คุณแน่ใจหรือไม่ที่จะลบอีเวนต์นี้?\nข้อมูลจะถูกลบถาวรและไม่สามารถกู้คืนได้");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://127.0.0.1:8000/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (res.ok) {
        alert("ลบข้อมูลสำเร็จ!");
        fetchEvents(); // ลบเสร็จให้โหลดข้อมูลใหม่ทันที
      } else {
        const err = await res.json();
        alert("เกิดข้อผิดพลาด: " + (err.message || "ไม่สามารถลบได้"));
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("❌ เชื่อมต่อ Server ไม่ได้");
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-20 font-sans">
      
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            อีเวนต์ของฉัน
          </h1>
          <p className="text-slate-400 mt-1">จัดการคอนเสิร์ต ตรวจสอบยอดขาย และสถานะงานทั้งหมด</p>
        </div>
        <Link 
          href="/organizer/create" 
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium shadow-lg shadow-blue-500/20 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
        >
          + สร้างงานใหม่
        </Link>
      </div>

      {/* Filter Bar */}
      <div className="max-w-6xl mx-auto mb-6 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
          <input 
            type="text" 
            placeholder="ค้นหาชื่อคอนเสิร์ต..." 
            className="w-full bg-[#0F172A] border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-blue-500 transition-colors placeholder:text-slate-600"
          />
        </div>

        <div className="flex bg-[#0F172A] p-1 rounded-lg border border-slate-800 overflow-x-auto">
          {/* ✅ อัปเดตปุ่ม Filter ให้ตรงกับสถานะภาษาไทย */}
          {["ทั้งหมด", "กำลังเตรียม", "กำลังจะจัด", "กำลังจัด", "เสร็จสิ้น", "ยกเลิกงาน"].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all whitespace-nowrap
                ${filterStatus === status 
                  ? "bg-slate-700 text-white shadow" 
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
                }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="max-w-6xl mx-auto space-y-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-500">
            <Loader2 className="animate-spin mb-2" size={32} />
            <p>กำลังโหลดข้อมูลอีเวนต์...</p>
          </div>
        ) : filteredEvents.length > 0 ? filteredEvents.map((event: any) => (
          <div 
            key={event.id} 
            className="bg-[#0F172A] border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row gap-6 hover:border-slate-600 transition-all group shadow-lg"
          >
            {/* Image Section */}
            <div className="w-full md:w-48 h-32 bg-slate-800 rounded-lg overflow-hidden flex-shrink-0 relative">
               <img 
                 src={event.image || "https://images.unsplash.com/photo-1459749411177-d4a428c3e8cb?w=800&q=80"} 
                 alt={event.title} 
                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
               />
               <div className="absolute top-2 left-2">
                  <span className={`px-2 py-1 rounded text-[10px] font-black ${getStatusStyles(event.status)}`}>
                    {getThaiStatus(event.status)}
                  </span>
                </div>
              </div>

            {/* Content Section */}
            <div className="flex-1 py-1">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-blue-400 transition-colors">
                    {event.title || "ไม่ระบุชื่องาน"}
                  </h3>
                  <div className="flex flex-col gap-1.5 text-sm text-slate-400">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-slate-500" /> 
                      {event.date ? new Date(event.date).toLocaleDateString('th-TH', {
                        year: 'numeric', month: 'long', day: 'numeric'
                      }) : "ยังไม่กำหนดวันที่"}
                    </div>
                    <div className="flex items-center gap-2 text-slate-300">
                      <Building2 size={14} className="text-blue-400" /> {event.location || "ไม่ระบุสถานที่"}
                    </div>
                  </div>
                </div>
                
                <button className="md:hidden text-slate-400 hover:text-white transition-colors">
                  <MoreHorizontal size={20} />
                </button>
              </div>

              {/* Progress Bar & Sales Info */}
              <div className="mt-5">
                <div className="flex justify-between text-[11px] mb-2">
                  <span className="text-slate-400 font-medium">ยอดขายบัตรปัจจุบัน</span>
                  <span className="text-white font-bold">
                    {event.capacity > 0 ? Math.round(((event.sold || 0) / event.capacity) * 100) : 0}% 
                    <span className="text-slate-500 font-normal ml-1">
                      ({(event.sold ?? 0).toLocaleString()}/{(event.capacity ?? 0).toLocaleString()})
                    </span>
                  </span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-1000 ${getThaiStatus(event.status) === 'เสร็จสิ้น' ? 'bg-slate-500' : 'bg-gradient-to-r from-blue-600 to-cyan-400'}`} 
                    style={{ width: `${event.capacity > 0 ? ((event.sold || 0) / event.capacity) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="hidden md:flex flex-col justify-center gap-2 pl-6 border-l border-slate-800 min-w-[150px]">
             <Link 
                href={`/organizer/detail?id=${event.id}`} 
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-blue-500/10 text-blue-400 hover:bg-blue-600 hover:text-white transition-all text-xs font-bold border border-blue-500/20"
              >
                <Eye size={14} /> ดูข้อมูล
              </Link>
              
              {/* ✅ อัปเดตเงื่อนไขปุ่มแก้ไข ให้กดได้แค่สถานะ กำลังเตรียม และ กำลังจะจัด */}
              {(getThaiStatus(event.status) === 'กำลังเตรียม' || getThaiStatus(event.status) === 'กำลังจะจัด') ? (
                <Link 
                  href={`/organizer/edit-event?id=${event.id}`} 
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white transition-all text-xs font-bold border border-slate-700"
                >
                  <Edit size={14} /> แก้ไขข้อมูล
                </Link>
              ) : (
                <button 
                  disabled 
                  className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-slate-800/50 text-slate-500 cursor-not-allowed text-xs font-bold border border-slate-700/50"
                  title="งานนี้กำลังจัด จัดเสร็จสิ้น หรือยกเลิกไปแล้ว ไม่สามารถแก้ไขได้"
                >
                  <Edit size={14} /> แก้ไขไม่ได้แล้ว
                </button>
              )}

              <button 
                onClick={() => handleDelete(event.id)} 
                className="flex items-center justify-center gap-2 w-full py-2 rounded-lg bg-red-500/5 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold border border-red-500/10"
              >
                <Trash2 size={14} /> ลบ
              </button>
            </div>
          </div>
        )) : (
          <div className="text-center py-24 bg-[#0F172A] rounded-2xl border-2 border-dashed border-slate-800">
            <div className="bg-slate-800/50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar size={32} className="text-slate-600" />
            </div>
            <h3 className="text-white font-bold mb-1">ไม่พบข้อมูลอีเวนต์</h3>
            <p className="text-slate-500 text-sm">คุณยังไม่มีการสร้างอีเวนต์ในระบบ หรือไม่มีงานในสถานะที่เลือก</p>
            <Link href="/organizer/create" className="text-blue-400 text-sm mt-4 inline-block hover:underline">+ เริ่มสร้างอีเวนต์แรกของคุณ</Link>
          </div>
        )}
      </div>
    </div>
  );
}