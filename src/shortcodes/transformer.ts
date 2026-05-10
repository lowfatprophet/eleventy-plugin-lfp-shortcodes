import memoize from 'memoize';
import { existsSync } from 'node:fs';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { basename, join } from 'node:path';
import { type RolldownBuild, rolldown } from 'rolldown';
import type { LFPEleventyScope, LFPShortcodeConfig } from '../types.d.ts';
import { ASSET_OUTPUT } from '../util/constants.js';
import { cssmin, jsmin } from '../util/helper.js';

function isDevelopment() { return false; }

// default output path for styles transformed by the following shortcode
const defaultStyleOutputPath = join(ASSET_OUTPUT, 'styles');
// default output path for scripts transformed by the following shortcode
const defaultScriptOutputPath = join(ASSET_OUTPUT, 'scripts');

// async function _transform(
//   this: LFPEleventyScope,
//   inputPath,
//   outputPath,
//   inlineReturn,
//   fileReturn,
//   transformerFunction,
//   transformerOptions,
// ) {
//   const inputContent = await fs.readFile(inputPath);

//   const processedContent = await transformerFunction(
//     inputContent.toString(),
//     transformerOptions,
//   );

//   if (inline.length) {
//     return inlineReturn(
//       inline !== 'true' ? inline.replaceAll("'", '"') : '',
//       processedContent,
//     );
//   } else {
//     const relativeOutputPath = path.dirname(
//       path.join(this.eleventy.directories.output, outputPath),
//     );
//     if (!existsSync(relativeOutputPath)) {
//       await fs.mkdir(relativeOutputPath, { recursive: true });
//     }

//     const baseName = path.basename(inputPath);

//     fs.writeFile(path.join(relativeOutputPath, baseName), processedContent);

//     return fileReturn(path.join(outputPath, baseName));
//   }
// }

/**
 * Transforms a given file and either returns the string or writes to file.
 * **Specify paths always relative to the execution source/project root.**
 * @example
 * ```nunjucks
 * {% css "/path/to/input" "media='screen'" %}
 * {# yields: #}
 * <style media="screen"><!-- processed content --></style>
 *
 * {% css "/path/to/input" %}
 * {% css "/path/to/input" "" "/path/to/output" %}
 * <link rel="stylesheet" href="/path/to/output" type="text/css">
 */
export async function css(
  this: LFPEleventyScope,
  config: LFPShortcodeConfig, 
  inputPath: string,
  inline: string = '',
  outputPath: string = defaultStyleOutputPath,
) {
  console.log(config);
  const inputContent = await readFile(join(process.cwd(), inputPath));

  const memoizedCssmin = memoize(cssmin);

  const processedContent = await memoizedCssmin(inputContent.toString());

  if (inline.length) {
    return /* html */ `<style ${inline !== 'true' ? inline.replaceAll("'", '"') : ''}>${processedContent}</style>`;
  } else {
    const relativeOutputPath = join(
      this.eleventy.directories.output,
      outputPath,
    );

    if (!existsSync(relativeOutputPath)) {
      await mkdir(relativeOutputPath, { recursive: true });
    }

    const baseName = basename(inputPath);

    writeFile(join(relativeOutputPath, baseName), processedContent);

    return /* html */ `<link rel="stylesheet" href="/${join(outputPath, baseName)}" type="text/css" />`;
  }
}

/**
 * Transforms a given file and either returns the string or writes to file.
 * **Specify paths always relative to the execution source/project root.**
 * @example
 * ```nunjucks
 * {% js "/path/to/input" "type='module'" %}
 * {# yields: #}
 * <script type="module"><!-- processed content --></script>
 *
 * {% js "/path/to/input" %}
 * {% js "/path/to/input" "" "/path/to/output" %}
 * <script src="/path/to/output"></script>
 */
export async function js(
  this: LFPEleventyScope,
  config: LFPShortcodeConfig, 
  inputPath: string,
  inline: string = '',
  outputPath: string = defaultScriptOutputPath,
) {
  const inputContent = await readFile(join(process.cwd(), inputPath));

  // TODO: TypeScript integration
  // maybe by checking file extension? `path.extname()`
  // or by explicitly calling a new `tsmin()` shortcode?

  const memoizedJsmin = memoize(jsmin);

  const processedContent = await memoizedJsmin(inputContent.toString());

  if (inline.length) {
    return /* html */ `<script ${inline !== 'true' ? inline.replaceAll("'", '"') : ''}>${processedContent}</script>`;
  } else {
    const relativeOutputPath = join(
      this.eleventy.directories.output,
      outputPath,
    );
    if (!existsSync(relativeOutputPath)) {
      await mkdir(relativeOutputPath, { recursive: true });
    }

    const baseName = basename(inputPath);

    writeFile(join(relativeOutputPath, baseName), processedContent);

    return /* html */ `<script type="module" src="/${join(outputPath, baseName)}"></script>`;
  }
}

/** Bundles and minifies the given input file with its dependencies. Including treeshaking and inlining. */
export async function jsbundle(
  this: LFPEleventyScope,
  config: LFPShortcodeConfig,
  input: string,
  output: string
): Promise<string | undefined> {
  const isDev = isDevelopment();

  let bundle: RolldownBuild | null = null;

  try {
    bundle = await rolldown({
      input,
      optimization: { inlineConst: true },
      transform: {
        define: {
          'import.meta.vitest': 'undefined',
        },
      },
    });

    bundle.write({
      comments: { legal: true },
      file: output,
      format: 'esm',
      hashCharacters: 'base64',
      keepNames: isDev,
      minify: !isDev,
      sourcemap: isDev ? 'inline' : false,
    });

    return /* html */ `<script src="/${output.replace(this.eleventy.directories.output, '')}" type="module"></script>`;
  } catch {
    if (bundle) await bundle.close();
    return;
  }
}
