// Text for the Analytics page.
export const ANALYTICS_COPY = {
  heading: 'Analytics',
  intro:
    'How people use the hub: visitors, page views, time spent and bounce rate, counted anonymously. Updated live.',
  rangeLabel: 'Period',
  rangeOption: (d) => `Last ${d} days`,
  updated: 'Updated',
  refresh: 'Refresh',
  loading: 'Loading analytics…',
  checking: 'Checking whether you’re signed in…',
  error: "We couldn't load analytics. Check your connection and try again.",
  authCheckFail: "We couldn't check whether you're signed in. Check your connection and try again.",
  unavailable:
    'Analytics need the hub at its own web address, where it can reach the database. This copy runs offline.',
  signedOutTitle: 'Sign in to see analytics',
  signedOutMessage: 'The figures are for the hub team, so they’re shown to signed-in people only.',
  getStarted: 'Get started',
  emptyTitle: (d) => `No visits recorded in the last ${d} days`,
  emptyMessage:
    'Visits are counted from the moment analytics went live. Share the hub with colleagues and check back.',
  copyLink: 'Copy the hub link',
  copied: 'Link copied.',
  copyFailed: 'The link above is selected: press Ctrl+C (or ⌘C) to copy it.',
  showLonger: 'Show the last 90 days',
  tilesHeading: 'Summary',
  trendHeading: 'Visitors and page views per day',
  trendSummary: (d, views, visitors) =>
    `Line chart for the last ${d} days: ${views} page views and ${visitors} visitors in total. The table below the chart has every day's figures.`,
  series: { page_views: 'Page views', visitors: 'Visitors' },
  showTable: 'Show the figures as a table',
  day: 'Day',
  pagesHeading: 'Pages',
  page: 'Page',
  pageViews: 'Page views',
  visitors: 'Visitors',
  avgTime: 'Avg. time on page',
  howHeading: 'How these are counted',
  how: [
    [
      'Visitors',
      'Different browsers. Each browser keeps a random id; no names, emails or IP addresses are stored.',
    ],
    ['Page views', 'Each time a page of the hub is opened.'],
    [
      'Visit',
      'A run of page views from one browser. A visit ends after 30 minutes with no page views.',
    ],
    ['Views per visit', 'Page views divided by visits.'],
    [
      'Avg. visit duration',
      'Time the hub was on screen during a visit (a hidden tab doesn’t count), averaged over visits. Each page counts up to 30 minutes.',
    ],
    ['Bounce rate', 'Share of visits that saw only one page.'],
    [
      'Not counted',
      'Test runs, local development, and browsers that send “Do Not Track” or Global Privacy Control.',
    ],
  ],
  tz: 'Days run midnight to midnight, Toronto time.',
};
