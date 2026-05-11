import matter from 'gray-matter';
import { readFile } from 'node:fs/promises';
import type { LFPEleventyScope } from '../types.d.ts';
import { WRITTEN_NUMBERS } from '../util/constants.js';
import { setCounter } from '../util/helper.js';

/**
 * Creates a nicely rendered addendum section for content that is to be added
 * to existing pages, notes, or articles.
 * @example
 * ```nunjucks
 * {% addendum "2025-03-30" %}
 * Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.
 * {% endaddendum %}
 * ```
 */
export async function addendum(
  this: LFPEleventyScope,
  content: string,
  date: `${number}-${number}-${number}`,
) {
  const counter = setCounter(this.page, 'addendum');

  const addDate = new Date(date);
  const addDateStr = addDate.toISOString().split('T').at(0);

  let level = '2';

  for (const line of this.page.rawInput.split('\n')) {
    if (line.match(new RegExp(`^{% addendum "${date}" %}`))) break;

    const heading = line.match(/^#+\s/);

    if (!heading) continue;
    level = String(heading.at(0)?.trim().length ?? level);
  }

  const file = await readFile(this.page.inputPath, 'utf-8');
  const frontmatter = matter(file).data;
  const headingSection = [
    /* html */ `<h${level} id="addendum-${counter}" style="margin:0">
      Addendum ${counter} <a href="#addendum-${counter} class="header-anchor">
        <span class="vh" data-pagefind-ignore>&para;</span>
      </a>
    </h${level}>`,
  ];

  if (frontmatter.created) {
    const created = new Date(frontmatter.created).getTime();
    const dateDiff = Math.floor((addDate.getTime() - created) / (24 * 60 * 60 * 1000));
    const years = Math.floor(dateDiff / 365.25);
    const months = Math.floor((dateDiff % 365.25) / 30.4375);
    const days = Math.floor((dateDiff % 365.25) % 30.4375);

    const print = (val: keyof typeof WRITTEN_NUMBERS | number, type: string, last: string = ', ') => {
      return val > 0
        // @ts-expect-error case for if `val` is an invalid key for WRITTEN_NUMBERS is handled
        ? `${WRITTEN_NUMBERS[val]?.toLowerCase() ?? val} ${type}${val !== 1 ? 's' : ''}${last}`
        : '';
    };

    headingSection.push(/* html */ `<small>
      ${days && days > 0 ? `added ${print(years, 'year')}${print(months, 'month')}${print(days, 'day', ' later')}` : ''}
    </small>`);
  }

  return /* html */ `<aside aria-labelledby="addendum-${counter}" class="addendum">
    <header class="f">
      <div>${headingSection.join('')}</div>
      <time datetime="${addDateStr}">${addDateStr}</time>
    </header>
    <div>
      ${content}
    </div>
  </aside>`
}