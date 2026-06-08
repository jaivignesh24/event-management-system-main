import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Zap,
  Trophy,
  Users,
  Calendar,
  MapPin,
  Sparkles,
  ChevronRight,
  ArrowRight,
  Star,
  Lightbulb,
  Rocket,
  Heart,
  Code,
  Music,
  Gamepad2,
  Briefcase,
  Bell,
  TrendingUp,
  Check,
  Cpu,
  Zap as LightningBolt,
  Laptop,
  Bot,
  X,
} from 'lucide-react';
import { useEvents } from '../context/EventContext';

export const Home = () => {
  const navigate = useNavigate();
  const { events } = useEvents();
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);

  const renderSponsorLogo = (name) => {
    switch (name) {
      case 'Google':
        return (
          <svg viewBox="0 0 24 24" className="w-10 h-10 select-none pointer-events-none">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22c-.22-.67-.35-1.37-.35-2.09z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
          </svg>
        );
      case 'Microsoft':
        return (
          <svg viewBox="0 0 23 23" className="w-9 h-9 select-none pointer-events-none">
            <rect x="0" y="0" width="11" height="11" fill="#F25022" />
            <rect x="12" y="0" width="11" height="11" fill="#7FBA00" />
            <rect x="0" y="12" width="11" height="11" fill="#00A4EF" />
            <rect x="12" y="12" width="11" height="11" fill="#FFB900" />
          </svg>
        );
      case 'Amazon AWS':
        return (
          <svg viewBox="0 0 50 30" className="w-16 h-10 text-slate-800 dark:text-white fill-current select-none pointer-events-none">
            <text x="3" y="18" className="font-sans font-black tracking-tight" fontSize="13">aws</text>
            <path d="M4 22 C 14 27, 26 27, 36 22" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" />
            <path d="M33 23 L 36 22 L 35 19" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" />
          </svg>
        );
      case 'GitHub':
        return (
          <svg viewBox="0 0 24 24" className="w-10 h-10 text-slate-800 dark:text-white fill-current select-none pointer-events-none">
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482C19.138 20.197 22 16.44 22 12.017 22 6.484 17.522 2 12 2z" />
          </svg>
        );
      case 'Intel':
        return (
          <svg viewBox="0 0 50 20" className="w-16 h-10 text-blue-600 dark:text-blue-400 fill-current select-none pointer-events-none">
            <text x="7" y="15" className="font-sans font-black tracking-tighter italic" fontSize="15">intel</text>
            <ellipse cx="25" cy="10" rx="23" ry="8" fill="none" stroke="currentColor" strokeWidth="1.5" />
          </svg>
        );
      case 'Red Bull':
        return (
          <svg viewBox="0 0 50 30" className="w-16 h-10 select-none pointer-events-none">
            <circle cx="25" cy="15" r="9" fill="#FFCC00" />
            <path d="M 22 15 C 15 10, 8 18, 5 13 C 8 13, 12 11, 15 13 Z" fill="#DA291C" />
            <path d="M 12 12 L 8 9" stroke="#DA291C" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M 28 15 C 35 10, 42 18, 45 13 C 42 13, 38 11, 35 13 Z" fill="#DA291C" />
            <path d="M 38 12 L 42 9" stroke="#DA291C" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        );
      case 'TCS':
        return (
          <svg viewBox="0 0 60 20" className="w-20 h-10 text-blue-700 dark:text-blue-400 fill-current select-none pointer-events-none">
            <text x="2" y="15" className="font-sans font-black tracking-wider" fontSize="13">tcs</text>
            <path d="M 40 3 L 47 10 L 40 17" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        );
      case 'Cisco':
        return (
          <svg viewBox="0 0 40 30" className="w-12 h-10 text-cyan-600 dark:text-cyan-400 fill-current select-none pointer-events-none">
            <rect x="4" y="12" width="2" height="6" rx="1" />
            <rect x="8" y="8" width="2" height="10" rx="1" />
            <rect x="12" y="4" width="2" height="14" rx="1" />
            <rect x="16" y="8" width="2" height="10" rx="1" />
            <rect x="20" y="8" width="2" height="10" rx="1" />
            <rect x="24" y="4" width="2" height="14" rx="1" />
            <rect x="28" y="8" width="2" height="10" rx="1" />
            <rect x="32" y="12" width="2" height="6" rx="1" />
            <text x="4" y="27" className="font-sans font-black tracking-wider" fontSize="8">CISCO</text>
          </svg>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate(`/events?search=${encodeURIComponent(searchQuery)}`);
    else navigate('/events');
  };

  // Featured trending events
  const featuredEvents = events.filter(e => e.trending).slice(0, 6);

  // Campus Pulse Updates
  const [selectedEvent, setSelectedEvent] = useState(null);
  const campusPulseUpdates = [
    { id: 1, title: 'AI Bootcamp', subtitle: 'Registrations Open Now', color: 'from-purple-500 to-pink-500', icon: Bot, live: true },
    { id: 2, title: 'Dance Auditions', subtitle: 'Live Selections Today', color: 'from-pink-500 to-rose-500', icon: Music, live: true },
    { id: 3, title: 'Hackathon Teams', subtitle: 'Team Allocations Ready', color: 'from-blue-500 to-cyan-500', icon: Code, live: false },
    { id: 4, title: 'Sports Finals', subtitle: 'Tonight at 6 PM', color: 'from-orange-500 to-amber-500', icon: Trophy, live: false },
    { id: 5, title: 'Music Night', subtitle: 'Lineup Announced', color: 'from-indigo-500 to-purple-500', icon: Music, live: true },
  ];

  // Why Join Features
  const whyJoinFeatures = [
    {
      id: 1,
      title: 'Premium Experience',
      description: 'World-class events with international standards and premium management.',
      icon: Sparkles,
      color: 'from-purple-500/20 to-pink-500/20',
      borderColor: 'border-purple-500/30',
    },
    {
      id: 2,
      title: 'Cash Prizes',
      description: 'Win up to ₹10+ lakhs in total prizes across various competitions.',
      icon: Trophy,
      color: 'from-orange-500/20 to-yellow-500/20',
      borderColor: 'border-orange-500/30',
    },
    {
      id: 3,
      title: 'Network & Grow',
      description: 'Connect with peers, mentors, and industry leaders in your field.',
      icon: Users,
      color: 'from-blue-500/20 to-cyan-500/20',
      borderColor: 'border-blue-500/30',
    },
    {
      id: 4,
      title: 'Skill Development',
      description: 'Learn from experts through workshops, bootcamps, and master classes.',
      icon: Rocket,
      color: 'from-red-500/20 to-pink-500/20',
      borderColor: 'border-red-500/30',
    },
    {
      id: 5,
      title: 'Placement Opportunities',
      description: 'Get recognized by top companies for recruitment and internships.',
      icon: Briefcase,
      color: 'from-green-500/20 to-emerald-500/20',
      borderColor: 'border-green-500/30',
    },
    {
      id: 6,
      title: 'Lifelong Memories',
      description: 'Create unforgettable experiences with your college community.',
      icon: Heart,
      color: 'from-pink-500/20 to-rose-500/20',
      borderColor: 'border-pink-500/30',
    },
  ];

  // Timeline Events
  const timelineEvents = [
    {
      day: 'Day 1',
      date: 'May 24',
      events: [
        { time: '09:00 AM', event: 'Registration & Opening Ceremony' },
        { time: '11:00 AM', event: 'Speed Coding Showdown Begins' },
        { time: '04:00 PM', event: 'Acoustics: Battle of Bands' },
      ],
    },
    {
      day: 'Day 2',
      date: 'May 25',
      events: [
        { time: '09:00 AM', event: 'Aurora Hackathon Kickoff' },
        { time: '11:00 AM', event: 'Robo-Wars Competition' },
        { time: '05:00 PM', event: 'Spandan: Group Dance Night' },
      ],
    },
    {
      day: 'Day 3',
      date: 'May 26',
      events: [
        { time: '10:00 AM', event: 'AI/ML Workshop Series' },
        { time: '03:00 PM', event: 'Awards & Closing Ceremony' },
        { time: '06:00 PM', event: 'Aurora DJ Night & EDM Fest' },
      ],
    },
  ];

  // Sponsors with CDN logos
  const sponsors = [
    { name: 'Google', logo: 'https://logo.clearbit.com/google.com' },
    { name: 'Microsoft', logo: 'https://logo.clearbit.com/microsoft.com' },
    { name: 'Amazon AWS', logo: 'https://logo.clearbit.com/aws.amazon.com' },
    { name: 'GitHub', logo: 'https://logo.clearbit.com/github.com' },
    { name: 'Intel', logo: 'https://logo.clearbit.com/intel.com' },
    { name: 'Red Bull', logo: 'https://logo.clearbit.com/redbull.com' },
    { name: 'TCS', logo: 'https://logo.clearbit.com/tcs.com' },
    { name: 'Cisco', logo: 'https://logo.clearbit.com/cisco.com' },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: 'spring', stiffness: 100, damping: 10 },
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-white to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-[var(--text-primary)] overflow-hidden font-sans">
      
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

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative min-h-[100vh] flex items-center pt-20 pb-10 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Animated Background Blobs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ x: [0, 50, 0], y: [0, 30, 0] }}
            transition={{ duration: 8, repeat: Infinity }}
            className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ x: [0, -50, 0], y: [0, -30, 0] }}
            transition={{ duration: 10, repeat: Infinity, delay: 1 }}
            className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl"
          />
        </div>

        <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10">
          {/* Left: Hero Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 w-fit"
              >
                <Sparkles className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-semibold uppercase tracking-wider text-purple-600 dark:text-purple-400">
                  Welcome to Aurora Fest 2026
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl lg:text-6xl xl:text-7xl font-black leading-tight tracking-tight"
              >
                Celebrate
                <br />
                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 bg-clip-text text-transparent">
                  Excellence
                </span>
                <br />
                Together
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-lg text-[var(--text-muted)] max-w-md leading-relaxed"
              >
                Join 5000+ students for the most premium university festival featuring hackathons, cultural nights, sports, and more.
              </motion.p>
            </div>

            {/* Search Bar */}
            <motion.form
              onSubmit={handleSearchSubmit}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="relative"
            >
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-pink-500/20 rounded-2xl blur-xl group-focus-within:blur-2xl transition-all duration-300" />
                <div className="relative flex items-center bg-white/80 dark:bg-slate-900/60 border border-white/30 dark:border-white/10 rounded-2xl overflow-hidden backdrop-blur-xl hover:border-purple-500/50 transition-all duration-300">
                  <input
                    type="text"
                    placeholder="Search events, workshops, competitions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 px-6 py-4 bg-transparent text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-6 py-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-semibold hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300"
                  >
                    <Search className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.form>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              <Link
                to="/register"
                className="group relative px-8 py-4 rounded-full overflow-hidden font-bold uppercase tracking-wider text-center"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 opacity-100 group-hover:opacity-110 transition-all duration-300" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl shadow-purple-500/80 blur-xl" />
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/20 transition-all duration-300" />
                <span className="relative text-white flex items-center justify-center gap-2 group-hover:scale-105 transition-transform duration-300">
                  Register Now <motion.div whileHover={{ x: 5 }}><ArrowRight className="w-5 h-5" /></motion.div>
                </span>
              </Link>

              <Link
                to="/login"
                className="group relative px-8 py-4 rounded-full font-bold uppercase tracking-wider text-center border border-white/30 dark:border-white/20 bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 backdrop-blur-xl"
              >
                <span className="text-[var(--text-primary)] flex items-center justify-center gap-2">
                  Login <ArrowRight className="w-5 h-5" />
                </span>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="grid grid-cols-3 gap-4 pt-4"
            >
              {[
                { label: '50+', value: 'Events' },
                { label: '5K+', value: 'Students' },
                { label: '₹10L+', value: 'Prizes' },
              ].map((stat, i) => (
                <div key={i} className="rounded-xl bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 p-3 backdrop-blur-sm hover:border-purple-500/50 transition-all duration-300">
                  <p className="text-lg font-bold text-purple-600 dark:text-purple-400">{stat.label}</p>
                  <p className="text-xs uppercase tracking-wider text-[var(--text-muted)]">{stat.value}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Hero Image/Cards */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative h-[500px] hidden lg:block"
          >
            {/* Floating Cards with Real Images */}
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute top-10 left-0 w-48 h-64 rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl group"
            >
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400&h=500&fit=crop")' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative flex flex-col h-full justify-between p-4 text-white">
                <Code className="w-8 h-8" />
                <div>
                  <p className="font-bold text-sm">Hackathon</p>
                  <p className="text-xs opacity-90">36-hour coding marathon</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 20, 0] }}
              transition={{ duration: 5, repeat: Infinity, delay: 1 }}
              className="absolute top-40 right-0 w-48 h-64 rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl group"
            >
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=400&h=500&fit=crop")' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative flex flex-col h-full justify-between p-4 text-white">
                <Music className="w-8 h-8" />
                <div>
                  <p className="font-bold text-sm">Cultural Night</p>
                  <p className="text-xs opacity-90">Live performances & DJs</p>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 4.5, repeat: Infinity, delay: 0.5 }}
              className="absolute bottom-20 left-1/2 transform -translate-x-1/2 w-48 h-64 rounded-2xl overflow-hidden border border-white/20 dark:border-white/10 shadow-2xl group"
            >
              <div className="absolute inset-0 bg-cover bg-center group-hover:scale-110 transition-transform duration-500"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=400&h=500&fit=crop")' }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
              <div className="relative flex flex-col h-full justify-between p-4 text-white">
                <Trophy className="w-8 h-8" />
                <div>
                  <p className="font-bold text-sm">Competitions</p>
                  <p className="text-xs opacity-90">Win amazing prizes</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ==================== CAMPUS PULSE SECTION ==================== */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white/50 dark:from-slate-900/30 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-purple-600 dark:text-purple-400 font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              <Bell className="w-4 h-4" /> Live Updates
            </p>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">Campus Pulse</h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              Real-time updates from Aurora Fest. Stay in the loop with live announcements, registrations, and event happenings.
            </p>
          </motion.div>

          {/* Carousel */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 overflow-x-auto pb-4"
          >
            {campusPulseUpdates.map((update, idx) => {
              const IconComponent = update.icon;
              return (
                <motion.div
                  key={update.id}
                  variants={itemVariants}
                  whileHover={{ y: -5, boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}
                  className="relative group flex-shrink-0 w-full rounded-2xl overflow-hidden cursor-pointer"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${update.color} opacity-20 group-hover:opacity-30 transition-all duration-300`} />
                  <div className="relative border border-white/20 dark:border-white/10 rounded-2xl p-5 backdrop-blur-xl h-full flex flex-col justify-between group-hover:border-white/40 transition-all duration-300">
                    <div>
                      <div className="flex items-start justify-between mb-4">
                        <div className="p-2 bg-white/20 rounded-lg group-hover:bg-white/30 transition-all duration-300">
                          <IconComponent className="w-6 h-6 text-white" />
                        </div>
                        {update.live && (
                          <div className="flex items-center gap-1 px-2 py-1 bg-red-500/30 border border-red-500/50 rounded-full animate-pulse">
                            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            <span className="text-xs font-semibold text-red-600 dark:text-red-400">LIVE</span>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-[var(--heading-color)] mb-1">{update.title}</h3>
                    </div>
                    <p className="text-sm text-[var(--text-muted)]">{update.subtitle}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ==================== WHY JOIN SECTION ==================== */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-pink-600 dark:text-pink-400 font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              <Heart className="w-4 h-4" /> Why Join Aurora Fest
            </p>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">What Makes It Special</h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              Premium experience with world-class events, amazing prizes, networking opportunities, and unforgettable memories.
            </p>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {whyJoinFeatures.map((feature) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.id}
                  variants={itemVariants}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className={`group rounded-2xl border ${feature.borderColor} bg-gradient-to-br ${feature.color} backdrop-blur-xl p-8 hover:shadow-2xl transition-all duration-300 cursor-pointer`}
                >
                  <div className="mb-4 p-3 w-fit rounded-xl bg-white/20 dark:bg-white/10 group-hover:bg-white/30 transition-all duration-300">
                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="font-bold text-lg text-[var(--heading-color)] mb-2">{feature.title}</h3>
                  <p className="text-sm text-[var(--text-muted)]">{feature.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ==================== TIMELINE SECTION ==================== */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white/50 dark:from-slate-900/30 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              <Calendar className="w-4 h-4" /> Festival Timeline
            </p>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">Festival Schedule</h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              Three days of non-stop action, entertainment, and competition across multiple venues.
            </p>
          </motion.div>

          {/* Timeline Cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {timelineEvents.map((dayEvent, dayIdx) => (
              <motion.div
                key={dayIdx}
                variants={itemVariants}
                whileHover={{ scale: 1.02 }}
                className="group"
              >
                {/* Day Header */}
                <div className="mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-full text-white font-bold text-center w-full hover:shadow-lg hover:shadow-blue-500/50 transition-all duration-300"
                  >
                    <p className="text-sm uppercase tracking-wider">{dayEvent.day}</p>
                    <p className="text-lg font-black">{dayEvent.date}</p>
                  </motion.div>
                </div>

                {/* Events Timeline */}
                <div className="space-y-4">
                  {dayEvent.events.map((evt, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="relative pl-6 pb-4 border-l-2 border-gradient-to-b border-purple-500/30 hover:border-purple-500/60 transition-all duration-300 last:border-transparent last:pb-0"
                    >
                      {/* Timeline Dot */}
                      <motion.div
                        whileHover={{ scale: 1.2 }}
                        className="absolute -left-3 top-0 w-4 h-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full border-2 border-white dark:border-slate-950 shadow-lg"
                      />

                      {/* Event Card */}
                      <div className="rounded-lg bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 p-3 backdrop-blur-sm hover:bg-white/60 dark:hover:bg-white/10 transition-all duration-300">
                        <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">
                          {evt.time}
                        </p>
                        <p className="text-sm font-semibold text-[var(--heading-color)]">{evt.event}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== SPONSORS SECTION ==================== */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-orange-600 dark:text-orange-400 font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              <Briefcase className="w-4 h-4" /> Partners & Sponsors
            </p>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">Powered by Industry Leaders</h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              Aurora Fest is supported by world-renowned companies and organizations.
            </p>
          </motion.div>

          {/* Sponsors Grid with Marquee Effect */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
          >
            {sponsors.map((sponsor, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                whileHover={{ scale: 1.08, y: -5 }}
                className="rounded-xl border border-white/30 dark:border-white/20 bg-white/50 dark:bg-white/8 backdrop-blur-xl p-6 flex items-center justify-center hover:bg-white/70 dark:hover:bg-white/15 transition-all duration-300 cursor-pointer group shadow-lg hover:shadow-2xl hover:shadow-purple-500/10"
              >
                <div className="text-center w-full">
                  <div className="mb-2 h-12 flex items-center justify-center">
                    {renderSponsorLogo(sponsor.name)}
                  </div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[var(--text-muted)] group-hover:text-[var(--heading-color)] transition-colors">
                    {sponsor.name}
                  </p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ==================== FEATURED EVENTS SECTION ==================== */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-white/50 dark:from-slate-900/30 to-transparent backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider mb-2 flex items-center justify-center gap-2">
              <Zap className="w-4 h-4" /> Trending
            </p>
            <h2 className="text-4xl lg:text-5xl font-black mb-4">Trending Events</h2>
            <p className="text-[var(--text-muted)] max-w-2xl mx-auto">
              Don't miss out on these hot events with the most registrations and buzz.
            </p>
          </motion.div>

          {/* Events Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {featuredEvents.map((event) => (
              <motion.div
                key={event.id}
                variants={itemVariants}
                whileHover={{ y: -8 }}
                onClick={() => setSelectedEvent(event)}
                className="group cursor-pointer rounded-2xl overflow-hidden bg-white/40 dark:bg-white/5 border border-white/20 dark:border-white/10 backdrop-blur-xl hover:shadow-2xl hover:shadow-purple-500/20 transition-all duration-300"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Badge */}
                  <div className="absolute top-4 right-4">
                    <span className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg">
                      {event.category}
                    </span>
                  </div>

                  {/* Trending Badge */}
                  {event.trending && (
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold text-white flex items-center gap-1 bg-red-500/90 shadow-lg">
                      <TrendingUp className="w-3 h-3" /> Trending
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="font-bold text-lg text-[var(--heading-color)] mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                    {event.title}
                  </h3>

                  <p className="text-sm text-[var(--text-muted)] mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  {/* Meta Info */}
                  <div className="space-y-2 mb-4 text-sm">
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <Calendar className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                      <MapPin className="w-4 h-4" />
                      <span className="truncate">{event.venue}</span>
                    </div>
                  </div>

                  {/* Registration Count */}
                  <div className="mb-4 pb-4 border-t border-white/20 dark:border-white/10">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[var(--text-muted)]">
                        {event.registrations} registered
                      </span>
                      <div className="w-20 h-1.5 bg-white/20 dark:bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
                          style={{
                            width: `${(event.registrations / event.totalSeats) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <button
                    onClick={() => navigate(`/events/${event.id}`)}
                    className="w-full py-3 rounded-lg font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-pink-500 hover:shadow-lg hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    View Details <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* View All CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <Link
              to="/events"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 border border-purple-600/30 hover:bg-purple-600/10 transition-all duration-300"
            >
              View All {events.length}+ Events <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ==================== FINAL CTA SECTION ==================== */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-600/30 via-pink-500/20 to-blue-500/20 blur-3xl" />

            {/* Card */}
            <div className="relative border border-white/20 dark:border-white/10 bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl rounded-3xl p-12 text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100 }}
              >
                <Sparkles className="w-12 h-12 text-purple-600 dark:text-purple-400 mx-auto mb-4" />
              </motion.div>

              <h2 className="text-4xl lg:text-5xl font-black mb-4 text-[var(--heading-color)]">
                Ready to Join Aurora Fest?
              </h2>

              <p className="text-lg text-[var(--text-muted)] max-w-2xl mx-auto mb-8">
                Limited spots available! Register now to secure your place in the most premium university festival experience.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/register"
                  className="group relative px-10 py-4 rounded-full overflow-hidden font-bold uppercase tracking-wider text-center"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 opacity-100 group-hover:opacity-110 transition-all duration-300" />
                  <span className="relative text-white">Register Now</span>
                </Link>

                <Link
                  to="/events"
                  className="px-10 py-4 rounded-full font-bold uppercase tracking-wider text-purple-600 dark:text-purple-400 border border-purple-600/50 hover:bg-purple-600/10 transition-all duration-300"
                >
                  Explore Events
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ==================== EVENT DETAILS MODAL ==================== */}
      <AnimatePresence>
        {selectedEvent && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedEvent(null)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <motion.div
                className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl overflow-hidden shadow-2xl"
              >
                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedEvent(null)}
                  className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 dark:bg-slate-800/90 hover:bg-red-500 hover:text-white transition-all duration-300"
                >
                  <X className="w-6 h-6" />
                </motion.button>

                {/* Content */}
                <div className="overflow-y-auto max-h-[90vh]">
                  {/* Image */}
                  <div className="relative h-64 overflow-hidden bg-gradient-to-br from-purple-500/20 to-pink-500/20">
                    <img
                      src={selectedEvent.image}
                      alt={selectedEvent.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4">
                      <span className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg">
                        {selectedEvent.category}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="p-8">
                    <h2 className="text-3xl font-black text-[var(--heading-color)] mb-4">{selectedEvent.title}</h2>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                      <div className="rounded-lg bg-white/40 dark:bg-white/5 border border-white/20 p-4">
                        <p className="text-xs text-[var(--text-muted)] uppercase font-semibold mb-1">Date</p>
                        <p className="font-bold text-[var(--heading-color)]">{selectedEvent.date}</p>
                      </div>
                      <div className="rounded-lg bg-white/40 dark:bg-white/5 border border-white/20 p-4">
                        <p className="text-xs text-[var(--text-muted)] uppercase font-semibold mb-1">Venue</p>
                        <p className="font-bold text-[var(--heading-color)] truncate">{selectedEvent.venue}</p>
                      </div>
                      <div className="rounded-lg bg-white/40 dark:bg-white/5 border border-white/20 p-4">
                        <p className="text-xs text-[var(--text-muted)] uppercase font-semibold mb-1">Fee</p>
                        <p className="font-bold text-[var(--heading-color)]">₹{selectedEvent.fee || 'Free'}</p>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-8">
                      <h3 className="font-bold text-lg text-[var(--heading-color)] mb-2">About Event</h3>
                      <p className="text-[var(--text-muted)] leading-relaxed">{selectedEvent.description}</p>
                    </div>

                    {/* Coordinator */}
                    {selectedEvent.coordinator && (
                      <div className="mb-8 rounded-lg bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/20 p-4">
                        <h3 className="font-bold text-[var(--heading-color)] mb-2">Coordinator</h3>
                        <p className="text-[var(--text-muted)]">{selectedEvent.coordinator}</p>
                      </div>
                    )}

                    {/* Registration Count */}
                    <div className="mb-8">
                      <p className="text-sm text-[var(--text-muted)] mb-2">{selectedEvent.registrations} / {selectedEvent.totalSeats} Registered</p>
                      <div className="w-full h-3 bg-white/20 dark:bg-white/10 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${(selectedEvent.registrations / selectedEvent.totalSeats) * 100}%` }}
                          transition={{ duration: 1 }}
                          className="h-full bg-gradient-to-r from-purple-600 to-pink-500"
                        />
                      </div>
                    </div>

                    {/* Register Button */}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full py-4 rounded-xl font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 hover:shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 flex items-center justify-center gap-2"
                    >
                      <Heart className="w-5 h-5" /> Register Now
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ==================== SCROLL TO TOP BUTTON ==================== */}
      {scrolled && (
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="fixed bottom-8 right-8 z-40 p-4 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-lg hover:shadow-2xl hover:scale-110 transition-all duration-300"
        >
          <ChevronRight className="w-6 h-6 -rotate-90" />
        </motion.button>
      )}
    </div>
  );
};

export default Home;
