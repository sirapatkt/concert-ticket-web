"use client";
import { useRouter } from "next/navigation";
// ✅ 1. เรียกใช้ useUser จากไฟล์ Context เดิมของคุณ
import { useUser } from "@/context/UserContext"; 
import { 
  ArrowLeft, CheckCircle, Calendar, Tag, Bell, 
  MessageCircle, AlertTriangle, Clock 
} from "lucide-react";

export default function NotificationsPage() {
  const router = useRouter();
  
  // ✅ 2. ดึงค่า user จาก Context เดิม
  const { user } = useUser();
  
  // ✅ 3. เช็คสถานะ: ถ้า user ไม่เป็น null แสดงว่า "ล็อกอินแล้ว"
  const isLoggedIn = !!user; 

  // ==========================================
  // ข้อมูลสำหรับ GUEST (ยังไม่ล็อกอิน)
  // ==========================================
  const guestNotifications = [
    { 
      id: 101, 
      title: "🔥 กำลังฮิต: คอนเสิร์ต Bruno Mars", 
      desc: "บัตรโซนยืนเหลือน้อยกว่า 100 ใบแล้ว! รีบสมัครสมาชิกเพื่อกดจองก่อนใคร", 
      time: "10 นาทีที่แล้ว", 
      read: false, 
      type: "info", 
      link: "/register" 
    },
    { 
      id: 102, 
      title: "ต้อนรับสมาชิกใหม่ ลด 10%", 
      desc: "สมัครสมาชิกวันนี้ รับโค้ดส่วนลด NEWUSER ไปเลยทันที", 
      time: "1 วันที่แล้ว", 
      read: false, 
      type: "info", 
      link: "/register"
    },
    { 
      id: 103, 
      title: "ประกาศ: ผังคอนเสิร์ต SUMMER SONIC", 
      desc: "เปิดเผยผังที่นั่งและราคาบัตรอย่างเป็นทางการ เช็คเลย!", 
      time: "2 วันที่แล้ว", 
      read: true, 
      type: "alert", 
      link: "/event/summer-sonic"
    }
  ];

  // ==========================================
  // ข้อมูลสำหรับ MEMBER (ล็อกอินแล้ว)
  // ==========================================
  const memberNotifications = [
    { 
      id: 1, 
      title: "❌ ชำระเงินไม่สำเร็จ", 
      desc: "ออเดอร์ #BK88100 ถูกปฏิเสธ โปรดชำระใหม่ภายใน 15 นาที", 
      time: "2 นาทีที่แล้ว", 
      read: false, 
      type: "error", // Priority 1
      link: "/payment/retry" 
    },
    { 
      id: 2, 
      title: "✅ จองบัตรสำเร็จ!", 
      desc: "ได้บัตร THE BOYZ โซน A1 แล้ว (E-Ticket พร้อมใช้งาน)", 
      time: "10 นาทีที่แล้ว", 
      read: false, 
      type: "success", // Priority 3
      link: "/ticket" 
    },
    { 
      id: 3, 
      title: "⚠️ ใกล้ถึงวันงานแล้ว", 
      desc: "SUMMER SONIC เริ่มพรุ่งนี้ เตรียมบัตรประชาชนให้พร้อม", 
      time: "1 ชั่วโมงที่แล้ว", 
      read: true, 
      type: "warning", // Priority 2
      link: "/event/1" 
    },
    { 
      id: 4, 
      title: "มาใหม่! คอนเสิร์ต Bruno Mars", 
      desc: "เปิดขายบัตรวันเสาร์หน้า เวลา 10:00 น.", 
      time: "2 ชั่วโมงที่แล้ว", 
      read: false, 
      type: "info", // Priority 5
      link: "/event/2" 
    }
  ];

  // ✅ 4. เลือกชุดข้อมูลตามตัวแปร isLoggedIn ที่เราสร้างขึ้น
  const activeList = isLoggedIn ? memberNotifications : guestNotifications;

  // Logic จัดลำดับ (Sorting) เหมือนเดิม
  const sortedNotifications = [...activeList].sort((a, b) => {
    if (a.read !== b.read) return a.read ? 1 : -1;
    const priority: Record<string, number> = { 
      error: 1, warning: 2, success: 3, alert: 4, info: 5 
    };
    return (priority[a.type] || 99) - (priority[b.type] || 99);
  });

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

  const handleClick = (link: string | null | undefined) => {
    if (link) router.push(link);
  };

  return (
    <div className="min-h-screen bg-[#0B0F14] text-white pt-24 pb-10 font-sans">
      <div className="max-w-3xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={() => router.back()} 
            className="p-2 rounded-full bg-white/5 hover:bg-white/10 transition-colors group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform"/>
          </button>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              การแจ้งเตือน <span className="text-sm font-normal text-gray-500">({sortedNotifications.length})</span>
            </h1>
            <p className="text-gray-400 text-sm">
              {/* เปลี่ยนข้อความตามสถานะ */}
              {isLoggedIn ? "อัปเดตสถานะการจองและข่าวสารของคุณ" : "ข่าวสารและโปรโมชั่นล่าสุด"}
            </p>
          </div>
        </div>

        {/* Notification List */}
        <div className="space-y-4">
          {sortedNotifications.map((item) => (
            <div 
              key={item.id} 
              onClick={() => handleClick(item.link)}
              className={`p-5 rounded-2xl border transition-all duration-200 flex gap-4 group relative
                ${item.link ? 'cursor-pointer hover:-translate-y-1 hover:shadow-xl hover:shadow-blue-900/10' : 'cursor-default'}
                ${!item.read 
                  ? 'bg-[#161B22] border-l-4 border-l-blue-500 border-t border-r border-b border-white/5' 
                  : 'bg-[#12161B] border border-white/5 opacity-80 hover:opacity-100'
                }
                hover:border-white/20
              `}
            >
              <div className="mt-1 p-3 rounded-full bg-white/5 h-fit shrink-0">
                {getIcon(item.type)}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <h3 className={`text-lg mb-1 transition-colors ${
                      !item.read ? 'font-bold text-white' : 'font-medium text-gray-300'
                    } ${item.link ? 'group-hover:text-blue-400' : ''}`}
                  >
                    {item.title}
                  </h3>
                  <span className="text-xs text-gray-500 flex items-center gap-1 bg-white/5 px-2 py-1 rounded-full whitespace-nowrap">
                    <Clock size={12} /> {item.time}
                  </span>
                </div>
                
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.desc}
                </p>

                {!item.read && (
                  <span className="inline-block mt-3 text-[10px] font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    ใหม่
                  </span>
                )}
              </div>
            </div>
          ))}

          {sortedNotifications.length === 0 && (
             <div className="text-center py-20 text-gray-500">
                <Bell size={48} className="mx-auto mb-4 opacity-20" />
                ไม่มีรายการแจ้งเตือน
             </div>
          )}
        </div>

      </div>
    </div>
  );
}