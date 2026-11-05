#!/usr/bin/env node
// npm create training-kit [folder] [-- --title "…" --author "…" --template vue --lang fr --no-playground --playground --empty --install --no-git --yes]

import { basename, relative, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';
import { packageManager } from '../src/package-manager.mjs';
import { DEFAULT_STACK, KIT, LANGS, scaffold, STACKS } from '../src/scaffold.mjs';

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    title: { type: 'string' },
    author: { type: 'string' },
    template: { type: 'string', short: 't' },
    lang: { type: 'string' },
    playground: { type: 'boolean' },
    'no-playground': { type: 'boolean', default: false },
    // The training-kit dependency of the new project: a range, or a `file:`
    // path to try an unreleased training-kit.
    kit: { type: 'string', default: KIT },
    empty: { type: 'boolean', default: false },
    install: { type: 'boolean', default: false },
    'no-git': { type: 'boolean', default: false },
    yes: { type: 'boolean', short: 'y', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

if (values.help) {
  console.log(`Usage: npm create training-kit [folder] -- [options]

  --title <text>      the name of the training (asked otherwise)
  --author <text>     shown on the cover of the deck and of the handbook
  --template <stack>  the workshop starter: ${Object.keys(STACKS).join(', ')} (asked otherwise, ${DEFAULT_STACK} by default)
  --lang <code>       the language of the template and of the site: ${LANGS.join(', ')} (asked otherwise, en by default)
  --no-playground     no online editor on the workshop pages
  --playground        an online editor even for java, which does not run in it
  --empty             no example chapters nor workshop: the folders, empty, and the config
  --install           install the dependencies, with the manager that ran the command
  --no-git            no git repository in the new training
  --yes, -y           take the defaults, ask nothing`);
  process.exit(0);
}

const kebab = (text) =>
  text
    .normalize('NFD')
    .replaceAll(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, '-')
    .replaceAll(/^-|-$/g, '');

const titleCase = (text) => text.replaceAll(/[-_]+/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

const interactive = !values.yes && process.stdin.isTTY;
const prompt = interactive ? createInterface({ input: process.stdin, output: process.stdout }) : null;

/** Asks, showing the default — or takes the default straight away when not interactive. */
async function ask(question, fallback) {
  if (!prompt) return fallback;
  const answer = (await prompt.question(`${question}${fallback ? ` (${fallback})` : ''}: `)).trim();
  return answer || fallback;
}

/**
 * Starts `dir` as a git repository — unless it is already inside one, a
 * monorepo for instance, where a nested repository would hide it from the
 * outer one. Returns what to tell when it could not, '' otherwise: without
 * git, the training is written all the same.
 */
function initGit(dir) {
  const inside = spawnSync('git', ['rev-parse', '--is-inside-work-tree'], { cwd: dir, encoding: 'utf8' });
  if (inside.error) return 'git was not found: no repository — run `git init` once it is installed.';
  if (inside.stdout.trim() === 'true') return '';
  const init = spawnSync('git', ['init', '--quiet'], { cwd: dir });
  return init.status === 0 ? '' : '`git init` failed: no repository — run it again in the training.';
}

try {
  if (values.empty && values.template) {
    throw new Error('--empty writes no workshop, so no --template to start it with — drop one of them');
  }
  const folder = positionals[0] ?? (await ask('Folder of the new training', 'my-training'));
  const dir = resolve(folder);
  const title = values.title ?? (await ask('Title of the training', titleCase(basename(dir))));
  const author = values.author ?? (await ask('Author, for the covers', ''));
  const stack = values.empty
    ? DEFAULT_STACK
    : (values.template ?? (await ask(`Stack of the workshops — ${Object.keys(STACKS).join(', ')}`, DEFAULT_STACK)));
  const lang = values.lang ?? (await ask(`Language of the training — ${LANGS.join(', ')}`, 'en'));
  // Java does not run in StackBlitz: its editor is off unless asked for.
  const online = values.empty || (STACKS[stack]?.online ?? true);
  const playground = values['no-playground']
    ? false
    : (values.playground ??
      !(online ? /^n/i : /^(?!y)/i).test(
        await ask(`Online editor on the workshop pages? ${online ? '(Y/n)' : '(y/N)'}`, online ? 'y' : 'n'),
      ));
  prompt?.close();

  await scaffold({
    dir,
    answers: {
      title,
      slug: kebab(title) || kebab(basename(dir)),
      author,
      stack,
      lang,
      playground,
      empty: values.empty,
      kit: values.kit,
    },
  });

  const manager = packageManager(process.env.npm_config_user_agent);
  const where = relative(process.cwd(), dir) || '.';
  const gitWarning = values['no-git'] ? '' : initGit(dir);
  if (values.install) {
    // pnpm, yarn and npm are .cmd scripts on Windows, which only a shell runs.
    const { status, error } = spawnSync(manager.name, ['install'], {
      cwd: dir,
      stdio: 'inherit',
      shell: process.platform === 'win32',
    });
    if (status !== 0) {
      throw new Error(
        `${manager.name} install failed${error ? ` (${error.message})` : ''} — run it again in ${where}/`,
      );
    }
  }

  console.log(`
✔ ${title} — in ${where}/

  cd ${where}${values.install ? '' : `\n  ${manager.name} install`}
  ${manager.run} dev          the deck and the workshops site, live
  ${manager.run} build        the deck, the site, the PDFs and the ZIPs, into build/

${gitWarning && `${gitWarning}\n\n`}${
    values.empty
      ? 'First chapter: slides/1-<name>.md. First workshop: workshops/1-<name>/README.md,\nits solution in solutions/1-<name>/.'
      : 'Add a chapter: slides/3-<name>.md. Add a workshop: workshops/2-<name>/README.md.'
  }
The number at the start of the name is its place.`);
} catch (error) {
  prompt?.close();
  console.error(`✖ ${error.message}`);
  process.exit(1);
}
