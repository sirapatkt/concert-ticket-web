"use client"; // ✅ ต้องใส่เพราะเราต้องใช้ Provider ที่เป็น Client Component
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { CartProvider } from "@/context/CartContext"; // ✅ Import ตะกร้ามาครอบ

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider> {/* 🛒 ครอบตะกร้าเพื่อให้ทุกหน้า (children) เข้าถึงข้อมูลได้ */}
      <Navbar />
      
      <main className="min-h-screen bg-[#0B0F14]">
        {children}
      </main>

      <Footer />
    </CartProvider>
  );
}