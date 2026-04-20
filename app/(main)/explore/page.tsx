"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Calendar, MapPin, Ticket, SlidersHorizontal, Search, Frown, Check, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";

// ✅ ฟังก์ชันแยกประเภท โดยเช็คจากทั้ง "ชื่องาน" และ "สถานที่จัดงาน (Venue)"
const getEventType = (name: string, venueName: string = "") => {
  const text = name.toLowerCase(); 
  const venue = venueName.toLowerCase();
  
  // 1. เช็คหมวดหมู่ย่อยจากชื่อก่อน (พวกเทศกาลดนตรี แฟนมีตติ้ง มักจัดที่ Impact)
  if (text.includes("fest") || text.includes("festival") || text.includes("เทศกาลดนตรี")) {
    return "เทศกาลดนตรี";
  }
  if (text.includes("fan") || text.includes("meet") || text.includes("แฟนมีต")) {
    return "แฟนมีตติ้ง";
  }

  // ✅ 2. ถ้าจัดที่ "เมืองไทยรัชดาลัย" ให้เป็น "ละครเวที" ทันที
  if (venue.includes("รัชดาลัย") || text.includes("musical") || text.includes("stage") || text.includes("ละครเวที") || text.includes("จิ๊กซอว์กรรม")) {
    return "ละครเวที";
  }

  // ✅ 3. ถ้าจัดที่ "ศาลาดนตรีสุริยเทพ" ให้เป็น "ออร์เคสตรา" ทันที
  if (venue.includes("สุริยเทพ") || text.includes("orchestra") || text.includes("symphony") || text.includes("philharmonic") || text.includes("ออร์เคสตรา")) {
    return "ออร์เคสตรา";
  }
  
  // ✅ 4. ค่าเริ่มต้น (สำหรับ อิมแพ็ค อารีน่า หรือสถานที่อื่นๆ) ให้เป็น "คอนเสิร์ต"
  return "คอนเสิร์ต"; 
};

// ✅ ฟังก์ชันแปลงสถานะเป็นภาษาไทย กำหนดสี และสิทธิ์การแสดงผล
const getThaiStatusInfo = (status: string) => {
  const s = (status || "UPCOMING").toUpperCase();
  
  if (s === "ON SALE" || s === "ONGOING") {
    return { text: "กำลังจัด", color: "bg-green-500", isVisible: true };
  }
  if (s === "UPCOMING") {
    return { text: "กำลังจะจัด", color: "bg-blue-600", isVisible: true };
  }
  if (s === "SOLD OUT") {
    return { text: "ขายหมดแล้ว", color: "bg-gray-600", isVisible: true }; 
  }
  // ❌ เพิ่มการดักจับคำว่า PENDING, PREPARING, DRAFT, กำลังเตรียม รวมถึง "เสร็จสิ้น" และ "ยกเลิกงาน"
  if (s === "PREPARING" || s === "PENDING" || s === "DRAFT" || s === "กำลังเตรียม" || s.includes("เตรียม") || s === "เสร็จสิ้น" || s === "ยกเลิกงาน") {
    return { text: "กำลังเตรียม", color: "bg-gray-400", isVisible: false }; 
  }
  
  // Default fallback
  return { text: status, color: "bg-blue-600", isVisible: true }; 
};

export default function ExplorePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const query = searchParams.get("q") || "";
  const categoryParam = searchParams.get("category") || "ทั้งหมด";
  
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [localSearch, setLocalSearch] = useState(query);
  const [showFilters, setShowFilters] = useState(false);

  const [sortBy, setSortBy] = useState<"default" | "price_asc" | "price_desc">("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [onlyAvailable, setOnlyAvailable] = useState(false);

  useEffect(() => {
    const fetchEvents = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/public/events?search=${query}`);
        const data = await res.json();

        const formattedEvents = data.map((item: any) => {
          // 1. ดึงราคาต่ำสุด
          const prices = item.ticket_zones?.map((z: any) => parseFloat(z.priceperTick)) || [];
          const minPriceVal = prices.length > 0 ? Math.min(...prices) : 0;
          
          // 2. ดึงวันที่แสดงผล
          let dateStr = "TBA";
          if (item.event_date_times && item.event_date_times.length > 0) {
            const eventDate = new Date(item.event_date_times[0].startDT);
            dateStr = eventDate.toLocaleDateString('en-GB', {
              day: '2-digit', month: 'short', year: 'numeric'
            });
          }

          // 3. จัดการรูปภาพ
          let imageUrl = "https://via.placeholder.com/800x400?text=No+Image";
          if (item.bannerImage) {
            imageUrl = item.bannerImage.startsWith('http') 
              ? item.bannerImage 
              : `http://127.0.0.1:8000/storage/${item.bannerImage}`;
          }

          // 4. ดึงข้อมูลสถานะที่แปลงแล้ว
          const statusInfo = getThaiStatusInfo(item.eventStatus);

          return {
            id: item.Event_id,
            title: item.eventName,
            date: dateStr.toUpperCase(),
            venue: item.hall?.Hall_Name || "TBA",
            price: minPriceVal,
            image: imageUrl,
            // ✅ ส่งชื่อสถานที่เข้าไปให้ฟังก์ชัน getEventType ช่วยเช็ค
            type: getEventType(item.eventName, item.hall?.Hall_Name || ""),
            
            // นำข้อมูลสถานะที่ได้มาใช้งาน
            status: statusInfo.text,
            statusColor: statusInfo.color,
            isVisible: statusInfo.isVisible,
            isSoldOut: (item.eventStatus || "").toUpperCase() === "SOLD OUT"
          };
        })
        // 5. กรองเอาเฉพาะข้อมูลที่ isVisible เป็น true เท่านั้น
        .filter((event: any) => event.isVisible);

        setEvents(formattedEvents);
      } catch (error) {
        console.error("Failed to fetch events:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [query]);

  // ฟังก์ชัน Search & Filter คงเดิม
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/explore?q=${encodeURIComponent(localSearch)}&category=${categoryParam}`);
  };

  const handleCategoryChange = (cat: string) => {
    router.push(`/explore?q=${query}&category=${cat}`);
  };

  const categories = ["ทั้งหมด", "คอนเสิร์ต", "เทศกาลดนตรี", "แฟนมีตติ้ง", "ละครเวที", "ออร์เคสตรา"];

  const filteredEvents = events
    .filter(event => {
      if (!event.isVisible) return false;
      
      const matchesCategory = categoryParam === "ทั้งหมด" || event.type === categoryParam;
      const matchesMinPrice = minPrice === "" || event.price >= parseInt(minPrice);
      const matchesMaxPrice = maxPrice === "" || event.price <= parseInt(maxPrice);
      const matchesAvailability = onlyAvailable ? !event.isSoldOut : true;
      return matchesCategory && matchesMinPrice && matchesMaxPrice && matchesAvailability;
    })
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return 0;
    });

  const clearFilters = () => {
    setMinPrice(""); setMaxPrice(""); setOnlyAvailable(false);
    setSortBy("default"); setShowFilters(false);
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-20">
      {/* Background Blurs */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px]"></div>
          <div className="absolute top-[50%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 pt-20">
          <div className="flex items-center gap-4">
            <Link href="/" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10">
              <ArrowLeft size={24} />
            </Link>
            <div>
              <h1 className="text-3xl font-bold">
                {query ? `ผลการค้นหา: "${query}"` : "งานแสดงทั้งหมด"}
              </h1>
              <p className="text-gray-400 text-sm">
                {loading ? "กำลังโหลด..." : `พบ ${filteredEvents.length} รายการ`}
              </p>
            </div>
          </div>

          {/* Search & Filter Bar */}
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
            
            <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-2 px-4 py-2.5 bg-[#161B22] border rounded-xl transition-colors text-sm font-medium ${showFilters ? 'border-blue-500 text-blue-400' : 'border-white/10 hover:bg-white/5'}`}
            >
                <SlidersHorizontal size={18} />
                <span className="hidden sm:inline">ตัวกรอง</span>
            </button>

            {/* Filter Dropdown */}
            {showFilters && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-[#1C222B] border border-white/10 rounded-xl shadow-2xl z-50 p-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="mb-4">
                        <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider">เรียงตามราคา</p>
                        <div className="flex bg-black/20 p-1 rounded-lg">
                            <button onClick={() => setSortBy("default")} className={`flex-1 py-1.5 text-xs rounded-md text-center ${sortBy === 'default' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>ทั่วไป</button>
                            <button onClick={() => setSortBy("price_asc")} className={`flex-1 py-1.5 text-xs rounded-md text-center ${sortBy === 'price_asc' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>ต่ำ ➝ สูง</button>
                            <button onClick={() => setSortBy("price_desc")} className={`flex-1 py-1.5 text-xs rounded-md text-center ${sortBy === 'price_desc' ? 'bg-white/10 text-white' : 'text-gray-400'}`}>สูง ➝ ต่ำ</button>
                        </div>
                    </div>
                    <div className="mb-4">
                        <p className="text-[10px] text-gray-500 mb-2 font-bold uppercase tracking-wider">งบประมาณ (บาท)</p>
                        <div className="flex gap-2">
                            <input type="number" placeholder="ต่ำสุด" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-1/2 bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none" />
                            <input type="number" placeholder="สูงสุด" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-1/2 bg-black/20 border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white outline-none" />
                        </div>
                    </div>
                    <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <label className="flex items-center gap-2 cursor-pointer group">
                            <div className={`w-4 h-4 rounded border flex items-center justify-center ${onlyAvailable ? 'bg-blue-500 border-blue-500' : 'border-gray-500'}`}>
                                {onlyAvailable && <Check size={10} className="text-white" />}
                            </div>
                            <span className="text-xs text-gray-300">เฉพาะบัตรว่าง</span>
                            <input type="checkbox" className="hidden" checked={onlyAvailable} onChange={() => setOnlyAvailable(!onlyAvailable)} />
                        </label>
                        <button onClick={clearFilters} className="text-[10px] text-gray-500 hover:text-white underline">ล้างค่า</button>
                    </div>
                </div>
            )}
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
                  ? "bg-white text-black border-white shadow-lg" 
                  : "bg-transparent text-gray-400 border-white/10 hover:text-white"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Event Grid */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin text-blue-500 mb-4" size={40} />
            <p className="text-gray-400">กำลังดึงข้อมูลจากระบบ...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <Link href={`/event/${event.id}`} key={event.id} className={`group block bg-[#161B22] rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1 ${event.isSoldOut ? 'opacity-60 grayscale-[0.5]' : ''}`}>
                <div className="relative h-[280px]">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#161B22] via-transparent to-transparent opacity-80"></div>
                  
                  {/* แสดงป้ายสถานะ (ที่ถูกแปลงเป็นภาษาไทยเรียบร้อยแล้ว) */}
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
                    <p className="font-bold text-lg">฿{event.price.toLocaleString()}</p>
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