"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { CreditCard, ShieldCheck, CheckCircle2, ChevronRight, Zap, AlertCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyAction from "@/components/StickyAction";

function PaymentContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const enrollmentId = searchParams.get("id");
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  useEffect(() => {
    if (!enrollmentId) {
      router.push("/summer-camp/enroll");
    }
  }, [enrollmentId]);

  const handlePayment = async () => {
    setLoading(true);
    setStep(2);

    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const res = await fetch("/api/summer-camp/confirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ enrollmentId })
      });

      if (res.ok) {
        setStep(3);
        setTimeout(() => {
          router.push(`/summer-camp/success?id=${enrollmentId}`);
        }, 1500);
      } else {
        alert("Payment failed. Please try again.");
        setStep(1);
      }
    } catch (err) {
      alert("Something went wrong.");
      setStep(1);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <section className="pt-32 pb-20 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-2xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              {/* Checkout Header */}
              <div className="bg-navy p-10 md:p-12 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/20">
                    <CreditCard className="text-navy" size={32} />
                  </div>
                  <h2 className="text-3xl font-heading font-black text-white mb-2">Secure Checkout</h2>
                  <p className="text-blue-100/40 text-xs font-bold uppercase tracking-[0.2em]">Summer Camp Registration</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl"></div>
              </div>

              <div className="p-8 md:p-12">
                {step === 1 && (
                  <div className="space-y-8">
                    {/* Amount Summary */}
                    <div className="bg-slate-50 rounded-2xl p-6 md:p-8 border border-slate-100">
                      <div className="flex justify-between items-center mb-6">
                        <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Total Amount Payable</span>
                        <span className="text-3xl font-heading font-black text-navy">₹2,999</span>
                      </div>
                      <div className="space-y-3 pt-6 border-t border-slate-200">
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-2">Registration includes</p>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>Full Humanoid Robotics Kit</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-bold text-slate-600">
                          <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          <span>15 Days Certification Training</span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Methods */}
                    <div className="space-y-4">
                       <p className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">Payment Method</p>
                       <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div className="p-5 rounded-xl border-2 border-navy bg-navy/5 flex items-center gap-4 transition-all">
                             <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0">
                                <Zap className="text-navy" size={20} />
                             </div>
                             <span className="text-xs font-black uppercase tracking-tight text-navy">UPI / Cards</span>
                          </div>
                          <div className="p-5 rounded-xl border-2 border-slate-100 opacity-50 cursor-not-allowed flex items-center gap-4">
                             <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center shrink-0">
                                <CreditCard className="text-slate-300" size={20} />
                             </div>
                             <span className="text-xs font-black uppercase tracking-tight text-slate-400">Net Banking</span>
                          </div>
                       </div>
                    </div>

                    <button 
                      onClick={handlePayment}
                      className="w-full bg-navy text-white py-5 rounded-xl font-heading font-bold text-sm uppercase tracking-widest shadow-xl shadow-navy/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
                    >
                      <span>Pay Now</span>
                      <ChevronRight size={18} />
                    </button>

                    <div className="flex items-center justify-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                       <ShieldCheck size={16} className="text-green-500" />
                       PCI-DSS Compliant Gateway
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 border-4 border-slate-100 border-t-navy rounded-full animate-spin mx-auto mb-8" />
                    <h3 className="text-2xl font-heading font-black text-navy mb-2">Processing Payment</h3>
                    <p className="text-slate-500 text-sm font-medium">Please do not refresh or click back.</p>
                  </div>
                )}

                {step === 3 && (
                  <div className="text-center py-12">
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 border border-green-100"
                    >
                      <CheckCircle2 size={40} />
                    </motion.div>
                    <h3 className="text-2xl font-heading font-black text-navy mb-2">Success!</h3>
                    <p className="text-slate-500 text-sm font-medium">Finalizing your enrollment...</p>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      <Footer />
      <StickyAction />
    </>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
