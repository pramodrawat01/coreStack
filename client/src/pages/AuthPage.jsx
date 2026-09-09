import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import BrandingPanel from '../components/auth/BrandingPanel.jsx'
import AuthForm from '../components/auth/AuthForm.jsx'
import { useAuth } from '../hooks/useAuth.js'
import { useNavigate } from 'react-router-dom'


export default function AuthPage() {

  const [mode, setMode] = useState('login')
   const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (user) navigate('/dashboard', { replace: true })
  }, [user, navigate])

  return (
    <div className="relative min-h-screen bg-ink overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />
      <div className="relative min-h-screen flex flex-col lg:flex-row items-center justify-center gap-10 px-6 py-16">
        {/* <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          style={{ order: mode === 'login' ? 0 : 1 }}
          className="flex-1 flex justify-center lg:justify-end"
        >
        </motion.div> */}
          <BrandingPanel />
        {/* <motion.div
          layout
          transition={{ type: 'spring', stiffness: 300, damping: 32 }}
          style={{ order: mode === 'login' ? 1 : 0 }}
          className="flex-1 flex justify-center lg:justify-start"
        >
        </motion.div> */}
          <AuthForm mode={mode} setMode={setMode} />
      </div>
    </div>
  )
}



// import BrandingPanel from '../components/auth/BrandingPanel.jsx'
// import AuthForm from '../components/auth/AuthForm.jsx'

// export default function AuthPage() {
//   return (
//     <div className="relative h-screen bg-ink overflow-hidden">
//       {/* Background grid */}
//       <div className="absolute inset-0 bg-grid opacity-40 pointer-events-none" />

//       {/* Main layout */}
//       <div className="relative h-full flex items-center justify-center gap-10 px-6">

//         {/* LEFT — fixed/centered branding */}
//         <div className="hidden lg:flex w-1/2 h-full items-center justify-end">
//           <BrandingPanel />
//         </div>

//         {/* RIGHT — only this side can scroll */}
//         <div className="w-full lg:w-1/2 h-full flex items-center justify-start">
//           <div className="w-full max-w-md max-h-[calc(100vh-64px)] overflow-y-auto">
//             <AuthForm />
//           </div>
//         </div>

//       </div>
//     </div>
//   )
// }