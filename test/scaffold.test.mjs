import { test } from 'vitest';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, symlink, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { tmpdir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';
import { listNumbered, loadConfig, readWorkshops } from '@emmanueldemey/training-kit';
import { KIT, packageJson, renderTemplate, scaffold, TEMPLATE_DIR } from '../src/scaffold.mjs';

const answers = { title: 'Advanced Vue.js', slug: 'advanced-vue-js', author: 'Jane Doe', playground: true };

const emptyDir = () => mkdtemp(join(tmpdir(), 'create-training-kit-'));

/** What an install does for training.config.mjs: makes `training-kit` resolvable from the project. */
async function installKit(dir) {
  const kit = dirname(createRequire(import.meta.url).resolve('@emmanueldemey/training-kit/package.json'));
  await mkdir(join(dir, 'node_modules', '@emmanueldemey'), { recursive: true });
  await symlink(kit, join(dir, 'node_modules', '@emmanueldemey', 'training-kit'), 'dir');
}

test('fills the placeholders and restores the dotfiles npm would strip from a package', async () => {
  const files = await renderTemplate(TEMPLATE_DIR, answers);

  assert.ok('.gitignore' in files);
  assert.ok(!('_gitignore' in files));
  assert.match(files['training.config.mjs'], /title: "Advanced Vue\.js"/);
  assert.match(files['training.config.mjs'], /author: "Jane Doe"/);
  assert.doesNotMatch(Object.values(files).join('\n'), /\{\{\w+\}\}/);
});

test('turns the online editor off in the config when asked', async () => {
  const files = await renderTemplate(TEMPLATE_DIR, { ...answers, playground: false });

  assert.match(files['training.config.mjs'], /playground: false/);
});

test('the package runs training-kit and pins the tools it drives', () => {
  const manifest = JSON.parse(packageJson({ ...answers, kit: KIT }));

  assert.equal(manifest.name, 'advanced-vue-js');
  assert.equal(manifest.scripts.dev, 'training-kit slides');
  assert.equal(manifest.scripts.build, 'training-kit build');
  assert.equal(manifest.devDependencies['@emmanueldemey/training-kit'], KIT);
  for (const tool of ['@slidev/cli', '@slidev/theme-default', 'astro', '@astrojs/starlight', '@stackblitz/sdk']) {
    assert.ok(manifest.devDependencies[tool], `${tool} is missing`);
  }
});

test('leaves the StackBlitz SDK out when there is no online editor', () => {
  const manifest = JSON.parse(packageJson({ ...answers, playground: false, kit: KIT }));

  assert.equal(manifest.devDependencies['@stackblitz/sdk'], undefined);
});

test('writes a project that training-kit reads as is: numbered chapters and workshops', async () => {
  const dir = join(await emptyDir(), 'vue');

  await scaffold({ dir, answers: { ...answers, kit: KIT } });

  assert.ok(existsSync(join(dir, 'package.json')));
  await installKit(dir);
  const config = await loadConfig(dir);
  const { entries: chapters } = await listNumbered(config.paths.slides, { type: 'file', extension: '.md' });
  const { workshops, withoutReadme } = await readWorkshops(config);
  assert.deepEqual(
    chapters.map((chapter) => chapter.order),
    [1, 2],
  );
  assert.deepEqual(
    workshops.map((workshop) => workshop.order),
    [1],
  );
  assert.deepEqual(withoutReadme, []);
  assert.equal(config.title, 'Advanced Vue.js');
});

test('the CLI depends on the training-kit release it was written for, not on its own version', async () => {
  const dir = join(await emptyDir(), 'vue');
  const cli = fileURLToPath(new URL('../bin/create-training-kit.mjs', import.meta.url));

  await promisify(execFile)(process.execPath, [cli, dir, '--yes', '--title', 'Advanced Vue.js']);

  const manifest = JSON.parse(await readFile(join(dir, 'package.json'), 'utf8'));
  assert.equal(manifest.devDependencies['@emmanueldemey/training-kit'], KIT);
  assert.equal(KIT, '^0.0.1');
});

test('never writes over a folder that already holds something', async () => {
  const dir = await emptyDir();
  await writeFile(join(dir, 'notes.md'), 'mine');

  await assert.rejects(scaffold({ dir, answers: { ...answers, kit: KIT } }), /is not empty/);
  assert.equal(await readFile(join(dir, 'notes.md'), 'utf8'), 'mine');
});
