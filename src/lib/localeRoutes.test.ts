import assert from 'node:assert/strict';
import test from 'node:test';
import { getLocaleFromPath, isLocale, localePath, stripLocale } from './localeRoutes.ts';

test('locale routes preserve paths and distinguish legacy URLs', () => {
  assert.equal(isLocale('ko'), true);
  assert.equal(isLocale('fr'), false);
  assert.equal(getLocaleFromPath('/ja/blog/article'), 'ja');
  assert.equal(getLocaleFromPath('/blog/article'), null);
  assert.equal(stripLocale('/ko'), '/');
  assert.equal(stripLocale('/ko/blog?page=2'), '/blog?page=2');
  assert.equal(localePath('en', '/blog/article'), '/en/blog/article');
});
