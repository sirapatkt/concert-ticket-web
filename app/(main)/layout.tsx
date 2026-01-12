"use client";

// ✅ 1. เพิ่ม import usePathname เพื่อเช็ค URL
import { usePathname } from "next/navigation"; 

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext"; 
import { UserProvider } from "@/context/UserContext"; 
import { LanguageProvider } from "@/context/LanguageContext"; 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // ✅ 2. ดึงค่า URL ปัจจุบันมาเช็ค
  const pathname = usePathname();

  // ✅ 3. สร้างเงื่อนไข: ถ้า URL มีคำว่า "/booking" ให้ถือว่าเป็นหน้าจอง (ซ่อน Footer)
  // หรือถ้าอยากระบุเจาะจงเฉพาะหน้าเลือกที่นั่ง ก็ใช้ pathname?.includes("/booking/select-seat")
  const isBookingPage = pathname?.includes("/booking");

  return (
    <LanguageProvider>
      <UserProvider>
        <CartProvider>
          
          <Navbar />
          
          <main className="min-h-screen bg-[#0B0F14]">
            {children}
          </main>

          {/* ✅ 4. สั่งให้แสดง Footer เฉพาะตอนที่ "ไม่ใช่" หน้า Booking */}
          {!isBookingPage && <Footer />}
          
        </CartProvider>
      </UserProvider>
    </LanguageProvider>
  );
}