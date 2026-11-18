// Testing & tools page content. `name` may use [label](url) markup (shared/components/RichText.jsx).

export const TOOLS = [
  {
    name: '[Stark](https://www.getstark.co/)',
    platform: 'Figma',
    usedBy: 'Design',
    bestFor: 'Contrast, colour-blindness simulation, focus order and annotations',
  },
  {
    name: '[Colour Contrast Analyser](https://www.tpgi.com/color-contrast-checker/)',
    platform: 'Desktop',
    usedBy: 'Design, QA',
    bestFor: 'Sampling real rendered colours from any screen',
  },
  {
    name: '[axe-core / axe DevTools](https://www.deque.com/axe/)',
    platform: 'Web',
    usedBy: 'Engineering, QA',
    bestFor: 'Browser extension and CI integration',
  },
  {
    name: '[Accessibility Insights](https://accessibilityinsights.io/)',
    platform: 'Web, Windows',
    usedBy: 'Engineering, QA',
    bestFor: 'Guided manual assessment with tab-stop visualisation',
  },
  {
    name: '[WAVE](https://wave.webaim.org/)',
    platform: 'Web',
    usedBy: 'Everyone',
    bestFor: 'Visual, in-page view of errors and structure',
  },
  {
    name: '[Lighthouse](https://developer.chrome.com/docs/lighthouse/)',
    platform: 'Web',
    usedBy: 'Engineering',
    bestFor: 'Quick checks in DevTools',
  },
  {
    name: '[Accessibility Inspector + XCUITest audits](https://developer.apple.com/accessibility/)',
    platform: 'iOS, macOS',
    usedBy: 'Engineering',
    bestFor: 'Inspecting labels and traits; automated audits in UI tests',
  },
  {
    name: '[Accessibility Scanner](https://play.google.com/store/apps/details?id=com.google.android.apps.accessibility.auditor)',
    platform: 'Android',
    usedBy: 'QA, Design',
    bestFor: 'On-device suggestions for targets, contrast and labels',
  },
  {
    name: '[Espresso Accessibility Checks](https://developer.android.com/training/testing/espresso/accessibility-checking)',
    platform: 'Android',
    usedBy: 'Engineering',
    bestFor: 'Failing UI tests on violations in CI',
  },
  {
    name: '[NVDA](https://www.nvaccess.org/) · JAWS · VoiceOver · TalkBack',
    platform: 'All',
    usedBy: 'Engineering, QA',
    bestFor: 'Real screen reader behaviour, in English and French',
  },
];

export const PRACTICES = [
  {
    title: 'Shift left',
    text: "Accessibility annotations in Figma, linting in the IDE, automated checks on every pull request. Fixing a missing label in design takes minutes; after launch it's a ticket and a release.",
  },
  {
    title: 'Five-minute manual pass',
    text: 'Tab through the feature. Turn on the screen reader and complete the main task without looking. Zoom to 200% or set the largest text. Toggle reduced motion and dark mode.',
  },
  {
    title: 'Test with disabled users',
    text: "Canada Post's plan targets usability testing with people with disabilities on 97% of digital products by 2028. Include screen reader, magnification, voice control and cognitive-disability participants.",
  },
  {
    title: 'Avoid overlays',
    text: "Overlay widgets don't fix source code. The US FTC ordered accessiBe to pay $1 million in 2025 over its compliance marketing claims, and more than 1,000 practitioners have signed the Overlay Fact Sheet.",
    link: {
      label: 'Overlay Fact Sheet',
      href: 'https://overlayfactsheet.com/',
    },
  },
];
