"use client"; 
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext"; 
// ✅ 1. Import Provider ที่ขาดหายไป
import { UserProvider } from "@/context/UserContext"; 
import { LanguageProvider } from "@/context/LanguageContext"; 

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // ✅ 2. เรียงลำดับการครอบ Provider ให้ครบถ้วน
    <LanguageProvider>
      <UserProvider> {/* 👈 ตัวนี้สำคัญมาก! แก้ Error setProfileImage */}
        <CartProvider> 
          
          <Navbar />
          
          <main className="min-h-screen bg-[#0B0F14]">
            {children}
          </main>

          <Footer />
          
        </CartProvider>
      </UserProvider>
    </LanguageProvider>
  );
}