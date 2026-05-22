import { readFileSync } from 'node:fs';
import { mergeDeep } from '@lowfat/utils/objects';
import matter from 'gray-matter';
import { type HTMLElement, parse } from 'node-html-parser';
import type { LFPEleventyScope } from '../src/types';

export function amendEleventyEnv(options: Partial<LFPEleventyScope>) {
  const eleventySuppliedData: Partial<LFPEleventyScope> = {
    page: {
      data: {},
      date: new Date(),
      inputPath: '',
      filePathStem: '',
      fileSlug: '',
      outputFileExtension: '',
      outputPath: '',
      rawInput: '',
      templateSyntax: '',
      url: '',
    },
  };
  if (!options) return eleventySuppliedData;
  if (options.page?.inputPath && !options.page?.rawInput) {
    const { content, data } = matter(readFileSync(options.page.inputPath));
    // biome-ignore lint/style/noNonNullAssertion: this is defined IN THE VARIABLE DEFINITION
    eleventySuppliedData.page!.rawInput = content;
    // biome-ignore lint/style/noNonNullAssertion: this is defined IN THE VARIABLE DEFINITION
    eleventySuppliedData.page!.data = data;
  }
  
  return mergeDeep(eleventySuppliedData, options) as Partial<LFPEleventyScope>;
}

export async function mockEleventyEnv<T extends (...args: Parameters<T>) => string | Promise<string>>(
  testee: T,
  thisOptions: Record<string, unknown>,
  ...args: Parameters<T>
): Promise<string> {
  return testee.call(thisOptions, ...args);
}

export async function parseMockEleventyEnv<T extends (...args: Parameters<T>) => string | Promise<string>>(
  testee: T,
  thisOptions: Partial<LFPEleventyScope>,
  ...args: Parameters<T>
): Promise<[HTMLElement, Partial<LFPEleventyScope>]> {
  const _thisOptions = amendEleventyEnv(thisOptions);
  const mockResult = await mockEleventyEnv(testee, _thisOptions, ...args);
  const result = parse(mockResult, {
    // workaround to be able to query elements inside `<pre>`
    blockTextElements: {},
  });
  return [result, _thisOptions];
}