import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, ShieldCheck, MapPin, Calendar, Clock, ArrowLeft, School, GraduationCap } from 'lucide-react';

export const VerifyPass = () => {
  const location = useLocation();
  
  // Parse query parameters to extract scanned student data
  const searchParams = new URLSearchParams(location.search);
  const rawData = searchParams.get('data');
  
  let studentData = null;
  try {
    if (rawData) {
      studentData = JSON.parse(decodeURIComponent(rawData));
    }
  } catch (error) {
    console.error('Failed to parse scan data:', error);
  }

  // Fallback / default data if scanned URL has no data parameter
  const data = studentData || {
    name: 'Abhi Tej',
    college: 'Aurora Deemed to be University',
    rollNo: 'AUR2026CSE840',
    department: 'Computer Science & Engineering',
    year: '1st Year',
    events: [
      {
        title: 'Spandan Classical & Western Fusion',
        date: 'June 12, 2026',
        venue: 'Aurora Main Auditorium',
        time: '10:00 AM - 1:00 PM'
      }
    ]
  };

  const primaryEvent = data.events && data.events.length > 0 
    ? data.events[0] 
    : { title: 'Mega Fest Event Entry', date: 'June 12, 2026', venue: 'Main Campus Gates' };

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#070913] text-slate-850 dark:text-slate-100 flex flex-col items-center justify-center transition-colors duration-300 relative font-sans text-left">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-orange-500/5 dark:bg-orange-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-emerald-500/5 dark:bg-emerald-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-lg space-y-6 relative z-10">
        
        {/* Back Link / Top Bar */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Portal Home</span>
          </Link>
          
          <div className="flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Gate Verified</span>
          </div>
        </div>

        {/* Outer Scanner Pass Card */}
        <div className="relative w-full rounded-[2.5rem] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden transition-all duration-300">
          
          {/* Subtle Left Accent Border (Colored Gradient Strip) */}
          <div className="absolute left-0 inset-y-0 w-2.5 bg-gradient-to-b from-orange-500 via-amber-500 to-emerald-500" />

          <div className="p-8 sm:p-10 pl-10 space-y-8">
            
            {/* Header: ADMIT ONE & Status */}
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80 pb-5">
              <span className="text-[11px] tracking-[0.3em] font-black text-slate-400 dark:text-slate-500 uppercase">
                ADMIT ONE
              </span>
              <div className="flex items-center space-x-1.5 text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 text-[10px] font-black uppercase tracking-wider">
                <CheckCircle className="h-3.5 w-3.5" />
                <span>Verified</span>
              </div>
            </div>

            {/* Student Info */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {data.name}
              </h2>
              <div className="flex items-center space-x-2 text-slate-500 dark:text-slate-400">
                <School className="h-4 w-4 shrink-0 text-slate-400" />
                <span className="text-xs sm:text-sm font-semibold truncate">{data.college || 'Aurora Deemed to be University'}</span>
              </div>
            </div>

            {/* Dynamic Event Details Box */}
            <div className="rounded-2xl p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-950/50 dark:to-slate-950/20 border border-slate-200/60 dark:border-slate-800/80 space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] tracking-widest font-black uppercase text-orange-500">Registered Event</span>
                <h3 className="text-base sm:text-lg font-black text-slate-800 dark:text-white leading-snug">
                  {primaryEvent.title}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 border-t border-slate-200/50 dark:border-slate-800/50 text-xs text-slate-500 dark:text-slate-400 font-medium">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-orange-500 shrink-0" />
                  <span>{primaryEvent.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="h-4 w-4 text-orange-500 shrink-0" />
                  <span className="truncate">{primaryEvent.venue}</span>
                </div>
              </div>
            </div>

            {/* Bottom Metadata Badges */}
            <div className="grid grid-cols-3 gap-3">
              {/* DEPT BADGE */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-850 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] tracking-wider font-black uppercase text-slate-400 dark:text-slate-500 block mb-1">DEPT</span>
                <span className="text-xs font-black text-slate-800 dark:text-white truncate w-full">
                  {data.department ? data.department.split(' ')[0] : 'Computer'}
                </span>
              </div>

              {/* YEAR BADGE */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/50 border border-slate-200/50 dark:border-slate-850 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] tracking-wider font-black uppercase text-slate-400 dark:text-slate-500 block mb-1">YEAR</span>
                <span className="text-xs font-black text-slate-800 dark:text-white">
                  {data.year ? data.year.split(' ')[0] : '1st'}
                </span>
              </div>

              {/* STATUS BADGE */}
              <div className="p-4 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 flex flex-col justify-center items-center text-center">
                <span className="text-[9px] tracking-wider font-black uppercase text-emerald-600 dark:text-emerald-400 block mb-1">STATUS</span>
                <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  Verified
                </span>
              </div>
            </div>

            {/* Footer / Unique ticket ID */}
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800/80 pt-5 text-[10px] font-mono text-slate-400">
              <span>AURORA mega fest 2026</span>
              <span className="font-bold tracking-wider text-slate-700 dark:text-slate-300">ID: {data.rollNo || 'AUR2026CSE840'}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default VerifyPass;
