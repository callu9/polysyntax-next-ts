import assert from 'node:assert/strict';
import test from 'node:test';
import {
  changeLocalePath,
  getDocumentLocale,
  getIndexablePaths,
  getLocaleFromPath,
  isLocale,
  localePath,
  resolveLanguageSwitch,
  stripLocale,
} from './localeRoutes.ts';

test('locale routes preserve paths and distinguish legacy URLs', () => {
  assert.equal(isLocale('ko'), true);
  assert.equal(isLocale('fr'), false);
  assert.equal(getLocaleFromPath('/ja/blog/article'), 'ja');
  assert.equal(getLocaleFromPath('/blog/article'), null);
  assert.equal(stripLocale('/ko'), '/');
  assert.equal(stripLocale('/ko/blog?page=2'), '/blog?page=2');
  assert.equal(localePath('en', '/blog/article'), '/en/blog/article');
});

test('document locale follows the URL and defaults legacy routes to English', () => {
  assert.equal(getDocumentLocale('/ko/blog/article'), 'ko');
  assert.equal(getDocumentLocale('/ja/about'), 'ja');
  assert.equal(getDocumentLocale('/blog/article'), 'en');
});

test('article language switches load content before changing locale URLs', () => {
  assert.deepEqual(resolveLanguageSwitch('/ko/blog/react-reconciliation', 'ja', '?ref=home'), { type: 'load-article' });
  assert.deepEqual(resolveLanguageSwitch('/ko/blog', 'ja', '?page=2'), { type: 'navigate', href: '/ja/blog?page=2' });
});

test('locale replacement preserves the path without nesting locale segments', () => {
  assert.equal(changeLocalePath('/ko/blog/react-reconciliation', 'ja'), '/ja/blog/react-reconciliation');
  assert.equal(changeLocalePath('/blog/react-reconciliation', 'ja'), '/ja/blog/react-reconciliation');
});

test('indexable paths contain only locale canonical URLs', () => {
  assert.deepEqual(getIndexablePaths(['first', 'second']), [
    '/en', '/en/about', '/en/blog', '/en/blog/first', '/en/blog/second',
    '/ko', '/ko/about', '/ko/blog', '/ko/blog/first', '/ko/blog/second',
    '/ja', '/ja/about', '/ja/blog', '/ja/blog/first', '/ja/blog/second',
  ]);
});
