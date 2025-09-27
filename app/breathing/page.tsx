'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

type BreathingPhase = 'inhale' | 'hold' | 'exhale';

interface ExerciseEntry {
  id: string;
  timestamp: Date;
  feeling: string;
  exerciseType: 'breathing';
}

export default function BreathingExercise() {
  // Breathing exercise state
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [cycle, setCycle] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const breathingCycle = {
    inhale: { duration: 4, next: 'hold' as BreathingPhase },
    hold: { duration: 2, next: 'exhale' as BreathingPhase },
    exhale: { duration: 4, next: 'inhale' as BreathingPhase }
  };

  const phaseText = {
    inhale: 'Breathe In',
    hold: 'Hold',
    exhale: 'Breathe Out'
  };

  const phaseInstructions = {
    inhale: 'Slowly breathe in through your nose',
    hold: 'Hold your breath gently',
    exhale: 'Slowly breathe out through your mouth'
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive) {
      interval = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            const nextPhase = breathingCycle[phase].next;
            setPhase(nextPhase);
            setTimeLeft(breathingCycle[nextPhase].duration);
            
            if (nextPhase === 'inhale') {
              setCycle(prev => prev + 1);
            }
            
            return breathingCycle[nextPhase].duration;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, phase]);

  const handleStartStop = () => {
    if (isActive) {
      setIsActive(false);
      setPhase('inhale');
      setTimeLeft(4);
      setCycle(0);
    } else {
      setIsActive(true);
    }
  };

  const getCircleScale = () => {
    if (!isActive) return 1;
    
    const progress = (breathingCycle[phase].duration - timeLeft) / breathingCycle[phase].duration;
    
    switch (phase) {
      case 'inhale':
        return 0.8 + (0.4 * progress); // Scale from 0.8 to 1.2
      case 'hold':
        return 1.2; // Stay at max scale
      case 'exhale':
        return 1.2 - (0.4 * progress); // Scale from 1.2 to 0.8
      default:
        return 1;
    }
  };

  const getCircleColor = () => {
    if (!isActive) return 'from-blue-400 to-purple-500';
    
    switch (phase) {
      case 'inhale':
        return 'from-blue-400 to-cyan-400';
      case 'hold':
        return 'from-cyan-400 to-green-400';
      case 'exhale':
        return 'from-green-400 to-purple-400';
      default:
        return 'from-blue-400 to-purple-500';
    }
  };

  return (
    <main className="min-h-screen bg-gradient-soft">
      <Navigation />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Mindful Breathing Exercise
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            Follow the circle as it guides you through each breath. This exercise helps reduce stress, 
            anxiety, and promotes relaxation by activating your parasympathetic nervous system.
          </p>
          
          {/* Navigation Links */}
          <div className="flex justify-center gap-4 mb-8">
            <Link 
              href="/exercise"
              className="px-4 py-2 text-ai-purple hover:text-ai-green transition-colors duration-200 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Exercises
            </Link>
            <Link 
              href="/grounding"
              className="px-4 py-2 bg-gradient-to-r from-ai-green to-ai-purple text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Try Grounding Exercise
            </Link>
          </div>
        </motion.div>

        {/* Breathing Exercise Card */}
        <motion.div 
          className="card max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="text-center">
            {/* Breathing Circle */}
            <div className="relative mb-8">
              <motion.div
                className={`w-48 h-48 lg:w-56 lg:h-56 mx-auto rounded-full bg-gradient-to-br ${getCircleColor()} shadow-2xl flex items-center justify-center`}
                animate={{
                  scale: getCircleScale(),
                }}
                transition={{
                  duration: 1,
                  ease: "easeInOut"
                }}
              >
                <div className="text-center text-white">
                  <motion.div
                    className="text-2xl font-semibold mb-2"
                    key={phase}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {phaseText[phase]}
                  </motion.div>
                  <motion.div
                    className="text-lg"
                    key={`${phase}-time`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    {timeLeft}s
                  </motion.div>
                </div>
              </motion.div>
              
              {/* Progress Ring */}
              <div className="absolute inset-0 w-48 h-48 lg:w-56 lg:h-56 mx-auto">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.2)"
                    strokeWidth="2"
                  />
                  <motion.circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.8)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    initial={{ pathLength: 0 }}
                    animate={{
                      pathLength: isActive ? (breathingCycle[phase].duration - timeLeft) / breathingCycle[phase].duration : 0
                    }}
                    transition={{ duration: 1, ease: "linear" }}
                  />
                </svg>
              </div>
            </div>

            {/* Instructions */}
            <motion.div
              className="mb-8"
              key={`instructions-${phase}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg text-gray-700 mb-2">
                {phaseInstructions[phase]}
              </p>
              {isActive && (
                <p className="text-sm text-gray-500">
                  Cycle {cycle + 1} • {phaseText[phase]} for {timeLeft} more seconds
                </p>
              )}
            </motion.div>

            {/* Control Button */}
            <motion.button
              onClick={handleStartStop}
              className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 ${
                isActive
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:shadow-lg'
                  : 'bg-gradient-to-r from-ai-purple to-ai-green text-white hover:shadow-lg'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {isActive ? 'Stop Exercise' : 'Start Exercise'}
            </motion.button>

            {/* Cycle Counter */}
            {isActive && cycle > 0 && (
              <motion.div
                className="mt-6 p-4 bg-gray-50 rounded-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-600">
                  <span className="font-semibold text-ai-purple">{cycle}</span> breathing cycles completed
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Benefits Section */}
        <motion.div 
          className="mt-12 grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reduces Anxiety</h3>
            <p className="text-gray-600 text-sm">
              Activates your parasympathetic nervous system, promoting calm and relaxation.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Improves Focus</h3>
            <p className="text-gray-600 text-sm">
              Helps anchor your attention to the present moment, improving concentration.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Enhances Well-being</h3>
            <p className="text-gray-600 text-sm">
              Regular practice can improve mood, reduce stress, and enhance emotional well-being.
            </p>
          </div>
        </motion.div>

        {/* Tips Section */}
        <motion.div 
          className="mt-12 card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            Tips for Effective Breathing Practice
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-ai-purple text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                1
              </div>
              <p className="text-gray-700">
                Find a comfortable position, either sitting or lying down
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-ai-purple text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                2
              </div>
              <p className="text-gray-700">
                Close your eyes and focus on your breath
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-ai-purple text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                3
              </div>
              <p className="text-gray-700">
                Breathe naturally - don't force or strain
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-ai-purple text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                4
              </div>
              <p className="text-gray-700">
                Practice regularly for best results - even 5 minutes daily can help
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
