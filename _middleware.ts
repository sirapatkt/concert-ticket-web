import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 1. ดึงค่า Role จาก Cookie
  const userRole = request.cookies.get('user_role')?.value;

  // 🚨 กฎข้อที่ 1: พื้นที่หวงห้ามสำหรับ Admin
  if (path.startsWith('/admin')) {
    
    // ✅ หน้า Login ของ Admin
    if (path === '/admin/login') {
      // ✨ เพิ่มตรงนี้: ถ้าเป็น Admin อยู่แล้ว ไม่ต้องเห็นหน้า Login อีก ให้เด้งไป Dashboard เลย
      if (userRole === 'admin') {
        return NextResponse.redirect(new URL('/admin', request.url));
      }
      return NextResponse.next();
    }

    // ถ้ายังไม่ Login หรือไม่ใช่ Admin -> ดีดไปหน้า Login ลับของ Admin
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 🚨 กฎข้อที่ 2: พื้นที่สำหรับผู้จัดงาน (Organizer)
  if (path.startsWith('/organizer') && path !== '/organizer/register') {
    
    // ✅ เช็คแบบเดียวกัน: ถ้ามีหน้า /organizer/login ก็ดักไว้ไม่ให้คนล็อกอินแล้วเข้ามาเห็นซ้ำได้ครับ
    // (สมมติว่าถ้ามีหน้าล็อกอินแยกนะครับ ถ้าไม่มีก็ใช้ลอจิกเดิมของคุณได้เลย)

    // ถ้าไม่ใช่ Organizer -> ดีดไปหน้า Login ปกติ
    if (userRole !== 'organizer') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ✅ ถ้าผ่านทุกด่าน ก็อนุญาตให้ไปต่อได้
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',      // ดักจับทุกหน้าใน admin
    '/organizer/:path*',  // ดักจับทุกหน้าใน organizer
  ],
};