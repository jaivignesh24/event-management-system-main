import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Users, Award, ShieldCheck, ShieldAlert, Check, X, Sparkles } from 'lucide-react';

export const EventApprovalPanel = () => {
  const { pendingEvents, approvePendingEvent, rejectPendingEvent } = useClub();
  const [loadingId, setLoadingId] = useState(null);
  const [alertMsg, setAlertMsg] = useState(null);

  const handleApprove = async (eventId) => {
    setLoadingId(eventId);
    setAlertMsg(null);
    try {
      const result = await approvePendingEvent(eventId);
      if (result.success) {
        setAlertMsg({ type: 'success', text: 'Event approved and published live successfully!' });
      } else {
        setAlertMsg({ type: 'error', text: result.message || 'Failed to approve event.' });
      }
    } catch (err) {
      setAlertMsg({ type: 'error', text: 'Error interacting with server.' });
    } finally {
      setLoadingId(null);
      setTimeout(() => setAlertMsg(null), 4000);
    }
  };

  const handleReject = (eventId) => {
    rejectPendingEvent(eventId);
    setAlertMsg({ type: 'success', text: 'Event proposal rejected.' });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  return (
    <div className="space-y-6 text-left">
      <AnimatePresence>
        {alertMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl flex items-center space-x-3 border ${
              alertMsg.type === 'success'
                ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500'
                : 'bg-rose-500/10 border-rose-500/20 text-rose-500'
            }`}
          >
            {alertMsg.type === 'success' ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            <span className="text-xs font-bold font-sans">{alertMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {pendingEvents.length === 0 ? (
        <div className="p-12 text-center rounded-[2.5rem] bg-white/40 dark:bg-white/5 border border-slate-200/50 dark:border-white/5 space-y-3">
          <ShieldCheck className="h-12 w-12 text-emerald-500 mx-auto opacity-70" />
          <h3 className="text-lg font-black text-slate-800 dark:text-white">All Event Proposals Approved</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-sans max-w-sm mx-auto">
            There are no pending event registration proposals in the queue. All submissions are live in the event database.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pendingEvents.map(event => (
            <motion.div
              key={event.id}
              className="glass-card rounded-[2.5rem] overflow-hidden border border-slate-200/50 dark:border-white/5 shadow-lg flex flex-col justify-between"
              whileHover={{ y: -2 }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <div>
                {/* Event Image Banner */}
                <div className="relative h-48 w-full">
                  <img
                    src={event.image}
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

                {/* Event Details */}
                <div className="p-6 space-y-4">
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed font-sans font-medium">
                    {event.description}
                  </p>

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
                      <span>Max Attendees: <strong className="text-slate-700 dark:text-white">{event.totalSeats || 100}</strong></span>
                    </div>
                    {event.prizePool && event.prizePool !== 'N/A' && (
                      <div className="flex items-center space-x-2">
                        <Award className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                        <span>Prize Pool: <strong className="text-slate-700 dark:text-white">{event.prizePool}</strong></span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="p-4 bg-slate-50 dark:bg-white/5 border-t border-slate-100 dark:border-white/5 flex items-center justify-between gap-3">
                <span className="text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">{event.price}</span>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleReject(event.id)}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all duration-300 cursor-pointer"
                  >
                    <X className="h-3.5 w-3.5" />
                    <span>Reject</span>
                  </button>
                  <button
                    onClick={() => handleApprove(event.id)}
                    disabled={loadingId === event.id}
                    className="flex items-center space-x-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 cursor-pointer"
                  >
                    {loadingId === event.id ? (
                      <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Check className="h-3.5 w-3.5" />
                        <span>Approve Live</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
