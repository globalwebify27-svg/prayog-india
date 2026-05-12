"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Book, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  FileText, 
  Play, 
  Award,
  IdCard,
  Zap,
  TrendingUp,
  Settings,
  ChevronRight,
  UserPlus,
  X
} from "lucide-react";
import { AnimatePresence } from "framer-motion";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notices, setNotices] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showProfilePrompt, setShowProfilePrompt] = useState(false);

  useEffect(() => {
    fetchDashboardData();
    fetchNotices();
    const timer = setInterval(() => setCurrentTime(new Date()), 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const fetchNotices = async () => {
    try {
      const res = await fetch("/api/student/notices");
      const result = await res.json();
      if (result.success) {
        setNotices(result.notices);
      }
    } catch (error) {}
  };

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/student/dashboard");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
        // Show profile prompt if not completed
        if (result.data.user && !result.data.user.profile_completed) {
          setShowProfilePrompt(true);
        }
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isLiveNow = (batch) => {
    if (!batch.meeting_link || !batch.start_time || !batch.end_time) return false;

    const now = currentTime;
    const currentDay = now.toLocaleDateString('en-US', { weekday: 'short' });
    const schedule = batch.schedule || "";
    
    // Check if current day is in schedule (e.g. "Mon, Wed, Fri")
    if (!schedule.includes(currentDay)) return false;

    const [startH, startM] = batch.start_time.split(':').map(Number);
    const [endH, endM] = batch.end_time.split(':').map(Number);
    
    const startTime = new Date(now);
    startTime.setHours(startH, startM, 0);
    
    const endTime = new Date(now);
    endTime.setHours(endH, endM, 0);

    return now >= startTime && now <= endTime;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-10 h-10 border-4 border-slate-200 border-t-navy rounded-full animate-spin" />
      </div>
    );
  }

  const user = data?.user || { name: "Student" };
  const enrollments = data?.enrollments || [];
  const installments = data?.installments || [];
  const attendancePercentage = data?.attendancePercentage || 0;
  const certificateCount = data?.certificateCount || 0;
  const academicSession = data?.session || "2026-2027";

  const activeLiveBatch = enrollments.find(e => isLiveNow(e));
  const activeMeetingLink = activeLiveBatch?.meeting_link;

  return (
    <div className="space-y-8 font-body">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Welcome back, <span className="text-navy">{user.name}</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Student ID: PR-{10000 + (user.id || 0)} | {user.email}</p>
        </div>
        <div className="flex items-center gap-3">
          {activeMeetingLink && (
            <a 
              href={activeMeetingLink} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="flex items-center space-x-2 bg-navy text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm animate-pulse"
            >
              <Zap size={16} className="text-primary" />
              <span>Join live session</span>
            </a>
          )}
          <div className="hidden lg:flex flex-col items-end border-l pl-4 border-slate-200">
             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current Session</p>
             <p className="text-xs font-bold text-navy">{academicSession}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        
        {/* Main Content */}
        <div className="lg:col-span-8 space-y-8">
          
          {/* Stats Summary */}
          <div className="bg-navy rounded-2xl p-8 text-white relative overflow-hidden shadow-lg">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="relative z-10 grid grid-cols-2 md:grid-cols-3 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Attendance</p>
                <p className="text-3xl font-bold">{attendancePercentage}%</p>
                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${attendancePercentage}%` }} />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Active programs</p>
                <p className="text-3xl font-bold">{enrollments.length.toString().padStart(2, '0')}</p>
              </div>
              <div className="space-y-1 hidden md:block">
                <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Certificates</p>
                <p className="text-3xl font-bold text-primary">{certificateCount.toString().padStart(2, '0')}</p>
              </div>
            </div>
          </div>
          
          {/* Announcements Section */}
          {notices.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center space-x-2 px-1">
                <Bell size={16} className="text-navy" />
                <h2 className="text-lg font-semibold text-slate-900">Latest Announcements</h2>
              </div>
              <div className="space-y-3">
                {notices.map((notice, i) => (
                  <motion.div 
                    key={notice.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="bg-white border border-slate-200 p-4 rounded-2xl shadow-sm hover:shadow-md transition-all border-l-4 border-l-navy"
                  >
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-sm font-bold text-slate-900">{notice.title}</h3>
                      <span className="text-[10px] font-bold text-slate-400 uppercase">
                        {new Date(notice.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {notice.content}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {/* Programs Section */}
          <div className="space-y-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-semibold text-slate-900">Enrolled programs</h2>
              <Link href="/dashboard/courses" className="text-xs font-semibold text-navy hover:text-primary transition-colors">Course catalog &rarr;</Link>
            </div>
            
            {enrollments.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 border border-slate-200 text-center shadow-sm">
                <p className="text-slate-400 font-medium text-sm">No active enrollments found.</p>
              </div>
            ) : enrollments.map((course) => {
              const live = isLiveNow(course);
              return (
                <div key={course.id} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm hover:shadow-md transition-all group">
                  <div className="flex flex-col md:flex-row gap-6 items-center">
                    <div className="w-16 h-16 rounded-xl bg-slate-50 flex items-center justify-center text-navy shrink-0 group-hover:bg-navy group-hover:text-white transition-all">
                      <Book size={24} />
                    </div>
                    <div className="flex-grow text-center md:text-left">
                      <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                        <h3 className="text-base font-semibold text-slate-900">{course.title}</h3>
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${course.mode === 'online' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                          {course.mode || 'Offline'}
                        </span>
                      </div>
                      <div className="flex items-center justify-center md:justify-start gap-4 text-[10px] font-semibold text-slate-400 uppercase tracking-wide">
                        <span className="flex items-center gap-1.5"><Clock size={12} /> {course.duration || '6 Months'}</span>
                        {live && (
                          <span className="flex items-center gap-1.5 text-blue-600 animate-pulse"><Play size={12} /> Live now</span>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      {live && course.meeting_link && (
                        <a 
                          href={course.meeting_link} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-navy text-white rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-black transition-all flex items-center gap-2 shadow-md"
                        >
                          <Play size={10} fill="white" /> Join Live
                        </a>
                      )}
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Progress</p>
                        <p className="text-xs font-bold text-navy">{attendancePercentage}%</p>
                      </div>
                      <Link href={`/dashboard/courses`} className="w-10 h-10 rounded-lg bg-slate-50 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-all">
                        <ChevronRight size={18} />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-4 space-y-8">
          
          {/* Installments */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-6 px-1">Upcoming installments</h3>
            <div className="space-y-3">
              {installments.length === 0 ? (
                <p className="text-center text-xs text-slate-400 py-4 font-medium italic">No pending payments.</p>
              ) : installments.map((inst) => (
                <div key={inst.id} className="flex items-center justify-between p-3.5 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="text-sm font-bold text-slate-900">₹{inst.amount}</p>
                    <p className="text-[10px] text-slate-400 font-semibold uppercase">{new Date(inst.due_date).toLocaleDateString()}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase ${
                    inst.status === "paid" ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-700"
                  }`}>
                    {inst.status}
                  </span>
                </div>
              ))}
            </div>
            <Link href="/dashboard/payments" className="w-full mt-6 bg-slate-900 text-white py-3 rounded-lg font-semibold text-xs text-center block hover:bg-black transition-all">
              Pay now
            </Link>
          </div>

          {/* Quick Hub */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <h3 className="text-base font-semibold text-slate-900 mb-6 px-1">Resources</h3>
            <div className="grid grid-cols-2 gap-4">
              <Link href="/dashboard/courses" className="p-4 bg-slate-50 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-100 transition-all group border border-slate-100">
                <FileText size={18} className="text-navy" />
                <span className="text-[10px] font-semibold text-slate-600">Material</span>
              </Link>
              <Link href="/dashboard/certificates" className="p-4 bg-slate-50 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-100 transition-all group border border-slate-100">
                <Award size={18} className="text-navy" />
                <span className="text-[10px] font-semibold text-slate-600">Certificates</span>
              </Link>
              <Link href="/dashboard/attendance" className="p-4 bg-slate-50 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-100 transition-all group border border-slate-100">
                <Calendar size={18} className="text-navy" />
                <span className="text-[10px] font-semibold text-slate-600">Attendance</span>
              </Link>
              <Link href="/dashboard/profile" className="p-4 bg-slate-50 rounded-xl flex flex-col items-center gap-2 hover:bg-slate-100 transition-all group border border-slate-100">
                <Settings size={18} className="text-navy" />
                <span className="text-[10px] font-semibold text-slate-600">Profile</span>
              </Link>
              {user.id_card_issued === 1 && (
                <Link href="/dashboard/idcard" className="p-4 bg-emerald-50 rounded-xl flex flex-col items-center gap-2 hover:bg-emerald-100 transition-all group border border-emerald-100 md:col-span-2">
                  <IdCard size={18} className="text-emerald-700" />
                  <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-tight">Identity Card Issued</span>
                </Link>
              )}
            </div>
          </div>

          {/* Achievement */}
          <div className="bg-primary rounded-2xl p-6 shadow-sm border border-primary/20">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp size={20} className="text-navy" />
              <h4 className="text-navy font-bold text-sm">Top performer</h4>
            </div>
            <p className="text-navy/70 text-xs font-medium leading-relaxed mb-5">
              You've maintained a {attendancePercentage}% attendance rate. Keep it up to qualify for the gold certification.
            </p>
            <Link href="/dashboard/attendance" className="inline-flex text-[10px] font-bold text-navy uppercase items-center gap-1 hover:underline">
              Analyze details <ChevronRight size={14} />
            </Link>
          </div>

        </div>
      </div>
      {/* Profile Completion Prompt Modal */}
      <AnimatePresence>
        {showProfilePrompt && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-navy/60 backdrop-blur-md">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl relative overflow-hidden"
            >
              {/* Abstract Background Element */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-2xl" />
              
              {/* Hide close button to force completion */}
              {/* <button 
                onClick={() => setShowProfilePrompt(false)}
                className="absolute top-6 right-6 text-slate-400 hover:text-navy transition-colors p-1"
              >
                <X size={20} />
              </button> */}

              <div className="relative z-10 text-center">
                <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center text-navy mx-auto mb-6 shadow-inner">
                  <UserPlus size={36} strokeWidth={1.5} />
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Institutional Onboarding</h2>
                
                {/* Completion Percentage */}
                {(() => {
                  const fields = [
                    user.father_name, user.mother_name, user.image, 
                    user.qualification, user.school_college, user.address, 
                    user.dob, user.id_number, user.gender
                  ];
                  const completed = fields.filter(f => f).length;
                  const percent = Math.round((completed / fields.length) * 100);
                  return (
                    <div className="mb-8">
                      <div className="flex justify-between items-center mb-2 px-1">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Profile Strength</p>
                        <p className="text-xs font-bold text-navy">{percent}%</p>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-50">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${percent}%` }}
                          className="h-full bg-gradient-to-r from-navy to-blue-600"
                        />
                      </div>
                    </div>
                  );
                })()}

                <p className="text-slate-500 text-sm leading-relaxed mb-8">
                  Please complete your official student profile to ensure your certification records and ID cards are generated correctly.
                </p>

                <div className="space-y-3 mb-8 text-left">
                  {/* Reordered Dynamic Checklist */}
                  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${user.father_name && user.mother_name ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                    {user.father_name && user.mother_name ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> : <Clock size={16} className="text-slate-400 shrink-0" />}
                    <p className={`text-xs font-bold uppercase tracking-tight ${user.father_name && user.mother_name ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {user.father_name && user.mother_name ? 'Family Details Verified' : 'Father & Mother Name Pending'}
                    </p>
                  </div>

                  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${user.image ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                    {user.image ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> : <Clock size={16} className="text-slate-400 shrink-0" />}
                    <p className={`text-xs font-bold uppercase tracking-tight ${user.image ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {user.image ? 'Identity Image Uploaded' : 'Identity Image Pending'}
                    </p>
                  </div>

                  <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${user.qualification && user.school_college ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-50 border-slate-100 opacity-60'}`}>
                    {user.qualification && user.school_college ? <CheckCircle2 size={16} className="text-emerald-500 shrink-0" /> : <Clock size={16} className="text-slate-400 shrink-0" />}
                    <p className={`text-xs font-bold uppercase tracking-tight ${user.qualification && user.school_college ? 'text-emerald-700' : 'text-slate-400'}`}>
                      {user.qualification && user.school_college ? 'Academic Records Verified' : 'Academic Records Pending'}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <Link 
                    href="/dashboard/profile"
                    className="w-full px-6 py-4 bg-navy text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-black shadow-lg shadow-navy/20 transition-all flex items-center justify-center gap-2"
                  >
                    <span>Complete My Profile</span>
                    <ChevronRight size={14} />
                  </Link>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Verification is mandatory for hub access</p>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
