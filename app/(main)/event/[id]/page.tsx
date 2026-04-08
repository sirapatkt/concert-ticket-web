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

// ✅ เพิ่ม Interface สำหรับรับค่าผัง SVG
interface ZoneMapData {
  i?: number;
  z?: string;
  x?: number;
  y?: number;
  w?: number;
  h?: number;
  d?: string;
  cx?: number;
  cy?: number;
  rx?: number;
  c?: string; 
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

        const getImageUrl = (imagePath: string | null) => {
            if (!imagePath) return "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80"; 
            if (imagePath.startsWith("http")) return imagePath; 
            return `https://res.cloudinary.com/YOUR_CLOUD_NAME/image/upload/${imagePath}`;
        };

        const formattedEvent: UiEvent = {
            id: data.Event_id,
            title: data.eventName,
            venue: data.hall?.Hall_Name || "Location TBA",
            hallId: currentHallId,
            venueSize: formattedVenueSize,
            image: getImageUrl(data.bannerImage), 
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

  const handleZoneClick = (zoneName: string, tierPrice: number) => {
    if (selectedRoundId === 0) {
        alert("กรุณาเลือกรอบการแสดงที่ต้องการ ก่อนทำการคลิกเลือกโซนที่แผนผังครับ");
        return;
    }
    if (!currentRound) return;
    if (currentTime < currentRound.saleStart) {
        alert(`รอบนี้ยังไม่เปิดขายบัตรครับ\nเปิดขายวันที่: ${currentRound.saleStart.toLocaleString('th-TH')}`);
        return;
    }
    if (currentTime > currentRound.saleEnd) {
        alert("รอบการแสดงนี้ปิดการขายบัตรไปแล้วครับ");
        return;
    }
    if (!isLoggedIn) {
        router.push(`/login?redirect=/event/${id}`);
    } else {
        router.push(`/booking/select-seat?eventId=${id}&round=${selectedRoundId}&zone=${zoneName}&price=${tierPrice}`);
    }
  };

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
  // 🌟 จุดที่ 1: แก้ไข renderZoneButton ให้รับ style แบบ 3D และขนาดได้
  // ==========================================
  const renderZoneButton = (zoneName: string, customStyle: React.CSSProperties = {}, extraClass: string = "") => {
    const zone = event.zones.find(z => z.name.toUpperCase() === zoneName.toUpperCase());
    
    // ถ้าไม่มีโซนนี้ในระบบ ให้ Render เป็นที่ว่างเพื่อรักษาโครงสร้าง Grid
    if (!zone) {
        return <div key={zoneName} className={`opacity-0 pointer-events-none h-16 ${extraClass}`}></div>;
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
        style={{ ...clipPathStyle, ...customStyle }}
        className={`flex flex-col items-center justify-center min-h-[5rem] md:min-h-[6rem] py-2 px-2 text-center font-black text-white transition-all relative overflow-hidden rounded-sm hover:scale-[1.03] hover:z-10 focus:ring-4 ring-white hover:shadow-[0_0_20px_rgba(255,255,255,0.4)]
          ${tier?.color || 'bg-gray-700'} ${extraClass}
        `}
      >
        <span className="relative z-10 drop-shadow-md text-xl md:text-3xl tracking-widest">{zone.name}</span>
        <span className="relative z-10 drop-shadow-md text-xs md:text-sm font-medium mt-1 opacity-90">฿{zone.price.toLocaleString()}</span>
      </button>
    );
  };

  const renderInteractiveMap = () => {
    if (event.zones.length === 0) return <p className="text-slate-500 font-medium">ไม่พบข้อมูลโซนที่นั่ง</p>;

    // ==========================================
    // ✅ เพิ่มโครงสร้างแผนผังสำหรับ อิมแพ็ค อารีน่า (Hall 1) ที่ดึงข้อมูลมาจาก Admin
    // ==========================================
    if (event.hallId === "1") {
      const imSmallMap: ZoneMapData[] = [
        {z:"A1", x:160, y:230, w:330, h:180}, {z:"A2", x:510, y:230, w:330, h:180},
        {z:"A3", x:160, y:430, w:330, h:160}, {z:"A4", x:510, y:430, w:330, h:160},
        {z:"A5", d:"M 160 610 L 490 610 L 490 770 L 220 770 L 160 710 Z", cx:325, cy:690},
        {z:"A6", d:"M 510 610 L 840 610 L 840 710 L 780 770 L 510 770 Z", cx:675, cy:690},
        {z:"A7", d:"M 320 790 L 680 790 L 680 850 L 620 920 L 380 920 L 320 850 Z", cx:500, cy:855} 
      ];
      
      const imMediumMap: ZoneMapData[] = [
        {z:"A1", x:240, y:220, w:250, h:180, c:"#9E9E9E"}, {z:"A2", x:510, y:220, w:250, h:180, c:"#9E9E9E"}, 
        {z:"A3", x:240, y:420, w:250, h:160, c:"#9E9E9E"}, {z:"A4", x:510, y:420, w:250, h:160, c:"#9E9E9E"}, 
        {z:"A5", d:"M 240 600 L 490 600 L 490 780 L 265 780 L 240 740 Z", cx:365, cy:690, c:"#9E9E9E"},
        {z:"A6", d:"M 510 600 L 760 600 L 760 740 L 735 780 L 510 780 Z", cx:635, cy:690, c:"#9E9E9E"},
        {z:"A7", d:"M 320 800 L 680 800 L 680 860 L 620 900 L 380 900 L 320 860 Z", cx:500, cy:850, c:"#9E9E9E"},
        {z:"SB", x:90, y:120, w:110, h:150, c:"#4DD0E1"}, {z:"SC", x:90, y:290, w:110, h:150, c:"#4DD0E1"}, 
        {z:"SD", x:90, y:460, w:110, h:150, c:"#4DD0E1"}, {z:"SE", d:"M 90 630 L 200 630 L 200 730 L 230 790 L 130 840 L 90 760 Z", cx:150, cy:720, c:"#4DD0E1"}, 
        {z:"SF", d:"M 140 855 L 235 805 L 265 865 L 312 900 L 257 976 L 170 930 Z", cx:225, cy:890, c:"#4DD0E1"}, 
        {z:"SG", d:"M 270 985 L 325 905 L 375 930 L 415 930 L 415 1030 L 340 1030 Z", cx:350, cy:980, c:"#4DD0E1"}, 
        {z:"SH", d:"M 430 1030 L 430 930 L 570 930 L 570 1030 Z", cx:500, cy:980, c:"#4DD0E1"}, 
        {z:"SI", d:"M 730 985 L 675 905 L 625 930 L 585 930 L 585 1030 L 660 1030 Z", cx:650, cy:980, c:"#4DD0E1"}, 
        {z:"SJ", d:"M 860 855 L 765 805 L 735 865 L 688 900 L 743 976 L 830 930 Z", cx:775, cy:890, c:"#4DD0E1"}, 
        {z:"SK", d:"M 910 630 L 800 630 L 800 730 L 770 790 L 870 840 L 910 760 Z", cx:850, cy:720, c:"#4DD0E1"}, 
        {z:"SL", x:800, y:460, w:110, h:150, c:"#4DD0E1"}, {z:"SM", x:800, y:290, w:110, h:150, c:"#4DD0E1"}, {z:"SN", x:800, y:120, w:110, h:150, c:"#4DD0E1"}
      ];

      const imLargeMap: ZoneMapData[] = [
        ...imMediumMap, 
        {z:"B", d:"M -170 120 L -70 120 L -70 155 L -45 155 L -45 135 L 45 135 L 45 245 L -45 245 L -45 225 L -70 225 L -70 260 L -170 260 Z", cx:-120, cy:190, c:"#FDD835"}, 
        {z:"C", d:"M -170 290 L -70 290 L -70 325 L -45 325 L -45 305 L 45 305 L 45 415 L -45 415 L -45 395 L -70 395 L -70 430 L -170 430 Z", cx:-120, cy:360, c:"#FDD835"},  
        {z:"D", d:"M -170 460 L -70 460 L -70 495 L -45 495 L -45 475 L 45 475 L 45 585 L -45 585 L -45 565 L -70 565 L -70 600 L -170 600 Z", cx:-120, cy:530, c:"#FDD835"}, 
        {z:"E", d:"M -170 630 L -70 630 L -70 665 L -45 665 L -45 645 L 45 645 L 45 720 L -45 741 L -45 721 L -70 721 L -70 747 L -170 770 Z", cx:-120, cy:700, c:"#FDD835"}, 
        {z:"F", d:"M -127 790 L -37 770 L 43 760 L 53 780 L -17 810 L 8 860 L -97 920 L -127 865 L -152 877 L -167 845 L -167 825 Z", cx:-57, cy:835, c:"#FDD835"}, 
        {z:"G", d:"M -20 1055 L 78 976 L 135 925 L 121 896 L 46 937 L 15 884 L -80 939 Z", cx:0, cy:960, c:"#FDD835"}, 
        {z:"H", d:"M -25 1095 L 94 997 L 148 945 L 180 969 L 126 1036 L 173 1075 L 88 1180 Z", cx:88, cy:1085, c:"#FDD835"}, 
        {z:"I", d:"M 220 1280 L 275 1141 L 315 1065 L 280 1040 L 230 1121 L 180 1085 L 100 1195 Z", cx:192, cy:1170, c:"#FDD835"},  
        {z:"J", d: "M 255 1305 L 270 1250 L 325 1140 L 325 1065 L 373 1065 L 373 1120 L 450 1120 L 450 1245 L 373 1245 L 373 1255 L 373 1260 L 393 1260 L 393 1305 Z", cx: 375, cy: 1195, c: "#FDD835"}, 
        {z:"K", x:460, y:1050, w:80, h:195, c:"#FDD835"}, 
        {z:"L", d:"M 745 1305 L 730 1250 L 675 1140 L 675 1065 L 627 1065 L 627 1120 L 550 1120 L 550 1245 L 627 1245 L 627 1255 L 627 1260 L 607 1260 L 607 1305 Z", cx:625, cy:1195, c:"#FDD835"}, 
        {z:"M", d:"M 780 1280 L 725 1141 L 685 1065 L 720 1040 L 770 1121 L 820 1085 L 900 1195 Z", cx:808, cy:1170, c:"#FDD835"}, 
        {z:"N", d:"M 1025 1095 L 906 997 L 852 945 L 820 969 L 874 1036 L 827 1075 L 912 1180 Z", cx:912, cy:1085, c:"#FDD835"}, 
        {z:"O", d:"M 1020 1055 L 922 976 L 865 925 L 879 896 L 954 937 L 985 884 L 1080 939 Z", cx:987, cy:955, c:"#FDD835"}, 
        {z:"P", d:"M 1127 790 L 1037 770 L 957 760 L 947 780 L 1017 810 L 992 860 L 1097 920 L 1127 865 L 1152 877 L 1167 845 L 1167 825 Z", cx:1057, cy:835, c:"#FDD835"}, 
        {z:"Q", d:"M 1170 630 L 1070 630 L 1070 665 L 1045 665 L 1045 645 L 955 645 L 955 720 L 1045 741 L 1045 721 L 1070 721 L 1070 747 L 1170 770 Z", cx:1120, cy:700, c:"#FDD835"}, 
        {z:"R", d:"M 1170 460 L 1070 460 L 1070 495 L 1045 495 L 1045 475 L 955 475 L 955 585 L 1045 585 L 1045 565 L 1070 565 L 1070 600 L 1170 600 Z", cx:1120, cy:530, c:"#FDD835"}, 
        {z:"S", d:"M 1170 290 L 1070 290 L 1070 325 L 1045 325 L 1045 305 L 955 305 L 955 415 L 1045 415 L 1045 395 L 1070 395 L 1070 430 L 1170 430 Z", cx:1120, cy:360, c:"#FDD835"}, 
        {z:"T", d:"M 1170 120 L 1070 120 L 1070 155 L 1045 155 L 1045 135 L 955 135 L 955 245 L 1045 245 L 1045 225 L 1070 225 L 1070 260 L 1170 260 Z", cx:1120, cy:190, c:"#FDD835"}
      ];

      let mapData = imSmallMap;
      let viewBox = "0 0 1000 1000";
      let stageY = 145;
      let svgClass = "max-w-lg max-h-[60vh]";

      if (event.venueSize === "Medium") {
        mapData = imMediumMap;
        viewBox = "0 0 1000 1200";
        stageY = 140;
        svgClass = "max-w-xl max-h-[60vh]";
      } else if (event.venueSize === "Large") {
        mapData = imLargeMap;
        viewBox = "0 0 1000 1350";
        stageY = 110;
        svgClass = "max-w-2xl max-h-[65vh]";
      }

      return (
        <div className="w-full flex justify-center items-center p-4 relative z-10">
          <svg viewBox={viewBox} className={`w-full mx-auto drop-shadow-2xl ${svgClass}`}>
            {event.venueSize === "Large" ? (
              <rect x="245" y="10" width="520" height="160" fill="#ffffff" rx="4" />
            ) : event.venueSize === "Medium" ? (
              <rect x="245" y="50" width="520" height="140" fill="#ffffff" rx="8" />
            ) : (
              <rect x="160" y="50" width="680" height="150" fill="#ffffff" rx="8" />
            )}
            <text x="500" y={stageY} fill="#000000" fontSize={event.venueSize === "Large" ? "48" : event.venueSize === "Medium" ? "64" : "56"} fontWeight="900" textAnchor="middle" letterSpacing={event.venueSize === "Large" ? "5" : "15"}>STAGE</text>
            
            {mapData.map((item, index) => {
              // ✅ ค้นหาด้วยชื่อโซนตรงๆ (z) ตัดปัญหาเรื่องฐานข้อมูลสลับลำดับ 100%
              const zone = event.zones.find(z => z.name.trim().toUpperCase() === item.z?.trim().toUpperCase());
              if (!zone) return null;

              // แปลงสี Tailwind bg-[#hex] มาเป็น #hex เพื่อวาดใน SVG
              const tier = event.priceTiers.find(t => t.id === zone.tierId);
              const hexColor = tier?.color?.match(/\[(.*?)\]/)?.[1] || item.c || "#8BC34A";
              
              const textX = item.d ? item.cx : (item.x || 0) + (item.w || 0) / 2;
              const textY = item.d ? item.cy : (item.y || 0) + (item.h || 0) / 2;

              return (
                <g key={index} onClick={() => handleZoneClick(zone.name, zone.price)} className="cursor-pointer transition-all duration-200 hover:opacity-80 hover:scale-[1.02]" style={{ transformOrigin: `${textX}px ${textY}px` }}>
                  {item.d ? (
                    <path d={item.d} fill={hexColor} stroke="#050505" strokeWidth="3" />
                  ) : (
                    <rect x={item.x} y={item.y} width={item.w} height={item.h} rx={item.rx} fill={hexColor} stroke="#050505" strokeWidth="3" />
                  )}
                  <text x={textX} y={textY} fill={hexColor === "#FDD835" || hexColor === "#FFEB3B" || hexColor === "#C6FF00" ? "#000000" : "#ffffff"} fontSize={item.d ? "30" : Math.min((item.w||0)/3, 34)} fontWeight="900" textAnchor="middle" dominantBaseline="middle">
                    {zone.name}
                  </text>
                  <text x={textX} y={(textY||0) + (item.d ? 30 : 25)} fill={hexColor === "#FDD835" || hexColor === "#FFEB3B" || hexColor === "#C6FF00" ? "#000000" : "#ffffff"} fontSize={item.d ? "16" : "18"} fontWeight="bold" textAnchor="middle" dominantBaseline="middle" opacity="0.9">
                    ฿{zone.price.toLocaleString()}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      );
    }
    // 📌 โครงสร้างสำหรับ เมืองไทยรัชดาลัย (Hall 3)
    else if (event.hallId === "3") {
      let rows = [1, 2]; // Small
      if (event.venueSize === "Medium") rows = [1, 2, 3, 4];
      if (event.venueSize === "Large") rows = [1, 2, 3, 4, 5, 6];

      return (
        <div className="w-full flex flex-col items-center justify-center p-4 relative z-10">
          <div className="w-[200px] md:w-[300px] bg-white text-black font-black text-xl md:text-2xl py-3 text-center mb-10 tracking-[0.3em] rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">STAGE</div>
          
          <div className="flex items-start gap-2 md:gap-4 w-full justify-center">
            {event.venueSize === "Large" && <div className="text-white font-bold text-sm md:text-xl mt-4 opacity-50">1FL.</div>}
            <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-2 md:gap-3 w-full max-w-[550px]">
              {rows.filter(r => r <= 4).map(r => ['L', 'C', 'R'].map(col => renderZoneButton(`${col}${r}`, {}, "w-full")))}
            </div>
          </div>

          {event.venueSize === "Large" && (
            <>
              <div className="w-full max-w-[600px] h-px bg-gradient-to-r from-transparent via-white/50 to-transparent my-8"></div>
              <div className="flex items-start gap-2 md:gap-4 w-full justify-center">
                <div className="text-white font-bold text-sm md:text-xl mt-4 opacity-50">2FL.</div>
                <div className="grid grid-cols-[1fr_1.5fr_1fr] gap-2 md:gap-3 w-full max-w-[550px]">
                  {rows.filter(r => r > 4).map(r => ['L', 'C', 'R'].map(col => renderZoneButton(`${col}${r}`, {}, "w-full")))}
                </div>
              </div>
            </>
          )}
        </div>
      );
    } 
    // ==========================================
    // 🌟 จุดที่ 2: เพิ่มโครงสร้างแผนผัง 3 มิติ (สมมติว่าเป็น Hall 2)
    // ==========================================
    else if (event.hallId === "2") {
      return (
        <div className="w-full flex flex-col items-center justify-center p-4 relative z-10 overflow-hidden">
          <div className="w-[200px] md:w-[300px] bg-white text-black font-black text-xl md:text-2xl py-3 text-center mb-10 tracking-[0.3em] rounded-sm shadow-[0_0_20px_rgba(255,255,255,0.2)]">STAGE</div>

          <div className="flex flex-col gap-3 md:gap-4 w-full max-w-2xl mx-auto">
            {/* แถวที่ 1 */}
            <div className="flex justify-center gap-2 md:gap-4 w-full">
              {renderZoneButton("ZONE 1", { transform: 'perspective(600px) rotateY(15deg)' }, 'w-[30%]')}
              {renderZoneButton("ZONE 2", {}, 'w-[40%]')}
              {renderZoneButton("ZONE 3", { transform: 'perspective(600px) rotateY(-15deg)' }, 'w-[30%]')}
            </div>

            {/* แถวที่ 2 */}
            <div className="flex justify-center gap-2 md:gap-4 w-full">
              {renderZoneButton("ZONE 4", { transform: 'perspective(600px) rotateY(15deg)' }, 'w-[30%]')}
              {renderZoneButton("ZONE 5", {}, 'w-[40%]')}
              {renderZoneButton("ZONE 6", { transform: 'perspective(600px) rotateY(-15deg)' }, 'w-[30%]')}
            </div>

            {/* เส้นแบ่ง 2 FLOOR */}
            <div className="flex items-center w-full my-6 opacity-70">
              <div className="flex-grow border-t-2 border-dashed border-gray-400"></div>
              <span className="mx-6 text-white font-bold tracking-widest text-sm md:text-base">2 FLOOR</span>
              <div className="flex-grow border-t-2 border-dashed border-gray-400"></div>
            </div>

            {/* แถวที่ 3 */}
            <div className="flex justify-center gap-2 md:gap-4 w-full">
              {renderZoneButton("ZONE 7", { transform: 'perspective(600px) rotateY(15deg)' }, 'w-[30%]')}
              {renderZoneButton("ZONE 8", {}, 'w-[40%]')}
              {renderZoneButton("ZONE 9", { transform: 'perspective(600px) rotateY(-15deg)' }, 'w-[30%]')}
            </div>
          </div>
        </div>
      );
    }
    // 📌 โครงสร้างสำหรับสถานที่อื่นๆ จัดเรียง Grid อัตโนมัติ
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
              {event.zones.map(z => renderZoneButton(z.name, {}, "w-full"))}
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

            {/* 3. แผนผังโซน */}
            <section className="bg-white/5 p-8 rounded-3xl border border-white/10">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 justify-start">
                  <Map className="text-purple-400" /> แผนผังที่นั่ง
              </h3>
              
              <div className="w-full relative bg-[#090C10] rounded-3xl border border-white/10 overflow-hidden py-10 shadow-inner">
                 <div className="absolute top-4 left-0 w-full flex justify-center z-20 pointer-events-none">
                   <div className="bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs md:text-sm px-4 py-1.5 rounded-full flex items-center gap-2">
                      👆 {isSaleOpen ? "คลิกเลือกโซนที่ต้องการซื้อได้เลย" : "กรุณาเลือกรอบการแสดงก่อนคลิกผัง"}
                   </div>
                 </div>

                 {renderInteractiveMap()}
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

          {/* ฝั่งขวา: สรุปการจอง */}
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