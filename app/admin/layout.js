"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Users, 
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
  Image,
  Layout
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin" },
  { icon: Users, label: "Students", href: "/admin/students" },
  { icon: BookOpen, label: "LMS / Courses", href: "/admin/courses" },
  { icon: Users, label: "Faculties", href: "/admin/faculties" },
  { icon: CheckSquare, label: "Attendance", href: "/admin/attendance" },
  { icon: CreditCard, label: "Payments", href: "/admin/payments" },
  { icon: Layout, label: "Workshops", href: "/admin/workshops" },
  { icon: Image, label: "Media Gallery", href: "/admin/gallery" },
  { icon: Award, label: "Certificates", href: "/admin/certificates" },
];

export default function AdminLayout({ children }) {
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
              <Link href="/admin/settings" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all">
                <Settings size={18} />
                <span className="text-sm">Settings</span>
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
            <div className="relative hidden md:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search resources..." 
                className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-lg w-72 outline-none focus:border-navy/20 transition-all text-xs font-medium"
              />
            </div>
          </div>

          <div className="flex items-center space-x-5">
            <button className="relative p-2 hover:bg-slate-50 rounded-lg transition-all text-slate-500">
              <Bell size={18} />
              <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center space-x-3 border-l pl-5 border-slate-100 h-8">
              <div className="text-right hidden sm:block">
                <p className="text-xs font-semibold text-slate-800 leading-none">Admin Panel</p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">Superuser Access</p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-white font-bold text-xs shadow-sm">
                AD
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
