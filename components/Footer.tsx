"use client";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-[#05070A] border-t border-white/5 pt-16 pb-8 text-gray-400 text-sm relative z-10">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & Desc */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-500 tracking-tighter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              BEATPASS
            </h3>
            {/* ✅ ใช้ t.footer_desc แทนข้อความไทย */}
            <p className="leading-relaxed text-gray-500">
              {t.footer_desc}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <SocialIcon icon={<Facebook size={18} />} href="https://facebook.com" />
              <SocialIcon icon={<Twitter size={18} />} href="https://twitter.com" />
              <SocialIcon icon={<Instagram size={18} />} href="https://instagram.com" />
              <SocialIcon icon={<Youtube size={18} />} href="https://youtube.com" />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-6 text-base">{t.quick_links}</h4>
            <ul className="space-y-3">
              {/* ✅ ใช้ t.nav_home แทน "หน้าแรก" */}
              <li><Link href="/" className="hover:text-blue-400 transition-colors">{t.nav_home}</Link></li>
              {/* ✅ ใช้ t.nav_category แทน "หมวดหมู่งาน" */}
              <li><Link href="/category" className="hover:text-blue-400 transition-colors">{t.nav_category}</Link></li>
              {/* ✅ ใช้ t.nav_register แทน "สมัครสมาชิก" (อันนี้แหละที่ในรูปยังเป็นไทยอยู่) */}
              <li><Link href="/register" className="hover:text-blue-400 transition-colors">{t.nav_register}</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            <h4 className="text-white font-bold mb-6 text-base">{t.support}</h4>
            <ul className="space-y-3">
              <li>
                {/* ✅ ใช้ t.footer_how_to_buy แทน "วิธีการชำระเงิน" */}
                <Link href="/how-to-buy" className="hover:text-blue-400 transition-colors">
                  {t.footer_how_to_buy}
                </Link>
              </li>
              <li>
                {/* ✅ ใช้ t.footer_contact_us แทน "ติดต่อเรา" */}
                <Link href="/report-issue" className="hover:text-blue-400 transition-colors">
                  {t.footer_contact_us}
                </Link>
              </li>
              <li>
                {/* ✅ ใช้ t.footer_faq แทน "คำถามที่พบบ่อย" */}
                <Link href="/faq" className="hover:text-blue-400 transition-colors">
                  {t.footer_faq}
                </Link>
              </li>
              <li>
                {/* ✅ ใช้ t.footer_terms แทน "ข้อกำหนดและเงื่อนไข" */}
                <Link href="/terms" className="hover:text-blue-400 transition-colors">
                  {t.footer_terms}
                </Link>
              </li>
              <li>
                {/* ✅ ใช้ t.footer_privacy แทน "นโยบายความเป็นส่วนตัว" */}
                <Link href="/privacy" className="hover:text-blue-400 transition-colors">
                  {t.footer_privacy}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact Us */}
          <div>
            <h4 className="text-white font-bold mb-6 text-base">{t.contact}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 mt-0.5 shrink-0" />
                {/* ✅ ใช้ t.footer_address แทนที่อยู่ภาษาไทย */}
                <span>{t.footer_address}</span>
              </li>
              <li className="flex items-center gap-3">
                <a href="tel:021234567" className="hover:text-white transition-colors flex items-center gap-3">
                   <Phone size={18} className="text-blue-500 shrink-0" />
                   <span>02-123-4567</span>
                </a>
              </li>
              <li className="flex items-center gap-3">
                <a href="mailto:support@beatpass.com" className="hover:text-white transition-colors flex items-center gap-3">
                  <Mail size={18} className="text-blue-500 shrink-0" />
                  <span>support@beatpass.com</span>
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          {/* ✅ ใช้ t.rights แทน "สงวนลิขสิทธิ์" */}
          <p>&copy; 2026 BEATPASS Corporation. {t.rights}</p>
          <div className="flex gap-6">
            <span>Version 1.0.0 (Beta)</span>
            <span>Made with ❤️ in Bangkok</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href?: string }) {
  return (
    <a 
      href={href || undefined}
      target="_blank"
      rel="noopener noreferrer"
      className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all hover:scale-110 cursor-pointer"
      onClick={(e) => !href && e.preventDefault()}
    >
      {icon}
    </a>
  );
}