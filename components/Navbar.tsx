"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Search, ChevronDown, ShoppingCart, Bell, Mic2, Music2, Drama, Ticket, MapPin, TrendingUp } from "lucide-react";
// ✅ 1. Import Context Hook
import { useLanguage } from "@/context/LanguageContext";

export default function Navbar() {
  // ❌ ลบอันเก่าออก: const [lang, setLang] = useState("th");
  // ✅ 2. ใช้ Hook แทน (ดึงค่าภาษาและคำแปลมาใช้)
  const { language: lang, setLanguage: setLang, t } = useLanguage();

  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
      if (eventRef.current && !eventRef.current.contains(event.target as Node)) {
        setIsEventOpen(false);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "th", label: "TH", name: "ภาษาไทย", flagUrl: "https://flagcdn.com/w40/th.png" },
    { code: "en", label: "US", name: "English", flagUrl: "https://flagcdn.com/w40/us.png" }
  ];

  const eventCategories = [
    { id: "impact", nameTh: "คอนเสิร์ต & แฟนมีต", nameEn: "Concerts & Fan Meet", descTh: "อิมแพ็ค อารีน่า", descEn: "at Impact Arena", icon: <Mic2 size={18} /> },
    { id: "rachadalai", nameTh: "ละครเวที & วาไรตี้", nameEn: "Theater & Variety", descTh: "เมืองไทยรัชดาลัย", descEn: "at Rachadalai Theatre", icon: <Drama size={18} /> },
    { id: "mahidol", nameTh: "ออร์เคสตรา & คลาสสิก", nameEn: "Orchestra & Classical", descTh: "มหิดลสิทธาคาร", descEn: "at Prince Mahidol Hall", icon: <Music2 size={18} /> },
    { id: "all", nameTh: "งานแสดงทั้งหมด", nameEn: "All Events", descTh: "ค้นหาทุกสถานที่", descEn: "Explore All Venues", icon: <Ticket size={18} /> },
  ];

  const trendingEvents = [
    { id: 1, title: "The Grand Concert 2025", venue: "Impact Arena", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=200&q=80" },
    { id: 2, title: "Phantom of the Opera", venue: "Rachadalai", image: "https://images.unsplash.com/photo-1503095392237-5985e5a9536e?w=200&q=80" },
    { id: 3, title: "Neon Music Festival", venue: "BITEC Live", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80" },
  ];

  const currentLang = languages.find(l => l.code === lang);

  // ❌ ไม่ต้องประกาศ t เองแล้ว เพราะ Context ส่งมาให้แล้ว (ประหยัดโค้ดไปเยอะ)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F14]/90 backdrop-blur-md border-b border-white/5 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">
            BEATPASS
          </Link>
          
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            {/* ✅ ใช้ t.nav_home จาก translations.ts */}
            <Link href="/" className="hover:text-white transition-colors">{t.nav_home}</Link>
            
            <div className="relative" ref={eventRef}>
              <button onClick={() => setIsEventOpen(!isEventOpen)} className={`flex items-center gap-1 transition-colors ${isEventOpen ? "text-blue-500" : "hover:text-white"}`}>
                {/* ✅ ใช้ t.nav_category */}
                {t.nav_category} <ChevronDown size={14} className={`transition-transform ${isEventOpen ? "rotate-180" : ""}`}/>
              </button>
              {isEventOpen && (
                <div className="absolute top-full left-0 mt-4 w-60 bg-[#12161B] border border-white/10 rounded-lg shadow-2xl overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200">
                  {eventCategories.map((cat) => (
                    <Link key={cat.id} href={`/search?venue=${cat.id}`} className="flex items-start gap-3 px-4 py-3 text-gray-300 hover:bg-blue-500/10 transition-colors group" onClick={() => setIsEventOpen(false)}>
                      <span className="text-blue-500 mt-0.5 group-hover:scale-110 transition-transform">{cat.icon}</span>
                      <div>
                        {/* ✅ เช็ค lang ว่าเป็น 'th' หรือไม่ (เพราะข้อมูลใน Mock Data ยังแยกภาษาอยู่) */}
                        <div className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{lang === "th" ? cat.nameTh : cat.nameEn}</div>
                        <div className="text-[10px] text-gray-500 group-hover:text-gray-400 mt-0.5 flex items-center gap-1">
                          <MapPin size={10} /> {lang === "th" ? cat.descTh : cat.descEn}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            {/* ✅ ใช้ t.nav_faq */}
            <Link href="/faq" className="hover:text-white transition-colors">{t.nav_faq}</Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          <div className="relative" ref={searchRef}>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`text-gray-400 hover:text-white transition-colors p-2 rounded-full ${isSearchOpen ? 'bg-white/10 text-white' : ''}`}
            >
              <Search size={20} />
            </button>
            {isSearchOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-[#12161B] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 p-4">
                <div className="relative mb-4">
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    // ✅ ใช้ t.hero_search_placeholder
                    placeholder={t.hero_search_placeholder}
                    className="w-full bg-[#0B0F14] border border-white/10 text-white text-sm px-4 py-2.5 pl-10 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-gray-600"
                  />
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                </div>
                <div>
                  <div className="flex items-center gap-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-3 px-1">
                    <TrendingUp size={12} /> {t.popular_events} (Trending)
                  </div>
                  <div className="space-y-1">
                    {trendingEvents.map((event) => (
                      <Link 
                        key={event.id} 
                        href={`/event/${event.id}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group"
                        onClick={() => setIsSearchOpen(false)}
                      >
                        <img src={event.image} alt={event.title} className="w-10 h-10 rounded object-cover border border-white/10 group-hover:border-blue-500/50" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-white truncate group-hover:text-blue-400 transition-colors">{event.title}</h4>
                          <div className="text-[10px] text-gray-500 truncate flex items-center gap-1">
                            <MapPin size={10} /> {event.venue}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
          
          <div className="relative cursor-pointer text-gray-400 hover:text-white transition-colors">
            <Bell size={20} />
            <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-red-500 rounded-full border border-[#0B0F14]"></span>
          </div>

          <div className="relative cursor-pointer text-gray-400 hover:text-white transition-colors">
            <ShoppingCart size={20} />
            <span className="absolute -top-2 -right-2 bg-blue-500 text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full border border-[#0B0F14]">0</span>
          </div>

          <div className="relative" ref={dropdownRef}>
            <button 
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 border border-white/30 px-2 py-1.5 rounded hover:bg-white/5 transition ml-2"
            >
              <img src={currentLang?.flagUrl} alt={currentLang?.label} className="w-5 h-auto rounded-sm block" />
              <span className="text-white font-bold text-sm uppercase">{currentLang?.label}</span>
              <ChevronDown size={14} className={`text-white transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>

            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#12161B] border border-white/10 rounded-lg shadow-2xl py-1 z-50">
                {languages.map((item) => (
                  <button
                    key={item.code}
                    onClick={() => { 
                      // ✅ setLang ตอนนี้จะเปลี่ยนค่าใน Context (มีผลทั้งเว็บ)
                      setLang(item.code as "th" | "en"); 
                      setIsLangOpen(false); 
                    }}
                    className={`w-full flex items-center px-4 py-3 hover:bg-white/10 transition-colors ${lang === item.code ? 'bg-white/5' : ''}`}
                  >
                    <img src={item.flagUrl} alt={item.label} className="w-6 h-auto rounded-sm mr-3 block" />
                    <span className={`font-bold text-sm w-8 ${lang === item.code ? 'text-blue-500' : 'text-gray-400'}`}>
                      {item.label}
                    </span>
                    <span className={`font-medium text-sm ml-2 ${lang === item.code ? 'text-blue-400' : 'text-gray-200'}`}>
                      {item.name}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link href="/login" className="hidden md:block px-6 py-2 text-sm font-bold text-white border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all active:scale-95">
            {/* ✅ ใช้ t.nav_login */}
            {t.nav_login}
          </Link>
        </div>
      </div>
    </nav>
  );
}