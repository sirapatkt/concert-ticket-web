"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, Save, AlignLeft, Image as ImageIcon, Loader2, Calendar, Plus, Trash2, Clock, Ticket 
} from "lucide-react";

interface ShowRound {
  roundNumber: number;
  startDT: string;
  endDT: string;
  saleStart: string;
  saleEnd: string;
}

interface TicketZone {
  zoneName: string;
  price: number;
  quantity: number;
}

function EditEventContent() {
  const searchParams = useSearchParams();
  const eventId = searchParams?.get("id");
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // ข้อมูลพื้นฐาน
  const [eventName, setEventName] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("กำลังเตรียม");
  const [posterImage, setPosterImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  // ข้อมูลรอบการแสดง และ โซนบัตร
  const [showRounds, setShowRounds] = useState<ShowRound[]>([]);
  const [tickets, setTickets] = useState<TicketZone[]>([]);

  // ✅ ฟังก์ชันแปลงสถานะภาษาไทยให้เป็นมาตรฐาน
  const getThaiStatus = (s: string) => {
    const up = s?.toUpperCase();
    if (up === 'PENDING' || up === 'กำลังเตรียม') return 'กำลังเตรียม';
    if (up === 'APPROVED' || up === 'กำลังจะจัด') return 'กำลังจะจัด';
    if (up === 'ON_SALE' || up === 'กำลังจัด') return 'กำลังจัด';
    if (up === 'COMPLETED' || up === 'เสร็จสิ้น') return 'เสร็จสิ้น';
    if (up === 'CANCELLED' || up === 'ยกเลิกงาน') return 'ยกเลิกงาน';
    return 'กำลังเตรียม';
  };

  // แปลงเวลาจาก DB ให้เข้ากับ <input type="datetime-local">
  const formatToInputDate = (dateStr: string) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
    return d.toISOString().slice(0, 16);
  };

  useEffect(() => {
    const fetchEvent = async () => {
      if (!eventId) return;
      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`http://127.0.0.1:8000/api/events/${eventId}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.ok) {
          const data = await res.json();
          setEventName(data.eventName || "");
          const pureDesc = data.eventDescription ? data.eventDescription.split('||GRID_DATA||')[0] : "";
          setDescription(pureDesc);
          
          // ✅ แปลงสถานะที่ได้จาก DB ให้เป็นภาษาไทยมาตรฐาน
          setStatus(getThaiStatus(data.eventStatus));
          
          if (data.bannerImage) {
            setPreviewImage(data.bannerImage.startsWith('http') ? data.bannerImage : `http://127.0.0.1:8000/storage/${data.bannerImage}`);
          }

          // โหลดรอบการแสดง
          if (data.event_date_times && data.event_date_times.length > 0) {
            setShowRounds(data.event_date_times.map((r: any) => ({
              roundNumber: r.roundNumber,
              startDT: formatToInputDate(r.startDT),
              endDT: formatToInputDate(r.endDT),
              saleStart: formatToInputDate(r.Sale_startDT),
              saleEnd: formatToInputDate(r.Sale_endDT)
            })));
          } else {
            setShowRounds([{ roundNumber: 1, startDT: "", endDT: "", saleStart: "", saleEnd: "" }]);
          }

          // โหลดโซนบัตร
          if (data.ticket_zones && data.ticket_zones.length > 0) {
            setTickets(data.ticket_zones.map((t: any) => ({
              zoneName: t.zoneName,
              price: t.priceperTick,
              quantity: t.totalSeat
            })));
          } else {
            setTickets([{ zoneName: "", price: 0, quantity: 0 }]);
          }

        } else {
          alert("ไม่พบข้อมูล");
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPosterImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // ฟังก์ชันจัดการรอบการแสดง
  const addRound = () => setShowRounds([...showRounds, { roundNumber: showRounds.length + 1, startDT: "", endDT: "", saleStart: "", saleEnd: "" }]);
  const removeRound = (index: number) => showRounds.length > 1 ? setShowRounds(showRounds.filter((_, i) => i !== index).map((r, i) => ({ ...r, roundNumber: i + 1 }))) : alert("ต้องมีอย่างน้อย 1 รอบ");
  const updateRound = (index: number, field: keyof ShowRound, value: string) => {
    const newRounds = [...showRounds];
    newRounds[index] = { ...newRounds[index], [field]: value };
    setShowRounds(newRounds);
  };

  // ฟังก์ชันจัดการโซนบัตร
  const addTicket = () => setTickets([...tickets, { zoneName: "", price: 0, quantity: 0 }]);
  const removeTicket = (index: number) => tickets.length > 1 ? setTickets(tickets.filter((_, i) => i !== index)) : alert("ต้องมีอย่างน้อย 1 โซน");
  const updateTicket = (index: number, field: keyof TicketZone, value: string | number) => {
    const newTickets = [...tickets];
    newTickets[index] = { ...newTickets[index], [field]: value };
    setTickets(newTickets);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let cloudinaryUrl = null;
      if (posterImage) {
        const formData = new FormData();
        formData.append("file", posterImage); 
        formData.append("upload_preset", "bannerImage"); 
        formData.append("cloud_name", "de7ml7aeb"); 
        formData.append("folder", "event_posters");
        const cloudRes = await fetch("https://api.cloudinary.com/v1_1/de7ml7aeb/image/upload", { method: "POST", body: formData });
        const cloudData = await cloudRes.json();
        if (cloudData.secure_url) cloudinaryUrl = cloudData.secure_url; 
      }

      const token = localStorage.getItem("token");
      const payload = {
        eventName,
        eventDescription: description,
        posterImage: cloudinaryUrl,
        show_rounds: showRounds, 
        tickets: tickets,
        // ✅ ส่งสถานะ "PENDING" กลับไปให้หลังบ้าน เพื่อให้เด้งกลับไปรอแอดมินอนุมัติ
        eventStatus: "PENDING" 
      };

      const res = await fetch(`http://127.0.0.1:8000/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert("บันทึกการแก้ไขสำเร็จ! กรุณารอแอดมินอนุมัติอีกครั้ง");
        router.push("/organizer/my-events"); 
      } else {
        const err = await res.json();
        alert("เกิดข้อผิดพลาด: " + (err.message || ""));
      }
    } catch (error) {
      alert("❌ เชื่อมต่อ Server ไม่ได้");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="min-h-screen bg-[#020617] flex justify-center items-center"><Loader2 className="animate-spin text-blue-400" size={40}/></div>;

  // ✅ ตัวแปรเช็คว่าต้อง "ล็อกโซนที่นั่ง" หรือไม่ (ถ้าเป็น "กำลังจะจัด" จะล็อก)
  const isZoneLocked = status === "กำลังจะจัด";

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 mb-6 flex items-start gap-3">
        <div className="text-yellow-500 mt-0.5">⚠️</div>
        <div>
          <h4 className="text-yellow-500 font-bold text-sm">ข้อควรระวังในการแก้ไข</h4>
          <p className="text-yellow-400/80 text-xs mt-1">การบันทึกแก้ไขข้อมูล จะทำให้สถานะงานกลับไปเป็น <span className="font-bold">"รอตรวจสอบ"</span> จนกว่าแอดมินจะอนุมัติอีกครั้ง</p>
          {isZoneLocked && (
            <p className="text-red-400 text-xs mt-1">🔒 งานนี้ได้รับอนุมัติแล้ว คุณสามารถแก้ราคาบัตรได้ แต่ไม่สามารถแก้ไขชื่อโซนและจำนวนที่นั่งได้</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-8">
        <Link href="/organizer/my-events" className="p-2 bg-[#0F172A] border border-slate-800 rounded-xl text-slate-400 hover:text-white transition-all"><ArrowLeft size={20} /></Link>
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">แก้ไขข้อมูลอีเวนต์</h1>
          <p className="text-slate-400 text-sm mt-1">ID: {eventId} • สถานะ: <span className="text-cyan-400">{status}</span></p>
        </div>
      </div>

      <div className="space-y-6">
        {/* ข้อมูลพื้นฐาน */}
        <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2 text-blue-400"><AlignLeft size={20} /> ข้อมูลพื้นฐาน</h2>
          <div>
            <label className="block text-sm text-slate-400 mb-1">ชื่องานอีเวนต์</label>
            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 outline-none text-white" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">รายละเอียดเพิ่มเติม</label>
            <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 outline-none text-white" />
          </div>
          <div>
            <label className="block text-sm text-slate-400 mb-1">โปสเตอร์งาน</label>
            {previewImage && <img src={previewImage} alt="Preview" className="w-48 rounded-lg border border-slate-700 mb-3" />}
            <input type="file" accept="image/*" onChange={handleImageChange} className="text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-500/10 file:text-blue-400" />
          </div>
        </div>

        {/* รอบการแสดง */}
        <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
           <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold flex items-center gap-2 text-pink-400"><Calendar size={20} /> รอบการแสดง</h2>
              <button onClick={addRound} type="button" className="text-sm bg-pink-500/10 text-pink-400 px-3 py-1.5 rounded-lg flex items-center gap-1"><Plus size={16} /> เพิ่มรอบ</button>
           </div>
           <div className="space-y-4">
              {showRounds.map((round, index) => (
                  <div key={index} className="bg-[#1E293B]/50 p-4 rounded-xl border border-slate-700 relative">
                      <div className="absolute -left-3 -top-3 w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center border border-slate-600 font-bold text-sm z-10">{index + 1}</div>
                      <button onClick={() => removeRound(index)} className="absolute top-2 right-2 text-slate-500 hover:text-red-400"><Trash2 size={16}/></button>
                      <div className="grid grid-cols-2 gap-4 mt-2">
                         <div><label className="text-xs text-slate-500">เริ่มแสดง</label><input type="datetime-local" value={round.startDT} onChange={(e)=>updateRound(index, 'startDT', e.target.value)} className="w-full bg-[#0F172A] border border-slate-600 rounded px-2 py-1.5 text-xs text-white [color-scheme:dark]" /></div>
                         <div><label className="text-xs text-slate-500">จบการแสดง</label><input type="datetime-local" value={round.endDT} onChange={(e)=>updateRound(index, 'endDT', e.target.value)} className="w-full bg-[#0F172A] border border-slate-600 rounded px-2 py-1.5 text-xs text-white [color-scheme:dark]" /></div>
                         <div><label className="text-xs text-slate-500">เปิดขายบัตร</label><input type="datetime-local" value={round.saleStart} onChange={(e)=>updateRound(index, 'saleStart', e.target.value)} className="w-full bg-[#0F172A] border border-slate-600 rounded px-2 py-1.5 text-xs text-yellow-400 [color-scheme:dark]" /></div>
                         <div><label className="text-xs text-slate-500">ปิดขายบัตร</label><input type="datetime-local" value={round.saleEnd} onChange={(e)=>updateRound(index, 'saleEnd', e.target.value)} className="w-full bg-[#0F172A] border border-slate-600 rounded px-2 py-1.5 text-xs text-red-400 [color-scheme:dark]" /></div>
                      </div>
                  </div>
              ))}
           </div>
        </div>

        {/* โซนและราคาบัตร */}
        <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2 text-green-400"><Ticket size={20} /> โซนและราคาบัตร</h2>
            {/* ✅ ถ้าล็อกโซน จะซ่อนปุ่มเพิ่มโซน */}
            {!isZoneLocked && (
              <button onClick={addTicket} type="button" className="text-sm bg-green-500/10 text-green-400 px-3 py-1.5 rounded-lg flex items-center gap-1">
                <Plus size={16} /> เพิ่มโซน
              </button>
            )}
          </div>
          <div className="space-y-3">
            {tickets.map((t, index) => (
              <div key={index} className={`flex gap-3 items-center p-3 rounded-xl border ${isZoneLocked ? 'bg-slate-800/40 border-slate-700/50' : 'bg-[#1E293B]/50 border-slate-700'}`}>
                
                <div className="flex-1">
                  <label className="text-xs text-slate-500 block mb-1">ชื่อโซน {isZoneLocked && "🔒"}</label>
                  {/* ✅ ถ้าสถานะกำลังจะจัด จะล็อกชื่อโซน (disabled) */}
                  <input type="text" value={t.zoneName} disabled={isZoneLocked} onChange={(e) => updateTicket(index, 'zoneName', e.target.value)} className="w-full bg-[#0F172A] border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none disabled:opacity-50 disabled:cursor-not-allowed" placeholder="เช่น VIP, Zone A" />
                </div>
                
                <div className="w-32">
                  <label className="text-xs text-slate-500 block mb-1">ราคา (บาท)</label>
                  {/* ✅ ราคา ไม่โดนล็อก แก้ได้เสมอ */}
                  <input type="number" value={t.price} onChange={(e) => updateTicket(index, 'price', Number(e.target.value))} className="w-full bg-[#0F172A] border border-slate-600 rounded px-3 py-2 text-sm text-yellow-400 font-bold outline-none" min="0" />
                </div>
                
                <div className="w-32">
                  <label className="text-xs text-slate-500 block mb-1">จำนวนที่นั่ง {isZoneLocked && "🔒"}</label>
                  {/* ✅ ถ้าสถานะกำลังจะจัด จะล็อกจำนวนที่นั่ง (disabled) */}
                  <input type="number" value={t.quantity} disabled={isZoneLocked} onChange={(e) => updateTicket(index, 'quantity', Number(e.target.value))} className="w-full bg-[#0F172A] border border-slate-600 rounded px-3 py-2 text-sm text-white outline-none disabled:opacity-50 disabled:cursor-not-allowed" min="1" />
                </div>
                
                {/* ✅ ถ้าล็อกโซน จะซ่อนปุ่มลบโซน */}
                {!isZoneLocked && (
                  <button onClick={() => removeTicket(index)} className="mt-5 p-2 text-slate-500 hover:text-red-400 transition-colors">
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ปุ่มเซฟ */}
        <div className="pt-4 flex justify-end pb-8">
          <button onClick={handleSave} disabled={saving} className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 font-bold text-white flex items-center gap-2 hover:scale-105 transition-all">
            {saving ? <Loader2 className="animate-spin" size={18}/> : <Save size={18} />} บันทึกการแก้ไขทั้งหมด
          </button>
        </div>
      </div>
    </div>
  );
}

export default function EditEventPage() {
  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 pb-20 font-sans">
      <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin text-blue-400" size={40}/></div>}>
        <EditEventContent />
      </Suspense>
    </div>
  );
}