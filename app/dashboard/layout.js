"use client";

import { useState } from "react";
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
  FileText
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: BookOpen, label: "My Courses", href: "/dashboard/courses" },
  { icon: CheckSquare, label: "Attendance", href: "/dashboard/attendance" },
  { icon: FileText, label: "Examinations", href: "/dashboard/exams" },
  { icon: CreditCard, label: "Payments", href: "/dashboard/payments" },
  { icon: Award, label: "Certificates", href: "/dashboard/certificates" },
];

export default function StudentLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const pathname = usePathname();

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
              {menuItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-xl transition-all group ${
                      isActive 
                        ? "bg-primary text-navy font-semibold" 
                        : "text-white/60 hover:bg-white/5 hover:text-white"
                    }`}
                  >
                    <item.icon size={18} className={isActive ? "text-navy" : "group-hover:text-primary transition-colors"} />
                    <span className="text-sm">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-1">
              <Link href="/dashboard/profile" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all">
                <Settings size={18} />
                <span className="text-sm">Account Settings</span>
              </Link>
              <Link href="/login" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-400/5 transition-all">
                <LogOut size={18} />
                <span className="text-sm">Logout</span>
              </Link>
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
