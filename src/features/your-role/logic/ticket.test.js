// Unit tests for ticket and checklist text.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { hubLink, roleFromSearch, detailLines, ticketText, checklistText } from './ticket.js';

const BASE = 'https://example.github.io/hub/';
const RA_IDS = ['dev', 'qa'];
const L = {
  prefix: 'Accessibility',
  why: 'Why',
  byWhen: 'By when',
  doneWhen: 'Done when',
  details: 'Details',
  more: 'Requirements, deadlines and how-to',
  from: 'From the Accessible by Default hub',
};

test('link back opens the hub on the role, and says where it came from', () => {
  assert.equal(
    hubLink(BASE, 'dev', 'ticket'),
    'https://example.github.io/hub/?role=dev&src=ticket#role',
  );
  assert.equal(roleFromSearch('?role=qa&src=ticket', RA_IDS), 'qa');
  assert.equal(roleFromSearch('?role=hacker', RA_IDS), null);
  assert.equal(roleFromSearch('', RA_IDS), null);
});

test('details: code block, checkboxes or a quoted draft', () => {
  assert.deepEqual(detailLines('a\nb', 'code', 'ts'), ['```ts', 'a', 'b', '```']);
  assert.deepEqual(detailLines('Heading\n- one\n- two', 'list'), [
    '**Heading**',
    '- [ ] one',
    '- [ ] two',
  ]);
  assert.deepEqual(detailLines('Hi,\n\nThanks', 'text'), ['> Hi,', '>', '> Thanks']);
  assert.deepEqual(detailLines('', 'list'), []);
});

test('a ticket has the action, why, by when, checkboxes and the link back', () => {
  const t = ticketText({
    L,
    title: 'Run axe in CI',
    why: 'Catches failures early.',
    byWhen: '5 Dec 2027',
    steps: ['Install it', 'Add the test'],
    details: detailLines('x()', 'code', 'ts'),
    link: 'LINK',
  });
  assert.equal(
    t,
    [
      'Accessibility: Run axe in CI',
      '',
      '**Why:** Catches failures early.',
      '**By when:** 5 Dec 2027',
      '',
      '**Done when:**',
      '- [ ] Install it',
      '- [ ] Add the test',
      '',
      '**Details:**',
      '```ts',
      'x()',
      '```',
      '',
      'Requirements, deadlines and how-to: LINK',
    ].join('\n'),
  );
});

test('a checklist is a heading, the intro, one checkbox per item and the link back', () => {
  const dod = { title: 'Test checklist', intro: 'Run these.', items: ['One', 'Two'] };
  assert.equal(
    checklistText({ L, dod, link: 'LINK' }),
    '## Test checklist\n\nRun these.\n\n- [ ] One\n- [ ] Two\n\nFrom the Accessible by Default hub: LINK',
  );
});
