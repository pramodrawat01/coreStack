import { motion } from 'framer-motion' 
import Button from "../landingPage/Button";
import { Link } from 'react-router-dom';

export default function PricingCTA() {
  return (
    <section className="relative overflow-hidden">

      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[700px] -translate-x-1/2 rounded-full bg-blue-500/[0.08] blur-[120px]" />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
        className="relative mx-auto max-w-5xl px-6 py-28 text-center lg:py-36"
      >
        <p className="text-xs font-medium uppercase tracking-[0.28em] text-blue-500">
          GET STARTED
        </p>

        <h2 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold leading-tight tracking-[-0.04em] sm:text-5xl lg:text-6xl">
          Run your operations
          <br />
          with confidence.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-slate-500 sm:text-lg">
          Bring inventory, orders, customers, payments and analytics together
          in one operational platform.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Link to="/auth?mode=signup">
          <Button variant="primary">
            Get started
          </Button>
          </Link>

          <Button variant="secondary">
            Talk to sales
          </Button>
        </div>
      </motion.div>
    </section>
  );
}