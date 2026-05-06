import { ArrowLeft, Mail, Phone, Calendar } from "lucide-react";
import Link from "next/link";
import pool from "@/lib/db";

export default async function StudentProfilePage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;
  
  // Basic Fetching
  const [userRes] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  const user = userRes[0];

  if (!user) {
    return <div className="p-10 font-body text-slate-500 font-semibold">Student not found in institutional database.</div>;
  }

  const [enrollments] = await pool.query(`
    SELECT e.*, c.title, c.duration, c.type as mode, b.name as batch_name 
    FROM enrollments e 
    JOIN courses c ON e.course_id = c.id 
    JOIN batches b ON e.batch_id = b.id
    WHERE e.user_id = ?
  `, [id]);

  const [attendance] = await pool.query("SELECT * FROM attendance WHERE user_id = ? ORDER BY recorded_at DESC", [id]);

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link href="/admin/students" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50 transition-all shadow-sm">
          <ArrowLeft size={18} />
        </Link>
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Student Profile</h1>
          <p className="text-slate-500 text-sm mt-1">ID: PR-{10000 + user.id}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Identity */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="w-20 h-20 rounded-2xl bg-navy text-white flex items-center justify-center text-3xl font-bold shadow-lg mb-5">
              {user.name.charAt(0)}
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-1">{user.name}</h2>
            <p className="text-xs font-bold text-emerald-600 mb-6 uppercase tracking-wider">Active Enrollment</p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Mail size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Institutional Email</p>
                  <p className="text-sm font-semibold text-slate-700">{user.email}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Mobile Contact</p>
                  <p className="text-sm font-semibold text-slate-700">{user.phone || 'Not provided'}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Calendar size={16} className="text-slate-400 mt-0.5" />
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Registration Date</p>
                  <p className="text-sm font-semibold text-slate-700">{new Date(user.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Analytics & Enrollments */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Academic Programs</h3>
            {enrollments.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl">
                <p className="text-sm text-slate-400 font-medium">No active program registrations found.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {enrollments.map(e => (
                  <div key={e.id} className="p-5 rounded-xl border border-slate-100 bg-slate-50 flex flex-col md:flex-row justify-between md:items-center gap-4 hover:border-navy/20 transition-all group">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className="font-bold text-slate-800 text-base">{e.title}</span>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${e.mode === 'online' ? 'bg-blue-100 text-blue-700' : 'bg-emerald-100 text-emerald-700'}`}>{e.mode}</span>
                      </div>
                      <p className="text-xs font-semibold text-slate-500">Cohort Batch: {e.batch_name}</p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Financial Status</p>
                      <span className={`uppercase text-[11px] font-bold px-2 py-1 rounded-md ${e.payment_status === 'paid' ? 'bg-emerald-100 text-emerald-700' : e.payment_status === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-rose-100 text-rose-700'}`}>
                        {e.payment_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-5">Attendance Ledger</h3>
            {attendance.length === 0 ? (
              <div className="p-8 text-center border border-dashed border-slate-200 rounded-xl">
                <p className="text-sm text-slate-400 font-medium">No check-ins recorded yet.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {attendance.map(a => (
                  <div key={a.id} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div>
                      <span className="font-bold text-slate-700 text-sm block">{new Date(a.recorded_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{new Date(a.recorded_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                    </div>
                    <span className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 text-emerald-600 rounded-md font-bold text-[10px] uppercase tracking-wider border border-emerald-100">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Present
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
