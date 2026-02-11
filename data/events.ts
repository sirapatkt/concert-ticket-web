// 📁 src/data/events.ts

export const allEvents = [
  {
    id: 1, 
    category: "concert",
    title: "Jeff Satur: Space Shuttle No.8 Asia Tour in Bangkok",
    date: "20 APR 2026",
    time: "19:00",
    venue: "UOB Live, Emsphere",
    price: "2,500",
    image: "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000",
    status: "HOT",
    statusColor: "bg-red-500",
    type: "คอนเสิร์ต",
    isSoldOut: false,
    description: `เตรียมตัวออกเดินทางไปกับ "Jeff Satur" ในคอนเสิร์ตเดี่ยวเอเชียทัวร์ครั้งแรก! 
    
    พร้อมโชว์สุดพิเศษที่ผสมผสานดนตรี การเล่าเรื่อง และความเป็นศิลปะในแบบฉบับของเจฟ ที่จะพาคุณล่องลอยไปในอวกาศแห่งความทรงจำ
    
    มาร่วมสร้างปรากฏการณ์ Space Shuttle No.8 ไปด้วยกัน!`,
    rounds: [
      { id: 1, date: "Saturday, 20 Apr 2026", time: "19:00 - 22:00" },
      { id: 2, date: "Sunday, 21 Apr 2026", time: "18:00 - 21:00" }
    ],
    priceTiers: [
      { id: 1, price: 5500, color: "bg-[#ED1C24]" },
      { id: 2, price: 4500, color: "bg-[#21358F]" },
      { id: 3, price: 3500, color: "bg-[#C54E9D]" },
      { id: 4, price: 2500, color: "bg-[#FFF200]", textColor: "text-black" },
    ]
  },
  {
    id: 2,
    category: "classical",
    title: "The Grand Symphony 2026",
    date: "15 JAN 2026",
    time: "18:00",
    venue: "Prince Mahidol Hall",
    price: "1,500",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=1000",
    status: "SELLING FAST",
    statusColor: "bg-orange-500",
    type: "ออร์เคสตรา",
    isSoldOut: false,
    description: "สัมผัสความยิ่งใหญ่ของดนตรีออร์เคสตรา บรรเลงบทเพลงระดับตำนาน...",
    rounds: [{ id: 1, date: "Saturday, 15 Jan 2026", time: "18:00 - 21:00" }],
    priceTiers: [{ id: 1, price: 1500, color: "bg-blue-500" }]
  },
  {
    id: 3,
    category: "festival",
    title: "Summer Sonic Bangkok",
    date: "12 FEB 2026",
    time: "12:00",
    venue: "Impact Arena",
    price: "2,500",
    image: "https://images.unsplash.com/photo-1459749411177-0473ef48509d?q=80&w=1000",
    status: "",
    statusColor: "",
    type: "คอนเสิร์ต",
    isSoldOut: false,
    description: "เทศกาลดนตรีระดับโลก Summer Sonic บุกกรุงเทพฯ!...",
    rounds: [{ id: 1, date: "Thursday, 12 Feb 2026", time: "12:00 - 23:00" }],
    priceTiers: [
        { id: 1, price: 3500, color: "bg-purple-500" },
        { id: 2, price: 2500, color: "bg-yellow-500" }
    ]
  },
  {
    id: 4,
    category: "theater",
    title: "Phantom of the Opera",
    date: "01 MAR 2026",
    time: "14:00",
    venue: "Muangthai Rachadalai",
    price: "3,000",
    image: "https://images.unsplash.com/photo-1514306191717-452ec28c7f42?q=80&w=1000",
    status: "",
    statusColor: "",
    type: "ละครเวที",
    isSoldOut: false,
    description: "ละครเวทีบรอดเวย์สุดคลาสสิกที่ทุกคนรอคอย...",
    rounds: [{ id: 1, date: "Sunday, 01 Mar 2026", time: "14:00" }],
    priceTiers: [
        { id: 1, price: 4000, color: "bg-red-700" },
        { id: 2, price: 3000, color: "bg-red-500" }
    ]
  },
  {
    id: 5,
    category: "fanmeet",
    title: "FAN MEETING: Lovely Day",
    date: "20 MAR 2026",
    time: "18:00",
    venue: "Thunder Dome",
    price: "1,800",
    image: "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&q=80",
    status: "SOLD OUT",
    statusColor: "bg-red-600",
    type: "แฟนมีตติ้ง",
    isSoldOut: true,
    description: "มาสร้างความทรงจำดีๆ ร่วมกันในวันแห่งความรัก...",
    rounds: [{ id: 1, date: "Friday, 20 Mar 2026", time: "18:00" }],
    priceTiers: [{ id: 1, price: 1800, color: "bg-pink-500" }]
  },
  {
    id: 6,
    category: "concert",
    title: "JAZZ IN THE GARDEN",
    date: "05 APR 2026",
    time: "17:00",
    venue: "Benjakitti Park",
    price: "850",
    image: "https://images.unsplash.com/photo-1511192336575-5a79af67a629?q=80&w=800",
    status: "NEW",
    statusColor: "bg-green-500",
    type: "คอนเสิร์ต",
    isSoldOut: false,
    description: "ดื่มด่ำกับดนตรีแจ๊สในสวนยามเย็น...",
    rounds: [{ id: 1, date: "Sunday, 05 Apr 2026", time: "17:00" }],
    priceTiers: [{ id: 1, price: 850, color: "bg-green-500" }]
  },
  {
    id: 9, // ข้าม ID เพื่อให้เห็นความแตกต่าง
    category: "concert",
    title: "K-POP WORLD TOUR",
    date: "01 MAY 2026",
    time: "18:00",
    venue: "Rajamangala Stadium",
    price: "4,500",
    image: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=800",
    status: "COMING SOON",
    statusColor: "bg-blue-500",
    type: "คอนเสิร์ต",
    isSoldOut: false,
    description: "คอนเสิร์ต K-POP ที่ยิ่งใหญ่ที่สุดแห่งปี...",
    rounds: [{ id: 1, date: "Friday, 01 May 2026", time: "18:00" }],
    priceTiers: [
        { id: 1, price: 4500, color: "bg-blue-600" },
        { id: 2, price: 3500, color: "bg-blue-400" }
    ]
  }
];