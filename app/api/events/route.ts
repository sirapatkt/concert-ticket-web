// 📂 ไฟล์: app/api/events/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

// ==========================================
// 1. ฟังก์ชัน GET: สำหรับดึงข้อมูลอีเวนต์ทั้งหมดไปโชว์ในหน้า Admin
// ==========================================
export async function GET() {
  try {
    // ดึงข้อมูลทั้งหมดจากตาราง events เรียงจากใหม่ไปเก่า
    const queryText = `SELECT * FROM events ORDER BY "eventDate" DESC`;
    const result = await pool.query(queryText);
    
    return NextResponse.json(result.rows, { status: 200 });
  } catch (error: any) {
    console.error('Database Fetch Error:', error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

// ==========================================
// 2. ฟังก์ชัน POST: สำหรับเพิ่มอีเวนต์ใหม่
// ==========================================
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventName, eventDate, location, description, tickets } = body;

    // ⭐ ใช้ pool.query โดยตรงเลย ปลอดภัยกว่า ไม่ต้องกลัว Connection ค้าง
    const queryText = `
      INSERT INTO events (
        "eventName",        
        "eventDescription", 
        "Org_id",           -- 📌 ข้อควรระวัง: อนาคตอย่าลืมเปลี่ยนให้รับค่าตามผู้จัดจริง
        "Hall_id",          -- 📌 ข้อควรระวัง: อนาคตอย่าลืมเปลี่ยนให้รับค่าตามสถานที่จริง
        "eventDate",        
        "location",         
        "tickets"           
      ) 
      VALUES ($1, $2, 1, 1, $3, $4, $5) 
      RETURNING *
    `;
    
    const values = [
      eventName,    
      description,  
      eventDate,    
      location,     
      JSON.stringify(tickets) 
    ];

    const result = await pool.query(queryText, values);

    return NextResponse.json({ success: true, event: result.rows[0] });

  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}