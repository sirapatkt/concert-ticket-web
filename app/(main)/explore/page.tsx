"use client";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Ticket, SlidersHorizontal, Search } from "lucide-react";

export default function ExplorePage() {
  
  // Mock Data: จำลองรายการอีเวนต์ที่เยอะขึ้น
  const allEvents = [
    {
      id: 2,
      title: "เดอะ แกรนด์ ซิมโฟนี 2026",
      date: "15 JAN 2026",
      venue: "มหิดลสิทธาคาร",
      price: "1,500",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800",
      status: "SELLING FAST",
      statusColor: "bg-orange-500"
    },
    {
      id: 3,
      title: "NEON VIBES FESTIVAL 2026",
      date: "12 FEB 2026",
      venue: "อิมแพ็ค อารีน่า",
      price: "2,500",
      image: "https://images.unsplash.com/photo-1459749411177-0473ef48509d?q=80&w=800",
      status: "",
      statusColor: ""
    },
    {
      id: 4,
      title: "แฟนธอม ออฟ ดิ โอเปร่า",
      date: "01 MAR 2026",
      venue: "เมืองไทยรัชดาลัย",
      price: "3,000",
      image: "https://images.unsplash.com/photo-1514306191717-452ec28c7f42?q=80&w=800",
      status: "",
      statusColor: ""
    },
    {
      id: 5,
      title: "ROCK LEGENDS REUNION",
      date: "20 MAR 2026",
      venue: "ธันเดอร์โดม",
      price: "1,800",
      image: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?q=80&w=800",
      status: "SOLD OUT",
      statusColor: "bg-red-600"
    },
    // --- เพิ่มรายการใหม่ๆ ให้ดูเยอะขึ้น ---
    {
      id: 6,
      title: "JAZZ IN THE GARDEN",
      date: "05 APR 2026",
      venue: "สวนเบญจกิติ",
      price: "850",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800",
      status: "NEW",
      statusColor: "bg-green-500"
    },
    {
      id: 7,
      title: "SUMMER BEACH PARTY",
      date: "13 APR 2026",
      venue: "พัทยา",
      price: "1,200",
      image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=800",
      status: "",
      statusColor: ""
    },
    {
      id: 8,
      title: "STAND UP COMEDY NIGHT",
      date: "20 APR 2026",
      venue: "Lido Connect",
      price: "500",
      image: "https://images.unsplash.com/photo-1585699324551-f6c309eedeca?q=80&w=800",
      status: "",
      statusColor: ""
    },
    {
      id: 9,
      title: "K-POP WORLD TOUR",
      date: "01 MAY 2026",
      venue: "ราชมังคลากีฬาสถาน",
      price: "4,500",
      image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800",
      status: "COMING SOON",
      statusColor: "bg-blue-500"
    }
  ];

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-20">
      
      {/* 🌟 Background Ambient Light */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute top-[50%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Header & Back Button */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">งานแสดงยอดฮิต</h1>
              <p className="text-gray-400 text-sm">ค้นพบอีเวนต์ที่น่าสนใจทั้งหมด</p>
            </div>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="ค้นหาชื่อคอนเสิร์ต..." 
                className="w-full bg-[#161B22] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#161B22] border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">ตัวกรอง</span>
            </button>
          </div>
        </div>

        {/* Categories Tabs */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {["ทั้งหมด", "คอนเสิร์ต", "ละครเวที", "เฟสติวัล", "นิทรรศการ", "กีฬา"].map((cat, i) => (
            <button 
              key={cat}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
                ${i === 0 
                  ? "bg-white text-black border-white" 
                  : "bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 🔥 Event Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {allEvents.map((event) => (
            <Link href={`/event/${event.id}`} key={event.id} className="group block bg-[#161B22] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10">
              <div className="relative h-[280px]">
                <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent opacity-80"></div>
                
                {/* Status Badge */}
                {event.status && (
                  <div className={`absolute top-3 right-3 ${event.statusColor} text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg uppercase`}>
                    {event.status}
                  </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="text-cyan-400 text-xs font-bold mb-1 flex items-center gap-1"><Calendar size={12}/> {event.date}</div>
                  <h3 className="text-lg font-bold leading-tight mb-2 group-hover:text-cyan-300 transition-colors uppercase line-clamp-2">{event.title}</h3>
                  <div className="text-gray-400 text-xs flex items-center gap-1"><MapPin size={12}/> {event.venue}</div>
                </div>
              </div>
              
              <div className="p-4 border-t border-white/5 flex justify-between items-center bg-[#1C222B]">
                <div>
                  <p className="text-xs text-gray-400">ราคาเริ่มต้น</p>
                  <p className="font-bold text-lg">฿{event.price}</p>
                </div>
                <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                  <Ticket size={14} />
                </div>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </div>
  );
}