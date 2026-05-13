import { expect, test } from 'vitest';
import {
  mathblock as mathblockFunction,
  math as mathFunction,
} from '../src/shortcodes/math';
import { parseMockEleventyEnv } from './mock';
import { root, tagName } from './utils';
import type { HTMLElement } from 'node-html-parser';
import type { LFPEleventySuppliedData } from '../src/types';

const content =
  '\\Phi(x)=\\frac{1}{\\sqrt{2\\pi \\sigma^2}}\\mathrm{e}^\\frac{(x-\\mu)^2}{2\\sigma^2}';
const caption = 'A caption';
const id = 'the-id';

const commonTests = (element: HTMLElement) => {
  test('has <math> tag', () =>
    expect(element.querySelector('math')).toBeDefined());
  test('has annotation', () =>
    expect(element.querySelector('annotation')?.textContent).toContain(
      content,
    ));
};

const defaultTests = (element: HTMLElement, data: Partial<LFPEleventySuppliedData>) => {
  commonTests(element);
  test('has counter', () => expect(data.page.counters.mathblock).toBe(1));
  test('is figure', () => expect(tagName(element)).toContain('figure'));
  test('has copy button', () =>
    expect(element.querySelector('lfp-copy-button')).toBeDefined());
};

test.describe('Math inline', async () => {
  const [expression] = await parseMockEleventyEnv(mathFunction, {}, content);

  commonTests(expression);
});

test.describe('Math block', async () => {
  defaultTests(...(await parseMockEleventyEnv(mathblockFunction, {}, content)));
});

test.describe('Math block with caption', async () => {
  const [expression, data] = await parseMockEleventyEnv(
    mathblockFunction,
    {},
    content,
    caption,
  );

  defaultTests(expression, data);
  test('has caption', () =>
    expect(expression.querySelector('figcaption')).toBeDefined());
});

test.describe('Math block with ID', async () => {
  const [expression, data] = await parseMockEleventyEnv(
    mathblockFunction,
    {},
    content,
    '',
    id,
  );

  defaultTests(expression, data);
  test('has no caption', () =>
    expect(expression.querySelector('figcaption')).toBeFalsy());
  test('has ID', () =>
    expect((root(expression) as HTMLElement)?.getAttribute('id')).toContain(id));
});

test.describe('Math block with caption and ID', async () => {
  const [expression, data] = await parseMockEleventyEnv(
    mathblockFunction,
    {},
    content,
    caption,
    id,
  );

  defaultTests(expression, data);
  test('has caption', () =>
    expect(expression.querySelector('figcaption')).toBeDefined());
  test('has ID', () =>
    expect((root(expression) as HTMLElement)?.getAttribute('id')).toContain(id));
  test('has ID link', () =>
    expect(expression.querySelector(`[href="${id}"]`)).toBeDefined());
});