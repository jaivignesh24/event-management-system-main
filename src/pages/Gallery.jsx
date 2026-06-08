import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Eye, Play, Film, Calendar, Camera, Info, X, UploadCloud, Bell, Flame, Award, Video } from 'lucide-react';
import { useEvents } from '../context/EventContext';
import { Link } from 'react-router-dom';

const galleryPhotos = [
  {
    id: 1,
    title: 'Spandan Classical & Western Group Fusion',
    category: 'Dance',
    image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80',
    colSpan: 'col-span-1 md:col-span-2',
    rowSpan: 'row-span-1 md:row-span-2'
  },
  {
    id: 2,
    title: 'Acoustics Rock Vocalist Finalist',
    category: 'Singing',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=1200&q=80',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1'
  },
  {
    id: 3,
    title: 'Aurora T10 Cricket League Winners',
    category: 'Sports',
    image: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?auto=format&fit=crop&w=1200&q=80',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1'
  },
  {
    id: 4,
    title: 'Aurora DJ Night Lasers Arena',
    category: 'DJ Night',
    image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=1200&q=80',
    colSpan: 'col-span-1 md:col-span-2',
    rowSpan: 'row-span-1'
  },
  {
    id: 5,
    title: 'National Coding Hackathon Pitching Session',
    category: 'Hackathon',
    image: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1 md:row-span-2'
  },
  {
    id: 6,
    title: 'Autonomous Robo-Wars Clash',
    category: 'Technical Fest',
    image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1'
  },
  {
    id: 7,
    title: 'Festive Dandiya Night Celebrations',
    category: 'Dandiya',
    image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?auto=format&fit=crop&w=1200&q=80',
    colSpan: 'col-span-1 md:col-span-2',
    rowSpan: 'row-span-1'
  },
  {
    id: 8,
    title: 'Hands-on Generative AI Bootcamp',
    category: 'Workshops',
    image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1'
  },
  {
    id: 9,
    title: 'Traditional Folk & Classical Acts',
    category: 'Cultural Events',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1'
  },
  {
    id: 10,
    title: 'Global Tech Leadership Webinar',
    category: 'Webinars',
    image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?auto=format&fit=crop&w=1200&q=80',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1'
  },
  {
    id: 11,
    title: 'Inter-College Esports Championship Finals',
    category: 'Competitions',
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
    colSpan: 'col-span-1',
    rowSpan: 'row-span-1'
  },
  {
    id: 12,
    title: 'Aurora Food Street & Carnival Stalls',
    category: 'Other',
    image: 'https://images.unsplash.com/photo-1523580494863-6f303122450d?auto=format&fit=crop&w=1200&q=80',
    colSpan: 'col-span-1 md:col-span-2',
    rowSpan: 'row-span-1'
  }
];

export const Gallery = ({ isDashboard = false }) => {
  const { events } = useEvents();
  const [activeTab, setActiveTab] = useState('All');
  const [lightboxPhoto, setLightboxPhoto] = useState(null);
  
  // Custom persistable gallery photos state
  const [photos, setPhotos] = useState(() => {
    const saved = localStorage.getItem('gallery-photos');
    if (saved) {
      const parsed = JSON.parse(saved);
      const hasWebinars = parsed.some(p => p.category === 'Webinars');
      const hasCompetitions = parsed.some(p => p.category === 'Competitions');
      const hasOther = parsed.some(p => p.category === 'Other');
      
      if (parsed.length >= galleryPhotos.length && hasWebinars && hasCompetitions && hasOther) {
        return parsed;
      }
    }
    localStorage.setItem('gallery-photos', JSON.stringify(galleryPhotos));
    return galleryPhotos;
  });

  // Photo upload state
  const [uploadedImage, setUploadedImage] = useState(null);
  const [uploadStatus, setUploadStatus] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const tabs = [
    'All',
    'Dance',
    'Singing',
    'Hackathon',
    'Technical Fest',
    'Sports',
    'Cultural Events',
    'Workshops',
    'Webinars',
    'Competitions',
    'Other',
    'DJ Night',
    'Dandiya'
  ];

  const announcements = [
    { id: 1, text: 'Aurora Fest 2026 schedule updated. Check timeline.', time: '2 hours ago' },
    { id: 2, text: 'Generative AI Developer Bootcamp has reached 90% capacity. Register now.', time: '5 hours ago' },
    { id: 3, text: 'Acoustics battle band setups will be supplied by standard audio vendors.', time: '1 day ago' }
  ];

  const filteredPhotos = activeTab === 'All'
    ? photos
    : photos.filter(p => p.category.toLowerCase() === activeTab.toLowerCase());

  // Trending events selection
  const trendingEvents = events ? events.slice(0, 3) : [];

  const handleMockUpload = (file) => {
    if (!file) return;
    setUploadStatus('Processing image preview...');
    setTimeout(() => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedImage(reader.result);
        setUploadStatus('Preview ready! Click confirm below to publish.');
      };
      reader.readAsDataURL(file);
    }, 800);
  };

  const confirmUpload = () => {
    if (!uploadedImage || !selectedCategory) return;
    
    const newPhoto = {
      id: Date.now(),
      title: `Campus Highlights - ${selectedCategory}`,
      category: selectedCategory,
      image: uploadedImage,
      colSpan: 'col-span-1',
      rowSpan: 'row-span-1'
    };

    const updated = [newPhoto, ...photos];
    setPhotos(updated);
    localStorage.setItem('gallery-photos', JSON.stringify(updated));

    // Display image inside that chosen category section automatically
    setActiveTab(selectedCategory);

    setUploadedImage(null);
    setSelectedCategory('');
    setUploadStatus('Success! Image uploaded and displayed in ' + selectedCategory + '.');
    setTimeout(() => setUploadStatus(''), 4000);
  };

  return (
    <div className={isDashboard ? "relative w-full font-sans" : "relative w-full min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-8 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 font-sans"}>
      
      {/* Lightbox Overlay */}
      <AnimatePresence>
        {lightboxPhoto && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/90 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="max-w-4xl w-full relative"
            >
              <button
                onClick={() => setLightboxPhoto(null)}
                className="absolute -top-12 right-0 p-2 text-white hover:text-orange-500 transition-all"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={lightboxPhoto.image}
                alt={lightboxPhoto.title}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1514382357765-73c1b2375d7e?auto=format&fit=crop&w=800&q=80'; }}
                className="w-full max-h-[75vh] object-contain rounded-3xl border border-white/10"
              />
              <div className="text-left mt-4 text-white">
                <span className="text-xs font-black text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-2.5 py-0.5 rounded-full">{lightboxPhoto.category}</span>
                <h3 className="text-lg font-extrabold mt-2 font-sans">{lightboxPhoto.title}</h3>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <div className={isDashboard ? "space-y-8 relative z-10" : "max-w-full mx-auto w-full px-4 sm:px-8 lg:px-12 space-y-16 relative z-10"}>
        
        {/* Page Header - only show if not in dashboard */}
        {!isDashboard && (
          <div className="text-center max-w-3xl mx-auto space-y-4">
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-extrabold uppercase tracking-wider">
              <Camera className="h-3.5 w-3.5" />
              <span>Campus Memories & Highlights</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-none text-slate-800 dark:text-white">
              Highlights{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Media Hub
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">
              Browse our university's official photo galleries, watch high-definition fests recaps, view announcements, and upload campus snapshots.
            </p>
          </div>
        )}

        {/* Tab Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-4xl mx-auto">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wide uppercase transition-all duration-300 ${
                activeTab === tab
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/25'
                  : 'bg-white dark:bg-slate-900 text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Split Section: Galleries vs Announcements / Uploads */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
          
          {/* Left panel: Galleries (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            <h3 className="text-lg font-black text-slate-800 dark:text-white flex items-center space-x-2">
              <Camera className="h-5 w-5 text-orange-500" />
              <span>Latest Event Highlights</span>
            </h3>

            {/* Masonry Layout Photos Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 auto-rows-[230px]">
              {filteredPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  onClick={() => setLightboxPhoto(photo)}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm hover:shadow-lg transition-all duration-500"
                  layoutId={`photo-${photo.id}`}
                  whileHover={{ scale: 1.015 }}
                >
                  <img
                    src={photo.image}
                    alt={photo.title}
                    onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://images.unsplash.com/photo-1514382357765-73c1b2375d7e?auto=format&fit=crop&w=800&q=80'; }}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent opacity-85" />
                  
                  {/* Details */}
                  <div className="absolute bottom-5 left-6 right-6 text-left flex items-end justify-between">
                    <div>
                      <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest bg-orange-500/10 border border-orange-500/20 px-2 py-0.5 rounded-full">{photo.category}</span>
                      <h3 className="text-sm font-extrabold text-white mt-2 line-clamp-1">{photo.title}</h3>
                    </div>
                    <div className="p-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Eye className="h-4 w-4" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Right panel: Sidebar features (4 Columns) */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Announcements Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Bell className="h-4 w-4 text-orange-500" />
                <span>Announcements</span>
              </h3>
              
              <div className="space-y-4">
                {announcements.map(ann => (
                  <div key={ann.id} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 flex items-start gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0 mt-1.5" />
                    <div className="text-[11px] leading-relaxed">
                      <p className="font-bold text-slate-700 dark:text-slate-300">{ann.text}</p>
                      <span className="text-[9px] text-slate-400 block mt-1">{ann.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Photo upload Zone */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <UploadCloud className="h-4 w-4 text-orange-500" />
                <span>Share Campus Snapshots</span>
              </h3>
              <p className="text-xs text-slate-400 font-medium">Captured a legendary moment? Select a category, preview your shot, and upload it!</p>
              
              {/* Category selector */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Select Category *</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 dark:bg-slate-950 text-slate-700 dark:text-slate-300 focus:outline-none text-xs font-bold transition-all"
                >
                  <option value="">-- Choose Category --</option>
                  <option value="Sports">Sports</option>
                  <option value="Technical">Technical</option>
                  <option value="Cultural">Cultural</option>
                  <option value="Workshops">Workshops</option>
                  <option value="Webinars">Webinars</option>
                  <option value="Competitions">Competitions</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Show file upload only if category is selected */}
              {selectedCategory ? (
                <label className="block rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 hover:border-orange-500/50 p-6 cursor-pointer bg-slate-50/50 dark:bg-slate-800/10 transition-all text-center">
                  <UploadCloud className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block">Select Fest Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleMockUpload(e.target.files?.[0])}
                  />
                </label>
              ) : (
                <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/30 text-slate-400 border border-slate-100 dark:border-slate-800 text-center text-xs font-bold leading-relaxed">
                  Please select a category above to unlock the image upload selector.
                </div>
              )}

              {uploadStatus && (
                <div className="p-3.5 bg-orange-500/10 text-orange-600 dark:text-orange-400 border border-orange-500/20 rounded-xl text-[10px] font-bold text-center leading-relaxed">
                  {uploadStatus}
                </div>
              )}

              {uploadedImage && (
                <div className="space-y-3">
                  <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 h-28 relative">
                    <img src={uploadedImage} className="w-full h-full object-cover" alt="Uploaded Thumbnail" />
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded text-[9px] font-black bg-orange-500 text-white shadow-md">PREVIEW</span>
                  </div>
                  <button
                    onClick={confirmUpload}
                    className="w-full py-3.5 rounded-2xl text-xs font-black uppercase tracking-wider text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:shadow-lg hover:shadow-orange-500/25 transition-all text-center"
                  >
                    Confirm & Publish
                  </button>
                </div>
              )}
            </div>

            {/* Trending Events Widget */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm space-y-5">
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-400 flex items-center space-x-2">
                <Flame className="h-4 w-4 text-orange-500 animate-pulse" />
                <span>Trending Events</span>
              </h3>

              <div className="space-y-3">
                {trendingEvents.map(evt => (
                  <Link key={evt.id} to={`/events/${evt.id}`} className="flex items-center space-x-3 p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all">
                    <img src={evt.image} className="w-10 h-10 rounded-lg object-cover shrink-0" alt={evt.title} />
                    <div className="text-left overflow-hidden">
                      <h4 className="text-xs font-black text-slate-700 dark:text-slate-300 truncate">{evt.title}</h4>
                      <p className="text-[9px] text-slate-400 mt-0.5">{evt.date}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

          </div>

        </div>

        {/* Video Highlights Section (Videos Section) */}
        <section className="bg-white dark:bg-slate-900 rounded-[2.5rem] p-8 sm:p-12 border border-slate-200 dark:border-slate-800 overflow-hidden text-left relative grid grid-cols-1 lg:grid-cols-12 gap-8 items-center shadow-sm">
          
          {/* Left Text Detail */}
          <div className="lg:col-span-5 space-y-5">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-600 dark:text-orange-400 text-xs font-bold uppercase tracking-wider">
              <Film className="h-3.5 w-3.5 animate-pulse" />
              <span>Official Recaps & Videos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black leading-tight text-slate-800 dark:text-white">
              Relive Aurora 2025{' '}
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                Aftermovie Recap
              </span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              Watch our custom cinematography student film documenting the drumming solos of Acoustics Battle of Bands, late-night hackathons, and Hyderabad’s biggest EDM lasers.
            </p>
            
            <div className="flex items-center space-x-4 pt-2 text-xs font-semibold text-slate-500 dark:text-slate-400">
              <div className="flex items-center space-x-1.5">
                <Calendar className="h-4 w-4 text-orange-500" />
                <span>June 2025</span>
              </div>
              <div className="flex items-center space-x-1.5">
                <Video className="h-4 w-4 text-orange-500" />
                <span>3 Video Logs</span>
              </div>
            </div>
          </div>

          {/* Right Video Mock Player Frame */}
          <div className="lg:col-span-7 relative flex justify-center">
            <div className="relative w-full aspect-video rounded-3xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 group">
              <img
                src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&w=800&q=80"
                alt="Video Recap Thumbnail"
                className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-slate-950/45 group-hover:bg-slate-950/60 transition-all duration-300 flex items-center justify-center" />
              
              {/* Giant Play button */}
              <button className="absolute z-10 p-5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-2xl hover:scale-105 hover:bg-orange-500 transition-all">
                <Play className="h-6 w-6 fill-white" />
              </button>

              <div className="absolute bottom-4 left-6 text-left">
                <h4 className="text-xs font-bold text-white">Aurora AURA Grand Aftermovie</h4>
                <p className="text-[10px] text-slate-300">Run-time: 4 mins 32 secs</p>
              </div>
            </div>
          </div>

        </section>

      </div>
    </div>
  );
};
