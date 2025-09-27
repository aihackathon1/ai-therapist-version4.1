'use client';

import { motion } from 'framer-motion';
import Navigation from '@/components/Navigation';
import Link from 'next/link';

export default function Exercise() {

  return (
    <main className="min-h-screen bg-gradient-soft">
      <Navigation />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Mental Health Exercises
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose from our collection of evidence-based exercises designed to help you manage stress, 
            anxiety, and improve your mental well-being.
          </p>
        </motion.div>

        {/* Exercises Grid */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Breathing Exercise Card */}
          <motion.div 
            className="card group hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -5 }}
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Mindful Breathing Exercise</h2>
              <p className="text-gray-600 mb-6">
                Follow the animated circle as it guides you through each breath. This exercise helps 
                reduce stress and anxiety by activating your parasympathetic nervous system.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Duration: 5-10 minutes
                </div>
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Best for: Anxiety, Stress, Sleep
                </div>
              </div>

              <Link 
                href="/breathing"
                className="inline-block w-full"
              >
                <motion.button
                  className="w-full px-8 py-4 bg-gradient-to-r from-ai-purple to-ai-green text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Breathing Exercise
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Grounding Exercise Card */}
          <motion.div 
            className="card group hover:shadow-2xl transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ y: -5 }}
          >
            <div className="text-center">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5-4-3-2-1 Grounding Exercise</h2>
              <p className="text-gray-600 mb-6">
                This grounding technique helps bring your attention to the present moment by engaging 
                your five senses. Perfect for when you feel overwhelmed or anxious.
              </p>
              
              <div className="space-y-3 mb-6">
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Duration: 5-15 minutes
                </div>
                <div className="flex items-center justify-center text-sm text-gray-500">
                  <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Best for: Panic, Overwhelm, Focus
                </div>
              </div>

              <Link 
                href="/grounding"
                className="inline-block w-full"
              >
                <motion.button
                  className="w-full px-8 py-4 bg-gradient-to-r from-ai-green to-ai-purple text-white rounded-xl font-semibold text-lg hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Grounding Exercise
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Benefits Section */}
        <motion.div 
          className="mt-12 grid md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Reduces Anxiety</h3>
            <p className="text-gray-600 text-sm">
              Both exercises activate your parasympathetic nervous system, promoting calm and relaxation.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Improves Focus</h3>
            <p className="text-gray-600 text-sm">
              These exercises help anchor your attention to the present moment, improving concentration.
            </p>
          </div>
          
          <div className="text-center p-6 bg-white rounded-xl shadow-lg">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Enhances Well-being</h3>
            <p className="text-gray-600 text-sm">
              Regular practice can improve mood, reduce stress, and enhance emotional well-being.
            </p>
          </div>
        </motion.div>

        {/* How to Use Section */}
        <motion.div 
          className="mt-12 card"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
            How to Get Started
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-ai-purple text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">1</span>
                Choose Your Exercise
              </h3>
              <p className="text-gray-700 text-sm">
                Select either the breathing or grounding exercise based on what you need right now. 
                Both are effective for different situations.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-ai-green text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">2</span>
                Find a Quiet Space
              </h3>
              <p className="text-gray-700 text-sm">
                Choose a comfortable, quiet place where you won't be interrupted. 
                This helps you focus and get the most benefit from the exercise.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-ai-orange text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">3</span>
                Follow the Instructions
              </h3>
              <p className="text-gray-700 text-sm">
                Each exercise provides clear, step-by-step guidance. Take your time 
                and don't rush through the process.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <span className="w-8 h-8 bg-ai-yellow text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">4</span>
                Practice Regularly
              </h3>
              <p className="text-gray-700 text-sm">
                Like any skill, these exercises become more effective with regular practice. 
                Even 5-10 minutes daily can make a difference.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
