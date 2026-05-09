declare module '@11ty/eleventy-fetch' {
  export default function<T>(source: URL | string | (() => Promise<T> | T), options: Record<string, Any>): Promise<T> | T;
}