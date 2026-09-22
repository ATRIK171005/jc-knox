/**
 * Single source of truth for every word, name and link on the site.
 * Change the studio name / email / projects here — nothing else needs editing.
 */

export const site = {
  /** Wordmark. The trailing punctuation is part of the mark, like OFF+BRAND. */
  name: "JC KNOX.",
  nameShort: "JC KNOX",
  tagline: "We build websites for brands and businesses",
  email: "jcknox.in@gmail.com",
  phone: "+91 81162 23001",
  contactName: "Aastik Kumar Saha",
  socials: [] as { label: string; href: string }[],
};

export const nav = [
  { label: "Studio", href: "#studio" },
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Contact Us", href: "#contact" },
];

export const hero = {
  lines: ["WE BUILD", "WEBSITES", "THAT WIN", "CUSTOMERS"],
  cta: { label: "START A PROJECT", href: "#contact" },
};

export const intro = {
  label: "WE BUILD WEBSITES FOR BRANDS AND BUSINESSES THAT REFUSE TO BLEND IN.",
  link: { label: "ABOUT THE STUDIO", href: "#studio" },
  body:
    "A website is the first thing most people meet before they meet you. We make sure it earns the meeting: designed properly, built fast, and written to convert — not just to look busy. Every project is run by the person who designs and builds it, so there are no hand-offs, no junior teams, and no status calls that exist to justify a retainer. We take on a small number of builds each quarter so each one gets the attention it was paid for.",
};



export const services = [
  {
    index: "01",
    title: "Business Websites",
    body:
      "Marketing sites, company sites and landing pages. Designed and built in one motion — editorial layouts, real typography, sub-second loads, and a CMS your team can run without calling us.",
    tags: ["Design", "Build", "CMS", "Copy support"],
  },
  {
    index: "02",
    title: "E-Commerce",
    body:
      "Storefronts that load fast and check out faster. Product pages built to be found, a cart that doesn't lose people, and an admin your team can actually operate day to day.",
    tags: ["Shopify", "Headless", "Payments", "Checkout UX"],
  },
  {
    index: "03",
    title: "Brand & Identity",
    body:
      "Wordmark, type system, colour and art direction — enough of an identity to make the website look like it belongs to a real company, delivered as working files you own.",
    tags: ["Identity", "Type system", "Art direction", "Guidelines"],
  },
  {
    index: "04",
    title: "Growth & Performance",
    body:
      "Technical SEO, Core Web Vitals, analytics and conversion work on the site you already have. We measure before we touch anything, and we show you the delta afterwards.",
    tags: ["SEO", "Web Vitals", "Analytics", "CRO"],
  },
];

export const work = [
  {
    title: "Northwind",
    category: "WEBSITE / LOGISTICS",
    year: "2026",
    body: "A logistics company site rebuilt around one idea: show the cargo, hide the software.",
  },
  {
    title: "Kernel",
    category: "WEBSITE / SAAS",
    year: "2025",
    body: "Developer tooling marketing site — sign-ups up 3× on the same ad spend.",
  },
  {
    title: "Papercut",
    category: "E-COMMERCE / STATIONERY",
    year: "2025",
    body: "A stationery label with a print-first identity carried intact onto the web.",
  },
  {
    title: "Vanta+",
    category: "LANDING / LAUNCH",
    year: "2024",
    body: "A launch site that held 40k concurrent visitors without a loading spinner.",
  },
];

export const process = [
  {
    step: "01",
    title: "Signal",
    body: "A call. You describe the business, we tell you honestly whether we're the right studio to build it.",
  },
  {
    step: "02",
    title: "Scope",
    body: "A fixed-price proposal with dates, deliverables and exclusions written down. No hourly billing, no surprise invoices.",
  },
  {
    step: "03",
    title: "Build",
    body: "Weekly demos of the real site in a real browser. You see it the way your customers will, not as flat mockups.",
  },
  {
    step: "04",
    title: "Launch",
    body: "We ship it, hand over the source and the logins, record a walkthrough, and stay on support for thirty days.",
  },
];

export const approach = [
  {
    title: "Analysis",
    body: "We analyze your data to uncover valuable insights. Our experts use this data to craft personalized strategies for your business.",
  },
  {
    title: "Execution",
    body: "We implement the strategies to drive tangible results for your brand. Our team ensures every campaign is optimized for maximum impact.",
  },
  {
    title: "Optimization",
    body: "Continuous monitoring and optimization to improve your ROI. We refine strategies based on data insights to enhance performance.",
  },
];

export const contact = {
  label: "NEW BUSINESS",
  heading: ["LET'S", "BUILD", "YOUR SITE"],
  body:
    "Tell us about your business and when the site needs to be live. You'll get a reply from the person who would build it — usually within one business day.",
  budgets: [
    "Under ₹15k",
    "₹15k – ₹35k",
    "₹35k – ₹70k",
    "₹70k+",
    "Not sure yet",
  ],
};

export const footerLinks: { label: string; href: string }[] = [];
