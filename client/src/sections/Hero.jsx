import { motion } from 'framer-motion'
import Button from '../components/landingPage/Button.jsx'
import DashboardPreview from '../components/landingPage/DashboardPreview.jsx'
import heroImage from '../assets/heroBg.png'

export default function Hero() {
  return (
    <section id="top" className="relative pb-6 min-h-screen w-full overflow-hidden bg-black text-white flex flex-col justify-between">
      
      {/* 1. Full-bleed background image using bg-cover */}
      <div 
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat pointer-events-none opacity-80 z-0"
        style={{ backgroundImage: `url(${heroImage})` }}
      />

      {/* 2. Soft radial gradient overlay to merge edges seamlessly into pitch black */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,#000000_100%)] pointer-events-none z-0" />

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl  mx-auto px-5 sm:px-8 pt-24 sm:pt-32 pb-12 flex-1 flex flex-col justify-center items-center">
        <div className="flex flex-col items-center text-center gap-6 max-w-4xl mx-auto ">
          
          <motion.a
            href="#features"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 rounded-md border border-white/10 bg-white/[0.1] px-5 py-1.5 text-md text-neutral-300 hover:text-white hover:bg-white/[0.08] transition-colors"
          >
            <span
    className="
      
      h-2.5 w-2.5
      rounded-full
      bg-blue-500
      shadow-[0_0_8px_2px_rgba(59,130,246,0.8)]
    "
  />
            See what's new this quarter
          </motion.a>

          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-4xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05] text-balance"
          >
Run your <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-blue-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]">entire business</span> from one place.          </motion.h1>
    
          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-base sm:text-lg text-neutral-400 max-w-xl leading-relaxed"
          >
            Manage inventory, orders, customers, purchases, invoices and payments with one powerful business operations platform.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="flex flex-col sm:flex-row items-center gap-3 mt-2"
          >
            <Button variant="primary" href="#get-started" as="a">
              Get Started
            </Button>
            <Button variant="secondary" href="#demo" as="a">
              Book a Demo
            </Button>
          </motion.div>
        </div>
      </div>

      {/* 3. Dashboard Preview Anchored to Bottom */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="relative z-10 max-w-6xl mx-auto px-5 sm:px-8 w-full"
      >
        <DashboardPreview />
      </motion.div>
    </section>
  )
}