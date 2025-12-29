import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
// ✅ 1. Import ตัวจัดการภาษาเข้ามา (ต้องสร้างไฟล์ context/LanguageContext.tsx ก่อนนะครับ)
import { LanguageProvider } from "@/context/LanguageContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "BEATPASS - Concert Ticket Platform",
  description: "จองบัตรคอนเสิร์ตออนไลน์",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* ✅ 2. ครอบด้วย LanguageProvider เพื่อให้ส่งค่าภาษาไปให้ทุกส่วนข้างใน */}
        <LanguageProvider>
          
          <Navbar /> 
          
          <main className="pt-20 min-h-screen bg-[#0B0F14]"> 
            {children}
          </main>

          <Footer />
          
        </LanguageProvider>
      </body>
    </html>
  );
}