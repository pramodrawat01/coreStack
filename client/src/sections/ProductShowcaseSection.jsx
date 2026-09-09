import SectionHeading from '../components/landingPage/SectionHeading.jsx'
import ProductShowcase from '../components/landingPage/ProductShowcase.jsx'

export default function ProductShowcaseSection() {
  return (
    <section id="product" className="relative border-t border-line bg-surface/40">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <SectionHeading
          title="One workspace. Every screen you need."
          description="Dashboard, inventory, orders, invoices and reports share the same navigation, tables and typography — so your team never has to relearn the tool."
          align="center"
          size="lg"
          className="mb-14"
        />
        <ProductShowcase />
      </div>
    </section>
  )
}
