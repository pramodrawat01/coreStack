import LegalLayout from "../../layouts/LegalLayout";

export default function Terms() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title="Terms of service."
      description="The terms that govern your access to and use of Corestack."
      updated="October 7, 2026"
    >
      <section id="overview" className="space-y-5">
        <h2>1. Agreement</h2>

        <p>
          By accessing or using Corestack, you agree to these Terms of Service.
          If you are using Corestack on behalf of an organization, you confirm
          that you have authority to accept these terms on its behalf.
        </p>
      </section>

      <section id="information" className="mt-16 space-y-5">
        <h2>2. Using Corestack</h2>

        <p>
          Corestack provides software for managing business operations,
          including inventory, orders, customers, suppliers, invoices,
          payments, analytics, and related workflows.
        </p>

        <p>
          You are responsible for maintaining the security of your account and
          for activity performed through your authorized credentials.
        </p>
      </section>

      <section id="usage" className="mt-16 space-y-5">
        <h2>3. Your data</h2>

        <p>
          You retain ownership of the business information and content that
          you submit to Corestack.
        </p>

        <p>
          You are responsible for ensuring that you have the necessary rights
          and permissions to provide that information to Corestack.
        </p>
      </section>

      <section className="mt-16 space-y-5">
        <h2>4. Acceptable use</h2>

        <p>
          You agree not to misuse Corestack, attempt to gain unauthorized
          access, interfere with the platform, or use the service for unlawful
          purposes.
        </p>
      </section>

      <section className="mt-16 space-y-5">
        <h2>5. Availability</h2>

        <p>
          We aim to provide a reliable service, but Corestack may occasionally
          be unavailable because of maintenance, updates, infrastructure
          failures, or circumstances outside our control.
        </p>
      </section>

      <section id="contact" className="mt-16 space-y-5">
        <h2>6. Contact</h2>

        <p>
          Questions regarding these Terms can be directed to the Corestack
          team.
        </p>
      </section>
    </LegalLayout>
  );
}