import pluginSyntaxHighlight from '@11ty/eleventy-plugin-syntaxhighlight';
import slugify from '@sindresorhus/slugify';
import mdAnchor from 'markdown-it-anchor';
import mdFootnotes from 'markdown-it-footnote';
import * as pagefind from 'pagefind';
import lfpShortcodes from './dist/index.mjs';
import packageConfig from './package.json' with { type: 'json' };

const DEFAULT_GITHUB_ICONS = {
  note: '<svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" fill="currentcolor"><path d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8Zm8-6.5a6.5 6.5 0 1 0 0 13 6.5 6.5 0 0 0 0-13ZM6.5 7.75A.75.75 0 0 1 7.25 7h1a.75.75 0 0 1 .75.75v2.75h.25a.75.75 0 0 1 0 1.5h-2a.75.75 0 0 1 0-1.5h.25v-2h-.25a.75.75 0 0 1-.75-.75ZM8 6a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>',
  tip: '<svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" fill="currentcolor"><path d="M8 1.5c-2.363 0-4 1.69-4 3.75 0 .984.424 1.625.984 2.304l.214.253c.223.264.47.556.673.848.284.411.537.896.621 1.49a.75.75 0 0 1-1.484.211c-.04-.282-.163-.547-.37-.847a8.456 8.456 0 0 0-.542-.68c-.084-.1-.173-.205-.268-.32C3.201 7.75 2.5 6.766 2.5 5.25 2.5 2.31 4.863 0 8 0s5.5 2.31 5.5 5.25c0 1.516-.701 2.5-1.328 3.259-.095.115-.184.22-.268.319-.207.245-.383.453-.541.681-.208.3-.33.565-.37.847a.751.751 0 0 1-1.485-.212c.084-.593.337-1.078.621-1.489.203-.292.45-.584.673-.848.075-.088.147-.173.213-.253.561-.679.985-1.32.985-2.304 0-2.06-1.637-3.75-4-3.75ZM5.75 12h4.5a.75.75 0 0 1 0 1.5h-4.5a.75.75 0 0 1 0-1.5ZM6 15.25a.75.75 0 0 1 .75-.75h2.5a.75.75 0 0 1 0 1.5h-2.5a.75.75 0 0 1-.75-.75Z"></path></svg>',
  important: '<svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" fill="currentcolor"><path d="M0 1.75C0 .784.784 0 1.75 0h12.5C15.216 0 16 .784 16 1.75v9.5A1.75 1.75 0 0 1 14.25 13H8.06l-2.573 2.573A1.458 1.458 0 0 1 3 14.543V13H1.75A1.75 1.75 0 0 1 0 11.25Zm1.75-.25a.25.25 0 0 0-.25.25v9.5c0 .138.112.25.25.25h2a.75.75 0 0 1 .75.75v2.19l2.72-2.72a.749.749 0 0 1 .53-.22h6.5a.25.25 0 0 0 .25-.25v-9.5a.25.25 0 0 0-.25-.25Zm7 2.25v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 9a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>',
  warning: '<svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" fill="currentcolor"><path d="M6.457 1.047c.659-1.234 2.427-1.234 3.086 0l6.082 11.378A1.75 1.75 0 0 1 14.082 15H1.918a1.75 1.75 0 0 1-1.543-2.575Zm1.763.707a.25.25 0 0 0-.44 0L1.698 13.132a.25.25 0 0 0 .22.368h12.164a.25.25 0 0 0 .22-.368Zm.53 3.996v2.5a.75.75 0 0 1-1.5 0v-2.5a.75.75 0 0 1 1.5 0ZM9 11a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"></path></svg>',
  caution: '<svg viewBox="0 0 16 16" version="1.1" width="16" height="16" aria-hidden="true" fill="currentcolor"><path d="M4.47.22A.749.749 0 0 1 5 0h6c.199 0 .389.079.53.22l4.25 4.25c.141.14.22.331.22.53v6a.749.749 0 0 1-.22.53l-4.25 4.25A.749.749 0 0 1 11 16H5a.749.749 0 0 1-.53-.22L.22 11.53A.749.749 0 0 1 0 11V5c0-.199.079-.389.22-.53Zm.84 1.28L1.5 5.31v5.38l3.81 3.81h5.38l3.81-3.81V5.31L10.69 1.5ZM8 4a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 8 4Zm0 8a1 1 0 1 1 0-2 1 1 0 0 1 0 2Z"></path></svg>',
};

function markdownItGitHubAlerts(md, options) {
  const {
    markers = ['TIP', 'NOTE', 'IMPORTANT', 'WARNING', 'CAUTION'],
    icons = DEFAULT_GITHUB_ICONS,
    matchCaseSensitive = false,
    titles = {},
    classPrefix = 'markdown-alert',
    containerElement = 'div',
  } = options;

  const markerNameRE = markers === '*' ? '\\w+' : markers.join('|');
  const RE = new RegExp(
    `^\\\\?\\[\\!(${markerNameRE})\\]([^\\n\\r]*)`,
    matchCaseSensitive ? '' : 'i',
  );

  md.core.ruler.after('block', 'github-alerts', state => {
    const tokens = state.tokens;
    for (let i = 0; i < tokens.length; i++) {
      if (tokens[i].type === 'blockquote_open') {
        const open = tokens[i];
        const startIndex = i;
        while (tokens[i]?.type !== 'blockquote_close' && i <= tokens.length)
          i += 1;
        const close = tokens[i];
        const endIndex = i;
        const firstContent = tokens
          .slice(startIndex, endIndex + 1)
          .find(token => token.type === 'inline');
        if (!firstContent) continue;
        const match = firstContent.content.match(RE);
        if (!match) continue;
        const type = match[1].toLowerCase();
        const title = match[2].trim() || (titles[type] ?? `${type.slice(0, 1).toUpperCase()}${type.slice(1)}`);
        const icon = icons[type] ?? '';
        firstContent.content = firstContent.content
          .slice(match[0].length)
          .trimStart();
        open.type = 'alert_open';
        open.tag = containerElement;
        open.meta = { title, type, icon };
        close.type = 'alert_close';
        close.tag = containerElement;
      }
    }
  });
  md.renderer.rules.alert_open = (tokens, idx) => {
    const { title, type, icon } = tokens[idx].meta;
    return `<${containerElement} class="${classPrefix} ${classPrefix}-${type}"><p class="${classPrefix}-title">${icon}${title}</p>`;
  };
}

export default async function(eleventyConfig) {
  // naive URL string constructor
  const buildUrl = (base, path) => [base.replace(/\/$/, ''), path.replace(/^\//, '')].join('/');
  
  // check if Eleventy is in `prod` or `dev`
  const isDev = ['serve', 'watch'].includes(process.env.ELEVENTY_RUN_MODE);
  // fetch and clean repository URL, return false if not found
  const repositoryUrl = packageConfig.repository.url.replace(/\.git$/, '').split('+').at(1) ?? false;
  // global base URL, falls back to empty string for local dev; TODO: should be set via `config`
  const baseUrl = isDev
    ? ''
    : 'https://lowfatprophet.codeberg.page/eleventy-plugin-lfp-shortcodes/';

  // amend markdown-it
  eleventyConfig.amendLibrary('md', mdLib => {
    // deep-linkable headings
    mdLib.use(mdAnchor, {
      permalink: mdAnchor.permalink.headerLink({ safariReaderFix: true }),
      slugify,
    });
    // GitHub-flavored callouts
    mdLib.use(markdownItGitHubAlerts, {
      classPrefix: 'lfp-alert',
      containerElement: 'aside',
    });
    // linkable footnotes
    mdLib.use(mdFootnotes);
    mdLib.renderer.rules.footnote_block_open = () => {
      return /* html */ `<section class="lfp-footnotes" aria-label="Footnotes">
        <ol>`;
    };
    // absolute paths for markdown links
    if (baseUrl !== '/') {
      const defaultLinkRenderer = mdLib.renderer.rules.link_open || function (tokens, idx, options, env, self) {
        return self.renderToken(tokens, idx, options);
      };
      mdLib.renderer.rules.link_open = (tokens, idx, options, env, self) => {
        const href = tokens[idx].attrGet('href')
        if (href.startsWith('/')) tokens[idx].attrSet('href', buildUrl(baseUrl, href));
        return defaultLinkRenderer(tokens, idx, options, env, self);
      };
    }
    return mdLib;
  });

  // theme config
  // TODO: customization via `config` object, can be passed to template as is
  eleventyConfig.addGlobalData('baseUrl', baseUrl);
  eleventyConfig.addGlobalData('version', packageConfig.version);
  eleventyConfig.addGlobalData('repositoryUrl', repositoryUrl);
  eleventyConfig.addGlobalData('repositoryHost', () => {
    return repositoryUrl ? new URL(repositoryUrl).hostname : false;
  });

  // convert relative path to absolute URL
  eleventyConfig.addFilter('absolute', path => {
    return isDev ? path : buildUrl(baseUrl, path);
  });

  // check if current page has headings (pass `page.rawInput`)
  eleventyConfig.addFilter('headings', function (input) {
    return /^#+?\s(?<heading>.*?$)/gm.test(input);
  });

  // generates table of contents for current page
  eleventyConfig.addShortcode('toc', function () {
    const headings = [...this.page.rawInput.matchAll(/^(?<level>#+?)\s(?<heading>.*?$)/gm)]
      .map(([, level, heading]) => /* html */ `<li>
        <a href="#${slugify(heading)}" class="lfp-secondary" style="display:block;padding:0.25em 0 0.25em ${level.length - 2}em;">${heading}</a>
      </li>`);
    return headings.length
      ? /* html */ `<nav>
        <h2>On this page</h2>
        <ul>
          ${headings.join('\n')}
        </ul>
      </nav>`
      : false;
  });

  // generates codeblock with code copy button
  eleventyConfig.addPairedShortcode('codeblock', function (content) {
    return /* html */ `<figure class="lfp-codeblock">
      <button class="lfp-copy-button">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
          <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1z"/>
          <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0z"/>
        </svg>
      </button>
      ${content}
    </figure>`;
  });

  // generates example frame for rendered code examples
  eleventyConfig.addPairedShortcode('example', function (inner) {
    return /* html */ `<div style="padding:16px;border:var(--border-1)">${inner}</div>`;
  });
  
  // default Eleventy syntax highlight plugin
  eleventyConfig.addPlugin(pluginSyntaxHighlight, {
    preAttributes: { tabindex: 0 },
  });
  
  // own LFP shortcodes
  eleventyConfig.addPlugin(lfpShortcodes);

  // copy own LFP shortcodes
  eleventyConfig.addPassthroughCopy({ 'dist/scripts/**/*.mjs': 'scripts' });
  // copy all theme styles
  eleventyConfig.addPassthroughCopy({ 'docs/styles/**/*.css': 'styles' });
  // copy all static content
  eleventyConfig.addPassthroughCopy({ 'docs/static/**/*': '/' });
  // TODO: more clever way of dealing with passthrough copies
  // (especially for customized content, e.g., images)

  // post processing
  eleventyConfig.on('eleventy.after', async ({ directories }) => {
    // make docs searchable
    const { index } = await pagefind.createIndex({
      forceLanguage: 'en',
      site: baseUrl,
      verbose: true,
    });

    await index?.addDirectory({ path: directories.output });

    await index?.writeFiles({ outputPath: `${directories.output}/pagefind` });

    await pagefind.close();
  });

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