// Unit tests for the Your role rules: profile, visits, actions and What's new.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { DAY } from '../../../shared/logic/dates.js';
import {
  validProfile,
  startVisit,
  firstScreen,
  chooseRole,
  markActionDone,
  actionsFor,
  nextStep,
} from './profile.js';
import { whatsNewFor } from './whatsNew.js';

const NOW = Date.parse('2026-11-12T12:00:00Z');

test('a profile with an unknown role is ignored', () => {
  assert.equal(validProfile({ role: 'astronaut' }, ['dev']), null);
  assert.deepEqual(validProfile({ role: 'dev' }, ['dev']).actions, {});
});

test('a new session moves lastVisit to prevVisit and opens Welcome back', () => {
  const p = { role: 'dev', actions: {}, lastVisit: NOW - 14 * DAY };
  const visited = startVisit(p, true, NOW);
  assert.equal(visited.prevVisit, NOW - 14 * DAY);
  assert.equal(visited.lastVisit, NOW);
  assert.equal(firstScreen(visited), 'return');
  assert.equal(startVisit(p, false, NOW), p);
  assert.equal(firstScreen(null), 'picker');
});

test('actions move from Do this now, to Do this next, to all done', () => {
  let p = chooseRole(null, 'po', 'fr', NOW);
  assert.equal(firstScreen(p), 'role');
  assert.equal(nextStep(actionsFor(p)), 'do');
  p = markActionDone(p, 'do', NOW);
  assert.equal(nextStep(actionsFor(p)), 'next');
  p = markActionDone(p, 'next', NOW);
  assert.equal(nextStep(actionsFor(p)), 'allDone');
});

test("What's new: only items after the last visit whose topic maps to the role", () => {
  const news = [
    { date: '2026-11-01', label: '1 Nov', title: 'A', topic: 'mobile' },
    { date: '2026-11-05', label: '5 Nov', title: 'B', topic: 'law' },
    { date: '2026-09-01', label: '1 Sep', title: 'C', topic: 'mobile' },
  ];
  const topics = { mobile: ['dev'], law: ['proc'] };
  const since = Date.parse('2026-10-01');
  assert.deepEqual(
    whatsNewFor(news, topics, 'dev', since).map((n) => n.title),
    ['A'],
  );
  assert.deepEqual(whatsNewFor(news, topics, 'qa', since), []);
});
