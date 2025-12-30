"use client";
import { useState, use } from "react";
import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Clock, Share2, Heart, Ticket, Info, Check, AlertCircle } from "lucide-react";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {

  // ✅ 1. แกะ ID ออกมาจาก Promise ตามมาตรฐาน Next.js 15
  const { id } = use(params);

  // --------------------------------------------------------
  // Mock Data
  // --------------------------------------------------------
  const event = {
    id: id,
    title: "THE GRAND UNVEILING 4 ELEMENTS",
    organizer: "Idol Factory",
    venue: "Union Hall, Union Mall",
    image: "https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=2000",
    description: "เตรียมพบกับปรากฏการณ์ดนตรีสุดยิ่งใหญ่ที่รวมองค์ประกอบทั้ง 4 ไว้ในหนึ่งเดียว พร้อมโชว์สุดพิเศษจากศิลปินที่คุณรัก",
    
    // ✅ เพิ่มข้อมูลรอบการแสดง
    rounds: [
      { id: 1, date: "Saturday, 15 Jan 2026", time: "19:00 - 22:30" },
      { id: 2, date: "Sunday, 16 Jan 2026", time: "17:00 - 20:30" }
    ],

    priceTiers: [
      { id: 1, price: 4500, color: 'bg-[#8BC34A]', label: '4,500' },
      { id: 2, price: 4000, color: 'bg-[#21358F]', label: '4,000' },
      { id: 3, price: 3700, color: 'bg-[#ED1C24]', label: '3,700' },
      { id: 4, price: 3500, color: 'bg-[#C54E9D]', label: '3,500' },
      { id: 5, price: 3000, color: 'bg-[#4CCED0]', label: '3,000' },
      { id: 6, price: 2500, color: 'bg-[#662D91]', label: '2,500' },
      { id: 7, price: 2000, color: 'bg-[#F15A24]', label: '2,000' },
      { id: 8, price: 1500, color: 'bg-[#FFF200]', label: '1,500', textColor: 'text-black' },
    ]
  };

  const zones = [
    { name: 'A1', tierId: 2, col: 'col-start-1' },
    { name: 'A2', tierId: 1, col: 'col-start-2' },
    { name: 'A3', tierId: 1, col: 'col-start-4' },
    { name: 'A4', tierId: 2, col: 'col-start-5' },
    { name: 'B1', tierId: 4, col: 'col-start-1 row-start-2' },
    { name: 'B2', tierId: 1, col: 'col-start-2 col-span-3 row-start-2' }, 
    { name: 'B4', tierId: 4, col: 'col-start-5 row-start-2' },
    { name: 'B3', tierId: 3, col: 'col-start-2 col-span-3 row-start-3' },
    { name: 'C1', tierId: 5, col: 'col-start-1 row-start-4' },
    { name: 'C2', tierId: 5, col: 'col-start-2 col-span-3 row-start-4' },
    { name: 'C3', tierId: 5, col: 'col-start-5 row-start-4' },
  ];

  // ✅ State สำหรับการเลือก
  const [selectedRoundId, setSelectedRoundId] = useState<number>(event.rounds[0].id);
  const [selectedZoneName, setSelectedZoneName] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const currentRound = event.rounds.find(r => r.id === selectedRoundId);
  const currentZone = zones.find(z => z.name === selectedZoneName);
  const currentTier = currentZone ? event.priceTiers.find(t => t.id === currentZone.tierId) : null;

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-24 lg:pb-0">
      
      {/* 🖼️ Hero Section */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <div className="absolute inset-0">
           <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-transparent"></div>
        </div>
        <div className="absolute top-6 left-6 z-20">
          <Link href="/" className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/10 transition-colors border border-white/20">
            <ArrowLeft size={18} /><span>ย้อนกลับ</span>
          </Link>
        </div>
        <div className="absolute bottom-10 left-6 lg:left-12 z-10 max-w-4xl">
           <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight uppercase italic">{event.title}</h1>
           <p className="text-xl text-gray-300 font-medium">{event.venue}</p>
        </div>
        <div className="absolute bottom-10 right-6 lg:right-12 z-10 flex gap-4">
            <button className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all"><Share2 size={24} /></button>
            <button onClick={() => setIsLiked(!isLiked)} className={`p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all ${isLiked ? 'text-pink-500' : ''}`}><Heart size={24} fill={isLiked ? "currentColor" : "none"} /></button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-10">
          
          {/* --- ฝั่งซ้าย: ข้อมูลรอบและแผนผัง --- */}
          <div className="space-y-10">
            
            {/* ✅ 2. ส่วนเลือกรอบการแสดง (Showtime Selection) */}
            <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="text-pink-500" /> เลือกรอบการแสดง
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.rounds.map((round) => (
                  <button 
                    key={round.id}
                    onClick={() => setSelectedRoundId(round.id)}
                    className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center
                      ${selectedRoundId === round.id 
                        ? 'bg-pink-600 border-pink-500 shadow-lg shadow-pink-600/20' 
                        : 'bg-white/5 border-white/10 hover:border-white/30'}
                    `}
                  >
                    <div>
                      <p className={`font-bold ${selectedRoundId === round.id ? 'text-white' : 'text-gray-200'}`}>{round.date}</p>
                      <p className={`text-sm ${selectedRoundId === round.id ? 'text-pink-100' : 'text-gray-400'}`}>{round.time}</p>
                    </div>
                    {selectedRoundId === round.id && <Check size={20} className="text-white" strokeWidth={3} />}
                  </button>
                ))}
              </div>
            </section>

            {/* ส่วนแผนผังโซน (Interactive Map) */}
            <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <div className="text-center mb-10">
                <div className="bg-white text-black inline-block px-16 py-3 font-black text-2xl tracking-[0.5em] shadow-[0_0_30px_rgba(255,255,255,0.2)] mb-8">STAGE</div>
                
                <div className="grid grid-cols-5 gap-3 w-full max-w-2xl mx-auto">
                    {zones.map((zone) => {
                        const tier = event.priceTiers.find(t => t.id === zone.tierId);
                        const isSelected = selectedZoneName === zone.name;
                        return (
                            <button
                                key={zone.name}
                                onClick={() => setSelectedZoneName(zone.name)}
                                className={`
                                    ${zone.col} h-14 rounded-lg font-bold text-lg transition-all duration-200 border border-white/10
                                    ${tier?.color} ${tier?.textColor || 'text-white'}
                                    ${isSelected ? 'ring-4 ring-white scale-110 z-10 shadow-2xl brightness-110' : 'opacity-90 hover:opacity-100 hover:scale-105'}
                                `}
                            >
                                {zone.name}
                            </button>
                        );
                    })}
                </div>
                <div className="mt-8 text-gray-500 text-sm italic">* กรุณาเลือกโซนที่คุณต้องการนั่งจากแผนผัง</div>
              </div>
            </section>
          </div>

          {/* --- ฝั่งขวา: รายละเอียดราคาและปุ่มยืนยัน --- */}
          <div className="relative">
            <div className="sticky top-10 bg-[#161B22] border border-white/10 rounded-3xl p-8 shadow-2xl">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Ticket className="text-pink-500" /> ข้อมูลการจอง
              </h3>
              
              <div className="space-y-6">
                <div>
                    <label className="text-gray-400 text-xs uppercase font-bold tracking-widest block mb-2">รอบที่เลือก</label>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/10">
                        <p className="font-bold">{currentRound?.date}</p>
                        <p className="text-sm text-gray-400">{currentRound?.time}</p>
                    </div>
                </div>

                <div>
                    <label className="text-gray-400 text-xs uppercase font-bold tracking-widest block mb-2">โซนที่เลือก</label>
                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
                        <span className="text-2xl font-black">{selectedZoneName || '-'}</span>
                        <span className="text-xl font-bold text-pink-500">{currentTier ? `฿${currentTier.price.toLocaleString()}` : '0'}</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                    <div className="flex justify-between items-end mb-6">
                        <span className="text-gray-400">ราคารวมต่อใบ</span>
                        <span className="text-4xl font-black text-white">{currentTier ? `฿${currentTier.price.toLocaleString()}` : '-'}</span>
                    </div>
                    
                    {selectedZoneName ? (
                      <Link href={`/event/${id}/seat-selection`} className="w-full block">
                        <button className="w-full py-5 rounded-2xl font-bold text-xl transition-all duration-300 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 hover:scale-[1.02] shadow-xl shadow-pink-600/20">
                          เลือกที่นั่ง (Seat Selection)
                        </button>
                      </Link>
                    ) : (
                      <button disabled className="w-full py-5 rounded-2xl font-bold text-xl bg-gray-800 text-gray-500 cursor-not-allowed">
                        กรุณาเลือกโซนที่ต้องการ
                      </button>
                    )}
                </div>
              </div>

              <div className="mt-8 space-y-4">
                  <h4 className="text-sm font-bold text-gray-300 flex items-center gap-2"><Info size={16}/> เงื่อนไขการจำหน่ายบัตร</h4>
                  <ul className="text-xs text-gray-500 space-y-2 list-disc pl-4">
                      <li>จำกัดการซื้อสูงสุด 4 ใบต่อ 1 รายการ</li>
                      <li>บัตรไม่สามารถเปลี่ยนรอบหรือคืนเงินได้ทุกกรณี</li>
                      <li>ราคาบัตรยังไม่รวมค่าธรรมเนียมการออกบัตรใบละ 20 บาท</li>
                  </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}