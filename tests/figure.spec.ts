import { expect, test } from 'vitest';
import { figure as figureFunction } from '../src/shortcodes/figure';
import { parseMockEleventyEnv } from './mock';
import { tagName } from './utils';
import type { HTMLElement } from 'node-html-parser';
import type { LFPEleventySuppliedData } from '../src/types.d.ts';

const src = 'image/path';
const alt = 'Alt text';
const caption = 'Figure caption';
const id = 'Figure ID';
const attribution = 'Figure attribution';

const testDefaults = (element: HTMLElement, data: Partial<LFPEleventySuppliedData>) => {
  test('has counter', () => expect(data?.page?.counters?.figure).toEqual(1));

  test('has figure', () => expect(tagName(element)).toContain('figure'));

  test('has alt', () =>
    expect(element.querySelector('img')?.hasAttribute('alt')).toBe(true));

  test('has src link', () => expect(element.querySelector(`[href="${src}"]`)));
};

test.describe('Simple Figure', async () => {
  testDefaults(...(await parseMockEleventyEnv(figureFunction, {}, src)));
});

test.describe('Figure with Alt', async () => {
  const [figure, data] = await parseMockEleventyEnv(
    figureFunction,
    {},
    src,
    alt,
  );

  testDefaults(figure, data);

  test('has alt content', () =>
    expect(figure.querySelector('img')?.getAttribute('alt')).toContain(alt));
});

test.describe('Figure with Caption', async () => {
  const [figure, data] = await parseMockEleventyEnv(
    figureFunction,
    {},
    src,
    '',
    caption,
  );

  testDefaults(figure, data);

  const captionElement = figure.querySelector('figcaption');

  test('has caption', () => expect(captionElement).toBeTruthy());

  test('has caption content', () =>
    expect(captionElement?.textContent).toContain(caption));
});

test.describe('Figure with ID', async () => {
  const [figure, data] = await parseMockEleventyEnv(
    figureFunction,
    {},
    src,
    '',
    '',
    id,
  );

  testDefaults(figure, data);

  test('has ID', () =>
    expect((figure.childNodes.at(0) as HTMLElement)?.getAttribute('id')).toContain(id));

  test('has ID anchor', () =>
    expect(figure.querySelector(`[href="#${id}"]`)).toBeDefined());
});

test.describe('Figure with attribution', async () => {
  const [figure, data] = await parseMockEleventyEnv(
    figureFunction,
    {},
    src,
    '',
    '',
    '',
    attribution,
  );

  testDefaults(figure, data);

  test('has attribution', () =>
    expect(figure.textContent).toContain(attribution));
});