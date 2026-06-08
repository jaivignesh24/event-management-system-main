import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Code, Cpu, Music, Play, Award, Star, Users, Phone, Mail, Sparkles, Trophy, Camera } from 'lucide-react';

const clubsList = [
  {
    id: 'coding',
    name: 'Turing Coding Club',
    description: 'The premier competitive programming, web development, and artificial intelligence community. Host of national hackathons and weekly algorithms sessions.',
    icon: Code,
    color: 'text-neonCyan border-neonCyan/30 bg-neonCyan/5',
    glowColor: 'glow-cyan',
    members: '450+ Active Members',
    coordinator: 'Dr. Vivek Saini',
    email: 'turing@aurora.edu.in',
    achievements: ['Smart India Hackathon 2025 Winner', '150+ Placements in Top Tech Companies', 'Weekly Code-a-Thon Hosts'],
    poster: 'https://images.unsplash.com/photo-1526374965328-4dd421887fb3?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'robotics',
    name: 'Tesla Robotics Club',
    description: 'Where hardware meets artificial intelligence. We design mechanical bots, drone networks, and state-of-the-art automated rovers for national championships.',
    icon: Cpu,
    color: 'text-neonPurple border-neonPurple/30 bg-neonPurple/5',
    glowColor: 'glow-purple',
    members: '280+ Active Members',
    coordinator: 'Prof. Alok Mehta',
    email: 'tesla.robo@aurora.edu.in',
    achievements: ['National RoboWars 2025 Gold Medal', 'Best Drone Innovation Award (Hyderabad)', 'Patented 2 Smart Assistive Tech devices'],
    poster: 'https://images.unsplash.com/photo-1521401830885-67c6a1916ae6?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'dance',
    name: 'Mudras Dance Club',
    description: 'Celebrating classical bharatanatyam, modern bollywood, and heavy hip-hop fusion choreography. We lead coordinates for all premium college fest openers.',
    icon: Play,
    color: 'text-neonPink border-neonPink/30 bg-neonPink/5',
    glowColor: 'glow-pink',
    members: '320+ Active Members',
    coordinator: 'Mrs. Rekha Sen',
    email: 'mudras@aurora.edu.in',
    achievements: ['Grand Trophy Winners at IIT Hyderabad Fest 2025', 'Best Inter-College Fusion Showpiece', 'Conducted National Dance Workshops'],
    poster: 'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'music',
    name: 'Symphony Music Club',
    description: 'Home to traditional Indian carnatic vocalists, heavy metal bands, and pop fusion artists. Hosts of battle of bands and open-air acoustics nights.',
    icon: Music,
    color: 'text-amber-400 border-amber-500/30 bg-amber-500/5',
    glowColor: 'glow-purple',
    members: '210+ Active Members',
    coordinator: 'Mr. Shivam Vyas',
    email: 'symphony@aurora.edu.in',
    achievements: ['Released student-led fusion music album', 'Winner - Battle of Bands 2025', 'State-level violin and sitar championships'],
    poster: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'cultural',
    name: 'Spandan Cultural Society',
    description: 'Representing drama, poetry, fine-arts, and high-fashion modeling groups. We manage the visual aesthetics and coordination of the grand Aura fest.',
    icon: Star,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
    glowColor: 'glow-pink',
    members: '380+ Active Members',
    coordinator: 'Mrs. Ritu Sharma',
    email: 'spandan@aurora.edu.in',
    achievements: ['Best Fashion Choreography (National Fest)', 'Winner - Inter-State Nukkad Natak Street Play', 'Conducted annual Arts & Craft exhibits'],
    poster: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'sports',
    name: 'Gladiators Sports Club',
    description: 'Promoting competitive cricket, football, basketball, and table tennis. We host Hyderabad’s prime T10 college premier leagues and indoor futsals.',
    icon: Trophy,
    color: 'text-orange-400 border-orange-500/30 bg-orange-500/5',
    glowColor: 'glow-cyan',
    members: '520+ Active Members',
    coordinator: 'Mr. Sunil Gavaskar',
    email: 'gladiators@aurora.edu.in',
    achievements: ['Inter-University Futsal Champions 2025', 'Gold Medal in South Zone Basketball League', 'Hosts of Mega Aurora Premier Cricket League'],
    poster: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80'
  },
  {
    id: 'photography',
    name: 'Shutter Society',
    description: 'The photography collective capturing fest highlights, stage performances, and campus culture in cinematic detail.',
    icon: Camera,
    color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5',
    glowColor: 'glow-pink',
    members: '240+ Active Members',
    coordinator: 'Ms. Nisha Kapoor',
    email: 'shutter@aurora.edu.in',
    achievements: ['Fest Media Awards 2025', 'Campus Photojournalism Leaders', 'National Photo Exhibit Curators'],
    poster: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=600&q=80'
  }
];

export const Clubs = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full min-h-screen pt-8 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-slate-50 via-white to-purple-50/50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 text-slate-800 dark:text-slate-200 transition-colors duration-300">
      
      <div className="max-w-full mx-auto w-full px-4 sm:px-8 lg:px-12 space-y-16 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Aurora Student Life</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-sans leading-tight text-slate-900 dark:text-white">
            Academic &{' '}
            <span className="bg-gradient-to-r from-orange-600 via-purple-600 to-blue-500 bg-clip-text text-transparent drop-shadow-sm font-black">
              Creative Clubs
            </span>
          </h1>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 font-semibold font-sans leading-relaxed">
            Discover student-led engineering societies, theatrical groups, sports clubs, and music circles. Join memberships, lead festivals, and find your passion.
          </p>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {clubsList.map((club, index) => (
            <motion.div
              key={club.id}
              className="group glass-card rounded-[2.5rem] overflow-hidden border border-slate-200 dark:border-white/10 hover:border-orange-500/50 hover:shadow-2xl transition-all relative flex flex-col bg-white/60 dark:bg-slate-900/60"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              
              {/* Image Banner */}
              <div className="relative h-56 overflow-hidden shrink-0">
                <img
                  src={club.poster}
                  alt={club.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-85" />
                
                {/* Floating Icon */}
                <div className={`absolute bottom-4 left-6 p-4 rounded-3xl backdrop-blur-md border ${club.color} shadow-lg shrink-0`}>
                  <club.icon className="h-6 w-6" />
                </div>
              </div>

              {/* Club Info */}
              <div className="p-8 text-left flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-orange-500 transition-colors">
                      {club.name}
                    </h3>
                    <span className="text-[10px] sm:text-xs font-bold px-3 py-1 rounded-full bg-slate-100 dark:bg-white/10 border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-200">
                      {club.members}
                    </span>
                  </div>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans font-medium">
                    {club.description}
                  </p>

                  {/* Achievements Checklist */}
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">Key Achievements</h4>
                    <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-200 font-semibold">
                      {club.achievements.map((ach, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <Trophy className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                          <span className="truncate">{ach}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-5 border-t border-slate-200 dark:border-white/10 flex flex-wrap gap-4 items-center justify-between">
                  <div className="text-[11px] space-y-0.5 text-slate-600 dark:text-slate-300 font-semibold">
                    <div className="flex items-center space-x-1.5">
                      <Users className="h-3.5 w-3.5 text-purple-500" />
                      <span>Coordinator: <strong className="text-slate-800 dark:text-slate-200">{club.coordinator}</strong></span>
                    </div>
                    <div className="flex items-center space-x-1.5">
                      <Mail className="h-3.5 w-3.5 text-blue-500" />
                      <span>Email: <strong className="text-slate-900 dark:text-slate-200">{club.email}</strong></span>
                    </div>
                  </div>

                  <button
                    onClick={() => navigate('/events')}
                    className="px-5 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 via-purple-600 to-blue-500 hover:scale-105 hover:shadow-neon-purple transition-all cursor-pointer shadow-md"
                  >
                    View Events
                  </button>
                </div>

              </div>

            </motion.div>
          ))}
        </div>

      </div>
    </div>
  );
};
