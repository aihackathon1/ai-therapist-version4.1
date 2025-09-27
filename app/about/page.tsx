'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Navigation from '@/components/Navigation'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-soft relative overflow-hidden">
      {/* Background Geometry */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large animated circles */}
        <motion.div 
          className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-ai-purple/10 to-ai-green/10 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.1, 0.15, 0.1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        
        <motion.div 
          className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-ai-orange/10 to-ai-red/10 rounded-full blur-lg"
          animate={{ 
            scale: [1, 0.9, 1],
            opacity: [0.1, 0.2, 0.1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
        
        <motion.div 
          className="absolute bottom-40 left-1/4 w-40 h-40 bg-gradient-to-br from-ai-green/10 to-emerald-500/10 rounded-full blur-2xl"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.1, 0.18, 0.1]
          }}
          transition={{ 
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
        ></motion.div>
        
        {/* Animated geometric shapes */}
        <motion.div 
          className="absolute top-60 right-1/3 w-16 h-16 bg-gradient-to-br from-ai-purple/20 to-ai-green/20 rotate-45 blur-sm"
          animate={{ 
            rotate: [45, 405, 45],
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            duration: 12,
            repeat: Infinity,
            ease: "linear"
          }}
        ></motion.div>
        
        <motion.div 
          className="absolute bottom-60 right-10 w-20 h-20 bg-gradient-to-br from-ai-orange/15 to-ai-red/15 rotate-12 blur-sm"
          animate={{ 
            rotate: [12, 372, 12],
            scale: [1, 0.9, 1]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "linear",
            delay: 1
          }}
        ></motion.div>
        
        <motion.div 
          className="absolute top-1/3 left-1/2 w-12 h-12 bg-gradient-to-br from-ai-green/20 to-emerald-500/20 rotate-45 blur-sm"
          animate={{ 
            rotate: [45, 405, 45],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "linear",
            delay: 3
          }}
        ></motion.div>
        
        {/* Floating dots */}
        <motion.div 
          className="absolute top-1/4 left-1/3 w-3 h-3 bg-ai-purple/30 rounded-full"
          animate={{ 
            y: [-10, 10, -10],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        ></motion.div>
        
        <motion.div 
          className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-ai-green/40 rounded-full"
          animate={{ 
            y: [10, -10, 10],
            opacity: [0.4, 0.7, 0.4]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        ></motion.div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="w-full h-full" style={{
            backgroundImage: `
              linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px),
              linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)
            `,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>
      
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-20 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold gradient-text mb-6">
              About AI Therapist
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Supporting student mental health with the power of AI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="card"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8 text-center">
              Our Mission
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed text-center">
              At AI Therapist, our mission is to make mental health support more accessible, personalized, and stigma-free — with a special focus on students. 
              We believe that every student deserves a safe space to talk about their feelings, track their progress, and learn coping strategies. 
              By combining the power of AI with proven wellness practices, we aim to help students manage stress, improve resilience, and build healthier minds for a brighter future.
            </p>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover how our AI-powered platform helps you on your mental wellness journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* AI Conversations Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="card text-center group cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                AI Conversations
              </h3>
              <p className="text-gray-600">
                Talk to our AI therapist anytime, anywhere. Get personalized support and guidance whenever you need it.
              </p>
            </motion.div>

            {/* Mood Tracking Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="card text-center group cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Mood Tracking
              </h3>
              <p className="text-gray-600">
                Record daily feelings and track your progress in a personalized dashboard. Understand your patterns and celebrate your growth.
              </p>
            </motion.div>

            {/* Mindful Exercises Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="card text-center group cursor-pointer"
            >
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                Mindful Exercises
              </h3>
              <p className="text-gray-600">
                Relax with guided breathing and wellness activities. Build healthy habits and find your inner peace.
              </p>
            </motion.div>
          </div>
        </div>
      </section>


      {/* Call To Action Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of students who are already using AI Therapist to improve their mental wellness.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Link href="/" className="btn-primary text-lg px-12 py-4 inline-block">
                Get Started
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
