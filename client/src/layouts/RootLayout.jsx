// src/layouts/RootLayout.jsx
import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-ink text-white flex flex-col">
      <Navbar />
      {/* flex-grow ensures the footer stays at the bottom even on short pages */}
      <main className="flex-grow">
        <Outlet /> 
      </main>
      <Footer />
    </div>
  )
}