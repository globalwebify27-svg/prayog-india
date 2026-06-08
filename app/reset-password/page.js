"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Zap,
  ArrowLeft,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [errors, setErrors] = useState({});
  const [successMsg, setSuccessMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    let newErrors = {};
    if (!password) {
      newErrors.password = "Password is required.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirmation password is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (!token) {
      setError("Reset token is missing from the URL. Please request a new reset link.");
      return;
    }

    setIsLoading(true);
    setError("");
    setErrors({});
    setSuccessMsg("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();

      if (data.success) {
        setSuccessMsg(data.message || "Your password has been reset successfully. Redirecting you to login...");
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      } else {
        setError(data.message || "Failed to reset password. The link may have expired or is invalid.");
      }
    } catch (err) {
      setError("A system error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xl shadow-navy/5 text-center">
        <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold leading-relaxed">
          Invalid request. Reset token is missing from the URL.
        </div>
        <Link 
          href="/login" 
          className="bg-navy text-white py-3.5 px-6 rounded-xl font-bold text-sm shadow-lg shadow-navy/10 hover:bg-black transition-all inline-flex items-center space-x-2"
        >
          <ArrowLeft size={16} className="mr-1.5" /> Back to login
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto lg:ml-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xl shadow-navy/5"
      >
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h2>
          <p className="text-slate-500 text-sm">Please set your new security password.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold leading-relaxed">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-600 text-xs font-semibold leading-relaxed">
            {successMsg}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1">New password</label>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy transition-colors" />
              <input 
                type={showPassword ? "text" : "password"} 
                name="password"
                placeholder="••••••••"
                className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-xl outline-none transition-all text-sm ${errors.password ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-navy focus:bg-white'}`}
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-rose-500 font-bold ml-1 mt-1">{errors.password}</p>}
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 ml-1">Confirm new password</label>
            <div className="relative group">
              <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy transition-colors" />
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                name="confirmPassword"
                placeholder="••••••••"
                className={`w-full pl-11 pr-12 py-3 bg-slate-50 border rounded-xl outline-none transition-all text-sm ${errors.confirmPassword ? 'border-rose-300 bg-rose-50/30 focus:border-rose-500' : 'border-slate-200 focus:border-navy focus:bg-white'}`}
              />
              <button 
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-navy transition-colors"
              >
                {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-[10px] text-rose-500 font-bold ml-1 mt-1">{errors.confirmPassword}</p>}
          </div>

          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-navy text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-navy/10 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            <span>{isLoading ? "Saving changes..." : "Save password"}</span>
            {!isLoading && <ArrowRight size={18} />}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-50 font-body">
      <Header />
      
      <section className="pt-32 pb-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* Left Column: Branding & Trust */}
            <div className="hidden lg:block space-y-10">
              <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                <h1 className="text-5xl font-semibold text-navy leading-tight tracking-tight mb-6">
                  Reset your <span className="text-primary">Prayog India</span> Password
                </h1>
                <p className="text-slate-500 text-lg max-w-lg leading-relaxed">
                  Choose a strong, unique password to secure your institutional portal credentials.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <ShieldCheck size={24} className="text-navy mb-4" />
                  <h3 className="font-bold text-slate-900 text-sm mb-2">Secure reset</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Verification tokens expire after one hour for your safety.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <Zap size={24} className="text-navy mb-4" />
                  <h3 className="font-bold text-slate-900 text-sm mb-2">Instant update</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Your credentials are updated instantly across all hubs.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Form Block */}
            <Suspense fallback={
              <div className="w-full max-w-md mx-auto lg:ml-auto text-center py-12">
                <div className="text-slate-500 text-sm">Loading recovery panel...</div>
              </div>
            }>
              <ResetPasswordForm />
            </Suspense>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
