import Fetch from '@11ty/eleventy-fetch';
import type { LFPEleventyScope, LFPShortcodeConfig } from '../types.d.ts';
import { prettydate } from '../util/helper.js';

/**
 * Calculates inflation-adjusted prices.
 * @example
 * ```nunjucks
 * {% inflation "$420" "1929" %}
 * ```
 */
export async function inflation(this: LFPEleventyScope, config: LFPShortcodeConfig, value: string, year: string) {
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
  return await Fetch<Promise<string>>(
    `https://www.statbureau.org/calculate-inflation-price-json?${params.toString()}`,
    { duration: '4w', type: 'json' },
  )
    .then(json => {
      // return /* html */ `${value}<sub>(${dollar() || pound()}${json}${euro()} in ${today.getFullYear()})</sub>`;
      return /* html */ `${value}<sub>(${json} in ${today.getFullYear()})</sub>`;
    })
    .catch(() => value);
}
