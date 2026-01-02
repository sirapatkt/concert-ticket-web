import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // 1. ดึงค่า Role จาก Cookie
  const userRole = request.cookies.get('user_role')?.value;

  // 🚨 กฎข้อที่ 1: พื้นที่หวงห้ามสำหรับ Admin
  // ถ้าพยายามเข้าหน้า /admin...
  if (path.startsWith('/admin')) {
    
    // ✅ ข้อยกเว้น: ถ้ากำลังจะเข้าหน้า Login ของ Admin ให้ปล่อยผ่านไปเลย
    // (ไม่งั้นจะโดนดีดออก วนลูปเข้าไม่ได้สักที)
    if (path === '/admin/login') {
      return NextResponse.next();
    }

    // ถ้ายังไม่ Login หรือไม่ใช่ Admin -> ดีดไปหน้า Login ลับของ Admin
    if (userRole !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 🚨 กฎข้อที่ 2: พื้นที่สำหรับผู้จัดงาน (Organizer)
  // ถ้าพยายามเข้าหน้า /organizer...
  if (path.startsWith('/organizer') && path !== '/organizer/register') {
    
    // ถ้าไม่ใช่ Organizer -> ดีดไปหน้า Login ปกติ
    if (userRole !== 'organizer') {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  // ✅ ถ้าผ่านทุกด่าน ก็อนุญาตให้ไปต่อได้
  return NextResponse.next();
}

// Config บอก Next.js ว่าให้ Middleware ทำงานที่หน้าไหนบ้าง
export const config = {
  matcher: [
    '/admin/:path*',      // ดักจับทุกหน้าใน admin
    '/organizer/:path*',  // ดักจับทุกหน้าใน organizer
  ],
};