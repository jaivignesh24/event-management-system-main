import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, ShieldAlert, Sparkles, Mail, Lock, User } from 'lucide-react';
import { FaGithub, FaGoogle, FaTwitter } from 'react-icons/fa';

export const Login = () => {
  const { currentUser, login, loginWithOAuth } = useAuth();
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Already logged in route guard
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    const handleOAuthMessage = (event) => {
      if (event.origin !== window.location.origin) return;
      
      const { source, user } = event.data;
      if (source === 'oauth-google' || source === 'oauth-github' || source === 'oauth-twitter') {
        setIsLoading(true);
        setErrorMsg('');
        setTimeout(() => {
          const response = loginWithOAuth(user);
          setIsLoading(false);
          if (response.success) {
            navigate('/dashboard');
          } else {
            setErrorMsg('OAuth authentication failed. Please try again.');
          }
        }, 1200);
      }
    };

    window.addEventListener('message', handleOAuthMessage);
    return () => window.removeEventListener('message', handleOAuthMessage);
  }, [loginWithOAuth, navigate]);

  const handleOAuthClick = (provider) => {
    setErrorMsg('');
    const width = 500;
    const height = 600;
    const left = window.screenX + (window.outerWidth - width) / 2;
    const top = window.screenY + (window.outerHeight - height) / 2;
    
    const popupUrl = `/oauth-${provider}.html`;
    window.open(popupUrl, `Authorize ${provider}`, `width=${width},height=${height},left=${left},top=${top},status=no,resizable=yes,scrollbars=yes`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email || !password) {
      setErrorMsg('Please enter both your college email and password.');
      return;
    }

    setIsLoading(true);

    // Simulate short network delay
    setTimeout(() => {
      const response = login(email, password);
      setIsLoading(false);

      if (response.success) {
        if (response.user.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      } else {
        setErrorMsg(response.message);
      }
    }, 800);
  };

  return (
    <div className="relative w-full min-h-[90vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300 overflow-hidden">
      
      {/* Dynamic Background Neon Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neonPurple/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neonPink/10 blur-[120px] pointer-events-none" />

      <motion.div
        className="max-w-md w-full relative z-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        
        {/* Glassmorphism Card Wrapper */}
        <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border border-slate-200/50 dark:border-white/5 shadow-2xl relative overflow-hidden space-y-6 text-left">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-neonPurple/10 border border-neonPurple/20 text-neonPurple text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AURA 2026 FEST PORTAL</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-sans leading-tight">
              Welcome Back
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Sign in to manage registrations and view your digital event QR pass.
            </p>
          </div>

          {/* Validation Alert */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs flex items-center space-x-2"
              >
                <ShieldAlert className="h-4 w-4 shrink-0" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">College Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="student@aurora.edu.in"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3.5 pl-11 rounded-2xl border border-slate-300 dark:border-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-neonPurple/50 text-slate-800 dark:text-white"
                />
                <Mail className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 flex justify-between px-1">
                <span>Demo Student: <strong className="text-neonCyan">student@aurora.edu.in</strong></span>
                <span>Admin: <strong className="text-neonPink">admin@aurora.edu.in</strong></span>
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Password</label>
                <a href="#" className="text-[11px] font-bold text-neonPink hover:underline">Forgot?</a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3.5 pl-11 pr-11 rounded-2xl border border-slate-300 dark:border-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-neonPurple/50 text-slate-800 dark:text-white"
                />
                <Lock className="absolute left-4 top-4 h-4 w-4 text-slate-400" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-4 text-slate-400 hover:text-slate-650 dark:hover:text-white cursor-pointer z-20"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 px-1">
                Demo Password for both: <strong className="text-slate-800 dark:text-slate-300">password</strong>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl text-xs font-extrabold uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 via-purple-600 to-blue-500 hover:scale-102 hover:shadow-neon-purple transition-all flex items-center justify-center cursor-pointer shadow-md"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span>Sign In</span>
              )}
            </button>
          </form>

          {/* Social Sign-In Divider */}
          <div className="relative flex items-center justify-center my-4">
            <span className="absolute w-full h-[1px] bg-slate-200/50 dark:bg-white/5" />
            <span className="relative z-10 px-3 text-[10px] font-bold uppercase tracking-widest text-slate-400 bg-slate-50 dark:bg-[#0B0D23] transition-colors duration-300">
              Or Connect With
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleOAuthClick('google')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-slate-300 dark:border-white/5 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all text-xs font-semibold cursor-pointer"
            >
              <FaGoogle className="h-4 w-4 shrink-0 mr-1.5 text-red-500" />
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthClick('github')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-slate-300 dark:border-white/5 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all text-xs font-semibold cursor-pointer"
            >
              <FaGithub className="h-4 w-4 shrink-0 mr-1.5 text-slate-900 dark:text-white" />
              <span>GitHub</span>
            </button>
            <button
              type="button"
              onClick={() => handleOAuthClick('twitter')}
              className="flex items-center justify-center py-2.5 rounded-xl border border-slate-300 dark:border-white/5 dark:bg-white/5 hover:bg-slate-100 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all text-xs font-semibold cursor-pointer"
            >
              <FaTwitter className="h-4 w-4 shrink-0 mr-1.5 text-sky-500" />
              <span>Twitter</span>
            </button>
          </div>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Don't have a student portal account?{' '}
              <Link to="/register" className="font-bold text-neonPink hover:underline">
                Create Account
              </Link>
            </p>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
