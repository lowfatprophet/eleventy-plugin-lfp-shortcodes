import pluginSyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import slugify from '@sindresorhus/slugify';
import mdAnchor from 'markdown-it-anchor';
import mdFootnotes from 'markdown-it-footnote';
import lfpShortcodes from './dist/index.mjs';
import packageConfig from './package.json' with { type: 'json' };

export default async function(eleventyConfig) {
  const repositoryUrl = packageConfig.repository.url.replace(/\.git$/, '').split('+').at(1) ?? false;

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

  eleventyConfig.addGlobalData('repositoryUrl', repositoryUrl);
  eleventyConfig.addGlobalData('repositoryHost', () => {
    return repositoryUrl ? new URL(repositoryUrl).hostname : false;
  });

  eleventyConfig.addShortcode('toc', function () {
    const headings = [...this.page.rawInput.matchAll(/^#+?\s(?<heading>.*?$)/gm)]
      .map(([,heading]) => /* html */ `<li style="padding-inline:var(--spacing-md)">
        <a href="#${slugify(heading)}" class="secondary" style="display:block;padding-block:0.25em;">${heading}</a>
      </li>`);
    return headings.length
      ? /* html */ `<nav>
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
  eleventyConfig.addPassthroughCopy({ 'docs/static/**/*': '/' });

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