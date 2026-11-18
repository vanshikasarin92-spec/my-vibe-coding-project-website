// Latest news items. Newest first. Each item ends with what it means for the team.
// `topic` drives both the News filter and which roles see the item as "new" on a return visit.

export const NEWS_FILTERS = [
  {
    id: 'all',
    label: 'All',
  },
  {
    id: 'canada',
    label: 'Canada',
  },
  {
    id: 'standards',
    label: 'Standards',
  },
  {
    id: 'law',
    label: 'Other law & enforcement',
  },
  {
    id: 'mobile',
    label: 'Mobile platforms',
  },
  {
    id: 'research',
    label: 'Research',
  },
];

export const NEWS = [
  {
    date: '2026-09-02',
    label: '2 Sep 2026',
    topic: 'standards',
    tag: 'Standards',
    title: 'EN 301 549 V4.1.1 published: Europe moves to WCAG 2.2 AA',
    body: "ETSI, CEN and CENELEC published the new version of Europe's ICT accessibility standard. Web content, documents and software clauses now reference WCAG 2.2 AA instead of 2.1, real-time communication requirements were rewritten, and new annexes map the standard to the European Accessibility Act. Deque reports it is on track to be cited in the EU Official Journal around 30 November 2026.",
    meansLead: 'For us:',
    means:
      "Canada's adopted edition is still CAN/ASC-EN 301 549:2024, based on EN 301 549:2021 (V3.2.1) and WCAG 2.1. Accessibility Standards Canada says it follows the international review cycle but hasn't announced a date to adopt V4.1.1. Building to WCAG 2.2 AA now avoids rework when it does.",
    sourcesLabel: 'Sources:',
    sources: [
      {
        label: 'National Disability Authority',
        href: 'https://nda.ie/news/en301549-published',
      },
      {
        label: 'Deque',
        href: 'https://www.deque.com/blog/en-301-549-v4-1-1-is-final-what-changed-what-it-means-and-what-you-should-do/',
      },
      {
        label: 'Accessibility Standards Canada',
        href: 'https://accessible.canada.ca/en-301-549-accessibility-requirements-ict-products-and-services-1',
      },
    ],
  },
  {
    date: '2026-09-10',
    label: 'Sep 2026',
    topic: 'standards',
    tag: 'Standards',
    title: 'New WCAG 3 Working Draft opens for review',
    body: 'W3C published another WCAG 3 Working Draft in September, following the March 2026 draft. WCAG 3 is still a draft: it replaces pass/fail success criteria with more granular requirements and a Bronze/Silver/Gold conformance model. W3C says WCAG 2 will not be deprecated for several years after WCAG 3 is final.',
    meansLead: 'For us:',
    means:
      "read it, don't build to it. No law or procurement rule, including the ACA's, references WCAG 3.",
    sourcesLabel: 'Sources:',
    sources: [
      {
        label: 'W3C WAI announcement',
        href: 'https://lists.w3.org/Archives/Public/public-wai-announce/2026JulSep/0001.html',
      },
      {
        label: 'WCAG 3 Introduction',
        href: 'https://www.w3.org/WAI/standards-guidelines/wcag/wcag3-intro/',
      },
    ],
  },
  {
    date: '2026-09-16',
    label: '16 Sep 2026',
    topic: 'research',
    tag: 'Research',
    title: 'AI speeds up building faster than it speeds up accessibility testing',
    body: "Level Access's eighth State of Digital Accessibility report found about 80% of accessibility professionals now use AI, but only around 30% say it has helped their QA and testing. Applause's 2026 report found 78% of organisations use AI for accessibility work, with 90% combining it with manual testing.",
    meansLead: 'For us:',
    means:
      "AI-generated UI still needs manual keyboard and screen reader passes. Treat AI output like a new contributor's pull request.",
    sourcesLabel: 'Sources:',
    sources: [
      {
        label: 'Level Access',
        href: 'https://www.levelaccess.com/news/press-releases-news/level-access-research-finds-broad-ai-adoption-isnt-closing-the-accessibility-gap/',
      },
      {
        label: 'Applause report coverage',
        href: 'https://digiworld.news/news/72472/enhancing-digital-accessibility-through-ai-insights-from-applauses-2026-report',
      },
    ],
  },
  {
    date: '2026-07-08',
    label: '8 Jul 2026',
    topic: 'law',
    tag: 'Other law & enforcement',
    title: 'US digital accessibility lawsuits on pace for a record year',
    body: "UsableNet's midyear report projects about 6,176 website and app lawsuits in the US in 2026, nearly 20% above 2025. About two in three website suits target companies under $50M in revenue, and app lawsuits are a growing share.",
    meansLead: 'For us:',
    means:
      'relevant for any product sold into the US. Checkout, sign-in and account flows are the usual targets.',
    sourcesLabel: 'Sources:',
    sources: [
      {
        label: 'Stacker (UsableNet and Seyfarth data)',
        href: 'https://stacker.com/stories/small-business/website-accessibility-lawsuits-are-rising-and-smaller-businesses-are',
      },
    ],
  },
  {
    date: '2026-06-28',
    label: '28 Jun 2026',
    topic: 'law',
    tag: 'Other law & enforcement',
    title: 'European Accessibility Act turns one; enforcement is ramping up',
    body: "The EAA has been enforceable since 28 June 2025. National authorities are building audit capacity: Italy's AGID introduced a two-stage model in May 2026, and the first enforcement actions were injunctions filed against retailers in France in November 2025.",
    meansLead: 'For us:',
    means: 'applies only to products and services offered to consumers in the EU.',
    sourcesLabel: 'Sources:',
    sources: [
      {
        label: 'Taylor Wessing',
        href: 'https://www.taylorwessing.com/en/insights-and-events/insights/2026/06/the-eaa-and-bfsg-recap-and-update',
      },
      {
        label: 'Level Access',
        href: 'https://www.levelaccess.com/blog/eaa-compliance-in-2026-how-enforcement-has-evolved-and-what-to-expect-next/',
      },
    ],
  },
  {
    date: '2026-06-16',
    label: '16 Jun 2026',
    topic: 'mobile',
    tag: 'Mobile platforms',
    title: 'Android 17 ships with accessibility API restrictions and large-screen changes',
    body: "Android 17 (API level 37) blocks apps that aren't genuine accessibility tools from using the Accessibility API under Advanced Protection Mode. Apps targeting API 37 can no longer lock orientation or disable resizing on large screens.",
    meansLead: 'For us:',
    means: 'test layouts in landscape and on tablets and foldables at large font sizes.',
    sourcesLabel: 'Sources:',
    sources: [
      {
        label: 'Google I/O 2026',
        href: 'https://io.google/2026/explore/technical-session-5',
      },
      {
        label: 'Techlomedia',
        href: 'https://techlomedia.in/2026/06/google-rolls-out-android-17-focusing-on-ai-productivity-and-privacy-124732/',
      },
    ],
  },
  {
    date: '2026-05-19',
    label: '19 May 2026',
    topic: 'mobile',
    tag: 'Mobile platforms',
    title: 'Apple previews AI-powered accessibility features for its 27 releases',
    body: 'Apple announced Apple Intelligence upgrades to VoiceOver, Magnifier, Voice Control (including natural-language commands) and Accessibility Reader, plus generated subtitles and power wheelchair control with Apple Vision Pro.',
    meansLead: 'For us:',
    means:
      "AI image descriptions don't replace our own labels. Voice Control works best when visible labels match accessible names.",
    sourcesLabel: 'Sources:',
    sources: [
      {
        label: 'Apple Newsroom',
        href: 'https://www.apple.com/newsroom/2026/05/apple-unveils-new-accessibility-features-and-updates-with-apple-intelligence/',
      },
    ],
  },
  {
    date: '2026-05-01',
    label: 'May 2026',
    topic: 'mobile',
    tag: 'Mobile platforms',
    title: 'Apple pushes developers to prepare Accessibility Nutrition Labels',
    body: "App Store product pages show which accessibility features an app supports. A feature can only be claimed if users can complete all of the app's common tasks with it. Labels are optional today; Apple says they will become required for new apps and updates.",
    meansLead: 'For us:',
    means:
      'the same common-task audit feeds the ACA mobile app conformity assessment due in December 2028.',
    sourcesLabel: 'Sources:',
    sources: [
      {
        label: 'App Store Connect Help',
        href: 'https://developer.apple.com/help/app-store-connect/manage-app-accessibility/overview-of-accessibility-nutrition-labels',
      },
    ],
  },
  {
    date: '2026-04-20',
    label: '20 Apr 2026',
    topic: 'law',
    tag: 'Other law & enforcement',
    title: 'US DOJ extends ADA Title II web and app deadlines by one year',
    body: 'US state and local governments now have until 26 April 2027 (population 50,000+) or 26 April 2028 to meet WCAG 2.1 AA for web content and mobile apps.',
    meansLead: 'For us:',
    means: 'relevant only to products sold to US public entities.',
    sourcesLabel: 'Sources:',
    sources: [
      {
        label: 'Federal Register',
        href: 'https://www.federalregister.gov/documents/2026/04/20/2026-07663/extension-of-compliance-dates-for-nondiscrimination-on-the-basis-of-disability-accessibility-of-web',
      },
    ],
  },
  {
    date: '2026-02-28',
    label: 'Feb 2026',
    topic: 'research',
    tag: 'Research',
    title: 'WebAIM Million 2026: the web got less accessible',
    body: '95.9% of the top million home pages failed, averaging 56.1 errors per page. The most common failures were low-contrast text (83.9% of pages), missing alt text (53.1%), missing form labels (51%), empty links (46.3%) and empty buttons (30.6%). Pages with ARIA averaged 59.1 errors versus 42 without.',
    meansLead: 'For us:',
    means:
      'the top five failures are all catchable in design review and automated CI. More ARIA is not better ARIA.',
    sourcesLabel: 'Source:',
    sources: [
      {
        label: 'WebAIM Million',
        href: 'https://webaim.org/projects/million/',
      },
    ],
  },
  {
    date: '2025-12-05',
    label: '5 Dec 2025',
    topic: 'canada',
    tag: 'Canada',
    title: 'Digital accessibility rules added to the Accessible Canada Regulations',
    body: 'The federal government registered amendments to the Accessible Canada Regulations covering web pages, mobile apps, digital documents, procurement and training. They require conformance with CAN/ASC-EN 301 549, phased in from 5 December 2027 for the federal public sector and 5 December 2028 for federally regulated businesses with 100 or more employees. Organisations must also publish accessibility statements, update them annually and keep records for four years.',
    meansLead: 'For us:',
    means:
      'this is the rule that turns CAN/ASC-EN 301 549 from a voluntary standard into a requirement. See the Accessible Canada Act panel in Standards & law for the full timeline.',
    sourcesLabel: 'Sources:',
    sources: [
      {
        label: 'ESDC summary',
        href: 'https://www.canada.ca/en/employment-social-development/programs/accessible-canada/regulations-summary-act/amendment.html',
      },
      {
        label: 'Blakes',
        href: 'https://www.blakes.com/insights/federal-government-finalizes-new-digital-technologies-accessibility-regulations/',
      },
      {
        label: 'Deque',
        href: 'https://www.deque.com/blog/the-accessible-canada-act-deadlines-are-closer-than-you-think',
      },
    ],
  },
];
