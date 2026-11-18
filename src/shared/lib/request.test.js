// Unit tests: no network call can hang or throw.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { request, timedFetch, TIMEOUT_ERROR } from './request.js';

test('a call that never answers settles as a timeout error', async () => {
  const res = await request(new Promise(() => {}), 30);
  assert.deepEqual(res, { data: null, error: TIMEOUT_ERROR });
  assert.match(res.error.message.toLowerCase(), /network/);
});

test('a call that throws settles as an error, never a throw', async () => {
  const res = await request(() => {
    throw new Error('Failed to fetch');
  });
  assert.equal(res.error.message, 'Failed to fetch');
  const rej = await request(Promise.reject(new TypeError('boom')));
  assert.equal(rej.error.message, 'boom');
});

test('a normal reply passes through', async () => {
  assert.deepEqual(await request(Promise.resolve({ data: [1], error: null })), {
    data: [1],
    error: null,
  });
  const err = { message: 'duplicate key', code: '23505' };
  assert.equal((await request(Promise.resolve({ data: null, error: err }))).error, err);
});

test('timedFetch aborts a hung request with a network error', async () => {
  let seen;
  const hang = (_u, init) =>
    new Promise((_r, reject) => {
      seen = init.signal;
      init.signal.addEventListener('abort', () =>
        reject(new DOMException('aborted', 'AbortError')),
      );
    });
  await assert.rejects(timedFetch(20, hang)('https://x'), /Network request timed out/);
  assert.equal(seen.aborted, true);
});

test('timedFetch keeps the caller’s own abort and normal replies', async () => {
  const ok = timedFetch(50, async () => 'reply');
  assert.equal(await ok('https://x'), 'reply');
  const outer = new AbortController();
  const hang = (_u, init) =>
    new Promise((_r, reject) =>
      init.signal.addEventListener('abort', () =>
        reject(new DOMException('aborted', 'AbortError')),
      ),
    );
  const p = timedFetch(1000, hang)('https://x', { signal: outer.signal });
  outer.abort();
  await assert.rejects(p, (e) => e.name === 'AbortError');
});
