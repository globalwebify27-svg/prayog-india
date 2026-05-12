"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  BookOpen, 
  CheckSquare, 
  CreditCard, 
  Award, 
  Settings, 
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  User,
  FileText,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "My Courses", href: "/dashboard/courses" },
  { 
    icon: CheckSquare, 
    label: "Attendance", 
    href: "/dashboard/attendance",
    subItems: [
      { label: "Mark Attendance", href: "/dashboard/attendance", icon: CheckSquare },
      { label: "Attendance Log", href: "/dashboard/attendance/log", icon: FileText },
    ]
  },
  { icon: FileText, label: "Examinations", href: "/dashboard/exams" },
  { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
  { icon: LayoutDashboard, label: "Identity Card", href: "/dashboard/idcard" },
  { icon: Award, label: "Certificates", href: "/dashboard/certificates" },
];

function SidebarItem({ item, pathname }) {
  const isActive = pathname === item.href || (item.subItems && item.subItems.some(sub => pathname.startsWith(sub.href)));
  const [isOpen, setIsOpen] = useState(isActive || pathname.startsWith(item.href));

  if (item.subItems) {
    return (
      <div className="space-y-1">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
            isActive
              ? "bg-white/10 text-white font-semibold" 
              : "text-white/60 hover:bg-white/5 hover:text-white"
          }`}
        >
          <div className="flex items-center space-x-3">
            <item.icon 
              size={18} 
              className={isActive ? "text-primary" : "group-hover:text-primary transition-colors"} 
            />
            <span className="text-sm">{item.label}</span>
          </div>
          <ChevronDown size={14} className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
        
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden space-y-1 ml-4 border-l border-white/5 pl-2"
            >
              {item.subItems.map((sub) => {
                const isSubActive = pathname === sub.href;
                return (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl transition-all ${
                      isSubActive 
                        ? "bg-primary text-navy font-bold shadow-lg shadow-primary/10" 
                        : "text-white/40 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <sub.icon size={14} className={isSubActive ? "text-navy" : "text-white/20 group-hover:text-white"} />
                    <span className="text-[10px] uppercase tracking-wider font-bold">{sub.label}</span>
                  </Link>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link
      href={item.href}
      className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
        isActive 
          ? "bg-primary text-navy font-semibold shadow-lg shadow-primary/10" 
          : "text-white/60 hover:bg-white/5 hover:text-white"
      }`}
    >
      <item.icon size={18} className={isActive ? "text-navy" : "group-hover:text-primary transition-colors"} />
      <span className="text-sm">{item.label}</span>
    </Link>
  );
}

export default function StudentLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const pathname = usePathname();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      if (data.success) setUser(data.user);
    } catch (e) {}
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch (e) {
      console.error("Logout failed", e);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-body">
      {/* Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed lg:static z-50 w-64 h-screen bg-navy text-white flex flex-col shadow-lg shrink-0"
          >
            <div className="p-6 flex items-center justify-between border-b border-white/5">
              <Link href="/">
                <img src="/assets/logo.png" alt="Prayog India" className="h-8 brightness-200" />
              </Link>
              <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden text-white/40 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <nav className="flex-grow px-3 py-6 space-y-1">
              {menuItems.map((item) => (
                <SidebarItem key={item.label} item={item} pathname={pathname} />
              ))}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-4 bg-navy mt-auto">
              <div className="space-y-1">
                <Link href="/dashboard/profile" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all">
                  <Settings size={18} />
                  <span className="text-sm">Account Settings</span>
                </Link>
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-400/5 transition-all outline-none"
                >
                  <LogOut size={18} />
                  <span className="text-sm font-semibold">Logout</span>
                </button>
              </div>

              <div className="flex items-center space-x-3 px-2 py-1 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm border border-white/10">
                  {user?.name?.substring(0, 1) || 'S'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white truncate w-32">{user?.name || 'Student'}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">{user?.role || 'Scholar'}</span>
                </div>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="flex-grow flex flex-col h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-4">
            {!isSidebarOpen && (
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 hover:bg-slate-50 rounded-lg transition-all">
                <Menu size={20} className="text-slate-500" />
              </button>
            )}
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-widest hidden md:block">
              Student Portal
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <button className="relative p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-500">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 border-l pl-5 border-slate-100 h-8">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-none">My Dashboard</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Academic Session</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-white font-bold text-xs shadow-sm">
                <User size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* Page Body */}
        <div className="flex-grow overflow-y-auto p-6 lg:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
