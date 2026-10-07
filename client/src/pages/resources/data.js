import {
  FaBoxes, FaChartLine, FaBolt, FaPlug, FaWarehouse,
  FaFileInvoiceDollar, FaShieldAlt, FaTruck, FaUsers,
  FaBookOpen, FaLifeRing, FaBlog, FaHistory, FaStar,
} from "react-icons/fa";

export const SECTIONS = [
  { label: "Overview", to: "/resources", end: true },
  { label: "Docs", to: "/resources/docs" },
  { label: "Guides", to: "/resources/guides" },
  { label: "Blog", to: "/resources/blog" },
  { label: "Customer stories", to: "/resources/customer-stories" },
  { label: "Changelog", to: "/resources/changelog" },
  { label: "Help", to: "/resources/help" },
];

export const EXPLORE = [
  { title: "Docs", desc: "API reference, setup and concepts.", to: "/resources/docs", icon: FaBookOpen },
  { title: "Guides", desc: "Step-by-step playbooks for every workflow.", to: "/resources/guides", icon: FaBoxes },
  { title: "Blog", desc: "Product news, engineering and ideas.", to: "/resources/blog", icon: FaBlog },
  { title: "Customer stories", desc: "How teams run on Corestack.", to: "/resources/customer-stories", icon: FaStar },
  { title: "Changelog", desc: "Every release, newest first.", to: "/resources/changelog", icon: FaHistory },
  { title: "Help", desc: "FAQs and a direct line to support.", to: "/resources/help", icon: FaLifeRing },
];

// ---------------- BLOG ----------------
export const POST_CATEGORIES = ["All", "Product", "Company", "Engineering", "Tutorials", "Press"];

export const POSTS = [
  { id: 1, title: "How to build a reorder workflow that never misses a SKU", category: "Tutorials", date: "Oct 2, 2026", author: "Aarav", read: "5 min", tone: "blue", icon: FaBolt,
    excerpt: "We set up automatic reorder points across three warehouses. Here is the exact setup, so you can copy it for your own catalog.", 
    image: '/resources/blog/reorder-workflow.png',
  },
  { id: 2, title: "Introducing multi-warehouse transfers", category: "Product", date: "Sep 24, 2026", author: "Meera", read: "4 min", tone: "teal", icon: FaWarehouse , image : '/resources/blog/multi-warehouse-transfer.png'  },
  { id: 3, title: "Making inventory sync under one second", category: "Engineering", date: "Sep 18, 2026", author: "Kabir", read: "7 min", tone: "violet", icon: FaPlug , image : '/resources/blog/inventory-sync.png'  },
  { id: 4, title: "Why we run one database per tenant", category: "Engineering", date: "Sep 10, 2026", author: "Kabir", read: "8 min", tone: "blue", icon: FaShieldAlt , image : '' },
  { id: 5, title: "Corestack 1.0 is on its way", category: "Company", date: "Sep 4, 2026", author: "Corestack Team", read: "3 min", tone: "amber", icon: FaStar, image : '' },
  { id: 6, title: "Invoicing automation, end to end", category: "Tutorials", date: "Aug 28, 2026", author: "Meera", read: "6 min", tone: "teal", icon: FaFileInvoiceDollar, image : '' },
  { id: 7, title: "Reading your analytics dashboard like an operator", category: "Tutorials", date: "Aug 21, 2026", author: "Aarav", read: "5 min", tone: "violet", icon: FaChartLine, image : '' },
  { id: 8, title: "Corestack in the press: what people are saying", category: "Press", date: "Aug 14, 2026", author: "Corestack Team", read: "3 min", tone: "amber", icon: FaUsers, image : '' },
  { id: 9, title: "Barcode scanning is now built in", category: "Product", date: "Aug 6, 2026", author: "Meera", read: "3 min", tone: "blue", icon: FaBoxes, image : '' },
  { id: 10, title: "How we think about role-based access", category: "Engineering", date: "Jul 29, 2026", author: "Kabir", read: "6 min", tone: "violet", icon: FaShieldAlt, image : '' },
  { id: 11, title: "Shipping faster with fulfillment cycles", category: "Product", date: "Jul 20, 2026", author: "Aarav", read: "4 min", tone: "teal", icon: FaTruck, image : '' },
  { id: 12, title: "Our plan for the next twelve months", category: "Company", date: "Jul 12, 2026", author: "Corestack Team", read: "4 min", tone: "amber", icon: FaStar, image : '' },
];

// ---------------- GUIDES ----------------
export const GUIDE_CATEGORIES = ["All", "Getting started", "Inventory", "Orders", "Finance", "Automation"];

export const GUIDES = [
  { title: "Set up your workspace in 15 minutes", category: "Getting started", level: "Beginner", time: "15 min", icon: FaBookOpen },
  { title: "Import products and customers from a spreadsheet", category: "Getting started", level: "Beginner", time: "10 min", icon: FaBoxes },
  { title: "Set reorder points and low-stock alerts", category: "Inventory", level: "Beginner", time: "12 min", icon: FaWarehouse },
  { title: "Run multi-warehouse inventory without overselling", category: "Inventory", level: "Advanced", time: "25 min", icon: FaWarehouse },
  { title: "From quote to delivery: the order lifecycle", category: "Orders", level: "Intermediate", time: "18 min", icon: FaTruck },
  { title: "Automate invoicing and payment reminders", category: "Finance", level: "Intermediate", time: "14 min", icon: FaFileInvoiceDollar },
  { title: "Build your first workflow automation", category: "Automation", level: "Intermediate", time: "20 min", icon: FaBolt },
  { title: "Connect your store and marketplaces", category: "Automation", level: "Beginner", time: "10 min", icon: FaPlug },
];

// ---------------- STORIES ----------------
export const STORIES = [
  { company: "Meridian Foods", industry: "Wholesale distribution", metric: "10k", metricLabel: "orders per month, one team",
    quote: "We replaced four spreadsheets and two tools with Corestack in a single quarter.", person: "Operations Lead", tone: "blue" },
  { company: "Blue Harbor", industry: "Retail", metric: "30%", metricLabel: "lower operating costs",
    quote: "Real-time stock across stores ended our overselling problem for good.", person: "Head of Finance", tone: "teal" },
  { company: "Northline Supply", industry: "Manufacturing", metric: "3x", metricLabel: "faster purchase orders",
    quote: "Reorder rules draft the purchase order before we even notice we are low.", person: "Procurement Manager", tone: "violet" },
  { company: "Kestrel Goods", industry: "D2C brand", metric: "< 1 day", metricLabel: "to onboard a new warehouse",
    quote: "Adding a second warehouse took an afternoon, not a project.", person: "Founder", tone: "amber" },
];

// ---------------- CHANGELOG ----------------
export const CHANGELOG = [
  { version: "0.9.4", date: "Oct 1, 2026", tag: "New", title: "Pinned dashboards",
    items: ["Pin any report to the top of your dashboard", "Share a pinned view with your team", "Faster load for large catalogs"] },
  { version: "0.9.3", date: "Sep 24, 2026", tag: "New", title: "Multi-warehouse transfers",
    items: ["Move stock between warehouses with a single form", "Transfers show up in the audit log", "In-transit quantities count toward availability"] },
  { version: "0.9.2", date: "Sep 12, 2026", tag: "Improved", title: "Inventory sync performance",
    items: ["Sync latency is now under one second", "Fewer duplicate webhooks", "Clearer sync error messages"] },
  { version: "0.9.1", date: "Aug 30, 2026", tag: "Fixed", title: "Invoice and order fixes",
    items: ["Fixed rounding on multi-currency invoices", "Fixed order status not updating after partial shipment"] },
  { version: "0.9.0", date: "Aug 15, 2026", tag: "New", title: "Barcode scanning",
    items: ["Scan to receive, pick and count stock", "Supports camera and handheld scanners"] },
];

// ---------------- DOCS ----------------
export const DOC_GROUPS = [
  { id: "getting-started", title: "Getting started", icon: FaBookOpen, desc: "Create a workspace and invite your team.",
    links: ["Introduction", "Create your workspace", "Invite teammates", "Core concepts"] },
  { id: "inventory", title: "Inventory", icon: FaWarehouse, desc: "Products, stock levels and warehouses.",
    links: ["Products and variants", "Warehouses", "Stock adjustments", "Reorder points"] },
  { id: "orders", title: "Sales and orders", icon: FaTruck, desc: "From quote to delivery.",
    links: ["Creating orders", "Fulfillment", "Returns", "Customers"] },
  { id: "finance", title: "Invoicing and payments", icon: FaFileInvoiceDollar, desc: "Bill customers and reconcile payments.",
    links: ["Invoices", "Payment methods", "Taxes", "Reminders"] },
  { id: "api", title: "API reference", icon: FaPlug, desc: "Build on top of Corestack.",
    links: ["Authentication", "Products", "Orders", "Webhooks", "Rate limits"] },
  { id: "security", title: "Security and admin", icon: FaShieldAlt, desc: "Roles, permissions and audit logs.",
    links: ["Roles and permissions", "Audit log", "Single sign-on", "Data export"] },
];

// ---------------- HELP ----------------
export const HELP_CATEGORIES = [
  { title: "Account and billing", desc: "Plans, invoices, seats.", icon: FaFileInvoiceDollar },
  { title: "Inventory", desc: "Stock, warehouses, sync.", icon: FaWarehouse },
  { title: "Orders", desc: "Creating and fulfilling orders.", icon: FaTruck },
  { title: "Integrations", desc: "Stores, marketplaces, POS.", icon: FaPlug },
  { title: "Security", desc: "Access, roles, data.", icon: FaShieldAlt },
  { title: "Team and permissions", desc: "Invites and roles.", icon: FaUsers },
];

export const FAQS = [
  { q: "How do I import my existing products?", a: "Open Inventory, choose Import, and upload a CSV. You can map your columns to Corestack fields before confirming." },
  { q: "Can I use more than one warehouse?", a: "Yes. The Free plan includes one warehouse, Standard three, Teams ten, and Enterprise is unlimited." },
  { q: "How fast does inventory sync across channels?", a: "Changes sync in under a second in normal conditions. Any failures appear in the sync log with a clear reason." },
  { q: "Is my data kept separate from other customers?", a: "Yes. Every workspace has its own database, so your data is never mixed with another tenant." },
  { q: "How do I change my plan?", a: "Go to Settings, then Billing, and pick a new plan. The change applies immediately and billing is prorated." },
  { q: "How do I contact support?", a: "Use the contact form below. Teams and Enterprise plans get priority responses." },
];