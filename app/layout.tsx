import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
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
        {/* ✅ เหลือแค่ Provider กับ children เปล่าๆ */}
        {/* Navbar กับ Footer ไม่ต้องใส่ตรงนี้แล้ว ไม่งั้นมันจะไปโผล่หน้า Admin */}
        <LanguageProvider>
          {children}
        </LanguageProvider>
      </body>
    </html>
  );
}