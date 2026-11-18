// Standards & law page content. Strings may use the inline markup in shared/components/RichText.jsx.
// Checked against the ESDC summary, Accessibility Standards Canada and legal commentary on 3 Nov 2026.

export const ACA_CHECKED =
  'Checked against the ESDC summary of the regulations, Accessibility Standards Canada and legal commentary on 3 November 2026.';

export const ACA_LAYERS = [
  {
    kicker: 'The law',
    name: 'Accessible Canada Act (2019)',
    text: 'Covers federally regulated entities, including federal Crown corporations. Requires an accessibility plan updated every three years, a public feedback process and annual progress reports.',
  },
  {
    kicker: 'The digital rules',
    name: 'Accessible Canada Regulations, amended Dec 2025',
    text: 'Registered 5 December 2025. Require web pages, mobile apps and digital documents to conform to CAN/ASC-EN 301 549, plus accessibility statements, procurement checks and staff training.',
  },
  {
    kicker: 'The standard',
    name: 'CAN/ASC-EN 301 549:2024',
    text: 'Published May 2024 by Accessibility Standards Canada. An identical adoption of EN 301 549:2021 (V3.2.1), which uses WCAG 2.1 Level A and AA for web, documents and software, plus non-WCAG clauses.',
  },
];

export const FACT_CHECK = {
  heading: 'Fact check: is WCAG 2.2 the ACA standard? No.',
  points: [
    'The standard the regulations reference is CAN/ASC-EN 301 549. Its current edition reflects **WCAG 2.1**, not 2.2.',
    'WCAG 2.2 AA is our **build target**. It includes every WCAG 2.1 AA criterion, so meeting it satisfies the WCAG portion of the Canadian standard.',
    'Meeting WCAG 2.2 AA alone does **not** satisfy CAN/ASC-EN 301 549. The standard also covers software and user preferences (clause 11), video caption and audio description controls (clause 7), two-way voice and real-time text (clause 6), and documentation and support services (clause 12).',
    "Europe's EN 301 549 V4.1.1 (September 2026) moved to WCAG 2.2. Accessibility Standards Canada has not announced when, or whether, it will adopt that edition.",
  ],
};

// Digital compliance timeline. Columns after the requirement: federal public sector,
// large business (500+), medium business (100–499).
export const TIMELINE = {
  columns: ['Federal public sector', 'Large business (500+)', 'Medium business (100–499)'],
  rows: [
    {
      date: '5 Dec 2027',
      requirement: 'New and updated web pages conform; website accessibility statement',
      applies: ['Yes', '—', '—'],
    },
    {
      date: '5 Dec 2027',
      requirement: 'Digital accessibility training for relevant employees',
      applies: ['Yes', 'Yes', 'Yes'],
    },
    {
      date: '5 Dec 2028',
      requirement: 'New and updated web pages conform',
      applies: ['Already due', 'Yes', 'Yes'],
    },
    {
      date: '5 Dec 2028',
      requirement: 'New mobile apps conform; existing public-facing apps assessed',
      applies: ['Yes', 'Yes', '—'],
    },
    {
      date: '5 Dec 2028',
      requirement: 'New and updated digital documents (such as PDFs) conform',
      applies: ['Yes', 'Yes', '—'],
    },
    {
      date: '5 Dec 2028',
      requirement: 'Checks on purchased apps and web pages',
      applies: ['Yes', 'Yes', '—'],
    },
    {
      date: '5 Dec 2028',
      requirement: 'Accessibility statement covers websites, apps and documents',
      applies: ['Yes', 'Yes', '—'],
    },
  ],
  note: "Ongoing: update accessibility statements annually, refresh training every 3 years, keep records for 4 years. Exempt: heritage content, user-generated content and internal collaboration platforms. Where conformance isn't feasible, provide alternative access. ESDC classes these violations as minor, with penalties of $250 to $75,000. Businesses with 99 or fewer employees are not covered.",
};

export const ORG_PLAN = {
  heading: "Canada Post's Accessibility Plan 2026–2028",
  points: [
    'New public-facing digital products must meet WCAG 2.1 Level AA; a strategy for the additional WCAG 2.2 requirements is in development.',
    'Usability testing with people with disabilities covers 67% of digital products, with a target of 97% by 2028.',
    "Accessible procurement guidelines were due to be finalised in early 2026. Internal software that doesn't meet WCAG 2.1 AA must be fixed within 24 months of contract signature.",
    'More than 170 employees and contractors have been trained in digital accessibility testing.',
  ],
  sources: [
    {
      label: 'Accessibility Plan 2026 (PDF)',
      href: 'https://www.canadapost-postescanada.ca/cpc/doc/en/aboutus/corporate-responsibility/accessibility-plan-2026.pdf',
    },
    {
      label: 'Plans and progress reports',
      href: 'https://www.canadapost-postescanada.ca/cpc/en/our-company/accessibility/accessibility-plan-and-annual-progress-reports.page',
    },
  ],
};

export const WHICH_DEADLINE = {
  heading: 'Which deadline applies?',
  text: 'Canada Post describes itself as a federal Crown corporation. The regulations include certain Crown corporations in the federal public sector, whose web deadline is December 2027, a year ahead of businesses. Canada Post published its first plan on 16 December 2022, which matches the government-entity timeline. Confirm the applicable category with the Accessibility office before planning to the 2028 date.',
  feedbackEmails: ['accessibility@canadapost.ca', 'accessibilite@postescanada.ca'],
};

// level: crit | warn | ok | info (sets the status colour). ca: a Canadian requirement (highlighted row).
export const STANDARDS = {
  caption: 'All standards and requirements, status as of November 2026',
  rows: [
    {
      name: 'Accessible Canada Act',
      href: 'https://laws-lois.justice.gc.ca/eng/acts/A-0.6/',
      what: 'Federal law for barrier-free federal jurisdiction.',
      status: 'In force since 2019',
      level: 'crit',
      bar: 'Plans, feedback process, progress reports',
      applies: 'Federal public sector, Crown corporations, federally regulated businesses',
      ca: true,
    },
    {
      name: 'Accessible Canada Regulations (digital)',
      href: 'https://www.canada.ca/en/employment-social-development/programs/accessible-canada/regulations-summary-act/amendment.html',
      what: 'Digital technologies amendments registered 5 Dec 2025.',
      status: 'Deadlines Dec 2027 / Dec 2028',
      level: 'warn',
      bar: 'CAN/ASC-EN 301 549',
      applies: 'Web, mobile apps, documents, procurement, training',
      ca: true,
    },
    {
      name: 'CAN/ASC-EN 301 549:2024',
      href: 'https://accessible.canada.ca/en-301-549-accessibility-requirements-ict-products-and-services-1',
      what: 'National Standard of Canada; identical to EN 301 549:2021 (V3.2.1).',
      status: 'Current edition',
      level: 'ok',
      bar: 'WCAG 2.1 A and AA plus non-web clauses',
      applies: 'Required through the regulations above; voluntary on its own',
      ca: true,
    },
    {
      name: 'WCAG 2.2',
      href: 'https://www.w3.org/TR/WCAG22/',
      what: 'W3C guidelines; also ISO/IEC 40500:2025.',
      status: 'Current W3C standard',
      level: 'ok',
      bar: 'Level AA (our build target)',
      applies: 'Exceeds the WCAG 2.1 baseline in the Canadian standard',
    },
    {
      name: 'WCAG 3',
      href: 'https://www.w3.org/WAI/standards-guidelines/wcag/wcag3-intro/',
      what: 'Next-generation guidelines with Bronze/Silver/Gold conformance.',
      status: 'Working Draft',
      level: 'info',
      bar: 'Not usable for conformance',
      applies: 'Planning only',
    },
    {
      name: 'EN 301 549 V4.1.1',
      href: 'https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.01_60/en_301549v040101p.pdf',
      what: 'European edition published Sep 2026.',
      status: 'Not adopted in Canada',
      level: 'info',
      bar: 'WCAG 2.2 AA plus extra clauses',
      applies: 'EU (EAA, public procurement)',
    },
    {
      name: 'AODA (Ontario)',
      href: 'https://www.ontario.ca/page/how-make-websites-accessible',
      what: 'Provincial Integrated Accessibility Standards.',
      status: 'In force',
      level: 'ok',
      bar: 'WCAG 2.0 AA (large organisations)',
      applies:
        'Provincially regulated organisations in Ontario; federal entities fall under the ACA',
    },
    {
      name: 'European Accessibility Act',
      href: 'https://eur-lex.europa.eu/eli/dir/2019/882/oj',
      what: 'EU Directive 2019/882.',
      status: 'Enforced since 28 Jun 2025',
      level: 'crit',
      bar: 'EN 301 549',
      applies: 'Products and services offered to EU consumers',
    },
    {
      name: 'ADA Title II rule (US)',
      href: 'https://www.ada.gov/resources/2024-03-08-web-rule/',
      what: 'DOJ rule for US state and local governments.',
      status: 'Deadlines Apr 2027 / Apr 2028',
      level: 'warn',
      bar: 'WCAG 2.1 AA',
      applies: 'US public entities and their vendors',
    },
    {
      name: 'Section 508 (US)',
      href: 'https://www.section508.gov/',
      what: 'US federal procurement standard.',
      status: 'In force',
      level: 'ok',
      bar: 'WCAG 2.0 AA',
      applies: 'Products sold to US federal agencies',
    },
    {
      name: 'Apple Accessibility Nutrition Labels',
      href: 'https://developer.apple.com/help/app-store-connect/manage-app-accessibility/overview-of-accessibility-nutrition-labels',
      what: 'App Store disclosure of supported features.',
      status: 'Optional; will become required',
      level: 'warn',
      bar: 'All common tasks completable per feature',
      applies: 'Every App Store app',
    },
  ],
};

export const WCAG22_ADDED = {
  note: "These six criteria are in our build target but not yet in the WCAG 2.1 baseline of CAN/ASC-EN 301 549:2024. Canada Post's 2026–2028 plan lists a WCAG 2.2 strategy as in progress.",
  criteria: [
    {
      sc: '2.4.11 · AA',
      name: 'Focus Not Obscured (Minimum)',
      text: "A focused element isn't entirely hidden by sticky headers, cookie banners or chat widgets.",
    },
    {
      sc: '2.5.7 · AA',
      name: 'Dragging Movements',
      text: 'Anything done by dragging has a single-pointer alternative such as tap or buttons.',
    },
    {
      sc: '2.5.8 · AA',
      name: 'Target Size (Minimum)',
      text: "Pointer targets are at least 24 × 24 CSS px, or spaced so a 24 px circle doesn't overlap a neighbour.",
    },
    {
      sc: '3.2.6 · A',
      name: 'Consistent Help',
      text: 'Help options (contact, chat, FAQ) appear in the same relative place across pages.',
    },
    {
      sc: '3.3.7 · A',
      name: 'Redundant Entry',
      text: "Don't ask for the same information twice in one process; auto-fill it or let users select it.",
    },
    {
      sc: '3.3.8 · AA',
      name: 'Accessible Authentication (Minimum)',
      text: "No memory or puzzle tests to sign in unless there's an alternative. Allow paste and password managers.",
    },
  ],
};

export const TARGET_SIZES = {
  rows: [
    {
      source: 'WCAG 2.2 · 2.5.8 (AA)',
      min: '24 × 24',
      unit: 'CSS px',
      type: 'Requirement',
    },
    {
      source: 'WCAG 2.2 · 2.5.5 (AAA)',
      min: '44 × 44',
      unit: 'CSS px',
      type: 'Enhanced requirement',
    },
    {
      source: 'Apple Human Interface Guidelines',
      min: '44 × 44',
      unit: 'pt',
      type: 'Platform guidance',
    },
    {
      source: 'Android / Material Design',
      min: '48 × 48',
      unit: 'dp',
      type: 'Platform guidance',
    },
  ],
  rule: 'Our rule: design to the platform guidance (44 pt / 48 dp, 44 px on touch web) and treat 24 px as the floor.',
};
