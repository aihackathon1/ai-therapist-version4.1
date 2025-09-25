import Navigation from '@/components/Navigation'
import Hero from '@/components/Hero'
import Features from '@/components/Features'
import Trusted from '@/components/Trusted'
import DetailedFeatures from '@/components/DetailedFeatures'
import Community from '@/components/Community'
import Stats from '@/components/Stats'
import FinalCTA from '@/components/FinalCTA'
import Footer from '@/components/Footer'
 

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navigation />
      <Hero />
      <Features />
      <Trusted />
      <DetailedFeatures />
      <Community />
      <Stats />
      <FinalCTA />
      <Footer />
    </main>
  )
}
