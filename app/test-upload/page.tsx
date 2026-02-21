"use client";

import { useState } from "react";
import { Loader2, Image as ImageIcon, CheckCircle } from "lucide-react";

export default function TestCloudinaryPage() {
  const [loading, setLoading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setError(null);
    setUploadedUrl(null);

    try {
      // --- เตรียมข้อมูลส่ง Cloudinary ---
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "bannerImage"); // ✅ ใช้ Preset เดิมของคุณ
      formData.append("cloud_name", "de7ml7aeb"); // ✅ ใช้ Cloud Name เดิมของคุณ
      formData.append("folder", "test_uploads"); // แยกไว้ในโฟลเดอร์ test

      // --- ยิง API ---
      console.log("🚀 กำลังเริ่มอัปโหลด...");
      const res = await fetch("https://api.cloudinary.com/v1_1/de7ml7aeb/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      console.log("✅ Cloudinary Response:", data);

      if (data.secure_url) {
        // สำเร็จ! ได้ลิงก์กลับมา
        setUploadedUrl(data.secure_url);
      } else {
        // ไม่สำเร็จ (เช่น ขนาดไฟล์เกิน, เน็ตหลุด)
        throw new Error(data.error?.message || "อัปโหลดไม่สำเร็จ");
      }

    } catch (err: any) {
        console.error("❌ Error:", err);
        setError(err.message || "เกิดข้อผิดพลาดในการเชื่อมต่อ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white flex flex-col items-center justify-center p-6">
      <div className="bg-[#0F172A] p-8 rounded-2xl border border-slate-800 shadow-xl w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
            ทดสอบ Cloudinary
        </h1>
        
        <label className={`w-full py-8 rounded-xl border-2 border-dashed ${loading ? 'border-slate-600 bg-slate-800 cursor-wait' : 'border-blue-500/50 bg-blue-500/10 hover:bg-blue-500/20 cursor-pointer'} flex flex-col items-center justify-center transition-all`}>
            {loading ? (
                <>
                 <Loader2 size={32} className="animate-spin text-blue-400 mb-2" />
                 <p className="text-sm text-slate-400">กำลังอัปโหลดขึ้น Cloud...</p>
                </>
            ) : (
                <>
                 <ImageIcon size={32} className="text-blue-400 mb-2" />
                 <p className="text-sm font-bold text-blue-300">คลิกเพื่อเลือกรูปภาพ</p>
                 <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} disabled={loading} />
                </>
            )}
        </label>

        {error && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                ❌ {error}
            </div>
        )}

        {uploadedUrl && (
            <div className="mt-6 animate-in fade-in zoom-in duration-300">
                <div className="flex items-center justify-center gap-2 text-green-400 font-bold mb-4">
                    <CheckCircle size={20} /> อัปโหลดสำเร็จ!
                </div>
                
                <div className="mb-4 rounded-lg overflow-hidden border border-slate-700">
                    <img src={uploadedUrl} alt="Uploaded" className="w-full h-auto" />
                </div>

                <div className="bg-[#1E293B] p-3 rounded-lg border border-slate-700 relative group">
                    <p className="text-xs text-slate-400 break-all font-mono">{uploadedUrl}</p>
                </div>
                <a href={uploadedUrl} target="_blank" className="text-xs text-blue-400 hover:underline mt-2 block">
                    เปิดดูรูปต้นฉบับในแท็บใหม่
                </a>
            </div>
        )}

      </div>
    </div>
  );
}