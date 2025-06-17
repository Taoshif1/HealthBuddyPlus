// src/App.tsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// 1. Imported all of our page components

import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import MoodTracker from './components/MoodTracker';
import MealPlanner from './components/MealPlanner';
import CareHub from './components/CareHub';
import Community from './components/Community';
import Profile from './components/Profile';

// 2. Create an AppContent component that can use router hooks
function AppContent() {
  const location = useLocation();

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-neutral-50">
      {/* The Navigation component is inside, so it can use NavLink */}
      <Navigation />

      {/* The main content area where pages will be swapped */}
      <main className="flex-1 pb-20 md:pb-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
          >
            {/* The Routes component handles which page to show */}
            <Routes location={location}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/mood" element={<MoodTracker />} />
              <Route path="/meals" element={<MealPlanner />} />
              <Route path="/care" element={<CareHub />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

// 3. The main App component that wraps everything in the Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;