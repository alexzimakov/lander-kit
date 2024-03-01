import path from 'node:path';
import fs from 'node:fs/promises';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';
import browserslist from 'browserslist';
import * as lightningcss from 'lightningcss';

const PACKAGE = JSON.parse(await fs.readFile('./package.json'));
const SRC_DIR = './src';
const OUT_DIR = './dist';

/** @type { import('rollup').RollupOptions[] } */
const entries = [];
const files = await fs.readdir(SRC_DIR);
const ignoredFiles = new Set(['utils']);
for (const file of files) {
  if (ignoredFiles.has(file)) {
    continue;
  }

  const filePath = path.join(SRC_DIR, file);
  if (!(await isDirectory(filePath))) {
    continue;
  }

  const indexJsPath = path.join(filePath, 'index.js');
  if (!(await isFile(indexJsPath))) {
    continue;
  }

  entries.push({
    onLog,
    input: indexJsPath,
    output: [
      {
        file: path.join(OUT_DIR, file, `${file}.js`),
        format: 'iife',
      },
      {
        file: path.join(OUT_DIR, file, `${file}.min.js`),
        format: 'iife',
        plugins: [terser()],
      },
    ],
    plugins: [
      inlineCss(),
      babel({ babelHelpers: 'bundled', configFile: './.babelrc.json' }),
    ],
  });
}

await fs.rm(OUT_DIR, { recursive: true, force: true });

export default entries;

/**
 * @param { import('rollup').LogLevel } level
 * @param { import('rollup').RollupLog } log
 * @param { import('rollup').LogHandler } handler
 * @returns {void}
 */
function onLog(level, log, handler) {
  if (log.code === 'MISSING_NAME_OPTION_FOR_IIFE_EXPORT') {
    return;
  }
  handler(level, log);
}

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function isDirectory(path) {
  try {
    const stats = await fs.stat(path);
    return stats.isDirectory();
  } catch {
    return false;
  }
}

/**
 * @param {string} path
 * @returns {Promise<boolean>}
 */
async function isFile(path) {
  try {
    const stats = await fs.stat(path);
    return stats.isFile();
  } catch {
    return false;
  }
}

/**
 * @returns { import('rollup').Plugin }
 */
function inlineCss() {
  const inlineCssRegex = /\.css\?inline$/;
  return {
    name: 'inline-css',

    resolveId(source, importer) {
      if (source.match(inlineCssRegex) && importer) {
        return path.join(path.dirname(importer), source);
      }
      return null;
    },

    async load(id) {
      if (id.match(inlineCssRegex)) {
        const file = id.replace(/\?inline$/, '');
        const css = await fs.readFile(file, { encoding: 'utf-8' });
        const { code } = lightningcss.transform({
          code: Buffer.from(css),
          minify: true,
          targets: lightningcss.browserslistToTargets(
            browserslist(PACKAGE.browserslist)
          ),
        });
        let inlineCss = code.toString('utf-8');
        inlineCss.replaceAll('\\', '\\\\');
        inlineCss.replaceAll('`', '`');
        return `const css = \`${inlineCss}\`;\nexport default css;\n`;
      }
      return null;
    },
  };
}
