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
import type { LFPEleventyScope, LFPShortcodeConfig } from './types.d.ts';
import { initConfig } from './util/config.js';

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

// type ShortcodeFunction<T extends (config: LFPShortcodeConfig, ...args: any[]) => Promise<string> | string> = (...args: Omit<Parameters<T>, 'config'>) => ReturnType<T>;

export default function (this: LFPEleventyScope, eleventyConfig: EleventyConfig, options: LFPShortcodeConfig) {
  initConfig(Object.assign(
    {
      css: true,
      js: true,
      transformer: {
        outputPath: 'assets',
      },
    } as LFPShortcodeConfig,
    options,
  ));

  // single shortcodes
  [css, embed, figure, inflation, js, jsbundle, richlink].forEach(shortcode => {
    eleventyConfig.addShortcode(
      shortcode.name,
      // @ts-expect-error `EleventyData` from 11ty.ts type support
      // is not compatible with the plugin's own `LFPEleventyData` type support
      // (the latter enhances the former with more and custom properties)
      shortcode,
    );
  });

  // paired shortcodes
  [addendum, blockquote, detail, listing, math, mathblock, poem, table].forEach(
    shortcode => {
      eleventyConfig.addPairedShortcode(
        shortcode.name,
        // @ts-expect-error `EleventyData` from 11ty.ts type support
        // is not compatible with the plugin's own `LFPEleventyData` type support
        // (the latter enhances the former with more and custom properties)
        shortcode,
      );
    },
  );
}
