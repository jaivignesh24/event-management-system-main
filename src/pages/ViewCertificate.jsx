import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Award, ArrowLeft, Printer, Download, CheckCircle, Sparkles } from 'lucide-react';

export const ViewCertificate = () => {
  const location = useLocation();
  
  // Parse certificate details from query parameters
  const searchParams = new URLSearchParams(location.search);
  const certId = searchParams.get('certId') || 'AUR-CERT-745109';
  const name = searchParams.get('name') || 'Student Recipient';
  const event = searchParams.get('event') || 'Aurora Hackathon 2026';
  const type = searchParams.get('type') || 'Winner';
  const date = searchParams.get('date') || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-[#070913] text-slate-850 dark:text-slate-100 flex flex-col items-center justify-center transition-colors duration-300 relative font-sans text-left">
      
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/5 dark:bg-amber-500/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[100px] pointer-events-none" />

      <div className="w-full max-w-3xl space-y-6 relative z-10">
        
        {/* Back Link & Actions */}
        <div className="flex items-center justify-between">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-orange-500 dark:hover:text-orange-400 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Portal Home</span>
          </Link>
          
          <div className="flex gap-2">
            <button 
              onClick={() => window.print()} 
              className="px-4 py-2 rounded-xl bg-amber-500 text-white font-extrabold uppercase text-xs flex items-center gap-1.5 shadow-md hover:bg-amber-600 transition-all cursor-pointer"
            >
              <Printer className="h-4 w-4" />
              <span>Print / PDF</span>
            </button>
          </div>
        </div>

        {/* Certificate Card */}
        <div className="relative w-full rounded-[2.5rem] bg-white dark:bg-slate-950 border-4 border-double border-amber-600 dark:border-amber-500/70 p-8 sm:p-14 shadow-2xl overflow-hidden text-center transition-all duration-300">
          
          {/* Certificate Graphic Watermarks */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/5 rounded-full blur-xl pointer-events-none" />

          <div className="border-2 border-amber-200/50 dark:border-amber-900/50 p-6 sm:p-10 space-y-8 relative">
            
            <div className="space-y-3">
              <span className="text-[11px] tracking-[0.3em] font-black text-amber-600 dark:text-amber-400 uppercase block">
                Certificate of Achievement
              </span>
              <h2 className="text-3xl sm:text-4xl font-serif text-slate-800 dark:text-white font-bold leading-tight">
                Aurora Deemed to be University
              </h2>
              <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-amber-500 to-transparent mx-auto mt-2" />
            </div>

            <p className="text-xs sm:text-sm text-slate-400 italic font-sans">This credential confirms that</p>
            
            <h3 className="text-3xl sm:text-4xl font-black text-amber-600 dark:text-amber-400 font-serif border-b-2 border-slate-200 dark:border-slate-800 w-fit mx-auto pb-2 px-8">
              {name}
            </h3>
            
            <p className="text-xs sm:text-sm text-slate-550 dark:text-slate-350 max-w-lg mx-auto leading-relaxed">
              has successfully achieved the status of <strong className="text-purple-600 dark:text-purple-400 uppercase">{type}</strong> in the flagship university mega-fest event 
              <strong className="block text-slate-850 dark:text-white text-base font-extrabold mt-2">"{event}"</strong> 
              conducted during Aurora Fest 2026.
            </p>

            {/* Seal Graphic decoration */}
            <div className="flex justify-center py-2">
              <div className="w-16 h-16 rounded-full border-4 border-double border-amber-600 flex items-center justify-center bg-amber-500/10 text-amber-600 relative">
                <Award className="h-8 w-8" />
                <div className="absolute inset-0 rounded-full border border-dashed border-amber-600/30 animate-spin-slow" />
              </div>
            </div>

            {/* Bottom Signature Line & Date */}
            <div className="grid grid-cols-2 gap-6 pt-8 border-t border-slate-150 dark:border-slate-850 text-left text-[11px] text-slate-400">
              <div className="space-y-1">
                <p className="font-bold uppercase tracking-wider text-slate-500">Date Issued</p>
                <p className="text-slate-800 dark:text-slate-200 font-semibold">{date}</p>
                <p className="mt-1 font-mono text-[9px]">ID: {certId}</p>
              </div>
              <div className="text-right space-y-1">
                <p className="font-bold uppercase tracking-wider text-slate-500">Authorized Signatory</p>
                <p className="font-serif italic text-slate-800 dark:text-slate-200 text-sm font-bold">Monisha</p>
                <p className="text-[9px]">Academic Affairs Coordinator</p>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default ViewCertificate;
