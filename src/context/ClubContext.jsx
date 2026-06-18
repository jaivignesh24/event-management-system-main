import React, { createContext, useContext, useState, useEffect } from 'react';
import { Code, Cpu, Music, Play, Star, Trophy, Camera } from 'lucide-react';
import axios from 'axios';
import { useEvents } from './EventContext';

const ClubContext = createContext();

const MOCK_CLUBS_FALLBACK = [
  {
    id: 1,
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
    id: 2,
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
    id: 3,
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
    id: 4,
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
    id: 5,
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
    id: 6,
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
    id: 7,
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

export const ClubProvider = ({ children }) => {
  const { addEvent } = useEvents();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Initial mock club proposals
  const [clubRequests, setClubRequests] = useState([
    { id: 1, studentName: 'Rohan Mehta', clubName: 'AI & Robotics Club', purpose: 'To build high-octane autonomous battlebots for national arenas.', status: 'Pending' },
    { id: 2, studentName: 'Meghna Roy', clubName: 'Acoustics Music Society', purpose: 'To cultivate classical and rock band performers inside the campus.', status: 'Pending' },
    { id: 3, studentName: 'Priyanth Kumar', clubName: 'E-Sports Association', purpose: 'To organize competitive gaming tournaments and establish a varsity team.', status: 'Pending' }
  ]);

  // Initial mock pending events for Super Admin Approval
  const [pendingEvents, setPendingEvents] = useState([
    {
      id: 'tech-pending-1',
      title: "National AI Symposium",
      category: "Technical",
      type: "Webinar",
      description: "A premium session discussing details of GPT-5, Gemini Ultra models, and custom agents for enterprise cloud orchestration.",
      date: "2026-06-25",
      time: "02:00 PM onwards",
      venue: "GenAI Center of Excellence",
      coordinator: "Dr. Sandeep Nair (+91 98765 43210)",
      studentCoordinator: "Meghna Roy (+91 98765 00009)",
      price: "Free",
      image: "https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=800&q=80",
      tags: ["Generative AI", "Agents", "Future Tech"],
      totalSeats: 500,
      prizePool: "Digital Certificates + Swags",
      rules: ["Keep microphone muted.", "Register with college email."],
      requirements: "High-speed internet connection"
    },
    {
      id: 'cult-pending-1',
      title: "Choreography Face-Off",
      category: "Cultural",
      type: "Dance Club",
      description: "High-energy inter-college dance faceoff with top street dancers across the state. Live judging from celebrity choreographers.",
      date: "2026-06-27",
      time: "06:00 PM onwards",
      venue: "Open Air Amphitheatre Ground",
      coordinator: "Mrs. Rekha Sen (+91 98765 00004)",
      studentCoordinator: "Priya Singh (+91 98765 00004)",
      price: "₹150 per team",
      image: "https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80",
      tags: ["Dance", "Street-dance", "Showdown"],
      totalSeats: 150,
      prizePool: "₹50,000",
      rules: ["Maximum 6 members per team.", "No dangerous props."],
      requirements: "Costumes and audio CD in MP3 format"
    }
  ]);

  const loadClubs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/clubs');
      const data = response.data;
      if (data && data.length > 0) {
        setClubs(data.map(c => {
          const name = c.club_name;
          let icon = Code;
          let color = 'text-neonCyan border-neonCyan/30 bg-neonCyan/5';
          let glowColor = 'glow-cyan';

          if (name.includes('Coding')) {
            icon = Code;
            color = 'text-neonCyan border-neonCyan/30 bg-neonCyan/5';
            glowColor = 'glow-cyan';
          } else if (name.includes('Robotics')) {
            icon = Cpu;
            color = 'text-neonPurple border-neonPurple/30 bg-neonPurple/5';
            glowColor = 'glow-purple';
          } else if (name.includes('Dance')) {
            icon = Play;
            color = 'text-neonPink border-neonPink/30 bg-neonPink/5';
            glowColor = 'glow-pink';
          } else if (name.includes('Music')) {
            icon = Music;
            color = 'text-amber-400 border-amber-500/30 bg-amber-500/5';
            glowColor = 'glow-purple';
          } else if (name.includes('Cultural')) {
            icon = Star;
            color = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
            glowColor = 'glow-pink';
          } else if (name.includes('Sports')) {
            icon = Trophy;
            color = 'text-orange-400 border-orange-500/30 bg-orange-500/5';
            glowColor = 'glow-cyan';
          } else if (name.includes('Shutter') || name.includes('Photography')) {
            icon = Camera;
            color = 'text-emerald-400 border-emerald-500/30 bg-emerald-500/5';
            glowColor = 'glow-pink';
          }

          return {
            id: c.id,
            name: c.club_name,
            description: c.description,
            icon,
            color,
            glowColor,
            members: 'Active Members',
            coordinator: 'Assigned Head',
            email: `${name.toLowerCase().replace(/\s+/g, '')}@aurora.edu.in`,
            achievements: ['Active campus club'],
            poster: name.includes('Coding') ? 'https://images.unsplash.com/photo-1526374965328-4dd421887fb3?auto=format&fit=crop&w=600&q=80' :
                    name.includes('Robotics') ? 'https://images.unsplash.com/photo-1521401830885-67c6a1916ae6?auto=format&fit=crop&w=600&q=80' :
                    name.includes('Dance') ? 'https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa?auto=format&fit=crop&w=600&q=80' :
                    name.includes('Music') ? 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=600&q=80' :
                    name.includes('Cultural') ? 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=600&q=80' :
                    name.includes('Sports') ? 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80' :
                    'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?auto=format&fit=crop&w=600&q=80'
          };
        }));
      } else {
        setClubs(MOCK_CLUBS_FALLBACK);
      }
    } catch (err) {
      console.error('Failed to load clubs, using mock fallback:', err);
      setClubs(MOCK_CLUBS_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadClubs();
  }, []);

  const getClubStats = () => {
    return {
      totalClubs: clubs.length,
      activeClubs: clubs.length,
      totalMembers: 2310,
      pendingRequests: clubRequests.filter(r => r.status === 'Pending').length
    };
  };

  const approveClubRequest = (requestId) => {
    setClubRequests(prev => prev.map(req => {
      if (req.id === requestId) {
        const newClub = {
          id: req.clubName.toLowerCase().replace(/\s+/g, '-'),
          name: req.clubName,
          description: req.purpose,
          icon: Code,
          color: 'text-neonCyan border-neonCyan/30 bg-neonCyan/5',
          glowColor: 'glow-cyan',
          members: '1 Active Member',
          coordinator: 'Assigned Head',
          email: `${req.clubName.toLowerCase().replace(/\s+/g, '')}@aurora.edu.in`,
          achievements: ['Newly Formed Club'],
          poster: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?auto=format&fit=crop&w=600&q=80'
        };
        setClubs(oldClubs => [...oldClubs, newClub]);
        return { ...req, status: 'Approved' };
      }
      return req;
    }));
  };

  const rejectClubRequest = (requestId) => {
    setClubRequests(prev => prev.map(req => req.id === requestId ? { ...req, status: 'Rejected' } : req));
  };

  const assignClubHead = (clubId, adminName, adminEmail) => {
    setClubs(prev => prev.map(club => {
      if (club.id === clubId) {
        return {
          ...club,
          coordinator: adminName,
          email: adminEmail
        };
      }
      return club;
    }));
  };

  const approvePendingEvent = async (eventId) => {
    const eventToApprove = pendingEvents.find(e => e.id === eventId);
    if (!eventToApprove) return { success: false, message: 'Event not found' };

    const result = await addEvent(eventToApprove);
    if (result.success) {
      setPendingEvents(prev => prev.filter(e => e.id !== eventId));
      return { success: true };
    }
    return result;
  };

  const rejectPendingEvent = (eventId) => {
    setPendingEvents(prev => prev.filter(e => e.id !== eventId));
  };

  return (
    <ClubContext.Provider value={{
      clubs,
      clubRequests,
      pendingEvents,
      getClubStats,
      approveClubRequest,
      rejectClubRequest,
      assignClubHead,
      approvePendingEvent,
      rejectPendingEvent,
      loadClubs,
      loading
    }}>
      {children}
    </ClubContext.Provider>
  );
};

export const useClub = () => {
  const context = useContext(ClubContext);
  if (!context) {
    throw new Error('useClub must be used within a ClubProvider');
  }
  return context;
};
