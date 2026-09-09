import Navbar from '../components/Navbar.jsx'
import Footer from '../components/Footer.jsx'
import Hero from '../sections/Hero.jsx'
import TrustedBy from '../sections/TrustedBy.jsx'
import ProblemValue from '../sections/ProblemValue.jsx'
import Features from '../sections/Features.jsx'
import ProductShowcaseSection from '../sections/ProductShowcaseSection.jsx'
import EnterpriseSection from '../sections/EnterpriseSection.jsx'
import CTA from '../sections/CTA.jsx'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-ink text-white">
      <Navbar />
      <main>
        <Hero />
        <TrustedBy />
        <ProblemValue />
        <Features />
        <ProductShowcaseSection />
        <EnterpriseSection />
        <CTA />
      </main>
      <Footer />
    </div>
  )
}
