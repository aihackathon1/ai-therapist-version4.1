/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        // Minimal palette
        'text-dark': '#1a1a1a',
        'secondary': '#6b7280',
        'accent': '#4f46e5',
        'background': '#fafafa',
        'border': '#e5e7eb',
        'ai-purple': '#8B5CF6',
        'ai-green': '#10B981',
        'ai-orange': '#F97316',
        'ai-red': '#EF4444',
        'ai-yellow': '#F59E0B',
      },
      backgroundImage: {
        // Gradients removed for minimal theme (kept names for backward compat but set to none)
        'gradient-soft': 'none',
        'gradient-cta': 'none',
        'gradient-accent': 'none',
      },
      boxShadow: {
        'soft': '0 1px 2px rgba(0,0,0,0.06)',
        'soft-lg': '0 4px 12px rgba(0,0,0,0.08)'
      },
      borderRadius: {
        'xl2': '1.25rem'
      },
    },
  },
  plugins: [],
}
