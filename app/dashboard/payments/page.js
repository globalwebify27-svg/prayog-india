import { CreditCard, CheckCircle2, Clock, AlertCircle, Calendar, FileText, Download } from "lucide-react";
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

  // Fetch unified payment history (Installments + Lump-sum Enrollments)
  const [history] = await pool.query(`
    (
      SELECT 
        'installment' as type,
        i.id,
        i.amount,
        i.status,
        i.due_date,
        i.paid_at,
        i.receipt_url,
        c.title as course_name,
        e.id as enrollment_id
      FROM installments i
      JOIN enrollments e ON i.enrollment_id = e.id
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ?
    )
    UNION
    (
      SELECT 
        'full' as type,
        e.id,
        e.total_amount as amount,
        e.payment_status as status,
        e.enrolled_at as due_date,
        NULL as paid_at,
        e.receipt_url,
        c.title as course_name,
        e.id as enrollment_id
      FROM enrollments e
      JOIN courses c ON e.course_id = c.id
      WHERE e.user_id = ? AND NOT EXISTS (SELECT 1 FROM installments i WHERE i.enrollment_id = e.id)
    )
    ORDER BY due_date ASC
  `, [userId, userId]);

  // Summaries
  const totalPaid = history.filter(h => h.status === 'paid').reduce((sum, h) => sum + Number(h.amount), 0);
  const totalPending = history.filter(h => h.status !== 'paid').reduce((sum, h) => sum + Number(h.amount), 0);

  return (
    <div className="space-y-8 font-body max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Financial Hub</h1>
        <p className="text-slate-500 text-sm mt-1">Manage your academic tuition fees and download institutional invoices.</p>
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
          {history.filter(h => h.status === 'pending').length > 0 ? (
            <>
              <p className="text-xl font-bold mb-1">₹{Number(history.filter(h => h.status === 'pending')[0].amount).toLocaleString()}</p>
              <p className="text-xs font-medium text-slate-300 flex items-center gap-1.5 mt-1">
                <Calendar size={12} />
                By {new Date(history.filter(h => h.status === 'pending')[0].due_date).toLocaleDateString()}
              </p>
            </>
          ) : (
            <p className="text-lg font-bold text-emerald-400">All Cleared</p>
          )}
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-900">Payment History & Invoices</h2>
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest bg-white px-2 py-1 rounded border border-slate-200">
            {history.length} Records
          </span>
        </div>
        
        {history.length === 0 ? (
          <div className="p-10 text-center">
            <p className="text-sm text-slate-500 font-medium">No payment history found.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {history.map((item, index) => {
              const isOverdue = item.status === 'pending' && new Date(item.due_date) < new Date();
              return (
                <div key={`${item.type}-${item.id}`} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-sm
                      ${item.status === 'paid' ? 'bg-emerald-100 text-emerald-600 border border-emerald-200' : 
                        isOverdue ? 'bg-rose-100 text-rose-600 border border-rose-200' : 'bg-slate-50 border border-slate-200 text-slate-500'}
                    `}>
                      {item.status === 'paid' ? <CheckCircle2 size={24} /> : 
                       isOverdue ? <AlertCircle size={24} /> : <Clock size={24} />}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold text-slate-900">
                          {item.type === 'installment' ? `Installment ${index + 1}` : 'Full Program Payment'}
                        </p>
                        {item.type === 'full' && (
                          <span className="text-[9px] font-bold bg-navy/10 text-navy px-1.5 py-0.5 rounded uppercase tracking-tighter">Full Payment</span>
                        )}
                      </div>
                      <p className="text-[11px] font-semibold text-slate-400 mt-0.5">{item.course_name}</p>
                      <p className={`text-[11px] font-bold mt-1 ${isOverdue ? 'text-rose-500' : 'text-slate-500'}`}>
                        {item.status === 'paid' ? 'Completed on ' : (isOverdue ? 'Overdue since ' : 'Due by ')} 
                        {new Date(item.paid_at || item.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 md:w-1/2">
                    <div className="text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Amount</p>
                      <p className="text-lg font-bold text-slate-900">₹{Number(item.amount).toLocaleString()}</p>
                    </div>
                    
                    <div className="flex gap-2">
                      {item.status === 'paid' && item.receipt_url && (
                        <a 
                          href={item.receipt_url} 
                          target="_blank" 
                          className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-600 hover:text-navy hover:border-navy rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm transition-all"
                        >
                          <FileText size={14} />
                          Invoice
                        </a>
                      )}
                      
                      {item.status === 'paid' ? (
                        <span className="px-4 py-2 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-sm inline-block min-w-[80px] text-center">
                          Paid
                        </span>
                      ) : (
                        <PayButton 
                          amount={Number(item.amount)} 
                          enrollmentId={item.enrollment_id} 
                          installmentId={item.type === 'installment' ? item.id : null} 
                        />
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-4 items-center">
        <div className="bg-white p-2 rounded-lg shadow-sm text-blue-600"><Download size={20} /></div>
        <div>
          <p className="text-sm font-bold text-blue-900">Missing an invoice?</p>
          <p className="text-[11px] text-blue-700">Invoices are generated instantly after verification. If you don't see one, please contact institutional support.</p>
        </div>
      </div>
    </div>
  );
}
