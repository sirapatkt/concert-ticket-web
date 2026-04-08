"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Plus, Minus, RotateCcw, X, Check, Calendar, MapPin, ChevronLeft, TimerOff, Loader2 } from "lucide-react";

// --- ประกาศ Type ---
type SeatStatus = "available" | "selected" | "reserved" | "sold" | "blank";
type Seat = {
  id: string;
  dbId?: number;
  zoneId?: number;
  row: string;
  number: string;
  status: SeatStatus;
  price: number;
  isHidden: boolean; 
};

// ========================================================
// 🎨 Component: ไอคอนเก้าอี้ (🌟 ปรับขนาดให้เล็กลงเพื่อให้พอดีกับ 22 คอลัมน์)
// ========================================================
const SeatIcon = ({ status, label, zoneColor }: { status: SeatStatus; label: string, zoneColor: string }) => {
  // ย่อขนาดเก้าอี้ลงมาให้เท่ากับหน้า Preview
  const baseSize = "w-[24px] h-[24px] sm:w-[28px] sm:h-[28px] md:w-[32px] md:h-[32px]";
  
  if (status === "blank") {
      return <div className={`${baseSize} opacity-0 pointer-events-none`}></div>;
  }

  let bgColor = "transparent";   
  let contentOverlay = <span className="text-[10px] md:text-[12px] font-extrabold text-black">{label}</span>;

  if (status === "available") {
    bgColor = zoneColor; 
  } else if (status === "selected") {
    bgColor = "#76FF03"; 
    contentOverlay = <Check size={18} className="text-black stroke-[4]" />;
  } else if (status === "sold") {
    bgColor = "#2A2A2A"; 
    contentOverlay = <X size={18} className="text-[#DC2626] stroke-[4]" />;
  }

  return (
    <div className={`relative ${baseSize} rounded-full flex items-center justify-center transition-all duration-200 
      ${status === 'available' ? 'hover:scale-110 cursor-pointer shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:shadow-[0_0_15px_rgba(255,255,255,0.6)]' : 'opacity-80'}
      ${status === 'sold' ? 'cursor-not-allowed opacity-50' : ''}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="absolute inset-0 flex justify-center items-center pointer-events-none z-10">{contentOverlay}</div>
    </div>
  );
};

// สีประจำโซน
const getZoneColor = (zoneName: string) => {
    const z = zoneName.toUpperCase();
    if (z.includes('1')) return "#FFCC00"; 
    if (z.includes('2')) return "#FF9500"; 
    if (z.includes('3')) return "#E91E63"; 
    if (z.includes('4')) return "#00B4D8"; 
    if (z.includes('5')) return "#A855F7"; 
    if (z.includes('6')) return "#76FF03"; 
    return "#FFCC00"; 
};

export default function BookingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventId = searchParams.get("eventId");
  const roundId = searchParams.get("round");
  const eventZone = searchParams.get("zone") || "L1"; 
  const tierPrice = Number(searchParams.get("price")) || 0;

  // 🌟 เปลียนชื่องาน สถานที่ วันที่ ให้เป็น State เพื่อรับค่าจาก API
  const [eventName, setEventName] = useState(searchParams.get("name") || "กำลังโหลดข้อมูล...");
  const [eventDate, setEventDate] = useState(searchParams.get("date") || "...");
  const [eventTime, setEventTime] = useState(searchParams.get("time") || "...");
  const [eventVenue, setEventVenue] = useState(searchParams.get("venue") || "...");

  const zoneColor = getZoneColor(eventZone);

  const [seats, setSeats] = useState<Seat[]>([]);
  const [loadingSeats, setLoadingSeats] = useState(true);

  const [scale, setScale] = useState(1);
  const [timeLeft, setTimeLeft] = useState(300);
  const [isTimeout, setIsTimeout] = useState(false); 
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // 🌟 ฟังก์ชันดึงรายละเอียด Event (ชื่อ, สถานที่, เวลา) จาก API
  useEffect(() => {
    const fetchEventDetails = async () => {
      if (!eventId) return;
      // ถ้ารับค่ามาจาก URL แล้ว ไม่ต้องยิง API ซ้ำ
      if (searchParams.get("name") && searchParams.get("venue")) return; 

      try {
        const res = await fetch(`http://127.0.0.1:8000/api/public/events/${eventId}`);
        if (res.ok) {
          const data = await res.json();
          setEventName(data.eventName);
          setEventVenue(data.hall?.Hall_Name || data.venue_name || "ไม่ระบุสถานที่");

          if (roundId && data.event_date_times) {
            const roundInfo = data.event_date_times.find((r: any) => r.Datetime_id.toString() === roundId);
            if (roundInfo) {
               const dateObj = new Date(roundInfo.startDT);
               setEventDate(dateObj.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' }));
               setEventTime(`${roundInfo.startDT.split(' ')[1].slice(0, 5)} - ${roundInfo.endDT.split(' ')[1].slice(0, 5)}`);
            }
          }
        }
      } catch (error) {
        console.error("Failed to fetch event info");
      }
    };
    fetchEventDetails();
  }, [eventId, roundId, searchParams]);


  // ========================================================
  // 🧠 ฟังก์ชัน: สร้างโครงสร้างผังที่นั่ง (🌟 แก้เฉพาะ ม.รังสิต)
  // ========================================================
  const generateStructuralLayout = (zoneName: string): Seat[] => {
    let maxCol = 12;
    let startNum = 1;
    // รองรับ stagger, gapAfter, start สำหรับม.รังสิต
    let matrix: { l?: number, r?: number, gapAfter?: number, start?: number, stagger?: boolean }[] = []; 
    let rowLetters: string[] = []; 
    let isFixedLayout = false; // ต้องใส่บรรทัดนี้เพื่อไม่ให้ขึ้นขีดแดง
    
    const name = zoneName.toUpperCase().trim();

    // -----------------------------------------------------------------
    // 🏢 1. ฮอลล์อื่นๆ คงไว้เหมือนเดิม 100% ห้ามแตะต้อง
    // -----------------------------------------------------------------
    if (name === "L1") {
        rowLetters = "BCDEFGH".split("");
        matrix = [ {l: 4, r: 0}, {l: 3, r: 0}, {l: 2, r: 0}, {l: 1, r: 0}, {l: 1, r: 0}, {l: 1, r: 0}, {l: 1, r: 0} ];
    } 
    else if (name === "C1") { maxCol = 16; startNum = 13; rowLetters = "ABCDEFGH".split(""); matrix = [{l: 0, r: 0}]; }
    else if (name === "R1") {
        maxCol = 12; startNum = 29; rowLetters = "BCDEFGH".split("");
        matrix = [ {l: 0, r: 4}, {l: 0, r: 3}, {l: 0, r: 2}, {l: 0, r: 1}, {l: 0, r: 1}, {l: 0, r: 1}, {l: 0, r: 1} ];
    }
    else if (name === "L2") { maxCol = 12; startNum = 1; rowLetters = "IJKLMNOP".split(""); matrix = [{l: 0, r: 0}]; }
    else if (name === "C2") { maxCol = 16; startNum = 13; rowLetters = "IJKLMNOP".split(""); matrix = [{l: 0, r: 0}]; }
    else if (name === "R2") { maxCol = 12; startNum = 29; rowLetters = "IJKLMNOP".split(""); matrix = [{l: 0, r: 0}]; }
    else if (name === "L3") { maxCol = 12; startNum = 1; rowLetters = "QRST".split(""); matrix = [{l: 0, r: 0}]; }
    else if (name === "C3") { maxCol = 16; startNum = 13; rowLetters = "QRST".split(""); matrix = [{l: 0, r: 0}]; }
    else if (name === "R3") { maxCol = 12; startNum = 29; rowLetters = "QRST".split(""); matrix = [{l: 0, r: 0}]; }
    else if (name === "L4") {
        maxCol = 12; startNum = 1; rowLetters = "UVWXYZ".split("");
        matrix = [ {l: 0, r: 0}, {l: 0, r: 0}, {l: 0, r: 0}, {l: 0, r: 1}, {l: 0, r: 1}, {l: 0, r: 1} ]; 
    }
    else if (name === "C4") { maxCol = 16; startNum = 13; rowLetters = "UVW".split(""); matrix = [{l: 0, r: 0}]; }
    else if (name === "R4") {
        maxCol = 12; startNum = 29; rowLetters = "UVWXYZ".split("");
        matrix = [ {l: 0, r: 0}, {l: 1, r: 0}, {l: 1, r: 0}, {l: 1, r: 0}, {l: 1, r: 0}, {l: 1, r: 0} ]; 
    }
    else if (name === "L5") { maxCol = 11; startNum = 2; rowLetters = ["AA","BB","CC","DD"]; matrix = [{l: 0, r: 0}]; }
    else if (name === "C5") { maxCol = 16; startNum = 13; rowLetters = ["AA","BB","CC","DD"]; matrix = [{l: 0, r: 0}]; }
    else if (name === "R5") {
        maxCol = 12; startNum = 29; rowLetters = ["AA","BB","CC","DD"];
        matrix = [ {l: 0, r: 1}, {l: 0, r: 0}, {l: 0, r: 1}, {l: 0, r: 0} ]; 
    }
    else if (name === "L6") { maxCol = 11; startNum = 2; rowLetters = ["EE","FF","GG","HH","II","JJ","KK"]; matrix = [{l: 0, r: 0}]; }
    else if (name === "C6") { maxCol = 16; startNum = 13; rowLetters = ["EE","FF","GG","HH","II","JJ","KK"]; matrix = [{l: 0, r: 0}]; }
    else if (name === "R6") {
        maxCol = 12; startNum = 29; rowLetters = ["EE","FF","GG","HH","II","JJ","KK"];
        matrix = [ {l: 0, r: 0}, {l: 0, r: 1}, {l: 0, r: 0}, {l: 0, r: 1}, {l: 0, r: 0}, {l: 0, r: 1}, {l: 0, r: 1} ];
    }
    // -----------------------------------------------------------------
    // 🏫 2. ฮอลล์ ม.รังสิต (ZONE 1 - ZONE 9) แบบเป๊ะๆ ตามโค้ดที่ให้จำไว้
    // -----------------------------------------------------------------
    else if (["ZONE 1", "ZONE1"].includes(name)) {
        isFixedLayout = true;
        rowLetters = ["C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
        maxCol = 20; 
        matrix = [
            { l: 2, r: 6, gapAfter: 8, stagger: true }, // C: 11 ที่นั่ง
            { l: 1, r: 6, gapAfter: 9, stagger: true }, // D: 12 ที่นั่ง
            { l: 2, r: 6, gapAfter: 8, stagger: true }, // E: 11 ที่นั่ง
            { l: 3, r: 5, gapAfter: 8, stagger: true }, // F: 11 ที่นั่ง
            { l: 4, r: 4, gapAfter: 7, stagger: true }, // G: 11 ที่นั่ง
            { l: 5, r: 2, gapAfter: 6, stagger: true }, // H: 11 ที่นั่ง
            { l: 5, r: 2, gapAfter: 6, stagger: true }, // I: 12 ที่นั่ง
            { l: 12, r: 1, gapAfter: 0, stagger: true },// J: 7 ที่นั่ง (อยู่ฝั่งขวาล้วนๆ)
            { l: 5, r: 3, stagger: true },              // K: 12 ที่นั่งติดกัน
            { l: 5, r: 3, stagger: true }               // L: 12 ที่นั่งติดกัน
        ];
    }
    else if (["ZONE 2", "ZONE2"].includes(name)) {
        isFixedLayout = true;
        rowLetters = ["C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
        maxCol = 22; 
        matrix = [
            { l: 6, r: 2, start: 12, stagger: true }, // C: 14 ที่นั่ง 
            { l: 6, r: 1, start: 13, stagger: true }, // D: 15 ที่นั่ง 
            { l: 6, r: 2, start: 12, stagger: true }, // E: 14 ที่นั่ง 
            { l: 5, r: 2, start: 12, stagger: true }, // F: 15 ที่นั่ง 
            { l: 5, r: 1, start: 12, stagger: true }, // G: 16 ที่นั่ง 
            { l: 5, r: 2, start: 12, stagger: true }, // H: 15 ที่นั่ง 
            { l: 6, r: 2, start: 13, stagger: true }, // I: 14 ที่นั่ง 
            { l: 1, r: 6, start: 8,  stagger: true }, // J: 15 ที่นั่ง 
            { l: 6, r: 0, start: 13, stagger: true }, // K: 16 ที่นั่ง 
            { l: 6, r: 1, start: 13, stagger: true }  // L: 15 ที่นั่ง 
        ];
    }
    else if (["ZONE 3", "ZONE3"].includes(name)) {
        isFixedLayout = true;
        rowLetters = ["C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
        maxCol = 20; 
        matrix = [
            { l: 5, r: 3, gapAfter: 3, start: 26, stagger: true }, // C: 11 ที่นั่ง
            { l: 5, r: 2, gapAfter: 3, start: 28, stagger: true }, // D: 12 ที่นั่ง
            { l: 5, r: 3, gapAfter: 3, start: 26, stagger: true }, // E: 11 ที่นั่ง
            { l: 4, r: 3, gapAfter: 4, start: 27, stagger: true }, // F: 12 ที่นั่ง
            { l: 4, r: 4, gapAfter: 4, start: 28, stagger: true }, // G: 11 ที่นั่ง
            { l: 3, r: 5, gapAfter: 5, start: 27, stagger: true }, // H: 11 ที่นั่ง
            { l: 2, r: 5, gapAfter: 6, start: 27, stagger: true }, // I: 12 ที่นั่ง
            { l: 1, r: 11, gapAfter: 7, start: 23, stagger: true },// J: 7 ที่นั่ง
            { l: 2, r: 6, start: 29, stagger: true },              // K: 12 ที่นั่ง
            { l: 3, r: 5, start: 28, stagger: true }               // L: 12 ที่นั่ง
        ];
    }
    else if (["ZONE 4", "ZONE4"].includes(name)) {
        isFixedLayout = true;
        rowLetters = ["M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"];
        maxCol = 16; 
        matrix = [
            { l: 3, r: 2, stagger: true }, // M: 11 ที่นั่ง
            { l: 2, r: 3, stagger: true }, // N: 11 ที่นั่ง
            { l: 2, r: 2, stagger: true }, // O: 12 ที่นั่ง
            { l: 2, r: 2, stagger: true }, // P: 12 ที่นั่ง
            { l: 2, r: 2, stagger: true }, // Q: 12 ที่นั่ง
            { l: 3, r: 2, stagger: true }, // R: 11 ที่นั่ง
            { l: 4, r: 1, stagger: true }, // S: 11 ที่นั่ง
            { l: 4, r: 1, stagger: true }, // T: 11 ที่นั่ง
            { l: 4, r: 1, stagger: true }, // U: 11 ที่นั่ง
            { l: 4, r: 1, stagger: true }  // V: 11 ที่นั่ง
        ];
    }
    else if (["ZONE 5", "ZONE5"].includes(name)) {
        isFixedLayout = true;
        rowLetters = ["M", "N", "O", "P", "Q", "R", "S", "T"];
        maxCol = 20; 
        matrix = [
            { l: 3, r: 3, start: 12, stagger: true }, // M: 14 ที่นั่ง
            { l: 2, r: 3, start: 12, stagger: true }, // N: 15 ที่นั่ง
            { l: 3, r: 1, start: 13, stagger: true }, // O: 16 ที่นั่ง
            { l: 3, r: 2, start: 13, stagger: true }, // P: 15 ที่นั่ง
            { l: 3, r: 1, start: 13, stagger: true }, // Q: 16 ที่นั่ง
            { l: 2, r: 3, start: 12, stagger: true }, // R: 15 ที่นั่ง
            { l: 3, r: 1, start: 12, stagger: true }, // S: 16 ที่นั่ง
            { l: 2, r: 3, start: 12, stagger: true }  // T: 15 ที่นั่ง
        ];
    }
    else if (["ZONE 6", "ZONE6"].includes(name)) {
        isFixedLayout = true;
        rowLetters = ["M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"];
        maxCol = 16; 
        matrix = [
            { l: 2, r: 3, start: 26, stagger: true }, // แถว M: 11 ที่นั่ง (26-36)
            { l: 3, r: 2, start: 27, stagger: true }, // แถว N: 11 ที่นั่ง (27-37)
            { l: 2, r: 2, start: 29, stagger: true }, // แถว O: 12 ที่นั่ง (29-40)
            { l: 2, r: 2, start: 28, stagger: true }, // แถว P: 12 ที่นั่ง (28-39)
            { l: 2, r: 2, start: 29, stagger: true }, // แถว Q: 12 ที่นั่ง (29-40)
            { l: 3, r: 2, start: 27, stagger: true }, // แถว R: 11 ที่นั่ง (27-37)
            { l: 2, r: 3, start: 28, stagger: true }, // แถว S: 11 ที่นั่ง (28-38)
            { l: 3, r: 2, start: 27, stagger: true }, // แถว T: 11 ที่นั่ง (27-37)
            { l: 2, r: 3, start: 26, stagger: true }, // แถว U: 11 ที่นั่ง (26-36)
            { l: 3, r: 2, start: 27, stagger: true }  // แถว V: 11 ที่นั่ง (27-37)
        ];
    }
    else if (["ZONE 7", "ZONE7"].includes(name)) {
        isFixedLayout = true;
        rowLetters = ["AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH"];
        maxCol = 11; 
        matrix = [
            { l: 0, r: 0, stagger: true }, { l: 0, r: 0, stagger: true }, { l: 0, r: 0, stagger: true }, { l: 0, r: 0, stagger: true },
            { l: 0, r: 0, stagger: true }, { l: 0, r: 0, stagger: true }, { l: 0, r: 0, stagger: true }, { l: 0, r: 0, stagger: true }
        ];
    }
    else if (["ZONE 8", "ZONE8"].includes(name)) {
        isFixedLayout = true;
        rowLetters = ["AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH"];
        maxCol = 16; 
        matrix = [
            { l: 0, r: 0, start: 12, stagger: true }, { l: 1, r: 0, start: 12, stagger: true }, 
            { l: 0, r: 0, start: 12, stagger: true }, { l: 1, r: 0, start: 12, stagger: true }, 
            { l: 0, r: 0, start: 12, stagger: true }, { l: 1, r: 0, start: 12, stagger: true }, 
            { l: 0, r: 0, start: 12, stagger: true }, { l: 1, r: 0, start: 12, stagger: true }  
        ];
    }
    else if (["ZONE 9", "ZONE9"].includes(name)) {
        isFixedLayout = true;
        rowLetters = ["AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH"];
        maxCol = 11; 
        matrix = [
            { l: 0, r: 0, start: 28 }, { l: 0, r: 0, start: 27 }, { l: 0, r: 0, start: 28 }, { l: 0, r: 0, start: 27 },
            { l: 0, r: 0, start: 28 }, { l: 0, r: 0, start: 27 }, { l: 0, r: 0, start: 28 }, { l: 0, r: 0, start: 27 }  
        ];
    }
    else { rowLetters = "ABCDEF".split(""); matrix = [{l: 0, r: 0}]; }

    const templateSeats: Seat[] = [];
    let rowIndex = 0;
    
    // 🌟 เช็คว่าเป็นโซนของม.รังสิตหรือไม่
    const isRangsitZone = name.includes("ZONE");

    while (rowIndex < rowLetters.length) {
        const rowLetter = rowLetters[rowIndex % rowLetters.length];
        const conf = matrix[rowIndex] || (matrix.length > 0 ? matrix[matrix.length - 1] : { l: 0, r: 0 });
        
        const gapCount = conf.gapAfter ? 1 : 0;
        const lBlanks = conf.l || 0;
        const rBlanks = conf.r || 0;
        const maxReal = maxCol - lBlanks - rBlanks - gapCount;
        
        // 1. ใส่ Blank ฝั่งซ้าย (ถ้าตั้ง stagger=true ให้ไม่ต้องมีกล่องใส เพื่อให้ Flexbox จัดกลางอัตโนมัติ)
        const actualLBlanks = conf.stagger ? 0 : lBlanks;
        for (let i = 0; i < actualLBlanks; i++) {
           templateSeats.push({ id: `BL_${rowIndex}_${i}`, row: rowLetter, number: "", status: "blank", price: 0, isHidden: true });
        }
        
        // 2. ใส่เก้าอี้จริง
        for (let i = 0; i < maxReal; i++) {
           let seatNum;
           // 🌟 ถ้าเป็นม.รังสิตและมี start กำหนดไว้ ให้ใช้ start + i
           if (isRangsitZone && conf.start !== undefined) {
               seatNum = conf.start + i; 
           } else {
               // 🏢 ถ้าเป็นฮอลล์อื่น (Impact/รัชดาลัย) ใช้ลอจิกเดิมเป๊ะๆ ห้ามแตะ!
               seatNum = startNum + lBlanks + i; 
           }

           templateSeats.push({ 
               id: `${rowLetter}${seatNum.toString().padStart(2, '0')}`, 
               row: rowLetter, 
               number: seatNum.toString().padStart(2, '0'), 
               status: "available", 
               price: tierPrice,
               isHidden: false 
           });

           // แทรกทางเดินตรงกลาง (Aisle Gap)
           if (conf.gapAfter === i + 1) {
               templateSeats.push({ id: `GAP_${rowIndex}_${i}`, row: rowLetter, number: "", status: "blank", price: 0, isHidden: true });
           }
        }
        
        // 3. ใส่ Blank ฝั่งขวา + ทำสลับฟันปลา (Stagger)
        let remainingBlanks = maxCol - lBlanks - maxReal - gapCount;
        if (conf.stagger && rowIndex % 2 !== 0 && remainingBlanks > 0) {
            remainingBlanks -= 1; // ลด 1 กล่องในแถวคี่เพื่อให้เยื้องเป็นฟันปลา
        }
        const actualRBlanks = conf.stagger ? 0 : remainingBlanks;
        for (let i = 0; i < actualRBlanks; i++) {
           templateSeats.push({ id: `BR_${rowIndex}_${i}`, row: rowLetter, number: "", status: "blank", price: 0, isHidden: true });
        }
        rowIndex++;
    }
    return templateSeats;
  };

  // ========================================================
  // 🔌 ดึงข้อมูลจาก API แล้วประกอบร่าง
  // ========================================================
  useEffect(() => {
    const fetchSeatsAndMap = async () => {
      if (!eventId || !roundId || !eventZone) return;

      const structuralLayout = generateStructuralLayout(eventZone);

      try {
        setLoadingSeats(true);
        const res = await fetch(`http://127.0.0.1:8000/api/seats?eventId=${eventId}&roundId=${roundId}&zoneName=${eventZone}`, {
            headers: { 
                'Accept': 'application/json',
                'Cache-Control': 'no-cache'
            },
            cache: 'no-store'
        });
        
        if (!res.ok) throw new Error("API Error");
        const dbData = await res.json();

        if (dbData && dbData.length > 0) {
            const finalSeats: Seat[] = structuralLayout.map((templateSeat) => {
                if (templateSeat.isHidden) return templateSeat; 

                const dbSeat = dbData.find((s: any) => (s.SeatRow + s.SeatNo) === templateSeat.id);
                
                if (dbSeat) {
                    let reactStatus: SeatStatus = 'available';
                    if (dbSeat.SeatStatus !== 'ว่าง') {
                        reactStatus = 'sold'; 
                    }
                    return { 
                        ...templateSeat, 
                        status: reactStatus,
                        dbId: dbSeat.Seat_id,
                        zoneId: dbSeat.Zone_id
                    };
                } else {
                    return { ...templateSeat, status: "sold" as SeatStatus }; 
                }
            });
            setSeats(finalSeats);
        } else {
            setSeats(structuralLayout);
        }

      } catch (error) {
        console.warn("⚠️ Cannot connect to Database. Showing simulated structure.");
        setSeats(structuralLayout); 
      } finally {
        setLoadingSeats(false);
      }
    };

    fetchSeatsAndMap();
  }, [eventId, roundId, eventZone, tierPrice]);

  const handleReset = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsTimeout(true); 
      setSeats(prev => prev.map(s => s.status === 'selected' ? { ...s, status: 'available' } : s));
      return;
    }
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleSeat = (seatId: string, isHidden: boolean, status: string) => {
    if (isDragging || isTimeout || isHidden || status === "sold") return; 

    const currentSelectedCount = seats.filter(s => s.status === "selected").length;

    if (status === "available" && currentSelectedCount >= 5) {
        alert("คุณสามารถเลือกที่นั่งได้สูงสุด 5 ใบ ต่อ 1 การทำรายการครับ");
        return; 
    }

    setSeats((prev) =>
      prev.map((seat) => {
        if (seat.id !== seatId) return seat;
        return { ...seat, status: seat.status === "available" ? "selected" : "available" };
      })
    );
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleWheel = (e: React.WheelEvent) => {
    const newScale = scale - e.deltaY * 0.001;
    setScale(Math.min(Math.max(newScale, 0.4), 3));
  };

  const selectedSeats = seats.filter((s) => s.status === "selected");
  const totalPrice = selectedSeats.reduce((sum, s) => sum + s.price, 0);
  const rows = Array.from(new Set(seats.map(s => s.row)));

  return (
    <div className="h-screen w-full bg-[#050505] text-white flex pt-16 overflow-hidden font-sans select-none relative">
      
      {isTimeout && (
        <div className="fixed inset-0 z-[100] bg-[#050505]/90 backdrop-blur-md flex items-center justify-center p-6 text-center">
          <div className="max-w-sm w-full bg-[#161B22] border border-white/10 p-10 rounded-[2.5rem] shadow-2xl">
            <TimerOff size={40} className="mx-auto mb-6 text-red-500" />
            <h2 className="text-2xl font-black mb-2 uppercase tracking-tight text-white">หมดเวลาทำรายการ</h2>
            <button onClick={() => {setIsTimeout(false); setTimeLeft(300);}} className="w-full py-4 bg-white text-black rounded-2xl font-black">เลือกที่นั่งใหม่</button>
          </div>
        </div>
      )}

      {/* LEFT SIDEBAR */}
      <div className="w-[350px] bg-[#0A0A0A] border-r border-white/10 flex flex-col z-20 shadow-2xl shrink-0 text-white">
        <div className="p-4 border-b border-white/10">
            <button onClick={() => router.back()} className="flex items-center gap-2 text-gray-400 hover:text-white text-sm font-bold">
                <ChevronLeft size={18} /> กลับไปหน้าผังใหญ่
            </button>
        </div>
        <div className="p-6 flex-1 overflow-y-auto">
            <h1 className="text-xl font-black leading-tight mb-4 uppercase tracking-tight">{eventName}</h1>
            <div className="space-y-3 mb-6">
                <div className="flex items-start gap-3 text-sm text-gray-400">
                    <Calendar size={16} className="mt-0.5 text-blue-400" />
                    <span>{eventDate}<br/><span className="text-xs text-gray-500">{eventTime}</span></span>
                </div>
                <div className="flex items-start gap-3 text-sm text-gray-400">
                    <MapPin size={16} className="mt-0.5 text-pink-500" />
                    <span>{eventVenue}</span>
                </div>
            </div>
            <div className="border-t border-white/10 my-6"></div>
            <div>
                <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-1">Zone</p>
                <p className="text-3xl font-black text-white mb-2 tracking-tighter uppercase">{eventZone}</p>
                <p className="text-xl text-blue-400 font-medium mb-6">฿ {tierPrice.toLocaleString()}</p>
                
                <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">ที่นั่ง ({selectedSeats.length})</p>
                <div className="flex flex-wrap gap-2">
                    {selectedSeats.length > 0 ? (
                        selectedSeats.map((s) => (
                            <span key={s.id} className="bg-white text-black px-3 py-1 rounded-md text-xs font-black shadow-lg">{s.id}</span>
                        ))
                    ) : (
                        <span className="text-sm text-gray-600 italic">ยังไม่ได้เลือกที่นั่ง</span>
                    )}
                </div>
            </div>
        </div>
        
        {/* 🟢 ส่วนที่แก้ไขปุ่มชำระเงิน 🟢 */}
        <div className="p-6 bg-[#050505] border-t border-white/10">
            <div className="flex justify-between items-end mb-4">
                <span className="text-gray-400 text-sm font-bold uppercase tracking-widest">ราคารวม</span>
                <span className="text-3xl font-black text-white">฿{totalPrice.toLocaleString()}</span>
            </div>
            
            <button 
                onClick={() => {
                    const validSeatIds = selectedSeats.map(s => s.dbId).filter(id => id !== undefined);
                    
                    if (validSeatIds.length === 0 || validSeatIds.length !== selectedSeats.length) {
                        alert("❌ ไม่สามารถจองได้: ไม่พบ Seat_id จากฐานข้อมูล\nสาเหตุ: API ไม่ส่งข้อมูลที่นั่งของโซน " + eventZone + " กลับมา กรุณาเช็ค Laravel Backend ครับ");
                        return;
                    }

                    const firstSelectedSeat = selectedSeats[0];
                    const currentZoneId = firstSelectedSeat?.zoneId;

                    if (!currentZoneId) {
                        alert("❌ เกิดข้อผิดพลาด: ไม่พบรหัสโซน (Zone ID) จากฐานข้อมูล กรุณารีเฟรชหน้าเว็บแล้วลองใหม่อีกครั้ง");
                        return;
                    }
                    
                    const query = new URLSearchParams({
                        name: eventName,
                        date: eventDate,
                        time: eventTime,
                        venue: eventVenue,
                        zone: eventZone,
                        amount: totalPrice.toString(),
                        seats: selectedSeats.map(s => s.id).join(", "),
                        seatIds: validSeatIds.join(","),
                        roundId: roundId || "44",
                        zoneId: currentZoneId.toString()
                    }).toString();
                    
                    router.push(`/booking_detail?${query}`);
                }}
                disabled={selectedSeats.length === 0}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all transform active:scale-95 ${selectedSeats.length > 0 ? "bg-white text-black hover:bg-gray-200" : "bg-gray-800 text-gray-500 cursor-not-allowed"}`}
            >
                ชำระเงิน
            </button>
        </div>
      </div>

      {/* RIGHT SIDE MAP AREA */}
      <div className="flex-1 h-full relative bg-[#050505] overflow-hidden">
        <div className="absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-8 py-4 pointer-events-none">
            {/* TIMER */}
            <div className="bg-black/50 backdrop-blur border border-white/10 px-6 py-2 rounded-full pointer-events-auto shadow-xl">
                <span className="text-red-500 font-bold font-mono text-xl tracking-tighter">{formatTime(timeLeft)}</span>
            </div>

            {/* LEGEND */}
            <div className="flex gap-4 bg-black/50 backdrop-blur border border-white/10 px-6 py-2 rounded-full pointer-events-auto shadow-xl items-center">
                <div className="flex items-center gap-2 text-sm uppercase font-bold text-gray-400">
                    <div className="w-5 h-5 rounded-full" style={{ backgroundColor: zoneColor }}></div> 
                    <span>ว่าง</span>
                </div>
                <div className="flex items-center gap-2 text-sm uppercase font-bold text-gray-400">
                    <div className="w-5 h-5 bg-[#76FF03] rounded-full flex items-center justify-center">
                        <Check size={14} className="text-black stroke-[4]" />
                    </div> 
                    <span>เลือก</span>
                </div>
                <div className="flex items-center gap-2 text-sm uppercase font-bold text-gray-400">
                    <div className="w-5 h-5 bg-[#2A2A2A] rounded-full flex items-center justify-center">
                        <X size={14} className="text-[#DC2626] stroke-[3]" />
                    </div> 
                    <span>ขายแล้ว</span>
                </div>
            </div>
        </div>

        <div className="w-full h-full relative flex items-center justify-center" 
             onMouseDown={handleMouseDown}
             onMouseMove={handleMouseMove}
             onMouseUp={handleMouseUp}
             onMouseLeave={handleMouseUp}
             onWheel={handleWheel}>
             
             <div className={`flex flex-col items-center ${isDragging ? 'duration-0' : 'duration-300'} transition-transform`} 
                  style={{ transform: `translate(${position.x}px, ${position.y}px) scale(${scale})` }}>
                
                <h3 className="text-4xl md:text-5xl font-black text-white mb-2 tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]">โซน {eventZone}</h3>
                <p className="text-xl text-cyan-400 mb-12 font-medium">฿ {tierPrice.toLocaleString()}</p>

                {loadingSeats ? (
                    <div className="flex flex-col items-center justify-center h-40 text-blue-400">
                      <Loader2 className="animate-spin mb-2" size={40} />
                      <p>กำลังโหลดที่นั่ง...</p>
                    </div>
                ) : (
                    // 🌟 จุดเปลี่ยน: เพิ่ม w-full max-w-full overflow-x-auto เพื่อให้โซนที่กว้างมากๆ แสดงผลได้ครบ
                    <div className="flex flex-col gap-2 md:gap-3 pointer-events-auto pb-20 w-full max-w-full overflow-x-auto">
                        <div className="min-w-max px-4 mx-auto">
                            {rows.map(rowLetter => (
                                // 🌟 จุดเปลี่ยน: ใช้ justify-between เพื่อให้ตัวอักษรชิดขอบ และเก้าอี้อยู่ตรงกลาง
                                <div key={rowLetter} className="flex items-center justify-between w-full mb-1.5">
                                    {/* ตัวอักษรฝั่งซ้าย */}
                                    <span className="w-8 md:w-10 text-slate-400 font-bold text-xs md:text-lg text-right pr-4 shrink-0">{rowLetter}</span>
                                    
                                    {/* เก้าอี้ในแถวนั้น */}
                                    <div className="flex items-center gap-1 md:gap-1.5 justify-center flex-1">
                                        {seats.filter(s => s.row === rowLetter).map(seat => (
                                            <div key={seat.id} onClick={() => toggleSeat(seat.id, seat.isHidden, seat.status)}>
                                                <SeatIcon status={seat.status} label={seat.number} zoneColor={zoneColor} />
                                            </div>
                                        ))}
                                    </div>

                                    {/* ตัวอักษรฝั่งขวา */}
                                    <span className="w-8 md:w-10 text-slate-400 font-bold text-xs md:text-lg text-left pl-4 shrink-0">{rowLetter}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>

        {/* Controls */}
        <div className="absolute right-6 bottom-6 flex flex-col gap-2 bg-black/50 p-2 rounded-xl border border-white/10 shadow-xl z-10 text-white">
            <button onClick={() => setScale(s => Math.min(s + 0.1, 3))} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Plus size={20} /></button>
            <button onClick={() => setScale(s => Math.max(s - 0.1, 0.4))} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><Minus size={20} /></button>
            <button onClick={handleReset} className="p-2 hover:bg-white/10 rounded-lg transition-colors"><RotateCcw size={20} /></button>
        </div>
      </div>
    </div>
  );
}