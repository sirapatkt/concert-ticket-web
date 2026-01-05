"use client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Ticket, SlidersHorizontal, Search, Frown, Music, Mic2, Drama, Users } from "lucide-react";
import { useState, useEffect } from "react";

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "ทั้งหมด";

  const [localSearch, setLocalSearch] = useState(query);

  useEffect(() => {
    setLocalSearch(query);
  }, [query]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/explore?q=${encodeURIComponent(localSearch)}&category=${categoryParam}`);
  };

  const handleCategoryChange = (cat: string) => {
    router.push(`/explore?q=${query}&category=${cat}`);
  };

  // ✅ 1. ปรับหมวดหมู่ให้ตรงกับ Navbar (ตัด เฟสติวัล/นิทรรศการ ทิ้ง)
  const categories = ["ทั้งหมด", "คอนเสิร์ต", "แฟนมีตติ้ง", "ละครเวที", "ออร์เคสตรา"];

  // Mock Data (สมมติข้อมูลให้ครอบคลุมหมวดใหม่)
  const allEvents = [
    {
      id: 2,
      title: "The Grand Symphony 2026",
      date: "15 JAN 2026",
      venue: "มหิดลสิทธาคาร",
      price: "1,500",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800",
      status: "SELLING FAST",
      statusColor: "bg-orange-500",
      type: "ออร์เคสตรา" 
    },
    {
      id: 3,
      title: "Summer Sonic Bangkok",
      date: "12 FEB 2026",
      venue: "อิมแพ็ค อารีน่า",
      price: "2,500",
      image: "https://images.unsplash.com/photo-1459749411177-0473ef48509d?q=80&w=800",
      status: "",
      statusColor: "",
      type: "คอนเสิร์ต" // รวมเฟสติวัลเป็นคอนเสิร์ตไปเลย
    },
    {
      id: 4,
      title: "Phantom of the Opera",
      date: "01 MAR 2026",
      venue: "เมืองไทยรัชดาลัย",
      price: "3,000",
      image: "https://images.unsplash.com/photo-1514306191717-452ec28c7f42?q=80&w=800",
      status: "",
      statusColor: "",
      type: "ละครเวที"
    },
    {
      id: 5,
      title: "FAN MEETING: Lovely Day",
      date: "20 MAR 2026",
      venue: "ธันเดอร์โดม",
      price: "1,800",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
      status: "SOLD OUT",
      statusColor: "bg-red-600",
      type: "แฟนมีตติ้ง"
    },
    {
      id: 6,
      title: "JAZZ IN THE GARDEN",
      date: "05 APR 2026",
      venue: "สวนเบญจกิติ",
      price: "850",
      image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800",
      status: "NEW",
      statusColor: "bg-green-500",
      type: "คอนเสิร์ต"
    },
    {
      id: 9,
      title: "K-POP WORLD TOUR",
      date: "01 MAY 2026",
      venue: "ราชมังคลากีฬาสถาน",
      price: "4,500",
      image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800",
      status: "COMING SOON",
      statusColor: "bg-blue-500",
      type: "คอนเสิร์ต"
    }
  ];

  // Logic กรองข้อมูล
  const filteredEvents = allEvents.filter(event => {
    const matchesQuery = query === "" || 
      event.title.toLowerCase().includes(query.toLowerCase()) || 
      event.venue.toLowerCase().includes(query.toLowerCase());

    const matchesCategory = categoryParam === "ทั้งหมด" || categoryParam === event.type;

    return matchesQuery && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-20">
      
      {/* Background */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
         <div className="absolute top-[50%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                {query ? `ผลการค้นหา: "${query}"` : "งานแสดงทั้งหมด"}
              </h1>
              <p className="text-gray-400 text-sm">พบ {filteredEvents.length} รายการ {categoryParam !== "ทั้งหมด" ? `ในหมวด ${categoryParam}` : ""}</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <form onSubmit={handleSearch}>
                <input 
                  type="text" 
                  value={localSearch}
                  onChange={(e) => setLocalSearch(e.target.value)}
                  placeholder="ค้นหาชื่อคอนเสิร์ต..." 
                  className="w-full bg-[#161B22] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 transition-colors"
                />
              </form>
            </div>
            <button className="flex items-center gap-2 px-4 py-2.5 bg-[#161B22] border border-white/10 rounded-xl hover:bg-white/5 transition-colors text-sm font-medium">
              <SlidersHorizontal size={18} />
              <span className="hidden sm:inline">ตัวกรอง</span>
            </button>
          </div>
        </div>

        {/* ✅ 2. Categories Tabs (แก้ไขแล้ว) */}
        <div className="flex gap-3 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {categories.map((cat) => (
            <button 
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all border
                ${categoryParam === cat
                  ? "bg-white text-black border-white shadow-lg shadow-white/10" 
                  : "bg-transparent text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Event Grid */}
        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
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
                    {/* Category Badge Small */}
                    <span className="inline-block bg-white/10 backdrop-blur-md px-2 py-0.5 rounded text-[10px] text-gray-300 mb-2 border border-white/5">
                      {event.type}
                    </span>
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
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-gray-500 border border-white/5 rounded-3xl bg-white/[0.02]">
             <Frown size={48} className="mb-4 opacity-50" />
             <p className="text-lg font-medium">ไม่พบงานแสดงที่คุณค้นหา</p>
             <p className="text-sm mt-1">ลองเปลี่ยนคำค้นหา หรือเลือกหมวดหมู่อื่นดูนะครับ</p>
          </div>
        )}

      </div>
    </div>
  );
}