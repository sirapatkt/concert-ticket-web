"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Calendar, AlignLeft, Image as ImageIcon, 
  Plus, Trash2, Save, Ticket, Building2, ChevronDown, Clock, Map, Grid3X3 
} from "lucide-react";

const CAPACITY_PER_BLOCK = 50; 

interface TicketTier {
  name: string;
  price: number;
  quantity: number;
}

type CellType = "empty" | "stageMain" | "stageSub" | "catwalk" | "zoneA" | "zoneB" | "zoneC";

interface Hall {
  Hall_id: number;
  hallName: string;
}

export default function CreateEventPage() {
  // --- State สำหรับข้อมูลหลัก ---
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [saleStartDate, setSaleStartDate] = useState(""); 
  const [posterImage, setPosterImage] = useState<string | null>(null);
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

  const toggleCell = (index: number) => {
    const newGrid = [...stageGrid];
    newGrid[index] = newGrid[index] === activeTool ? "empty" : activeTool;
    setStageGrid(newGrid);
    updateTicketsFromGrid(newGrid);
  };

  const updateTicketsFromGrid = (grid: CellType[]) => {
    const calculateCapacity = (type: CellType) => grid.filter(c => c === type).length * CAPACITY_PER_BLOCK;
    
    const countA = calculateCapacity("zoneA");
    const countB = calculateCapacity("zoneB");
    const countC = calculateCapacity("zoneC");

    setTickets(prev => {
      let otherTickets = prev.filter(t => !t.name.includes("(Grid)"));
      const gridTickets: TicketTier[] = [];
      
      if (countA > 0) gridTickets.push({ name: "Zone A (Grid)", price: 6000, quantity: countA });
      if (countB > 0) gridTickets.push({ name: "Zone B (Grid)", price: 4500, quantity: countB });
      if (countC > 0) gridTickets.push({ name: "Zone C (Grid)", price: 2500, quantity: countC });
      
      return [...gridTickets, ...otherTickets];
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPosterImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

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
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-20 font-sans">
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">สร้างอีเวนต์ใหม่</h1>
          <p className="text-slate-400 mt-1">ดีไซน์ผังเวทีและกำหนดราคาบัตรได้ตามต้องการ</p>
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
              <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} placeholder="ชื่องานคอนเสิร์ต..." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 focus:border-blue-500 outline-none" />
              
              <div className="relative">
                <select value={selectedHallId} onChange={(e) => setSelectedHallId(e.target.value)} className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 appearance-none outline-none focus:border-blue-500">
                  <option value="">เลือกสถานที่จัดงาน (Venue)...</option>
                  {halls.map((h) => <option key={h.Hall_id} value={h.Hall_id}>{h.hallName}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="datetime-local" value={eventDate} onChange={(e) => setEventDate(e.target.value)} className="bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 [color-scheme:dark]" />
                <input type="datetime-local" value={saleStartDate} onChange={(e) => setSaleStartDate(e.target.value)} className="bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 [color-scheme:dark]" />
              </div>
              <textarea rows={4} value={description} onChange={(e) => setDescription(e.target.value)} placeholder="รายละเอียดเพิ่มเติม..." className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 resize-none outline-none focus:border-blue-500" />
            </div>
          </div>

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
              </div>
            </div>
          </div>

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
            </div>
          </div>
        </div>

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}