"use client";
import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Globe, User, Mic2, X, CheckCircle, AlertTriangle, Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Cookies from "js-cookie";
import { useUser } from "../../../context/UserContext"; 

function LoginForm() {
  const { t } = useLanguage();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { setUser } = useUser();

  const redirectPath = searchParams.get("redirect") || "/";
  const roleParam = searchParams.get("role");

  const [userType, setUserType] = useState<"member" | "organizer">(
    roleParam === "organizer" ? "organizer" : "member"
  );

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(""); 
  const [password, setPassword] = useState("");
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [loginSuccess, setLoginSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setShowError(true);
    setTimeout(() => setShowError(false), 3000);
  };

  // ✅ แก้ไข: รวม Logic เข้าด้วยกันและใช้ API จริง 100%
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      triggerError("⚠️ กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
      return;
    }

    if (email === "admin@beatpass.com") {
        triggerError("⛔ บัญชี Admin ไม่สามารถเข้าใช้งานหน้านี้ได้");
        return; 
    }

    setIsLoginLoading(true);

    try {
      // 1. เลือก Endpoint ตามประเภทผู้ใช้
      const endpoint = userType === "organizer" 
        ? "http://127.0.0.1:8000/api/organizer/login" : "http://127.0.0.1:8000/api/login";

      const res = await fetch(endpoint, {
        method: "POST",
        headers: { 
            "Content-Type": "application/json",
            "Accept": "application/json"
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        // ✅ 2. ล็อกอินผ่าน! เก็บข้อมูลลงเครื่อง
        Cookies.set("user_role", userType, { expires: 1 });
        Cookies.set("isLoggedIn", "true", { expires: 1 });
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", userType);
        
        // 3. จัดการข้อมูลชื่อเพื่อไปแสดงผล (ดึงจากโครงสร้าง Laravel ที่เราทำไว้)
        const userData = userType === "organizer" ? data.organizer : data.user;
        const displayName = userType === "organizer" 
          ? (userData.compName || userData.firstnameOG) 
          : userData.name;

        localStorage.setItem("user_name", displayName);

        // 4. อัปเดต Global Context
        setUser({
            id: userType === "organizer" ? userData.Org_id : userData.id,
            name: displayName,
            email: email
        });

        setLoginSuccess(true);

        // 5. แยกทางไปตามบทบาท
        setTimeout(() => {
          if (userType === "organizer") {
            router.push("/organizer/my-events"); 
          } else {
            router.push(redirectPath); 
          }
        }, 2000);
      } else {
        triggerError(`❌ ${data.message || "อีเมลหรือรหัสผ่านไม่ถูกต้อง"}`);
      }
    } catch (err) {
      triggerError("🌐 ไม่สามารถเชื่อมต่อกับ Server ได้ (ตรวจสอบการรัน Laravel)");
    } finally {
      setIsLoginLoading(false);
    }
  };  

  // ดักจับการ Scroll เมื่อมี Popup
  useEffect(() => {
    if (showForgotPassword || loginSuccess || showError) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [showForgotPassword, loginSuccess, showError]);

  const rainbowGradient = "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500";
  const rainbowText = "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400";

  return (
    <div className="min-h-screen flex bg-[#0B0F14] relative font-sans selection:bg-pink-500/30 selection:text-white">
      
      {/* 🖼️ Left Side (UI) */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#161B22] items-center justify-center h-screen sticky top-0">
        <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-blue-600/20 blur-[150px] rounded-full animate-pulse"></div>
        <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-pink-600/20 blur-[150px] rounded-full animate-pulse delay-1000"></div>
        <div className="absolute inset-0 z-0">
          <img 
            src={userType === "member" 
              ? "https://images.unsplash.com/photo-1459749411177-717441447994?q=80&w=2000" 
              : "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?q=80&w=2000"
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
             &quot;{userType === "member" ? t.login_subtitle : t.organizer_subtitle}&quot;
           </p>
        </div>
      </div>

      {/* 📝 Right Side (Form) */}
      <div className="w-full lg:w-1/2 flex flex-col pt-32 px-8 md:px-16 lg:px-24 pb-20 relative overflow-y-auto"> 
        <div className="max-w-md w-full mx-auto z-10 relative">
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

          <div className="mb-8" key={userType}>
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
                  <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" className="w-full h-full bg-transparent text-white px-4 pl-12 focus:outline-none placeholder:text-gray-600 rounded-2xl" />
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
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full h-full bg-transparent text-white px-4 pl-12 pr-12 focus:outline-none placeholder:text-gray-600 rounded-2xl" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors z-20">{showPassword ? <EyeOff size={20} /> : <Eye size={20} />}</button>
                </div>
              </div>
            </div>

            <button type="submit" disabled={isLoginLoading} className={`w-full text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 ${userType === "member" ? "bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-purple-500/30" : "bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 hover:shadow-orange-500/30"}`}>
              {isLoginLoading ? <Loader2 size={24} className="animate-spin" /> : t.sign_in_btn}
            </button>
          </form>

          {/* Other Links */}
          <div className="relative my-10">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-6 py-2 bg-[#0B0F14] text-gray-500 rounded-full border border-white/5">{t.or_continue}</span></div>
          </div>
          
          <p className="mt-10 text-center text-gray-400">
            {t.no_account} 
            <Link href={userType === "member" ? "/register" : "/organizer/register"} className={`font-bold hover:underline ml-2 text-transparent bg-clip-text bg-gradient-to-r ${userType === "member" ? "from-blue-400 to-pink-400" : "from-purple-400 to-orange-400"}`}>
              {userType === "member" ? t.sign_up_link : t.organizer_signup}
            </Link>
          </p>
        </div>
      </div>

      {/* Popups */}
      {loginSuccess && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
           <div className="bg-[#161B22] border border-green-500/20 rounded-3xl p-8 text-center max-w-md w-full shadow-2xl relative">
             <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
               <CheckCircle size={40} className="text-green-500" />
             </div>
             <h2 className="text-2xl font-bold text-white mb-2">เข้าสู่ระบบสำเร็จ! 🎉</h2>
             <p className="text-gray-400">ยินดีต้อนรับกลับสู่ BEATPASS กำลังพาคุณไปต่อ…</p>
           </div>
        </div>
      )}

      {showError && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md">
          <div className="bg-[#161B22] border border-red-500/20 text-white px-6 py-5 rounded-3xl shadow-2xl flex items-start gap-5 backdrop-blur-xl">
            <div className="p-3 bg-red-500 rounded-2xl text-white shrink-0"><AlertTriangle size={24} /></div>
            <div className="flex-1">
              <h3 className="font-bold text-white">แจ้งเตือน</h3>
              <p className="text-gray-300 text-sm">{errorMessage}</p>
            </div>
            <button onClick={() => setShowError(false)} className="text-gray-500 hover:text-white"><X size={20} /></button>
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