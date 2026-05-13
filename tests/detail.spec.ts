import { expect, test } from 'vitest';
import { detail as detailFunction } from '../src/shortcodes/detail';
import { parseMockEleventyEnv } from './mock';
import { root } from './utils';
import type { HTMLElement } from 'node-html-parser';

const content = "This is the detail's content!";
const summary = "This is the detail's summary!";
const name = 'detail-test';
const id = 'detail-id';

const [detailSimple] = await parseMockEleventyEnv(
  detailFunction,
  {},
  content,
  summary,
);

const [detailSimpleOpened] = await parseMockEleventyEnv(
  detailFunction,
  {},
  content,
  summary,
  '',
  '',
  'true',
);

const [detailWithName] = await parseMockEleventyEnv(
  detailFunction,
  {},
  content,
  summary,
  name,
);

const [detailWithNameOpened] = await parseMockEleventyEnv(
  detailFunction,
  {},
  content,
  summary,
  name,
  '',
  'true',
);

const [detailWithId] = await parseMockEleventyEnv(
  detailFunction,
  {},
  content,
  summary,
  '',
  id,
);

test.describe('Detail', () => {
  test('has summary', () =>
    expect(detailSimple?.querySelector('summary')).toBeDefined());
  test('has content', () =>
    expect(root(detailSimple)?.childNodes.length).toBeGreaterThan(1));
});

test.describe('Detail opened', () => {
  test('has summary', () =>
    expect(detailSimple?.querySelector('summary')).toBeDefined());
  test('has content', () =>
    expect(detailSimple.childNodes.at(0)?.childNodes.length).toBeGreaterThan(1));
  test('has [open] attribute', () => {
    expect((root(detailSimpleOpened) as HTMLElement)?.hasAttribute('open')).toBeTruthy();
  });
});

test.describe('Detail with name', () => {
  test('has summary', () =>
    expect(detailWithName?.querySelector('summary')).toBeDefined());
  test('has content', () =>
    expect(root(detailWithName)?.childNodes.length).toBeGreaterThan(1));
  test('has name', () =>
    expect((root(detailWithName) as HTMLElement)?.getAttribute('name')).toContain(name));
});

test.describe('Detail with name opened', () => {
  test('has summary', () =>
    expect(detailWithNameOpened?.querySelector('summary')).toBeDefined());
  test('has content', () =>
    expect(root(detailWithNameOpened)?.childNodes.length).toBeGreaterThan(1));
  test('has name', () =>
    expect((root(detailWithNameOpened) as HTMLElement)?.getAttribute('name')).toContain(name));
  test('has [open] attribute', () => {
    expect((root(detailWithNameOpened) as HTMLElement)?.hasAttribute('open')).toBeTruthy();
  });
});

test.describe('Detail with ID', () => {
  test('has summary', () =>
    expect(detailWithId?.querySelector('summary')).toBeDefined());
  test('has content', () =>
    expect(root(detailWithId)?.childNodes.length).toBeGreaterThan(1));
  test('has ID', () =>
    expect((root(detailWithId) as HTMLElement)?.getAttribute('id')).toContain(id));
});