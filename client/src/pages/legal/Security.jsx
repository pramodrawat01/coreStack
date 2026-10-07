import LegalLayout from "../../layouts/LegalLayout";

import {
  FiShield,
  FiLock,
  FiUsers,
  FiActivity,
} from "react-icons/fi";

const SECURITY_ITEMS = [
  {
    icon: FiShield,
    title: "Security by design",
    text: "Security is considered throughout the platform rather than treated as a separate layer.",
  },
  {
    icon: FiLock,
    title: "Access protection",
    text: "Authentication and authorization controls help ensure that users can access only the areas available to them.",
  },
  {
    icon: FiUsers,
    title: "Role-based access",
    text: "Organizations can structure access around the responsibilities of individual users and teams.",
  },
  {
    icon: FiActivity,
    title: "Operational visibility",
    text: "Corestack is designed to provide organizations with visibility into important operational activity.",
  },
];

export default function Security() {
  return (
    <LegalLayout
      eyebrow="Security"
      title="Security is part of the foundation."
      description="Corestack is designed to help businesses manage their operations while keeping access, data, and infrastructure protected."
      updated="October 7, 2026"
    >
      <section id="overview">
        <h2>Security at Corestack</h2>

        <p>
          Businesses depend on Corestack to manage important operational
          information. That means security needs to be considered across the
          entire platform.
        </p>

        <p className="mt-5">
          Our approach focuses on protecting access, reducing unnecessary
          exposure, and building security considerations into the way the
          platform is designed and operated.
        </p>
      </section>

      <div className="mt-14 space-y-3">
        {SECURITY_ITEMS.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="flex gap-5 rounded-2xl border border-white/10 bg-white/[0.025] p-6"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.04] text-blue-400">
                <Icon size={18} />
              </div>

              <div>
                <h3 className="text-base font-medium text-white">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-6 text-neutral-500">
                  {item.text}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <section id="information" className="mt-16 space-y-5">
        <h2>Data protection</h2>

        <p>
          Corestack is designed to limit access to business information based
          on the permissions associated with an account and organization.
        </p>

        <p>
          We also work to protect information while it is being transmitted
          between users and our services.
        </p>
      </section>

      <section id="usage" className="mt-16 space-y-5">
        <h2>Responsible access</h2>

        <p>
          Organizations are responsible for managing their users and assigning
          appropriate permissions. Users should keep their credentials
          confidential and report suspicious activity.
        </p>
      </section>

      <section id="contact" className="mt-16 space-y-5">
        <h2>Security questions</h2>

        <p>
          If you have a security-related question or need additional
          information for your organization, contact the Corestack team.
        </p>
      </section>
    </LegalLayout>
  );
}