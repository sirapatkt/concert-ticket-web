"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import Cookies from "js-cookie";

// ✅ 1. สร้าง Type (เพิ่ม [key: string]: any เพื่อให้รับค่าอื่นๆ จาก DB ได้)
export type UserType = {
  id?: string | number;
  name?: string;
  email?: string;
  [key: string]: any; 
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

  // ✅ 2. Logic กู้คืนข้อมูลของจริงจาก Backend
  useEffect(() => {
    const restoreUserSession = async () => {
      // ดึง Token จาก Cookie
      const token = Cookies.get("token");

      if (token) {
        try {
          // ยิง API ไปเอาข้อมูลของคนๆ นี้จริงๆ จาก Laravel
          const res = await fetch("http://127.0.0.1:8000/api/profile", {
            method: "GET",
            headers: {
              "Authorization": `Bearer ${token}`,
              "Accept": "application/json"
            }
          });

          if (res.ok) {
            const data = await res.json();
            
            // ถ้ายิงผ่าน เอาข้อมูลที่ได้จากตาราง members มายัดใส่ State
            setUser({
              id: data.Mem_id || data.id,
              name: data.firstnameMB || data.name, // 👈 เอาชื่อจริงจาก DB มาโชว์ที่ Navbar
              email: data.emailMB || data.email,
              ...data // เก็บข้อมูลอื่นๆ เผื่อไว้ใช้
            });
          } else {
            // ถ้า Token หมดอายุ หรือไม่ถูกต้อง ให้ล้าง Cookie ทิ้งให้หมด
            Cookies.remove("token");
            Cookies.remove("isLoggedIn");
            Cookies.remove("user_role");
            setUser(null);
          }
        } catch (error) {
          console.error("Failed to fetch user data:", error);
        }
      }
    };

    restoreUserSession();
  }, []); 

  return (
    <UserContext.Provider value={{ user, setUser, profileImage, setProfileImage }}>
      {children}
    </UserContext.Provider>
  );
}

export const useUser = () => useContext(UserContext);