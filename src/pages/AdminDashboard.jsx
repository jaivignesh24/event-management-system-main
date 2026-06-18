import React, { useState, useEffect } from 'react';
import { sendCertificateEmail } from '../services/emailService';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import auroraLogo from './auroranew.png';
import {
  LayoutDashboard,
  Plus,
  Edit,
  Trash2,
  Calendar,
  MapPin,
  Users,
  Award,
  ShieldAlert,
  Sparkles,
  Megaphone,
  UploadCloud,
  BarChart3,
  Settings,
  X,
  Bell,
  UserCheck,
  Moon,
  Sun,
  Search,
  LogOut,
  FileText,
  CheckCircle2,
  ChevronRight,
  Download,
  Printer,
  Compass,
  Mail
} from 'lucide-react';

export const AdminDashboard = () => {
  const { currentUser, logout } = useAuth();
  const { events, registrations, addEvent, editEvent, deleteEvent } = useEvents();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const allowedRoles = ['admin', 'club_head', 'club_coordinator', 'faculty_coordinator', 'volunteer_lead'];

  // Route safety guard
  useEffect(() => {
    if (!currentUser || !allowedRoles.includes(currentUser.role)) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  if (!currentUser || !allowedRoles.includes(currentUser.role)) {
    return null;
  }

  // Console active tab state
  const [activeTab, setActiveTab] = useState('overview');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');

  // Notifications State
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'registration', text: 'Rohit Kumar registered for Aurora Hackathon 2026', time: '10 mins ago', read: false },
    { id: 2, type: 'club', text: 'Rohan Mehta requested "AI & Robotics Club" affiliation', time: '1 hr ago', read: false },
    { id: 3, type: 'announcement', text: 'Dr. Vivek Saini broadcasted "Entry QR guidelines"', time: '3 hrs ago', read: true },
    { id: 4, type: 'student', text: 'Aman Varma enrolled in CSE Department', time: '5 hrs ago', read: true }
  ]);

  // Modal controls
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingEventId, setEditingEventId] = useState(null);

  // Form Fields for Event
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Technical');
  const [type, setType] = useState('Hackathon');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [venue, setVenue] = useState('');
  const [coordinator, setCoordinator] = useState('');
  const [studentCoordinator, setStudentCoordinator] = useState('');
  const [price, setPrice] = useState('Free');
  const [image, setImage] = useState('');
  const [tagsInput, setTagsInput] = useState('');

  // 1. Student Records (Synced with localStorage users)
  const [students, setStudents] = useState(() => {
    const savedUsers = localStorage.getItem('users');
    if (savedUsers) {
      const parsed = JSON.parse(savedUsers);
      const studentUsers = parsed.filter(u => u.role === 'student' && u.email !== 'student@aurora.edu.in' && u.email !== 'aman@aurora.edu.in' && u.email !== 'neha@aurora.edu.in');
      return studentUsers;
    }
    return [];
  });
  const [newStudentName, setNewStudentName] = useState('');
  const [newStudentEmail, setNewStudentEmail] = useState('');
  const [newStudentDept, setNewStudentDept] = useState('Computer Science & Engineering');

  // 2. Mock Club Requests
  const [clubRequests, setClubRequests] = useState([
    { id: 1, studentName: 'Rohan Mehta', clubName: 'AI & Robotics Club', purpose: 'To build high-octane autonomous battlebots for national arenas.', status: 'Pending' },
    { id: 2, studentName: 'Meghna Roy', clubName: 'Acoustics Music Society', purpose: 'To cultivate classical and rock band performers inside the campus.', status: 'Pending' }
  ]);

  // 3. Mock Announcements
  const [announcements, setAnnouncements] = useState([
    { id: 1, title: 'Registrations Open for Acoustics Battle of Bands', date: '2026-05-21', author: 'Jaivignesh (Admin)' },
    { id: 2, title: 'Barricade and Entry QR scan guidelines published', date: '2026-05-20', author: 'Jaivignesh (Admin)' }
  ]);
  const [newAnnouncement, setNewAnnouncement] = useState('');

  // 4. Media Upload
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedSnaps, setUploadedSnaps] = useState([
    'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=80'
  ]);

  // 5. Certificates & SMTP Dispatch Console State
  const [certStudent, setCertStudent] = useState('');
  const [certEvent, setCertEvent] = useState('');
  const [certType, setCertType] = useState('Winner');
  const [generatedCert, setGeneratedCert] = useState(null);
  const [secureSmtpActive, setSecureSmtpActive] = useState(true);
  const [showMailTemplateModal, setShowMailTemplateModal] = useState(false);
  const [smtpLogs, setSmtpLogs] = useState([
    {
      id: 'AUR-CERT-821034',
      recipientName: 'Rohit Kumar',
      email: 'student@aurora.edu.in',
      certType: 'Participation',
      status: 'SENT SUCCESSFULLY',
      sentTime: 'Just now',
      deliveryStatus: 'Delivered'
    },
    {
      id: 'AUR-CERT-104928',
      recipientName: 'Rohit Kumar',
      email: 'student@aurora.edu.in',
      certType: 'Winner',
      status: 'SENT SUCCESSFULLY',
      sentTime: '10 mins ago',
      deliveryStatus: 'Delivered'
    },
    {
      id: 'AUR-CERT-389102',
      recipientName: 'Aman Varma',
      email: 'aman@aurora.edu.in',
      certType: 'Participation',
      status: 'SENT SUCCESSFULLY',
      sentTime: '1 hr ago',
      deliveryStatus: 'Delivered'
    },
    {
      id: 'AUR-CERT-773194',
      recipientName: 'Neha Gupta',
      email: 'neha@aurora.edu.in',
      certType: 'Runner Up',
      status: 'FAILED',
      sentTime: '2 hrs ago',
      deliveryStatus: 'SMTP Connection Timeout'
    }
  ]);
  const [mailerQueue, setMailerQueue] = useState([]);

  // 6. Settings preferences
  const [sysName, setSysName] = useState('Aurora Fest Console');
  const [sysMaintenance, setSysMaintenance] = useState(false);
  const [sysRegDeadline, setSysRegDeadline] = useState('2026-05-31');

  // Helper trigger alerts
  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  // Event handlers
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !date || !venue) {
      alert('Please fill out all mandatory fields.');
      return;
    }
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);
    const mockImage = image || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=800&q=80';

    addEvent({
      title,
      category,
      type,
      description,
      date,
      time,
      venue,
      coordinator,
      studentCoordinator,
      price,
      image: mockImage,
      tags,
      totalSeats: 100,
      registrations: 0
    });

    // Add to notification
    setNotifications(prev => [
      { id: Date.now(), type: 'announcement', text: `Event "${title}" has been successfully published!`, time: 'Just now', read: false },
      ...prev
    ]);

    resetForm();
    setShowAddModal(false);
  };

  const handleEditClick = (event) => {
    setEditingEventId(event.id);
    setTitle(event.title);
    setCategory(event.category);
    setType(event.type);
    setDescription(event.description);
    setDate(event.date);
    setTime(event.time);
    setVenue(event.venue);
    setCoordinator(event.coordinator);
    setStudentCoordinator(event.studentCoordinator || '');
    setPrice(event.price);
    setImage(event.image);
    setTagsInput((event.tags || []).join(', '));
    setShowEditModal(true);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    editEvent(editingEventId, {
      title,
      category,
      type,
      description,
      date,
      time,
      venue,
      coordinator,
      studentCoordinator,
      price,
      image,
      tags
    });

    resetForm();
    setShowEditModal(false);
  };

  const resetForm = () => {
    setEditingEventId(null);
    setTitle('');
    setCategory('Technical');
    setType('Hackathon');
    setDescription('');
    setDate('');
    setTime('');
    setVenue('');
    setCoordinator('');
    setStudentCoordinator('');
    setPrice('Free');
    setImage('');
    setTagsInput('');
  };

  // Enrolling custom students
  const handleAddStudent = (e) => {
    e.preventDefault();
    if (!newStudentName || !newStudentEmail) return;
    const newStudent = {
      rollNo: `AUR2026CSE${Math.floor(100 + Math.random() * 900)}`,
      name: newStudentName,
      email: newStudentEmail,
      department: newStudentDept,
      year: '1st Year',
      role: 'student',
      college: 'Aurora Deemed to be University',
      password: 'password'
    };
    setStudents(prev => {
      const updated = [...prev, newStudent];
      const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const filteredUsers = savedUsers.filter(u => u.email.toLowerCase() !== newStudentEmail.toLowerCase());
      localStorage.setItem('users', JSON.stringify([...filteredUsers, newStudent]));
      return updated;
    });
    setNotifications(prev => [
      { id: Date.now(), type: 'student', text: `New student "${newStudentName}" enrolled manually.`, time: 'Just now', read: false },
      ...prev
    ]);
    setNewStudentName('');
    setNewStudentEmail('');
  };

  const handleClubApprove = (id, approved) => {
    setClubRequests(prev => prev.map(req => req.id === id ? { ...req, status: approved ? 'Approved' : 'Rejected' } : req));
    const target = clubRequests.find(r => r.id === id);
    if (target) {
      setNotifications(prev => [
        { id: Date.now(), type: 'club', text: `Club proposal "${target.clubName}" is ${approved ? 'Approved' : 'Rejected'}.`, time: 'Just now', read: false },
        ...prev
      ]);
    }
  };

  const handleAnnounceSubmit = (e) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;
    const newAnn = {
      id: Date.now(),
      title: newAnnouncement,
      date: new Date().toISOString().split('T')[0],
      author: currentUser.name
    };
    setAnnouncements(prev => [newAnn, ...prev]);
    setNewAnnouncement('');
  };

  // Simulating image upload
  const handleUploadSimulate = () => {
    setIsUploading(true);
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setUploadedSnaps(old => [
            'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80',
            ...old
          ]);
          setNotifications(prev => [
            { id: Date.now(), type: 'announcement', text: 'New festival highlight snap successfully uploaded.', time: 'Just now', read: false },
            ...prev
          ]);
          return 100;
        }
        return prev + 20;
      });
    }, 200);
  };

  // Real Email Dispatcher – sends via EmailJS and updates SMTP logs
  const dispatchEmail = async (job) => {
    const certId = job.id;
    const dateIssued = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    // Mark as QUEUED / sending in log first
    setSmtpLogs(prev => {
      const exists = prev.some(log => log.id === certId);
      if (exists) {
        return prev.map(log =>
          log.id === certId
            ? { ...log, status: 'QUEUED', sentTime: 'Sending...', deliveryStatus: 'Relaying via SMTP...' }
            : log
        );
      }
      return [
        {
          id: certId,
          recipientName: job.recipientName,
          email: job.email,
          certType: job.certType,
          status: 'QUEUED',
          sentTime: 'Sending...',
          deliveryStatus: 'Relaying via SMTP...'
        },
        ...prev
      ];
    });

    setMailerQueue(prev => [...prev, certId]);

    const result = await sendCertificateEmail({
      toName: job.recipientName,
      toEmail: job.email,
      eventName: job.eventName,
      certType: job.certType,
      certId: certId,
      dateIssued: dateIssued
    });

    // Update the log row with real result
    setSmtpLogs(prev =>
      prev.map(log =>
        log.id === certId
          ? {
              ...log,
              status: result.success ? 'SENT SUCCESSFULLY' : 'FAILED',
              sentTime: 'Just now',
              deliveryStatus: result.success ? 'Delivered' : result.message
            }
          : log
      )
    );

    setMailerQueue(prev => prev.filter(id => id !== certId));

    if (result.success) {
      setNotifications(prev => [
        { id: Date.now(), type: 'announcement', text: `Certificate email delivered to ${job.recipientName} (${job.email})`, time: 'Just now', read: false },
        ...prev
      ]);
    }
  };

  // Certificate Generator
  const handleGenerateCertificate = (e) => {
    if (e) e.preventDefault();
    if (!certStudent || !certEvent) {
      alert('Please select both a student and an event.');
      return;
    }
    setGeneratedCert({
      id: `AUR-CERT-${Math.floor(100000 + Math.random() * 900000)}`,
      studentName: certStudent,
      eventName: certEvent,
      type: certType,
      dateIssued: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    });
  };

  const handleSendEmailSingle = async (e) => {
    e.preventDefault();
    if (!certStudent || !certEvent) {
      alert('Please select both a student and an event.');
      return;
    }
    const student = students.find(s => s.name === certStudent) || { email: 'student@aurora.edu.in' };
    const certId = `AUR-CERT-${Math.floor(100000 + Math.random() * 900000)}`;
    const dateIssued = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    setGeneratedCert({
      id: certId,
      studentName: certStudent,
      eventName: certEvent,
      type: certType,
      dateIssued
    });

    await dispatchEmail({
      id: certId,
      recipientName: certStudent,
      email: student.email,
      eventName: certEvent,
      certType: certType
    });
  };

  const handleSendBulk = async () => {
    if (!certEvent) {
      alert('Please select an event first.');
      return;
    }
    const event = events.find(e => e.title === certEvent);
    if (!event) {
      alert('Event details not found.');
      return;
    }

    const participantEmails = [];
    Object.entries(registrations).forEach(([email, eventIds]) => {
      if (Array.isArray(eventIds) && eventIds.includes(event.id)) {
        participantEmails.push(email);
      }
    });

    if (participantEmails.length === 0) {
      const fallback = students.length > 0 ? students.slice(0, 3) : [{ name: 'Aman Varma', email: 'aman@aurora.edu.in' }];
      fallback.forEach(std => participantEmails.push(std.email));
    }

    for (const email of participantEmails) {
      const student = students.find(s => s.email.toLowerCase() === email.toLowerCase()) || { name: email.split('@')[0] };
      await dispatchEmail({
        id: `AUR-CERT-${Math.floor(100000 + Math.random() * 900000)}`,
        recipientName: student.name,
        email: email,
        eventName: certEvent,
        certType: 'Participation'
      });
    }
  };

  const handleResendSingle = async (log) => {
    await dispatchEmail({
      id: log.id,
      recipientName: log.recipientName,
      email: log.email,
      eventName: certEvent || log.eventName || 'Aurora Fest 2026',
      certType: log.certType
    });
  };

  const handleResendFailed = async () => {
    const failedLogs = smtpLogs.filter(log => log.status === 'FAILED');
    if (failedLogs.length === 0) {
      alert('No failed emails to resend!');
      return;
    }
    for (const log of failedLogs) {
      await dispatchEmail({
        id: log.id,
        recipientName: log.recipientName,
        email: log.email,
        eventName: certEvent || 'Aurora Fest 2026',
        certType: log.certType
      });
    }
  };

  // Filter lists based on SearchQuery
  const filteredEvents = events.filter(e =>
    e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    e.venue.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredStudents = students.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.rollNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Tab controller definitions
  const sidebarItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'events', label: 'Manage Events', icon: Calendar },
    { id: 'students', label: 'Registrations', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'announcements', label: 'Announcements', icon: Megaphone },
    { id: 'gallery', label: 'Gallery Upload', icon: UploadCloud },
    { id: 'certificates', label: 'Certificates', icon: Award }
  ];

  const getFilteredSidebarItems = () => {
    if (!currentUser) return [];
    if (currentUser.role === 'admin') return sidebarItems;
    
    const roleMap = {
      'club_head': ['overview', 'events', 'students', 'announcements', 'gallery', 'certificates'],
      'club_coordinator': ['overview', 'events', 'students', 'announcements', 'gallery', 'certificates'],
      'faculty_coordinator': ['overview', 'events', 'students', 'analytics'],
      'volunteer_lead': ['overview', 'events', 'students']
    };
    
    const allowedTabs = roleMap[currentUser.role] || ['overview'];
    return sidebarItems.filter(item => allowedTabs.includes(item.id));
  };

  const filteredSidebarItems = getFilteredSidebarItems();

  const getRoleLabel = (role) => {
    if (role === 'admin') return 'System Admin';
    if (role === 'club_head') return 'Club Head';
    if (role === 'club_coordinator') return 'Club Coordinator';
    if (role === 'faculty_coordinator') return 'Faculty Coordinator';
    if (role === 'volunteer_lead') return 'Volunteer Lead';
    if (role === 'volunteer') return 'Volunteer';
    return role;
  };

  return (
    <div className="relative min-h-screen flex bg-slate-50 text-slate-900 dark:bg-[#070913] dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* Background elegant glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-500/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-pink-500/5 blur-[120px] pointer-events-none" />

      {/* Large Left Sidebar */}
      <aside className="hidden lg:flex flex-col w-80 bg-white/70 dark:bg-[#0B0F23]/60 backdrop-blur-xl border-r border-slate-200/50 dark:border-white/5 h-screen fixed top-0 left-0 z-40 p-6 justify-between overflow-hidden">
        
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
              <span className="text-[9px] tracking-[0.15em] font-extrabold text-purple-600 uppercase block mt-1.5">Faculty/Admin Portal</span>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-2 text-left">
            {filteredSidebarItems.map(item => {
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
                </button>
              );
            })}
          </nav>
        </div>

        {/* Anchored Bottom Sidebar Content */}
        <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-white/5 text-left mt-auto bg-transparent shrink-0">
          
          {/* Admin Profile Embedded */}
          <div className="p-4 rounded-3xl premium-gradient-profile flex flex-col items-center text-center space-y-3 relative overflow-hidden">
            <div className="relative shrink-0">
              <div className="w-14 h-14 rounded-[1.25rem] bg-gradient-to-tr from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center text-lg font-black uppercase relative border border-purple-200 dark:border-purple-800/40 hover:scale-105 transition-transform duration-300">
                {currentUser.name.substring(0, 2)}
                <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-[#0B0F23]"></span>
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-black text-slate-800 dark:text-white leading-tight">{currentUser.name}</h3>
              <span className="inline-block text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 mt-1.5 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-cyan-500/10 dark:from-purple-500/20 dark:via-pink-500/20 dark:to-cyan-500/20 text-purple-700 dark:text-purple-300 border border-purple-200/50 dark:border-purple-800/40">
                {getRoleLabel(currentUser.role)}
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold font-sans mt-2.5 leading-relaxed">
                {currentUser.department}
              </p>
            </div>
          </div>

          {/* Quick Publish Event Action */}
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full py-4 px-5 rounded-2xl premium-glow-btn text-[13px] font-black uppercase tracking-wider flex items-center justify-center space-x-2 cursor-pointer smooth-transition"
          >
            <Plus className="h-4.5 w-4.5 animate-pulse" />
            <span>Publish Event</span>
          </button>
 
          {/* Switch to Student Portal */}
          <button
            onClick={() => navigate('/dashboard')}
            className="w-full py-4 px-5 rounded-2xl border border-indigo-200 dark:border-indigo-800/40 bg-indigo-50 dark:bg-indigo-950/10 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/20 text-[13px] font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer smooth-transition"
          >
            <Compass className="h-4.5 w-4.5" />
            <span>Student Dashboard</span>
          </button>
 
          {/* Logout Action */}
          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full py-4 px-5 rounded-2xl border border-rose-200 dark:border-rose-800/40 bg-rose-50 dark:bg-rose-950/10 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-950/20 text-[13px] font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer smooth-transition"
          >
            <LogOut className="h-4.5 w-4.5" />
            <span>Secure Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Administrative Console Container */}
      <div className="flex-1 flex flex-col min-h-screen overflow-x-hidden lg:pl-80">
        
        {/* Top Header Widget */}
        <header className="sticky top-0 z-30 w-full bg-white/70 dark:bg-[#070913]/70 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5 py-4 px-6 sm:px-8 flex items-center justify-between gap-4">
          
          {/* Mobile Brand */}
          <div className="flex items-center space-x-2.5 lg:hidden">
            <img
              src={auroraLogo}
              alt="Aurora Logo"
              className="w-10 h-10 object-contain drop-shadow-[0_0_15px_rgba(99,102,241,0.25)]"
            />
            <h2 className="text-sm font-black tracking-tight text-slate-800 dark:text-white uppercase">AURORA FEST</h2>
          </div>

          {/* Search bar (functional) */}
          <div className="relative max-w-md w-full hidden sm:block">
            <input
              type="text"
              placeholder={`Search ${activeTab === 'students' ? 'students by name or roll...' : 'events, blocks, or categories...'}`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-2.5 pl-11 rounded-2xl border border-slate-200 dark:border-white/5 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-xs font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 bg-white"
            />
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          </div>

          {/* Action widgets */}
          <div className="flex items-center space-x-3.5 ml-auto">
            
            {/* Theme selector */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-white/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun className="h-4.5 w-4.5 text-yellow-400" /> : <Moon className="h-4.5 w-4.5 text-slate-700" />}
            </button>

            {/* Notification bell */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2.5 rounded-xl border border-slate-200 dark:border-white/5 dark:bg-white/5 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/10 transition-all relative"
              >
                <Bell className="h-4.5 w-4.5" />
                {notifications.some(n => !n.read) && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                )}
              </button>

              {/* Notification drop slider */}
              <AnimatePresence>
                {showNotifications && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowNotifications(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-3.5 w-80 bg-white dark:bg-[#0E132D] border border-slate-200 dark:border-slate-800 rounded-[2rem] shadow-2xl p-4 z-50 text-left space-y-4"
                    >
                      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2.5">
                        <h4 className="text-xs font-black tracking-wider uppercase text-slate-700 dark:text-slate-300">Live Campus Feed</h4>
                        <button onClick={handleMarkAllRead} className="text-[10px] text-indigo-500 hover:underline">Mark read</button>
                      </div>
                      
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {notifications.map(notif => (
                          <div key={notif.id} className={`p-2.5 rounded-xl border ${notif.read ? 'border-slate-100/50 bg-slate-50/20 dark:border-slate-800 dark:bg-slate-900/10' : 'border-indigo-500/20 bg-indigo-500/5 dark:border-indigo-500/10 dark:bg-indigo-500/5'} text-[11px] space-y-1`}>
                            <p className="font-semibold text-slate-700 dark:text-slate-300">{notif.text}</p>
                            <span className="text-[9px] text-slate-400 block">{notif.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Mobile Log out */}
            <button
              onClick={() => { logout(); navigate('/'); }}
              className="lg:hidden p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 hover:bg-rose-500 hover:text-white transition-all"
            >
              <LogOut className="h-4.5 w-4.5" />
            </button>
          </div>
        </header>

        {/* Dynamic Workspace Workstations */}
        <main className="flex-grow p-6 sm:p-8 space-y-8 max-w-full mx-auto w-full px-4 sm:px-8 lg:px-12 relative z-10 text-left">
          
          {/* Tab indicator for mobile menu */}
          <div className="flex lg:hidden overflow-x-auto gap-2 pb-3 mb-4 scrollbar-none">
            {filteredSidebarItems.map(item => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setSearchQuery(''); }}
                  className={`px-4.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md'
                      : 'bg-white dark:bg-white/5 border border-slate-200 dark:border-white/5 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          {/* 1. WORKSPACE: Overview */}
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-fadeIn">


              {/* Header intro banner */}
              <div className="glass-card rounded-[2.5rem] p-8 border border-slate-200/50 dark:border-white/5 bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-pink-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-500 text-[10px] font-bold uppercase tracking-wider mb-3">
                    <Sparkles className="h-3 w-3" />
                    <span>SYSTEM CONTROL PANEL ACTIVE</span>
                  </div>
                  <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-white">Welcome back, {currentUser.name}!</h1>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-2 leading-relaxed">
                    You have full administrative privileges for Aurora Fest 2026. Manage college registrations, approve clubs, coordinate staff assignments, and track analytics on-the-fly.
                  </p>
                </div>

                <div className="flex gap-3 shrink-0">
                  <button onClick={() => setShowAddModal(true)} className="px-6 py-3.5 rounded-full text-xs font-black uppercase tracking-wider premium-glow-btn flex items-center space-x-2 cursor-pointer smooth-transition">
                    <Plus className="h-4 w-4" />
                    <span>Create Event</span>
                  </button>
                </div>
              </div>

              {/* Counter Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="premium-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 text-left space-y-3 relative overflow-hidden group hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-[0_20px_50px_rgba(147,51,234,0.12)]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                  <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-600 dark:text-purple-400 shadow-md">
                    <Users className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Total Enrolled Students</span>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{students.length}</h3>
                  </div>
                </div>

                <div className="premium-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 text-left space-y-3 relative overflow-hidden group hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-[0_20px_50px_rgba(99,102,241,0.12)]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-indigo-500/10 to-blue-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                  <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-md">
                    <Calendar className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Published Fest Events</span>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{events.length}</h3>
                  </div>
                </div>

                <div className="premium-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 text-left space-y-3 relative overflow-hidden group hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-[0_20px_50px_rgba(236,72,153,0.12)]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-pink-500/10 to-rose-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                  <div className="w-11 h-11 rounded-2xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-600 dark:text-pink-400 shadow-md">
                    <UserCheck className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Total Event Signups</span>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">
                      {events.reduce((acc, curr) => acc + (curr.registrations || 0), 0)}
                    </h3>
                  </div>
                </div>

                <div className="premium-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 text-left space-y-3 relative overflow-hidden group hover:scale-[1.03] transition-all duration-300 shadow-lg hover:shadow-[0_20px_50px_rgba(6,182,212,0.12)]">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/10 to-blue-500/10 rounded-full blur-xl group-hover:scale-125 transition-transform" />
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-md">
                    <Megaphone className="h-5.5 w-5.5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Active Announcements</span>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white mt-1">{announcements.length}</h3>
                  </div>
                </div>
              </div>

              {/* Inner Split: Club Approvals & Recent list */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Pending Club Approvals (6 Columns) */}
                <div className="lg:col-span-6 glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 space-y-6 text-left">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center space-x-2">
                      <UserCheck className="h-5 w-5 text-indigo-500" />
                      <span>Club Affiliation Proposals</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Review student applications for forming new creative clubs.</p>
                  </div>

                  <div className="space-y-4">
                    {clubRequests.map(req => (
                      <div key={req.id} className="p-5 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-200/20 dark:border-white/5 space-y-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-[9px] font-black uppercase text-indigo-500 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1 rounded-lg">{req.clubName}</span>
                            <h4 className="font-extrabold text-[13px] text-slate-800 dark:text-white mt-2">By: {req.studentName}</h4>
                          </div>
                          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded ${
                            req.status === 'Approved' ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/20' :
                            req.status === 'Rejected' ? 'bg-rose-500/15 text-rose-500 border border-rose-500/20' :
                            'bg-amber-500/15 text-amber-500 border border-amber-500/20'
                          }`}>{req.status}</span>
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">{req.purpose}</p>

                        {req.status === 'Pending' && (
                          <div className="flex justify-end gap-2 pt-2">
                            <button onClick={() => handleClubApprove(req.id, false)} className="px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all smooth-transition">
                              Reject
                            </button>
                            <button onClick={() => handleClubApprove(req.id, true)} className="px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase text-white premium-glow-btn smooth-transition">
                              Approve Club
                            </button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Live Campus Updates (6 Columns) */}
                <div className="lg:col-span-6 glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 space-y-6 text-left">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center space-x-2">
                      <Megaphone className="h-5 w-5 text-indigo-500" />
                      <span>Live Broadcast Feed</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Real-time alerts broadcasted to students and gallery screens.</p>
                  </div>

                  <div className="space-y-4">
                    {announcements.map(ann => (
                      <div key={ann.id} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/20 dark:border-white/5 rounded-2xl flex items-center justify-between text-left">
                        <div className="space-y-1">
                          <p className="text-[13px] font-bold text-slate-700 dark:text-slate-300">{ann.title}</p>
                          <div className="text-[10px] text-slate-400 flex items-center space-x-2">
                            <span>{ann.date}</span>
                            <span>•</span>
                            <span className="text-indigo-500">By: {ann.author}</span>
                          </div>
                        </div>
                        <button onClick={() => setAnnouncements(prev => prev.filter(a => a.id !== ann.id))} className="text-[10px] text-rose-500 hover:underline">
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 2. WORKSPACE: Manage Events (CRUD Panel) */}
          {activeTab === 'events' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Active Festival Events ({filteredEvents.length})</h2>
                  <p className="text-xs text-slate-400 mt-1">Create, edit, or remove categories from the official Aurora program calendar.</p>
                </div>
                
                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider text-white premium-glow-btn flex items-center space-x-2 self-start sm:self-center smooth-transition"
                >
                  <Plus className="h-4 w-4" />
                  <span>Publish New Event</span>
                </button>
              </div>

              {/* Event Table/Grid view */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map(event => (
                  <div key={event.id} className="glass-card rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-white/5 shadow-md flex flex-col justify-between hover:scale-[1.01] transition-transform">
                    <div>
                      {/* Image header banner */}
                      <div className="relative h-64 w-full">
                        <img
                          src={event.image}
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1514382357765-73c1b2375d7e?auto=format&fit=crop&w=800&q=80'; }}
                          className="w-full h-full object-cover"
                          alt={event.title}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                        <span className="absolute top-4 left-4 text-[9px] font-black uppercase text-white bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 border border-white/20 px-2.5 py-1 rounded-lg">
                          {event.category}
                        </span>
                        
                        <div className="absolute bottom-4 left-4 right-4 text-left">
                          <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest">{event.type}</span>
                          <h4 className="text-base font-black text-white line-clamp-1 mt-0.5">{event.title}</h4>
                        </div>
                      </div>

                      {/* Content Info */}
                      <div className="p-6 text-left space-y-3 font-sans">
                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{event.description}</p>
                        
                        <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-400">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                            <span>{event.date} • {event.time || 'TBD'}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                            <span className="truncate">{event.venue}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                            <span>Registrations: <strong className="text-slate-700 dark:text-white">{event.registrations || 0} / {event.totalSeats || 100}</strong></span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom controls */}
                    <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between">
                      <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">{event.price}</span>
                      
                      <div className="flex gap-2">
                        <button onClick={() => handleEditClick(event)} className="p-2 rounded-xl bg-purple-500/10 text-purple-500 hover:bg-purple-600 hover:text-white transition-all smooth-transition">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button onClick={() => deleteEvent(event.id)} className="p-2 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all smooth-transition">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

          {/* 3. WORKSPACE: Student Registrations */}
          {activeTab === 'students' && (
            <div className="space-y-8 animate-fadeIn">
              
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Student Enrollment & Records Desk</h2>
                <p className="text-xs text-slate-400 mt-1">Register new student credentials manually or view database records.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Add new student (5 Columns) */}
                <form onSubmit={handleAddStudent} className="lg:col-span-4 glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 space-y-4 text-left">
                  <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white">Enroll Student</h3>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={newStudentName}
                      onChange={(e) => setNewStudentName(e.target.value)}
                      placeholder="e.g. Priyanth Kumar"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Campus Email *</label>
                    <input
                      type="email"
                      required
                      value={newStudentEmail}
                      onChange={(e) => setNewStudentEmail(e.target.value)}
                      placeholder="rohit@aurora.edu.in"
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-slate-400">Department</label>
                    <select
                      value={newStudentDept}
                      onChange={(e) => setNewStudentDept(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                    >
                      <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                      <option value="Electronics & Communication">Electronics & Communication</option>
                      <option value="Mechanical Engineering">Mechanical Engineering</option>
                    </select>
                  </div>

                  <button type="submit" className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider text-white premium-glow-btn smooth-transition">
                    Enroll Student
                  </button>
                </form>

                {/* Student list database (8 Columns) */}
                <div className="lg:col-span-8 glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 space-y-4 text-left">
                  <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white">Active Database Records ({filteredStudents.length})</h3>

                  <div className="space-y-3">
                    {filteredStudents.map(std => {
                      const studentEventIds = registrations[std.email.toLowerCase()] || registrations[std.email] || [];
                      const studentEvents = events.filter(e => studentEventIds.includes(e.id));
                      return (
                        <div key={std.rollNo} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/20 dark:border-white/5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="space-y-1.5">
                            <h4 className="font-extrabold text-[13px] text-slate-800 dark:text-white">{std.name}</h4>
                            <p className="text-[10px] text-slate-400 flex flex-wrap items-center gap-2">
                              <span>Roll: <strong className="text-purple-500">{std.rollNo}</strong></span>
                              <span>•</span>
                              <span>{std.email}</span>
                              <span>•</span>
                              <span className="text-slate-400">{std.department}</span>
                            </p>
                            
                            {/* Render registered events tags */}
                            {studentEvents.length > 0 ? (
                              <div className="flex flex-wrap gap-1.5 pt-1">
                                {studentEvents.map(evt => (
                                  <span key={evt.id} className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/25">
                                    {evt.title}
                                  </span>
                                ))}
                              </div>
                            ) : (
                              <span className="text-[9px] text-slate-400 block pt-1 italic">No registered events</span>
                            )}
                          </div>
                          <button
                            onClick={() => {
                              setStudents(prev => {
                                const updated = prev.filter(s => s.rollNo !== std.rollNo);
                                const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
                                const filteredUsers = savedUsers.filter(u => u.rollNo !== std.rollNo);
                                localStorage.setItem('users', JSON.stringify(filteredUsers));
                                return updated;
                              });
                            }}
                            className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white transition-all smooth-transition self-start sm:self-center shrink-0"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 4. WORKSPACE: Analytics */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-fadeIn">
              
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Registration Analytics Terminal</h2>
                <p className="text-xs text-slate-400 mt-1">Real-time statistics covering audience growth, seats allocated, and category divisions.</p>
              </div>

              {/* Dynamic stats row */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="premium-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 space-y-1 text-left shadow-lg">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Verified passes</span>
                  <h4 className="text-2xl font-black text-slate-800 dark:text-white">1,120</h4>
                  <p className="text-[9px] text-emerald-600 dark:text-emerald-400 font-semibold">+15% since announcement</p>
                </div>
                
                <div className="premium-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 space-y-1 text-left shadow-lg">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Registered teams</span>
                  <h4 className="text-2xl font-black text-slate-800 dark:text-white">142 Squads</h4>
                  <p className="text-[9px] text-purple-600 dark:text-purple-400 font-semibold">Active competitions participation</p>
                </div>

                <div className="premium-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 space-y-1 text-left shadow-lg">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Total conversion</span>
                  <h4 className="text-2xl font-black text-slate-800 dark:text-white">78.4%</h4>
                  <p className="text-[9px] text-pink-600 dark:text-pink-400 font-semibold">Audience engagement metrics</p>
                </div>
              </div>

              {/* Graphic custom charts */}
              <div className="p-6 sm:p-8 rounded-[2.5rem] glass-card border border-slate-200/50 dark:border-white/5 space-y-4 shadow-lg">
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 text-left">Enrollment Distributions by Categories</h4>
                
                <div className="w-full h-56 relative flex items-end justify-between px-4 pt-10">
                  <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
                    <div className="border-b border-slate-200 dark:border-slate-700 w-full" />
                    <div className="border-b border-slate-200 dark:border-slate-700 w-full" />
                    <div className="border-b border-slate-200 dark:border-slate-700 w-full" />
                  </div>

                  {[
                    { category: 'Technical', count: 480, height: 'h-[75%]', color: 'bg-indigo-600' },
                    { category: 'Cultural', count: 860, height: 'h-[95%]', color: 'bg-pink-500' },
                    { category: 'Sports', count: 240, height: 'h-[45%]', color: 'bg-cyan-500' },
                    { category: 'Workshops', count: 180, height: 'h-[35%]', color: 'bg-amber-500' },
                    { category: 'Webinars', count: 320, height: 'h-[55%]', color: 'bg-purple-500' }
                  ].map(chart => (
                    <div key={chart.category} className="flex-1 flex flex-col items-center justify-end h-full gap-2 relative z-10">
                      <span className="text-[10px] font-bold text-slate-700 dark:text-slate-200">{chart.count}</span>
                      <div className={`w-10 sm:w-16 rounded-t-2xl ${chart.color} ${chart.height} transition-all duration-700 hover:opacity-90`} />
                      <span className="text-[9px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider truncate max-w-[80px]">{chart.category}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 5. WORKSPACE: Announcements */}
          {activeTab === 'announcements' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Broadcast Alerts Dashboard</h2>
                <p className="text-xs text-slate-400 mt-1">Publish bulletins that render dynamically across student dashboard landing pages.</p>
              </div>

              <div className="glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 space-y-6 text-left">
                <form onSubmit={handleAnnounceSubmit} className="space-y-4">
                  <textarea
                    rows="3"
                    required
                    value={newAnnouncement}
                    onChange={(e) => setNewAnnouncement(e.target.value)}
                    placeholder="e.g. Technical hackathon teams allocations are finalized. Check registered university email."
                    className="w-full px-5 py-4 rounded-2xl border border-slate-200 dark:border-white/5 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                  <button type="submit" className="px-5 py-3 rounded-full text-xs font-black uppercase tracking-wider text-white premium-glow-btn smooth-transition">
                    Publish Bulletin
                  </button>
                </form>

                <div className="space-y-4 pt-6 border-t border-slate-100 dark:border-white/5">
                  <h3 className="text-xs font-black uppercase text-slate-400 tracking-widest">Active Bulletins ({announcements.length})</h3>
                  
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-200/20 dark:border-white/5 rounded-2xl flex items-center justify-between">
                      <div>
                        <p className="text-[13px] font-bold text-slate-800 dark:text-slate-200">{ann.title}</p>
                        <span className="text-[9px] text-slate-400 block mt-1">Published: {ann.date} • By: {ann.author}</span>
                      </div>
                      <button onClick={() => setAnnouncements(prev => prev.filter(a => a.id !== ann.id))} className="text-[10px] text-rose-500 hover:underline">
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* 6. WORKSPACE: Gallery Upload */}
          {activeTab === 'gallery' && (
            <div className="space-y-6 animate-fadeIn">
              
              <div>
                <h2 className="text-xl font-black text-slate-800 dark:text-white">Media Gallery Upload Hub</h2>
                <p className="text-xs text-slate-400 mt-1">Upload high-definition photography and video logs of the festival for all visitors.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Drag and drop simulator (6 Columns) */}
                <div className="lg:col-span-6 glass-card rounded-[2.5rem] p-8 border border-slate-200/50 dark:border-white/5 text-center space-y-6 text-left">
                  <div className="p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl space-y-5 bg-slate-50/50 dark:bg-white/2">
                    <UploadCloud className="h-12 w-12 text-purple-500 mx-auto" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">Select snap for uploads</h4>
                      <p className="text-xs text-slate-400 mt-1">Supports High Resolution JPG, PNG up to 10MB.</p>
                    </div>

                    {isUploading ? (
                      <div className="max-w-xs mx-auto space-y-2 pt-2">
                        <div className="w-full h-1 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div className="h-full bg-gradient-to-r from-purple-600 to-indigo-600 transition-all duration-300" style={{ width: `${uploadProgress}%` }} />
                        </div>
                        <span className="text-[10px] text-slate-400">Uploading: {uploadProgress}%</span>
                      </div>
                    ) : (
                      <button onClick={handleUploadSimulate} className="px-5 py-3 rounded-full text-xs font-black uppercase text-white premium-glow-btn smooth-transition">
                        Select & Upload Snap
                      </button>
                    )}
                  </div>
                </div>

                {/* Published images list (6 Columns) */}
                <div className="lg:col-span-6 glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 space-y-4">
                  <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white text-left">Highlight Stream Preview</h3>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {uploadedSnaps.map((snap, idx) => (
                      <div key={idx} className="relative h-28 w-full rounded-2xl overflow-hidden group shadow-md">
                        <img src={snap} className="w-full h-full object-cover transition-transform group-hover:scale-105" alt="Highlights" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                          <button onClick={() => setUploadedSnaps(old => old.filter((_, i) => i !== idx))} className="p-2 bg-rose-500 text-white rounded-xl text-[10px] font-black uppercase smooth-transition">
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* 7. WORKSPACE: Certificates & SMTP Dispatch Console */}
          {activeTab === 'certificates' && (
            <div className="space-y-8 animate-fadeIn">
              
              {/* Console Title & SMTP Toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-black text-slate-800 dark:text-white">Digital Certificates & Email Dispatch Console</h2>
                  <p className="text-xs text-slate-400 mt-1">Issue ranking awards and automate high-fidelity PDF certificate deliveries directly to student emails.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setSecureSmtpActive(!secureSmtpActive)}
                  className={`px-5 py-3.5 rounded-2xl text-[11px] font-black uppercase tracking-wider flex items-center space-x-2 transition-all duration-300 border ${
                    secureSmtpActive 
                      ? 'bg-purple-100/70 border-purple-200 text-purple-700 dark:bg-purple-950/30 dark:border-purple-800/40 dark:text-purple-300' 
                      : 'bg-slate-100 border-slate-200 text-slate-500 dark:bg-white/5 dark:border-white/5 dark:text-slate-400'
                  }`}
                >
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${secureSmtpActive ? 'bg-emerald-500 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-rose-500'}`} />
                  <span>SECURE SMTP RELAY: {secureSmtpActive ? 'ACTIVE' : 'OFFLINE'}</span>
                </button>
              </div>

              {/* SMTP Metrics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Metrics: Dispatched */}
                <div className="premium-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 text-left flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-md">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-tr from-purple-500/5 to-indigo-500/5 rounded-full blur-lg" />
                  <div className="space-y-1 relative z-10">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Total Emails Dispatched</span>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-none mt-1">{smtpLogs.length}</h3>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md self-end relative z-10">100% SMTP Load</span>
                </div>

                {/* Metrics: Success */}
                <div className="premium-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 text-left flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-md">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-tr from-emerald-500/5 to-teal-500/5 rounded-full blur-lg" />
                  <div className="space-y-1 relative z-10">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Successful Deliveries</span>
                    <h3 className="text-3xl font-black text-slate-800 dark:text-white leading-none mt-1">
                      {smtpLogs.filter(l => l.status === 'SENT SUCCESSFULLY').length}
                    </h3>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase text-emerald-550 bg-emerald-500/10 px-2 py-0.5 rounded-md self-end relative z-10">
                    {smtpLogs.length > 0 ? Math.round((smtpLogs.filter(l => l.status === 'SENT SUCCESSFULLY').length / smtpLogs.length) * 100) : 0}% Success
                  </span>
                </div>

                {/* Metrics: Failed */}
                <div className="premium-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 text-left flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-md">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-tr from-rose-500/5 to-red-500/5 rounded-full blur-lg" />
                  <div className="space-y-1 relative z-10">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Failed Dispatches</span>
                    <h3 className="text-3xl font-black text-rose-500 mt-1">
                      {smtpLogs.filter(l => l.status === 'FAILED').length}
                    </h3>
                  </div>
                  <span className="text-[9px] font-extrabold uppercase text-rose-500 bg-rose-500/10 px-2 py-0.5 rounded-md self-end relative z-10">Resend Available</span>
                </div>

                {/* Metrics: Queue */}
                <div className="premium-card rounded-3xl p-6 border border-slate-200/50 dark:border-white/5 text-left flex items-center justify-between relative overflow-hidden group hover:scale-[1.02] transition-all duration-300 shadow-md">
                  <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-tr from-cyan-500/5 to-indigo-500/5 rounded-full blur-lg" />
                  <div className="space-y-1 relative z-10">
                    <span className="text-[10px] text-slate-400 uppercase font-black tracking-wider block">Mailer Queue</span>
                    <h3 className={`text-3xl font-black mt-1 ${mailerQueue.length > 0 ? 'text-amber-500 animate-pulse' : 'text-slate-800 dark:text-white'}`}>
                      {mailerQueue.length}
                    </h3>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md self-end relative z-10 ${mailerQueue.length > 0 ? 'text-amber-500 bg-amber-500/10' : 'text-slate-400 bg-slate-100 dark:bg-white/5'}`}>
                    {mailerQueue.length > 0 ? 'Processing...' : 'Idle'}
                  </span>
                </div>

              </div>

              {/* Main Split Console Workspace */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                
                {/* Dispatch Controls Column (5 Columns) */}
                <div className="lg:col-span-5 space-y-6">
                  
                  {/* Single Student Dispatch Card */}
                  <form onSubmit={handleSendEmailSingle} className="glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 space-y-5 text-left">
                    <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider">Single Student Dispatch</h3>
                    
                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400">Recipient Student *</label>
                      <select
                        required
                        value={certStudent}
                        onChange={(e) => setCertStudent(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 text-xs text-slate-850 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="">-- Choose Student --</option>
                        {students.map(s => (
                          <option key={s.rollNo} value={s.name}>{s.name} ({s.rollNo})</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400">Aurora Event Title *</label>
                      <select
                        required
                        value={certEvent}
                        onChange={(e) => setCertEvent(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 text-xs text-slate-855 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="">-- Choose Event --</option>
                        {events.map(e => (
                          <option key={e.id} value={e.title}>{e.title}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-black uppercase text-slate-400">Honor Category</label>
                      <select
                        value={certType}
                        onChange={(e) => setCertType(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-white/5 text-xs text-slate-855 dark:text-white bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                      >
                        <option value="Winner">Winner</option>
                        <option value="Runner Up">Runner Up</option>
                        <option value="Honorary Mention">Honorary Mention</option>
                        <option value="Participation">Certificate of Participation</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-2">
                      <button
                        type="button"
                        onClick={() => handleGenerateCertificate()}
                        className="w-full py-3.5 rounded-2xl border border-purple-250 dark:border-purple-800/40 bg-purple-50/50 dark:bg-purple-950/10 text-purple-700 dark:text-purple-300 hover:bg-purple-100 dark:hover:bg-purple-950/20 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer"
                      >
                        <Sparkles className="h-4 w-4" />
                        <span>Preview Award</span>
                      </button>
                      <button
                        type="submit"
                        className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-white premium-glow-btn smooth-transition flex items-center justify-center space-x-2 cursor-pointer"
                      >
                        <Mail className="h-4 w-4" />
                        <span>Send Email</span>
                      </button>
                    </div>
                  </form>

                  {/* Bulk Event Dispatch Engine Card */}
                  <div className="glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 space-y-4 text-left">
                    <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider">Bulk Event Dispatch Engine</h3>
                    <p className="text-[11px] text-slate-450 leading-relaxed font-sans">
                      Automatically compile PDF credentials and schedule SMTP relays to all students registered in the selected event.
                    </p>

                    <button
                      type="button"
                      onClick={handleSendBulk}
                      className="w-full py-4 px-5 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-pink-600 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center space-x-2 hover:scale-[1.01] hover:opacity-95 active:scale-95 transition-all duration-300 shadow-md cursor-pointer"
                    >
                      <UploadCloud className="h-4.5 w-4.5" />
                      <span>Send Participation Certificates to All</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowMailTemplateModal(true)}
                      className="w-full py-3.5 px-5 rounded-2xl border border-slate-200 dark:border-white/5 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-350 hover:bg-slate-100 dark:hover:bg-slate-900 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all duration-300 cursor-pointer"
                    >
                      <span>Preview Mail Template</span>
                    </button>
                  </div>

                </div>

                {/* Live Award Visual Preview Desk (7 Columns) */}
                <div className="lg:col-span-7 glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 space-y-6 text-left h-full">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black uppercase text-slate-800 dark:text-white tracking-wider">Award Visual Preview Desk</h3>
                    {generatedCert && (
                      <button
                        onClick={() => window.print()}
                        title="Print Certificate"
                        className="p-2.5 rounded-xl bg-purple-500/10 text-purple-500 hover:bg-purple-600 hover:text-white transition-all smooth-transition cursor-pointer"
                      >
                        <Printer className="h-4.5 w-4.5" />
                      </button>
                    )}
                  </div>

                  {generatedCert ? (
                    <div id="printable-certificate" className="p-8 border-[6px] border-double border-amber-600 bg-amber-50/40 dark:bg-amber-950/5 rounded-3xl text-center space-y-6 relative overflow-hidden text-slate-900 dark:text-slate-100 shadow-sm">
                      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-200/10 via-transparent to-transparent pointer-events-none" />
                      
                      <div className="space-y-1">
                        <span className="text-[10px] tracking-[0.3em] font-extrabold uppercase text-amber-600 dark:text-amber-400">Aurora Deemed to be University</span>
                        <h4 className="text-xl font-black font-sans tracking-tight">ANNUAL FESTIVAL 2026</h4>
                      </div>

                      <div className="py-2">
                        <span className="text-xs italic text-slate-500 block">This is proudly awarded to</span>
                        <span className="text-2xl font-black text-amber-600 dark:text-amber-400 block mt-2 font-serif underline decoration-double decoration-amber-600">{generatedCert.studentName}</span>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                        in recognition of outstanding achievement and securing the distinction of <strong className="text-purple-500 uppercase">{generatedCert.type}</strong> in the flagship festival event <strong className="text-slate-800 dark:text-white">"{generatedCert.eventName || certEvent}"</strong>.
                      </p>

                      <div className="flex items-center justify-between pt-8 border-t border-amber-600/20 text-left text-[10px] text-slate-400">
                        <div>
                          <span>Date Issued: <strong className="text-slate-600 dark:text-slate-350">{generatedCert.dateIssued}</strong></span>
                          <span className="block mt-0.5">ID: <strong className="text-amber-600 font-mono">{generatedCert.id}</strong></span>
                        </div>
                        
                        <div className="text-right">
                          <span className="font-extrabold text-slate-700 dark:text-slate-350">Jaivignesh</span>
                          <span className="block italic text-[9px]">Academic Affairs Coordinator</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="py-24 text-center text-slate-400 space-y-4 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] flex flex-col items-center justify-center">
                      <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 shadow-inner">
                        <FileText className="h-8 w-8 text-slate-300 dark:text-slate-600" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800 dark:text-white">No active award preview selected</h4>
                        <p className="text-xs text-slate-400 mt-1 max-w-[280px] mx-auto">Complete the dispatch form to review credentials and visualize certificate alignments.</p>
                      </div>
                    </div>
                  )}
                </div>

              </div>

              {/* SMTP Email Delivery Status & Tracking Logs Table Section */}
              <div className="glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 space-y-6 text-left">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center space-x-2.5">
                      <BarChart3 className="h-5.5 w-5.5 text-purple-600 dark:text-purple-400" />
                      <span>SMTP Email Delivery Status & Tracking Logs</span>
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Real-time status of university mailers relaying secure digitally encrypted certificates.</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleResendFailed}
                    className="px-5 py-3 rounded-2xl bg-rose-50 dark:bg-rose-950/15 text-rose-600 dark:text-rose-455 hover:bg-rose-100 dark:hover:bg-rose-950/25 border border-rose-200/50 dark:border-rose-900/30 text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2 transition-all cursor-pointer"
                  >
                    <span>Resend Failed Emails</span>
                  </button>
                </div>

                <div className="overflow-x-auto rounded-2xl border border-slate-200/50 dark:border-white/5">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 dark:bg-white/2 border-b border-slate-200/50 dark:border-white/5 text-[10px] text-slate-450 font-black uppercase tracking-wider">
                        <th className="py-4 px-6">Recipient Student</th>
                        <th className="py-4 px-6">Email Address</th>
                        <th className="py-4 px-6">Certificate Type</th>
                        <th className="py-4 px-6">Email Status</th>
                        <th className="py-4 px-6">Sent Time</th>
                        <th className="py-4 px-6">Delivery Status</th>
                        <th className="py-4 px-6">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-white/5 font-sans">
                      {smtpLogs.map((log) => (
                        <tr key={log.id} className="hover:bg-slate-50/50 dark:hover:bg-white/1 font-medium text-slate-700 dark:text-slate-350 transition-colors">
                          <td className="py-4 px-6 font-extrabold text-slate-800 dark:text-white">{log.recipientName}</td>
                          <td className="py-4 px-6 font-mono text-[11px] text-slate-450">{log.email}</td>
                          <td className="py-4 px-6">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                              log.certType === 'Winner' 
                                ? 'bg-purple-100/50 border-purple-200 text-purple-700 dark:bg-purple-950/30 dark:border-purple-900/40 dark:text-purple-300'
                                : log.certType === 'Runner Up'
                                  ? 'bg-pink-100/50 border-pink-200 text-pink-700 dark:bg-pink-950/30 dark:border-pink-900/40 dark:text-pink-300'
                                  : 'bg-indigo-100/50 border-indigo-200 text-indigo-700 dark:bg-indigo-950/30 dark:border-indigo-900/40 dark:text-indigo-300'
                            }`}>
                              {log.certType}
                            </span>
                          </td>
                          <td className="py-4 px-6">
                            <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border ${
                              log.status === 'SENT SUCCESSFULLY'
                                ? 'bg-emerald-100/50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/30 dark:border-emerald-900/40 dark:text-emerald-300'
                                : log.status === 'FAILED'
                                  ? 'bg-rose-100/50 border-rose-200 text-rose-700 dark:bg-rose-950/30 dark:border-rose-900/40 dark:text-rose-300'
                                  : 'bg-amber-100/50 border-amber-200 text-amber-700 dark:bg-amber-950/30 dark:border-amber-900/40 dark:text-amber-300 animate-pulse'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${
                                log.status === 'SENT SUCCESSFULLY' ? 'bg-emerald-500' : log.status === 'FAILED' ? 'bg-rose-500' : 'bg-amber-500'
                              }`} />
                              <span>{log.status}</span>
                            </span>
                          </td>
                          <td className="py-4 px-6 text-[11px] text-slate-450">{log.sentTime}</td>
                          <td className="py-4 px-6 text-slate-450">{log.deliveryStatus}</td>
                          <td className="py-4 px-6">
                            <button
                              type="button"
                              onClick={() => handleResendSingle(log)}
                              className="px-3.5 py-1.5 rounded-xl border border-indigo-200 dark:border-indigo-800/40 bg-indigo-50/50 dark:bg-indigo-950/10 text-indigo-650 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-950/20 text-[10px] font-black uppercase tracking-wider transition-all duration-300 cursor-pointer"
                            >
                              Resend
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mail Template Preview Modal */}
              <AnimatePresence>
                {showMailTemplateModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="max-w-xl w-full bg-white dark:bg-[#0E132D] p-6 sm:p-8 rounded-[2.5rem] text-left border border-slate-200 dark:border-slate-850 shadow-2xl relative"
                    >
                      <button
                        onClick={() => setShowMailTemplateModal(false)}
                        className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 smooth-transition"
                      >
                        <X className="h-5 w-5" />
                      </button>

                      <h3 className="text-base font-black mb-4 text-slate-800 dark:text-white flex items-center space-x-2">
                        <Mail className="h-5 w-5 text-purple-500" />
                        <span>Official SMTP Email Template</span>
                      </h3>

                      <div className="space-y-4 font-sans text-xs">
                        <div className="p-3 bg-slate-50 dark:bg-white/5 rounded-xl space-y-1">
                          <p className="text-slate-400 uppercase font-black text-[9px]">Subject Line</p>
                          <p className="text-slate-800 dark:text-slate-200 font-bold">Your Certificate for [Event Name] - Aurora Fest 2026</p>
                        </div>

                        <div className="p-4 border border-slate-200 dark:border-white/5 rounded-xl bg-slate-50/50 dark:bg-slate-900/50 space-y-3 text-slate-650 dark:text-slate-300 leading-relaxed font-sans">
                          <p>Dear [Recipient Name],</p>
                          <p>Congratulations! Your certificate of <strong>[Honor Category]</strong> for the event <strong>"[Event Name]"</strong> has been officially issued.</p>
                          <p>
                            Credential ID: <strong>[Credential ID]</strong><br />
                            Date Issued: <strong>[Date Issued]</strong>
                          </p>
                          <p>You can view, download, and print your official digital certificate directly on the university portal:</p>
                          <p className="text-purple-600 dark:text-purple-400 font-mono text-[10px] break-all">
                            http://localhost:5173/certificate?certId=...
                          </p>
                          <div className="pt-4 border-t border-slate-200/50 dark:border-white/5">
                            <p className="font-bold text-slate-850 dark:text-white">Academic Affairs Coordinator</p>
                            <p className="text-[10px]">Aurora Deemed to be University</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-5">
                        <button
                          type="button"
                          onClick={() => setShowMailTemplateModal(false)}
                          className="px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider text-white bg-purple-650 hover:bg-purple-700 transition-all cursor-pointer"
                        >
                          Close Template Preview
                        </button>
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </div>
          )}
        </main>
      </div>

      {/* CRUD Popups - Published Modals */}
      <AnimatePresence>
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-2xl w-full bg-white dark:bg-[#0E132D] p-6 sm:p-8 rounded-[2.5rem] text-left border border-slate-200 dark:border-slate-850 shadow-2xl relative my-8"
            >
              <button
                onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}
                className="absolute right-6 top-6 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 smooth-transition"
              >
                <X className="h-5 w-5" />
              </button>

              <h2 className="text-xl font-black mb-6 text-slate-800 dark:text-white flex items-center space-x-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                <span>{showAddModal ? 'Publish New Fest Event' : 'Edit Event Profile'}</span>
              </h2>

              <form onSubmit={showAddModal ? handleAddSubmit : handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Event Title *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:outline-none text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                    placeholder="e.g. Speed Coding Showdown"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:outline-none text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Sports">Sports</option>
                    <option value="Workshops">Workshops</option>
                    <option value="Webinars">Webinars</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Type / Tag</label>
                  <input
                    type="text"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:outline-none text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                    placeholder="e.g. Coding Contest, Group Dance"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Scheduled Date *</label>
                  <input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:outline-none text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Timing</label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:outline-none text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                    placeholder="e.g. 10:00 AM onwards"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Venue Block *</label>
                  <input
                    type="text"
                    required
                    value={venue}
                    onChange={(e) => setVenue(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:outline-none text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                    placeholder="e.g. CSE Block Seminar Room"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Faculty Coordinator</label>
                  <input
                    type="text"
                    value={coordinator}
                    onChange={(e) => setCoordinator(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:outline-none text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                    placeholder="Dr. Sen (+91 987)"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Student Coordinator</label>
                  <input
                    type="text"
                    value={studentCoordinator}
                    onChange={(e) => setStudentCoordinator(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:outline-none text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                    placeholder="Rahul (+91 98)"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Price Ticket</label>
                  <input
                    type="text"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:outline-none text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                    placeholder="e.g. Free or ₹200 team"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Poster Image URL</label>
                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:outline-none text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>

                <div className="space-y-1 md:col-span-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Event Details *</label>
                  <textarea
                    required
                    rows="3"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-white/5 focus:outline-none text-xs text-slate-800 dark:text-white bg-white dark:bg-slate-900"
                    placeholder="Guidelines, prize distributions details..."
                  />
                </div>

                <div className="md:col-span-2 flex justify-end gap-3 pt-4 border-t border-slate-100 dark:border-white/5">
                  <button
                    type="button"
                    onClick={() => { setShowAddModal(false); setShowEditModal(false); resetForm(); }}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 smooth-transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl text-xs font-black uppercase text-white premium-glow-btn smooth-transition"
                  >
                    {showAddModal ? 'Publish Event' : 'Save Changes'}
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
