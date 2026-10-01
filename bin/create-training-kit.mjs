#!/usr/bin/env node
// npm create training-kit [folder] [-- --title "…" --author "…" --no-playground --yes]

import { readFileSync } from 'node:fs';
import { basename, relative, resolve } from 'node:path';
import { createInterface } from 'node:readline/promises';
import { parseArgs } from 'node:util';
import { scaffold } from '../src/scaffold.mjs';

const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));

const { values, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    title: { type: 'string' },
    author: { type: 'string' },
    'no-playground': { type: 'boolean', default: false },
    // The training-kit dependency of the new project: a range, or a `file:`
    // path to try an unreleased training-kit.
    kit: { type: 'string', default: `^${version}` },
    yes: { type: 'boolean', short: 'y', default: false },
    help: { type: 'boolean', short: 'h', default: false },
  },
});

if (values.help) {
  console.log(`Usage: npm create training-kit [folder] -- [options]

  --title <text>      the name of the training (asked otherwise)
  --author <text>     shown on the cover of the deck and of the handbook
  --no-playground     no online editor on the workshop pages
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

try {
  const folder = positionals[0] ?? (await ask('Folder of the new training', 'my-training'));
  const dir = resolve(folder);
  const title = values.title ?? (await ask('Title of the training', titleCase(basename(dir))));
  const author = values.author ?? (await ask('Author, for the covers', ''));
  const playground = values['no-playground']
    ? false
    : !/^n/i.test(await ask('Online editor on the workshop pages? (Y/n)', 'y'));
  prompt?.close();

  await scaffold({
    dir,
    answers: { title, slug: kebab(title) || kebab(basename(dir)), author, playground, kit: values.kit },
  });

  // `npm create` runs through npx, so the agent says which manager the user typed.
  const agent = (process.env.npm_config_user_agent ?? 'npm').split('/')[0];
  const runner = agent === 'npm' ? 'npm run' : agent;
  const where = relative(process.cwd(), dir) || '.';

  console.log(`
✔ ${title} — in ${where}/

  cd ${where}
  ${agent} install
  ${runner} dev          the deck, live
  ${runner} site         the workshops site, live
  ${runner} build        the deck, the site, the PDFs and the ZIPs, into build/

Add a chapter: slides/3-<name>.md. Add a workshop: workshops/2-<name>/README.md.
The number at the start of the name is its place.`);
} catch (error) {
  prompt?.close();
  console.error(`✖ ${error.message}`);
  process.exit(1);
}
