import { hasCaption, ifCaption, md, mdWith } from '../util/helper.js';

/**
 * Takes a string, wraps it in a `<span>` with offset colo sytle applied.
 */
function colorOffset(text: string) {
  return /* html */ `<span>${text}</span>`;
}

/**
 * Centers text. Checks for optional caesura to center around.
 */
function textCenter(line: string) {
  const caesura = '||';
  const segments = line.split(caesura);
  const commonStyle = 'flex:1 1 50%;';

  return segments.length !== 2
    ? /* html */ `<span style="text-align:center">${segments.join(caesura)}</span>`
    : /* html */ `<span style="display:inline-flex;justify-content:center;width:100%"><span style="${commonStyle}text-align:right;">${segments.at(0)}</span><span style="flex:0 0 3ch;text-align:center;">${colorOffset(caesura)}</span><span style="${commonStyle}">${segments.at(1)}</span></span>`;
}

function textEnd(line: string) {
  return /* html */ `<span style="text-align:end">${line}</span>`;
}

/**
 * # Poem short code
 *
 * Creates a poem, preserving structure and layout.
 *
 * ## Usage advice
 *
 * - best use HTML entitites (e.g., `&rdquo;`) to represent quotes as `markdown-it` is not reliable
 * - wrap individually styled lines in explicit elements: `<span data-text-center>Roses are red</span>`
 * - **text inserted inside `<span>` or other HTML elements is not processed via `markdown-it`!**
 * - available styling data attributes:
 *   - `data-text-center`: aligns single line in center
 *   - `data-text-end`: aligns single line at the end
 * @example
 * ```nunjucks
 * {% poem "The caption" "dir:rtl;line-height:1" %}
 * Roses are red,
 *     violets are blue,
 * I return this shortcode
 *     right back to you!
 * {% endpoem %}
 */
export function poem(content: string, caption: string = '') {
  const formattedContent = content
    .split('\n')
    .reduce((poem, line, i, lines) => {
      // only include if non-empty line and not first or last item
      if (!((i === 0 || i === lines.length - 1) && !line.length)) {
        // check if line is wrapped in HTML
        const match = line.match(
          /^<(?<tag>.*?)(?<attr>.*?)>(?<text>.*?)<\/(\k<tag>.*?)>$/m,
        );

        if (!match) {
          // only render from Markdown if not enclosed in HTML tag
          poem.push(
            /* html */ `<span>${mdWith({ typographer: true }).renderInline(line.replaceAll(' ', '&nbsp;'))}</span>`,
          );
        } else {
          if (!match.groups?.text) return poem;
          // if line is HTML, check for classes to apply
          if (match.groups?.attr?.includes('data-text-center'))
            poem.push(textCenter(match.groups.text));
          if (match.groups?.attr?.includes('data-text-end'))
            poem.push(textEnd(match.groups.text));
        }
      }
      return poem;
    }, [] as string[])
    .join('\n')
    // subtle slashes and caesurae
    .replaceAll(/(\s\/\s|\s\|\|\s)/g, colorOffset);
  return /* html */ `<figure ${!hasCaption(caption) ? 'role="figure"' : ''}>
  <div><pre>${formattedContent}</pre>
  </div>
  ${ifCaption(
    caption,
    /* html */ `<figcaption>
  <small>
    &mdash;&nbsp;${md.renderInline(caption)}
  </small>
</figcaption>`,
  )}
</figure>`;
}
