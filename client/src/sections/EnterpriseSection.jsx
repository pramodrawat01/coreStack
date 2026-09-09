import { FaUserShield, FaLock, FaClipboardList, FaBuilding, FaServer } from 'react-icons/fa'
import SectionHeading from '../components/landingPage/SectionHeading.jsx'

const POINTS = [
  {
    icon: FaUserShield,
    title: 'Role-based access',
    description: 'Give employees exactly the access their role needs — nothing more.',
  },
  {
    icon: FaLock,
    title: 'Secure authentication',
    description: 'Sign-in protected with modern authentication and session controls.',
  },
  {
    icon: FaClipboardList,
    title: 'Audit logs',
    description: 'See who changed what, and when, across every part of the system.',
  },
  {
    icon: FaBuilding,
    title: 'Organization isolation',
    description: 'Your data is scoped to your organization and never shared across accounts.',
  },
  {
    icon: FaServer,
    title: 'Reliable infrastructure',
    description: 'Built on infrastructure designed for consistent uptime as you grow.',
  },
]

export default function EnterpriseSection() {
  return (
    <section id="enterprise" className="relative border-t border-line">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionHeading
          eyebrow="Security"
          title="Built for the way your business works."
          description="Corestack is designed so operations, finance and warehouse teams can share one system without stepping on each other."
          className="mb-12"
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {POINTS.map((point) => (
            <div key={point.title} className="rounded-xl border border-line bg-surface p-5 flex flex-col gap-3">
              <point.icon size={16} className="text-accent" />
              <p className="text-sm font-medium">{point.title}</p>
              <p className="text-xs text-muted leading-relaxed">{point.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
