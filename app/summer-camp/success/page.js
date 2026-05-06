"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Calendar, MapPin, Bot, ArrowRight, Share2, Download, Home } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyAction from "@/components/StickyAction";

function SuccessContent() {
  return (
    <>
      <Header />
      <section className="pt-32 pb-20 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-[2.5rem] shadow-2xl overflow-hidden"
            >
              {/* Confetti Hero */}
              <div className="bg-navy p-12 md:p-20 text-center relative overflow-hidden">
                <div className="relative z-10">
                  <motion.div 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", damping: 10, stiffness: 100 }}
                    className="w-20 h-20 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-primary/20"
                  >
                    <CheckCircle2 className="text-navy" size={40} />
                  </motion.div>
                  <h1 className="text-3xl md:text-5xl font-heading font-black text-white mb-4">Registration <span className="text-primary italic">Confirmed!</span></h1>
                  <p className="text-blue-100/50 text-sm md:text-lg font-medium max-w-xl mx-auto">Welcome aboard! You are now officially part of the Summer Robotics Camp 2026.</p>
                </div>
                
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -ml-32 -mb-32" />
              </div>

              <div className="p-8 md:p-16">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    <div className="space-y-8">
                       <h3 className="text-xl font-heading font-black text-navy border-b border-slate-100 pb-4">Event Summary</h3>
                       <div className="space-y-6">
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-navy shadow-inner border border-slate-100">
                                <Calendar size={22} />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Start Date</p>
                                <p className="text-sm md:text-base font-bold text-navy">May 15th, 2026</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-navy shadow-inner border border-slate-100">
                                <MapPin size={22} />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Location</p>
                                <p className="text-sm md:text-base font-bold text-navy">Prayog India HQ, Robotics Lab</p>
                             </div>
                          </div>
                          <div className="flex items-center gap-5">
                             <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center text-navy shadow-inner border border-slate-100">
                                <Bot size={22} />
                             </div>
                             <div>
                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Kit Included</p>
                                <p className="text-sm md:text-base font-bold text-navy">Prayog-X1 Humanoid Kit</p>
                             </div>
                          </div>
                       </div>
                    </div>

                    <div className="bg-slate-50 rounded-[2rem] p-8 md:p-10 border border-slate-100 flex flex-col justify-center">
                       <h4 className="text-navy font-heading font-black text-lg mb-6">Important Next Steps</h4>
                       <ul className="space-y-4">
                          {[
                            "Check your email for the detailed itinerary.",
                            "Join our Student WhatsApp Group for live updates.",
                            "Install Arduino IDE on your laptop before Day 1."
                          ].map((step, i) => (
                            <li key={i} className="flex gap-4 text-sm font-medium text-slate-600 leading-relaxed">
                               <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0 mt-0.5">
                                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                               </div>
                               <span>{step}</span>
                            </li>
                          ))}
                       </ul>
                    </div>
                 </div>

                 <div className="flex flex-col sm:flex-row items-center gap-6 pt-8 border-t border-slate-100">
                    <Link href="/" className="w-full sm:w-auto bg-navy text-white px-10 py-4 rounded-xl font-heading font-bold text-sm uppercase tracking-widest shadow-xl shadow-navy/20 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                       <Home size={18} />
                       <span>Go to Home</span>
                    </Link>
                    <button className="w-full sm:w-auto border-2 border-slate-200 text-navy px-10 py-4 rounded-xl font-heading font-bold text-sm uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-3">
                       <Download size={18} />
                       <span>Download Receipt</span>
                    </button>
                 </div>
              </div>
            </motion.div>

            <div className="mt-12 flex items-center justify-center gap-4 text-slate-400 font-bold text-xs uppercase tracking-widest">
               <Share2 size={16} />
               <span>#PrayogIndiaSummerCamp</span>
            </div>
          </div>
        </div>
      </section>
      <Footer />
      <StickyAction />
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}
