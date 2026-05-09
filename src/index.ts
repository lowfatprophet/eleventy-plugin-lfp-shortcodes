import type { EleventyConfig } from '11ty.ts';
import { addendum } from './shortcodes/addendum.js';
import { blockquote } from './shortcodes/blockquote.js';
import { detail } from './shortcodes/detail.js';
import { embed } from './shortcodes/embeds.js';
import { figure } from './shortcodes/figure.js';
import { inflation } from './shortcodes/inflation.js';
import { listing } from './shortcodes/listing.js';
import { math, mathblock } from './shortcodes/math.js';
import { poem } from './shortcodes/poem.js';
import { richlink } from './shortcodes/richlink.js';
import { table } from './shortcodes/table.js';
import { css, js, jsbundle } from './shortcodes/transformer.js';

export {
  addendum,
  blockquote,
  css,
  detail,
  embed,
  figure,
  inflation,
  js,
  jsbundle,
  listing,
  math,
  mathblock,
  poem,
  richlink,
  table
};

export default function (eleventyConfig: EleventyConfig) {
  // single shortcodes
  [css, embed, figure, inflation, js, jsbundle, richlink].forEach(shortcode => {
    // @ts-expect-error
    eleventyConfig.addShortcode(shortcode.name, shortcode);
  });

  // paired shortcodes
  [addendum, blockquote, detail, listing, math, mathblock, poem, table].forEach(
    shortcode => {
      // @ts-expect-error
      eleventyConfig.addPairedShortcode(shortcode.name, shortcode);
    },
  );
}
