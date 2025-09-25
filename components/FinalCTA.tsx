'use client';

import { motion } from 'framer-motion';

export default function FinalCTA() {
  const fadeInUp = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8 }
  };

  const fadeInUpDelay = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.2 }
  };

  const fadeInUpDelayMore = {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.8, delay: 0.4 }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-text-dark mb-6 leading-tight"
            {...fadeInUp}
          >
            Try the Demo
          </motion.h2>
          
          <motion.p 
            className="text-xl text-secondary mb-10 leading-relaxed"
            {...fadeInUpDelay}
          >
            Prototype demonstration of AI‑powered therapeutic conversations. Built for evaluation in a competition setting.
          </motion.p>
          
          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            {...fadeInUpDelayMore}
          >
            <motion.button 
              className="btn-primary text-lg px-10 py-4"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 25px rgba(139, 92, 246, 0.25)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Experience AI Therapy
            </motion.button>
            <motion.button 
              className="btn-secondary text-lg px-10 py-4"
              whileHover={{ 
                scale: 1.05, 
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.08)"
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              Learn More
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
