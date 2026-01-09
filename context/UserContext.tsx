"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// ✅ 1. สร้าง Type
export type UserType = {
  id?: string | number;
  name?: string;
  email?: string;
} | null;

type UserContextType = {
  user: UserType;
  setUser: (user: UserType) => void;
  profileImage: string | null;
  setProfileImage: (url: string | null) => void;
};

// ✅ Export Context
export const UserContext = createContext<UserContextType>({} as UserContextType);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  
  // ค่าเริ่มต้นเป็น null
  const [user, setUser] = useState<UserType>(null); 

  // ✅ 2. Logic กู้คืนข้อมูล (แบบ Clean)
  useEffect(() => {
    // เช็คแค่ว่ามี Cookie ไหม (ไม่ต้องเช็ค user ใน state)
    const isLoggedIn = Cookies.get("isLoggedIn") === "true";
    const userRole = Cookies.get("user_role");

    if (isLoggedIn) {
        // ถ้ามี Cookie แสดงว่าเคยล็อกอิน -> กู้ข้อมูลคืนมาเลย
        if (userRole === "organizer") {
            setUser({
                id: "org-001",
                name: "Demo Organizer",
                email: "org@demo.com"
            });
        } else {
            setUser({
                id: "101",
                name: "BeatPass Member",
                email: "user@beatpass.com"
            });
        }
    }
    // ✅ บรรทัดนี้สำคัญ: สั่งปิดการเช็ค Dependency บรรทัดเดียว เพื่อให้ทำงานแค่ครั้งเดียวตอนโหลด
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  return (
    <UserContext.Provider value={{ user, setUser, profileImage, setProfileImage }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);