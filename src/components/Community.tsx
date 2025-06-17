// src/components/Community.tsx

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { 
  Users, 
  Trophy, 
  Target, 
  Heart, 
  MessageCircle,
  Plus,
  Award,
  TrendingUp,
  Star,
  Zap,
  ThumbsUp,
  Share2,
  Check,
  Send,
  BedDouble,
  BookOpen,    // Added for Journaling Challenge
  MonitorOff,  // Added for Digital Detox Challenge
  Hourglass,   // Added for Fasting Challenge
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Challenge {
  id: string;
  title: string;
  description: string;
  participants: number;
  progress: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: 'fitness' | 'nutrition' | 'mindfulness' | 'sleep' | 'journaling' | 'digital-wellness'; // Added new categories
  reward: string;
  icon: React.ElementType;
}

interface Post {
  id: string;
  author: string;
  avatar: string;
  content: string;
  timestamp: Date;
  likes: number;
  comments: number;
  category: 'achievement' | 'motivation' | 'question';
  liked: boolean;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  rarity: 'common' | 'rare' | 'epic';
  earned: boolean;
}

interface LeaderboardUser {
    rank: number;
    name: string;
    points: number;
    avatar: string;
    isUser: boolean;
}

// --- INITIAL DATA (Now used to seed the state) ---
const initialChallenges: Challenge[] = [
    { id: '1', title: 'Mindful Morning', description: 'Meditate for 10 mins daily', participants: 234, progress: 65, difficulty: 'Easy', category: 'mindfulness', reward: '+50 Points', icon: Zap },
    { id: '2', title: 'Hydration Hero', description: 'Drink 8 glasses of water', participants: 189, progress: 78, difficulty: 'Easy', category: 'nutrition', reward: '+50 Points', icon: Star },
    { id: '5', title: '8-Hour Sleep', description: 'Get a full night\'s rest', participants: 112, progress: 50, difficulty: 'Easy', category: 'sleep', reward: '+75 Points', icon: BedDouble },
    { id: '3', title: 'Step It Up', description: 'Achieve 10,000 steps', participants: 312, progress: 43, difficulty: 'Medium', category: 'fitness', reward: '+100 Points', icon: TrendingUp },
    // --- NEW CHALLENGES ADDED ---
    { id: '6', title: 'Daily Journaling', description: 'Write down your thoughts for 5 mins', participants: 88, progress: 25, difficulty: 'Easy', category: 'journaling', reward: '+60 Points', icon: BookOpen },
    { id: '7', title: 'Digital Detox', description: 'No screens an hour before bed', participants: 142, progress: 15, difficulty: 'Hard', category: 'digital-wellness', reward: '+150 Points', icon: MonitorOff },
];
const initialPosts: Post[] = [
    { id: '1', author: 'Sarah M.', avatar: '👩‍🦰', content: "Just hit my 10k steps goal for the third day in a row! Feeling amazing. Thanks for the motivation everyone! 💪", timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), likes: 24, comments: 8, category: 'achievement', liked: false },
    { id: '2', author: 'David L.', avatar: '👨‍💼', content: "Big shoutout to this community for keeping me accountable on the hydration challenge. It's making a huge difference.", timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), likes: 12, comments: 15, category: 'motivation', liked: true },
];

// --- COMPONENT START ---
const Community: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'challenges' | 'wall' | 'badges' | 'leaderboard'>('challenges');
  
  // --- STATE MANAGEMENT ---
  const [challenges, setChallenges] = useState(initialChallenges);
  const [joinedChallenges, setJoinedChallenges] = useState<string[]>(['2']);
  const [posts, setPosts] = useState(initialPosts);
  const [newPost, setNewPost] = useState('');

  const handleJoinChallenge = (challengeId: string) => {
    if (joinedChallenges.includes(challengeId)) return;
    setJoinedChallenges(prev => [...prev, challengeId]);
    setChallenges(prev => prev.map(c => c.id === challengeId ? {...c, participants: c.participants + 1} : c));
  };
  
  const handleLikePost = (postId: string) => {
    setPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 };
      }
      return p;
    }));
  };

  const handleAddPost = () => {
    if (newPost.trim() === '') return;
    const newPostObject: Post = {
        id: crypto.randomUUID(),
        author: 'Alex Johnson',
        avatar: '😊',
        content: newPost,
        timestamp: new Date(),
        likes: 0,
        comments: 0,
        category: 'motivation',
        liked: false
    };
    setPosts(prev => [newPostObject, ...prev]);
    setNewPost('');
  };

  const badges: Badge[] = [
    { id: '1', name: 'First Steps', description: 'Complete a fitness challenge', icon: '👟', rarity: 'common', earned: true },
    { id: '2', name: 'Hydration Hero', description: 'Complete the Hydration challenge', icon: '💧', rarity: 'common', earned: true },
    { id: '3', name: 'Zen Master', description: 'Complete the Mindfulness challenge', icon: '🧘', rarity: 'rare', earned: true },
    { id: '4', name: 'Community Star', description: 'Get 50 likes on your posts', icon: '⭐', rarity: 'epic', earned: false },
  ];

  const leaderboard: LeaderboardUser[] = [
    { rank: 1, name: 'Jennifer K.', points: 2840, avatar: '👩‍💻', isUser: false },
    { rank: 2, name: 'Michael R.', points: 2756, avatar: '👨‍🏃', isUser: false },
    { rank: 3, name: 'Lisa W.', points: 2698, avatar: '👩‍🎨', isUser: false },
    { rank: 4, name: 'Alex Johnson', points: 2445, avatar: '😊', isUser: true },
    { rank: 5, name: 'Carlos M.', points: 2398, avatar: '👨‍🍳', isUser: false },
  ];

  const tabs = [
    { id: 'challenges', label: 'Challenges', icon: Target },
    { id: 'wall', label: 'Community Wall', icon: Heart },
    { id: 'badges', label: 'My Badges', icon: Award },
    { id: 'leaderboard', label: 'Leaderboard', icon: Trophy },
  ];

  const getCategoryStyle = (category: Challenge['category']) => {
    switch (category) {
      case 'fitness': return { bg: 'bg-blue-100', text: 'text-blue-600', border: 'border-blue-500' };
      case 'nutrition': return { bg: 'bg-green-100', text: 'text-green-600', border: 'border-green-500' };
      case 'mindfulness': return { bg: 'bg-purple-100', text: 'text-purple-600', border: 'border-purple-500' };
      case 'sleep': return { bg: 'bg-indigo-100', text: 'text-indigo-600', border: 'border-indigo-500' };
      case 'journaling': return { bg: 'bg-amber-100', text: 'text-amber-600', border: 'border-amber-500' };
      case 'digital-wellness': return { bg: 'bg-slate-100', text: 'text-slate-600', border: 'border-slate-500' };
      default: return { bg: 'bg-neutral-100', text: 'text-neutral-600', border: 'border-neutral-500' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold text-neutral-800 mb-2">Community Quest</h1>
        <p className="text-neutral-500 text-lg">Achieve your goals together. Get stronger, together.</p>
      </motion.div>

      <div className="my-8">
        <div className="bg-white rounded-full p-1.5 shadow-lg border border-neutral-100 flex space-x-1">
            {tabs.map((tab) => (
                <motion.button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className="relative flex-1 py-2.5 px-4 text-sm font-semibold rounded-full focus:outline-none transition-colors" style={{ color: activeTab === tab.id ? 'white' : '#374151' }}>
                    {activeTab === tab.id && <motion.div layoutId="community-active-pill" className="absolute inset-0 bg-primary-500 rounded-full" />}
                    <span className="relative z-10 flex items-center justify-center"><tab.icon className="w-5 h-5 mr-2" />{tab.label}</span>
                </motion.button>
            ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
          {activeTab === 'challenges' && (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {challenges.map((challenge, index) => {
                    const style = getCategoryStyle(challenge.category);
                    const isJoined = joinedChallenges.includes(challenge.id);
                    return (
                        <motion.div key={challenge.id} className="bg-white rounded-2xl shadow-lg border p-6 flex flex-col hover:shadow-xl transition-shadow duration-300"
                            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: index * 0.05 }}>
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-xl font-bold text-neutral-800">{challenge.title}</h3>
                                    <p className="text-neutral-500">{challenge.description}</p>
                                </div>
                                <div className={`p-2 rounded-full ${style.bg}`}><challenge.icon className={`w-6 h-6 ${style.text}`} /></div>
                            </div>
                            <div className="flex-1" />
                            <div className="w-full bg-neutral-200 rounded-full h-2 my-4"><motion.div className="bg-primary-500 h-2 rounded-full" initial={{width:0}} animate={{width: `${challenge.progress}%`}}/></div>
                            <div className="flex justify-between items-center text-sm text-neutral-600 mb-4">
                                <span className={`font-semibold capitalize px-2 py-0.5 rounded-full ${style.bg} ${style.text}`}>{challenge.category}</span>
                                <span className="flex items-center gap-1"><Users size={16}/> {challenge.participants.toLocaleString()} joined</span>
                                <span className="font-bold text-primary-600">{challenge.reward}</span>
                            </div>
                            <motion.button onClick={() => handleJoinChallenge(challenge.id)} disabled={isJoined}
                                className={`w-full py-2.5 rounded-lg font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2
                                ${isJoined ? 'bg-green-500 cursor-default' : 'bg-primary-500 hover:bg-primary-600'}`}
                                whileHover={!isJoined ? { scale: 1.02 } : {}} whileTap={!isJoined ? { scale: 0.98 } : {}}>
                                {isJoined ? <><Check size={20}/> Joined</> : <><Plus size={20}/> Join Challenge</>}
                            </motion.button>
                        </motion.div>
                    )
                })}
             </div>
          )}

          {activeTab === 'wall' && (
            <div className="max-w-3xl mx-auto">
                <motion.div className="bg-white rounded-2xl p-4 shadow-lg border mb-8 flex gap-4 items-start"
                    initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}}>
                    <div className="text-4xl mt-1">😊</div>
                    <div className="flex-1">
                        <textarea value={newPost} onChange={(e) => setNewPost(e.target.value)} placeholder="Share a win or ask a question..." 
                            className="w-full p-2 border-b-2 border-neutral-200 focus:border-primary-500 transition-colors focus:outline-none resize-none" rows={2}></textarea>
                        <div className="flex justify-end mt-2">
                            <motion.button onClick={handleAddPost} className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg text-sm font-semibold hover:bg-primary-600"
                                whileTap={{scale:0.95}} disabled={!newPost}>
                                <Send size={16}/> Share Post
                            </motion.button>
                        </div>
                    </div>
                </motion.div>
                <div className="space-y-6">
                    <AnimatePresence>
                        {posts.map(post => (
                        <motion.div key={post.id} className="bg-white rounded-2xl p-6 shadow-md border"
                            layout initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} exit={{opacity:0, y:-10}}>
                            <div className="flex items-start gap-4">
                                <div className="text-4xl">{post.avatar}</div>
                                <div className="flex-1">
                                    <div className="flex items-baseline justify-between">
                                        <h4 className="font-bold text-neutral-800">{post.author}</h4>
                                        <p className="text-xs text-neutral-400">{formatDistanceToNow(post.timestamp, { addSuffix: true })}</p>
                                    </div>
                                    <p className="text-neutral-700 my-2">{post.content}</p>
                                    <div className="flex items-center gap-6 text-sm text-neutral-500 mt-4">
                                        <motion.button onClick={() => handleLikePost(post.id)} className={`flex items-center gap-1.5 transition-colors ${post.liked ? 'text-red-500' : 'hover:text-red-500'}`} whileTap={{scale:1.1}}>
                                            <ThumbsUp size={18}/> <span className="font-medium">{post.likes}</span>
                                        </motion.button>
                                        <button className="flex items-center gap-1.5 hover:text-primary-500 transition-colors"><MessageCircle size={18}/> {post.comments}</button>
                                        <button className="flex items-center gap-1.5 hover:text-secondary-500 transition-colors"><Share2 size={18}/> Share</button>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
          )}

          {activeTab === 'badges' && (
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {badges.map((badge, index) => (
                    <motion.div key={badge.id} className={`rounded-2xl p-6 border-2 text-center transition-all duration-300 ${badge.earned ? 'bg-white shadow-lg border-yellow-300' : 'bg-neutral-100 border-neutral-200 opacity-60'}`}
                        initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} transition={{delay: index*0.1}} whileHover={badge.earned ? { y: -5, scale: 1.05 } : {}}>
                        <div className={`text-6xl mb-3 transition-transform duration-300 ${badge.earned ? '' : 'grayscale'}`}>{badge.icon}</div>
                        <h3 className="font-bold text-neutral-800 mb-1">{badge.name}</h3>
                        <p className="text-sm text-neutral-500 mb-3">{badge.description}</p>
                        {badge.earned && <div className="inline-flex items-center gap-1.5 px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold"><Star size={12}/> Earned</div>}
                    </motion.div>
                ))}
             </div>
          )}

          {activeTab === 'leaderboard' && (
            <div className="max-w-3xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="md:col-span-1">
                        <h2 className="text-2xl font-bold text-neutral-800 mb-4">Weekly Rankings</h2>
                        <div className="space-y-3">
                        {leaderboard.map((user, index) => (
                            <motion.div key={user.rank} className={`flex items-center p-4 rounded-xl transition-all duration-300 ${user.isUser ? 'bg-primary-500 text-white shadow-lg' : 'bg-white shadow-md border'}`}
                                initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} transition={{delay: index*0.1}}>
                                <span className={`text-xl font-bold w-8 ${user.isUser ? '' : 'text-neutral-400'}`}>#{user.rank}</span>
                                <div className="text-3xl mx-4">{user.avatar}</div>
                                <div className="flex-1">
                                    <h4 className="font-bold">{user.name}</h4>
                                    <p className={`text-sm ${user.isUser ? 'text-primary-100' : 'text-neutral-500'}`}>{user.points.toLocaleString()} points</p>
                                </div>
                                {index < 3 && <Trophy className={`w-6 h-6 ${index === 0 ? 'text-yellow-400': index === 1 ? 'text-neutral-400' : 'text-yellow-600'}`}/>}
                            </motion.div>
                        ))}
                        </div>
                    </div>
                    <div className="md:col-span-1">
                         <h2 className="text-2xl font-bold text-neutral-800 mb-4">Community Spotlight</h2>
                         <div className="bg-white rounded-2xl p-6 shadow-xl border text-center">
                            <motion.div className="text-7xl mb-4" initial={{scale:0}} animate={{scale:1}} transition={{type:'spring', stiffness:150, delay:0.2}}>{leaderboard[0].avatar}</motion.div>
                            <h3 className="text-2xl font-bold text-primary-600">{leaderboard[0].name}</h3>
                            <p className="text-neutral-500 mb-4">Top Performer of the Week!</p>
                            <p className="text-neutral-700 bg-neutral-50 p-4 rounded-lg">"{leaderboard[0].name} has completed 5 challenges and encouraged 12 members this week. An inspiration to us all!"</p>
                         </div>
                    </div>
                </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Community;
