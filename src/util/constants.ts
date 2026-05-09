import type { Options as MarkdownItOptions } from "markdown-it";

export const WRITTEN_NUMBERS = {
  0: 'No',
  1: 'One',
  2: 'Two',
  3: 'Three',
  4: 'Four',
  5: 'Five',
  6: 'Six',
  7: 'Seven',
  8: 'Eight',
  9: 'Nine',
  10: 'Ten',
  11: 'Eleven',
  12: 'Twelve',
 } as const;

export const DEFAULT_MD_OPTIONS: MarkdownItOptions = { html: true } as const;

// TODO: has to be implemented as plugin option
export const ASSET_OUTPUT = 'assets' as const;