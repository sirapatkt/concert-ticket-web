"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Globe, User, Mic2, X, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Cookies from "js-cookie";

function LoginForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const roleParam = searchParams.get("role");

  // กำหนดค่าเริ่มต้น
  const [userType, setUserType] = useState<"member" | "organizer">(
    roleParam === "organizer" ? "organizer" : "member"
  );

  const [showPassword, setShowPassword] = useState(false);
  
  // State Input
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);

  // ✅ State สำหรับ Custom Alert
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  // State Forgot Password
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [isForgotSubmitted, setIsForgotSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // ฟังก์ชันแสดง Error (Custom Alert)
  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setShowError(true);
    // ตั้งเวลาให้ปิดเองใน 3 วินาที
    setTimeout(() => setShowError(false), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !password) {
      triggerError("⚠️ กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
      return;
    }

    setIsLoginLoading(true);

    setTimeout(() => {
      setIsLoginLoading(false);

      // 🛑 BLOCK ADMIN
      if (email === "admin@beatpass.com") {
        triggerError("⛔ บัญชี Admin ไม่สามารถเข้าใช้งานหน้านี้ได้ (กรุณาไปที่ /admin/login)");
        return; 
      }

      // 🏢 1. กรณีผู้จัดงาน (Organizer)
      if (userType === "organizer") {
         if (email === "org@demo.com" && password === "1234") {
            Cookies.set("user_role", "organizer", { expires: 1 });
            setLoginSuccess(true);
            setTimeout(() => router.push("/"), 2000); 
         } else {
            triggerError("❌ อีเมลหรือรหัสผ่านผู้จัดงานไม่ถูกต้อง");
         }
      } 
      
      // 👤 2. กรณีสมาชิกทั่วไป (Member)
      else {
         Cookies.set("user_role", "member", { expires: 1 });
         setLoginSuccess(true);
         setTimeout(() => router.push("/"), 2000);
      }
    }, 1500);
  };

  useEffect(() => {
    if (showForgotPassword || loginSuccess || showError) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showForgotPassword, loginSuccess, showError]);

  // Helper Functions
  const handleForgotSubmit = (e: React.FormEvent) => { e.preventDefault(); if(!forgotEmail) return; setIsLoading(true); setTimeout(() => { setIsLoading(false); setIsForgotSubmitted(true); }, 1500); };
  const closePopup = () => { setShowForgotPassword(false); setTimeout(() => { setIsForgotSubmitted(false); setForgotEmail(""); setIsLoading(false); }, 300); };
  const rainbowGradient = "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500";
  const rainbowText = "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400";

  return (
    <div className="min-h-screen flex bg-[#0B0F14] relative font-sans selection:bg-pink-500/30 selection:text-white">
      
      {/* 🖼️ Left Side */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#161B22] items-center justify-center">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-pink-600/20 blur-[150px] rounded-full animate-pulse delay-1000"></div>
        <div className="absolute inset-0 z-0">
          <img 
            src={userType === "member" 
              ? "https://images.unsplash.com/photo-1459749411177-717441447994?q=80&w=2000&auto=format&fit=crop" 
              : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000&auto=format&fit=crop"
            }
            alt="Background" className="w-full h-full object-cover opacity-50 scale-110"
          />
          <div className="absolute inset-0 bg-[#0B0F14]/40 backdrop-grayscale-[0.5]"></div>
        </div>
        <div className="relative z-10 p-16 max-w-lg">
           <div className={`w-20 h-1.5 mb-8 rounded-full ${rainbowGradient}`}></div>
           <h2 className="text-7xl font-black mb-6 tracking-tighter leading-none text-white drop-shadow-2xl">
             {userType === "member" ? "Feel" : "Create"} <br/>
             <span className={rainbowText}>{userType === "member" ? "Alive." : "Magic."}</span>
           </h2>
           <p className="text-xl text-gray-200 font-light leading-relaxed drop-shadow-md">
             &quot;{userType === "member" ? "Experience every color of sound." : "Orchestrate unforgettable moments."}&quot;
           </p>
        </div>
      </div>

      {/* 📝 Right Side */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative overflow-hidden"> 
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/5 via-purple-500/5 to-pink-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-md w-full mx-auto z-10">
          <div className="mb-10">
            <Link href="/" className="text-gray-500 hover:text-white flex items-center gap-2 transition-colors w-fit group">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors"><ArrowLeft size={18} /></div>
              <span className="font-medium group-hover:text-blue-400 transition-colors">{t.back_home}</span>
            </Link>
          </div>

          <div className="flex bg-[#161B22] p-1.5 rounded-2xl border border-white/5 mb-8">
            <button onClick={() => setUserType("member")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${userType === "member" ? "bg-gradient-to-r from-blue-600 to-cyan-500 text-white shadow-lg shadow-blue-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}><User size={18} /> {t.tab_member}</button>
            <button onClick={() => setUserType("organizer")} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${userType === "organizer" ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20" : "text-gray-400 hover:text-white hover:bg-white/5"}`}><Mic2 size={18} /> {t.tab_organizer}</button>
          </div>

          <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500" key={userType}>
            <h1 className="text-4xl font-bold text-white mb-2">
              {userType === "member" ? `${t.login_welcome} 👋` : `${t.organizer_welcome} 🚀`}
            </h1>
            <p className="text-gray-400">{userType === "member" ? t.login_subtitle : t.organizer_subtitle}</p>
          </div>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.email_label}</label>
              <div className="relative group rounded-2xl p-[1px] bg-white/10">
                <div className="relative bg-[#0B0F14] rounded-2xl h-[58px]"> 
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none group-focus-within:text-white transition-colors"><Mail size={20} /></div>
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full h-full bg-transparent text-white px-4 pl-12 focus:outline-none placeholder:text-gray-600 rounded-2xl relative z-0" />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-medium text-gray-300">{t.password_label}</label>
                <button type="button" onClick={() => setShowForgotPassword(true)} className={`text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r ${userType === "member" ? "from-blue-400 to-cyan-400" : "from-purple-400 to-pink-400"} hover:opacity-80 transition-opacity`}>{t.forgot_password}</button>
              </div>
              <div className="relative group rounded-2xl p-[1px] bg-white/10">
                <div className="relative bg-[#0B0F14] rounded-2xl h-[58px]">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 z-10 pointer-events-none group-focus-within:text-white transition-colors"><Lock size={20} /></div>
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-full bg-transparent text-white px-4 pl-12 pr-12 focus:outline-none placeholder:text-gray-600 rounded-2xl relative z-0" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors z-20">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isLoginLoading} className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${userType === "member" ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-purple-500/30" : "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:shadow-orange-500/30"}`}>
              {isLoginLoading ? <Loader2 size={24} className="animate-spin" /> : t.sign_in_btn}
            </button>
          </form>

          {/* Social Login */}
          <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-6 py-2 bg-[#0B0F14] text-gray-500 rounded-full border border-white/5">{t.or_continue}</span></div>
          </div>
          <button className="w-full flex items-center justify-center gap-3 bg-[#161B22] border border-white/5 hover:bg-white/5 text-white py-3 rounded-2xl transition-all font-medium group relative overflow-hidden">
              <div className="absolute inset-0 w-1 bg-gradient-to-b from-blue-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Globe size={20} className="text-white group-hover:scale-110 transition-transform z-10" /> 
              <span className="z-10">Continue with Google</span>
          </button>
          <p className="mt-10 text-center text-gray-400">
            {t.no_account} 
            <Link href={userType === "member" ? "/register" : "/organizer/register"} className={`font-bold hover:underline ml-2 text-transparent bg-clip-text bg-gradient-to-r ${userType === "member" ? "from-blue-400 to-pink-400" : "from-purple-400 to-orange-400"}`}>
              {userType === "member" ? t.sign_up_link : t.organizer_signup}
            </Link>
          </p>
        </div>
      </div>

      {/* ✅ Success Popup */}
      {loginSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="bg-[#161B22] border border-green-500/20 rounded-3xl p-8 text-center max-w-sm w-full shadow-2xl relative overflow-hidden animate-in zoom-in-95 duration-300">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-green-400 to-emerald-600"></div>
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={40} className="text-green-500 animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">ยินดีต้อนรับกลับ! 🎉</h2>
              <p className="text-gray-400 mb-6">เข้าสู่ระบบสำเร็จ กำลังพาคุณไป...</p>
              <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
                <div className="h-full bg-green-500 animate-[loading_2s_ease-in-out_infinite] w-1/2 rounded-full"></div>
              </div>
           </div>
        </div>
      )}

      {/* ⛔ Custom Error Alert (Premium Design + Super Clear Text ✨) */}
      {showError && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] animate-in slide-in-from-top-5 fade-in duration-300 w-[90%] max-w-md">
          <div className="bg-gradient-to-r from-red-950/90 to-[#0B0F14]/95 backdrop-blur-xl border border-red-500/20 text-white px-6 py-5 rounded-3xl shadow-[0_8px_30px_rgb(220,38,38,0.15)] flex items-start gap-5 min-w-[360px] max-w-md overflow-hidden relative group cursor-default">
            
            {/* Ambient Glow */}
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-red-600/20 blur-[60px] rounded-full pointer-events-none group-hover:bg-red-600/30 transition-all duration-500"></div>

            {/* Icon Box */}
            <div className="p-3.5 bg-gradient-to-br from-red-500 to-red-700 rounded-2xl text-white shadow-lg shadow-red-500/20 shrink-0 relative z-10 flex items-center justify-center">
              <AlertTriangle size={26} strokeWidth={2.5} />
            </div>
            
            {/* Content */}
            <div className="flex-1 relative z-10 pt-1">
              <h3 className="font-bold text-lg text-white mb-1 tracking-tight drop-shadow-sm">แจ้งเตือน</h3>
              {/* ✅ ปรับตรงนี้: ตัวหนังสือสีขาวล้วน + ตัวหนา + มีเงา อ่านชัดบนพื้นหลังเข้ม */}
              <p className="text-white text-[15px] font-bold leading-relaxed drop-shadow-md">
                {errorMessage}
              </p>
            </div>

            {/* Close Button */}
            <button onClick={() => setShowError(false)} className="text-white/60 hover:text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200 shrink-0 relative z-10 -mt-1 -mr-2">
              <X size={20} />
            </button>
          </div>
        </div>
      )}

      {/* Forgot Password */}
      {showForgotPassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-[#0B0F14]/90 backdrop-blur-md" onClick={closePopup}></div>
          <div className="relative w-full max-w-lg bg-[#161B22] border border-white/10 rounded-3xl shadow-2xl p-8 overflow-hidden animate-in zoom-in-95 duration-300">
            <button onClick={closePopup} className="absolute top-5 right-5 z-50 p-3 rounded-full text-gray-400 bg-white/5 hover:bg-white/20 hover:text-white"><X size={24} /></button>
            <h2 className="text-3xl font-bold text-white mb-2">{t.forgot_title}</h2>
            <form onSubmit={handleForgotSubmit} className="space-y-6">
                 <div className="relative group rounded-2xl p-[1px] bg-white/10">
                      <input type="email" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} placeholder="name@example.com" className="w-full bg-[#161B22] text-white px-4 py-4 rounded-2xl focus:outline-none" />
                 </div>
                 <button type="submit" disabled={isLoading} className={`w-full text-white font-bold py-4 rounded-2xl ${rainbowGradient}`}>{isLoading ? <Loader2 className="animate-spin mx-auto"/> : t.send_btn}</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0B0F14] flex items-center justify-center text-white">Loading...</div>}>
      <LoginForm />
    </Suspense>
  );
}