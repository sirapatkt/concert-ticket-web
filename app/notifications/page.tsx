"use client";
import Link from "next/link";
import { 
  ArrowLeft, CheckCircle, Calendar, Tag, Bell, 
  MessageCircle, AlertTriangle, Clock 
} from "lucide-react";

export default function NotificationsPage() {
  
  // Mock Data: ข้อมูลแจ้งเตือนทั้งหมด (เยอะกว่าใน Navbar)
  const allNotifications = [
    { 
      id: 1, 
      title: "จองบัตรสำเร็จ!", 
      desc: "คุณจองบัตร THE BOYZ โซน A1 เรียบร้อยแล้ว หมายเลขคำสั่งซื้อ #BK88291", 
      time: "2 นาทีที่แล้ว", 
      read: false, 
      type: "success" 
    },
    { 
      id: 2, 
      title: "ใกล้ถึงวันงานแล้ว", 
      desc: "คอนเสิร์ต SUMMER SONIC จะเริ่มในอีก 24 ชม. อย่าลืมเตรียมบัตรประชาชนมาด้วยนะครับ", 
      time: "1 ชั่วโมงที่แล้ว", 
      read: false, 
      type: "warning" 
    },
    { 
      id: 3, 
      title: "โปรโมชั่นพิเศษ 🎉", 
      desc: "ส่วนลด 10% สำหรับสมาชิกใหม่ ใช้โค้ด NEW10 (หมดเขต 30 ก.ย.)", 
      time: "1 วันที่แล้ว", 
      read: true, 
      type: "info" 
    },
    { 
      id: 4, 
      title: "ชำระเงินไม่สำเร็จ", 
      desc: "การชำระเงินสำหรับออเดอร์ #BK88100 ถูกปฏิเสธ กรุณาตรวจสอบวงเงินบัตรเครดิต", 
      time: "2 วันที่แล้ว", 
      read: true, 
      type: "error" 
    },
    { 
      id: 5, 
      title: "ประกาศสำคัญจากผู้จัด", 
      desc: "งาน Fan Meeting มีการเปลี่ยนแปลงเวลาแสดงจาก 18:00 เป็น 19:00 น.", 
      time: "1 สัปดาห์ที่แล้ว", 
      read: true, 
      type: "alert" 
    },
  ];

  // ฟังก์ชันเลือกไอคอนตามประเภท
  const getIcon = (type: string) => {
    switch (type) {
      case "success": return <CheckCircle size={24} className="text-green-400" />;
      case "warning": return <Calendar size={24} className="text-orange-400" />;
      case "info": return <Tag size={24} className="text-blue-400" />;
      case "error": return <AlertTriangle size={24} className="text-red-400" />;
      case "alert": return <MessageCircle size={24} className="text-yellow-400" />;
      default: return <Bell size={24} className="text-gray-400" />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white pt-24 pb-10">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link href="/" className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              ประวัติการแจ้งเตือน <span className="text-sm font-normal text-gray-500">({allNotifications.length})</span>
            </h1>
            <p className="text-gray-400 text-sm">รายการแจ้งเตือนย้อนหลังทั้งหมดของคุณ</p>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {allNotifications.map((item) => (
            <div 
              key={item.id} 
              className={`p-5 rounded-2xl border border-white/5 transition-all hover:border-white/20 flex gap-4 ${
                !item.read ? 'bg-[#161B22] shadow-lg shadow-blue-900/10 border-l-4 border-l-blue-500' : 'bg-[#12161B] opacity-80 hover:opacity-100'
              }`}
            >
              {/* Icon */}
              <div className="mt-1 p-3 rounded-full bg-white/5 h-fit">
                {getIcon(item.type)}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`text-lg mb-1 ${!item.read ? 'font-bold text-white' : 'font-medium text-gray-300'}`}>
                    {item.title}
                  </h3>
                  <span className="text-xs text-gray-500 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full whitespace-nowrap">
                    <Clock size={12} /> {item.time}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>

                {/* Badge สถานะ */}
                {!item.read && (
                  <span className="inline-block mt-3 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    ใหม่
                  </span>
                )}
              </div>
            </div>
          ))}

          {allNotifications.length === 0 && (
             <div className="text-center py-20 text-gray-500">
                <Bell size={48} className="mx-auto mb-4 opacity-20" />
                ไม่มีประวัติการแจ้งเตือน
             </div>
          )}
        </div>

      </div>
    </div>
  );
}