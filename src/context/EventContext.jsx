import React, { createContext, useContext, useState, useEffect } from 'react';

const EventContext = createContext();

const initialEvents = [
  // Technical
  {
    id: 'tech-1',
    title: 'Aurora Hackathon 2026',
    category: 'Technical',
    type: 'Hackathon',
    description: 'A national 36-hour hackathon to solve real-world problems in AI, Blockchain, and Sustainability. Win cash prizes worth ₹2,50,000!',
    date: '2026-05-24',
    time: '09:00 AM onwards',
    venue: 'Main Seminar Hall, CSE Block',
    coordinator: 'Dr. Vivek Saini (+91 98765 43210)',
    studentCoordinator: 'Rahul Sharma (+91 98765 00001)',
    price: '₹200 per team',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=900&q=80',
    tags: ['AI/ML', 'Blockchain', 'Cash Prizes'],
    trending: true,
    registrations: 45,
    totalSeats: 120,
    rules: [
      'Teams must consist of 2-4 members from the same or different colleges.',
      'Plagiarism in code will lead to instant disqualification.',
      'Bring your own laptops, extension cords, and sleeping bags.',
      'Final presentation must include a working prototype.'
    ],
    prizePool: '₹2,50,000',
    requirements: 'Laptops, Student ID, GitHub account'
  },
  {
    id: 'tech-2',
    title: 'Robo-Wars: Clash of Titans',
    category: 'Technical',
    type: 'Robotics',
    description: 'Design and build bots that crush, shred, and push their opponents out of the ring. High-octane mechanical action guaranteed.',
    date: '2026-05-25',
    time: '11:00 AM',
    venue: 'Mechanical Workshop Arena',
    coordinator: 'Prof. Alok Mehta (+91 87654 32109)',
    studentCoordinator: 'Aman Verma (+91 98765 00002)',
    price: '₹500 per bot',
    image: 'https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=900&q=80',
    tags: ['Robotics', 'Hardware', 'Battle Arena'],
    trending: true,
    registrations: 28,
    totalSeats: 80,
    rules: [
      'Maximum bot weight limit is 15kg.',
      'No use of liquid weapons, EMPs, or fire-based attacks.',
      'Bots must fit within a 50cm x 50cm starting box.',
      'Matches are 3 minutes long. Judges decision is final.'
    ],
    prizePool: '₹1,00,000',
    requirements: 'Custom-built robot, Spare parts, Safety gear'
  },
  {
    id: 'tech-3',
    title: 'Speed Coding Showdown',
    category: 'Technical',
    type: 'Coding Club',
    description: 'Solve complex algorithmic challenges in the shortest time. Multiple programming languages supported. Top positions get placements!',
    date: '2026-05-24',
    time: '02:00 PM',
    venue: 'Advanced CSE Lab 3',
    coordinator: 'Mrs. Ruchi Jain (+91 76543 21098)',
    studentCoordinator: 'Neha Gupta (+91 98765 00003)',
    price: '₹50 per head',
    image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=900&q=80',
    tags: ['Algorithms', 'Data Structures', 'Competitive Coding'],
    trending: false,
    registrations: 84,
    totalSeats: 100,
    rules: [
      'Individual participation only.',
      'Accessing the internet for solutions is strictly prohibited.',
      'Languages allowed: C++, Java, Python, JavaScript.',
      'Ties will be broken based on submission time.'
    ],
    prizePool: '₹50,000 + PPIs',
    requirements: 'Basic algorithms knowledge, HackerRank profile'
  },
  
  // Cultural
  {
    id: 'cult-1',
    title: 'Spandan: Inter-College Group Dance',
    category: 'Cultural',
    type: 'Dance Club',
    description: 'A spectacular showcase of Indian classical, fusion, folk, and hip-hop dance styles. Experience premium rhythm and energy!',
    date: '2026-05-25',
    time: '05:00 PM',
    venue: 'Aurora Central Auditorium',
    coordinator: 'Mrs. Rekha Sen (+91 65432 10987)',
    studentCoordinator: 'Priya Singh (+91 98765 00004)',
    price: '₹300 per group',
    image: 'https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&w=900&q=80',
    tags: ['Dance', 'Folk/Bollywood', 'Grand Trophy'],
    trending: true,
    registrations: 37,
    totalSeats: 90,
    rules: [
      'Group size: 6-15 members.',
      'Time limit: 5-8 minutes per performance.',
      'Audio tracks must be submitted 2 days prior to the event.',
      'Use of hazardous props (fire, glass) is banned.'
    ],
    prizePool: '₹75,000',
    requirements: 'Costumes, MP3 track in pendrive, Student IDs'
  },
  {
    id: 'cult-2',
    title: 'Acoustics: Battle of Bands',
    category: 'Cultural',
    type: 'Music Club',
    description: 'Rock, metal, semi-classical, and acoustic bands battle it out on stage for the ultimate bragging rights and custom band setups.',
    date: '2026-05-24',
    time: '04:00 PM',
    venue: 'Open Air Amphitheatre',
    coordinator: 'Mr. Shivam Vyas (+91 54321 09876)',
    studentCoordinator: 'Karan Desai (+91 98765 00005)',
    price: '₹400 per band',
    image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=900&q=80',
    tags: ['Live Music', 'Rock & Fusion', 'Cash Prizes'],
    trending: true,
    registrations: 15,
    totalSeats: 70,
    rules: [
      'Band size: 3-8 members.',
      'Performance time: 15 minutes (including soundcheck).',
      'Basic drum kit and amplifiers will be provided.',
      'Original compositions carry bonus points.'
    ],
    prizePool: '₹1,00,000 + Studio Recording Session',
    requirements: 'Own instruments (guitars, keyboards, etc.), Setlist'
  },
  {
    id: 'cult-3',
    title: 'Aurora DJ Night & EDM Fest',
    category: 'Cultural',
    type: 'Cultural Club',
    description: 'End the grand university festival dancing to neon lights with premium live sets by international and leading Bollywood DJs!',
    date: '2026-05-26',
    time: '07:00 PM',
    venue: 'Aurora Stadium Ground',
    coordinator: 'Prof. T. Reddy (+91 43210 98765)',
    studentCoordinator: 'Aditya Raj (+91 98765 00006)',
    price: 'Free with Fest Pass',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=80',
    tags: ['EDM', 'DJ Night', 'Laser Lights', 'Epic Finale'],
    trending: true,
    registrations: 1120,
    totalSeats: 1400,
    rules: [
      'Entry restricted to Aurora students and registered guests only.',
      'No bags or outside food/drinks allowed inside the arena.',
      'Gate closes at 8:00 PM sharp.',
      'Follow security instructions at all times.'
    ],
    prizePool: 'N/A',
    requirements: 'Valid Festival Pass, Valid ID Card'
  },
  
  // Sports
  {
    id: 'sports-1',
    title: 'Aurora Premier League (APL)',
    category: 'Sports',
    type: 'Cricket',
    description: 'The mega inter-collegiate T10 tennis ball cricket championship. Grab your bats and aim for the boundary lines.',
    date: '2026-05-23',
    time: '08:00 AM onwards',
    venue: 'Aurora Sports Complex Field A',
    coordinator: 'Mr. Sunil Gavaskar (+91 32109 87654)',
    studentCoordinator: 'Vikram Singh (+91 98765 00007)',
    price: '₹1000 per squad',
    image: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=900&q=80',
    tags: ['Cricket', 'T10 format', 'Mega Trophy'],
    trending: false,
    registrations: 16,
    totalSeats: 24,
    rules: [
      'Squad size: 15 players maximum.',
      'Knockout format. Matches are 10 overs per side.',
      'Umpire decision is final. No arguments allowed.',
      'Teams must report 30 mins before the scheduled toss.'
    ],
    prizePool: '₹50,000 + Championship Trophy',
    requirements: 'Team Kit (Whites/Color), Bats, Abdomen Guards'
  },
  {
    id: 'sports-2',
    title: 'Futsal Arena: 5v5 Championship',
    category: 'Sports',
    type: 'Football',
    description: 'Fast-paced, action-packed 5v5 indoor football under state-of-the-art sports complex lights. Instant knockout matches.',
    date: '2026-05-24',
    time: '09:30 AM',
    venue: 'Aurora Indoor Stadium Court 1',
    coordinator: 'Mr. Rahul Roy (+91 21098 76543)',
    studentCoordinator: 'Ankit Patel (+91 98765 00008)',
    price: '₹500 per team',
    image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
    tags: ['Futsal', 'Speed Play', 'Knockout'],
    trending: false,
    registrations: 24,
    totalSeats: 32,
    rules: [
      '5 players on court, 3 rolling substitutes.',
      'Matches consist of two 15-minute halves.',
      'No studded boots allowed on indoor courts (flat soles only).',
      'Yellow/Red card rules apply standard futsal regulations.'
    ],
    prizePool: '₹30,000',
    requirements: 'Team Jerseys, Indoor non-marking shoes, Shin pads'
  },
  
  // Workshops & Webinars
  {
    id: 'work-1',
    title: 'Generative AI Developer Bootcamp',
    category: 'Workshops',
    type: 'Workshop',
    description: 'Hands-on practical training on OpenAI APIs, LangChain, and deploying custom AI LLM agents in real production networks.',
    date: '2026-05-25',
    time: '10:00 AM',
    venue: 'GenAI Center of Excellence',
    coordinator: 'Dr. Sandeep Nair (+91 10987 65432)',
    studentCoordinator: 'Meghna Roy (+91 98765 00009)',
    price: '₹150 per head',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=900&q=80',
    tags: ['ChatGPT', 'LangChain', 'AI Agents', 'Certificates'],
    trending: true,
    registrations: 140,
    totalSeats: 160,
    rules: [
      'Basic Python knowledge is expected.',
      'Bring laptops with VS Code and Python 3.10+ installed.',
      'API keys will be provided during the workshop.',
      'Certificates will be issued only upon completing the capstone project.'
    ],
    prizePool: 'Certification + Swags',
    requirements: 'Laptop with WiFi capability'
  },
  {
    id: 'work-2',
    title: 'Future of Web3 & Blockchain networks',
    category: 'Webinars',
    type: 'Webinar',
    description: 'An online global seminar discussing the shift towards decentralised cloud, Ethereum L2 networks, and future smart contracts.',
    date: '2026-05-23',
    time: '04:00 PM',
    venue: 'Virtual (Zoom link provided on register)',
    coordinator: 'Prof. Anjali Sen (+91 99887 76655)',
    studentCoordinator: 'Rohan Mehta (+91 98765 00010)',
    price: 'Free',
    image: 'https://images.unsplash.com/photo-1639762681485-074b7f4eccd4?auto=format&fit=crop&w=900&q=80',
    tags: ['Web3', 'Blockchain', 'Ethereum', 'Online'],
    trending: false,
    registrations: 340,
    totalSeats: 450,
    rules: [
      'Join the Zoom link 10 minutes prior.',
      'Keep microphones muted unless permitted during Q&A.',
      'Attendance will be marked via feedback form at the end.'
    ],
    prizePool: 'Digital Certificates',
    requirements: 'Stable Internet Connection'
  }
];

export const EventProvider = ({ children }) => {
  const [registrations, setRegistrations] = useState(() => {
    const saved = localStorage.getItem('aurora-registrations');
    return saved ? JSON.parse(saved) : {};
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('aurora-events');
    const baseEvents = saved ? JSON.parse(saved) : initialEvents;
    
    const correctImages = {
      'tech-1': 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
      'tech-2': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      'tech-3': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      'cult-1': 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80',
      'cult-2': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      'cult-3': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
      'sports-1': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
      'sports-2': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
      'work-1': 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=800&q=80',
      'work-2': 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80'
    };

    const savedRegs = localStorage.getItem('aurora-registrations');
    const currentRegs = savedRegs ? JSON.parse(savedRegs) : {};

    return baseEvents.map(evt => {
      let count = 0;
      Object.values(currentRegs).forEach(userRegs => {
        if (Array.isArray(userRegs) && userRegs.includes(evt.id)) {
          count++;
        }
      });
      const img = correctImages[evt.id] || evt.image;
      return { ...evt, image: img, registrations: count };
    });
  });

  useEffect(() => {
    localStorage.setItem('aurora-events', JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    const correctImages = {
      'tech-1': 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80',
      'tech-2': 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80',
      'tech-3': 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
      'cult-1': 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80',
      'cult-2': 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80',
      'cult-3': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=800&q=80',
      'sports-1': 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?auto=format&fit=crop&w=800&q=80',
      'sports-2': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=800&q=80',
      'work-1': 'https://images.unsplash.com/photo-1591453089816-0fbb971b454c?auto=format&fit=crop&w=800&q=80',
      'work-2': 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&w=800&q=80'
    };

    setEvents(prev => prev.map(evt => {
      if (correctImages[evt.id] && evt.image !== correctImages[evt.id]) {
        return { ...evt, image: correctImages[evt.id] };
      }
      return evt;
    }));
  }, []);

  useEffect(() => {
    localStorage.setItem('aurora-registrations', JSON.stringify(registrations));
  }, [registrations]);

  const addEvent = (eventData) => {
    const newEvent = {
      ...eventData,
      id: `${eventData.category.toLowerCase().substring(0, 4)}-${Date.now()}`,
      registrations: 0,
      trending: false,
      tags: eventData.tags || []
    };
    setEvents(prev => [newEvent, ...prev]);
    return { success: true, event: newEvent };
  };

  const editEvent = (eventId, updatedData) => {
    setEvents(prev => prev.map(e => e.id === eventId ? { ...e, ...updatedData } : e));
    return { success: true };
  };

  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(e => e.id !== eventId));
    return { success: true };
  };

  const registerForEvent = (userEmail, eventId) => {
    if (!userEmail) return { success: false, message: 'Please login to register for events.' };
    
    const event = events.find((e) => e.id === eventId);
    if (event?.registrations >= event?.totalSeats) {
      return { success: false, message: 'This event has reached full capacity. Please choose another experience.' };
    }

    const userRegs = registrations[userEmail] || [];
    if (userRegs.includes(eventId)) {
      return { success: false, message: 'You have already registered for this event!' };
    }

    // Update registrations list
    setRegistrations(prev => ({
      ...prev,
      [userEmail]: [...userRegs, eventId]
    }));

    // Increment event registrations count
    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, registrations: Math.min((e.registrations || 0) + 1, e.totalSeats || (e.registrations || 0) + 1) };
      }
      return e;
    }));

    return { success: true, message: 'Registration Successful!' };
  };

  const unregisterFromEvent = (userEmail, eventId) => {
    if (!userEmail) return { success: false };
    
    const userRegs = registrations[userEmail] || [];
    setRegistrations(prev => ({
      ...prev,
      [userEmail]: userRegs.filter(id => id !== eventId)
    }));

    setEvents(prev => prev.map(e => {
      if (e.id === eventId) {
        return { ...e, registrations: Math.max(0, (e.registrations || 1) - 1) };
      }
      return e;
    }));

    return { success: true };
  };

  const getUserRegisteredEvents = (userEmail) => {
    if (!userEmail) return [];
    const eventIds = registrations[userEmail] || [];
    return events.filter(e => eventIds.includes(e.id));
  };

  return (
    <EventContext.Provider value={{
      events,
      registrations,
      addEvent,
      editEvent,
      deleteEvent,
      registerForEvent,
      unregisterFromEvent,
      getUserRegisteredEvents
    }}>
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};
