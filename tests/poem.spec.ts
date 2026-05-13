import { expect, test } from 'vitest';
import { poem as poemFunction } from '../src/shortcodes/poem';
import { parseMockEleventyEnv } from './mock';
import { HTMLElement } from 'node-html-parser';

function normalize(text: string) {
  return text.trim().replaceAll(/\s/g, ' ');
}

const content =
  'Roses are red\nViolets are blue\nI have to admit it\nThis test is for you';
const normalizedContent = normalize(content);
const caption = 'The caption';
const style = 'background-color:red';

const defaultTests = (element: HTMLElement) => {
  test('has content', () =>
    expect(normalize(element.textContent)).toContain(normalizedContent));
};

test.describe('Poem', async () => {
  const [poem] = await parseMockEleventyEnv(poemFunction, {}, content);

  defaultTests(poem);
});

test.describe('Poem with caption', async () => {
  const [poem] = await parseMockEleventyEnv(poemFunction, {}, content, caption);

  defaultTests(poem);
  test('has caption', () =>
    expect(normalize(poem.textContent)).toContain(normalize(`— ${caption}`)));
});

// TODO: reimplement `styles` here!    
// test.describe('Poem with styles', async () => {
//   const [poem] = await parseMockEleventyEnv(
//     poemFunction,
//     {},
//     content,
//     '',
//     styles
//   );

//   defaultTests(poem);
//   test('has styles', () =>
//     expect(
//       poem.querySelector(`[style*="${style}"]`)?.getAttribute('style'),
//     ).toContain(style));
// });