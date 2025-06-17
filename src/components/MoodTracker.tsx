// src/components/MoodTracker.tsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Heart,
  Smile,
  Meh,
  Frown,
  X,
  Sprout,
  Flower,
  TreePine,
  Leaf,
  Sun,
  Calendar,
  TrendingUp,
  Wind,
  CloudDrizzle,
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface MoodEntry {
  date: string;
  mood: number;
  notes: string;
}

interface MoodOption {
  value: number;
  label: string;
  icon: React.ElementType;
  color: string;
  emoji: string;
  plant: {
    icon: React.ElementType;
    color: string;
    size: string;
  };
}

// --- MOCK DATA GENERATION ---
// This function creates a realistic, but random, history for the last 7 days.
const generateInitialHistory = (): MoodEntry[] => {
  const history: MoodEntry[] = [];
  const today = new Date();
  for (let i = 1; i <= 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    history.push({
      date: date.toISOString().split('T')[0],
      mood: Math.floor(Math.random() * 3) + 3, // Random mood between 3 and 5
      notes: i % 2 === 0 ? 'Had a pretty good day.' : 'Felt productive and happy.',
    });
  }
  return history;
};

// --- COMPONENT START ---
const MoodTracker: React.FC = () => {
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [showNoteInput, setShowNoteInput] = useState(false);
  // Use our dynamic data generator
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>(generateInitialHistory);

  const moods: MoodOption[] = [
    { value: 1, label: 'Terrible', icon: X, color: 'bg-red-500', emoji: '🌧️', plant: { icon: Leaf, color: 'text-red-400', size: 'w-4 h-4' } },
    { value: 2, label: 'Poor', icon: Frown, color: 'bg-orange-500', emoji: '😕', plant: { icon: Sprout, color: 'text-orange-400', size: 'w-6 h-6' } },
    { value: 3, label: 'Okay', icon: Meh, color: 'bg-yellow-500', emoji: '😐', plant: { icon: Sprout, color: 'text-yellow-500', size: 'w-8 h-8' } },
    { value: 4, label: 'Good', icon: Smile, color: 'bg-green-500', emoji: '😊', plant: { icon: Flower, color: 'text-green-500', size: 'w-10 h-10' } },
    { value: 5, label: 'Excellent', icon: Heart, color: 'bg-emerald-500', emoji: '😄', plant: { icon: TreePine, color: 'text-emerald-500', size: 'w-12 h-12' } },
  ];

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
    setShowNoteInput(true);
  };

  const handleSubmit = () => {
    if (selectedMood) {
      const newEntry: MoodEntry = {
        date: new Date().toISOString().split('T')[0],
        mood: selectedMood,
        notes: notes,
      };
      
      // Add the new entry and keep the history to the last 7 entries
      setMoodHistory([newEntry, ...moodHistory.slice(0, 6)]);
      setSelectedMood(null);
      setNotes('');
      setShowNoteInput(false);
    }
  };

  const averageMood = useMemo(() => 
    moodHistory.length > 0
      ? moodHistory.reduce((sum, entry) => sum + entry.mood, 0) / moodHistory.length
      : 0,
    [moodHistory]
  );
  
  const getGardenLevel = (avgMood: number) => {
    if (avgMood >= 4.5) return { level: 'Flourishing', icon: Sun, color: 'text-emerald-500', bg: 'bg-emerald-50/50' };
    if (avgMood >= 3.5) return { level: 'Growing', icon: Sprout, color: 'text-green-500', bg: 'bg-green-50/50' };
    if (avgMood >= 2.5) return { level: 'Budding', icon: CloudDrizzle, color: 'text-yellow-500', bg: 'bg-yellow-50/50' };
    if (avgMood >= 1.5) return { level: 'Sprouting', icon: Wind, color: 'text-orange-500', bg: 'bg-orange-50/50' };
    return { level: 'Seedling', icon: X, color: 'text-red-500', bg: 'bg-red-50/50' };
  };

  const gardenStatus = getGardenLevel(averageMood);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 font-sans">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold text-neutral-800 mb-2 text-center">Your Mood Garden</h1>
        <p className="text-neutral-600 text-center text-lg">Nurture your mind, grow your garden.</p>
      </motion.div>

      {/* --- THE GARDEN PLOT --- */}
      <motion.div 
        className={`relative rounded-3xl p-6 my-8 min-h-[250px] overflow-hidden bg-gradient-to-br from-sky-100 to-green-100 border-2 border-white shadow-xl`}
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
      >
        <div className="absolute inset-0 bg-grid-neutral-200/50 [mask-image:linear-gradient(to_bottom,white_0,white_90%,transparent_100%)]"></div>
        <div className="relative z-10 flex items-end justify-center h-full gap-4 pt-10">
          <AnimatePresence>
            {moodHistory.slice(0, 7).reverse().map((entry, index) => {
              const mood = moods.find(m => m.value === entry.mood);
              if (!mood) return null;
              const PlantIcon = mood.plant.icon;
              return (
                <motion.div
                  key={entry.date}
                  custom={index}
                  initial={{ opacity: 0, y: 50, scale: 0.5 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 10, delay: index * 0.1 + 0.5 }}
                  className="flex flex-col items-center group cursor-pointer"
                  title={`${new Date(entry.date).toLocaleDateString()}: ${mood.label}`}
                >
                  <PlantIcon className={`${mood.plant.size} ${mood.plant.color} drop-shadow-lg group-hover:scale-110 transition-transform`} />
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Mood Selection */}
      <motion.div 
        className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold text-neutral-800 mb-6 text-center">How are you feeling today?</h3>
        <div className="grid grid-cols-5 gap-4 mb-6">
          {moods.map((mood) => (
            <motion.button
              key={mood.value}
              onClick={() => handleMoodSelect(mood.value)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-300 group flex flex-col items-center justify-center space-y-2
                ${selectedMood === mood.value 
                  ? `${mood.color} text-white shadow-lg scale-105` 
                  : 'border-neutral-200 hover:border-primary-300 hover:bg-primary-50/50'
                }`}
              whileHover={{ y: -5 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="text-3xl">{mood.emoji}</span>
              <span className={`text-sm font-semibold ${selectedMood === mood.value ? 'text-white' : 'text-neutral-700'}`}>
                {mood.label}
              </span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence>
          {showNoteInput && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border-t border-neutral-200 pt-6">
                <label className="block text-sm font-medium text-neutral-700 mb-2">Add a note to remember this moment (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="What's on your mind? e.g., 'Finished a big project!'"
                  className="w-full p-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none transition-shadow"
                  rows={3}
                />
                <div className="flex justify-end space-x-3 mt-4">
                  <motion.button onClick={() => setShowNoteInput(false)} className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors">Cancel</motion.button>
                  <motion.button onClick={handleSubmit} className="px-8 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors shadow-sm hover:shadow-md" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>Save Entry</motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mood History and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <motion.div className="lg:col-span-3 bg-white rounded-2xl p-6 shadow-lg border border-neutral-100" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.5 }}>
          <div className="flex items-center mb-4">
            <Calendar className="w-5 h-5 text-neutral-500 mr-2" />
            <h3 className="text-lg font-semibold text-neutral-800">Recent Entries</h3>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
            {moodHistory.map((entry) => {
              const mood = moods.find(m => m.value === entry.mood);
              if (!mood) return null;
              return (
                <motion.div key={entry.date} className="flex items-start p-3 rounded-lg bg-neutral-50/70" whileHover={{ backgroundColor: '#f0f0f0' }}>
                  <span className="text-2xl mr-4 mt-1">{mood.emoji}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-neutral-800">{mood.label}</span>
                      <span className="text-xs text-neutral-400">{new Date(entry.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                    </div>
                    {entry.notes && <p className="text-sm text-neutral-600 mt-1 italic">"{entry.notes}"</p>}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        
        <motion.div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-lg border border-neutral-100" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, delay: 0.6 }}>
            <div className="flex items-center mb-4">
                <TrendingUp className="w-5 h-5 text-neutral-500 mr-2" />
                <h3 className="text-lg font-semibold text-neutral-800">Weekly Mood Trend</h3>
            </div>
            <div className="h-40 flex justify-around items-end gap-2">
                {moodHistory.slice(0, 7).reverse().map((entry, index) => {
                    const mood = moods.find(m => m.value === entry.mood);
                    if (!mood) return null;
                    const height = `${(entry.mood / 5) * 100}%`;
                    return (
                        <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
                             <motion.div 
                                className="w-full rounded-full bg-gradient-to-t from-primary-200 to-primary-400" 
                                style={{ height: 0 }}
                                animate={{ height }}
                                transition={{ delay: index * 0.1 + 0.8, type: 'spring', stiffness: 150, damping: 15 }}
                            />
                            <span className="text-xs text-neutral-400">{new Date(entry.date).toLocaleDateString('en-US', { weekday: 'short' })}</span>
                        </div>
                    )
                })}
            </div>
             <div className={`mt-4 p-3 rounded-lg flex items-center gap-3 ${gardenStatus.bg} border border-current/${gardenStatus.color} border-opacity-20`}>
                <gardenStatus.icon className={`w-6 h-6 ${gardenStatus.color}`} />
                <div>
                    <h4 className={`font-semibold ${gardenStatus.color}`}>Your garden is {gardenStatus.level}!</h4>
                    <p className="text-sm text-neutral-600">Average mood: {averageMood.toFixed(1)}/5.0</p>
                </div>
            </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MoodTracker;
