"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ChevronLeft, 
  Timer, 
  CheckCircle2, 
  Loader2, 
  Receipt, 
  Building2,
  MapPin,
  Calendar,
  Clock,
  Ticket,
  Eye,
  Store,
  Map,
  X
} from "lucide-react";

import SeatPreviewModal from "@/components/SeatPreviewModal";

interface ZoneData {
  name?: string;
  zone_name?: string;
  zoneName?: string; 
  price?: number | string;
  priceperTick?: number | string; 
  total?: number;
  capacity?: number;
  totalSeat?: number; 
  remaining?: number;
  remainSeat?: number; 
}

interface EventData {
  name?: string;
  title?: string;
  eventName?: string; 
  description?: string;
  eventDescription?: string; 
  poster_url?: string;
  image?: string;
  bannerImage?: string; 
  location_name?: string;
  venue?: string;
  hall?: { Hall_Name?: string }; 
  show_start_date?: string;
  show_end_date?: string;
  sale_start_date?: string;
  sale_end_date?: string;
  event_date_times?: any[]; 
  zones?: ZoneData[];
  ticket_zones?: ZoneData[]; 
}

export interface TicketTier {
  zoneName: string;
  price: number;
  quantity: number;
  maxQuantity?: number;
}

function OrganizerPaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const eventId = searchParams.get("id") || searchParams.get("eventId");

  const [timeLeft, setTimeLeft] = useState(259200); 
  const [isPaid, setIsPaid] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false); // ✅ เพิ่ม State ตอนกดยืนยัน
  const [loadingQr, setLoadingQr] = useState(true);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [error, setError] = useState('');

  const [loadingEvent, setLoadingEvent] = useState(true);
  const [eventData, setEventData] = useState<EventData | null>(null);
  const [zones, setZones] = useState<ZoneData[]>([]);

  const [feeAmount, setFeeAmount] = useState<number>(0);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  
  const [derivedHallId, setDerivedHallId] = useState("1");
  const [derivedVenueSize, setDerivedVenueSize] = useState("Large");

  // ============================================================================
  // 🌟 นาฬิกานับถอยหลัง 3 วัน (แบบต่อเนื่อง ไม่รีเซ็ตตอนรีเฟรช)
  // ============================================================================
  useEffect(() => {
    if (!eventId) return;

    // หาคีย์เฉพาะของงานนี้ใน localStorage
    const storageKey = `payment_timer_event_${eventId}`;
    let targetTime = localStorage.getItem(storageKey);

    if (!targetTime) {
      // ถ้าเพิ่งเปิดหน้านี้ครั้งแรก ให้บันทึกเวลาเป้าหมาย (บวกไป 3 วัน)
      targetTime = (Date.now() + 3 * 24 * 60 * 60 * 1000).toString();
      localStorage.setItem(storageKey, targetTime);
    }

    const timer = setInterval(() => {
      const diff = Math.floor((parseInt(targetTime as string) - Date.now()) / 1000);
      if (diff <= 0) {
        setTimeLeft(0);
        clearInterval(timer);
      } else {
        setTimeLeft(diff);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [eventId]);

  // ============================================================================
  // 🌟 ดึงข้อมูลงานและ QR Code
  // ============================================================================
  useEffect(() => {
    const fetchEventAndQR = async () => {
      if (!eventId) {
        setLoadingEvent(false);
        setLoadingQr(false);
        return;
      }

      try {
        const token = localStorage.getItem("token"); 
        
        const response = await fetch(`http://localhost:8000/api/events/${eventId}`, {
          headers: {
            'Authorization': `Bearer ${token}`, 
            'Accept': 'application/json'
          }
        });
        const data = await response.json();
        
        let calculatedFee = 1500; 

        if (response.ok) {
          const eventInfo = data.event || data;
          setEventData(eventInfo);
          const fetchedZones = data.ticket_zones || eventInfo.ticket_zones || data.zones || eventInfo.zones || [];
          setZones(fetchedZones);

          let hId = "1";
          const locName = String(eventInfo?.location_name || eventInfo?.venue || eventInfo?.hall?.Hall_Name || "").toLowerCase();
          if (locName.includes("รังสิต") || locName.includes("สุริยเทพ") || locName.includes("ศาลา")) hId = "2";
          else if (locName.includes("รัชดาลัย") || locName.includes("rachadalai")) hId = "3";
          setDerivedHallId(hId);

          let vSize = "Large";
          const rawDesc = eventInfo?.description || eventInfo?.eventDescription || "";
          if (rawDesc.includes("||GRID_DATA||")) {
            try {
              const gridObj = JSON.parse(rawDesc.split("||GRID_DATA||")[1]);
              if (gridObj.venue_size) vSize = gridObj.venue_size;
            } catch(e) {}
          } else {
            const zCount = fetchedZones.length;
            if (hId === "1") vSize = zCount > 20 ? "Large" : zCount > 8 ? "Medium" : "Small";
            else if (hId === "2") vSize = zCount > 6 ? "Large" : zCount > 3 ? "Medium" : "Small";
            else if (hId === "3") vSize = zCount > 12 ? "Large" : zCount > 6 ? "Medium" : "Small";
          }
          setDerivedVenueSize(vSize);

          if (hId === "1") { 
             if (vSize === "Small") calculatedFee = 20000;
             else if (vSize === "Medium") calculatedFee = 45000;
             else calculatedFee = 80000;
          } else if (hId === "2") { 
             if (vSize === "Small") calculatedFee = 10000;
             else if (vSize === "Medium") calculatedFee = 20000;
             else calculatedFee = 35000;
          } else if (hId === "3") { 
             if (vSize === "Small") calculatedFee = 8000;
             else if (vSize === "Medium") calculatedFee = 15000;
             else calculatedFee = 25000;
          }

          setFeeAmount(calculatedFee);
        }

        const qrResponse = await fetch('http://localhost:8000/api/generate-promptpay', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ amount: calculatedFee }), 
        });
        const qrData = await qrResponse.json();

        if (qrData.success) {
          setQrCodeUrl(qrData.qr_code);
        } else {
          setError(qrData.error || 'เกิดข้อผิดพลาดในการสร้าง QR Code');
        }

      } catch (err) {
        setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ Laravel ได้');
      } finally {
        setLoadingEvent(false);
        setLoadingQr(false);
      }
    };

    fetchEventAndQR();
  }, [eventId]);

  const formatTime = (totalSeconds: number) => {
    const days = Math.floor(totalSeconds / (3600 * 24));
    const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600).toString().padStart(2, "0");
    const minutes = Math.floor((totalSeconds % 3600) / 60).toString().padStart(2, "0");
    const seconds = (totalSeconds % 60).toString().padStart(2, "0");

    if (days > 0) return `${days} วัน ${hours}:${minutes}:${seconds}`;
    return `${hours}:${minutes}:${seconds}`;
  };

  const formatDBDate = (dateStr?: string) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString('th-TH', { 
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' 
    });
  };

  const rawDescription = eventData?.description || eventData?.eventDescription || "ไม่พบรายละเอียดงาน";
  const displayDescription = rawDescription.split("||GRID_DATA||")[0];

  const mappedTickets = zones.map(z => ({
    zoneName: String(z.name || z.zone_name || z.zoneName || ""),
    price: Number(z.price || z.priceperTick || 0),
    quantity: Number(z.capacity || z.totalSeat || z.total || 0),
    maxQuantity: Number(z.capacity || z.totalSeat || z.total || 0)
  }));

  // ============================================================================
  // ✅ เชื่อมต่อปุ่มกับ API อัปเดตสถานะ Database ของจริง!
  // ============================================================================
  const handleSimulatePaymentSuccess = async () => {
    if (!eventId) return;
    setIsProcessing(true);
    setError('');

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:8000/api/organizer/events/${eventId}/publish-payment`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // อัปเดตสถานะสำเร็จ
        setIsPaid(true);
        // ลบเวลาใน storage ทิ้งได้เลยเพราะชำระแล้ว
        localStorage.removeItem(`payment_timer_event_${eventId}`);
        
        setTimeout(() => {
          router.push('/organizer/my-events');
        }, 3000);
      } else {
        setError(data.message || 'เกิดข้อผิดพลาดจากเซิร์ฟเวอร์');
      }
    } catch (err) {
      setError('ไม่สามารถเชื่อมต่อเซิร์ฟเวอร์ได้ กรุณาลองใหม่');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSimulatePaymentFail = () => {
    setError('การชำระเงินถูกยกเลิก หรือไม่สำเร็จ กรุณาลองใหม่อีกครั้ง');
  };

  return (
    <div className="min-h-screen bg-transparent text-slate-200 pb-20 animate-in fade-in duration-500 font-sans">
      
      <div className="max-w-6xl mx-auto pt-8 px-6">
        <button onClick={() => router.back()} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 hover:bg-slate-800 text-slate-300 transition-colors text-sm font-medium border border-slate-700/50">
          <ChevronLeft size={16} /> กลับไปหน้าแดชบอร์ด
        </button>

        <div className="flex flex-col items-center justify-center text-center mt-8 mb-12">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-purple-600 to-orange-500 flex items-center justify-center mb-5 shadow-lg shadow-purple-500/20">
            <Building2 size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-black text-white mb-3 tracking-wide">ชำระค่าบริการเปิดระบบ</h1>
          <p className="text-slate-400 text-sm max-w-md">งานของคุณได้รับการอนุมัติแล้ว กรุณาชำระเงินเพื่อเผยแพร่งานและเปิดระบบให้ผู้ซื้อสามารถกดบัตรได้</p>
          
          {!isPaid && (
            <div className="mt-6 inline-flex items-center gap-2 bg-red-500/10 border border-red-500/30 text-red-500 px-5 py-2.5 rounded-full font-mono font-bold text-lg">
              <Timer size={20} /> {formatTime(timeLeft)}
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-5 w-full">
          <div className="bg-[#161B22] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-6 bg-gradient-to-r from-purple-900/40 to-orange-900/20 border-b border-white/5">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-[10px] text-purple-400 font-bold tracking-widest uppercase mb-1">EVENT PUBLISHING FEE</p>
                        <h2 className="text-lg font-bold text-white leading-snug">
                          {eventData?.name || eventData?.title || eventData?.eventName || "กำลังโหลด..."}
                        </h2>
                    </div>
                    <Receipt size={24} className="text-gray-500" />
                </div>
            </div>
            
            <div className="p-8 flex flex-col items-center bg-white text-black min-h-[350px] justify-center relative">
                {loadingQr ? (
                  <div className="flex flex-col items-center text-slate-400">
                    <Loader2 className="animate-spin mb-3 text-purple-500" size={40} />
                    <p className="font-medium text-sm">กำลังสร้าง QR Code จาก Omise...</p>
                  </div>
                ) : error ? (
                  <div className="text-red-500 text-center font-bold px-4 py-3 bg-red-50 rounded-lg w-full mb-4">
                    {error}
                  </div>
                ) : null}
                
                {!loadingQr && (
                  <div className={`transition-all duration-500 ${isPaid || isProcessing ? "opacity-30 blur-sm scale-95" : ""}`}>
                     {qrCodeUrl && <img src={qrCodeUrl} alt="Omise PromptPay QR" className="w-[220px] h-[220px] object-contain drop-shadow-sm" />}
                  </div>
                )}
                
                {isProcessing && !isPaid && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                    <Loader2 className="animate-spin text-purple-500 mb-2" size={40} />
                    <p className="text-purple-600 font-bold">กำลังประมวลผล...</p>
                  </div>
                )}

                {isPaid && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-10 animate-in zoom-in duration-300">
                    <div className="bg-emerald-500 w-20 h-20 rounded-full flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/50">
                        <CheckCircle2 size={40} className="text-white" />
                    </div>
                    <p className="text-emerald-600 font-bold mt-2">ชำระเงินสำเร็จ!</p>
                  </div>
                )}

                <div className="mt-8 text-center border-t-2 border-dashed border-slate-200 pt-6 w-full">
                    <p className="text-slate-500 text-sm font-bold">ยอดชำระสุทธิ ({derivedVenueSize} Size)</p>
                    <p className="text-5xl font-black text-purple-950 mt-1 tracking-tighter">฿{feeAmount.toLocaleString()}</p>
                    
                    {/* ✅ ปุ่มจำลองการชำระเงิน */}
                    {!isPaid && !loadingQr && timeLeft > 0 && (
                      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center w-full">
                        <button 
                          onClick={handleSimulatePaymentSuccess}
                          disabled={isProcessing}
                          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold text-sm transition-all shadow-lg shadow-emerald-500/30 flex items-center justify-center gap-2 flex-1 disabled:opacity-50"
                        >
                          <CheckCircle2 size={18} /> ชำระเงินสำเร็จ
                        </button>
                        <button 
                          onClick={handleSimulatePaymentFail}
                          disabled={isProcessing}
                          className="px-4 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-600 rounded-lg font-bold text-sm transition-all flex items-center justify-center gap-2 flex-1 disabled:opacity-50"
                        >
                          <X size={18} /> ไม่สำเร็จ
                        </button>
                      </div>
                    )}
                </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 space-y-6">
          {loadingEvent ? (
            <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-10 flex flex-col items-center justify-center text-slate-400">
              <Loader2 className="animate-spin mb-3 text-cyan-500" size={32} />
              <p>กำลังโหลดข้อมูลงานจากฐานข้อมูล...</p>
            </div>
          ) : (
            <>
              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 flex flex-col sm:flex-row gap-6">
                <div className="w-full sm:w-1/3 shrink-0">
                  {eventData?.poster_url || eventData?.image || eventData?.bannerImage ? (
                    <img 
                      src={eventData.poster_url || eventData.image || eventData.bannerImage} 
                      alt="Event Poster" 
                      className="w-full aspect-[4/5] object-cover rounded-xl shadow-lg border border-slate-700"
                    />
                  ) : (
                    <div className="w-full aspect-[4/5] bg-slate-800/40 rounded-xl shadow-inner border border-slate-700 flex flex-col items-center justify-center text-slate-500">
                      <Store size={40} className="mb-2 opacity-30" />
                      <span className="text-[10px] font-medium tracking-wide">รอรูปภาพจากฐานข้อมูล</span>
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                    รายละเอียดงาน
                  </h2>
                  <div className="text-sm text-slate-400 leading-relaxed whitespace-pre-wrap">
                    {displayDescription}
                  </div>
                  <div className="mt-6 flex items-center gap-2 text-sm text-cyan-400 font-medium bg-cyan-400/10 px-3 py-2 rounded-lg w-fit">
                    <MapPin size={16} /> {eventData?.location_name || eventData?.venue || eventData?.hall?.Hall_Name || "ระบุสถานที่"}
                  </div>
                </div>
              </div>

              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-pink-400 mb-4">รอบการแสดง</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 text-sm text-slate-300">
                      <Calendar size={18} className="text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-500 text-xs mb-0.5">เริ่มแสดง</p>
                        <p className="font-medium">{eventData?.show_start_date || formatDBDate(eventData?.event_date_times?.[0]?.startDT)}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 text-sm text-slate-300">
                      <Clock size={18} className="text-slate-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-slate-500 text-xs mb-0.5">จบการแสดง</p>
                        <p className="font-medium">{eventData?.show_end_date || formatDBDate(eventData?.event_date_times?.[0]?.endDT)}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-700/50">
                    <p className="text-yellow-400 text-xs font-bold mb-3 flex items-center gap-1.5">
                      <Ticket size={14} /> ช่วงเวลาขายบัตร
                    </p>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-500">เปิดขาย:</span>
                        <span className="text-white font-medium">{eventData?.sale_start_date || formatDBDate(eventData?.event_date_times?.[0]?.Sale_startDT)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">ปิดขาย:</span>
                        <span className="text-white font-medium">{eventData?.sale_end_date || formatDBDate(eventData?.event_date_times?.[0]?.Sale_endDT)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-[#0F172A] border border-slate-800 rounded-2xl p-6 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-bold text-yellow-400 flex items-center gap-2">
                    <Ticket size={20} /> โซนและราคาบัตร
                  </h3>
                  <button 
                    onClick={() => setIsPreviewOpen(true)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium bg-cyan-400/10 px-3 py-1.5 rounded-full flex items-center gap-1 transition-colors"
                  >
                    <Eye size={14} /> ดูผังที่นั่ง
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="text-slate-400 border-b border-slate-700/50">
                      <tr>
                        <th className="pb-3 font-medium px-4">ชื่อโซน</th>
                        <th className="pb-3 font-medium px-4">ราคา (บาท)</th>
                        <th className="pb-3 font-medium px-4 text-center">ที่นั่งทั้งหมด</th>
                        <th className="pb-3 font-medium px-4 text-right">เหลือที่นั่ง</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/50">
                      {zones.length > 0 ? (
                        zones.map((zone, idx) => (
                          <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                            <td className="py-3 px-4 font-bold text-white">{zone.name || zone.zone_name || zone.zoneName}</td>
                            <td className="py-3 px-4 text-yellow-400 font-mono">{Number(zone.price || zone.priceperTick || 0).toLocaleString()}</td>
                            <td className="py-3 px-4 text-slate-400 text-center font-mono">{zone.total || zone.capacity || zone.totalSeat}</td>
                            <td className="py-3 px-4 text-emerald-400 text-right font-mono font-bold">{zone.remaining ?? zone.remainSeat ?? zone.totalSeat}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="py-6 text-center text-slate-500">ไม่พบข้อมูลโซนที่นั่ง</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}

        </div>
      </div>

      <SeatPreviewModal 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)} 
        tickets={mappedTickets} 
        hallId={derivedHallId} 
        venueSize={derivedVenueSize}
      />
    </div>
  );
}

export default function OrganizerPublishPaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-transparent flex items-center justify-center text-purple-500"><Loader2 className="animate-spin" size={40} /></div>}>
      <OrganizerPaymentContent />
    </Suspense>
  );
}