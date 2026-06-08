import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import auroraLogo from '../pages/auroranew.png';
import { Mail, Phone, MapPin } from 'lucide-react';
import { FaInstagram, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';

export const Footer = () => {
  const location = useLocation();

  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  return (
    <footer className="relative mt-auto border-t border-slate-800/60 bg-gradient-to-br from-slate-950 via-slate-900 to-[#090c17] text-slate-300 overflow-hidden">
      
      {/* Decorative background glow blobs */}
      <div className="absolute top-0 left-1/4 w-80 h-80 rounded-full bg-neonPurple/5 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-neonCyan/5 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand/About */}
          <div className="space-y-6">
            <Link to="/" className="flex items-center gap-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-[2.5rem] bg-white/10 border border-white/10 p-3 shadow-glow flex items-center justify-center">
                <img src={auroraLogo} alt="Aurora logo" className="w-full h-full object-contain" />
              </div>
              <div>
                <p className="text-lg sm:text-xl font-black text-[var(--heading-color)]">Aurora University Fest</p>
                <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.35em] text-neonCyan font-semibold">University Festival 2026</p>
              </div>
            </Link>
            <p className="text-sm text-slate-300 leading-relaxed font-sans mt-2">
              Step into Aurora’s flagship celebration. Explore, compete, and celebrate technical innovation and cultural heritage in premium festival style.
            </p>
            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-4">
              <p className="text-sm uppercase tracking-[0.25em] text-neonPink font-semibold mb-3">Stay in the loop</p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your campus email"
                  className="flex-1 rounded-3xl border border-white/10 bg-slate-950/80 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-neonPurple/50"
                />
                <button className="rounded-3xl bg-gradient-to-r from-neonPurple to-neonPink px-5 py-3 text-sm font-bold text-white transition-all hover:shadow-[0_15px_40px_rgba(236,72,153,0.24)]">
                  Subscribe
                </button>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-3 rounded-3xl bg-white/5 hover:bg-neonPink/25 hover:text-white transition-all">
                <FaInstagram className="h-4 w-4" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-neonCyan/25 hover:text-white transition-all">
                <FaLinkedin className="h-4 w-4" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-neonPurple/25 hover:text-white transition-all">
                <FaTwitter className="h-4 w-4" />
              </a>
              <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-white/5 hover:bg-white/20 hover:text-white transition-all">
                <FaGithub className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h3 className="text-[var(--heading-color)] font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-neonPink pl-3">
              Explore Portal
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="text-slate-300 hover:text-neonCyan transition-all">Home Showcase</Link>
              </li>
              <li>
                <Link to="/events" className="text-slate-300 hover:text-neonPink transition-all">Fest Events</Link>
              </li>
              <li>
                <Link to="/clubs" className="text-slate-300 hover:text-neonPurple transition-all">Student Clubs</Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-300 hover:text-white transition-all">Highlights Gallery</Link>
              </li>
            </ul>
          </div>

          {/* Events Categories */}
          <div>
            <h3 className="text-[var(--heading-color)] font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-neonPurple pl-3">
              Categories
            </h3>
            <ul className="space-y-2.5 text-sm text-[var(--text-muted)]">
              <li>
                <Link to="/events" className="hover:text-white transition-all">Technical Hackathons</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-all">Cultural Dance & Music</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-all">Sports Tournament</Link>
              </li>
              <li>
                <Link to="/events" className="hover:text-white transition-all">Interactive Workshops</Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h3 className="text-[var(--heading-color)] font-semibold text-sm uppercase tracking-wider mb-4 border-l-2 border-neonCyan pl-3">
              University Hub
            </h3>
            <ul className="space-y-3.5 text-sm text-[var(--text-muted)]">
              <li className="flex items-start space-x-2.5">
                <MapPin className="h-4 w-4 text-neonPink shrink-0 mt-0.5" />
                <span>Aurora Deemed to be University, Uppal, Hyderabad, India</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Phone className="h-4 w-4 text-neonCyan shrink-0" />
                <span>+91 40 2766 2668</span>
              </li>
              <li className="flex items-center space-x-2.5">
                <Mail className="h-4 w-4 text-neonPurple shrink-0" />
                <span>fest@aurora.edu.in</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Divider */}
        <hr className="border-white/5 my-8" />

        {/* Bottom copyright and disclaimer */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[var(--text-muted)]">
          <p>© {new Date().getFullYear()} Aurora Deemed to be University. All rights reserved.</p>
          <div className="flex space-x-4 mt-2 sm:mt-0">
            <Link to="/" className="hover:text-[var(--text-muted)] transition-all">Privacy Policy</Link>
            <span>•</span>
            <Link to="/" className="hover:text-[var(--text-muted)] transition-all">Terms of Service</Link>
            <span>•</span>
            <Link to="/" className="hover:text-[var(--text-muted)] transition-all">Fest Guidelines</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
