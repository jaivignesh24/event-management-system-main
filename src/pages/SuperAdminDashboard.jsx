import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useClub } from '../context/ClubContext';
import { useTheme } from '../context/ThemeContext';
import auroraLogo from './auroranew.png';
import {
    LogOut,
    LayoutDashboard,
    CheckCircle2,
    Users,
    BarChart3,
    Zap,
    Bell,
    Plus,
    Clock,
    Settings,
    Moon,
    Sun,
    Megaphone,
    Trash2,
    Save,
    ShieldCheck
} from 'lucide-react';
import { EventApprovalPanel } from '../components/EventApprovalPanel';
import { ClubFormationWidget } from '../components/ClubFormationWidget';
import { AdminAssignmentForm } from '../components/AdminAssignmentForm';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';

export const SuperAdminDashboard = () => {
    const { currentUser, logout } = useAuth();
    const { isDark, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { getClubStats } = useClub();

    const [activeTab, setActiveTab] = useState('overview');

    // Announcements State
    const [announcements, setAnnouncements] = useState(() => {
        const saved = localStorage.getItem('aurora_announcements');
        if (saved) return JSON.parse(saved);
        return [
            { id: 1, title: 'Registrations Open for Acoustics Battle of Bands', date: '2026-06-15', author: 'System Authority', category: 'Event Update', target: 'All' },
            { id: 2, title: 'Barricade and Entry QR scan guidelines published', date: '2026-06-14', author: 'System Authority', category: 'General', target: 'Students Only' }
        ];
    });
    const [announceTitle, setAnnounceTitle] = useState('');
    const [announceCategory, setAnnounceCategory] = useState('General');
    const [announceTarget, setAnnounceTarget] = useState('All');
    const [announceStartDate, setAnnounceStartDate] = useState(new Date().toISOString().split('T')[0]);
    const [announceEndDate, setAnnounceEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

    // Settings State
    const [settings, setSettings] = useState(() => {
        const saved = localStorage.getItem('aurora_settings');
        if (saved) return JSON.parse(saved);
        return {
            sysName: 'Aura 2026 Fest Portal',
            sysYear: '2026',
            maxRegs: '5',
            maintenanceMode: false,
            allowSignups: true
        };
    });

    const handleAddAnnouncement = (e) => {
        e.preventDefault();
        if (!announceTitle.trim()) return;

        const newAnn = {
            id: Date.now(),
            title: announceTitle,
            date: new Date().toISOString().split('T')[0],
            author: currentUser?.name || 'Super Admin',
            category: announceCategory,
            target: announceTarget,
            startDate: announceStartDate,
            endDate: announceEndDate
        };

        const updated = [newAnn, ...announcements];
        setAnnouncements(updated);
        localStorage.setItem('aurora_announcements', JSON.stringify(updated));
        setAnnounceTitle('');
        setAnnounceStartDate(new Date().toISOString().split('T')[0]);
        setAnnounceEndDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    };

    const handleDeleteAnnouncement = (id) => {
        const updated = announcements.filter(ann => ann.id !== id);
        setAnnouncements(updated);
        localStorage.setItem('aurora_announcements', JSON.stringify(updated));
    };

    const handleSaveSettings = (e) => {
        e.preventDefault();
        localStorage.setItem('aurora_settings', JSON.stringify(settings));
        alert('Settings saved successfully!');
    };

    // Route guard
    useEffect(() => {
        if (!currentUser || currentUser.role !== 'superadmin') {
            navigate('/login');
        }
    }, [currentUser, navigate]);

    if (!currentUser || currentUser.role !== 'superadmin') {
        return null;
    }

    const stats = getClubStats();
    const userInitials = currentUser.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'SA';

    const navItems = [
        {
            id: 'overview',
            label: 'Overview',
            icon: LayoutDashboard,
            badge: null
        },
        {
            id: 'events',
            label: 'Manage Events',
            icon: CheckCircle2,
            badge: 2
        },
        {
            id: 'clubs',
            label: 'Club Approvals',
            icon: ShieldCheck,
            badge: stats.pendingRequests
        },
        {
            id: 'analytics',
            label: 'Analytics',
            icon: BarChart3,
            badge: null
        },
        {
            id: 'assign',
            label: 'Assign Heads',
            icon: Users,
            badge: null
        },
        {
            id: 'announcements',
            label: 'Announcements',
            icon: Bell,
            badge: null
        }
    ];

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const StatBox = ({ icon: Icon, label, value }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/30 dark:border-purple-500/20 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all"
        >
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm font-medium">{label}</p>
                    <p className="text-3xl font-bold text-slate-900 dark:text-white mt-2">{value}</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-950/40">
                    <Icon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
            </div>
        </motion.div>
    );

    return (
        <div className="relative min-h-screen flex bg-slate-50 dark:bg-[#070913] text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans">

            {/* Background elegant glows */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />

            {/* Large Left Sidebar */}
            <motion.aside className="hidden lg:flex flex-col w-80 bg-white/70 dark:bg-[#0B0F23]/60 backdrop-blur-xl border-r border-slate-200/50 dark:border-white/5 h-screen fixed top-0 left-0 z-40 p-6 justify-between overflow-hidden">

                {/* Scrollable Top Sidebar Content */}
                <div className="flex-1 overflow-y-auto pr-1 space-y-6 scrollbar-none">

                    {/* Logo & Console Brand */}
                    <div className="flex items-center space-x-3">
                        <img
                            src={auroraLogo}
                            alt="Aurora Logo"
                            className="w-14 h-14 object-contain transition-all duration-300 hover:scale-105"
                        />
                        <div>
                            <h2 className="text-lg font-black tracking-tight text-slate-800 dark:text-white uppercase leading-none">AURORA FEST</h2>
                            <span className="text-[9px] tracking-[0.15em] font-extrabold text-purple-600 dark:text-purple-400 uppercase block mt-1.5">Super Admin Portal</span>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <nav className="space-y-2 text-left">
                        {navItems.map(item => {
                            const Icon = item.icon;
                            const isActive = activeTab === item.id;
                            return (
                                <motion.button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id)}
                                    className={`w-full flex items-center space-x-4 px-5 py-3.5 rounded-2xl text-[14px] font-black tracking-wider uppercase transition-all duration-300 group ${isActive
                                        ? 'bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 scale-[1.01]'
                                        : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white'
                                        }`}
                                    whileHover={{ x: 2 }}
                                >
                                    <Icon className={`h-5.5 w-5.5 transition-transform duration-300 group-hover:scale-105 ${isActive ? 'text-purple-600 dark:text-purple-400' : 'text-slate-400 dark:text-slate-500 group-hover:text-purple-600'}`} />
                                    <span>{item.label}</span>
                                    {item.badge && item.badge > 0 && (
                                        <span className="ml-auto bg-orange-400 dark:bg-orange-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center flex-shrink-0">
                                            {item.badge}
                                        </span>
                                    )}
                                </motion.button>
                            );
                        })}
                    </nav>
                </div>

                {/* Anchored Bottom Sidebar Content */}
                <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/5 text-left mt-auto bg-transparent shrink-0">

                    {/* Admin Profile Embedded */}
                    <div className="bg-slate-100 dark:bg-white/5 rounded-2xl p-4 space-y-2 text-center">
                        <div className="w-12 h-12 rounded-full bg-purple-200 dark:bg-purple-950/40 flex items-center justify-center mx-auto">
                            <span className="font-black text-purple-700 dark:text-purple-300 text-sm">{userInitials}</span>
                        </div>
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white text-sm">{currentUser.name}</p>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 uppercase tracking-widest font-semibold">Super Admin</p>
                        </div>
                    </div>

                    {/* Bottom Action Buttons */}
                    <button
                        onClick={toggleTheme}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-100 dark:bg-white/10 hover:bg-slate-200 dark:hover:bg-white/20 text-slate-700 dark:text-slate-300 font-bold text-xs transition-all uppercase tracking-wide"
                    >
                        {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        {isDark ? 'Light' : 'Dark'} Mode
                    </button>

                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 font-bold text-xs transition-all uppercase tracking-wide"
                    >
                        <LogOut className="w-4 h-4" />
                        Logout
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="ml-80 flex-1 p-8 overflow-y-auto">
                <AnimatePresence mode="wait">
                    {/* Overview Tab */}
                    {activeTab === 'overview' && (
                        <motion.div
                            key="overview"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6"
                        >
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Welcome, {currentUser.name}</h2>
                                <p className="text-slate-600 dark:text-slate-400">
                                    Manage events, clubs, and assignments across the entire system
                                </p>
                            </div>

                            {/* Key Metrics */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                <StatBox
                                    icon={Users}
                                    label="Total Clubs"
                                    value={stats.totalClubs}
                                />
                                <StatBox
                                    icon={CheckCircle2}
                                    label="Active Clubs"
                                    value={stats.activeClubs}
                                />
                                <StatBox
                                    icon={Users}
                                    label="Total Members"
                                    value={stats.totalMembers}
                                />
                                <StatBox
                                    icon={Zap}
                                    label="Pending Approvals"
                                    value={stats.pendingRequests}
                                />
                            </div>

                            {/* Quick Actions */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="grid grid-cols-1 md:grid-cols-2 gap-4"
                            >
                                <motion.button
                                    onClick={() => setActiveTab('events')}
                                    className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-purple-200/30 dark:border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/50 dark:hover:border-purple-500/40 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all text-left group"
                                    whileHover={{ y: -2 }}
                                >
                                    <CheckCircle2 className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Event Approvals</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">Review and approve pending events</p>
                                </motion.button>

                                <motion.button
                                    onClick={() => setActiveTab('clubs')}
                                    className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-purple-200/30 dark:border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/50 dark:hover:border-purple-500/40 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all text-left group"
                                    whileHover={{ y: -2 }}
                                >
                                    <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Club Requests</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">Manage club formation requests</p>
                                </motion.button>

                                <motion.button
                                    onClick={() => setActiveTab('assign')}
                                    className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-purple-200/30 dark:border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/50 dark:hover:border-purple-500/40 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all text-left group"
                                    whileHover={{ y: -2 }}
                                >
                                    <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Assign Club Heads</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">Appoint admins as club leaders</p>
                                </motion.button>

                                <motion.button
                                    onClick={() => setActiveTab('analytics')}
                                    className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-purple-200/30 dark:border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/50 dark:hover:border-purple-500/40 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all text-left group"
                                    whileHover={{ y: -2 }}
                                >
                                    <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Analytics</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">View detailed statistics & reports</p>
                                </motion.button>
                            </motion.div>
                        </motion.div>
                    )}

                    {/* Event Approval Tab */}
                    {activeTab === 'events' && (
                        <motion.div
                            key="events"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Event Approvals</h2>
                            <EventApprovalPanel />
                        </motion.div>
                    )}

                    {/* Club Requests Tab */}
                    {activeTab === 'clubs' && (
                        <motion.div
                            key="clubs"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Club Formation Requests</h2>
                            <ClubFormationWidget />
                        </motion.div>
                    )}

                    {/* Assign Club Heads Tab */}
                    {activeTab === 'assign' && (
                        <motion.div
                            key="assign"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Assign Club Heads</h2>
                            <AdminAssignmentForm />
                        </motion.div>
                    )}

                    {/* Analytics Tab */}
                    {activeTab === 'analytics' && (
                        <motion.div
                            key="analytics"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-6">Analytics & Reports</h2>
                            <AnalyticsDashboard />
                        </motion.div>
                    )}

                    {/* Announcements Tab */}
                    {activeTab === 'announcements' && (
                        <motion.div
                            key="announcements"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6 text-left"
                        >
                            <div>
                                <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Broadcast Announcements</h2>
                                <p className="text-slate-650 dark:text-slate-400">
                                    Publish bulletins and alerts that target specific campus user groups
                                </p>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                                {/* Create Announcement Form (5 Columns) */}
                                <div className="lg:col-span-5 glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 space-y-5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl">
                                    <h3 className="text-lg font-black uppercase text-slate-800 dark:text-white tracking-wider flex items-center gap-2">
                                        <Megaphone className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                                        <span>New Broadcast</span>
                                    </h3>

                                    <form onSubmit={handleAddAnnouncement} className="space-y-4">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Announcement Message</label>
                                            <textarea
                                                required
                                                rows="4"
                                                value={announceTitle}
                                                onChange={(e) => setAnnounceTitle(e.target.value)}
                                                placeholder="e.g., Team allocations for the Hackathon are now live in the student profiles. Check registrations."
                                                className="w-full px-4 py-3 rounded-2xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                                            />
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Category</label>
                                            <select
                                                value={announceCategory}
                                                onChange={(e) => setAnnounceCategory(e.target.value)}
                                                className="w-full px-4 py-3 rounded-2xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                                            >
                                                <option value="General">General Info</option>
                                                <option value="Event Update">Event Update</option>
                                                <option value="Urgent Alert">Urgent Alert</option>
                                            </select>
                                        </div>

                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Target Audience</label>
                                            <select
                                                value={announceTarget}
                                                onChange={(e) => setAnnounceTarget(e.target.value)}
                                                className="w-full px-4 py-3 rounded-2xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                                            >
                                                <option value="All">All Portal Users</option>
                                                <option value="Students Only">Students Only</option>
                                                <option value="Faculty Only">Faculty/Admins Only</option>
                                            </select>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Start Date</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={announceStartDate}
                                                    onChange={(e) => setAnnounceStartDate(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-2xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                                                />
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">End Date</label>
                                                <input
                                                    type="date"
                                                    required
                                                    value={announceEndDate}
                                                    onChange={(e) => setAnnounceEndDate(e.target.value)}
                                                    className="w-full px-4 py-3 rounded-2xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                                                />
                                            </div>
                                        </div>

                                        <button
                                            type="submit"
                                            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white font-extrabold uppercase rounded-2xl transition-all text-xs tracking-wider flex items-center justify-center cursor-pointer shadow-md"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            <span>Publish Bulletin</span>
                                        </button>
                                    </form>
                                </div>

                                {/* Active Announcements Stream (7 Columns) */}
                                <div className="lg:col-span-7 space-y-4">
                                    <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                                        Active Stream ({announcements.length})
                                    </h3>

                                    {announcements.length === 0 ? (
                                        <div className="p-12 text-center rounded-[2.5rem] bg-white/40 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 space-y-3">
                                            <Bell className="h-12 w-12 text-slate-400 mx-auto opacity-70" />
                                            <h4 className="text-base font-bold text-slate-850 dark:text-white">No active bulletins</h4>
                                            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans max-w-sm mx-auto">
                                                Compose an announcement to notify students and faculty about important schedules.
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {announcements.map((ann) => (
                                                <div
                                                    key={ann.id}
                                                    className="glass-card rounded-[2rem] p-5 border border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl flex justify-between items-start gap-4"
                                                >
                                                    <div className="space-y-2">
                                                        <div className="flex flex-wrap items-center gap-2">
                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                                                                ann.category === 'Urgent Alert'
                                                                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                                                    : ann.category === 'Event Update'
                                                                    ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                                                    : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
                                                            }`}>
                                                                {ann.category}
                                                            </span>
                                                            <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-100 dark:bg-white/5 text-slate-550 dark:text-slate-400 border border-slate-200/50 dark:border-white/5">
                                                                To: {ann.target}
                                                            </span>
                                                        </div>
                                                        <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-sans leading-relaxed">{ann.title}</p>
                                                        <span className="text-[10px] text-slate-455 dark:text-slate-500 block">
                                                            Published: {ann.date} • By: {ann.author}
                                                        </span>
                                                        {ann.startDate && ann.endDate && (
                                                            <span className="text-[10px] text-purple-650 dark:text-purple-400 font-bold block">
                                                                Active Period: {ann.startDate} to {ann.endDate}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <button
                                                        onClick={() => handleDeleteAnnouncement(ann.id)}
                                                        className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all duration-300 cursor-pointer shrink-0"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}

                    /* Removed Settings block */
                </AnimatePresence>
            </main>
        </div>
    );
};
