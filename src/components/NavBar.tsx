import React, { useEffect, useState } from 'react';
import { HeartHandshakeIcon, MenuIcon, XIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { getDashboardPath } from '../utils/authUtils';

export function NavBar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Features', href: '#features' },
    { name: 'How It Works', href: '#how-it-works' },
    { name: 'Roles', href: '#roles' },
    { name: 'Impact', href: '#impact' },
  ];

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const dashboardPath = user ? getDashboardPath(user.role) : '/login';

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'py-3 bg-white/80 backdrop-blur-md border-b border-slate-200/50 shadow-sm' : 'py-5 bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600">
              <HeartHandshakeIcon className="w-6 h-6" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">CampusCares</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={`/${link.href}`}
                className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
                {link.name}
              </a>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <Link
                  to={dashboardPath}
                  className="text-sm font-medium text-slate-700 hover:text-sky-600 px-4 py-2 rounded-full transition-colors">
                  Dashboard
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="text-sm font-medium bg-slate-800 text-white px-5 py-2.5 rounded-full hover:bg-slate-900 transition-colors shadow-sm">
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-700 hover:text-sky-600 px-4 py-2 rounded-full transition-colors">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium bg-sky-600 text-white px-5 py-2.5 rounded-full hover:bg-sky-700 transition-colors shadow-sm shadow-sky-200">
                  Register
                </Link>
              </>
            )}
          </div>

          <button
            type="button"
            className="md:hidden p-2 text-slate-600"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}>
            {isMobileMenuOpen ? <XIcon className="w-6 h-6" /> : <MenuIcon className="w-6 h-6" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 bg-white border-b border-slate-200 shadow-lg md:hidden">
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={`/${link.href}`}
                  className="text-base font-medium text-slate-700 p-2 hover:bg-slate-50 rounded-lg"
                  onClick={() => setIsMobileMenuOpen(false)}>
                  {link.name}
                </a>
              ))}
              <div className="h-px bg-slate-100 my-2" />
              {isAuthenticated && user ? (
                <>
                  <Link
                    to={dashboardPath}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center text-base font-medium text-slate-700 py-3 hover:bg-slate-50 rounded-xl transition-colors block">
                    Dashboard
                  </Link>
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full text-center text-base font-medium bg-slate-800 text-white py-3 rounded-xl hover:bg-slate-900 transition-colors">
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center text-base font-medium text-slate-700 py-3 hover:bg-slate-50 rounded-xl transition-colors block">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full text-center text-base font-medium bg-sky-600 text-white py-3 rounded-xl hover:bg-sky-700 transition-colors block">
                    Register
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
