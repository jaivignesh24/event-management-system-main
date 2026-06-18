import React, { useState } from 'react';
import { useClub } from '../context/ClubContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, ShieldCheck, ShieldAlert, Sparkles, User, Briefcase, Plus } from 'lucide-react';

export const ClubFormationWidget = () => {
  const { clubRequests, approveClubRequest, rejectClubRequest } = useClub();
  const [alertMsg, setAlertMsg] = useState(null);

  const handleApprove = (id, name) => {
    approveClubRequest(id);
    setAlertMsg({ type: 'success', text: `Club "${name}" approved successfully!` });
    setTimeout(() => setAlertMsg(null), 4000);
  };

  const handleReject = (id, name) => {
    rejectClubRequest(id);
    setAlertMsg({ type: 'info', text: `Request for "${name}" rejected.` });
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
                : 'bg-indigo-500/10 border-indigo-500/20 text-indigo-500'
            }`}
          >
            {alertMsg.type === 'success' ? <ShieldCheck className="h-5 w-5" /> : <ShieldAlert className="h-5 w-5" />}
            <span className="text-xs font-bold font-sans">{alertMsg.text}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {clubRequests.map(req => (
          <motion.div
            key={req.id}
            className="glass-card rounded-[2.5rem] p-6 border border-slate-200/50 dark:border-white/5 shadow-md flex flex-col justify-between space-y-4 bg-white/60 dark:bg-[#0B0F23]/60 backdrop-blur-xl"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-600 dark:text-purple-400 text-[10px] font-bold uppercase tracking-wider">
                  <Sparkles className="h-3 w-3" />
                  <span>CLUB PROPOSAL</span>
                </div>
                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md ${
                  req.status === 'Approved' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' :
                  req.status === 'Rejected' ? 'bg-rose-500/10 text-rose-500 border border-rose-500/20' :
                  'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                }`}>
                  {req.status}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-black text-slate-800 dark:text-white leading-tight">{req.clubName}</h3>
                <div className="flex items-center space-x-2 mt-1 text-[11px] text-slate-500 font-semibold font-sans">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Applicant: <strong>{req.studentName}</strong></span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50/50 dark:bg-white/5 border border-slate-200/20 dark:border-white/5">
                <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider block mb-1">Proposed Purpose</span>
                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-sans font-medium">{req.purpose}</p>
              </div>
            </div>

            {req.status === 'Pending' && (
              <div className="flex justify-end gap-2 pt-2">
                <button
                  onClick={() => handleReject(req.id, req.clubName)}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-rose-500 bg-rose-500/10 hover:bg-rose-500 hover:text-white transition-all duration-300 cursor-pointer"
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>
                <button
                  onClick={() => handleApprove(req.id, req.clubName)}
                  className="flex items-center space-x-1 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-white bg-purple-600 hover:bg-purple-700 transition-all duration-300 cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Approve Club</span>
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};
