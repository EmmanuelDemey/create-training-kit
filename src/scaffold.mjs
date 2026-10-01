// Writes a new training from template/: a starter deck of two chapters, one
// workshop with its solution, and the package that builds them.

import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const TEMPLATE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'template');

/** npm drops these from a published package, so the template ships them renamed. */
const RENAMED = { _gitignore: '.gitignore' };

/**
 * The versions a new training starts on. training-kit drives these tools but
 * leaves them to the project (they are its peer dependencies), so a training
 * can move to a newer Slidev or Astro without waiting for a training-kit release.
 */
const TOOLS = {
  '@astrojs/starlight': '^0.42.0',
  '@slidev/cli': '52.8.0',
  '@slidev/theme-default': '^0.25.0',
  astro: '^7.2.10',
  sharp: '^0.35.3',
};

/**
 * Every file of `templateDir`, its `{{key}}` placeholders filled from `answers`.
 * In JavaScript the value goes in as a literal (`"Vue.js"`, `true`), elsewhere
 * as text. Unknown keys are left alone — `{{ count }}` in a Vue slide is not ours.
 */
export async function renderTemplate(templateDir, answers) {
  const files = {};
  for (const entry of await readdir(templateDir, { withFileTypes: true, recursive: true })) {
    if (!entry.isFile()) continue;
    const absolute = join(entry.parentPath, entry.name);
    const path = relative(templateDir, absolute).split(sep).join('/');
    const target = path.replace(/[^/]+$/, (name) => RENAMED[name] ?? name);
    const literal = target.endsWith('.mjs');

    files[target] = (await readFile(absolute, 'utf8')).replaceAll(/\{\{(\w+)\}\}/g, (match, key) =>
      key in answers ? (literal ? JSON.stringify(answers[key]) : String(answers[key])) : match,
    );
  }
  return files;
}

/** The package.json of the new training. `kit` is the training-kit version range. */
export function packageJson({ slug, playground, kit }) {
  const devDependencies = {
    ...TOOLS,
    ...(playground ? { '@stackblitz/sdk': '^1.11.1' } : {}),
    '@emmanueldemey/training-kit': kit,
  };
  return `${JSON.stringify(
    {
      name: slug,
      private: true,
      type: 'module',
      scripts: {
        list: 'training-kit list',
        dev: 'training-kit slides',
        site: 'training-kit site',
        build: 'training-kit build',
        'build:fast': 'training-kit build --no-pdf',
      },
      devDependencies: Object.fromEntries(Object.entries(devDependencies).toSorted(([a], [b]) => (a < b ? -1 : 1))),
      engines: { node: '>=22.12' },
    },
    null,
    2,
  )}\n`;
}

/** Writes the training into `dir`, which must be missing or empty. */
export async function scaffold({ dir, answers }) {
  if (existsSync(dir) && (await readdir(dir)).length > 0) {
    throw new Error(`${dir} is not empty — pick a new folder name`);
  }

  const files = {
    ...(await renderTemplate(TEMPLATE_DIR, answers)),
    'package.json': packageJson(answers),
  };
  for (const [path, content] of Object.entries(files)) {
    await mkdir(dirname(join(dir, path)), { recursive: true });
    await writeFile(join(dir, path), content);
  }
  return Object.keys(files);
}
