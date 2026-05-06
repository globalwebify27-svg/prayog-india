import { CreditCard, CheckCircle2, Clock, AlertCircle, Calendar } from "lucide-react";
import pool from "@/lib/db";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";
import PayButton from "@/components/Dashboard/PayButton";

export default async function PaymentsPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    redirect("/login");
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  // Fetch installments for the student
  const [installments] = await pool.query(`
    SELECT i.*, e.total_amount, c.title as course_name
    FROM installments i
    JOIN enrollments e ON i.enrollment_id = e.id
    JOIN courses c ON e.course_id = c.id
    WHERE e.user_id = ?
    ORDER BY i.due_date ASC
  `, [userId]);

  // Summaries
  const totalPaid = installments.filter(i => i.status === 'paid').reduce((sum, i) => sum + Number(i.amount), 0);
  const totalPending = installments.filter(i => i.status !== 'paid').reduce((sum, i) => sum + Number(i.amount), 0);

  return (
    <div className="space-y-8 font-body max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Financial Hub</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your academic tuition fees and EMI schedules.</p>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute -right-4 -top-4 opacity-5"><CreditCard size={100} /></div>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Outstanding</p>
          <p className="text-3xl font-bold text-slate-900">₹{totalPending.toLocaleString()}</p>
        </div>
        <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-100 shadow-sm">
          <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mb-1">Total Paid</p>
          <p className="text-3xl font-bold text-emerald-700">₹{totalPaid.toLocaleString()}</p>
        </div>
        <div className="bg-navy rounded-2xl p-6 text-white shadow-md flex flex-col justify-center items-start">
          <p className="text-[10px] font-bold text-blue-300 uppercase tracking-widest mb-1">Next Payment Due</p>
          {installments.filter(i => i.status === 'pending').length > 0 ? (
            <>
              <p className="text-xl font-bold mb-1">₹{installments.filter(i => i.status === 'pending')[0].amount}</p>
              <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mt-1">
                <Calendar size={12} />
                By {new Date(installments.filter(i => i.status === 'pending')[0].due_date).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p className="text-lg font-bold text-emerald-400">All Cleared</p>
          )}
        </div>
      </div>

      {/* Installments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">EMI Schedule & Payment Plans</h2>
        </div>
        
        {installments.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-500 font-medium">No installment plans found. You may have paid in full upfront.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {installments.map((inst, index) => {
              const isOverdue = inst.status === 'pending' && new Date(inst.due_date) < new Date();
              return (
                <div key={inst.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm
                      ${inst.status === 'paid' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 
                        isOverdue ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-slate-50 border border-slate-200 text-slate-500'}
                    `}>
                      {inst.status === 'paid' ? <CheckCircle2 size={24} /> : 
                       isOverdue ? <AlertCircle size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">Installment {index + 1} <span className="text-slate-400 font-medium mx-1">•</span> {inst.course_name}</p>
                      <p className={`text-xs font-semibold mt-1 ${isOverdue ? 'text-rose-500' : 'text-slate-500'}`}>
                        {isOverdue ? 'Overdue since ' : 'Due by '} 
                        {new Date(inst.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/3">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Amount</p>
                      <p className="text-lg font-bold text-slate-900">₹{Number(inst.amount).toLocaleString()}</p>
                    </div>
                    
                    {inst.status === 'paid' ? (
                      <span className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm inline-block min-w-[100px] text-center">
                        Paid
                      </span>
                    ) : (
                      <PayButton 
                        amount={Number(inst.amount)} 
                        enrollmentId={inst.enrollment_id} 
                        installmentId={inst.id} 
                      />
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
}
