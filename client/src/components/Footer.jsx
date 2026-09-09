import { FaTwitter, FaLinkedin, FaGithub, FaCubes } from 'react-icons/fa'

const COLUMNS = [
  {
    title: 'Product',
    links: ['Inventory', 'Sales & Orders', 'Purchasing', 'Invoicing', 'Analytics', 'Integrations'],
  },
  {
    title: 'Solutions',
    links: ['Retail', 'Wholesale distribution', 'Manufacturing', 'Warehousing'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'Guides', 'API reference', 'Changelog'],
  },
  {
    title: 'Company',
    links: ['About', 'Customers', 'Careers', 'Contact sales'],
  },
  {
    title: 'Legal',
    links: ['Privacy policy', 'Terms of service', 'Security'],
  },
]

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8">
          <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex flex-col gap-4">
            <a href="#top" className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-white text-ink">
                <FaCubes size={13} />
              </span>
              <span className="font-semibold tracking-tight text-[15px]">Corestack</span>
            </a>
            <p className="text-sm text-faint max-w-[200px]">Run your entire business from one place.</p>
            <div className="flex items-center gap-3 text-faint">
              <a href="#" aria-label="Twitter" className="hover:text-white transition-colors">
                <FaTwitter size={14} />
              </a>
              <a href="#" aria-label="LinkedIn" className="hover:text-white transition-colors">
                <FaLinkedin size={14} />
              </a>
              <a href="#" aria-label="GitHub" className="hover:text-white transition-colors">
                <FaGithub size={14} />
              </a>
            </div>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-3">
              <p className="font-mono text-xs uppercase tracking-wider text-faint">{col.title}</p>
              <ul className="flex flex-col gap-2.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-sm text-muted hover:text-white transition-colors">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-14 pt-6 border-t border-line">
          <p className="text-xs text-faint">© {new Date().getFullYear()} Corestack, Inc.</p>
          <p className="text-xs text-faint">All systems operational</p>
        </div>
      </div>
    </footer>
  )
}
