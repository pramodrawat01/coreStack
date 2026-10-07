import LegalLayout from "../../layouts/LegalLayout";

export default function Cookies() {
  return (
    <LegalLayout
      eyebrow="Cookies"
      title="Cookie settings."
      description="Information about how Corestack uses cookies and similar technologies."
      updated="October 7, 2026"
    >
      <section id="overview" className="space-y-5">
        <h2>1. What are cookies?</h2>

        <p>
          Cookies are small pieces of information stored by your browser when
          you visit a website. They can help websites remember preferences,
          maintain sessions, and understand how services are used.
        </p>
      </section>

      <section id="information" className="mt-16 space-y-5">
        <h2>2. How Corestack uses cookies</h2>

        <p>
          Corestack may use cookies and similar technologies to support
          essential functionality, remember preferences, maintain secure
          sessions, and understand how visitors interact with our website.
        </p>
      </section>

      <section id="usage" className="mt-16 space-y-5">
        <h2>3. Cookie categories</h2>

        <div className="space-y-4">
          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
            <h3 className="font-medium text-white">
              Essential cookies
            </h3>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Required for core functionality such as authentication,
              security, and basic site operation.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
            <h3 className="font-medium text-white">
              Preference cookies
            </h3>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              Help remember settings and preferences so your experience can be
              more consistent.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/[0.025] p-5">
            <h3 className="font-medium text-white">
              Analytics cookies
            </h3>

            <p className="mt-2 text-sm leading-6 text-neutral-500">
              May help us understand how visitors use the website and improve
              the experience.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16 space-y-5">
        <h2>4. Managing cookies</h2>

        <p>
          You can control cookies through your browser settings. Depending on
          the technologies used by the website, additional cookie preferences
          may also be available through Corestack's cookie settings interface.
        </p>
      </section>

      <section id="contact" className="mt-16 space-y-5">
        <h2>5. Contact</h2>

        <p>
          If you have questions about Corestack's use of cookies or similar
          technologies, contact our team.
        </p>
      </section>
    </LegalLayout>
  );
}