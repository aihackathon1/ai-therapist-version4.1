'use client';

import { motion } from 'framer-motion';

export default function DetailedFeatures() {
  const steps = [
    {
      title: "Start a Conversation",
      description: "Simply type your thoughts or concerns in a natural, conversational way"
    },
    {
      title: "AI Analyzes & Responds",
      description: "Our AI uses evidence-based therapeutic techniques to provide thoughtful, personalized responses"
    },
    {
      title: "Track Your Progress",
      description: "Monitor your mental wellness journey with insights and patterns over time"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-dark">How It Works</h2>
          <p className="text-lg text-secondary mt-2">Get support in three simple steps</p>
        </div>

        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          {steps.map((step, index) => (
            <motion.div key={index} className="bg-white border border-border rounded-lg shadow-soft p-6" variants={itemVariants}>
              <div className="mb-4">
                <span className="text-sm font-semibold text-[color:var(--color-accent)]">Step {index + 1}</span>
              </div>
              <h3 className="text-xl font-semibold text-text-dark mb-2">{step.title}</h3>
              <p className="text-secondary">{step.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* optional connecting arrows for md+ screens */}
        <div className="hidden md:grid grid-cols-3 gap-8 mt-4">
          <div className="relative" />
          <div className="relative">
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px bg-border" />
          </div>
          <div className="relative" />
        </div>
      </div>
    </section>
  )
}
