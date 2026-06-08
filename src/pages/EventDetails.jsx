import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { Calendar, MapPin, Clock, ArrowLeft, Trophy, Users, CheckCircle, Info, X, Bookmark, Share2, Award, FileText, Check, ShieldAlert } from 'lucide-react';

export const EventDetails = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const { events, registerForEvent, registrations } = useEvents();
  const { currentUser } = useAuth();
  const [alertInfo, setAlertInfo] = useState(null);
  
  // Local state for bookmarks
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('aurora-bookmarks') || '[]'));
  
  useEffect(() => {
    localStorage.setItem('aurora-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const toggleBookmark = () => {
    setBookmarks(prev => prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]);
  };
  const isBookmarked = bookmarks.includes(eventId);

  const event = events.find((item) => item.id === eventId);
  const isRegistered = currentUser && (registrations[currentUser.email] || []).includes(eventId);

  const handleRegister = () => {
    if (!currentUser) {
      setAlertInfo({
        type: 'error',
        message: 'Sign in to register',
        detail: 'Please sign in or create your student account before registering for this experience.',
        actionLabel: 'Sign In',
        actionRoute: '/login'
      });
      return;
    }

    if (currentUser.role === 'admin') {
      setAlertInfo({
        type: 'error',
        message: 'Admin login detected',
        detail: 'Administrator accounts cannot register for student events. Please use a student account.',
        actionLabel: 'Switch Account',
        actionRoute: '/login'
      });
      return;
    }

    if (isRegistered) {
      navigate('/dashboard');
      return;
    }

    const result = registerForEvent(currentUser.email, eventId);
    if (result.success) {
      setAlertInfo({ type: 'success', message: 'Successfully Registered!', detail: `You are now registered for ${event.title}. Check your dashboard for entry passes.` });
    } else {
      setAlertInfo({ type: 'info', message: 'Registration Alert', detail: result.message });
    }
  };

  const handleAlertAction = () => {
    if (alertInfo?.actionRoute) {
      navigate(alertInfo.actionRoute);
      setAlertInfo(null);
    }
  };

  if (!event) {
    return (
      <div className="min-h-screen bg-[var(--bg)] text-[var(--text-primary)] flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center glass-card rounded-[2rem] p-12 shadow-2xl">
          <ShieldAlert className="h-16 w-16 text-rose-500 mx-auto mb-4" />
          <h1 className="text-3xl font-black mb-2 text-[var(--heading-color)]">Event Not Found</h1>
          <p className="text-sm text-[var(--text-muted)] mb-8">This event may have been removed or the link is invalid.</p>
          <button
            onClick={() => navigate('/events')}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-neonPurple to-neonPink px-6 py-3 text-sm font-bold text-white hover:scale-105 transition-all"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Events
          </button>
        </div>
      </div>
    );
  }

  const seatsLeft = Math.max(event.totalSeats - event.registrations, 0);

  return (
    <div className="relative min-h-screen w-full flex justify-center py-28 px-4 sm:px-6 bg-gradient-to-br from-slate-50 via-white to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-[var(--text-primary)] transition-colors duration-300 font-sans">
      
      {/* Premium Futuristic Background Mesh & Light Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {/* Soft Mesh Gradients */}
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -60, 40, 0],
            scale: [1, 1.15, 0.9, 1]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-40 -left-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-purple-300/15 via-lavender-200/10 to-transparent blur-[130px] dark:from-purple-950/10 dark:via-indigo-950/5"
        />
        <motion.div
          animate={{
            x: [0, -60, 80, 0],
            y: [0, 80, -60, 0],
            scale: [1, 0.9, 1.1, 1]
          }}
          transition={{ duration: 30, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/3 right-[-200px] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-blue-300/15 via-indigo-200/10 to-transparent blur-[120px] dark:from-indigo-950/10 dark:via-slate-900/5"
        />
        <motion.div
          animate={{
            x: [0, 50, -50, 0],
            y: [0, 80, -30, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-10 left-[-150px] w-[450px] h-[450px] rounded-full bg-gradient-to-tr from-indigo-300/15 to-purple-200/10 blur-[100px] dark:from-indigo-950/10"
        />

        {/* Futuristic Minimal Grid Overlay */}
        <div className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] bg-[linear-gradient(to_right,#808080_1px,transparent_1px),linear-gradient(to_bottom,#808080_1px,transparent_1px)] bg-[size:32px_32px]" />

        {/* Minimal Abstract Geometric Wave / Circles */}
        <div className="absolute top-1/4 left-10 w-96 h-96 rounded-full border border-purple-500/[0.04] dark:border-purple-500/[0.08] pointer-events-none" />
        <div className="absolute top-1/4 left-10 w-[500px] h-[500px] rounded-full border border-indigo-500/[0.02] dark:border-indigo-500/[0.05] pointer-events-none" />
        <div className="absolute bottom-1/4 right-20 w-80 h-80 rounded-full border border-blue-500/[0.03] dark:border-blue-500/[0.06] pointer-events-none" />

        {/* Subtle Floating Particles / Orbs */}
        <div className="absolute top-20 left-1/3 w-3 h-3 rounded-full bg-purple-400/20 blur-[1px] animate-pulse" />
        <div className="absolute top-1/2 right-1/4 w-2 h-2 rounded-full bg-blue-400/20 blur-[1px] animate-pulse" />
        <div className="absolute bottom-1/3 left-1/4 w-4 h-4 rounded-full bg-indigo-400/20 blur-[2px] animate-pulse" />
      </div>

      <AnimatePresence>
        {alertInfo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm"
          >
            <div className="max-w-md w-full glass-card bg-white/10 dark:bg-black/40 rounded-3xl border border-white/20 p-6 shadow-2xl relative">
              <button onClick={() => setAlertInfo(null)} className="absolute right-4 top-4 p-2 rounded-full hover:bg-white/10 text-[var(--text-muted)] transition-colors">
                <X className="h-4 w-4" />
              </button>
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-full shrink-0 ${alertInfo.type === 'success' ? 'bg-emerald-500/20 text-emerald-500' : 'bg-rose-500/20 text-rose-500'}`}>
                  {alertInfo.type === 'success' ? <CheckCircle className="h-6 w-6" /> : <Info className="h-6 w-6" />}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[var(--heading-color)]">{alertInfo.message}</h3>
                  <p className="text-sm text-[var(--text-muted)] mt-2 leading-relaxed">{alertInfo.detail}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-end gap-3">
                {alertInfo?.actionRoute && (
                  <button onClick={handleAlertAction} className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-[var(--heading-color)] bg-white/5 border border-slate-200/50 hover:bg-white/10 transition-all">
                    {alertInfo.actionLabel}
                  </button>
                )}
                <button onClick={() => setAlertInfo(null)} className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-neonPurple to-neonPink hover:scale-105 transition-all">
                  Understood
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Modal Container */}
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-6xl glass-card rounded-[2rem] sm:rounded-[3rem] overflow-hidden shadow-2xl border border-white/20 dark:border-white/10 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl flex flex-col"
      >
        
        {/* Floating Close Button */}
        <button 
          onClick={() => navigate('/events')}
          className="absolute top-4 right-4 sm:top-6 sm:right-6 z-50 p-3 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-md border border-white/20 shadow-xl transition-all hover:scale-110"
        >
          <X className="h-6 w-6" />
        </button>

        {/* Banner Section */}
        <div className="relative h-64 sm:h-96 w-full shrink-0">
          <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-90" />
          
          <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-12 text-left">
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-white bg-neonPurple/80 backdrop-blur-md border border-white/20">
                {event.category}
              </span>
              {isRegistered && (
                <span className="px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest text-emerald-400 bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 flex items-center gap-1.5">
                  <CheckCircle className="h-3.5 w-3.5" /> Already Registered
                </span>
              )}
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white leading-tight drop-shadow-2xl">
              {event.title}
            </h1>
          </div>
        </div>

        {/* Content Layout */}
        <div className="flex flex-col lg:flex-row p-6 sm:p-12 gap-10 lg:gap-16">
          
          {/* Left Column - Details */}
          <div className="flex-1 space-y-10">
            {/* Overview */}
            <section className="space-y-4">
              <div className="flex items-center gap-3 text-neonCyan">
                <Info className="h-6 w-6" />
                <h2 className="text-xl font-black uppercase tracking-widest text-[var(--heading-color)]">Overview</h2>
              </div>
              <p className="text-base sm:text-lg leading-relaxed text-[var(--text-muted)] font-medium">
                {event.description}
              </p>
              <div className="flex flex-wrap gap-2 pt-2">
                {event.tags?.map((tag) => (
                  <span key={tag} className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-200 dark:bg-white/5 text-[var(--text-primary)] border border-slate-300 dark:border-white/10">
                    #{tag}
                  </span>
                ))}
              </div>
            </section>

            {/* Rules */}
            {event.rules && (
              <section className="space-y-4">
                <div className="flex items-center gap-3 text-rose-500">
                  <FileText className="h-6 w-6" />
                  <h2 className="text-xl font-black uppercase tracking-widest text-[var(--heading-color)]">Rules & Guidelines</h2>
                </div>
                <ul className="space-y-3">
                  {event.rules.map((rule, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-[var(--text-muted)] font-medium">
                      <Check className="h-5 w-5 text-neonPurple shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{rule}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-white/50 dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Faculty Coordinator</p>
                <p className="font-bold text-[var(--heading-color)]">{event.coordinator}</p>
              </div>
              <div className="bg-white/50 dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Student Coordinator</p>
                <p className="font-bold text-[var(--heading-color)]">{event.studentCoordinator || 'TBA'}</p>
              </div>
              <div className="bg-white/50 dark:bg-white/5 p-5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-1 sm:col-span-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">Requirements to bring</p>
                <p className="font-bold text-[var(--heading-color)]">{event.requirements || 'Valid Student ID card & Registration Pass'}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Action Card */}
          <aside className="w-full lg:w-[400px] shrink-0">
            <div className="sticky top-6 rounded-[2rem] bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl border border-slate-200 dark:border-white/20 p-8 shadow-2xl space-y-8 relative overflow-hidden">
              
              {/* Glowing gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-neonPurple via-purple-500 to-neonPink" />

              <div className="space-y-6">
                {/* Time & Venue */}
                <div className="space-y-4 text-sm font-semibold text-[var(--heading-color)]">
                  <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 p-4 rounded-xl">
                    <Calendar className="h-5 w-5 text-neonPurple" />
                    <div>
                      <p className="text-[10px] uppercase text-[var(--text-muted)] tracking-widest">Date</p>
                      <p>{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 p-4 rounded-xl">
                    <Clock className="h-5 w-5 text-neonCyan" />
                    <div>
                      <p className="text-[10px] uppercase text-[var(--text-muted)] tracking-widest">Time</p>
                      <p>{event.time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-100 dark:bg-white/5 p-4 rounded-xl">
                    <MapPin className="h-5 w-5 text-neonPink" />
                    <div>
                      <p className="text-[10px] uppercase text-[var(--text-muted)] tracking-widest">Venue</p>
                      <p>{event.venue}</p>
                    </div>
                  </div>
                </div>

                {/* Prize Pool & Fee */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200 dark:border-white/10">
                  <div>
                    <p className="text-[10px] uppercase text-[var(--text-muted)] tracking-widest font-black">Prize Pool</p>
                    <div className="flex items-center gap-1.5 mt-1 text-[var(--heading-color)]">
                      <Award className="h-4 w-4 text-neonPink" />
                      <span className="font-black text-sm">{event.prizePool || 'TBA'}</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase text-[var(--text-muted)] tracking-widest font-black">Entry Fee</p>
                    <p className="font-black text-2xl text-[var(--heading-color)] mt-1">{event.price}</p>
                  </div>
                </div>

                {/* Seats progress */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-[var(--text-muted)]">
                    <span>Seats Available</span>
                    <span className="text-[var(--heading-color)]">{seatsLeft} / {event.totalSeats}</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-200 dark:bg-black/50 overflow-hidden shadow-inner">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min((event.registrations / event.totalSeats) * 100, 100)}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-neonPurple to-neonPink relative"
                    >
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </motion.div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-4 pt-4">
                <button
                  onClick={handleRegister}
                  disabled={isRegistered || seatsLeft <= 0}
                  className={`w-full relative group overflow-hidden rounded-2xl py-5 text-sm font-black uppercase tracking-[0.2em] transition-all duration-300 shadow-xl ${
                    isRegistered
                      ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 cursor-default'
                      : seatsLeft <= 0
                      ? 'bg-slate-300 dark:bg-white/5 text-slate-500 cursor-not-allowed'
                      : 'text-white bg-slate-900 border border-transparent hover:scale-105'
                  }`}
                >
                  {!isRegistered && seatsLeft > 0 && (
                    <div className="absolute inset-0 bg-gradient-to-r from-neonPurple via-purple-500 to-neonPink opacity-90 group-hover:opacity-100 transition-opacity" />
                  )}
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    {isRegistered ? <><CheckCircle className="h-5 w-5" /> View Pass on Dashboard</> : seatsLeft <= 0 ? 'Event Full' : 'Secure Your Spot Now'}
                  </span>
                </button>

                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={toggleBookmark}
                    className={`flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest transition-all border shadow-sm hover:scale-105 ${
                      isBookmarked
                        ? 'border-neonPink bg-neonPink/10 text-neonPink'
                        : 'border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/5 text-[var(--heading-color)] hover:bg-slate-100 dark:hover:bg-white/10'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Saved' : 'Save'}
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3.5 rounded-xl text-xs font-bold uppercase tracking-widest border border-slate-300 dark:border-white/10 bg-white/50 dark:bg-white/5 text-[var(--heading-color)] hover:bg-slate-100 dark:hover:bg-white/10 transition-all shadow-sm hover:scale-105">
                    <Share2 className="h-4 w-4" /> Share
                  </button>
                </div>
              </div>

            </div>
          </aside>

        </div>
      </motion.div>
    </div>
  );
};
