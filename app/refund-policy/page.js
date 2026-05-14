import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { RotateCcw, CreditCard, Clock, CheckCircle } from "lucide-react";

export default function RefundPolicy() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      
      {/* Header */}
      <section className="pt-32 pb-20 bg-navy relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-1/2 h-full bg-primary/5 rounded-full blur-[120px] translate-y-1/2" />
        <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-6">
            <RotateCcw size={14} className="text-primary" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Financial Policy</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6">Refund <span className="text-primary">Policy</span></h1>
          <p className="text-blue-100/60 max-w-2xl mx-auto text-sm md:text-base leading-relaxed">
            Transparent information regarding course cancellations, seat withdrawals, and fee adjustments.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-6">
          <div className="space-y-16">
            
            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">1. General Refund Stance</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                At Prayog India Robotics, we invest heavily in laboratory infrastructure, hardware kits, and specialized faculty prior to the commencement of each batch. Therefore, we have a strict refund policy as outlined below.
              </p>
              <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-4">
                <Clock className="text-amber-600 shrink-0 mt-1" size={18} />
                <p className="text-amber-800 text-xs font-bold leading-relaxed">
                  Important: Registration fees and course kit charges are non-refundable under all circumstances as they cover administrative and inventory costs incurred immediately upon enrollment.
                </p>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy">
                  <CheckCircle size={20} />
                </div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">2. Refund Conditions</h2>
              </div>
              
              <div className="grid gap-6">
                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h4 className="text-navy font-black text-sm uppercase tracking-widest mb-4">Batch Cancellation by Institution</h4>
                  <p className="text-slate-500 text-[13px] leading-relaxed mb-4">
                    In the rare event that Prayog India cancels a scheduled batch due to unforeseen technical or institutional reasons, students will be entitled to a **100% refund** of the total fee paid, including the registration amount.
                  </p>
                </div>

                <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
                  <h4 className="text-navy font-black text-sm uppercase tracking-widest mb-4">Student Withdrawal</h4>
                  <ul className="space-y-4">
                    <li className="flex gap-3">
                      <div className="w-5 h-5 bg-navy/5 rounded flex items-center justify-center shrink-0 mt-0.5"><span className="text-[10px] font-black text-navy">A</span></div>
                      <p className="text-slate-500 text-[13px]">Withdrawal **7 days before** batch start: 50% of the tuition fee (excluding registration) is refundable.</p>
                    </li>
                    <li className="flex gap-3">
                      <div className="w-5 h-5 bg-navy/5 rounded flex items-center justify-center shrink-0 mt-0.5"><span className="text-[10px] font-black text-navy">B</span></div>
                      <p className="text-slate-500 text-[13px]">Withdrawal **after** batch start: No refunds will be processed.</p>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-10 h-10 bg-navy/5 rounded-xl flex items-center justify-center text-navy">
                  <RotateCcw size={20} />
                </div>
                <h2 className="text-2xl font-black text-navy uppercase tracking-tight">3. Processing Time</h2>
              </div>
              <p className="text-slate-600 leading-relaxed text-sm">
                Approved refund requests are processed within **15 to 20 working days**. The refund will be credited back to the original payment source or via bank transfer to the student's verified account.
              </p>
            </div>

            <div className="p-10 bg-slate-900 rounded-[3rem] text-center">
              <h3 className="text-white font-black text-xl mb-4">Submit a Refund Request</h3>
              <p className="text-slate-400 text-sm mb-8 max-w-xl mx-auto">Please mention your Enrollment ID and reason for withdrawal in the subject line of your email.</p>
              <a href="mailto:accounts@prayogindiarobotics.com" className="inline-flex items-center gap-2 bg-primary text-navy px-10 py-4 rounded-2xl font-black text-[10px] uppercase tracking-widest hover:brightness-110 transition-all">
                Email Accounts Cell
              </a>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
