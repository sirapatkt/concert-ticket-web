"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Calendar, AlignLeft, Image as ImageIcon, 
  Plus, Trash2, Save, Ticket, Building2, ChevronDown, Clock, Map, Grid3X3 
} from "lucide-react";

// --- 1. Constants & Types ---
const CAPACITY_PER_BLOCK = 50; // 1 ช่อง = 50 คน

interface TicketTier {
  name: string;
  price: number;
  quantity: number;
}

// ประเภทของช่องใน Grid
type CellType = "empty" | "stageMain" | "stageSub" | "catwalk" | "zoneA" | "zoneB" | "zoneC";

// --- 2. Mock Data (ข้อมูลเดิมของคุณ) ---
const venuePresets: Record<string, { image: string, defaultTickets: TicketTier[] }> = {
  "IMPACT ARENA (Muang Thong Thani)": {
    image: "/impact_plan.png", 
    defaultTickets: [
      { name: "AL (Standing)", price: 6000, quantity: 1000 },
      { name: "AR (Standing)", price: 6000, quantity: 1000 },
      { name: "BL (Standing)", price: 5500, quantity: 800 },
      { name: "BR (Standing)", price: 5500, quantity: 800 },
      { name: "Zone SH (Center)", price: 5000, quantity: 200 },
      { name: "Zone SG (Center)", price: 5000, quantity: 200 },
      { name: "Zone SI", price: 4500, quantity: 300 },
      { name: "Zone SF", price: 4500, quantity: 300 },
      { name: "Zone SJ", price: 4500, quantity: 350 },
      { name: "Zone SE", price: 4500, quantity: 350 },
      { name: "Zone SK", price: 4000, quantity: 400 },
      { name: "Zone SD", price: 4000, quantity: 400 },
      { name: "Zone SL", price: 4000, quantity: 400 },
      { name: "Zone SC", price: 4000, quantity: 400 },
      { name: "Zone SM", price: 3500, quantity: 300 },
      { name: "Zone SB", price: 3500, quantity: 300 },
      { name: "Zone SN", price: 3500, quantity: 250 },
      { name: "Zone K (Center)", price: 3000, quantity: 500 },
      { name: "Zone L (Center)", price: 3000, quantity: 500 },
      { name: "Zone J", price: 2500, quantity: 450 },
      { name: "Zone M", price: 2500, quantity: 450 },
      { name: "Zone I", price: 2500, quantity: 450 },
      { name: "Zone N", price: 2500, quantity: 450 },
      { name: "Zone H", price: 2000, quantity: 400 },
      { name: "Zone O", price: 2000, quantity: 400 },
      { name: "Zone G", price: 2000, quantity: 400 },
      { name: "Zone P", price: 2000, quantity: 400 },
      { name: "Zone F", price: 1500, quantity: 350 },
      { name: "Zone Q", price: 1500, quantity: 350 },
      { name: "Zone E", price: 1500, quantity: 350 },
      { name: "Zone R", price: 1500, quantity: 350 },
      { name: "Zone D", price: 1200, quantity: 300 },
      { name: "Zone S", price: 1200, quantity: 300 },
      { name: "Zone C", price: 1200, quantity: 200 },
      { name: "Zone T", price: 1200, quantity: 200 },
      { name: "Zone B", price: 1000, quantity: 150 },
    ]
  },
  "Prince Mahidol Hall": {
    image: "https://placehold.co/800x600/4a1d1d/FFF?text=Prince+Mahidol+Hall+Plan",
    defaultTickets: [
      { name: "L1 Stalls (Center)", price: 4000, quantity: 400 },
      { name: "L1 Stalls (Side)", price: 3500, quantity: 300 },
      { name: "L2 Mezzanine", price: 3000, quantity: 350 },
      { name: "L3 Balcony", price: 2000, quantity: 300 },
      { name: "L4 Gallery", price: 1000, quantity: 200 },
    ]
  },
  "เมืองไทยรัชดาลัย เธียเตอร์": {
    image: "https://placehold.co/800x600/1d254a/FFF?text=Rachadalai+Theatre+Plan",
    defaultTickets: [
      { name: "VIP Box", price: 5000, quantity: 40 },
      { name: "R Zone (Orchestra)", price: 4500, quantity: 150 },
      { name: "Zone A (Stalls)", price: 3500, quantity: 300 },
      { name: "Zone B (Stalls)", price: 3000, quantity: 300 },
      { name: "Zone C (Circle)", price: 2500, quantity: 250 },
      { name: "Zone D (Circle)", price: 2000, quantity: 250 },
    ]
  }
};

export default function CreateEventPage() {
  // --- State เดิม ---
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [saleStartDate, setSaleStartDate] = useState(""); 
  const [description, setDescription] = useState("");
  const [posterImage, setPosterImage] = useState<string | null>(null);
  const [selectedVenue, setSelectedVenue] = useState(""); 
  const [venuePlanImage, setVenuePlanImage] = useState<string | null>(null);
  const [tickets, setTickets] = useState<TicketTier[]>([
    { name: "Regular", price: 2500, quantity: 100 }
  ]);

  // --- ✅ State ใหม่สำหรับ Grid System ---
  const [stageGrid, setStageGrid] = useState<CellType[]>(Array(80).fill("empty"));
  const [activeTool, setActiveTool] = useState<CellType>("stageMain");

  const venues = [
    "IMPACT ARENA (Muang Thong Thani)",
    "Prince Mahidol Hall",
    "เมืองไทยรัชดาลัย เธียเตอร์"
  ];

  // --- Helpers ของ Grid System ---
  const getCellColor = (type: CellType) => {
    switch (type) {
      case "stageMain": return "bg-slate-200 border-white shadow-lg shadow-white/10 z-20 scale-105"; 
      case "stageSub": return "bg-slate-400 border-slate-300 shadow-md z-10"; 
      case "catwalk": return "bg-slate-600 border-slate-500 z-0"; 
      case "zoneA": return "bg-purple-500/80 border-purple-400 hover:bg-purple-500 text-white";
      case "zoneB": return "bg-blue-500/80 border-blue-400 hover:bg-blue-500 text-white";
      case "zoneC": return "bg-green-500/80 border-green-400 hover:bg-green-500 text-white";
      default: return "bg-[#0B0F19] border-slate-800 hover:border-slate-600";
    }
  };

  const calculateZoneCapacity = (grid: CellType[], zoneType: CellType) => {
    return grid.filter((c) => c === zoneType).length * CAPACITY_PER_BLOCK;
  };

  // ✅ ฟังก์ชันอัปเดต Grid และ บัตรพร้อมกัน
  const toggleCell = (index: number) => {
    // 1. อัปเดต Grid
    const newGrid = [...stageGrid];
    if (newGrid[index] === activeTool) {
      newGrid[index] = "empty";
    } else {
      newGrid[index] = activeTool;
    }
    setStageGrid(newGrid);

    // 2. ถ้าเป็นโซนบัตร (A, B, C) ให้ไปอัปเดตใน tickets ด้วย
    if (["zoneA", "zoneB", "zoneC"].includes(activeTool) || ["zoneA", "zoneB", "zoneC"].includes(stageGrid[index])) {
       updateTicketsFromGrid(newGrid);
    }
  };

  // ฟังก์ชันคำนวณบัตรจาก Grid แล้ว Sync ลง State tickets
  const updateTicketsFromGrid = (grid: CellType[]) => {
    const countA = calculateZoneCapacity(grid, "zoneA");
    const countB = calculateZoneCapacity(grid, "zoneB");
    const countC = calculateZoneCapacity(grid, "zoneC");

    setTickets(prev => {
        let newTickets = [...prev];

        // Helper update or add
        const syncZone = (zoneName: string, count: number, defaultPrice: number) => {
            const idx = newTickets.findIndex(t => t.name === zoneName);
            if (count > 0) {
                if (idx >= 0) {
                    // มีอยู่แล้ว -> อัปเดตจำนวน
                    newTickets[idx] = { ...newTickets[idx], quantity: count };
                } else {
                    // ยังไม่มี -> เพิ่มใหม่
                    newTickets.unshift({ name: zoneName, price: defaultPrice, quantity: count });
                }
            } else if (idx >= 0) {
                 // ถ้าจำนวนเป็น 0 ให้ลบออก หรือจะเก็บไว้แต่ quantity 0 ก็ได้ (ที่นี้ลบออกเพื่อความ clean)
                 newTickets = newTickets.filter(t => t.name !== zoneName);
            }
        };

        syncZone("Zone A (Grid)", countA, 6000);
        syncZone("Zone B (Grid)", countB, 5000);
        syncZone("Zone C (Grid)", countC, 4000);

        return newTickets;
    });
  };

  const clearGrid = () => {
    const emptyGrid = Array(80).fill("empty");
    setStageGrid(emptyGrid);
    updateTicketsFromGrid(emptyGrid);
  };

  // --- Handlers เดิม ---
  const handleVenueChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const venueName = e.target.value;
    setSelectedVenue(venueName);

    if (venuePresets[venueName]) {
      const preset = venuePresets[venueName];
      setVenuePlanImage(preset.image);
      setTickets(preset.defaultTickets); // Reset tickets ตาม preset
      setStageGrid(Array(80).fill("empty")); // Reset Grid ด้วยเพื่อไม่ให้ตีกัน
    } else {
      setVenuePlanImage(null);
      setTickets([{ name: "Regular", price: 2500, quantity: 100 }]);
    }
  };

  const addTicketTier = () => {
    setTickets([...tickets, { name: "", price: 0, quantity: 0 }]);
  };

  const removeTicketTier = (index: number) => {
    if (tickets.length > 1) {
      const newTickets = tickets.filter((_, i) => i !== index);
      setTickets(newTickets);
    } else {
      alert("ต้องมีบัตรอย่างน้อย 1 ประเภทครับ");
    }
  };

  const updateTicket = (index: number, field: keyof TicketTier, value: string | number) => {
    const newTickets = [...tickets];
    if (field === "name") newTickets[index].name = String(value);
    else newTickets[index][field] = Number(value);
    setTickets(newTickets);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPosterImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    const finalLocation = selectedVenue;
    const payload = { eventName, eventDate, saleStartDate, location: finalLocation, description, tickets, stageGrid }; // ส่ง stageGrid ไปด้วย
    console.log("🚀 กำลังส่งข้อมูล...", payload);
    alert("✅ บันทึกข้อมูลเรียบร้อย!");
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-20 font-sans">
      
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            สร้างอีเวนต์ใหม่
          </h1>
          <p className="text-slate-400 mt-1">ระบบจะดึงผังที่นั่งให้อัตโนมัติตามสถานที่</p>
        </div>
        <div className="flex gap-3">
          <Link href="/organizer" className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">ยกเลิก</Link>
          <button onClick={handleSubmit} className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2">
            <Save size={18} /> บันทึกและส่งอนุมัติ
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. รายละเอียดงาน */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-blue-400">
              <AlignLeft size={20} /> รายละเอียดงาน
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-slate-400 mb-1">ชื่องานอีเวนต์</label>
                <input 
                  type="text" 
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                  placeholder="เช่น Cat Expo, Big Mountain..."
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 outline-none"
                />
              </div>

              {/* Venue Dropdown */}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1 flex items-center gap-1">
                    <Calendar size={14} /> วัน-เวลาแสดง
                  </label>
                  <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 [color-scheme:dark]" />
                </div>
                <div>
                  <label className="block text-sm text-cyan-400 mb-1 flex items-center gap-1 font-medium">
                    <Clock size={14} /> วัน-เวลาเปิดขายบัตร
                  </label>
                  <input type="datetime-local" value={saleStartDate} onChange={(e) => setSaleStartDate(e.target.value)} className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-cyan-500 [color-scheme:dark]" />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">รายละเอียดเพิ่มเติม</label>
                <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="อธิบายเกี่ยวกับงานของคุณ..." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 resize-none" />
              </div>
            </div>
          </div>

          {/* ✅ 2. Stage Layout Editor (เพิ่มส่วนนี้เข้ามา) */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
             <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 border-b border-slate-700 pb-4 gap-4">
               <div>
                  <h2 className="text-xl font-bold flex items-center gap-2 text-purple-400">
                     <Grid3X3 size={20} /> ออกแบบผังเวที (Standing Grid)
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">วาดโซนยืนเพื่อสร้างบัตรอัตโนมัติ (1 Block ≈ {CAPACITY_PER_BLOCK} คน)</p>
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
                <div className="flex-1 flex justify-center bg-[#020617] p-6 rounded-xl border-2 border-dashed border-slate-700 relative select-none">
                    <div className="absolute top-2 text-slate-600 text-[10px] uppercase font-bold tracking-widest">FRONT STAGE</div>
                    <div className="grid grid-cols-8 gap-1.5 w-full max-w-[380px]">
                        {stageGrid.map((type, index) => (
                           <div key={index} onClick={() => toggleCell(index)} className={`aspect-square rounded-sm cursor-pointer transition-all duration-150 border ${getCellColor(type)} ${activeTool === type ? 'ring-2 ring-white/50 scale-95' : ''} flex items-center justify-center text-[9px] font-bold`}>
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

          {/* 3. จัดการบัตร + ผังที่นั่ง (ของเดิม + Grid Auto Added) */}
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
                {/* ส่วนแสดงรูปผัง (ซ้าย) */}
                <div className="border border-slate-700 rounded-xl bg-[#1E293B]/30 p-4 flex flex-col items-center justify-center min-h-[400px] relative overflow-hidden group">
                    {venuePlanImage ? (
                        <>
                            <p className="text-xs text-slate-400 mb-2 flex items-center gap-1 absolute top-3 left-3 bg-black/50 px-2 py-1 rounded z-10"><Map size={12}/> {selectedVenue}</p>
                            <img src={venuePlanImage} alt="Seating Plan" className="w-full h-auto rounded-lg shadow-lg object-contain hover:scale-105 transition-transform" />
                        </>
                    ) : (
                        <div className="text-center text-slate-500">
                            <Map size={48} className="mx-auto mb-2 opacity-20"/>
                            <p className="text-sm">เลือกสถานที่ด้านบน</p>
                            <p className="text-xs">หรือใช้ Grid ด้านบนออกแบบเอง</p>
                        </div>
                    )}
                </div>

                {/* ส่วนรายการบัตร (ขวา) */}
                <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                    {tickets.map((ticket, index) => (
                        <div key={index} className="grid grid-cols-12 gap-2 items-center p-2 bg-[#1E293B]/50 rounded-lg border border-slate-700 hover:border-purple-500/30 transition-colors animate-in fade-in slide-in-from-right-4 duration-300">
                            {/* ชื่อโซน */}
                            <div className="col-span-5">
                                <label className="text-[10px] text-slate-500 mb-0.5 block">โซน</label>
                                <input type="text" value={ticket.name} onChange={(e) => updateTicket(index, 'name', e.target.value)} className={`w-full bg-[#0F172A] border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:border-purple-500 outline-none ${ticket.name.includes("(Grid)") ? "text-yellow-400 font-bold" : ""}`} />
                            </div>
                            {/* ราคา */}
                            <div className="col-span-3">
                                <label className="text-[10px] text-slate-500 mb-0.5 block">ราคา</label>
                                <input type="number" value={ticket.price} onChange={(e) => updateTicket(index, 'price', e.target.value)} className="w-full bg-[#0F172A] border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:border-purple-500 outline-none" />
                            </div>
                            {/* จำนวน */}
                            <div className="col-span-3">
                                <label className="text-[10px] text-slate-500 mb-0.5 block">จำนวน</label>
                                <input 
                                    type="number" 
                                    value={ticket.quantity} 
                                    onChange={(e) => updateTicket(index, 'quantity', e.target.value)} 
                                    readOnly={ticket.name.includes("(Grid)")} // ถ้ามาจาก Grid ห้ามแก้จำนวนเอง
                                    className={`w-full bg-[#0F172A] border border-slate-700 rounded px-2 py-1.5 text-xs text-white focus:border-purple-500 outline-none ${ticket.name.includes("(Grid)") ? "opacity-60 cursor-not-allowed" : ""}`} 
                                />
                            </div>
                            {/* ลบ */}
                            <div className="col-span-1 flex justify-center pt-4">
                                <button onClick={() => removeTicketTier(index)} className="text-slate-600 hover:text-red-500 transition-colors p-1"><Trash2 size={16} /></button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
          </div>
        </div>

        {/* Right Column: Upload */}
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
                <li className="flex justify-between border-t border-slate-800 pt-2 mt-2"><span>จำนวนบัตร:</span><span className="text-white">{tickets.reduce((sum, t) => sum + Number(t.quantity), 0)} ใบ</span></li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}