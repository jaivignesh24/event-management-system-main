import React from 'react';
import { useClub } from '../context/ClubContext';
import { useEvents } from '../context/EventContext';
import { BarChart3, Users, Calendar, Trophy, Percent, TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

export const AnalyticsDashboard = () => {
  const { clubs } = useClub();
  const { events } = useEvents();

  // Compute metrics
  const totalClubs = clubs.length;
  const totalEvents = events.length;
  const totalRegistrations = events.reduce((acc, curr) => acc + (curr.registrations || 0), 0);
  const averageEngagement = totalEvents ? Math.round(totalRegistrations / totalEvents) : 0;

  const departmentData = [
    { name: 'Computer Science', count: 850, percentage: 65, color: 'bg-neonCyan' },
    { name: 'Electronics & Comm', count: 320, percentage: 24, color: 'bg-neonPurple' },
    { name: 'Mechanical Engg', count: 140, percentage: 11, color: 'bg-neonPink' }
  ];

  return (
    <div className="space-y-8 text-left font-sans">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Academic Clubs', value: totalClubs, subtext: 'Student-led societies', icon: Users, color: 'text-neonCyan bg-neonCyan/10 border-neonCyan/20' },
          { label: 'Active Events', value: totalEvents, subtext: 'Scheduled this fest', icon: Calendar, color: 'text-neonPurple bg-neonPurple/10 border-neonPurple/20' },
          { label: 'Event Signups', value: totalRegistrations, subtext: 'Total registrations', icon: Trophy, color: 'text-neonPink bg-neonPink/10 border-neonPink/20' },
          { label: 'Avg Attendance', value: averageEngagement, subtext: 'Attendees per event', icon: Percent, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' }
        ].map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              className="glass-card rounded-[2rem] p-6 border border-slate-200/50 dark:border-white/5 flex items-center justify-between shadow-md"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <div className="space-y-1">
                <span className="text-[10px] text-slate-500 dark:text-slate-400 uppercase font-black tracking-wider">{item.label}</span>
                <h4 className="text-3xl font-black text-slate-800 dark:text-white leading-none mt-1">{item.value}</h4>
                <p className="text-[9px] text-slate-400 font-semibold">{item.subtext}</p>
              </div>
              <div className={`p-3.5 rounded-2xl border ${item.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Graphics Row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Card: Department registrations */}
        <div className="lg:col-span-6 glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center space-x-2">
              <TrendingUp className="h-4 w-4 text-neonPurple" />
              <span>Signups by Department</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">Enrollment distributions of students participating in fest activities.</p>
          </div>

          <div className="space-y-4">
            {departmentData.map((dept, idx) => (
              <div key={idx} className="space-y-1.5 text-left">
                <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                  <span>{dept.name}</span>
                  <span>{dept.count} Students ({dept.percentage}%)</span>
                </div>
                <div className="w-full bg-slate-200/50 dark:bg-white/5 h-2 rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${dept.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${dept.percentage}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Card: Club Size distributions */}
        <div className="lg:col-span-6 glass-card rounded-[2.5rem] p-6 sm:p-8 border border-slate-200/50 dark:border-white/5 space-y-6">
          <div>
            <h3 className="text-base font-black text-slate-800 dark:text-white flex items-center space-x-2">
              <BarChart3 className="h-4 w-4 text-neonPink" />
              <span>Campus Club Metrics</span>
            </h3>
            <p className="text-[11px] text-slate-500 font-semibold mt-1">Comparison chart illustrating members enrolled across main academic societies.</p>
          </div>

          <div className="h-48 relative flex items-end justify-between px-2 pt-6">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-10">
              <div className="border-b border-slate-200 dark:border-slate-700 w-full" />
              <div className="border-b border-slate-200 dark:border-slate-700 w-full" />
              <div className="border-b border-slate-200 dark:border-slate-700 w-full" />
            </div>

            {clubs.slice(0, 5).map((club, idx) => {
              const sizes = [450, 280, 320, 210, 380, 520, 240];
              const size = sizes[idx] || 150;
              const maxVal = Math.max(...sizes);
              const heightPct = Math.round((size / maxVal) * 85);
              const colors = ['bg-neonCyan', 'bg-neonPurple', 'bg-neonPink', 'bg-amber-500', 'bg-emerald-500'];
              const colorClass = colors[idx] || 'bg-blue-500';

              return (
                <div key={club.id} className="flex-1 flex flex-col items-center justify-end h-full gap-2 relative z-10">
                  <span className="text-[9px] font-extrabold text-slate-700 dark:text-slate-300">{size}</span>
                  <motion.div
                    className={`w-8 sm:w-10 rounded-t-xl ${colorClass}`}
                    style={{ height: `${heightPct}%` }}
                    initial={{ scaleY: 0 }}
                    animate={{ scaleY: 1 }}
                    transition={{ duration: 0.6, delay: idx * 0.05 }}
                  />
                  <span className="text-[8px] uppercase font-black text-slate-500 dark:text-slate-400 tracking-wider truncate max-w-[60px]">
                    {club.name.split(' ')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};
