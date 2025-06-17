// src/components/CareHub.tsx

import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, isToday, isFuture } from 'date-fns';
import { 
  Calendar, 
  Pill, 
  FileText, 
  Users, 
  Clock,
  Video,
  CheckCircle2,
  Activity,
  ClipboardList,
  MessageSquare,
  BookHeart, // For the new Quiz tab
  Check,
  X,
  User,     // FIX: Added missing icons
  Bell      // FIX: Added missing icons
} from 'lucide-react';

// --- TYPE DEFINITIONS ---
interface Appointment {
  id: string;
  title: string;
  doctor: string;
  date: string; // ISO format string e.g., '2025-06-17'
  time: string;
  type: 'checkup' | 'specialist' | 'therapy';
}
interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  takenToday: boolean;
  reminders: boolean;
}
interface CareNote {
  id: string;
  title: string;
  content: string;
  author: string;
  date: string;
  category: 'medical' | 'diet' | 'exercise' | 'mood';
}
interface QuizQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

// --- DYNAMIC & STATIC DATA ---
const createUpcomingAppointment = (daysFromNow: number, title: string, doctor: string, type: Appointment['type']): Appointment => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return {
        id: crypto.randomUUID(), title, doctor,
        date: date.toISOString().split('T')[0],
        time: `${10 + daysFromNow}:00 AM`, type,
    };
};

const initialAppointments: Appointment[] = [
    createUpcomingAppointment(1, 'Cardiology Follow-up', 'Dr. Michael Chen', 'specialist'),
    createUpcomingAppointment(3, 'Annual Physical', 'Dr. Sarah Johnson', 'checkup'),
];

const quizQuestions: QuizQuestion[] = [
    { question: "What is the first step in any first-aid situation (DRSABCD)?", options: ["Check Airway", "Check for Danger", "Send for help", "Check for Response"], correctAnswer: "Check for Danger" },
    { question: "For an adult, what is the correct ratio of chest compressions to rescue breaths for CPR?", options: ["15:2", "30:2", "10:1", "5:1"], correctAnswer: "30:2" },
    { question: "How should you treat a minor burn?", options: ["Apply ice directly", "Cover with a blanket", "Run under cool water for 20 mins", "Apply butter or oil"], correctAnswer: "Run under cool water for 20 mins" },
    { question: "What is the primary action to control severe bleeding?", options: ["Apply a tourniquet", "Elevate the limb", "Apply direct, firm pressure", "Give the person water"], correctAnswer: "Apply direct, firm pressure" }
];


// --- COMPONENT START ---
const CareHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'calendar' | 'medications' | 'notes' | 'team' | 'quiz'>('calendar');
  
  // --- STATE MANAGEMENT ---
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments);
  const [medications, setMedications] = useState<Medication[]>([
    { id: '1', name: 'Lisinopril', dosage: '10mg', frequency: 'Daily', takenToday: false, reminders: true },
    { id: '2', name: 'Metformin', dosage: '500mg', frequency: 'Twice daily', takenToday: true, reminders: false },
  ]);
  const [careNotes, setCareNotes] = useState<CareNote[]>([
    { id: '1', title: 'Post-walk Update', content: 'Completed 30-minute walk. Felt energetic!', author: 'You', date: '2025-06-16', category: 'exercise' },
    { id: '2', title: 'Blood Pressure', content: 'Morning reading: 122/78. Looking good.', author: 'Alex (Caregiver)', date: '2025-06-15', category: 'medical' },
  ]);

  const careTeam = [
    { id: '1', name: 'Dr. Sarah Johnson', role: 'Primary Care Physician', avatar: '👩‍⚕️' },
    { id: '2', name: 'Dr. Michael Chen', role: 'Cardiologist', avatar: '👨‍⚕️' },
    { id: '3', name: 'Alex Wilson', role: 'Family Caregiver', avatar: '👩‍🦰' },
  ];

  // Quiz state
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Handlers
  const handleTakeMedication = (id: string) => setMedications(meds => meds.map(med => med.id === id ? { ...med, takenToday: !med.takenToday } : med));
  const medicationAdherence = useMemo(() => {
    const totalMeds = medications.length;
    if (totalMeds === 0) return 0;
    const takenMeds = medications.filter(med => med.takenToday).length;
    return Math.round((takenMeds / totalMeds) * 100);
  }, [medications]);

  const handleAnswerSelect = (option: string) => {
    if (selectedAnswer) return; // Prevent changing answer
    setSelectedAnswer(option);
    if (option === quizQuestions[currentQuestionIndex].correctAnswer) {
        setScore(prev => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswer(null);
    } else {
        setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowResult(false);
  };
  
  const tabs = [
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'medications', label: 'Medications', icon: Pill },
    { id: 'quiz', label: 'First-Aid Quiz', icon: BookHeart }, // New Tab
    { id: 'notes', label: 'Notes', icon: FileText },
    { id: 'team', label: 'Care Team', icon: Users }
  ];

  const getAppointmentTypeStyle = (type: Appointment['type']) => {
    switch (type) {
      case 'checkup': return { bg: 'bg-blue-50', text: 'text-blue-600', border: 'border-blue-200' };
      case 'specialist': return { bg: 'bg-purple-50', text: 'text-purple-600', border: 'border-purple-200' };
      case 'therapy': return { bg: 'bg-green-50', text: 'text-green-600', border: 'border-green-200' };
      default: return { bg: 'bg-red-50', text: 'text-red-600', border: 'border-red-200' };
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h1 className="text-4xl font-bold text-neutral-800 mb-2">Care Hub</h1>
        <p className="text-neutral-500 text-lg">Your central place for appointments, medications, and learning.</p>
      </motion.div>

      <div className="my-8">
        <div className="bg-white rounded-full p-1.5 shadow-lg border border-neutral-100 flex flex-wrap md:flex-nowrap space-x-1">
          {tabs.map((tab) => (
            <motion.button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className="relative flex-1 py-2.5 px-4 text-sm font-semibold rounded-full focus:outline-none transition-colors min-w-max"
              style={{ color: activeTab === tab.id ? 'white' : '#374151' }}>
              {activeTab === tab.id && (<motion.div layoutId="carehub-active-pill" className="absolute inset-0 bg-primary-500 rounded-full" style={{ zIndex: 0 }} />)}
              <span className="relative z-10 flex items-center justify-center"><tab.icon className="w-5 h-5 mr-2" />{tab.label}</span>
            </motion.button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={activeTab} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.3 }}>
        {/* --- FIX: Restored the original tab content --- */}
          {activeTab === 'calendar' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {appointments.filter(apt => isFuture(parseISO(apt.date)) || isToday(parseISO(apt.date))).map((appointment, index) => {
                  const style = getAppointmentTypeStyle(appointment.type);
                  return (
                    <motion.div key={appointment.id} className={`bg-white rounded-2xl shadow-md border-l-4 p-5 flex items-center ${style.border}`}
                                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1 }}>
                      <div className={`p-3 rounded-full mr-5 ${style.bg}`}>
                        <Calendar className={`w-6 h-6 ${style.text}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm font-bold capitalize ${style.text}`}>{appointment.type}</p>
                        <h3 className="text-lg font-bold text-neutral-800">{appointment.title}</h3>
                        <p className="text-neutral-500">{appointment.doctor}</p>
                        <div className="flex items-center space-x-4 text-sm text-neutral-500 mt-2">
                          <span>{format(parseISO(appointment.date), 'EEEE, LLL d')}</span>
                          <span className="flex items-center"><Clock className="w-4 h-4 mr-1"/>{appointment.time}</span>
                        </div>
                      </div>
                      <motion.button className="flex items-center gap-2 px-4 py-2 bg-primary-500 text-white rounded-lg shadow-sm hover:bg-primary-600 transition-all" whileHover={{scale: 1.05}}>
                        <Video size={16}/> Join Call
                      </motion.button>
                    </motion.div>
                  )
                })}
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border">
                    <h3 className="text-lg font-semibold text-neutral-800 mb-4 flex items-center gap-2"><ClipboardList/>This Week's Summary</h3>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center"><span className="text-neutral-600">Appointments</span><span className="text-2xl font-bold text-primary-600">{appointments.length}</span></div>
                        <div className="flex justify-between items-center"><span className="text-neutral-600">Meds Taken Today</span><span className="text-2xl font-bold text-secondary-600">{medications.filter(m => m.takenToday).length}</span></div>
                        <div className="flex justify-between items-center"><span className="text-neutral-600">Notes Added</span><span className="text-2xl font-bold text-accent-600">{careNotes.length}</span></div>
                    </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'medications' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 mb-4">Daily Medications</h2>
                <div className="space-y-4">
                  {medications.map((med, index) => (
                    <motion.div key={med.id} className="bg-white rounded-2xl shadow-md p-5 flex items-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                      <div className={`p-3 rounded-full mr-5 ${med.takenToday ? 'bg-green-100' : 'bg-neutral-100'}`}>
                        <Pill className={`w-6 h-6 ${med.takenToday ? 'text-green-600' : 'text-neutral-500'}`} />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-neutral-800">{med.name}</h3>
                        <p className="text-neutral-500">{med.dosage} &bull; {med.frequency}</p>
                      </div>
                      <motion.button onClick={() => handleTakeMedication(med.id)} className="p-3 rounded-full" whileTap={{scale: 1.2}}>
                        <AnimatePresence mode="wait">
                          <motion.div key={med.takenToday ? 'taken' : 'not_taken'} initial={{scale:0, rotate: -90}} animate={{scale:1, rotate: 0}} exit={{scale:0, rotate: 90}}>
                            {med.takenToday ? <CheckCircle2 className="w-8 h-8 text-green-500"/> : <div className="w-8 h-8 rounded-full border-2 border-neutral-300 bg-neutral-50 hover:bg-neutral-100"/>}
                          </motion.div>
                        </AnimatePresence>
                      </motion.button>
                    </motion.div>
                  ))}
                </div>
              </div>
              <div className="space-y-6">
                <div className="bg-white rounded-2xl p-6 shadow-lg border">
                  <h3 className="text-lg font-semibold text-neutral-800 mb-3 flex items-center gap-2"><Activity/>Today's Adherence</h3>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-neutral-600 text-sm font-medium">Progress</span>
                    <span className="text-primary-600 font-bold">{medicationAdherence}%</span>
                  </div>
                  <div className="w-full bg-neutral-200 rounded-full h-2.5">
                    <motion.div className="bg-primary-500 h-2.5 rounded-full" initial={{width:0}} animate={{width: `${medicationAdherence}%`}} transition={{duration: 0.8, ease:"easeOut"}}/>
                  </div>
                  <p className="text-xs text-neutral-500 mt-2">
                    {medicationAdherence > 80 ? "Fantastic job staying on track!" : "Keep it up, consistency is key!"}
                  </p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'notes' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {careNotes.map((note, index) => (
                  <motion.div key={note.id} className="bg-white rounded-2xl shadow-lg border p-6 flex flex-col" initial={{opacity:0, scale:0.9}} animate={{opacity:1, scale:1}} transition={{delay: index*0.1}}>
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="text-lg font-bold text-neutral-800">{note.title}</h3>
                        <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700">{note.category}</span>
                    </div>
                    <p className="text-neutral-600 flex-1 mb-4">"{note.content}"</p>
                    <div className="text-xs text-neutral-400 border-t pt-2 flex justify-between items-center">
                        <span>By: {note.author}</span>
                        <span>{format(parseISO(note.date), 'PP')}</span>
                    </div>
                  </motion.div>
              ))}
            </div>
          )}
          {activeTab === 'team' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {careTeam.map((member, index) => (
                <motion.div key={member.id} className="bg-white rounded-2xl shadow-lg border p-6 text-center hover:-translate-y-1.5 transition-transform duration-300" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay: index*0.1}}>
                    <div className="text-5xl mb-3">{member.avatar}</div>
                    <h3 className="text-xl font-bold text-neutral-800">{member.name}</h3>
                    <p className="text-primary-600 font-medium mb-4">{member.role}</p>
                    <motion.button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-secondary-500 text-white rounded-lg hover:bg-secondary-600 transition-colors" whileTap={{scale:0.95}}>
                        <MessageSquare size={16}/> Send Message
                    </motion.button>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* --- NEW QUIZ TAB CONTENT --- */}
          {activeTab === 'quiz' && (
            <div className="bg-white rounded-3xl shadow-2xl border p-8 max-w-2xl mx-auto">
              <AnimatePresence mode="wait">
                {showResult ? (
                    <motion.div key="result" initial={{opacity:0, scale:0.8}} animate={{opacity:1, scale:1}} className="text-center">
                      <h2 className="text-3xl font-bold text-neutral-800">Quiz Complete!</h2>
                      <div className="my-6 text-6xl">{score >= 3 ? '🎉' : '👍'}</div>
                      <p className="text-lg text-neutral-600">You scored</p>
                      <p className="text-5xl font-bold text-primary-600 my-2">{score} / {quizQuestions.length}</p>
                      <p className="text-neutral-500 mb-8">{score >= 3 ? "Excellent work! You're a first-aid star!" : "Great effort! Every bit of knowledge helps."}</p>
                      <motion.button onClick={restartQuiz} className="px-8 py-3 bg-primary-500 text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 transition-colors" whileHover={{scale:1.05}} whileTap={{scale:0.95}}>
                        Try Again
                      </motion.button>
                    </motion.div>
                ) : (
                    <motion.div key={currentQuestionIndex} initial={{opacity:0, x:50}} animate={{opacity:1, x:0}} exit={{opacity:0, x:-50}} transition={{duration:0.3}}>
                        <div className="mb-6">
                            <p className="text-sm font-semibold text-primary-600">Question {currentQuestionIndex + 1} of {quizQuestions.length}</p>
                            <h2 className="text-2xl font-bold text-neutral-800 mt-1">{quizQuestions[currentQuestionIndex].question}</h2>
                        </div>
                        <div className="space-y-3 mb-6">
                            {quizQuestions[currentQuestionIndex].options.map(option => {
                                const isSelected = selectedAnswer === option;
                                const isCorrect = isSelected && option === quizQuestions[currentQuestionIndex].correctAnswer;
                                const isIncorrect = isSelected && option !== quizQuestions[currentQuestionIndex].correctAnswer;
                                
                                let bgColor = "bg-white hover:bg-neutral-50";
                                if (isCorrect) bgColor = "bg-green-100 border-green-500";
                                if (isIncorrect) bgColor = "bg-red-100 border-red-500";

                                return (
                                <motion.button key={option} onClick={() => handleAnswerSelect(option)} disabled={!!selectedAnswer}
                                    className={`w-full p-4 rounded-xl border-2 text-left font-semibold text-neutral-700 transition-all duration-200 flex items-center justify-between ${bgColor} ${selectedAnswer && !isSelected ? "opacity-50" : ""}`}
                                    whileHover={{scale: selectedAnswer ? 1 : 1.02}}>
                                    {option}
                                    {isCorrect && <Check className="w-6 h-6 text-green-600" />}
                                    {isIncorrect && <X className="w-6 h-6 text-red-600" />}
                                </motion.button>
                                );
                            })}
                        </div>
                        {selectedAnswer && (
                            <motion.button onClick={handleNextQuestion} className="w-full py-3 bg-primary-500 text-white font-semibold rounded-lg shadow-md hover:bg-primary-600 transition-colors"
                                initial={{opacity:0}} animate={{opacity:1}} whileHover={{scale:1.02}}>
                                {currentQuestionIndex < quizQuestions.length - 1 ? 'Next Question' : 'See Results'}
                            </motion.button>
                        )}
                    </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CareHub;
