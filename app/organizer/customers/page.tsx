"use client";

import { useState, useEffect } from "react";
import { Search, Filter, UserCheck, UserX, Mail, Loader2 } from 'lucide-react';

// 1. สร้าง Interface เพื่อบอก TypeScript ว่าข้อมูล customer มีหน้าตาแบบไหน (แก้ปัญหา any แดง)
interface Customer {
  id: string | number;
  firstname: string;
  lastname: string;
  email: string;
  ticket: string;
  eventName: string;
  status: string;
}

export default function CustomersPage() {
  // 2. ใส่ Type <Customer[]> ให้กับ useState
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);

  // ดึงข้อมูลจาก API
  useEffect(() => {
    const fetchCustomers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch("http://127.0.0.1:8000/api/organizer/attendees", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setCustomers(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="space-y-8">
      {/* ... (ส่วน Header ของคุณ) ... */}

      <div className="bg-[#0F172A] rounded-2xl border border-slate-800 overflow-hidden shadow-xl">
        <table className="w-full text-left">
          <thead className="bg-slate-900/50 text-slate-400 border-b border-slate-800">
            <tr>
              <th className="p-4 pl-6">ชื่อ-นามสกุล</th>
              <th className="p-4">ประเภทบัตร</th>
              <th className="p-4">งานอีเวนต์</th>
              <th className="p-4 text-center">สถานะ</th>
              <th className="p-4 pr-6 text-right">ติดต่อ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800 text-slate-300">
            {loading ? (
              <tr>
                <td colSpan={5} className="p-10 text-center">
                  <Loader2 className="animate-spin inline mr-2" /> กำลังโหลด...
                </td>
              </tr>
            ) : (
              // 3. เอา any ออกได้เลย เพราะเรากำหนด type ให้ state ด้านบนแล้ว
              customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="p-4 pl-6">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">{c.firstname} {c.lastname}</span>
                      <span className="text-xs text-slate-500">{c.email}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-700">
                      {c.ticket}
                    </span>
                  </td>
                  <td className="p-4">{c.eventName}</td>
                  <td className="p-4 text-center">
                    {c.status === 'paid' || c.status === 'checked_in' ? (
                      <span className="inline-flex items-center gap-1 text-green-400 bg-green-500/10 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                        <UserCheck size={14} /> ยืนยันแล้ว
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-yellow-400 bg-yellow-500/10 px-3 py-1 rounded-full text-xs font-bold border border-yellow-500/20">
                        <UserX size={14} /> รอชำระ/รอเช็คอิน
                      </span>
                    )}
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="text-slate-400 hover:text-white p-2 hover:bg-slate-700 rounded-full transition-all">
                      <Mail size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}