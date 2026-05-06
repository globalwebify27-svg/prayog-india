"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Zap, ChevronRight, User, Mail, Phone, GraduationCap, Clock, AlertCircle, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StickyAction from "@/components/StickyAction";

export default function EnrollmentForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [capacity, setCapacity] = useState({ morning: 0, evening: 0 });
  const [batches, setBatches] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    studentClass: "",
    batchId: ""
  });

  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/summer-camp/capacity")
      .then(res => res.json())
      .then(data => {
        setCapacity(data);
        if (data.batches) {
          setBatches(data.batches);
        }
      })
      .catch(err => {
        console.error("Failed to fetch summer camp data:", err);
      });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/summer-camp/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      const data = await res.json();
      if (data.success) {
        router.push(`/summer-camp/payment?id=${data.enrollmentId}`);
      } else {
        setError(data.error || "Registration failed");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isBatchFull = (batchName) => {
    if (batchName?.toLowerCase().includes('morning')) return capacity.morning >= 60;
    if (batchName?.toLowerCase().includes('evening')) return capacity.evening >= 60;
    return false;
  };

  const getRemainingSeats = (batchName) => {
    if (batchName?.toLowerCase().includes('morning')) return 60 - capacity.morning;
    if (batchName?.toLowerCase().includes('evening')) return 60 - capacity.evening;
    return 60;
  };

  const showHurryUp = (batchName) => {
    const remaining = getRemainingSeats(batchName);
    return remaining <= 15 && remaining > 0;
  };

  return (
    <>
      <Header />
      <section className="pt-32 pb-20 bg-slate-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col lg:flex-row">
            
            {/* Left Info Sidebar */}
            <div className="lg:w-[350px] bg-navy p-8 md:p-12 text-white flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-8 shadow-lg shadow-primary/20">
                  <Zap className="text-navy" size={24} />
                </div>
                <h2 className="text-3xl font-heading font-black mb-6 leading-tight">Summer <br /> Robotics <span className="text-primary">Camp '26</span></h2>
                <p className="text-blue-100/60 text-sm font-medium mb-12">Join the most advanced robotics workshop for school students. Reserve your seat today!</p>

                <div className="space-y-8">
                  {[
                    { id: "01", label: "Student Details", status: "active" },
                    { id: "02", label: "Secure Payment", status: "pending" },
                    { id: "03", label: "Confirmation", status: "pending" }
                  ].map((step) => (
                    <div key={step.id} className={`flex items-start space-x-4 ${step.status === 'pending' ? 'opacity-40' : ''}`}>
                      <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 text-xs font-bold ${step.status === 'active' ? 'border-primary text-primary' : 'border-white/20 text-white/40'}`}>
                        {step.id}
                      </div>
                      <div>
                        <p className={`text-[10px] font-black uppercase tracking-widest mb-0.5 ${step.status === 'active' ? 'text-primary' : 'text-white/40'}`}>Step {step.id}</p>
                        <p className="font-bold text-sm">{step.label}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-12 pt-12 border-t border-white/10">
                <div className="flex items-center space-x-3 text-blue-100/40">
                  <ShieldCheck size={18} className="text-primary" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Encrypted Registration</span>
                </div>
              </div>
            </div>

            {/* Form Content Area */}
            <div className="flex-grow p-8 md:p-12 lg:p-16 bg-white">
              <div className="max-w-2xl">
                <h3 className="text-2xl md:text-3xl font-heading font-black text-slate-900 mb-8">Enrollment Details</h3>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-sm font-bold border border-red-100">
                      <AlertCircle size={18} />
                      {error}
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">Full Name</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Rahul Sharma"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 md:px-6 md:py-4 outline-none focus:border-navy focus:bg-white transition-all text-sm font-semibold"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">Student Class</label>
                      <select 
                        required
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 md:px-6 md:py-4 outline-none focus:border-navy focus:bg-white transition-all appearance-none text-sm font-semibold"
                        value={formData.studentClass}
                        onChange={(e) => setFormData({...formData, studentClass: e.target.value})}
                      >
                        <option value="">Select Class</option>
                        {[5,6,7,8,9,10,11,12].map(c => (
                          <option key={c} value={c}>Class {c}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">Email Address</label>
                      <input 
                        required
                        type="email" 
                        placeholder="rahul@example.com"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 md:px-6 md:py-4 outline-none focus:border-navy focus:bg-white transition-all text-sm font-semibold"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">Phone Number</label>
                      <input 
                        required
                        type="tel" 
                        placeholder="+91 98765 43210"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 md:px-6 md:py-4 outline-none focus:border-navy focus:bg-white transition-all text-sm font-semibold"
                        value={formData.phone}
                        onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-slate-700 uppercase tracking-widest ml-1">Select Batch Slot</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {batches.map((batch) => {
                        const full = isBatchFull(batch.name);
                        const hurry = showHurryUp(batch.name);
                        const remaining = getRemainingSeats(batch.name);

                        return (
                          <div 
                            key={batch.id}
                            onClick={() => !full && setFormData({...formData, batchId: batch.id})}
                            className={`
                              relative p-5 rounded-xl border-2 transition-all cursor-pointer
                              ${formData.batchId == batch.id ? 'border-navy bg-navy/5 shadow-inner' : 'border-slate-100 bg-slate-50 hover:bg-white hover:border-slate-200'}
                              ${full ? 'opacity-50 cursor-not-allowed grayscale' : ''}
                            `}
                          >
                            <div className="flex items-center justify-between mb-2">
                               <Clock size={18} className={formData.batchId == batch.id ? 'text-navy' : 'text-slate-400'} />
                               {formData.batchId == batch.id && <CheckCircle2 size={18} className="text-navy" />}
                            </div>
                            <h4 className="font-heading font-black text-slate-900 text-sm leading-tight">{batch.name}</h4>
                            <p className="text-[10px] font-bold text-slate-500 mt-1">{batch.schedule}</p>
                            
                            {full && (
                              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] flex items-center justify-center text-center rounded-xl">
                                <span className="text-[10px] font-black text-navy uppercase tracking-widest">Slot Full</span>
                              </div>
                            )}

                            {!full && hurry && (
                              <div className="mt-3 inline-flex items-center gap-1.5 bg-amber-50 text-amber-700 px-2.5 py-1 rounded-lg text-[9px] font-bold uppercase tracking-wider border border-amber-100">
                                 <AlertCircle size={10} />
                                 Hurry! {remaining} Seats Left
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div className="pt-8 flex flex-col md:flex-row items-center gap-6">
                    <button 
                      disabled={loading || !formData.batchId}
                      className="w-full md:w-auto bg-navy text-white px-12 py-4 rounded-xl font-heading font-bold text-sm uppercase tracking-widest shadow-xl shadow-navy/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <span>Proceed to Payment</span>
                          <ArrowRight size={18} />
                        </>
                      )}
                    </button>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Registration Fee: ₹2,999</p>
                  </div>
                </form>
              </div>
            </div>

          </div>

          <div className="mt-12 text-center">
             <p className="text-slate-500 text-xs font-bold">
               Need help? <Link href="/contact" className="text-navy hover:text-primary underline decoration-primary/30 underline-offset-4 transition-all">Contact Administrator</Link>
             </p>
          </div>
        </div>
      </section>
      <Footer />
      <StickyAction />
    </>
  );
}
