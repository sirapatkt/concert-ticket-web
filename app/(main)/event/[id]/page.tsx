"use client";
import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Ticket, Check, Info, CalendarDays, MapPin } from "lucide-react";

// ✅ 1. Import useUser กลับมา (Path นี้ถูกต้องตามโครงสร้างไฟล์ของคุณครับ)
import { useUser } from "../../../../context/UserContext";

const allEvents = [
  {
    id: 1,
    category: "concert",
    title: "THE BOYZ WORLD TOUR : ZENERATION II",
    venue: "Impact Arena",
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop",
    description: `THE BOYZ กลับมาสร้างความทรงจำสุดพิเศษกับเหล่า The B ชาวไทยอีกครั้งใน "THE BOYZ WORLD TOUR : ZENERATION II IN BANGKOK"
    
เตรียมพบกับการแสดงสุดร้อนแรงและเพอร์ฟอร์แมนซ์ที่แข็งแกร่งสมฉายา 'Performance Kings' ที่จะมาเขย่าเวที Impact Arena ให้สั่นสะเทือน! งานนี้หนุ่มๆ เตรียมเพลงฮิตและโชว์พิเศษมากมายมาเซอร์ไพรส์แฟนๆ โดยเฉพาะ

มาร่วมเป็นส่วนหนึ่งของเจเนอเรชั่นใหม่ และสร้างทะเลสีแดงไปด้วยกัน ห้ามพลาด!`,
  },
  {
    id: 2,
    category: "concert",
    title: "NCT WISH : SCHOOL of WISH Fan Showcase",
    venue: "MCC Hall",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop",
    description: `ขอต้อนรับเข้าสู่โรงเรียนแห่งความฝัน! กับงานแฟนโชว์เคสครั้งแรกในประเทศไทยของ "NCT WISH"

เด็กๆ NCT WISH พร้อมแล้วที่จะมาแจกความสดใสและแนะนำตัวอย่างเป็นทางการกับพี่สาวชาวไทย เตรียมหัวใจให้พร้อมรับดาเมจความน่ารัก และโชว์เดบิวต์ซิงเกิล 'WISH' แบบสดๆ ที่จะทำให้คุณตกหลุมรักพวกเขาจนถอนตัวไม่ขึ้น

มาร่วมเช็คชื่อเข้าคลาสเรียนรู้หัวใจไปด้วยกันที่ SCHOOL of WISH!`,
  },
  {
    id: 3,
    category: "fanmeet",
    title: "KIM SEON HO ASIA TOUR <Color+Full>",
    venue: "Union Hall",
    image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000&auto=format&fit=crop",
    description: `หัวหน้าฮงกลับมาหาแล้วครับ! คิมซอนโฮ (Kim Seon Ho) กลับมาพร้อมรอยยิ้มพิมพ์ใจในงานแฟนมีตติ้งเอเชียทัวร์ครั้งใหม่ "Color+Full"`,
  },
  {
    id: 4,
    category: "fanmeet",
    title: "HWANG IN YOUP FAN MEETING TOUR [IN LOVE]",
    venue: "UOB LIVE, Emsphere",
    image: "https://pbs.twimg.com/media/F1_z9cfaYAAy2_K?format=jpg&name=large",
    description: `ได้เวลาตกหลุมรักอีกครั้ง! ฮวังอินยอบ (Hwang In Youp) พร้อมมาขโมยหัวใจแฟนๆ ชาวไทยในงานแฟนมีตติ้ง "IN LOVE"`,
  },
  {
    id: 5,
    category: "fanmeet",
    title: "PARK BO GUM FANMEETING <Cantabile>",
    venue: "Thunder Dome",
    image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=1000&auto=format&fit=crop",
    description: `ความทรงจำที่งดงามกำลังจะบรรเลงขึ้นอีกครั้ง พัคโบกอม (Park Bo Gum) กลับมาพร้อมความอบอุ่นในงานแฟนมีตติ้ง "Cantabile"`,
  },
  {
    id: 6,
    category: "festival",
    title: "SUMMER SONIC BANGKOK 2025",
    venue: "BITEC Bangna",
    image: "https://images.unsplash.com/photo-1459749411177-717441447994?q=80&w=1000&auto=format&fit=crop",
    description: `ครั้งแรกในประวัติศาสตร์! เทศกาลดนตรีระดับโลกจากญี่ปุ่น "SUMMER SONIC" บุกกรุงเทพฯ อย่างเป็นทางการ!`,
  },
  {
    id: 7,
    category: "theater",
    title: "THE PHANTOM OF THE OPERA",
    venue: "Muangthai Rachadalai Theatre",
    image: "https://images.unsplash.com/photo-1503095392269-2d6092842485?q=80&w=1000&auto=format&fit=crop",
    description: `ตำนานรักอมตะแห่งโรงละครโอเปร่า ที่ครองใจผู้ชมทั่วโลกมายาวนานกว่า 30 ปี "THE PHANTOM OF THE OPERA" กลับมาเปิดการแสดงอย่างยิ่งใหญ่ที่เมืองไทย`,
  },
  {
    id: 8,
    category: "theater",
    title: "CIRQUE DU SOLEIL: WORLDS AWAY",
    venue: "Impact Arena",
    image: "https://images.unsplash.com/photo-1536300007881-7e482242baa5?q=80&w=1000&auto=format&fit=crop",
    description: `เปิดประสบการณ์เหนือจินตนาการกับกายกรรมระดับโลก "CIRQUE DU SOLEIL" ในโชว์ชุดใหม่ "WORLDS AWAY"`,
  },
  {
    id: 9,
    category: "theater",
    title: "NANTA SHOW BANGKOK",
    venue: "Show DC Hall",
    image: "https://images.unsplash.com/photo-1468359601543-843bfaef291a?q=80&w=1000&auto=format&fit=crop",
    description: `ความฮาฉบับเกาหลีที่ครองใจคนทั่วโลก! NANTA SHOW (นันตาโชว์) การแสดงตลกเงียบผสมผสานจังหวะดนตรีจากอุปกรณ์เครื่องครัว`,
  },
  {
    id: 10,
    category: "classical",
    title: "RBSO 2026: The Great Classics",
    venue: "Thailand Cultural Centre",
    image: "https://images.unsplash.com/photo-1465847899078-b290428d3268?q=80&w=1000&auto=format&fit=crop",
    description: `สุนทรียภาพแห่งดนตรีคลาสสิก โดยวง Royal Bangkok Symphony Orchestra (RBSO) ในคอนเสิร์ตเปิดฤดูกาล 2026 "The Great Classics"`,
  },
  {
    id: 11,
    category: "classical",
    title: "HARRY POTTER IN CONCERT",
    venue: "Prince Mahidol Hall",
    image: "https://images.unsplash.com/photo-1514117445516-2ecfc9c4ec90?q=80&w=1000&auto=format&fit=crop",
    description: `เวทมนตร์จะกลับมามีชีวิตอีกครั้ง! สัมผัสประสบการณ์ชมภาพยนตร์ Harry Potter ภาคแรก บนจอขนาดยักษ์ พร้อมวง Thailand Philharmonic Orchestra บรรเลงเพลงประกอบสดๆ เต็มวง!

ทุกโน้ตดนตรีของ John Williams จะดังกึกก้อง สร้างความตื่นเต้น เร้าใจ และซาบซึ้ง ไปพร้อมกับเรื่องราวของเด็กชายผู้รอดชีวิต นี่คือการผสมผสานระหว่างภาพยนตร์และดนตรีออร์เคสตราที่สมบูรณ์แบบที่สุด

เตรียมไม้กายสิทธิ์ของคุณให้พร้อม แล้วมาสัมผัสเวทมนตร์ด้วยกันที่มหิดลสิทธาคาร`,
  },
];

const categoryNames: Record<string, string> = {
    concert: "คอนเสิร์ต",
    fanmeet: "แฟนมีตติ้ง",
    festival: "เทศกาลดนตรี",
    theater: "ละครเวที",
    classical: "คลาสสิก",
};

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // ✅ 2. ดึงค่าจาก Context จริงๆ (ไม่ต้องใช้ตัวแปรจำลองแล้ว)
  const context = useUser();
  // ถ้า context.user มีค่า = Login แล้ว (isLoggedIn เป็น true)
  // ถ้า context.user เป็น null = ยังไม่ Login (isLoggedIn เป็น false)
  const isLoggedIn = !!context?.user; 

  // Hooks: อยู่บนสุดเสมอ
  const [selectedRoundId, setSelectedRoundId] = useState(0);
  const [selectedZoneName, setSelectedZoneName] = useState("");

  const foundEvent = allEvents.find((e) => e.id === Number(id));

  // Handle Not Found
  if (!foundEvent) {
    return (
      <div className="min-h-screen bg-[#0B0F14] text-white flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-4">ไม่พบงานแสดงที่คุณค้นหา</h1>
        <Link href="/" className="text-pink-500 hover:underline">กลับหน้าหลัก</Link>
      </div>
    );
  }

  const backLinkText = categoryNames[foundEvent.category || ""] ? `กลับไปหน้า${categoryNames[foundEvent.category || ""]}` : "กลับหน้ารายการ";
  const backLinkHref = foundEvent.category ? `/category/${foundEvent.category}` : "/";

  const event = {
    ...foundEvent,
    rounds: [
      { id: 1, date: "Saturday, 15 Jan 2026", time: "19:00 - 22:30" },
      { id: 2, date: "Sunday, 16 Jan 2026", time: "17:00 - 20:30" },
    ],
    priceTiers: [
      { id: 1, price: 4500, color: "bg-[#8BC34A]" },
      { id: 2, price: 4000, color: "bg-[#21358F]" },
      { id: 3, price: 3700, color: "bg-[#ED1C24]" },
      { id: 4, price: 3500, color: "bg-[#C54E9D]" },
      { id: 5, price: 3000, color: "bg-[#4CCED0]" },
      { id: 6, price: 2500, color: "bg-[#662D91]" },
      { id: 7, price: 2000, color: "bg-[#F15A24]" },
      { id: 8, price: 1500, color: "bg-[#FFF200]", textColor: "text-black" },
    ],
  };

  const zones = [
    { name: "A1", tierId: 2, col: "col-start-1" },
    { name: "A2", tierId: 1, col: "col-start-2" },
    { name: "A3", tierId: 1, col: "col-start-4" },
    { name: "A4", tierId: 2, col: "col-start-5" },
    { name: "B1", tierId: 4, col: "col-start-1 row-start-2" },
    { name: "B2", tierId: 1, col: "col-start-2 col-span-3 row-start-2" },
    { name: "B4", tierId: 4, col: "col-start-5 row-start-2" },
  ];

  const currentRound = event.rounds.find((r) => r.id === selectedRoundId);
  const currentZone = zones.find((z) => z.name === selectedZoneName);
  const currentTier = currentZone ? event.priceTiers.find((t) => t.id === currentZone.tierId) : null;

  // ✅ 3. ฟังก์ชันเช็คสิทธิ์ (ใช้ Logic จริง)
  const requireAuth = (action: () => void) => {
    if (!isLoggedIn) {
        // เงื่อนไข: ถ้ายังไม่ Login (ค่า user เป็น null) -> ดีดไปหน้า Login
        router.push(`/login?redirect=/event/${id}`);
    } else {
        // เงื่อนไข: ถ้า Login แล้ว -> ทำคำสั่งเลือกได้เลย
        action();
    }
  };

  const handleBuyTicket = () => {
    // เช็คสิทธิ์อีกรอบ (ถ้าเลือกครบและ Login แล้วไปต่อได้)
    if (selectedRoundId !== 0 && selectedZoneName !== "") {
        router.push(`/booking/select-seat?eventId=${id}&round=${selectedRoundId}&zone=${selectedZoneName}`); 
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
          <Link href={backLinkHref} className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/10 transition-colors border border-white/20">
            <ArrowLeft size={18} /><span>{backLinkText}</span>
          </Link>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 lg:p-12 z-10">
            <div className="max-w-7xl mx-auto">
                <span className="inline-block px-3 py-1 bg-pink-600 text-white text-xs font-bold rounded-md mb-4 shadow-lg shadow-pink-600/40 uppercase">
                    {event.category || "CONCERT"}
                </span>
                <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-4 tracking-tight uppercase italic drop-shadow-2xl leading-tight">
                    {event.title}
                </h1>
                <div className="flex flex-wrap gap-6 text-gray-300 font-medium text-lg">
                    <div className="flex items-center gap-2">
                        <MapPin size={22} className="text-pink-500" />
                        {event.venue}
                    </div>
                    <div className="flex items-center gap-2">
                         <CalendarDays size={22} className="text-blue-400" />
                         15 JAN 2026
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-10">
          <div className="space-y-10">
            
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.rounds.map((round) => (
                  <button 
                    key={round.id}
                    // ✅ ใช้ requireAuth คลุมคำสั่งเลือก (เช็ค user ก่อน)
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
            </section>

            {/* 3. แผนผังโซน */}
            <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <div className="text-center mb-10">
                <h3 className="text-xl font-bold mb-8 flex items-center gap-2 justify-start">
                    <Ticket className="text-purple-400" /> แผนผังที่นั่ง
                </h3>
                
                <div className="w-full max-w-2xl mx-auto mb-10">
                     <div className="bg-white text-black py-2 font-black text-xl tracking-[0.3em] shadow-[0_0_30px_rgba(255,255,255,0.2)] rounded-sm mb-2">
                        STAGE
                     </div>
                     <div className="h-1 w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"></div>
                </div>

                <div className="grid grid-cols-5 gap-3 w-full max-w-2xl mx-auto">
                  {zones.map((zone) => {
                    const tier = event.priceTiers.find((t) => t.id === zone.tierId);
                    const isSelected = selectedZoneName === zone.name;
                    return (
                      <button
                        key={zone.name}
                        // ✅ ใช้ requireAuth คลุมคำสั่งเลือก
                        onClick={() => requireAuth(() => setSelectedZoneName(zone.name))}
                        className={`${zone.col} h-16 rounded-lg font-bold text-xl border transition-all relative overflow-hidden
                          ${tier?.color} 
                          ${isSelected 
                            ? "ring-4 ring-white z-10 shadow-[0_0_20px_rgba(255,255,255,0.5)] scale-105" 
                            : "opacity-80 hover:opacity-100 hover:scale-105 border-transparent"}
                        `}
                      >
                        <span className="relative z-10 text-white drop-shadow-md">{zone.name}</span>
                        {isSelected && <div className="absolute inset-0 bg-white/20 animate-pulse"></div>}
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

          {/* --- ฝั่งขวา: ข้อมูลการจอง --- */}
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