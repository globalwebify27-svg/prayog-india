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
  Tag,
  Sparkles,
  Sun,
  Moon
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

function RegisterForm({ pageContent }) {
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

  // OTP Verification States
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then(res => res.json())
      .then(data => {
        if (data.success && data.user) {
          setIsLoggedIn(true);
          fetch("/api/student/dashboard")
            .then(dRes => dRes.json())
            .then(dData => {
               const u = dData?.data?.user;
               if (u) {
                 setFormData(prev => ({
                   ...prev,
                   name: u.name || data.user.name || "",
                   email: u.email || data.user.email || "",
                   phone: u.phone || "",
                   emergencyContact: u.emergency_contact || ""
                 }));
               } else {
                 setFormData(prev => ({
                   ...prev,
                   name: data.user.name || "",
                   email: data.user.email || ""
                 }));
               }
            })
            .catch(() => {});
        }
      })
      .catch(() => {});
  }, []);

  const checkEmailAvailability = async (email) => {
    if (isLoggedIn) return;
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return;
    }
    setIsCheckingEmail(true);
    try {
      const res = await fetch(`/api/register/check-email?email=${encodeURIComponent(email)}`);
      const data = await res.json();
      if (data.success && data.exists) {
        setErrors(prev => ({ ...prev, email: "This email is already registered." }));
      } else {
        setErrors(prev => {
          const { email: removed, ...rest } = prev;
          return rest;
        });
      }
    } catch (err) {
      console.error("Error checking email availability:", err);
    } finally {
      setIsCheckingEmail(false);
    }
  };
  const [otpCode, setOtpCode] = useState("");
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

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
    batch_id: "",
    isInstallment: true
  });

  const [dynamicCategories, setDynamicCategories] = useState(["All", "Internships", "1:1 Training"]);

  const [errors, setErrors] = useState({});

  const validateStep = () => {
    let newErrors = {};
    if (step === 1) {
      if (!formData.courseId) {
        newErrors.courseId = "Please select a specific program to continue.";
      } else {
        const selectedCourse = courses.find(c => c.id === formData.courseId);
        const availableBatches = selectedCourse?.batches?.filter(b => b.type === formData.mode.toLowerCase()) || [];
        if (availableBatches.length > 0 && !formData.batch_id) {
          newErrors.batch_id = "Please select a batch schedule to continue.";
        }
      }
    } else if (step === 2) {
      if (!formData.name.trim()) newErrors.name = "Legal name is required for institutional records.";
      
      if (!formData.email.trim()) {
        newErrors.email = "Institutional email is required.";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Please enter a valid institutional email address.";
      } else if (errors.email === "This email is already registered.") {
        newErrors.email = "This email is already registered.";
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

      if (!isLoggedIn) {
        if (!formData.password) {
          newErrors.password = "Security password is required.";
        } else if (formData.password.length < 6) {
          newErrors.password = "Password must be at least 6 characters long.";
        }

        if (formData.confirmPassword !== formData.password) {
          newErrors.confirmPassword = "Passwords do not match.";
        }
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
        const allSpecs = ["All", "Internships", "1:1 Training", ...Array.from(specs)];
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
        if (formData.specialization === "All") return true;
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
    if (formData.specialization === "All") return true;
    return formData.specialization === "Internships" ? c.is_internship === 1 :
           formData.specialization === "1:1 Training" ? c.is_one_to_one === 1 :
           (c.specializations && c.specializations.some(s => s.name === formData.specialization));
  });

  const selectedCourse = courses.find(c => c.id == formData.courseId);

  // Auto-select batch if only one is available
  useEffect(() => {
    if (selectedCourse && selectedCourse.batches) {
      const availableBatches = selectedCourse.batches.filter(b => b.type === formData.mode.toLowerCase());
      if (availableBatches.length === 1 && formData.batch_id !== availableBatches[0].id) {
        setFormData(prev => ({ ...prev, batch_id: availableBatches[0].id }));
      } else if (availableBatches.length === 0 && formData.batch_id !== "") {
        setFormData(prev => ({ ...prev, batch_id: "" }));
      }
    }
  }, [selectedCourse, formData.mode, formData.batch_id]);

  // Resend OTP countdown timer
  useEffect(() => {
    let timer;
    if (resendCountdown > 0) {
      timer = setTimeout(() => setResendCountdown(prev => prev - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [resendCountdown]);

  // Reset verification if user changes email
  useEffect(() => {
    if (isLoggedIn) {
      setIsEmailVerified(true);
      return;
    }
    setIsEmailVerified(false);
    setIsOtpModalOpen(false);
    setOtpCode("");
  }, [formData.email, isLoggedIn]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (name === "email") {
      setErrors(prev => {
        const { email: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSendOtp = async (targetEmail = formData.email) => {
    if (!targetEmail || !/\S+@\S+\.\S+/.test(targetEmail)) {
      setErrors({ email: "Please enter a valid email address first." });
      return;
    }
    setIsSendingOtp(true);
    setOtpError("");
    try {
      const res = await fetch("/api/register/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: targetEmail })
      });
      const data = await res.json();
      if (data.success) {
        setIsOtpModalOpen(true);
        setResendCountdown(30); // 30 seconds cooldown
      } else {
        setErrors({ email: data.message || "Failed to send verification code." });
        setIsOtpModalOpen(false);
      }
    } catch (error) {
      setOtpError("Failed to send code due to a network error.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length < 6) {
      setOtpError("Please enter a valid 6-digit code.");
      return;
    }
    setIsVerifyingOtp(true);
    setOtpError("");
    try {
      const res = await fetch("/api/register/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpCode })
      });
      const data = await res.json();
      if (data.success) {
        setIsEmailVerified(true);
        setIsOtpModalOpen(false);
        setOtpCode("");
      } else {
        setOtpError(data.message || "Incorrect verification code.");
      }
    } catch (error) {
      setOtpError("Verification failed due to a network error.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const nextStep = () => {
    if (validateStep()) {
      if (step === 2 && !isEmailVerified) {
        return;
      }
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
      // 1. Create Payment Order (NO database insertion yet)
      const orderRes = await fetch("/api/register/create-payment-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          course_id: formData.courseId,
          coupon_code: couponDetails?.code,
          isInstallment: formData.isInstallment
        })
      });

      const orderData = await orderRes.json();

      if (orderData.success) {
        if (orderData.isFree) {
          // Bypass Razorpay for 100% Free Registrations
          try {
            const verifyRes = await fetch("/api/register/verify-and-register", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                razorpay_order_id: "FREE_ENROLLMENT",
                razorpay_payment_id: "FREE_" + Date.now(),
                razorpay_signature: "FREE",
                name: formData.name,
                email: formData.email,
                password: formData.password,
                phone: formData.phone,
                emergency_contact: formData.emergencyContact,
                course_id: formData.courseId,
                mode: formData.mode,
                batch_id: formData.batch_id,
                isInstallment: formData.isInstallment,
                coupon_code: couponDetails?.code,
                payment_method: 'free'
              })
            });
            
            const verifyData = await verifyRes.json();
            if (verifyData.success) {
              await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: formData.email, password: formData.password })
              });
              window.location.href = "/dashboard?payment=success";
            } else {
              showAlert("Registration Failed", verifyData.message || "Failed to process free enrollment.", "error");
            }
          } catch (err) {
            showAlert("Registration Failed", "Failed to process free enrollment. Please contact support.", "error");
          }
          return;
        }

        // 2. Open Razorpay Checkout
        let isPaymentFailed = false;

        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "Prayog India",
          description: `Enrollment: ${selectedCourse.title}`,
          order_id: orderData.orderId,
          handler: async function (response) {
            // 3. Verify Payment and Create Database Records
            try {
              const verifyRes = await fetch("/api/register/verify-and-register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  // Payment details
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_signature: response.razorpay_signature,
                  // Registration details
                  name: formData.name,
                  email: formData.email,
                  password: formData.password,
                  phone: formData.phone,
                  emergency_contact: formData.emergencyContact,
                  course_id: formData.courseId,
                  mode: formData.mode,
                  batch_id: formData.batch_id,
                  isInstallment: formData.isInstallment,
                  coupon_code: couponDetails?.code,
                  payment_method: 'online'
                })
              });
              
              const verifyData = await verifyRes.json();
              
              if (verifyData.success) {
                // Auto login after successful registration
                await fetch("/api/auth/login", {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({ email: formData.email, password: formData.password })
                });
                window.location.href = "/dashboard?payment=success";
              } else {
                showAlert("Registration Failed", verifyData.message || "Payment was successful but registration failed. Please contact support.", "error");
              }
            } catch (err) {
               showAlert("Registration Failed", "Payment was successful but registration failed. Please contact support.", "error");
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: "#0F172A"
          },
          modal: {
            ondismiss: function() {
              if (!isPaymentFailed) {
                showAlert("Payment Cancelled", "You closed the payment window. Please try again to complete your registration.", "warning", () => {}, "Retry");
              }
              setIsSubmitting(false);
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response){
          isPaymentFailed = true;
          rzp.close(); // Autoclose the Razorpay modal on failure
          
          const errorMsg = response.error ? (response.error.description || response.error.reason) : "Transaction failed. Please try again with a different payment method.";
          
          setTimeout(() => {
            showAlert("Payment Failed", errorMsg, "error", () => {}, "Retry");
          }, 100);
          setIsSubmitting(false);
        });
        rzp.open();
      } else {
        showAlert("Error initializing payment", orderData.message || "Failed to create payment order.", "error", () => {}, "Retry");
        setIsSubmitting(false);
      }
    } catch (error) {
      showAlert("System Error", "An unexpected error occurred: " + error.message, "error", () => {}, "Retry");
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

                <div className="space-y-3">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Select Specific Program</label>
                  {filteredCourses.length === 0 ? (
                    <p className="text-sm text-amber-600 font-semibold p-4 bg-amber-50 rounded-lg border border-amber-100">No {formData.mode} courses available for this specialization.</p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {filteredCourses.map(c => {
                        const isSelected = formData.courseId == c.id;
                        return (
                          <button
                            key={c.id}
                            type="button"
                            disabled={isLocked && !isSelected}
                            onClick={() => setFormData({...formData, courseId: c.id.toString(), mode: c.type})}
                            className={`group flex flex-col items-start p-6 rounded-2xl border-2 transition-all duration-300 text-left relative overflow-hidden ${
                              isSelected 
                                ? "bg-gradient-to-br from-navy/5 to-primary/5 border-navy shadow-lg shadow-navy/10 scale-[1.02]" 
                                : "bg-white border-slate-200 hover:border-primary/50 hover:shadow-xl hover:-translate-y-1"
                            } ${isLocked && !isSelected ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                          >
                            {/* Decorative background elements */}
                            {isSelected && (
                              <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/10 rounded-full blur-2xl transition-all" />
                            )}

                            {/* Status Badge */}
                            <div className="absolute top-0 right-0 flex items-center">
                              {isSelected ? (
                                <div className="bg-navy text-white flex items-center gap-1.5 text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl tracking-widest uppercase shadow-sm">
                                  <CheckCircle2 size={12} className="text-primary" />
                                  Selected
                                </div>
                              ) : (
                                <div className="bg-slate-100 text-slate-400 group-hover:bg-primary/10 group-hover:text-primary text-[10px] font-bold px-4 py-1.5 rounded-bl-2xl tracking-widest uppercase transition-colors">
                                  Select
                                </div>
                              )}
                            </div>

                            {/* Course Image */}
                            <div className="w-full h-32 mb-4 rounded-xl overflow-hidden shrink-0 bg-slate-100 relative z-10 border border-slate-200/50">
                              <img src={c.image || null} alt={c.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                              
                              <div className="absolute top-2 left-2 flex gap-2">
                                {c.type && (
                                  <span className={`flex items-center gap-1 text-[9px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-md shadow-sm ${
                                    c.type.toLowerCase() === 'online' 
                                      ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white' 
                                      : 'bg-gradient-to-r from-amber-500 to-orange-500 text-white'
                                  }`}>
                                    {c.type.toLowerCase() === 'online' ? <Globe size={10} /> : <MapPin size={10} />}
                                    {c.type}
                                  </span>
                                )}
                              </div>
                            </div>
                            
                            <h3 className={`font-black text-sm mb-4 pr-10 z-10 leading-snug transition-colors ${
                              isSelected ? 'text-navy' : 'text-slate-800 group-hover:text-navy'
                            }`}>
                              {c.title}
                            </h3>
                            
                            <div className={`flex items-center justify-between w-full mt-auto pt-5 border-t z-10 transition-colors ${
                              isSelected ? 'border-navy/10' : 'border-slate-100 group-hover:border-primary/20'
                            }`}>
                              <div className="flex items-center gap-1.5">
                                <BookOpen size={14} className={isSelected ? 'text-primary' : 'text-slate-400'} />
                                <span className="text-[10px] font-extrabold text-slate-500 uppercase tracking-widest">
                                  Full Course
                                </span>
                              </div>
                              <span className={`text-xl font-black flex items-center ${
                                isSelected ? 'text-navy' : 'text-slate-700'
                              }`}>
                                <IndianRupee size={16} className={isSelected ? 'text-primary mr-0.5' : 'text-slate-400 mr-0.5'} />
                                {Number(c.price).toLocaleString('en-IN')}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                  {errors.courseId && (
                    <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1 mt-1">
                      <AlertCircle size={10} /> {errors.courseId}
                    </p>
                  )}
                </div>

                <div className="space-y-3 pt-2">
                  <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">Schedule batch</label>
                  {!selectedCourse ? (
                    <p className="text-xs text-slate-500 italic p-4 bg-slate-50 rounded-xl border border-slate-200 text-center font-medium">
                      Select a program above to see available batches
                    </p>
                  ) : selectedCourse.batches && selectedCourse.batches.filter(b => b.type === formData.mode.toLowerCase()).length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {selectedCourse.batches.filter(b => b.type === formData.mode.toLowerCase()).map(b => (
                          <button
                            key={b.id}
                            type="button"
                            onClick={() => setFormData({...formData, batch_id: b.id})}
                            className={`p-4 rounded-xl border-2 transition-all text-sm font-bold flex flex-col items-center justify-center gap-1 ${
                              formData.batch_id === b.id 
                                ? "bg-navy/5 border-navy text-navy shadow-sm" 
                                : "bg-white border-slate-100 text-slate-600 hover:border-navy/30 hover:bg-slate-50"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              {b.name.toLowerCase().includes("morning") ? <Sun size={16} /> : <Moon size={16} />}
                              <span>{b.name}</span>
                            </div>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
                              {b.start_time ? `${b.start_time.substring(0, 5)} - ${b.end_time?.substring(0, 5)}` : 'Flexible Timing'}
                            </span>
                          </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-amber-600 italic p-4 bg-amber-50 rounded-xl border border-amber-200 text-center font-bold">
                      No batches scheduled for {formData.mode} mode yet.
                    </p>
                  )}
                  {errors.batch_id && (
                    <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1 mt-1">
                      <AlertCircle size={10} /> {errors.batch_id}
                    </p>
                  )}
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
                        disabled={isLoggedIn}
                        placeholder="Rahul Sharma" 
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-lg outline-none focus:bg-white transition-all text-sm font-medium ${
                          errors.name ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                        } ${isLoggedIn ? "opacity-70 cursor-not-allowed bg-slate-100" : ""}`} 
                      />
                    </div>
                    {errors.name && (
                      <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1 mt-1">
                        <AlertCircle size={10} /> {errors.name}
                      </p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-[11px] font-bold text-slate-400 uppercase tracking-tight ml-1">
                      Institutional Email {isCheckingEmail && <span className="text-[9px] text-slate-400 animate-pulse ml-1">(Checking...)</span>}
                    </label>
                    <div className="relative flex items-center gap-2">
                      <div className="relative flex-grow">
                        <Mail size={16} className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${errors.email ? 'text-rose-400' : 'text-slate-400 group-focus-within:text-navy'}`} />
                        <input 
                          type="email" 
                          name="email" 
                          value={formData.email} 
                          onChange={handleInputChange} 
                          disabled={isEmailVerified || isLoggedIn}
                          onBlur={(e) => checkEmailAvailability(e.target.value)}
                          placeholder="name@email.com" 
                          className={`w-full pl-11 pr-10 py-3 bg-slate-50 border rounded-lg outline-none focus:bg-white transition-all text-sm font-medium ${
                            errors.email ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                          } ${isEmailVerified ? "border-emerald-300 bg-emerald-50/20 text-emerald-800" : ""} ${isLoggedIn ? "opacity-70 cursor-not-allowed bg-slate-100" : ""}`} 
                        />
                        {isCheckingEmail && (
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
                            <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-navy border-t-transparent" />
                          </div>
                        )}
                      </div>
                      
                      {isEmailVerified ? (
                        <div className="flex items-center gap-1.5 bg-emerald-50 text-emerald-700 px-3 py-3 border border-emerald-200 rounded-lg text-xs font-bold whitespace-nowrap shadow-sm">
                          <CheckCircle2 size={14} className="text-emerald-600 animate-bounce" />
                          <span>Verified</span>
                        </div>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleSendOtp()}
                          disabled={isSendingOtp || !formData.email || !/\S+@\S+\.\S+/.test(formData.email)}
                          className="bg-navy hover:bg-black text-white px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap shadow-md flex items-center gap-1.5 hover:scale-105 active:scale-95"
                        >
                          {isSendingOtp ? (
                            <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent" />
                          ) : (
                            "Verify"
                          )}
                        </button>
                      )}
                    </div>
                    {isEmailVerified && (
                      <div className="flex justify-between items-center mt-1 ml-1">
                        <p className="text-[10px] text-emerald-600 font-bold">Email verified successfully.</p>
                        {!isLoggedIn && (
                          <button
                            type="button"
                            onClick={() => {
                              setIsEmailVerified(false);
                              setOtpCode("");
                            }}
                            className="text-[10px] text-rose-500 font-bold hover:underline"
                          >
                            Change Email
                          </button>
                        )}
                      </div>
                    )}
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
                        maxLength={10}
                        value={formData.phone} 
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, '');
                          if (val.length > 10) val = val.slice(0, 10);
                          setFormData({...formData, phone: val});
                        }}
                        disabled={isLoggedIn}
                        placeholder="70330XXXXX (10-digits)" 
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-lg outline-none focus:bg-white transition-all text-sm font-medium ${
                          errors.phone ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                        } ${isLoggedIn ? "opacity-70 cursor-not-allowed bg-slate-100" : ""}`} 
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
                        maxLength={10}
                        value={formData.emergencyContact} 
                        onChange={(e) => {
                          let val = e.target.value.replace(/[^0-9]/g, '');
                          if (val.length > 10) val = val.slice(0, 10);
                          setFormData({...formData, emergencyContact: val});
                        }}
                        disabled={isLoggedIn}
                        placeholder="Guardian's 10-digit Number" 
                        className={`w-full pl-11 pr-4 py-3 bg-slate-50 border rounded-lg outline-none focus:bg-white transition-all text-sm font-medium ${
                          errors.emergencyContact ? "border-rose-300 focus:border-rose-500 bg-rose-50/30" : "border-slate-200 focus:border-navy"
                        } ${isLoggedIn ? "opacity-70 cursor-not-allowed bg-slate-100" : ""}`} 
                      />
                    </div>
                    {errors.emergencyContact && (
                      <p className="text-[10px] text-rose-500 font-bold ml-1 flex items-center gap-1 mt-1">
                        <AlertCircle size={10} /> {errors.emergencyContact}
                      </p>
                    )}
                  </div>
                  
                  {!isLoggedIn && (
                    <>
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
                    </>
                  )}
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

                {Number(selectedCourse?.price || 0) > 0 && (
                  <>
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
                  </>
                )}
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
            disabled={isSubmitting || (step === 2 && !isEmailVerified)} 
            className="bg-navy text-white px-10 py-3 rounded-lg font-bold text-xs uppercase tracking-wide shadow-lg hover:bg-black transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>
              {isSubmitting 
                ? "Processing..." 
                : step === 3 
                  ? ((couponDetails ? (couponDetails.discount_type === 'percentage' ? Number(selectedCourse?.price) * (1 - couponDetails.discount_value / 100) : Number(selectedCourse?.price) - couponDetails.discount_value) : Number(selectedCourse?.price || 0)) <= 0 ? "Complete Free Registration" : "Process enrollment") 
                  : step === 2 && !isEmailVerified
                    ? "Verify Email to Continue"
                    : "Continue"
              }
            </span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* OTP Verification Modal */}
      <AnimatePresence>
        {isOtpModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-100 space-y-6 text-center"
            >
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Verify Your Email</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  We have sent a 6-digit verification code to <span className="font-semibold text-navy">{formData.email}</span>.
                </p>
              </div>

              <div className="space-y-4">
                <div className="relative max-w-[280px] mx-auto">
                  <input 
                    type="text" 
                    maxLength={6}
                    value={otpCode}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9]/g, '');
                      setOtpCode(val);
                    }}
                    placeholder="000000"
                    className="w-full text-center tracking-[0.75em] text-2xl font-black py-4 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-navy focus:bg-white transition-all shadow-inner text-slate-800"
                  />
                </div>
                
                {otpError && (
                  <p className="text-[11px] text-rose-500 font-bold flex items-center justify-center gap-1 animate-pulse">
                    <AlertCircle size={12} /> {otpError}
                  </p>
                )}
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  type="button"
                  onClick={handleVerifyOtp}
                  disabled={isVerifyingOtp || otpCode.length < 6}
                  className="w-full bg-navy text-white py-3.5 rounded-xl font-bold text-xs uppercase tracking-widest shadow-lg hover:bg-black transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isVerifyingOtp ? (
                    <span className="inline-block animate-spin rounded-full h-3.5 w-3.5 border-2 border-white border-t-transparent mr-2" />
                  ) : null}
                  <span>Verify Code</span>
                  <ShieldCheck size={16} />
                </button>

                <div className="flex items-center justify-between text-xs font-semibold px-2">
                  <button 
                    type="button" 
                    onClick={() => {
                      setIsOtpModalOpen(false);
                      setOtpCode("");
                      setOtpError("");
                    }} 
                    className="text-slate-400 hover:text-navy transition-colors flex items-center gap-1"
                  >
                    <ChevronLeft size={16} />
                    <span>Cancel</span>
                  </button>

                  {resendCountdown > 0 ? (
                    <span className="text-slate-400 font-medium">Resend in {resendCountdown}s</span>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => handleSendOtp()} 
                      disabled={isSendingOtp}
                      className="text-primary hover:text-navy transition-colors font-bold"
                    >
                      {isSendingOtp ? "Sending..." : "Resend Code"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

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
  const [pageContent, setPageContent] = useState(null);

  useEffect(() => {
    fetch('/api/pages?slug=admission')
      .then(res => res.json())
      .then(data => {
        if (data.success && data.data?.content) {
          setPageContent(data.data.content);
        }
      })
      .catch(console.error);
  }, []);

  const content = pageContent || {
    heroTitleLine1: "Start Your Innovation",
    heroTitleLine2: "Journey Today",
    heroSubtitle: "Secure your seat in our upcoming batches.",
    heroDescription: "Complete the registration form to enroll in Prayog India's technology training programs. Our team will contact you shortly after submission.",
    heroBadge: "Student Enrollment"
  };

  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />
      
      <section className="pt-32 pb-16 bg-navy relative overflow-hidden">
        <div className="absolute inset-0 opacity-5" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-sm font-bold mb-6 text-gold shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span className="tracking-widest uppercase text-xs">{content.heroBadge}</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black mb-6 tracking-tight leading-tight text-white">
              {content.heroTitleLine1} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold via-yellow-300 to-amber-200 drop-shadow-sm">
                {content.heroTitleLine2}
              </span>
            </h1>
            <p className="text-xl text-blue-100 mb-6 font-medium">
              {content.heroSubtitle}
            </p>
            <p className="text-blue-100/70 leading-relaxed mb-8 max-w-2xl">
              {content.heroDescription}
            </p>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20">
        <div className="max-w-6xl mx-auto px-6">
          <Suspense fallback={<div className="h-[600px] bg-white rounded-2xl flex items-center justify-center">Loading enrollment gateway...</div>}>
            <RegisterForm pageContent={pageContent} />
          </Suspense>
        </div>
      </section>

      <Footer />
    </main>
  );
}
