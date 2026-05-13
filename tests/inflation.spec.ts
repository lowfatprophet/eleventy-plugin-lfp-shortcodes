import { expect, test } from 'vitest';
import { inflation as inflationFunction } from '../src/shortcodes/inflation';
import { mockEleventyEnv } from './mock';

test.describe('Inflation', async () => {
  const currency = '€';

  const inflation = await mockEleventyEnv(inflationFunction, {}, `100${currency}`, '2010');

  test('has currency', () => expect(inflation).toContain(currency));
  test('has current date', () =>
    expect(inflation).toContain(new Date().getFullYear()));
});