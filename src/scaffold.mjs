// Writes a new training from template/: a starter deck of two chapters, one
// workshop with its solution, and the package that builds them. stacks/<stack>/
// is laid over it, then, for a language other than English, locales/<lang>/.

import { existsSync } from 'node:fs';
import { mkdir, readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

export const TEMPLATE_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'template');

/** One folder per stack, laid over template/: its workshop, its solution, and any file it words its own way. */
const STACKS_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'stacks');

/**
 * One folder per language but English, laid over the English files: template/
 * as locales/<lang>/template/, each stack as locales/<lang>/stacks/<stack>/. It
 * holds the files with words in them; code and manifests stay the same.
 */
const LOCALES_DIR = join(dirname(fileURLToPath(import.meta.url)), '..', 'locales');

/** The languages a training can be written in. English is template/ and stacks/ themselves. */
export const LANGS = ['en', 'fr'];

/**
 * The starters a training can begin with. `playground` is the online editor of
 * the workshop pages when it is on: the file the learner changes opens next to
 * the README, and `limits`, in each language, says what does not run there.
 * `online: false` turns it off unless asked — Java does not run in
 * StackBlitz, so the editor there only shows the code.
 */
export const STACKS = {
  vanilla: { playground: { openFile: ['README.md', 'app.js'] } },
  vue: { playground: { openFile: ['README.md', 'src/App.vue'] } },
  react: { playground: { openFile: ['README.md', 'src/App.jsx'] } },
  node: { playground: { openFile: ['README.md', 'src/greet.js'] } },
  java: {
    online: false,
    playground: {
      openFile: ['README.md', 'src/main/java/training/Greeter.java'],
      limits: {
        en: 'Java does not run in the browser: read the code here, run `mvn test` on your machine.',
        fr: 'Java ne tourne pas dans le navigateur : lisez le code ici, lancez `mvn test` sur votre machine.',
      },
    },
  },
};

export const DEFAULT_STACK = 'vanilla';

/** The online editor of `stack`, its words in `lang`. */
function playgroundOf(stack, lang) {
  const { limits, ...playground } = STACKS[stack].playground;
  return limits ? { ...playground, limits: limits[lang] } : playground;
}

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
 * The training-kit a new training depends on. The two packages are released
 * apart, so this is the training-kit release the template was written for, not
 * the generator's own version: bump it when the template needs a newer one.
 */
export const KIT = '^0.1.0';

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
        dev: 'training-kit dev',
        slides: 'training-kit slides',
        site: 'training-kit site',
        build: 'training-kit build',
        'build:fast': 'training-kit build --no-pdf',
        check: 'training-kit check',
        verify: 'training-kit verify',
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

  const stack = answers.stack ?? DEFAULT_STACK;
  if (!Object.hasOwn(STACKS, stack)) {
    throw new Error(`no "${stack}" starter — pick one of ${Object.keys(STACKS).join(', ')}`);
  }
  const lang = answers.lang ?? 'en';
  if (!LANGS.includes(lang)) {
    throw new Error(`no "${lang}" template — pick one of ${LANGS.join(', ')}`);
  }
  const filled = { ...answers, playground: answers.playground && playgroundOf(stack, lang) };

  const layers = [TEMPLATE_DIR, join(STACKS_DIR, stack)];
  if (lang !== 'en') layers.push(join(LOCALES_DIR, lang, 'template'), join(LOCALES_DIR, lang, 'stacks', stack));
  const files = {};
  for (const layer of layers) {
    if (existsSync(layer)) Object.assign(files, await renderTemplate(layer, filled));
  }
  files['package.json'] = packageJson(answers);
  for (const [path, content] of Object.entries(files)) {
    await mkdir(dirname(join(dir, path)), { recursive: true });
    await writeFile(join(dir, path), content);
  }
  return Object.keys(files);
}
