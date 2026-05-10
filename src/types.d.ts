import type { EleventySuppliedData } from '11ty.ts';

interface AddendumConfig {
  header: {
    style: string;
    class: string;
    [key: string]: string;
  }
}


interface BlockquoteConfig {
  attribution: {
    style: string;
    class: string;
    [key: string]: string;
  }
}

export interface LFPShortcodeConfig {
  js: boolean;
  css: boolean;
  dev: boolean;
  addendum?: AddendumConfig;
  blockquote?: BlockquoteConfig;
  detail?: DetailConfig;
  embed?: EmbedConfig;
  figure?: FigureConfig;
  inflation?: InflationConfig;
  listing?: ListingConfig;
  math?: MathConfig;
  poem?: PoemConfig;
  richlink?: RichlinkConfig;
  table?: TableConfig;
  transformer?: TransformerConfig;
}

export declare function EmbedFunction(url: URL): string;
export declare function EmbedFunction(url: URL): Promise<string>;
export declare function EmbedFunction(url: URL, uuid: string): string;
export declare function EmbedFunction(url: URL, uuid: string): Promise<string>;

// exact types from `EleventyData` will still have to come from somewhere
export interface LFPEleventyData {
  directories: {
    input: string;
		includes: string;
		data: string;
		output: string;
  }
}

export interface LFPEleventySuppliedData extends EleventySuppliedData {
  [key: string]: any;
  counters?: Record<string, number>;
};

export interface LFPEleventyScope {
  eleventy: LFPEleventyData;
  page: LFPEleventySuppliedData;
};

export interface BlueskyEmbedResponse {
  type: "rich" | string;
  version: `${number}.${number}`;
  author_name: string;
  author_url: string;
  provider_name: string;
  provider_url: string;
  cache_age: number;
  width: number;
  height: number | null;
  html: string;
}

export interface LFPBlueskyEmbedResponse extends BlueskyEmbedResponse {
  status?: string;
}

export interface ILinkPreviewResponse {
  url: string;
  title: string;
  siteName: string | undefined;
  author: string | undefined;
  description: string | undefined;
  mediaType: string;
  contentType: string | undefined;
  images: string[];
  videos: IVideoType[];
  favicons: string[];
}

export type LFPPreviewResponse = ILinkPreviewResponse | {
  charset: string | null;
  url: string;
  mediaType: string;
  contentType: string;
  favicons: string[];
} | {
  charset: string | null;
  url: string;
  title: string;
  siteName: string | undefined;
  author: string | undefined;
  description: string | undefined;
  mediaType: string;
  contentType: string | undefined;
  images: string[];
  videos: IVideoType[];
  favicons: string[];
};
