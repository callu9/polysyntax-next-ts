import assert from 'node:assert/strict';
import test from 'node:test';

import { getInitialArticleData } from './articleData.ts';

test('initial article data contains the localized metadata and markdown body', () => {
  const data = getInitialArticleData('react-reconciliation', 'ko');
  assert.ok(data);
  assert.equal(data.article.language, 'ko');
  assert.match(data.content, /^# /);
  assert.match(data.content, /^## /m);
});

test('missing article data is not rendered as an empty snapshot', () => {
  assert.equal(getInitialArticleData('missing', 'en'), null);
});
