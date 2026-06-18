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
  Inbox,
  UserCheck,
  XCircle,
  Sparkles,
  Award,
  MessageSquare,
  Star,
  Send,
  Bell,
  Plus,
  Trash2,
  Save,
  Check,
  ShieldAlert
} from 'lucide-react';
import * as memberService from '../services/memberService';
import * as volunteerService from '../services/volunteerService';

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

  // -------------------------------------------------------------
  // DATABASE INTEGRATION & STATES
  // -------------------------------------------------------------
  const [teamMembers, setTeamMembers] = useState([]);
  const [userMemberDetails, setUserMemberDetails] = useState(null);
  const [volunteerClubs, setVolunteerClubs] = useState([]);
  const [loadingDb, setLoadingDb] = useState(false);

  // -------------------------------------------------------------
  // VOLUNTEER CORE STATE VARS
  // -------------------------------------------------------------
  const [tasks, setTasks] = useState([]);
  const [attendanceLogs, setAttendanceLogs] = useState([]);
  const [performanceRatings, setPerformanceRatings] = useState({});
  const [coordinatorMessages, setCoordinatorMessages] = useState([]);
  const [clubCoordinator, setClubCoordinator] = useState({
    name: 'Jaivignesh',
    email: 'admin@aurora.edu.in',
    mobile: '+91 98765 43210'
  });

  // Load team data dynamically from backend with robust local storage fallbacks
  const loadDatabaseData = async () => {
    if (!currentUser) return;
    setLoadingDb(true);
    try {
      const clubsList = await memberService.fetchClubs();
      setVolunteerClubs(clubsList);

      const allMembers = await memberService.fetchMembers();
      
      // Find current user's database member record
      const me = allMembers.find(m => m.email.toLowerCase() === currentUser.email.toLowerCase());
      if (me) {
        setUserMemberDetails(me);
        
        // Find club coordinator if logged in as volunteer to enable Contact Coordinator
        if (['volunteer', 'volunteer_lead', 'head_volunteer'].includes(currentUser.role)) {
          const coord = allMembers.find(m => 
            m.club_id === me.club_id && 
            ['Club Coordinator', 'Faculty Coordinator', 'Club Head'].includes(m.role)
          );
          if (coord) {
            setClubCoordinator(coord);
          }
        }

        // Roster of team members in the same club (for heads/coordinators)
        const team = allMembers.filter(m => m.club_id === me.club_id);
        setTeamMembers(team);
      }

      // Load tasks from backend
      try {
        const fetchedTasks = await volunteerService.fetchTasks();
        if (fetchedTasks && fetchedTasks.length > 0) {
          setTasks(fetchedTasks);
        } else {
          // Load from localStorage if backend returned empty list
          const saved = localStorage.getItem('volunteer_dashboard_tasks');
          if (saved) setTasks(JSON.parse(saved));
        }
      } catch (err) {
        console.warn("Could not load tasks from backend, using localStorage:", err);
        const saved = localStorage.getItem('volunteer_dashboard_tasks');
        if (saved) setTasks(JSON.parse(saved));
      }

      // Load attendance logs from backend
      try {
        const fetchedAttendance = await volunteerService.fetchAttendance();
        if (fetchedAttendance && fetchedAttendance.length > 0) {
          setAttendanceLogs(fetchedAttendance);
        } else {
          const saved = localStorage.getItem('volunteer_attendance_logs');
          if (saved) setAttendanceLogs(JSON.parse(saved));
        }
      } catch (err) {
        console.warn("Could not load attendance logs from backend, using localStorage:", err);
        const saved = localStorage.getItem('volunteer_attendance_logs');
        if (saved) setAttendanceLogs(JSON.parse(saved));
      }

      // Load performance ratings from backend
      try {
        const fetchedRatings = await volunteerService.fetchRatings();
        if (fetchedRatings && fetchedRatings.length > 0) {
          const ratingMap = {};
          fetchedRatings.forEach(r => {
            ratingMap[r.volunteer_name] = { rating: r.rating, feedback: r.feedback };
          });
          setPerformanceRatings(ratingMap);
        } else {
          const saved = localStorage.getItem('volunteer_performance_ratings');
          if (saved) setPerformanceRatings(JSON.parse(saved));
        }
      } catch (err) {
        console.warn("Could not load ratings from backend, using localStorage:", err);
        const saved = localStorage.getItem('volunteer_performance_ratings');
        if (saved) setPerformanceRatings(JSON.parse(saved));
      }

      // Load helpdesk messages from backend
      try {
        const fetchedMessages = await volunteerService.fetchMessages();
        if (fetchedMessages && fetchedMessages.length > 0) {
          setCoordinatorMessages(fetchedMessages);
        } else {
          const saved = localStorage.getItem('coordinator_messages');
          if (saved) setCoordinatorMessages(JSON.parse(saved));
        }
      } catch (err) {
        console.warn("Could not load messages from backend, using localStorage:", err);
        const saved = localStorage.getItem('coordinator_messages');
        if (saved) setCoordinatorMessages(JSON.parse(saved));
      }

    } catch (err) {
      console.error('Error loading volunteer dynamic DB data:', err);
    } finally {
      setLoadingDb(false);
    }
  };

  useEffect(() => {
    loadDatabaseData();
  }, [currentUser]);

  // Seed dynamic tasks when dashboard mounts
  useEffect(() => {
    if (currentUser && tasks.length > 0 && !tasks.some(t => t.volunteer_name === currentUser.name || t.volunteerName === currentUser.name)) {
      const seedTask = {
        id: `task-seed-${Date.now()}`,
        volunteerName: currentUser.name,
        role: currentUser.role,
        eventTitle: 'Aurora Hackathon 2026',
        taskDescription: 'Assigned to provide helpdesk & registration checking desk assistance.',
        shift: '09:00 AM - 01:00 PM',
        status: 'Assigned'
      };
      const updated = [...tasks, seedTask];
      setTasks(updated);
      localStorage.setItem('volunteer_dashboard_tasks', JSON.stringify(updated));
    }
  }, [currentUser, tasks]);

  // Rating Modal state
  const [ratingModalMember, setRatingModalMember] = useState(null);
  const [newRatingStars, setNewRatingStars] = useState(5);
  const [newRatingFeedback, setNewRatingFeedback] = useState('');

  const handleSavePerformanceRating = async (e) => {
    e.preventDefault();
    if (!ratingModalMember) return;
    
    const ratingData = {
      volunteerName: ratingModalMember.name,
      rating: newRatingStars,
      feedback: newRatingFeedback,
      ratedBy: currentUser.name
    };

    try {
      const response = await volunteerService.saveRating(ratingData);
      if (response.success) {
        setPerformanceRatings({
          ...performanceRatings,
          [ratingModalMember.name]: { rating: newRatingStars, feedback: newRatingFeedback }
        });
        showToast(`Performance rating updated for ${ratingModalMember.name}!`);
        setRatingModalMember(null);
      }
    } catch (err) {
      console.error('Backend save rating failed, falling back to localStorage:', err);
      const updated = {
        ...performanceRatings,
        [ratingModalMember.name]: { rating: newRatingStars, feedback: newRatingFeedback }
      };
      setPerformanceRatings(updated);
      localStorage.setItem('volunteer_performance_ratings', JSON.stringify(updated));
      showToast(`Performance rating updated (Local storage fallback)`);
      setRatingModalMember(null);
    }
  };

  // -------------------------------------------------------------
  // MOCK REGISTRATIONS STATE (persistent in localStorage)
  // -------------------------------------------------------------
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

  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [newTaskVolunteer, setNewTaskVolunteer] = useState('');
  const [newTaskEvent, setNewTaskEvent] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskShift, setNewTaskShift] = useState('');

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTaskVolunteer || !newTaskEvent || !newTaskDesc.trim() || !newTaskShift.trim()) {
      showToast('Please fill in all task specifications.', 'error');
      return;
    }

    const matchedMember = teamMembers.find(m => m.name === newTaskVolunteer);
    const roleString = matchedMember ? (matchedMember.role === 'Volunteer Lead' ? 'head_volunteer' : 'volunteer') : 'volunteer';

    const taskData = {
      volunteerName: newTaskVolunteer,
      role: roleString,
      eventTitle: newTaskEvent,
      taskDescription: newTaskDesc,
      shift: newTaskShift
    };

    try {
      const response = await volunteerService.createTask(taskData);
      if (response.success) {
        setTasks([response.task, ...tasks]);
        showToast('Volunteer task successfully allocated!');
        setShowAddTaskModal(false);
        setNewTaskVolunteer('');
        setNewTaskEvent('');
        setNewTaskDesc('');
        setNewTaskShift('');
      }
    } catch (err) {
      console.error('Backend failed to allocate task, using localStorage fallback:', err);
      const fallbackTask = {
        id: `task-${Date.now()}`,
        volunteerName: newTaskVolunteer,
        role: roleString,
        eventTitle: newTaskEvent,
        taskDescription: newTaskDesc,
        shift: newTaskShift,
        status: 'Assigned'
      };
      const updated = [...tasks, fallbackTask];
      setTasks(updated);
      localStorage.setItem('volunteer_dashboard_tasks', JSON.stringify(updated));
      showToast('Volunteer task allocated (Local storage fallback)');
      setShowAddTaskModal(false);
      
      setNewTaskVolunteer('');
      setNewTaskEvent('');
      setNewTaskDesc('');
      setNewTaskShift('');
    }
  };

  const handleUpdateTaskStatus = async (id, nextStatus) => {
    const isDbId = !String(id).startsWith('task-seed') && !String(id).startsWith('task-');
    
    if (isDbId) {
      try {
        const response = await volunteerService.updateTaskStatus(id, nextStatus);
        if (response.success) {
          setTasks(tasks.map(t => t.id === id ? response.task : t));
        }
      } catch (err) {
        console.error('Backend task status update failed:', err);
        setTasks(tasks.map(t => t.id === id ? { ...t, status: nextStatus } : t));
      }
    } else {
      setTasks(tasks.map(t => t.id === id ? { ...t, status: nextStatus } : t));
      localStorage.setItem('volunteer_dashboard_tasks', JSON.stringify(tasks.map(t => t.id === id ? { ...t, status: nextStatus } : t)));
    }

    showToast(`Task marked as ${nextStatus}!`);

    // Record attendance logs on status change
    const targetTask = tasks.find(t => t.id === id);
    if (targetTask) {
      const vName = targetTask.volunteer_name || targetTask.volunteerName;
      const eTitle = targetTask.event_title || targetTask.eventTitle;
      
      if (vName === currentUser.name) {
        if (nextStatus === 'Active') {
          const attendanceData = {
            volunteerName: currentUser.name,
            eventTitle: eTitle,
            shift: targetTask.shift,
            date: new Date().toLocaleDateString(),
            checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          try {
            const response = await volunteerService.checkInAttendance(attendanceData);
            if (response.success) {
              setAttendanceLogs([response.log, ...attendanceLogs]);
            }
          } catch (err) {
            console.error('Backend check-in failed, using localStorage fallback:', err);
            const fallbackLog = {
              id: `att-log-${Date.now()}`,
              volunteerName: currentUser.name,
              eventTitle: eTitle,
              shift: targetTask.shift,
              date: new Date().toLocaleDateString(),
              checkInTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              checkOutTime: null,
              status: 'Present'
            };
            const updatedLogs = [fallbackLog, ...attendanceLogs];
            setAttendanceLogs(updatedLogs);
            localStorage.setItem('volunteer_attendance_logs', JSON.stringify(updatedLogs));
          }
        } else if (nextStatus === 'Completed') {
          const checkoutData = {
            volunteerName: currentUser.name,
            eventTitle: eTitle,
            checkOutTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };

          try {
            const response = await volunteerService.checkOutAttendance(checkoutData);
            if (response.success) {
              setAttendanceLogs(attendanceLogs.map(log => 
                ((log.volunteer_name || log.volunteerName) === currentUser.name && (log.event_title || log.eventTitle) === eTitle && !(log.check_out_time || log.checkOutTime)) 
                  ? response.log 
                  : log
              ));
            }
          } catch (err) {
            console.error('Backend checkout failed, using localStorage fallback:', err);
            const updatedLogs = attendanceLogs.map(log => {
              const logVol = log.volunteerName || log.volunteer_name;
              const logEvt = log.eventTitle || log.event_title;
              const logOut = log.checkOutTime || log.check_out_time;
              if (logVol === currentUser.name && logEvt === eTitle && !logOut) {
                return {
                  ...log,
                  checkOutTime: checkoutData.checkOutTime,
                  check_out_time: checkoutData.checkOutTime
                };
              }
              return log;
            });
            setAttendanceLogs(updatedLogs);
            localStorage.setItem('volunteer_attendance_logs', JSON.stringify(updatedLogs));
          }
        }
      }
    }
  };

  // -------------------------------------------------------------
  // NOTIFICATIONS (READ FROM LOCALSTORAGE)
  // -------------------------------------------------------------
  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('aurora_announcements');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'Registrations Open for Acoustics Battle of Bands', date: '2026-06-15', author: 'System Authority', category: 'Event Update', target: 'All' },
      { id: 2, title: 'Barricade and Entry QR scan guidelines published', date: '2026-06-14', author: 'System Authority', category: 'General', target: 'Students Only' }
    ];
  });

  // Coordinator specific announcement broadcast form
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastCategory, setBroadcastCategory] = useState('General');

  const handleCoordinatorBroadcastSubmit = (e) => {
    e.preventDefault();
    if (!broadcastTitle.trim()) return;

    const clubLabel = userMemberDetails?.club_name || 'My Club';
    const newAnn = {
      id: Date.now(),
      title: `${clubLabel} Announcement: ${broadcastTitle}`,
      date: new Date().toISOString().split('T')[0],
      author: currentUser.name,
      category: broadcastCategory,
      target: clubLabel
    };

    const updated = [newAnn, ...announcements];
    setAnnouncements(updated);
    localStorage.setItem('aurora_announcements', JSON.stringify(updated));
    showToast('Club announcement broadcasted successfully!');
    setBroadcastTitle('');
  };

  // Filter announcements relevant to the current user
  const myAnnouncements = announcements.filter(ann => {
    const clubLabel = userMemberDetails?.club_name;
    return ann.target === 'All' || 
           ann.target === 'Students Only' || 
           (clubLabel && ann.target === clubLabel);
  });

  // Message compose & send
  const [newMessageText, setNewMessageText] = useState('');

  const handleSendMessageToCoordinator = async (e) => {
    e.preventDefault();
    if (!newMessageText.trim()) return;

    const messageData = {
      senderName: currentUser.name,
      senderEmail: currentUser.email,
      clubId: userMemberDetails?.club_id,
      clubName: userMemberDetails?.club_name || 'General',
      message: newMessageText,
      timestamp: new Date().toLocaleString()
    };

    try {
      const response = await volunteerService.sendMessage(messageData);
      if (response.success) {
        setCoordinatorMessages([response.message, ...coordinatorMessages]);
        showToast('Message sent to coordinator successfully!');
        setNewMessageText('');
      }
    } catch (err) {
      console.error('Backend failed to send message, using local fallback:', err);
      const fallbackMsg = {
        id: `msg-${Date.now()}`,
        ...messageData,
        reply: null
      };
      const updated = [fallbackMsg, ...coordinatorMessages];
      setCoordinatorMessages(updated);
      localStorage.setItem('coordinator_messages', JSON.stringify(updated));
      showToast('Message sent (Local storage fallback)');
      setNewMessageText('');
    }
  };

  // Filter messages for current volunteer (sent by them) or current coordinator (received by them)
  const isCoord = ['coordinator', 'club_coordinator', 'faculty_coordinator'].includes(currentUser.role);
  
  const myCoordinatorMessages = coordinatorMessages.filter(msg => {
    const mClubId = msg.club_id || msg.clubId;
    const mSenderEmail = msg.sender_email || msg.senderEmail;
    if (isCoord) {
      return parseInt(mClubId) === parseInt(userMemberDetails?.club_id);
    }
    return mSenderEmail.toLowerCase() === currentUser.email.toLowerCase();
  });

  // Coordinator reply handler
  const [replyingMessageId, setReplyingMessageId] = useState(null);
  const [replyText, setReplyText] = useState('');

  const handleSendReply = async (id) => {
    if (!replyText.trim()) return;

    const isDbId = !String(id).startsWith('msg-');

    if (isDbId) {
      try {
        const response = await volunteerService.replyMessage(id, replyText);
        if (response.success) {
          setCoordinatorMessages(coordinatorMessages.map(msg => msg.id === id ? response.message : msg));
          showToast('Reply sent successfully!');
          setReplyingMessageId(null);
          setReplyText('');
        }
      } catch (err) {
        console.error('Backend message reply failed:', err);
      }
    } else {
      const updated = coordinatorMessages.map(msg => {
        if (msg.id === id) {
          return { ...msg, reply: replyText, repliedAt: new Date().toLocaleString() };
        }
        return msg;
      });
      setCoordinatorMessages(updated);
      localStorage.setItem('coordinator_messages', JSON.stringify(updated));
      showToast('Reply sent (Local storage fallback)');
      setReplyingMessageId(null);
      setReplyText('');
    }
  };

  // -------------------------------------------------------------
  // VOLUNTEER ASSIGNED TASKS, EVENTS & PROFILE
  // -------------------------------------------------------------
  const myTasks = tasks.filter(t => (t.volunteer_name || t.volunteerName) === currentUser.name);
  const myAssignedEvents = events.filter(evt => 
    tasks.some(t => (t.volunteer_name || t.volunteerName) === currentUser.name && (t.event_title || t.eventTitle) === evt.title)
  );

  const completedTasks = myTasks.filter(t => t.status === 'Completed').length;
  const hoursVolunteered = completedTasks * 4;
  
  const userLogs = attendanceLogs.filter(log => (log.volunteer_name || log.volunteerName) === currentUser.name);
  const attendanceRate = userLogs.length > 0
    ? Math.round((userLogs.filter(log => log.status === 'Present').length / userLogs.length) * 100)
    : 100;

  const sidebarTabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'my-tasks', label: 'My Tasks', icon: UserCheck, badge: myTasks.filter(t => t.status === 'Assigned' || t.status === 'Active').length },
    { id: 'assigned-events', label: 'Assigned Events', icon: Calendar },
    { id: 'my-attendance', label: 'My Attendance', icon: Clock },
    { id: 'notifications', label: 'Bulletins', icon: Bell, badge: myAnnouncements.length },
    { id: 'volunteer-profile', label: 'My Profile', icon: Award }
  ];

  if (['volunteer', 'volunteer_lead', 'head_volunteer'].includes(currentUser.role)) {
    sidebarTabs.push({ id: 'contact-coordinator', label: 'Contact Coord', icon: MessageSquare });
  }

  const isCoordinatingRole = ['head_volunteer', 'volunteer_lead', 'coordinator', 'club_coordinator', 'faculty_coordinator'].includes(currentUser.role);
  if (isCoordinatingRole) {
    sidebarTabs.push(
      { id: 'team-roster', label: 'My Team', icon: Users },
      { id: 'registrations', label: 'Registrations Review', icon: Inbox, badge: pendingCount },
      { id: 'tasks', label: 'Assign Tasks', icon: Plus },
      { id: 'team-messages', label: 'Volunteer Messages', icon: MessageSquare }
    );
  }

  return (
    <div className="relative min-h-screen flex bg-slate-50 text-slate-900 dark:bg-[#070913] dark:text-slate-100 transition-colors duration-300 font-sans">
      
      {/* Decorative Glow backgrounds */}
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
              <span className="text-[9px] tracking-[0.15em] font-extrabold text-purple-650 dark:text-purple-400 uppercase block mt-1.5">{getRoleLabel(currentUser.role)} Portal</span>
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
              <span className="inline-block text-[9px] font-black uppercase text-purple-650 dark:text-purple-400 mt-1">{getRoleLabel(currentUser.role)}</span>
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

          <div className="relative max-w-md w-full hidden sm:block">
            <input
              type="text"
              placeholder="Search specifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-2.5 pl-11 rounded-2xl border border-slate-200 dark:border-white/5 dark:bg-white/5 focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-medium text-slate-700 dark:text-slate-300 placeholder:text-slate-400 bg-white"
            />
            <Compass className="absolute left-4 top-3.5 h-4 w-4 text-slate-400" />
          </div>

          <div className="flex items-center space-x-3.5 ml-auto">
            <div className="bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono">
              {userMemberDetails?.club_name || 'General Assignment'}
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

          {loadingDb ? (
            <div className="py-20 text-center">
              <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-slate-400 font-bold mt-4 uppercase tracking-wider">Loading dynamic roster credentials...</p>
            </div>
          ) : (
            <AnimatePresence mode="wait">
              
              {/* 1. VIEW: Overview Tab */}
              {activeTab === 'overview' && (
                <motion.div
                  key="overview"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  {/* Greeting glass box */}
                  <div className="glass-card rounded-[2.5rem] p-8 border border-slate-200/50 dark:border-white/5 bg-gradient-to-r from-purple-900/10 via-indigo-900/10 to-pink-900/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                      <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider mb-3">
                        <Sparkles className="h-3 w-3" />
                        <span>{getRoleLabel(currentUser.role).toUpperCase()} PORTAL ACTIVE</span>
                      </div>
                      <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-800 dark:text-white">Welcome, {currentUser.name}!</h1>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-sans mt-2 leading-relaxed">
                        Track your shifts, log attendance, download excellence certificates, or manage registrations review and team task allocations.
                      </p>
                    </div>
                  </div>

                  {/* Personal metrics cards */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between shadow-sm">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Assigned Tasks</span>
                        <h3 className="text-3xl font-black text-purple-600 dark:text-purple-400 mt-1">{myTasks.length}</h3>
                      </div>
                      <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-950/40">
                        <UserCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                      </div>
                    </div>

                    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between shadow-sm">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Completed Tasks</span>
                        <h3 className="text-3xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{completedTasks}</h3>
                      </div>
                      <div className="p-3 rounded-lg bg-emerald-100 dark:bg-emerald-950/40">
                        <CheckCircle2 className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                      </div>
                    </div>

                    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between shadow-sm">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Contribution</span>
                        <h3 className="text-3xl font-black text-cyan-600 dark:text-cyan-400 mt-1">{hoursVolunteered} Hrs</h3>
                      </div>
                      <div className="p-3 rounded-lg bg-cyan-100 dark:bg-cyan-950/40">
                        <Clock className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                      </div>
                    </div>

                    <div className="bg-white/50 dark:bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-slate-200 dark:border-slate-800/80 flex items-center justify-between shadow-sm">
                      <div>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">Attendance Rate</span>
                        <h3 className="text-3xl font-black text-amber-600 dark:text-amber-400 mt-1">{attendanceRate}%</h3>
                      </div>
                      <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-950/40">
                        <TrendingUp className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* Left Column: Quick shift check-in & contact details (7 columns) */}
                    <div className="lg:col-span-7 space-y-6">
                      
                      {/* Active Shift Card */}
                      <div className="glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl">
                        <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider border-b border-slate-100 dark:border-slate-800 pb-3 mb-4">
                          Current Active Shift Status
                        </h3>
                        
                        {myTasks.filter(t => t.status === 'Active').length > 0 ? (
                          <div className="space-y-4">
                            <div className="p-4.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-xs font-bold text-cyan-500 uppercase tracking-wider">Shift is in progress</p>
                                <h4 className="text-sm font-black text-slate-800 dark:text-white">
                                  {myTasks.find(t => t.status === 'Active').event_title || myTasks.find(t => t.status === 'Active').eventTitle}
                                </h4>
                                <p className="text-xxs text-slate-405">{myTasks.find(t => t.status === 'Active').task_description || myTasks.find(t => t.status === 'Active').taskDescription}</p>
                              </div>
                              <button
                                onClick={() => handleUpdateTaskStatus(myTasks.find(t => t.status === 'Active').id, 'Completed')}
                                className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase text-white bg-emerald-600 hover:bg-emerald-700 shadow-md cursor-pointer transition-all"
                              >
                                Check Out Shift
                              </button>
                            </div>
                          </div>
                        ) : myTasks.filter(t => t.status === 'Assigned').length > 0 ? (
                          <div className="space-y-4">
                            <p className="text-xs text-slate-400 leading-relaxed font-sans">
                              You have an upcoming assigned shift. Please check in below to record your attendance.
                            </p>
                            <div className="p-4.5 rounded-2xl bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/5 flex items-center justify-between">
                              <div className="space-y-1">
                                <h4 className="text-sm font-black text-slate-800 dark:text-white">
                                  {myTasks.find(t => t.status === 'Assigned').event_title || myTasks.find(t => t.status === 'Assigned').eventTitle}
                                </h4>
                                <p className="text-xxs text-slate-400 font-mono">Shift: {myTasks.find(t => t.status === 'Assigned').shift}</p>
                              </div>
                              <button
                                onClick={() => handleUpdateTaskStatus(myTasks.find(t => t.status === 'Assigned').id, 'Active')}
                                className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase text-white bg-purple-650 hover:bg-purple-750 shadow-md cursor-pointer transition-all"
                              >
                                Check In Shift
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 text-center text-slate-400 font-bold">
                            <Check className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
                            All assigned volunteer shifts completed!
                          </div>
                        )}
                      </div>

                      {/* Recent Notifications Quick Stream */}
                      <div className="glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl space-y-4">
                        <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                          <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider">Recent Bulletins</h3>
                          <button onClick={() => setActiveTab('notifications')} className="text-xxs uppercase tracking-wider font-extrabold text-purple-650 dark:text-purple-400 hover:underline">View All</button>
                        </div>
                        {myAnnouncements.length === 0 ? (
                          <p className="text-xxs text-slate-400 font-sans py-4">No active broadcasts listed.</p>
                        ) : (
                          <div className="space-y-3">
                            {myAnnouncements.slice(0, 2).map(ann => (
                              <div key={ann.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-white/2 border border-slate-150 dark:border-white/5 text-xxs flex justify-between gap-3 text-left">
                                <div className="space-y-1">
                                  <span className="px-2 py-0.5 rounded bg-purple-500/10 text-purple-600 dark:text-purple-400 font-bold uppercase tracking-wider text-[8px]">
                                    {ann.category}
                                  </span>
                                  <p className="font-semibold text-slate-800 dark:text-slate-200 font-sans leading-relaxed">{ann.title}</p>
                                </div>
                                <span className="text-[9px] text-slate-400 shrink-0">{ann.date}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Right Column: Coordinator quick widget & shortcuts (5 columns) */}
                    <div className="lg:col-span-5 space-y-6">
                      
                      {/* Coordinator Details Card */}
                      {['volunteer', 'volunteer_lead', 'head_volunteer'].includes(currentUser.role) && (
                        <div className="glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl text-center space-y-4">
                          <h3 className="font-bold text-xs text-slate-500 dark:text-slate-400 uppercase tracking-widest text-left">Assigned Coordinator</h3>
                          <div className="w-14 h-14 rounded-full bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black mx-auto text-lg">
                            {clubCoordinator.name[0]}
                          </div>
                          <div>
                            <h4 className="font-black text-sm text-slate-800 dark:text-white">{clubCoordinator.name}</h4>
                            <p className="text-xxs text-slate-400 mt-1 uppercase tracking-wider font-semibold">Club Coordinator</p>
                          </div>
                          <div className="text-xxs text-slate-500 space-y-1 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-left font-sans">
                            <p><strong>Email:</strong> {clubCoordinator.email}</p>
                            <p><strong>Mobile:</strong> {clubCoordinator.mobile}</p>
                          </div>
                          <button
                            onClick={() => setActiveTab('contact-coordinator')}
                            className="w-full py-2.5 rounded-xl text-xxs font-black uppercase text-white bg-purple-650 hover:bg-purple-750 transition-all shadow-md cursor-pointer"
                          >
                            Send Helpdesk Message
                          </button>
                        </div>
                      )}

                      {/* Shortcut console */}
                      <div className="glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl space-y-3">
                        <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider text-left border-b border-slate-100 dark:border-slate-800 pb-2 mb-3">
                          Quick Desk Shortcuts
                        </h3>
                        <div className="space-y-2">
                          <button onClick={() => setActiveTab('my-tasks')} className="w-full py-3 rounded-xl text-xxs font-black uppercase tracking-wider text-slate-700 dark:text-slate-350 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/5">
                            My Assigned Tasks
                          </button>
                          <button onClick={() => setActiveTab('volunteer-profile')} className="w-full py-3 rounded-xl text-xxs font-black uppercase tracking-wider text-slate-700 dark:text-slate-350 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 transition-all border border-slate-200 dark:border-white/5">
                            Download Certificates
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                </motion.div>
              )}

              {/* 2. VIEW: My Tasks Tab */}
              {activeTab === 'my-tasks' && (
                <motion.div
                  key="my-tasks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">My Volunteer Task Registry</h2>
                    <p className="text-xs text-slate-400 mt-1">Review task details, shifts, and check-in to activate shifts.</p>
                  </div>

                  <div className="glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 overflow-hidden bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs font-sans">
                        <thead>
                          <tr className="text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-850">
                            <th className="pb-3 pl-2">Event Title</th>
                            <th className="pb-3">Shift Timing</th>
                            <th className="pb-3">Task Description</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 pr-2 text-right">Action Log</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myTasks.length === 0 ? (
                            <tr>
                              <td colSpan="5" className="py-12 text-center text-slate-400 font-bold">
                                <Inbox className="h-10 w-10 mx-auto opacity-40 mb-2" />
                                No tasks assigned to you.
                              </td>
                            </tr>
                          ) : (
                            myTasks.map(task => (
                              <tr key={task.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                                <td className="py-4 pl-2 font-bold text-slate-800 dark:text-white">{task.event_title || task.eventTitle}</td>
                                <td className="py-4 font-semibold text-slate-700 dark:text-slate-350">{task.shift}</td>
                                <td className="py-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">{task.task_description || task.taskDescription}</td>
                                <td className="py-4">
                                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] border ${
                                    task.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                    task.status === 'Active' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500' :
                                    task.status === 'Cancelled' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                    'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                  }`}>
                                    {task.status}
                                  </span>
                                </td>
                                <td className="py-4 pr-2 text-right">
                                  <div className="flex justify-end gap-1.5">
                                    {task.status === 'Assigned' && (
                                      <button
                                        onClick={() => handleUpdateTaskStatus(task.id, 'Active')}
                                        className="px-2.5 py-1.5 rounded bg-purple-650 hover:bg-purple-750 text-white font-extrabold uppercase text-[9px] transition-all cursor-pointer shadow"
                                      >
                                        Check In
                                      </button>
                                    )}
                                    {task.status === 'Active' && (
                                      <button
                                        onClick={() => handleUpdateTaskStatus(task.id, 'Completed')}
                                        className="px-2.5 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold uppercase text-[9px] transition-all cursor-pointer shadow"
                                      >
                                        Complete
                                      </button>
                                    )}
                                    {task.status === 'Completed' && (
                                      <span className="text-[10px] text-slate-400 italic">Task Finished</span>
                                    )}
                                  </div>
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

              {/* 3. VIEW: Assigned Events Tab */}
              {activeTab === 'assigned-events' && (
                <motion.div
                  key="assigned-events"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">My Assigned Event Programs</h2>
                    <p className="text-xs text-slate-400 mt-1">Review event profiles, date details, and schedules you are coordinating.</p>
                  </div>

                  {myAssignedEvents.length === 0 ? (
                    <div className="p-12 text-center rounded-[2.5rem] bg-white/40 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 space-y-3 text-slate-400 font-bold">
                      <Calendar className="h-10 w-10 mx-auto opacity-50" />
                      No events currently assigned. Keep check tasks registry.
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {myAssignedEvents.map(evt => (
                        <div key={evt.id} className="glass-card rounded-[2rem] overflow-hidden border border-slate-200/50 dark:border-white/5 shadow-md flex flex-col justify-between bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl">
                          <div>
                            <div className="relative h-44 w-full">
                              <img
                                src={evt.image}
                                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1514382357765-73c1b2375d7e?auto=format&fit=crop&w=800&q=80'; }}
                                className="w-full h-full object-cover"
                                alt={evt.title}
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                              <span className="absolute top-4 left-4 text-[9px] font-black uppercase text-white bg-purple-650 px-2 py-0.5 rounded">
                                {evt.category}
                              </span>
                              <div className="absolute bottom-4 left-4 text-left">
                                <span className="text-[9px] font-bold text-cyan-400 uppercase tracking-widest">{evt.type}</span>
                                <h4 className="text-sm font-black text-white line-clamp-1 mt-0.5">{evt.title}</h4>
                              </div>
                            </div>

                            <div className="p-5 text-left space-y-3 font-sans">
                              <p className="text-xxs text-slate-405 line-clamp-2 leading-relaxed">{evt.description}</p>
                              <div className="space-y-1.5 pt-3 border-t border-slate-100 dark:border-slate-800 text-xxs text-slate-500 dark:text-slate-400">
                                <div className="flex items-center space-x-2">
                                  <Calendar className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                                  <span>{evt.date} • {evt.time || 'TBD'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <MapPin className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                                  <span className="truncate">{evt.venue}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* 4. VIEW: My Attendance Tab */}
              {activeTab === 'my-attendance' && (
                <motion.div
                  key="my-attendance"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">My Attendance Log</h2>
                    <p className="text-xs text-slate-400 mt-1">Review check-in and check-out logs for fests shifts.</p>
                  </div>

                  <div className="glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 overflow-hidden bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs font-sans">
                        <thead>
                          <tr className="text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-850">
                            <th className="pb-3 pl-2">Event</th>
                            <th className="pb-3">Shift</th>
                            <th className="pb-3">Date</th>
                            <th className="pb-3">Check In</th>
                            <th className="pb-3">Check Out</th>
                            <th className="pb-3 pr-2 text-right">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {userLogs.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="py-12 text-center text-slate-400 font-bold">
                                No attendance entries recorded. Check-in to start logging shifts.
                              </td>
                            </tr>
                          ) : (
                            userLogs.map(log => (
                              <tr key={log.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                                <td className="py-4 pl-2 font-bold text-slate-800 dark:text-white">{log.event_title || log.eventTitle}</td>
                                <td className="py-4 text-slate-600 dark:text-slate-400 font-semibold">{log.shift}</td>
                                <td className="py-4 text-slate-500 dark:text-slate-405 font-medium">{log.date}</td>
                                <td className="py-4 text-slate-500 font-mono">{log.check_in_time || log.checkInTime}</td>
                                <td className="py-4 text-slate-500 font-mono">{(log.check_out_time || log.checkOutTime) || '--'}</td>
                                <td className="py-4 pr-2 text-right">
                                  <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] border ${
                                    log.status === 'Present' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                                  }`}>
                                    {log.status}
                                  </span>
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

              {/* 5. VIEW: Notifications Tab */}
              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-slate-800 dark:text-white">Active Broadcasting bulletins</h2>
                      <p className="text-xs text-slate-400 mt-1 font-sans">View announcements issued specifically to your club fests teams.</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {myAnnouncements.length === 0 ? (
                      <div className="p-12 text-center rounded-[2.5rem] bg-white/40 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 space-y-3 text-slate-400 font-bold">
                        No active announcements broadcasted.
                      </div>
                    ) : (
                      myAnnouncements.map(ann => (
                        <div key={ann.id} className="glass-card rounded-[2rem] p-5 border border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl flex justify-between items-start gap-4">
                          <div className="space-y-2 text-left">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-500/10 border border-indigo-500/20 text-indigo-500">
                                {ann.category}
                              </span>
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-slate-100 dark:bg-white/5 text-slate-405 border border-slate-200/50 dark:border-white/5">
                                Target: {ann.target}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 font-sans leading-relaxed">{ann.title}</p>
                            <span className="text-[10px] text-slate-400 block font-sans">
                              Published: {ann.date} • By: {ann.author}
                            </span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </motion.div>
              )}

              {/* 6. VIEW: Volunteer Profile & Certificates */}
              {activeTab === 'volunteer-profile' && (
                <motion.div
                  key="volunteer-profile"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-8"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Left: Profile details (5 columns) */}
                    <div className="lg:col-span-5 glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl text-center space-y-5">
                      <div className="w-20 h-20 rounded-2xl bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 flex items-center justify-center font-black mx-auto text-3xl">
                        {userInitials}
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight">{currentUser.name}</h3>
                        <p className="text-xxs font-black text-purple-650 uppercase tracking-widest mt-1">{getRoleLabel(currentUser.role)}</p>
                      </div>

                      <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800 text-xxs text-slate-650 dark:text-slate-400 text-left font-sans">
                        <p><strong>College Email:</strong> {currentUser.email}</p>
                        <p><strong>Department:</strong> {userMemberDetails?.department || currentUser.department || 'N/A'}</p>
                        <p><strong>Roll / Employee ID:</strong> {userMemberDetails?.employee_id || currentUser.rollNo || 'N/A'}</p>
                        <p><strong>Assigned Club:</strong> {userMemberDetails?.club_name || 'General'}</p>
                        <p><strong>Designation:</strong> {userMemberDetails?.designation || 'Student Volunteer'}</p>
                        <p><strong>Personal Rating:</strong> {performanceRatings[currentUser.name] ? `${performanceRatings[currentUser.name].rating} ★` : 'No rating yet'}</p>
                      </div>
                    </div>

                    {/* Right: Digital Certificates (7 columns) */}
                    <div className="lg:col-span-7 glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl space-y-5">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                        <Award className="h-5 w-5 text-amber-500" />
                        <span>Digital Volunteering Credentials</span>
                      </h3>

                      <p className="text-xxs text-slate-400 leading-relaxed font-sans">
                        Successfully finished volunteer task logs unlock digital certificates of appreciation signed by the fest committee.
                      </p>

                      <div className="space-y-3">
                        {myTasks.filter(t => t.status === 'Completed').length === 0 ? (
                          <div className="p-8 text-center text-slate-400 font-bold border border-dashed border-slate-200 dark:border-slate-880 rounded-2xl">
                            Complete your assigned tasks to unlock printable certificates.
                          </div>
                        ) : (
                          myTasks.filter(t => t.status === 'Completed').map(task => {
                            const eTitle = task.event_title || task.eventTitle;
                            return (
                              <div key={task.id} className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
                                <div className="text-left">
                                  <h4 className="text-xs font-bold text-slate-805 dark:text-white">{eTitle}</h4>
                                  <p className="text-[10px] text-slate-400 font-sans mt-0.5">Role: {task.role === 'head_volunteer' ? 'Head Volunteer' : 'Volunteer'}</p>
                                </div>
                                <Link
                                  to={`/certificate?certId=${task.id}&name=${encodeURIComponent(currentUser.name)}&event=${encodeURIComponent(eTitle)}&type=Volunteer`}
                                  className="px-3 py-2 rounded-xl text-xxs font-black uppercase bg-amber-500 text-white shadow-md hover:bg-amber-600 cursor-pointer"
                                >
                                  View Cert
                                </Link>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {/* 7. VIEW: Contact Coordinator Tab */}
              {activeTab === 'contact-coordinator' && (
                <motion.div
                  key="contact-coordinator"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">Helpdesk Messaging Console</h2>
                    <p className="text-xs text-slate-400 mt-1 font-sans">Send queries directly to the coordinator of {userMemberDetails?.club_name || 'your club'}.</p>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                    
                    {/* Compose message box (5 columns) */}
                    <div className="lg:col-span-5 glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl space-y-4">
                      <h3 className="text-sm font-black uppercase text-slate-850 dark:text-white tracking-wider flex items-center gap-2">
                        <Send className="h-4.5 w-4.5 text-purple-600 dark:text-purple-400" />
                        <span>Send Message</span>
                      </h3>
                      
                      <form onSubmit={handleSendMessageToCoordinator} className="space-y-4">
                        <div className="space-y-1.5 text-left">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Message Body</label>
                          <textarea
                            required
                            rows="5"
                            value={newMessageText}
                            onChange={(e) => setNewMessageText(e.target.value)}
                            placeholder="Type details, shift swap requests, or logistics concerns..."
                            className="w-full px-4 py-3 rounded-2xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                          />
                        </div>
                        <button
                          type="submit"
                          className="w-full py-3 bg-purple-650 hover:bg-purple-750 text-white font-extrabold uppercase rounded-2xl transition-all text-xs tracking-wider flex items-center justify-center cursor-pointer shadow-md"
                        >
                          <Send className="w-3.5 h-3.5 mr-2" />
                          Send Message
                        </button>
                      </form>
                    </div>

                    {/* Sent messages history stream (7 columns) */}
                    <div className="lg:col-span-7 space-y-4">
                      <h3 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">Message History ({myCoordinatorMessages.length})</h3>
                      
                      {myCoordinatorMessages.length === 0 ? (
                        <div className="p-12 text-center rounded-[2.5rem] bg-white/40 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-slate-400 font-bold">
                          No helpdesk messages logged.
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {myCoordinatorMessages.map(msg => {
                            const mMsg = msg.message || msg.message;
                            const mReply = msg.reply || msg.reply;
                            const mTime = msg.timestamp || msg.timestamp;
                            const mRepliedAt = msg.replied_at || msg.repliedAt;
                            return (
                              <div key={msg.id} className="glass-card rounded-[2rem] p-5 border border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl text-left space-y-3">
                                <div>
                                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 font-sans leading-relaxed">{mMsg}</p>
                                  <span className="text-[9px] text-slate-400 mt-1 block font-mono">{mTime}</span>
                                </div>
                                
                                {mReply ? (
                                  <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-xxs font-sans space-y-1">
                                    <p className="text-purple-650 dark:text-purple-400 font-black uppercase tracking-wider text-[8px]">Coordinator Reply:</p>
                                    <p className="text-slate-705 dark:text-slate-300 font-semibold">{mReply}</p>
                                    <span className="text-[8px] text-slate-455 dark:text-slate-500 font-mono block">{mRepliedAt}</span>
                                  </div>
                                ) : (
                                  <div className="text-[10px] text-amber-500 font-bold uppercase tracking-wider font-sans italic">
                                    Awaiting coordinator reply...
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </motion.div>
              )}

              {/* 8. VIEW: Team Roster (Coordinators & Head Volunteers) */}
              {activeTab === 'team-roster' && isCoordinatingRole && (
                <motion.div
                  key="team-roster"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">My Fests Volunteer Team</h2>
                    <p className="text-xs text-slate-400 mt-1">Review volunteer designations, roles, status and configure performance ratings.</p>
                  </div>

                  <div className="glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 overflow-hidden bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs font-sans">
                        <thead>
                          <tr className="text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-850">
                            <th className="pb-3 pl-2">Volunteer</th>
                            <th className="pb-3">Contact</th>
                            <th className="pb-3">Department</th>
                            <th className="pb-3">Designation</th>
                            <th className="pb-3">Role</th>
                            <th className="pb-3">Performance</th>
                            <th className="pb-3 pr-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {teamMembers.length === 0 ? (
                            <tr>
                              <td colSpan="7" className="py-12 text-center text-slate-400 font-bold">
                                No volunteers assigned to your club roster.
                              </td>
                            </tr>
                          ) : (
                            teamMembers.map(vol => {
                              const initials = vol.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'V';
                              const ratingDetails = performanceRatings[vol.name];
                              
                              return (
                                <tr key={vol.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                                  <td className="py-4 pl-2">
                                    <div className="flex items-center space-x-3">
                                      <div className="w-8 h-8 rounded bg-purple-100 dark:bg-purple-950/40 text-purple-750 dark:text-purple-300 flex items-center justify-center font-bold text-xxs uppercase">
                                        {initials}
                                      </div>
                                      <div>
                                        <div className="font-bold text-slate-805 dark:text-white">{vol.name}</div>
                                        <div className="text-[10px] text-slate-405 font-mono">ID: {vol.employee_id || 'N/A'}</div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="py-4">
                                    <div className="font-semibold text-slate-700 dark:text-slate-350">{vol.email}</div>
                                    <div className="text-[10px] text-slate-455 mt-0.5">{vol.mobile}</div>
                                  </td>
                                  <td className="py-4 text-purple-650 dark:text-purple-400 font-bold uppercase">{vol.department}</td>
                                  <td className="py-4 font-semibold text-slate-600 dark:text-slate-400">{vol.designation || 'Student Volunteer'}</td>
                                  <td className="py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] border ${
                                      vol.role === 'Volunteer Lead' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500' : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
                                    }`}>
                                      {vol.role}
                                    </span>
                                  </td>
                                  <td className="py-4 font-sans">
                                    {ratingDetails ? (
                                      <div className="space-y-1">
                                        <div className="flex text-amber-400 text-xs">
                                          {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`h-3 w-3 ${i < ratingDetails.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                                          ))}
                                        </div>
                                        <p className="text-[9px] text-slate-400 truncate max-w-[120px]">{ratingDetails.feedback}</p>
                                      </div>
                                    ) : (
                                      <span className="text-[10px] text-slate-400 italic">No rating</span>
                                    )}
                                  </td>
                                  <td className="py-4 pr-2 text-right">
                                    <button
                                      onClick={() => {
                                        setRatingModalMember(vol);
                                        setNewRatingStars(ratingDetails?.rating || 5);
                                        setNewRatingFeedback(ratingDetails?.feedback || '');
                                      }}
                                      className="px-2.5 py-1.5 rounded bg-purple-600/10 hover:bg-purple-600 hover:text-white text-purple-650 dark:text-purple-450 text-[10px] font-black uppercase transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm"
                                    >
                                      <Star className="h-3 w-3" />
                                      Rate Performance
                                    </button>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* 9. VIEW: Task Allocations (Coordinators & Head Volunteers) */}
              {activeTab === 'tasks' && isCoordinatingRole && (
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4">
                    <div>
                      <h2 className="text-xl font-black text-slate-800 dark:text-white">Volunteer Task Allocations Console</h2>
                      <p className="text-xs text-slate-400 mt-1 font-sans">Assign duties, allocate shift timing, and verify status.</p>
                    </div>
                    <button
                      onClick={() => setShowAddTaskModal(true)}
                      className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase text-white bg-purple-650 hover:bg-purple-750 transition-all shadow-md self-start sm:self-auto cursor-pointer"
                    >
                      Allocate New Task
                    </button>
                  </div>

                  {/* Task allocation board */}
                  <div className="glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 overflow-hidden bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl">
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-left text-xs font-sans">
                        <thead>
                          <tr className="text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-slate-850">
                            <th className="pb-3 pl-2">Volunteer Name</th>
                            <th className="pb-3">Target Event</th>
                            <th className="pb-3">Task Description</th>
                            <th className="pb-3">Shift</th>
                            <th className="pb-3">Status</th>
                            <th className="pb-3 pr-2 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tasks.length === 0 ? (
                            <tr>
                              <td colSpan="6" className="py-12 text-center text-slate-400 font-bold">
                                No active task allocations.
                              </td>
                            </tr>
                          ) : (
                            tasks.map(task => {
                              const vName = task.volunteer_name || task.volunteerName;
                              const eTitle = task.event_title || task.eventTitle;
                              const tDesc = task.task_description || task.taskDescription;
                              return (
                                <tr key={task.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                                  <td className="py-4 pl-2 font-bold text-slate-800 dark:text-white">{vName}</td>
                                  <td className="py-4 font-semibold text-slate-700 dark:text-slate-350">{eTitle}</td>
                                  <td className="py-4 text-slate-500 dark:text-slate-400 max-w-xs truncate">{tDesc}</td>
                                  <td className="py-4 text-slate-550 dark:text-slate-405 font-medium">{task.shift}</td>
                                  <td className="py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] border ${
                                      task.status === 'Completed' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500' :
                                      task.status === 'Active' ? 'bg-cyan-500/10 border-cyan-500/20 text-cyan-500' :
                                      task.status === 'Cancelled' ? 'bg-rose-500/10 border-rose-500/20 text-rose-500' :
                                      'bg-amber-500/10 border-amber-500/20 text-amber-500'
                                    }`}>
                                      {task.status}
                                    </span>
                                  </td>
                                  <td className="py-4 pr-2 text-right">
                                    <div className="flex justify-end gap-1.5">
                                      {task.status !== 'Active' && task.status !== 'Completed' && task.status !== 'Cancelled' && (
                                        <button
                                          onClick={() => handleUpdateTaskStatus(task.id, 'Active')}
                                          className="px-2 py-1 rounded text-[9px] font-bold uppercase text-cyan-600 bg-cyan-500/10 hover:bg-cyan-500 hover:text-white transition-all cursor-pointer"
                                        >
                                          Activate
                                        </button>
                                      )}
                                      {task.status !== 'Completed' && task.status !== 'Cancelled' && (
                                        <button
                                          onClick={() => handleUpdateTaskStatus(task.id, 'Completed')}
                                          className="px-2 py-1 rounded text-[9px] font-bold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-white transition-all cursor-pointer"
                                        >
                                          Complete
                                        </button>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              );
                            })
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Broadcast Announcements by Club Coordinator (Only for Coordinating Roles) */}
                  <div className="glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl text-left space-y-4">
                    <h3 className="font-bold text-sm text-slate-800 dark:text-white uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                      <Bell className="h-4.5 w-4.5 text-purple-650 dark:text-purple-400" />
                      <span>Broadcast Club Announcement</span>
                    </h3>

                    <form onSubmit={handleCoordinatorBroadcastSubmit} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Announcement Message</label>
                        <textarea
                          required
                          rows="3"
                          value={broadcastTitle}
                          onChange={(e) => setBroadcastTitle(e.target.value)}
                          placeholder="e.g., Turing Club Volunteers meeting at Lab 3 at 04:30 PM for acoustics setup coordination."
                          className="w-full px-4 py-3 rounded-2xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-850 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</label>
                          <select
                            value={broadcastCategory}
                            onChange={(e) => setBroadcastCategory(e.target.value)}
                            className="w-full px-4 py-3 rounded-2xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-805 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                          >
                            <option value="General">General Info</option>
                            <option value="Event Update">Event Update</option>
                            <option value="Urgent Alert">Urgent Alert</option>
                          </select>
                        </div>
                        <div className="flex items-end">
                          <button
                            type="submit"
                            className="w-full py-3 bg-purple-650 hover:bg-purple-750 text-white font-extrabold uppercase rounded-2xl transition-all text-xs tracking-wider flex items-center justify-center cursor-pointer shadow-md"
                          >
                            Broadcast Bulletin
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </motion.div>
              )}

              {/* 10. VIEW: Team Helpdesk Messages Inbox (Coordinators) */}
              {activeTab === 'team-messages' && isCoordinatingRole && (
                <motion.div
                  key="team-messages"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-white">Volunteer Messages Inbox</h2>
                    <p className="text-xs text-slate-400 mt-1 font-sans">Review messages and compose replies to helpdesk logs from club volunteers.</p>
                  </div>

                  <div className="space-y-4">
                    {myCoordinatorMessages.length === 0 ? (
                      <div className="p-12 text-center rounded-[2.5rem] bg-white/40 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 text-slate-400 font-bold">
                        Inbox is empty. No volunteer messages logged.
                      </div>
                    ) : (
                      myCoordinatorMessages.map(msg => {
                        const mSenderName = msg.sender_name || msg.senderName;
                        const mSenderEmail = msg.sender_email || msg.senderEmail;
                        const mClubName = msg.club_name || msg.clubName;
                        const mMsg = msg.message || msg.message;
                        const mTime = msg.timestamp || msg.timestamp;
                        const mReply = msg.reply || msg.reply;
                        const mRepliedAt = msg.replied_at || msg.repliedAt;

                        return (
                          <div key={msg.id} className="glass-card rounded-[2rem] p-5 border border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl text-left space-y-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="text-xs font-black text-slate-850 dark:text-white">{mSenderName}</h4>
                                <p className="text-[10px] text-slate-400 font-sans mt-0.5">{mSenderEmail} • {mClubName}</p>
                              </div>
                              <span className="text-[9px] text-slate-400 font-mono">{mTime}</span>
                            </div>
                            
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 font-sans pl-2 border-l-2 border-purple-500">
                              {mMsg}
                            </p>

                            {mReply ? (
                              <div className="p-3 rounded-2xl bg-purple-500/5 border border-purple-500/10 text-xxs font-sans space-y-1 ml-4">
                                <p className="text-purple-650 dark:text-purple-400 font-black uppercase tracking-wider text-[8px]">Replied:</p>
                                <p className="text-slate-700 dark:text-slate-350 font-semibold">{mReply}</p>
                                <span className="text-[8px] text-slate-455 dark:text-slate-500 font-mono block">{mRepliedAt}</span>
                              </div>
                            ) : replyingMessageId === msg.id ? (
                              <div className="space-y-2 ml-4">
                                <textarea
                                  rows="3"
                                  value={replyText}
                                  onChange={(e) => setReplyText(e.target.value)}
                                  placeholder="Type your reply to volunteer..."
                                  className="w-full px-4.5 py-3 rounded-2xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                                />
                                <div className="flex justify-end gap-2">
                                  <button
                                    onClick={() => setReplyingMessageId(null)}
                                    className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={() => handleSendReply(msg.id)}
                                    className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase text-white bg-purple-650 hover:bg-purple-750 transition-all cursor-pointer"
                                  >
                                    Send Reply
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => { setReplyingMessageId(msg.id); setReplyText(''); }}
                                className="px-3 py-1.5 rounded-xl text-[10px] font-black uppercase bg-purple-600/10 text-purple-650 dark:text-purple-400 hover:bg-purple-600 hover:text-white transition-all cursor-pointer inline-flex items-center gap-1 shadow-sm"
                              >
                                <Send className="h-3 w-3" />
                                Reply Message
                              </button>
                            )}
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}

              {/* 11. VIEW: Registrations review Tab (Coordinators) */}
              {activeTab === 'registrations' && isCoordinatingRole && (
                <motion.div
                  key="registrations"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="space-y-6"
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-white/5 pb-4 text-left">
                    <div>
                      <h2 className="text-xl font-black text-slate-800 dark:text-white">Enrollment Review Dashboard</h2>
                      <p className="text-xs text-slate-400 mt-1">Approve or reject student event entry registrations pass.</p>
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

                  <div className="glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 overflow-hidden bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl">
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
                                No student registrations found.
                              </td>
                            </tr>
                          ) : (
                            filteredRegs.map(reg => (
                              <tr key={reg.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/50 dark:hover:bg-white/2 transition-colors">
                                <td className="py-4 pl-2 font-bold text-slate-800 dark:text-white">{reg.studentName}</td>
                                <td className="py-4">
                                  <div className="font-semibold text-slate-700 dark:text-slate-350">{reg.email}</div>
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
                                    <span className="text-[10px] text-slate-400 italic">Not Approved</span>
                                  )}
                                </td>
                                <td className="py-4 font-sans">
                                  {reg.status === 'approved' && reg.attendance === 'Present' ? (
                                    <Link
                                      to={`/certificate?certId=${reg.id}&name=${encodeURIComponent(reg.studentName)}&event=${encodeURIComponent(reg.eventTitle)}&type=Participation`}
                                      className="px-2.5 py-1 rounded text-[9px] font-black uppercase text-amber-500 bg-amber-500/10 hover:bg-amber-500 hover:text-white transition-all cursor-pointer inline-block"
                                    >
                                      Download
                                    </Link>
                                  ) : (
                                    <span className="text-[10px] text-slate-400 italic">Unavailable</span>
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

            </AnimatePresence>
          )}

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
                    className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase text-white bg-purple-650 hover:bg-purple-750 transition-all shadow-md"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Allocate Task Modal */}
      <AnimatePresence>
        {showAddTaskModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddTaskModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0D0F22] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                <h3 className="text-base font-black uppercase text-slate-800 dark:text-white">Allocate Volunteer Task</h3>
                <button
                  onClick={() => setShowAddTaskModal(false)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleAddTask} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Volunteer</label>
                  <select
                    required
                    value={newTaskVolunteer}
                    onChange={(e) => setNewTaskVolunteer(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                  >
                    <option value="">-- Choose Volunteer --</option>
                    {teamMembers.map(m => (
                      <option key={m.id} value={m.name}>{m.name} ({m.designation || 'Volunteer'})</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Select Event</label>
                  <select
                    required
                    value={newTaskEvent}
                    onChange={(e) => setNewTaskEvent(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                  >
                    <option value="">-- Choose Event --</option>
                    {events.map(evt => (
                      <option key={evt.id} value={evt.title}>{evt.title}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Task Description</label>
                  <textarea
                    required
                    rows="3"
                    value={newTaskDesc}
                    onChange={(e) => setNewTaskDesc(e.target.value)}
                    placeholder="e.g. Help at security checkpoint, configure audio settings..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Shift / Timing</label>
                  <input
                    type="text"
                    required
                    value={newTaskShift}
                    onChange={(e) => setNewTaskShift(e.target.value)}
                    placeholder="e.g. 09:00 AM - 01:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddTaskModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase text-white bg-purple-650 hover:bg-purple-750 transition-all shadow-md"
                  >
                    Allocate Task
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Performance Rating Modal */}
      <AnimatePresence>
        {ratingModalMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setRatingModalMember(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-md bg-white dark:bg-[#0D0F22] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-left"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3 mb-5">
                <h3 className="text-base font-black uppercase text-slate-800 dark:text-white">Rate Volunteer Performance</h3>
                <button
                  onClick={() => setRatingModalMember(null)}
                  className="p-1 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSavePerformanceRating} className="space-y-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold text-slate-805 dark:text-white">Volunteer: {ratingModalMember.name}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">Designation: {ratingModalMember.designation || 'Student Volunteer'}</p>
                </div>

                <div className="space-y-1 text-center py-2 bg-slate-50 dark:bg-white/2 rounded-2xl border border-slate-200/50 dark:border-white/5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-1">Star Score</label>
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map(stars => (
                      <button
                        key={stars}
                        type="button"
                        onClick={() => setNewRatingStars(stars)}
                        className="p-1 cursor-pointer hover:scale-110 transition-transform"
                      >
                        <Star className={`h-8 w-8 ${stars <= newRatingStars ? 'fill-amber-400 text-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Coordinator Review / Comments</label>
                  <textarea
                    rows="4"
                    value={newRatingFeedback}
                    onChange={(e) => setNewRatingFeedback(e.target.value)}
                    placeholder="Enter outstanding review comments or feedback..."
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-350 dark:border-white/10 bg-white dark:bg-slate-900 text-xs text-slate-850 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <button
                    type="button"
                    onClick={() => setRatingModalMember(null)}
                    className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl text-xxs font-black uppercase text-white bg-purple-650 hover:bg-purple-750 transition-all shadow-md"
                  >
                    Save Rating
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
