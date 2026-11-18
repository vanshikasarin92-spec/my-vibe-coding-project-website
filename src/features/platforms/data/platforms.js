// Web & mobile guides, one entry per tab. Strings may use the inline markup in
// shared/components/RichText.jsx (`code`, [label](url), **strong**).

export const PLATFORMS = [
  {
    id: 'web',
    label: 'Web',
    design: [
      'Text contrast 4.5:1 (3:1 for large text); UI component and focus indicator contrast 3:1.',
      'Design a visible focus state for every interactive component, not just links.',
      'Layouts reflow at 320 CSS px wide (400% zoom) without two-direction scrolling.',
      'Never use colour alone to show state, errors or chart series.',
      'Annotate heading levels, landmarks, reading order and accessible names in handoff files.',
      'Allow for French text running about a third longer than English in buttons and labels.',
    ],
    build: [
      'Native HTML first: `<button>`, `<a href>`, `<label>`, `<fieldset>`. Add ARIA only when no native element exists.',
      'Every input has a programmatic label; errors are linked with `aria-describedby` and announced.',
      'Manage focus on route changes, modals and deleted items.',
      'Set `lang="en"` or `lang="fr"` on `<html>`, and on any passage in the other language.',
      "Respect `prefers-reduced-motion` and `prefers-contrast`; don't disable zoom.",
      'Status messages use a polite live region.',
    ],
    apis: [
      'aria-label',
      'aria-describedby',
      'aria-live',
      'aria-expanded',
      'inert',
      '<dialog>',
      ':focus-visible',
      'lang',
    ],
    references: [
      {
        label: 'ARIA Authoring Practices Guide',
        href: 'https://www.w3.org/WAI/ARIA/apg/',
      },
      {
        label: 'MDN Accessibility',
        href: 'https://developer.mozilla.org/en-US/docs/Web/Accessibility',
      },
      {
        label: 'How to Meet WCAG',
        href: 'https://www.w3.org/WAI/WCAG22/quickref/',
      },
      {
        label: 'Mercury design system',
        href: 'https://design.canadapost-postescanada.ca/en/mercury/home.page',
      },
    ],
    testWith:
      'axe or Lighthouse in CI · keyboard only · NVDA + Firefox or Chrome · JAWS + Chrome · VoiceOver + Safari · 200% text and 400% zoom · screen reader set to French for French pages',
  },
  {
    id: 'ios',
    label: 'iOS & iPadOS',
    design: [
      'Support Dynamic Type through the accessibility sizes; layouts must stack or scroll, not truncate.',
      '44 × 44 pt minimum hit areas, even when the visible icon is smaller.',
      'Check designs in Dark Mode, Increase Contrast, Bold Text and Reduce Transparency.',
      'Provide alternatives to custom gestures and avoid gestures that conflict with VoiceOver.',
      'Specify VoiceOver labels, hints and grouping in specs, in both languages.',
    ],
    build: [
      'Set `accessibilityLabel`, `accessibilityValue` and traits for custom controls.',
      'SwiftUI: `.accessibilityElement(children: .combine)`, `.accessibilityAction`, `.accessibilityHeading`.',
      'Use text styles so Dynamic Type works; adapt layout at accessibility sizes.',
      'Honour Reduce Motion and post announcements with `AccessibilityNotification`.',
      'Localise accessibility labels and hints along with visible strings.',
      'Match visible text and accessible names so Voice Control commands work.',
    ],
    apis: [
      'accessibilityLabel',
      'accessibilityTraits',
      'accessibilityCustomActions',
      'accessibilityRotor',
      'performAccessibilityAudit()',
    ],
    references: [
      {
        label: 'Apple Developer: Accessibility',
        href: 'https://developer.apple.com/accessibility/',
      },
      {
        label: 'HIG: Accessibility',
        href: 'https://developer.apple.com/design/human-interface-guidelines/accessibility',
      },
      {
        label: 'Accessibility Nutrition Labels',
        href: 'https://developer.apple.com/help/app-store-connect/manage-app-accessibility/overview-of-accessibility-nutrition-labels',
      },
    ],
    testWith:
      'Accessibility Inspector · XCUITest `performAccessibilityAudit()` in CI · VoiceOver in English and French · Voice Control · Switch Control · largest Dynamic Type size · Full Keyboard Access on iPad',
  },
  {
    id: 'android',
    label: 'Android',
    design: [
      '48 × 48 dp minimum touch targets with at least 8 dp between them.',
      'Specify text in sp and design for 200% font scale.',
      "Design for landscape, tablets and foldables: apps targeting API 37 can't lock orientation on large screens.",
      'Check designs with dark theme, high-contrast text and colour correction.',
      'Specify TalkBack labels, grouping and custom actions in handoff, in both languages.',
    ],
    build: [
      'Views: set `contentDescription`; mark decorative images `importantForAccessibility="no"`.',
      'Compose: `Modifier.semantics`, `mergeDescendants = true`, `heading()`, `stateDescription`.',
      'Add `customActions` instead of relying on swipe or long-press alone.',
      'Announce changes with `liveRegion`.',
      'Support keyboard, D-pad and Switch Access focus order.',
      "Don't use the Accessibility Service API for non-accessibility features.",
    ],
    apis: [
      'contentDescription',
      'Modifier.semantics',
      'mergeDescendants',
      'stateDescription',
      'AccessibilityChecks.enable()',
    ],
    references: [
      {
        label: 'Android Developers: Accessibility',
        href: 'https://developer.android.com/guide/topics/ui/accessibility',
      },
      {
        label: 'Compose accessibility',
        href: 'https://developer.android.com/develop/ui/compose/accessibility',
      },
      {
        label: 'Material 3',
        href: 'https://m3.material.io/foundations/designing/overview',
      },
    ],
    testWith:
      'Accessibility Scanner · Espresso `AccessibilityChecks` in CI · TalkBack in English and French · Voice Access · Switch Access · maximum display and font size',
  },
];
