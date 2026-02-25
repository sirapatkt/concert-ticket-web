"use client";

import { useState, useMemo } from "react";
import { Eye, X, ArrowLeftCircle } from "lucide-react";

export interface TicketTier {
  zoneName: string;
  price: number;
  quantity: number;
  maxQuantity?: number;
}

interface SeatPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  tickets: TicketTier[];
  hallId: string;
  venueSize: string;
}

interface ZoneMapData {
  i: number;
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

const SVG_COLORS = [
  "#FF3B30", "#A855F7", "#32ADE6", "#34C759", 
  "#FFCC00", "#FF9500", "#00C7BE", "#FF2D55",
  "#AF52DE", "#5856D6", "#FF3B30", "#34C759"
];

export default function SeatPreviewModal({ isOpen, onClose, tickets, hallId, venueSize }: SeatPreviewModalProps) {
  const [selectedPreviewZone, setSelectedPreviewZone] = useState<TicketTier | null>(null);

  const handleCloseModal = () => {
    setSelectedPreviewZone(null); 
    onClose(); 
  };

  // 🌟 ฟังก์ชันอัจฉริยะ: วางเก้าอี้และเลขที่นั่งแบบ Pixel-Perfect ตาม Official Map 🌟
  const generateCustomSeatLayout = (zoneName: string, totalSeats: number) => {
    let maxCol = 20;
    let startNum = 1;
    let matrix: { l: number, r: number }[] = [];
    let rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let isFixedLayout = false; // 🌟 เพิ่มตัวแปรเช็คว่าเป็นผังแบบ Fixed หรือไม่
    
    const name = zoneName.toUpperCase().trim();

    // 🏛️ กฎเฉพาะสำหรับ เมืองไทยรัชดาลัย (L1-L6, C1-C6, R1-R6)
    if (name.match(/^[LCR][1-6]$/)) {
        isFixedLayout = true; // ล็อกว่านี่คือโครงสร้างตายตัว

        // จัดการจำนวน Column และเลขที่นั่งเริ่มต้น
        if (name.startsWith("L")) { maxCol = 12; startNum = 1; }
        if (name.startsWith("C")) { maxCol = 16; startNum = 13; }
        if (name.startsWith("R")) { maxCol = 12; startNum = 29; }

        // จัดการชื่อแถว (Row Letters)
        const zoneNum = name[1];
        if (zoneNum === "1") {
            // ✅ เพิ่ม || name === "R1" เข้าไปครับ
            if (name === "L1" || name === "R1") rowLetters = "BCDEFGH".split(""); 
            else rowLetters = "ABCDEFGH".split(""); 
        }
        if (zoneNum === "2") rowLetters = "IJKLMNOP".split("");
        if (zoneNum === "3") rowLetters = "QRST".split("");
        if (zoneNum === "4") {
            if (name === "C4") rowLetters = "UVW".split(""); // C4 มีแค่ 3 แถว
            else rowLetters = "UVWXYZ".split(""); // ส่วน L4, R4 มี 6 แถวเหมือนเดิม
        }
        if (zoneNum === "5") rowLetters = ["AA","BB","CC","DD"];
        if (zoneNum === "6") {
            if (name === "C6" || name === "L6" || name === "R6") rowLetters = ["EE","FF","GG","HH","II","JJ","KK"]; // C6 มีแค่ 7 แถว
            else rowLetters = ["EE","FF","GG","HH","II","JJ","KK","LL","MM"]; // L6, R6 มี 9 แถว
        }
        // สร้าง Matrix รอยแหว่งให้ตรงตามรูป
        if (name === "L1") matrix = [{l:4, r:0}, {l:3, r:0}, {l:2, r:0}, {l:1, r:0}, {l:1, r:0}, {l:1, r:0}, {l:1, r:0}, {l:1, r:0}];
        else if (name === "R1") matrix = [
            {l:0, r:4}, // แถว B: หายไป 4 ตัว (40-4=36) จบที่เบอร์ 36
            {l:0, r:3}, // แถว C: หายไป 3 ตัว (40-3=37) จบที่เบอร์ 37
            {l:0, r:2}, // แถว D: หายไป 2 ตัว (40-2=38) จบที่เบอร์ 38
            {l:0, r:1}  // แถว E-H: หายไป 1 ตัว (40-1=39) จบที่เบอร์ 39
        ]; 
        else if (name === "R1") matrix = [{l:0, r:4}, {l:0, r:4}, {l:0, r:3}, {l:0, r:2}, {l:0, r:1}, {l:0, r:1}, {l:0, r:1}, {l:0, r:1}]; 
        else if (name === "L4") matrix = [{l:0, r:0}, {l:0, r:0}, {l:0, r:0}, {l:0, r:1}, {l:0, r:1}, {l:0, r:1}]; 
        else if (name === "R4") matrix = [{l:0, r:0}, {l:0, r:0}, {l:1, r:0}, {l:1, r:0}, {l:1, r:0}, {l:1, r:0}]; 
        else if (name === "L5") matrix = [{l:1, r:0}]; 
        else if (name === "L6") matrix = [{l:1, r:0}, {l:1, r:0}, {l:1, r:0}, {l:1, r:0}, {l:1, r:0}, {l:1, r:0}, {l:1, r:0}, {l:1, r:0}, {l:1, r:0}]; 
        else if (name === "R5") matrix = [{l:0, r:1}, {l:0, r:0}, {l:0, r:1}, {l:0, r:0}];
        else if (name === "R6") matrix = [{l:0, r:0}, {l:0, r:1}, {l:0, r:0}, {l:0, r:0}, {l:0, r:0}, {l:0, r:1}, {l:0, r:1}, {l:0, r:1}, {l:5, r:1}]; 
        else matrix = [{l:0, r:0}]; // C1-C6 และอื่นๆ เป็นสี่เหลี่ยมเต็ม (ไม่เว้า)
    }
    // 🏟️ กฎสำหรับ อิมแพ็ค และ มหิดล
    else if (["SF", "SJ"].includes(name)) matrix = [{ l: 4, r: 4 }, { l: 2, r: 2 }, { l: 0, r: 0 }];
    else if (name === "A7") matrix = [{ l: 0, r: 0 }, { l: 0, r: 0 }, { l: 2, r: 2 }, { l: 4, r: 4 }];
    else if (["B", "C", "D", "E", "T", "S", "R", "Q", "LTL", "LTR", "UTL", "UTR"].some(n => name === n || name.startsWith(n))) matrix = [{l:2, r:2}, {l:0, r:0}];

    // 🔥 พระเอกอยู่ตรงนี้: จัดการโครงสร้าง Fixed และการซ่อนเก้าอี้ 🔥
    let remaining = totalSeats;
    let targetQuantity = Infinity; 

    if (isFixedLayout) {
        let calcTotal = 0;
        for(let i = 0; i < rowLetters.length; i++) {
            const conf = matrix[i] || (matrix.length > 0 ? matrix[matrix.length - 1] : { l: 0, r: 0 });
            calcTotal += (maxCol - (conf.l || 0) - (conf.r || 0));
        }
        remaining = calcTotal; // บังคับให้โครงสร้างกางเต็มร้อยเสมอ

        // 🌟 เช็คว่าผู้จัดเปลี่ยนเลขลดลงหรือไม่ จาก UI 🌟
        const maxQ = Number(selectedPreviewZone?.maxQuantity) || 0;
        const currentQ = Number(totalSeats) || 0;

        if (maxQ > 0 && currentQ < maxQ) {
            // ถ้าผู้จัดกรอกลดลง (เช่น จาก 120 เหลือ 110 คือลดไป 10) 
            // ให้เอาผังเต็ม ลบออก 10 ตัว (ซ่อนเฉพาะส่วนต่าง)
            const diff = maxQ - currentQ;
            targetQuantity = calcTotal - diff;
        } else {
            // ถ้าไม่เปลี่ยนเลข หรือกรอกเท่าเดิม ให้โชว์เต็ม 100% ไม่มีเก้าอี้หาย!
            targetQuantity = calcTotal;
        }
    }

    let rowIndex = 0;
    const newSeats = [];
    let seatCounter = 0; // 🌟 1. ตัวนับเก้าอี้

    while (remaining > 0 && (!isFixedLayout || rowIndex < rowLetters.length)) {
        const rowLetter = rowLetters[rowIndex % rowLetters.length];
        const conf = matrix[rowIndex] || (matrix.length > 0 ? matrix[matrix.length - 1] : { l: 0, r: 0 });
        
        const lBlanks = conf.l || 0;
        const rBlanks = conf.r || 0;
        const maxReal = maxCol - lBlanks - rBlanks;
        
        const realToPlace = Math.min(remaining, maxReal);
        
        for (let i = 0; i < lBlanks; i++) {
           newSeats.push({ id: `BL_${rowIndex}_${i}`, row: rowLetter, num: "", isHidden: true });
        }
        
        for (let i = 0; i < realToPlace; i++) {
           seatCounter++; // 🌟 2. นับเก้าอี้ 
           const seatNum = startNum + lBlanks + i; 
           
           // 🌟 3. ถ้าเกินเป้าหมายที่คำนวณไว้ ให้ซ่อน (ล่องหนค้ำทรงไว้)
           const shouldHide = isFixedLayout && (seatCounter > targetQuantity);

           newSeats.push({ 
               id: `${rowLetter}${seatNum}`, 
               row: rowLetter, 
               num: seatNum.toString().padStart(2, '0'), 
               isHidden: shouldHide 
           });
        }
        
        const remainingBlanks = maxCol - lBlanks - realToPlace;
        for (let i = 0; i < remainingBlanks; i++) {
           newSeats.push({ id: `BR_${rowIndex}_${i}`, row: rowLetter, num: "", isHidden: true });
        }

        remaining -= realToPlace;
        rowIndex++;
    }
    return newSeats;
  };

  const previewGeneratedSeats = selectedPreviewZone 
    ? generateCustomSeatLayout(selectedPreviewZone.zoneName, Number(selectedPreviewZone.quantity) || 0)
    : [];

  const SvgZone = ({ i, x = 0, y = 0, w = 0, h = 0, d = "", cx = 0, cy = 0, rx = 0, c }: ZoneMapData) => {
    const zone = tickets[i];
    if (!zone || zone.zoneName.trim() === "") return null;

    const isSelected = selectedPreviewZone?.zoneName === zone.zoneName;
    const finalColor = c || SVG_COLORS[i % SVG_COLORS.length]; 
    
    const textX = d ? cx : x + w / 2;
    const textY = d ? cy : y + h / 2;

    return (
      <g 
        onClick={() => setSelectedPreviewZone(zone)}
        className="cursor-pointer transition-all duration-200"
        style={{ transform: isSelected ? 'scale(1.02)' : 'scale(1)', transformOrigin: `${textX}px ${textY}px` }}
      >
        {d ? (
          <path d={d} fill={finalColor} stroke="#050505" strokeWidth={isSelected ? "6" : "3"} className={isSelected ? "" : "hover:opacity-85"}/>
        ) : (
          <rect x={x} y={y} width={w} height={h} rx={rx} fill={finalColor} stroke="#050505" strokeWidth={isSelected ? "6" : "3"} className={isSelected ? "" : "hover:opacity-85"}/>
        )}
        <text x={textX} y={textY} fill={finalColor === "#FFEB3B" || finalColor === "#C6FF00" || finalColor === "#FDD835" ? "#000000" : "#ffffff"} fontSize={d ? "30" : Math.min(w/3, 34)} fontWeight="900" textAnchor="middle" dominantBaseline="middle">
          {zone.zoneName}
        </text>
      </g>
    );
  };

  const renderMap = (mapArray: ZoneMapData[]) => mapArray.map(item => <SvgZone key={item.i} {...item} />);

  // ============================================================================
  // 📍 1. อิมแพ็ค อารีน่า (Hall ID: 1)
  // ============================================================================
  const imSmallMap: ZoneMapData[] = [
    {i:0, x:160, y:230, w:330, h:180}, {i:1, x:510, y:230, w:330, h:180},
    {i:2, x:160, y:430, w:330, h:160}, {i:3, x:510, y:430, w:330, h:160},
    {i:4, x:160, y:610, w:330, h:160}, {i:5, x:510, y:610, w:330, h:160},
    {i:6, d:"M 280 790 L 720 790 L 660 920 L 340 920 Z", cx:500, cy:855}
  ];
  const imMediumMap: ZoneMapData[] = [
    {i:0, x:300, y:250, w:290, h:190}, {i:1, x:610, y:250, w:290, h:190}, {i:2, x:300, y:460, w:290, h:160}, {i:3, x:610, y:460, w:290, h:160}, {i:4, x:300, y:640, w:290, h:160}, {i:5, x:610, y:640, w:290, h:160}, {i:6, d:"M 380 820 L 820 820 L 760 920 L 440 920 Z", cx:600, cy:870},
    {i:7, x:100, y:250, w:180, h:140}, {i:8, x:100, y:410, w:180, h:140}, {i:9, x:100, y:570, w:180, h:140}, {i:10, d:"M 100 730 L 280 730 L 350 900 L 170 850 Z", cx:225, cy:800},
    {i:11, d:"M 180 870 L 320 950 L 250 1080 L 110 1000 Z", cx:215, cy:975}, {i:12, d:"M 335 960 L 460 1000 L 420 1140 L 280 1090 Z", cx:370, cy:1050}, {i:13, d:"M 480 1010 L 720 1010 L 720 1150 L 480 1150 Z", cx:600, cy:1080}, {i:14, d:"M 740 1000 L 865 960 L 920 1090 L 780 1140 Z", cx:830, cy:1050}, {i:15, d:"M 880 950 L 1020 870 L 1090 1000 L 950 1080 Z", cx:985, cy:975},
    {i:16, d:"M 920 730 L 1100 730 L 1030 850 L 850 900 Z", cx:975, cy:800}, {i:17, x:920, y:570, w:180, h:140}, {i:18, x:920, y:410, w:180, h:140}, {i:19, x:920, y:250, w:180, h:140}
  ];
  const imLargeMap: ZoneMapData[] = [
    {i:0, x:320, y:200, w:170, h:130, c:"#9E9E9E"}, {i:1, x:510, y:200, w:170, h:130, c:"#9E9E9E"},
    {i:2, x:320, y:350, w:170, h:110, c:"#9E9E9E"}, {i:3, x:510, y:350, w:170, h:110, c:"#9E9E9E"},
    {i:4, x:320, y:480, w:170, h:110, c:"#9E9E9E"}, {i:5, x:510, y:480, w:170, h:110, c:"#9E9E9E"},
    {i:6, d:"M 350 610 L 650 610 L 620 670 L 380 670 Z", cx:500, cy:640, c:"#9E9E9E"},
    {i:7, x:220, y:200, w:80, h:80, c:"#4DD0E1"}, {i:8, x:220, y:300, w:80, h:80, c:"#4DD0E1"}, {i:9, x:220, y:400, w:80, h:80, c:"#4DD0E1"}, {i:10, d:"M 220 500 L 300 500 L 300 570 L 260 610 L 220 580 Z", cx:260, cy:550, c:"#4DD0E1"},
    {i:19, x:700, y:200, w:80, h:80, c:"#4DD0E1"}, {i:18, x:700, y:300, w:80, h:80, c:"#4DD0E1"}, {i:17, x:700, y:400, w:80, h:80, c:"#4DD0E1"}, {i:16, d:"M 700 500 L 780 500 L 780 580 L 740 610 L 700 570 Z", cx:740, cy:550, c:"#4DD0E1"},
    {i:11, d:"M 270 630 L 350 690 L 310 750 L 220 690 Z", cx:285, cy:690, c:"#4DD0E1"}, {i:12, d:"M 370 700 L 450 730 L 430 810 L 340 760 Z", cx:400, cy:750, c:"#4DD0E1"}, {i:13, d:"M 470 740 L 530 740 L 530 820 L 470 820 Z", cx:500, cy:780, c:"#4DD0E1"}, {i:14, d:"M 550 730 L 630 700 L 660 760 L 570 810 Z", cx:600, cy:750, c:"#4DD0E1"}, {i:15, d:"M 650 690 L 730 630 L 780 690 L 690 750 Z", cx:715, cy:690, c:"#4DD0E1"},
    {i:20, d:"M 100 200 L 200 200 L 200 280 L 100 280 L 100 250 L 70 250 L 70 230 L 100 230 Z", cx:150, cy:240, c:"#FDD835"}, 
    {i:21, d:"M 100 300 L 200 300 L 200 380 L 100 380 L 100 350 L 70 350 L 70 330 L 100 330 Z", cx:150, cy:340, c:"#FDD835"}, 
    {i:22, d:"M 100 400 L 200 400 L 200 480 L 100 480 L 100 450 L 70 450 L 70 430 L 100 430 Z", cx:150, cy:440, c:"#FDD835"}, 
    {i:23, d:"M 100 500 L 200 500 L 200 590 L 160 630 L 100 600 L 100 560 L 70 550 L 70 530 L 100 530 Z", cx:150, cy:550, c:"#FDD835"}, 
    {i:38, d:"M 800 200 L 900 200 L 900 230 L 930 230 L 930 250 L 900 250 L 900 280 L 800 280 Z", cx:850, cy:240, c:"#FDD835"}, 
    {i:37, d:"M 800 300 L 900 300 L 900 330 L 930 330 L 930 350 L 900 350 L 900 380 L 800 380 Z", cx:850, cy:340, c:"#FDD835"}, 
    {i:36, d:"M 800 400 L 900 400 L 900 430 L 930 430 L 930 450 L 900 450 L 900 480 L 800 480 Z", cx:850, cy:440, c:"#FDD835"}, 
    {i:35, d:"M 800 500 L 900 500 L 900 530 L 930 530 L 930 550 L 900 560 L 900 600 L 840 630 L 800 590 Z", cx:850, cy:550, c:"#FDD835"}, 
    {i:24, d:"M 110 630 L 190 690 L 140 780 L 70 720 Z", cx:130, cy:700, c:"#FDD835"}, 
    {i:25, d:"M 210 700 L 290 770 L 230 870 L 150 790 Z", cx:220, cy:780, c:"#FDD835"}, 
    {i:26, d:"M 310 780 L 400 820 L 360 930 L 250 880 Z", cx:330, cy:850, c:"#FDD835"}, 
    {i:27, d:"M 420 830 L 460 840 L 460 880 L 500 880 L 500 980 L 380 950 Z", cx:450, cy:910, c:"#FDD835"}, 
    {i:28, d:"M 470 850 L 530 850 L 530 920 L 580 920 L 580 1020 L 450 1020 L 450 920 L 470 920 Z", cx:500, cy:935, c:"#FDD835"}, 
    {i:29, d:"M 540 840 L 580 830 L 620 950 L 500 980 L 500 880 L 540 880 Z", cx:550, cy:910, c:"#FDD835"}, 
    {i:30, d:"M 600 820 L 690 780 L 750 880 L 640 930 Z", cx:670, cy:850, c:"#FDD835"}, 
    {i:31, d:"M 710 770 L 790 700 L 850 790 L 770 870 Z", cx:780, cy:780, c:"#FDD835"}, 
    {i:32, d:"M 810 690 L 890 630 L 930 720 L 860 780 Z", cx:870, cy:700, c:"#FDD835"}, 
    {i:33, d:"M 900 620 L 980 560 L 1020 650 L 950 710 Z", cx:960, cy:630, c:"#FDD835"}, 
    {i:34, d:"M 990 550 L 1070 490 L 1110 580 L 1040 640 Z", cx:1050, cy:560, c:"#FDD835"} 
  ];

  // ============================================================================
  // 📍 2. มหิดลสิทธาคาร (Hall ID: 2)
  // ============================================================================
  const mhLevel1: ZoneMapData[] = [
    {i:12, d:"M 200 250 L 280 230 L 280 340 L 180 340 Z", cx:240, cy:290, c:"#9E9E9E"},
    {i:14, d:"M 800 230 L 880 250 L 900 340 L 800 340 Z", cx:840, cy:290, c:"#9E9E9E"},
    {i:13, d:"M 160 360 L 270 360 L 310 500 L 200 480 Z", cx:230, cy:420, c:"#F48FB1"},
    {i:15, d:"M 810 360 L 920 360 L 880 480 L 770 500 Z", cx:850, cy:420, c:"#F48FB1"},
    {i:0, d:"M 300 200 Q 540 150 780 200 L 780 280 Q 540 240 300 280 Z", cx:540, cy:235, c:"#F48FB1"},
    {i:3, d:"M 300 300 Q 400 280 460 280 L 460 380 Q 380 380 320 390 Z", cx:380, cy:340, c:"#9E9E9E"},
    {i:4, d:"M 480 280 Q 540 270 600 280 L 600 380 Q 540 370 480 380 Z", cx:540, cy:330, c:"#9E9E9E"},
    {i:5, d:"M 620 280 Q 680 280 780 300 L 760 390 Q 700 380 620 380 Z", cx:700, cy:340, c:"#9E9E9E"},
    {i:6, d:"M 330 410 Q 400 400 460 400 L 460 480 Q 400 480 350 490 Z", cx:400, cy:445, c:"#F48FB1"},
    {i:7, d:"M 480 400 Q 540 390 600 400 L 600 480 Q 540 470 480 480 Z", cx:540, cy:440, c:"#9E9E9E"},
    {i:8, d:"M 620 400 Q 680 400 750 410 L 730 490 Q 680 480 620 480 Z", cx:680, cy:445, c:"#F48FB1"},
    {i:9, d:"M 360 510 Q 420 500 460 500 L 460 540 Q 410 540 370 545 Z", cx:410, cy:525, c:"#F48FB1"},
    {i:10, d:"M 480 500 Q 540 490 600 500 L 600 540 Q 540 530 480 540 Z", cx:540, cy:520, c:"#F48FB1"},
    {i:11, d:"M 620 500 Q 660 500 720 510 L 710 545 Q 670 540 620 540 Z", cx:670, cy:525, c:"#F48FB1"},
  ];
  const mhLevel2: ZoneMapData[] = [
    {i:16, d:"M 140 560 L 190 530 L 230 630 L 170 650 Z", cx:180, cy:590, c:"#FDD835"},
    {i:17, d:"M 120 670 L 160 650 L 200 740 L 150 760 Z", cx:160, cy:700, c:"#FDD835"},
    {i:18, d:"M 100 780 L 140 760 L 170 850 L 120 870 Z", cx:140, cy:810, c:"#FDD835"},
    {i:19, d:"M 290 580 Q 400 600 460 610 L 460 700 Q 380 690 310 670 Z", cx:380, cy:640, c:"#E57373"},
    {i:20, d:"M 480 610 Q 540 620 600 610 L 600 700 Q 540 710 480 700 Z", cx:540, cy:660, c:"#E57373"},
    {i:21, d:"M 620 610 Q 680 600 790 580 L 770 670 Q 700 690 620 700 cx:700, cy:640", c:"#E57373"},
    {i:22, d:"M 310 720 Q 390 740 460 750 L 460 790 Q 380 780 320 760 Z", cx:390, cy:755, c:"#F48FB1"},
    {i:23, d:"M 480 750 Q 540 760 600 750 L 600 790 Q 540 800 480 790 Z", cx:540, cy:770, c:"#F48FB1"},
    {i:24, d:"M 620 750 Q 690 740 770 720 L 760 760 Q 700 780 620 790 Z", cx:690, cy:755, c:"#F48FB1"},
    {i:25, d:"M 890 530 L 940 560 L 910 650 L 850 630 Z", cx:900, cy:590, c:"#FDD835"},
    {i:26, d:"M 920 650 L 960 670 L 930 760 L 880 740 Z", cx:920, cy:700, c:"#FDD835"},
    {i:27, d:"M 940 760 L 980 780 L 960 870 L 910 850 Z", cx:940, cy:810, c:"#FDD835"},
  ];
  const mhLevel3: ZoneMapData[] = [
    {i:28, d:"M 80 920 L 120 900 L 150 970 L 100 990 Z", cx:120, cy:940, c:"#FDD835"},
    {i:29, d:"M 70 1010 L 100 990 L 130 1060 L 90 1080 Z", cx:100, cy:1030, c:"#FDD835"},
    {i:30, d:"M 60 1100 L 90 1080 L 110 1150 L 80 1170 Z", cx:90, cy:1120, c:"#FDD835"},
    {i:31, d:"M 50 1190 L 80 1170 L 100 1240 L 70 1260 Z", cx:80, cy:1210, c:"#FDD835"},
    {i:32, d:"M 80 1280 L 120 1260 L 170 1350 L 120 1370 Z", cx:120, cy:1310, c:"#FDD835"},
    {i:33, d:"M 310 860 Q 400 880 460 900 L 460 1100 Q 380 1080 340 1040 Z", cx:400, cy:980, c:"#E57373"}, 
    {i:34, d:"M 480 900 Q 540 920 600 900 L 600 1100 Q 540 1120 480 1100 Z", cx:540, cy:1000, c:"#E57373"}, 
    {i:35, d:"M 620 900 Q 680 880 770 860 L 740 1040 Q 700 1080 620 1100 Z", cx:680, cy:980, c:"#E57373"}, 
    {i:36, d:"M 960 900 L 1000 920 L 980 990 L 930 970 Z", cx:960, cy:940, c:"#FDD835"},
    {i:37, d:"M 980 990 L 1010 1010 L 990 1080 L 950 1060 Z", cx:980, cy:1030, c:"#FDD835"},
    {i:38, d:"M 990 1080 L 1020 1100 L 1000 1170 L 970 1150 Z", cx:990, cy:1120, c:"#FDD835"},
    {i:39, d:"M 1000 1170 L 1030 1190 L 1010 1260 L 980 1240 Z", cx:1000, cy:1210, c:"#FDD835"},
    {i:40, d:"M 960 1260 L 1000 1280 L 960 1370 L 910 1350 Z", cx:960, cy:1310, c:"#FDD835"},
  ];

  // ============================================================================
  // 📍 3. เมืองไทยรัชดาลัย (Hall ID: 3)
  // ============================================================================
  const rmSmallMap: ZoneMapData[] = [
    {i:0, d:"M 150 200 L 300 200 L 300 320 L 100 320 L 100 250 Z", cx:200, cy:260}, 
    {i:2, x:320, y:200, w:360, h:120},
    {i:4, d:"M 700 200 L 850 200 L 900 250 L 900 320 L 700 320 Z", cx:800, cy:260},
    {i:1, x:100, y:340, w:200, h:120},
    {i:3, x:320, y:340, w:360, h:120},
    {i:5, x:700, y:340, w:200, h:120}
  ];
  const rmMediumMap: ZoneMapData[] = [
    {i:0, d:"M 150 200 L 300 200 L 300 320 L 100 320 L 100 250 Z", cx:200, cy:260},
    {i:1, x:100, y:340, w:200, h:120},
    {i:2, x:100, y:480, w:200, h:60}, 
    {i:3, d:"M 100 560 L 300 560 L 300 660 L 260 660 L 260 690 L 100 690 Z", cx:200, cy:620}, 
    {i:4, x:320, y:200, w:360, h:120},
    {i:5, x:320, y:340, w:360, h:120},
    {i:6, x:320, y:480, w:360, h:60}, 
    {i:7, x:320, y:560, w:360, h:60}, 
    {i:8, d:"M 700 200 L 850 200 L 900 250 L 900 320 L 700 320 Z", cx:800, cy:260},
    {i:9, x:700, y:340, w:200, h:120},
    {i:10, x:700, y:480, w:200, h:60}, 
    {i:11, d:"M 700 560 L 900 560 L 900 690 L 740 690 L 740 660 L 700 660 Z", cx:800, cy:620} 
  ];
  const rmLargeMap: ZoneMapData[] = [
    {i:0, d:"M 150 200 L 300 200 L 300 320 L 100 320 L 100 250 Z", cx:200, cy:260, c:"#FFEB3B"}, 
    {i:6, x:320, y:200, w:360, h:120, c:"#FFEB3B"}, 
    {i:12, d:"M 700 200 L 850 200 L 900 250 L 900 320 L 700 320 Z", cx:800, cy:260, c:"#FFEB3B"}, 
    {i:1, x:100, y:340, w:200, h:120, c:"#FF9800"}, 
    {i:7, x:320, y:340, w:360, h:120, c:"#FF9800"}, 
    {i:13, x:700, y:340, w:200, h:120, c:"#FF9800"}, 
    {i:2, x:100, y:480, w:200, h:60, c:"#E91E63"}, 
    {i:8, x:320, y:480, w:360, h:60, c:"#E91E63"}, 
    {i:14, x:700, y:480, w:200, h:60, c:"#E91E63"}, 
    {i:3, d:"M 100 560 L 300 560 L 300 660 L 260 660 L 260 690 L 100 690 Z", cx:200, cy:620, c:"#64B5F6"}, 
    {i:9, x:320, y:560, w:360, h:60, c:"#64B5F6"}, 
    {i:15, d:"M 700 560 L 900 560 L 900 690 L 740 690 L 740 660 L 700 660 Z", cx:800, cy:620, c:"#64B5F6"}, 
    {i:4, x:100, y:760, w:200, h:80, c:"#9C27B0"}, 
    {i:10, x:320, y:760, w:360, h:80, c:"#9C27B0"}, 
    {i:16, x:700, y:760, w:200, h:80, c:"#9C27B0"}, 
    {i:5, d:"M 100 860 L 300 860 L 300 990 L 100 990 Z", cx:200, cy:925, c:"#C6FF00"}, // L6 
    {i:11, x:320, y:860, w:360, h:100, c:"#C6FF00"}, 
    {i:17, d:"M 700 860 L 900 860 L 900 990 L 700 990 Z", cx:800, cy:925, c:"#C6FF00"}, // R6 
  ];

  const renderSvgMacroView = () => {
    if (tickets.filter(t => t.zoneName.trim() !== "").length === 0) return <p className="text-slate-500 font-medium">กรุณาระบุชื่อโซนและจำนวนที่นั่งก่อนครับ</p>;

    if (hallId === "1" && venueSize === "Small") {
      return (
        <svg viewBox="0 0 1000 1000" className="w-full max-w-lg mx-auto max-h-[60vh] drop-shadow-2xl">
          <rect x="250" y="50" width="500" height="120" fill="#ffffff" rx="8" />
          <text x="500" y="115" fill="#000000" fontSize="56" fontWeight="900" textAnchor="middle" letterSpacing="10">STAGE</text>
          {renderMap(imSmallMap)}
        </svg>
      );
    }
    if (hallId === "1" && venueSize === "Medium") {
      return (
        <svg viewBox="0 0 1000 1200" className="w-full max-w-xl mx-auto max-h-[60vh] drop-shadow-2xl">
          <rect x="250" y="50" width="500" height="140" fill="#ffffff" rx="8" />
          <text x="500" y="125" fill="#000000" fontSize="64" fontWeight="900" textAnchor="middle" letterSpacing="15">STAGE</text>
          {renderMap(imMediumMap)}
        </svg>
      );
    }
    if (hallId === "1" && venueSize === "Large") {
      return (
        <svg viewBox="0 0 1000 1100" className="w-full max-w-2xl mx-auto max-h-[65vh] drop-shadow-2xl">
          <rect x="350" y="50" width="300" height="100" fill="#ffffff" rx="4" />
          <text x="500" y="115" fill="#000000" fontSize="48" fontWeight="900" textAnchor="middle" letterSpacing="5">STAGE</text>
          {renderMap(imLargeMap)}
        </svg>
      );
    }

    if (hallId === "2" && venueSize === "Small") {
      return (
        <svg viewBox="0 0 1080 600" className="w-full max-w-lg mx-auto max-h-[60vh] drop-shadow-2xl">
          <path d="M 350 50 Q 540 30 730 50 L 730 150 Q 540 170 350 150 Z" fill="#ffffff" />
          <text x="540" y="115" fill="#000000" fontSize="56" fontWeight="900" textAnchor="middle" letterSpacing="10">STAGE</text>
          {renderMap(mhLevel1)}
        </svg>
      );
    }
    if (hallId === "2" && venueSize === "Medium") {
      return (
        <svg viewBox="0 0 1080 950" className="w-full max-w-xl mx-auto max-h-[60vh] drop-shadow-2xl">
          <path d="M 350 50 Q 540 30 730 50 L 730 150 Q 540 170 350 150 Z" fill="#ffffff" />
          <text x="540" y="115" fill="#000000" fontSize="56" fontWeight="900" textAnchor="middle" letterSpacing="10">STAGE</text>
          {renderMap(mhLevel1)}
          {renderMap(mhLevel2)}
        </svg>
      );
    }
    if (hallId === "2" && venueSize === "Large") {
      return (
        <svg viewBox="0 0 1200 1500" className="w-full max-w-2xl mx-auto max-h-[70vh] drop-shadow-2xl">
          <path d="M 300 50 Q 600 20 900 50 L 900 150 Q 600 180 300 150 Z" fill="#ffffff" />
          <text x="600" y="120" fill="#000000" fontSize="64" fontWeight="900" textAnchor="middle" letterSpacing="15">STAGE</text>
          {renderMap(mhLevel1)}
          <line x1="50" y1="560" x2="1150" y2="560" stroke="#ffffff" strokeWidth="4" strokeDasharray="15,15" strokeOpacity="0.3" />
          <text x="540" y="550" fill="#ffffff" fontSize="24" fontWeight="bold">Level 2</text>
          {renderMap(mhLevel2)}
          <line x1="50" y1="880" x2="1150" y2="880" stroke="#ffffff" strokeWidth="4" strokeDasharray="15,15" strokeOpacity="0.3" />
          <text x="540" y="870" fill="#ffffff" fontSize="24" fontWeight="bold">Level 3</text>
          {renderMap(mhLevel3)}
        </svg>
      );
    }

    if (hallId === "3" && venueSize === "Small") {
      return (
        <svg viewBox="0 0 1000 500" className="w-full max-w-lg mx-auto max-h-[60vh] drop-shadow-2xl">
          <rect x="300" y="50" width="400" height="100" fill="#ffffff" rx="8" />
          <text x="500" y="105" fill="#000000" fontSize="48" fontWeight="900" textAnchor="middle" letterSpacing="10">STAGE</text>
          {renderMap(rmSmallMap)}
        </svg>
      );
    }
    if (hallId === "3" && venueSize === "Medium") {
      return (
        <svg viewBox="0 0 1000 750" className="w-full max-w-xl mx-auto max-h-[60vh] drop-shadow-2xl">
          <rect x="300" y="50" width="400" height="100" fill="#ffffff" rx="8" />
          <text x="500" y="105" fill="#000000" fontSize="48" fontWeight="900" textAnchor="middle" letterSpacing="10">STAGE</text>
          {renderMap(rmMediumMap)}
        </svg>
      );
    }
    if (hallId === "3" && venueSize === "Large") {
      return (
        <svg viewBox="0 0 1000 1050" className="w-full max-w-xl mx-auto max-h-[65vh] drop-shadow-2xl">
          <rect x="300" y="50" width="400" height="100" fill="#ffffff" rx="8" />
          <text x="500" y="105" fill="#000000" fontSize="48" fontWeight="900" textAnchor="middle" letterSpacing="10">STAGE</text>
          {renderMap(rmLargeMap)}
          <line x1="100" y1="735" x2="900" y2="735" stroke="#ffffff" strokeWidth="4" strokeOpacity="0.4" />
          <text x="50" y="300" fill="#ffffff" fontSize="28" fontWeight="bold">1FL.</text>
          <text x="50" y="820" fill="#ffffff" fontSize="28" fontWeight="bold">2FL.</text>
        </svg>
      );
    }

    return <p className="text-slate-500 mt-10">ไม่พบผังที่นั่ง กรุณาเลือกสถานที่ใหม่</p>;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[110] bg-[#050505] flex items-center justify-center animate-in fade-in duration-200 font-sans">
      <div className="w-full h-full flex flex-col relative">
        
        <div className="absolute top-6 right-6 z-50">
            <button onClick={handleCloseModal} className="text-white hover:text-cyan-400 bg-white/10 p-3 rounded-full transition-all">
              <X size={24} />
            </button>
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col pt-10">
          <div className="w-full flex justify-center pb-6">
             <h2 className="text-sm md:text-base font-medium text-slate-400 tracking-wider">กรุณาคลิกที่ผังเพื่อดูรายละเอียดที่นั่ง</h2>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 relative">
            {selectedPreviewZone === null ? (
              <div className="w-full text-center relative z-10 flex flex-col items-center justify-center">
                {renderSvgMacroView()}
              </div>
            ) : (
              <div className="w-full max-w-4xl text-center relative z-10 pb-10 animate-in zoom-in-95 duration-200">
                <button onClick={() => setSelectedPreviewZone(null)} className="mb-6 flex items-center gap-2 text-white bg-slate-800 px-5 py-2.5 rounded-full mx-auto hover:bg-slate-700 text-sm shadow-lg">
                  <ArrowLeftCircle size={18} /> กลับไปหน้าผังใหญ่
                </button>
                
                <h3 className="text-3xl md:text-4xl font-black text-white mb-2">โซน {selectedPreviewZone.zoneName}</h3>
                <p className="text-xl text-cyan-400 mb-8 font-medium">฿ {Number(selectedPreviewZone.price).toLocaleString()}</p>

                <div className="flex flex-col gap-2 pointer-events-none pb-20 overflow-x-auto w-full max-w-full">
                  <div className="min-w-max px-4 mx-auto">
                    {Array.from(new Set(previewGeneratedSeats.map(s => s.row))).map(row => (
                      <div key={row} className="flex items-center gap-1.5 md:gap-2 justify-center mb-2">
                        <span className="w-6 text-slate-400 font-bold text-xs md:text-sm right pr-3">{row}</span>
                        {previewGeneratedSeats.filter(s => s.row === row).map(seat => (
                          <div key={seat.id} className={`w-7 h-7 md:w-9 md:h-9 flex items-center justify-center ${seat.isHidden ? 'opacity-0' : 'transition-transform hover:scale-110'}`}>
                            {!seat.isHidden && (
                              <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                                 <circle cx="50" cy="50" r="48" fill="#FFCC00" />
                                 <text x="50" y="55" fill="#000000" fontSize="38" fontWeight="900" textAnchor="middle" dominantBaseline="middle">{seat.num}</text>
                              </svg>
                            )}
                          </div>
                        ))}
                        <span className="w-6 text-slate-400 font-bold text-xs md:text-sm text-left pl-3">{row}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}