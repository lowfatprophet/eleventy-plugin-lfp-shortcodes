import { expect, test } from 'vitest';
import { blockquote as blockquoteFunction } from '../src/shortcodes/blockquote';
import { parseMockEleventyEnv } from './mock';
import { tagName } from './utils';

const content = "This is the blockquote's content!";
const attribution = 'This is the attribution.';
const cite = 'https://example.org/cite/example/url';

const [blockquote] = await parseMockEleventyEnv(
  blockquoteFunction,
  {},
  content,
  attribution,
  cite,
);

const attributionElement = blockquote.querySelector(':last-child');

test.describe('Element', () => {
  test('is blockquote', () =>
    expect(tagName(blockquote)).toContain('blockquote'));
});

test.describe('Blockquote', () => {
  test('has cite attribute', () =>
    expect(
      blockquote.querySelector('blockquote')?.getAttribute('cite'),
    ).toContain(cite));
});

test.describe('Attribution', () => {
  test('is not null', () => expect(attributionElement).toBeTruthy());
  test('has content', () =>
    expect(attributionElement?.textContent.trim()).toContain(
      `— ${attribution}`,
    ));
});