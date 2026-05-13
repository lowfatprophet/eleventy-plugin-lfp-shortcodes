import { mergeDeep } from '@lowfat/utils/objects';
import { type HTMLElement, parse } from 'node-html-parser';
import type { LFPEleventySuppliedData } from '../src/types';
import matter from 'gray-matter';
import { readFileSync } from 'node:fs';

export function amendEleventyEnv(options: Partial<LFPEleventySuppliedData>) {
  const eleventySuppliedData = {
    page: { rawInput: '', data: {} },
  };
  if (!options) return eleventySuppliedData;
  if (options.page?.inputPath && !options.page?.rawInput) {
    const { content, data } = matter(readFileSync(options.page.inputPath));
    eleventySuppliedData.page.rawInput = content;
    eleventySuppliedData.page.data = data;
  }
  
  return mergeDeep(eleventySuppliedData, options);
}

export async function mockEleventyEnv<T extends (...args: Parameters<T>) => string | Promise<string>>(
  testee: T,
  thisOptions: Record<string, any>,
  ...args: Parameters<T>
): Promise<string> {
  return testee.call(thisOptions, ...args);
}

export async function parseMockEleventyEnv<T extends (...args: Parameters<T>) => string | Promise<string>>(
  testee: T,
  thisOptions: Partial<LFPEleventySuppliedData>,
  ...args: Parameters<T>
): Promise<[HTMLElement, Partial<LFPEleventySuppliedData>]> {
  const _thisOptions = amendEleventyEnv(thisOptions);
  const mockResult = await mockEleventyEnv(testee, _thisOptions, ...args);
  const result = parse(mockResult, {
    // workaround to be able to query elements inside `<pre>`
    blockTextElements: {},
  });
  return [result, _thisOptions];
}