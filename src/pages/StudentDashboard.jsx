import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, Calendar, MapPin, QrCode, Bell, Award, CheckCircle2, Info, 
  Trash2, Sparkles, Clock, X, Menu, Layers, LogOut, UploadCloud, 
  ChevronRight, Edit, Users, BookOpen, Compass, ShieldAlert, Award as Trophy,
  Image
} from 'lucide-react';
import { Gallery } from './Gallery';

export const StudentDashboard = () => {
  const { currentUser, logout, updateProfile, joinClub, leaveClub, submitFeedback } = useAuth();
  const { events, getUserRegisteredEvents, unregisterFromEvent, registerForEvent } = useEvents();
  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Profile Form State
  const [profileName, setProfileName] = useState('');
  const [profilePhone, setProfilePhone] = useState('');
  const [profileYear, setProfileYear] = useState('');
  const [profileDept, setProfileDept] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [editMode, setEditMode] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  // Feedback State
  const [feedbackEventId, setFeedbackEventId] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackStatus, setFeedbackStatus] = useState('');

  // Certificate Modal State
  const [activeCertificate, setActiveCertificate] = useState(null);

  // Sync tab from URL query parameter
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tab = params.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [location]);

  // Route safety guard
  useEffect(() => {
    if (!currentUser || (currentUser.role !== 'student' && currentUser.role !== 'admin')) {
      navigate('/login');
    } else {
      setProfileName(currentUser.name || '');
      setProfilePhone(currentUser.phone || '');
      setProfileYear(currentUser.year || '1st Year');
      setProfileDept(currentUser.department || 'Computer Science & Engineering');
      setProfilePicture(currentUser.profilePicture || '');
    }
  }, [currentUser, navigate]);

  if (!currentUser || (currentUser.role !== 'student' && currentUser.role !== 'admin')) {
    return null;
  }

  const registeredEvents = getUserRegisteredEvents(currentUser.email);
  const joinedClubIds = currentUser.joinedClubs || [];

  // Mock Clubs List
  const clubs = [
    { id: 'coding', name: 'Turing Coding Club', category: 'Technical', members: '450+', coordinator: 'Dr. Vivek Saini' },
    { id: 'robotics', name: 'Tesla Robotics Club', category: 'Technical', members: '280+', coordinator: 'Prof. Alok Mehta' },
    { id: 'dance', name: 'Mudras Dance Club', category: 'Cultural', members: '320+', coordinator: 'Mrs. Rekha Sen' },
    { id: 'music', name: 'Symphony Music Club', category: 'Cultural', members: '210+', coordinator: 'Mr. Shivam Vyas' },
    { id: 'cultural', name: 'Spandan Cultural Society', category: 'Cultural', members: '380+', coordinator: 'Mrs. Ritu Sharma' },
    { id: 'sports', name: 'Gladiators Sports Club', category: 'Sports', members: '520+', coordinator: 'Mr. Sunil Gavaskar' },
    { id: 'photography', name: 'Shutter Society', category: 'Creative', members: '240+', coordinator: 'Ms. Nisha Kapoor' }
  ];

  // Mock Notifications
  const [notifications, setNotifications] = useState([
    { id: 1, text: 'Aurora Hackathon 2026 team allocations finalized. Check your registered mail.', time: '2 hours ago', type: 'info' },
    { id: 2, text: 'Mudras dance club practice session scheduled at Auditorium (4:00 PM today).', time: '5 hours ago', type: 'alert' },
    { id: 3, text: 'Generative AI Developer Bootcamp starts on May 25. Bring your laptops.', time: '1 day ago', type: 'info' }
  ]);

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleCancelRegistration = (eventId) => {
    unregisterFromEvent(currentUser.email, eventId);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    const result = updateProfile({
      name: profileName,
      phone: profilePhone,
      year: profileYear,
      department: profileDept,
      profilePicture: profilePicture
    });

    if (result.success) {
      setSaveStatus('Profile updated successfully!');
      setEditMode(false);
      setTimeout(() => setSaveStatus(''), 3000);
    }
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicture(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFeedbackSubmit = (e) => {
    e.preventDefault();
    const eventObj = registeredEvents.find(e => e.id === feedbackEventId);
    if (!eventObj) return;

    submitFeedback(feedbackEventId, eventObj.title, feedbackRating, feedbackText);
    setFeedbackStatus('Feedback submitted! Thank you.');
    setFeedbackEventId(null);
    setFeedbackText('');
    setTimeout(() => setFeedbackStatus(''), 3000);
  };

  const getDaysLeft = (eventDate) => {
    const diff = new Date(eventDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return days > 0 ? `${days} days left` : 'Happening Today';
  };

  const sidebarItems = [
    { id: 'home', label: 'Dashboard Home', icon: Layers },
    { id: 'events', label: 'Registered Events', icon: Calendar },
    { id: 'clubs', label: 'Campus Clubs', icon: Users },
    { id: 'calendar', label: 'Interactive Calendar', icon: BookOpen },
    { id: 'gallery', label: 'Highlights Gallery', icon: Image },
    { id: 'pass', label: 'Digital QR Pass', icon: QrCode },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'activities', label: 'Activities & Achievements', icon: Award }
  ];

  return (
    <div className="relative w-full min-h-screen flex bg-slate-50 dark:bg-[#070913] text-slate-800 dark:text-slate-100 transition-colors duration-300 font-sans text-left">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-45 w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800/80 transform lg:transform-none lg:opacity-100 transition-all duration-300 flex flex-col justify-between ${isSidebarOpen ? 'translate-x-0 opacity-100' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          {/* Brand Header */}
          <div className="p-6 border-b border-slate-200 dark:border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-black shadow-lg shadow-orange-500/20">
                A
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-orange-600 to-amber-500 bg-clip-text text-transparent">Aurora Portal</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1">
            {sidebarItems.map(item => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); navigate(`/dashboard?tab=${item.id}`); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all cursor-pointer ${activeTab === item.id ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25' : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                  <Icon className="h-5 w-5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User Account / Logout */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center space-x-3 p-2 mb-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl" onClick={() => { setActiveTab('profile'); navigate('/dashboard?tab=profile'); }}>
            {profilePicture ? (
              <img src={profilePicture} className="w-10 h-10 rounded-full object-cover border border-orange-500" alt="Avatar" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-950/50 border border-orange-200 dark:border-orange-900/50 flex items-center justify-center text-orange-600 dark:text-orange-400 font-bold uppercase">
                {currentUser.name.substring(0, 2)}
              </div>
            )}
            <div className="text-left overflow-hidden">
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">{currentUser.name}</h4>
              <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
            </div>
          </div>
          
          {currentUser && currentUser.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              className="w-full mb-3 flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-indigo-650 dark:text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500 hover:text-white transition-all cursor-pointer"
            >
              <Compass className="h-4 w-4" />
              <span>Admin Dashboard</span>
            </button>
          )}

          <button
            onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Panel Area */}
      <div className="flex-1 lg:pl-64 min-h-screen flex flex-col relative overflow-x-hidden">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800/80">
          <div className="flex items-center space-x-3">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800">
              <Menu className="h-6 w-6" />
            </button>
            <h2 className="text-xl font-extrabold text-slate-800 dark:text-white capitalize">{activeTab.replace('_', ' ')}</h2>
          </div>

          <div className="flex items-center space-x-4">
            <span className="hidden sm:inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-orange-100 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400 border border-orange-200 dark:border-orange-900/30">
              {currentUser.year} - {currentUser.department.split(' ')[0]}
            </span>

            {/* Notification Dropdown */}
            <div className="relative">
              <button onClick={() => setShowNotifications(!showNotifications)} className="relative p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer">
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
                )}
              </button>

              <AnimatePresence>
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-4 z-50 text-left">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Campus Alerts</h4>
                      <button onClick={() => setShowNotifications(false)} className="text-slate-400 hover:text-slate-600"><X className="h-4 w-4" /></button>
                    </div>
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No notifications</p>
                    ) : (
                      <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                        {notifications.map(notif => (
                          <div key={notif.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2">
                            <div className="text-[11px] leading-relaxed">
                              <p className="text-slate-650 dark:text-slate-300 font-medium">{notif.text}</p>
                              <span className="text-[9px] text-slate-400 block mt-1">{notif.time}</span>
                            </div>
                            <button onClick={() => removeNotification(notif.id)} className="text-slate-400 hover:text-rose-500 shrink-0"><X className="h-3.5 w-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-grow p-6 space-y-8 max-w-full w-full mx-auto px-4 sm:px-8 lg:px-12">
          
          {/* TAB 1: Dashboard Home */}
          {activeTab === 'home' && (
            <div className="space-y-8 animate-fadeIn">

              {/* Welcome Info Banner */}
              <div className="relative rounded-[2rem] p-6 md:p-8 premium-gradient-profile overflow-hidden shadow-2xl transition-all duration-500 border border-slate-200/50 dark:border-white/5">
                <div className="absolute -right-10 -bottom-10 w-96 h-96 rounded-full bg-gradient-to-tr from-purple-500/10 via-pink-500/10 to-cyan-500/10 blur-3xl pointer-events-none" />
                <div className="relative z-10 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xs uppercase tracking-widest font-black text-purple-600 dark:text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full border border-purple-500/20">Student Dashboard</span>
                    <h1 className="text-2xl md:text-4xl font-black text-slate-800 dark:text-white">Welcome, {currentUser.name}!</h1>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xl font-medium font-sans">
                    Manage your campus event registrations, view your electronic gate pass, join academic/creative clubs, and view achievements.
                  </p>
                </div>
              </div>
              {/* Statistics Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: 'Registered Events', value: registeredEvents.length, icon: Calendar, color: 'from-orange-500 to-amber-500' },
                  { title: 'Upcoming Events', value: registeredEvents.filter(e => new Date(e.date) >= new Date()).length, icon: Clock, color: 'from-blue-500 to-cyan-500' },
                  { title: 'Joined Clubs', value: joinedClubIds.length, icon: Users, color: 'from-purple-500 to-pink-500' },
                  { title: 'Achievements', value: (currentUser.achievements || []).length, icon: Trophy, color: 'from-emerald-500 to-teal-500' }
                ].map((stat, idx) => {
                  const Icon = stat.icon;
                  return (
                    <div key={idx} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 flex items-center space-x-4 shadow-sm hover:scale-[1.02] transition-all duration-300">
                      <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${stat.color} flex items-center justify-center text-white shrink-0 shadow-lg shadow-black/5`}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">{stat.title}</p>
                        <h3 className="text-2xl font-black mt-1 text-slate-800 dark:text-white">{stat.value}</h3>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Home Main Sections */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Left Side: Upcoming Events & Club Updates */}
                <div className="lg:col-span-8 space-y-8">
                  {/* Quick Action Buttons */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm">
                    <h3 className="text-base font-black text-slate-800 dark:text-white mb-4">Quick Actions</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <button onClick={() => navigate('/events')} className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold uppercase rounded-xl transition-all cursor-pointer text-center">
                        Browse Events
                      </button>
                      <button onClick={() => setActiveTab('clubs')} className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold uppercase rounded-xl transition-all cursor-pointer text-center">
                        Join Clubs
                      </button>
                      <button onClick={() => setActiveTab('pass')} className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold uppercase rounded-xl transition-all cursor-pointer text-center">
                        View QR Pass
                      </button>
                      <button onClick={() => setActiveTab('profile')} className="py-3 px-4 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-extrabold uppercase rounded-xl transition-all cursor-pointer text-center">
                        Edit Profile
                      </button>
                    </div>
                  </div>

                  {/* Registered Events (Quick View) */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-base font-black text-slate-800 dark:text-white">Active Registrations</h3>
                      <button onClick={() => setActiveTab('events')} className="text-xs font-extrabold text-orange-500 hover:text-orange-655 flex items-center space-x-1 cursor-pointer">
                        <span>View All</span>
                        <ChevronRight className="h-3 w-3" />
                      </button>
                    </div>

                    {registeredEvents.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-slate-350 dark:border-slate-850 rounded-3xl space-y-3 bg-white dark:bg-slate-900">
                        <Info className="h-6 w-6 text-slate-400 mx-auto" />
                        <p className="text-xs text-slate-500 font-semibold">You haven't registered for any events yet.</p>
                        <button onClick={() => navigate('/events')} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold hover:bg-orange-600 transition-all cursor-pointer">
                          Find Events
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {registeredEvents.slice(0, 3).map(event => (
                          <div key={event.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex items-center justify-between hover:shadow-md transition-all">
                            <div className="flex items-center space-x-4 overflow-hidden">
                              <img src={event.image} className="w-12 h-12 rounded-xl object-cover shrink-0" alt={event.title} />
                              <div className="overflow-hidden">
                                <h4 className="font-extrabold text-sm text-slate-800 dark:text-white truncate">{event.title}</h4>
                                <p className="text-xs text-slate-400 flex items-center mt-0.5"><Clock className="h-3.5 w-3.5 mr-1" /> {event.date} • {event.venue}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-black uppercase text-orange-600 bg-orange-500/10 border border-orange-500/20 px-2.5 py-1 rounded-md shrink-0 ml-3">
                              {getDaysLeft(event.date)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Joined Clubs Section */}
                  <div className="space-y-4">
                    <h3 className="text-base font-black text-slate-800 dark:text-white">My Clubs</h3>
                    {joinedClubIds.length === 0 ? (
                      <div className="p-8 text-center border border-dashed border-slate-350 dark:border-slate-850 rounded-3xl space-y-3 bg-white dark:bg-slate-900">
                        <Users className="h-6 w-6 text-slate-400 mx-auto" />
                        <p className="text-xs text-slate-500 font-semibold font-sans">You haven't joined any campus clubs yet.</p>
                        <button onClick={() => setActiveTab('clubs')} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer">
                          Explore Clubs
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {clubs.filter(c => joinedClubIds.includes(c.id)).map(club => (
                          <div key={club.id} className="p-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl flex items-center justify-between">
                            <div>
                              <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">{club.name}</h4>
                              <p className="text-xs text-slate-400 mt-0.5">{club.category} Club • {club.members} Members</p>
                            </div>
                            <button onClick={() => { leaveClub(club.id, club.name); }} className="text-xs font-black text-rose-500 hover:underline cursor-pointer">
                              Leave
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Side: Alerts/Notifications & Entry Pass Panel */}
                <div className="lg:col-span-4 space-y-8">
                  {/* Notifications inline */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm">
                    <h3 className="text-base font-black text-slate-800 dark:text-white mb-4">Recent Notifications</h3>
                    {notifications.length === 0 ? (
                      <p className="text-xs text-slate-400 text-center py-4">No recent notifications.</p>
                    ) : (
                      <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                        {notifications.map(notif => (
                          <div key={notif.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start justify-between gap-2">
                            <div className="text-[11px] leading-relaxed">
                              <p className="text-slate-600 dark:text-slate-300 font-semibold">{notif.text}</p>
                              <span className="text-[9px] text-slate-400 block mt-1">{notif.time}</span>
                            </div>
                            <button onClick={() => removeNotification(notif.id)} className="text-slate-400 hover:text-rose-500 shrink-0 cursor-pointer"><X className="h-3.5 w-3.5" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* QR entry pass sneak view */}
                  <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 text-center space-y-4 shadow-sm relative overflow-hidden">
                    <div className="relative w-36 h-36 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-3 mx-auto shadow-inner overflow-hidden">
                      <svg viewBox="0 0 100 100" className="w-full h-full fill-slate-850 dark:fill-slate-200">
                        <rect x="0" y="0" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="4" y="4" width="14" height="14" />
                        <rect x="78" y="0" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="82" y="4" width="14" height="14" />
                        <rect x="0" y="78" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="6" />
                        <rect x="4" y="82" width="14" height="14" />
                        <rect x="35" y="10" width="10" height="5" /><rect x="50" y="5" width="5" height="15" />
                        <rect x="35" y="25" width="15" height="5" /><rect x="60" y="20" width="10" height="10" />
                        <rect x="10" y="35" width="15" height="10" /><rect x="40" y="45" width="5" height="15" />
                        <rect x="15" y="60" width="20" height="5" /><rect x="50" y="70" width="25" height="10" />
                        <rect x="30" y="80" width="15" height="15" /><rect x="80" y="45" width="15" height="20" />
                      </svg>
                      <div className="absolute left-0 right-0 h-0.5 bg-orange-500 shadow-[0_0_10px_#f97316] qr-scanner-line pointer-events-none" />
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase text-slate-800 dark:text-slate-200 tracking-widest">{currentUser.rollNo}</p>
                      <p className="text-[10px] text-slate-400 mt-1">Scan QR code at the gate checkpoints for quick access.</p>
                    </div>
                    <button onClick={() => setActiveTab('pass')} className="w-full py-2.5 rounded-xl text-xs font-bold text-orange-500 bg-orange-500/10 hover:bg-orange-500 hover:text-white transition-all cursor-pointer">
                      View QR Pass
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Registered Events */}
          {activeTab === 'events' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-lg font-black text-slate-800 dark:text-white">Active Registrations ({registeredEvents.length})</h3>
                  <p className="text-xs text-slate-400 mt-1">Below are the events you are currently registered for.</p>
                </div>
                <Link to="/events" className="px-4 py-2.5 rounded-xl text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 transition-all cursor-pointer">
                  Find More Events
                </Link>
              </div>

              {registeredEvents.length === 0 ? (
                <div className="p-12 text-center border border-dashed border-slate-300 dark:border-slate-800 rounded-[2.5rem] bg-white dark:bg-slate-900 space-y-4">
                  <Calendar className="h-8 w-8 text-slate-450 mx-auto" />
                  <h4 className="text-base font-bold text-slate-850 dark:text-white">No Registered Events Found</h4>
                  <Link to="/events" className="inline-block px-6 py-3 rounded-full text-xs font-black uppercase text-white bg-orange-500 hover:bg-orange-600 transition-all cursor-pointer">
                    Search Events Listings
                  </Link>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {registeredEvents.map(event => (
                    <div key={event.id} className="group bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 hover:shadow-md transition-all flex flex-col justify-between">
                      <div className="space-y-4">
                        <div className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                          <img src={event.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={event.title} />
                          <span className="absolute top-3 right-3 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-black/60 backdrop-blur-md text-white border border-white/10">
                            {event.category}
                          </span>
                        </div>

                        <div className="space-y-1">
                          <span className="text-[10px] font-extrabold text-orange-500 uppercase tracking-widest">{event.type}</span>
                          <h4 className="text-base font-black text-slate-800 dark:text-white line-clamp-1">{event.title}</h4>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs text-slate-500 dark:text-slate-400 border-t border-slate-100 dark:border-slate-800 pt-3">
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Scheduled</span>
                            <p className="font-semibold text-slate-700 dark:text-slate-300">{event.date}</p>
                          </div>
                          <div>
                            <span className="text-[10px] text-slate-400 block uppercase font-bold">Location</span>
                            <p className="font-semibold text-slate-700 dark:text-slate-300 truncate">{event.venue}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100 dark:border-slate-800">
                        <Link to={`/events/${event.id}`} className="flex-1 text-center py-2.5 rounded-xl text-xs font-bold text-slate-750 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all cursor-pointer">
                          View Details
                        </Link>
                        <button
                          onClick={() => handleCancelRegistration(event.id)}
                          className="px-4 py-2.5 rounded-xl text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Campus Clubs */}
          {activeTab === 'clubs' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white">Campus Club Memberships</h3>
                <p className="text-xs text-slate-400 mt-1">Enroll inside creative and academic student societies to unlock event coordinator privileges.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clubs.map(club => {
                  const isJoined = joinedClubIds.includes(club.id);
                  return (
                    <div key={club.id} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-3xl p-5 flex flex-col justify-between hover:shadow-md transition-all">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-black uppercase text-purple-650 bg-purple-500/10 border border-purple-500/20 px-2.5 py-1 rounded-md">
                            {club.category}
                          </span>
                          <span className="text-xs text-slate-400 font-bold">{club.members} Members</span>
                        </div>
                        <h4 className="font-extrabold text-base text-slate-850 dark:text-white">{club.name}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Coordinator: <strong className="text-slate-700 dark:text-slate-300">{club.coordinator}</strong></p>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-800/80 flex justify-end">
                        {isJoined ? (
                          <button
                            onClick={() => leaveClub(club.id, club.name)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all cursor-pointer"
                          >
                            Leave Club
                          </button>
                        ) : (
                          <button
                            onClick={() => joinClub(club.id, club.name)}
                            className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-all cursor-pointer"
                          >
                            Join Club
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: Interactive Calendar */}
          {activeTab === 'calendar' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <h3 className="text-lg font-black text-slate-800 dark:text-white">Festival Calendar</h3>
                <p className="text-xs text-slate-400 mt-1">Review the festival timelines and see your schedule on May 24, 25, and 26, 2026.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { day: 'Day 1', date: '2026-05-24', label: 'May 24, 2026' },
                  { day: 'Day 2', date: '2026-05-25', label: 'May 25, 2026' },
                  { day: 'Day 3', date: '2026-05-26', label: 'May 26, 2026' }
                ].map((dObj) => {
                  const dayRegs = registeredEvents.filter(e => e.date === dObj.date);
                  return (
                    <div key={dObj.day} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 text-left flex flex-col justify-between min-h-[300px]">
                      <div>
                        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                          <span className="text-xs font-extrabold text-orange-500 uppercase tracking-wider">{dObj.day}</span>
                          <h4 className="font-extrabold text-sm text-slate-800 dark:text-white">{dObj.label}</h4>
                        </div>

                        {dayRegs.length === 0 ? (
                          <p className="text-xs text-slate-400 italic py-8 text-center">No registered events for this day.</p>
                        ) : (
                          <div className="space-y-3">
                            {dayRegs.map(evt => (
                              <div key={evt.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 rounded-xl space-y-1">
                                <h5 className="font-extrabold text-xs text-slate-800 dark:text-white line-clamp-1">{evt.title}</h5>
                                <p className="text-[10px] text-slate-400 flex items-center"><Clock className="h-3 w-3 mr-1 shrink-0" /> {evt.time || '10:00 AM onwards'}</p>
                                <p className="text-[10px] text-slate-400 flex items-center"><MapPin className="h-3 w-3 mr-1 shrink-0" /> {evt.venue}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <button onClick={() => navigate('/events')} className="w-full mt-4 py-2 rounded-xl text-xs font-bold text-center bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-all cursor-pointer">
                        Add Events
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 5: Digital QR Pass */}
          {activeTab === 'pass' && (
            <div className="w-full max-w-4xl mx-auto animate-fadeIn py-6">
              
              {/* Premium Horizontal Ticket Pass Container */}
              <div className="flex flex-col md:flex-row w-full rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-slate-800/80 shadow-2xl relative bg-white dark:bg-slate-900">
                
                {/* Left Side: Purple/Indigo Gradient Showpiece */}
                <div className="flex-1 bg-gradient-to-br from-slate-950 via-[#2e1065] to-[#4d0781] text-white p-8 sm:p-10 flex flex-col justify-between relative overflow-hidden min-h-[300px]">
                  {/* Decorative mesh glows */}
                  <div className="absolute -top-20 -left-20 w-60 h-60 rounded-full bg-pink-500/10 blur-[80px] pointer-events-none" />
                  <div className="absolute -bottom-20 right-0 w-60 h-60 rounded-full bg-cyan-500/10 blur-[80px] pointer-events-none" />

                  {/* Top Header */}
                  <div className="relative z-10 space-y-2">
                    <span className="text-[10px] tracking-[0.25em] font-black text-orange-400 uppercase bg-orange-500/10 border border-orange-500/20 px-3 py-1 rounded-full w-fit block">
                      Aurora Mega Fest
                    </span>
                    <h2 className="text-3xl sm:text-4xl font-serif font-black tracking-tight leading-none text-white mt-3">AURA 2026</h2>
                    <p className="text-xs text-slate-300 font-medium tracking-wide">University Entrance Gate Pass</p>
                  </div>

                  {/* Center branding */}
                  <div className="relative z-10 py-6">
                    <div className="border-l-2 border-orange-500 pl-4 space-y-1">
                      <span className="text-[10px] tracking-widest font-black uppercase text-slate-400 block">EVENT TICKET</span>
                      <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-white">YOUR ENTRY PASS</h3>
                    </div>
                  </div>

                  {/* Registered events listing inside ticket details */}
                  <div className="relative z-10 border-t border-white/10 pt-4 space-y-2.5">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Access Authorized For:</span>
                    {registeredEvents.length === 0 ? (
                      <p className="text-xs text-slate-450 italic">No events registered yet</p>
                    ) : (
                      <div className="flex flex-wrap gap-2 max-h-24 overflow-y-auto">
                        {registeredEvents.map(evt => (
                          <span key={evt.id} className="text-[10px] font-bold px-2.5 py-1 bg-white/10 border border-white/10 rounded-lg text-white">
                            {evt.title}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Dashed Line Ticket Separator (Punch Hole style) */}
                <div className="relative flex md:flex-col justify-center items-center py-4 md:py-0">
                  {/* Punch Hole Top */}
                  <div className="hidden md:block absolute -top-4 -left-3.5 w-7 h-7 rounded-full bg-slate-50 dark:bg-[#070913] border-b border-slate-200 dark:border-slate-800/80 z-20" />
                  {/* Punch Hole Bottom */}
                  <div className="hidden md:block absolute -bottom-4 -left-3.5 w-7 h-7 rounded-full bg-slate-50 dark:bg-[#070913] border-t border-slate-200 dark:border-slate-800/80 z-20" />
                  {/* Vertical dashed line */}
                  <div className="hidden md:block h-full border-l-2 border-dashed border-slate-200 dark:border-slate-800" />
                  <div className="md:hidden w-full border-t-2 border-dashed border-slate-200 dark:border-slate-800" />
                </div>

                {/* Right Side: Pass Details & QR Code (Pink Bokeh theme) */}
                <div className="w-full md:w-96 bg-gradient-to-br from-pink-500/10 via-amber-500/5 to-purple-500/10 p-8 flex flex-col justify-between items-center space-y-6 shrink-0 relative">
                  
                  {/* Ticket Details */}
                  <div className="text-center w-full">
                    <span className="text-[10px] tracking-widest font-black uppercase text-orange-500 block mb-1">Admit One</span>
                    <h4 className="text-2xl font-black text-slate-900 dark:text-white leading-tight truncate px-2">{currentUser.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5 font-medium">{currentUser.college}</p>
                  </div>

                  {/* QR Image Box */}
                  <div className="relative w-44 h-44 bg-white rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-center p-4 shadow-md overflow-hidden shrink-0">
                    <img 
                      src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&color=0f172a&bgcolor=ffffff&qzone=1&data=${encodeURIComponent(
                        JSON.stringify({
                          name: currentUser.name,
                          email: currentUser.email,
                          phone: currentUser.phone || 'N/A',
                          rollNo: currentUser.rollNo,
                          department: currentUser.department,
                          year: currentUser.year,
                          college: currentUser.college,
                          totalEvents: registeredEvents.length,
                          events: registeredEvents.map(e => ({ id: e.id, title: e.title, date: e.date, venue: e.venue }))
                        })
                      )}`} 
                      alt="Gate Pass QR Code" 
                      className="w-full h-full object-contain"
                    />
                    <div className="absolute left-0 right-0 h-1 bg-orange-500 shadow-[0_0_12px_#f97316] qr-scanner-line pointer-events-none" />
                  </div>

                  {/* Details Grid (Seat/Row/Gate styled layout) */}
                  <div className="grid grid-cols-3 gap-2 w-full text-center">
                    <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Dept</span>
                      <span className="text-xs font-black text-slate-800 dark:text-white">{currentUser.department.split(' ')[0]}</span>
                    </div>
                    <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Year</span>
                      <span className="text-xs font-black text-slate-800 dark:text-white">{currentUser.year.split(' ')[0]}</span>
                    </div>
                    <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5">
                      <span className="text-[9px] uppercase tracking-wider text-slate-400 font-bold block">Status</span>
                      <span className="text-xs font-black text-emerald-500">Verified</span>
                    </div>
                  </div>

                  {/* ID Footer */}
                  <div className="text-center text-[10px] text-slate-400 font-semibold font-mono w-full border-t border-slate-200 dark:border-slate-800 pt-3">
                    ID: {currentUser.rollNo}
                  </div>
                </div>

              </div>
              <p className="text-[10px] text-slate-400 italic text-center mt-4">Please present this pass at university security checkpoints. Screenshots of this code are acceptable.</p>
            </div>
          )}

          {/* TAB 6: My Profile Settings */}
          {activeTab === 'profile' && (
            <div className="max-w-2xl mx-auto space-y-6 animate-fadeIn">

              {/* Save Status Toast */}
              {saveStatus && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 rounded-2xl text-sm font-bold text-center flex items-center justify-center gap-2 shadow-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  {saveStatus}
                </div>
              )}

              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-sm">

                {/* Form Header */}
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-6">
                  <div>
                    <h3 className="text-base font-black text-slate-800 dark:text-white">Profile Details</h3>
                    <p className="text-xs text-slate-400 mt-0.5">Manage your official student identity.</p>
                  </div>
                  {!editMode ? (
                    <button type="button" onClick={() => setEditMode(true)}
                      className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-sm">
                      <Edit className="w-3.5 h-3.5" /> Edit Profile
                    </button>
                  ) : (
                    <button type="button" onClick={() => setEditMode(false)}
                      className="px-4 py-2 text-rose-500 bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold rounded-xl transition-all cursor-pointer">
                      Cancel
                    </button>
                  )}
                </div>

                <form onSubmit={handleProfileSave} className="space-y-6">

                  {/* Avatar Upload */}
                  <div className="flex flex-col items-center space-y-3 mb-6">
                    <div className="relative">
                      {profilePicture ? (
                        <img src={profilePicture} className="w-24 h-24 rounded-2xl object-cover border-4 border-slate-100 dark:border-slate-800 shadow-md" alt="Avatar" />
                      ) : (
                        <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-400 text-white flex items-center justify-center font-black text-3xl shadow-md border-4 border-slate-100 dark:border-slate-800">
                          {currentUser.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}
                      {editMode && (
                        <label className="absolute -bottom-2 -right-2 w-8 h-8 bg-orange-500 hover:bg-orange-600 rounded-full flex items-center justify-center cursor-pointer shadow-md transition-all">
                          <UploadCloud className="h-4 w-4 text-white" />
                          <input type="file" accept="image/*" className="hidden" onChange={handleProfilePicChange} />
                        </label>
                      )}
                    </div>
                    {editMode && (
                      <p className="text-[10px] text-slate-400 font-medium">Click the icon to upload a new profile image.</p>
                    )}
                  </div>

                  {/* Form Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Full Name</label>
                      <input type="text" disabled={!editMode} value={profileName}
                        onChange={(e) => setProfileName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/65 focus:outline-none focus:ring-2 focus:ring-orange-500/40 text-slate-800 dark:text-white text-sm disabled:opacity-60 font-semibold transition-all" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Contact Number</label>
                      <input type="text" disabled={!editMode} value={profilePhone}
                        onChange={(e) => setProfilePhone(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/65 focus:outline-none focus:ring-2 focus:ring-orange-500/40 text-slate-800 dark:text-white text-sm disabled:opacity-60 font-semibold transition-all" />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Department</label>
                      <select disabled={!editMode} value={profileDept} onChange={(e) => setProfileDept(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/65 focus:outline-none focus:ring-2 focus:ring-orange-500/40 text-slate-800 dark:text-white text-sm disabled:opacity-60 font-semibold transition-all">
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Electronics & Communication">Electronics & Communication</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Electrical & Electronics">Electrical & Electronics</option>
                        <option value="Business Administration (MBA)">Business Administration (MBA)</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Current Year</label>
                      <select disabled={!editMode} value={profileYear} onChange={(e) => setProfileYear(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950/65 focus:outline-none focus:ring-2 focus:ring-orange-500/40 text-slate-800 dark:text-white text-sm disabled:opacity-60 font-semibold transition-all">
                        <option value="1st Year">1st Year</option>
                        <option value="2nd Year">2nd Year</option>
                        <option value="3rd Year">3rd Year</option>
                        <option value="4th Year">4th Year</option>
                      </select>
                    </div>

                    <div className="space-y-1.5 opacity-60">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">College Pass ID (Read-only)</label>
                      <input type="text" disabled value={currentUser.rollNo}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 text-sm font-mono" />
                    </div>

                    <div className="space-y-1.5 opacity-60">
                      <label className="text-[10px] font-black uppercase tracking-wider text-slate-400">Email Address (Read-only)</label>
                      <input type="text" disabled value={currentUser.email}
                        className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-500 text-sm font-semibold truncate" />
                    </div>
                  </div>

                  {/* Save Button */}
                  {editMode && (
                    <button type="submit"
                      className="w-full py-3.5 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black uppercase rounded-xl shadow-lg shadow-orange-500/20 cursor-pointer transition-all text-sm tracking-wide">
                      Save Profile Changes
                    </button>
                  )}
                </form>

              </div>
            </div>
          )}

          {/* TAB 7: Activities, Certificates & Feedback */}
          {activeTab === 'activities' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left animate-fadeIn">
              
              {/* Left Column: Achievements, Activity Timeline (7 Columns) */}
              <div className="lg:col-span-7 space-y-8">
                {/* Achievements Badges */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm">
                  <h3 className="text-base font-black text-slate-800 dark:text-white mb-4">Earned Badges</h3>
                  <div className="flex flex-wrap gap-3">
                    {(currentUser.achievements || ['First Registration']).map(badge => (
                      <span key={badge} className="px-4 py-2 bg-gradient-to-tr from-amber-500/10 to-orange-500/10 border border-orange-500/20 text-orange-655 text-xs font-bold rounded-full flex items-center gap-1.5 shadow-sm">
                        <Trophy className="h-4 w-4 text-orange-500 shrink-0" />
                        <span>{badge}</span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Event Feedback Section */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm">
                  <h3 className="text-base font-black text-slate-800 dark:text-white mb-2">Submit Event Feedback</h3>
                  <p className="text-xs text-slate-400 mb-4">Help us improve by leaving feedback for events you registered for.</p>

                  {feedbackStatus && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-xl text-xs font-bold text-center mb-4">
                      {feedbackStatus}
                    </div>
                  )}

                  {registeredEvents.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">No events available to provide feedback.</p>
                  ) : (
                    <form onSubmit={handleFeedbackSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <select
                          required
                          value={feedbackEventId || ''}
                          onChange={(e) => setFeedbackEventId(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-slate-800 dark:bg-slate-950 text-xs font-semibold"
                        >
                          <option value="">Select Event...</option>
                          {registeredEvents.map(e => (
                            <option key={e.id} value={e.id}>{e.title}</option>
                          ))}
                        </select>
                        <select
                          value={feedbackRating}
                          onChange={(e) => setFeedbackRating(Number(e.target.value))}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-slate-800 dark:bg-slate-950 text-xs font-semibold"
                        >
                          <option value={5}>⭐⭐⭐⭐⭐ (5/5)</option>
                          <option value={4}>⭐⭐⭐⭐ (4/5)</option>
                          <option value={3}>⭐⭐⭐ (3/5)</option>
                          <option value={2}>⭐⭐ (2/5)</option>
                          <option value={1}>⭐ (1/5)</option>
                        </select>
                      </div>
                      <textarea
                        required
                        placeholder="Write a brief comment about your experience..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                        className="w-full p-4 rounded-xl border border-slate-350 dark:border-slate-800 dark:bg-slate-950 text-xs font-medium focus:outline-none min-h-[80px]"
                      />
                      <button type="submit" className="px-5 py-2.5 bg-orange-500 hover:bg-orange-655 text-white text-xs font-bold rounded-xl transition-all cursor-pointer">
                        Submit Review
                      </button>
                    </form>
                  )}
                </div>

                {/* Activity History */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm">
                  <h3 className="text-base font-black text-slate-800 dark:text-white mb-4">Activity Timeline</h3>
                  <div className="space-y-4">
                    {(currentUser.activityHistory || []).map((act, index) => (
                      <div key={act.id || index} className="relative pl-6 pb-4 border-l border-slate-200 dark:border-slate-800 last:border-transparent last:pb-0">
                        <div className="absolute -left-1.5 top-1.5 w-3 h-3 rounded-full bg-orange-500 border border-white dark:border-slate-900 shadow" />
                        <div className="text-xs">
                          <p className="text-slate-700 dark:text-slate-200 font-semibold">{act.text}</p>
                          <span className="text-[10px] text-slate-400 block mt-0.5">{act.time}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Certificates, Attendance Logs (5 Columns) */}
              <div className="lg:col-span-5 space-y-8">
                {/* Certificates Desk */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm space-y-5">
                  <div className="flex items-center space-x-2 text-slate-850 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                    <Award className="h-5 w-5 text-orange-500" />
                    <h3 className="text-base font-black">Digital Certificates</h3>
                  </div>

                  {registeredEvents.length === 0 ? (
                    <p className="text-xs text-slate-400 italic">Participate in events to unlock credentials.</p>
                  ) : (
                    <div className="space-y-3">
                      {registeredEvents.map(evt => (
                        <div key={evt.id} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-150 dark:border-slate-800 flex items-center justify-between">
                          <div>
                            <h4 className="text-xs font-black text-slate-800 dark:text-slate-200">{evt.title}</h4>
                            <p className="text-[10px] text-slate-400 mt-0.5">Checked-in: May 2026</p>
                          </div>
                          <button 
                            onClick={() => setActiveCertificate({
                              certId: `AUR-CERT-${evt.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
                              studentName: currentUser.name,
                              eventName: evt.title,
                              rollNo: currentUser.rollNo,
                              date: new Date(evt.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
                            })}
                            className="px-3.5 py-1.5 rounded-xl text-[10px] font-black uppercase text-orange-500 bg-orange-500/10 border border-orange-500/20 hover:bg-orange-500 hover:text-white transition-all cursor-pointer"
                          >
                            Claim
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Event Attendance Mock */}
                <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2.5rem] p-6 shadow-sm space-y-4">
                  <h3 className="text-base font-black text-slate-800 dark:text-white">Attendance Log</h3>
                  <div className="space-y-3">
                    {registeredEvents.map(evt => (
                      <div key={evt.id} className="flex items-center justify-between text-xs font-medium">
                        <span className="text-slate-600 dark:text-slate-350 truncate max-w-[200px]">{evt.title}</span>
                        <span className="flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-500/20 text-[10px] font-bold">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Checked-in
                        </span>
                      </div>
                    ))}
                    {registeredEvents.length === 0 && (
                      <p className="text-xs text-slate-400 italic">No attendance records found.</p>
                    )}
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 8: Gallery */}
          {activeTab === 'gallery' && (
            <div className="animate-fadeIn">
              <Gallery isDashboard={true} />
            </div>
          )}

        </main>
      </div>

      {/* Certificate Modal */}
      <AnimatePresence>
        {activeCertificate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-center">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }} 
              animate={{ scale: 1, opacity: 1 }} 
              exit={{ scale: 0.9, opacity: 0 }} 
              className="relative w-full max-w-2xl bg-white dark:bg-slate-950 border-4 border-double border-orange-500 rounded-3xl p-8 sm:p-12 shadow-2xl overflow-hidden"
            >
              <button onClick={() => setActiveCertificate(null)} className="absolute top-4 right-4 p-2 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-850 cursor-pointer">
                <X className="h-5 w-5" />
              </button>

              <div className="border-2 border-orange-200/50 dark:border-orange-900/50 p-6 sm:p-8 space-y-6 relative">
                {/* Certificate Graphics */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />

                <div className="space-y-2">
                  <span className="text-[10px] tracking-[0.25em] font-black text-orange-500 uppercase block">Certificate of Participation</span>
                  <h2 className="text-3xl font-serif text-slate-800 dark:text-white font-bold">Aurora Deemed to be University</h2>
                </div>

                <p className="text-xs text-slate-450 italic font-sans">This credential confirms that</p>
                
                <h3 className="text-2xl font-black text-orange-655 font-serif border-b border-slate-200 dark:border-slate-800 w-fit mx-auto pb-1.5 px-6">
                  {activeCertificate.studentName}
                </h3>
                
                <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
                  holding roll number <strong className="text-slate-850 dark:text-slate-200">{activeCertificate.rollNo}</strong> has successfully completed participation in the university mega-fest event 
                  <strong className="block text-slate-850 dark:text-white text-sm font-extrabold mt-1.5">"{activeCertificate.eventName}"</strong> 
                  conducted on {activeCertificate.date}.
                </p>

                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-150 dark:border-slate-850/80 text-[10px] text-slate-400">
                  <div className="space-y-1">
                    <p className="font-bold uppercase tracking-wider text-slate-500">Credential ID</p>
                    <p className="font-mono">{activeCertificate.certId}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="font-bold uppercase tracking-wider text-slate-500">Date Issued</p>
                    <p>{activeCertificate.date}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default StudentDashboard;
