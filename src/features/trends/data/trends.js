// Trends to plan for: each has the signal we see and our response.

export const TRENDS = [
  {
    title: "Canada's digital rules now have dates",
    signal:
      'The December 2025 amendments set deadlines in December 2027 and 2028 for web pages, apps, documents, procurement, training and accessibility statements.',
    response:
      'Build a conformity assessment and statement process now, and plan legacy app assessments well before 2028.',
  },
  {
    title: "WCAG 2.2 leads, Canada's standard follows",
    signal:
      "Europe's EN 301 549 V4.1.1 moved to WCAG 2.2 in September 2026. Canada's edition still uses WCAG 2.1, with no adoption date announced for the update.",
    response:
      'Keep building to WCAG 2.2 AA and track the six new criteria separately, so reports can show both the ACA baseline and our target.',
  },
  {
    title: 'AI builds UI faster than teams can verify it',
    signal:
      'WebAIM linked rising errors to faster building; Level Access found AI rarely improves QA.',
    response:
      'Put accessibility rules in coding-assistant instructions, component libraries and CI gates. Keep human screen reader passes.',
  },
  {
    title: 'Procurement becomes an accessibility gate',
    signal:
      "From December 2028 the public sector and large businesses must check purchased apps and web pages; Canada Post's plan adds accessible procurement guidelines.",
    response:
      'Ask vendors for conformance reports against EN 301 549, not WCAG alone, and write remediation timelines into contracts.',
  },
  {
    title: 'App stores make accessibility visible',
    signal:
      "Apple's Accessibility Nutrition Labels appear on product pages and will become mandatory.",
    response: 'Audit each common task per feature; reuse the evidence for ACA app assessments.',
  },
  {
    title: 'WCAG 3 and cognitive accessibility',
    signal: 'WCAG 3 drafts put more weight on cognitive needs, plain language and predictable UI.',
    response:
      'No conformance work yet. Start with plain-language reviews in both official languages and fewer steps in key flows.',
  },
];
