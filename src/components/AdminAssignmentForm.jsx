import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit, Trash2, Key, RefreshCw, 
  UserCheck, UserX, Mail, ShieldAlert, ShieldCheck, 
  Briefcase, Users, Award, Sparkles, Calendar, Phone, 
  Check, X, Camera, Info, CheckCircle2
} from 'lucide-react';
import { 
  fetchClubs, 
  fetchStats, 
  fetchMembers, 
  createMember, 
  updateMember, 
  deleteMember, 
  resetPassword, 
  resendCredentials 
} from '../services/memberService';

export const AdminAssignmentForm = () => {
  const [clubs, setClubs] = useState([]);
  const [stats, setStats] = useState({
    totalClubs: 0,
    totalClubHeads: 0,
    totalCoordinators: 0,
    totalVolunteers: 0,
    activeMembers: 0,
    inactiveMembers: 0
  });
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClub, setSelectedClub] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Modal control
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'edit'
  const [currentMemberId, setCurrentMemberId] = useState(null);

  // Success Notification state
  const [successNotification, setSuccessNotification] = useState(null);
  const [errorNotification, setErrorNotification] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const initialFormState = {
    name: '',
    email: '',
    mobile: '',
    department: 'Computer Science & Engineering',
    designation: '',
    employeeId: '',
    profileImage: '',
    clubId: '',
    role: 'Volunteer',
    joiningDate: new Date().toISOString().split('T')[0],
    status: 'Active'
  };
  const [formData, setFormData] = useState(initialFormState);

  const loadData = async () => {
    setLoading(true);
    try {
      const clubsData = await fetchClubs();
      setClubs(clubsData);
      
      const statsData = await fetchStats();
      setStats(statsData);

      const membersData = await fetchMembers({
        search: searchQuery,
        clubId: selectedClub,
        role: selectedRole,
        status: selectedStatus
      });
      setMembers(membersData);

      if (clubsData.length > 0 && !formData.clubId) {
        setFormData(prev => ({ ...prev, clubId: clubsData[0].id }));
      }
    } catch (err) {
      console.error('Error loading management system data:', err);
      setErrorNotification('Failed to fetch data from the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery, selectedClub, selectedRole, selectedStatus]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const showSuccess = (message) => {
    setSuccessNotification(message);
    setTimeout(() => setSuccessNotification(null), 5000);
  };

  const showError = (message) => {
    setErrorNotification(message);
    setTimeout(() => setErrorNotification(null), 5000);
  };

  const handleOpenCreateModal = () => {
    setModalMode('create');
    setFormData({
      ...initialFormState,
      clubId: clubs.length > 0 ? clubs[0].id : ''
    });
    setShowModal(true);
  };

  const handleOpenEditModal = (member) => {
    setModalMode('edit');
    setCurrentMemberId(member.id);
    setFormData({
      name: member.name || '',
      email: member.email || '',
      mobile: member.mobile || '',
      department: member.department || 'Computer Science & Engineering',
      designation: member.designation || '',
      employeeId: member.employee_id || '',
      profileImage: member.profile_image || '',
      clubId: member.club_id || '',
      role: member.role || 'Volunteer',
      joiningDate: member.joining_date ? member.joining_date.split('T')[0] : new Date().toISOString().split('T')[0],
      status: member.status || 'Active'
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.mobile || !formData.department || !formData.clubId || !formData.role) {
      showError('Please fill in all required fields.');
      return;
    }

    const emailDomain = "@aurora.edu.in";
    if (!formData.email.toLowerCase().endsWith(emailDomain)) {
      showError("Campus Rule: Members must be registered with official domain @aurora.edu.in");
      return;
    }

    setIsSubmitting(true);
    try {
      if (modalMode === 'create') {
        const response = await createMember(formData);
        if (response.success) {
          showSuccess("Member assigned successfully. Login credentials have been sent to the registered email.");
          setShowModal(false);
          loadData();
        } else {
          showError(response.message || 'Failed to assign member.');
        }
      } else {
        const response = await updateMember(currentMemberId, formData);
        if (response.success) {
          showSuccess("Member records updated successfully.");
          setShowModal(false);
          loadData();
        } else {
          showError(response.message || 'Failed to update member records.');
        }
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      showError(err.response?.data?.message || 'Server error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMember = async (id, name) => {
    if (window.confirm(`Are you sure you want to delete member ${name}? This will revoke access entirely.`)) {
      try {
        const res = await deleteMember(id);
        if (res.success) {
          showSuccess(`Revoked system authority and deleted member ${name}.`);
          loadData();
        } else {
          showError(res.message || 'Failed to delete member.');
        }
      } catch (err) {
        showError('Server error occurred during deletion.');
      }
    }
  };

  const handleToggleStatus = async (member) => {
    const newStatus = member.status === 'Active' ? 'Inactive' : 'Active';
    try {
      const res = await updateMember(member.id, { status: newStatus });
      if (res.success) {
        showSuccess(`Member status updated to ${newStatus}.`);
        loadData();
      } else {
        showError('Failed to change member status.');
      }
    } catch (err) {
      showError('Server error occurred.');
    }
  };

  const handleResetPassword = async (id, name) => {
    try {
      const res = await resetPassword(id);
      if (res.success) {
        showSuccess(`Password reset successfully for ${name}. New credentials dispatched to email.`);
      } else {
        showError('Failed to reset password.');
      }
    } catch (err) {
      showError('Server error during password reset.');
    }
  };

  const handleResendCredentials = async (id, name) => {
    try {
      const res = await resendCredentials(id);
      if (res.success) {
        showSuccess(`Credentials successfully resent to ${name}'s email address.`);
      } else {
        showError('Failed to resend credentials.');
      }
    } catch (err) {
      showError('Server error during credentials dispatch.');
    }
  };

  const StatCard = ({ title, value, icon: Icon, bgClass }) => (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/50 dark:bg-white/5 backdrop-blur-md rounded-2xl p-5 border border-purple-200/20 dark:border-purple-500/10 hover:shadow-lg hover:border-purple-500/30 transition-all flex items-center justify-between"
    >
      <div>
        <p className="text-[10px] uppercase tracking-widest text-slate-500 dark:text-slate-400 font-bold">{title}</p>
        <p className="text-3xl font-black text-slate-800 dark:text-white mt-1.5">{value}</p>
      </div>
      <div className={`p-3 rounded-xl ${bgClass}`}>
        <Icon className="w-6 h-6 text-purple-650 dark:text-purple-400" />
      </div>
    </motion.div>
  );

  return (
    <div className="w-full space-y-8 text-left">
      {/* Alert Feedbacks */}
      <AnimatePresence>
        {successNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center space-x-3 shadow-md"
          >
            <ShieldCheck className="h-5 w-5 shrink-0" />
            <span className="text-xs font-bold font-sans">{successNotification}</span>
          </motion.div>
        )}
        {errorNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-500 flex items-center space-x-3 shadow-md"
          >
            <ShieldAlert className="h-5 w-5 shrink-0" />
            <span className="text-xs font-bold font-sans">{errorNotification}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dashboard Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <StatCard title="Total Clubs" value={stats.totalClubs} icon={Briefcase} bgClass="bg-indigo-500/10" />
        <StatCard title="Club Heads" value={stats.totalClubHeads} icon={Award} bgClass="bg-purple-500/10" />
        <StatCard title="Coordinators" value={stats.totalCoordinators} icon={Users} bgClass="bg-pink-500/10" />
        <StatCard title="Volunteers" value={stats.totalVolunteers} icon={Sparkles} bgClass="bg-cyan-500/10" />
        <StatCard title="Active" value={stats.activeMembers} icon={UserCheck} bgClass="bg-emerald-500/10" />
        <StatCard title="Inactive" value={stats.inactiveMembers} icon={UserX} bgClass="bg-rose-500/10" />
      </div>

      {/* Main Directory Table */}
      <div className="glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight">Club Members Directory</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-sans font-medium mt-1">
              Search and manage roles, verify access, change settings, or issue password resets across the campus registry.
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-3.5 bg-purple-650 hover:bg-purple-750 text-white font-extrabold uppercase rounded-2xl transition-all text-xs tracking-wider flex items-center justify-center cursor-pointer shadow-md self-start sm:self-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            <span>Add Member</span>
          </button>
        </div>

        {/* Search & Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search member name, email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-10 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/55 font-sans text-xs font-semibold"
            />
            <Search className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
          </div>

          <select
            value={selectedClub}
            onChange={(e) => setSelectedClub(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/55 font-sans text-xs font-semibold"
          >
            <option value="">All Clubs</option>
            {clubs.map(c => (
              <option key={c.id} value={c.id}>{c.club_name}</option>
            ))}
          </select>

          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/55 font-sans text-xs font-semibold"
          >
            <option value="">All Roles</option>
            <option value="Club Head">Club Head</option>
            <option value="Club Coordinator">Club Coordinator</option>
            <option value="Faculty Coordinator">Faculty Coordinator</option>
            <option value="Volunteer Lead">Volunteer Lead</option>
            <option value="Volunteer">Volunteer</option>
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/55 font-sans text-xs font-semibold"
          >
            <option value="">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-100 dark:border-white/5 bg-transparent">
          <table className="w-full border-collapse text-left text-xs font-sans">
            <thead>
              <tr className="bg-slate-100/50 dark:bg-white/2 text-slate-400 font-bold uppercase border-b border-slate-200 dark:border-white/5">
                <th className="py-4 px-4 pl-5">Member</th>
                <th className="py-4 px-4">Contact Info</th>
                <th className="py-4 px-4">Designation & Dept</th>
                <th className="py-4 px-4">Club & Role</th>
                <th className="py-4 px-4">Joined Date</th>
                <th className="py-4 px-4">Status</th>
                <th className="py-4 px-4 pr-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-455 font-bold">
                    <RefreshCw className="h-6 w-6 mx-auto animate-spin text-purple-650" />
                    <p className="mt-2 text-xs uppercase tracking-wider">Loading registry data...</p>
                  </td>
                </tr>
              ) : members.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-slate-400 font-bold">
                    <Info className="h-8 w-8 mx-auto opacity-40 mb-2" />
                    No members found in directory registry.
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member.id} className="border-b border-slate-100 dark:border-slate-900 hover:bg-slate-50/20 dark:hover:bg-white/2 transition-colors">
                    <td className="py-4 px-4 pl-5">
                      <div className="flex items-center space-x-3.5">
                        <div className="relative shrink-0">
                          {member.profile_image ? (
                            <img
                              src={member.profile_image}
                              alt={member.name}
                              className="w-10 h-10 rounded-full object-cover border border-purple-200 dark:border-purple-900"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-purple-500/20 to-pink-500/20 text-purple-700 dark:text-purple-300 flex items-center justify-center text-xs font-black uppercase border border-purple-200/50">
                              {member.name.substring(0, 2)}
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-bold text-slate-800 dark:text-white">{member.name}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">ID: {member.employee_id || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-semibold text-slate-700 dark:text-slate-350">{member.email}</div>
                      <div className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Phone className="w-3 h-3 text-purple-600 dark:text-purple-400" />
                        {member.mobile}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800 dark:text-slate-200">{member.designation || 'Staff Lead'}</div>
                      <div className="text-[10px] text-purple-650 dark:text-purple-400 font-bold uppercase mt-0.5">{member.department}</div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="font-bold text-slate-800 dark:text-white">{member.club_name || 'No Club'}</div>
                      <div className="text-[10px] text-indigo-650 dark:text-indigo-400 font-bold uppercase mt-0.5">{member.role}</div>
                    </td>
                    <td className="py-4 px-4 text-slate-500 dark:text-slate-400 font-semibold">
                      {member.joining_date ? new Date(member.joining_date).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => handleToggleStatus(member)}
                        className={`px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider text-[9px] border cursor-pointer ${
                          member.status === 'Active'
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
                        }`}
                      >
                        {member.status}
                      </button>
                    </td>
                    <td className="py-4 px-4 pr-5 text-right">
                      <div className="flex justify-end items-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(member)}
                          title="Edit Details"
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-350 cursor-pointer"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResetPassword(member.id, member.name)}
                          title="Reset Password"
                          className="p-1.5 rounded-lg bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 cursor-pointer"
                        >
                          <Key className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleResendCredentials(member.id, member.name)}
                          title="Resend Credentials"
                          className="p-1.5 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-600 dark:text-indigo-455 cursor-pointer"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id, member.name)}
                          title="Revoke Authority"
                          className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/25 text-rose-500 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create & Edit Member Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#0D0F22] border border-slate-200 dark:border-white/10 rounded-[2.5rem] p-6 sm:p-8 shadow-2xl text-left overflow-y-auto max-h-[90vh] scrollbar-thin"
            >
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-4 mb-5">
                <div className="flex items-center space-x-2">
                  <Sparkles className="h-5 w-5 text-purple-600" />
                  <h3 className="text-lg font-black uppercase text-slate-800 dark:text-white">
                    {modalMode === 'create' ? 'Assign New Authority Member' : 'Update Member details'}
                  </h3>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5 hover:text-slate-800 dark:hover:text-white cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Profile Photo Upload Section */}
                <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-5 p-4 rounded-2xl bg-slate-50 dark:bg-white/2 border border-slate-150 dark:border-white/5">
                  <div className="relative">
                    {formData.profileImage ? (
                      <img
                        src={formData.profileImage}
                        alt="Profile Preview"
                        className="w-20 h-20 rounded-full object-cover border-2 border-purple-500"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-400 flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700">
                        <Camera className="w-8 h-8" />
                      </div>
                    )}
                  </div>
                  <div className="text-center sm:text-left space-y-1">
                    <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Profile Photo</label>
                    <p className="text-xxs text-slate-500 dark:text-slate-400">Upload high-resolution member headshot or student card snapshot.</p>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="text-xxs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xxs file:font-bold file:bg-purple-500/10 file:text-purple-650 dark:file:text-purple-400 hover:file:bg-purple-500/20 cursor-pointer pt-2"
                    />
                  </div>
                </div>

                {/* Section A: Personal Information */}
                <div className="space-y-4">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-white/5 pb-1">Personal Details</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Full Name *</label>
                      <input
                        type="text"
                        required
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. John Doe"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Email Address *</label>
                      <input
                        type="email"
                        required
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="e.g. john.doe@aurora.edu.in"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        name="mobile"
                        value={formData.mobile}
                        onChange={handleInputChange}
                        placeholder="e.g. +91 98765 43210"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Department *</label>
                      <select
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                      >
                        <option value="Computer Science & Engineering">Computer Science & Engineering</option>
                        <option value="Information Technology">Information Technology</option>
                        <option value="Mechanical Engineering">Mechanical Engineering</option>
                        <option value="Electronics & Communication">Electronics & Communication</option>
                        <option value="Electrical & Electronics">Electrical & Electronics</option>
                        <option value="Academic Affairs Coordinators">Academic Affairs Coordinators</option>
                        <option value="Central Administration">Central Administration</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Designation</label>
                      <input
                        type="text"
                        name="designation"
                        value={formData.designation}
                        onChange={handleInputChange}
                        placeholder="e.g. Assistant Professor, Student Representative"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Employee ID / Student ID</label>
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        placeholder="e.g. AUR2026ADM145"
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                      />
                    </div>
                  </div>
                </div>

                {/* Section B: Club Information */}
                <div className="space-y-4 pt-2">
                  <h4 className="text-[11px] font-black uppercase tracking-widest text-purple-600 dark:text-purple-400 border-b border-slate-100 dark:border-white/5 pb-1">Club & Role Assignment</h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Select Campus Club *</label>
                      <select
                        required
                        name="clubId"
                        value={formData.clubId}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                      >
                        <option value="" disabled>Choose a Club</option>
                        {clubs.map(c => (
                          <option key={c.id} value={c.id}>{c.club_name}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Role Type *</label>
                      <select
                        required
                        name="role"
                        value={formData.role}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                      >
                        <option value="Club Head">Club Head</option>
                        <option value="Club Coordinator">Club Coordinator</option>
                        <option value="Volunteer Lead">Volunteer Lead</option>
                        <option value="Volunteer">Volunteer</option>
                        <option value="Faculty Coordinator">Faculty Coordinator</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Joining Date</label>
                      <input
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</label>
                      <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-white/10 bg-white dark:bg-slate-900 text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50 text-xs font-semibold"
                      >
                        <option value="Active">Active</option>
                        <option value="Inactive">Inactive</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-6 border-t border-slate-100 dark:border-slate-850">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-5 py-3 rounded-xl text-xxs font-black uppercase border border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-3 rounded-xl text-xxs font-black uppercase text-white bg-purple-650 hover:bg-purple-750 transition-all shadow-md shadow-purple-500/10 cursor-pointer flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin mr-2" />
                    ) : modalMode === 'create' ? (
                      <Plus className="w-3.5 h-3.5 mr-2" />
                    ) : (
                      <Check className="w-3.5 h-3.5 mr-2" />
                    )}
                    <span>{modalMode === 'create' ? 'Assign Role & Generate' : 'Save Modifications'}</span>
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
