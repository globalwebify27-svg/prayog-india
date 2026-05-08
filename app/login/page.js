"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Lock, 
  ArrowRight, 
  ShieldCheck, 
  Mail,
  Zap,
  ArrowLeft,
  ChevronRight,
  Eye,
  EyeOff
} from "lucide-react";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData(e.currentTarget);
      const email = formData.get("email");
      const password = formData.get("password");

      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (data.success) {
        const isAdminOrTeacher = data.user.role === "admin" || data.user.role === "teacher";
        window.location.href = isAdminOrTeacher ? "/admin" : "/dashboard";
      } else {
        setError(data.message || "Authentication failed. Please check your credentials.");
      }
    } catch (err) {
      setError("A system error occurred. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

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
                  Access the <span className="text-primary">Prayog India</span> Institutional Portal
                </h1>
                <p className="text-slate-500 text-lg max-w-lg leading-relaxed">
                  Log in to manage your programs, track academic progress, and access exclusive institutional resources.
                </p>
              </motion.div>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <ShieldCheck size={24} className="text-navy mb-4" />
                  <h3 className="font-bold text-slate-900 text-sm mb-2">Secure access</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Enterprise-grade encryption for all institutional sessions.</p>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
                  <Zap size={24} className="text-navy mb-4" />
                  <h3 className="font-bold text-slate-900 text-sm mb-2">Live sync</h3>
                  <p className="text-slate-500 text-xs leading-relaxed">Real-time updates across all your devices and hubs.</p>
                </div>
              </div>
            </div>

            {/* Right Column: Login Form */}
            <div className="w-full max-w-md mx-auto lg:ml-auto">
              <motion.div 
                initial={{ opacity: 0, y: 20 }} 
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl p-8 md:p-10 border border-slate-200 shadow-xl shadow-navy/5"
              >
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-2">Sign In</h2>
                  <p className="text-slate-500 text-sm">Welcome back. Please enter your details.</p>
                </div>

                {error && (
                  <div className="mb-6 p-4 bg-rose-50 border border-rose-100 rounded-xl text-rose-600 text-xs font-semibold leading-relaxed">
                    {error}
                  </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 ml-1">Institutional email</label>
                    <div className="relative">
                      <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="email" 
                        name="email"
                        required
                        placeholder="e.g. name@prayogindia.in"
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-navy focus:bg-white transition-all text-sm"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <div className="flex justify-between items-center px-1">
                      <label className="text-xs font-bold text-slate-700">Security password</label>
                      <button type="button" className="text-[11px] font-bold text-navy hover:text-primary transition-colors">Forgot password?</button>
                    </div>
                    <div className="relative group">
                      <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-navy transition-colors" />
                      <input 
                        type={showPassword ? "text" : "password"} 
                        name="password"
                        required
                        placeholder="••••••••"
                        className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-navy focus:bg-white transition-all text-sm"
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

                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-navy text-white py-3.5 rounded-xl font-bold text-sm shadow-lg shadow-navy/10 hover:bg-black active:scale-[0.98] transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{isLoading ? "Authenticating..." : "Authorize access"}</span>
                    {!isLoading && <ArrowRight size={18} />}
                  </button>

                  <div className="pt-6 text-center">
                    <p className="text-sm text-slate-500">
                      New to the portal?{" "}
                      <Link href="/register" className="text-navy font-bold hover:text-primary transition-colors inline-flex items-center">
                        Register now <ChevronRight size={14} className="ml-1" />
                      </Link>
                    </p>
                  </div>
                </form>
              </motion.div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
