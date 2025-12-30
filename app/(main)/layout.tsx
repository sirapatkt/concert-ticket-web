import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      
      {/* ✅ ย้าย Style pt-20 และ bg สีดำ มาใส่ตรงนี้แทน */}
      <main className="pt-20 min-h-screen bg-[#0B0F14]">
        {children}
      </main>

      <Footer />
    </>
  );
}