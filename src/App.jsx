import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { EventProvider } from './context/EventContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ParticleBg } from './components/ParticleBg';
import { CustomCursor } from './components/CustomCursor';

// Import Pages
import { Home } from './pages/Home';
import { Events } from './pages/Events';
import { EventDetails } from './pages/EventDetails';
import { Clubs } from './pages/Clubs';
import { Gallery } from './pages/Gallery';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { StudentDashboard } from './pages/StudentDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { VerifyPass } from './pages/VerifyPass';
import { ViewCertificate } from './pages/ViewCertificate';
import { SuperAdminDashboard } from './pages/SuperAdminDashboard';
import { VolunteerDashboard } from './pages/VolunteerDashboard';
import { ClubProvider } from './context/ClubContext';

import './App.css';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <EventProvider>
          <ClubProvider>
            <Router>
              <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-[var(--bg)] text-[var(--text-primary)] transition-colors duration-300">
                
                {/* Premium Glow FX Background & Cursor followers */}
                <ParticleBg />
                <CustomCursor />

                {/* Navigation Header */}
                <Navbar />

                {/* Central View Content Routing */}
                <main className="flex-1 w-full relative z-10 flex flex-col">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/events" element={<Events />} />
                    <Route path="/events/:eventId" element={<EventDetails />} />
                    <Route path="/clubs" element={<Clubs />} />
                    <Route path="/gallery" element={<Gallery />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/dashboard" element={<StudentDashboard />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/superadmin" element={<SuperAdminDashboard />} />
                    <Route path="/volunteer" element={<VolunteerDashboard />} />
                    <Route path="/verify" element={<VerifyPass />} />
                    <Route path="/certificate" element={<ViewCertificate />} />
                  </Routes>
                </main>

              {/* Responsive Brand Footer */}
              <Footer />

            </div>
          </Router>
          </ClubProvider>
        </EventProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
