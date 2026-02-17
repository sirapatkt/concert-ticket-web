"use client";
import { useState, useRef, useEffect, ChangeEvent, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Globe, User, Phone, CheckCircle, CreditCard, ChevronDown, Loader2, AlertTriangle, X } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterPage() {
  const { t, language } = useLanguage();
  const router = useRouter();

  // 1. State for Form Data
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    firstname: "",
    lastname: "",
    phone: "",
    idCard: "",
    gender: "",
    day: "",
    month: "",
    year: "",
  });

  // State for UI management
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  // 🌈 Gradient Styles
  const rainbowGradient = "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500";
  const rainbowText = "text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400";

  // 📅 Data for Date Dropdown
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = language === 'th' 
    ? ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"]
    : ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  // 🌍 Country Codes
  const countryCodes = [
    { code: "th", dial: "+66", name: "Thailand" },
    { code: "us", dial: "+1", name: "United States" },
    { code: "gb", dial: "+44", name: "United Kingdom" },
    { code: "jp", dial: "+81", name: "Japan" },
    { code: "cn", dial: "+86", name: "China" },
    { code: "kr", dial: "+82", name: "South Korea" },
    { code: "sg", dial: "+65", name: "Singapore" },
    { code: "my", dial: "+60", name: "Malaysia" },
    { code: "vn", dial: "+84", name: "Vietnam" },
    { code: "au", dial: "+61", name: "Australia" },
    { code: "de", dial: "+49", name: "Germany" },
    { code: "ru", dial: "+7", name: "Russia" },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  
  // ✅ ระบุ Type ให้กับ useRef เป็น HTMLDivElement
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // ✅ ระบุ Type ให้ event เป็น MouseEvent และแคสต์ target เป็น Node
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // 🎨 Common Input Styles
  const inputContainerClass = "relative group rounded-2xl p-[1px] bg-white/10 transition-all duration-300 focus-within:bg-gradient-to-r focus-within:from-blue-500 focus-within:via-purple-500 focus-within:to-pink-500";
  const innerInputClass = "relative flex items-center bg-[#0B0F14] rounded-2xl";
  const inputFieldClass = "w-full bg-transparent text-white px-4 py-3.5 focus:outline-none placeholder:text-gray-600 rounded-2xl";
  const iconWrapperClass = "pl-4 text-gray-500 group-focus-within:text-white transition-colors";
  const optionClass = "bg-[#0B0F14] text-white py-2"; 

  // ✅ ระบุ Type ให้ msg เป็น string
  const triggerError = (msg: string) => {
    setErrorMessage(msg);
    setShowError(true);
    setTimeout(() => setShowError(false), 5000);
  };

  // ✅ ระบุ Type ให้ e สำหรับ Input, Select และ Textarea
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // ✅ ระบุ Type ให้ e เป็น FormEvent
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.email || !formData.password || !formData.firstname || !formData.lastname || !formData.phone) {
        triggerError("⚠️ กรุณากรอกข้อมูลที่จำเป็นให้ครบถ้วน");
        return;
    }
    if (formData.password !== formData.confirmPassword) {
        triggerError("❌ รหัสผ่านไม่ตรงกัน");
        return;
    }

    setIsLoading(true);

    try {
        const payload = {
            firstnameMB: formData.firstname,
            lastnameMB: formData.lastname,
            emailMB: formData.email,
            passwordMB: formData.password,
            passwordMB_confirmation: formData.confirmPassword,
            telMB: formData.phone, 
            personalID: formData.idCard,
            gender: formData.gender,
        };

        const res = await fetch("http://127.0.0.1:8000/api/register", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(payload),
        });

        const data = await res.json();

        if (res.ok) {
            alert("🎉 สมัครสมาชิกสำเร็จ! กรุณาเข้าสู่ระบบ");
            router.push("/login?role=member");
        } else {
            triggerError(`❌ ${data.message || "เกิดข้อผิดพลาดในการสมัครสมาชิก"}`);
            if (data.errors) {
                const firstError = Object.values(data.errors)[0] as string | string[];
                const message = Array.isArray(firstError) ? firstError[0] : firstError;
                triggerError(`❌ ${message}`);
            }
        }
    } catch (err) {
        triggerError("🌐 ไม่สามารถเชื่อมต่อกับ Server ได้");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-[#0B0F14] relative font-sans selection:bg-pink-500/30 selection:text-white">
      
      {/* 🌟 Background Ambient Light */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
         <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[150px] animate-pulse delay-2000"></div>
      </div>

      {/* 🖼️ Left Side Banner */}
      <div className="hidden lg:flex w-1/2 relative overflow-hidden bg-[#161B22] items-center justify-center z-10 sticky top-0 h-screen">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?q=80&w=2000&auto=format&fit=crop"
            alt="Concert Crowd" 
            className="w-full h-full object-cover opacity-50 scale-110"
          />
          <div className="absolute inset-0 bg-[#0B0F14]/40 backdrop-grayscale-[0.3]"></div>
        </div>
        <div className="relative z-10 p-16 max-w-lg">
           <div className={`w-20 h-1.5 mb-8 rounded-full ${rainbowGradient}`}></div>
           <h2 className="text-6xl font-black mb-6 tracking-tighter leading-none text-white drop-shadow-2xl">
             Join the <br/>
             <span className={rainbowText}>Movement.</span>
           </h2>
           <p className="text-xl text-gray-200 font-light leading-relaxed drop-shadow-md">
             &quot;Unlock exclusive access to the best events in town.&quot;
           </p>
        </div>
      </div>

      {/* 📝 Right Side Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative z-10"> 
        <div className="max-w-md w-full mx-auto">
          <div className="mb-8">
            <Link href="/" className="text-gray-500 hover:text-white flex items-center gap-2 transition-colors w-fit group">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                <ArrowLeft size={18} />
              </div>
              <span className="font-medium group-hover:text-blue-400 transition-colors">{t.back_home}</span>
            </Link>
          </div>

          <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-3xl font-bold text-white mb-2">{t.register_title}</h1>
            <p className="text-gray-400">{t.register_subtitle}</p>
          </div>

          <form className="space-y-4" onSubmit={handleRegister}>
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.email_label}</label>
              <div className={inputContainerClass}>
                <div className={innerInputClass}>
                  <div className={iconWrapperClass}><Mail size={20} /></div>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="name@example.com" className={inputFieldClass} />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.password_label}</label>
              <div className={inputContainerClass}>
                <div className={innerInputClass}>
                  <div className={iconWrapperClass}><Lock size={20} /></div>
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} placeholder="••••••••" className={inputFieldClass} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-gray-500 hover:text-white transition-colors">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.confirm_password_label}</label>
              <div className={inputContainerClass}>
                <div className={innerInputClass}>
                  <div className={iconWrapperClass}><CheckCircle size={20} /></div>
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••••" className={inputFieldClass} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="pr-4 text-gray-500 hover:text-white transition-colors">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* Names */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300 ml-1">{t.firstname_label}</label>
                <div className={inputContainerClass}>
                  <div className={innerInputClass}>
                    <div className={iconWrapperClass}><User size={20} /></div>
                    <input type="text" name="firstname" value={formData.firstname} onChange={handleChange} placeholder="John" className={inputFieldClass} />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300 ml-1">{t.lastname_label}</label>
                <div className={inputContainerClass}>
                  <div className={innerInputClass}>
                    <input type="text" name="lastname" value={formData.lastname} onChange={handleChange} placeholder="Doe" className={`${inputFieldClass} px-6`} />
                  </div>
                </div>
              </div>
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.phone_label}</label>
              <div className={inputContainerClass}>
                <div className={innerInputClass} ref={dropdownRef}>
                  <div 
                    className="relative flex items-center border-r border-white/10 px-4 py-3.5 cursor-pointer min-w-[120px] hover:bg-white/5 transition-colors rounded-l-2xl"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <img src={`https://flagcdn.com/w40/${selectedCountry.code}.png`} alt={selectedCountry.name} className="w-6 h-4 object-cover rounded-sm mr-2 shadow-sm" />
                    <span className="text-white font-medium">{selectedCountry.dial}</span>
                    <ChevronDown size={14} className={`ml-2 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {isDropdownOpen && (
                    <div className="absolute top-[110%] left-0 w-[280px] max-h-[300px] overflow-y-auto bg-[#161B22] border border-white/10 rounded-xl shadow-2xl z-50">
                      {countryCodes.map((country) => (
                        <div key={country.code} className="flex items-center px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                          onClick={() => { setSelectedCountry(country); setIsDropdownOpen(false); }}>
                          <img src={`https://flagcdn.com/w40/${country.code}.png`} alt={country.name} className="w-6 h-4 object-cover rounded-sm mr-3" />
                          <span className="text-gray-200 text-sm font-medium truncate flex-1">{country.name}</span>
                          <span className="text-gray-500 text-xs ml-2">{country.dial}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="81 234 5678" className="w-full bg-transparent text-white px-4 py-3.5 focus:outline-none placeholder:text-gray-600 rounded-r-2xl" />
                </div>
              </div>
            </div>

            {/* Date Dropdowns */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.dob_label}</label>
              <div className="grid grid-cols-3 gap-2">
                <div className={inputContainerClass}>
                  <div className={innerInputClass}>
                    <select name="day" value={formData.day} onChange={handleChange} className={`${inputFieldClass} appearance-none cursor-pointer text-white`}>
                      <option value="" className={optionClass}>DD</option>
                      {days.map(d => <option key={d} value={d} className={optionClass}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className={inputContainerClass}>
                  <div className={innerInputClass}>
                    <select name="month" value={formData.month} onChange={handleChange} className={`${inputFieldClass} appearance-none cursor-pointer text-white`}>
                      <option value="" className={optionClass}>Month</option>
                      {months.map((m, i) => <option key={i} value={i+1} className={optionClass}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className={inputContainerClass}>
                  <div className={innerInputClass}>
                    <select name="year" value={formData.year} onChange={handleChange} className={`${inputFieldClass} appearance-none cursor-pointer text-white`}>
                      <option value="" className={optionClass}>Year</option>
                      {years.map(y => <option key={y} value={y} className={optionClass}>{language === 'th' ? y + 543 : y}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Gender Select */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.gender_label}</label>
              <div className={inputContainerClass}>
                <div className={innerInputClass}>
                  <div className={iconWrapperClass}><User size={20} /></div>
                  <select name="gender" value={formData.gender} onChange={handleChange} className={`${inputFieldClass} appearance-none cursor-pointer text-white`}>
                    <option value="" className={optionClass}>{t.gender_select}</option>
                    <option value="ชาย" className={optionClass}>{t.gender_male}</option>
                    <option value="หญิง" className={optionClass}>{t.gender_female}</option>
                    <option value="ไม่ระบุ" className={optionClass}>{t.gender_other}</option>
                  </select>
                  <div className="absolute right-4 pointer-events-none text-gray-500">
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* ID Card */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.idcard_label}</label>
              <div className={inputContainerClass}>
                <div className={innerInputClass}>
                  <div className={iconWrapperClass}><CreditCard size={20} /></div>
                  <input type="text" name="idCard" value={formData.idCard} onChange={handleChange} placeholder="1-2345-XXXXX-XX-X" className={inputFieldClass} />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button type="submit" disabled={isLoading} className="w-full text-white font-bold py-4 rounded-2xl shadow-lg mt-6 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-purple-500/30 flex items-center justify-center gap-2">
              {isLoading ? <Loader2 size={24} className="animate-spin" /> : t.create_account_btn}
            </button>
          </form>

          <div className="relative my-8">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center text-sm"><span className="px-4 py-1 bg-[#0B0F14] text-gray-500 rounded-full border border-white/5">{t.or_continue}</span></div>
          </div>
          
          <button className="w-full flex items-center justify-center gap-3 bg-[#161B22] border border-white/5 hover:bg-white/5 text-white py-3 rounded-2xl transition-all font-medium group relative overflow-hidden">
              <div className="absolute inset-0 w-1 bg-gradient-to-b from-blue-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Globe size={20} className="text-white group-hover:scale-110 transition-transform z-10" /> 
              <span className="z-10">Sign up with Google</span>
          </button>
          
          <p className="mt-8 text-center text-gray-400">
            {t.already_have_account} 
            <Link href="/login" className="font-bold hover:underline ml-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
              {t.login_link}
            </Link>
          </p>
        </div>
      </div>

      {/* 🔴 Error Popup */}
      {showError && (
        <div className="fixed top-10 left-1/2 -translate-x-1/2 z-[100] w-[90%] max-w-md animate-in slide-in-from-top-5 duration-300">
          <div className="bg-[#161B22] border border-red-500/20 text-white px-6 py-5 rounded-3xl shadow-2xl flex items-start gap-5 backdrop-blur-xl">
            <div className="p-3 bg-red-500 rounded-2xl text-white shrink-0 shadow-lg shadow-red-500/20"><AlertTriangle size={24} /></div>
            <div className="flex-1">
              <h3 className="font-bold text-white text-lg">แจ้งเตือน</h3>
              <p className="text-gray-300 text-sm mt-1 leading-relaxed">{errorMessage}</p>
            </div>
            <button onClick={() => setShowError(false)} className="text-gray-500 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-full"><X size={20} /></button>
          </div>
        </div>
      )}
    </div>
  );
}