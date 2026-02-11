"use client";
import { useRouter } from "next/navigation";
import { 
  CheckCircle, Calendar, BellRing, Tag, 
  AlertTriangle, MessageCircle, Bell 
} from "lucide-react";

// ✅ Export Type เพื่อให้ Navbar เอาไปใช้ได้
export interface NotificationItem {
  id: number;
  type: string;
  title: string;
  desc: string;
  time: string;
  link: string;
  read: boolean;
}

interface Props {
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
}

export default function NotificationDropdown({ notifications, onMarkAllAsRead }: Props) {
  const router = useRouter();

  const handleClick = (noti: NotificationItem) => {
    if (noti.link) router.push(noti.link);
  };

  // ✅ ฟังก์ชันเลือก Icon และสีตามประเภท (รองรับครบทุกแบบ)
  const getIcon = (type: string) => {
    switch (type) {
      case "booking": 
      case "success":
        return <CheckCircle size={20} className="text-green-400" />;
      case "event":
      case "warning":
        return <Calendar size={20} className="text-orange-400" />;
      case "info": 
        return <Tag size={20} className="text-blue-400" />;
      case "alert": 
      case "error":
        return <AlertTriangle size={20} className="text-red-400" />;
      case "system": 
        return <MessageCircle size={20} className="text-yellow-400" />;
      default: 
        return <Bell size={20} className="text-gray-400" />;
    }
  };

  // ✅ ฟังก์ชันเลือกสีพื้นหลังของ Icon
  const getIconBg = (type: string) => {
    switch (type) {
      case "booking": 
      case "success": return "bg-green-500/10";
      case "event":
      case "warning": return "bg-orange-500/10";
      case "info": return "bg-blue-500/10";
      case "alert": 
      case "error": return "bg-red-500/10";
      case "system": return "bg-yellow-500/10";
      default: return "bg-white/5";
    }
  };

  return (
    <div className="w-80 md:w-96 bg-[#161B22] border border-white/10 rounded-xl overflow-hidden shadow-2xl text-white font-sans">
      
      {/* Header */}
      <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0B0F14]">
        <h3 className="font-bold text-base">การแจ้งเตือน</h3>
        <button 
          onClick={onMarkAllAsRead} 
          className="text-xs text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
        >
          อ่านทั้งหมด
        </button>
      </div>

      {/* List items */}
      <div className="max-h-[450px] overflow-y-auto custom-scrollbar">
        {notifications.length > 0 ? (
          notifications.map((item) => (
            <div 
              key={item.id}
              onClick={() => handleClick(item)}
              className={`p-4 border-b border-white/5 hover:bg-white/5 cursor-pointer transition-colors flex gap-4 items-start group relative ${
                !item.read ? "bg-white/[0.02]" : ""
              }`}
            >
              {/* จุดแดงเล็กๆ หน้าข้อความที่ยังไม่อ่าน */}
              {!item.read && (
                <span className="absolute top-4 left-2 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
              )}

              {/* Icon (เรียกใช้ฟังก์ชัน getIcon) */}
              <div className={`mt-1 p-2.5 rounded-full shrink-0 ${getIconBg(item.type)}`}>
                {getIcon(item.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={`text-sm mb-1 truncate ${!item.read ? 'font-bold text-white' : 'font-medium text-gray-300 group-hover:text-[#00B4D8] transition-colors'}`}>
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{item.desc}</p>
                <span className="text-[10px] text-gray-500 mt-1.5 block">{item.time}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="py-10 text-center text-gray-500">
            <Bell size={32} className="mx-auto mb-2 opacity-20" />
            <p className="text-xs">ไม่มีการแจ้งเตือนใหม่</p>
          </div>
        )}
      </div>
      
      {/* Footer */}
      <div className="p-3 text-center border-t border-white/5 bg-[#0B0F14]">
         <button 
           onClick={() => router.push('/notifications')}
           className="text-xs text-gray-400 hover:text-white transition-colors w-full py-1 font-medium"
         >
           ดูประวัติการแจ้งเตือน
         </button>
      </div>
    </div>
  );
}