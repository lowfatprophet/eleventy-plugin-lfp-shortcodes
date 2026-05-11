import type { HTMLElement} from 'node-html-parser';

export function root(element: HTMLElement) {
  return element.childNodes.at(0);
}

export function tagName(element: HTMLElement) {
  return (root(element) as HTMLElement | undefined)?.tagName?.toLowerCase();
}