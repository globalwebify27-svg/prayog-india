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
  Video,
  FileText,
  Layout, 
  Image,
  ChevronDown,
  Clock,
  IdCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";

const menuItems = [
  { icon: LayoutDashboard, label: "Overview", href: "/admin", roles: ["admin", "teacher"] },
  { 
    icon: Users, 
    label: "Students", 
    href: "/admin/students", 
    roles: ["admin", "teacher"],
    subItems: [
      { label: "Student Directory", href: "/admin/students", icon: Users },
      { label: "Attendance Ledger", href: "/admin/attendance", icon: CheckSquare },
      { label: "ID Card Generation", href: "/admin/students/idcards", icon: IdCard }
    ]
  },
  { 
    icon: BookOpen, 
    label: "LMS Ecosystem", 
    href: "/admin/courses", 
    roles: ["admin", "teacher"],
    subItems: [
      { label: "Academic Programs", href: "/admin/courses", icon: Layout },
      { label: "Timing Master", href: "/admin/timings", icon: Clock },
      { label: "Live Virtual Sessions", href: "/admin/batches", icon: Video },
      { label: "Exams & Assessments", href: "/admin/exams", icon: FileText }
    ]
  },
  { icon: Users, label: "Faculties", href: "/admin/faculties", roles: ["admin"] },
  { icon: CreditCard, label: "Payments", href: "/admin/payments", roles: ["admin"] },
  { icon: Layout, label: "Workshops", href: "/admin/workshops", roles: ["admin"] },
  { icon: Image, label: "Media Gallery", href: "/admin/gallery", roles: ["admin"] },
  { icon: Award, label: "Certificates", href: "/admin/certificates", roles: ["admin"] },
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

export default function AdminLayout({ children }) {
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

  const filteredMenuItems = menuItems.filter(item => 
    !user || item.roles.includes(user.role)
  );

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

            <nav className="flex-grow p-4 space-y-1 overflow-y-auto scrollbar-hide bg-navy">
              {filteredMenuItems.map((item) => (
                <SidebarItem key={item.label} item={item} pathname={pathname} />
              ))}
            </nav>

            <div className="p-4 border-t border-white/5 space-y-4 bg-navy mt-auto">
              <div className="space-y-1">
                {user?.role === 'admin' && (
                  <Link href="/admin/settings" className="flex items-center space-x-3 px-4 py-3 rounded-xl text-white/60 hover:bg-white/5 hover:text-white transition-all">
                    <Settings size={18} />
                    <span className="text-sm">Settings</span>
                  </Link>
                )}
                <Link href="/login" className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-400 hover:bg-rose-400/5 transition-all">
                  <LogOut size={18} />
                  <span className="text-sm">Logout</span>
                </Link>
              </div>

              <div className="flex items-center space-x-3 px-2 py-1 pt-4 border-t border-white/5">
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white font-bold text-sm border border-white/10">
                  {user?.name?.substring(0, 1) || 'A'}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white truncate w-32">{user?.name || 'Administrator'}</span>
                  <span className="text-[10px] text-white/40 uppercase tracking-widest">{user?.role}</span>
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
                <p className="text-xs font-semibold text-slate-800 leading-none">
                  {user?.role === 'admin' ? 'Admin Panel' : 'Faculty Panel'}
                </p>
                <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                  {user?.role === 'admin' ? 'Superuser Access' : 'Academic Access'}
                </p>
              </div>
              <div className="w-8 h-8 rounded-lg bg-navy flex items-center justify-center text-white font-bold text-xs shadow-sm uppercase">
                {user?.name?.substring(0, 2) || 'AD'}
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
