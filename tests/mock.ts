import { mergeDeep } from '@lowfat/utils/objects';
import { type HTMLElement, parse } from 'node-html-parser';
import type { LFPEleventySuppliedData } from '../src/types';

export function amendEleventyEnv(options: Partial<LFPEleventySuppliedData>) {
  const eleventySuppliedData = {
    page: { rawInput: '' },
  };
  if (!options) return eleventySuppliedData;
  return mergeDeep(eleventySuppliedData, options);
}

export async function mockEleventyEnv<T extends (...args: any) => any>(
  testee: T,
  thisOptions: Record<string, any>,
  ...args: Parameters<T>
): Promise<ReturnType<T>> {
  return testee.call(thisOptions, ...args);
}

export async function parseMockEleventyEnv<T extends (...args: any) => any>(
  testee: T,
  thisOptions: Partial<LFPEleventySuppliedData>,
  ...args: Parameters<T>
): Promise<[HTMLElement, Partial<LFPEleventySuppliedData>]> {
  const _thisOptions = amendEleventyEnv(thisOptions);
  const result = parse(await mockEleventyEnv(testee, _thisOptions, ...args), {
    // workaround to be able to query elements inside `<pre>`
    blockTextElements: {},
  });
  return [result, _thisOptions];
}