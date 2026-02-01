// 📂 ไฟล์: app/admin/page.tsx
import Link from 'next/link';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-red-600">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">แผงควบคุมสำหรับผู้ดูแลระบบ (Person 2)</p>
        </div>
        <div className="px-4 py-2 bg-red-100 text-red-700 rounded-lg font-semibold border border-red-200">
          Super Admin
        </div>
      </div>

      {/* Stats Cards (ภาพรวมระบบ) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-400">
          <h3 className="text-gray-500 text-sm font-medium">คำขอจัดงานใหม่ (รออนุมัติ)</h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">5 <span className="text-lg font-normal text-gray-400">งาน</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-blue-500">
          <h3 className="text-gray-500 text-sm font-medium">สมาชิกทั้งหมด</h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">1,240 <span className="text-lg font-normal text-gray-400">คน</span></p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <h3 className="text-gray-500 text-sm font-medium">รายได้รวม Platform</h3>
          <p className="text-4xl font-bold text-gray-800 mt-2">฿450,000</p>
        </div>
      </div>

      {/* Action Menu (เมนูจัดการ) */}
      <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4 border-b pb-2">เมนูจัดการระบบ</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <button className="flex flex-col items-center justify-center p-6 bg-red-50 hover:bg-red-100 rounded-lg border border-red-100 transition-colors group cursor-pointer">
            <span className="text-red-600 font-bold text-lg mb-1 group-hover:scale-105 transition-transform">อนุมัติอีเวนต์</span>
            <span className="text-red-400 text-sm">ตรวจสอบงานที่ขอเข้ามา</span>
          </button>
          
          <button className="flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors cursor-pointer">
            <span className="text-gray-700 font-bold text-lg mb-1">จัดการผู้ใช้งาน</span>
            <span className="text-gray-500 text-sm">แบน/แก้ไขสมาชิก</span>
          </button>

          <button className="flex flex-col items-center justify-center p-6 bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors cursor-pointer">
            <span className="text-gray-700 font-bold text-lg mb-1">รายงานการขาย</span>
            <span className="text-gray-500 text-sm">ดูสถิติรายได้</span>
          </button>
        </div>
      </div>
    </div>
  );
}