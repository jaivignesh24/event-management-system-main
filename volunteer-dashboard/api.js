/**
 * api.js
 * Mock API service for the Volunteer/Club Leader Dashboard.
 * Persists data inside localStorage and returns Promises to simulate real network requests.
 */

// Key constants for localStorage
const REGISTRATIONS_KEY = 'volunteer_dashboard_registrations';
const EVENTS_KEY = 'volunteer_dashboard_events';
const SESSION_KEY = 'volunteer_dashboard_session';

// Seeding initial data if not present in localStorage
const initialRegistrations = [
  {
    id: 'reg-1',
    studentName: 'Aarav Sharma',
    email: 'aarav.sharma@aurora.edu.in',
    eventTitle: 'Aurora Hackathon 2026',
    eventId: 'tech-1',
    department: 'Computer Science & Engineering',
    status: 'pending',
    appliedAt: '2026-06-16, 10:14 AM'
  },
  {
    id: 'reg-2',
    studentName: 'Ananya Verma',
    email: 'ananya.verma@aurora.edu.in',
    eventTitle: 'Robo-Wars: Clash of Titans',
    eventId: 'tech-2',
    department: 'Mechanical Engineering',
    status: 'pending',
    appliedAt: '2026-06-16, 02:45 PM'
  },
  {
    id: 'reg-3',
    studentName: 'Kabir Malhotra',
    email: 'kabir.malhotra@aurora.edu.in',
    eventTitle: 'Speed Coding Showdown',
    eventId: 'tech-3',
    department: 'Information Technology',
    status: 'approved',
    appliedAt: '2026-06-15, 11:30 AM'
  },
  {
    id: 'reg-4',
    studentName: 'Riya Gupta',
    email: 'riya.gupta@aurora.edu.in',
    eventTitle: 'Spandan: Group Dance',
    eventId: 'cult-1',
    department: 'Electronics & Communication',
    status: 'rejected',
    appliedAt: '2026-06-15, 04:12 PM'
  },
  {
    id: 'reg-5',
    studentName: 'Devansh Roy',
    email: 'devansh.roy@aurora.edu.in',
    eventTitle: 'Acoustics: Battle of Bands',
    eventId: 'cult-2',
    department: 'Computer Science & Engineering',
    status: 'pending',
    appliedAt: '2026-06-17, 09:05 AM'
  }
];

const initialEvents = [
  {
    id: 'tech-1',
    title: 'Aurora Hackathon 2026',
    category: 'Technical',
    type: 'Hackathon',
    description: 'A national 36-hour hackathon to solve real-world problems in AI, Blockchain, and Sustainability.',
    date: '2026-05-24',
    time: '09:00 AM onwards',
    venue: 'Main Seminar Hall, CSE Block',
    totalSeats: 120,
    price: '₹200 per team',
    image: 'https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tech-2',
    title: 'Robo-Wars: Clash of Titans',
    category: 'Technical',
    type: 'Robotics',
    description: 'Design and build bots that crush, shred, and push their opponents out of the ring.',
    date: '2026-05-25',
    time: '11:00 AM',
    venue: 'Mechanical Workshop Arena',
    totalSeats: 80,
    price: '₹500 per bot',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'tech-3',
    title: 'Speed Coding Showdown',
    category: 'Technical',
    type: 'Coding',
    description: 'Solve complex algorithmic challenges in the shortest time. Multiple programming languages supported.',
    date: '2026-05-24',
    time: '02:00 PM',
    venue: 'Advanced CSE Lab 3',
    totalSeats: 100,
    price: '₹50 per head',
    image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'cult-1',
    title: 'Spandan: Group Dance',
    category: 'Cultural',
    type: 'Dance',
    description: 'A spectacular showcase of Indian classical, fusion, folk, and hip-hop dance styles.',
    date: '2026-05-25',
    time: '05:00 PM',
    venue: 'Aurora Central Auditorium',
    totalSeats: 90,
    price: '₹300 per group',
    image: 'https://images.unsplash.com/photo-1504609773096-104ff2c73ba4?auto=format&fit=crop&w=800&q=80'
  }
];

// Seed to localStorage if not exists
if (!localStorage.getItem(REGISTRATIONS_KEY)) {
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(initialRegistrations));
}
if (!localStorage.getItem(EVENTS_KEY)) {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(initialEvents));
}

// Utility helper to wrap operations in a latency-simulating Promise
const mockDelay = (val, duration = 300) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(val), duration);
  });
};

/**
 * Gets the current active user session.
 */
export function getCurrentUser() {
  const session = localStorage.getItem(SESSION_KEY);
  if (!session) {
    // Return a default mock volunteer if none logged in
    const defaultUser = {
      name: 'Sneha Reddy',
      email: 'sneha.reddy@aurora.edu.in',
      role: 'volunteer',
      department: 'Computer Science & Engineering'
    };
    localStorage.setItem(SESSION_KEY, JSON.stringify(defaultUser));
    return mockDelay(defaultUser, 100);
  }
  return mockDelay(JSON.parse(session), 100);
}

/**
 * Saves/updates user session.
 */
export function setCurrentUser(user) {
  if (user) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(SESSION_KEY);
  }
  return mockDelay(user, 100);
}

/**
 * Fetch all registrations.
 */
export function getRegistrations() {
  const data = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY)) || [];
  return mockDelay(data);
}

/**
 * Approve a registration by ID.
 */
export function approveRegistration(id) {
  const data = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY)) || [];
  const updated = data.map(reg => {
    if (reg.id === id) {
      return { ...reg, status: 'approved' };
    }
    return reg;
  });
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updated));
  return mockDelay({ success: true, id });
}

/**
 * Reject a registration by ID.
 */
export function rejectRegistration(id) {
  const data = JSON.parse(localStorage.getItem(REGISTRATIONS_KEY)) || [];
  const updated = data.map(reg => {
    if (reg.id === id) {
      return { ...reg, status: 'rejected' };
    }
    return reg;
  });
  localStorage.setItem(REGISTRATIONS_KEY, JSON.stringify(updated));
  return mockDelay({ success: true, id });
}

/**
 * Fetch all events managed by the Volunteer/Club.
 */
export function getEvents() {
  const data = JSON.parse(localStorage.getItem(EVENTS_KEY)) || [];
  return mockDelay(data);
}

/**
 * Update event details by ID.
 */
export function updateEvent(id, updatedData) {
  const data = JSON.parse(localStorage.getItem(EVENTS_KEY)) || [];
  const updated = data.map(evt => {
    if (evt.id === id) {
      return { ...evt, ...updatedData };
    }
    return evt;
  });
  localStorage.setItem(EVENTS_KEY, JSON.stringify(updated));
  return mockDelay({ success: true, id });
}
