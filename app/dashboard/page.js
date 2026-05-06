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
  Zap,
  TrendingUp,
  Settings,
  Bell,
  ChevronRight
} from "lucide-react";

export default function StudentDashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch("/api/student/dashboard");
      const result = await res.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
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
  const attendanceCount = data?.attendanceCount || 0;

  const hasOnlineEnrollment = enrollments.some(e => e.mode === 'online');

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
        {hasOnlineEnrollment && (
          <Link href="/dashboard/schedule" className="flex items-center space-x-2 bg-navy text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm">
            <Zap size={16} className="text-primary" />
            <span>Join live session</span>
          </Link>
        )}
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
                <p className="text-3xl font-bold">{attendanceCount > 0 ? '94%' : '0%'}</p>
                <div className="w-24 h-1 bg-white/10 rounded-full overflow-hidden">
                  <div className="w-[94%] h-full bg-primary" />
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Active programs</p>
                <p className="text-3xl font-bold">{enrollments.length.toString().padStart(2, '0')}</p>
              </div>
              <div className="space-y-1 hidden md:block">
                <p className="text-[10px] font-semibold text-white/50 uppercase tracking-wider">Certificates</p>
                <p className="text-3xl font-bold text-primary">00</p>
              </div>
            </div>
          </div>

          {/* Programs Section */}
          <div className="space-y-5">
            <div className="flex items-center justify-between px-1">
              <h2 className="text-lg font-semibold text-slate-900">Enrolled programs</h2>
              <Link href="/courses" className="text-xs font-semibold text-navy hover:text-primary transition-colors">Course catalog &rarr;</Link>
            </div>
            
            {enrollments.length === 0 ? (
              <div className="bg-white rounded-2xl p-16 border border-slate-200 text-center shadow-sm">
                <p className="text-slate-400 font-medium text-sm">No active enrollments found.</p>
              </div>
            ) : enrollments.map((course) => (
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
                      {course.mode === 'online' && (
                        <span className="flex items-center gap-1.5 text-blue-600"><Play size={12} /> Live now</span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Progress</p>
                      <p className="text-xs font-bold text-navy">20%</p>
                    </div>
                    <Link href={`/dashboard/courses`} className="w-10 h-10 rounded-lg bg-slate-50 text-navy flex items-center justify-center hover:bg-navy hover:text-white transition-all">
                      <ChevronRight size={18} />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
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
            </div>
          </div>

          {/* Achievement */}
          <div className="bg-primary rounded-2xl p-6 shadow-sm border border-primary/20">
            <div className="flex items-center space-x-3 mb-4">
              <TrendingUp size={20} className="text-navy" />
              <h4 className="text-navy font-bold text-sm">Top performer</h4>
            </div>
            <p className="text-navy/70 text-xs font-medium leading-relaxed mb-5">
              You've maintained a 94% attendance rate. Keep it up to qualify for the gold certification.
            </p>
            <Link href="/dashboard/attendance" className="inline-flex text-[10px] font-bold text-navy uppercase items-center gap-1 hover:underline">
              Analyze details <ChevronRight size={14} />
            </Link>
          </div>

        </div>
      </div>
    </div>
  );
}
