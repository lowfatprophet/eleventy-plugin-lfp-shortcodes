import { expect, test } from 'vitest';
import { richlink as richlinkFunction } from '../src/shortcodes/richlink';
import { parseMockEleventyEnv } from './mock';

function prune(slug: string | undefined) {
  return slug?.replaceAll(/^\/|\/$/g, '');
}

const url = 'https://example.org';

test.describe('Rich link', async () => {
  const [richlink] = await parseMockEleventyEnv(richlinkFunction, {}, url);

  test('has link', () => {
    const links = richlink.querySelectorAll('a');
    expect(
      [...links].map(link => prune(link.getAttribute('href')))
    ).toContain(url);
  });
});