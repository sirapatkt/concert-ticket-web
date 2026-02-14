"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, Printer, Download, User, 
  CreditCard, Calendar, Clock, CheckCircle, 
  XCircle, AlertCircle, FileText, Tag 
} from "lucide-react";

// 1. ประกาศ Interfaces เพื่อกำหนดโครงสร้างข้อมูล
interface Customer {
  name: string;
  email: string;
  phone: string;
  id: string;
}

interface TransactionItem {
  name: string;
  type: string;
  price: string;
  qty: number;
}

interface Fees {
  subtotal: string;
  serviceFee: string;
  vat: string;
  total: string;
}

interface TimelineEvent {
  status: string;
  time: string;
  completed: boolean;
}

interface TransactionData {
  id: string;
  status: string;
  amount: string;
  date: string;
  time: string;
  paymentMethod: string;
  customer: Customer;
  items: TransactionItem[];
  fees: Fees;
  timeline: TimelineEvent[];
}

export default function TransactionDetailPage() {
  const params = useParams();
  const { id } = params; 

  // 2. ✅ Mock Data: เหลือไว้ 1 ตัวอย่าง และ Default สำหรับกัน Error
  const transactions: Record<string, TransactionData> = {
    "TX-8821": {
      id: "TX-8821",
      status: "success",
      amount: "6,500.00",
      date: "12 ก.พ. 2026",
      time: "14:30 น.",
      paymentMethod: "Credit Card (Visa ending 4242)",
      customer: {
        name: "สมชาย ใจดี",
        email: "somchai@gmail.com",
        phone: "081-234-5678",
        id: "User #8821"
      },
      items: [
        { name: "Jeff Satur: Space Shuttle Concert", type: "Zone A (Standing)", price: "6,000.00", qty: 1 }
      ],
      fees: {
        subtotal: "6,000.00",
        serviceFee: "300.00",
        vat: "200.00",
        total: "6,500.00"
      },
      timeline: [
        { status: "ทำรายการสั่งซื้อ", time: "14:28 น.", completed: true },
        { status: "ชำระเงินสำเร็จ", time: "14:30 น.", completed: true },
        { status: "ส่ง E-Ticket ทางอีเมล", time: "14:31 น.", completed: true },
      ]
    },
    // Fallback data กรณีหา ID ไม่เจอ
    "default": {
      id: "TX-????",
      status: "pending",
      amount: "0.00",
      date: "-",
      time: "-",
      paymentMethod: "-",
      customer: { name: "-", email: "-", phone: "-", id: "-" },
      items: [],
      fees: { subtotal: "0", serviceFee: "0", vat: "0", total: "0" },
      timeline: []
    }
  };

  // ดึงข้อมูลตาม ID หรือใช้ Default ถ้าไม่เจอ
  const data = transactions[(id as string)] || transactions["default"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "success": return "bg-green-500/10 text-green-400 border-green-500/20";
      case "refunded": return "bg-red-500/10 text-red-400 border-red-500/20";
      case "pending": return "bg-yellow-500/10 text-yellow-400 border-yellow-500/20";
      default: return "bg-gray-500/10 text-gray-400 border-gray-500/20";
    }
  };

  return (
    <div className="p-6 lg:p-8 min-h-screen bg-[#0B0F14] text-white font-sans animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Back Button */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <Link href="/admin/finance" className="p-2 rounded-xl bg-[#161B22] border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">รายละเอียดธุรกรรม</h1>
                <span className={`px-3 py-0.5 rounded-full text-xs font-bold border ${getStatusColor(data.status)} uppercase flex items-center gap-1`}>
                    {data.status === 'success' ? <CheckCircle size={12}/> : data.status === 'refunded' ? <AlertCircle size={12}/> : <Clock size={12}/>}
                    {data.status}
                </span>
            </div>
            <p className="text-gray-400 text-sm mt-1 flex items-center gap-2">
                Transaction ID: <span className="font-mono text-white bg-white/10 px-2 rounded">{data.id}</span>
            </p>
          </div>
        </div>

        <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-[#161B22] border border-white/10 rounded-xl text-sm font-bold text-gray-300 hover:text-white hover:border-white/20 transition-all cursor-pointer">
                <Printer size={16}/> พิมพ์ใบเสร็จ
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-bold text-white shadow-lg shadow-blue-900/20 transition-all cursor-pointer">
                <Download size={16}/> Export PDF
            </button>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Column */}
        <div className="xl:col-span-2 space-y-6">
            
            {/* Card: Amount */}
            <div className="bg-[#161B22] border border-white/5 rounded-2xl p-8 flex justify-between items-center relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-gray-400 mb-1 text-sm">ยอดชำระสุทธิ (Total Amount)</p>
                    <h2 className={`text-4xl font-bold ${data.status === 'refunded' ? 'text-red-400' : 'text-green-400'}`}>
                        {data.status === 'refunded' ? '' : '+'}฿{data.amount}
                    </h2>
                </div>
                <div className={`p-4 rounded-full ${data.status === 'refunded' ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                    <FileText size={32} />
                </div>
                <div className={`absolute -right-10 -top-10 w-40 h-40 rounded-full blur-3xl opacity-10 ${data.status === 'refunded' ? 'bg-red-500' : 'bg-green-500'}`}></div>
            </div>

            {/* Card: Items */}
            <div className="bg-[#161B22] border border-white/5 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                    <Tag size={18} className="text-purple-400"/> รายการสินค้า (Items)
                </h3>
                <div className="space-y-4">
                    {data.items.map((item, i) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-[#0B0F14] border border-white/5 rounded-xl">
                            <div>
                                <p className="font-bold text-white">{item.name}</p>
                                <p className="text-sm text-gray-400 mt-1">ประเภท: {item.type}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-bold text-white">฿{item.price}</p>
                                <p className="text-sm text-gray-500">x {item.qty}</p>
                            </div>
                        </div>
                    ))}
                    {data.items.length === 0 && <p className="text-center text-gray-500 py-4">ไม่พบข้อมูลสินค้า</p>}
                </div>
                
                {/* Summary Table */}
                <div className="mt-6 border-t border-white/5 pt-4 space-y-2">
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>มูลค่าสินค้า (Subtotal)</span>
                        <span>฿{data.fees.subtotal}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>ค่าธรรมเนียม (Service Fee)</span>
                        <span>฿{data.fees.serviceFee}</span>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400">
                        <span>ภาษี (VAT 7%)</span>
                        <span>฿{data.fees.vat}</span>
                    </div>
                    <div className="flex justify-between text-lg font-bold text-white border-t border-white/10 pt-3 mt-3">
                        <span>ยอดรวมทั้งสิ้น</span>
                        <span className={data.status === 'refunded' ? 'text-red-400' : 'text-green-400'}>฿{data.fees.total}</span>
                    </div>
                </div>
            </div>

            {/* Card: Customer */}
            <div className="bg-[#161B22] border border-white/5 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                    <User size={18} className="text-blue-400"/> ข้อมูลลูกค้า (Customer)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <p className="text-xs text-gray-500 mb-1">ชื่อ-นามสกุล</p>
                        <p className="font-medium">{data.customer.name}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">User ID</p>
                        <p className="font-medium font-mono text-blue-400">{data.customer.id}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">อีเมล</p>
                        <p className="font-medium">{data.customer.email}</p>
                    </div>
                    <div>
                        <p className="text-xs text-gray-500 mb-1">เบอร์โทรศัพท์</p>
                        <p className="font-medium">{data.customer.phone}</p>
                    </div>
                </div>
            </div>

        </div>

        {/* Right Column */}
        <div className="space-y-6">
            
            {/* Payment Info */}
            <div className="bg-[#161B22] border border-white/5 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-white mb-4 flex items-center gap-2">
                    <CreditCard size={18} className="text-orange-400"/> การชำระเงิน
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                            <CreditCard size={20}/>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">ช่องทางชำระเงิน</p>
                            <p className="font-medium text-sm">{data.paymentMethod}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                            <Calendar size={20}/>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">วันที่ทำรายการ</p>
                            <p className="font-medium text-sm">{data.date}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-white/5 rounded-lg text-gray-400">
                            <Clock size={20}/>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500">เวลา</p>
                            <p className="font-medium text-sm">{data.time}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="bg-[#161B22] border border-white/5 rounded-2xl p-6">
                <h3 className="font-bold text-lg text-white mb-4">ไทม์ไลน์ (Activity)</h3>
                <div className="space-y-6 relative pl-2">
                    {/* เส้นเชื่อม */}
                    <div className="absolute left-[15px] top-2 bottom-2 w-[2px] bg-white/5"></div>

                    {data.timeline.map((event, i) => (
                        <div key={i} className="flex gap-4 relative z-10">
                            <div className={`w-3 h-3 rounded-full mt-1.5 border-2 ${event.completed ? 'bg-green-500 border-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-[#0B0F14] border-gray-600'}`}></div>
                            <div>
                                <p className={`text-sm font-bold ${event.completed ? 'text-white' : 'text-gray-500'}`}>{event.status}</p>
                                <p className="text-xs text-gray-500">{event.time}</p>
                            </div>
                        </div>
                    ))}
                    {data.timeline.length === 0 && <p className="text-sm text-gray-500 italic">ไม่มีข้อมูลไทม์ไลน์</p>}
                </div>
            </div>
        </div>

      </div>
    </div>
  );
}