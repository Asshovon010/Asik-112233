
import React, { useState, useEffect } from 'react';
import { RESUME_DATA } from './constants';
import { ResumeData } from './types';
import Hero from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Services from './components/Services';
import Testimonials from './components/Testimonials';
import Certifications from './components/Certifications';
import Education from './components/Education';
import Projects from './components/Projects';
import Contact from './components/Contact';
import ChatWidget from './components/ChatWidget';
import AdminPanel from './components/AdminPanel';
import ContactForm from './components/ContactForm';
import ScrollToTop from './components/ScrollToTop';
import { motion, useScroll, useSpring, AnimatePresence } from 'framer-motion';
import { Lock, Loader2 } from 'lucide-react';
import { getResumeData, saveResumeData } from './services/db';

function App() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // Initialize with constant data first
  const [resumeData, setResumeData] = useState<ResumeData>(RESUME_DATA);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Load data from IndexedDB on mount
  useEffect(() => {
    const initData = async () => {
        try {
            const savedData = await getResumeData();
            if (savedData) {
                setResumeData(savedData);
            } else {
                // Check for legacy localStorage data and migrate if exists
                const legacyData = localStorage.getItem('portfolio_data_v1');
                if (legacyData) {
                    try {
                        const parsed = JSON.parse(legacyData);
                        const migrated = { ...RESUME_DATA, ...parsed };
                        setResumeData(migrated);
                        await saveResumeData(migrated);
                        localStorage.removeItem('portfolio_data_v1');
                    } catch (e) {
                        console.error("Migration failed", e);
                    }
                }
            }
        } catch (error) {
            console.error("Failed to load data from DB", error);
        } finally {
            setIsLoading(false);
        }
    };
    initData();
  }, []);

  // Save to IndexedDB
  const handleSaveData = async (newData: ResumeData) => {
    try {
      setResumeData(newData);
      await saveResumeData(newData);
    } catch (error) {
      console.error("Failed to save to DB:", error);
      alert("Failed to save changes! Please try again.");
    }
  };

  if (isLoading) {
      return (
          <div className="min-h-screen flex items-center justify-center bg-slate-900 text-white">
              <div className="flex flex-col items-center gap-4">
                  <Loader2 size={40} className="animate-spin text-blue-500" />
                  <p className="text-slate-400 animate-pulse">Loading Portfolio...</p>
              </div>
          </div>
      );
  }

  return (
    <div className="relative">
      {/* Contact Form Overlay */}
      <AnimatePresence>
        {isContactOpen && (
          <ContactForm onClose={() => setIsContactOpen(false)} />
        )}
      </AnimatePresence>

      {/* Admin Panel Overlay */}
      <AnimatePresence>
        {isAdminOpen && (
          <AdminPanel 
            initialData={resumeData} 
            onSave={handleSaveData} 
            onClose={() => setIsAdminOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-blue-600 origin-left z-50"
        style={{ scaleX }}
      />

      <Hero data={resumeData} onOpenContact={() => setIsContactOpen(true)} />
      <About data={resumeData} />
      <Skills skills={resumeData.skills} />
      <Services services={resumeData.services} />
      <Certifications certifications={resumeData.certifications} />
      <Education education={resumeData.education} />
      <Projects projects={resumeData.projects} />
      <Testimonials testimonials={resumeData.testimonials} />
      <Contact data={resumeData} />
      
      {/* Floating Elements */}
      <ScrollToTop />
      <ChatWidget data={resumeData} />

      {/* Floating Admin Button */}
      <motion.button
        onClick={() => setIsAdminOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-full shadow-lg flex items-center justify-center transition-all opacity-20 hover:opacity-100"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        title="Admin Login"
      >
        <Lock size={20} />
      </motion.button>
    </div>
  );
}

export default App;
