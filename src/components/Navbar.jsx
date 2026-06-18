import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import auroraLogo from '../pages/auroranew.png';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Sun, Moon, Compass, Image, Users2, User } from 'lucide-react';

export const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();

  if (location.pathname.startsWith('/admin') || location.pathname.startsWith('/dashboard') || location.pathname.startsWith('/verify') || location.pathname.startsWith('/certificate') || location.pathname.startsWith('/superadmin') || location.pathname.startsWith('/volunteer')) {
    return null;
  }

  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scrolling to adjust blur and opacity
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const homePath = currentUser 
    ? (currentUser.role === 'superadmin' ? '/superadmin' : (currentUser.role === 'admin' ? '/admin' : (currentUser.role === 'volunteer' ? '/volunteer' : '/dashboard'))) 
    : '/';

  const navLinks = [
    { name: 'Home', path: homePath },
    { name: 'Events', path: '/events', icon: Compass },
    { name: 'Clubs', path: '/clubs', icon: Users2 },
    { name: 'Gallery', path: '/gallery', icon: Image },
  ];

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 backdrop-blur-xl ${
        scrolled
          ? 'bg-white/80 dark:bg-slate-950/80 border-b border-slate-200 dark:border-slate-800/80 shadow-md py-3'
          : 'bg-white/95 dark:bg-slate-950/90 border-b border-slate-100 dark:border-slate-900 py-4'
      }`}
    >
      <div className="w-full px-4 sm:px-6">
        <div className="flex flex-row flex-nowrap items-center justify-between gap-4 w-full">
          <Link to={homePath} className="flex-1 flex items-center justify-start gap-3 group whitespace-nowrap">
            <motion.div
              whileHover={{ scale: 1.05, rotateZ: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 10 }}
              className="relative flex items-center justify-center"
            >
              <img
                src={auroraLogo}
                alt="Aurora Logo"
                className="w-16 h-16 sm:w-20 sm:h-20 object-contain transition-all duration-300 group-hover:drop-shadow-[0_0_15px_rgba(249,115,22,0.3)]"
              />
            </motion.div>
            <div className="hidden sm:flex flex-col leading-tight text-left">
              <span className="text-[10px] uppercase tracking-[0.25em] text-slate-400 dark:text-slate-500 font-bold">Aurora University</span>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-800 dark:text-white group-hover:text-orange-500 transition-colors">Fest 2026</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center justify-center gap-8 flex-initial whitespace-nowrap">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative text-sm sm:text-base font-bold uppercase tracking-wider transition-all duration-200 ${
                  isActive(link.path)
                    ? 'text-orange-500'
                    : 'text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400'
                }`}
              >
                <span className="relative z-10">{link.name}</span>
                <span
                  className={`absolute left-0 -bottom-1 h-0.5 w-full rounded-full transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-orange-500'
                      : 'bg-transparent'
                  }`}
                />
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center justify-end gap-4 flex-1 whitespace-nowrap">
            {currentUser ? (
              <div className="relative">
                {/* Avatar Button */}
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2 px-4 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 hover:border-orange-500/50 transition-all font-bold cursor-pointer"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center text-xs uppercase font-extrabold shadow-sm">
                    {currentUser.name.substring(0, 2)}
                  </div>
                  <span className="text-xs uppercase tracking-wider text-slate-700 dark:text-slate-300">{currentUser.name.split(' ')[0]}</span>
                </button>

                {/* Dropdown panel */}
                <AnimatePresence>
                  {isOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
                      <div className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-xl p-3 z-50 text-left space-y-1">
                        <Link
                          to={currentUser.role === 'superadmin' ? '/superadmin' : (currentUser.role === 'admin' ? '/admin' : (currentUser.role === 'volunteer' ? '/volunteer' : '/dashboard'))}
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                        >
                          My Dashboard
                        </Link>
                        {currentUser.role === 'student' && (
                          <Link
                            to="/dashboard?tab=profile"
                            onClick={() => setIsOpen(false)}
                            className="block px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                          >
                            My Profile
                          </Link>
                        )}
                        <Link
                          to="/events"
                          onClick={() => setIsOpen(false)}
                          className="block px-4 py-2 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl"
                        >
                          Browse Events
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-xs font-bold text-rose-500 hover:bg-rose-500/10 rounded-xl cursor-pointer"
                        >
                          Sign Out
                        </button>
                      </div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    to="/register"
                    className="relative px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-xs font-black uppercase tracking-wider text-white shadow-md shadow-orange-500/10 overflow-hidden group block"
                  >
                    <span className="relative">Register</span>
                  </Link>
                </motion.div>
                <Link
                  to="/events"
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
                >
                  Browse Events
                </Link>
              </>
            )}
            
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-9 w-16 items-center rounded-full border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 p-1 shadow-inner transition-all cursor-pointer"
              aria-label="Toggle Theme"
              title="Toggle theme"
            >
              <span className={`h-7 w-7 rounded-full shadow-md transition-transform duration-200 flex items-center justify-center ${isDark ? 'translate-x-7 bg-slate-850 text-orange-400' : 'translate-x-0 bg-white text-yellow-500'}`}>
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </span>
            </button>
          </div>

          <div className="flex items-center justify-end gap-3 flex-1 lg:hidden">
            <button
              onClick={toggleTheme}
              className="relative inline-flex h-9 w-16 items-center rounded-full border border-slate-200 dark:border-slate-850 bg-slate-100 dark:bg-slate-900 p-1 shadow-inner transition-all cursor-pointer"
              aria-label="Toggle Theme"
            >
              <span className={`h-7 w-7 rounded-full shadow-md transition-transform duration-200 flex items-center justify-center ${isDark ? 'translate-x-7 bg-slate-850 text-orange-400' : 'translate-x-0 bg-white text-yellow-500'}`}>
                {isDark ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </span>
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 shadow-sm transition-all cursor-pointer"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="lg:hidden mt-4 border-t border-slate-200 dark:border-slate-800 px-4 py-5 bg-white dark:bg-slate-950 text-left"
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold uppercase tracking-wide transition-all ${
                    isActive(link.path)
                      ? 'bg-orange-500/10 text-orange-600 border border-orange-500/20'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                  }`}
                >
                  <span>{link.name}</span>
                </Link>
              ))}
            </div>
            <div className="mt-4 grid grid-cols-1 gap-2">
              <Link
                to="/events"
                onClick={() => setIsOpen(false)}
                className="block text-center px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold uppercase tracking-wider hover:bg-slate-100 dark:hover:bg-slate-800 transition-all text-xs"
              >
                Browse Events
              </Link>
              {!currentUser && (
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-4 py-3 rounded-xl bg-orange-500 text-white font-bold uppercase tracking-wider shadow-md hover:bg-orange-600 transition-all text-xs"
                >
                  Register Now
                </Link>
              )}
              {currentUser && currentUser.role === 'student' && (
                <>
                  <Link
                    to="/dashboard"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold uppercase tracking-wider transition-all text-xs"
                  >
                    Student Dashboard
                  </Link>
                  <Link
                    to="/dashboard?tab=profile"
                    onClick={() => setIsOpen(false)}
                    className="block text-center px-4 py-3 rounded-xl bg-orange-500 text-white font-bold uppercase tracking-wider transition-all text-xs"
                  >
                    My Profile
                  </Link>
                </>
              )}
              {currentUser && currentUser.role === 'volunteer' && (
                <Link
                  to="/volunteer"
                  onClick={() => setIsOpen(false)}
                  className="block text-center px-4 py-3 rounded-xl bg-slate-900 dark:bg-slate-800 text-white font-bold uppercase tracking-wider transition-all text-xs"
                >
                  Volunteer Dashboard
                </Link>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between px-4 border-t border-slate-200 dark:border-slate-800 pt-4">
              {currentUser ? (
                <div className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                  Welcome, <span className="font-bold text-slate-800 dark:text-slate-200">{currentUser.name.split(' ')[0]}</span>
                </div>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 hover:text-orange-500"
                >
                  Sign In
                </Link>
              )}
              {currentUser && (
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 rounded-xl bg-rose-500/10 text-rose-500 font-bold uppercase tracking-wider text-xs cursor-pointer"
                >
                  Sign Out
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
