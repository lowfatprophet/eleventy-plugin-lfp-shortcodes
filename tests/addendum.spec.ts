import { expect, test } from 'vitest';
import { addendum as addendumFunction } from '../src/shortcodes/addendum';
import { parseMockEleventyEnv } from './mock';

const content = "This is the addendum's content!";
const date = '2012-12-12';

const [addendum] = await parseMockEleventyEnv(
  addendumFunction,
  { page: { inputPath: './tests/mockups/addendum.mockup.md' } },
  content,
  date,
);

const headingElement = addendum.querySelector('h3');
const timeElement = addendum.querySelector('time');
const relativeDateElement = addendum.querySelector('header small');
const contentElement = addendum.querySelector(':last-child');

test.describe('Heading', () => {
  test('is not null', () => expect(headingElement).toBeTruthy());
  test('has content', () =>
    expect(
      headingElement?.textContent?.replaceAll(/\n|\s+/gm, ' ').trim(),
    ).toContain(`Addendum 1 ¶`));
});

test.describe('Date', () => {
  test('is not null', () => expect(timeElement).toBeTruthy());
  test('has attribute', () =>
    expect(timeElement?.getAttribute('datetime')).toBe(date));
  test('has content', () => expect(timeElement?.textContent).toContain(date));
});

test.describe('Relative date', () => {
  test('is not null', () => expect(relativeDateElement).toBeTruthy());
  test('has content', () =>
    expect(relativeDateElement?.textContent).toContain(
      'added seven years, four months, two days later',
    ));
});

test.describe('Content', () => {
  test('is not null', () => expect(contentElement).toBeTruthy());
  test('has content', () =>
    expect(contentElement?.textContent).toContain(content));
});