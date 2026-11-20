// Data checks: every role has a done-checklist in both languages, and every
// role's Do-this-now text has a ticket format.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { TICKET_T, RA_DOD, RA_COPY_KIND } from '../src/features/your-role/data/tickets.js';
import { RA_IDS, RA_COPY } from '../src/features/your-role/data/roles.js';

test('every role has a checklist in both languages, with the same items', () => {
  for (const id of RA_IDS) {
    for (const lang of ['en', 'fr']) {
      const d = RA_DOD[id] && RA_DOD[id][lang];
      assert.ok(d && d.title && d.intro && d.items.length >= 5, `${id} ${lang}`);
      assert.equal(
        d.items.length,
        RA_DOD[id].en.items.length,
        `${id}: same items in both languages`,
      );
    }
  }
});

test('ticket labels exist in both languages', () => {
  assert.deepEqual(Object.keys(TICKET_T.fr).sort(), Object.keys(TICKET_T.en).sort());
});

test("every role's Do-this-now text has a ticket format", () => {
  for (const id of Object.keys(RA_COPY)) assert.ok(RA_COPY_KIND[id], id);
});
