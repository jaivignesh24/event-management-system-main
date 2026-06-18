import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { useTheme } from '../context/ThemeContext';
import auroraLogo from './auroranew.png';
import {
  LayoutDashboard,
  Users,
  Calendar,
  MapPin,
  Clock,
  LogOut,
  Moon,
  Sun,
  Edit,
  CheckCircle2,
  X,
  Compass,
  AlertCircle,
  TrendingUp,
  Inbox,
  UserCheck,
  XCircle,
  Sparkles
} from 'lucide-react';

export const VolunteerDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { events, editEvent } = useEvents();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  // Active console tab
  const [activeTab, setActiveTab] = useState('overview');

  // Search & Filters state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeRegFilter, setActiveRegFilter] = useState('all');

  // Edit Event Modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editVenue, setEditVenue] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');
  const [editSeats, setEditSeats] = useState(100);

  // Toast feedback state
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Mock Registrations state (seeded and persistent in localStorage)
  const [registrations, setRegistrations] = useState(() => {
    const saved = localStorage.getItem('volunteer_dashboard_registrations');
    if (saved) return JSON.parse(saved);
    const initial = [
      {
        id: 'reg-1',
        studentName: 'Aarav Sharma',
        email: 'aarav.sharma@aurora.edu.in',
        eventTitle: 'Aurora Hackathon 2026',
        eventId: 'tech-1',
        department: 'Computer Science & Engineering',
        status: 'pending',
        appliedAt: '2026-06-16, 10:14 AM'
      },
      {
        id: 'reg-2',
        studentName: 'Ananya Verma',
        email: 'ananya.verma@aurora.edu.in',
        eventTitle: 'Robo-Wars: Clash of Titans',
        eventId: 'tech-2',
        department: 'Mechanical Engineering',
        status: 'pending',
        appliedAt: '2026-06-16, 02:45 PM'
      },
      {
        id: 'reg-3',
        studentName: 'Kabir Malhotra',
        email: 'kabir.malhotra@aurora.edu.in',
        eventTitle: 'Speed Coding Showdown',
        eventId: 'tech-3',
        department: 'Information Technology',
        status: 'approved',
        appliedAt: '2026-06-15, 11:30 AM'
      },
      {
        id: 'reg-4',
        studentName: 'Riya Gupta',
        email: 'riya.gupta@aurora.edu.in',
        eventTitle: 'Spandan: Group Dance',
        eventId: 'cult-1',
        department: 'Electronics & Communication',
        status: 'rejected',
        appliedAt: '2026-06-15, 04:12 PM'
      },
      {
        id: 'reg-5',
        studentName: 'Devansh Roy',
        email: 'devansh.roy@aurora.edu.in',
        eventTitle: 'Acoustics: Battle of Bands',
        eventId: 'cult-2',
        department: 'Computer Science & Engineering',
        status: 'pending',
        appliedAt: '2026-06-17, 09:05 AM'
      }
    ];
    localStorage.setItem('volunteer_dashboard_registrations', JSON.stringify(initial));
    return initial;
  });

  // Route safety guard: redirect to login if not a volunteer
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'volunteer') {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser || currentUser.role !== 'volunteer') {
    return null;
  }

  const userInitials = currentUser.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'VO';

  // Statistics calculations
  const totalApplied = registrations.length;
  const pendingCount = registrations.filter(r => r.status === 'pending').length;
  const approvedCount = registrations.filter(r => r.status === 'approved').length;
  const rejectedCount = registrations.filter(r => r.status === 'rejected').length;

  // Handlers for Registration approvals
  const handleApproveReg = (id) => {
    const updated = registrations.map(reg => reg.id === id ? { ...reg, status: 'approved' } : reg);
    setRegistrations(updated);
    localStorage.setItem('volunteer_dashboard_registrations', JSON.stringify(updated));
    showToast('Registration successfully approved!');
  };

  const handleDeclineReg = (id) => {
    const updated = registrations.map(reg => reg.id === id ? { ...reg, status: 'rejected' } : reg);
    setRegistrations(updated);
    localStorage.setItem('volunteer_dashboard_registrations', JSON.stringify(updated));
    showToast('Registration request declined.', 'error');
  };

  const handleToggleAttendance = (id, attendanceState) => {
    const updated = registrations.map(reg => reg.id === id ? { ...reg, attendance: attendanceState } : reg);
    setRegistrations(updated);
    localStorage.setItem('volunteer_dashboard_registrations', JSON.stringify(updated));
    showToast(`Attendance marked as ${attendanceState}!`);
  };

  // Open Edit modal
  const handleEditClick = (event) => {
    setEditingEvent(event);
    setEditTitle(event.title);
    setEditVenue(event.venue);
    setEditDate(event.date);
    setEditTime(event.time);
    setEditSeats(event.totalSeats || 100);
    setShowEditModal(true);
  };

  // Submit Edit form
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editTitle.trim() || !editVenue.trim() || !editDate || !editTime.trim()) {
      showToast('Please fill out all specifications.', 'error');
      return;
    }

    const response = await editEvent(editingEvent.id, {
      title: editTitle,
      venue: editVenue,
      date: editDate,
      time: editTime,
      totalSeats: parseInt(editSeats)
    });

    if (response.success) {
      showToast('Event specifications updated successfully!');
      setShowEditModal(false);
      setEditingEvent(null);
    } else {
      showToast(response.message || 'Failed to update event details.', 'error');
    }
  };

  // Filter registrations by category, search and filter selection
  const filteredRegs = registrations.filter(reg => {
    const matchesSearch = reg.studentName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          reg.eventTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          reg.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeRegFilter === 'all' ? true : reg.status === activeRegFilter;
    return matchesSearch && matchesFilter;
  });

  // Filter events by search query
  const filteredEvents = events.filter(evt => 
    evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    evt.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    evt.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sidebarTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'registrations', label: 'Registrations', icon: Users, badge: pendingCount },
    { id: 'events', label: 'My Events', icon: Calendar }
  ];

  return (
    <div className="relative min-h-screen flex bg-slate-50 text-slate-900 dark:bg-[#070913] dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* Glow backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />

      {/* Sidebar navigation */}
      <aside className="hidden lg:flex flex-col w-80 bg-white/70 dark:bg-[#0B0F23]/60 backdrop-blur-xl border-r border-slate-200/50 dark:border-white/5 h-screen fixed top-0 left-0 z-40 p-6 justify-between overflow-hidden">
        
        <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-none">
          {/* Logo Brand */}
          <div className="flex items-center space-x-3">
            <img
              src={auroraLogo}
              alt="Aurora Logo"
              className="w-14 h-14 object-contain transition-all duration-300 hover:scale-105"
            />
            <div className="text-left">
              <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-white uppercase leading-none">AURORA FEST</h2>
              <span className="text-[9px] tracking-[0.15em] font-extrabold text-purple-650 dark:text-purple-400 uppercase block mt-1.5">Volunteer Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 text-left">
            {sidebarTabs.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSearchQuery(''); }}
                  className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl text-[14px] font-black tracking-wider uppercase transition-all duration-300 group ${
                    isActive
                      ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 scale-[1.01]'
                      : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white'
                  }`}
                >
                  <Icon className={`h-5.5 w-5.5 transition-transform duration-300 group-hover:scale-105 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-purple-600'}`} />
                  <span>{item.label}</span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="ml-auto bg-orange-500 text-white text-xxs font-extrabold rounded-full px-2 py-0.5 flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/5 text-left mt-auto bg-transparent shrink-0">
          <div className="p-4 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-purple-200 dark:bg-purple-950/40 flex items-center justify-center text-sm font-extrabold text-purple-700 dark:text-purple-300 uppercase shrink-0">
              {userInitials}
            </div>
            <div className="overflow-hidden">
              <h3 className="text-xs font-black text-slate-800 dark:text-white truncate leading-tight">{currentUser.name}</h3>
              <span className="inline-block text-[9px] font-black uppercase text-purple-650 dark:text-purple-400 mt-1">Volunteer</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-3 px-5 rounded-2xl border border-indigo-200 dark:border-indigo-800/40 bg-indigo-50 dark:bg-indigo-950/10 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/20 text-[11px] font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Compass className="h-4 w-4" />
            <span>Student Dashboard</span>
          </button>

          <button
            onClick={toggleTheme}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all uppercase tracking-wide"
          >
            {isDark ? <Sun className="w-4 h-4 text-yellow-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            {isDark ? 'Light' : 'Dark'} Mode
          </button>

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs transition-all uppercase tracking-wide"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <div className="flex-1 flex flex-col min-h-screen lg:pl-80">
        
        {/* Sticky Header Bar */}
        <header className="sticky top-0 z-30 w-full bg-white/70 dark:bg-[#070913]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 py-4 px-6 sm:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center space-x-2.5 lg:hidden text-left">
            <img src={auroraLogo} alt="Aurora Logo" className="w-10 h-10 object-contain" />
            <h2 className="text-sm font-black tracking-tight text-slate-800 dark:text-white uppercase leading-none">AURORA</h2>
          </div>

          {/* Functional Search input */}
          <div className="relative max-w-md w-full hidden sm:block">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'registrations' ? 'by student name or email...' : 'events, blocks, or venues...'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-2.5 pl-11 rounded-2xl border border-slate-200 dark:border-white/5 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 bg-white"
            />
            <Compass className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          </div>

          <div className="flex items-center space-x-3.5 ml-auto">
            <div className="bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider">
              CSE Department
            </div>
          </div>
        </header>

        {/* Dashboard Workstations */}
        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-full mx-auto w-full px-4 sm:px-8 lg:px-12 relative z-10 text-left">
          
          {/* Mobile menu slider */}
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-3 mb-4 scrollbar-none">
            {sidebarTabs.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveTab(item.id); setSearchQuery(''); }}
                className={`px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
                  activeTab === item.id
                    ? 'bg-purple-600 text-white shadow-md'
                    : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            
            {/* 1. VIEW: Overview tab */}
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                <div className="glass-card rounded-[2.5rem] p-8 border border-slate-200/50 dark:border-white/5 bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-pink-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div>
                    <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                      <Sparkles className="h-3 w-3" />
                      <span>VOLUNTEER PORTAL ENGAGED</span>
                    </div>
                    <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-white">Welcome back, {currentUser.name}!</h1>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-2 leading-relaxed">
                      Manage pending event registrations, check statistics, and keep the campus events parameters fresh.
                    </p>
                  </div>
                </div>

                {/* Metrics boxes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Total Applied</span>
                      <h3 className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">{totalApplied}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-950/40">
                      <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>

                  <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Pending Review</span>
                      <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{pendingCount}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-950/40">
                      <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                    </div>
                  </div>

                  <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Approved Passes</span>
                      <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{approvedCount}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/40">
                      <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                    </div>
                  </div>

                  <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Declined</span>
                      <h3 className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">{rejectedCount}</h3>
                    </div>
                    <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-950/40">
                      <XCircle className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                    </div>
                  </div>
                </div>

                {/* Splitted panels */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Recent Registration Influx</h3>
                      <button onClick={() => setActiveTab('registrations')} className="text-xxs uppercase tracking-wider font-extrabold text-purple-650 dark:text-purple-400 hover:underline">Manage All</button>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs font-sans">
                        <thead>
                          <tr className="text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-800">
                            <th className="pb-3 pl-2">Student</th>
                            <th className="pb-3">Target Event</th>
                            <th className="pb-3 pr-2">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {registrations.slice(-3).reverse().map(reg => (
                            <tr key={reg.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                              <td className="py-4 pl-2 font-bold text-slate-800 dark:text-white">{reg.studentName}</td>
                              <td className="py-4 text-slate-600 dark:text-slate-400 font-semibold">{reg.eventTitle}</td>
                              <td className="py-4 pr-2">
                                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] border ${
                                  reg.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                  reg.status === 'rejected' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                  'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                }`}>
                                  {reg.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="lg:col-span-4 glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 flex flex-col justify-between space-y-4">
                    <div className="space-y-2">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Portal Shortcuts</h3>
                      <p className="text-xxs text-slate-400 leading-relaxed font-sans">Use the buttons below to switch active panel views instantly.</p>
                    </div>
                    <div className="space-y-2">
                      <button onClick={() => setActiveTab('registrations')} className="w-full py-3.5 rounded-xl text-xxs font-black uppercase tracking-wider text-white bg-purple-600 hover:bg-purple-750 transition-all shadow-md">Review Registrations</button>
                      <button onClick={() => setActiveTab('events')} className="w-full py-3.5 rounded-xl text-xxs font-black uppercase tracking-wider text-slate-700 dark:text-slate-350 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/5">Update Events Calendar</button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 2. VIEW: Registrations Review tab */}
            {activeTab === 'registrations' && (
              <motion.div
                key="registrations"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">Enrollment Review Dashboard</h2>
                    <p className="text-xs text-slate-400 mt-1">Approve or reject event entry registration passes.</p>
                  </div>
                  
                  {/* Status filter selection tabs */}
                  <div className="flex gap-1 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200/50 dark:border-white/5 self-start">
                    {['all', 'pending', 'approved', 'rejected'].map(filter => (
                      <button
                        key={filter}
                        onClick={() => setActiveRegFilter(filter)}
                        className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                          activeRegFilter === filter
                            ? 'bg-white dark:bg-slate-900 text-purple-650 dark:text-purple-400 shadow-sm border border-purple-500/20'
                            : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                        }`}
                      >
                        {filter}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-left text-xs font-sans">
                      <thead>
                        <tr className="text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-850">
                          <th className="pb-3 pl-2">Student Name</th>
                          <th className="pb-3">Email & Dept</th>
                          <th className="pb-3">Event Details</th>
                          <th className="pb-3">Applied</th>
                          <th className="pb-3">Status</th>
                          <th className="pb-3">Attendance</th>
                          <th className="pb-3">Certificate</th>
                          <th className="pb-3 pr-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredRegs.length === 0 ? (
                          <tr>
                            <td colSpan="8" className="py-12 text-center text-slate-400 font-bold">
                              <Inbox className="h-10 w-10 mx-auto opacity-40 mb-2" />
                              No applications found matching query
                            </td>
                          </tr>
                        ) : (
                          filteredRegs.map(reg => (
                            <tr key={reg.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                              <td className="py-4 pl-2 font-bold text-slate-800 dark:text-white">{reg.studentName}</td>
                              <td className="py-4">
                                <div className="font-semibold text-slate-700 dark:text-slate-300">{reg.email}</div>
                                <div className="text-[9px] text-purple-650 dark:text-purple-400 font-bold uppercase mt-0.5">{reg.department}</div>
                              </td>
                              <td className="py-4">
                                <div className="font-bold text-slate-800 dark:text-white">{reg.eventTitle}</div>
                                <div className="text-[9px] text-slate-400 font-mono mt-0.5">ID: {reg.eventId}</div>
                              </td>
                              <td className="py-4 text-slate-500 dark:text-slate-400 font-semibold">{reg.appliedAt}</td>
                              <td className="py-4">
                                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] border ${
                                  reg.status === 'approved' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                  reg.status === 'rejected' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                  'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                }`}>
                                  {reg.status}
                                </span>
                              </td>
                              <td className="py-4 font-sans">
                                {reg.status === 'approved' ? (
                                  <div className="flex gap-1">
                                    <button
                                      onClick={() => handleToggleAttendance(reg.id, 'Present')}
                                      className={`px-2 py-1 rounded text-[9px] font-bold uppercase cursor-pointer transition-all ${
                                        reg.attendance === 'Present'
                                          ? 'bg-emerald-500 text-white'
                                          : 'bg-slate-100 hover:bg-slate-250 dark:bg-white/5 dark:hover:bg-white/10 text-slate-750 dark:text-slate-300'
                                      }`}
                                    >
                                      Present
                                    </button>
                                    <button
                                      onClick={() => handleToggleAttendance(reg.id, 'Absent')}
                                      className={`px-2 py-1 rounded text-[9px] font-bold uppercase cursor-pointer transition-all ${
                                        reg.attendance === 'Absent'
                                          ? 'bg-rose-500 text-white'
                                          : 'bg-slate-100 hover:bg-slate-250 dark:bg-white/5 dark:hover:bg-white/10 text-slate-750 dark:text-slate-300'
                                      }`}
                                    >
                                      Absent
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-slate-455 dark:text-slate-500 italic">Not Approved</span>
                                )}
                              </td>
                              <td className="py-4">
                                {reg.status === 'approved' && reg.attendance === 'Present' ? (
                                  <Link
                                    to={`/certificate?certId=${reg.id}&name=${encodeURIComponent(reg.studentName)}&event=${encodeURIComponent(reg.eventTitle)}&type=Participation`}
                                    className="px-2 py-1 rounded text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 hover:bg-amber-500 hover:text-white transition-all cursor-pointer inline-block"
                                  >
                                    Download
                                  </Link>
                                ) : (
                                  <span className="text-[10px] text-slate-455 dark:text-slate-500 italic">Unavailable</span>
                                )}
                              </td>
                              <td className="py-4 pr-2 text-right">
                                {reg.status === 'pending' ? (
                                  <div className="flex justify-end gap-1.5">
                                    <button
                                      onClick={() => handleDeclineReg(reg.id)}
                                      className="px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all duration-200 cursor-pointer"
                                    >
                                      Decline
                                    </button>
                                    <button
                                      onClick={() => handleApproveReg(reg.id)}
                                      className="px-2.5 py-1.5 rounded-lg text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all duration-200 cursor-pointer"
                                    >
                                      Approve
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-[10px] text-slate-400 italic font-semibold">Processed</span>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </motion.div>
            )}

            {/* 3. VIEW: My Events tab */}
            {activeTab === 'events' && (
              <motion.div
                key="events"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Active Fest Program Calendar</h2>
                  <p className="text-xs text-slate-400 mt-1">Keep schedule date, venue, and seat allocations parameters up-to-date.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredEvents.map(evt => (
                    <div key={evt.id} className="glass-card rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-white/5 shadow-md flex flex-col justify-between hover:scale-[1.01] transition-transform">
                      <div>
                        <div className="relative h-48 w-full">
                          <img
                            src={evt.image}
                            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1514382357765-73c1b2375d7e?auto=format&fit=crop&w=800&q=80'; }}
                            className="w-full h-full object-cover"
                            alt={evt.title}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                          <span className="absolute top-4 left-4 text-[9px] font-black uppercase text-white bg-purple-650 border border-white/10 px-2 py-0.5 rounded">
                            {evt.category}
                          </span>
                          <div className="absolute bottom-4 left-4 text-left">
                            <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">{evt.type}</span>
                            <h4 className="text-sm font-black text-white line-clamp-1 mt-0.5">{evt.title}</h4>
                          </div>
                        </div>

                        <div className="p-5 text-left space-y-3 font-sans">
                          <p className="text-xxs text-slate-400 line-clamp-2 leading-relaxed">{evt.description}</p>
                          
                          <div className="space-y-1 pt-3 border-t border-slate-100 dark:border-slate-800 text-xxs text-slate-450 dark:text-slate-400">
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                              <span>{evt.date} • {evt.time || 'TBD'}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <MapPin className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                              <span className="truncate">{evt.venue}</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Users className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                              <span>Allocated capacity: <strong className="text-slate-700 dark:text-white">{evt.totalSeats || 100} seats</strong></span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5">
                        <button
                          onClick={() => handleEditClick(evt)}
                          className="w-full py-2.5 rounded-xl bg-purple-600/10 text-purple-600 dark:text-purple-400 hover:bg-purple-600 hover:text-white text-xxs font-black uppercase tracking-wider flex items-center justify-center space-x-1 transition-all"
                        >
                          <Edit className="h-3.5 w-3.5" />
                          <span>Edit Details</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </main>
      </div>

      {/* Edit specifications dialog popup */}
      <AnimatePresence>
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => { setShowEditModal(false); setEditingEvent(null); }}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0D0F22] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                <h3 className="text-base font-black uppercase text-slate-800 dark:text-white">Update Event Specifications</h3>
                <button
                  onClick={() => { setShowEditModal(false); setEditingEvent(null); }}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Event Title</label>
                  <input
                    type="text"
                    required
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Venue Location</label>
                  <input
                    type="text"
                    required
                    value={editVenue}
                    onChange={(e) => setEditVenue(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Date</label>
                    <input
                      type="date"
                      required
                      value={editDate}
                      onChange={(e) => setEditDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Time</label>
                    <input
                      type="text"
                      required
                      value={editTime}
                      onChange={(e) => setEditTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Maximum Seats</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={editSeats}
                    onChange={(e) => setEditSeats(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => { setShowEditModal(false); setEditingEvent(null); }}
                    className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase text-white bg-purple-650 hover:bg-purple-750 transition-all shadow-md shadow-purple-500/10"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating feedback alert */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg border text-xs font-bold uppercase tracking-wider flex items-center space-x-2 ${
              toast.type === 'error'
                ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
            }`}
          >
            <AlertCircle className="h-4 w-4" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VolunteerDashboard;
