'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

interface GroundingAnswers {
  see: string[];
  touch: string[];
  hear: string[];
  smell: string[];
  taste: string;
}

interface ExerciseEntry {
  id: string;
  timestamp: Date;
  feeling: string;
  exerciseType: 'grounding';
}

export default function GroundingExercise() {
  // Grounding exercise state
  const [groundingAnswers, setGroundingAnswers] = useState<GroundingAnswers>({
    see: ['', '', '', '', ''],
    touch: ['', '', '', ''],
    hear: ['', '', ''],
    smell: ['', ''],
    taste: ''
  });
  const [finalFeeling, setFinalFeeling] = useState('');
  const [exerciseHistory, setExerciseHistory] = useState<ExerciseEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleGroundingInput = (category: keyof GroundingAnswers, index: number, value: string) => {
    setGroundingAnswers(prev => {
      if (category === 'taste') {
        return { ...prev, taste: value };
      } else {
        const newArray = [...prev[category as keyof Omit<GroundingAnswers, 'taste'>]];
        newArray[index] = value;
        return { ...prev, [category]: newArray };
      }
    });
  };

  const resetGroundingExercise = () => {
    setGroundingAnswers({
      see: ['', '', '', '', ''],
      touch: ['', '', '', ''],
      hear: ['', '', ''],
      smell: ['', ''],
      taste: ''
    });
    setFinalFeeling('');
  };

  const submitGroundingExercise = () => {
    if (finalFeeling.trim()) {
      const newEntry: ExerciseEntry = {
        id: Date.now().toString(),
        timestamp: new Date(),
        feeling: finalFeeling.trim(),
        exerciseType: 'grounding'
      };
      
      setExerciseHistory(prev => [newEntry, ...prev]);
      setFinalFeeling('');
      resetGroundingExercise();
      
      // Show success message
      setShowSuccessMessage(true);
      setTimeout(() => setShowSuccessMessage(false), 3000);
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
            5-4-3-2-1 Grounding Exercise
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
            This grounding technique helps bring your attention to the present moment by engaging 
            your five senses. It's particularly helpful when you feel overwhelmed or anxious.
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
              href="/breathing"
              className="px-4 py-2 bg-gradient-to-r from-ai-purple to-ai-green text-white rounded-lg hover:shadow-lg transition-all duration-200"
            >
              Try Breathing Exercise
            </Link>
          </div>
        </motion.div>

        {/* Grounding Exercise Card */}
        <motion.div 
          className="card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="space-y-6">
            {/* 5 Things You Can See */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-8 h-8 bg-ai-purple text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">5</span>
                5 things you can see
              </h3>
              <div className="space-y-2">
                {groundingAnswers.see.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleGroundingInput('see', index, e.target.value)}
                    placeholder={`Thing ${index + 1} you can see...`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ai-purple focus:border-transparent transition-all duration-200"
                  />
                ))}
              </div>
            </div>

            {/* 4 Things You Can Touch */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-8 h-8 bg-ai-green text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                4 things you can touch
              </h3>
              <div className="space-y-2">
                {groundingAnswers.touch.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleGroundingInput('touch', index, e.target.value)}
                    placeholder={`Thing ${index + 1} you can touch...`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ai-green focus:border-transparent transition-all duration-200"
                  />
                ))}
              </div>
            </div>

            {/* 3 Things You Can Hear */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-8 h-8 bg-ai-orange text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                3 things you can hear
              </h3>
              <div className="space-y-2">
                {groundingAnswers.hear.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleGroundingInput('hear', index, e.target.value)}
                    placeholder={`Sound ${index + 1} you can hear...`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ai-orange focus:border-transparent transition-all duration-200"
                  />
                ))}
              </div>
            </div>

            {/* 2 Things You Can Smell */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-8 h-8 bg-ai-yellow text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                2 things you can smell
              </h3>
              <div className="space-y-2">
                {groundingAnswers.smell.map((item, index) => (
                  <input
                    key={index}
                    type="text"
                    value={item}
                    onChange={(e) => handleGroundingInput('smell', index, e.target.value)}
                    placeholder={`Smell ${index + 1}...`}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ai-yellow focus:border-transparent transition-all duration-200"
                  />
                ))}
              </div>
            </div>

            {/* 1 Thing You Can Taste */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <span className="w-8 h-8 bg-ai-red text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                1 thing you can taste
              </h3>
              <input
                type="text"
                value={groundingAnswers.taste}
                onChange={(e) => handleGroundingInput('taste', 0, e.target.value)}
                placeholder="Something you can taste..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ai-red focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Final Question */}
            <div className="pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                How do you feel after doing this exercise?
              </h3>
              <input
                type="text"
                value={finalFeeling}
                onChange={(e) => setFinalFeeling(e.target.value)}
                placeholder="Describe how you're feeling now..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ai-purple focus:border-transparent transition-all duration-200 mb-4"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-4 flex gap-3">
              <motion.button
                onClick={submitGroundingExercise}
                disabled={!finalFeeling.trim()}
                className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 flex-1 ${
                  finalFeeling.trim()
                    ? 'bg-gradient-to-r from-ai-purple to-ai-green text-white hover:shadow-lg'
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                }`}
                whileHover={finalFeeling.trim() ? { scale: 1.02 } : {}}
                whileTap={finalFeeling.trim() ? { scale: 0.98 } : {}}
              >
                Submit Exercise
              </motion.button>
              <motion.button
                onClick={resetGroundingExercise}
                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Reset
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Success Message */}
        <AnimatePresence>
          {showSuccessMessage && (
            <motion.div
              className="fixed top-4 right-4 z-50"
              initial={{ opacity: 0, y: -50, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -50, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="font-medium">Exercise completed successfully!</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Exercise History Section */}
        {exerciseHistory.length > 0 && (
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold text-gray-800">
                Exercise History
              </h2>
              <motion.button
                onClick={() => setShowHistory(!showHistory)}
                className="text-ai-purple hover:text-ai-green transition-colors duration-200 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {showHistory ? 'Hide History' : 'Show History'}
                <motion.svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  animate={{ rotate: showHistory ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </motion.svg>
              </motion.button>
            </div>

            <AnimatePresence>
              {showHistory && (
                <motion.div
                  className="card"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-4">
                    {exerciseHistory.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        className="flex items-start justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <span className="px-2 py-1 rounded-full text-xs font-medium bg-ai-green text-white">
                              Grounding
                            </span>
                            <span className="text-sm text-gray-500">
                              {entry.timestamp.toLocaleDateString()} at {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <p className="text-gray-700">
                            <span className="font-medium">How I felt:</span> {entry.feeling}
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Benefits Section */}
        <motion.div 
          className="mt-12 grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reduces Anxiety</h3>
            <p className="text-gray-600 text-sm">
              Helps ground you in the present moment, reducing overwhelming thoughts and feelings.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Improves Focus</h3>
            <p className="text-gray-600 text-sm">
              Engages your senses to bring attention back to the here and now.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Enhances Well-being</h3>
            <p className="text-gray-600 text-sm">
              Can be used anywhere, anytime when you need to feel more centered and calm.
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
            Tips for Effective Grounding Practice
          </h2>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-ai-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                1
              </div>
              <p className="text-gray-700">
                Take your time with each step - there's no rush
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-ai-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                2
              </div>
              <p className="text-gray-700">
                Be specific and descriptive in your answers
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-ai-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                3
              </div>
              <p className="text-gray-700">
                Use this exercise whenever you feel overwhelmed
              </p>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-ai-green text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 mt-1">
                4
              </div>
              <p className="text-gray-700">
                Practice regularly to build the habit of staying present
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
