// 📂 ไฟล์: app/organizer/create/page.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Calendar, AlignLeft, Image as ImageIcon, 
  Plus, Trash2, Save, Ticket, Layout, Building2 
} from "lucide-react";

// กำหนดโครงสร้างข้อมูลของบัตร
interface TicketTier {
  name: string;
  price: number;
  quantity: number;
}

export default function CreateEventPage() {
  // State สำหรับเก็บข้อมูลฟอร์ม
  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [description, setDescription] = useState("");
  
  // ตัวเลือกสถานที่และขนาด
  const [selectedVenue, setSelectedVenue] = useState("IMPACT ARENA");
  const [selectedSize, setSelectedSize] = useState("Medium");

  const venues = [
    "IMPACT ARENA",
    "Prince Mahidol Hall",
    "เมืองไทยรัชดาลัย เธียเตอร์"
  ];

  const venueSizes = [
    { value: "Small", label: "เล็ก (Small Hall)" },
    { value: "Medium", label: "กลาง (Medium Hall)" },
    { value: "Large", label: "ใหญ่ (Grand Hall)" },
  ];

  // State สำหรับจัดการรายการบัตร
  const [tickets, setTickets] = useState<TicketTier[]>([
    { name: "Regular", price: 2500, quantity: 100 }
  ]);

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
    // @ts-ignore
    newTickets[index][field] = value;
    setTickets(newTickets);
  };

  // ⭐ ฟังก์ชันบันทึกข้อมูล (เชื่อมต่อ Database)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    
    // 1. รวมข้อมูลสถานที่
    const finalLocation = `${selectedVenue} (${selectedSize})`;

    // 2. เตรียมข้อมูล (Payload)
    const payload = { 
      eventName: eventName, 
      eventDate: eventDate, 
      location: finalLocation, 
      description: description, 
      tickets: tickets 
    };

    console.log("🚀 กำลังส่งข้อมูล...", payload);

    try {
      // 3. ยิงไปหา API
      const res = await fetch('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (res.ok) {
        alert("✅ บันทึกข้อมูลลง Database เรียบร้อย!"); 
        // window.location.href = '/organizer'; // (เลือก) ถ้าอยากให้เด้งกลับหน้าหลัก
      } else {
        alert("❌ Error: " + data.error);
        console.error(data.error);
      }
    } catch (error) {
      alert("❌ เชื่อมต่อ Server ไม่ได้");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-20">
      
      {/* ส่วนหัว (Header) */}
      <div className="max-w-5xl mx-auto mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            สร้างอีเวนต์ใหม่
          </h1>
          <p className="text-slate-400 mt-1">กรอกรายละเอียดคอนเสิร์ตของคุณเพื่อเริ่มขายบัตร</p>
        </div>
        <div className="flex gap-3">
          <Link 
            href="/organizer" 
            className="px-4 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors"
          >
            ยกเลิก
          </Link>
          <button 
            onClick={handleSubmit}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2"
          >
            <Save size={18} /> บันทึกและส่งอนุมัติ
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* คอลัมน์ซ้าย: ข้อมูลหลัก */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* 1. ข้อมูลทั่วไป */}
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
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1 flex items-center gap-1">
                    <Building2 size={14} /> สถานที่จัดงาน (Venue)
                  </label>
                  <select 
                    value={selectedVenue}
                    onChange={(e) => setSelectedVenue(e.target.value)}
                    className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer appearance-none"
                  >
                    {venues.map((v) => (
                      <option key={v} value={v}>{v}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm text-slate-400 mb-1 flex items-center gap-1">
                    <Layout size={14} /> ขนาดพื้นที่ (Size)
                  </label>
                  <select 
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                    className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all cursor-pointer appearance-none"
                  >
                    {venueSizes.map((s) => (
                      <option key={s.value} value={s.value}>{s.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1 flex items-center gap-1">
                  <Calendar size={14} /> วัน-เวลาแสดง
                </label>
                <input 
                  type="datetime-local" 
                  value={eventDate}
                  onChange={(e) => setEventDate(e.target.value)}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-1">รายละเอียดเพิ่มเติม</label>
                <textarea 
                  rows={4}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="อธิบายเกี่ยวกับงานของคุณ..."
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder:text-slate-600 resize-none"
                />
              </div>
            </div>
          </div>

          {/* 2. จัดการบัตร */}
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold flex items-center gap-2 text-purple-400">
                <Ticket size={20} /> ประเภทบัตรราคา
              </h2>
              <button 
                onClick={addTicketTier}
                type="button"
                className="text-sm bg-purple-500/10 text-purple-400 border border-purple-500/50 hover:bg-purple-500 hover:text-white px-3 py-1.5 rounded-lg transition-all flex items-center gap-1"
              >
                <Plus size={16} /> เพิ่มบัตร
              </button>
            </div>

            <div className="space-y-3">
              {tickets.map((ticket, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 items-end p-4 bg-[#1E293B]/50 rounded-xl border border-slate-700 hover:border-purple-500/30 transition-colors">
                  <div className="col-span-5">
                    <label className="text-xs text-slate-500 mb-1 block">ชื่อโซน / ประเภท</label>
                    <input 
                      type="text" 
                      value={ticket.name}
                      onChange={(e) => updateTicket(index, 'name', e.target.value)}
                      placeholder="เช่น VIP, Zone A"
                      className="w-full bg-[#0F172A] border border-slate-700 rounded px-3 py-2 text-sm focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs text-slate-500 mb-1 block">ราคา (บาท)</label>
                    <input 
                      type="number" 
                      value={ticket.price}
                      onChange={(e) => updateTicket(index, 'price', e.target.value)}
                      className="w-full bg-[#0F172A] border border-slate-700 rounded px-3 py-2 text-sm focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div className="col-span-3">
                    <label className="text-xs text-slate-500 mb-1 block">จำนวน (ใบ)</label>
                    <input 
                      type="number" 
                      value={ticket.quantity}
                      onChange={(e) => updateTicket(index, 'quantity', e.target.value)}
                      className="w-full bg-[#0F172A] border border-slate-700 rounded px-3 py-2 text-sm focus:border-purple-500 outline-none"
                    />
                  </div>
                  <div className="col-span-1 flex justify-center pb-2">
                    <button 
                      onClick={() => removeTicketTier(index)}
                      className="text-slate-600 hover:text-red-500 transition-colors p-1"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* คอลัมน์ขวา: อัปโหลดรูป */}
        <div className="space-y-6">
          <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl sticky top-6">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-cyan-400">
              <ImageIcon size={20} /> โปสเตอร์งาน
            </h2>
            
            <div className="w-full aspect-[3/4] rounded-xl border-2 border-dashed border-slate-700 bg-[#1E293B]/30 flex flex-col items-center justify-center text-slate-500 hover:border-cyan-500 hover:text-cyan-500 hover:bg-[#1E293B]/50 transition-all cursor-pointer group">
              <div className="p-4 bg-slate-800 rounded-full mb-3 group-hover:scale-110 transition-transform">
                <ImageIcon size={32} />
              </div>
              <p className="font-medium text-sm">คลิกเพื่ออัปโหลด</p>
              <p className="text-xs opacity-60 mt-1">รองรับ JPG, PNG (Max 5MB)</p>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-800">
              <h3 className="text-sm font-semibold text-slate-300 mb-3">สรุปข้อมูลเบื้องต้น</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li className="flex justify-between">
                  <span>สถานที่:</span>
                  <span className="text-white text-right">{selectedVenue}</span>
                </li>
                <li className="flex justify-between">
                  <span>ขนาด:</span>
                  <span className="text-white text-right">{selectedSize}</span>
                </li>
                <li className="flex justify-between border-t border-slate-800 pt-2 mt-2">
                  <span>จำนวนบัตร:</span>
                  <span className="text-white">{tickets.reduce((sum, t) => sum + Number(t.quantity), 0)} ใบ</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}