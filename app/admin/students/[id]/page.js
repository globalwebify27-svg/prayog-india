import { ArrowLeft, Mail, Phone, Calendar, Droplet, AlertCircle, MapPin, User, GraduationCap, School, ShieldCheck, FileText, Image as ImageIcon, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import pool from "@/lib/db";
import EditStudentForm from "@/components/admin/EditStudentForm";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { redirect } from "next/navigation";

export default async function StudentProfilePage({ params }) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  // Role & Authorization Check
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  if (!token) redirect("/login");

  let currentUser = null;
  try {
    currentUser = jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    redirect("/login");
  }
  
  // Basic Fetching
  const [userRes] = await pool.query("SELECT * FROM users WHERE id = ?", [id]);
  const user = userRes[0];

  if (!user) {
    return <div className="p-10 font-body text-slate-500 font-semibold">Student not found in institutional database.</div>;
  }

  // Authorization: Teachers can only view students enrolled in their courses
  if (currentUser.role === 'teacher') {
    const [authCheck] = await pool.query(`
      SELECT e.id 
      FROM enrollments e 
      JOIN courses c ON e.course_id = c.id 
      WHERE e.user_id = ? AND c.teacher_id = ?
    `, [id, currentUser.id]);

    if (authCheck.length === 0) {
      return (
        <div className="p-10 flex flex-col items-center justify-center space-y-4">
          <ShieldCheck size={48} className="text-rose-500" />
          <h2 className="text-xl font-bold text-slate-800">Access Restricted</h2>
          <p className="text-slate-500 text-center max-w-md">You are not authorized to view this student profile. Access is limited to students enrolled in your assigned programs.</p>
          <Link href="/admin/students" className="px-6 py-2 bg-navy text-white rounded-xl font-bold text-sm hover:bg-black transition-all">
            Return to Directory
          </Link>
        </div>
      );
    }
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
    <div className="space-y-8 font-body pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center space-x-4">
          <Link href="/admin/students" className="p-2 rounded-xl bg-white border border-slate-200 text-slate-400 hover:text-navy hover:bg-slate-50 transition-all shadow-sm">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">Student Profile</h1>
            <p className="text-slate-500 text-sm mt-1 flex items-center gap-2">
              ID: PR-{10000 + user.id} 
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${user.profile_completed ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {user.profile_completed ? 'Verified Profile' : 'Pending Verification'}
              </span>
            </p>
          </div>
        </div>
        
        {currentUser.role === 'admin' && <EditStudentForm student={user} />}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Primary Identity */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-navy/5 rounded-bl-full -mr-10 -mt-10" />
            
            <div className="relative">
              {user.image ? (
                <img src={user.image} alt={user.name} className="w-24 h-24 rounded-2xl object-cover shadow-lg mb-5 border-2 border-white ring-4 ring-slate-50" />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-navy text-white flex items-center justify-center text-3xl font-bold shadow-lg mb-5">
                  {user.name.charAt(0)}
                </div>
              )}
              
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
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Date of Birth</p>
                    <p className="text-sm font-semibold text-slate-700">{user.dob ? new Date(user.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <User size={16} className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Gender</p>
                    <p className="text-sm font-semibold text-slate-700 capitalize">{user.gender || 'Not specified'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Droplet size={16} className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Blood Group</p>
                    <p className="text-sm font-semibold text-slate-700">{user.blood_group || 'Not provided'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="text-slate-400 mt-0.5" />
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Mailing Address</p>
                    <p className="text-sm font-semibold text-slate-700 leading-relaxed">{user.address || 'No address registered'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Parental Info Card */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-5 flex items-center gap-2">
              <User size={16} className="text-navy" />
              Parental Information
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Father's Name</p>
                <p className="text-sm font-bold text-slate-700">{user.father_name || 'Not provided'}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Mother's Name</p>
                <p className="text-sm font-bold text-slate-700">{user.mother_name || 'Not provided'}</p>
              </div>
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100">
                <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mb-0.5">Emergency Contact</p>
                <p className="text-sm font-bold text-rose-700">{user.emergency_contact || 'Not provided'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Center & Right: Academic, Education, Identity */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Academic Stats Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <GraduationCap size={20} className="text-navy" />
                Education Profile
              </h3>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Highest Qualification</p>
                  <p className="text-sm font-bold text-slate-800">{user.qualification || 'Not specified'}</p>
                  {user.last_qualification_year && (
                    <p className="text-[11px] text-slate-500 mt-0.5">Class of {user.last_qualification_year}</p>
                  )}
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">School / College</p>
                  <div className="flex items-start gap-2">
                    <School size={14} className="text-slate-300 mt-1" />
                    <p className="text-sm font-bold text-slate-800 leading-tight">{user.school_college || 'Not registered'}</p>
                  </div>
                  {user.school_id_number && (
                    <p className="text-[11px] font-medium text-navy bg-navy/5 px-2 py-0.5 rounded-md inline-block mt-2">ID: {user.school_id_number}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                <FileText size={20} className="text-navy" />
                Official Identity
              </h3>
              <div className="space-y-5">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Government ID Type</p>
                  <div className="flex items-center gap-2">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    <p className="text-sm font-bold text-slate-800 uppercase">{user.id_type || 'None'}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">ID Number</p>
                  <p className="text-sm font-mono font-bold text-slate-700 tracking-wider bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                    {user.id_number || 'XXXXXXXXXXXX'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Section */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <ImageIcon size={20} className="text-navy" />
              Institutional Documents
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Government Identity Image</p>
                {user.id_image ? (
                  <div className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-50">
                    <img src={user.id_image} alt="Gov ID" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <a href={user.id_image} target="_blank" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-navy px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">View Full Document</span>
                    </a>
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                    <ImageIcon size={32} />
                    <p className="text-[10px] font-bold mt-2 uppercase tracking-tighter">No ID Uploaded</p>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">School ID Card Copy</p>
                {user.school_id_card ? (
                  <div className="group relative rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-50">
                    <img src={user.school_id_card} alt="School ID" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                    <a href={user.school_id_card} target="_blank" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="bg-white text-navy px-4 py-1.5 rounded-full text-xs font-bold shadow-lg">View Full Document</span>
                    </a>
                  </div>
                ) : (
                  <div className="aspect-video bg-slate-50 rounded-xl border border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-300">
                    <ImageIcon size={32} />
                    <p className="text-[10px] font-bold mt-2 uppercase tracking-tighter">No School ID Uploaded</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
              <LayoutDashboard size={20} className="text-navy" />
              Academic Programs
            </h3>
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
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {attendance.map(a => (
                  <div key={a.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex flex-col items-center justify-center text-center">
                    <span className="font-bold text-slate-700 text-[10px] block uppercase tracking-tighter">
                      {new Date(a.recorded_at).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </span>
                    <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest mt-1">
                      {new Date(a.recorded_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                    <div className="mt-2 w-full h-1 bg-emerald-500 rounded-full opacity-50" />
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

