"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, AlignLeft, Image as ImageIcon, 
  Plus, Trash2, Save, Ticket, Building2, ChevronDown, Clock, Map, Grid3X3,
  Maximize 
} from "lucide-react";

<<<<<<< HEAD
<<<<<<< HEAD
const CAPACITY_PER_BLOCK = 50; 
=======
=======
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
// --- 1. Constants & Types ---
const CAPACITY_PER_BLOCK = 50; 

// ✅ คงไว้: กำหนดขนาดของ Grid
const GRID_SIZES = {
  Small:  { label: "เล็ก (Small Hall)",  total: 48,  cols: 6,  css: "grid-cols-6 max-w-[280px]" },
  Medium: { label: "กลาง (Medium Hall)", total: 80,  cols: 8,  css: "grid-cols-8 max-w-[380px]" },
  Large:  { label: "ใหญ่ (Grand Hall)",  total: 120, cols: 10, css: "grid-cols-10 max-w-[480px]" }
};

type VenueSize = keyof typeof GRID_SIZES; 
<<<<<<< HEAD
>>>>>>> a7e320caced6215472f4a5dc20df232fa33d66ba
=======
=======
const CAPACITY_PER_BLOCK = 50; 
>>>>>>> bb0f8a0 (merge main into feature-admin)
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300

interface TicketTier {
  name: string;
  price: number;
  quantity: number;
}
<<<<<<< HEAD
<<<<<<< HEAD

type CellType = "empty" | "stageMain" | "stageSub" | "catwalk" | "zoneA" | "zoneB" | "zoneC";

interface Hall {
  Hall_id: number;
  hallName: string;
}

export default function CreateEventPage() {
  // --- State สำหรับข้อมูลหลัก ---
=======
=======
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
type CellType = "empty" | "stageMain" | "stageSub" | "catwalk" | "zoneA" | "zoneB" | "zoneC";

// --- 2. Mock Data (ลบข้อมูล Presets ออกหมดแล้ว) ---
const venuePresets: Record<string, { image: string, defaultTickets: TicketTier[] }> = {};

export default function CreateEventPage() {
  // --- Form State ---
<<<<<<< HEAD
>>>>>>> a7e320caced6215472f4a5dc20df232fa33d66ba
=======
=======

type CellType = "empty" | "stageMain" | "stageSub" | "catwalk" | "zoneA" | "zoneB" | "zoneC";

interface Hall {
  Hall_id: number;
  hallName: string;
}

export default function CreateEventPage() {
  // --- State สำหรับข้อมูลหลัก ---
>>>>>>> bb0f8a0 (merge main into feature-admin)
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [saleStartDate, setSaleStartDate] = useState(""); 
  const [posterImage, setPosterImage] = useState<string | null>(null);
<<<<<<< HEAD
<<<<<<< HEAD
  const [loading, setLoading] = useState(false);

  // --- State สำหรับสถานที่ (ดึงจาก Database) ---
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedHallId, setSelectedHallId] = useState<string>("");

  // --- State สำหรับบัตรและ Grid ---
  const [tickets, setTickets] = useState<TicketTier[]>([]);
  const [stageGrid, setStageGrid] = useState<CellType[]>(Array(80).fill("empty"));
  const [activeTool, setActiveTool] = useState<CellType>("stageMain");

  // 1. ดึงข้อมูลสถานที่จาก Database จริง
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/halls");
        const data = await res.json();
        setHalls(data);
      } catch (error) {
        console.error("Failed to fetch halls:", error);
      }
    };
    fetchHalls();
  }, []);

  // 2. ระบบ Grid Helpers
=======
=======
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
  
  const [selectedVenue, setSelectedVenue] = useState(""); 
  const [venuePlanImage, setVenuePlanImage] = useState<string | null>(null);
  
  // ลบ Mock Ticket ออก: เริ่มต้นด้วยบัตรว่าง 1 ใบ
  const [tickets, setTickets] = useState<TicketTier[]>([
    { name: "", price: 0, quantity: 0 }
  ]);

  // --- Grid State ---
  const [venueSize, setVenueSize] = useState<VenueSize>("Medium"); 
  const [stageGrid, setStageGrid] = useState<CellType[]>(Array(GRID_SIZES["Medium"].total).fill("empty"));
  const [activeTool, setActiveTool] = useState<CellType>("stageMain");

  // ✅ คงไว้: ตัวเลือกสถานที่ (แต่ไม่มี data presets ผูกแล้ว)
  const venues = [
    "IMPACT ARENA (Muang Thong Thani)",
    "Prince Mahidol Hall",
    "เมืองไทยรัชดาลัย เธียเตอร์"
  ];

  // --- Helpers ---
<<<<<<< HEAD
>>>>>>> a7e320caced6215472f4a5dc20df232fa33d66ba
=======
=======
  const [loading, setLoading] = useState(false);

  // --- State สำหรับสถานที่ (ดึงจาก Database) ---
  const [halls, setHalls] = useState<Hall[]>([]);
  const [selectedHallId, setSelectedHallId] = useState<string>("");

  // --- State สำหรับบัตรและ Grid ---
  const [tickets, setTickets] = useState<TicketTier[]>([]);
  const [stageGrid, setStageGrid] = useState<CellType[]>(Array(80).fill("empty"));
  const [activeTool, setActiveTool] = useState<CellType>("stageMain");

  // 1. ดึงข้อมูลสถานที่จาก Database จริง
  useEffect(() => {
    const fetchHalls = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/halls");
        const data = await res.json();
        setHalls(data);
      } catch (error) {
        console.error("Failed to fetch halls:", error);
      }
    };
    fetchHalls();
  }, []);

  // 2. ระบบ Grid Helpers
>>>>>>> bb0f8a0 (merge main into feature-admin)
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
  const getCellColor = (type: CellType) => {
    switch (type) {
      case "stageMain": return "bg-slate-200 border-white shadow-lg"; 
      case "stageSub": return "bg-slate-400 border-slate-300"; 
      case "catwalk": return "bg-slate-600 border-slate-500"; 
      case "zoneA": return "bg-purple-500/80 border-purple-400 text-white";
      case "zoneB": return "bg-blue-500/80 border-blue-400 text-white";
      case "zoneC": return "bg-green-500/80 border-green-400 text-white";
      default: return "bg-[#0B0F19] border-slate-800 hover:border-slate-600";
    }
  };

<<<<<<< HEAD
<<<<<<< HEAD
=======
=======
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
  const calculateZoneCapacity = (grid: CellType[], zoneType: CellType) => {
    return grid.filter((c) => c === zoneType).length * CAPACITY_PER_BLOCK;
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = e.target.value as VenueSize;
    setVenueSize(newSize);
    
    // Reset Grid ตามขนาดใหม่
    const newTotal = GRID_SIZES[newSize].total;
    const newGrid = Array(newTotal).fill("empty");
    setStageGrid(newGrid);
    
    updateTicketsFromGrid(newGrid); 
  };

<<<<<<< HEAD
>>>>>>> a7e320caced6215472f4a5dc20df232fa33d66ba
=======
=======
>>>>>>> bb0f8a0 (merge main into feature-admin)
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
  const toggleCell = (index: number) => {
    const newGrid = [...stageGrid];
    newGrid[index] = newGrid[index] === activeTool ? "empty" : activeTool;
    setStageGrid(newGrid);
<<<<<<< HEAD
<<<<<<< HEAD
    updateTicketsFromGrid(newGrid);
=======
=======
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300

    if (["zoneA", "zoneB", "zoneC"].includes(activeTool) || ["zoneA", "zoneB", "zoneC"].includes(stageGrid[index])) {
       updateTicketsFromGrid(newGrid);
    }
<<<<<<< HEAD
>>>>>>> a7e320caced6215472f4a5dc20df232fa33d66ba
=======
=======
    updateTicketsFromGrid(newGrid);
>>>>>>> bb0f8a0 (merge main into feature-admin)
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
  };

  const updateTicketsFromGrid = (grid: CellType[]) => {
    const calculateCapacity = (type: CellType) => grid.filter(c => c === type).length * CAPACITY_PER_BLOCK;
    
    const countA = calculateCapacity("zoneA");
    const countB = calculateCapacity("zoneB");
    const countC = calculateCapacity("zoneC");

    setTickets(prev => {
<<<<<<< HEAD
<<<<<<< HEAD
      let otherTickets = prev.filter(t => !t.name.includes("(Grid)"));
      const gridTickets: TicketTier[] = [];
      
      if (countA > 0) gridTickets.push({ name: "Zone A (Grid)", price: 6000, quantity: countA });
      if (countB > 0) gridTickets.push({ name: "Zone B (Grid)", price: 4500, quantity: countB });
      if (countC > 0) gridTickets.push({ name: "Zone C (Grid)", price: 2500, quantity: countC });
      
      return [...gridTickets, ...otherTickets];
    });
  };

=======
=======
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
        let newTickets = [...prev];
        const syncZone = (zoneName: string, count: number, defaultPrice: number) => {
            const idx = newTickets.findIndex(t => t.name === zoneName);
            if (count > 0) {
                if (idx >= 0) {
                    newTickets[idx] = { ...newTickets[idx], quantity: count };
                } else {
                    newTickets.unshift({ name: zoneName, price: defaultPrice, quantity: count });
                }
            } else if (idx >= 0) {
                 newTickets = newTickets.filter(t => t.name !== zoneName);
            }
        };
        // ราคา Default เป็น 0 ไว้ก่อน เพราะไม่มี Mock Data แล้ว
        syncZone("Zone A (Grid)", countA, 0);
        syncZone("Zone B (Grid)", countB, 0);
        syncZone("Zone C (Grid)", countC, 0);
        return newTickets;
    });
  };

  const clearGrid = () => {
    const emptyGrid = Array(GRID_SIZES[venueSize].total).fill("empty");
    setStageGrid(emptyGrid);
    updateTicketsFromGrid(emptyGrid);
  };

  const handleVenueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const venueName = e.target.value;
    setSelectedVenue(venueName);

    // เช็คว่ามี Preset ไหม (ตอนนี้ไม่มีแล้ว จะเข้า else ตลอด)
    if (venuePresets[venueName]) {
      const preset = venuePresets[venueName];
      setVenuePlanImage(preset.image);
      setTickets(preset.defaultTickets);
      
      // Default behavior when preset exists
      setVenueSize("Medium");
      setStageGrid(Array(GRID_SIZES["Medium"].total).fill("empty"));
    } else {
      // เมื่อไม่มี Preset ให้เคลียร์รูป และเคลียร์บัตรเป็นค่าว่าง
      setVenuePlanImage(null);
      setTickets([{ name: "", price: 0, quantity: 0 }]);
    }
  };

  const addTicketTier = () => setTickets([...tickets, { name: "", price: 0, quantity: 0 }]);
  
  const removeTicketTier = (index: number) => {
     if (tickets.length > 1) setTickets(tickets.filter((_, i) => i !== index));
     else alert("ต้องมีบัตรอย่างน้อย 1 ประเภทครับ");
  };

  const updateTicket = (index: number, field: keyof TicketTier, value: string | number) => {
    const newTickets = [...tickets];
    if (field === "name") newTickets[index].name = String(value);
    else newTickets[index][field] = Number(value);
    setTickets(newTickets);
  };

<<<<<<< HEAD
>>>>>>> a7e320caced6215472f4a5dc20df232fa33d66ba
=======
=======
      let otherTickets = prev.filter(t => !t.name.includes("(Grid)"));
      const gridTickets: TicketTier[] = [];
      
      if (countA > 0) gridTickets.push({ name: "Zone A (Grid)", price: 6000, quantity: countA });
      if (countB > 0) gridTickets.push({ name: "Zone B (Grid)", price: 4500, quantity: countB });
      if (countC > 0) gridTickets.push({ name: "Zone C (Grid)", price: 2500, quantity: countC });
      
      return [...gridTickets, ...otherTickets];
    });
  };

>>>>>>> bb0f8a0 (merge main into feature-admin)
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPosterImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

<<<<<<< HEAD
<<<<<<< HEAD
  // 3. ส่งข้อมูลไป Backend Laravel
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHallId) return alert("กรุณาเลือกสถานที่");

    setLoading(true);
    const token = localStorage.getItem("token");

    const payload = {
      eventName,
      eventDescription: description,
      Hall_id: Number(selectedHallId),
      eventDate,
      saleStartDate,
      posterImage,
      tickets,
      stageGrid: JSON.stringify(stageGrid)
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
        alert("✅ บันทึกคอนเสิร์ตเรียบร้อย!");
        window.location.href = "/organizer/dashboard";
      } else {
        const err = await res.json();
        alert("❌ Error: " + err.message);
      }
    } catch (error) {
      alert("❌ เชื่อมต่อ Server ไม่ได้");
    } finally {
      setLoading(false);
=======
=======
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
  // เพิ่ม Handler สำหรับอัปโหลดรูปผังที่นั่งเอง
  const handlePlanImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setVenuePlanImage(reader.result as string);
      reader.readAsDataURL(file);
<<<<<<< HEAD
>>>>>>> a7e320caced6215472f4a5dc20df232fa33d66ba
=======
=======
  // 3. ส่งข้อมูลไป Backend Laravel
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedHallId) return alert("กรุณาเลือกสถานที่");

    setLoading(true);
    const token = localStorage.getItem("token");

    const payload = {
      eventName,
      eventDescription: description,
      Hall_id: Number(selectedHallId),
      eventDate,
      saleStartDate,
      posterImage,
      tickets,
      stageGrid: JSON.stringify(stageGrid)
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
        alert("✅ บันทึกคอนเสิร์ตเรียบร้อย!");
        window.location.href = "/organizer/dashboard";
      } else {
        const err = await res.json();
        alert("❌ Error: " + err.message);
      }
    } catch (error) {
      alert("❌ เชื่อมต่อ Server ไม่ได้");
    } finally {
      setLoading(false);
>>>>>>> bb0f8a0 (merge main into feature-admin)
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      const payload = {
          eventName,
          eventDescription: description,
          bannerImage: posterImage,
          eventDate,
          saleStartDate,
          location: selectedVenue,
          venueSize: venueSize,
          venuePlanImage, 
          tickets: tickets.map(t => ({
              name: t.name,
              price: Number(t.price),
              quantity: Number(t.quantity)
          })),
          stageGrid: stageGrid
      }
      console.log("🚀 Payload to send:", payload);
      alert("ข้อมูลพร้อมส่ง (ดูใน Console) - นำไปต่อ API ได้เลย");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-20 font-sans">
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
<<<<<<< HEAD
<<<<<<< HEAD
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">สร้างอีเวนต์ใหม่</h1>
          <p className="text-slate-400 mt-1">ดีไซน์ผังเวทีและกำหนดราคาบัตรได้ตามต้องการ</p>
=======
=======
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            สร้างอีเวนต์ใหม่
          </h1>
          <p className="text-slate-400 mt-1">กรอกข้อมูลและออกแบบผังที่นั่ง</p>
<<<<<<< HEAD
>>>>>>> a7e320caced6215472f4a5dc20df232fa33d66ba
=======
=======
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">สร้างอีเวนต์ใหม่</h1>
          <p className="text-slate-400 mt-1">ดีไซน์ผังเวทีและกำหนดราคาบัตรได้ตามต้องการ</p>
>>>>>>> bb0f8a0 (merge main into feature-admin)
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
        </div>
        <div className="flex gap-3">
          <Link href="/organizer" className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800">ยกเลิก</Link>
          <button onClick={handleSubmit} disabled={loading} className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 font-bold flex items-center gap-2">
            <Save size={18} /> {loading ? "กำลังบันทึก..." : "บันทึกและส่งอนุมัติ"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          {/* Section 1: Details */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400"><AlignLeft size={20} /> รายละเอียดงาน</h2>
            <div className="space-y-4">
<<<<<<< HEAD
<<<<<<< HEAD
              <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="ชื่องานคอนเสิร์ต..." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 outline-none" />
              
              <div className="relative">
                <select value={selectedHallId} onChange={(e) => setSelectedHallId(e.target.value)} className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 appearance-none outline-none focus:border-blue-500">
                  <option value="">เลือกสถานที่จัดงาน (Venue)...</option>
                  {halls.map((h) => <option key={h.Hall_id} value={h.Hall_id}>{h.hallName}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
=======
=======
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
              <div>
                <label className="block text-sm text-slate-400 mb-1">ชื่องานอีเวนต์</label>
                <input 
                  type="text" 
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="ใส่ชื่องาน..."
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 outline-none"
                />
              </div>

              {/* Grid สำหรับ Venue และ Size */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Venue Dropdown (คงไว้ตามคำขอ) */}
                  <div>
                      <label className="block text-sm text-slate-400 mb-1 flex items-center gap-1">
                        <Building2 size={14} /> สถานที่จัดงาน (Venue)
                      </label>
                      <div className="relative">
                        <select 
                            value={selectedVenue}
                            onChange={handleVenueChange} 
                            className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 outline-none cursor-pointer appearance-none"
                        >
                            <option value="" disabled className="text-slate-500">เลือกสถานที่จัดงาน...</option>
                            {venues.map((v) => (
                              <option key={v} value={v}>{v}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
                      </div>
                  </div>

                  {/* Dropdown ขนาดพื้นที่ (คงไว้ตามคำขอ) */}
                  <div>
                      <label className="block text-sm text-slate-400 mb-1 flex items-center gap-1">
                        <Maximize size={14} /> ขนาดพื้นที่ (Size)
                      </label>
                      <div className="relative">
                        <select 
                            value={venueSize}
                            onChange={handleSizeChange} 
                            disabled={!selectedVenue} // ห้ามเลือกถ้ายังไม่เลือกสถานที่
                            className={`w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 outline-none cursor-pointer appearance-none ${!selectedVenue ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {Object.entries(GRID_SIZES).map(([key, config]) => (
                                <option key={key} value={key}>{config.label}</option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={20} />
                      </div>
                  </div>
<<<<<<< HEAD
>>>>>>> a7e320caced6215472f4a5dc20df232fa33d66ba
=======
=======
              <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="ชื่องานคอนเสิร์ต..." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 outline-none" />
              
              <div className="relative">
                <select value={selectedHallId} onChange={(e) => setSelectedHallId(e.target.value)} className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 appearance-none outline-none focus:border-blue-500">
                  <option value="">เลือกสถานที่จัดงาน (Venue)...</option>
                  {halls.map((h) => <option key={h.Hall_id} value={h.Hall_id}>{h.hallName}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
>>>>>>> bb0f8a0 (merge main into feature-admin)
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 [color-scheme:dark]" />
                <input type="datetime-local" value={saleStartDate} onChange={(e) => setSaleStartDate(e.target.value)} className="bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 [color-scheme:dark]" />
              </div>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="รายละเอียดเพิ่มเติม..." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 resize-none outline-none focus:border-blue-500" />
            </div>
          </div>

<<<<<<< HEAD
<<<<<<< HEAD
          {/* Section 2: Grid Editor */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-purple-400 flex items-center gap-2"><Grid3X3 size={20} /> ออกแบบผังหน้าเวที</h2>
            <div className="flex gap-2 mb-6">
                {["stageMain", "catwalk", "zoneA", "zoneB", "zoneC"].map((t) => (
                    <button key={t} onClick={() => setActiveTool(t as CellType)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTool === t ? "bg-white text-black" : "bg-slate-800 text-slate-400"}`}>
                        {t.replace("stage", "").replace("zone", "Zone ")}
                    </button>
                ))}
            </div>
            <div className="bg-[#020617] p-8 rounded-xl border-2 border-dashed border-slate-700 flex justify-center">
              <div className="grid grid-cols-8 gap-1.5 w-full max-w-[400px]">
                {stageGrid.map((type, i) => (
                  <div key={i} onClick={() => toggleCell(i)} className={`aspect-square border rounded-sm cursor-pointer transition-all ${getCellColor(type)} ${activeTool === type ? "ring-2 ring-white/50" : ""}`} />
                ))}
=======
              <div>
                <label className="block text-sm text-slate-400 mb-1">รายละเอียดเพิ่มเติม</label>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="รายละเอียดงาน..." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none" />
>>>>>>> a7e320caced6215472f4a5dc20df232fa33d66ba
=======
              <div>
                <label className="block text-sm text-slate-400 mb-1">รายละเอียดเพิ่มเติม</label>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="รายละเอียดงาน..." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none" />
=======
          {/* Section 2: Grid Editor */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold mb-6 text-purple-400 flex items-center gap-2"><Grid3X3 size={20} /> ออกแบบผังหน้าเวที</h2>
            <div className="flex gap-2 mb-6">
                {["stageMain", "catwalk", "zoneA", "zoneB", "zoneC"].map((t) => (
                    <button key={t} onClick={() => setActiveTool(t as CellType)} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTool === t ? "bg-white text-black" : "bg-slate-800 text-slate-400"}`}>
                        {t.replace("stage", "").replace("zone", "Zone ")}
                    </button>
                ))}
            </div>
            <div className="bg-[#020617] p-8 rounded-xl border-2 border-dashed border-slate-700 flex justify-center">
              <div className="grid grid-cols-8 gap-1.5 w-full max-w-[400px]">
                {stageGrid.map((type, i) => (
                  <div key={i} onClick={() => toggleCell(i)} className={`aspect-square border rounded-sm cursor-pointer transition-all ${getCellColor(type)} ${activeTool === type ? "ring-2 ring-white/50" : ""}`} />
                ))}
>>>>>>> bb0f8a0 (merge main into feature-admin)
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
              </div>
            </div>
          </div>

<<<<<<< HEAD
<<<<<<< HEAD
          {/* Section 3: Tickets */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2"><Ticket size={20} /> รายการบัตร</h2>
              <button onClick={() => setTickets([...tickets, { name: "", price: 0, quantity: 0 }])} className="text-sm border border-purple-500/50 text-purple-400 px-3 py-1.5 rounded-lg hover:bg-purple-500 hover:text-white transition-all">+ เพิ่มโซน</button>
            </div>
            <div className="space-y-3">
              {tickets.map((t, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 p-3 bg-[#1E293B]/50 rounded-xl border border-slate-700 items-center">
                  <input type="text" value={t.name} onChange={(e) => { const nt = [...tickets]; nt[i].name = e.target.value; setTickets(nt); }} className="col-span-5 bg-[#0F172A] border border-slate-700 rounded p-2 text-sm outline-none" placeholder="ชื่อโซน..." />
                  <input type="number" value={t.price} onChange={(e) => { const nt = [...tickets]; nt[i].price = Number(e.target.value); setTickets(nt); }} className="col-span-3 bg-[#0F172A] border border-slate-700 rounded p-2 text-sm outline-none" placeholder="ราคา..." />
                  <input type="number" value={t.quantity} readOnly={t.name.includes("(Grid)")} onChange={(e) => { const nt = [...tickets]; nt[i].quantity = Number(e.target.value); setTickets(nt); }} className={`col-span-3 bg-[#0F172A] border border-slate-700 rounded p-2 text-sm outline-none ${t.name.includes("(Grid)") ? "opacity-50" : ""}`} placeholder="จำนวน..." />
                  <button onClick={() => setTickets(tickets.filter((_, idx) => idx !== i))} className="col-span-1 text-slate-500 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              ))}
=======
=======
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
          {/* 2. Stage Layout Editor */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-700 pb-4 gap-4">
               <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-purple-400">
                     <Grid3X3 size={20} /> ออกแบบผังเวที (Standing Grid)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">
                      ขนาดปัจจุบัน: <span className="text-white font-bold">{GRID_SIZES[venueSize].label}</span> ({GRID_SIZES[venueSize].cols} คอลัมน์)
                  </p>
               </div>
               
               {/* Toolbar */}
               <div className="flex flex-wrap gap-2">
                  <div className="flex bg-[#1E293B] p-1 rounded-lg border border-slate-700">
                      <button onClick={()=>setActiveTool("stageMain")} className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-all ${activeTool==="stageMain" ? "bg-slate-200 text-black shadow" : "text-slate-400 hover:text-white"}`}>Main</button>
                      <button onClick={()=>setActiveTool("catwalk")} className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-all ${activeTool==="catwalk" ? "bg-slate-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>Catwalk</button>
                      <button onClick={()=>setActiveTool("stageSub")} className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-all ${activeTool==="stageSub" ? "bg-slate-400 text-black shadow" : "text-slate-400 hover:text-white"}`}>Mini</button>
                  </div>
                  <div className="flex bg-[#1E293B] p-1 rounded-lg border border-slate-700">
                      <button onClick={()=>setActiveTool("zoneA")} className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-all ${activeTool==="zoneA" ? "bg-purple-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>A</button>
                      <button onClick={()=>setActiveTool("zoneB")} className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-all ${activeTool==="zoneB" ? "bg-blue-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>B</button>
                      <button onClick={()=>setActiveTool("zoneC")} className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1 transition-all ${activeTool==="zoneC" ? "bg-green-600 text-white shadow" : "text-slate-400 hover:text-white"}`}>C</button>
                  </div>
               </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                {/* Grid */}
                <div className="flex-1 flex justify-center bg-[#020617] p-6 rounded-xl border-2 border-dashed border-slate-700 relative select-none overflow-x-auto">
                    <div className="absolute top-2 text-slate-600 text-[10px] uppercase font-bold tracking-widest">FRONT STAGE</div>
                    
                    <div className={`grid gap-1.5 w-full transition-all duration-300 ${GRID_SIZES[venueSize].css}`}>
                        {stageGrid.map((type, index) => (
                           <div key={index} onClick={() => toggleCell(index)} className={`aspect-square rounded-sm cursor-pointer transition-all duration-150 border ${getCellColor(type)} ${activeTool === type ? 'ring-2 ring-white/50 scale-95' : ''} flex items-center justify-center text-[9px] font-bold hover:brightness-110`}>
                              {type === 'stageMain' && 'M'}
                              {type === 'stageSub' && 'S'}
                              {type === 'catwalk' && '•'}
                              {type === 'zoneA' && 'A'}
                              {type === 'zoneB' && 'B'}
                              {type === 'zoneC' && 'C'}
                           </div>
                        ))}
                    </div>
                </div>

                {/* Capacity Summary */}
                <div className="w-full md:w-56 space-y-4">
                   <h3 className="text-sm font-bold text-slate-300 border-b border-slate-700 pb-2">ความจุ (Grid)</h3>
                   {[
                     { id: "zoneA", name: "Zone A", color: "text-purple-400", bg: "bg-purple-500" },
                     { id: "zoneB", name: "Zone B", color: "text-blue-400", bg: "bg-blue-500" },
                     { id: "zoneC", name: "Zone C", color: "text-green-400", bg: "bg-green-500" }
                   ].map((zone) => {
                      const count = calculateZoneCapacity(stageGrid, zone.id as CellType);
                      return (
                        <div key={zone.id} className="bg-[#1E293B] p-3 rounded-lg border border-slate-700">
                            <div className="flex justify-between text-xs mb-1">
                              <span className={zone.color}>{zone.name}</span>
                              <span className="font-bold">{count} คน</span>
                            </div>
                            <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                              <div className={`${zone.bg} h-full transition-all duration-500`} style={{ width: `${Math.min((count / 3000) * 100, 100)}%` }}></div>
                            </div>
                        </div>
                      )
                   })}
                   <button onClick={clearGrid} className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1 w-full justify-center pt-2">
                      <Trash2 size={12} /> ล้างผังทั้งหมด
                   </button>
                </div>
            </div>
          </div>

          {/* 3. จัดการบัตร + ผังที่นั่ง */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-purple-400">
                <Ticket size={20} /> โซนและราคาบัตร
              </h2>
              <button onClick={addTicketTier} type="button" className="text-sm bg-purple-500/10 text-purple-400 border border-purple-500/50 hover:bg-purple-500 hover:text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-1">
                <Plus size={16} /> เพิ่มโซน
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
               {/* Left: Image Plan (อัปโหลดเองได้) */}
               <label className="border border-slate-700 rounded-xl bg-[#1E293B]/30 p-4 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group cursor-pointer hover:border-blue-500 transition-colors">
                   {venuePlanImage ? (
                       <>
                           <img src={venuePlanImage} alt="Seating Plan" className="w-full h-auto rounded-lg shadow-lg object-contain" />
                           <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                               <p className="text-white text-sm font-bold">เปลี่ยนรูปผัง</p>
                           </div>
                       </>
                   ) : (
                       <div className="text-center text-slate-500">
                           <Map size={48} className="mx-auto mb-2 opacity-20"/>
                           <p className="text-sm">คลิกเพื่ออัปโหลดรูปผังที่นั่ง</p>
                           <p className="text-xs">(ถ้ามี)</p>
                       </div>
                   )}
                   <input type="file" className="hidden" accept="image/*" onChange={handlePlanImageUpload} />
               </label>

               {/* Right: Ticket Inputs */}
               <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                   {tickets.map((ticket, index) => (
                       <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-[#1E293B]/50 rounded-lg border border-slate-700 hover:border-purple-500/30 transition-colors">
                           <div className="col-span-5">
                               <label className="text-[10px] text-slate-500 mb-0.5 block">โซน</label>
                               <input type="text" value={ticket.name} onChange={(e) => updateTicket(index, 'name', e.target.value)} placeholder="Zone A" className={`w-full bg-[#0F172A] border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:border-purple-500 outline-none ${ticket.name.includes("(Grid)") ? "text-yellow-400 font-bold" : ""}`} />
                           </div>
                           <div className="col-span-3">
                               <label className="text-[10px] text-slate-500 mb-0.5 block">ราคา</label>
                               <input type="number" value={ticket.price} onChange={(e) => updateTicket(index, 'price', e.target.value)} className="w-full bg-[#0F172A] border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:border-purple-500 outline-none" />
                           </div>
                           <div className="col-span-3">
                               <label className="text-[10px] text-slate-500 mb-0.5 block">จำนวน</label>
                               <input type="number" value={ticket.quantity} onChange={(e) => updateTicket(index, 'quantity', e.target.value)} readOnly={ticket.name.includes("(Grid)")} className={`w-full bg-[#0F172A] border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:border-purple-500 outline-none ${ticket.name.includes("(Grid)") ? "opacity-60 cursor-not-allowed" : ""}`} />
                           </div>
                           <div className="col-span-1 flex justify-center pt-4">
                               <button onClick={() => removeTicketTier(index)} className="text-slate-600 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                           </div>
                       </div>
                   ))}
               </div>
<<<<<<< HEAD
>>>>>>> a7e320caced6215472f4a5dc20df232fa33d66ba
=======
=======
          {/* Section 3: Tickets */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex justify-between mb-6">
              <h2 className="text-xl font-bold text-purple-400 flex items-center gap-2"><Ticket size={20} /> รายการบัตร</h2>
              <button onClick={() => setTickets([...tickets, { name: "", price: 0, quantity: 0 }])} className="text-sm border border-purple-500/50 text-purple-400 px-3 py-1.5 rounded-lg hover:bg-purple-500 hover:text-white transition-all">+ เพิ่มโซน</button>
            </div>
            <div className="space-y-3">
              {tickets.map((t, i) => (
                <div key={i} className="grid grid-cols-12 gap-3 p-3 bg-[#1E293B]/50 rounded-xl border border-slate-700 items-center">
                  <input type="text" value={t.name} onChange={(e) => { const nt = [...tickets]; nt[i].name = e.target.value; setTickets(nt); }} className="col-span-5 bg-[#0F172A] border border-slate-700 rounded p-2 text-sm outline-none" placeholder="ชื่อโซน..." />
                  <input type="number" value={t.price} onChange={(e) => { const nt = [...tickets]; nt[i].price = Number(e.target.value); setTickets(nt); }} className="col-span-3 bg-[#0F172A] border border-slate-700 rounded p-2 text-sm outline-none" placeholder="ราคา..." />
                  <input type="number" value={t.quantity} readOnly={t.name.includes("(Grid)")} onChange={(e) => { const nt = [...tickets]; nt[i].quantity = Number(e.target.value); setTickets(nt); }} className={`col-span-3 bg-[#0F172A] border border-slate-700 rounded p-2 text-sm outline-none ${t.name.includes("(Grid)") ? "opacity-50" : ""}`} placeholder="จำนวน..." />
                  <button onClick={() => setTickets(tickets.filter((_, idx) => idx !== i))} className="col-span-1 text-slate-500 hover:text-red-500"><Trash2 size={18} /></button>
                </div>
              ))}
>>>>>>> bb0f8a0 (merge main into feature-admin)
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
            </div>
          </div>
        </div>

<<<<<<< HEAD
<<<<<<< HEAD
        {/* Right Sidebar: Poster */}
        <div className="lg:col-span-4">
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 sticky top-6 shadow-xl text-center">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-400"><ImageIcon size={20} /> โปสเตอร์งาน</h2>
            <label className="block w-full aspect-[3/4] border-2 border-dashed border-slate-700 rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-500 group transition-all">
              {posterImage ? <img src={posterImage} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-slate-500 group-hover:text-cyan-500"><ImageIcon size={48} className="mb-2 opacity-20" /><span className="text-sm font-medium">คลิกเพื่ออัปโหลด</span></div>}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <div className="mt-6 pt-6 border-t border-slate-800 text-left space-y-2">
                <div className="flex justify-between text-sm text-slate-400"><span>รวมจำนวนบัตร:</span><span className="text-white font-bold">{tickets.reduce((s, t) => s + t.quantity, 0)} ใบ</span></div>
=======
=======
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
        {/* Right Column: Upload Poster */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl sticky top-6">
             <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-400"><ImageIcon size={20} /> โปสเตอร์งาน</h2>
             <label className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-slate-700 bg-[#1E293B]/30 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500 hover:text-cyan-500 hover:bg-[#1E293B]/50 transition-all cursor-pointer group overflow-hidden">
                {posterImage ? (
                    <img src={posterImage} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                    <>
                        <div className="p-4 bg-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform"><ImageIcon size={32} /></div>
                        <p className="font-medium text-sm">คลิกเพื่ออัปโหลด</p>
                        <p className="text-xs opacity-60 mt-1">รองรับ JPG, PNG (Max 5MB)</p>
                    </>
                )}
                <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
             </label>

             <div className="mt-6 pt-6 border-t border-slate-800">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">สรุปข้อมูลเบื้องต้น</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex justify-between"><span>สถานที่:</span><span className="text-white text-right">{selectedVenue || "-"}</span></li>
                <li className="flex justify-between"><span>ขนาดพื้นที่:</span><span className="text-cyan-400 text-right">{selectedVenue ? GRID_SIZES[venueSize].label : "-"}</span></li>
                <li className="flex justify-between border-t border-slate-800 pt-2 mt-2"><span>จำนวนบัตร:</span><span className="text-white">{tickets.reduce((sum, t) => sum + Number(t.quantity), 0)} ใบ</span></li>
              </ul>
<<<<<<< HEAD
>>>>>>> a7e320caced6215472f4a5dc20df232fa33d66ba
=======
=======
        {/* Right Sidebar: Poster */}
        <div className="lg:col-span-4">
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 sticky top-6 shadow-xl text-center">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-400"><ImageIcon size={20} /> โปสเตอร์งาน</h2>
            <label className="block w-full aspect-[3/4] border-2 border-dashed border-slate-700 rounded-2xl overflow-hidden cursor-pointer hover:border-cyan-500 group transition-all">
              {posterImage ? <img src={posterImage} className="w-full h-full object-cover" /> : <div className="h-full flex flex-col items-center justify-center text-slate-500 group-hover:text-cyan-500"><ImageIcon size={48} className="mb-2 opacity-20" /><span className="text-sm font-medium">คลิกเพื่ออัปโหลด</span></div>}
              <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
            </label>
            <div className="mt-6 pt-6 border-t border-slate-800 text-left space-y-2">
                <div className="flex justify-between text-sm text-slate-400"><span>รวมจำนวนบัตร:</span><span className="text-white font-bold">{tickets.reduce((s, t) => s + t.quantity, 0)} ใบ</span></div>
>>>>>>> bb0f8a0 (merge main into feature-admin)
>>>>>>> 8342dca1f22f68c535b7e0b042eebd3b0e844300
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}