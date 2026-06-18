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
    ShieldCheck,
    UserCheck,
    Search,
    RefreshCw,
    X,
    Edit
} from 'lucide-react';
import { EventApprovalPanel } from '../components/EventApprovalPanel';
import { ClubFormationWidget } from '../components/ClubFormationWidget';
import { AdminAssignmentForm } from '../components/AdminAssignmentForm';
import { AnalyticsDashboard } from '../components/AnalyticsDashboard';
import * as memberService from '../services/memberService';

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

    // Volunteer management state variables
    const [volunteers, setVolunteers] = useState([]);
    const [volunteerClubs, setVolunteerClubs] = useState([]);
    const [volLoading, setVolLoading] = useState(false);
    
    // Filters
    const [volSearch, setVolSearch] = useState('');
    const [volRoleFilter, setVolRoleFilter] = useState('all');
    const [volStatusFilter, setVolStatusFilter] = useState('all');
    const [volClubFilter, setVolClubFilter] = useState('all');

    // Add/Edit Modals
    const [showAddVolModal, setShowAddVolModal] = useState(false);
    const [showEditVolModal, setShowEditVolModal] = useState(false);
    const [editingVol, setEditingVol] = useState(null);
    const [volForm, setVolForm] = useState({
        name: '',
        email: '',
        mobile: '',
        department: 'Computer Science & Engineering',
        designation: 'Student Volunteer',
        employeeId: '',
        clubId: '',
        role: 'Volunteer',
        status: 'Active'
    });
    const [volError, setVolError] = useState('');
    const [volSuccessMsg, setVolSuccessMsg] = useState('');
    const [volSubmitting, setVolSubmitting] = useState(false);

    const loadVolunteersData = async () => {
        setVolLoading(true);
        try {
            const allMembers = await memberService.fetchMembers();
            // Filter only volunteers (Volunteer or Volunteer Lead)
            const vols = allMembers.filter(m => m.role === 'Volunteer' || m.role === 'Volunteer Lead');
            setVolunteers(vols);

            const clubList = await memberService.fetchClubs();
            setVolunteerClubs(clubList);
        } catch (err) {
            console.error('Error loading volunteers data:', err);
        } finally {
            setVolLoading(false);
        }
    };

    useEffect(() => {
        if (activeTab === 'volunteers') {
            loadVolunteersData();
        }
    }, [activeTab]);

    const handleAddVolunteerSubmit = async (e) => {
        e.preventDefault();
        setVolError('');
        setVolSuccessMsg('');
        
        if (!volForm.name || !volForm.email || !volForm.mobile || !volForm.clubId) {
            setVolError('Please fill in all required fields.');
            return;
        }

        setVolSubmitting(true);
        try {
            const response = await memberService.createMember({
                name: volForm.name,
                email: volForm.email.toLowerCase(),
                mobile: volForm.mobile,
                department: volForm.department,
                designation: volForm.designation,
                employeeId: volForm.employeeId,
                clubId: parseInt(volForm.clubId),
                role: volForm.role,
                status: volForm.status
            });

            if (response.success) {
                setVolSuccessMsg(response.message || 'Volunteer added successfully!');
                setTimeout(() => {
                    setShowAddVolModal(false);
                    setVolForm({
                        name: '',
                        email: '',
                        mobile: '',
                        department: 'Computer Science & Engineering',
                        designation: 'Student Volunteer',
                        employeeId: '',
                        clubId: '',
                        role: 'Volunteer',
                        status: 'Active'
                    });
                    setVolSuccessMsg('');
                    loadVolunteersData();
                }, 1500);
            } else {
                setVolError(response.message || 'Failed to add volunteer.');
            }
        } catch (err) {
            setVolError(err.response?.data?.message || 'Server error occurred.');
        } finally {
            setVolSubmitting(false);
        }
    };

    const handleEditVolClick = (vol) => {
        setEditingVol(vol);
        setVolForm({
            name: vol.name,
            email: vol.email,
            mobile: vol.mobile,
            department: vol.department,
            designation: vol.designation || 'Student Volunteer',
            employeeId: vol.employee_id || '',
            clubId: vol.club_id || '',
            role: vol.role,
            status: vol.status
        });
        setVolError('');
        setVolSuccessMsg('');
        setShowEditVolModal(true);
    };

    const handleEditVolunteerSubmit = async (e) => {
        e.preventDefault();
        setVolError('');
        setVolSuccessMsg('');

        if (!volForm.name || !volForm.email || !volForm.mobile || !volForm.clubId) {
            setVolError('Please fill in all required fields.');
            return;
        }

        setVolSubmitting(true);
        try {
            const response = await memberService.updateMember(editingVol.id, {
                name: volForm.name,
                email: volForm.email.toLowerCase(),
                mobile: volForm.mobile,
                department: volForm.department,
                designation: volForm.designation,
                employeeId: volForm.employeeId,
                clubId: parseInt(volForm.clubId),
                role: volForm.role,
                status: volForm.status
            });

            if (response.success) {
                setVolSuccessMsg('Volunteer details updated successfully!');
                setTimeout(() => {
                    setShowEditVolModal(false);
                    setEditingVol(null);
                    setVolSuccessMsg('');
                    loadVolunteersData();
                }, 1500);
            } else {
                setVolError(response.message || 'Failed to update volunteer.');
            }
        } catch (err) {
            setVolError(err.response?.data?.message || 'Server error occurred.');
        } finally {
            setVolSubmitting(false);
        }
    };

    const handleDeleteVolunteer = async (id, name) => {
        if (!window.confirm(`Are you sure you want to delete volunteer "${name}"? This will also delete their login credentials.`)) {
            return;
        }

        try {
            const response = await memberService.deleteMember(id);
            if (response.success) {
                alert('Volunteer deleted successfully.');
                loadVolunteersData();
            } else {
                alert(response.message || 'Failed to delete volunteer.');
            }
        } catch (err) {
            alert('Server error occurred during deletion.');
        }
    };

    const handleResetPassword = async (id, name) => {
        if (!window.confirm(`Are you sure you want to reset password for "${name}"? Temporary credentials will be sent to their email.`)) {
            return;
        }

        try {
            const response = await memberService.resetPassword(id);
            if (response.success) {
                alert(`Password reset successful for ${name}.\nUsername: ${response.generated.username}\nTemp Password: ${response.generated.tempPassword}\n\nCredentials logged to backend (sent_emails.log) and email.`);
                loadVolunteersData();
            } else {
                alert(response.message || 'Failed to reset password.');
            }
        } catch (err) {
            alert('Server error occurred during password reset.');
        }
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

    // Filter volunteers based on search query, role, status, and club
    const filteredVolunteers = volunteers.filter(vol => {
        const matchesSearch = volSearch === '' || 
            vol.name?.toLowerCase().includes(volSearch.toLowerCase()) ||
            vol.email?.toLowerCase().includes(volSearch.toLowerCase()) ||
            vol.employee_id?.toLowerCase().includes(volSearch.toLowerCase());
            
        const matchesRole = volRoleFilter === 'all' || vol.role === volRoleFilter;
        
        const matchesStatus = volStatusFilter === 'all' || vol.status === volStatusFilter;
        
        const matchesClub = volClubFilter === 'all' || String(vol.club_id) === String(volClubFilter);
        
        return matchesSearch && matchesRole && matchesStatus && matchesClub;
    });

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
        },
        {
            id: 'volunteers',
            label: 'Volunteers',
            icon: UserCheck,
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
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                            >
                                <motion.button
                                    onClick={() => setActiveTab('events')}
                                    className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-purple-200/30 dark:border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/50 dark:hover:border-purple-500/40 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all text-left group"
                                    whileHover={{ y: -2 }}
                                >
                                    <CheckCircle2 className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Event Approvals</h3>
                                    <p className="text-slate-605 dark:text-slate-400 text-sm">Review and approve pending events</p>
                                </motion.button>

                                <motion.button
                                    onClick={() => setActiveTab('clubs')}
                                    className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-purple-200/30 dark:border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/50 dark:hover:border-purple-500/40 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all text-left group"
                                    whileHover={{ y: -2 }}
                                >
                                    <Users className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Club Requests</h3>
                                    <p className="text-slate-605 dark:text-slate-400 text-sm">Manage club formation requests</p>
                                </motion.button>

                                <motion.button
                                    onClick={() => setActiveTab('assign')}
                                    className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-purple-200/30 dark:border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/50 dark:hover:border-purple-500/40 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all text-left group"
                                    whileHover={{ y: -2 }}
                                >
                                    <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Assign Club Heads</h3>
                                    <p className="text-slate-605 dark:text-slate-400 text-sm">Appoint admins as club leaders</p>
                                </motion.button>

                                <motion.button
                                    onClick={() => setActiveTab('volunteers')}
                                    className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-purple-200/30 dark:border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/50 dark:hover:border-purple-500/40 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all text-left group"
                                    whileHover={{ y: -2 }}
                                >
                                    <UserCheck className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Volunteer Management</h3>
                                    <p className="text-slate-605 dark:text-slate-400 text-sm">Add, edit, reset, or delete campus volunteers</p>
                                </motion.button>

                                <motion.button
                                    onClick={() => setActiveTab('announcements')}
                                    className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-purple-200/30 dark:border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/50 dark:hover:border-purple-500/40 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all text-left group"
                                    whileHover={{ y: -2 }}
                                >
                                    <Bell className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Announcements</h3>
                                    <p className="text-slate-605 dark:text-slate-400 text-sm">Publish broadcasts to users</p>
                                </motion.button>

                                <motion.button
                                    onClick={() => setActiveTab('analytics')}
                                    className="bg-white/50 dark:bg-white/5 backdrop-blur-sm border border-purple-200/30 dark:border-purple-500/20 rounded-2xl p-6 hover:border-purple-400/50 dark:hover:border-purple-500/40 hover:shadow-lg dark:hover:shadow-purple-500/10 transition-all text-left group"
                                    whileHover={{ y: -2 }}
                                >
                                    <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-2 group-hover:scale-110 transition-transform" />
                                    <h3 className="font-bold text-lg text-slate-900 dark:text-white mb-1">Analytics</h3>
                                    <p className="text-slate-650 dark:text-slate-400 text-sm">View detailed statistics & reports</p>
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

                    {/* Volunteer Management Tab */}
                    {activeTab === 'volunteers' && (
                        <motion.div
                            key="volunteers"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-6 text-left"
                        >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div>
                                    <h2 className="text-4xl font-black text-slate-900 dark:text-white mb-2">Volunteer Management</h2>
                                    <p className="text-slate-605 dark:text-slate-400">
                                        Configure roles, reset passwords, and approve volunteer designations for fests
                                    </p>
                                </div>
                                <button
                                    onClick={() => {
                                        setVolForm({
                                            name: '',
                                            email: '',
                                            mobile: '',
                                            department: 'Computer Science & Engineering',
                                            designation: 'Student Volunteer',
                                            employeeId: '',
                                            clubId: '',
                                            role: 'Volunteer',
                                            status: 'Active'
                                        });
                                        setVolError('');
                                        setVolSuccessMsg('');
                                        setShowAddVolModal(true);
                                    }}
                                    className="px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white font-extrabold uppercase text-xs tracking-wider flex items-center gap-1.5 transition-all shadow-md cursor-pointer"
                                >
                                    <Plus className="w-4 h-4" />
                                    <span>Add New Volunteer</span>
                                </button>
                            </div>

                            {/* Statistics Cards */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                                <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/30 dark:border-purple-500/20 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-550 dark:text-slate-400 text-xs font-black uppercase tracking-wider">Total Volunteers</p>
                                            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">{volunteers.length}</p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-950/40">
                                            <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/30 dark:border-purple-500/20 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-550 dark:text-slate-400 text-xs font-black uppercase tracking-wider">Volunteer Leads</p>
                                            <p className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">
                                                {volunteers.filter(v => v.role === 'Volunteer Lead').length}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-950/40">
                                            <UserCheck className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/30 dark:border-purple-500/20 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-550 dark:text-slate-400 text-xs font-black uppercase tracking-wider">Active Status</p>
                                            <p className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">
                                                {volunteers.filter(v => v.status === 'Active').length}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/40">
                                            <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-purple-200/30 dark:border-purple-500/20 shadow-sm">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-slate-550 dark:text-slate-400 text-xs font-black uppercase tracking-wider">Inactive Status</p>
                                            <p className="text-3xl font-black text-rose-600 dark:text-rose-400 mt-1">
                                                {volunteers.filter(v => v.status === 'Inactive').length}
                                            </p>
                                        </div>
                                        <div className="p-3 rounded-lg bg-rose-100 dark:bg-rose-950/40">
                                            <Clock className="w-6 h-6 text-rose-600 dark:text-rose-400" />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Search and Filters */}
                            <div className="glass-card rounded-[2rem] p-5 border border-purple-200/30 dark:border-purple-500/20 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
                                <div className="relative w-full md:max-w-xs">
                                    <input
                                        type="text"
                                        placeholder="Search by name, email, roll ID..."
                                        value={volSearch}
                                        onChange={(e) => setVolSearch(e.target.value)}
                                        className="w-full px-4 py-2.5 pl-10 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                    />
                                    <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                                </div>

                                <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                                    {/* Role filter */}
                                    <select
                                        value={volRoleFilter}
                                        onChange={(e) => setVolRoleFilter(e.target.value)}
                                        className="px-3 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                                    >
                                        <option value="all">All Roles</option>
                                        <option value="Volunteer">Volunteer</option>
                                        <option value="Volunteer Lead">Volunteer Lead</option>
                                    </select>

                                    {/* Status filter */}
                                    <select
                                        value={volStatusFilter}
                                        onChange={(e) => setVolStatusFilter(e.target.value)}
                                        className="px-3 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white"
                                    >
                                        <option value="all">All Statuses</option>
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                    </select>

                                    {/* Club filter */}
                                    <select
                                        value={volClubFilter}
                                        onChange={(e) => setVolClubFilter(e.target.value)}
                                        className="px-3 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-white max-w-[150px]"
                                    >
                                        <option value="all">All Clubs</option>
                                        {volunteerClubs.map(c => (
                                            <option key={c.id} value={c.id}>{c.club_name}</option>
                                        ))}
                                    </select>

                                    <button
                                        onClick={loadVolunteersData}
                                        className="p-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-700 dark:text-slate-300 transition-all cursor-pointer flex items-center justify-center border border-slate-250 dark:border-white/5"
                                        title="Refresh List"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>

                            {/* Volunteer Table */}
                            <div className="glass-card rounded-[2.5rem] p-6 border border-purple-200/30 dark:border-purple-500/20 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl overflow-hidden">
                                {volLoading ? (
                                    <div className="py-20 text-center">
                                        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                                        <p className="text-xs text-slate-400 font-bold mt-4 uppercase tracking-wider">Synchronizing volunteer database...</p>
                                    </div>
                                ) : filteredVolunteers.length === 0 ? (
                                    <div className="py-20 text-center space-y-3">
                                        <Users className="w-12 h-12 text-slate-400 mx-auto opacity-70" />
                                        <h4 className="text-base font-bold text-slate-850 dark:text-white">No volunteers found</h4>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-sans max-w-xs mx-auto">
                                            There are no volunteers listed. Click "Add New Volunteer" to construct details.
                                        </p>
                                    </div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full border-collapse text-left text-xs font-sans">
                                            <thead>
                                                <tr className="text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-850">
                                                    <th className="pb-3 pl-2">Volunteer</th>
                                                    <th className="pb-3">Contact</th>
                                                    <th className="pb-3">Club & Dept</th>
                                                    <th className="pb-3">Designation</th>
                                                    <th className="pb-3">Role</th>
                                                    <th className="pb-3">Status</th>
                                                    <th className="pb-3 pr-2 text-right">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {filteredVolunteers.map(vol => {
                                                    const initials = vol.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'V';
                                                    return (
                                                        <tr key={vol.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                                                            <td className="py-4 pl-2">
                                                                <div className="flex items-center space-x-3">
                                                                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold text-xxs uppercase">
                                                                        {initials}
                                                                    </div>
                                                                    <div>
                                                                        <div className="font-bold text-slate-850 dark:text-white">{vol.name}</div>
                                                                        <div className="text-[10px] text-slate-400 font-mono mt-0.5">ID: {vol.employee_id || 'N/A'}</div>
                                                                    </div>
                                                                </div>
                                                            </td>
                                                            <td className="py-4">
                                                                <div className="font-semibold text-slate-700 dark:text-slate-300">{vol.email}</div>
                                                                <div className="text-[10px] text-slate-400 mt-0.5">{vol.mobile}</div>
                                                            </td>
                                                            <td className="py-4">
                                                                <div className="font-bold text-slate-800 dark:text-white">{vol.club_name || 'General'}</div>
                                                                <div className="text-[9px] text-purple-650 dark:text-purple-400 font-bold uppercase mt-0.5">{vol.department}</div>
                                                            </td>
                                                            <td className="py-4 font-semibold text-slate-600 dark:text-slate-400">{vol.designation || 'Student Volunteer'}</td>
                                                            <td className="py-4">
                                                                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] border ${
                                                                    vol.role === 'Volunteer Lead'
                                                                        ? 'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                                                        : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
                                                                }`}>
                                                                    {vol.role}
                                                                </span>
                                                            </td>
                                                            <td className="py-4">
                                                                <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] border ${
                                                                    vol.status === 'Active'
                                                                        ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                                                                        : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                                                }`}>
                                                                    {vol.status}
                                                                </span>
                                                            </td>
                                                            <td className="py-4 pr-2 text-right">
                                                                <div className="flex justify-end items-center gap-1.5 font-sans">
                                                                    <button
                                                                        onClick={() => handleResetPassword(vol.id, vol.name)}
                                                                        className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-650 dark:text-slate-350 text-[9px] font-black uppercase transition-all cursor-pointer"
                                                                        title="Reset Password"
                                                                    >
                                                                        Reset Pass
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEditVolClick(vol)}
                                                                        className="p-1.5 rounded-lg text-purple-650 bg-purple-500/10 hover:bg-purple-600 hover:text-white transition-all cursor-pointer"
                                                                        title="Edit Details"
                                                                    >
                                                                        <Edit className="w-3.5 h-3.5" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleDeleteVolunteer(vol.id, vol.name)}
                                                                        className="p-1.5 rounded-lg text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                                                                        title="Delete Volunteer"
                                                                    >
                                                                        <Trash2 className="w-3.5 h-3.5" />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}

                    /* Removed Settings block */
                </AnimatePresence>

                {/* Add Volunteer Modal */}
                <AnimatePresence>
                    {showAddVolModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setShowAddVolModal(false)}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative w-full max-w-md bg-white dark:bg-[#0D0F22] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-left font-sans"
                            >
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                                    <h3 className="text-base font-black uppercase text-slate-800 dark:text-white">Add New Volunteer</h3>
                                    <button
                                        onClick={() => setShowAddVolModal(false)}
                                        className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {volError && (
                                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs font-semibold mb-4">
                                        {volError}
                                    </div>
                                )}

                                {volSuccessMsg && (
                                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 text-xs font-semibold mb-4">
                                        {volSuccessMsg}
                                    </div>
                                )}

                                <form onSubmit={handleAddVolunteerSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={volForm.name}
                                                onChange={(e) => setVolForm({ ...volForm, name: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Roll No / ID</label>
                                            <input
                                                type="text"
                                                value={volForm.employeeId}
                                                onChange={(e) => setVolForm({ ...volForm, employeeId: e.target.value })}
                                                placeholder="e.g. AUR2026CSE045"
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">College Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={volForm.email}
                                                onChange={(e) => setVolForm({ ...volForm, email: e.target.value })}
                                                placeholder="must end with @aurora.edu.in"
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mobile No</label>
                                            <input
                                                type="text"
                                                required
                                                value={volForm.mobile}
                                                onChange={(e) => setVolForm({ ...volForm, mobile: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</label>
                                            <select
                                                value={volForm.department}
                                                onChange={(e) => setVolForm({ ...volForm, department: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white font-semibold"
                                            >
                                                <option value="Computer Science & Engineering">CSE</option>
                                                <option value="Electronics & Communication">ECE</option>
                                                <option value="Information Technology">IT</option>
                                                <option value="Mechanical Engineering">Mech</option>
                                                <option value="Electrical & Electronics">EEE</option>
                                                <option value="Business Administration (MBA)">MBA</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Designation</label>
                                            <input
                                                type="text"
                                                value={volForm.designation}
                                                onChange={(e) => setVolForm({ ...volForm, designation: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Club</label>
                                            <select
                                                required
                                                value={volForm.clubId}
                                                onChange={(e) => setVolForm({ ...volForm, clubId: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white font-semibold"
                                            >
                                                <option value="">-- Choose Club --</option>
                                                {volunteerClubs.map(c => (
                                                    <option key={c.id} value={c.id}>{c.club_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Role</label>
                                            <select
                                                value={volForm.role}
                                                onChange={(e) => setVolForm({ ...volForm, role: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white font-semibold"
                                            >
                                                <option value="Volunteer">Volunteer</option>
                                                <option value="Volunteer Lead">Volunteer Lead</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
                                            <select
                                                value={volForm.status}
                                                onChange={(e) => setVolForm({ ...volForm, status: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white font-semibold"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setShowAddVolModal(false)}
                                            className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={volSubmitting}
                                            className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase text-white bg-purple-650 hover:bg-purple-750 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            {volSubmitting ? (
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Plus className="w-3.5 h-3.5" />
                                                    <span>Add Volunteer</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                {/* Edit Volunteer Modal */}
                <AnimatePresence>
                    {showEditVolModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => { setShowEditVolModal(false); setEditingVol(null); }}
                                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            />
                            
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="relative w-full max-w-md bg-white dark:bg-[#0D0F22] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-left font-sans"
                            >
                                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                                    <h3 className="text-base font-black uppercase text-slate-800 dark:text-white">Edit Volunteer Details</h3>
                                    <button
                                        onClick={() => { setShowEditVolModal(false); setEditingVol(null); }}
                                        className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                                    >
                                        <X className="h-5 w-5" />
                                    </button>
                                </div>

                                {volError && (
                                    <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/25 text-rose-500 text-xs font-semibold mb-4">
                                        {volError}
                                    </div>
                                )}

                                {volSuccessMsg && (
                                    <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-500 text-xs font-semibold mb-4">
                                        {volSuccessMsg}
                                    </div>
                                )}

                                <form onSubmit={handleEditVolunteerSubmit} className="space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Full Name</label>
                                            <input
                                                type="text"
                                                required
                                                value={volForm.name}
                                                onChange={(e) => setVolForm({ ...volForm, name: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Roll No / ID</label>
                                            <input
                                                type="text"
                                                value={volForm.employeeId}
                                                onChange={(e) => setVolForm({ ...volForm, employeeId: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">College Email</label>
                                            <input
                                                type="email"
                                                required
                                                value={volForm.email}
                                                onChange={(e) => setVolForm({ ...volForm, email: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Mobile No</label>
                                            <input
                                                type="text"
                                                required
                                                value={volForm.mobile}
                                                onChange={(e) => setVolForm({ ...volForm, mobile: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</label>
                                            <select
                                                value={volForm.department}
                                                onChange={(e) => setVolForm({ ...volForm, department: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white font-semibold"
                                            >
                                                <option value="Computer Science & Engineering">CSE</option>
                                                <option value="Electronics & Communication">ECE</option>
                                                <option value="Information Technology">IT</option>
                                                <option value="Mechanical Engineering">Mech</option>
                                                <option value="Electrical & Electronics">EEE</option>
                                                <option value="Business Administration (MBA)">MBA</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Designation</label>
                                            <input
                                                type="text"
                                                value={volForm.designation}
                                                onChange={(e) => setVolForm({ ...volForm, designation: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Assigned Club</label>
                                            <select
                                                required
                                                value={volForm.clubId}
                                                onChange={(e) => setVolForm({ ...volForm, clubId: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white font-semibold"
                                            >
                                                <option value="">-- Choose Club --</option>
                                                {volunteerClubs.map(c => (
                                                    <option key={c.id} value={c.id}>{c.club_name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Role</label>
                                            <select
                                                value={volForm.role}
                                                onChange={(e) => setVolForm({ ...volForm, role: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white font-semibold"
                                            >
                                                <option value="Volunteer">Volunteer</option>
                                                <option value="Volunteer Lead">Volunteer Lead</option>
                                            </select>
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Status</label>
                                            <select
                                                value={volForm.status}
                                                onChange={(e) => setVolForm({ ...volForm, status: e.target.value })}
                                                className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white font-semibold"
                                            >
                                                <option value="Active">Active</option>
                                                <option value="Inactive">Inactive</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="flex justify-end gap-2 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => { setShowEditVolModal(false); setEditingVol(null); }}
                                            className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            disabled={volSubmitting}
                                            className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase text-white bg-purple-650 hover:bg-purple-750 transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            {volSubmitting ? (
                                                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Save className="w-3.5 h-3.5" />
                                                    <span>Save Changes</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </main>
        </div>
    );
};
