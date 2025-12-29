"use client";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
// ✅ 1. Import Hook
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  // ✅ 2. เรียกใช้ Hook
  const { t } = useLanguage();

  return (
    <footer className="bg-[#05070A] border-t border-white/5 pt-16 pb-8 text-gray-400 text-sm">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          {/* Column 1: Brand & About */}
          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-blue-500 tracking-tighter drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
              BEATPASS
            </h3>
            {/* ✅ ใช้ t.footer_desc */}
            <p className="leading-relaxed text-gray-500">
              {t.footer_desc}
            </p>
            <div className="flex items-center gap-4 pt-2">
              <SocialIcon icon={<Facebook size={18} />} />
              <SocialIcon icon={<Twitter size={18} />} />
              <SocialIcon icon={<Instagram size={18} />} />
              <SocialIcon icon={<Youtube size={18} />} />
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            {/* ✅ ใช้ t.quick_links */}
            <h4 className="text-white font-bold mb-6 text-base">{t.quick_links}</h4>
            <ul className="space-y-3">
              {/* ✅ ใช้ t.nav_home */}
              <li><Link href="/" className="hover:text-blue-400 transition-colors">{t.nav_home}</Link></li>
              {/* ✅ ใช้ t.nav_category แทน ค้นหางานแสดง เพื่อให้สอดคล้องกับ Navbar */}
              <li><Link href="/search" className="hover:text-blue-400 transition-colors">{t.nav_category}</Link></li>
              {/* ❌ Promotion ถูกลบออกแล้ว */}
              <li><Link href="/register" className="hover:text-blue-400 transition-colors">Register</Link></li>
            </ul>
          </div>

          {/* Column 3: Support */}
          <div>
            {/* ✅ ใช้ t.support */}
            <h4 className="text-white font-bold mb-6 text-base">{t.support}</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-blue-400 transition-colors">How to Buy</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Report Issue</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            {/* ✅ ใช้ t.contact */}
            <h4 className="text-white font-bold mb-6 text-base">{t.contact}</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-blue-500 mt-0.5 shrink-0" />
                <span>123 Cyber Tower, Ratchada Road, Bangkok 10400</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-blue-500 shrink-0" />
                <span>02-123-4567</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-blue-500 shrink-0" />
                <span>support@beatpass.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-gray-600">
          {/* ✅ ใช้ t.rights */}
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

// Helper Component: ปุ่ม Social แบบวงกลม
function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all hover:scale-110">
      {icon}
    </a>
  );
}