'use client';

import { motion } from 'framer-motion';

export default function Features() {
  const features = [
    {
      title: "Compassionate AI Support",
      description: "A supportive AI to listen and guide you anytime.",
      color: "bg-gradient-accent",
      icon: null
    },
    {
      title: "Join Our Community",
      description: "Connect with others, share, and grow together.",
      color: "bg-gradient-accent",
      icon: null
    },
    {
      title: "24/7 Available",
      description: "Get guidance whenever you need it, without waiting.",
      color: "bg-gradient-accent",
      icon: null
    }
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6
      }
    }
  };

  return (
    <section id="features" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {features.map((feature, index) => (
            <motion.div 
              key={index} 
              className="card group shadow-sm"
              variants={cardVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
                transition: { duration: 0.15 }
              }}
              whileTap={{ scale: 0.98 }}
            >
              <h3 className="text-2xl font-bold text-text-dark mb-4">
                {feature.title}
              </h3>
              <p className="text-secondary leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
