


import {
  FaTwitter,
  FaLinkedin,
  FaGithub,
  FaCubes,
  FaGlobe,
  FaChevronDown,
  FaInstagram,
  FaFacebook,
  FaYoutube,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const LINK_SECTIONS = [
  {
    title: "Product",
    links: [
      { label: "Inventory", to: "/product#inventory" },
      { label: "Sales & Orders", to: "/product#orders" },
      { label: "Purchasing", to: "/product#purchasing" },
      { label: "Invoicing", to: "/product#invoicing" },
      { label: "Analytics", to: "/product#analytics" },
      { label: "Integrations", to: "/product#integrations" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Inventory Management", to: "/features#inventory" },
      { label: "Advanced Analytics", to: "/features#analytics" },
      { label: "Unified CRM", to: "/features#crm" },
      { label: "Automated Invoicing", to: "/features#invoicing" },
      { label: "Workflow Automation", to: "/features#automation" },
      { label: "Enterprise Security", to: "/features#security" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Retail", to: "/solutions#retail" },
      { label: "Wholesale distribution", to: "/solutions#wholesale" },
      { label: "Manufacturing", to: "/solutions#manufacturing" },
      { label: "Warehousing", to: "/solutions#warehousing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Documentation", to: "/resources/documentation" },
      { label: "Guides", to: "/resources/guides" },
      { label: "API reference", to: "/resources/api" },
      { label: "Changelog", to: "/resources/changelog" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", to: "/about" },
      { label: "Customers", to: "/customers" },
      { label: "Careers", to: "/careers" },
      { label: "Contact sales", to: "/contact-sales" },
    ],
  },
];

const LEGAL_LINKS = [
  { label: "Privacy policy", to: "/privacy" },
  { label: "Terms of service", to: "/terms" },
  { label: "Security", to: "/security" },
  { label: "Cookie settings", to: "/cookies" },
];

const SOCIALS = [
  {
    label: "Twitter",
    icon: FaTwitter,
    to: "https://twitter.com",
  },
  {
    label: "LinkedIn",
    icon: FaLinkedin,
    to: "https://linkedin.com",
  },
  // {
  //   label: "GitHub",
  //   icon: FaGithub,
  //   to: "https://github.com",
  // },
  {
    label : "Instagram",
    icon : FaInstagram,
    to : "https://instagram.com"
  },
  {
    label : "Facebook",
    icon : FaFacebook,
    to : "https://facebook.com"
  },
  {
    label : "Youtube",
    icon : FaYoutube ,
    to : "https://youtube.com",
    
  }
];

export default function Footer() {
  return (
    <footer className="border-t border-line bg-ink">
      <div className="mx-auto px-5 pt-8 sm:px-8">

        {/* FOOTER BOX */}
        <div
          className="
            relative overflow-hidden
            rounded-[32px]
            border border-line
            bg-white/[0.03]
            p-6
            sm:p-9
            
            xl:h-[660px]
            flex flex-col
            gap-y-8
          "
        >

          {/* =====================================================
              TOP CONTENT
          ====================================================== */}
          <div className="relative   z-10 flex flex-col gap-10 xl:flex-row">

            {/* BRAND */}
            <div className="flex shrink-0 xl:flex-col xl:w-[31%]">

              <h2 className="max-w-sm text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-5xl">
                Make space for
                <br />
                what matters.
              </h2>

              <Link
                to="/"
                className="mt-16 xl:mt-[200px] flex  items-center gap-3"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-ink">
                  <FaCubes size={17} />
                </span>

                <span className="text-2xl font-semibold tracking-tight">
                  Corestack
                </span>
              </Link>
            </div>

            {/* LINKS */}
            <div className=" grid grid-cols-3 sm:flex min-w-0 flex-1 justify-between gap-8">

              {LINK_SECTIONS.map((section) => (
                <div
                  key={section.title}
                  className="min-w-0"
                >
                  <p className="mb-5 text-sm font-medium text-white">
                    {section.title}
                  </p>

                  <ul className="flex flex-col gap-2.5">
                    {section.links.map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          className="text-xs text-muted transition-colors hover:text-white"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}

            </div>
          </div>

          {/* =====================================================
              DIVIDER
          ====================================================== */}
          <div className="xl:absolute left-6 right-6 top-[410px] h-px bg-line sm:left-9 sm:right-9" />

          {/* =====================================================
              STATUS + SOCIAL
          ====================================================== */}
          <div className="flex flex-col justify-center sm:flex-row xl:absolute left-6 right-6 top-[500px] z-10 sm:items-start sm:justify-between sm:left-9 sm:right-9">

            {/* STATUS */}
            <div>
              <p className="mb-3 text-xs font-medium text-white">
                Status
              </p>

              <div className="flex items-center gap-2 text-xs text-muted">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                All systems operational
              </div>
            </div>

            {/* SOCIAL */}
            <div className="text-right">
              <p className="mb-3 text-xs font-medium text-white">
                Join us on social
              </p>

              <div className="flex items-center justify-end gap-2">
                {SOCIALS.map(({ label, icon: Icon, to }) => (
                  <a
                    key={label}
                    href={to}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="
                      flex h-9 w-9
                      items-center justify-center
                      rounded-lg
                      border border-line
                      bg-white/5
                      text-muted
                      transition-colors
                      hover:bg-white/10
                      hover:text-white
                    "
                  >
                    <Icon size={14} />
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* =====================================================
              BOTTOM
          ====================================================== */}
          <div className="xl:absolute bottom-12 left-6 right-6 z-10 flex flex-col items-center justify-between gap-4 text-xs text-faint sm:left-9 sm:right-9 xl:flex-row">

            {/* LANGUAGE */}
            <button
              type="button"
              className="flex items-center gap-1.5 text-muted transition-colors hover:text-white"
            >
              <FaGlobe size={12} />
              English
              <FaChevronDown size={8} />
            </button>

            {/* LEGAL */}
            <ul className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
              {LEGAL_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="transition-colors hover:text-white"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            {/* COPYRIGHT */}
            <p>
              © {new Date().getFullYear()} Corestack, Inc.
            </p>
          </div>

          {/* =====================================================
              BIG CORESTACK
          ====================================================== */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-0 hidden h-[260px] items-end justify-center overflow-hidden min-[1280px]:flex">

            <div className="absolute inset-x-0 bottom-0 z-10 h-2/3 bg-gradient-to-t from-black via-black/80 to-transparent" />

            <div
              className="
                translate-y-[18%]
                whitespace-nowrap
                font-['Londrina_Outline']
                text-[20.1vw]
                leading-none
                tracking-[0.04em]
                text-white/[0.12]
              "
            >
              CORESTACK
            </div>

          </div>
        </div>
      </div>
    </footer>
  );
}