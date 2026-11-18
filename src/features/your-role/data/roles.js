// Role content for the "Your role" page, in English and French.
// RA_R: per-role views (items, deadlines, Do this now, Do this next). RA_T: interface strings.
// RA_COPY: text people copy (snippets, acceptance criteria, RFP wording, request email).

export const NB = '\u00a0';
export const RA_IDS = ['dev', 'po', 'des', 'qa', 'proc', 'lead'];
export const RA_LIB = {
  dev: 'dev',
  po: 'po',
  des: 'des',
  qa: 'qa',
  proc: 'proc',
  lead: 'pm',
};
export const RA_TOPIC = {
  canada: RA_IDS,
  standards: ['dev', 'des', 'qa', 'proc'],
  mobile: ['dev', 'des', 'qa'],
  research: ['po', 'lead', 'des'],
  law: ['proc', 'lead', 'po'],
};

export const RA_T = {
  en: {
    kicker: 'Your role',
    otherLangLabel: 'Français',
    otherLang: 'fr',
    countdown: 'days until the first Accessible Canada Act digital deadline',
    countdownSub:
      '5 Dec 2027 · new and updated web pages, federal public sector (Accessible Canada Regulations, amended Dec 2025)',
    ask: "What's your role?",
    askSub: "Pick one. You'll see what applies to you, by when, and one thing to do this sprint.",
    remember:
      'The hub remembers your role on this device and opens on it next time. You can change it at any time.',
    changeRole: 'Change role',
    yourRole: 'Your role',
    applies: 'Applies to you',
    byWhen: 'By when',
    doNow: 'Do this now',
    doNext: 'Do this next',
    show: 'Show how',
    hide: 'Hide',
    libLink: 'Resources for your role in the library',
    doneLabel: 'Done',
    next: 'What happens next',
    backToView: 'Back to your view',
    welcome: 'Welcome back',
    notYou: 'Not your role? Change it',
    sinceLast: 'Since your last visit',
    doneOn: function (d) {
      return 'Done ' + d;
    },
    lastNot: 'Not finished yet',
    finish: 'Finish it now',
    changed: 'New in the hub for your role',
    nothingNew: function (p, d) {
      return (
        'Nothing new for ' + p + ' since your last visit on ' + d + '. Your next step is below.'
      );
    },
    loadFail:
      "We couldn't load what's new for your role. Your requirements and next step are still below.",
    retry: 'Try again',
    syncFail:
      "Couldn't save to your account. Your progress is saved in this browser and will be sent next time you sign in.",
    daysTo: 'days to 5 Dec 2027',
    fewer: function (f) {
      return f + (f === 1 ? ' fewer than' : ' fewer than') + ' at your last visit';
    },
    yourReqs: 'See everything that applies to you',
    allDone: "You've done both actions for your role.",
    allDoneSub: 'Run the release checklist before your next release.',
    left: function (n) {
      return n + ' days left';
    },
    req: 'WCAG 2.1 · required',
    target: 'WCAG 2.2 · our target',
    en: 'EN 301 549 · required',
    copied: 'Copied.',
    copyFail: "Copy didn't work here. Select the text above and copy it.",
    months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    y27: '5 Dec 2027',
    y28: '5 Dec 2028',
  },
  fr: {
    kicker: 'Votre rôle',
    otherLangLabel: 'English',
    otherLang: 'en',
    countdown:
      "jours avant la première échéance numérique de la Loi canadienne sur l'accessibilité",
    countdownSub:
      "5 déc. 2027 · pages Web nouvelles et mises à jour, secteur public fédéral (Règlement canadien sur l'accessibilité, modifié en déc. 2025)",
    ask: 'Quel est votre rôle' + NB + '?',
    askSub:
      "Choisissez-en un. Vous verrez ce qui s'applique à vous, l'échéance et une chose à faire pendant ce sprint.",
    remember:
      "Le centre mémorise votre rôle sur cet appareil et s'ouvrira dessus la prochaine fois. Vous pouvez le changer en tout temps.",
    changeRole: 'Changer de rôle',
    yourRole: 'Votre rôle',
    applies: "Ce qui s'applique à vous",
    byWhen: 'Échéance',
    doNow: 'À faire maintenant',
    doNext: 'À faire ensuite',
    show: 'Voir comment',
    hide: 'Masquer',
    libLink: 'Ressources pour votre rôle dans la bibliothèque',
    doneLabel: 'Terminé',
    next: 'Prochaines étapes',
    backToView: 'Retour à votre vue',
    welcome: 'Bon retour',
    notYou: "Ce n'est pas votre rôle" + NB + '? Changez-le',
    sinceLast: 'Depuis votre dernière visite',
    doneOn: function (d) {
      return 'Fait le ' + d;
    },
    lastNot: 'Pas encore terminé',
    finish: 'Terminer maintenant',
    changed: 'Nouveautés du centre pour votre rôle',
    nothingNew: function (p, d) {
      return (
        'Rien de nouveau pour ' +
        p +
        ' depuis votre dernière visite le ' +
        d +
        (/\.$/.test(d) ? '' : '.') +
        ' Votre prochaine étape est ci-dessous.'
      );
    },
    loadFail:
      'Impossible de charger les nouveautés pour votre rôle. Vos exigences et votre prochaine étape sont toujours ci-dessous.',
    retry: 'Réessayer',
    syncFail:
      'Impossible d’enregistrer dans votre compte. Votre progression est enregistrée dans ce navigateur et sera envoyée à votre prochaine connexion.',
    daysTo: 'jours avant le 5 déc. 2027',
    fewer: function (f) {
      return f + " de moins qu'à votre dernière visite";
    },
    yourReqs: "Voir tout ce qui s'applique à vous",
    allDone: 'Vous avez fait les deux actions de votre rôle.',
    allDoneSub: 'Passez la liste de vérification de version avant votre prochaine version.',
    left: function (n) {
      return 'Encore ' + n + ' jours';
    },
    req: 'WCAG 2.1 · obligatoire',
    target: 'WCAG 2.2 · notre cible',
    en: 'EN 301 549 · obligatoire',
    copied: 'Copié.',
    copyFail: "La copie n'a pas fonctionné ici. Sélectionnez le texte ci-dessus et copiez-le.",
    months: [
      'janv.',
      'févr.',
      'mars',
      'avr.',
      'mai',
      'juin',
      'juill.',
      'août',
      'sept.',
      'oct.',
      'nov.',
      'déc.',
    ],
    y27: '5 déc. 2027',
    y28: '5 déc. 2028',
  },
};

export const D27_EN = 'New and updated web pages, if we are on the federal public-sector timeline';
export const D27_FR =
  "Pages Web nouvelles et mises à jour, si nous suivons l'échéancier du secteur public fédéral";
export const D28_EN = 'New mobile apps conform; existing public-facing apps are assessed';
export const D28_FR =
  'Les nouvelles applications mobiles sont conformes; les applications publiques existantes sont évaluées';
export const NEXT_EN = 'Next time you open the hub, it opens on your role.';
export const NEXT_FR =
  "La prochaine fois que vous ouvrirez le centre, il s'ouvrira sur votre rôle.";

export const RA_R = {
  dev: {
    en: {
      name: 'Developer',
      blurb: 'Web, iOS and Android code',
      items: [
        [
          '4.1.2 Name, Role, Value',
          'req',
          'Custom controls expose a name, role and state to assistive technology.',
          'Use native elements first. On iOS set accessibilityLabel and traits; in Compose use Modifier.semantics.',
        ],
        [
          '2.1.1 Keyboard',
          'req',
          'Every task works without a mouse or touch.',
          'Includes switch access and external keyboards on iPad and Android.',
        ],
        [
          '1.3.1 Info and Relationships',
          'req',
          'Headings, lists, tables and form labels are in the code, not just the visuals.',
          'Tie every input to its label, and link error messages with aria-describedby.',
        ],
        [
          '2.4.11 Focus Not Obscured (Minimum)',
          'target',
          'Sticky headers and banners never fully hide the focused element.',
          'New in WCAG 2.2. Not yet in CAN/ASC-EN 301 549:2024, but in our build target.',
        ],
        [
          'EN 11.7 User preferences',
          'en',
          "Software follows the platform's text size, contrast and colour settings.",
          'Goes beyond WCAG. Test with Dynamic Type and Android font scale at maximum.',
        ],
      ],
      d27: D27_EN,
      d28: D28_EN,
      note: 'CAN/ASC-EN 301 549:2024 requires WCAG 2.1 AA today. We build to WCAG 2.2 AA, which adds 6 criteria.',
      doTitle: 'Run axe in CI on your repo',
      doSub:
        'Catches common failures, like missing labels and low contrast, on every pull request.',
      doBtn: 'Set it up',
      act: {
        intro:
          'Add an automated accessibility test to your web repo. For native apps, use the platform audits in step 3.',
        steps: [
          'Install the axe package for your test runner.',
          'Add the test below and run it locally.',
          'Native apps: call performAccessibilityAudit() in XCUITest, or enable AccessibilityChecks in Espresso.',
          'Add the test to your CI pipeline so it runs on every pull request.',
        ],
        copyHeading: 'Playwright example',
        copyBtn: 'Copy snippet',
        doneBtn: "I've added it",
      },
      done: {
        title: 'axe now runs on every pull request',
        body: 'New violations of the rules axe checks will fail the build.',
        next: [
          'Automated checks find only part of the issues. Next sprint, test one flow with a keyboard and a screen reader, in English and French.',
          NEXT_EN,
          'Open the engineer checklist before your next release.',
        ],
      },
      nx: {
        title: 'Test one flow with a keyboard and a screen reader',
        sub: 'Automated checks find only part of the issues. This covers the rest for one flow.',
        btn: 'Start the test',
        intro: 'Pick one flow you shipped this sprint, such as sign-in or checkout.',
        steps: [
          'Put the mouse aside. Complete the flow with Tab, Shift+Tab, Enter, Space and the arrow keys.',
          'Turn on a screen reader (NVDA on Windows, VoiceOver on Mac or iOS, TalkBack on Android) and complete it again without looking.',
          'Repeat in the other official language.',
          'Log each issue in Jira with its WCAG number.',
        ],
        doneBtn: "I've tested it",
        doneTitle: 'One flow tested with a keyboard and a screen reader',
        doneBody: 'Log what you found against WCAG numbers so the fixes are tracked.',
      },
    },
    fr: {
      name: 'Développement',
      blurb: 'Code Web, iOS et Android',
      items: [
        [
          '4.1.2 Nom, rôle et valeur',
          'req',
          "Les commandes personnalisées exposent un nom, un rôle et un état aux technologies d'assistance.",
          "Utilisez d'abord les éléments natifs. Sur iOS, définissez accessibilityLabel et les traits; avec Compose, utilisez Modifier.semantics.",
        ],
        [
          '2.1.1 Clavier',
          'req',
          'Chaque tâche fonctionne sans souris ni écran tactile.',
          "Y compris l'accès par contacteur et les claviers externes sur iPad et Android.",
        ],
        [
          '1.3.1 Information et relations',
          'req',
          "Les titres, listes, tableaux et étiquettes de formulaire sont dans le code, pas seulement à l'écran.",
          "Associez chaque champ à son étiquette et liez les messages d'erreur avec aria-describedby.",
        ],
        [
          '2.4.11 Focus non masqué (minimum)',
          'target',
          "Les en-têtes fixes et les bannières ne masquent jamais complètement l'élément qui a le focus.",
          'Nouveau dans les WCAG 2.2. Pas encore dans la CAN/ASC-EN 301 549:2024, mais compris dans notre cible.',
        ],
        [
          "EN 11.7 Préférences de l'utilisateur",
          'en',
          'Le logiciel respecte les réglages de taille du texte, de contraste et de couleur de la plateforme.',
          "Va au-delà des WCAG. Testez avec Dynamic Type et l'échelle de police Android au maximum.",
        ],
      ],
      d27: D27_FR,
      d28: D28_FR,
      note: "La CAN/ASC-EN 301 549:2024 exige les WCAG 2.1 AA aujourd'hui. Nous visons les WCAG 2.2 AA, qui ajoutent 6 critères.",
      doTitle: "Exécutez axe dans l'intégration continue de votre dépôt",
      doSub:
        'Repère les erreurs courantes, comme les étiquettes manquantes et le faible contraste, à chaque demande de tirage.',
      doBtn: 'Configurer',
      act: {
        intro:
          "Ajoutez un test d'accessibilité automatisé à votre dépôt Web. Pour les applications natives, utilisez les audits de la plateforme à l'étape 3.",
        steps: [
          'Installez le module axe pour votre outil de test.',
          'Ajoutez le test ci-dessous et exécutez-le localement.',
          'Applications natives : appelez performAccessibilityAudit() dans XCUITest ou activez AccessibilityChecks dans Espresso.',
          "Ajoutez le test à votre pipeline d'intégration continue pour qu'il s'exécute à chaque demande de tirage.",
        ],
        copyHeading: 'Exemple Playwright',
        copyBtn: "Copier l'extrait",
        doneBtn: "Je l'ai ajouté",
      },
      done: {
        title: "axe s'exécute maintenant à chaque demande de tirage",
        body: 'Toute nouvelle infraction aux règles vérifiées par axe fera échouer la compilation.',
        next: [
          "Les vérifications automatisées ne trouvent qu'une partie des problèmes. Au prochain sprint, testez un parcours au clavier et avec un lecteur d'écran, en français et en anglais.",
          NEXT_FR,
          "Consultez la liste de vérification de l'ingénierie avant votre prochaine version.",
        ],
      },
      nx: {
        title: "Testez un parcours au clavier et avec un lecteur d'écran",
        sub: "Les vérifications automatisées ne trouvent qu'une partie des problèmes. Ce test couvre le reste pour un parcours.",
        btn: 'Commencer le test',
        intro: 'Choisissez un parcours livré pendant ce sprint, comme la connexion ou le paiement.',
        steps: [
          'Mettez la souris de côté. Terminez le parcours avec Tab, Maj+Tab, Entrée, Espace et les flèches.',
          "Activez un lecteur d'écran (NVDA sur Windows, VoiceOver sur Mac ou iOS, TalkBack sur Android) et refaites le parcours sans regarder l'écran.",
          "Recommencez dans l'autre langue officielle.",
          'Consignez chaque problème dans Jira avec son numéro WCAG.',
        ],
        doneBtn: "C'est testé",
        doneTitle: "Un parcours testé au clavier et avec un lecteur d'écran",
        doneBody: 'Consignez vos constats avec les numéros WCAG pour suivre les corrections.',
      },
    },
  },
  po: {
    en: {
      name: 'Product owner',
      blurb: 'Stories, acceptance criteria, releases',
      items: [
        [
          '3.3.1 Error Identification and 3.3.2 Labels or Instructions',
          'req',
          'Every story with a form says how errors are shown and explained.',
          'Acceptance criterion: errors are announced and say how to fix them.',
        ],
        [
          '1.2.2 Captions (Prerecorded) and EN 7.1',
          'en',
          'Any video ships with captions, and the player lets people turn them on.',
          'WCAG covers the captions; EN 301 549 clause 7.1 covers the player controls.',
        ],
        [
          '3.3.8 Accessible Authentication (Minimum)',
          'target',
          'Sign-in never depends on remembering or solving a puzzle. Paste and password managers work.',
          'New in WCAG 2.2. Add it to every sign-in or verification story.',
        ],
        [
          'EN 12.1–12.2 Documentation and support',
          'en',
          'Help pages and support channels for the feature are accessible too.',
          'Goes beyond WCAG. Include help content and support flows in the story scope.',
        ],
      ],
      d27: 'New and updated web pages conform, and a website accessibility statement is published, if we are on the federal public-sector timeline',
      d28: 'Mobile apps, digital documents and purchased products conform; the statement covers apps and documents',
      note: 'Canada Post Accessibility Plan 2026–2028: 67% of digital products are usability-tested with people with disabilities today; the target is 97% by 2028.',
      doTitle: 'Add the release checklist to your next story',
      doSub: 'Paste these acceptance criteria so "done" includes accessibility.',
      doBtn: 'Get the criteria',
      act: {
        intro:
          "Copy the criteria into your next story in Jira. Remove any that don't apply, and keep the references.",
        steps: [
          'Open your next story in Jira.',
          'Paste the criteria into the acceptance criteria field.',
          'Agree at refinement who tests each one: keyboard, screen reader, zoom.',
        ],
        copyHeading: 'Accessibility acceptance criteria',
        copyBtn: 'Copy criteria',
        doneBtn: "I've added it",
      },
      done: {
        title: 'Your next story includes accessibility in "done"',
        body: "At sprint review, the story isn't done until these criteria pass.",
        next: [
          'Track in Jira how many stories include accessibility acceptance criteria.',
          NEXT_EN,
          'Before release, run the release checklist with QA.',
        ],
      },
      nx: {
        title: 'Run the release checklist with QA before your next release',
        sub: 'Check that the story you updated last time meets its accessibility criteria before it ships.',
        btn: 'See the steps',
        intro: 'Book time with QA before the release candidate is cut.',
        steps: [
          'Open the story where you added the accessibility criteria.',
          'Walk through each criterion with QA and mark it pass or fail.',
          'Anything that fails goes back into the sprint, not into the backlog.',
          'Update the accessibility statement if the release changes a public page.',
        ],
        doneBtn: "We've run it",
        doneTitle: 'Release checked against its accessibility criteria',
        doneBody: 'Failures go back into the sprint before release, not after.',
      },
    },
    fr: {
      name: 'Propriétaire de produit',
      blurb: "Récits, critères d'acceptation, versions",
      items: [
        [
          '3.3.1 Identification des erreurs et 3.3.2 Étiquettes ou instructions',
          'req',
          'Chaque récit comportant un formulaire précise comment les erreurs sont signalées et expliquées.',
          "Critère d'acceptation : les erreurs sont annoncées et expliquent comment les corriger.",
        ],
        [
          '1.2.2 Sous-titres (préenregistrés) et EN 7.1',
          'en',
          'Toute vidéo est livrée avec des sous-titres, et le lecteur permet de les activer.',
          "Les WCAG couvrent les sous-titres; l'article 7.1 de l'EN 301 549 couvre les commandes du lecteur.",
        ],
        [
          '3.3.8 Authentification accessible (minimum)',
          'target',
          "La connexion n'exige jamais de mémoriser ni de résoudre une énigme. Le collage et les gestionnaires de mots de passe fonctionnent.",
          'Nouveau dans les WCAG 2.2. Ajoutez-le à chaque récit de connexion ou de vérification.',
        ],
        [
          'EN 12.1–12.2 Documentation et services de soutien',
          'en',
          "Les pages d'aide et les canaux de soutien de la fonctionnalité sont aussi accessibles.",
          "Va au-delà des WCAG. Incluez le contenu d'aide et les parcours de soutien dans la portée du récit.",
        ],
      ],
      d27: "Les pages Web nouvelles et mises à jour sont conformes et un énoncé d'accessibilité du site est publié, si nous suivons l'échéancier du secteur public fédéral",
      d28: "Les applications mobiles, les documents numériques et les produits achetés sont conformes; l'énoncé couvre les applications et les documents",
      note:
        "Plan sur l'accessibilité 2026-2028 de Postes Canada : 67" +
        NB +
        "% des produits numériques sont testés auprès de personnes en situation de handicap aujourd'hui; la cible est de 97" +
        NB +
        "% d'ici 2028.",
      doTitle: 'Ajoutez la liste de vérification de version à votre prochain récit',
      doSub: "Collez ces critères d'acceptation pour que « terminé » inclue l'accessibilité.",
      doBtn: 'Obtenir les critères',
      act: {
        intro:
          "Copiez les critères dans votre prochain récit Jira. Retirez ceux qui ne s'appliquent pas et gardez les références.",
        steps: [
          'Ouvrez votre prochain récit dans Jira.',
          "Collez les critères dans le champ des critères d'acceptation.",
          "Convenez à l'affinage de qui teste chacun : clavier, lecteur d'écran, zoom.",
        ],
        copyHeading: "Critères d'acceptation en accessibilité",
        copyBtn: 'Copier les critères',
        doneBtn: 'Je les ai ajoutés',
      },
      done: {
        title: "Votre prochain récit inclut l'accessibilité dans « terminé »",
        body: "À la revue de sprint, le récit n'est pas terminé tant que ces critères ne sont pas respectés.",
        next: [
          "Suivez dans Jira combien de récits comportent des critères d'acceptation en accessibilité.",
          NEXT_FR,
          "Avant la version, passez la liste de vérification avec l'équipe d'assurance qualité.",
        ],
      },
      nx: {
        title: "Passez la liste de vérification de version avec l'AQ avant votre prochaine version",
        sub: "Vérifiez que le récit mis à jour la dernière fois respecte ses critères d'accessibilité avant sa sortie.",
        btn: 'Voir les étapes',
        intro: "Prévoyez du temps avec l'AQ avant la création de la version candidate.",
        steps: [
          "Ouvrez le récit où vous avez ajouté les critères d'accessibilité.",
          "Passez chaque critère en revue avec l'AQ et indiquez s'il est réussi ou non.",
          'Ce qui échoue retourne dans le sprint, pas dans le carnet de produit.',
          "Mettez à jour l'énoncé d'accessibilité si la version modifie une page publique.",
        ],
        doneBtn: "C'est fait",
        doneTitle: "Version vérifiée selon ses critères d'accessibilité",
        doneBody: 'Les échecs retournent dans le sprint avant la version, pas après.',
      },
    },
  },
  des: {
    en: {
      name: 'Product designer',
      blurb: 'Flows, components, handoff',
      items: [
        [
          '1.4.3 Contrast (Minimum)',
          'req',
          'Text is at least 4.5:1 against its background; large text at least 3:1.',
          'Check every state: hover, focus and error, and both themes if you design a dark mode.',
        ],
        [
          '1.4.11 Non-text Contrast',
          'req',
          'Icons, input borders and focus indicators are at least 3:1.',
          "A light grey input border on white often fails. Mercury's #666666 border passes at 5.7:1.",
        ],
        [
          '2.4.7 Focus Visible',
          'req',
          'Every interactive element has a visible focus state in the design file.',
          'Design it once per component, not per screen, so engineering can reuse it.',
        ],
        [
          '2.5.8 Target Size (Minimum)',
          'target',
          'Targets are at least 24 × 24 px; design to 44 pt on iOS and 48 dp on Android.',
          'New in WCAG 2.2. Not yet in CAN/ASC-EN 301 549:2024, but in our build target.',
        ],
        [
          '1.3.1 Info and Relationships',
          'req',
          'Headings, reading order and labels are annotated so engineering builds the structure you designed.',
          'This is what the "Do this now" action covers.',
        ],
      ],
      d27: 'New and updated web pages conform, if we are on the federal public-sector timeline. Designs for 2027 web releases need to meet it now.',
      d28: D28_EN,
      note: 'WCAG 2.2 adds design decisions such as 2.5.8 Target Size and 2.4.11 Focus Not Obscured. CAN/ASC-EN 301 549:2024 requires WCAG 2.1 AA today; we build to 2.2 AA.',
      doTitle: 'Annotate focus order and accessible names in your next handoff',
      doSub:
        'Engineering builds what the annotations say, so issues get fixed in design instead of found at QA.',
      doBtn: 'Get the checklist',
      act: {
        intro: 'Add these annotations to the frames you hand off this sprint.',
        steps: [
          'Number the focus order on each screen.',
          'Write the accessible name for every icon-only control, in English and French.',
          'Mark heading levels and landmarks: header, navigation, main.',
          'For dialogs and menus, note where focus goes when they open and close.',
        ],
        copyHeading: 'Handoff annotation checklist',
        copyBtn: 'Copy checklist',
        doneBtn: "I've annotated it",
      },
      done: {
        title: 'Your next handoff includes accessibility annotations',
        body: 'Engineering can build focus order, names and structure as designed instead of guessing.',
        next: [
          'At design review, check contrast in every state with Stark or the Colour Contrast Analyser.',
          NEXT_EN,
          'Ask QA which issues still reach them, and add those to your annotation checklist.',
        ],
      },
      nx: {
        title: 'Check contrast in every state for one component',
        sub: 'States other than the default are easy to miss in contrast checks.',
        btn: 'Start the check',
        intro: 'Pick one component from your current work, such as a button, input or tab.',
        steps: [
          'List every state: default, hover, focus, selected, error.',
          'Check text in each state at 4.5:1, and icons, borders and focus rings at 3:1.',
          'Fix failures in the component, not the screen, so every use inherits the fix.',
          "Note the ratios in the component's documentation.",
        ],
        doneBtn: "I've checked it",
        doneTitle: 'One component checked in every state',
        doneBody: 'Every screen that uses it inherits the fix.',
      },
    },
    fr: {
      name: 'Design de produits',
      blurb: 'Parcours, composants, transfert',
      items: [
        [
          '1.4.3 Contraste (minimum)',
          'req',
          "Le texte a un contraste d'au moins 4,5:1 avec l'arrière-plan; le grand texte, d'au moins 3:1.",
          'Vérifiez chaque état : survol, focus et erreur, et les deux thèmes si vous concevez un mode sombre.',
        ],
        [
          '1.4.11 Contraste du contenu non textuel',
          'req',
          "Les icônes, les bordures de champ et les indicateurs de focus ont un contraste d'au moins 3:1.",
          'Une bordure de champ gris pâle sur fond blanc échoue souvent. La bordure #666666 de Mercury réussit, à 5,7:1.',
        ],
        [
          '2.4.7 Visibilité du focus',
          'req',
          'Chaque élément interactif a un état de focus visible dans le fichier de conception.',
          "Concevez-le une fois par composant, et non par écran, pour que l'ingénierie puisse le réutiliser.",
        ],
        [
          '2.5.8 Taille de la cible (minimum)',
          'target',
          'Les cibles mesurent au moins 24 × 24 px; visez 44 pt sur iOS et 48 dp sur Android.',
          'Nouveau dans les WCAG 2.2. Pas encore dans la CAN/ASC-EN 301 549:2024, mais compris dans notre cible.',
        ],
        [
          '1.3.1 Information et relations',
          'req',
          "Les titres, l'ordre de lecture et les étiquettes sont annotés pour que l'ingénierie construise la structure prévue.",
          "C'est l'objet de l'action « À faire maintenant ».",
        ],
      ],
      d27: "Les pages Web nouvelles et mises à jour sont conformes, si nous suivons l'échéancier du secteur public fédéral. Les maquettes des versions Web de 2027 doivent déjà y répondre.",
      d28: D28_FR,
      note: "Les WCAG 2.2 ajoutent des décisions de conception, comme 2.5.8 Taille de la cible et 2.4.11 Focus non masqué. La CAN/ASC-EN 301 549:2024 exige les WCAG 2.1 AA aujourd'hui; nous visons les WCAG 2.2 AA.",
      doTitle: "Annotez l'ordre du focus et les noms accessibles dans votre prochain transfert",
      doSub:
        "L'ingénierie construit ce que disent les annotations : les problèmes sont réglés à la conception plutôt que découverts en AQ.",
      doBtn: 'Obtenir la liste',
      act: {
        intro: 'Ajoutez ces annotations aux maquettes que vous transférez pendant ce sprint.',
        steps: [
          "Numérotez l'ordre du focus sur chaque écran.",
          'Rédigez le nom accessible de chaque commande à icône seule, en français et en anglais.',
          'Indiquez les niveaux de titre et les repères : en-tête, navigation, contenu principal.',
          "Pour les boîtes de dialogue et les menus, notez où va le focus à l'ouverture et à la fermeture.",
        ],
        copyHeading: "Liste d'annotations pour le transfert",
        copyBtn: 'Copier la liste',
        doneBtn: "C'est annoté",
      },
      done: {
        title: "Votre prochain transfert inclut des annotations d'accessibilité",
        body: "L'ingénierie peut construire l'ordre du focus, les noms et la structure comme prévu, sans deviner.",
        next: [
          'À la revue de conception, vérifiez le contraste de chaque état avec Stark ou Colour Contrast Analyser.',
          NEXT_FR,
          "Demandez à l'AQ quels problèmes leur parviennent encore et ajoutez-les à votre liste d'annotations.",
        ],
      },
      nx: {
        title: "Vérifiez le contraste de chaque état d'un composant",
        sub: "Les états autres que l'état par défaut sont faciles à oublier lors des vérifications de contraste.",
        btn: 'Commencer la vérification',
        intro:
          'Choisissez un composant de votre travail en cours, comme un bouton, un champ ou un onglet.',
        steps: [
          'Énumérez chaque état : par défaut, survol, focus, sélectionné, erreur.',
          'Vérifiez le texte de chaque état à 4,5:1, et les icônes, bordures et anneaux de focus à 3:1.',
          "Corrigez les échecs dans le composant, pas dans l'écran, pour que chaque utilisation en profite.",
          'Notez les rapports dans la documentation du composant.',
        ],
        doneBtn: "C'est vérifié",
        doneTitle: 'Un composant vérifié dans chaque état',
        doneBody: "Chaque écran qui l'utilise profite de la correction.",
      },
    },
  },
  qa: {
    en: {
      name: 'QA analyst',
      blurb: 'Test plans across web, iOS and Android',
      items: [
        [
          'WCAG-EM evaluation method',
          '',
          'One method to scope, sample and report across web, iOS and Android.',
          "W3C's WCAG-EM: define the scope, explore, pick a representative sample, audit, report.",
        ],
        [
          'A screen reader per platform',
          '',
          'NVDA or JAWS with Chrome or Firefox on Windows, VoiceOver on Mac and iOS, TalkBack on Android.',
          "Test in English and French, with the screen reader's language set to match the page.",
        ],
        [
          'EN 301 549 clauses 7, 11 and 12',
          'en',
          'Video player controls, software that honours user settings, and accessible help and support.',
          'These go beyond WCAG and are part of the Canadian standard the regulations require.',
        ],
        [
          '2.4.11 Focus Not Obscured (Minimum)',
          'target',
          'Sticky headers, banners and chat widgets never fully hide the focused element.',
          'New in WCAG 2.2, in our build target.',
        ],
      ],
      d27: D27_EN,
      d28: D28_EN,
      note: 'Test to WCAG 2.2 AA plus the EN 301 549 clauses beyond WCAG. CAN/ASC-EN 301 549:2024 requires WCAG 2.1 AA today.',
      doTitle: 'Run the five-minute manual pass on one flow',
      doSub: "Five quick checks that automated tools can't do.",
      doBtn: 'Start the pass',
      act: {
        intro: "Pick one flow from this sprint's test plan.",
        steps: [
          'Tab through the whole flow. Every control is reachable and focus is always visible.',
          'Turn on a screen reader and complete the main task without looking.',
          'Zoom to 200%, or set the largest text size on mobile.',
          'Turn on reduced motion and dark mode, and check nothing breaks.',
          'Log each issue with its WCAG criterion or EN 301 549 clause and a severity.',
        ],
        doneBtn: "I've run it",
      },
      done: {
        title: 'One flow checked by hand',
        body: 'Logged issues carry their WCAG or EN reference, so they can be tracked to a fix.',
        next: [
          'Add the five checks to your regression plan for every release.',
          NEXT_EN,
          "Share the issues you keep finding with design, so they're caught earlier.",
        ],
      },
      nx: {
        title: 'Add the release checklist to your test plan',
        sub: 'So every release gets the same checks on web, iOS and Android.',
        btn: 'See the steps',
        intro: 'Use the Before release checklist in this hub.',
        steps: [
          'Open Checklists and copy the Before release items into your test plan template.',
          'Add one row per platform: web, iOS, Android.',
          'Agree with the product owner that failures block the release.',
        ],
        doneBtn: "I've added it",
        doneTitle: 'The release checklist is in your test plan',
        doneBody: 'Every release now gets the same accessibility checks.',
      },
    },
    fr: {
      name: 'Assurance qualité',
      blurb: 'Plans de test Web, iOS et Android',
      items: [
        [
          "Méthode d'évaluation WCAG-EM",
          '',
          'Une seule méthode pour délimiter, échantillonner et rendre compte, sur le Web, iOS et Android.',
          'WCAG-EM du W3C : définir la portée, explorer, choisir un échantillon représentatif, auditer, rendre compte.',
        ],
        [
          "Un lecteur d'écran par plateforme",
          '',
          'NVDA ou JAWS avec Chrome ou Firefox sous Windows, VoiceOver sur Mac et iOS, TalkBack sur Android.',
          "Testez en français et en anglais, avec la langue du lecteur d'écran réglée selon la page.",
        ],
        [
          "Articles 7, 11 et 12 de l'EN 301 549",
          'en',
          "Commandes du lecteur vidéo, logiciels qui respectent les réglages de l'utilisateur, aide et soutien accessibles.",
          'Ces exigences vont au-delà des WCAG et font partie de la norme canadienne exigée par le règlement.',
        ],
        [
          '2.4.11 Focus non masqué (minimum)',
          'target',
          "Les en-têtes fixes, les bannières et les fenêtres de clavardage ne masquent jamais complètement l'élément qui a le focus.",
          'Nouveau dans les WCAG 2.2, compris dans notre cible.',
        ],
      ],
      d27: D27_FR,
      d28: D28_FR,
      note: "Testez selon les WCAG 2.2 AA et les articles de l'EN 301 549 qui vont au-delà des WCAG. La CAN/ASC-EN 301 549:2024 exige les WCAG 2.1 AA aujourd'hui.",
      doTitle: 'Faites la vérification manuelle de cinq minutes sur un parcours',
      doSub: 'Cinq vérifications rapides que les outils automatisés ne peuvent pas faire.',
      doBtn: 'Commencer',
      act: {
        intro: 'Choisissez un parcours du plan de test de ce sprint.',
        steps: [
          'Parcourez tout le parcours avec la touche Tab. Chaque commande est accessible et le focus est toujours visible.',
          "Activez un lecteur d'écran et terminez la tâche principale sans regarder l'écran.",
          'Zoomez à 200' + NB + '% ou choisissez la plus grande taille de texte sur mobile.',
          'Activez la réduction des animations et le mode sombre, et vérifiez que rien ne se brise.',
          "Consignez chaque problème avec son critère WCAG ou son article de l'EN 301 549, et sa gravité.",
        ],
        doneBtn: "C'est fait",
      },
      done: {
        title: 'Un parcours vérifié à la main',
        body: 'Les problèmes consignés portent leur référence WCAG ou EN, ce qui permet de suivre leur correction.',
        next: [
          'Ajoutez les cinq vérifications à votre plan de régression pour chaque version.',
          NEXT_FR,
          "Communiquez à l'équipe de conception les problèmes qui reviennent, pour qu'ils soient repérés plus tôt.",
        ],
      },
      nx: {
        title: 'Ajoutez la liste de vérification de version à votre plan de test',
        sub: 'Pour que chaque version reçoive les mêmes vérifications sur le Web, iOS et Android.',
        btn: 'Voir les étapes',
        intro: 'Utilisez la liste « Before release » de la section Checklists de ce centre.',
        steps: [
          'Ouvrez Checklists et copiez les éléments « Before release » dans votre modèle de plan de test.',
          'Ajoutez une ligne par plateforme : Web, iOS, Android.',
          'Convenez avec le propriétaire de produit que les échecs bloquent la version.',
        ],
        doneBtn: "C'est ajouté",
        doneTitle: 'La liste de vérification de version est dans votre plan de test',
        doneBody: "Chaque version reçoit maintenant les mêmes vérifications d'accessibilité.",
      },
    },
  },
  proc: {
    en: {
      name: 'Procurement',
      blurb: 'Buying software and services',
      items: [
        [
          'Purchased products are in scope from 5 Dec 2028',
          '',
          'The public sector and large businesses must check the apps and web pages they buy.',
          'From the Accessible Canada Regulations, amended December 2025.',
        ],
        [
          'Ask for a report against EN 301 549',
          'en',
          'Request an Accessibility Conformance Report against EN 301 549, not WCAG alone.',
          'Use the ITI VPAT EU or INT edition. A WCAG-only report leaves out clauses 6, 7, 11 and 12.',
        ],
        [
          'Remediation in the contract',
          '',
          'Write fix timelines for known issues into the contract.',
          "Canada Post's plan gives internal software that doesn't meet WCAG 2.1 AA 24 months from contract signature to be fixed.",
        ],
      ],
      d27: 'Federal public sector web pages; purchased products follow in 2028',
      d28: 'Purchased apps and web pages must be checked (public sector and businesses with 500+ employees)',
      note: 'Keep conformance reports on file: the regulations require records to be kept for four years.',
      doTitle: 'Add a conformance report request to your next RFP',
      doSub: 'Vendors then show how they meet EN 301 549 before you buy.',
      doBtn: 'Get the wording',
      act: {
        intro: 'Paste this into the requirements section of your next request for proposal.',
        steps: [
          'Paste the wording below into the RFP and set the agreed period.',
          'Score the report in your evaluation, not just whether one was provided.',
          'Ask the Accessibility office to review reports for high-risk purchases.',
        ],
        copyHeading: 'RFP accessibility requirements',
        copyBtn: 'Copy wording',
        doneBtn: "I've added it",
      },
      done: {
        title: 'Your next RFP asks for accessibility',
        body: 'Vendors will have to show how their product meets EN 301 549.',
        next: [
          'Add the conformance report to your evaluation grid.',
          NEXT_EN,
          'Keep the reports on file for four years.',
        ],
      },
      nx: {
        title: "Review one current vendor's conformance report",
        sub: 'Start with the product the public uses most.',
        btn: 'See the steps',
        intro: 'Pick one product already under contract.',
        steps: [
          'Ask the vendor for their latest conformance report against EN 301 549.',
          'Note every row marked "Does not support" or "Partially supports".',
          'Ask for a remediation plan with dates for each one.',
        ],
        doneBtn: "I've asked",
        doneTitle: 'Vendor review started',
        doneBody: "Track the vendor's remediation dates alongside the contract.",
      },
    },
    fr: {
      name: 'Approvisionnement',
      blurb: 'Achat de logiciels et de services',
      items: [
        [
          'Les produits achetés sont visés à compter du 5 déc. 2028',
          '',
          "Le secteur public et les grandes entreprises doivent vérifier les applications et les pages Web qu'ils achètent.",
          "Selon le Règlement canadien sur l'accessibilité, modifié en décembre 2025.",
        ],
        [
          "Demandez un rapport selon l'EN 301 549",
          'en',
          "Exigez un rapport de conformité en accessibilité selon l'EN 301 549, pas seulement selon les WCAG.",
          "Utilisez le VPAT de l'ITI, édition EU ou INT. Un rapport limité aux WCAG omet les articles 6, 7, 11 et 12.",
        ],
        [
          'Des corrections inscrites au contrat',
          '',
          'Inscrivez au contrat les délais de correction des problèmes connus.',
          'Le plan de Postes Canada accorde 24 mois après la signature du contrat pour corriger un logiciel interne qui ne respecte pas les WCAG 2.1 AA.',
        ],
      ],
      d27: 'Pages Web du secteur public fédéral; les produits achetés suivent en 2028',
      d28: 'Les applications et pages Web achetées doivent être vérifiées (secteur public et entreprises de 500 employés ou plus)',
      note: 'Conservez les rapports de conformité : le règlement exige de garder les dossiers pendant quatre ans.',
      doTitle: "Ajoutez une demande de rapport de conformité à votre prochain appel d'offres",
      doSub: "Les fournisseurs montrent alors comment ils respectent l'EN 301 549 avant l'achat.",
      doBtn: 'Obtenir le libellé',
      act: {
        intro: "Collez ce texte dans la section des exigences de votre prochain appel d'offres.",
        steps: [
          "Collez le libellé ci-dessous dans l'appel d'offres et précisez le délai convenu.",
          'Notez le rapport dans votre évaluation, et pas seulement sa présence.',
          "Demandez au bureau de l'accessibilité d'examiner les rapports des achats à risque élevé.",
        ],
        copyHeading: "Exigences d'accessibilité pour l'appel d'offres",
        copyBtn: 'Copier le libellé',
        doneBtn: "Je l'ai ajouté",
      },
      done: {
        title: "Votre prochain appel d'offres exige l'accessibilité",
        body: "Les fournisseurs devront montrer comment leur produit respecte l'EN 301 549.",
        next: [
          "Ajoutez le rapport de conformité à votre grille d'évaluation.",
          NEXT_FR,
          'Conservez les rapports pendant quatre ans.',
        ],
      },
      nx: {
        title: "Examinez le rapport de conformité d'un fournisseur actuel",
        sub: 'Commencez par le produit le plus utilisé par le public.',
        btn: 'Voir les étapes',
        intro: 'Choisissez un produit déjà sous contrat.',
        steps: [
          "Demandez au fournisseur son plus récent rapport de conformité selon l'EN 301 549.",
          'Relevez chaque ligne marquée « Ne prend pas en charge » ou « Prend partiellement en charge ».',
          'Demandez un plan de correction daté pour chacune.',
        ],
        doneBtn: "C'est demandé",
        doneTitle: 'Examen du fournisseur amorcé',
        doneBody: 'Suivez les dates de correction du fournisseur avec le contrat.',
      },
    },
  },
  lead: {
    en: {
      name: 'Leadership',
      blurb: 'Deadlines, risk and progress',
      items: [
        [
          'Which ACA timeline applies to us',
          '',
          'Some Crown corporations follow the public-sector timeline (2027), a year before businesses (2028).',
          'Until it is confirmed, plan to the earlier date.',
        ],
        [
          '67% → 97% by 2028',
          '',
          'Share of digital products usability-tested with people with disabilities, now and the target.',
          'Canada Post Accessibility Plan 2026–2028.',
        ],
        [
          'One action per team, each sprint',
          '',
          'Developers, designers, product owners, QA and procurement each get one thing to do in this hub.',
          'Ask leads which action their team has completed.',
        ],
      ],
      d27: D27_EN,
      d28: 'Mobile apps, digital documents and purchased products',
      note: 'Accessibility statements must be updated every year, and records kept for four years.',
      doTitle: 'Confirm our Accessible Canada Act timeline with the Accessibility office',
      doSub: "Every team's 2027 plan depends on which deadline applies.",
      doBtn: 'Get the request',
      act: {
        intro: 'Send this request to the Accessibility office.',
        steps: [
          'Copy the request below.',
          'Send it to accessibility@canadapost.ca.',
          'Share the answer with product and engineering leads.',
        ],
        copyHeading: 'Request',
        copyBtn: 'Copy request',
        doneBtn: "I've sent it",
      },
      done: {
        title: 'Timeline request sent',
        body: 'Once you have the answer, every team can plan to the same date.',
        next: [
          'Plan to 5 December 2027, the earlier date, until you hear back.',
          NEXT_EN,
          'Share the answer with product and engineering leads.',
        ],
      },
      nx: {
        title: 'Ask each team which action they have completed',
        sub: 'A quick read on where accessibility stands this sprint.',
        btn: 'See the steps',
        intro: 'Use your next leads meeting.',
        steps: [
          'Ask each lead which "Do this now" their team has done.',
          'Note the gaps by role.',
          'Agree on one owner per gap before the next sprint.',
        ],
        doneBtn: "I've asked",
        doneTitle: 'Team check-in done',
        doneBody: 'Each gap has an owner going into the next sprint.',
      },
    },
    fr: {
      name: 'Direction',
      blurb: 'Échéances, risques et progrès',
      items: [
        [
          "Quel échéancier de la LCA s'applique à nous",
          '',
          "Certaines sociétés d'État suivent l'échéancier du secteur public (2027), un an avant les entreprises (2028).",
          "Tant que ce n'est pas confirmé, planifiez selon la date la plus proche.",
        ],
        [
          '67' + NB + '% → 97' + NB + "% d'ici 2028",
          '',
          "Part des produits numériques testés auprès de personnes en situation de handicap, aujourd'hui et la cible.",
          "Plan sur l'accessibilité 2026-2028 de Postes Canada.",
        ],
        [
          'Une action par équipe, à chaque sprint',
          '',
          "Le développement, la conception, les propriétaires de produit, l'AQ et l'approvisionnement ont chacun une chose à faire dans ce centre.",
          'Demandez aux responsables quelle action leur équipe a terminée.',
        ],
      ],
      d27: D27_FR,
      d28: 'Applications mobiles, documents numériques et produits achetés',
      note: "Les énoncés d'accessibilité doivent être mis à jour chaque année et les dossiers conservés pendant quatre ans.",
      doTitle:
        "Confirmez notre échéancier de la Loi canadienne sur l'accessibilité auprès du bureau de l'accessibilité",
      doSub: "Le plan 2027 de chaque équipe dépend de l'échéance qui s'applique.",
      doBtn: 'Obtenir la demande',
      act: {
        intro: "Envoyez cette demande au bureau de l'accessibilité.",
        steps: [
          'Copiez la demande ci-dessous.',
          'Envoyez-la à accessibilite@postescanada.ca.',
          "Communiquez la réponse aux responsables des produits et de l'ingénierie.",
        ],
        copyHeading: 'Demande',
        copyBtn: 'Copier la demande',
        doneBtn: "Je l'ai envoyée",
      },
      done: {
        title: "Demande d'échéancier envoyée",
        body: 'Une fois la réponse reçue, toutes les équipes pourront planifier selon la même date.',
        next: [
          'Planifiez selon le 5 décembre 2027, la date la plus proche, en attendant la réponse.',
          NEXT_FR,
          "Communiquez la réponse aux responsables des produits et de l'ingénierie.",
        ],
      },
      nx: {
        title: 'Demandez à chaque équipe quelle action elle a terminée',
        sub: "Un aperçu rapide de l'état de l'accessibilité pendant ce sprint.",
        btn: 'Voir les étapes',
        intro: 'Profitez de votre prochaine réunion des responsables.',
        steps: [
          'Demandez à chaque responsable quelle action « À faire maintenant » son équipe a réalisée.',
          'Relevez les lacunes par rôle.',
          'Désignez un responsable par lacune avant le prochain sprint.',
        ],
        doneBtn: "C'est demandé",
        doneTitle: 'Suivi des équipes fait',
        doneBody: 'Chaque lacune a un responsable pour le prochain sprint.',
      },
    },
  },
};

export const RA_COPY = {
  dev: {
    en: "import { test, expect } from '@playwright/test';\nimport AxeBuilder from '@axe-core/playwright';\n\ntest('home page has no detectable accessibility violations', async ({ page }) => {\n  await page.goto('/');\n  const results = await new AxeBuilder({ page })\n    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'])\n    .analyze();\n  expect(results.violations).toEqual([]);\n});",
  },
  po: {
    en: 'Accessibility acceptance criteria\n- Works with a keyboard only, in a logical order (WCAG 2.1.1, 2.4.3)\n- Every control has a visible label and an accessible name (WCAG 1.3.1, 4.1.2)\n- Text contrast is at least 4.5:1 (WCAG 1.4.3)\n- Errors are announced and explain how to fix them (WCAG 3.3.1, 3.3.3)\n- Works at 200% text size and in landscape (WCAG 1.4.4, 1.3.4)\n- Sign-in allows paste and password managers (WCAG 2.2: 3.3.8)\n- Tested with a screen reader in English and French\n- Videos captioned; help content accessible (EN 301 549: 7.1, 12)',
    fr:
      "Critères d'acceptation en accessibilité\n- Fonctionne au clavier seulement, dans un ordre logique (WCAG 2.1.1, 2.4.3)\n- Chaque commande a une étiquette visible et un nom accessible (WCAG 1.3.1, 4.1.2)\n- Le contraste du texte est d'au moins 4,5:1 (WCAG 1.4.3)\n- Les erreurs sont annoncées et expliquent comment les corriger (WCAG 3.3.1, 3.3.3)\n- Fonctionne à 200" +
      NB +
      "% de taille de texte et en mode paysage (WCAG 1.4.4, 1.3.4)\n- La connexion permet le collage et les gestionnaires de mots de passe (WCAG 2.2 : 3.3.8)\n- Testé avec un lecteur d'écran en français et en anglais\n- Vidéos sous-titrées; contenu d'aide accessible (EN 301 549 : 7.1, 12)",
  },
  des: {
    en: 'Handoff annotations (accessibility)\n- Focus order numbered on every screen (WCAG 2.4.3)\n- Accessible name for every icon-only control, English and French (WCAG 4.1.2)\n- Heading levels and landmarks marked (WCAG 1.3.1)\n- Focus state shown for every interactive component (WCAG 2.4.7)\n- Dialogs and menus: where focus goes on open and close (WCAG 2.4.3)\n- Targets at least 44 pt / 48 dp; never under 24 px (WCAG 2.5.8)\n- Text 4.5:1; icons, borders and focus rings 3:1, in every state (WCAG 1.4.3, 1.4.11)\n- Error messages say what went wrong and how to fix it (WCAG 3.3.1, 3.3.3)',
    fr: "Annotations de transfert (accessibilité)\n- Ordre du focus numéroté sur chaque écran (WCAG 2.4.3)\n- Nom accessible pour chaque commande à icône seule, en français et en anglais (WCAG 4.1.2)\n- Niveaux de titre et repères indiqués (WCAG 1.3.1)\n- État de focus montré pour chaque composant interactif (WCAG 2.4.7)\n- Boîtes de dialogue et menus : où va le focus à l'ouverture et à la fermeture (WCAG 2.4.3)\n- Cibles d'au moins 44 pt / 48 dp; jamais moins de 24 px (WCAG 2.5.8)\n- Texte 4,5:1; icônes, bordures et anneaux de focus 3:1, dans chaque état (WCAG 1.4.3, 1.4.11)\n- Les messages d'erreur indiquent le problème et comment le corriger (WCAG 3.3.1, 3.3.3)",
  },
  proc: {
    en: 'Accessibility requirements\n- Provide an Accessibility Conformance Report (ITI VPAT 2.5, EU or INT edition) against EN 301 549 for every product and version in scope.\n- Identify any criteria not supported, with a remediation plan and dates.\n- Confirm that fixes for reported issues will be delivered within [AGREED PERIOD] of contract signature.\n- Provide a contact for accessibility issues raised after delivery.',
    fr: "Exigences d'accessibilité\n- Fournir un rapport de conformité en accessibilité (VPAT 2.5 de l'ITI, édition EU ou INT) selon l'EN 301 549 pour chaque produit et version visés.\n- Indiquer les critères non pris en charge, avec un plan de correction et des dates.\n- Confirmer que les corrections des problèmes signalés seront livrées dans un délai de [DÉLAI CONVENU] après la signature du contrat.\n- Fournir une personne-ressource pour les problèmes d'accessibilité signalés après la livraison.",
  },
  lead: {
    en: 'Subject: Which Accessible Canada Act timeline applies to us?\n\nHi,\n\nThe digital requirements in the Accessible Canada Regulations give the federal public sector until 5 December 2027 to make new and updated web pages conform to CAN/ASC-EN 301 549. Federally regulated businesses have until 5 December 2028. Some Crown corporations are in the public-sector group.\n\nCan you confirm which timeline applies to our public-facing websites and apps? Our 2027 roadmaps depend on the answer.\n\nThanks,\n[YOUR NAME], [YOUR TEAM]',
    fr:
      'Objet' +
      NB +
      ": Quel échéancier de la Loi canadienne sur l'accessibilité s'applique à nous" +
      NB +
      "?\n\nBonjour,\n\nLes exigences numériques du Règlement canadien sur l'accessibilité donnent au secteur public fédéral jusqu'au 5 décembre 2027 pour rendre les pages Web nouvelles et mises à jour conformes à la CAN/ASC-EN 301 549. Les entreprises sous réglementation fédérale ont jusqu'au 5 décembre 2028. Certaines sociétés d'État font partie du secteur public.\n\nPouvez-vous confirmer quel échéancier s'applique à nos sites Web et applications publics" +
      NB +
      '? Nos feuilles de route de 2027 en dépendent.\n\nMerci,\n[VOTRE NOM], [VOTRE ÉQUIPE]',
  },
};

export const RA_PLURAL = {
  en: {
    dev: 'developers',
    po: 'product owners',
    des: 'product designers',
    qa: 'QA analysts',
    proc: 'procurement',
    lead: 'leadership',
  },
  fr: {
    dev: 'le développement',
    po: 'les propriétaires de produit',
    des: 'le design de produits',
    qa: "l'assurance qualité",
    proc: "l'approvisionnement",
    lead: 'la direction',
  },
};
