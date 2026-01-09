"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  Mic2, Drama, Music2, Ticket, MapPin, Calendar, 
  ArrowLeft, Users, Music, Clock, ChevronRight, Tag
} from "lucide-react";
import React from "react"; 

// กำหนด Type ของ Config
interface CategoryConfigData {
  title: string;
  subtitle: string;
  gradient: string;
  shadow: string;
  icon: React.ReactNode;
}

// ✅ Mock Data
const allEvents = [
  // --- 🎤 CONCERTS ---
  {
    id: 1,
    category: "concert",
    title: "THE BOYZ WORLD TOUR : ZENERATION II",
    artist: "THE BOYZ",
    date: "15 AUG 2025",
    time: "19:00",
    venue: "Impact Arena",
    price: "2,500 - 6,500 THB",
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop", 
    status: "SELLING"
  },
  {
    id: 2,
    category: "concert",
    title: "NCT WISH : SCHOOL of WISH Fan Showcase",
    artist: "NCT WISH",
    date: "25 APR 2026",
    time: "18:00",
    venue: "MCC Hall",
    price: "2,000 - 5,500 THB",
    image: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?q=80&w=1000&auto=format&fit=crop", 
    status: "SELLING"
  },
  
  // --- 🤝 FANMEETS ---
  {
    id: 3,
    category: "fanmeet",
    title: "KIM SEON HO ASIA TOUR <Color+Full>",
    artist: "Kim Seon Ho",
    date: "15 FEB 2026",
    time: "18:00",
    venue: "Union Hall",
    price: "2,500 - 6,500 THB",
    image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000&auto=format&fit=crop", 
    status: "SELLING"
  },
  {
    id: 4,
    category: "fanmeet",
    title: "HWANG IN YOUP FAN MEETING TOUR [IN LOVE]",
    artist: "Hwang In Youp",
    date: "14 DEC 2025",
    time: "17:00",
    venue: "UOB LIVE, Emsphere",
    price: "2,500 - 6,500 THB",
    image: "https://pbs.twimg.com/media/F1_z9cfaYAAy2_K?format=jpg&name=large",
    status: "SELLING"
  },
  {
    id: 5,
    category: "fanmeet",
    title: "PARK BO GUM FANMEETING <Cantabile>",
    artist: "Park Bo Gum",
    date: "05 APR 2026",
    time: "18:00",
    venue: "Thunder Dome",
    price: "3,000 - 6,000 THB",
    image: "https://images.unsplash.com/photo-1533174072545-e8d4aa97edf9?q=80&w=1000&auto=format&fit=crop",
    status: "SELLING"
  },

  // --- 🎭 THEATER & VARIETY ---
  {
    id: 7,
    category: "theater",
    title: "THE PHANTOM OF THE OPERA",
    artist: "Broadway Cast",
    date: "10-30 JUN 2026",
    time: "19:30",
    venue: "Muangthai Rachadalai Theatre",
    price: "1,500 - 4,500 THB",
    image: "https://images.unsplash.com/photo-1503095392269-2d6092842485?q=80&w=1000&auto=format&fit=crop",
    status: "SELLING"
  },
  {
    id: 8,
    category: "theater",
    title: "CIRQUE DU SOLEIL: WORLDS AWAY",
    artist: "Cirque du Soleil",
    date: "15-20 JUL 2026",
    time: "19:00",
    venue: "Impact Arena",
    price: "2,000 - 5,000 THB",
    image: "https://images.unsplash.com/photo-1536300007881-7e482242baa5?q=80&w=1000&auto=format&fit=crop",
    status: "SELLING"
  },
  {
    id: 9,
    category: "theater",
    title: "NANTA SHOW BANGKOK",
    artist: "Nanta",
    date: "Every Weekend",
    time: "20:00",
    venue: "Show DC Hall",
    price: "1,000 - 2,500 THB",
    image: "https://images.unsplash.com/photo-1468359601543-843bfaef291a?q=80&w=1000&auto=format&fit=crop",
    status: "SELLING"
  },

  // --- 🎻 ORCHESTRA & CLASSICAL ---
  {
    id: 10,
    category: "classical",
    title: "RBSO 2026: The Great Classics",
    artist: "Royal Bangkok Symphony Orchestra",
    date: "05 SEP 2026",
    time: "19:00",
    venue: "Thailand Cultural Centre",
    price: "800 - 3,500 THB",
    image: "https://images.unsplash.com/photo-1465847899078-b290428d3268?q=80&w=1000&auto=format&fit=crop",
    status: "EARLY_BIRD"
  },
  {
    id: 11,
    category: "classical",
    title: "HARRY POTTER IN CONCERT",
    artist: "Thailand Philharmonic Orchestra",
    date: "12 OCT 2026",
    time: "16:00",
    venue: "Prince Mahidol Hall",
    price: "1,500 - 4,000 THB",
    image: "https://images.unsplash.com/photo-1514117445516-2ecfc9c4ec90?q=80&w=1000&auto=format&fit=crop",
    status: "SELLING"
  },

  // --- 🎪 FESTIVALS ---
  {
    id: 6,
    category: "festival",
    title: "SUMMER SONIC BANGKOK 2025",
    artist: "Various Artists",
    date: "22 SEP 2025",
    time: "14:00",
    venue: "BITEC Bangna",
    price: "3,500 THB",
    image: "https://images.unsplash.com/photo-1459749411177-717441447994?q=80&w=1000&auto=format&fit=crop",
    status: "EARLY_BIRD"
  },
];

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string || 'all';

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
    theater: {
      title: "ละครเวที & วาไรตี้",
      subtitle: "เรื่องราวสุดประทับใจและศาสตร์แห่งการแสดง",
      gradient: "from-purple-600 via-fuchsia-500 to-pink-400",
      shadow: "shadow-purple-500/20",
      icon: <Drama size={40} className="text-white" />,
    },
    classical: {
      title: "ออร์เคสตรา & คลาสสิก",
      subtitle: "สุนทรียภาพทางดนตรีคลาสสิก",
      gradient: "from-cyan-600 via-sky-500 to-blue-400",
      shadow: "shadow-cyan-500/20",
      icon: <Music2 size={40} className="text-white" />,
    },
    orchestra: {
      title: "ออร์เคสตรา & คลาสสิก",
      subtitle: "สุนทรียภาพทางดนตรีคลาสสิก",
      gradient: "from-cyan-600 via-sky-500 to-blue-400",
      shadow: "shadow-cyan-500/20",
      icon: <Music2 size={40} className="text-white" />,
    },
    // ✅ เพิ่ม Config สำหรับ "concert-fanmeet" ตรงนี้ครับ
    "concert-fanmeet": {
        title: "คอนเสิร์ต & แฟนมีต",
        subtitle: "รวมทุกความประทับใจ ทั้งคอนเสิร์ตและแฟนมีตติ้ง",
        // ใช้สีผสมระหว่างฟ้า (Concert) และชมพู (Fanmeet) = สีม่วง
        gradient: "from-violet-600 via-purple-500 to-fuchsia-400",
        shadow: "shadow-purple-500/20",
        icon: <Mic2 size={40} className="text-white" />,
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

  // Filter Events Logic
  const filteredEvents = allEvents.filter(event => {
    if (slug === 'all') return true;
    if (slug === 'concert-fanmeet') {
       return event.category === 'concert' || event.category === 'fanmeet';
    }
    if (slug === 'orchestra') {
        return event.category === 'classical';
    }
    return event.category === slug;
  });

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white pt-20 pb-10">
      
      {/* --- Header Banner --- */}
      <div className="relative mb-12">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-64 bg-gradient-to-b ${config.gradient} opacity-20 blur-[120px] rounded-full pointer-events-none`}></div>

        <div className="container mx-auto px-6 relative z-10">
          <Link href="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft size={20} /> กลับหน้าหลัก
          </Link>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
            <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${config.gradient} flex items-center justify-center shadow-lg shadow-black/50 shrink-0`}>
              {config.icon}
            </div>
            
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight uppercase">{config.title}</h1>
              <p className="text-gray-400 text-lg">{config.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* --- Event List Grid --- */}
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
                className="group bg-[#161B22] border border-white/5 rounded-2xl overflow-hidden hover:border-white/20 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col"
              >
                {/* Image & Status */}
                <div className="relative h-48 overflow-hidden">
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-500" />
                  
                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded-lg text-xs font-bold text-white uppercase border border-white/10 flex items-center gap-1">
                    <Tag size={10} /> {event.category}
                  </div>

                  {/* Status Badge */}
                  {event.status === 'SOLD_OUT' && (
                     <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-md shadow-sm">
                        SOLD OUT
                     </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">{event.title}</h3>
                  <p className="text-gray-400 text-sm mb-4">{event.artist}</p>
                  
                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="shrink-0" /> {event.date}
                      <span className="w-1 h-1 bg-gray-600 rounded-full"></span>
                      <Clock size={14} className="shrink-0" /> {event.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin size={14} className="shrink-0" /> {event.venue}
                    </div>
                  </div>

                  {/* Price & CTA */}
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center justify-between">
                    <div>
                        <span className="text-[10px] text-gray-500 block uppercase tracking-wider">ราคาเริ่มต้น</span>
                        <span className={`font-bold text-transparent bg-clip-text bg-gradient-to-r ${config.gradient}`}>
                        {event.price}
                        </span>
                    </div>
                    <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                        <ChevronRight size={16} />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="py-20 text-center border border-dashed border-white/10 rounded-3xl bg-white/5 text-gray-400">
            <Ticket size={48} className="mx-auto mb-4 opacity-20" />
            <p className="text-lg">ยังไม่มีอีเวนต์ในหมวดหมู่นี้เร็วๆ นี้</p>
            <Link href="/" className="text-sm text-blue-400 hover:underline mt-2 inline-block">กลับไปดูอีเวนต์ทั้งหมด</Link>
          </div>
        )}
      </div>
    </div>
  );
}