"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { ShieldCheck, Lock, AlertCircle } from "lucide-react";
import Link from "next/link";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // ตรวจสอบรหัส (Mockup)
    if (email === "admin@beatpass.com" && password === "1234") {
      Cookies.set("user_role", "admin", { expires: 1 });
      router.push("/admin"); // ไป Dashboard
    } else {
      setError("Invalid Admin Credentials");
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-[#111] border border-red-900/30 p-8 rounded-2xl shadow-2xl shadow-red-900/10">
        
        <div className="text-center mb-8">
          <div className="inline-flex p-3 bg-red-600/10 rounded-full text-red-500 mb-4">
            <ShieldCheck size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Admin Access</h1>
          <p className="text-gray-500 text-sm mt-2">Restricted Area. Authorized Personnel Only.</p>
        </div>

        <form onSubmit={handleAdminLogin} className="space-y-4">
          <div>
            <input 
              type="email" 
              placeholder="Admin Email" 
              className="w-full bg-[#222] border border-white/5 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <input 
              type="password" 
              placeholder="Secret Key" 
              className="w-full bg-[#222] border border-white/5 text-white px-4 py-3 rounded-lg focus:outline-none focus:border-red-500 transition-colors"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/10 p-3 rounded-lg border border-red-900/20">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-all shadow-lg shadow-red-900/20">
            Authenticate
          </button>
        </form>

        <div className="mt-8 text-center">
            <Link href="/" className="text-gray-600 text-xs hover:text-gray-400">Back to Site</Link>
        </div>
      </div>
    </div>
  );
}