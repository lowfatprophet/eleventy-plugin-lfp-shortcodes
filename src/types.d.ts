
export declare function EmbedFunction(url: URL): string;
export declare function EmbedFunction(url: URL): Promise<string>;
export declare function EmbedFunction(url: URL, uuid: string): string;
export declare function EmbedFunction(url: URL, uuid: string): Promise<string>;

export interface LFPEleventyData extends EleventyData {
  directories: {
    input: string;
		includes: string;
		data: string;
		output: string;
  }
}

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
