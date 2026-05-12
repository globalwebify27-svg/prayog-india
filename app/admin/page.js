"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  Zap,
  RefreshCcw,
  Activity,
  Server,
  Database,
  Shield,
  Video,
  Layers,
  FileText
} from "lucide-react";

export default function AdminOverview() {
  const [stats, setStats] = useState({});
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isNoticeModalOpen, setIsNoticeModalOpen] = useState(false);
  const [isBroadcasting, setIsBroadcasting] = useState(false);
  const [noticeData, setNoticeData] = useState({ title: "", content: "", target: "all" });

  useEffect(() => {
    fetchStats();
    fetchUser();
  }, []);

  const handleBroadcast = async () => {
    if (!noticeData.title || !noticeData.content) {
      alert("Please fill in both title and content");
      return;
    }
    
    setIsBroadcasting(true);
    try {
      const res = await fetch("/api/admin/broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: noticeData.title,
          content: noticeData.content,
          target_role: noticeData.target
        })
      });
      const data = await res.json();
      if (data.success) {
        alert("Broadcast sent successfully!");
        setIsNoticeModalOpen(false);
        setNoticeData({ title: "", content: "", target: "all" });
      } else {
        alert(data.message || "Failed to broadcast");
      }
    } catch (e) {
      alert("Error broadcasting notice");
    } finally {
      setIsBroadcasting(false);
    }
  };

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (e) {}
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/admin/stats");
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const cards = user?.role === 'teacher' ? [
    { title: "My Students", value: stats.totalStudents || 0, icon: <Users size={18} />, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "My Programs", value: stats.activePrograms || 0, icon: <BookOpen size={18} />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Active Batches", value: stats.activeBatches || 0, icon: <Layers size={18} />, color: "text-purple-600", bg: "bg-purple-50" },
    { title: "Assigned Exams", value: stats.assignedExams || 0, icon: <FileText size={18} />, color: "text-amber-600", bg: "bg-amber-50" }
  ] : [
    { title: "Total Students", value: stats.totalStudents || 0, icon: <Users size={18} />, color: "text-blue-600", bg: "bg-blue-50" },
    { title: "Active Programs", value: stats.activePrograms || 0, icon: <BookOpen size={18} />, color: "text-emerald-600", bg: "bg-emerald-50" },
    { title: "Total Revenue", value: `₹${((stats.totalRevenue || 0) / 1000).toFixed(1)}k`, icon: <TrendingUp size={18} />, color: "text-amber-600", bg: "bg-amber-50" },
    { title: "Pending Dues", value: stats.pendingPayments || 0, icon: <CreditCard size={18} />, color: "text-rose-600", bg: "bg-rose-50" }
  ];

  return (
    <div className="space-y-8 font-body">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            {user?.role === 'admin' ? 'Institutional Overview' : 'Academic Overview'}
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            {user?.role === 'admin' ? 'Operational metrics for Prayog India hubs.' : 'Classroom performance and course tracking.'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={fetchStats} 
            className="p-2.5 rounded-lg bg-white border border-slate-200 text-slate-500 hover:text-navy hover:bg-slate-50 transition-all"
            title="Refresh Stats"
          >
            <RefreshCcw size={18} className={isLoading ? "animate-spin" : ""} />
          </button>
          <button 
            onClick={() => setIsNoticeModalOpen(true)}
            className="flex items-center space-x-2 bg-navy text-white px-5 py-2.5 rounded-lg font-semibold text-sm hover:bg-black transition-all shadow-sm group"
          >
            <Zap size={16} className="text-primary group-hover:scale-110 transition-transform" />
            <span>Broadcast Notice</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${card.bg} ${card.color}`}>
                {card.icon}
              </div>
              <span className={`flex items-center text-[11px] font-semibold ${stats.growth >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-rose-600 bg-rose-50'} px-2 py-0.5 rounded-md`}>
                <ArrowUpRight size={10} className={`mr-0.5 ${stats.growth < 0 ? 'rotate-90' : ''}`} /> {Math.abs(stats.growth || 0)}%
              </span>
            </div>
            <h3 className="text-slate-500 text-xs font-medium mb-1">{card.title}</h3>
            <p className="text-2xl font-bold text-slate-900">{card.value}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Growth Area */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-base font-semibold text-slate-900">Enrollment Trends</h3>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-50 rounded-md border border-slate-100">
                <div className="w-2 h-2 rounded-full bg-navy" />
                <span className="text-[9px] font-bold text-slate-500 uppercase">New Students</span>
              </div>
            </div>
          </div>
          
          <div className="h-72 relative mt-4">
            {!stats.enrollmentTrends || stats.enrollmentTrends.length === 0 ? (
              <div className="w-full h-full flex flex-col items-center justify-center border border-dashed border-slate-100 rounded-2xl bg-slate-50/30">
                <Activity size={24} className="text-slate-200 mb-2 animate-pulse" />
                <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Initialising analytics...</p>
              </div>
            ) : (
              <div className="w-full h-full relative px-4">
                {/* Background Grid */}
                <div className="absolute inset-0 grid grid-rows-4 pointer-events-none">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="border-b border-slate-50 relative">
                      <span className="absolute -left-6 -top-2 text-[8px] font-bold text-slate-300 uppercase">
                        {Math.round(((4-i)/4) * Math.max(...stats.enrollmentTrends.map(t => t.count), 10))}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Dot Grid Pattern */}
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
                  style={{ backgroundImage: 'radial-gradient(#01254d 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
                />

                <div className="w-full h-full relative mt-4">
                  <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full overflow-visible">
                    <defs>
                      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur stdDeviation="2" result="blur" />
                        <feComposite in="SourceGraphic" in2="blur" operator="over" />
                      </filter>
                      <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#01254d" stopOpacity="0.12" />
                        <stop offset="100%" stopColor="#01254d" stopOpacity="0" />
                      </linearGradient>
                      <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#01254d" />
                        <stop offset="100%" stopColor="#2563eb" />
                      </linearGradient>
                    </defs>

                    {(() => {
                      const trends = stats.enrollmentTrends;
                      const maxVal = Math.max(...trends.map(t => t.count), 10);
                      const n = trends.length;
                      const points = trends.map((t, i) => ({
                        x: n > 1 ? (i / (n - 1)) * 100 : 50,
                        y: 90 - (t.count / maxVal) * 80
                      }));

                      let d = "";
                      if (n > 1) {
                        d = `M ${points[0].x} ${points[0].y}`;
                        for (let i = 1; i < n; i++) {
                          const prev = points[i-1];
                          const curr = points[i];
                          const cp1x = prev.x + (curr.x - prev.x) / 2;
                          d += ` C ${cp1x} ${prev.y}, ${cp1x} ${curr.y}, ${curr.x} ${curr.y}`;
                        }
                        const areaD = `${d} L 100 100 L 0 100 Z`;
                        return (
                          <>
                            <motion.path initial={{ opacity: 0 }} animate={{ opacity: 1 }} d={areaD} fill="url(#areaGradient)" />
                            <motion.path 
                              initial={{ pathLength: 0, opacity: 0 }} 
                              animate={{ pathLength: 1, opacity: 1 }} 
                              transition={{ duration: 2, ease: "circOut" }}
                              d={d} fill="none" stroke="url(#lineGradient)" strokeWidth="2.5" strokeLinecap="round" 
                              filter="url(#glow)"
                            />
                          </>
                        );
                      }
                      return null;
                    })()}
                  </svg>

                  <div className="absolute inset-0 pointer-events-none">
                    {(() => {
                      const trends = stats.enrollmentTrends;
                      const maxVal = Math.max(...trends.map(t => t.count), 10);
                      const n = trends.length;
                      return trends.map((t, i) => {
                        const x = n > 1 ? (i / (n - 1)) * 100 : 50;
                        const y = 90 - (t.count / maxVal) * 80;
                        return (
                          <div 
                            key={i} 
                            className="absolute group/point pointer-events-auto"
                            style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%, -50%)' }}
                          >
                            {/* Animated Pulse Ring */}
                            <div className="absolute inset-0 w-8 h-8 -translate-x-1/2 -translate-y-1/2 rounded-full bg-navy/5 scale-0 group-hover/point:scale-100 transition-transform duration-500" />
                            
                            <motion.div 
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.5 + i * 0.1 }}
                              className="w-3.5 h-3.5 bg-white border-[3px] border-navy rounded-full shadow-lg group-hover/point:scale-125 group-hover/point:border-blue-600 transition-all cursor-pointer relative z-10"
                            >
                              {/* Premium Floating Tooltip */}
                              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 opacity-0 group-hover/point:opacity-100 transition-all duration-300 pointer-events-none">
                                <div className="bg-slate-900 backdrop-blur-md text-white px-3 py-1.5 rounded-xl shadow-2xl border border-white/10 flex items-center space-x-2">
                                  <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                                  <span className="text-[11px] font-bold whitespace-nowrap">{t.count} New Students</span>
                                </div>
                                <div className="w-2 h-2 bg-slate-900 rotate-45 mx-auto -mt-1" />
                              </div>
                            </motion.div>
                            
                            <div className="absolute top-10 left-1/2 -translate-x-1/2 whitespace-nowrap">
                              <div className="flex flex-col items-center">
                                <div className="w-1 h-1 bg-slate-200 rounded-full mb-1" />
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-md border border-slate-100">
                                  {t.month}
                                </span>
                              </div>
                            </div>
                          </div>
                        );
                      });
                    })()}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Recent Payments Area (Admin Only) */}
        {user?.role === 'admin' && (
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-2">
                <CreditCard size={18} className="text-navy" />
                <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
              </div>
              <Link href="/admin/payments" className="text-[10px] font-bold text-navy uppercase tracking-widest hover:underline">View All</Link>
            </div>
            
            <div className="space-y-5">
              {!stats.recentPayments || stats.recentPayments.length === 0 ? (
                <div className="py-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  <TrendingUp size={24} className="text-slate-200 mx-auto mb-2" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase">No recent transactions</p>
                </div>
              ) : (
                stats.recentPayments.map((payment, i) => (
                  <div key={i} className="flex items-center justify-between group cursor-default">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-navy font-bold text-[10px] border border-slate-100 group-hover:bg-navy group-hover:text-white transition-all">
                        {payment.student_name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 leading-tight">{payment.student_name}</p>
                        <p className="text-[10px] text-slate-400 font-medium">{payment.course_name}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-emerald-600">₹{payment.amount}</p>
                      <p className="text-[9px] text-slate-400 font-medium">
                        {new Date(payment.paid_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Live Financial Sync</span>
                </div>
                <p className="text-[10px] text-slate-400 font-medium italic">Instance: v1.0.4-stable</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Broadcast Modal */}
      <AnimatePresence>
        {isNoticeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsNoticeModalOpen(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-navy text-white">
                <div className="flex items-center space-x-3">
                  <Zap size={20} className="text-primary" />
                  <h2 className="text-lg font-bold">Broadcast New Notice</h2>
                </div>
                <button onClick={() => setIsNoticeModalOpen(false)} className="p-2 hover:bg-white/10 rounded-xl transition-all">
                  <RefreshCcw size={18} className="rotate-45" />
                </button>
              </div>

              <div className="p-8 space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Target Audience</label>
                  <div className="flex space-x-2">
                    {['all', 'student', 'teacher'].map((role) => (
                      <button
                        key={role}
                        onClick={() => setNoticeData({...noticeData, target: role})}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                          noticeData.target === role 
                            ? "bg-navy text-white shadow-lg shadow-navy/20" 
                            : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                        }`}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Notice Title</label>
                  <input 
                    type="text" 
                    placeholder="e.g. Academic Schedule Update"
                    value={noticeData.title}
                    onChange={(e) => setNoticeData({...noticeData, title: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-bold"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Message Content</label>
                  <textarea 
                    rows={4}
                    placeholder="Type your official announcement here..."
                    value={noticeData.content}
                    onChange={(e) => setNoticeData({...noticeData, content: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:border-navy focus:bg-white transition-all text-sm font-medium resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="p-8 bg-slate-50 border-t border-slate-100 flex items-center justify-end space-x-4">
                <button 
                  onClick={() => setIsNoticeModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-slate-400 hover:text-slate-600 transition-all"
                >
                  Discard
                </button>
                <button 
                  onClick={handleBroadcast}
                  disabled={isBroadcasting}
                  className="px-8 py-3 bg-navy text-white rounded-2xl font-bold text-sm hover:bg-black transition-all flex items-center space-x-2 shadow-xl shadow-navy/10 disabled:opacity-70"
                >
                  {isBroadcasting ? (
                    <RefreshCcw size={16} className="animate-spin" />
                  ) : (
                    <Zap size={16} className="text-primary" />
                  )}
                  <span>{isBroadcasting ? "Sending..." : "Post Notice"}</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
