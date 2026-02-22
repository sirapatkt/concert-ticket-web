"use client";
import { useState, use, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Ticket, Check, Info, CalendarDays, MapPin } from "lucide-react";
import { useUser } from "@/context/UserContext"; // ✅ ตรวจสอบ path ให้ตรงกับเครื่องคุณ

// 1. สร้าง Interface ให้ตรงกับข้อมูลที่ Backend ส่งมา
interface ApiEvent {
  Event_id: number;
  eventName: string;
  eventDescription: string;
  rental_start: string;
  venue_name?: string; // ถ้า Backend ส่งชื่อสถานที่มา
  bannerImage: string | null;
  eventStatus: string;
  hall?: {
    Hall_Name: string;
  };
  event_date_times?: {
    Datetime_id: number; // ใน JSON ใช้ Datetime_id
    startDT: string;     // ใน JSON ใช้ startDT
    endDT: string;       // ใน JSON ใช้ endDT
  }[];
  ticket_zones?: {
    id: number;
    zoneName: string;
    priceperTick: number;
    capacity: number;
  }[];
}

// Interface สำหรับข้อมูลที่จะใช้แสดงผลในหน้าเว็บ
interface UiEvent {
  id: number;
  title: string;
  venue: string;
  image: string;
  description: string;
  category: string;
  rounds: { id: number; date: string; time: string }[];
  priceTiers: { id: number; price: number; color: string; textColor?: string }[];
  zones: { name: string; tierId: number; price: number }[];
}

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const context = useUser();
  const isLoggedIn = !!context?.user;

  // ✅ สร้าง State สำหรับเก็บข้อมูลจริง
  const [event, setEvent] = useState<UiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Hooks สำหรับการเลือก
  const [selectedRoundId, setSelectedRoundId] = useState(0);
  const [selectedZoneName, setSelectedZoneName] = useState("");

  // ✅ ใช้ useEffect ดึงข้อมูลจาก API เมื่อเข้าหน้านี้
  useEffect(() => {
    const fetchEventDetail = async () => {
      try {
        // ยิงไปที่ API ที่เราเตรียมไว้
        // บรรทัดที่ 67 ต้องเป็นแบบนี้ครับ
      const res = await fetch(`http://127.0.0.1:8000/api/public/events/${id}`);
        
        if (!res.ok) throw new Error("Event not found");

        const data: ApiEvent = await res.json();

        // --- แปลงข้อมูล (Mapping) จาก Backend -> Frontend ---
        
        // 1. แปลงรอบการแสดง
      const rounds = data.event_date_times?.map((dt) => {
        const dateObj = new Date(dt.startDT); // ใช้ startDT แทน event_date
          return {
              id: dt.Datetime_id, // ใช้ Datetime_id
              date: dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }),
              // ดึงเวลาจาก startDT และ endDT (ตัดเอาแค่ HH:mm)
              time: `${dt.startDT.split(' ')[1].slice(0, 5)} - ${dt.endDT.split(' ')[1].slice(0, 5)}`
          };
      }) || [];

        // 2. แปลงโซนที่นั่งและราคา
        // หาสีให้แต่ละราคา (สุ่มหรือกำหนดเอง)
        const colors = ["bg-[#8BC34A]", "bg-[#21358F]", "bg-[#ED1C24]", "bg-[#C54E9D]", "bg-[#4CCED0]", "bg-[#662D91]"];
        
        // ดึงราคาที่ไม่ซ้ำกันออกมาเพื่อทำ Tier
        const uniquePrices = Array.from(new Set(data.ticket_zones?.map(z => z.priceperTick) || [])).sort((a, b) => b - a);
        
        const priceTiers = uniquePrices.map((price, index) => ({
            id: index + 1, // สมมติ ID ให้ Tier
            price: price,
            color: colors[index % colors.length] || "bg-gray-500",
            textColor: "text-white"
        }));

        // แปลง Zone ให้ผูกกับ Tier ID
        const zones = data.ticket_zones?.map(z => {
            const tier = priceTiers.find(t => t.price === z.priceperTick);
            return {
                name: z.zoneName,
                tierId: tier?.id || 0,
                price: z.priceperTick
            };
        }) || [];

        // 3. ประกอบร่างเป็น UiEvent
        const formattedEvent: UiEvent = {
            id: data.Event_id,
            title: data.eventName,
            venue: data.hall?.Hall_Name || "Location TBA",
            image: data.bannerImage 
                ? `http://127.0.0.1:8000/storage/${data.bannerImage}` 
                : "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80", // รูปสำรอง
            description: data.eventDescription || "ไม่มีรายละเอียด",
            category: "Concert", // ค่า Default หรือเพิ่ม field category ใน DB
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


  // --- ส่วนแสดงผล Loading / Error ---
  if (loading) return <div className="min-h-screen bg-[#0B0F14] text-white flex items-center justify-center animate-pulse">กำลังโหลดข้อมูล...</div>;
  
  if (error || !event) {
    return (
      <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">ไม่พบงานแสดงที่คุณค้นหา</h1>
        <Link href="/" className="text-pink-500 hover:underline">กลับหน้าหลัก</Link>
      </div>
    );
  }

  // ตัวแปรสำหรับ Logic การคำนวณราคา
  const currentRound = event.rounds.find((r) => r.id === selectedRoundId);
  const currentZone = event.zones.find((z) => z.name === selectedZoneName);
  const currentTier = currentZone ? event.priceTiers.find((t) => t.id === currentZone.tierId) : null;

  const requireAuth = (action: () => void) => {
    if (!isLoggedIn) {
        router.push(`/login?redirect=/event/${id}`);
    } else {
        action();
    }
  };

  const handleBuyTicket = () => {
    if (selectedRoundId !== 0 && selectedZoneName !== "") {
        // ส่ง query param ไปหน้าจอง (ต้องปรับหน้าจองให้รับค่าพวกนี้ด้วย)
        router.push(`/booking/select-seat?eventId=${id}&round=${selectedRoundId}&zone=${selectedZoneName}&price=${currentTier?.price}`); 
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
                    {event.rounds.map((round) => (
                      <button 
                        key={round.id}
                        onClick={() => requireAuth(() => setSelectedRoundId(round.id))}
                        className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center group
                          ${selectedRoundId === round.id 
                            ? "bg-gradient-to-r from-pink-600 to-pink-500 border-pink-500 shadow-lg shadow-pink-500/30" 
                            : "bg-white/5 border-white/10 hover:border-pink-500/50 hover:bg-white/10"}
                        `}
                      >
                        <div>
                          <p className="font-bold text-lg">{round.date}</p>
                          <p className={`text-sm ${selectedRoundId === round.id ? 'text-white/80' : 'text-gray-400'}`}>{round.time}</p>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors
                            ${selectedRoundId === round.id ? 'border-white bg-white text-pink-600' : 'border-gray-500 group-hover:border-pink-400'}
                        `}>
                            {selectedRoundId === round.id && <Check size={14} strokeWidth={4} />}
                        </div>
                      </button>
                    ))}
                  </div>
              ) : (
                  <p className="text-gray-500">ยังไม่มีรอบการแสดง</p>
              )}
            </section>

            {/* 3. แผนผังโซน (แบบ Grid อัตโนมัติ) */}
            <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <div className="text-center mb-10">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2 justify-start">
                    <Ticket className="text-purple-400" /> โซนที่นั่ง
                </h3>
                
                <div className="w-full max-w-2xl mx-auto mb-10">
                      <div className="bg-white text-black py-2 font-black text-xl tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.2)] rounded-sm mb-2">
                        STAGE
                      </div>
                      <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                </div>

                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 w-full max-w-3xl mx-auto">
                  {event.zones.map((zone) => {
                    const tier = event.priceTiers.find((t) => t.id === zone.tierId);
                    const isSelected = selectedZoneName === zone.name;
                    return (
                      <button
                        key={zone.name}
                        onClick={() => requireAuth(() => setSelectedZoneName(zone.name))}
                        className={`h-16 rounded-lg font-bold text-xl border transition-all relative overflow-hidden
                          ${tier?.color || 'bg-gray-700'} 
                          ${isSelected 
                            ? "ring-4 ring-white z-10 shadow-[0_0_20px_rgba(255,255,255,0.5)] scale-105" 
                            : "opacity-80 hover:opacity-100 hover:scale-105 border-transparent"}
                        `}
                      >
                        <span className="relative z-10 text-white drop-shadow-md">{zone.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
              
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

          {/* --- ฝั่งขวา: สรุปการจอง --- */}
          <div className="relative">
            <div className="sticky top-24 bg-[#161B22] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6 backdrop-blur-xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Ticket className="text-pink-500" /> สรุปการจอง
              </h3>

              <div className="space-y-4">
                <div>
                    <label className="text-gray-500 text-xs uppercase font-bold tracking-widest block mb-2">รอบที่เลือก</label>
                    <div className={`p-4 rounded-xl border transition-all flex items-center gap-3
                        ${currentRound 
                            ? 'bg-pink-500/10 border-pink-500/50 text-white shadow-[0_0_15px_rgba(236,72,153,0.1)]' 
                            : 'bg-white/5 border-white/10 text-gray-500'}
                    `}>
                        <CalendarDays size={20} className={currentRound ? "text-pink-500" : "opacity-50"} />
                        <div>
                            <p className="font-bold text-sm">{currentRound ? currentRound.date : "เลือกวันที่แสดง"}</p>
                            <p className="text-xs opacity-70">{currentRound ? currentRound.time : "--:--"}</p>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="text-gray-500 text-xs uppercase font-bold tracking-widest block mb-2">โซนที่นั่ง</label>
                    <div className={`p-4 rounded-xl border transition-all flex justify-between items-center
                        ${currentZone 
                            ? 'bg-purple-500/10 border-purple-500/50 text-white shadow-[0_0_15px_rgba(168,85,247,0.1)]' 
                            : 'bg-white/5 border-white/10 text-gray-500'}
                    `}>
                        <div className="flex items-center gap-3">
                             <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-black text-lg
                                ${currentTier ? currentTier.color : 'bg-white/10'}
                             `}>
                                {selectedZoneName || "?"}
                             </div>
                             <span className="text-sm font-medium">โซน</span>
                        </div>
                        <span className="text-lg font-bold">
                            {currentTier ? `฿${currentTier.price.toLocaleString()}` : "-"}
                        </span>
                    </div>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10 mt-4">
                <div className="flex justify-between items-end mb-6">
                  <span className="text-gray-400 font-medium">ราคารวมสุทธิ</span>
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500">
                    {currentTier ? `฿${currentTier.price.toLocaleString()}` : "-"}
                  </span>
                </div>

                <button
                    onClick={handleBuyTicket}
                    disabled={selectedRoundId === 0 || selectedZoneName === ""}
                    className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg transition-all transform duration-200 flex items-center justify-center gap-2
                        ${(selectedRoundId === 0 || selectedZoneName === "") 
                            ? 'bg-gray-800 text-gray-600 cursor-not-allowed' 
                            : 'bg-gradient-to-r from-pink-600 to-purple-600 hover:scale-[1.02] hover:shadow-pink-500/40 text-white'
                        }
                    `}
                >
                    {(selectedRoundId === 0 || selectedZoneName === "") ? 'กรุณาเลือกบัตรให้ครบ' : <>ซื้อบัตรเลย <ArrowLeft className="rotate-180" size={20} /></>}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}