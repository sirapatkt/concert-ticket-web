"use client";
import { Ticket, MapPin, Calendar, Clock, QrCode } from "lucide-react";

export default function MyTicketsPage() {
  // ข้อมูลจำลอง (Mock Data)
  const tickets = [
    {
      id: 1,
      title: "The Grand Symphony 2026",
      date: "15 JAN 2026",
      time: "19:00",
      venue: "Prince Mahidol Hall",
      seat: "Zone A1, Row C, Seat 12",
      price: "2,500 THB",
      image: "https://images.unsplash.com/photo-1465847899078-b413929f7120?q=80&w=1000",
      status: "active"
    },
    {
      id: 2,
      title: "Neon Music Festival",
      date: "20 FEB 2026",
      time: "17:00",
      venue: "BITEC Live",
      seat: "Standing A",
      price: "1,800 THB",
      image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000",
      status: "upcoming"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14] pt-24 pb-12 px-4 md:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
          <Ticket className="text-blue-500" /> ตั๋วของฉัน
        </h1>
        <p className="text-gray-400 mb-8">จัดการและดูรายละเอียดบัตรคอนเสิร์ตของคุณ</p>

        <div className="space-y-6">
          {tickets.map((ticket) => (
            <div key={ticket.id} className="bg-[#161B22] border border-white/10 rounded-2xl overflow-hidden flex flex-col md:flex-row hover:border-blue-500/50 transition-all group">
              {/* Image */}
              <div className="w-full md:w-48 h-48 md:h-auto relative">
                <img src={ticket.image} alt={ticket.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-blue-900/20 group-hover:bg-transparent transition-colors"></div>
              </div>

              {/* Details */}
              <div className="flex-1 p-6 flex flex-col justify-center">
                <div className="flex justify-between items-start mb-2">
                   <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">{ticket.title}</h3>
                   <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-bold rounded-full border border-green-500/20">CONFIRMED</span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 my-3">
                  <div className="flex items-center gap-2"><Calendar size={16} className="text-gray-500"/> {ticket.date}</div>
                  <div className="flex items-center gap-2"><Clock size={16} className="text-gray-500"/> {ticket.time}</div>
                  <div className="flex items-center gap-2 col-span-2"><MapPin size={16} className="text-gray-500"/> {ticket.venue}</div>
                </div>

                <div className="bg-[#0B0F14] p-3 rounded-lg border border-white/5 flex justify-between items-center mt-2">
                   <span className="text-gray-400 text-sm">ที่นั่ง: <span className="text-white font-bold">{ticket.seat}</span></span>
                   <span className="text-blue-400 font-bold">{ticket.price}</span>
                </div>
              </div>

              {/* Action */}
              <div className="p-6 md:border-l border-white/10 flex flex-col justify-center items-center gap-3 min-w-[180px] bg-[#12161B]">
                 <QrCode size={64} className="text-white bg-white/5 p-2 rounded-lg" />
                 <button className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-bold transition-colors shadow-lg shadow-blue-900/20">
                    แสดง E-Ticket
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}