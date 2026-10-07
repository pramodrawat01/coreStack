import LegalLayout from "../../layouts/LegalLayout";

export default function Privacy() {
  return (
    <LegalLayout
      eyebrow="Privacy"
      title="Privacy policy."
      description="How Corestack collects, uses, protects, and handles information when you use our platform."
      updated="October 7, 2026"
    >
      <section id="overview" className="space-y-5">
        <h2>1. Overview</h2>

        <p>
          Corestack respects your privacy and is committed to protecting the
          information you provide when using our products and services.
        </p>

        <p>
          This Privacy Policy explains what information we may collect, why we
          collect it, how we use it, and the choices available to you.
        </p>
      </section>

      <section id="information" className="mt-16 space-y-5">
        <h2>2. Information we collect</h2>

        <p>
          We may collect information that you provide directly when creating an
          account, configuring your organization, communicating with us, or
          using Corestack.
        </p>

        <ul>
          <li>Account and profile information</li>
          <li>Organization and business information</li>
          <li>Product and operational data</li>
          <li>Billing and transaction information</li>
          <li>Support and communication information</li>
          <li>Technical and usage information</li>
        </ul>
      </section>

      <section id="usage" className="mt-16 space-y-5">
        <h2>3. How we use information</h2>

        <p>
          Information may be used to provide and operate Corestack, improve
          our products, maintain security, provide support, process payments,
          and communicate important product updates.
        </p>

        <p>
          We do not use your business data simply because we have access to it.
          Access and processing are based on providing and improving the
          services you request.
        </p>
      </section>

      <section className="mt-16 space-y-5">
        <h2>4. Data security</h2>

        <p>
          We use reasonable technical and organizational safeguards designed to
          protect information against unauthorized access, alteration,
          disclosure, or destruction.
        </p>
      </section>

      <section className="mt-16 space-y-5">
        <h2>5. Your choices</h2>

        <p>
          Depending on your location and applicable law, you may have rights
          relating to accessing, correcting, exporting, or deleting certain
          personal information.
        </p>
      </section>

      <section id="contact" className="mt-16 space-y-5">
        <h2>6. Contact</h2>

        <p>
          If you have questions about this Privacy Policy or how Corestack
          handles information, contact our team through the Contact Sales page.
        </p>
      </section>
    </LegalLayout>
  );
}