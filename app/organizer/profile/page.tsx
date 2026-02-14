"use client";

import { useState } from "react";
import { 
  User, Mail, Phone, Camera, Save, MapPin, Building 
} from "lucide-react";

export default function OrganizerProfilePage() {
  // Mock Data (เปลี่ยนเป็นโหลดจาก API จริงในอนาคต)
  const [profile, setProfile] = useState({
    displayName: "BEATPASS Organizer",
    email: "organizer@beatpass.com",
    phone: "081-234-5678",
    bio: "ผู้จัดงานคอนเสิร์ตและเฟสติวัลชั้นนำของเมืองไทย",
    location: "Bangkok, Thailand",
    website: "www.beatpass.com"
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAvatarPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // ยิง API อัปเดตข้อมูลตรงนี้
    alert("บันทึกข้อมูลโปรไฟล์เรียบร้อยแล้ว!");
    console.log("Updated Profile:", profile);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 font-sans">
      <div className="max-w-4xl mx-auto">
        
        <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
          ตั้งค่าโปรไฟล์ผู้จัดงาน
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Left Column: Avatar & Quick Info */}
          <div className="md:col-span-1 space-y-6">
            <div className="bg-[#0F172A] p-6 rounded-2xl border border-slate-800 shadow-xl flex flex-col items-center text-center">
              <div className="relative group cursor-pointer">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-700 bg-slate-800 flex items-center justify-center">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="Profile" className="w-full h-full object-cover" />
                  ) : (
                    <User size={48} className="text-slate-500" />
                  )}
                </div>
                {/* Overlay upload button */}
                <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                  <Camera className="text-white" size={24} />
                  <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                </label>
              </div>
              
              <h2 className="mt-4 text-xl font-bold text-white">{profile.displayName}</h2>
              <p className="text-slate-400 text-sm">ผู้จัดงาน (Organizer)</p>
            </div>
          </div>

          {/* Right Column: Edit Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="bg-[#0F172A] p-8 rounded-2xl border border-slate-800 shadow-xl space-y-6">
              <div className="flex items-center gap-2 mb-4 border-b border-slate-700 pb-4">
                <User className="text-blue-400" size={20} />
                <h3 className="text-lg font-semibold text-slate-200">ข้อมูลพื้นฐาน</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">ชื่อผู้จัดงาน (Display Name)</label>
                  <input 
                    type="text" 
                    name="displayName"
                    value={profile.displayName}
                    onChange={handleChange}
                    className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                    <label className="text-sm text-slate-400">เว็บไซต์ (Website)</label>
                    <div className="flex items-center bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5">
                        <Building size={16} className="text-slate-500 mr-2"/>
                        <input 
                            type="text" 
                            name="website"
                            value={profile.website}
                            onChange={handleChange}
                            className="bg-transparent w-full text-white outline-none"
                        />
                    </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm text-slate-400">เกี่ยวกับเรา (Bio)</label>
                <textarea 
                  name="bio"
                  rows={4}
                  value={profile.bio}
                  onChange={handleChange}
                  className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-3 text-white focus:border-blue-500 outline-none resize-none"
                />
              </div>

              <div className="flex items-center gap-2 mb-4 pt-4 border-b border-slate-700 pb-4">
                <Phone className="text-green-400" size={20} />
                <h3 className="text-lg font-semibold text-slate-200">ข้อมูลติดต่อ</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm text-slate-400">อีเมล (ใช้สำหรับล็อกอิน)</label>
                  <div className="flex items-center bg-[#1E293B]/50 border border-slate-700/50 rounded-lg px-4 py-2.5 cursor-not-allowed">
                     <Mail size={16} className="text-slate-500 mr-2"/>
                     <input 
                        type="email" 
                        value={profile.email}
                        readOnly
                        className="bg-transparent w-full text-slate-400 outline-none cursor-not-allowed"
                     />
                  </div>
                  <p className="text-xs text-slate-500">* ไม่สามารถแก้ไขอีเมลหลักได้</p>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-slate-400">เบอร์โทรศัพท์</label>
                  <input 
                    type="tel" 
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    className="w-full bg-[#1E293B] border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:border-blue-500 outline-none"
                  />
                </div>
              </div>

              <div className="pt-6 border-t border-slate-800 flex justify-end gap-3">
                 <button type="button" className="px-6 py-2 rounded-lg border border-slate-700 text-slate-300 hover:bg-slate-800 transition-colors">
                    ยกเลิก
                 </button>
                 <button type="submit" className="px-6 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold shadow-lg shadow-blue-500/20 flex items-center gap-2">
                    <Save size={18} /> บันทึกข้อมูล
                 </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}