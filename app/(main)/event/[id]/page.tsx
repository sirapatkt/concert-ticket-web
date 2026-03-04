"use client";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Ticket, Check, Info, CalendarDays, MapPin, Map } from "lucide-react";
import { useUser } from "@/context/UserContext"; 

// ==========================================
// 1. Interfaces
// ==========================================
interface ApiEvent {
  Event_id: number;
  eventName: string;
  eventDescription: string;
  rental_start: string;
  venue_name?: string; 
  bannerImage: string | null;
  eventStatus: string;
  venueSize?: string;
  venue_size?: string;
  Hall_id?: number;
  hall?: {
    Hall_id: number;
    Hall_Name: string;
  };
  event_date_times?: {
    Datetime_id: number; 
    startDT: string;     
    endDT: string;       
    Sale_startDT: string; 
    Sale_endDT: string;   
  }[];
  ticket_zones?: {
    id: number;
    zoneName: string;
    priceperTick: number;
    capacity: number;
    totalSeat?: number;
  }[];
}

interface UiEvent {
  id: number;
  title: string;
  venue: string;
  hallId: string;
  venueSize: string;
  image: string;
  description: string;
  category: string;
  rounds: { 
    id: number; 
    date: string; 
    time: string;
    saleStart: Date; 
    saleEnd: Date;   
  }[];
  priceTiers: { id: number; price: number; color: string; textColor?: string }[];
  zones: { name: string; tierId: number; price: number; quantity: number }[];
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const context = useUser();
  const isLoggedIn = !!context?.user;

  const [event, setEvent] = useState<UiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const [selectedRoundId, setSelectedRoundId] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // ✅ 2. ฟังก์ชันประเมินขนาดสถานที่อัตโนมัติ
  const detectVenueSize = (hallId: string, zoneCount: number) => {
    if (hallId === "1") { 
      if (zoneCount > 20) return "Large";
      if (zoneCount > 8) return "Medium";
      return "Small";
    } 
    else if (hallId === "2") { 
      if (zoneCount > 26) return "Large";
      if (zoneCount > 14) return "Medium";
      return "Small";
    } 
    else if (hallId === "3") { 
      if (zoneCount > 12) return "Large";
      if (zoneCount > 6) return "Medium";
      return "Small";
    }
    return "Small"; 
  };

  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/public/events/${id}`);
        if (!res.ok) throw new Error("Event not found");

        const data: ApiEvent = await res.json();

        const currentHallId = data.Hall_id?.toString() || data.hall?.Hall_id?.toString() || "3";
        const zoneCount = data.ticket_zones?.length || 0;
        
        let activeVenueSize = data.venueSize || data.venue_size;
        if (!activeVenueSize) activeVenueSize = detectVenueSize(currentHallId, zoneCount);
        const formattedVenueSize = activeVenueSize.charAt(0).toUpperCase() + activeVenueSize.slice(1).toLowerCase();

        const rounds = data.event_date_times?.map((dt) => {
          const dateObj = new Date(dt.startDT); 
          return {
              id: dt.Datetime_id, 
              date: dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
              time: `${dt.startDT.split(' ')[1].slice(0, 5)} - ${dt.endDT.split(' ')[1].slice(0, 5)}`,
              saleStart: new Date(dt.Sale_startDT), 
              saleEnd: new Date(dt.Sale_endDT)
          };
        }) || [];

        const colors = ["bg-[#8BC34A]", "bg-[#21358F]", "bg-[#ED1C24]", "bg-[#C54E9D]", "bg-[#4CCED0]", "bg-[#662D91]"];
        const uniquePrices = Array.from(new Set(data.ticket_zones?.map(z => z.priceperTick) || [])).sort((a, b) => b - a);
        
        const priceTiers = uniquePrices.map((price, index) => ({
            id: index + 1, 
            price: price,
            color: colors[index % colors.length] || "bg-gray-500",
            textColor: "text-white"
        }));

        const zones = data.ticket_zones?.map(z => {
            const tier = priceTiers.find(t => t.price === z.priceperTick);
            return {
                name: z.zoneName,
                tierId: tier?.id || 0,
                price: z.priceperTick,
                quantity: z.capacity || z.totalSeat || 0 
            };
        }) || [];

        const formattedEvent: UiEvent = {
            id: data.Event_id,
            title: data.eventName,
            venue: data.hall?.Hall_Name || "Location TBA",
            hallId: currentHallId,
            venueSize: formattedVenueSize,
            image: data.bannerImage 
                ? `http://127.0.0.1:8000/storage/${data.bannerImage}` 
                : "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80", 
            description: data.eventDescription || "ไม่มีรายละเอียด",
            category: "Concert", 
            rounds: rounds,
            priceTiers: priceTiers,
            zones: zones
        };

        setEvent(formattedEvent);
      } catch (err) {
        console.error(err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetail();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-[#0B0F14] text-white flex items-center justify-center animate-pulse">กำลังโหลดข้อมูล...</div>;
  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">ไม่พบงานแสดงที่คุณค้นหา</h1>
        <Link href="/" className="text-pink-500 hover:underline">กลับหน้าหลัก</Link>
      </div>
    );
  }

  const currentRound = event.rounds.find((r) => r.id === selectedRoundId);

  const requireAuth = (action: () => void) => {
    if (!isLoggedIn) router.push(`/login?redirect=/event/${id}`);
    else action();
  };

  // ✅ 3. ฟังก์ชันหลัก: เมื่อกดผังปุ๊บ สั่ง Redirect ปั๊บ!
  const handleZoneClick = (zoneName: string, tierPrice: number) => {
    // เช็คว่าเลือกรอบหรือยัง
    if (selectedRoundId === 0) {
        alert("กรุณาเลือกรอบการแสดงที่ต้องการ ก่อนทำการคลิกเลือกโซนที่แผนผังครับ");
        return;
    }

    if (!currentRound) return;

    // เช็คเวลาการขาย
    if (currentTime < currentRound.saleStart) {
        alert(`รอบนี้ยังไม่เปิดขายบัตรครับ\nเปิดขายวันที่: ${currentRound.saleStart.toLocaleString('th-TH')}`);
        return;
    }
    if (currentTime > currentRound.saleEnd) {
        alert("รอบการแสดงนี้ปิดการขายบัตรไปแล้วครับ");
        return;
    }

    // ถ้าผ่านเงื่อนไข ให้ไปหน้าเลือกที่นั่งหรือล็อกอินทันที
    if (!isLoggedIn) {
        router.push(`/login?redirect=/event/${id}`);
    } else {
        router.push(`/booking/select-seat?eventId=${id}&round=${selectedRoundId}&zone=${zoneName}&price=${tierPrice}`);
    }
  };

  // เช็คสถานะปุ่มและคำเตือน
  let isSaleOpen = false;
  let summaryStatusText = "กรุณาเลือกรอบ และคลิกโซนบนแผนผัง";
  let summaryStatusClass = "bg-gray-800 text-gray-500 cursor-not-allowed";

  if (currentRound) {
    if (currentTime < currentRound.saleStart) {
      summaryStatusText = `เปิดขาย: ${currentRound.saleStart.toLocaleString('th-TH', { dateStyle: 'short', timeStyle: 'short' })}`;
      summaryStatusClass = "bg-yellow-600/20 text-yellow-500 border border-yellow-600/50";
    } else if (currentTime > currentRound.saleEnd) {
      summaryStatusText = "ปิดการขายบัตรแล้ว";
      summaryStatusClass = "bg-red-900/40 text-red-400 border border-red-900/50";
    } else {
      isSaleOpen = true;
      summaryStatusText = "✨ กรุณาคลิกเลือกโซนบนแผนผังเพื่อจองบัตร";
      summaryStatusClass = "bg-gradient-to-r from-pink-600 to-purple-600 text-white animate-pulse shadow-lg shadow-pink-500/40";
    }
  }

  // ==========================================
  // ✅ 4. ระบบวาดผังด้วย CSS Grid ล้วนๆ (รับข้อมูลจาก API)
  // ==========================================
  const renderZoneButton = (zoneName: string) => {
    const zone = event.zones.find(z => z.name.toUpperCase() === zoneName.toUpperCase());
    
    // ถ้าไม่มีโซนนี้ในระบบ ให้ Render เป็นที่ว่างเพื่อรักษาโครงสร้าง Grid
    if (!zone) {
        return <div key={zoneName} className="opacity-0 pointer-events-none h-16"></div>;
    }

    const tier = event.priceTiers.find((t) => t.id === zone.tierId);
    
    // จัดการปาดมุมเฉพาะโซนขอบของ รัชดาลัย
    let clipPathStyle = {};
    if (event.hallId === "3") {
        if (zoneName === 'L1') clipPathStyle = { clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 40%)' };
        if (zoneName === 'R1') clipPathStyle = { clipPath: 'polygon(0% 0%, 75% 0%, 100% 40%, 100% 100%, 0% 100%)' };
        if (zoneName === 'L5') clipPathStyle = { clipPath: 'polygon(25% 0%, 100% 0%, 100% 100%, 0% 100%, 0% 40%)' };
        if (zoneName === 'R5') clipPathStyle = { clipPath: 'polygon(0% 0%, 75% 0%, 100% 40%, 100% 100%, 0% 100%)' };
    }

    return (
      <button
        key={zone.name}
        onClick={() => handleZoneClick(zone.name, zone.price)}
        style={clipPathStyle}
        className={`flex flex-col items-center justify-center min-h-[5rem] md:min-h-[6rem] py-2 px-2 text-center font-black text-white transition-all relative overflow-hidden rounded-sm hover:scale-[1.03] hover:z-10 focus:ring-4 ring-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
          ${tier?.color || 'bg-gray-700'} 
        `}
      >
        <span className="relative z-10 drop-shadow-md text-xl md:text-3xl tracking-widest">{zone.name}</span>
        <span className="relative z-10 drop-shadow-md text-xs md:text-sm font-medium mt-1 opacity-90">฿{zone.price.toLocaleString()}</span>
      </button>
    );
  };

  const renderInteractiveMap = () => {
    if (event.zones.length === 0) return <p className="text-slate-500 font-medium">ไม่พบข้อมูลโซนที่นั่ง</p>;

    // 📌 โครงสร้างสำหรับ เมืองไทยรัชดาลัย (Hall 3)
    if (event.hallId === "3") {
      let rows = [1, 2]; // Small
      if (event.venueSize === "Medium") rows = [1, 2, 3, 4];
      if (event.venueSize === "Large") rows = [1, 2, 3, 4, 5, 6];

      return (
        <div className="w-full flex flex-col items-center justify-center p-4 relative z-10">
          <div className="w-[200px] md:w-[300px] bg-white text-black font-black text-xl md:text-2xl py-3 text-center mb-10 tracking-[0.3em] rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">STAGE</div>
          
          {/* ชั้น 1 */}
          <div className="flex items-start gap-2 md:gap-4 w-full justify-center">
            {event.venueSize === "Large" && <div className="text-white font-bold text-sm md:text-xl mt-4 opacity-50">1FL.</div>}
            <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-2 md:gap-3 w-full max-w-[550px]">
              {rows.filter(r => r <= 4).map(r => ['L', 'C', 'R'].map(col => renderZoneButton(`${col}${r}`)))}
            </div>
          </div>

          {/* ชั้น 2 (ถ้ามี) */}
          {event.venueSize === "Large" && (
            <>
              <div className="w-full max-w-[600px] h-px bg-gradient-to-r from-transparent via-white/50 to-transparent my-8"></div>
              <div className="flex items-start gap-2 md:gap-4 w-full justify-center">
                <div className="text-white font-bold text-sm md:text-xl mt-4 opacity-50">2FL.</div>
                <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-2 md:gap-3 w-full max-w-[550px]">
                  {rows.filter(r => r > 4).map(r => ['L', 'C', 'R'].map(col => renderZoneButton(`${col}${r}`)))}
                </div>
              </div>
            </>
          )}
        </div>
      );
    } 
    // 📌 โครงสร้างสำหรับสถานที่อื่นๆ (Hall 1, 2) จัดเรียง Grid อัตโนมัติตามขนาด
    else {
      let gridClass = "grid-cols-2 sm:grid-cols-3";
      let maxWidth = "max-w-3xl";
      if (event.venueSize === "Medium") {
          gridClass = "grid-cols-3 sm:grid-cols-4 lg:grid-cols-5";
          maxWidth = "max-w-4xl";
      } else if (event.venueSize === "Large") {
          gridClass = "grid-cols-4 sm:grid-cols-5 lg:grid-cols-6";
          maxWidth = "max-w-6xl";
      }

      return (
        <div className="w-full flex flex-col items-center justify-center p-4 relative z-10">
          <div className="w-[200px] md:w-[300px] bg-white text-black font-black text-xl md:text-2xl py-3 text-center mb-10 tracking-[0.3em] rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">STAGE</div>
          <div className={`grid ${gridClass} gap-2 md:gap-3 w-full ${maxWidth} mx-auto`}>
              {event.zones.map(z => renderZoneButton(z.name))}
          </div>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-24 lg:pb-0 pt-20">
      
      {/* 🖼️ Hero Section */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        <div className="absolute inset-0">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-[#0B0F14]/60 to-transparent"></div>
        </div>
        
        <div className="absolute top-6 left-6 z-30">
          <Link href="/" className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/10 transition-colors border border-white/20">
            <ArrowLeft size={18} /><span>กลับหน้าหลัก</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12 z-10">
            <div className="max-w-7xl mx-auto">
                <span className="inline-block px-3 py-1 bg-pink-600 text-white text-xs font-bold rounded-md mb-4 shadow-lg shadow-pink-600/40 uppercase">
                    {event.category}
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight uppercase italic drop-shadow-2xl leading-tight">
                    {event.title}
                </h1>
                <div className="flex flex-wrap gap-6 text-gray-300 font-medium text-lg">
                    <div className="flex items-center gap-2">
                        <MapPin size={22} className="text-pink-500" />
                        {event.venue}
                    </div>
                    {event.rounds.length > 0 && (
                         <div className="flex items-center gap-2">
                             <CalendarDays size={22} className="text-blue-400" />
                             {event.rounds[0].date}
                         </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-10">
          <div className="space-y-10">
            
            {/* 1. รายละเอียด */}
            <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                    <Info className="text-blue-400" /> รายละเอียดงาน
                </h3>
                <div className="text-gray-300 leading-8 whitespace-pre-line text-lg font-light">
                    {event.description}
                </div>
            </section>

            {/* 2. เลือกรอบการแสดง */}
            <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="text-pink-500" /> เลือกรอบการแสดง
              </h3>
              {event.rounds.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {event.rounds.map((round) => {
                      const isUpcoming = currentTime < round.saleStart;
                      const isEnded = currentTime > round.saleEnd;

                      return (
                      <button 
                        key={round.id}
                        onClick={() => setSelectedRoundId(round.id)}
                        className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center group relative overflow-hidden
                          ${selectedRoundId === round.id 
                            ? "bg-gradient-to-r from-pink-600 to-pink-500 border-pink-500 shadow-lg shadow-pink-500/30" 
                            : "bg-white/5 border-white/10 hover:border-pink-500/50 hover:bg-white/10"}
                        `}
                      >
                        <div className="relative z-10">
                          <p className="font-bold text-lg">{round.date}</p>
                          <p className={`text-sm ${selectedRoundId === round.id ? 'text-white/80' : 'text-gray-400'}`}>{round.time}</p>
                          
                          {/* ป้ายเตือนสถานะในกล่องรอบ */}
                          {isUpcoming && <span className="inline-block mt-2 text-[10px] bg-yellow-500 text-yellow-950 px-2 py-0.5 rounded font-bold shadow-sm">เปิดขาย {round.saleStart.toLocaleDateString('th-TH')}</span>}
                          {isEnded && <span className="inline-block mt-2 text-[10px] bg-red-500 text-white px-2 py-0.5 rounded font-bold shadow-sm">ปิดการขายแล้ว</span>}
                        </div>

                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors relative z-10
                            ${selectedRoundId === round.id ? 'border-white bg-white text-pink-600' : 'border-gray-500 group-hover:border-pink-400'}
                        `}>
                            {selectedRoundId === round.id && <Check size={14} strokeWidth={4} />}
                        </div>
                      </button>
                    )})}
                  </div>
              ) : (
                  <p className="text-gray-500">ยังไม่มีรอบการแสดง</p>
              )}
            </section>

            {/* 3. แผนผังโซน (แสดงผลเป็นผังจริง และกดเพื่อเด้งหน้าถัดไปได้เลย) */}
            <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 justify-start">
                  <Map className="text-purple-400" /> แผนผังที่นั่ง
              </h3>
              
              <div className="w-full relative bg-[#090C10] rounded-3xl border border-white/10 overflow-hidden py-10 shadow-inner">
                 {/* คำใบ้บอกให้ลูกค้ารู้ว่าแผนผังนี้กดได้ */}
                 <div className="absolute top-4 left-0 w-full flex justify-center z-20 pointer-events-none">
                   <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm px-4 py-1.5 rounded-full flex items-center gap-2">
                     👆 {isSaleOpen ? "คลิกเลือกโซนที่ต้องการซื้อได้เลย" : "กรุณาเลือกรอบการแสดงก่อนคลิกผัง"}
                   </div>
                 </div>

                 {/* ✅ เรียกใช้ฟังก์ชันวาด Grid Map */}
                 {renderInteractiveMap()}
              </div>
              
              {/* แถบราคาบอกสี */}
              <div className="flex flex-wrap justify-center gap-4 mt-8 pt-6 border-t border-white/10">
                  {event.priceTiers.map(tier => (
                      <div key={tier.id} className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full border border-white/5">
                          <span className={`w-3 h-3 rounded-full ${tier.color} shadow-sm`}></span>
                          <span className="text-sm text-gray-300 font-medium">฿{tier.price.toLocaleString()}</span>
                      </div>
                  ))}
              </div>
            </section>

          </div>

          {/* --- ฝั่งขวา: สรุปการจอง (ตัดปุ่มซื้อออก เพราะใช้ผังเป็นปุ่มแทนแล้ว) --- */}
          <div className="relative">
            <div className="sticky top-24 bg-[#161B22] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 backdrop-blur-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Ticket className="text-pink-500" /> ข้อมูลการแสดง
              </h3>

              <div className="space-y-4">
                <div>
                    <label className="text-gray-500 text-xs uppercase font-bold tracking-widest block mb-2">รอบที่คุณเลือก</label>
                    <div className={`p-4 rounded-xl border transition-all flex items-center gap-3
                        ${currentRound 
                            ? 'bg-pink-500/10 border-pink-500/50 text-white shadow-[0_0_15px_rgba(236,72,153,0.1)]' 
                            : 'bg-white/5 border-white/10 text-gray-500'}
                    `}>
                        <CalendarDays size={20} className={currentRound ? "text-pink-500" : "opacity-50"} />
                        <div>
                            <p className="font-bold text-sm">{currentRound ? currentRound.date : "ยังไม่ได้เลือกรอบ"}</p>
                            <p className="text-xs opacity-70">{currentRound ? currentRound.time : "--:--"}</p>
                        </div>
                    </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-4">
                <div className={`w-full py-4 rounded-xl font-bold text-sm md:text-base text-center transition-all ${summaryStatusClass}`}>
                    {summaryStatusText}
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}