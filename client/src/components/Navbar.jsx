import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaBars, FaTimes, FaCubes } from 'react-icons/fa'
import Button from './landingPage/Button.jsx'
import { Link } from 'react-router-dom'

const NAV_LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Solutions', href: '#solutions' },
  { label: 'Features', href: '#features' },
  { label: 'Resources', href: '#resources' },
  { label: 'Pricing', href: '#pricing' },
  {label : 'Customers', href : '#customers'},
  {label : 'Contact sales',href : '#contactSales'}
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`sticky top-0 z-50 transition-colors duration-300 ${
        scrolled ? 'bg-ink/85 backdrop-blur-md border-b border-line' : 'bg-[#000000] border-b border-transparent'
      }`}
    >
      <nav className="max-w-9xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between">

        <div className='flex gap-4'>

        <a href="#top" className="flex items-center gap-2 shrink-0">
          <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-ink">
            <FaCubes size={13} />
          </span>
          <span className="font-semibold tracking-tight text-[15px]">Corestack</span>
        </a>
        <div className="hidden lg:flex items-center gap-1 rounded-md border border-line bg-white/[0.03] px-1.5 py-1.5">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="px-3.5 py-1.5 rounded-md text-sm text-muted hover:text-white hover:bg-white/[0.06] transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link to='/auth' className="text-sm text-muted hover:text-white transition-colors px-2">
            Log in
          </Link>
          <Button variant="primary" href="#get-started" as="a">
            Get Started
          </Button>
        </div>

        <button
          className="lg:hidden p-2 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
        >
          {open ? <FaTimes size={18} /> : <FaBars size={18} />}
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden overflow-hidden border-b border-line bg-ink"
          >
            <div className="flex flex-col px-5 py-4 gap-1">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-[15px] text-muted hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex flex-col gap-2 pt-3 mt-2 border-t border-line">
                <Button variant="secondary" href="#login" as="a">
                  Log in
                </Button>
                <Button variant="primary" href="#get-started" as="a">
                  Get Started
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
