import type { HTMLElement } from 'node-html-parser';
import { expect, test } from 'vitest';
import { table as tableFunction } from '../src/shortcodes/table';
import { parseMockEleventyEnv } from './mock';
import type { LFPEleventySuppliedData } from '../src/types.d.ts';

const content =
  '<thead><tr><th>Head</th></tr></thead><tbody><tr><td>Body</td></tr></tbody>';
const caption = 'Test table';
const id = 'the-id';
const defaultTests = (element: HTMLElement, data: Partial<LFPEleventySuppliedData>) => {
  test('has head', () => expect(element.querySelector('thead')).toBeDefined());
  test('has body', () => expect(element.querySelector('tbody')).toBeDefined());
  test('has counter', () => expect(data?.page?.counters?.table).toEqual(1));
};

test.describe('Table', async () => {
  defaultTests(...(await parseMockEleventyEnv(tableFunction, {}, content)));
});

test.describe('Table with caption', async () => {
  const [table, data] = await parseMockEleventyEnv(
    tableFunction,
    {},
    content,
    caption,
  );

  defaultTests(table, data);
  test('has caption position', () =>
    expect(
      table.querySelector('table > :first-child')?.tagName?.toLowerCase(),
    ).toContain('caption'));
  test('has caption content', () =>
    expect(table.querySelector('caption')?.textContent).toContain(caption));
});

test.describe('Table with ID', async () => {
  const [table, data] = await parseMockEleventyEnv(
    tableFunction,
    {},
    content,
    '',
    id,
  );

  defaultTests(table, data);
  test('has ID', () => expect(table.querySelector(`#${id}`)).toBeDefined());
  test('has ID link', () =>
    expect(table.querySelector(`[href="#${id}"]`)).toBeDefined());
});