// ฟังก์ชันช่วยจำแนกประเภทงาน จากชื่อ (Title) และ สถานที่ (Venue)
export function getEventCategory(title: string, venue: string) {
  const text = (title + " " + venue).toLowerCase(); // รวมข้อความแล้วแปลงเป็นตัวเล็ก

  if (text.includes("fest") || text.includes("festival")) return "Music Festival";
  if (text.includes("musical") || text.includes("theater") || text.includes("rachadalai")) return "Theater";
  if (text.includes("symphony") || text.includes("orchestra") || text.includes("mahidol")) return "Classical";
  if (text.includes("fanmeet") || text.includes("fan meeting")) return "Fan Meeting";
  
  return "Concert"; // ถ้าไม่เข้าเงื่อนไขไหนเลย ให้เหมาว่าเป็น Concert
}