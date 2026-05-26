import React, { useEffect, useMemo, useState } from 'react';
import { getUnreadNotifications } from '../../api/notificationApi';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LogOutIcon,
  MenuIcon,
  XIcon,
  BellIcon,
  HeartHandshakeIcon,
  CalendarIcon,
} from 'lucide-react';
import { accentNavClasses } from '../../utils/tailwindClassMaps';
import { ConfirmDialog } from '../admin/ConfirmDialog';
export interface SidebarItem {
  name: string;
  href: string;
  icon: React.ElementType;
  badge?: number;
}
export interface UserProfile {
  name: string;
  email: string;
  initials: string;
  roleLabel: string;
  accentColor: 'sky' | 'emerald' | 'cyan';
}
interface DashboardLayoutProps {
  children: React.ReactNode;
  sidebarItems: SidebarItem[];
  sidebarLabel: string;
  user: UserProfile;
}
export function DashboardLayout({
  children,
  sidebarItems,
  sidebarLabel,
  user
}: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    setShowLogoutConfirm(false);
    logout();
    navigate('/login', { replace: true });
  };

  useEffect(() => {
    let cancelled = false;
    const loadUnread = async () => {
      try {
        const response = await getUnreadNotifications(user.email);
        if (!cancelled) {
          setUnreadCount(response.data?.length ?? 0);
        }
      } catch {
        if (!cancelled) {
          setUnreadCount(0);
        }
      }
    };
    loadUnread();
    const interval = window.setInterval(loadUnread, 30000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [user.email, location.pathname]);

  const resolvedSidebarItems = useMemo(
    () =>
      sidebarItems.map((item) => {
        if (!item.href.includes('/notifications')) {
          return item;
        }
        return unreadCount > 0 ? { ...item, badge: unreadCount } : item;
      }),
    [sidebarItems, unreadCount]
  );
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  const shortDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
  const colorMap = {
    sky: 'bg-sky-100 text-sky-700',
    emerald: 'bg-emerald-100 text-emerald-700',
    cyan: 'bg-cyan-100 text-cyan-700'
  };
  return (
    <div className="min-h-screen bg-slate-50 flex overflow-x-hidden">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen &&
        <motion.div
          initial={{
            opacity: 0
          }}
          animate={{
            opacity: 1
          }}
          exit={{
            opacity: 0
          }}
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-sm z-40 lg:hidden" />

        }
      </AnimatePresence>

      {/* Sidebar — pure Tailwind transform for slide; no framer-motion conflict */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen w-72 max-w-[85vw]
          bg-white border-r border-slate-200 z-50 flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 shrink-0
        `}>
        
        {/* Logo Area */}
        <div className="h-16 sm:h-20 flex items-center px-4 sm:px-6 border-b border-slate-100 shrink-0">
          <Link to="/" className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-sky-100 flex items-center justify-center text-sky-600 shrink-0">
              <HeartHandshakeIcon className="w-5 h-5" />
            </div>
            <span className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight truncate">
              CampusCares
            </span>
          </Link>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="ml-auto lg:hidden text-slate-400 hover:text-slate-600 shrink-0 p-1"
            aria-label="Close sidebar">
            
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-6 px-3 sm:px-4 space-y-1">
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 px-2">
            {sidebarLabel}
          </div>
          {resolvedSidebarItems.map((item) => {
            const isActive =
              location.pathname === item.href || location.hash === item.href;
            const navAccent = accentNavClasses[user.accentColor] ?? accentNavClasses.sky;
            return (
              <Link
                key={item.name}
                to={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center justify-between px-3 py-2.5 rounded-xl transition-colors ${
                  isActive ? `${navAccent.active} font-medium` : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}>
                <div className="flex items-center gap-3 min-w-0">
                  <item.icon
                    className={`w-5 h-5 shrink-0 ${isActive ? navAccent.icon : 'text-slate-400'}`}
                  />
                  <span className="truncate">{item.name}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full shrink-0 ml-2 ${
                      isActive ? navAccent.badge : 'bg-slate-100 text-slate-600'
                    }`}>
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Area */}
        <div className="p-3 sm:p-4 border-t border-slate-100 shrink-0">
          <button
            type="button"
            onClick={() => setShowLogoutConfirm(true)}
            className="flex w-full items-center gap-3 px-3 py-2.5 rounded-xl text-slate-600 hover:bg-rose-50 hover:text-rose-600 transition-colors">
            
            <LogOutIcon className="w-5 h-5 shrink-0" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Top Header */}
        <header className="h-16 sm:h-20 bg-white/80 backdrop-blur-md border-b border-slate-200/50 flex items-center justify-between px-3 sm:px-6 lg:px-8 z-30 sticky top-0 gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 text-slate-600 hover:bg-slate-100 rounded-lg shrink-0"
              aria-label="Open sidebar">
              
              <MenuIcon className="w-6 h-6" />
            </button>

          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0">
            {/* Date Display — full on xl, short on lg, hidden below */}
            <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium whitespace-nowrap">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{currentDate}</span>
            </div>
            <div className="hidden lg:flex xl:hidden items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium whitespace-nowrap">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span>{shortDate}</span>
            </div>

            <Link
              to={resolvedSidebarItems.find((item) => item.href.includes('/notifications'))?.href ?? '#'}
              className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors shrink-0"
              aria-label="Notifications">
              <BellIcon className="w-5 h-5" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 rounded-full border-2 border-white text-[10px] font-bold text-white flex items-center justify-center">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </Link>

            <div className="hidden sm:block h-8 w-px bg-slate-200"></div>

            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="hidden md:block text-right min-w-0">
                <p className="text-sm font-bold text-slate-700 leading-none truncate max-w-[140px]">
                  {user.name}
                </p>
                <p className="text-xs text-slate-500 mt-1 truncate max-w-[140px]">
                  {user.roleLabel}
                </p>
              </div>
              <div
                className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border-2 border-white shadow-sm flex items-center justify-center font-bold text-sm sm:text-base shrink-0 ${colorMap[user.accentColor]}`}>
                
                {user.initials}
              </div>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-3 sm:p-6 lg:p-8 relative scroll-smooth">
          {/* Background Blobs for depth */}
          <div className="absolute top-0 left-0 w-full h-96 bg-gradient-to-b from-sky-50/50 to-transparent pointer-events-none -z-10" />
          <div className="absolute top-20 left-20 w-96 h-96 bg-sky-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none -z-10" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-emerald-200/20 rounded-full mix-blend-multiply filter blur-3xl opacity-70 pointer-events-none -z-10" />

          <div className="w-full max-w-7xl mx-auto">{children}</div>
        </div>
      </main>

      <ConfirmDialog
        open={showLogoutConfirm}
        title="Log out?"
        message="You will be signed out and returned to the login page."
        confirmLabel="Log out"
        cancelLabel="Stay signed in"
        variant="danger"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />
    </div>
  );
}