// Release checklists. Grey refs are WCAG 2.2; refs with en: true are CAN/ASC-EN 301 549 clauses beyond WCAG.

export const CHECKLISTS = [
  {
    id: 'ck-design',
    title: 'Designer',
    items: [
      {
        id: 'd1',
        text: 'Text and icon contrast checked',
        refs: [
          {
            text: '1.4.3 · 1.4.11',
            en: false,
          },
        ],
      },
      {
        id: 'd2',
        text: 'Focus state designed for every interactive component',
        refs: [
          {
            text: '2.4.7 · 2.4.11',
            en: false,
          },
        ],
      },
      {
        id: 'd3',
        text: 'Targets meet 44 pt / 48 dp; never under 24 px',
        refs: [
          {
            text: '2.5.8',
            en: false,
          },
        ],
      },
      {
        id: 'd4',
        text: "Colour isn't the only way state or meaning is shown",
        refs: [
          {
            text: '1.4.1',
            en: false,
          },
        ],
      },
      {
        id: 'd5',
        text: 'Layouts tested at 200% text and 320 px width',
        refs: [
          {
            text: '1.4.4 · 1.4.10',
            en: false,
          },
        ],
      },
      {
        id: 'd6',
        text: 'Headings, landmarks and reading order annotated',
        refs: [
          {
            text: '1.3.1 · 2.4.6',
            en: false,
          },
        ],
      },
      {
        id: 'd7',
        text: 'Accessible names written for icon-only controls, in both languages',
        refs: [
          {
            text: '4.1.2',
            en: false,
          },
        ],
      },
      {
        id: 'd8',
        text: 'Error messages say what went wrong and how to fix it',
        refs: [
          {
            text: '3.3.1 · 3.3.3',
            en: false,
          },
        ],
      },
      {
        id: 'd9',
        text: 'Drag interactions have a tap or button alternative',
        refs: [
          {
            text: '2.5.7',
            en: false,
          },
        ],
      },
      {
        id: 'd10',
        text: 'Motion is optional and respects reduced-motion settings',
        refs: [
          {
            text: '2.3.3',
            en: false,
          },
        ],
      },
    ],
  },
  {
    id: 'ck-eng',
    title: 'Engineer',
    items: [
      {
        id: 'e1',
        text: 'Native elements and platform controls used first',
        refs: [
          {
            text: '4.1.2',
            en: false,
          },
        ],
      },
      {
        id: 'e2',
        text: 'Every control has a correct name, role, value and state',
        refs: [
          {
            text: '4.1.2',
            en: false,
          },
        ],
      },
      {
        id: 'e3',
        text: 'Full task works with keyboard or switch, in logical order',
        refs: [
          {
            text: '2.1.1 · 2.4.3',
            en: false,
          },
        ],
      },
      {
        id: 'e4',
        text: 'Focus moved and restored on dialogs, navigation and deletes',
        refs: [
          {
            text: '2.4.3',
            en: false,
          },
        ],
      },
      {
        id: 'e5',
        text: 'Form inputs labelled; errors linked and announced',
        refs: [
          {
            text: '1.3.1 · 3.3.1',
            en: false,
          },
        ],
      },
      {
        id: 'e6',
        text: 'Status updates use live regions or announcements',
        refs: [
          {
            text: '4.1.3',
            en: false,
          },
        ],
      },
      {
        id: 'e7',
        text: 'Text scales with Dynamic Type, sp or browser zoom',
        refs: [
          {
            text: '1.4.4',
            en: false,
          },
        ],
      },
      {
        id: 'e8',
        text: 'Page and passage language set correctly',
        refs: [
          {
            text: '3.1.1 · 3.1.2',
            en: false,
          },
        ],
      },
      {
        id: 'e9',
        text: 'Sign-in allows paste and password managers',
        refs: [
          {
            text: '3.3.8',
            en: false,
          },
        ],
      },
      {
        id: 'e10',
        text: 'Software honours platform accessibility settings',
        refs: [
          {
            text: 'EN 11.7',
            en: true,
          },
        ],
      },
    ],
  },
  {
    id: 'ck-qa',
    title: 'Before release',
    items: [
      {
        id: 'q1',
        text: 'Core tasks completed with a screen reader on each platform',
        refs: [],
      },
      {
        id: 'q2',
        text: 'Core tasks completed with keyboard only',
        refs: [],
      },
      {
        id: 'q3',
        text: 'Core tasks completed with Voice Control or Voice Access',
        refs: [],
      },
      {
        id: 'q4',
        text: 'Checked at the largest text size and in landscape',
        refs: [],
      },
      {
        id: 'q5',
        text: 'Tested in English and French where the product ships in both',
        refs: [],
      },
      {
        id: 'q6',
        text: 'Videos captioned; players expose caption and audio description controls',
        refs: [
          {
            text: '1.2.2 ·',
            en: false,
          },
          {
            text: 'EN 7.3',
            en: true,
          },
        ],
      },
      {
        id: 'q7',
        text: 'Help, documentation and support channels are accessible',
        refs: [
          {
            text: 'EN 12',
            en: true,
          },
        ],
      },
      {
        id: 'q8',
        text: 'PDFs and other documents checked',
        refs: [
          {
            text: 'EN 10',
            en: true,
          },
        ],
      },
      {
        id: 'q9',
        text: 'Known issues logged with WCAG or EN clause and severity',
        refs: [],
      },
      {
        id: 'q10',
        text: 'Accessibility statement and App Store labels still accurate',
        refs: [],
      },
    ],
  },
];
