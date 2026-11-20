// Text for taking the hub into the work: "Copy as ticket" on Do this now / Do
// this next, and a definition-of-done (or pull-request) checklist per role.
// Every checklist line names the WCAG success criterion (or EN 301 549 clause)
// it checks, so a ticket can be traced back to the requirement.

// How each role's Do-this-now text (RA_COPY) goes into a ticket:
// code → a code block, list → checklist items, text → a quoted draft.
export const RA_COPY_KIND = { dev: 'code', po: 'list', des: 'list', proc: 'list', lead: 'text' };

export const TICKET_T = {
  en: {
    copyTicket: 'Copy as ticket',
    ticketHint:
      'Paste into Jira, Azure DevOps or GitHub. Checkboxes and the link back are included.',
    preview: 'Preview the ticket text',
    prefix: 'Accessibility',
    why: 'Why',
    byWhen: 'By when',
    doneWhen: 'Done when',
    details: 'Details',
    more: 'Requirements, deadlines and how-to',
    copiedTicket: 'Ticket text copied. Paste it into your tracker.',
    dodCopy: 'Copy checklist',
    dodCopied: 'Checklist copied.',
    dodHint: 'Paste it into your team’s definition of done, or your pull request template.',
    from: 'From the Accessible by Default hub',
  },
  fr: {
    copyTicket: 'Copier comme billet',
    ticketHint:
      'Collez-le dans Jira, Azure DevOps ou GitHub. Les cases à cocher et le lien de retour sont inclus.',
    preview: 'Aperçu du texte du billet',
    prefix: 'Accessibilité',
    why: 'Pourquoi',
    byWhen: 'Échéance',
    doneWhen: 'Terminé quand',
    details: 'Détails',
    more: 'Exigences, échéances et marche à suivre',
    copiedTicket: 'Texte du billet copié. Collez-le dans votre outil de suivi.',
    dodCopy: 'Copier la liste',
    dodCopied: 'Liste copiée.',
    dodHint:
      'Collez-la dans la définition de « terminé » de votre équipe ou dans votre modèle de demande de tirage.',
    from: 'Tiré du carrefour Accessible par défaut',
  },
};

// Definition of done per role. `title` is what the team calls the checklist.
export const RA_DOD = {
  dev: {
    en: {
      title: 'Pull request checklist',
      intro: 'Tick these before you ask for review.',
      items: [
        'Every new control works with a keyboard alone, in a logical order (WCAG 2.1.1, 2.4.3)',
        'Focus is visible and never hidden behind sticky headers or banners (WCAG 2.4.7, 2.4.11)',
        'Native elements first; custom controls expose name, role and state (WCAG 4.1.2)',
        'Every input has a label; errors are linked to their field and say how to fix them (WCAG 1.3.1, 3.3.1, 3.3.3)',
        'Status messages are announced without moving focus (WCAG 4.1.3)',
        'Text contrast 4.5:1; icons, borders and focus rings 3:1 (WCAG 1.4.3, 1.4.11)',
        'Works at 200% text size and at 320 px wide without sideways scrolling (WCAG 1.4.4, 1.4.10)',
        'axe passes in CI, and the changed flow was checked with a screen reader in English and French',
      ],
    },
    fr: {
      title: 'Liste de vérification de la demande de tirage',
      intro: 'Cochez ces points avant de demander une revue.',
      items: [
        'Chaque nouvelle commande fonctionne au clavier seulement, dans un ordre logique (WCAG 2.1.1, 2.4.3)',
        "Le focus est visible et n'est jamais caché par un en-tête ou une bannière fixe (WCAG 2.4.7, 2.4.11)",
        "Éléments natifs d'abord; les commandes personnalisées exposent nom, rôle et état (WCAG 4.1.2)",
        'Chaque champ a une étiquette; les erreurs sont liées à leur champ et expliquent comment les corriger (WCAG 1.3.1, 3.3.1, 3.3.3)',
        'Les messages d’état sont annoncés sans déplacer le focus (WCAG 4.1.3)',
        'Contraste du texte 4,5:1; icônes, bordures et anneaux de focus 3:1 (WCAG 1.4.3, 1.4.11)',
        'Fonctionne à 200 % de taille de texte et à 320 px de large sans défilement horizontal (WCAG 1.4.4, 1.4.10)',
        "axe réussit dans l'intégration continue, et le parcours modifié a été vérifié avec un lecteur d'écran en français et en anglais",
      ],
    },
  },
  po: {
    en: {
      title: 'Definition of done: accessibility',
      intro: 'A story isn’t done until these are true.',
      items: [
        'The story has accessibility acceptance criteria, with WCAG numbers',
        'Tested with a keyboard and a screen reader before it moved to Done (WCAG 2.1.1, 4.1.2)',
        'Works in English and French, including names read by screen readers (WCAG 3.1.1, 3.1.2)',
        'New video has captions, and audio has a transcript (WCAG 1.2.1, 1.2.2)',
        'Any issue left open is logged with its WCAG number, severity, owner and a date',
        'The accessibility feedback contact still reaches someone (Accessible Canada Act feedback process)',
      ],
    },
    fr: {
      title: 'Définition de « terminé » : accessibilité',
      intro: "Une histoire n'est pas terminée tant que ces points ne sont pas vrais.",
      items: [
        "L'histoire a des critères d'acceptation en accessibilité, avec les numéros WCAG",
        "Testé au clavier et avec un lecteur d'écran avant de passer à Terminé (WCAG 2.1.1, 4.1.2)",
        "Fonctionne en français et en anglais, y compris les noms lus par les lecteurs d'écran (WCAG 3.1.1, 3.1.2)",
        'Les nouvelles vidéos ont des sous-titres et l’audio une transcription (WCAG 1.2.1, 1.2.2)',
        'Tout problème laissé ouvert est consigné avec son numéro WCAG, sa gravité, un responsable et une date',
        "Le contact pour la rétroaction sur l'accessibilité joint toujours quelqu'un (processus de rétroaction de la Loi canadienne sur l'accessibilité)",
      ],
    },
  },
  des: {
    en: {
      title: 'Design handoff checklist',
      intro: 'Tick these before a design goes to development.',
      items: [
        'Focus order numbered on every screen (WCAG 2.4.3)',
        'Every icon-only control has an accessible name, in English and French (WCAG 4.1.2)',
        'Headings, landmarks and form labels marked (WCAG 1.3.1)',
        'Focus, hover, error and disabled states designed for every interactive component (WCAG 2.4.7)',
        'Text 4.5:1; icons, borders and focus rings 3:1, in every state (WCAG 1.4.3, 1.4.11)',
        'Colour is never the only way to show meaning (WCAG 1.4.1)',
        'Targets at least 44 pt / 48 dp, never under 24 px (WCAG 2.5.8)',
        'Layouts shown at 320 px wide and at 200% text size (WCAG 1.4.10, 1.4.4)',
      ],
    },
    fr: {
      title: 'Liste de vérification du transfert de conception',
      intro: 'Cochez ces points avant de transmettre une conception au développement.',
      items: [
        'Ordre du focus numéroté sur chaque écran (WCAG 2.4.3)',
        'Chaque commande à icône seule a un nom accessible, en français et en anglais (WCAG 4.1.2)',
        'Titres, repères et étiquettes de formulaire indiqués (WCAG 1.3.1)',
        'États focus, survol, erreur et désactivé conçus pour chaque composant interactif (WCAG 2.4.7)',
        'Texte 4,5:1; icônes, bordures et anneaux de focus 3:1, dans chaque état (WCAG 1.4.3, 1.4.11)',
        "La couleur n'est jamais le seul moyen de transmettre un sens (WCAG 1.4.1)",
        'Cibles d’au moins 44 pt / 48 dp, jamais moins de 24 px (WCAG 2.5.8)',
        'Mises en page montrées à 320 px de large et à 200 % de taille de texte (WCAG 1.4.10, 1.4.4)',
      ],
    },
  },
  qa: {
    en: {
      title: 'Test checklist',
      intro: 'Run these on every release candidate.',
      items: [
        'Automated scan (axe or the platform audit): no critical or serious issues',
        'Every changed flow completed with a keyboard alone; focus always visible (WCAG 2.1.1, 2.4.7)',
        'Screen reader pass: NVDA + Chrome, VoiceOver on iOS, TalkBack on Android (WCAG 4.1.2, 1.3.1)',
        'Both official languages tested, including the language read aloud (WCAG 3.1.1, 3.1.2)',
        'Zoom to 200% and reflow at 320 px wide (WCAG 1.4.4, 1.4.10)',
        'Form errors announced and explained (WCAG 3.3.1, 3.3.3, 4.1.3)',
        'Each issue logged with its WCAG number, severity and steps to reproduce',
      ],
    },
    fr: {
      title: 'Liste de vérification des tests',
      intro: 'Faites ces tests sur chaque version candidate.',
      items: [
        'Analyse automatisée (axe ou l’audit de la plateforme) : aucun problème critique ou grave',
        'Chaque parcours modifié réalisé au clavier seulement; focus toujours visible (WCAG 2.1.1, 2.4.7)',
        "Passage au lecteur d'écran : NVDA + Chrome, VoiceOver sur iOS, TalkBack sur Android (WCAG 4.1.2, 1.3.1)",
        'Les deux langues officielles testées, y compris la langue lue à voix haute (WCAG 3.1.1, 3.1.2)',
        'Zoom à 200 % et redimensionnement à 320 px de large (WCAG 1.4.4, 1.4.10)',
        'Erreurs de formulaire annoncées et expliquées (WCAG 3.3.1, 3.3.3, 4.1.3)',
        'Chaque problème consigné avec son numéro WCAG, sa gravité et les étapes pour le reproduire',
      ],
    },
  },
  proc: {
    en: {
      title: 'Procurement checklist',
      intro: 'Tick these before a contract is signed or renewed.',
      items: [
        'Accessibility Conformance Report (VPAT 2.5, EU or INT edition) received against EN 301 549',
        'Report reviewed: every “Partially supports” or “Does not support” has a remediation plan with dates',
        'Accessibility requirements and a fix period written into the contract',
        'Vendor named a contact for accessibility issues after delivery',
        'Acceptance testing includes keyboard and screen reader checks before sign-off',
      ],
    },
    fr: {
      title: "Liste de vérification de l'approvisionnement",
      intro: 'Cochez ces points avant de signer ou de renouveler un contrat.',
      items: [
        "Rapport de conformité en accessibilité (VPAT 2.5, édition EU ou INT) reçu selon l'EN 301 549",
        'Rapport examiné : chaque « Prise en charge partielle » ou « Non pris en charge » a un plan de correction avec des dates',
        "Exigences d'accessibilité et délai de correction inscrits au contrat",
        "Le fournisseur a nommé une personne-ressource pour les problèmes d'accessibilité après la livraison",
        "Les tests d'acceptation comprennent des vérifications au clavier et au lecteur d'écran avant l'approbation",
      ],
    },
  },
  lead: {
    en: {
      title: 'Release checklist for leads',
      intro: 'Tick these before each release goes out.',
      items: [
        'Every team’s definition of done includes accessibility',
        'Accessibility test results attached to the release',
        'Open accessibility issues triaged, each with an owner and a date',
        'Our Accessible Canada Act timeline (5 Dec 2027 or 5 Dec 2028) confirmed in writing',
        'Accessibility feedback process and accessibility plan up to date (Accessible Canada Act)',
      ],
    },
    fr: {
      title: 'Liste de vérification de version pour les gestionnaires',
      intro: 'Cochez ces points avant chaque mise en production.',
      items: [
        'La définition de « terminé » de chaque équipe inclut l’accessibilité',
        "Résultats des tests d'accessibilité joints à la version",
        "Problèmes d'accessibilité ouverts triés, chacun avec un responsable et une date",
        "Notre échéancier de la Loi canadienne sur l'accessibilité (5 décembre 2027 ou 5 décembre 2028) confirmé par écrit",
        "Processus de rétroaction et plan sur l'accessibilité à jour (Loi canadienne sur l'accessibilité)",
      ],
    },
  },
};
