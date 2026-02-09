"use client";
import { Lock, Eye, Server, UserCheck, Shield } from "lucide-react";
import React from "react";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#05070A] pt-32 pb-20 px-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-16 border-b border-white/5 pb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-green-500/10 text-green-500 mb-6">
            <Shield size={40} />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">นโยบายความเป็นส่วนตัว</h1>
          <p className="text-gray-500">
            อัปเดตล่าสุด: 8 กุมภาพันธ์ 2569
          </p>
        </div>

        <div className="space-y-12">
          
          {/* Intro */}
          <div className="bg-[#12141a] p-8 rounded-3xl border border-white/5">
            <h2 className="text-2xl font-bold text-white mb-4">บทนำ</h2>
            <p className="text-gray-400 leading-relaxed">
              บริษัท BEATPASS Corporation (&quot;เรา&quot;) ให้ความสำคัญอย่างยิ่งกับการคุ้มครองข้อมูลส่วนบุคคลของท่าน นโยบายฉบับนี้จัดทำขึ้นเพื่อชี้แจงรายละเอียดการเก็บรวบรวมและใช้ข้อมูลตาม พ.ร.บ. คุ้มครองข้อมูลส่วนบุคคล (PDPA)
            </p>
          </div>

          <PrivacySection 
            icon={<UserCheck />}
            title="1. ข้อมูลที่เราจัดเก็บ"
            content={(
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li><strong>ข้อมูลระบุตัวตน:</strong> ชื่อ, นามสกุล, วันเดือนปีเกิด (สำหรับการยืนยันหน้างาน)</li>
                <li><strong>ข้อมูลการติดต่อ:</strong> อีเมล, เบอร์โทรศัพท์</li>
                {/* ✅ แก้ไข: ตัดเรื่องเก็บสลิปออก เหลือแค่สถานะการทำรายการ */}
                <li><strong>ข้อมูลการชำระเงิน:</strong> เราเก็บเฉพาะ <u>ประวัติการทำรายการและสถานะการชำระเงิน</u> (เช่น ชำระสำเร็จ/ไม่สำเร็จ) เท่านั้น <strong>เราไม่มีการจัดเก็บข้อมูลบัญชีธนาคารของท่าน</strong></li>
                <li><strong>ข้อมูลการใช้งาน:</strong> ประวัติการจองบัตร และรายการโปรด</li>
              </ul>
            )}
          />

          <PrivacySection 
            icon={<Server />}
            title="2. วัตถุประสงค์การใช้ข้อมูล"
            content="เราใช้ข้อมูลของท่านเพื่อดำเนินการจองบัตรคอนเสิร์ต, ส่งบัตร E-Ticket ทางอีเมล, และใช้ยืนยันตัวตนก่อนเข้างานเพื่อป้องกันการสวมสิทธิ์"
          />

          <PrivacySection 
            icon={<Eye />}
            title="3. การเปิดเผยข้อมูล"
            content="เราจะไม่เปิดเผยข้อมูลของท่านต่อบุคคลภายนอก ยกเว้นกรณีที่จำเป็นต้องส่งรายชื่อผู้ซื้อบัตรให้กับ 'ผู้จัดงานคอนเสิร์ต' เพื่อทำการตรวจสอบสิทธิ์ในการเข้าชมงานเท่านั้น"
          />

          <PrivacySection 
            icon={<Lock />}
            title="4. ความปลอดภัยของข้อมูล"
            content="ข้อมูลของท่านจะถูกจัดเก็บในเซิร์ฟเวอร์ที่มีระบบความปลอดภัยสูง และมีการเข้ารหัสข้อมูล (Encryption) ระหว่างการรับส่ง เพื่อป้องกันการเข้าถึงจากผู้ไม่หวังดี"
          />

        </div>
        
        <div className="text-center mt-16 text-gray-500 text-sm">
          หากมีข้อสงสัยเกี่ยวกับนโยบายความเป็นส่วนตัว สามารถติดต่อเจ้าหน้าที่ดูแลข้อมูล (DPO) ได้ที่ <br/>
          <a href="mailto:privacy@beatpass.com" className="text-green-500 hover:underline mt-2 inline-block">privacy@beatpass.com</a>
        </div>

      </div>
    </div>
  );
}

function PrivacySection({ icon, title, content }: { icon: React.ReactNode, title: string, content: React.ReactNode }) {
  return (
    <div className="flex gap-6 md:gap-8">
      <div className="hidden md:flex w-12 h-12 rounded-full bg-white/5 items-center justify-center text-green-500 shrink-0 mt-1">
        {icon}
      </div>
      <div>
        <h3 className="text-xl font-bold text-white mb-3 flex items-center gap-3">
          <span className="md:hidden text-green-500">{icon}</span>
          {title}
        </h3>
        <div className="text-lg font-light text-gray-400 leading-relaxed">
          {content}
        </div>
      </div>
    </div>
  );
}