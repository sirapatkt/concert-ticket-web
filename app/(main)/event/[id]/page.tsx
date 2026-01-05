"use client";
import { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Clock, Share2, Heart, Ticket, Check } from "lucide-react";

export default function EventDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  // 🔐 สถานะ Login จำลอง
  const isLoggedIn = false; 

  const event = {
    id: id,
    title: "THE GRAND UNVEILING 4 ELEMENTS",
    venue: "Union Hall, Union Mall",
    image: "https://images.unsplash.com/photo-1514525253440-b393452e3383?q=80&w=2000",
    rounds: [
      { id: 1, date: "Saturday, 15 Jan 2026", time: "19:00 - 22:30" },
      { id: 2, date: "Sunday, 16 Jan 2026", time: "17:00 - 20:30" }
    ],
    priceTiers: [
      { id: 1, price: 4500, color: 'bg-[#8BC34A]' },
      { id: 2, price: 4000, color: 'bg-[#21358F]' },
      { id: 3, price: 3700, color: 'bg-[#ED1C24]' },
      { id: 4, price: 3500, color: 'bg-[#C54E9D]' },
      { id: 5, price: 3000, color: 'bg-[#4CCED0]' },
      { id: 6, price: 2500, color: 'bg-[#662D91]' },
      { id: 7, price: 2000, color: 'bg-[#F15A24]' },
      { id: 8, price: 1500, color: 'bg-[#FFF200]', textColor: 'text-black' },
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
  ];

  const [selectedRoundId, setSelectedRoundId] = useState<number | null>(null);
  const [selectedZoneName, setSelectedZoneName] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  const currentRound = event.rounds.find(r => r.id === selectedRoundId);
  const currentZone = zones.find(z => z.name === selectedZoneName);
  const currentTier = currentZone ? event.priceTiers.find(t => t.id === currentZone.tierId) : null;

  const requireAuth = (action: () => void) => {
    if (!isLoggedIn) {
      router.push(`/login?redirect=/event/${id}`);
      return;
    }
    action();
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white font-sans pb-24 lg:pb-0 pt-20">
      
      {/* 🖼️ Hero Section */}
      <div className="relative h-[45vh] w-full overflow-hidden">
        <div className="absolute inset-0">
           <img src={event.image} alt={event.title} className="w-full h-full object-cover opacity-60" />
           <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F14] via-transparent to-transparent"></div>
        </div>
        <div className="absolute top-6 left-6 z-30">
          <Link href="/" className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full hover:bg-white/10 transition-colors border border-white/20">
            <ArrowLeft size={18} /><span>กลับหน้าหลัก</span>
          </Link>
        </div>
        <div className="absolute bottom-10 left-6 lg:left-12 z-10 max-w-4xl">
           <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tight uppercase italic">{event.title}</h1>
           <p className="text-xl text-gray-300 font-medium">{event.venue}</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 xl:grid-cols-[1.5fr_1fr] gap-10">
          
          <div className="space-y-10">
            {/* 1. เลือกรอบการแสดง */}
            <section className="bg-white/5 p-6 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                <Clock className="text-pink-500" /> เลือกรอบการแสดง
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {event.rounds.map((round) => (
                  <button 
                    key={round.id}
                    onClick={() => requireAuth(() => setSelectedRoundId(round.id))}
                    className={`p-4 rounded-2xl border transition-all text-left flex justify-between items-center
                      ${selectedRoundId === round.id ? 'bg-pink-600 border-pink-500 shadow-lg' : 'bg-white/5 border-white/10'}
                    `}
                  >
                    <div>
                      <p className="font-bold">{round.date}</p>
                      <p className="text-sm opacity-60">{round.time}</p>
                    </div>
                    {selectedRoundId === round.id && <Check size={20} />}
                  </button>
                ))}
              </div>
            </section>

            {/* 2. แผนผังโซน */}
            <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <div className="text-center mb-10">
                <div className="bg-white text-black inline-block px-16 py-3 font-black text-2xl tracking-[0.5em] mb-8">STAGE</div>
                <div className="grid grid-cols-5 gap-3 w-full max-w-2xl mx-auto">
                    {zones.map((zone) => {
                        const tier = event.priceTiers.find(t => t.id === zone.tierId);
                        return (
                            <button
                                key={zone.name}
                                onClick={() => requireAuth(() => setSelectedZoneName(zone.name))}
                                className={`${zone.col} h-14 rounded-lg font-bold text-lg border border-white/10 ${tier?.color} ${selectedZoneName === zone.name ? 'ring-4 ring-white scale-110 z-10 shadow-2xl' : 'opacity-90'}`}
                            >
                                {zone.name}
                            </button>
                        );
                    })}
                </div>
              </div>
            </section>
          </div>

          {/* --- ✅ ฝั่งขวา: ข้อมูลการจองที่แก้ตามรูปภาพ --- */}
          <div className="relative">
            <div className="sticky top-24 bg-[#161B22] border border-white/10 rounded-3xl p-8 shadow-2xl space-y-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <Ticket className="text-pink-500" /> ข้อมูลการจอง
              </h3>
              
              <div>
                <label className="text-gray-400 text-xs uppercase font-bold tracking-widest block mb-2">รอบที่เลือก</label>
                <div className="bg-white/5 p-4 rounded-xl border border-white/10 text-gray-500">
                    <p className="font-medium">{currentRound ? currentRound.date : "กรุณาเลือกรอบการแสดง"}</p>
                </div>
              </div>

              <div>
                <label className="text-gray-400 text-xs uppercase font-bold tracking-widest block mb-2">โซนที่เลือก</label>
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10 text-gray-500">
                    <span className="text-2xl font-black">{selectedZoneName || "-"}</span>
                    <span className="text-xl font-bold">{currentTier ? `฿${currentTier.price.toLocaleString()}` : "฿0"}</span>
                </div>
              </div>

              <div className="pt-4 border-t border-white/10">
                <div className="flex justify-between items-end">
                    <span className="text-gray-400">ราคารวมต่อใบ</span>
                    <span className="text-4xl font-black text-white">{currentTier ? `฿${currentTier.price.toLocaleString()}` : "-"}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}