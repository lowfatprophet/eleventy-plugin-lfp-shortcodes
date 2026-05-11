import Fetch from '@11ty/eleventy-fetch';
import type { LFPEleventyScope } from '../types.d.ts';
import { prettydate } from '../util/helper.js';

/**
 * Calculates inflation-adjusted prices.
 * @example
 * ```nunjucks
 * {% inflation "$420" "1929" %}
 * ```
 */
export async function inflation(this: LFPEleventyScope, value: string, year: string) {
  const today = new Date();
  const params = new URLSearchParams(
    Object.entries({
      amount: value.replace(/[^0-9.]/, ''),
      country: value.toLowerCase().includes('€')
        ? 'eurozone'
        : value.toLowerCase().includes('£')
          ? 'united-kingdom'
          : 'united-states',
      start: prettydate(new Date(year)),
      end: prettydate(today),
      format: 'true', // makes sure that format fits currency
    }),
  );
  const json = await Fetch<Promise<string>>(
    `https://www.statbureau.org/calculate-inflation-price-json?${params.toString()}`,
    { duration: '4w', type: 'json' },
  );
  return json
    ? /* html */ `${value}<sub>(${json} in ${today.getFullYear()})</sub>`
    : value;
}
