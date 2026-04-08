"use client";

import { useState } from "react";
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
    // 🌟 อัปเกรด: เพิ่ม stagger เพื่อรองรับการจัดเรียงเก้าอี้แบบเยื้องฟันปลา (สลับฟันปลาแบบอิฐ) 🌟
    let matrix: { l?: number, r?: number, gapAfter?: number, start?: number, stagger?: boolean }[] = [];
    let rowLetters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    let isFixedLayout = false; 
    
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
    // 🏟️ กฎสำหรับ อิมแพ็ค
    else if (["A1", "A2", "A3", "A4"].includes(name)) {
        isFixedLayout = true;
        rowLetters = "ABCDEFGHIJKLMNOPQRST".split(""); // บังคับมีแค่ 20 แถว (A-T)
        maxCol = 25;
        matrix = [{l:0, r:0}];
    }
    else if (name === "A5") {
        isFixedLayout = true;
        rowLetters = "ABCDEFGHIJKLMNOPQRST".split(""); // บังคับมีแค่ 20 แถว (A-T)
        maxCol = 25;
        matrix = [
            ...Array(15).fill({ l: 0, r: 0 }),
            { l: 2, r: 0 }, { l: 4, r: 0 }, { l: 6, r: 0 }, { l: 8, r: 0 }, { l: 10, r: 0 }
        ];
    }
    else if (name === "A6") {
        isFixedLayout = true;
        rowLetters = "ABCDEFGHIJKLMNOPQRST".split(""); // บังคับมีแค่ 20 แถว (A-T)
        maxCol = 25;
        matrix = [
            ...Array(15).fill({ l: 0, r: 0 }),
            { l: 0, r: 2 }, { l: 0, r: 4 }, { l: 0, r: 6 }, { l: 0, r: 8 }, { l: 0, r: 10 }
        ];
    }
    else if (name === "A7") {
        isFixedLayout = true;
        rowLetters = "ABCDEFGHIJ".split(""); // บังคับมีแค่ 10 แถว (A-J)
        maxCol = 48;
        matrix = [
            ...Array(5).fill({ l: 0, r: 0 }),
            { l: 2, r: 2 }, { l: 4, r: 4 }, { l: 6, r: 6 }, { l: 8, r: 8 }, { l: 10, r: 10 }
        ];
    }
   // 🏟️ 🎯 กฎสำหรับโซนอัฒจันทร์ทรงสี่เหลี่ยม (SB, SC, SD และ SL, SM, SN)
    else if (["SB", "SC", "SD", "SL", "SM", "SN"].includes(name)) {
        isFixedLayout = true;
        rowLetters = "ABCDEFGH".split(""); // ชื่อแถว A ถึง H (8 แถว)
        maxCol = 20; // ความยาวแนวนอน 20 ที่นั่งต่อแถว
        matrix = [{ l: 0, r: 0 }]; // เป็นสี่เหลี่ยมผืนผ้าเต็มบล็อก
    }
    // 🏟️ 🎯 กฎสำหรับโซน SE และ SK (รูปทรงปาดขวาเหมือนกัน)
    else if (["SE", "SK"].includes(name)) {
        isFixedLayout = true;
        rowLetters = "ABCDEFGH".split(""); 
        maxCol = 27; 
        matrix = [
            { l: 0, r: 6 }, // แถว A: มี 21 ที่นั่ง
            { l: 0, r: 5 }, // แถว B: มี 22 ที่นั่ง
            { l: 0, r: 4 }, // แถว C: มี 23 ที่นั่ง
            { l: 0, r: 4 }, // แถว D: มี 23 ที่นั่ง
            { l: 0, r: 3 }, // แถว E: มี 24 ที่นั่ง
            { l: 0, r: 2 }, // แถว F: มี 25 ที่นั่ง
            { l: 0, r: 1 }, // แถว G: มี 26 ที่นั่ง
            { l: 0, r: 0 }  // แถว H: มี 27 ที่นั่ง
        ];
    }
    // 🏟️ 🎯 กฎสำหรับโซน SF และ SJ (ปาดขวา และบังคับความจุ 160 ที่นั่ง)
    else if (["SF", "SJ"].includes(name)) {
        isFixedLayout = true;
        rowLetters = "ABCDEFGH".split(""); 
        maxCol = 24; // ขยายฐานกว้างสุดเป็น 24 ที่นั่ง
        matrix = [
            { l: 0, r: 8 }, // แถว A: มี 16 ที่นั่ง
            { l: 0, r: 7 }, // แถว B: มี 17 ที่นั่ง
            { l: 0, r: 6 }, // แถว C: มี 18 ที่นั่ง
            { l: 0, r: 5 }, // แถว D: มี 19 ที่นั่ง
            { l: 0, r: 3 }, // แถว E: มี 21 ที่นั่ง (ขยับเพิ่มเพื่อให้ยอดรวมครบ 160)
            { l: 0, r: 2 }, // แถว F: มี 22 ที่นั่ง
            { l: 0, r: 1 }, // แถว G: มี 23 ที่นั่ง
            { l: 0, r: 0 }  // แถว H: เต็มแถว 24 ที่นั่ง
        ];
    }
    // 🏟️ 🎯 กฎสำหรับโซน SG และ SI (136 ที่นั่ง ตามผังหน้ากดบัตรจริง)
    else if (["SG", "SI"].includes(name)) {
        isFixedLayout = true;
        rowLetters = "ABCDEFGH".split(""); 
        maxCol = 20; // ฐานกว้างสุดที่แถว H คือ 20 ที่นั่ง
        matrix = [
            { l: 0, r: 6 }, // แถว A: มี 14 ที่นั่ง
            { l: 0, r: 5 }, // แถว B: มี 15 ที่นั่ง
            { l: 0, r: 4 }, // แถว C: มี 16 ที่นั่ง
            { l: 0, r: 3 }, // แถว D: มี 17 ที่นั่ง
            { l: 0, r: 3 }, // แถว E: มี 17 ที่นั่ง
            { l: 0, r: 2 }, // แถว F: มี 18 ที่นั่ง
            { l: 0, r: 1 }, // แถว G: มี 19 ที่นั่ง
            { l: 0, r: 0 }  // แถว H: เต็มแถว 20 ที่นั่ง
        ];
    }
    // 🏟️ 🎯 กฎสำหรับโซน SH (อัฒจันทร์ตรงกลางหลังสุด 152 ที่นั่ง)
    else if (name === "SH") {
        isFixedLayout = true;
        rowLetters = "ABCDEFGH".split(""); 
        maxCol = 19; // กว้าง 19 ที่นั่งต่อแถว
        matrix = [{ l: 0, r: 0 }]; // เป็นสี่เหลี่ยมผืนผ้าเต็มบล็อก ไม่มีรอยแหว่ง
    }
    // 🏟️ 🎯 กฎสำหรับโซน B และ T (151 ที่นั่ง 18 แถว กองชิดด้านขวา/ซ้ายสมมาตรกัน)
        else if (["B", "T"].includes(name)) {
            isFixedLayout = true;
            // 🌟 ขยายเป็น 18 แถว (A ถึง R) ตามโควต้าใหม่
            rowLetters = "ABCDEFGHIJKLMNOPQR".split(""); 
            maxCol = 10; // ฐานกว้างสุด 10 ที่นั่ง
            
            const isT = name === "T"; // โซน T พลิกกลับด้านเป็นกระจกเงา

            matrix = [
                { l: isT ? 0 : 5, r: isT ? 5 : 0 }, // แถว 1 (A): 5 ที่นั่ง
                { l: isT ? 0 : 3, r: isT ? 3 : 0 }, // แถว 2 (B): 7 ที่นั่ง
                { l: isT ? 0 : 3, r: isT ? 3 : 0 }, // แถว 3 (C): 7 ที่นั่ง
                { l: isT ? 0 : 3, r: isT ? 3 : 0 }, // แถว 4 (D): 7 ที่นั่ง
                { l: isT ? 0 : 3, r: isT ? 3 : 0 }, // แถว 5 (E): 7 ที่นั่ง
                { l: isT ? 0 : 3, r: isT ? 3 : 0 }, // แถว 6 (F): 7 ที่นั่ง
                { l: isT ? 0 : 4, r: isT ? 4 : 0 }, // แถว 7 (G): 6 ที่นั่ง
                { l: isT ? 0 : 5, r: isT ? 5 : 0 }, // แถว 8 (H): 5 ที่นั่ง
                { l: 0, r: 0 }, // แถว 9 (I): 10 ที่นั่ง (เริ่มฐานเต็ม)
                { l: 0, r: 0 }, // แถว 10 (J): 10 ที่นั่ง
                { l: 0, r: 0 }, // แถว 11 (K): 10 ที่นั่ง
                { l: 0, r: 0 }, // แถว 12 (L): 10 ที่นั่ง
                { l: 0, r: 0 }, // แถว 13 (M): 10 ที่นั่ง
                { l: 0, r: 0 }, // แถว 14 (N): 10 ที่นั่ง
                { l: 0, r: 0 }, // แถว 15 (O): 10 ที่นั่ง
                { l: 0, r: 0 }, // แถว 16 (P): 10 ที่นั่ง
                { l: 0, r: 0 }, // แถว 17 (Q): 10 ที่นั่ง
                { l: 0, r: 0 }  // แถว 18 (R): 10 ที่นั่ง
            ];
        }
    // 🏟️ 🎯 กฎสำหรับโซน C, D, S และ R (ทรงตัว T คว่ำ ยอด 297 ที่นั่งเป๊ะ)
    else if (["C", "D", "S", "R"].includes(name)) {
        isFixedLayout = true;
        // 🌟 ต้องเขียน Array เต็ม เพราะมีแถว "AA"
        rowLetters = ["AA", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q"];
        maxCol = 20; // ฐานล่างกว้างสุด 20 ที่นั่ง (เพื่อให้ยอดรวมจบที่ 297)
        matrix = [
            { l: 4, r: 5 }, // แถว AA: 11 ที่นั่ง
            { l: 3, r: 4 }, // แถว A: 13 ที่นั่ง 
            { l: 3, r: 4 }, // แถว B: 13 ที่นั่ง
            { l: 3, r: 4 }, // แถว C: 13 ที่นั่ง
            { l: 3, r: 4 }, // แถว D: 13 ที่นั่ง
            { l: 3, r: 4 }, // แถว E: 13 ที่นั่ง
            { l: 4, r: 5 }, // แถว F: 11 ที่นั่ง
            { l: 5, r: 5 }, // แถว G: 10 ที่นั่ง
            { l: 0, r: 0 }, // แถว H: 20 ที่นั่ง (ฐานล่างเต็มแถว)
            { l: 0, r: 0 }, // แถว I: 20 ที่นั่ง
            { l: 0, r: 0 }, // แถว J: 20 ที่นั่ง
            { l: 0, r: 0 }, // แถว K: 20 ที่นั่ง
            { l: 0, r: 0 }, // แถว L: 20 ที่นั่ง
            { l: 0, r: 0 }, // แถว M: 20 ที่นั่ง
            { l: 0, r: 0 }, // แถว N: 20 ที่นั่ง
            { l: 0, r: 0 }, // แถว O: 20 ที่นั่ง
            { l: 0, r: 0 }, // แถว P: 20 ที่นั่ง
            { l: 0, r: 0 }  // แถว Q: 20 ที่นั่ง
        ];
    }
    // 🏟️ 🎯 กฎสำหรับโซน E และ Q (เว้าและปาดเป็นขั้นบันได ยอด 306 ที่นั่งเป๊ะ)
    else if (["E", "Q"].includes(name)) {
        isFixedLayout = true;
        // 🌟 ระวังแถว "AA" เหมือนเดิมนะครับ
        rowLetters = ["AA", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q"];
        maxCol = 23; 
        matrix = [
            { l: 5, r: 9 }, // แถว AA
            { l: 4, r: 7 }, // แถว A
            { l: 4, r: 6 }, // แถว B
            { l: 4, r: 6 }, // แถว C
            { l: 4, r: 6 }, // แถว D
            { l: 4, r: 5 }, // แถว E
            { l: 5, r: 4 }, // แถว F
            { l: 5, r: 5 }, // แถว G
            { l: 0, r: 5 }, // แถว H (เริ่มฐานล่าง)
            { l: 0, r: 5 }, // แถว I
            { l: 0, r: 5 }, // แถว J
            { l: 0, r: 4 }, // แถว K
            { l: 0, r: 3 }, // แถว L
            { l: 0, r: 2 }, // แถว M
            { l: 0, r: 1 }, // แถว N
            { l: 0, r: 0 }, // แถว O (เต็มแถว)
            { l: 0, r: 0 }, // แถว P
            { l: 0, r: 0 }  // แถว Q
        ];
    }
  // 🏟️ 🎯 กฎสำหรับโซน F และ P (แฝดซ้ายขวา บังคับยอด 258 ที่นั่งเป๊ะ)
      else if (["F", "P"].includes(name)) {
          isFixedLayout = true;
          rowLetters = "ABCDEFGHIJKLMNOPQRSTU".split(""); // โซนนี้ลึก 21 แถว (A ถึง U)
          maxCol = 19; // ฐานกว้างสุด 19 ที่นั่ง
            
          const isP = name === "P"; // เช็คว่าเป็นโซน P หรือไม่ เพื่อพลิกรูปทรงเป็นกระจกเงา

          matrix = [
              { l: isP ? 3 : 12, r: isP ? 12 : 3 }, // แถว A
              { l: isP ? 3 : 11, r: isP ? 11 : 3 }, // แถว B
              { l: isP ? 3 : 11, r: isP ? 11 : 3 }, // แถว C
              { l: isP ? 3 : 10, r: isP ? 10 : 3 }, // แถว D
              { l: isP ? 3 : 10, r: isP ? 10 : 3 }, // แถว E
              { l: isP ? 3 : 9,  r: isP ? 9 : 3 },  // แถว F
              { l: isP ? 3 : 9,  r: isP ? 9 : 3 },  // แถว G
              { l: isP ? 0 : 5,  r: isP ? 5 : 0 },  // แถว H
              { l: isP ? 0 : 5,  r: isP ? 5 : 0 },  // แถว I
              { l: isP ? 0 : 4,  r: isP ? 4 : 0 },  // แถว J
              { l: isP ? 0 : 4,  r: isP ? 4 : 0 },  // แถว K
              { l: isP ? 0 : 4,  r: isP ? 4 : 0 },  // แถว L
              { l: isP ? 0 : 3,  r: isP ? 3 : 0 },  // แถว M
              { l: isP ? 0 : 2,  r: isP ? 2 : 0 },  // แถว N
              { l: isP ? 0 : 1,  r: isP ? 1 : 0 },  // แถว O
              { l: isP ? 0 : 1,  r: isP ? 1 : 0 },  // แถว P
              { l: 0, r: 0 },                       // แถว Q (กว้างสุด เต็มแถว)
              { l: isP ? 0 : 1,  r: isP ? 1 : 0 },  // แถว R
              { l: isP ? 0 : 2,  r: isP ? 2 : 0 },  // แถว S
              { l: isP ? 0 : 3,  r: isP ? 3 : 0 },  // แถว T
              { l: isP ? 8 : 5,  r: isP ? 5 : 8 }   // แถว U (แถวสุดท้ายเว้าทั้งสองข้าง)
          ];
      }
    // 🏟️ 🎯 กฎสำหรับโซน G และ O (แฝดซ้ายขวา ทรงบันไดไล่ระดับ ยอด 256 ที่นั่ง)
        else if (["G", "O"].includes(name)) {
            isFixedLayout = true;
            rowLetters = "ABCDEFGHIJKLMNOPQRST".split(""); // ลึก 20 แถว (A-T)
            maxCol = 20; // ฐานกว้างสุด 20 ที่นั่ง
            
            const isO = name === "O"; // เช็คว่าเป็นโซน O หรือไม่ เพื่อพลิกเป็นกระจกเงา

            matrix = [
                { l: isO ? 0 : 17, r: isO ? 17 : 0 }, // แถว 1 (A): 3 ที่นั่ง
                { l: isO ? 0 : 16, r: isO ? 16 : 0 }, // แถว 2 (B): 4 ที่นั่ง
                { l: isO ? 0 : 16, r: isO ? 16 : 0 }, // แถว 3 (C): 4 ที่นั่ง
                { l: isO ? 0 : 15, r: isO ? 15 : 0 }, // แถว 4 (D): 5 ที่นั่ง
                { l: isO ? 0 : 15, r: isO ? 15 : 0 }, // แถว 5 (E): 5 ที่นั่ง
                { l: isO ? 0 : 15, r: isO ? 15 : 0 }, // แถว 6 (F): 5 ที่นั่ง
                { l: isO ? 0 : 15, r: isO ? 15 : 0 }, // แถว 7 (G): 5 ที่นั่ง
                { l: isO ? 0 : 5,  r: isO ? 5 : 0 },  // แถว 8 (H): 15 ที่นั่ง
                { l: isO ? 0 : 5,  r: isO ? 5 : 0 },  // แถว 9 (I): 15 ที่นั่ง
                { l: isO ? 0 : 4,  r: isO ? 4 : 0 },  // แถว 10 (J): 16 ที่นั่ง
                { l: isO ? 0 : 4,  r: isO ? 4 : 0 },  // แถว 11 (K): 16 ที่นั่ง
                { l: isO ? 0 : 4,  r: isO ? 4 : 0 },  // แถว 12 (L): 16 ที่นั่ง
                { l: isO ? 0 : 3,  r: isO ? 3 : 0 },  // แถว 13 (M): 17 ที่นั่ง
                { l: isO ? 0 : 3,  r: isO ? 3 : 0 },  // แถว 14 (N): 17 ที่นั่ง
                { l: isO ? 0 : 2,  r: isO ? 2 : 0 },  // แถว 15 (O): 18 ที่นั่ง
                { l: isO ? 0 : 2,  r: isO ? 2 : 0 },  // แถว 16 (P): 18 ที่นั่ง
                { l: isO ? 0 : 1,  r: isO ? 1 : 0 },  // แถว 17 (Q): 19 ที่นั่ง
                { l: isO ? 0 : 1,  r: isO ? 1 : 0 },  // แถว 18 (R): 19 ที่นั่ง
                { l: isO ? 0 : 1,  r: isO ? 1 : 0 },  // แถว 19 (S): 19 ที่นั่ง
                { l: 0, r: 0 }                        // แถว 20 (T): 20 ที่นั่งเต็ม
            ];
        }
    // 🏟️ 🎯 กฎสำหรับโซน H และ N (แฝดซ้ายขวา ทรงบันไดลึก 21 แถว ยอด 258 ที่นั่ง)
        else if (["H", "N"].includes(name)) {
            isFixedLayout = true;
            rowLetters = "ABCDEFGHIJKLMNOPQRSTU".split(""); // ลึก 21 แถว (A-U)
            maxCol = 19; // ฐานกว้างสุด 19 ที่นั่ง
            
            const isN = name === "N"; // เช็คว่าเป็นโซน N หรือไม่ เพื่อพลิกเป็นกระจกเงา

            matrix = [
                { l: isN ? 16 : 0, r: isN ? 0 : 16 }, // แถว A: 3 ที่นั่ง (H ชิดซ้าย, N ชิดขวา)
                { l: isN ? 15 : 0, r: isN ? 0 : 15 }, // แถว B: 4 ที่นั่ง
                { l: isN ? 15 : 0, r: isN ? 0 : 15 }, // แถว C: 4 ที่นั่ง
                { l: isN ? 14 : 0, r: isN ? 0 : 14 }, // แถว D: 5 ที่นั่ง
                { l: isN ? 14 : 0, r: isN ? 0 : 14 }, // แถว E: 5 ที่นั่ง
                { l: isN ? 14 : 0, r: isN ? 0 : 14 }, // แถว F: 5 ที่นั่ง
                { l: isN ? 14 : 0, r: isN ? 0 : 14 }, // แถว G: 5 ที่นั่ง
                { l: isN ? 6 : 0,  r: isN ? 0 : 6 },  // แถว H: 13 ที่นั่ง
                { l: isN ? 6 : 0,  r: isN ? 0 : 6 },  // แถว I: 13 ที่นั่ง
                { l: isN ? 5 : 0,  r: isN ? 0 : 5 },  // แถว J: 14 ที่นั่ง
                { l: isN ? 5 : 0,  r: isN ? 0 : 5 },  // แถว K: 14 ที่นั่ง
                { l: isN ? 4 : 0,  r: isN ? 0 : 4 },  // แถว L: 15 ที่นั่ง
                { l: isN ? 3 : 0,  r: isN ? 0 : 3 },  // แถว M: 16 ที่นั่ง
                { l: isN ? 3 : 0,  r: isN ? 0 : 3 },  // แถว N: 16 ที่นั่ง
                { l: isN ? 2 : 0,  r: isN ? 0 : 2 },  // แถว O: 17 ที่นั่ง
                { l: isN ? 2 : 0,  r: isN ? 0 : 2 },  // แถว P: 17 ที่นั่ง
                { l: isN ? 1 : 0,  r: isN ? 0 : 1 },  // แถว Q: 18 ที่นั่ง
                { l: isN ? 1 : 0,  r: isN ? 0 : 1 },  // แถว R: 18 ที่นั่ง
                { l: isN ? 1 : 0,  r: isN ? 0 : 1 },  // แถว S: 18 ที่นั่ง
                { l: 0, r: 0 },                       // แถว T: 19 ที่นั่ง
                { l: 0, r: 0 }                        // แถว U: 19 ที่นั่ง
            ];
        }
        // 🏟️ 🎯 กฎสำหรับโซน I และ M (แฝดซ้ายขวา ทรงปาดเว้า ยอด 276 ที่นั่ง)
        else if (["I", "M"].includes(name)) {
            isFixedLayout = true;
            rowLetters = "ABCDEFGHIJKLMNOPQRSTU".split(""); // ลึก 21 แถว (A-U)
            maxCol = 20; // ฐานกว้างสุด 20 ที่นั่ง

            const isM = name === "M"; // เช็คว่าเป็นโซน M หรือไม่ เพื่อพลิกรูปทรงเป็นกระจกเงา

            matrix = [
                { l: isM ? 0 : 17, r: isM ? 17 : 0 }, // แถว A: 3 ที่นั่ง
                { l: isM ? 0 : 16, r: isM ? 16 : 0 }, // แถว B: 4 ที่นั่ง
                { l: isM ? 0 : 16, r: isM ? 16 : 0 }, // แถว C: 4 ที่นั่ง
                { l: isM ? 0 : 15, r: isM ? 15 : 0 }, // แถว D: 5 ที่นั่ง
                { l: isM ? 0 : 15, r: isM ? 15 : 0 }, // แถว E: 5 ที่นั่ง
                { l: isM ? 0 : 15, r: isM ? 15 : 0 }, // แถว F: 5 ที่นั่ง
                { l: isM ? 0 : 15, r: isM ? 15 : 0 }, // แถว G: 5 ที่นั่ง
                { l: isM ? 0 : 5,  r: isM ? 5 : 0 },  // แถว H: 15 ที่นั่ง
                { l: isM ? 0 : 5,  r: isM ? 5 : 0 },  // แถว I: 15 ที่นั่ง
                { l: isM ? 0 : 4,  r: isM ? 4 : 0 },  // แถว J: 16 ที่นั่ง
                { l: isM ? 0 : 4,  r: isM ? 4 : 0 },  // แถว K: 16 ที่นั่ง
                { l: isM ? 0 : 4,  r: isM ? 4 : 0 },  // แถว L: 16 ที่นั่ง
                { l: isM ? 0 : 3,  r: isM ? 3 : 0 },  // แถว M: 17 ที่นั่ง
                { l: isM ? 0 : 3,  r: isM ? 3 : 0 },  // แถว N: 17 ที่นั่ง
                { l: isM ? 0 : 2,  r: isM ? 2 : 0 },  // แถว O: 18 ที่นั่ง
                { l: isM ? 0 : 2,  r: isM ? 2 : 0 },  // แถว P: 18 ที่นั่ง
                { l: isM ? 0 : 1,  r: isM ? 1 : 0 },  // แถว Q: 19 ที่นั่ง
                { l: isM ? 0 : 1,  r: isM ? 1 : 0 },  // แถว R: 19 ที่นั่ง
                { l: isM ? 0 : 1,  r: isM ? 1 : 0 },  // แถว S: 19 ที่นั่ง
                { l: 0,  r: 0 },                      // แถว T: 20 ที่นั่ง
                { l: 0,  r: 0 }                       // แถว U: 20 ที่นั่ง
            ];
        }
    // 🏟️ 🎯 กฎสำหรับโซน J และ L (แฝดซ้ายขวา ลึก 23 แถว ยอด 304 ที่นั่ง)
        else if (["J", "L"].includes(name)) {
            isFixedLayout = true;
            rowLetters = "ABCDEFGHIJKLMNOPQRSTUVW".split(""); // ลึก 23 แถว (A-W)
            maxCol = 20; // ฐานกว้างสุด 20 ที่นั่ง

            const isL = name === "L"; // เช็คว่าเป็นโซน L หรือไม่ เพื่อพลิกรูปทรงเป็นกระจกเงา

            matrix = [
                { l: isL ? 17 : 0, r: isL ? 0 : 17 }, // แถว 1 (A): 3 ที่นั่ง
                { l: isL ? 17 : 0, r: isL ? 0 : 17 }, // แถว 2 (B): 3 ที่นั่ง
                { l: isL ? 16 : 0, r: isL ? 0 : 16 }, // แถว 3 (C): 4 ที่นั่ง
                { l: isL ? 16 : 0, r: isL ? 0 : 16 }, // แถว 4 (D): 4 ที่นั่ง
                { l: isL ? 16 : 0, r: isL ? 0 : 16 }, // แถว 5 (E): 4 ที่นั่ง
                { l: isL ? 5 : 0,  r: isL ? 0 : 5 },  // แถว 6 (F): 15 ที่นั่ง
                { l: isL ? 5 : 0,  r: isL ? 0 : 5 },  // แถว 7 (G): 15 ที่นั่ง
                { l: isL ? 5 : 0,  r: isL ? 0 : 5 },  // แถว 8 (H): 15 ที่นั่ง
                { l: isL ? 4 : 0,  r: isL ? 0 : 4 },  // แถว 9 (I): 16 ที่นั่ง
                { l: isL ? 4 : 0,  r: isL ? 0 : 4 },  // แถว 10 (J): 16 ที่นั่ง
                { l: isL ? 3 : 0,  r: isL ? 0 : 3 },  // แถว 11 (K): 17 ที่นั่ง
                { l: isL ? 3 : 0,  r: isL ? 0 : 3 },  // แถว 12 (L): 17 ที่นั่ง
                { l: isL ? 2 : 0,  r: isL ? 0 : 2 },  // แถว 13 (M): 18 ที่นั่ง
                { l: isL ? 2 : 0,  r: isL ? 0 : 2 },  // แถว 14 (N): 18 ที่นั่ง
                { l: isL ? 1 : 0,  r: isL ? 0 : 1 },  // แถว 15 (O): 19 ที่นั่ง
                { l: isL ? 1 : 0,  r: isL ? 0 : 1 },  // แถว 16 (P): 19 ที่นั่ง
                { l: isL ? 1 : 0,  r: isL ? 0 : 1 },  // แถว 17 (Q): 19 ที่นั่ง
                { l: 0, r: 0 },                       // แถว 18 (R): 20 ที่นั่ง (เต็มแถว)
                { l: isL ? 11 : 0, r: isL ? 0 : 11 }, // แถว 19 (S): 9 ที่นั่ง (แหว่งลึก)
                { l: isL ? 7 : 0,  r: isL ? 0 : 7 },  // แถว 20 (T): 13 ที่นั่ง
                { l: isL ? 7 : 0,  r: isL ? 0 : 7 },  // แถว 21 (U): 13 ที่นั่ง
                { l: isL ? 7 : 0,  r: isL ? 0 : 7 },  // แถว 22 (V): 13 ที่นั่ง
                { l: isL ? 6 : 0,  r: isL ? 0 : 6 }   // แถว 23 (W): 14 ที่นั่ง
            ];
        }
        // 🏟️ 🎯 กฎสำหรับโซน K (โซนตรงกลาง ยอด 216 ที่นั่ง)
        else if (name === "K") {
            isFixedLayout = true;
            rowLetters = ["AA", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q"];
            maxCol = 14; // ฐานกว้างสุด 14 ที่นั่ง (ที่แถว Q)
            matrix = [
                { l: 2, r: 2 }, // แถว AA: 10 ที่นั่ง
                { l: 1, r: 1 }, // แถว A: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว B: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว C: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว D: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว E: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว F: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว G: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว H: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว I: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว J: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว K: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว L: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว M: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว N: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว O: 12 ที่นั่ง
                { l: 1, r: 1 }, // แถว P: 12 ที่นั่ง
                { l: 0, r: 0 }  // แถว Q: 14 ที่นั่ง (ฐานเต็ม)
            ];
        }
    else if (["SF", "SJ"].includes(name)) matrix = [{ l: 4, r: 4 }, { l: 2, r: 2 }, { l: 0, r: 0 }];
    else if (name === "A7") matrix = [{ l: 0, r: 0 }, { l: 0, r: 0 }, { l: 2, r: 2 }, { l: 4, r: 4 }];
    else if (["B", "C", "D", "E", "T", "S", "R", "Q", "LTL", "LTR", "UTL", "UTR"].some(n => name === n || name.startsWith(n))) matrix = [{l:2, r:2}, {l:0, r:0}];
    
    // 🏟️ 🎯 กฎสำหรับโซน LM1 หรือ ZONE 1 (ศาลาดนตรีสุริยเทพ ฝั่งซ้าย)
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
    // 🏟️ 🎯 กฎสำหรับโซน LM2 หรือ ZONE 2 (ศาลาดนตรีสุริยเทพ โซนตรงกลาง)
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
    // 🏟️ 🎯 กฎสำหรับโซน LM3 หรือ ZONE 3 (ศาลาดนตรีสุริยเทพ ฝั่งขวา)
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
    // 🏟️ 🎯 กฎสำหรับโซน LM4 หรือ ZONE 4 (ศาลาดนตรีสุริยเทพ ฝั่งซ้ายแถวหลัง)
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
    // 🏟️ 🎯 กฎสำหรับโซน LM5 หรือ ZONE 5 (ศาลาดนตรีสุริยเทพ โซนตรงกลางแถวหลัง)
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
    // 🏟️ 🎯 กฎสำหรับโซน LM6 หรือ ZONE 6 (ศาลาดนตรีสุริยเทพ ฝั่งขวาแถวหลัง)
    else if (["ZONE 6", "ZONE6"].includes(name)) {
        isFixedLayout = true;
        // เริ่มแถว M จนถึง V (ตามรูปแปลน)
        rowLetters = ["M", "N", "O", "P", "Q", "R", "S", "T", "U", "V"];
        maxCol = 16; // ฐานกว้างสุด 16 ช่อง
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
    // 🏟️ 🎯 กฎสำหรับโซน UM1 หรือ ZONE 7 (ศาลาดนตรีสุริยเทพ ชั้น 2 ฝั่งซ้าย)
    else if (["ZONE 7", "ZONE7"].includes(name)) {
        isFixedLayout = true;
        // เริ่มแถว AA ถึง HH (อักษรคู่ตามแปลน)
        rowLetters = ["AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH"];
        maxCol = 11; // ฐานกว้าง 11 ช่องพอดีเป๊ะ
        matrix = [
            { l: 0, r: 0, stagger: true }, // แถว AA: 11 ที่นั่ง (01-11)
            { l: 0, r: 0, stagger: true }, // แถว BB: 11 ที่นั่ง (01-11)
            { l: 0, r: 0, stagger: true }, // แถว CC: 11 ที่นั่ง (01-11)
            { l: 0, r: 0, stagger: true }, // แถว DD: 11 ที่นั่ง (01-11)
            { l: 0, r: 0, stagger: true }, // แถว EE: 11 ที่นั่ง (01-11)
            { l: 0, r: 0, stagger: true }, // แถว FF: 11 ที่นั่ง (01-11)
            { l: 0, r: 0, stagger: true }, // แถว GG: 11 ที่นั่ง (01-11)
            { l: 0, r: 0, stagger: true }  // แถว HH: 11 ที่นั่ง (01-11)
        ];
    }
    // 🏟️ 🎯 กฎสำหรับโซน UM2 หรือ ZONE 8 (ศาลาดนตรีสุริยเทพ ชั้น 2 โซนตรงกลาง)
    else if (["ZONE 8", "ZONE8"].includes(name)) {
        isFixedLayout = true;
        // เริ่มแถว AA ถึง HH
        rowLetters = ["AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH"];
        maxCol = 16; // ฐานกว้างสุดที่ 16 ช่อง
        matrix = [
            { l: 0, r: 0, start: 12, stagger: true }, // แถว AA: 16 ที่นั่ง (12-27)
            { l: 1, r: 0, start: 12, stagger: true }, // แถว BB: 15 ที่นั่ง (12-26) หดซ้าย 1 ช่องเพื่อให้สลับฟันปลา
            { l: 0, r: 0, start: 12, stagger: true }, // แถว CC: 16 ที่นั่ง (12-27)
            { l: 1, r: 0, start: 12, stagger: true }, // แถว DD: 15 ที่นั่ง (12-26)
            { l: 0, r: 0, start: 12, stagger: true }, // แถว EE: 16 ที่นั่ง (12-27)
            { l: 1, r: 0, start: 12, stagger: true }, // แถว FF: 15 ที่นั่ง (12-26)
            { l: 0, r: 0, start: 12, stagger: true }, // แถว GG: 16 ที่นั่ง (12-27)
            { l: 1, r: 0, start: 12, stagger: true }  // แถว HH: 15 ที่นั่ง (12-26)
        ];
    }
    // 🏟️ 🎯 กฎสำหรับโซน UM3 หรือ ZONE 9 (ศาลาดนตรีสุริยเทพ ชั้น 2 ฝั่งขวา)
    else if (["ZONE 9", "ZONE9"].includes(name)) {
        isFixedLayout = true;
        // เริ่มแถว AA ถึง HH
        rowLetters = ["AA", "BB", "CC", "DD", "EE", "FF", "GG", "HH"];
        maxCol = 11; // 🌟 ปรับฐานเหลือ 11 ช่อง ให้เก้าอี้เรียงตรงกันเป๊ะ
        matrix = [
            { l: 0, r: 0, start: 28 }, // แถว AA: 11 ที่นั่ง (28-38)
            { l: 0, r: 0, start: 27 }, // แถว BB: 11 ที่นั่ง (27-37)
            { l: 0, r: 0, start: 28 }, // แถว CC: 11 ที่นั่ง (28-38)
            { l: 0, r: 0, start: 27 }, // แถว DD: 11 ที่นั่ง (27-37)
            { l: 0, r: 0, start: 28 }, // แถว EE: 11 ที่นั่ง (28-38)
            { l: 0, r: 0, start: 27 }, // แถว FF: 11 ที่นั่ง (27-37)
            { l: 0, r: 0, start: 28 }, // แถว GG: 11 ที่นั่ง (28-38)
            { l: 0, r: 0, start: 27 }  // แถว HH: 11 ที่นั่ง (27-37)
        ];
    }

    // 🔥 พระเอกอยู่ตรงนี้: จัดการโครงสร้าง Fixed และการซ่อนเก้าอี้ 🔥
    let remaining = totalSeats;
    let targetQuantity = Infinity; 

    if (isFixedLayout) {
        let calcTotal = 0;
        for(let i = 0; i < rowLetters.length; i++) {
            const conf = matrix[i] || (matrix.length > 0 ? matrix[matrix.length - 1] : { l: 0, r: 0 });
            // 🌟 คำนวณยอดที่นั่ง โดยหักลบ "ทางเดิน (gapAfter)" ออกไปเพื่อความแม่นยำ
            const gapCount = conf.gapAfter ? 1 : 0;
            calcTotal += (maxCol - (conf.l || 0) - (conf.r || 0) - gapCount);
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
        // 🌟 1. พระเอกขี่ม้าขาว: แก้ปัญหาแถวทะลุ Z ให้เป็น A2, B2, C2...
        const baseLetter = rowLetters[rowIndex % rowLetters.length];
        const cycle = Math.floor(rowIndex / rowLetters.length);
        const rowLetter = cycle > 0 ? `${baseLetter}${cycle + 1}` : baseLetter;

        const conf = matrix[rowIndex] || (matrix.length > 0 ? matrix[matrix.length - 1] : { l: 0, r: 0 });
        
        const gapCount = conf.gapAfter ? 1 : 0;
        const lBlanksToRender = conf.l || 0;
        const rBlanksToRender = conf.r || 0;
        
        // 🌟 หักลบช่องทางเดินออกจากโควต้าเก้าอี้จริง (ใช้ค่า l, r ตั้งต้นในการคำนวณ)
        const maxReal = maxCol - lBlanksToRender - rBlanksToRender - gapCount;
        const realToPlace = Math.min(remaining, maxReal);
        
        // 🌟 ถ้าเปิดโหมด stagger เราจะไม่วาดกล่องใสๆ ด้านซ้าย เพื่อให้ Flexbox มันจับจัดกลางแบบเยื้องฟันปลา
        const actualLBlanks = conf.stagger ? 0 : lBlanksToRender;
        for (let i = 0; i < actualLBlanks; i++) {
           newSeats.push({ id: `BL_${rowIndex}_${i}`, row: rowLetter, num: "", isHidden: true });
        }
        
        for (let i = 0; i < realToPlace; i++) {
           seatCounter++; 
           
           const cleanName = name.trim();
           
           // 🌟 เติม "SJ" และ "SI" เข้าไปในแก๊งโซนปีกขวาด้วยครับ
           const isRightSideZone = ["SK", "SL", "SM", "SN", "SJ", "SI", "J", "L", "K", "M", "N","O", "P", "Q", "R", "S", "T", ].includes(cleanName);
           
           // 🌟 อัปเดตให้เช็คว่าถ้ามี conf.start ให้ใช้เลขนั้น แต่ถ้าไม่มีให้ใช้ startNum ปกติ
           // (กรณีที่เป็นฝั่งขวา ให้วิ่งถอยหลังเหมือนเดิม)
           const seatNum = isRightSideZone 
               ? (realToPlace - i) 
               : (conf.start !== undefined ? conf.start + i : startNum + i);
           
           const shouldHide = isFixedLayout && (seatCounter > targetQuantity);

           newSeats.push({ 
               id: `SEAT_${rowIndex}_${rowLetter}_${seatNum}`, 
               row: rowLetter, 
               num: seatNum.toString().padStart(2, '0'), 
               isHidden: shouldHide 
           });

           // 🌟 สร้างช่องโหว่ทางเดิน (Aisle Gap) หากตรงตามพิกัดที่ระบุไว้! 🌟
           if (conf.gapAfter === i + 1) {
               newSeats.push({ id: `GAP_${rowIndex}`, row: rowLetter, num: "", isHidden: true });
           }
        }        
        
        // 🌟 ถ้าเปิดโหมด stagger เราจะไม่วาดกล่องใสๆ ด้านขวาด้วย เพื่อให้มันเป็นฟันปลาสมบูรณ์แบบ
        let remainingBlanks = maxCol - lBlanksToRender - realToPlace - gapCount;
        
        // ทริคสลับฟันปลา: ลดกล่องขวาลง 1 อันในแถวคี่ เพื่อดันให้มันเยื้อง
        if (conf.stagger && rowIndex % 2 !== 0 && remainingBlanks > 0) {
            remainingBlanks -= 1;
        }

        const actualRBlanks = conf.stagger ? 0 : remainingBlanks;
        for (let i = 0; i < actualRBlanks; i++) {
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
    // ✨ A5: ปาดมุมล่างซ้าย ✨
    // วาดจาก: บนซ้าย -> บนขวา -> ล่างขวา -> ล่างซ้าย (ก่อนถึงมุม) -> หักเฉียงขึ้นไปหาจุดเริ่มต้นมุมซ้าย
    {i:4, d:"M 160 610 L 490 610 L 490 770 L 220 770 L 160 710 Z", cx:325, cy:690},
    
    // ✨ A6: ปาดมุมล่างขวา ✨
    // วาดจาก: บนซ้าย -> บนขวา -> ล่างขวา (ก่อนถึงมุม) -> หักเฉียงไปซ้าย -> ซ้ายสุด
    {i:5, d:"M 510 610 L 840 610 L 840 710 L 780 770 L 510 770 Z", cx:675, cy:690},
    {i:6, d:"M 320 790 L 680 790 L 680 850 L 620 920 L 380 920 L 320 850 Z", cx:500, cy:855} 
  ];
  const imMediumMap: ZoneMapData[] = [
    // 🟫 โซนพื้นตรงกลาง (A1 - A7)
    {i:0, x:240, y:220, w:250, h:180, c:"#9E9E9E"},
    {i:1, x:510, y:220, w:250, h:180, c:"#9E9E9E"}, 
    {i:2, x:240, y:420, w:250, h:160, c:"#9E9E9E"}, 
    {i:3, x:510, y:420, w:250, h:160, c:"#9E9E9E"}, 
    {i:4, d:"M 240 600 L 490 600 L 490 780 L 265 780 L 240 740 Z", cx:365, cy:690, c:"#9E9E9E"},
    {i:5, d:"M 510 600 L 760 600 L 760 740 L 735 780 L 510 780 Z", cx:635, cy:690, c:"#9E9E9E"},
    {i:6, d:"M 320 800 L 680 800 L 680 860 L 620 900 L 380 900 L 320 860 Z", cx:500, cy:850, c:"#9E9E9E"},

    // 🟦 โซนอัฒจันทร์ฝั่งซ้าย (SB - SG) 
    {i:7, x:90, y:120, w:110, h:150, c:"#4DD0E1"}, // SB
    {i:8, x:90, y:290, w:110, h:150, c:"#4DD0E1"}, // SC
    {i:9, x:90, y:460, w:110, h:150, c:"#4DD0E1"}, // SD
    {i:10, d:"M 90 630 L 200 630 L 200 730 L 230 790 L 130 840 L 90 760 Z", cx:150, cy:720, c:"#4DD0E1"}, // SE
    {i:11, d:"M 140 855 L 235 805 L 265 865 L 312 900 L 257 976 L 170 930 Z", cx:225, cy:890, c:"#4DD0E1"}, // SF
    {i:12, d:"M 270 985 L 325 905 L 375 930 L 415 930 L 415 1030 L 340 1030 Z", cx:350, cy:960, c:"#4DD0E1"}, // SG
   
    // 🟦 โซนอัฒจันทร์ตรงกลางด้านหลัง (SH) 
    {i:13, d:"M 430 1030 L 430 930 L 570 930 L 570 1030 Z", cx:500, cy:975, c:"#4DD0E1"}, // SH 

    // 🟦 โซนอัฒจันทร์ฝั่งขวา (SI - SN) 
    {i:14, d:"M 730 985 L 675 905 L 625 930 L 585 930 L 585 1030 L 660 1030 Z", cx:650, cy:960, c:"#4DD0E1"}, // SI
    {i:15, d:"M 860 855 L 765 805 L 735 865 L 688 900 L 743 976 L 830 930 Z", cx:775, cy:890, c:"#4DD0E1"}, // SJ
    {i:16, d:"M 910 630 L 800 630 L 800 730 L 770 790 L 870 840 L 910 760 Z", cx:850, cy:720, c:"#4DD0E1"}, // SK
    {i:17, x:800, y:460, w:110, h:150, c:"#4DD0E1"}, // SL
    {i:18, x:800, y:290, w:110, h:150, c:"#4DD0E1"}, // SM
    {i:19, x:800, y:120, w:110, h:150, c:"#4DD0E1"}, // SN

  ];
  const imLargeMap: ZoneMapData[] = [
    // 🟫 โซนพื้นตรงกลาง (A1 - A7)
    {i:0, x:240, y:220, w:250, h:180, c:"#9E9E9E"},
    {i:1, x:510, y:220, w:250, h:180, c:"#9E9E9E"}, 
    {i:2, x:240, y:420, w:250, h:160, c:"#9E9E9E"}, 
    {i:3, x:510, y:420, w:250, h:160, c:"#9E9E9E"}, 
    {i:4, d:"M 240 600 L 490 600 L 490 780 L 265 780 L 240 740 Z", cx:365, cy:690, c:"#9E9E9E"},
    {i:5, d:"M 510 600 L 760 600 L 760 740 L 735 780 L 510 780 Z", cx:635, cy:690, c:"#9E9E9E"},
    {i:6, d:"M 320 800 L 680 800 L 680 860 L 620 900 L 380 900 L 320 860 Z", cx:500, cy:850, c:"#9E9E9E"},

    // 🟦 โซนอัฒจันทร์ฝั่งซ้าย (SB - SG) 
    {i:7, x:90, y:120, w:110, h:150, c:"#4DD0E1"}, // SB
    {i:8, x:90, y:290, w:110, h:150, c:"#4DD0E1"}, // SC
    {i:9, x:90, y:460, w:110, h:150, c:"#4DD0E1"}, // SD
    {i:10, d:"M 90 630 L 200 630 L 200 730 L 230 790 L 130 840 L 90 760 Z", cx:150, cy:720, c:"#4DD0E1"}, // SE
    {i:11, d:"M 140 855 L 235 805 L 265 865 L 312 900 L 257 976 L 170 930 Z", cx:225, cy:890, c:"#4DD0E1"}, // SF
    {i:12, d:"M 270 985 L 325 905 L 375 930 L 415 930 L 415 1030 L 340 1030 Z", cx:350, cy:980, c:"#4DD0E1"}, // SG
   
    // 🟦 โซนอัฒจันทร์ตรงกลางด้านหลัง (SH) 
    {i:13, d:"M 430 1030 L 430 930 L 570 930 L 570 1030 Z", cx:500, cy:980, c:"#4DD0E1"}, // SH 

    // 🟦 โซนอัฒจันทร์ฝั่งขวา (SI - SN) 
    {i:14, d:"M 730 985 L 675 905 L 625 930 L 585 930 L 585 1030 L 660 1030 Z", cx:650, cy:980, c:"#4DD0E1"}, // SI
    {i:15, d:"M 860 855 L 765 805 L 735 865 L 688 900 L 743 976 L 830 930 Z", cx:775, cy:890, c:"#4DD0E1"}, // SJ
    {i:16, d:"M 910 630 L 800 630 L 800 730 L 770 790 L 870 840 L 910 760 Z", cx:850, cy:720, c:"#4DD0E1"}, // SK
    {i:17, x:800, y:460, w:110, h:150, c:"#4DD0E1"}, // SL
    {i:18, x:800, y:290, w:110, h:150, c:"#4DD0E1"}, // SM
    {i:19, x:800, y:120, w:110, h:150, c:"#4DD0E1"}, // SN

    // 🟨 ✨ แก้เฉพาะวงนอกสุด (B - T) ให้กางและแบนเหมือนรูปจริง ✨
    // ฝั่งซ้าย (B-E) ขยับชิดขอบซ้าย
    {i:20, d:"M -170 120 L -70 120 L -70 155 L -45 155 L -45 135 L 45 135 L 45 245 L -45 245 L -45 225 L -70 225 L -70 260 L -170 260 Z", cx:-120, cy:190, c:"#FDD835"}, // B
    {i:21, d:"M -170 290 L -70 290 L -70 325 L -45 325 L -45 305 L 45 305 L 45 415 L -45 415 L -45 395 L -70 395 L -70 430 L -170 430 Z", cx:-120, cy:360, c:"#FDD835"}, // C  
    {i:22, d:"M -170 460 L -70 460 L -70 495 L -45 495 L -45 475 L 45 475 L 45 585 L -45 585 L -45 565 L -70 565 L -70 600 L -170 600 Z", cx:-120, cy:530, c:"#FDD835"}, // D
    {i:23, d:"M -170 630 L -70 630 L -70 665 L -45 665 L -45 645 L 45 645 L 45 720 L -45 741 L -45 721 L -70 721 L -70 747 L -170 770 Z", cx:-120, cy:700, c:"#FDD835"}, // E

    // โค้งล่าง (F-P) กางออกกว้างและฐานแบน
    {i:24, d:"M -127 790 L -37 770 L 43 760 L 53 780 L -17 810 L 8 860 L -97 920 L -127 865 L -152 877 L -167 845 L -167 825 Z", cx:-57, cy:835, c:"#FDD835"}, // F
    {i:25, d:"M -20 1055 L 78 976 L 135 925 L 121 896 L 46 937 L 15 884 L -80 939 Z", cx:0, cy:960, c:"#FDD835"}, // G
    {i:26, d:"M -25 1095 L 94 997 L 148 945 L 180 969 L 126 1036 L 173 1075 L 88 1180 Z", cx:88, cy:1085, c:"#FDD835"}, // H
    {i:27, d:"M 220 1280 L 275 1141 L 315 1065 L 280 1040 L 230 1121 L 180 1085 L 100 1195 Z", cx:192, cy:1170, c:"#FDD835"}, // I  
    {i: 28, d: "M 255 1305 L 270 1250 L 325 1140 L 325 1065 L 373 1065 L 373 1120 L 450 1120 L 450 1245 L 373 1245 L 373 1255 L 373 1260 L 393 1260 L 393 1305 Z", cx: 375, cy: 1195, c: "#FDD835"}, // J
    {i:29, x:460, y:1050, w:80, h:195, c:"#FDD835"}, // K (ฐานแบนราบและกว้างตรงกลาง)
    
    {i:30, d:"M 745 1305 L 730 1250 L 675 1140 L 675 1065 L 627 1065 L 627 1120 L 550 1120 L 550 1245 L 627 1245 L 627 1255 L 627 1260 L 607 1260 L 607 1305 Z", cx:625, cy:1195, c:"#FDD835"}, // L
    {i:31, d:"M 780 1280 L 725 1141 L 685 1065 L 720 1040 L 770 1121 L 820 1085 L 900 1195 Z", cx:808, cy:1170, c:"#FDD835"}, // M
    {i:32, d:"M 1025 1095 L 906 997 L 852 945 L 820 969 L 874 1036 L 827 1075 L 912 1180 Z", cx:912, cy:1085, c:"#FDD835"}, // N
    {i:33, d:"M 1020 1055 L 922 976 L 865 925 L 879 896 L 954 937 L 985 884 L 1080 939 Z", cx:987, cy:955, c:"#FDD835"}, // O
    {i:34, d:"M 1127 790 L 1037 770 L 957 760 L 947 780 L 1017 810 L 992 860 L 1097 920 L 1127 865 L 1152 877 L 1167 845 L 1167 825 Z", cx:1057, cy:835, c:"#FDD835"}, // P

    // ฝั่งขวา (Q-T) ขยับชิดขอบขวา
    {i:35, d:"M 1170 630 L 1070 630 L 1070 665 L 1045 665 L 1045 645 L 955 645 L 955 720 L 1045 741 L 1045 721 L 1070 721 L 1070 747 L 1170 770 Z", cx:1120, cy:700, c:"#FDD835"}, // Q
    {i:36, d:"M 1170 460 L 1070 460 L 1070 495 L 1045 495 L 1045 475 L 955 475 L 955 585 L 1045 585 L 1045 565 L 1070 565 L 1070 600 L 1170 600 Z", cx:1120, cy:530, c:"#FDD835"}, // R   
    {i:37, d:"M 1170 290 L 1070 290 L 1070 325 L 1045 325 L 1045 305 L 955 305 L 955 415 L 1045 415 L 1045 395 L 1070 395 L 1070 430 L 1170 430 Z", cx:1120, cy:360, c:"#FDD835"}, // S 
    {i:38, d:"M 1170 120 L 1070 120 L 1070 155 L 1045 155 L 1045 135 L 955 135 L 955 245 L 1045 245 L 1045 225 L 1070 225 L 1070 260 L 1170 260 Z", cx:1120, cy:190, c:"#FDD835"}, // T
  ];
  // ============================================================================
  // 📍 2. ศาลาดนตรีสุริยเทพ ม.รังสิต (Hall ID: 2)
  // ============================================================================
  const srSmallMap: ZoneMapData[] = [
    // 🟨 แถวหน้า (ZONE 1, 2, 3)
    { i: 0, d: "M 300 320 L 80 250 L 80 550 L 300 625 Z", cx: 190, cy: 450, c: "#00CFD6" }, // ZONE 1 (เฉียงซ้าย)
    { i: 1, x: 340, y: 320, w: 320, h: 310, c: "#4169E1" }, // ZONE 2 (ตรงกลาง)
    { i: 2, d: "M 700 320 L 920 250 L 920 550 L 700 625 Z", cx: 810, cy: 450, c: "#8A2BE2" } // ZONE 3 (เฉียงขวา)
  ];

  const srMediumMap: ZoneMapData[] = [
    ...srSmallMap, // ดึง ZONE 1-3 มาใช้
    // 🟦 แถวหลัง ชั้น 1 (ZONE 4, 5, 6)
    { i: 3, d: "M 300 700 L 80 655 L 80 955 L 300 1000 Z", cx: 190, cy: 815, c: "#00BFFF" }, // ZONE 4 (เฉียงหุบเข้า)
    { i: 4, x: 340, y: 700, w: 320, h: 240, c: "#6A5ACD" }, // ZONE 5 (ตรงกลาง)
    { i: 5, d: "M 700 700 L 920 655 L 920 955 L 700 1000 Z", cx: 810, cy: 815, c: "#BA55D3" } // ZONE 6 
  ];

  const srLargeMap: ZoneMapData[] = [
    ...srMediumMap, // ดึง ZONE 1-6 มาใช้
    // 🟪 ชั้น 2 (ZONE 7, 8, 9)
    { i: 6, d: "M 300 1200 L 80 1150 L 80 1400 L 300 1450 Z", cx: 190, cy: 1310, c: "#1E90FF" }, // ZONE 7 
    { i: 7,x: 340, y: 1200, w: 320, h: 255,  c: "#9400D3" }, // ZONE 8 
    { i: 8, d: "M 700 1200 L 920 1150 L 920 1400 L 700 1450 Z", cx: 810, cy: 1310, c: "#FF1493" }  // ZONE 9 
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
          <rect x="160" y="50" width="680" height="150" fill="#ffffff" rx="8" />
          <text x="500" y="145" fill="#000000" fontSize="56" fontWeight="900" textAnchor="middle" letterSpacing="10">STAGE</text>
          {renderMap(imSmallMap)}
        </svg>
      );
    }
    if (hallId === "1" && venueSize === "Medium") {
      return (
        <svg viewBox="0 0 1000 1200" className="w-full max-w-xl mx-auto max-h-[60vh] drop-shadow-2xl">
          <rect x="245" y="50" width="520" height="140" fill="#ffffff" rx="8" />
          <text x="510" y="140" fill="#000000" fontSize="64" fontWeight="900" textAnchor="middle" letterSpacing="15">STAGE</text>
          {renderMap(imMediumMap)}
        </svg>
      );
    }
    if (hallId === "1" && venueSize === "Large") {
      return (
        // 👇 เปลี่ยนจาก 1100 เป็น 1350 ให้ฐานตัว U กว้างขึ้น
        <svg viewBox="0 0 1000 1350" className="w-full max-w-2xl mx-auto max-h-[65vh] drop-shadow-2xl">
          <rect x="245" y="10" width="520" height="160" fill="#ffffff" rx="4" />
          <text x="500" y="110" fill="#000000" fontSize="48" fontWeight="900" textAnchor="middle" letterSpacing="5">STAGE</text>
          {renderMap(imLargeMap)}
        </svg>
      );
    }

    if (hallId === "2" && venueSize === "Small") {
      return (
        <svg viewBox="0 0 1000 850" className="w-full max-w-lg mx-auto max-h-[70vh] drop-shadow-2xl">
          <rect x="0" y="0" width="1025" height="200" fill="#ffffff" rx="12" />
          <text x="500" y="130" fill="#000000" fontSize="64" fontWeight="900" textAnchor="middle" letterSpacing="15">STAGE</text>
          {renderMap(srSmallMap)}
        </svg>
      );
    }
    if (hallId === "2" && venueSize === "Medium") {
      return (
        <svg viewBox="0 0 1000 1300" className="w-full max-w-xl mx-auto max-h-[80vh] drop-shadow-2xl">
          <rect x="0" y="0" width="1025" height="200" fill="#ffffff" rx="12" />
          <text x="500" y="130" fill="#000000" fontSize="64" fontWeight="900" textAnchor="middle" letterSpacing="15">STAGE</text>
          {renderMap(srMediumMap)}
        </svg>
      );
    }
    if (hallId === "2" && venueSize === "Large") {
      return (
        // ปรับ viewBox เป็น 1500 เผื่อพื้นที่ให้ชั้น 2 โชว์ได้เต็มที่ครับ
        <svg viewBox="0 0 1000 1500" className="w-full max-w-xl mx-auto max-h-[75vh] drop-shadow-2xl">
          <rect x="0" y="0" width="1000" height="200" fill="#ffffff" rx="12" />
          <text x="500" y="120" fill="#000000" fontSize="64" fontWeight="900" textAnchor="middle" letterSpacing="15">STAGE</text>
          {renderMap(srLargeMap)}
          
          {/* 🌟 เส้นประแบ่งชั้น และข้อความ 2 FLOOR ตรงกลาง 🌟 */}
          <g opacity="0.8">
            {/* เส้นประฝั่งซ้าย */}
            <line x1="120" y1="1080" x2="380" y2="1080" stroke="#ffffff" strokeWidth="4" strokeOpacity="0.5" strokeDasharray="8,8" />
            
            {/* ข้อความ 2 FLOOR */}
            <text x="500" y="1090" fill="#ffffff" fontSize="32" fontWeight="bold" textAnchor="middle" letterSpacing="4">2 FLOOR</text>
            
            {/* เส้นประฝั่งขวา */}
            <line x1="620" y1="1080" x2="880" y2="1080" stroke="#ffffff" strokeWidth="4" strokeOpacity="0.5" strokeDasharray="8,8" />
          </g>
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

          <div className="flex-1 flex items-start justify-center p-4 pt-0 md:pt-5 relative">
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

                {/* 🌟 จุดที่ปรับขนาดเก้าอี้ให้พอดีจอ (ไม่ล้น ไม่ต้องเลื่อน) 🌟 */}
                <div className="flex flex-col gap-1 md:gap-1.5 pb-20 w-full max-w-full px-2 md:px-8">
                  <div className="w-full mx-auto flex flex-col items-center">
                    {Array.from(new Set(previewGeneratedSeats.map(s => s.row))).map(row => (
                      <div key={row} className="flex items-center justify-between w-full mb-1 sm:mb-1.5">
                        
                        {/* 🌟 ตัวอักษรฝั่งซ้าย 🌟 */}
                        <span className="w-6 sm:w-10 text-slate-400 font-bold text-[9px] sm:text-xs md:text-sm text-right pr-2 sm:pr-4 shrink-0">{row}</span>
                        
                        {/* 🌟 ก้อนเก้าอี้ (ปรับให้ยืดหยุ่น หด/ขยาย ตามหน้าจออัตโนมัติ) 🌟 */}
                        <div className="flex items-center justify-center gap-[2px] sm:gap-1 flex-1">
                          {previewGeneratedSeats.filter(s => s.row === row).map(seat => (
                            <div key={seat.id} className={`w-full max-w-[18px] sm:max-w-[24px] md:max-w-[30px] aspect-square flex items-center justify-center shrink ${seat.isHidden ? 'opacity-0' : 'transition-transform hover:scale-110'}`}>
                              {!seat.isHidden && (
                                <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                                   <circle cx="50" cy="50" r="48" fill="#FFCC00" />
                                   <text x="50" y="55" fill="#000000" fontSize="38" fontWeight="900" textAnchor="middle" dominantBaseline="middle">{seat.num}</text>
                                </svg>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        {/* 🌟 ตัวอักษรฝั่งขวา 🌟 */}
                        <span className="w-6 sm:w-10 text-slate-400 font-bold text-[9px] sm:text-xs md:text-sm text-left pl-2 sm:pl-4 shrink-0">{row}</span>
                        
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