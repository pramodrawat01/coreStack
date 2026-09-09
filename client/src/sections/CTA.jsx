import Button from '../components/landingPage/Button.jsx'

export default function CTA() {
  return (
    <section id="get-started" className="relative border-t border-line overflow-hidden">
      <div className="absolute inset-0 bg-grid bg-grid opacity-30 pointer-events-none" />
      <div className="relative max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center flex flex-col items-center gap-5">
        <h2 className="text-3xl sm:text-5xl font-semibold tracking-tight leading-[1.08] text-balance">
          Ready to simplify your business operations?
        </h2>
        <p className="text-base sm:text-lg text-muted max-w-xl leading-relaxed">
          Bring your teams, operations and business data together in one powerful workspace.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-3 mt-2">
          <Button variant="primary" href="#" as="a">
            Get Started
          </Button>
          <Button variant="secondary" href="#demo" as="a">
            Book a Demo
          </Button>
        </div>
      </div>
    </section>
  )
}
