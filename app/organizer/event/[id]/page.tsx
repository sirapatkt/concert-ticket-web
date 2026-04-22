"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, Calendar, MapPin, Users, Ticket, LayoutList } from 'lucide-react';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id; 
  
  const [eventData, setEventData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [attendees, setAttendees] = useState<any[]>([]);
  const [loadingAttendees, setLoadingAttendees] = useState(true);

  useEffect(() => {
    const fetchEventDetail = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/organizer/events/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEventData(data);
          fetchAttendees(token, data.eventName);
        }
      } catch (err) {
        console.error("Error fetching event details:", err);
      } finally {
        setLoading(false);
      }
    };

    const fetchAttendees = async (token: string | null, currentEventName: string) => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/organizer/attendees`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const allAttendees = await res.json();
          const eventAttendees = allAttendees.filter((a: any) => a.event === currentEventName || a.eventName === currentEventName);
          setAttendees(eventAttendees);
        }
      } catch (err) {
        console.error("Error fetching attendees:", err);
      } finally {
        setLoadingAttendees(false);
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

  const displayStatus = eventData.calculated_status || eventData.eventStatus;

  return (
    <div className="p-4 md:p-8 w-full max-w-[1920px] mx-auto space-y-6">
      
      <button 
        onClick={() => router.back()} 
        className="flex items-center text-slate-400 hover:text-white transition-colors w-fit group"
      >
        <ArrowLeft size={20} className="mr-2 group-hover:-translate-x-1 transition-transform" /> 
        กลับไปหน้าแดชบอร์ด
      </button>

      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 p-6 md:p-8 shadow-xl relative overflow-hidden">
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white mb-3 tracking-tight">{eventData.eventName}</h1>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${
              displayStatus === 'เสร็จสิ้น' ? 'bg-green-500/20 text-green-400 border border-green-500/30 shadow-[0_0_10px_rgba(34,197,94,0.2)]' : 
              displayStatus === 'กำลังเตรียม' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 shadow-[0_0_10px_rgba(234,179,8,0.2)]' :
              'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
            }`}>
              สถานะ: {displayStatus}
            </span>
          </div>
          
          <div className="flex gap-3">
             <button className="px-5 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-500 transition-all shadow-lg active:scale-95 text-sm">
               แก้ไขข้อมูลงาน
             </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-10 border-t border-slate-800/80 pt-8 relative z-10">
          <div className="flex items-center gap-4 bg-[#161B22]/50 p-4 rounded-xl border border-white/5">
            <div className="p-3 bg-blue-500/10 text-blue-400 rounded-lg shrink-0"><Calendar size={24} /></div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">วันที่จัดงาน</p>
              <p className="text-white font-medium">{new Date(eventData.rental_start).toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-[#161B22]/50 p-4 rounded-xl border border-white/5">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-lg shrink-0"><MapPin size={24} /></div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">สถานที่</p>
              <p className="text-white font-medium line-clamp-1" title={eventData.hall?.Hall_Name}>{eventData.hall?.Hall_Name || 'ไม่ระบุสถานที่'}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 bg-[#161B22]/50 p-4 rounded-xl border border-white/5">
            <div className="p-3 bg-pink-500/10 text-pink-400 rounded-lg shrink-0"><Ticket size={24} /></div>
            <div>
              <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">จำกัดการซื้อ</p>
              <p className="text-white font-medium">5 ใบ / บัญชี</p>
            </div>
          </div>
        </div>

        {eventData.ticket_zones && eventData.ticket_zones.length > 0 && (
          <div className="mt-10 border-t border-slate-800/80 pt-8 relative z-10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <LayoutList className="text-cyan-400" size={20}/> สรุปยอดขายรายโซน (Zone Summary)
            </h3>
            <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#0B0F14]">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <tr>
                    <th className="p-4 font-semibold uppercase tracking-wider text-xs">ชื่อโซน (Zone)</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-xs">ราคา</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-xs text-center">ความจุทั้งหมด</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-xs text-center text-cyan-400">ขายแล้ว</th>
                    <th className="p-4 font-semibold uppercase tracking-wider text-xs text-center text-pink-400">คงเหลือ</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  {eventData.ticket_zones.map((zone: any, idx: number) => {
                    const sold = zone.totalSeat - zone.remainSeat;
                    return (
                      <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                        <td className="p-4 text-white font-bold flex items-center gap-2">
                          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: zone.colorZone || '#ccc'}}></span>
                          {zone.zoneName}
                        </td>
                        <td className="p-4 text-green-400 font-mono">฿{Number(zone.priceperTick).toLocaleString()}</td>
                        <td className="p-4 text-center text-slate-300 font-medium">{zone.totalSeat}</td>
                        <td className="p-4 text-center text-cyan-400 font-bold text-base">{sold}</td>
                        <td className="p-4 text-center text-pink-400 font-bold">{zone.remainSeat}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 🌟 ส่วนตารางรายชื่อผู้เข้าร่วมที่เพิ่มคอลัมน์ที่นั่ง */}
        <div className="mt-10 border-t border-slate-800/80 pt-8 relative z-10">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <Users className="text-purple-400" size={20} /> รายชื่อผู้จองบัตร (Attendees)
                </h3>
                <span className="text-xs text-slate-400 bg-slate-800 px-3 py-1 rounded-full">
                  ทั้งหมด {attendees.length} รายการ
                </span>
            </div>
            
            <div className="bg-[#0B0F14] border border-slate-800 rounded-xl overflow-hidden shadow-inner">
                {loadingAttendees ? (
                    <div className="p-12 text-center text-slate-400 flex flex-col items-center">
                        <Loader2 className="animate-spin mb-3 text-purple-500" size={32} /> 
                        กำลังโหลดรายชื่อผู้จอง...
                    </div>
                ) : attendees.length > 0 ? (
                    <div className="overflow-x-auto max-h-[500px] custom-scrollbar">
                        <table className="w-full text-left text-sm relative">
                            <thead className="bg-slate-900/90 text-slate-400 sticky top-0 z-20 shadow-md backdrop-blur-sm">
                                <tr>
                                    <th className="p-4 font-semibold uppercase tracking-wider text-xs border-b border-slate-700">รหัสออเดอร์</th>
                                    <th className="p-4 font-semibold uppercase tracking-wider text-xs border-b border-slate-700">ชื่อลูกค้า</th>
                                    <th className="p-4 font-semibold uppercase tracking-wider text-xs border-b border-slate-700">อีเมล</th>
                                    <th className="p-4 font-semibold uppercase tracking-wider text-xs border-b border-slate-700 text-center">โซน</th>
                                    {/* ✅ คอลัมน์ที่นั่งที่เพิ่มมา */}
                                    <th className="p-4 font-semibold uppercase tracking-wider text-xs border-b border-slate-700 text-center">ที่นั่ง</th>
                                    <th className="p-4 font-semibold uppercase tracking-wider text-xs border-b border-slate-700 text-center">สถานะ</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {attendees.map((person, idx) => (
                                    <tr key={idx} className="hover:bg-slate-800/40 transition-colors">
                                        <td className="p-4 text-slate-400 font-mono text-xs">#{person.id}</td>
                                        <td className="p-4 text-white font-medium capitalize">{person.name || person.firstname}</td>
                                        <td className="p-4 text-slate-400 text-xs">{person.email}</td>
                                        <td className="p-4 text-center">
                                            <span className="bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded font-bold text-xs">
                                              {person.ticket}
                                            </span>
                                        </td>
                                        {/* ✅ นำเลขที่นั่งจาก API มาโชว์ */}
                                        <td className="p-4 text-center max-w-[120px]">
                                            <span className="text-white font-mono text-xs bg-white/5 px-2 py-1 rounded border border-white/10 break-words">
                                                {person.seats || '-'}
                                            </span>
                                        </td>
                                        <td className="p-4 text-center">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                                person.status === 'paid' || person.status === 'ชำระเงินแล้ว'
                                                ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                                                : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                                            }`}>
                                                {person.status === 'paid' || person.status === 'ชำระเงินแล้ว' ? 'ชำระเงินแล้ว' : 'รอชำระเงิน'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="p-16 text-center text-slate-500 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                          <Users size={32} className="opacity-50" />
                        </div>
                        <p className="text-lg font-medium text-white mb-1">ยังไม่มีผู้จองบัตร</p>
                        <p className="text-sm">เมื่อมีการทำรายการสั่งซื้อ รายชื่อลูกค้าจะปรากฏที่นี่</p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </div>
  );
}