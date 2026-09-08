import assert from 'node:assert/strict';
import test from 'node:test';
import { aboutTranslations } from './about.ts';
import { profileTranslations } from './profile.ts';

test('profile copy reuses localized site and About content', () => {
  for (const language of ['en', 'ko', 'ja'] as const) {
    assert.equal(profileTranslations[language].bio, aboutTranslations[language].description);
    assert.equal(profileTranslations[language].missionDescription, aboutTranslations[language].missionDescription);
    assert.deepEqual(profileTranslations[language].topics, aboutTranslations[language].topics);
    assert.equal(profileTranslations[language].contactEmail, aboutTranslations[language].contactEmail);
  }
});
