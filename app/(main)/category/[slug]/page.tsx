"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Mic2, Drama, Music2, Ticket, MapPin, Calendar, 
  ArrowLeft, Users, Music, Clock 
} from "lucide-react";
import React from "react"; 

interface CategoryConfigData {
  title: string;
  subtitle: string;
  gradient: string;
  shadow: string;
  icon: React.ReactNode;
  // venueHint: string; // ✅ เอาออก
}

// Mock Data (คงเดิม)
const allEvents = [
  {
    id: 1,
    category: "concert",
    title: "WORLD TOUR 2025: THE BEGINNING",
    artist: "THE BOYZ",
    date: "15 AUG 2025",
    time: "19:00",
    venue: "Impact Arena",
    price: "2,500 - 6,500 THB",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?w=800&q=80",
  },
  {
    id: 2,
    category: "festival",
    title: "SUMMER SONIC BANGKOK",
    artist: "Various Artists",
    date: "22 SEP 2025",
    time: "14:00",
    venue: "BITEC Bangna",
    price: "3,000 THB",
    image: "https://images.unsplash.com/photo-1459749411177-717441447994?w=800&q=80",
  },
  // ... (ข้อมูลอื่นๆ คงไว้เหมือนเดิม)
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;

  const categoryConfig: Record<string, CategoryConfigData> = {
    concert: { 
      title: "คอนเสิร์ต", 
      subtitle: "มันส์ไปกับศิลปินระดับโลกและโชว์สุดอลังการ",
      gradient: "from-blue-600 via-cyan-500 to-teal-400",
      shadow: "shadow-blue-500/20",
      icon: <Mic2 size={40} className="text-white" />,
    },
    fanmeet: { 
      title: "แฟนมีตติ้ง",
      subtitle: "โมเมนต์สุดฟิน ใกล้ชิดศิลปินคนโปรด",
      gradient: "from-pink-600 via-rose-500 to-red-400",
      shadow: "shadow-pink-500/20",
      icon: <Users size={40} className="text-white" />,
    },
    festival: { 
      title: "เทศกาลดนตรี",
      subtitle: "สนุกสุดเหวี่ยงกับบรรยากาศเฟสติวัล",
      gradient: "from-red-600 via-orange-500 to-yellow-400",
      shadow: "shadow-red-500/20",
      icon: <Music size={40} className="text-white" />,
    },
    "concert-fanmeet": {
      title: "คอนเสิร์ต & แฟนมีต",
      subtitle: "รวมทุกความประทับใจ ทั้งคอนเสิร์ตและแฟนมีตติ้ง",
      gradient: "from-blue-600 via-purple-500 to-pink-500",
      shadow: "shadow-purple-500/20",
      icon: <Mic2 size={40} className="text-white" />,
    },
    theater: {
      title: "ละครเวที & วาไรตี้",
      subtitle: "เรื่องราวสุดประทับใจและศาสตร์แห่งการแสดง",
      gradient: "from-purple-600 via-fuchsia-500 to-pink-400",
      shadow: "shadow-purple-500/20",
      icon: <Drama size={40} className="text-white" />,
    },
    orchestra: {
      title: "ออร์เคสตรา & คลาสสิก",
      subtitle: "สุนทรียภาพทางดนตรีคลาสสิก",
      gradient: "from-cyan-600 via-sky-500 to-blue-400",
      shadow: "shadow-cyan-500/20",
      icon: <Music2 size={40} className="text-white" />,
    },
    classical: {
      title: "ออร์เคสตรา & คลาสสิก",
      subtitle: "สุนทรียภาพทางดนตรีคลาสสิก",
      gradient: "from-cyan-600 via-sky-500 to-blue-400",
      shadow: "shadow-cyan-500/20",
      icon: <Music2 size={40} className="text-white" />,
    },
    all: {
      title: "งานแสดงทั้งหมด",
      subtitle: "ค้นพบอีเวนต์ที่น่าสนใจรอบตัวคุณ",
      gradient: "from-gray-700 via-slate-600 to-zinc-500",
      shadow: "shadow-gray-500/20",
      icon: <Ticket size={40} className="text-white" />,
    },
  };

  const config = categoryConfig[slug] || categoryConfig.all;

  const filteredEvents = allEvents.filter(event => {
    if (slug === 'all') return true;
    if (slug === 'concert-fanmeet') {
       return event.category === 'concert' || event.category === 'fanmeet';
    }
    if (slug === 'classical') {
       return event.category === 'orchestra';
    }
    return event.category === slug;
  });

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white pt-20 pb-10">
      
      {/* Header Banner */}
      <div className="relative mb-12">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-b ${config.gradient} opacity-20 blur-[120px] rounded-full pointer-events-none`}></div>

        <div className="container mx-auto px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} /> กลับหน้าหลัก
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg shadow-black/50`}>
              {config.icon}
            </div>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight uppercase">{config.title}</h1>
              <p className="text-gray-400 text-lg">{config.subtitle}</p>
              
              {/* ✅ ลบส่วน MapPin และ venueHint ออกจากตรงนี้แล้วครับ */}
            </div>
          </div>
        </div>
      </div>

      {/* Event List Grid (คงเดิม) */}
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Calendar size={20} className="text-gray-400" /> อีเวนต์ที่กำลังจะเกิดขึ้น
          </h2>
          <div className="text-sm text-gray-500">พบ {filteredEvents.length} รายการ</div>
        </div>

        {filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredEvents.map((event) => (
              <Link 
                key={event.id} 
                href={`/event/${event.id}`}
                className="group bg-[#161B22] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white uppercase border border-white/10">
                    {event.category}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="text-lg font-bold mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{event.artist}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} /> {event.date}
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <Clock size={14} /> {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} /> {event.venue}
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-gray-400">ราคาเริ่มต้น</span>
                    <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`}>
                      {event.price}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5 text-gray-400">
            <p className="text-lg">ยังไม่มีอีเวนต์ในหมวดหมู่นี้เร็วๆ นี้</p>
          </div>
        )}
      </div>
    </div>
  );
}