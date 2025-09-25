'use client';

import { motion } from 'framer-motion';

export default function Community() {
	const metrics = [
		{ value: '< 2s', label: 'Response Time', detail: 'End-to-end under load' },
		{ value: '92%', label: 'Intent Recognition', detail: 'Validation split' },
		{ value: 'OpenAI', label: 'Technology', detail: 'TypeScript, Tailwind' },
		{ value: 'Live', label: 'Demo Status', detail: 'Ready for evaluation' }
	];

	const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
	const cardVariants = { hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } };

	return (
		<section id="community" className="py-20 bg-white">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
				<motion.div className="text-center mb-12" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
					<h2 className="text-4xl font-bold text-text-dark">Key Metrics</h2>
					<p className="text-lg text-secondary mt-2">Simple indicators that matter for this demo.</p>
				</motion.div>

				<motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }}>
					{metrics.map((m, i) => (
						<motion.div key={i} className="bg-white border border-border rounded-lg p-8 text-center shadow-soft" variants={cardVariants}>
							<div className="text-3xl font-bold text-[color:var(--color-accent)]">{m.value}</div>
							<div className="mt-2 text-text-dark font-semibold">{m.label}</div>
							<div className="text-sm text-secondary mt-1">{m.detail}</div>
						</motion.div>
					))}
				</motion.div>
			</div>
		</section>
	)
}
