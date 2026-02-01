// 📂 ไฟล์: app/api/events/route.ts
import { NextResponse } from 'next/server';
import { pool } from '@/lib/db';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { eventName, eventDate, location, description, tickets } = body;

    const client = await pool.connect();

    // ⭐ แก้ชื่อคอลัมน์ให้ตรงกับตารางเก่า + คอลัมน์ใหม่ที่เราเพิ่งเพิ่ม
    const queryText = `
      INSERT INTO events (
        "eventName",        -- ชื่อช่องเดิมใน DB (ตามรูป)
        "eventDescription", -- ชื่อช่องเดิมใน DB
        "Org_id",           -- ต้องใส่ (Database บังคับ)
        "Hall_id",          -- ต้องใส่ (Database บังคับ)
        "eventDate",        -- ช่องใหม่ที่เพิ่งเพิ่ม
        "location",         -- ช่องใหม่ที่เพิ่งเพิ่ม
        "tickets"           -- ช่องใหม่ที่เพิ่งเพิ่ม
      ) 
      VALUES ($1, $2, 1, 1, $3, $4, $5) 
      RETURNING *
    `;
    
    // เรียงลำดับข้อมูลให้ตรงกับข้างบน
    const values = [
      eventName,    // -> เข้าช่อง eventName
      description,  // -> เข้าช่อง eventDescription
      eventDate,    // -> เข้าช่อง eventDate
      location,     // -> เข้าช่อง location
      JSON.stringify(tickets) // -> เข้าช่อง tickets
    ];

    const result = await client.query(queryText, values);
    client.release();

    return NextResponse.json({ success: true, event: result.rows[0] });

  } catch (error: any) {
    console.error('Database Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}