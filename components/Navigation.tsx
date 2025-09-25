'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { createSupabaseClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)
  const supabase = createSupabaseClient()
  const router = useRouter()

  useEffect(() => {
    let mounted = true
    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setIsAuthed(!!data.session)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthed(!!session)
    })
    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [])

  async function handleSignOut() {
    await supabase.auth.signOut()
    setIsAuthed(false)
    router.replace('/')
  }

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-xl md:text-2xl font-semibold gradient-text">AI Therapist</h1>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex justify-center">
            <div className="flex items-center gap-8">
              <Link href="/" className="text-secondary hover:text-text-dark px-3 py-2 text-sm font-medium transition-colors">
                Home
              </Link>
              <Link href="/about" className="text-secondary hover:text-text-dark px-3 py-2 text-sm font-medium transition-colors">
                About Us
              </Link>
              <Link href="/exercise" className="text-secondary hover:text-text-dark px-3 py-2 text-sm font-medium transition-colors">
                Exercise
              </Link>
              <Link href="/#community" className="text-secondary hover:text-text-dark px-3 py-2 text-sm font-medium transition-colors">
                Community
              </Link>
              <Link href="/mood-tracking" className="text-secondary hover:text-text-dark px-3 py-2 text-sm font-medium transition-colors">
                Mood Tracking
              </Link>
            </div>
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center justify-end gap-4">
            <motion.div 
              className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-border"
              whileHover={{ scale: 1.1, rotate: 5 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-text-dark text-sm font-medium">U</span>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard" className="btn-primary">
                Dashboard
              </Link>
            </motion.div>
            {isAuthed ? (
              <motion.button 
                onClick={handleSignOut}
                className="btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Log out
              </motion.button>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/signup" className="btn-secondary">
                  Sign Up
                </Link>
              </motion.div>
            )}
          </div>

          {/* Mobile menu button and Dashboard */}
          <div className="md:hidden flex items-center justify-end gap-3">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/dashboard" className="btn-primary text-sm">
                Dashboard
              </Link>
            </motion.div>
            <motion.button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-secondary hover:text-text-dark focus:outline-none focus:text-text-dark"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <motion.svg 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                animate={{ rotate: isMenuOpen ? 90 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </motion.svg>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              <motion.div 
                className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border border-border rounded-lg mt-2 shadow-sm"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2, delay: 0.1 }}
              >
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <Link href="/" className="text-secondary hover:text-text-dark block px-3 py-2 text-base font-medium">
                    Home
                  </Link>
                  <Link href="/about" className="text-secondary hover:text-text-dark block px-3 py-2 text-base font-medium">
                    About Us
                  </Link>
                  <Link href="/exercise" className="text-secondary hover:text-text-dark block px-3 py-2 text-base font-medium">
                    Exercise
                  </Link>
                  <Link href="/#community" className="text-secondary hover:text-text-dark block px-3 py-2 text-base font-medium">
                    Community
                  </Link>
                  <Link href="/mood-tracking" className="text-secondary hover:text-text-dark block px-3 py-2 text-base font-medium">
                    Mood Tracking
                  </Link>
                </motion.div>
                <motion.div 
                  className="pt-4 pb-3 border-t border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="flex items-center px-3 space-x-3">
                    <motion.div 
                      className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center border border-border"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                    >
                      <span className="text-text-dark text-sm font-medium">U</span>
                    </motion.div>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link href="/dashboard" className="btn-primary text-sm">
                        Dashboard
                      </Link>
                    </motion.div>
                    {isAuthed ? (
                      <motion.button 
                        onClick={handleSignOut}
                        className="btn-secondary text-sm"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Log out
                      </motion.button>
                    ) : (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Link href="/signup" className="btn-secondary text-sm">
                          Sign Up
                        </Link>
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </nav>
  )
}
