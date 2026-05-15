"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
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
  Lock as LockIcon,
  Globe,
  ChevronRight,
  ArrowLeft,
  ChevronLeft,
  Eye,
  EyeOff,
  AlertCircle,
  Smartphone,
  IndianRupee,
  BadgeInfo,
  Tag
} from "lucide-react";
import Link from "next/link";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import Script from "next/script";

import CustomModal from "../../components/CustomModal";

const STEPS = [
  { id: 1, title: "Program", sub: "Batch & Course selection" },
  { id: 2, title: "Identity", sub: "Basic profile details" },
  { id: 3, title: "Payment", sub: "Secure fee processing" }
];

function RegisterForm() {
  const searchParams = useSearchParams();
  const preSelectedCourseId = searchParams.get("course");
  const shouldLock = searchParams.get("lock") === "true";

  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [courses, setCourses] = useState([]);
  const [isLocked, setIsLocked] = useState(false);
  
  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [couponDetails, setCouponDetails] = useState(null);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);

  // Modal State
  const [modalConfig, setModalConfig] = useState({
    isOpen: false,
    title: "",
    description: "",
    type: "info",
    confirmText: "Confirm",
    onConfirm: () => {}
  });

  const showAlert = (title, description, type = "info", onConfirm = () => {}, confirmText = "Confirm") => {
    setModalConfig({
      isOpen: true,
      title,
      description,
      type,
      confirmText,
      onConfirm
    });
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    emergencyContact: "",
    password: "",
    confirmPassword: "",
    specialization: "Internships",
    courseId: "",
    mode: "Offline",
    batch: "Morning (9AM - 11AM)",
    isInstallment: true
  });

  const [dynamicCategories, setDynamicCategories] = useState(["Internships", "1:1 Training"]);

  const [errors, setErrors] = useState({});

  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.courseId) newErrors.courseId = "Please select a specific program to continue.";
    } else if (step === 2) {
      if (!formData.name.trim()) newErrors.name = "Legal name is required for institutional records.";
      
      if (!formData.email.trim()) {
        newErrors.email = "Institutional email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid institutional email address.";
      }

      const phoneClean = formData.phone.replace(/[^0-9]/g, '');
      if (!formData.phone.trim()) {
        newErrors.phone = "Mobile number is required.";
      } else if (phoneClean.length < 10) {
        newErrors.phone = "Mobile number must be at least 10 digits.";
      }

      if (!formData.emergencyContact.trim()) {
        newErrors.emergencyContact = "Emergency contact number is required.";
      } else if (formData.emergencyContact.length < 10) {
        newErrors.emergencyContact = "Emergency contact must be a valid 10-digit mobile number.";
      }

      if (!formData.password) {
        newErrors.password = "Security password is required.";
      } else if (formData.password.length < 6) {
        newErrors.password = "Password must be at least 6 characters long.";
      }

      if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match.";
      }
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleApplyCoupon = async () => {
    if (!couponCode) return;
    setIsValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, courseId: formData.courseId })
      });
      const data = await res.json();
      if (data.success) {
        setCouponDetails(data);
      } else {
        showAlert("Invalid Coupon", data.message || "The entered coupon code is not applicable for this program.", "warning");
        setCouponDetails(null);
      }
    } catch (error) {
      showAlert("Technical Error", "Failed to validate coupon due to a network issue.", "error");
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  useEffect(() => {
    fetch("/api/courses")
      .then(res => res.json())
      .then(data => {
        setCourses(data);
        
        // Extract unique specializations
        const specs = new Set();
        data.forEach(course => {
          if (course.specializations) {
            course.specializations.forEach(s => specs.add(s.name));
          }
        });
        const allSpecs = ["Internships", "1:1 Training", ...Array.from(specs)];
        setDynamicCategories(allSpecs);

        if (preSelectedCourseId) {
          const selected = data.find(c => c.id == preSelectedCourseId);
          if (selected) {
            let spec = "Internships";
            if (selected.is_internship === 1) spec = "Internships";
            else if (selected.is_one_to_one === 1) spec = "1:1 Training";
            else if (selected.specializations?.length > 0) spec = selected.specializations[0].name;

            setFormData(prev => ({
              ...prev,
              courseId: preSelectedCourseId,
              specialization: spec,
              mode: selected.type || prev.mode
            }));
            if (shouldLock) {
              setIsLocked(true);
            }
          }
        } else {
          // Default to first specialization
          if (allSpecs.length > 0) {
            setFormData(prev => ({ ...prev, specialization: allSpecs[0] }));
          }
        }
      })
      .catch(err => console.error(err));
  }, [preSelectedCourseId, shouldLock]);

  const availableModesForSpecialization = [
    ...new Set(courses
      .filter(c => {
        if (formData.specialization === "Internships") return c.is_internship === 1;
        if (formData.specialization === "1:1 Training") return c.is_one_to_one === 1;
        return c.specializations && c.specializations.some(s => s.name === formData.specialization);
      })
      .map(c => c.type))
  ];

  // Auto-switch mode if current mode is not available for selected specialization
  useEffect(() => {
    if (!isLocked && availableModesForSpecialization.length > 0 && !availableModesForSpecialization.includes(formData.mode)) {
      setFormData(prev => ({ ...prev, mode: availableModesForSpecialization[0], courseId: "" }));
    }
  }, [formData.specialization, availableModesForSpecialization, formData.mode, isLocked]);

  const filteredCourses = courses.filter(c => {
    const matchesSpec = formData.specialization === "Internships" ? c.is_internship === 1 :
                       formData.specialization === "1:1 Training" ? c.is_one_to_one === 1 :
                       (c.specializations && c.specializations.some(s => s.name === formData.specialization));
    const matchesMode = c.type.toLowerCase() === formData.mode.toLowerCase();
    return matchesSpec && matchesMode;
  });

  const selectedCourse = courses.find(c => c.id == formData.courseId);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (validateStep()) {
      setStep(prev => Math.min(prev + 1, 3));
    }
  };
  const prevStep = () => {
    setErrors({});
    setStep(prev => Math.max(prev - 1, 1));
  };

  const handleRegister = async () => {
    if (!validateStep()) return;
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
          emergency_contact: formData.emergencyContact,
          course_id: formData.courseId,
          mode: formData.mode,
          batch: formData.batch,
          isInstallment: formData.isInstallment,
          coupon_code: couponDetails?.code
        })
      });

      const data = await res.json();

      if (data.success) {
        // Auto-login to get the token for payment API
        await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email, password: formData.password })
        });

        // Initialize Razorpay
        let finalAmount = Number(selectedCourse.price);
        if (couponDetails) {
          if (couponDetails.discount_type === 'percentage') {
            finalAmount = finalAmount * (1 - couponDetails.discount_value / 100);
          } else {
            finalAmount = finalAmount - couponDetails.discount_value;
          }
        }

        const payAmount = formData.isInstallment 
          ? Math.round(finalAmount / (selectedCourse.installments_count || 1))
          : Math.round(finalAmount);

        const orderRes = await fetch("/api/payments/create-order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: payAmount,
            enrollmentId: data.enrollmentId
          })
        });

        const orderData = await orderRes.json();
        
        if (orderData.success) {
          const options = {
            key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
            amount: orderData.amount,
            currency: orderData.currency,
            name: "Prayog India",
            description: `Enrollment: ${selectedCourse.title}`,
            order_id: orderData.orderId,
            handler: function (response) {
              window.location.href = "/dashboard?payment=success";
            },
            prefill: {
              name: formData.name,
              email: formData.email,
              contact: formData.phone
            },
            theme: {
              color: "#0F172A"
            }
          };
          const rzp = new window.Razorpay(options);
          rzp.open();
        } else {
          // If order creation fails, still go to dashboard but warn
          window.location.href = "/dashboard?alert=payment_pending";
        }
      } else {
        showAlert("Registration Failed", data.message || "We were unable to process your enrollment at this time.", "error");
      }
    } catch (error) {
      showAlert("System Error", "An unexpected error occurred: " + error.message, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/40 border border-slate-200 overflow-hidden flex flex-col lg:flex-row min-h-[600px]">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
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
              <motion.div key="step1" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-10">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold text-slate-900 mb-2">Program selection</h2>
                    <p className="text-slate-500 text-sm">Choose your specialization and preferred mode.</p>
                  </div>
                  {isLocked && (
                    <button 
                      onClick={() => setIsLocked(false)}
                      className="text-[10px] font-bold text-navy bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg hover:bg-white hover:shadow-sm transition-all uppercase tracking-tight flex items-center gap-2"
                    >
                      <LockIcon size={12} className="text-slate-400" />
                      <span>Change Course</span>
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Available Specializations</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {dynamicCategories.map(c => (
                      <button 
                        key={c} 
                        type="button"
                        disabled={isLocked}
                        onClick={() => setFormData({...formData, specialization: c, courseId: ""})} 
                        className={`p-3 rounded-xl border transition-all text-[10px] font-bold uppercase ${formData.specialization === c ? "bg-navy text-white border-navy shadow-md" : "bg-white text-slate-400 border-slate-200 hover:border-navy"} ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                      >
                        {c}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Select Specific Program</label>
                    <select 
                      required
                      name="courseId" 
                      disabled={isLocked}
                      value={formData.courseId} 
                      onChange={handleInputChange} 
                      className={`w-full px-4 py-3 bg-slate-50 border rounded-lg outline-none focus:border-navy text-sm font-semibold transition-all ${
                        errors.courseId ? "border-rose-300 bg-rose-50/30" : "border-slate-200"
                      } ${isLocked ? 'opacity-70 cursor-not-allowed shadow-inner' : ''}`}
                    >
                      <option value="">-- Choose Course --</option>
                      {filteredCourses.map(c => (
                        <option key={c.id} value={c.id}>{c.title}</option>
                      ))}
                    </select>
                    {errors.courseId && (
                      <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1 mt-1">
                        <AlertCircle size={10} /> {errors.courseId}
                      </p>
                    )}
                    {filteredCourses.length === 0 && (
                      <p className="text-[10px] text-amber-600 font-bold ml-1 italic">No {formData.mode} courses available for this specialization.</p>
                    )}
                  </div>

                  {/* Price Preview Card */}
                  <AnimatePresence>
                    {selectedCourse && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }} 
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-navy/5 border border-navy/10 rounded-xl p-4 flex items-center justify-between"
                      >
                        <div>
                          <p className="text-[9px] font-bold text-navy/40 uppercase tracking-widest mb-1">Tuition Investment</p>
                          <div className="flex items-baseline gap-1">
                            <span className="text-xl font-bold text-navy">₹{Number(selectedCourse.price).toLocaleString('en-IN')}</span>
                            <span className="text-[10px] font-bold text-navy/40 uppercase tracking-tighter">Full Course</span>
                          </div>
                        </div>
                        <div className="bg-navy rounded-lg p-2.5 text-white shadow-lg">
                          <IndianRupee size={18} />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Learning environment</label>
                    <select 
                      name="mode" 
                      disabled={isLocked}
                      value={formData.mode} 
                      onChange={handleInputChange} 
                      className={`w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-navy text-sm font-semibold ${isLocked ? 'opacity-70 cursor-not-allowed' : ''}`}
                    >
                      {availableModesForSpecialization.map(mode => (
                        <option key={mode} value={mode}>
                          {mode === 'Offline' ? 'Offline (Institutional)' : 'Online (Live Virtual)'}
                        </option>
                      ))}
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

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Personal Identity</h2>
                  <p className="text-slate-500 text-sm">Official contact details for institutional records.</p>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Legal name</label>
                    <div className="relative group">
                      <User size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.name ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-navy'}`} />
                      <input 
                        type="text" 
                        name="name" 
                        value={formData.name} 
                        onChange={handleInputChange} 
                        placeholder="Rahul Sharma" 
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-lg outline-none focus:bg-white transition-all text-sm font-medium ${
                          errors.name ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                        }`} 
                      />
                    </div>
                    {errors.name && (
                      <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1 mt-1">
                        <AlertCircle size={10} /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Institutional Email</label>
                    <div className="relative group">
                      <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-navy'}`} />
                      <input 
                        type="email" 
                        name="email" 
                        value={formData.email} 
                        onChange={handleInputChange} 
                        placeholder="name@email.com" 
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-lg outline-none focus:bg-white transition-all text-sm font-medium ${
                          errors.email ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                        }`} 
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1 mt-1">
                        <AlertCircle size={10} /> {errors.email}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Mobile number</label>
                    <div className="relative group">
                      <Phone size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.phone ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-navy'}`} />
                      <input 
                        type="tel" 
                        name="phone" 
                        value={formData.phone} 
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val.length <= 10) {
                            setFormData({...formData, phone: val});
                          }
                        }}
                        placeholder="70330XXXXX (10-digits)" 
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-lg outline-none focus:bg-white transition-all text-sm font-medium ${
                          errors.phone ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                        }`} 
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1 mt-1">
                        <AlertCircle size={10} /> {errors.phone}
                      </p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Emergency Contact</label>
                    <div className="relative group">
                      <Smartphone size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.emergencyContact ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-navy'}`} />
                      <input 
                        type="tel" 
                        name="emergencyContact" 
                        value={formData.emergencyContact} 
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, '');
                          if (val.length <= 10) {
                            setFormData({...formData, emergencyContact: val});
                          }
                        }}
                        placeholder="Guardian's 10-digit Number" 
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-lg outline-none focus:bg-white transition-all text-sm font-medium ${
                          errors.emergencyContact ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                        }`} 
                      />
                    </div>
                    {errors.emergencyContact && (
                      <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1 mt-1">
                        <AlertCircle size={10} /> {errors.emergencyContact}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Secure password</label>
                    <div className="relative group">
                      <LockIcon size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.password ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-navy'}`} />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        name="password" 
                        value={formData.password} 
                        onChange={handleInputChange} 
                        placeholder="••••••••" 
                        className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-lg outline-none focus:bg-white transition-all text-sm font-medium ${
                          errors.password ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                        }`} 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.password && (
                      <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1 mt-1">
                        <AlertCircle size={10} /> {errors.password}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Confirm password</label>
                    <div className="relative group">
                      <LockIcon size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.confirmPassword ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-navy'}`} />
                      <input 
                        type={showConfirmPassword ? "text" : "password"} 
                        name="confirmPassword" 
                        value={formData.confirmPassword} 
                        onChange={handleInputChange} 
                        placeholder="••••••••" 
                        className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-lg outline-none transition-all text-sm font-medium ${
                          errors.confirmPassword
                            ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" 
                            : "border-slate-200 focus:border-navy focus:bg-white"
                        }`} 
                      />
                      <button 
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
                      >
                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                    {errors.confirmPassword && (
                      <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1 mt-1">
                        <AlertCircle size={10} /> {errors.confirmPassword}
                      </p>
                    )}
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
                        {selectedCourse?.title || formData.specialization}
                      </h3>
                      <p className="text-white/40 text-[10px] font-medium uppercase mt-1">{formData.mode} • Session 2026</p>
                    </div>
                    <div className="text-center md:text-right">
                      <p className="text-white/30 text-[9px] font-bold uppercase mb-1">Fee investment</p>
                      <div className="flex flex-col items-center md:items-end">
                        {couponDetails ? (
                          <>
                            <p className="text-xs text-white/40 line-through">₹{Number(selectedCourse?.price || 15000).toLocaleString('en-IN')}</p>
                            <p className="text-2xl font-bold tracking-tight text-primary">₹{Math.round(
                              couponDetails.discount_type === 'percentage' 
                              ? Number(selectedCourse?.price) * (1 - couponDetails.discount_value / 100)
                              : Number(selectedCourse?.price) - couponDetails.discount_value
                            ).toLocaleString('en-IN')}</p>
                          </>
                        ) : (
                          <p className="text-2xl font-bold tracking-tight">₹{Number(selectedCourse?.price || 15000).toLocaleString('en-IN')}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Coupon Code Section */}
                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Promotional Coupon</label>
                  <div className="flex gap-3">
                    <div className="relative flex-grow">
                      <Tag size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${couponDetails ? 'text-emerald-500' : 'text-slate-400'}`} />
                      <input 
                        type="text" 
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                        placeholder="ENTER CODE"
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-lg outline-none transition-all text-sm font-bold uppercase tracking-widest ${couponDetails ? 'border-emerald-500 focus:border-emerald-500' : 'border-slate-200 focus:border-navy'}`}
                      />
                      {couponDetails && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <CheckCircle2 size={16} className="text-emerald-500" />
                        </div>
                      )}
                    </div>
                    <button 
                      onClick={handleApplyCoupon}
                      disabled={isValidatingCoupon || !couponCode}
                      className="px-6 py-3 bg-white border border-slate-200 rounded-lg text-xs font-bold uppercase tracking-widest hover:bg-slate-50 transition-all disabled:opacity-50"
                    >
                      {isValidatingCoupon ? "..." : couponDetails ? "Applied" : "Apply"}
                    </button>
                  </div>
                  {couponDetails && (
                    <p className="text-[10px] text-emerald-600 font-bold ml-1">
                      Success! {couponDetails.discount_type === 'percentage' ? `${couponDetails.discount_value}%` : `₹${couponDetails.discount_value}`} discount applied.
                    </p>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-3">
                  <div onClick={() => setFormData({...formData, isInstallment: false})} className={`p-5 border rounded-xl cursor-pointer transition-all ${!formData.isInstallment ? 'border-navy bg-navy/5' : 'border-slate-200 hover:border-navy shadow-sm'}`}>
                    <h4 className="font-bold text-slate-900 text-sm mb-1">Full Payment</h4>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tight">Complete tuition fee</p>
                  </div>
                  {selectedCourse?.allow_partial_payment ? (
                    <div onClick={() => setFormData({...formData, isInstallment: true})} className={`p-5 border rounded-xl cursor-pointer transition-all ${formData.isInstallment ? 'border-primary bg-primary/5' : 'border-slate-200 hover:border-navy shadow-sm'}`}>
                      <h4 className={`text-sm font-bold mb-1 ${formData.isInstallment ? 'text-navy' : 'text-slate-900'}`}>Installment plan</h4>
                      <p className={`text-[9px] font-bold uppercase tracking-tight ${formData.isInstallment ? 'text-navy' : 'text-slate-500'}`}>
                        {selectedCourse?.installments_count} Interest-free cycles (₹{Math.round(
                          (couponDetails 
                            ? (couponDetails.discount_type === 'percentage' ? Number(selectedCourse?.price) * (1 - couponDetails.discount_value / 100) : Number(selectedCourse?.price) - couponDetails.discount_value)
                            : Number(selectedCourse.price)
                          ) / selectedCourse.installments_count
                        ).toLocaleString('en-IN')}/mo)
                      </p>
                    </div>
                  ) : (
                    <div className="p-5 border border-slate-100 bg-slate-50/50 rounded-xl opacity-60 flex flex-col justify-center">
                      <h4 className="font-bold text-slate-400 text-sm mb-1 italic">No Installments</h4>
                      <p className="text-[9px] text-slate-400 font-bold uppercase tracking-tight">Partial payment not enabled for this program</p>
                    </div>
                  )}
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

      <CustomModal 
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        description={modalConfig.description}
        type={modalConfig.type}
        confirmText={modalConfig.confirmText}
      />
    </div>
  );
}

export default function RegisterPage() {
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
          <Suspense fallback={<div className="h-[600px] bg-white rounded-2xl flex items-center justify-center">Loading enrollment gateway...</div>}>
            <RegisterForm />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}
