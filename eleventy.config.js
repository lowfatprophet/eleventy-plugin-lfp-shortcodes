import pluginSyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import slugify from '@sindresorhus/slugify';
import mdAnchor from 'markdown-it-anchor';
import mdFootnotes from 'markdown-it-footnote';
import lfpShortcodes from './dist/index.mjs';

export default async function(eleventyConfig) {
  eleventyConfig.amendLibrary('md', mdLib => {
    mdLib.use(mdAnchor, {
      permalink: mdAnchor.permalink.headerLink({ safariReaderFix: true }),
      slugify,
    });
    mdLib.use(mdFootnotes);
    mdLib.renderer.rules.footnote_block_open = () => {
      return /* html */ `<section id="footnotes-section" aria-label="Footnotes">
        <ol class="footnotes-list">`;
    };
    return mdLib;
  });

  eleventyConfig.addShortcode('toc', function () {
    const headings = [...this.page.rawInput.matchAll(/^#+?\s(?<heading>.*?$)/gm)]
      .map(([,heading]) => /* html */ `<li style="padding-inline:var(--spacing-md)">
        <a href="${slugify(heading)}" style="color:var(--color-fg-primary);text-decoration:none">${heading}</a>
      </li>`);
    return headings.length
      ? /* html */ `<nav style="position:sticky;inset-block-start:var(--spacing-xl);padding-block:var(--spacing-xs);border-inline-start:var(--border-1);overflow-x:auto">
        <h2 style="padding-inline:var(--spacing-md);font-size:inherit">On this page</h2>
        <ul style="list-style:none;padding:0">
          ${headings.join('\n')}
        </ul>
      </nav>`
      : '';
  });

  eleventyConfig.addPairedShortcode('example', function (inner) {
    return /* html */ `<div style="padding:16px;border:var(--border-1)">${inner}</div>`;
  });
  
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });
  
  eleventyConfig.addPlugin(lfpShortcodes);

  eleventyConfig.addPassthroughCopy({ 'dist/scripts/**/*.mjs': 'scripts' });
  eleventyConfig.addPassthroughCopy({ 'docs/styles/**/*.css': 'styles' });

	return {
    dir: {
      data: '_data',
      includes: '_includes',
      input: 'docs',
      layouts: '_layouts',
      output: '_site',
    },
  };
};