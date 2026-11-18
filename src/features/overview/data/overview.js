// Overview page content. Strings may use the inline markup in shared/components/RichText.jsx.

export const BUILD_STANDARD = {
  eyebrow: 'What we build to',
  statement:
    'Every new feature conforms to ==CAN/ASC-EN 301 549==, with web and app content built to ==WCAG 2.2 AA==.',
  note: "The Accessible Canada Act's digital regulations require conformance with CAN/ASC-EN 301 549:2024. That edition uses WCAG 2.1 AA for web content and adds requirements for software, video players, documentation and support. WCAG 2.2 AA contains all of 2.1 AA plus six newer criteria, so building to 2.2 AA meets the WCAG part of the Canadian standard and keeps us ready for its next edition.",
};

export const POUR = [
  {
    name: 'Perceivable',
    text: 'Text alternatives, captions, contrast, content that adapts to text size.',
  },
  {
    name: 'Operable',
    text: 'Keyboard, switch and voice access, enough time, no seizure triggers, big enough targets.',
  },
  {
    name: 'Understandable',
    text: 'Readable language, predictable behaviour, clear errors and help.',
  },
  {
    name: 'Robust',
    text: 'Correct names, roles and states for assistive technology.',
  },
];

export const STATS = [
  {
    value: '5 Dec 2027',
    label:
      'First Accessible Canada Act digital deadline: new and updated web pages for the federal public sector',
    source: 'Accessible Canada Regulations, amended Dec 2025',
  },
  {
    value: '5 Dec 2028',
    label:
      'Mobile apps, documents and procurement checks for the public sector and large businesses',
    source: 'ESDC summary of the amendments',
  },
  {
    value: '95.9%',
    label: 'of the top 1M home pages had detectable WCAG failures',
    source: 'WebAIM Million, Feb 2026',
  },
  {
    value: '56.1',
    label: 'average detectable errors per home page, up 10.1%',
    source: 'WebAIM Million, Feb 2026',
  },
];

export const TILES = [
  {
    href: '#standards',
    title: 'Accessible Canada Act',
    text: 'What the 2025 digital regulations require, by when, and how they relate to WCAG 2.2.',
    go: 'Standards & law',
  },
  {
    href: '#resources',
    title: 'Resources for your role',
    text: 'Filter the library for designers, product managers, product owners, developers, QA or procurement.',
    go: 'Resource library',
  },
  {
    href: '#platforms',
    title: 'Platform guides',
    text: 'Design and build must-haves for web, iOS (UIKit, SwiftUI) and Android (Views, Compose).',
    go: 'Web & mobile guides',
  },
  {
    href: '#checklists',
    title: 'Release checklists',
    text: "Designer, engineer and pre-release checklists, including the EN 301 549 items WCAG doesn't cover.",
    go: 'Checklists',
  },
  {
    href: '#news',
    title: 'What changed recently',
    text: 'Dated news with a line on what each item means for our team.',
    go: 'Latest news',
  },
  {
    href: '#testing',
    title: 'How to test',
    text: "Automated scanners, screen readers and the manual passes they can't replace.",
    go: 'Testing & tools',
  },
];
