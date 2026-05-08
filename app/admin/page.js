"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
              <span className="flex items-center text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                <ArrowUpRight size={10} className="mr-0.5" /> 12%
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
            <select className="bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium px-3 py-1.5 outline-none cursor-pointer">
              <option>Last 30 Days</option>
              <option>Last 6 Months</option>
            </select>
          </div>
          <div className="h-64 bg-slate-50 rounded-xl flex flex-col items-center justify-center border border-dashed border-slate-200">
            <Activity size={32} className="text-slate-300 mb-2" />
            <p className="text-slate-400 text-xs font-medium">Visualization interface loading...</p>
          </div>
        </div>

        {/* System Health Area (Admin Only) */}
        {user?.role === 'admin' && (
          <div className="lg:col-span-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-2 mb-8">
              <Shield size={18} className="text-navy" />
              <h3 className="text-base font-semibold text-slate-900">System Health</h3>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Server size={16} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">Primary Server</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Live</span>
              </div>
              
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <Database size={16} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">Database Engine</span>
                </div>
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-100/50 px-2 py-0.5 rounded-full uppercase tracking-tighter">Stable</span>
              </div>

              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center space-x-3">
                  <RefreshCcw size={16} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-600">Last Backup</span>
                </div>
                <span className="text-xs font-semibold text-navy">2h ago</span>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                <span>Instance: v1.0.4-stable</span>
                <span className="hover:text-navy cursor-pointer">View Logs &rarr;</span>
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
