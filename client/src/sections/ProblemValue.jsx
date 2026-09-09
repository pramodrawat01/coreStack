import { FaFileExcel, FaWhatsapp, FaTable, FaLayerGroup } from 'react-icons/fa'
import SectionHeading from '../components/landingPage/SectionHeading.jsx'

const SCATTERED_TOOLS = [
  { icon: FaFileExcel, label: 'Spreadsheets' },
  { icon: FaWhatsapp, label: 'WhatsApp threads' },
  { icon: FaTable, label: 'Disconnected sheets' },
  { icon: FaLayerGroup, label: 'Point tools' },
]

export default function ProblemValue() {
  return (
    <section id="solutions" className="relative">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <SectionHeading
            title="Everything your business needs. In one workspace."
            description="When inventory lives in a spreadsheet, orders live in a chat thread, and invoices live somewhere else entirely, small businesses lose hours reconciling instead of operating. Corestack brings the whole operation into a single system of record."
            size="lg"
          />

          <div className="relative rounded-xl border border-line bg-surface p-6 sm:p-8">
            <p className="text-xs text-faint mb-5">Before Corestack</p>
            <div className="grid grid-cols-2 gap-3">
              {SCATTERED_TOOLS.map((tool) => (
                <div
                  key={tool.label}
                  className="flex items-center gap-2.5 rounded-lg border border-line bg-panel px-3.5 py-3 text-sm text-muted"
                >
                  <tool.icon size={14} className="text-faint shrink-0" />
                  <span className="truncate">{tool.label}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 my-5">
              <div className="h-px flex-1 bg-line" />
              <span className="text-xs text-faint">becomes</span>
              <div className="h-px flex-1 bg-line" />
            </div>
            <div className="flex items-center gap-2.5 rounded-lg border border-accent/30 bg-accent/[0.06] px-3.5 py-3 text-sm">
              <FaLayerGroup size={14} className="text-accent shrink-0" />
              <span>One connected workspace</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
