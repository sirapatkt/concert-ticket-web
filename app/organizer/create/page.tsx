"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  AlignLeft, Image as ImageIcon, 
  Trash2, Save, Ticket, ChevronDown,
  Map, Plus, Calendar, Clock, Grid3X3
} from "lucide-react";

// --- Constants & Types ---
const GRID_SIZES = {
  Small:  { label: "เล็ก (Small Hall)" },
  Medium: { label: "กลาง (Medium Hall)" },
  Large:  { label: "ใหญ่ (Grand Hall)" }
};

type VenueSize = keyof typeof GRID_SIZES; 

// ✅ 1. ชุดข้อมูลแผนผังที่นั่งอัตโนมัติ (เชื่อมลิงก์ Cloudinary เรียบร้อย)
const PREDEFINED_PLANS: Record<string, Record<VenueSize, string>> = {
  "1": { // อิมแพคอารีน่า
    "Small": "https://res.cloudinary.com/de7ml7aeb/image/upload/v1771491663/IM-small_dl59ai.jpg",
    "Medium": "/images/plans/MT-medium.jpg",
    "Large": "/images/plans/MT-big.jpg",
  },
  "2": { // มหิดลฮอล์
    "Small": "/images/plans/MT-small.jpg",
    "Medium": "/images/plans/MT-medium.jpg",
    "Large": "/images/plans/MT-big.jpg",
  },
  "3": { // เมืองไทยรัชดาลัย
    "Small": "https://res.cloudinary.com/de7ml7aeb/image/upload/v1771487600/MT-small_k9ktvy.jpg",
    "Medium": "https://res.cloudinary.com/de7ml7aeb/image/upload/v1771487591/MT-medium_tt4yyk.jpg",
    "Large": "https://res.cloudinary.com/de7ml7aeb/image/upload/v1771487582/MT-big_fofs8k.jpg",
  }
};

// ✅ 2. ชุดข้อมูลโซนและจำนวนที่นั่งอัตโนมัติ (อัปเดตตัวเลขตามรูปภาพเป๊ะๆ)
const PREDEFINED_ZONES: Record<string, Record<VenueSize, TicketTier[]>> = {
  "1": { // อิมแพคอารีน่า
    "Small": [
      { zoneName: "A1", price: 0, quantity: 500  },
      { zoneName: "A2", price: 0, quantity: 500 },
      { zoneName: "A3", price: 0, quantity: 500 },
      { zoneName: "A4", price: 0, quantity: 500 },
      { zoneName: "A5", price: 0, quantity: 500 },
      { zoneName: "A6", price: 0, quantity: 500 },
      { zoneName: "A7", price: 0, quantity: 500 },
    ],
    "Medium": [
      { zoneName: "A1", price: 0, quantity: 500  },
      { zoneName: "A2", price: 0, quantity: 500 },
      { zoneName: "A3", price: 0, quantity: 500 },
      { zoneName: "A4", price: 0, quantity: 500 },
      { zoneName: "A5", price: 0, quantity: 500 },
      { zoneName: "A6", price: 0, quantity: 500 },
      { zoneName: "A7", price: 0, quantity: 500 },
      { zoneName: "SB", price: 0, quantity: 160 },
      { zoneName: "SC", price: 0, quantity: 160 },
      { zoneName: "SD", price: 0, quantity: 160 },
      { zoneName: "SE", price: 0, quantity: 216 },
      { zoneName: "SF", price: 0, quantity: 160 },
      { zoneName: "SG", price: 0, quantity: 136 },
      { zoneName: "SH", price: 0, quantity: 152 },
      { zoneName: "SI", price: 0, quantity: 136 },
      { zoneName: "SJ", price: 0, quantity: 160 },
      { zoneName: "SK", price: 0, quantity: 216 },
      { zoneName: "SL", price: 0, quantity: 160 },
      { zoneName: "SM", price: 0, quantity: 160 },
      { zoneName: "SN", price: 0, quantity: 160 },
    ],
    "Large": [
      { zoneName: "A1", price: 0, quantity: 500  },
      { zoneName: "A2", price: 0, quantity: 500 },
      { zoneName: "A3", price: 0, quantity: 500 },
      { zoneName: "A4", price: 0, quantity: 500 },
      { zoneName: "A5", price: 0, quantity: 500 },
      { zoneName: "A6", price: 0, quantity: 500 },
      { zoneName: "A7", price: 0, quantity: 500 },
      { zoneName: "SB", price: 0, quantity: 160 },
      { zoneName: "SC", price: 0, quantity: 160 },
      { zoneName: "SD", price: 0, quantity: 160 },
      { zoneName: "SE", price: 0, quantity: 216 },
      { zoneName: "SF", price: 0, quantity: 160 },
      { zoneName: "SG", price: 0, quantity: 136 },
      { zoneName: "SH", price: 0, quantity: 152 },
      { zoneName: "SI", price: 0, quantity: 136 },
      { zoneName: "SJ", price: 0, quantity: 160 },
      { zoneName: "SK", price: 0, quantity: 216 },
      { zoneName: "SL", price: 0, quantity: 160 },
      { zoneName: "SM", price: 0, quantity: 160 },
      { zoneName: "SN", price: 0, quantity: 160 },
      { zoneName: "B ", price: 0, quantity: 151 },
      { zoneName: "C ", price: 0, quantity: 297 },
      { zoneName: "D", price: 0, quantity: 297 },
      { zoneName: "E", price: 0, quantity: 306 },
      { zoneName: "F", price: 0, quantity: 258 },
      { zoneName: "G", price: 0, quantity: 258 },
      { zoneName: "H", price: 0, quantity: 272 },
      { zoneName: "I", price: 0, quantity: 276 },
      { zoneName: "J", price: 0, quantity: 260 },
      { zoneName: "K", price: 0, quantity: 198 },
      { zoneName: "L", price: 0, quantity: 260 },
      { zoneName: "M", price: 0, quantity: 276 },
      { zoneName: "N", price: 0, quantity: 272 },
      { zoneName: "O", price: 0, quantity: 258 },
      { zoneName: "P", price: 0, quantity: 285 },
      { zoneName: "Q", price: 0, quantity: 306 },
      { zoneName: "R", price: 0, quantity: 297 },
      { zoneName: "S", price: 0, quantity: 297 },
      { zoneName: "T", price: 0, quantity: 151 },
    ]
  },
  "2": { // มหิดลฮอล์ (เผื่อไว้)
    "Small": [
      { zoneName: "LM1", price: 0, quantity: 79  },
      { zoneName: "LM2", price: 0, quantity: 128 },
      { zoneName: "LM3", price: 0, quantity: 79 },
      { zoneName: "LM4", price: 0, quantity: 61 },
      { zoneName: "LM5", price: 0, quantity: 128 },
      { zoneName: "LM6", price: 0, quantity: 61 },
      { zoneName: "UM1", price: 0, quantity: 48 },
      { zoneName: "UM2", price: 0, quantity: 120 },
      { zoneName: "UM3", price: 0, quantity: 48 },
      { zoneName: "UM4", price: 0, quantity: 17 },
      { zoneName: "UM5", price: 0, quantity: 57 },
      { zoneName: "UM6", price: 0, quantity: 17 },
      { zoneName: "LTL", price: 0, quantity: 34 },
      { zoneName: "UTL", price: 0, quantity: 71 },
      { zoneName: "LTR", price: 0, quantity: 34 },
      { zoneName: "UTR", price: 0, quantity: 71 },
    ],
    "Medium": [
      { zoneName: "LM1", price: 0, quantity: 79  },
      { zoneName: "LM2", price: 0, quantity: 128 },
      { zoneName: "LM3", price: 0, quantity: 79 },
      { zoneName: "LM4", price: 0, quantity: 61 },
      { zoneName: "LM5", price: 0, quantity: 128 },
      { zoneName: "LM6", price: 0, quantity: 61 },
      { zoneName: "UM1", price: 0, quantity: 48 },
      { zoneName: "UM2", price: 0, quantity: 120 },
      { zoneName: "UM3", price: 0, quantity: 48 },
      { zoneName: "UM4", price: 0, quantity: 17 },
      { zoneName: "UM5", price: 0, quantity: 57 },
      { zoneName: "UM6", price: 0, quantity: 17 },
      { zoneName: "LTL", price: 0, quantity: 34 },
      { zoneName: "UTL", price: 0, quantity: 71 },
      { zoneName: "LTR", price: 0, quantity: 34 },
      { zoneName: "UTR", price: 0, quantity: 71 },
      { zoneName: "BXA", price: 0, quantity: 7 },
      { zoneName: "BXB", price: 0, quantity: 7 },
      { zoneName: "BXC", price: 0, quantity: 7 },
      { zoneName: "LB1", price: 0, quantity: 86 },
      { zoneName: "LB2", price: 0, quantity: 105 },
      { zoneName: "LB3", price: 0, quantity: 86 },
      { zoneName: "FBA", price: 0, quantity: 14 },
      { zoneName: "FBB", price: 0, quantity: 20 },
      { zoneName: "FBC", price: 0, quantity: 14 },
      { zoneName: "BXF", price: 0, quantity: 7 },
      { zoneName: "BXE", price: 0, quantity: 7 },
      { zoneName: "BXD", price: 0, quantity: 7 },
    ],
    "Large": [
      { zoneName: "LM1", price: 0, quantity: 79  },
      { zoneName: "LM2", price: 0, quantity: 128 },
      { zoneName: "LM3", price: 0, quantity: 79 },
      { zoneName: "LM4", price: 0, quantity: 61 },
      { zoneName: "LM5", price: 0, quantity: 128 },
      { zoneName: "LM6", price: 0, quantity: 61 },
      { zoneName: "UM1", price: 0, quantity: 48 },
      { zoneName: "UM2", price: 0, quantity: 120 },
      { zoneName: "UM3", price: 0, quantity: 48 },
      { zoneName: "UM4", price: 0, quantity: 17 },
      { zoneName: "UM5", price: 0, quantity: 57 },
      { zoneName: "UM6", price: 0, quantity: 17 },
      { zoneName: "LTL", price: 0, quantity: 34 },
      { zoneName: "UTL", price: 0, quantity: 71 },
      { zoneName: "LTR", price: 0, quantity: 34 },
      { zoneName: "UTR", price: 0, quantity: 71 },
      { zoneName: "BXA", price: 0, quantity: 7 },
      { zoneName: "BXB", price: 0, quantity: 7 },
      { zoneName: "BXC", price: 0, quantity: 7 },
      { zoneName: "LB1", price: 0, quantity: 86 },
      { zoneName: "LB2", price: 0, quantity: 105 },
      { zoneName: "LB3", price: 0, quantity: 86 },
      { zoneName: "FBA", price: 0, quantity: 14 },
      { zoneName: "FBB", price: 0, quantity: 20 },
      { zoneName: "FBC", price: 0, quantity: 14 },
      { zoneName: "BXF", price: 0, quantity: 7 },
      { zoneName: "BXE", price: 0, quantity: 7 },
      { zoneName: "BXD", price: 0, quantity: 7 },
      { zoneName: "BXG", price: 0, quantity: 7 },
      { zoneName: "BXH", price: 0, quantity: 6 },
      { zoneName: "BXJ", price: 0, quantity: 6 },
      { zoneName: "BXN", price: 0, quantity: 7 },
      { zoneName: "SBL", price: 0, quantity: 17 },
      { zoneName: "UB1", price: 0, quantity: 105 },
      { zoneName: "UB2", price: 0, quantity: 176 },
      { zoneName: "UB3", price: 0, quantity: 105 },
      { zoneName: "BXK", price: 0, quantity: 6 },
      { zoneName: "BXL", price: 0, quantity: 6 },
      { zoneName: "BXM", price: 0, quantity: 7 },
      { zoneName: "BXP", price: 0, quantity: 7 },
      { zoneName: "SBR", price: 0, quantity: 17 },
    ]
  },


  "3": { // เมืองไทยรัชดาลัย (ชื่อโซนตรงตามข้อความในผัง)
    "Small": [
      { zoneName: "L1", price: 0, quantity: 71 },
      { zoneName: "L2", price: 0, quantity: 96 },
      { zoneName: "C1", price: 0, quantity: 120 },
      { zoneName: "C2", price: 0, quantity: 120 },
      { zoneName: "R1", price: 0, quantity: 71 },
      { zoneName: "R2", price: 0, quantity: 96 }
    ],
    "Medium": [
      { zoneName: "L1", price: 0, quantity: 71 },
      { zoneName: "L2", price: 0, quantity: 96 },
      { zoneName: "L3", price: 0, quantity: 48 },
      { zoneName: "L4", price: 0, quantity: 69 },
      { zoneName: "C1", price: 0, quantity: 120 },
      { zoneName: "C2", price: 0, quantity: 120 },
      { zoneName: "C3", price: 0, quantity: 60 },
      { zoneName: "C4", price: 0, quantity: 45 },
      { zoneName: "R1", price: 0, quantity: 71 },
      { zoneName: "R2", price: 0, quantity: 96 },
      { zoneName: "R3", price: 0, quantity: 48 },
      { zoneName: "R4", price: 0, quantity: 68 },
    ],
    "Large": [
      { zoneName: "L1", price: 0, quantity: 71 },
      { zoneName: "L2", price: 0, quantity: 96 },
      { zoneName: "L3", price: 0, quantity: 48 },
      { zoneName: "L4", price: 0, quantity: 69 },
      { zoneName: "L5", price: 0, quantity: 44 },
      { zoneName: "L6", price: 0, quantity: 77 },
      { zoneName: "C1", price: 0, quantity: 120 },
      { zoneName: "C2", price: 0, quantity: 120 },
      { zoneName: "C3", price: 0, quantity: 60 },
      { zoneName: "C4", price: 0, quantity: 45 },
      { zoneName: "C5", price: 0, quantity: 60 },
      { zoneName: "C6", price: 0, quantity: 105 },
      { zoneName: "R1", price: 0, quantity: 71 },
      { zoneName: "R2", price: 0, quantity: 96 },
      { zoneName: "R3", price: 0, quantity: 48 },
      { zoneName: "R4", price: 0, quantity: 68 },
      { zoneName: "R5", price: 0, quantity: 46 },
      { zoneName: "R6", price: 0, quantity: 80 },
    ]
  }
};

interface TicketTier {
  zoneName: string;
  price: number;
  quantity: number;
}

interface Hall {
  Hall_id: number;
  hallName: string;
}

interface ShowRound {
  roundNumber: number;
  startDT: string;
  endDT: string;
  saleStart: string;
  saleEnd: string;
}

export default function CreateEventPage() {
  // --- State สำหรับข้อมูลหลัก ---
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [showRounds, setShowRounds] = useState<ShowRound[]>([
    { roundNumber: 1, startDT: "", endDT: "", saleStart: "", saleEnd: "" }
  ]);

  const [posterImages, setPosterImages] = useState<string[]>([]); 
  const [venuePlanImage, setVenuePlanImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // --- State สำหรับสถานที่และขนาด ---
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedHallId, setSelectedHallId] = useState<string>("");
  const [venueSize, setVenueSize] = useState<VenueSize>("Medium"); 

  // --- State สำหรับบัตร ---
  const [tickets, setTickets] = useState<TicketTier[]>([
    { zoneName: "", price: 0, quantity: 0 }
  ]);

  // --- ฟังก์ชันเคลียร์หน้าจอ (Reset Form) ---
  const resetForm = () => {
    setEventName("");
    setDescription("");
    setShowRounds([{ roundNumber: 1, startDT: "", endDT: "", saleStart: "", saleEnd: "" }]);
    setPosterImages([]); 
    setVenuePlanImage(null);
    setSelectedHallId("");
    setVenueSize("Medium"); 
    setTickets([{ zoneName: "", price: 0, quantity: 0 }]);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    resetForm();
  };

  useEffect(() => {
    const specificHalls = [
      { Hall_id: 1, hallName: "อิมแพคอารีน่า (Impact Arena)" },
      { Hall_id: 2, hallName: "มหิดลฮอล์ (Prince Mahidol Hall)" },
      { Hall_id: 3, hallName: "เมืองไทยรัชดาลัยเธียร์เตอร์" }
    ];
    setHalls(specificHalls);
  }, []);

  // ✅ 3. ปรับ useEffect เพื่อดึงรูปและดึงโซนมาแสดงพร้อมกัน
  useEffect(() => {
    if (selectedHallId && venueSize) {
      // 3.1 ดึงรูปภาพ
      const autoPlanImg = PREDEFINED_PLANS[selectedHallId]?.[venueSize];
      if (autoPlanImg) {
        setVenuePlanImage(autoPlanImg); 
      } else {
        setVenuePlanImage(null);
      }

      // 3.2 ดึงข้อมูลโซน
      const autoZones = PREDEFINED_ZONES[selectedHallId]?.[venueSize];
      if (autoZones && autoZones.length > 0) {
        setTickets(JSON.parse(JSON.stringify(autoZones))); // clone array ป้องกันบั๊ก
      } else {
        setTickets([{ zoneName: "", price: 0, quantity: 0 }]); // ถ้าไม่มีข้อมูล คืนค่าเป็น 1 แถวว่างๆ
      }

    } else {
      setVenuePlanImage(null);
      setTickets([{ zoneName: "", price: 0, quantity: 0 }]);
    }
  }, [selectedHallId, venueSize]);

  const addRound = () => {
    const lastRound = showRounds[showRounds.length - 1];
    setShowRounds([...showRounds, {
        roundNumber: showRounds.length + 1,
        startDT: lastRound ? lastRound.startDT : "", 
        endDT: lastRound ? lastRound.endDT : "", 
        saleStart: lastRound ? lastRound.saleStart : "", 
        saleEnd: lastRound ? lastRound.saleEnd : "" 
    }]);
  };

  const removeRound = (index: number) => {
    if (showRounds.length > 1) {
        const newRounds = showRounds.filter((_, i) => i !== index).map((r, i) => ({ ...r, roundNumber: i + 1 }));
        setShowRounds(newRounds);
    } else {
        alert("ต้องมีรอบการแสดงอย่างน้อย 1 รอบ");
    }
  };

  const updateRound = (index: number, field: keyof ShowRound, value: string) => {
    const newRounds = [...showRounds];
    newRounds[index] = { ...newRounds[index], [field]: value };
    setShowRounds(newRounds);
  };

  const addTicketTier = () => setTickets([...tickets, { zoneName: "", price: 0, quantity: 0 }]);
  
  const removeTicketTier = (index: number) => {
     if (tickets.length > 1) setTickets(tickets.filter((_, i) => i !== index));
     else alert("ต้องมีบัตรอย่างน้อย 1 ประเภทครับ");
  };

  const updateTicket = (index: number, field: keyof TicketTier, value: string | number) => {
    const newTickets = [...tickets];
    if (field === "zoneName") {
       newTickets[index].zoneName = String(value);
    } else {
       // @ts-ignore
       newTickets[index][field] = Number(value);
    }
    setTickets(newTickets);
  };

  const handleMultipleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPosterImages(prev => [...prev, reader.result as string]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removePosterImage = (indexToRemove: number) => {
    setPosterImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHallId) return alert("กรุณาเลือกสถานที่");
    
    const isTicketsValid = tickets.every(t => t.zoneName.trim() !== "");
    if (!isTicketsValid) return alert("กรุณากรอกชื่อโซนบัตรให้ครบถ้วน");

    setLoading(true);
    const token = localStorage.getItem("token");

    const payload = {
      eventName,
      eventDescription: description,
      Hall_id: Number(selectedHallId),
      venueSize, 
      show_rounds: showRounds, 
      posterImages, 
      venuePlanImage,
      tickets
    };

    try {
      const res = await fetch('http://127.0.0.1:8000/api/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}` 
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setShowSuccessModal(true);
      } else {
        const err = await res.json();
        alert("❌ Error: " + (err.message || "Something went wrong"));
      }
    } catch (error) {
      alert("❌ เชื่อมต่อ Server ไม่ได้");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-20 font-sans">
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">สร้างอีเวนต์ใหม่</h1>
          <p className="text-slate-400 mt-1">กำหนดราคาบัตรและอัปโหลดผังที่นั่งได้ตามต้องการ</p>
        </div>
        <div className="flex gap-3">
          <Link href="/organizer" className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800">ยกเลิก</Link>
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 font-bold flex items-center gap-2 transition-all hover:scale-105 active:scale-95">
            <Save size={18} /> {loading ? "กำลังบันทึก..." : "บันทึกและส่งอนุมัติ"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400"><AlignLeft size={20} /> รายละเอียดงาน</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">ชื่องานอีเวนต์</label>
                <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="ชื่องานคอนเสิร์ต..." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 outline-none transition-colors" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm text-slate-400 mb-1">สถานที่จัดงาน (Hall)</label>
                   <div className="relative">
                    <select value={selectedHallId} onChange={(e) => setSelectedHallId(e.target.value)} className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 appearance-none outline-none focus:border-blue-500 cursor-pointer">
                      <option value="">เลือกสถานที่จัดงาน...</option>
                      {halls.map((h) => <option key={h.Hall_id} value={h.Hall_id}>{h.hallName}</option>)}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20}/>
                   </div>
                </div>
                <div>
                  <label className={`block text-sm mb-1 flex items-center gap-1 ${!selectedHallId ? "text-slate-600" : "text-slate-400"}`}>
                      <Grid3X3 size={14} /> ขนาดพื้นที่
                  </label>
                  <div className="relative">
                    <select 
                      value={venueSize} 
                      onChange={(e) => setVenueSize(e.target.value as VenueSize)} 
                      disabled={!selectedHallId} 
                      className={`w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 appearance-none ${!selectedHallId ? "opacity-50 cursor-not-allowed bg-slate-800" : "cursor-pointer"}`}
                    >
                        {Object.entries(GRID_SIZES).map(([key, config]) => (
                            <option key={key} value={key}>{config.label}</option>
                        ))}
                    </select>
                    <ChevronDown className={`absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none ${!selectedHallId ? "text-slate-600" : "text-slate-500"}`} size={20} />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">รายละเอียดเพิ่มเติม</label>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="รายละเอียดงาน..." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 resize-none outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
          </div>

          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold flex items-center gap-2 text-pink-400"><Calendar size={20} /> รอบการแสดง & การขายบัตร</h2>
                <button onClick={addRound} type="button" className="text-sm bg-pink-500/10 text-pink-400 border border-pink-500/50 hover:bg-pink-500 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"><Plus size={16} /> เพิ่มรอบ</button>
             </div>
             <div className="space-y-4">
                {showRounds.map((round, index) => (
                    <div key={index} className="bg-[#1E293B]/50 p-4 rounded-xl border border-slate-700 relative group">
                        <div className="absolute -left-3 -top-3 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 font-bold text-sm shadow-md z-10">{index + 1}</div>
                        {showRounds.length > 1 && (<button onClick={() => removeRound(index)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400 p-2"><Trash2 size={16}/></button>)}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 border-b border-slate-700 pb-1"><Clock size={14} /> วันที่แสดงจริง</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><label className="text-[10px] text-slate-500 block mb-1">เริ่มแสดง</label><input type="datetime-local" value={round.startDT} onChange={(e)=>updateRound(index, 'startDT', e.target.value)} className="w-full bg-[#0F172A] border border-slate-600 rounded px-2 py-1.5 text-xs text-white [color-scheme:dark]" /></div>
                                    <div><label className="text-[10px] text-slate-500 block mb-1">จบการแสดง</label><input type="datetime-local" value={round.endDT} onChange={(e)=>updateRound(index, 'endDT', e.target.value)} className="w-full bg-[#0F172A] border border-slate-600 rounded px-2 py-1.5 text-xs text-white [color-scheme:dark]" /></div>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <h3 className="text-sm font-semibold text-slate-300 flex items-center gap-2 border-b border-slate-700 pb-1"><Ticket size={14} /> ช่วงเวลาขายบัตร</h3>
                                <div className="grid grid-cols-2 gap-2">
                                    <div><label className="text-[10px] text-slate-500 block mb-1">เปิดขาย</label><input type="datetime-local" value={round.saleStart} onChange={(e)=>updateRound(index, 'saleStart', e.target.value)} className="w-full bg-[#0F172A] border border-slate-600 rounded px-2 py-1.5 text-xs text-yellow-400 [color-scheme:dark]" /></div>
                                    <div><label className="text-[10px] text-slate-500 block mb-1">ปิดขาย</label><input type="datetime-local" value={round.saleEnd} onChange={(e)=>updateRound(index, 'saleEnd', e.target.value)} className="w-full bg-[#0F172A] border border-slate-600 rounded px-2 py-1.5 text-xs text-red-400 [color-scheme:dark]" /></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>

          {/* Section บัตร */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-purple-400"><Ticket size={20} /> โซนและราคาบัตร</h2>
              <button onClick={addTicketTier} type="button" className="text-sm bg-purple-500/10 text-purple-400 border border-purple-500/50 hover:bg-purple-500 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all"><Plus size={16} /> เพิ่มโซน</button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               <div className="border border-slate-700 rounded-xl bg-[#1E293B]/30 p-4 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden">
                   {venuePlanImage ? (
                     <img src={venuePlanImage} alt="Seating Plan" className="w-full h-auto rounded-lg shadow-lg object-contain" />
                   ) : (
                     <div className="text-center text-slate-500">
                       <Map size={48} className="mx-auto mb-2 opacity-20"/>
                       <p className="text-sm">กรุณาเลือกสถานที่และขนาดพื้นที่<br/>เพื่อดูผังที่นั่ง</p>
                     </div>
                   )}
               </div>

               {/* ✅ ส่วน UI โซนที่จัดใหม่ตามรูปภาพ */}
               <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                   {tickets.map((ticket, index) => (
                       <div key={index} className="flex gap-4 items-center p-4 rounded-xl border border-slate-700 bg-transparent hover:border-purple-500/50 transition-colors">
                           <div className="flex-1">
                               <label className="text-xs text-slate-500 mb-1.5 block">โซน</label>
                               <input type="text" value={ticket.zoneName} onChange={(e) => updateTicket(index, 'zoneName', e.target.value)} placeholder="Zone A" className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none transition-colors" />
                           </div>
                           <div className="flex-1">
                               <label className="text-xs text-slate-500 mb-1.5 block">ราคา</label>
                               <input type="number" value={ticket.price} onChange={(e) => updateTicket(index, 'price', e.target.value)} className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none transition-colors" />
                           </div>
                           <div className="flex-1">
                               <label className="text-xs text-slate-500 mb-1.5 block">จำนวน</label>
                               <input type="number" value={ticket.quantity} onChange={(e) => updateTicket(index, 'quantity', e.target.value)} className="w-full bg-[#0F172A] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:border-purple-500 outline-none transition-colors" />
                           </div>
                           <div className="pt-6 flex items-center justify-center">
                               <button onClick={() => removeTicketTier(index)} className="text-slate-600 hover:text-red-500 p-1.5 transition-colors">
                                   <Trash2 size={20} />
                               </button>
                           </div>
                       </div>
                   ))}
               </div>
            </div>
          </div>
        </div>

        {/* Sidebar Poster */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl sticky top-6">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-400">
               <ImageIcon size={20} /> รูปโปสเตอร์งาน
             </h2>

             {posterImages.length > 0 && (
               <div className={`grid gap-2 mb-4 ${posterImages.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                 {posterImages.map((img, index) => (
                   <div key={index} className="relative group aspect-[3/4] rounded-lg overflow-hidden border border-slate-700 shadow-md">
                     <img src={img} alt={`Poster ${index}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                     <button 
                       type="button"
                       onClick={() => removePosterImage(index)}
                       className="absolute top-2 right-2 bg-red-500/80 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                     >
                       <Trash2 size={14} />
                     </button>
                   </div>
                 ))}
               </div>
             )}

             <label className="w-full py-4 rounded-xl border-2 border-dashed border-slate-700 bg-[#1E293B]/30 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500 hover:text-cyan-500 cursor-pointer transition-all shadow-inner">
                <ImageIcon size={28} className="mb-2 opacity-50"/>
                <p className="text-sm font-semibold">{posterImages.length > 0 ? "+ เพิ่มรูปอีก" : "คลิกเลือกรูปโปสเตอร์"}</p>
                <p className="text-xs text-slate-600 mt-1">(เลือกได้หลายไฟล์พร้อมกัน)</p>
                <input type="file" multiple className="hidden" accept="image/*" onChange={handleMultipleImageUpload} />
             </label>

             <div className="mt-6 pt-6 border-t border-slate-800">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">สรุปข้อมูล</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex justify-between"><span>สถานที่ (ID):</span><span className="text-white font-mono">{selectedHallId || "-"}</span></li>
                <li className="flex justify-between"><span>ขนาดพื้นที่:</span><span className="text-cyan-400">{GRID_SIZES[venueSize].label}</span></li>
                <li className="flex justify-between border-t border-slate-800 pt-2 mt-2"><span>จำนวนรอบ:</span><span className="text-pink-400">{showRounds.length} รอบ</span></li>
                <li className="flex justify-between font-bold"><span>บัตรทั้งหมด:</span><span className="text-white">{tickets.reduce((sum, t) => sum + Number(t.quantity), 0)} ใบ</span></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {showSuccessModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="bg-[#0F172A] border border-slate-800 w-full max-w-sm rounded-3xl p-8 shadow-2xl text-center animate-in fade-in zoom-in duration-300">
            <div className="w-20 h-20 bg-green-500/10 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/20 shadow-lg shadow-green-500/5">
              <Save size={40} />
            </div>
            
            <h3 className="text-2xl font-bold text-white mb-3">บันทึกข้อมูลเรียบร้อย</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-8">
              แอดมินกำลังตรวจสอบข้อมูลของคุณ <br /> 
              <span className="text-cyan-400 font-bold tracking-wide">รอการตรวจสอบภายใน 2 วัน</span>
            </p>

            <button 
              onClick={handleCloseModal}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl font-bold text-white hover:brightness-110 active:scale-95 transition-all shadow-xl shadow-blue-500/20"
            >
              รับทราบ
            </button>
          </div>
        </div>
      )}
    </div>
  );
}