import assert from 'node:assert/strict';
import test from 'node:test';

// @ts-expect-error Node's type-stripping runner requires the .ts extension.
import {
  canCommitRequest,
  getArticleScrollRatio,
  getArticleScrollTarget,
  readPersistedLanguage,
  resolveLanguage,
} from './multilingualReading.ts';

test('valid persisted language wins over the browser', () => {
  assert.equal(resolveLanguage('ja', 'ko-KR'), 'ja');
});

test('browser primary subtags normalize and unsupported values use English', () => {
  assert.equal(resolveLanguage(undefined, 'ko-KR'), 'ko');
  assert.equal(resolveLanguage(undefined, 'ja-JP'), 'ja');
  assert.equal(resolveLanguage(undefined, 'en-GB'), 'en');
  assert.equal(resolveLanguage(undefined, 'fr-FR'), 'en');
  assert.equal(resolveLanguage(undefined, undefined), 'en');
});

test('malformed or invalid persisted values are ignored', () => {
  assert.equal(readPersistedLanguage('{broken'), undefined);
  assert.equal(readPersistedLanguage('{"state":{}}'), undefined);
  assert.equal(readPersistedLanguage('{"state":{"language":"fr"}}'), undefined);
  assert.equal(readPersistedLanguage('{"state":{"language":"ko"}}'), 'ko');
});

test('only the latest request completed before 5000 ms can commit', () => {
  assert.equal(canCommitRequest(2, 2, 1000, 5999), true);
  assert.equal(canCommitRequest(2, 2, 1000, 6000), false);
  assert.equal(canCommitRequest(1, 2, 1000, 1100), false);
});

test('article-local scroll math clamps both ratio and document target', () => {
  assert.equal(getArticleScrollRatio(800, 200, 1400, 800), 1);
  assert.equal(getArticleScrollRatio(0, 200, 1400, 800), 0);
  assert.equal(getArticleScrollTarget(0.5, 300, 1800, 800, 2200), 800);
  assert.equal(getArticleScrollTarget(1, 1800, 1800, 800, 2400), 1600);
});
