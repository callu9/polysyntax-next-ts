import assert from 'node:assert/strict';
import test from 'node:test';
import { aboutTranslations } from './about.ts';
import { blogTranslations } from './blog.ts';
import { commonTranslations } from './common.ts';
import { homeTranslations } from './home.ts';

test('each supported language has complete shared UI copy', () => {
  for (const language of ['en', 'ko', 'ja'] as const) {
    assert.equal(typeof commonTranslations[language].navigation, 'string');
    assert.equal(typeof commonTranslations[language].allRightsReserved, 'string');
    assert.equal(typeof homeTranslations[language].editorialNote, 'string');
    assert.equal(typeof homeTranslations[language].viewAll, 'string');
    assert.equal(aboutTranslations[language].topics.length, 6);
    assert.equal(typeof aboutTranslations[language].supportedLanguagesDescription, 'string');
    assert.equal(typeof blogTranslations[language].archive, 'string');
    assert.equal(typeof blogTranslations[language].sampleArchive, 'string');
    assert.equal(typeof blogTranslations[language].articleNotFound, 'string');
    assert.equal(typeof blogTranslations[language].currentArticleUnchanged, 'string');
  }
});
