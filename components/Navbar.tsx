"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Search, ChevronDown, ShoppingCart, Bell, 
  Mic2, Drama, Music2, Ticket, MapPin, TrendingUp,
  ArrowUpRight, X, User, LogOut, History, Pencil, Lock 
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useUser } from "@/context/UserContext"; 
import Cookies from "js-cookie"; 
import { allSearchTerms } from "@/data/searchData"; 

// ✅ Import Component
import NotificationDropdown, { NotificationItem } from "./NotificationDropdown";

export default function Navbar() {
  const { language: lang, setLanguage: setLang, t } = useLanguage();
  const { cartCount } = useCart();
  const { user, setUser, profileImage } = useUser(); 
  const router = useRouter();

  // State ต่างๆ
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isEventOpen, setIsEventOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotiOpen, setIsNotiOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  // ==========================================
  // ✅ 1. เตรียมข้อมูล 2 ชุด (Guest vs Member)
  // ==========================================
  // (ย้ายออกมานอก render หรือใช้ useMemo ก็ได้ แต่ไว้ตรงนี้เพื่อความง่ายในการอ่านตามเดิม)
  const guestNotifications: NotificationItem[] = [
    { 
      id: 101, type: "info", title: "🔥 กำลังฮิต: Bruno Mars", 
      desc: "บัตรโซนยืนเหลือน้อยกว่า 100 ใบ! สมัครสมาชิกเพื่อจองเลย", 
      time: "10 นาทีที่แล้ว", link: "/register", read: false 
    },
    { 
      id: 102, type: "info", title: "สมาชิกใหม่ลด 10% 🎉", 
      desc: "สมัครวันนี้รับโค้ด NEWUSER ทันที", 
      time: "1 วันที่แล้ว", link: "/register", read: false 
    },
    { 
      id: 103, type: "system", title: "ผังคอนเสิร์ต SUMMER SONIC", 
      desc: "เปิดเผยผังที่นั่งและราคาบัตรแล้ว เช็คเลย!", 
      time: "2 วันที่แล้ว", link: "/event/summer-sonic", read: true 
    }
  ];

  const memberNotifications: NotificationItem[] = [
    { 
      id: 1, type: "alert", title: "ชำระเงินไม่สำเร็จ ❌", 
      desc: "ออเดอร์ #BK88100 ถูกปฏิเสธ โปรดชำระใหม่ใน 15 นาที", 
      time: "2 นาทีที่แล้ว", link: "/payment/retry", read: false 
    },
    { 
      id: 2, type: "booking", title: "จองบัตรสำเร็จ! ✅", 
      desc: "คุณจองบัตร 2060 MOTHERSHIP โซน A1 เรียบร้อยแล้ว", 
      time: "5 นาทีที่แล้ว", link: "/ticket", read: false 
    },
    { 
      id: 3, type: "event", title: "ใกล้ถึงวันงานแล้ว 📅", 
      desc: "คอนเสิร์ต Jeff Satur จะเริ่มในอีก 24 ชม.", 
      time: "1 ชั่วโมงที่แล้ว", link: "/event/1", read: true 
    }
  ];

  // ✅ 2. State สำหรับเก็บ Notifications ที่จะแสดงผลจริง
  const [notifications, setNotifications] = useState<NotificationItem[]>(guestNotifications);

  // ✅ 3. คำนวณจำนวนที่ยังไม่อ่าน (จะคำนวณใหม่ทุกครั้งที่ State เปลี่ยน)
  const unreadCount = notifications.filter(n => !n.read).length;

  // ✅ 4. ฟังก์ชันกด "อ่านทั้งหมด"
  const handleMarkAllAsRead = () => {
    // อัปเดต State โดยตรงเพื่อให้ UI เปลี่ยนทันที และจะไม่โดนทับจาก Interval แล้ว
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // ==========================================
  // ✅ แก้ไขส่วน useEffect (แยกเป็น 2 ส่วน)
  // ==========================================
  
  // ส่วนที่ 1: เช็คสถานะ Login อย่างเดียว (Loop ทุก 1 วิ)
  useEffect(() => {
    const checkAuth = () => {
      const hasContextUser = !!user;
      const hasCookie = Cookies.get("isLoggedIn") === "true";
      const userIsLoggedIn = hasContextUser || hasCookie;
      
      // อัปเดตสถานะ Auth (ถ้าค่าเปลี่ยน React จะไปทำ useEffect ตัวถัดไป)
      setIsLoggedIn(userIsLoggedIn);
    };
    
    checkAuth();
    const authInterval = setInterval(checkAuth, 1000);
    return () => clearInterval(authInterval);
  }, [user]);

  // ส่วนที่ 2: โหลดข้อมูล Notification ใหม่ "เฉพาะตอนสถานะ Login เปลี่ยน" เท่านั้น
  // วิธีนี้จะทำให้ค่า read: true ที่เรากดไป ไม่โดนทับจนกว่าจะ Logout/Login ใหม่
  useEffect(() => {
    if (isLoggedIn) {
      setNotifications(memberNotifications);
    } else {
      setNotifications(guestNotifications);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoggedIn]); 


  const [searchQuery, setSearchQuery] = useState("");
  const searchSuggestions = allSearchTerms || []; 
  const filteredSuggestions = searchSuggestions
    .filter((item: string) => item.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(0, 15); 

  const handleSearch = (e?: React.FormEvent, keyword?: string) => {
    if (e) e.preventDefault();
    const term = keyword || searchQuery;
    if (!term.trim()) return;
    setSearchQuery(term);
    setIsSearchOpen(false);
    router.push(`/explore?q=${encodeURIComponent(term)}`);
  };

  const handleLogout = () => {
    Cookies.remove("isLoggedIn");
    Cookies.remove("user_role");
    setUser(null); 
    setIsLoggedIn(false);
    setIsUserMenuOpen(false);
    
    // รีเซ็ตแจ้งเตือนเป็น Guest ทันที
    setNotifications(guestNotifications);

    router.push("/"); 
    router.refresh(); 
  };

  const trendingEvents = [
    { id: 1, title: "The Grand Concert 2025", venue: "Impact Arena", image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=200&q=80" },
    { id: 2, title: "Phantom of the Opera", venue: "Rachadalai", image: "https://images.unsplash.com/photo-1503095392237-5985e5a9536e?w=200&q=80" },
    { id: 3, title: "Neon Music Festival", venue: "BITEC Live", image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=200&q=80" },
  ];

  const dropdownRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLDivElement>(null);
  const notiRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen && searchInputRef.current) setTimeout(() => searchInputRef.current?.focus(), 100);
  }, [isSearchOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) setIsLangOpen(false);
      if (eventRef.current && !eventRef.current.contains(event.target as Node)) setIsEventOpen(false);
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) setIsSearchOpen(false);
      if (notiRef.current && !notiRef.current.contains(event.target as Node)) setIsNotiOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) setIsUserMenuOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const languages = [
    { code: "th", label: "TH", name: "ภาษาไทย", flagUrl: "https://flagcdn.com/w40/th.png" },
    { code: "en", label: "US", name: "English", flagUrl: "https://flagcdn.com/w40/us.png" }
  ];

  const eventCategories = [
    { id: "concert-fanmeet", nameTh: "คอนเสิร์ต & แฟนมีต", nameEn: "Concerts & Fan Meet", descTh: "อิมแพ็ค อารีน่า", descEn: "at Impact Arena", icon: <Mic2 size={18} /> },
    { id: "theater", nameTh: "ละครเวที & วาไรตี้", nameEn: "Theater & Variety", descTh: "เมืองไทยรัชดาลัย", descEn: "at Rachadalai Theatre", icon: <Drama size={18} /> },
    { id: "classical", nameTh: "ออร์เคสตรา & คลาสสิก", nameEn: "Orchestra & Classical", descTh: "มหิดลสิทธาคาร", descEn: "at Prince Mahidol Hall", icon: <Music2 size={18} /> },
    { id: "all", nameTh: "งานแสดงทั้งหมด", nameEn: "All Events", descTh: "ค้นหาทุกสถานที่", descEn: "Explore All Venues", icon: <Ticket size={18} /> },
  ];

  const currentLang = languages.find(l => l.code === lang);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0B0F14]/90 backdrop-blur-md border-b border-white/5 px-6 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Left Section */}
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-blue-500 drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">BEATPASS</Link>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-300">
            <Link href="/" className="hover:text-white transition-colors">{t.nav_home}</Link>
            
            <div className="relative" ref={eventRef}>
              <button onClick={() => setIsEventOpen(!isEventOpen)} className={`flex items-center gap-1 transition-colors ${isEventOpen ? "text-blue-500" : "hover:text-white"}`}>
                {t.nav_category} <ChevronDown size={14} className={`transition-transform ${isEventOpen ? "rotate-180" : ""}`}/>
              </button>
              {isEventOpen && (
                <div className="absolute top-full left-0 mt-4 w-64 bg-[#161B22] border border-white/20 rounded-xl shadow-2xl overflow-hidden py-2 animate-in fade-in zoom-in-95 duration-200 ring-1 ring-white/5">
                  {eventCategories.map((cat) => (
                    <Link 
                        key={cat.id} 
                        href={`/category/${cat.id}`} 
                        className="flex items-start gap-4 px-5 py-3.5 hover:bg-white/5 transition-all group border-l-2 border-transparent hover:border-blue-500" 
                        onClick={() => setIsEventOpen(false)}
                    >
                        <span className="text-blue-500 mt-0.5 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-all">
                        {cat.icon}
                        </span>
                        <div>
                            <div className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                                {lang === "th" ? cat.nameTh : cat.nameEn}
                            </div>
                            <div className="text-xs text-gray-400 group-hover:text-gray-300 mt-1 flex items-center gap-1.5 font-medium">
                                <MapPin size={11} className="text-gray-500 group-hover:text-blue-400 transition-colors" /> 
                                {lang === "th" ? cat.descTh : cat.descEn}
                            </div>
                        </div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
            
            <Link href="/faq" className="hover:text-white transition-colors">{t.nav_faq}</Link>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-5">
          
          <div className="relative" ref={searchRef}>
            <button onClick={() => setIsSearchOpen(!isSearchOpen)} className={`text-gray-400 hover:text-white transition-colors p-2 rounded-full ${isSearchOpen ? 'bg-white/10 text-white' : ''}`}>
              <Search size={20} />
            </button>
            {isSearchOpen && (
              <div className="absolute top-full right-0 mt-2 w-80 md:w-96 bg-[#12161B] border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                <form onSubmit={(e) => handleSearch(e)} className="relative border-b border-white/10">
                  <input 
                    ref={searchInputRef}
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder={t.hero_search_placeholder}
                    className="w-full bg-[#12161B] text-white text-base px-4 py-3 pl-12 focus:outline-none placeholder:text-gray-600"
                  />
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
                  {searchQuery && (
                    <button type="button" onClick={() => setSearchQuery("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white">
                      <X size={16} />
                    </button>
                  )}
                </form>

                <div className="py-2">
                  {searchQuery ? (
                    <>
                      <div className="px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider">ผลลัพธ์ที่เกี่ยวข้อง</div>
                      <div className="space-y-0.5 max-h-80 overflow-y-auto custom-scrollbar">
                        {filteredSuggestions.length > 0 ? (
                          filteredSuggestions.map((item: string, index: number) => (
                            <button key={index} onClick={() => handleSearch(undefined, item)} className="w-full text-left flex items-center gap-3 px-4 py-2 hover:bg-white/5 transition-colors group">
                              <Search size={14} className="text-gray-500 group-hover:text-blue-400" />
                              <span className="text-sm text-gray-300 group-hover:text-white font-medium line-clamp-1">{item}</span>
                              <ArrowUpRight size={12} className="ml-auto text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </button>
                          ))
                        ) : (
                          <div className="px-4 py-4 text-center text-gray-500 text-xs">{`ไม่พบข้อมูล "${searchQuery}"`}</div>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="px-4 py-2 text-[11px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2"><TrendingUp size={12} /> {t.popular_events} (Trending)</div>
                      <div className="space-y-1 p-2">
                        {trendingEvents.map((event) => (
                          <Link key={event.id} href={`/event/${event.id}`} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-colors group" onClick={() => setIsSearchOpen(false)}>
                            <img src={event.image} alt={event.title} className="w-12 h-12 rounded-lg object-cover border border-white/10 group-hover:border-blue-500/50" />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors">{event.title}</h4>
                              <div className="text-[10px] text-gray-500 truncate flex items-center gap-1"><MapPin size={10} /> {event.venue}</div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
          
          {/* ✅ ส่วนแจ้งเตือน */}
          <div className="relative" ref={notiRef}>
            <button 
                onClick={() => setIsNotiOpen(!isNotiOpen)} 
                className={`relative text-gray-400 hover:text-white transition-colors p-1.5 rounded-full ${isNotiOpen ? 'bg-white/10 text-white' : ''}`}
            >
                <Bell size={20} />
                {/* 🔴 จุดแดง (จะหายไปถ้า unreadCount = 0) */}
                {unreadCount > 0 && <span className="absolute top-0.5 right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0B0F14] animate-pulse"></span>}
            </button>

            {isNotiOpen && (
                <div className="absolute top-full right-[-60px] md:right-0 mt-3 z-50 animate-in fade-in zoom-in-95 duration-200">
                    <NotificationDropdown 
                      notifications={notifications} 
                      onMarkAllAsRead={handleMarkAllAsRead} 
                    />
                </div>
            )}
          </div>

          <Link 
            href="/cart"
            className="relative text-gray-400 hover:text-white transition-colors p-1.5 rounded-full hover:bg-white/5 group"
          >
            <ShoppingCart size={20} className="group-active:scale-90 transition-transform" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#FF2D55] text-[10px] text-white font-bold px-1.5 py-0.5 rounded-full border border-[#0B0F14] animate-in zoom-in">
                {cartCount}
              </span>
            )}
          </Link>

          <div className="relative" ref={dropdownRef}>
            <button onClick={() => setIsLangOpen(!isLangOpen)} className="flex items-center gap-2 border border-white/30 px-2 py-1.5 rounded hover:bg-white/5 transition ml-2">
              <img src={currentLang?.flagUrl} alt={currentLang?.label || ""} className="w-5 h-auto rounded-sm block" />
              <span className="text-white font-bold text-sm uppercase">{currentLang?.label}</span>
              <ChevronDown size={14} className={`text-white transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            {isLangOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-[#12161B] border border-white/10 rounded-lg shadow-2xl py-1 z-50">
                {languages.map((item) => (
                  <button key={item.code} onClick={() => { setLang(item.code as "th" | "en"); setIsLangOpen(false); }} className={`w-full flex items-center px-4 py-3 hover:bg-white/10 transition-colors ${lang === item.code ? 'bg-white/5' : ''}`}>
                    <img src={item.flagUrl} alt={item.label} className="w-6 h-auto rounded-sm mr-3 block" />
                    <span className={`font-bold text-sm w-8 ${lang === item.code ? 'text-blue-500' : 'text-gray-400'}`}>{item.label}</span>
                    <span className={`font-medium text-sm ml-2 ${lang === item.code ? 'text-blue-400' : 'text-gray-200'}`}>{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {isLoggedIn ? (
            <div className="relative" ref={userMenuRef}>
              <button 
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-2 pl-3 pr-1 py-1 border border-white/20 rounded-lg group active:scale-95 transition-all bg-white/5 hover:bg-white/10"
              >
                <div className="text-right hidden md:block">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-none mb-1">WELCOME</p>
                  <p className="text-[13px] font-black text-[#4FACFE] group-hover:text-white transition-colors tracking-tight leading-none uppercase">
                    BEATPASS MEMBER
                  </p>
                </div>
                
                <div className="w-9 h-9 bg-gradient-to-tr from-[#4FACFE] to-[#A855F7] rounded-full flex items-center justify-center border border-white/20 overflow-hidden shadow-lg shadow-blue-500/10">
                   {profileImage ? (
                     <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                   ) : (
                     <User size={18} className="text-white" />
                   )}
                </div>
              </button>

              {isUserMenuOpen && (
                <div className="absolute top-full right-0 mt-2 w-60 bg-[#1A1F2C] border border-white/10 rounded-xl shadow-2xl overflow-hidden py-1 animate-in fade-in zoom-in-95 duration-200 z-50">
                  
                  <Link href="/profile/tickets" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors group border-b border-white/5">
                    <Ticket size={16} className="text-blue-500 group-hover:scale-110 transition-transform" /> 
                    <span className="font-medium">ตั๋วของฉัน</span>
                  </Link>

                  <Link href="/profile/history" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors group border-b border-white/5">
                    <History size={16} className="text-purple-500 group-hover:scale-110 transition-transform" /> 
                    <span className="font-medium">ประวัติการสั่งซื้อ</span>
                  </Link>

                  <Link href="/profile/edit" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors group border-b border-white/5">
                    <Pencil size={16} className="text-green-500 group-hover:scale-110 transition-transform" /> 
                    <span className="font-medium">แก้ไขข้อมูลส่วนตัว</span>
                  </Link>

                  <Link href="/profile/password" onClick={() => setIsUserMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:bg-white/5 hover:text-white transition-colors group border-b border-white/5">
                    <Lock size={16} className="text-orange-500 group-hover:scale-110 transition-transform" /> 
                    <span className="font-medium">เปลี่ยนรหัสผ่าน</span>
                  </Link>

                  <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 transition-colors group border-b border-white/5">
                    <LogOut size={16} className="group-hover:translate-x-0.5 transition-transform" /> 
                    <span className="font-medium">ออกจากระบบ</span>
                  </button>

                </div>
              )}
            </div>
          ) : (
            <Link 
              href="/login" 
              className="hidden md:block px-6 py-2 text-sm font-bold text-white border-2 border-blue-500 rounded-lg hover:bg-blue-500 hover:text-white hover:shadow-[0_0_20px_rgba(59,130,246,0.6)] transition-all active:scale-95"
            >   
              เข้าสู่ระบบ / สมัครสมาชิก
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
}