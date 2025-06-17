// src/components/Profile.tsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useSpring } from 'framer-motion';
import { format, parseISO } from 'date-fns';
import { 
User, 
Settings, 
Bell, 
Shield, 
Heart, 
Activity,
Award,
Edit3,
Save,
Camera,
Trash2,
AlertTriangle,
LogOut,
MessageSquare,
Zap,
Target,
CheckCircle,
Users // <--- Added 'Users' icon.
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface UserProfile {
  name: string; email: string; phone: string; location: string; joinDate: string; avatar: string; bio: string;
}
interface UserStats {
  totalPoints: number; challengesCompleted: number; badgesEarned: number; streakDays: number; postsShared: number; helpedOthers: number;
}
interface NotificationSettings {
  moodReminders: boolean; mealPlanNotifications: boolean; medicationAlerts: boolean; challengeUpdates: boolean;
}
interface ToastMessage {
    id: number; message: string; icon: React.ReactNode;
}

// --- REUSABLE COMPONENTS ---
const AnimatedNumber = ({ value }: { value: number }) => {
    const [displayValue, setDisplayValue] = useState(0);
    const spring = useSpring(value, { mass: 0.8, stiffness: 100, damping: 20 });
    useEffect(() => { spring.set(value); }, [spring, value]);
    useEffect(() => {
        const unsubscribe = spring.on("change", (latest) => setDisplayValue(Math.round(latest)));
        return unsubscribe;
    }, [spring]);
    return <motion.span>{displayValue.toLocaleString()}</motion.span>;
};

const NotificationToggle = ({ label, isEnabled, onToggle }: { label: string, isEnabled: boolean, onToggle: () => void }) => (
    <div className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg">
        <span className="font-semibold text-neutral-700">{label}</span>
        <motion.div
            onClick={onToggle}
            className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${isEnabled ? 'bg-green-500' : 'bg-neutral-300'}`}
        >
            <motion.div
                className="w-6 h-6 bg-white rounded-full shadow-md"
                layout
                transition={{ type: 'spring', stiffness: 700, damping: 30 }}
                animate={{ x: isEnabled ? '1.5rem' : '0rem' }}
            />
        </motion.div>
    </div>
);

// --- MAIN PROFILE COMPONENT ---
const Profile: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'profile' | 'stats' | 'settings' | 'privacy'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // State
  const [profile, setProfile] = useState<UserProfile>({ name: 'Alex Johnson', email: 'alex.j@example.com', phone: '+1 (555) 123-4567', location: 'San Francisco, CA', joinDate: '2023-06-15', avatar: '😊', bio: 'Passionate about wellness and helping others on their health journey. Love hiking, cooking healthy meals, and practicing mindfulness.' });
  const [tempProfile, setTempProfile] = useState(profile);
  const [notifications, setNotifications] = useState<NotificationSettings>({ moodReminders: true, mealPlanNotifications: true, medicationAlerts: true, challengeUpdates: false });

  const userStats: UserStats = { totalPoints: 2445, challengesCompleted: 12, badgesEarned: 8, streakDays: 15, postsShared: 23, helpedOthers: 7 };
  
  const tabs = [
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'stats', label: 'My Journey', icon: Activity },
    { id: 'settings', label: 'Notifications', icon: Bell },
    { id: 'privacy', label: 'Security', icon: Shield }
  ];
  
  const notificationOptions: { key: keyof NotificationSettings; label: string }[] = [
      { key: 'moodReminders', label: 'Mood Reminders' },
      { key: 'mealPlanNotifications', label: 'Meal Plan Updates' },
      { key: 'medicationAlerts', label: 'Medication Alerts' },
      { key: 'challengeUpdates', label: 'Challenge Updates' },
  ];

  // Handlers
  const addToast = (message: string, icon: React.ReactNode) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, icon }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000);
  };
  const handleEdit = () => { setTempProfile(profile); setIsEditing(true); };
  const handleSaveProfile = () => { setProfile(tempProfile); setIsEditing(false); addToast("Profile updated successfully!", <CheckCircle className="w-5 h-5 text-green-500" />); };
  const handleCancelEdit = () => { setIsEditing(false); };
  const handleNotificationChange = (key: keyof NotificationSettings) => { setNotifications(prev => ({ ...prev, [key]: !prev[key] })); };
  
  const StatCard = ({ icon, label, value, colorClass }: { icon: React.ReactNode, label: string, value: number, colorClass: string }) => (
    <motion.div className="bg-white p-6 rounded-2xl shadow-lg border text-center flex flex-col items-center justify-center" whileHover={{y: -5}}
      initial={{opacity: 0, scale: 0.9}} animate={{opacity: 1, scale: 1}} transition={{duration: 0.3}}>
        <div className={`p-3 rounded-full mb-3 ${colorClass}`}>{icon}</div>
        <p className="text-3xl font-bold text-neutral-800"><AnimatedNumber value={value} /></p>
        <p className="text-sm text-neutral-500 mt-1">{label}</p>
    </motion.div>
  );

  return (
    <>
        <div className="fixed top-5 right-5 z-[100] space-y-2">
            <AnimatePresence>
                {toasts.map(toast => (
                    <motion.div key={toast.id} layout initial={{ opacity: 0, y: -50, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, x: 50, scale: 0.8 }} transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                        className="flex items-center gap-3 p-3 bg-white rounded-xl shadow-2xl border border-neutral-100">
                        {toast.icon} <span className="font-medium text-neutral-700">{toast.message}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>

        <div className="max-w-7xl mx-auto p-4 md:p-6">
            <AnimatePresence>
                {showDeleteModal && (
                    <motion.div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <motion.div className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
                            <div className="flex flex-col items-center text-center">
                                <div className="p-4 bg-red-100 rounded-full mb-4"><AlertTriangle className="w-8 h-8 text-red-600"/></div>
                                <h2 className="text-2xl font-bold text-neutral-800">Delete Account</h2>
                                <p className="text-neutral-500 mt-2 mb-6">Are you sure? All of your data will be lost. This action cannot be undone.</p>
                                <div className="flex w-full gap-4">
                                    <motion.button onClick={() => setShowDeleteModal(false)} className="flex-1 py-2.5 rounded-lg bg-neutral-200 hover:bg-neutral-300 font-semibold transition-colors">Cancel</motion.button>
                                    <motion.button className="flex-1 py-2.5 rounded-lg bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors">Delete Account</motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="relative bg-gradient-to-r from-primary-500 to-secondary-500 rounded-3xl p-8 md:p-12 text-white mb-8 shadow-2xl shadow-primary-500/20">
                <div className="flex flex-col md:flex-row items-center gap-8">
                    <motion.div className="relative" initial={{scale:0}} animate={{scale:1}} transition={{type: 'spring', stiffness: 200, damping:20}}>
                        <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center text-6xl shadow-inner">{profile.avatar}</div>
                        <motion.button className="absolute -bottom-1 -right-1 w-10 h-10 bg-white text-primary-500 rounded-full flex items-center justify-center shadow-lg hover:bg-neutral-100 transition-colors" whileHover={{scale:1.1}} whileTap={{scale:0.9}}><Camera className="w-5 h-5" /></motion.button>
                    </motion.div>
                    <div>
                        <h1 className="text-4xl font-bold">{profile.name}</h1>
                        <p className="text-lg opacity-80">Member since {format(parseISO(profile.joinDate), 'MMMM yyyy')}</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                <aside className="lg:col-span-1">
                    <div className="bg-white rounded-2xl p-4 shadow-lg border border-neutral-100 sticky top-6">
                        <nav className="space-y-1">
                            {tabs.map((tab) => (
                                <motion.button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className="w-full relative flex items-center px-4 py-3 rounded-xl focus:outline-none transition-colors" style={{color: activeTab === tab.id ? 'black' : '#4b5563' }}>
                                    {activeTab === tab.id && <motion.div layoutId="profile-active-pill" className="absolute inset-0 bg-neutral-100 rounded-xl" />}
                                    <span className="relative z-10 flex items-center"><tab.icon className="w-5 h-5 mr-3" /> <span className="font-semibold">{tab.label}</span></span>
                                </motion.button>
                            ))}
                        </nav>
                    </div>
                </aside>

                <main className="lg:col-span-3">
                    <AnimatePresence mode="wait">
                        <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                            {activeTab === 'profile' && (
                                <div className="bg-white rounded-2xl p-8 shadow-xl border">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-2xl font-bold text-neutral-800">Profile Information</h2>
                                        <div className="flex gap-2">
                                            {isEditing ? (
                                                <>
                                                    <motion.button onClick={handleCancelEdit} className="px-4 py-2 bg-neutral-200 text-neutral-800 rounded-lg font-semibold hover:bg-neutral-300">Cancel</motion.button>
                                                    <motion.button onClick={handleSaveProfile} className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600"><Save size={16}/>Save</motion.button>
                                                </>
                                            ) : (
                                                <motion.button onClick={handleEdit} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600"><Edit3 size={16}/>Edit Profile</motion.button>
                                            )}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                        {Object.entries({'name': 'Full Name', 'email': 'Email Address', 'phone': 'Phone Number', 'location': 'Location'}).map(([key, label]) => (
                                            <div key={key}>
                                                <label className="block text-sm font-semibold text-neutral-500 mb-1">{label}</label>
                                                {isEditing ? (
                                                    <input type="text" value={tempProfile[key as keyof UserProfile]} onChange={(e) => setTempProfile({...tempProfile, [key]: e.target.value})} className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all"/>
                                                ) : (
                                                    <p className="text-lg text-neutral-800 font-medium">{profile[key as keyof UserProfile]}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-6">
                                        <label className="block text-sm font-semibold text-neutral-500 mb-1">Bio</label>
                                        {isEditing ? (
                                            <textarea value={tempProfile.bio} onChange={(e) => setTempProfile({...tempProfile, bio: e.target.value})} rows={3} className="w-full px-4 py-2 border-2 border-neutral-200 rounded-lg focus:ring-2 focus:ring-primary-400 focus:border-transparent outline-none transition-all"/>
                                        ) : (
                                            <p className="text-lg text-neutral-800 font-medium">{profile.bio}</p>
                                        )}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'stats' && (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                    <StatCard icon={<Heart className="w-8 h-8 text-red-500"/>} label="Total Points" value={userStats.totalPoints} colorClass="bg-red-100"/>
                                    <StatCard icon={<Award className="w-8 h-8 text-yellow-500"/>} label="Badges Earned" value={userStats.badgesEarned} colorClass="bg-yellow-100"/>
                                    <StatCard icon={<Target className="w-8 h-8 text-blue-500"/>} label="Challenges Done" value={userStats.challengesCompleted} colorClass="bg-blue-100"/>
                                    <StatCard icon={<Zap className="w-8 h-8 text-green-500"/>} label="Day Streak" value={userStats.streakDays} colorClass="bg-green-100"/>
                                    <StatCard icon={<MessageSquare className="w-8 h-8 text-indigo-500"/>} label="Posts Shared" value={userStats.postsShared} colorClass="bg-indigo-100"/>
                                    <StatCard icon={<Users className="w-8 h-8 text-pink-500"/>} label="People Helped" value={userStats.helpedOthers} colorClass="bg-pink-100"/>
                                </div>
                            )}
                            {activeTab === 'settings' && (
                                <div className="bg-white rounded-2xl p-8 shadow-xl border">
                                    <h2 className="text-2xl font-bold text-neutral-800 mb-6">Notification Settings</h2>
                                    <div className="space-y-5">
                                        {notificationOptions.map(({ key, label }) => (
                                            <NotificationToggle
                                                key={key}
                                                label={label}
                                                isEnabled={notifications[key as keyof NotificationSettings]}
                                                onToggle={() => handleNotificationChange(key)}
                                            />
                                        ))}
                                    </div>
                                </div>
                            )}
                            {activeTab === 'privacy' && (
                                <div className="bg-white rounded-2xl p-8 shadow-xl border">
                                    <h2 className="text-2xl font-bold text-neutral-800 mb-6">Security & Privacy</h2>
                                    <div className="space-y-4">
                                        <div className="p-4 bg-neutral-50 rounded-lg flex items-center justify-between">
                                            <div><h3 className="font-semibold text-neutral-700">Logout</h3><p className="text-sm text-neutral-500">Sign out from your current session.</p></div>
                                            <button className="flex items-center gap-2 font-semibold text-primary-600 hover:text-primary-700 p-2"><LogOut size={18}/>Log Out</button>
                                        </div>
                                        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex items-center justify-between">
                                            <div><h3 className="font-semibold text-red-800">Delete Account</h3><p className="text-sm text-red-600">Permanently delete your account.</p></div>
                                            <button onClick={() => setShowDeleteModal(true)} className="flex items-center gap-2 font-semibold text-red-600 hover:text-red-700 p-2"><Trash2 size={18}/>Delete</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>
                </main>
              </div>
        </div>
    </>
  );
};

export default Profile;
