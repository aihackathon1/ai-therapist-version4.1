'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';

type BreathingPhase = 'inhale' | 'hold' | 'exhale';

export default function Exercise() {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathingPhase>('inhale');
  const [cycle, setCycle] = useState(0);
  const [timeLeft, setTimeLeft] = useState(4);

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
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Take a moment to center yourself with this guided breathing exercise. 
            Follow the circle as it guides you through each breath.
          </p>
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
                className={`w-64 h-64 mx-auto rounded-full bg-gradient-to-br ${getCircleColor()} shadow-2xl flex items-center justify-center`}
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
              <div className="absolute inset-0 w-64 h-64 mx-auto">
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
            <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">🧘</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reduces Stress</h3>
            <p className="text-gray-600 text-sm">
              Deep breathing activates your parasympathetic nervous system, promoting relaxation.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">💚</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Improves Focus</h3>
            <p className="text-gray-600 text-sm">
              Mindful breathing helps clear your mind and improves concentration and mental clarity.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-xl">😌</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Enhances Well-being</h3>
            <p className="text-gray-600 text-sm">
              Regular practice can improve mood, sleep quality, and overall emotional well-being.
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
            Tips for Effective Breathing
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-ai-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">1</span>
                </div>
                <p className="text-gray-700">
                  Find a comfortable position, either sitting or lying down
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-ai-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">2</span>
                </div>
                <p className="text-gray-700">
                  Close your eyes and focus on your breath
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-ai-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">3</span>
                </div>
                <p className="text-gray-700">
                  Breathe naturally - don't force or strain
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-ai-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">4</span>
                </div>
                <p className="text-gray-700">
                  Let go of distractions and return to your breath
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-ai-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">5</span>
                </div>
                <p className="text-gray-700">
                  Practice regularly for best results
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-ai-purple rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm">6</span>
                </div>
                <p className="text-gray-700">
                  Start with 5-10 minutes and gradually increase
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
