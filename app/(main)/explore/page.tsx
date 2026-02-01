"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Ticket, SlidersHorizontal, Search, Frown, Check, X } from "lucide-react";
import { useState, useEffect } from "react";

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "ทั้งหมด";
  
  // State หลัก
  const [localSearch, setLocalSearch] = useState(query);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc">("default");
  
  // State ตัวกรอง
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

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

  const categories = ["ทั้งหมด", "คอนเสิร์ต", "แฟนมีตติ้ง", "ละครเวที", "ออร์เคสตรา"];

  // ✅ รวมมิตรงานทั้งหมด (ของเดิม + Jeff Satur ชุดใหญ่)
  const allEvents = [
    // --- 🌟 งานของ Jeff Satur (เพิ่มใหม่) ---
    {
        id: 1, 
        title: "est Cola Presents JEFF SATUR: SPACE SHUTTLE NO.8 ASIA TOUR",
        date: "20 APR 2026",
        venue: "UOB Live, Emsphere",
        price: "2,500",
        image: "https://thestandard.co/wp-content/uploads/2024/01/Jeff-Satur-Space-Shuttle-No.8-Asia-Tour.jpg",
        status: "HOT",
        statusColor: "bg-red-500",
        type: "คอนเสิร์ต",
        isSoldOut: false
    },
    {
        id: 101,
        title: "The Kingdoms Concert (Nont Tanont, Bright, The Toys, Jeff Satur)",
        date: "01 JUN 2026",
        venue: "IMPACT Arena",
        price: "3,000",
        image: "https://s.isanook.com/jo/0/ud/491/2459795/thekingdoms.jpg", 
        status: "SELLING FAST",
        statusColor: "bg-orange-500",
        type: "คอนเสิร์ต",
        isSoldOut: false
    },
    {
        id: 102,
        title: "JEFF SATUR LIVE ON SATURN : FIRST SOLO CONCERT",
        date: "15 OCT 2026",
        venue: "Royal Paragon Hall",
        price: "1,500",
        image: "https://mpics.mgronline.com/pics/Images/566000001592601.JPEG",
        status: "LEGENDARY",
        statusColor: "bg-purple-500",
        type: "คอนเสิร์ต",
        isSoldOut: false
    },
    {
        id: 103,
        title: "KinnPorsche The Series World Tour 2026",
        date: "25 JUL 2026", 
        venue: "IMPACT Arena",
        price: "1,500",
        image: "https://f.ptcdn.info/687/077/000/rdk02220r03O3o7249v-o.jpg",
        status: "WORLD TOUR",
        statusColor: "bg-blue-600",
        type: "แฟนมีตติ้ง",
        isSoldOut: false
    },
    {
        id: 104,
        title: "Cat Expo 10 (Jeff Satur Live)",
        date: "24 NOV 2026",
        venue: "Wonder World Extreme Park",
        price: "1,600",
        image: "https://img.kapook.com/u/2023/wanwanat/48366436666_5f91e3e098_c.jpg",
        status: "FESTIVAL",
        statusColor: "bg-green-500",
        type: "คอนเสิร์ต",
        isSoldOut: false
    },
    {
        id: 105,
        title: "JEFF SATUR: HAPPY SATURDAY FAN MEETING",
        date: "14 FEB 2026",
        venue: "Union Hall",
        price: "900",
        image: "https://pbs.twimg.com/media/Fj5y9uXUUAEi_tT.jpg",
        status: "SOLD OUT",
        statusColor: "bg-gray-500",
        type: "แฟนมีตติ้ง",
        isSoldOut: true
    },

    // --- 🏛️ งานเดิมของคุณ (เก็บไว้ครบ) ---
    {
      id: 2,
      title: "The Grand Symphony 2026",
      date: "15 JAN 2026",
      venue: "มหิดลสิทธาคาร",
      price: "1,500",
      image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=800",
      status: "SELLING FAST",
      statusColor: "bg-orange-500",
      type: "ออร์เคสตรา",
      isSoldOut: false
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
      type: "คอนเสิร์ต",
      isSoldOut: false
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
      type: "ละครเวที",
      isSoldOut: false
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
      type: "แฟนมีตติ้ง",
      isSoldOut: true
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
      type: "คอนเสิร์ต",
      isSoldOut: false
    }
  ];

  const parseEventDate = (dateStr: string) => {
    const months: { [key: string]: number } = { JAN: 0, FEB: 1, MAR: 2, APR: 3, MAY: 4, JUN: 5, JUL: 6, AUG: 7, SEP: 8, OCT: 9, NOV: 10, DEC: 11 };
    const parts = dateStr.split(" ");
    if(parts.length !== 3) return new Date();
    return new Date(parseInt(parts[2]), months[parts[1].toUpperCase()], parseInt(parts[0]));
  };

  const filteredEvents = allEvents
    .filter(event => {
      const matchesQuery = query === "" || 
        event.title.toLowerCase().includes(query.toLowerCase()) || 
        event.venue.toLowerCase().includes(query.toLowerCase());
      const matchesCategory = categoryParam === "ทั้งหมด" || categoryParam === event.type;
      const eventPrice = parseInt(event.price.replace(/,/g, ''));
      const matchesMinPrice = minPrice === "" || eventPrice >= parseInt(minPrice);
      const matchesMaxPrice = maxPrice === "" || eventPrice <= parseInt(maxPrice);
      const matchesAvailability = onlyAvailable ? !event.isSoldOut : true;
      const eventDate = parseEventDate(event.date);
      const matchesStartDate = startDate === "" || eventDate >= new Date(startDate);
      const matchesEndDate = endDate === "" || eventDate <= new Date(endDate);

      return matchesQuery && matchesCategory && matchesMinPrice && matchesMaxPrice && matchesAvailability && matchesStartDate && matchesEndDate;
    })
    .sort((a, b) => {
        const priceA = parseInt(a.price.replace(/,/g, ''));
        const priceB = parseInt(b.price.replace(/,/g, ''));
        if (sortBy === "price_asc") return priceA - priceB;
        if (sortBy === "price_desc") return priceB - priceA;
        return 0;
    });

  const clearFilters = () => {
    setMinPrice("");
    setMaxPrice("");
    setStartDate("");
    setEndDate("");
    setOnlyAvailable(false);
    setSortBy("default");
    setShowFilters(false);
  };

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

          <div className="flex gap-3 w-full md:w-auto relative">
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
            
            {/* ปุ่มตัวกรอง */}
            <div className="relative">
                <button 
                    onClick={() => setShowFilters(!showFilters)}
                    className={`flex items-center gap-2 px-4 py-2.5 bg-[#161B22] border rounded-xl transition-colors text-sm font-medium ${showFilters ? 'border-blue-500 text-blue-400' : 'border-white/10 hover:bg-white/5'}`}
                >
                    <SlidersHorizontal size={18} />
                    <span className="hidden sm:inline">ตัวกรอง</span>
                </button>

                {/* Dropdown Menu */}
                {showFilters && (
                    <div className="absolute right-0 top-full mt-2 w-80 bg-[#1C222B] border border-white/10 rounded-xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                        
                        {/* 1. Sort By */}
                        <div className="mb-4">
                            <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider">เรียงตามราคา</p>
                            <div className="flex bg-black/20 p-1 rounded-lg">
                                <button onClick={() => setSortBy("default")} className={`flex-1 py-1.5 text-xs rounded-md text-center transition-all ${sortBy === 'default' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}>ทั่วไป</button>
                                <button onClick={() => setSortBy("price_asc")} className={`flex-1 py-1.5 text-xs rounded-md text-center transition-all ${sortBy === 'price_asc' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}>ต่ำ ➝ สูง</button>
                                <button onClick={() => setSortBy("price_desc")} className={`flex-1 py-1.5 text-xs rounded-md text-center transition-all ${sortBy === 'price_desc' ? 'bg-white/10 text-white shadow-sm' : 'text-gray-400 hover:text-white'}`}>สูง ➝ ต่ำ</button>
                            </div>
                        </div>

                        <hr className="border-white/5 mb-4" />

                        {/* 2. Date Range */}
                        <div className="mb-4">
                            <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider">ช่วงวันแสดง</p>
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <input 
                                        type="date" 
                                        value={startDate}
                                        onChange={(e) => setStartDate(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                                <div>
                                    <input 
                                        type="date" 
                                        value={endDate}
                                        onChange={(e) => setEndDate(e.target.value)}
                                        className="w-full bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-blue-500 outline-none"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* 3. Price Range */}
                        <div className="mb-4">
                            <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider">งบประมาณ (บาท)</p>
                            <div className="flex gap-2">
                                <input 
                                    type="number" 
                                    placeholder="ต่ำสุด" 
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-1/2 bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-blue-500 outline-none placeholder:text-gray-600"
                                />
                                <input 
                                    type="number" 
                                    placeholder="สูงสุด" 
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-1/2 bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:border-blue-500 outline-none placeholder:text-gray-600"
                                />
                            </div>
                        </div>

                        <hr className="border-white/5 mb-4" />

                        {/* 4. Actions */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${onlyAvailable ? 'bg-blue-500 border-blue-500' : 'border-gray-500 group-hover:border-white'}`}>
                                    {onlyAvailable && <Check size={10} className="text-white" />}
                                </div>
                                <span className="text-xs text-gray-300 group-hover:text-white">เฉพาะบัตรว่าง</span>
                                <input type="checkbox" className="hidden" checked={onlyAvailable} onChange={() => setOnlyAvailable(!onlyAvailable)} />
                            </label>

                            <button 
                                onClick={clearFilters}
                                className="text-[10px] text-gray-500 hover:text-white underline transition-colors"
                            >
                                ล้างค่า
                            </button>
                        </div>
                    </div>
                )}
            </div>
          </div>
        </div>

        {/* Categories Tabs */}
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
              <Link href={`/event/${event.id}`} key={event.id} className={`group block bg-[#161B22] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-purple-500/10 ${event.isSoldOut ? 'opacity-60 grayscale-[0.5]' : ''}`}>
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
             <p className="text-lg font-medium">ไม่พบงานแสดงที่ตรงกับเงื่อนไข</p>
             <button onClick={clearFilters} className="text-sm mt-2 text-blue-400 hover:underline">ล้างตัวกรองทั้งหมด</button>
          </div>
        )}

      </div>
    </div>
  );
}