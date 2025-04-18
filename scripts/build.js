import { fileURLToPath } from 'node:url';
import { basename, join } from 'node:path';
import { rm, readFile, readdir } from 'node:fs/promises';
import { transform } from 'lightningcss';
import * as esbuild from 'esbuild';

const ROOT_DIR = fileURLToPath(new URL('../', import.meta.url));
const DIST_DIR = join(ROOT_DIR, 'dist');
const COMPONENTS_DIR = join(ROOT_DIR, 'src/components');

const entryPoints = await getEntryPoints();
await clearDist();
await buildJS(entryPoints);
await buildJS(entryPoints, { minify: true, outExtension: '.min.js' });

/**
 *
 * @param {string[]} entryPoints
 * @param {{
 *   minify?: boolean;
 *   outExtension?: string;
 * }} [opts]
 */
async function buildJS(entryPoints, opts = {}) {
  await esbuild.build({
    entryPoints,
    target: 'es2022',
    minify: opts.minify || false,
    bundle: true,
    outdir: DIST_DIR,
    plugins: [inlineCssPlugin()],
    outExtension: opts.outExtension ? { '.js': opts.outExtension } : {},
  });
}

async function clearDist() {
  await rm(DIST_DIR, { force: true, recursive: true });
}

async function getEntryPoints() {
  const files = await readdir(COMPONENTS_DIR, { withFileTypes: true });
  return files
    .filter((file) => file.isDirectory())
    .map((dir) => {
      const name = dir.name;
      return ({
        in: join(COMPONENTS_DIR, name, `${name}.js`),
        out: name,
      });
    });
}

function inlineCssPlugin() {
  return {
    name: 'inline-css',
    setup(build) {
      const namespace = 'inline-css';

      build.onResolve({ filter: /\.css\?inline/ }, (args) => {
        const filePath = join(args.resolveDir, args.path.replace('?inline', ''));
        return {
          namespace,
          path: filePath.replace(ROOT_DIR, ''),
        };
      });

      build.onLoad({ filter: /.*/, namespace }, async (args) => {
        const filePath = join(ROOT_DIR, args.path);
        const contents = await readFile(filePath);
        const { code } = transform({
          filename: basename(filePath),
          code: contents,
          minify: true,
        });
        return {
          contents: code.toString(),
          loader: 'text',
        };
      });
    },
  };
}
