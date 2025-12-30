"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { Mail, Lock, Eye, EyeOff, ArrowLeft, Globe, User, Phone, CheckCircle, CreditCard, ChevronDown } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function RegisterPage() {
  const { t, language } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
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

  // 🌍 Country Codes (ตัด Laos, Myanmar, Cambodia ออกแล้ว)
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

  // 🛠️ Custom Dropdown Logic
  const [selectedCountry, setSelectedCountry] = useState(countryCodes[0]); 
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
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

  return (
    <div className="min-h-screen flex bg-[#0B0F14] relative font-sans selection:bg-pink-500/30 selection:text-white">
      
      {/* 🌟 Background Ambient Light */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
         <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse"></div>
         <div className="absolute top-[30%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 rounded-full blur-[100px] animate-pulse delay-1000"></div>
         <div className="absolute bottom-[-10%] left-[10%] w-[40%] h-[40%] bg-pink-600/10 rounded-full blur-[150px] animate-pulse delay-2000"></div>
      </div>

      {/* 🖼️ Left Side: Image Banner */}
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

      {/* 📝 Right Side: Register Form (User Only) */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 md:px-16 lg:px-24 py-12 relative z-10"> 
        
        <div className="max-w-md w-full mx-auto">
          {/* Back Button */}
          <div className="mb-8">
            <Link href="/" className="text-gray-500 hover:text-white flex items-center gap-2 transition-colors w-fit group">
              <div className="p-2 rounded-full bg-white/5 group-hover:bg-white/10 transition-colors">
                <ArrowLeft size={18} />
              </div>
              <span className="font-medium group-hover:text-blue-400 transition-colors">{t.back_home}</span>
            </Link>
          </div>

          {/* Header */}
          <div className="mb-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h1 className="text-3xl font-bold text-white mb-2">{t.register_title}</h1>
            <p className="text-gray-400">{t.register_subtitle}</p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            
            {/* Email */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.email_label}</label>
              <div className={inputContainerClass}>
                <div className={innerInputClass}>
                  <div className={iconWrapperClass}><Mail size={20} /></div>
                  <input type="email" placeholder="name@example.com" className={inputFieldClass} />
                </div>
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.password_label}</label>
              <div className={inputContainerClass}>
                <div className={innerInputClass}>
                  <div className={iconWrapperClass}><Lock size={20} /></div>
                  <input type={showPassword ? "text" : "password"} placeholder="••••••••" className={inputFieldClass} />
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
                  <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" className={inputFieldClass} />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="pr-4 text-gray-500 hover:text-white transition-colors">
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            </div>

            {/* First Name & Last Name */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300 ml-1">{t.firstname_label}</label>
                <div className={inputContainerClass}>
                  <div className={innerInputClass}>
                    <div className={iconWrapperClass}><User size={20} /></div>
                    <input type="text" placeholder="John" className={inputFieldClass} />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-300 ml-1">{t.lastname_label}</label>
                <div className={inputContainerClass}>
                  <div className={innerInputClass}>
                    <input type="text" placeholder="Doe" className={`${inputFieldClass} px-6`} />
                  </div>
                </div>
              </div>
            </div>

            {/* ✅ Phone Number: Custom Dropdown */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.phone_label}</label>
              <div className={inputContainerClass}>
                <div className={innerInputClass} ref={dropdownRef}>
                  
                  {/* ปุ่มเลือกประเทศ (ธง + รหัส) */}
                  <div 
                    className="relative flex items-center border-r border-white/10 px-4 py-3.5 cursor-pointer min-w-[120px] hover:bg-white/5 transition-colors rounded-l-2xl"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <img 
                      src={`https://flagcdn.com/w40/${selectedCountry.code}.png`} 
                      alt={selectedCountry.name} 
                      className="w-6 h-4 object-cover rounded-sm mr-2 shadow-sm"
                    />
                    <span className="text-white font-medium">{selectedCountry.dial}</span>
                    <ChevronDown size={14} className={`ml-2 text-gray-500 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                  </div>

                  {/* รายการประเทศ (โชว์ ธง + ชื่อเต็ม + รหัส) */}
                  {isDropdownOpen && (
                    <div className="absolute top-[110%] left-0 w-[280px] max-h-[300px] overflow-y-auto bg-[#161B22] border border-white/10 rounded-xl shadow-2xl z-50">
                      {countryCodes.map((country) => (
                        <div 
                          key={country.code}
                          className="flex items-center px-4 py-3 hover:bg-white/10 cursor-pointer transition-colors border-b border-white/5 last:border-0"
                          onClick={() => {
                            setSelectedCountry(country);
                            setIsDropdownOpen(false);
                          }}
                        >
                          <img 
                            src={`https://flagcdn.com/w40/${country.code}.png`} 
                            alt={country.name} 
                            className="w-6 h-4 object-cover rounded-sm mr-3"
                          />
                          <span className="text-gray-200 text-sm font-medium truncate flex-1">{country.name}</span>
                          <span className="text-gray-500 text-xs ml-2">{country.dial}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ช่องกรอกเบอร์โทร */}
                  <input type="tel" placeholder="81 234 5678" className="w-full bg-transparent text-white px-4 py-3.5 focus:outline-none placeholder:text-gray-600 rounded-r-2xl" />
                </div>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.dob_label}</label>
              <div className="grid grid-cols-3 gap-2">
                <div className={inputContainerClass}>
                  <div className={innerInputClass}>
                    <select className={`${inputFieldClass} appearance-none cursor-pointer text-white`}>
                      <option value="" className={optionClass}>DD</option>
                      {days.map(d => <option key={d} value={d} className={optionClass}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className={inputContainerClass}>
                  <div className={innerInputClass}>
                    <select className={`${inputFieldClass} appearance-none cursor-pointer text-white`}>
                      <option value="" className={optionClass}>Month</option>
                      {months.map((m, i) => <option key={i} value={i+1} className={optionClass}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div className={inputContainerClass}>
                  <div className={innerInputClass}>
                    <select className={`${inputFieldClass} appearance-none cursor-pointer text-white`}>
                      <option value="" className={optionClass}>Year</option>
                      {years.map(y => <option key={y} value={y} className={optionClass}>{language === 'th' ? y + 543 : y}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Gender */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.gender_label}</label>
              <div className={inputContainerClass}>
                <div className={innerInputClass}>
                  <div className={iconWrapperClass}><User size={20} /></div>
                  <select className={`${inputFieldClass} appearance-none cursor-pointer text-white`}>
                    <option value="" className={optionClass}>{t.gender_select}</option>
                    <option value="male" className={optionClass}>{t.gender_male}</option>
                    <option value="female" className={optionClass}>{t.gender_female}</option>
                    <option value="other" className={optionClass}>{t.gender_other}</option>
                  </select>
                  <div className="absolute right-4 pointer-events-none text-gray-500">
                    <ChevronDown size={20} />
                  </div>
                </div>
              </div>
            </div>

            {/* ID Card / Passport */}
            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-300 ml-1">{t.idcard_label}</label>
              <div className={inputContainerClass}>
                <div className={innerInputClass}>
                  <div className={iconWrapperClass}><CreditCard size={20} /></div>
                  <input type="text" placeholder="1-2345-XXXXX-XX-X" className={inputFieldClass} />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button className="w-full text-white font-bold py-4 rounded-2xl shadow-lg mt-6 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-purple-500/30">
              {t.create_account_btn}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-8">
             <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
             <div className="relative flex justify-center text-sm"><span className="px-4 py-1 bg-[#0B0F14] text-gray-500 rounded-full border border-white/5">{t.or_continue}</span></div>
          </div>
          
          {/* Social Login */}
          <button className="w-full flex items-center justify-center gap-3 bg-[#161B22] border border-white/5 hover:bg-white/5 text-white py-3 rounded-2xl transition-all font-medium group relative overflow-hidden">
             <div className="absolute inset-0 w-1 bg-gradient-to-b from-blue-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
             <Globe size={20} className="text-white group-hover:scale-110 transition-transform z-10" /> 
             <span className="z-10">Sign up with Google</span>
          </button>
          
          {/* Link to Login */}
          <p className="mt-8 text-center text-gray-400">
            {t.already_have_account} 
            <Link href="/login" className="font-bold hover:underline ml-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-pink-400">
              {t.login_link}
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}