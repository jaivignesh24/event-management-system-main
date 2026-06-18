import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useEvents } from '../context/EventContext';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Calendar, MapPin, CheckCircle, Info, X, Bookmark, Clock } from 'lucide-react';

export const Events = () => {
  const { events, registerForEvent, registrations } = useEvents();
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState('All');
  const [bookmarks, setBookmarks] = useState(() => JSON.parse(localStorage.getItem('aurora-bookmarks') || '[]'));
  const [isLoading, setIsLoading] = useState(false);
  
  // Feedback Modal/Toast State
  const [alertInfo, setAlertInfo] = useState(null);

  // Sync with search URL parameter if any (e.g. redirected from Home hero)
  useEffect(() => {
    const urlQuery = searchParams.get('search');
    if (urlQuery) {
      setSearchQuery(urlQuery);
    }
  }, [searchParams]);

  // Loading animation simulation on query change
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery, activeFilter]);

  useEffect(() => {
    localStorage.setItem('aurora-bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const categories = ['All', 'Technical', 'Cultural', 'Sports', 'Workshops', 'Webinars'];

  const toggleBookmark = (eventId) => {
    setBookmarks(prev => prev.includes(eventId) ? prev.filter(id => id !== eventId) : [...prev, eventId]);
  };

  const isBookmarked = (eventId) => bookmarks.includes(eventId);

  // Handle Event Registration
  const handleRegister = async (eventId) => {
    if (!currentUser) {
      setAlertInfo({
        type: 'error',
        message: 'Authentication Required',
        detail: 'Please sign in or register a student account to register for events.',
        actionLabel: 'Sign In',
        actionRoute: '/login'
      });
      return;
    }

    if (currentUser.role === 'admin') {
      setAlertInfo({
        type: 'error',
        message: 'Admin Restriction',
        detail: 'Administrators cannot register for student events. Please log in with a student account.',
        actionLabel: 'Go to Dashboard',
        actionRoute: '/dashboard'
      });
      return;
    }

    const result = await registerForEvent(currentUser.email, eventId);
    if (result.success) {
      setAlertInfo({
        type: 'success',
        message: 'Registration Confirmed!',
        detail: 'This event has been added to your student pass. You can access the entry QR code on your Dashboard.'
      });
    } else {
      setAlertInfo({
        type: 'info',
        message: 'Registration Alert',
        detail: result.message
      });
    }
  };

  const handleAlertAction = () => {
    if (alertInfo?.actionRoute) {
      navigate(alertInfo.actionRoute);
      setAlertInfo(null);
    }
  };

  // Filter & Search Logic
  const filteredEvents = events.filter(event => {
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query ||
                          event.title.toLowerCase().includes(query) || 
                          event.description.toLowerCase().includes(query) ||
                          event.category.toLowerCase().includes(query) ||
                          (event.tags && event.tags.some(t => t.toLowerCase().includes(query))) ||
                          (event.type && event.type.toLowerCase().includes(query));
    const matchesCategory = activeFilter === 'All' || event.category.toLowerCase() === activeFilter.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const isUserRegistered = (eventId) => {
    if (!currentUser) return false;
    const userRegs = registrations[currentUser.email] || [];
    return userRegs.includes(eventId);
  };

  return (
    <div className="relative w-full min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-slate-50 to-indigo-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-indigo-950/20 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans overflow-hidden">
      
      {/* Dynamic Toast Feedback Overlay */}
      <AnimatePresence>
        {alertInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-md w-full glass-card bg-white/90 dark:bg-slate-900/90 p-6 rounded-[2rem] text-left border border-slate-200 dark:border-slate-800 shadow-2xl relative"
            >
              <button
                onClick={() => setAlertInfo(null)}
                className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 transition-all text-slate-400"
              >
                <X className="h-4 w-4" />
              </button>
              
              <div className="flex items-start space-x-4">
                <div className={`p-3 rounded-full mt-1 shrink-0 ${
                  alertInfo.type === 'success' ? 'bg-emerald-500/10 text-emerald-500' :
                  alertInfo.type === 'error' ? 'bg-rose-500/10 text-rose-500' : 'bg-indigo-500/10 text-indigo-500'
                }`}>
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white">{alertInfo.message}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                     {alertInfo.detail}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap justify-end gap-3">
                {alertInfo.actionRoute && (
                  <button
                    onClick={handleAlertAction}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 shadow-sm hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
                  >
                    {alertInfo.actionLabel}
                  </button>
                )}
                <button
                  onClick={() => setAlertInfo(null)}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-500 hover:scale-[1.02] transition-all shadow-md shadow-purple-500/20"
                >
                  Understood
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className="max-w-full mx-auto w-full px-4 sm:px-8 lg:px-12 space-y-8 relative z-10">


        {/* Search and Filters Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative rounded-[2.5rem] p-5 sm:p-6 bg-white/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-xl space-y-5 overflow-hidden text-left"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-blue-500 opacity-5 blur-2xl z-0"></div>
          
          <div className="relative z-10 space-y-4">
            {/* Search input bar */}
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search events, workshops, venues, or fest tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-4 pl-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-950/40 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-purple-500/30 text-slate-800 dark:text-white transition-all placeholder:text-slate-400 font-medium text-sm"
              />
              <Search className="absolute left-4 top-4.5 h-5 w-5 text-slate-400" />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-4 text-xs font-bold text-rose-500 hover:text-rose-600 transition-colors"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Filter Categories Tabs */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              {categories.map((cat) => {
                const isActive = activeFilter === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => setActiveFilter(cat)}
                    className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-widest uppercase transition-all duration-300 ${
                      isActive
                        ? 'bg-gradient-to-r from-purple-600 to-blue-500 text-white shadow-lg shadow-purple-500/20 scale-105'
                        : 'bg-white/40 dark:bg-slate-950/40 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Loading Spinner / Skeleton Pulse Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse rounded-[2rem] bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-6 h-[440px] flex flex-col justify-between">
                <div className="space-y-4">
                  <div className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl w-full" />
                  <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded-xl w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded-xl w-1/2" />
                  <div className="space-y-2 mt-4">
                    <div className="h-3 bg-slate-100 dark:bg-slate-800/80 rounded w-full" />
                    <div className="h-3 bg-slate-100 dark:bg-slate-800/80 rounded w-5/6" />
                  </div>
                </div>
                <div className="h-11 bg-slate-200 dark:bg-slate-800 rounded-xl w-full mt-6" />
              </div>
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-[2.5rem] bg-white/50 dark:bg-slate-900/60 p-12 text-center max-w-md mx-auto space-y-4 shadow-md border border-slate-200 dark:border-slate-800"
          >
            <div className="p-4 bg-rose-500/10 text-rose-500 inline-block rounded-full shadow-inner">
              <Info className="h-8 w-8" />
            </div>
            <h3 className="text-xl font-black text-slate-800 dark:text-white">No Events Found</h3>
            <p className="text-xs text-slate-400 font-medium">
              We couldn't find any events matching your current filters or search terms. Please try modifying your query.
            </p>
            <button
              onClick={() => { setSearchQuery(''); setActiveFilter('All'); }}
              className="mt-4 px-6 py-3 rounded-xl text-xs font-bold uppercase text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-105 transition-all shadow-md shadow-purple-500/20"
            >
              Reset Filters
            </button>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            layout
          >
          <AnimatePresence mode="popLayout">
            {filteredEvents.map((event) => {
              const registered = isUserRegistered(event.id);
              const isSaved = isBookmarked(event.id);
              
              return (
                <motion.div
                  key={event.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 20 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => navigate(`/events/${event.id}`)}
                  className="group relative flex flex-col justify-between rounded-[2rem] overflow-hidden bg-white/50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-purple-500/5 hover:-translate-y-1.5 transition-all duration-300 text-left"
                >
                  
                  {/* Category Badge overlay */}
                  <div className="absolute top-4 left-4 z-20 px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-white bg-slate-950/80 backdrop-blur-md border border-white/10 shadow-md">
                    {event.category}
                  </div>
                  {event.trending && (
                    <div className="absolute top-14 left-4 z-20 px-3.5 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-white bg-gradient-to-r from-purple-600 to-blue-500 shadow-md">
                      Trending
                    </div>
                  )}

                  {/* Registered checkmark overlay */}
                  {registered && (
                    <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider text-emerald-400 bg-emerald-950/90 backdrop-blur-md border border-emerald-500/20 flex items-center space-x-1 shadow-md">
                      <CheckCircle className="h-3.5 w-3.5" />
                      <span>Registered</span>
                    </div>
                  )}

                  {/* Header visual */}
                  <div className="relative h-56 overflow-hidden shrink-0 bg-slate-100 dark:bg-slate-800">
                    <img
                      src={event.image || 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80'}
                      alt={event.title}
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80'; }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/30 to-transparent opacity-85" />
                    
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="text-[10px] font-extrabold text-purple-400 uppercase tracking-widest">{event.type}</p>
                      <h3 className="text-lg font-black text-white mt-1 group-hover:text-purple-400 transition-colors truncate">
                        {event.title}
                      </h3>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 flex-1 flex flex-col justify-between relative bg-white/30 dark:bg-slate-900/30">
                    <div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-medium">
                        {event.description}
                      </p>
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 mt-4">
                        {event.tags && event.tags.map(tag => (
                          <span key={tag} className="text-[9px] font-black uppercase px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-950 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      {/* Seat indicator */}
                      <div className="mt-5 bg-slate-50/50 dark:bg-slate-950/20 rounded-2xl p-4 border border-slate-200 dark:border-slate-800 space-y-2">
                        <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          <span>Seats remaining</span>
                          <strong className="text-slate-800 dark:text-white">{Math.max(event.totalSeats - event.registrations, 0)}</strong>
                        </div>
                        <div className="h-2 rounded-full bg-slate-200 dark:bg-slate-850 overflow-hidden shadow-inner">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-purple-600 to-blue-500"
                            style={{ width: `${Math.min((event.registrations / event.totalSeats) * 100, 100)}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 space-y-4">
                      {/* Event Coordinates */}
                      <div className="grid grid-cols-2 gap-2.5 text-xs text-slate-500">
                        <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-950/30 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold truncate">
                          <Calendar className="h-3.5 w-3.5 text-purple-500 shrink-0" />
                          <span>{new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                        </div>
                        <div className="flex items-center space-x-1.5 bg-slate-50 dark:bg-slate-950/30 py-2 px-3 rounded-xl border border-slate-200 dark:border-slate-800 font-semibold truncate">
                          <MapPin className="h-3.5 w-3.5 text-blue-500 shrink-0" />
                          <span>{event.venue.split(',')[0]}</span>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="flex items-center justify-between gap-3 pt-2">
                        <div className="flex flex-col">
                          <span className="text-[9px] text-slate-400 uppercase tracking-wider font-extrabold">Entry Pass</span>
                          <span className="text-base font-extrabold text-slate-800 dark:text-white mt-0.5">{event.price}</span>
                        </div>

                        <div className="flex gap-2 items-center ml-auto">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleBookmark(event.id);
                            }}
                            className={`p-2.5 rounded-xl transition-all border ${
                              isSaved
                                ? 'text-purple-500 border-purple-500/20 bg-purple-500/10'
                                : 'text-slate-400 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 hover:text-slate-800 dark:hover:text-white'
                            }`}
                          >
                            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
                          </button>
                          
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRegister(event.id);
                            }}
                            disabled={registered}
                            className={`px-5 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 shadow-md ${
                              registered
                                ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 cursor-default'
                                : 'text-white bg-gradient-to-r from-purple-600 to-blue-500 hover:scale-105 shadow-purple-500/15'
                            }`}
                          >
                            {registered ? 'Joined' : 'Register'}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        )}
      </div>
    </div>
  );
};
