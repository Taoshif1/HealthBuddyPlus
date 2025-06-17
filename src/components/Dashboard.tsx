// src/components/Dashboard.tsx

import React, { useState, useEffect, useMemo } from 'react';
import { motion, useSpring } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  TrendingUp, 
  Heart, 
  UtensilsCrossed, 
  Calendar,
  Users,
  Award,
  Sun,
  Cloud, // <--- BUG FIX: Added missing icon
  Moon,  // <--- BUG FIX: Added missing icon
} from 'lucide-react';


// --- SUB-COMPONENTS ---
const AnimatedNumber = ({ value, isFloat = false }: { value: number, isFloat?: boolean }) => {
    // This is a more robust version of the animated number
    const spring = useSpring(value, { mass: 0.8, stiffness: 100, damping: 20 });
    const [display, setDisplay] = useState(value);

    useEffect(() => {
        const unsubscribe = spring.on("change", (latest) => {
            if (isFloat) {
                setDisplay(parseFloat(latest.toFixed(1)));
            } else {
                setDisplay(Math.round(latest));
            }
        });
        spring.set(value);
        return unsubscribe;
    }, [spring, value, isFloat]);

    return <motion.span>{isFloat ? display.toFixed(1) : display.toLocaleString()}</motion.span>;
};


const StatCard = ({ icon, label, value, color, isFloat = false }: { icon: React.ReactNode, label: string, value: number, color: string, isFloat?: boolean }) => (
    <motion.div className="bg-white p-5 rounded-2xl shadow-lg border border-neutral-100 flex flex-col justify-center transform hover:-translate-y-1 transition-transform duration-300" variants={{hidden: {opacity:0, y:20}, visible: {opacity:1, y:0}}}>
        <div className="flex items-center gap-4">
            {icon}
            <div>
                <p className={`text-2xl md:text-3xl font-bold ${color}`}><AnimatedNumber value={value} isFloat={isFloat} /></p>
                <p className="text-sm text-neutral-500 font-medium -mt-1">{label}</p>
            </div>
        </div>
    </motion.div>
);


// --- MAIN DASHBOARD COMPONENT ---
const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({ moodScore: 0, caloriesLogged: 0, activitiesCompleted: 0, medicationsTaken: 0, achievements: 0 });
  
  const quickActions = [
    { title: 'Mood Garden', description: 'Log your daily mood', icon: Heart, color: 'bg-gradient-to-br from-pink-400 to-rose-500', path: '/mood' },
    { title: 'Meal Planner', description: 'Find healthy recipes', icon: UtensilsCrossed, color: 'bg-gradient-to-br from-orange-400 to-amber-500', path: '/meals' },
    { title: 'Care Hub', description: 'Manage appointments', icon: Calendar, color: 'bg-gradient-to-br from-blue-400 to-cyan-500', path: '/care' },
    { title: 'Community', description: 'Join challenges', icon: Users, color: 'bg-gradient-to-br from-purple-400 to-indigo-500', path: '/community' }
  ];

  const recentAchievements = [
    { name: 'Mood Tracker', value: '7 day streak', icon: '🌱' },
    { name: 'Meal Planner', value: '3 meals logged', icon: '🍽️' },
    { name: 'Fitness Quest', value: '+150 points', icon: '💪' }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setStats({
        moodScore: 8.5,
        caloriesLogged: 1847,
        activitiesCompleted: 3,
        medicationsTaken: 2,
        achievements: recentAchievements.length,
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [recentAchievements.length]);

  const timeOfDay = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return {
        greeting: "Good Morning",
        gradient: "from-amber-400 to-orange-500",
        icon: <Sun className="w-10 h-10" />
    };
    if (hour < 17) return {
        greeting: "Good Afternoon",
        gradient: "from-sky-400 to-cyan-500",
        icon: <Cloud className="w-10 h-10" />
    };
    return {
        greeting: "Good Evening",
        gradient: "from-indigo-500 to-purple-600",
        icon: <Moon className="w-10 h-10" />
    };
  }, []);

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-10">
      <motion.div 
        className={`bg-gradient-to-r ${timeOfDay.gradient} rounded-3xl p-8 text-white shadow-2xl shadow-purple-500/20 flex justify-between items-center`}
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.7, ease: 'easeOut' }}
      >
        <div>
            <h1 className="text-3xl md:text-4xl font-bold drop-shadow-md">{timeOfDay.greeting}, Alex!</h1>
            <p className="text-lg opacity-90 drop-shadow-sm">Ready to make today amazing?</p>
        </div>
        <motion.div
            animate={{ rotate: [0, -10, 10, -10, 0], y: [0, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
            {timeOfDay.icon}
        </motion.div>
      </motion.div>

      <motion.div className="grid grid-cols-2 lg:grid-cols-4 gap-5" variants={{ visible: { transition: { staggerChildren: 0.1 } } }} initial="hidden" animate="visible">
        <StatCard icon={<Heart className="w-7 h-7 text-red-500"/>} label="Mood Score" value={stats.moodScore} color="text-red-600" isFloat/>
        <StatCard icon={<UtensilsCrossed className="w-7 h-7 text-orange-500"/>} label="Calories" value={stats.caloriesLogged} color="text-orange-600"/>
        <StatCard icon={<TrendingUp className="w-7 h-7 text-blue-500"/>} label="Activities" value={stats.activitiesCompleted} color="text-blue-600"/>
        <StatCard icon={<Award className="w-7 h-7 text-purple-500"/>} label="Achievements" value={stats.achievements} color="text-purple-600"/>
      </motion.div>
      
      <div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {quickActions.map((action, index) => (
            <Link to={action.path} key={action.title}>
              <motion.div 
                className="bg-white rounded-2xl p-6 shadow-lg border border-neutral-100 cursor-pointer group hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 h-full"
                initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{duration: 0.5, delay: 0.2 + index * 0.1}}
              >
                <div className={`${action.color} p-4 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                  <action.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-lg font-bold text-neutral-800 mb-1">{action.title}</h3>
                <p className="text-sm text-neutral-500">{action.description}</p>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Recent Achievements</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {recentAchievements.map((achievement, index) => (
            <motion.div key={achievement.name} className="bg-white rounded-2xl p-5 shadow-lg border border-neutral-100 flex items-center gap-4 transform hover:-translate-y-1 transition-transform duration-300"
                initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: 0.5 + index * 0.1}}>
              <span className="text-4xl p-3 bg-neutral-100 rounded-full">{achievement.icon}</span>
              <div>
                <h3 className="font-semibold text-neutral-800">{achievement.name}</h3>
                <p className="text-sm text-primary-600 font-medium">{achievement.value}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div className="mt-8 text-center bg-white rounded-3xl p-10 shadow-xl border">
        <Sparkles className="w-10 h-10 text-yellow-400 mx-auto mb-3" />
        <p className="text-xl font-medium text-neutral-700 italic">"The greatest wealth is health."</p>
        <p className="text-md text-neutral-500 mt-2">— Virgil</p>
      </motion.div>
    </div>
  );
};

export default Dashboard;
