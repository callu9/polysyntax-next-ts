import assert from 'node:assert/strict';
import test from 'node:test';
import { formatArchiveDate } from './dateFormatting.ts';

test('archive dates stay on the authored calendar day west of UTC', () => {
  const previousTimeZone = process.env.TZ;

  try {
    process.env.TZ = 'America/Los_Angeles';
    assert.equal(formatArchiveDate('2024-02-03', 'en-US'), '2/3/2024');
    assert.equal(formatArchiveDate('2024-02-03', 'ko-KR'), '2024. 2. 3.');
  } finally {
    if (previousTimeZone === undefined) delete process.env.TZ;
    else process.env.TZ = previousTimeZone;
  }
});
