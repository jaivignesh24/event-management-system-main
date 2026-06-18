import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Sparkles, Mail, Lock, User, Check, Eye, EyeOff } from 'lucide-react';

export const Register = () => {
  const { currentUser, registerUser } = useAuth();
  const navigate = useNavigate();

  // Form Fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [department, setDepartment] = useState('Computer Science & Engineering');
  const [role, setRole] = useState('student');

  // Logic & Loading States
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Already logged in route guard
  React.useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'superadmin') {
        navigate('/superadmin');
      } else if (currentUser.role === 'admin') {
        navigate('/admin');
      } else if (['volunteer', 'head_volunteer', 'coordinator'].includes(currentUser.role)) {
        navigate('/volunteer');
      } else {
        navigate('/dashboard');
      }
    }
  }, [currentUser, navigate]);

  const departments = [
    'Computer Science & Engineering',
    'Electronics & Communication',
    'Information Technology',
    'Mechanical Engineering',
    'Electrical & Electronics',
    'Business Administration (MBA)'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    // Strict Validations
    if (!name || !email || !password || !confirmPassword) {
      setErrorMsg('Please fill in all input fields.');
      return;
    }

    // Email Domain Validation (*@aurora.edu.in)
    const emailDomain = '@aurora.edu.in';
    if (!email.toLowerCase().endsWith(emailDomain)) {
      setErrorMsg('Strict Campus Rule: You must use your official university email domain ending with @aurora.edu.in to register.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password strength: Must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Verification failed: Passwords do not match.');
      return;
    }

    setIsLoading(true);

    // Simulate short network delay
    setTimeout(async () => {
      const response = await registerUser({
        name,
        email: email.toLowerCase(),
        password,
        department,
        role
      });
      setIsLoading(false);

      if (response.success) {
        if (role === 'admin') {
          navigate('/admin');
        } else if (role === 'volunteer') {
          navigate('/volunteer');
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
      
      {/* Background Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-neonPurple/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-neonPink/10 blur-[120px] pointer-events-none" />

      <motion.div
        className="max-w-md w-full relative z-10"
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        
        {/* Registration Card Form */}
        <div className="glass-card rounded-[2.5rem] p-8 sm:p-10 border border-slate-200/50 dark:border-white/5 shadow-2xl text-left space-y-6">
          
          <div className="text-center space-y-3">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-neonPink/10 border border-neonPink/20 text-neonPink text-xs font-bold uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AURA 2026 REGISTRATION</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-sans leading-tight">
              Join Aurora Fest
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Create your student entry pass and unlock access to all competitions.
            </p>
          </div>

          {/* Validation Alert */}
          <AnimatePresence>
            {errorMsg && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs flex items-start space-x-2"
              >
                <ShieldAlert className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-300 dark:border-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-800 dark:text-white text-sm"
                />
                <User className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* University Email Address */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">University Email</label>
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your @aurora.edu.in email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 pl-11 rounded-2xl border border-slate-300 dark:border-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-800 dark:text-white text-sm"
                />
                <Mail className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
              </div>
              <span className="text-[10px] text-slate-400 italic px-1">
                Must end with <strong className="text-orange-500">@aurora.edu.in</strong>
              </span>
            </div>

            {/* Role Dropdown Option */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Portal Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-800 dark:text-white text-sm dark:bg-slate-900"
              >
                <option value="student">Student</option>
                <option value="admin">Faculty/Admin</option>
              </select>
            </div>

            {/* Department Select Option */}
            <div className="space-y-1">
              <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Department</label>
              <select
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 dark:border-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-800 dark:text-white text-sm dark:bg-slate-900"
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>

             {/* Password */}
             <div className="space-y-1">
               <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Password</label>
               <div className="relative">
                 <input
                   type={showPassword ? 'text' : 'password'}
                   placeholder="••••••••"
                   value={password}
                   onChange={(e) => setPassword(e.target.value)}
                   className="w-full px-4 py-3 pl-11 pr-11 rounded-2xl border border-slate-300 dark:border-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-800 dark:text-white text-sm"
                 />
                 <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                 <button
                   type="button"
                   onClick={() => setShowPassword(!showPassword)}
                   className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-650 dark:hover:text-white cursor-pointer z-20"
                 >
                   {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                 </button>
               </div>
             </div>
 
             {/* Confirm Password */}
             <div className="space-y-1">
               <label className="text-xs font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">Confirm Password</label>
               <div className="relative">
                 <input
                   type={showConfirmPassword ? 'text' : 'password'}
                   placeholder="••••••••"
                   value={confirmPassword}
                   onChange={(e) => setConfirmPassword(e.target.value)}
                   className="w-full px-4 py-3 pl-11 pr-11 rounded-2xl border border-slate-300 dark:border-white/10 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-orange-500/50 text-slate-800 dark:text-white text-sm"
                 />
                 <Lock className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
                 <button
                   type="button"
                   onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                   className="absolute right-4 top-3.5 text-slate-400 hover:text-slate-650 dark:hover:text-white cursor-pointer z-20"
                 >
                   {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                 </button>
               </div>
             </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl text-xs font-extrabold uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-700 transition-all flex items-center justify-center cursor-pointer shadow-md"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <span className="flex items-center space-x-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Register & Join Portal</span>
                </span>
              )}
            </button>
          </form>

          <div className="text-center pt-2">
            <p className="text-xs text-slate-500">
              Already have a student account?{' '}
              <Link to="/login" className="font-bold text-orange-500 hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </div>

      </motion.div>
    </div>
  );
};
