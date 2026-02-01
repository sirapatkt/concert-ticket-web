// 📂 ไฟล์: lib/db.ts
import { Pool } from 'pg';

export const pool = new Pool({
  user: 'postgres',        // ชื่อ User ปกติของ pgAdmin
  password: '1234', // ⚠️ ใส่รหัสผ่านที่คุณใช้เข้า pgAdmin ตรงนี้!
  host: 'localhost',       // เครื่องตัวเอง
  port: 5432,              // พอร์ตมาตรฐาน
  database: 'laravel_db',  // ชื่อ Database ใน pgAdmin ของคุณ
});