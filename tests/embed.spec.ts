import { expect, test } from 'vitest';
import type { HTMLElement } from 'node-html-parser';
import { embed as embedFunction } from '../src/shortcodes/embeds';
import type { LFPEleventySuppliedData, LFPShortcodeConfig } from '../src/types.d.ts';
import { parseMockEleventyEnv } from './mock';
import { initConfig } from '../src/util/config';

// mock global configuration
initConfig({
  css: true,
  js: true,
  embed: {
    baseUrl: 'http://localhost:8080',
  },
  transformer: {
    outputPath: 'assets',
  },
} as LFPShortcodeConfig);

/** Consolidates default tests for embed elements. */
function embedDefaultTester(element: HTMLElement, data: Partial<LFPEleventySuppliedData>) {
  test('has noscript', () =>
    expect(element.querySelector('noscript')).toBeDefined());
  test('has iFrame', () =>
    expect(element.querySelector('iframe')).toBeDefined());
  test('has counter', () => expect(data?.page?.counters?.embed).toEqual(1));
}

test.describe('YouTube Long URL', async () => {
  embedDefaultTester(
    ...(await parseMockEleventyEnv(
      embedFunction,
      {},
      'https://youtube.com/watch?v=LpG8vtFMkD0',
    )),
  );
});

test.describe('YouTube Short URL', async () => {
  embedDefaultTester(
    ...(await parseMockEleventyEnv(
      embedFunction,
      {},
      'https://youtu.be/LpG8vtFMkD0',
    )),
  );
});

test.describe('Spotify', async () => {
  embedDefaultTester(
    ...(await parseMockEleventyEnv(
      embedFunction,
      {},
      'https://open.spotify.com/intl-de/album/7tfW0uYdwTz3QcTAILyrHY',
    )),
  );
});

test.describe('Bluesky', async () => {
  embedDefaultTester(
    ...(await parseMockEleventyEnv(
      embedFunction,
      {},
      'https://bsky.app/profile/tazkultur.bsky.social/post/3ljmr7hmn4s2j',
    )),
  );
});

test.describe('CodePen', async () => {
  embedDefaultTester(
    ...(await parseMockEleventyEnv(
      embedFunction,
      {},
      'https://codepen.io/lowfatprophet/pen/VYvgpaw',
    )),
  );
});

test.describe('Fallback', async () => {
  const fallbackUrl = 'https://example.org/fallback-test';
  const parsedFallback = await parseMockEleventyEnv(embedFunction, {}, fallbackUrl);
  const anchorElement = parsedFallback[0].querySelector('a');

  test('has link', () => expect(anchorElement).toBeDefined());
  test('has url', () =>
    expect(anchorElement?.getAttribute('href')).toContain(fallbackUrl));
});