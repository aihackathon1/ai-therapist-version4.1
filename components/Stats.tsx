export default function Stats() {
  const specs = [
    { value: "< 2 sec", label: "Response Time" },
    { value: "Next.js", label: "Built With" },
    { value: "OpenAI", label: "AI Powered" }
  ]

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-text-dark">Project Capabilities</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {specs.map((s, i) => (
            <div key={i} className="bg-white border border-border rounded-lg p-8 text-center shadow-soft">
              <div className="text-4xl md:text-5xl font-extrabold text-accent">{s.value}</div>
              <div className="mt-2 text-sm md:text-base text-secondary">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
