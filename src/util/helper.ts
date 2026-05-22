import Log from '@lowfat/log';
import type { EleventySuppliedData } from '11ty.ts';
import browserslist from 'browserslist';
import { browserslistToTargets, transform, type CustomAtRules, type TransformOptions } from 'lightningcss';
import markdownIt, { type Options as MarkdownItOptions } from 'markdown-it';
import { type MinifyOptions, minify as minifyTerser } from 'terser';
import { getConfig } from './config.js';
import { DEFAULT_MD_OPTIONS } from './constants.js';

function isDevelopment() { return false; }

interface LFPEleventySuppliedData extends EleventySuppliedData {
  counters?: Record<string, number>;
}

async function minify<T, K>(data: T, minifier: (data: T) => K, mangle: boolean = false): Promise<T | K> {
  return isDevelopment() && !mangle ? data : await minifier(data);
}

/**
 * Extracts the date from an ISO string.
 */
function convertDate(date: Date) {
  return date.toISOString().split('T').at(0);
}

export const log = new Log(Object.assign({
  label: 'LFP',
  sublabel: 'eleventy-plugin-lfp-shortcodes',
}, getConfig().log ?? {}));

/**
 * Converts a valid JavaScript object into a compact string representation.
 */
export async function jsonmin(data: string) {
  return minify(data, d => {
    const _d = JSON.parse(d);
    return JSON.stringify(_d);
  });
}

/**
 * Minify and inline styles inside of templates.
 * @param {String} styles The styles that should get minified and inlined.
 * @returns {Promise<String>} The minified styles.
 */
export async function cssmin(styles: string) {
  return minify(styles, s => {
    const options: TransformOptions<CustomAtRules> = {
      filename: '',
      code: Buffer.from(s),
      minify: true,
    };
    // biome-ignore lint/correctness/noConstantCondition: temporarily disabled, will be implemented eventually
    if (false) {
      options.targets = browserslistToTargets(
        browserslist(),
      );
    }
    
    const { code } = transform(options);

    return code.toString();
  });
}

/**
 * Minify and inline JavaScript code inside of templates.
 * https://www.11ty.dev/docs/quicktips/inline-js/
 */
export async function jsmin(code: string, mangle: boolean = false, options: MinifyOptions = {}) {
  return minify(
    code,
    async c => {
      try {
        return (await minifyTerser(c, options)).code ?? c;
      } catch {
        // Fail gracefully
        return c;
      }
    },
    mangle,
  );
}

export function setCounter(page: LFPEleventySuppliedData, name: string) {
  if (!Object.hasOwn(page, 'counters')) page.counters = {};

  // biome-ignore lint/style/noNonNullAssertion: `page.counters` gets defined in the previous line, if it doesn't exist on `page`
    if (page.counters![name]) {
    // biome-ignore lint/style/noNonNullAssertion: `page.counters` gets defined in the previous line, if it doesn't exist on `page`
    page.counters![name]++;
  } else {
    // biome-ignore lint/style/noNonNullAssertion: `page.counters` gets defined in the previous line, if it doesn't exist on `page`
    page.counters![name] = 1;
  }

  // biome-ignore lint/style/noNonNullAssertion: `page.counters` gets defined in the previous line, if it doesn't exist on `page`
  return page.counters![name];
}

export function isURL(url: string) {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export const md = markdownIt(DEFAULT_MD_OPTIONS);

export function mdWith(options: MarkdownItOptions) {
  return md.set(DEFAULT_MD_OPTIONS).set(options);
}

export function softSanitize(str: string) {
  return str
    .replaceAll(/on[A-Za-z]="(.+?)"/g, '')
    .replaceAll(/src="(.+?)"/g, '')
    .replaceAll(/<source>(.+?)<\/source>/g, '');
}

export function ifID(id: string | undefined, content: string) {
  return id && id.length > 0 ? content : '';
}

/**
 * Inserts separator elements (e.g., `<wbr>`) at the specified locations. Returns HTML literals, so use with `safe` filter.
 */
export function wbr(
  term: string,
  delimiters: string[] = ['/', '_', '-'],
  separator: string = '<wbr>',
  position: 'before' | 'after' = 'after',
) {
  return delimiters.reduce((arr, del) => {
    return arr
      .split(del)
      .join(position === 'after' ? `${del}${separator}` : `${separator}${del}`);
  }, term);
}

/**
 * Conditionally returns the passed caption string or an empty string, depending
 * on the fact if a caption was passed or the caption was an empty string.
 */
export function ifCaption(caption: string, content: string) {
  return hasCaption(caption) ? content : '';
}

/**
 * Returns true if the given string exists.
 */
export function hasCaption(caption: string | undefined) {
  return caption && caption?.length > 0;
}

/**
 * Converts a `date` object to an ISO string representation.
 */
export function prettydate(dateObj: Date | string): string {
  if (dateObj instanceof Date) {
    return convertDate(dateObj) ?? '';
  } else if (dateObj as unknown instanceof String) {
    return dateObj.split('T').at(0) ?? '';
  } else {
    try {
      return convertDate(new Date(dateObj)) ?? '';
    } catch {
      return '';
    }
  }
}

export function ifClass(classStr: string | string[] | undefined) {
  return classStr
    ? `class="${typeof classStr === 'string' ? classStr : classStr.join(' ')}"`
    : '';
}

export function ifStyle(styleStr: string | Record<string, string> | undefined) {
  const camelToKebap = (str: string) => str.replaceAll(
    /(?<cap>[A-Z])/g,
    subStr => `-${subStr.toLowerCase()}`,
  );
  return styleStr
    ? `class="${typeof styleStr === 'string'
      ? styleStr
      : Object.entries(styleStr).map(
        ([k, v]) => `${camelToKebap(k)}:${v};`
      ).join('')
    }"`
    : '';
}