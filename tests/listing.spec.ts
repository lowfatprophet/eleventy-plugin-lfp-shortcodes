import { expect, test } from 'vitest';
import { root, tagName } from './utils';
import { type HTMLElement } from 'node-html-parser';
import { parseMockEleventyEnv } from './mock';
import { listing as listingFunction } from '../src/shortcodes/listing';
import type { LFPEleventySuppliedData, LFPShortcodeConfig } from '../src/types';

const config: LFPShortcodeConfig = {
  css: true,
  js: true,
  dev: true,
};

const content = '```javascript\nconsole.log("That works!");\n```';
const caption = 'A caption';
const id = 'listing-id';

function defaultTests(element: HTMLElement, data: Partial<LFPEleventySuppliedData>) {
  test('is figure', () => expect(tagName(element)).toContain('figure'));
  test('has counter', () => expect(data.page.counters?.listing).toEqual(1));
  test('has content', () => {
    expect(element.querySelector('[id^="code-frame"]')?.textContent).toContain(content);
  });
}

test.describe('Listing with copy button', async () => {
  const [listing, data] = await parseMockEleventyEnv(
    listingFunction,
    {},
    config,
    content,
    caption,
  )
  const captionElement = listing.querySelector('figcaption');

  defaultTests(listing, data);
  test('has caption', () => expect(captionElement).toBeDefined());
  test('has caption content', () => {
    expect(captionElement?.textContent).toContain(caption);
  });
});

test.describe('listing with ID', async () => {
  const [listing, data] = await parseMockEleventyEnv(
    listingFunction,
    {},
    config,
    content,
    '',
    id,
  );

  defaultTests(listing, data);
  test('has ID', () => expect((root(listing) as HTMLElement)?.getAttribute('id')).toContain(id));
  test('has ID link', () => {
    expect(listing.querySelector(`[href="#${id}"]`)).toBeFalsy();
  });
});

test.describe('Listing with caption and ID', async () => {
  const [listing, data] = await parseMockEleventyEnv(
    listingFunction,
    {},
    config,
    content,
    caption,
    id,
  );

  const captionElement = listing.querySelector('figcaption');

  defaultTests(listing, data);
  test('has caption', () => expect(captionElement).toBeDefined());
  test('has caption content', () =>
    expect(captionElement?.textContent).toContain(caption));
  test('has ID', () => expect((root(listing) as HTMLElement)?.getAttribute('id')).toContain(id));
  test('has ID link', () =>
    expect(listing.querySelector(`[href="#${id}"]`)).toBeDefined());
});

test.describe('Listing without copy button', async () => {
  const [listing, data] = await parseMockEleventyEnv(
    listingFunction,
    {},
    config,
    content,
    '',
    '',
    'true',
  );

  defaultTests(listing, data);
  test('has no copy button', () =>
    expect(listing.querySelector('lfp-copy-button')).toBeFalsy());
});