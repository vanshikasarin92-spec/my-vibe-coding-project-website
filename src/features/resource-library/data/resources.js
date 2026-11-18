// Resource library: roles for the filter (with a one-line intro) and grouped resources.
// Each item: [title, url, description, roleIds].

export const ROLES = [
  {
    id: 'all',
    label: 'All roles',
    intro:
      "Showing every resource. Pick a role to narrow the list to what's most useful for that work.",
  },
  {
    id: 'des',
    label: 'Designers',
    lead: 'Designers:',
    intro:
      "start with WCAG 2.2's design-related criteria, the Mercury design system and W3C's designing tips. Annotate focus order, accessible names and headings in every handoff, in English and French.",
  },
  {
    id: 'pm',
    label: 'Product managers',
    lead: 'Product managers:',
    intro:
      "start with the ACA regulations' December 2027 and 2028 deadlines and W3C's roles mapping (ARRM) to assign ownership. Budget for testing with people with disabilities and for conformity assessments.",
  },
  {
    id: 'po',
    label: 'Product owners',
    lead: 'Product owners:',
    intro:
      "write WCAG and EN 301 549 references into acceptance criteria, and don't accept a story as done until the release checklist passes.",
  },
  {
    id: 'dev',
    label: 'Developers',
    lead: 'Developers:',
    intro:
      'start with the ARIA Authoring Practices and the platform guides, add automated checks to CI, then test with a screen reader in both languages.',
  },
  {
    id: 'qa',
    label: 'QA',
    lead: 'QA:',
    intro:
      'use W3C Easy Checks and WCAG-EM for method, CAN/ASC-EN 301 549 for scope, and log each issue against its WCAG criterion or EN clause.',
  },
  {
    id: 'proc',
    label: 'Procurement',
    lead: 'Procurement:',
    intro:
      'from 5 December 2028 the public sector and large businesses must check purchased apps and web pages. Ask vendors for an Accessibility Conformance Report against EN 301 549 (the VPAT EU or INT edition), not WCAG alone.',
  },
];
export const ALL = ['des', 'pm', 'po', 'dev', 'qa', 'proc'];
export const RES = [
  {
    g: 'Canada and the Accessible Canada Act',
    items: [
      [
        'Summary of the digital accessibility regulations',
        'https://www.canada.ca/en/employment-social-development/programs/accessible-canada/regulations-summary-act/amendment.html',
        "ESDC's plain-language summary: who, what and the 2027–2028 deadlines",
        ALL,
      ],
      [
        'CAN/ASC-EN 301 549:2024',
        'https://accessible.canada.ca/en-301-549-accessibility-requirements-ict-products-and-services-1',
        'The standard the regulations reference; free to read from Accessibility Standards Canada',
        ['des', 'dev', 'qa', 'proc'],
      ],
      [
        'Accessible Canada Act (full text)',
        'https://laws-lois.justice.gc.ca/eng/acts/A-0.6/',
        'The law: plans, feedback processes, progress reports',
        ['pm', 'po', 'proc'],
      ],
      [
        'Canada Post accessibility plan and progress reports',
        'https://www.canadapost-postescanada.ca/cpc/en/our-company/accessibility/accessibility-plan-and-annual-progress-reports.page',
        '2026–2028 plan and annual reports, including digital commitments',
        ['pm', 'po', 'des', 'dev', 'qa', 'proc'],
      ],
      [
        'GC Digital Accessibility Toolkit',
        'https://a11y.canada.ca/en/',
        'Government of Canada guidance organised by role, in English and French',
        ALL,
      ],
      [
        'Blakes: the new digital accessibility regulations',
        'https://www.blakes.com/insights/federal-government-finalizes-new-digital-technologies-accessibility-regulations/',
        'Legal summary of scope, feasibility limits and enforcement',
        ['pm', 'proc'],
      ],
      [
        'Deque: ACA deadlines are closer than you think',
        'https://www.deque.com/blog/the-accessible-canada-act-deadlines-are-closer-than-you-think',
        'Practical timeline and what to start now',
        ['pm', 'po', 'qa'],
      ],
      [
        'Mercury design system',
        'https://design.canadapost-postescanada.ca/en/mercury/home.page',
        "Canada Post's colours, typography and components",
        ['des', 'dev', 'qa'],
      ],
    ],
  },
  {
    g: 'Standards',
    items: [
      [
        'WCAG 2.2',
        'https://www.w3.org/TR/WCAG22/',
        'The W3C Recommendation; our build target',
        ['des', 'dev', 'qa'],
      ],
      [
        'How to Meet WCAG 2.2 (Quick Reference)',
        'https://www.w3.org/WAI/WCAG22/quickref/',
        'Filterable list of success criteria and techniques',
        ['des', 'dev', 'qa', 'po'],
      ],
      [
        'Understanding WCAG 2.2',
        'https://www.w3.org/WAI/WCAG22/Understanding/',
        'Intent, examples and edge cases for every criterion',
        ['des', 'dev', 'qa', 'po'],
      ],
      [
        'Mobile accessibility at W3C',
        'https://www.w3.org/WAI/standards-guidelines/mobile/',
        'Applying WCAG to native mobile apps',
        ['des', 'dev', 'qa'],
      ],
      [
        'Applying WCAG to non-web ICT (WCAG2ICT)',
        'https://www.w3.org/WAI/standards-guidelines/wcag/non-web-ict/',
        'How WCAG applies to software, documents and apps',
        ['dev', 'qa', 'proc'],
      ],
      [
        'EN 301 549 V4.1.1 (PDF)',
        'https://www.etsi.org/deliver/etsi_en/301500_301599/301549/04.01.01_60/en_301549v040101p.pdf',
        'European edition, September 2026; not yet adopted in Canada',
        ['qa', 'proc', 'dev'],
      ],
      [
        'WCAG 3 Introduction',
        'https://www.w3.org/WAI/standards-guidelines/wcag/wcag3-intro/',
        'Status and structure of the draft',
        ['pm', 'des'],
      ],
    ],
  },
  {
    g: 'Planning and procurement',
    items: [
      [
        'Accessibility Roles and Responsibilities Mapping (ARRM)',
        'https://www.w3.org/WAI/planning/arrm/',
        'W3C framework for who owns each accessibility task',
        ALL,
      ],
      [
        'Planning and Managing Web Accessibility',
        'https://www.w3.org/WAI/planning-and-managing/',
        'W3C guide to setting up an accessibility program',
        ['pm', 'po'],
      ],
      [
        'W3C Accessibility Maturity Model',
        'https://www.w3.org/TR/maturity-model/',
        'Assess and track organisational maturity',
        ['pm'],
      ],
      [
        'Involving Users in Evaluating Accessibility',
        'https://www.w3.org/WAI/test-evaluate/involving-users/',
        'How to include people with disabilities in research and testing',
        ['pm', 'po', 'des', 'qa'],
      ],
      [
        'ITI VPAT templates',
        'https://www.itic.org/policy/accessibility/vpat',
        'Accessibility Conformance Report templates, including EN 301 549 editions',
        ['proc', 'qa', 'pm'],
      ],
      [
        'Section508.gov: buying accessible ICT',
        'https://www.section508.gov/',
        'ACR evaluation guidance (US, widely reused)',
        ['proc'],
      ],
      [
        'W3C writing tips',
        'https://www.w3.org/WAI/tips/writing/',
        'Accessible content for product copy and help pages',
        ['po', 'pm', 'des'],
      ],
    ],
  },
  {
    g: 'Web design and development',
    items: [
      [
        'W3C designing tips',
        'https://www.w3.org/WAI/tips/designing/',
        'Design basics mapped to WCAG',
        ['des'],
      ],
      [
        'W3C developing tips',
        'https://www.w3.org/WAI/tips/developing/',
        'Development basics mapped to WCAG',
        ['dev'],
      ],
      [
        'ARIA Authoring Practices Guide',
        'https://www.w3.org/WAI/ARIA/apg/',
        'Keyboard and ARIA patterns for widgets',
        ['dev', 'qa'],
      ],
      [
        'MDN Accessibility',
        'https://developer.mozilla.org/en-US/docs/Web/Accessibility',
        'Reference for HTML, ARIA and CSS features',
        ['dev'],
      ],
      [
        'W3C WAI Tutorials',
        'https://www.w3.org/WAI/tutorials/',
        'Forms, images, tables, menus, carousels',
        ['dev', 'des'],
      ],
      [
        'Inclusive Components',
        'https://inclusive-components.design/',
        'Accessible component patterns in depth',
        ['dev', 'des'],
      ],
      [
        'GOV.UK Design System accessibility',
        'https://design-system.service.gov.uk/accessibility/',
        'Tested components and focus styles',
        ['des', 'dev'],
      ],
    ],
  },
  {
    g: 'Testing',
    items: [
      [
        'Easy Checks',
        'https://www.w3.org/WAI/test-evaluate/easy-checks/',
        'A first look anyone can do in minutes',
        ['qa', 'des', 'pm', 'po'],
      ],
      [
        'WCAG-EM evaluation methodology',
        'https://www.w3.org/WAI/test-evaluate/conformance/wcag-em/',
        'How to scope, sample and report a conformance evaluation',
        ['qa', 'pm'],
      ],
      [
        'ACT rules',
        'https://www.w3.org/WAI/standards-guidelines/act/rules/',
        'Consistent test rules behind automated tools',
        ['qa', 'dev'],
      ],
      [
        'axe-core / axe DevTools',
        'https://www.deque.com/axe/',
        'Automated testing in the browser and CI',
        ['dev', 'qa'],
      ],
      [
        'Accessibility Insights',
        'https://accessibilityinsights.io/',
        'Guided manual assessments',
        ['qa', 'dev'],
      ],
    ],
  },
  {
    g: 'iOS and Apple platforms',
    items: [
      [
        'Apple Developer: Accessibility',
        'https://developer.apple.com/accessibility/',
        'APIs, WWDC sessions and sample code',
        ['dev', 'qa'],
      ],
      [
        'HIG: Accessibility',
        'https://developer.apple.com/design/human-interface-guidelines/accessibility',
        'Design guidance, target sizes, Dynamic Type',
        ['des'],
      ],
      [
        'Accessibility Nutrition Labels',
        'https://developer.apple.com/help/app-store-connect/manage-app-accessibility/overview-of-accessibility-nutrition-labels',
        'Per-feature criteria for App Store labels',
        ['po', 'pm', 'qa'],
      ],
    ],
  },
  {
    g: 'Android',
    items: [
      [
        'Android Developers: Accessibility',
        'https://developer.android.com/guide/topics/ui/accessibility',
        'Views, TalkBack and testing guidance',
        ['dev', 'qa'],
      ],
      [
        'Jetpack Compose accessibility',
        'https://developer.android.com/develop/ui/compose/accessibility',
        'Semantics, merging, custom actions',
        ['dev'],
      ],
      [
        'Espresso accessibility checks',
        'https://developer.android.com/training/testing/espresso/accessibility-checking',
        'Automated checks in UI tests',
        ['dev', 'qa'],
      ],
      [
        'Material 3: Accessible design',
        'https://m3.material.io/foundations/designing/overview',
        'Touch targets, colour and structure',
        ['des'],
      ],
    ],
  },
  {
    g: 'Inclusive design and research',
    items: [
      [
        'How People with Disabilities Use the Web',
        'https://www.w3.org/WAI/people-use-web/',
        'User stories and assistive technologies',
        ['des', 'pm', 'po'],
      ],
      [
        'Microsoft Inclusive Design',
        'https://inclusive.microsoft.design/',
        'Persona spectrum and toolkit',
        ['des', 'pm'],
      ],
      [
        'WebAIM Million',
        'https://webaim.org/projects/million/',
        'Annual state of web accessibility',
        ['pm', 'po'],
      ],
      [
        'WebAIM Screen Reader Survey',
        'https://webaim.org/projects/screenreadersurvey10/',
        'How screen reader users browse',
        ['des', 'qa', 'dev'],
      ],
      [
        'BBC Mobile Accessibility Guidelines',
        'https://www.bbc.co.uk/accessibility/forproducts/guides/mobile/',
        'Practical rules for native and hybrid apps',
        ['des', 'dev', 'qa'],
      ],
    ],
  },
  {
    g: 'Other jurisdictions',
    items: [
      [
        'AODA: How to make websites accessible',
        'https://www.ontario.ca/page/how-make-websites-accessible',
        'Ontario rules for provincially regulated organisations',
        ['pm', 'proc'],
      ],
      [
        'European Accessibility Act',
        'https://eur-lex.europa.eu/eli/dir/2019/882/oj',
        'For products offered to EU consumers',
        ['pm', 'proc'],
      ],
      [
        'ADA Title II web and mobile rule',
        'https://www.ada.gov/resources/2024-03-08-web-rule/',
        'For products sold to US public entities',
        ['pm', 'proc'],
      ],
    ],
  },
];

export const SHORT = {
  des: 'Design',
  pm: 'PM',
  po: 'PO',
  dev: 'Dev',
  qa: 'QA',
  proc: 'Procurement',
};
