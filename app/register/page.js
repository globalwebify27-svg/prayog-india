"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Mail, 
  Phone, 
  BookOpen, 
  MapPin, 
  ArrowRight, 
  ShieldCheck,
  CreditCard,
  CheckCircle2,
  Lock,
  Globe,
  ChevronRight,
  ArrowLeft,
  ChevronLeft,
  Eye,
  EyeOff
} from "lucide-react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const STEPS = [
  { id: 1, title: "Identity", sub: "Basic profile details" },
  { id: 2, title: "Program", sub: "Batch & Course selection" },
  { id: 3, title: "Payment", sub: "Secure fee processing" }
];

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    specialization: "Robotics",
    courseId: "",
    mode: "Offline",
    batch: "Morning (9AM - 11AM)",
    isInstallment: true
  });

  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => setCourses(data))
      .catch(err => console.error(err));
  }, []);

  const categoryMap = {
    "Robotics": "Robotics",
    "AI & ML": "Artificial Intelligence",
    "Drone Tech": "Aviation",
    "IoT": "Electronics"
  };

  const filteredCourses = courses.filter(c => 
    c.category === categoryMap[formData.specialization] && 
    c.type.toLowerCase() === formData.mode.toLowerCase()
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  const handleRegister = async () => {
    setIsSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          course_id: formData.courseId,
          mode: formData.mode,
          batch: formData.batch,
          isInstallment: formData.isInstallment
        })
      });

      const data = await res.json();

      if (data.success) {
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });
        window.location.href = "/dashboard";
      } else {
        alert("Registration Failed: " + data.message);
      }
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />
      
      <section className="pt-32 pb-16 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-semibold text-white mb-4 tracking-tight">Student Enrollment</h1>
            <p className="text-blue-100/60 text-base md:text-lg max-w-xl">Initialize your academic journey at Prayog India for the 2026 specialization cohort.</p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          
          <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
            
            {/* Steps Sidebar */}
            <div className="lg:w-1/3 bg-navy p-10 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-3xl" />
              <div>
                <div className="mb-12">
                  <span className="text-primary font-bold text-[10px] uppercase tracking-widest">Enrollment progress</span>
                  <div className="w-10 h-0.5 bg-primary mt-2 rounded-full"></div>
                </div>

                <div className="space-y-10 relative">
                  <div className="absolute left-5 top-5 bottom-5 w-[1px] bg-white/10" />
                  {STEPS.map((s) => (
                    <div key={s.id} className="relative flex items-center gap-6 group">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 transition-all duration-500 border-2 z-10 ${
                        step === s.id ? "bg-primary text-navy border-primary shadow-lg shadow-primary/20" : 
                        step > s.id ? "bg-emerald-500 text-white border-emerald-500 shadow-md" : "bg-navy/50 text-white/30 border-white/10 backdrop-blur-sm"
                      }`}>
                        {step > s.id ? <CheckCircle2 size={18} /> : s.id}
                      </div>
                      <div>
                        <p className={`text-xs font-bold uppercase tracking-wide ${step === s.id ? "text-white" : "text-white/40"}`}>{s.title}</p>
                        <p className="text-[10px] text-white/30 font-medium">{s.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="pt-12 border-t border-white/5 flex items-center gap-3 text-white/30">
                <ShieldCheck size={16} className="text-primary" />
                <p className="text-[9px] font-bold uppercase tracking-widest">Secure TLS Encryption</p>
              </div>
            </div>

            {/* Form Content */}
            <div className="lg:w-2/3 p-8 md:p-12 lg:p-16 flex flex-col">
              <div className="flex-grow">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Personal Identity</h2>
                        <p className="text-slate-500 text-sm">Official contact details for institutional records.</p>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Legal name</label>
                          <div className="relative group">
                            <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy transition-colors" />
                            <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Rahul Sharma" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Institutional Email</label>
                          <div className="relative group">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy transition-colors" />
                            <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="name@email.com" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Mobile number</label>
                          <div className="relative group">
                            <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy transition-colors" />
                            <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 70330XXXXX" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Secure password</label>
                          <div className="relative group">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy transition-colors" />
                            <input 
                              type={showPassword ? "text" : "password"} 
                              name="password" 
                              value={formData.password} 
                              onChange={handleInputChange} 
                              placeholder="••••••••" 
                              className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium" 
                            />
                            <button 
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
                            >
                              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Program selection</h2>
                        <p className="text-slate-500 text-sm">Choose your specialization and preferred mode.</p>
                      </div>
                      <div className="space-y-4">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Available Specializations</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {["Robotics", "AI & ML", "Drone Tech", "IoT"].map(c => (
                            <button 
                              key={c} 
                              type="button"
                              onClick={() => setFormData({...formData, specialization: c, courseId: ""})} 
                              className={`p-3 rounded-xl border transition-all text-xs font-bold uppercase ${formData.specialization === c ? "bg-navy text-white border-navy shadow-md" : "bg-white text-slate-400 border-slate-200 hover:border-navy"}`}
                            >
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Select Specific Program</label>
                        <select 
                          required
                          name="courseId" 
                          value={formData.courseId} 
                          onChange={handleInputChange} 
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy text-sm font-semibold"
                        >
                          <option value="">-- Choose Course --</option>
                          {filteredCourses.map(c => (
                            <option key={c.id} value={c.id}>{c.title}</option>
                          ))}
                        </select>
                        {filteredCourses.length === 0 && (
                          <p className="text-[10px] text-amber-600 font-bold ml-1 italic">No {formData.mode} courses available for this specialization.</p>
                        )}
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Learning environment</label>
                          <select name="mode" value={formData.mode} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy text-sm font-semibold">
                            <option value="Offline">Offline (Institutional)</option>
                            <option value="Online">Online (Live Virtual)</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Schedule batch</label>
                          <select name="batch" value={formData.batch} onChange={handleInputChange} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy text-sm font-semibold">
                            <option>Morning (9AM - 11AM)</option>
                            <option>Evening (6PM - 8PM)</option>
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                      <div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-2">Secure checkout</h2>
                        <p className="text-slate-500 text-sm">Initialize enrollment with institutional fee gateway.</p>
                      </div>
                      <div className="bg-navy rounded-2xl p-6 md:p-8 text-white relative overflow-hidden shadow-lg border border-white/5">
                        <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none"><CreditCard size={80} /></div>
                        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                          <div className="text-center md:text-left">
                            <p className="text-primary font-bold text-[9px] uppercase tracking-widest mb-1.5">Certification enrollment</p>
                            <h3 className="text-lg font-bold">
                              {courses.find(c => c.id == formData.courseId)?.title || formData.specialization}
                            </h3>
                            <p className="text-white/40 text-[10px] font-medium uppercase mt-1">{formData.mode} • Session 2026</p>
                          </div>
                          <div className="text-center md:text-right">
                            <p className="text-white/30 text-[9px] font-bold uppercase mb-1">Fee investment</p>
                            <p className="text-2xl font-bold tracking-tight">₹15,000</p>
                          </div>
                        </div>
                      </div>
                      <div className="grid md:grid-cols-2 gap-3">
                        <div onClick={() => setFormData({...formData, isInstallment: false})} className={`p-5 border rounded-xl cursor-pointer transition-all ${!formData.isInstallment ? 'border-navy bg-navy/5' : 'border-slate-200 hover:border-navy shadow-sm'}`}>
                          <h4 className="font-bold text-slate-900 text-sm mb-1">Lump-sum payment</h4>
                          <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Complete tuition fee</p>
                        </div>
                        <div onClick={() => setFormData({...formData, isInstallment: true})} className={`p-5 border rounded-xl cursor-pointer transition-all ${formData.isInstallment ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-navy shadow-sm'}`}>
                          <h4 className={`text-sm font-bold mb-1 ${formData.isInstallment ? 'text-navy' : 'text-slate-900'}`}>Installment plan</h4>
                          <p className={`text-[9px] font-bold uppercase tracking-tight ${formData.isInstallment ? 'text-navy' : 'text-slate-500'}`}>3 Interest-free cycles</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-12 pt-8 border-t border-slate-100 flex items-center justify-between">
                <button 
                  onClick={prevStep} 
                  disabled={step === 1} 
                  className={`flex items-center space-x-2 text-xs font-bold uppercase transition-all ${step === 1 ? "opacity-0 invisible" : "text-slate-400 hover:text-navy"}`}
                >
                  <ChevronLeft size={16} />
                  <span>Previous</span>
                </button>
                <button 
                  onClick={step === 3 ? handleRegister : nextStep} 
                  disabled={isSubmitting} 
                  className="bg-navy text-white px-10 py-3 rounded-lg font-bold text-xs uppercase tracking-wide shadow-lg hover:bg-black transition-all flex items-center gap-2"
                >
                  <span>{isSubmitting ? "Processing..." : step === 3 ? "Process enrollment" : "Continue"}</span>
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
