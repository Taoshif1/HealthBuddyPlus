// src/components/Navigation.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom'; // Import NavLink
import { 
  Home, 
  Heart, 
  UtensilsCrossed, 
  Calendar, 
  Users, 
  Settings,
  Sparkles
} from 'lucide-react';

// No props are needed anymore, NavLink handles its own state
const Navigation: React.FC = () => {
  const navItems = [
    // Added 'path' to each item for navigation
    { id: 'dashboard', label: 'Dashboard', icon: Home, path: '/' },
    { id: 'mood', label: 'Mood Garden', icon: Heart, path: '/mood' },
    { id: 'meals', label: 'Meal Planner', icon: UtensilsCrossed, path: '/meals' },
    { id: 'care', label: 'Care Hub', icon: Calendar, path: '/care' },
    { id: 'community', label: 'Community', icon: Users, path: '/community' },
    { id: 'profile', label: 'Profile', icon: Settings, path: '/profile' },
  ];

  return (
    <nav className="bg-white shadow-lg border-t border-neutral-200 md:border-t-0 md:border-r md:shadow-none fixed bottom-0 left-0 right-0 md:relative md:w-64 md:h-screen z-50">
      <div className="md:p-6">
        {/* Logo */}
        <div className="hidden md:flex items-center mb-8">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-primary-500 to-secondary-500 p-2 rounded-xl">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-xl font-bold text-neutral-800">HealthBuddy+</h1>
              <p className="text-sm text-neutral-500">Wellness Companion</p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="flex md:flex-col justify-around md:justify-start md:space-y-2 px-2 py-2 md:p-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              // Replaced button with NavLink
              <NavLink
                key={item.id}
                to={item.path}
                // Use a function to conditionally apply styles
                className={({ isActive }) =>
                  `relative flex flex-col md:flex-row items-center justify-center md:justify-start p-2 md:p-3 rounded-xl transition-all duration-200 ${
                    isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-800'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon className={`w-5 h-5 md:w-6 md:h-6 ${isActive ? 'text-primary-600' : ''}`} />
                    <span className={`text-xs md:text-sm font-medium mt-1 md:mt-0 md:ml-3`}>
                      {item.label}
                    </span>
                    {isActive && (
                      <motion.div
                        className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary-500 rounded-r-full hidden md:block"
                        layoutId="activeIndicator"
                      />
                    )}
                  </>
                )}
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;