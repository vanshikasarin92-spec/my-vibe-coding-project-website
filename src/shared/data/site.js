// Site-wide content: name, header chips, update date, footer and contrast swatches.

export const SITE = {
  name: 'Accessible by Default',
  eyebrow: 'Design & Engineering · Digital accessibility hub',
  updated: 'Updated 3 Nov 2026',
  analytics: 'Analytics', // header link to #analytics
  account: { signIn: 'Sign in', signedIn: 'Your account' },
  chips: [
    { text: 'ACA standard: CAN/ASC-EN 301 549:2024', kind: 'req' },
    { text: 'Build target: WCAG 2.2 AA', kind: 'target' },
    { text: 'Web · iOS · Android' },
  ],
  railNote:
    'Not legal advice. Confirm which obligations apply to a product with Legal and the Accessibility office.',
  footer:
    'Maintained for the Design & Engineering teams. Content current to 3 November 2026; every news item links its source. This hub is guidance, not legal advice.',
  // The page's own colours, with contrast ratios. `token` is the CSS variable.
  swatches: [
    { token: '--ink', text: 'Body text #333333 on white: 12.6:1' },
    { token: '--muted', text: 'Secondary text #666666: 5.7:1' },
    { token: '--accent', text: 'Links #0467C6: 5.6:1' },
    { token: '--brand', text: 'Red #CA261A with white: 5.5:1' },
  ],
};
