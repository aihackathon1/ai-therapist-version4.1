'use client';

import { motion } from 'framer-motion';

export default function DetailedFeatures() {
  const steps = [
    {
      title: "Start a Conversation",
      description: "Simply type your thoughts or concerns in a natural, conversational way",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 8h10M7 12h6M20 12c0 4.418-4.03 8-9 8-1.02 0-2.003-.14-2.92-.4L4 20l.84-3.02A7.49 7.49 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      title: "AI Analyzes & Responds",
      description: "Our AI uses evidence-based therapeutic techniques to provide thoughtful, personalized responses",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M9.5 3.5a5 5 0 0 1 5 0l3.58 2.07a5 5 0 0 1 2.5 4.33v4.2a5 5 0 0 1-2.5 4.33L14.5 20.5a5 5 0 0 1-5 0L5.92 18.43A5 5 0 0 1 3.42 14.1v-4.2a5 5 0 0 1 2.5-4.33L9.5 3.5z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-3-3v6" />
        </svg>
      )
    },
    {
      title: "Track Your Progress",
      description: "Monitor your mental wellness journey with insights and patterns over time",
      icon: (
        <svg viewBox="0 0 24 24" className="w-7 h-7" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 19h16M6 16v-4m6 4V8m6 8v-7" />
        </svg>
      )
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
              <div className="flex items-center gap-3 mb-4">
                <div className="h-10 w-10 rounded-md bg-[color:var(--color-accent)]/10 text-[color:var(--color-accent)] flex items-center justify-center">
                  {step.icon}
                </div>
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
