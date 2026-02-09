"use client";
import { FileText, Scale, Users, Ban, ShieldAlert, CreditCard } from "lucide-react";
import React from "react";

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#05070A] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 border-b border-white/5 pb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-blue-500/10 text-blue-500 mb-6">
            <FileText size={40} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">ข้อกำหนดและเงื่อนไข</h1>
          <p className="text-gray-500">
            มีผลบังคับใช้ตั้งแต่วันที่ 1 มกราคม 2569
          </p>
        </div>

        {/* Content */}
        <div className="space-y-12 text-gray-400 leading-relaxed">
          
          <Section 
            icon={<Scale />} 
            title="1. บททั่วไป" 
            content="การเข้าใช้งานเว็บไซต์ BEATPASS ถือว่าท่านได้อ่าน และตกลงที่จะปฏิบัติตามข้อกำหนดและเงื่อนไขฉบับนี้ หากท่านไม่ยอมรับเงื่อนไขข้อใดข้อหนึ่ง โปรดระงับการใช้งานเว็บไซต์นี้ทันที"
          />

          <Section 
            icon={<Users />} 
            title="2. การสมัครสมาชิก" 
            content="ผู้ใช้งานต้องให้ข้อมูลที่เป็นความจริงและเป็นปัจจุบันในการสมัครสมาชิก ท่านต้องรักษาชื่อผู้ใช้และรหัสผ่านไว้เป็นความลับ และต้องรับผิดชอบต่อกิจกรรมทั้งหมดที่เกิดขึ้นภายใต้บัญชีของท่าน"
          />

          <Section 
            icon={<CreditCard />} 
            title="3. การจองและชำระเงิน" 
            content="การจองบัตรจะเสร็จสมบูรณ์เมื่อท่านชำระเงินเต็มจำนวนและได้รับอีเมลยืนยัน ราคาบัตรที่แสดงรวมภาษีมูลค่าเพิ่มแล้ว การชำระเงินถือเป็นที่สิ้นสุดและไม่สามารถเปลี่ยนแปลงได้"
          />

          {/* ✅ แก้ไขข้อ 4: เน้นย้ำว่า "ไม่คืนเงินทุกกรณี" */}
          <Section 
            icon={<Ban />} 
            title="4. นโยบายการคืนเงิน (Non-Refundable)" 
            content="บริษัทขอสงวนสิทธิ์ไม่รับเปลี่ยนบัตร, เปลี่ยนรอบการแสดง, เปลี่ยนที่นั่ง หรือคืนเงินในทุกกรณี (Non-Refundable) ภายหลังจากที่ได้มีการชำระเงินเสร็จสมบูรณ์แล้ว โปรดตรวจสอบรายละเอียด รอบการแสดง และที่นั่งของท่านให้ถูกต้องครบถ้วนก่อนยืนยันการสั่งซื้อ"
          />

          <Section 
            icon={<ShieldAlert />} 
            title="5. ข้อห้ามในการใช้งาน" 
            content="ห้ามมิให้ผู้ใช้งานใช้โปรแกรมอัตโนมัติ (Bot) หรือวิธีการทางเทคนิคอื่นใดในการจองบัตร หากตรวจสอบพบ บริษัทขอสงวนสิทธิ์ในการยกเลิกบัตรทั้งหมดโดยไม่คืนเงิน และระงับบัญชีผู้ใช้ถาวร"
          />

        </div>

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-white/5 text-center text-gray-600 text-sm">
          หากมีข้อสงสัยเกี่ยวกับข้อกำหนดเหล่านี้ โปรดติดต่อฝ่ายกฎหมายที่ <a href="mailto:legal@beatpass.com" className="text-blue-500 hover:underline">legal@beatpass.com</a>
        </div>

      </div>
    </div>
  );
}

function Section({ icon, title, content }: { icon: React.ReactNode, title: string, content: string }) {
  return (
    <div className="flex gap-6 md:gap-8">
      <div className="hidden md:flex w-12 h-12 rounded-full bg-white/5 items-center justify-center text-blue-400 shrink-0 mt-1">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
          <span className="md:hidden text-blue-400">{icon}</span>
          {title}
        </h3>
        <p className="text-lg font-light text-gray-400">{content}</p>
      </div>
    </div>
  );
}