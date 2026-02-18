"use client";

import { BookOpen, Calendar, DollarSign, Users, ChevronRight, Search } from "lucide-react";

export default function ManualPage() {
  const categories = [
    {
      title: "การจัดการอีเวนต์",
      icon: Calendar,
      articles: [
        "วิธีสร้างอีเวนต์ใหม่และตั้งค่าผังที่นั่ง",
        "การแก้ไขข้อมูลงานและการเลื่อนวันแสดง",
        "วิธีกำหนดราคาบัตร (Tier Pricing)",
      ]
    },
    {
      title: "การเงินและรายได้",
      icon: DollarSign,
      articles: [
        "ช่องทางการรับเงินและรอบการโอน",
        "วิธีดูรายงานสรุปยอดขายแบบ Real-time",
        "การขอใบกำกับภาษี/ใบเสร็จรับเงิน",
      ]
    },
    {
      title: "ผู้เข้าร่วมงาน & เช็คอิน",
      icon: Users,
      articles: [
        "วิธีใช้งานระบบ QR Code Check-in",
        "การจัดการลูกค้าและคืนเงิน (Refund)",
        "การส่งอีเมลหาผู้ซื้อบัตร",
      ]
    },
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-white mb-4">คู่มือการใช้งาน (User Manual)</h1>
        <p className="text-slate-400 mb-8">เรียนรู้วิธีใช้งานระบบ BEATPASS อย่างเต็มประสิทธิภาพ</p>
        
        {/* Search Bar */}
        <div className="relative max-w-xl mx-auto">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="ค้นหาหัวข้อที่คุณสงสัย..." 
            className="w-full bg-slate-800 border border-slate-700 rounded-full py-3 pl-12 pr-6 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((cat, index) => (
          <div key={index} className="bg-[#0f172a] border border-slate-800 rounded-2xl p-6 hover:border-slate-600 transition-all group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
              <cat.icon size={24} />
            </div>
            <h2 className="text-xl font-semibold text-white mb-4">{cat.title}</h2>
            <ul className="space-y-3">
              {cat.articles.map((article, i) => (
                <li key={i} className="flex items-start gap-2 text-slate-400 hover:text-blue-400 cursor-pointer text-sm transition-colors">
                  <ChevronRight size={16} className="mt-0.5 shrink-0" />
                  <span>{article}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}