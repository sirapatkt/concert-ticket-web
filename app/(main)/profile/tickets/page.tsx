"use client";

import React, { useState, useEffect } from "react";
import { Ticket, MapPin, Calendar, Clock, QrCode, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function MyTicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://127.0.0.1:8000/api/bookings", {
          headers: { "Authorization": `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          // แสดงเฉพาะรายการที่จ่ายเงินสำเร็จ
          setTickets(data.filter((t: any) => t.status === "success"));
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTickets();
  }, []);

  if (isLoading) return <div className="min-h-screen bg-[#0B0F14] flex items-center justify-center"><Loader2 className="animate-spin text-blue-500 w-10 h-10" /></div>;

  return (
    <div className="min-h-screen bg-[#0B0F14] pt-24 pb-12 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-white mb-8 flex items-center gap-3 uppercase tracking-tighter">
          <Ticket className="text-blue-500" size={32} /> ตั๋วของฉัน
        </h1>
        
        <div className="space-y-6">
          {tickets.length === 0 ? (
            <div className="text-gray-500 text-center py-20 border border-dashed border-white/10 rounded-2xl">คุณยังไม่มีบัตรที่ชำระเงินสำเร็จ</div>
          ) : (
            tickets.map((ticket) => (
              <div key={ticket.id} className="bg-[#161B22] border border-white/10 rounded-3xl overflow-hidden flex flex-col md:flex-row hover:border-blue-500 transition-all group">
                {/* Image Section - ดึง URL Cloudinary จาก DB */}
                <div className="w-full md:w-52 h-52 md:h-auto relative shrink-0">
                  <img 
                    src={ticket.image || "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000"} 
                    alt={ticket.event_name} 
                    className="w-full h-full object-cover" 
                  />
                </div>
                
                <div className="flex-1 p-7 flex flex-col justify-center">
                  <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors uppercase leading-tight">
                      {ticket.event_name}
                    </h2>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-[10px] font-black rounded-full border border-green-500/20 uppercase">Confirmed</span>
                  </div>

                  <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-sm text-gray-400 mb-6">
                    <div className="flex items-center gap-2 font-medium"><Calendar size={16} className="text-blue-500"/> {ticket.date}</div>
                    <div className="flex items-center gap-2 font-medium"><Clock size={16} className="text-blue-500"/> 19:00 น.</div>
                    <div className="flex items-center gap-2 col-span-2 font-medium"><MapPin size={16} className="text-red-500"/> Impact Arena, Bangkok</div>
                  </div>

                  <div className="bg-[#0B0F14]/50 p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                    <span className="text-gray-500 text-xs font-bold uppercase">ออเดอร์: <span className="text-white">{ticket.order_number}</span></span>
                    <span className="text-blue-400 font-black text-lg">{ticket.amount} THB</span>
                  </div>
                </div>

                <div className="p-8 bg-[#12161B] flex flex-col justify-center items-center gap-5 min-w-[200px] border-l border-white/5">
                   <QrCode size={64} className="text-white bg-white/5 p-2 rounded-lg" />
                   <button 
                    onClick={() => router.push(`/profile/history/${ticket.id}`)}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl text-xs font-black uppercase transition-all shadow-lg active:scale-95"
                   >
                     ดูรายละเอียด
                   </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}