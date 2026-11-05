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
  assert.equal(manifest.scripts.dev, 'training-kit dev');
  assert.equal(manifest.scripts.slides, 'training-kit slides');
  assert.equal(manifest.scripts.build, 'training-kit build');
  assert.equal(manifest.scripts.check, 'training-kit check');
  assert.equal(manifest.scripts.verify, 'training-kit verify');
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
  assert.equal(KIT, '^0.1.0');
});

const STARTERS = [
  { stack: 'vanilla', file: 'app.js' },
  { stack: 'vue', file: 'src/App.vue' },
  { stack: 'react', file: 'src/App.jsx' },
  { stack: 'node', file: 'src/greet.js' },
  { stack: 'java', file: 'src/main/java/training/Greeter.java' },
];

test.each(STARTERS)('writes a $stack workshop and its solution, paired by folder name', async ({ stack, file }) => {
  const dir = join(await emptyDir(), stack);

  await scaffold({ dir, answers: { ...answers, stack, kit: KIT } });

  await installKit(dir);
  const config = await loadConfig(dir);
  const { workshops } = await readWorkshops(config);
  assert.deepEqual(
    workshops.map((workshop) => workshop.name),
    ['1-first-steps'],
  );
  assert.ok(existsSync(join(dir, 'workshops/1-first-steps', file)), `the starter has no ${file}`);
  assert.ok(existsSync(join(dir, 'solutions/1-first-steps', file)), `the solution has no ${file}`);
});

test('the online editor of a stack opens on the file the learner changes', async () => {
  const dir = join(await emptyDir(), 'vue');

  await scaffold({ dir, answers: { ...answers, stack: 'vue', kit: KIT } });

  await installKit(dir);
  const { playground } = await loadConfig(dir);
  assert.deepEqual(playground.openFile, ['README.md', 'src/App.vue']);
});

test('a Java online editor says that Java does not run there', async () => {
  const dir = join(await emptyDir(), 'java');

  await scaffold({ dir, answers: { ...answers, stack: 'java', kit: KIT } });

  await installKit(dir);
  const { playground } = await loadConfig(dir);
  assert.match(playground.limits, /mvn test/);
});

test('the CLI leaves the online editor out of a Java training unless asked', async () => {
  const dir = join(await emptyDir(), 'java');
  const cli = fileURLToPath(new URL('../bin/create-training-kit.mjs', import.meta.url));

  await promisify(execFile)(process.execPath, [cli, dir, '--yes', '--template', 'java']);

  assert.match(await readFile(join(dir, 'training.config.mjs'), 'utf8'), /playground: false/);
  assert.ok(existsSync(join(dir, 'workshops/1-first-steps/pom.xml')));
});

test('refuses a stack it has no starter for, naming the ones it has', async () => {
  const dir = join(await emptyDir(), 'angular');

  await assert.rejects(
    scaffold({ dir, answers: { ...answers, stack: 'angular', kit: KIT } }),
    /vanilla, vue, react, node, java/,
  );
  assert.ok(!existsSync(dir));
});

test('the tests of the node solution pass, and those of its starter do not', async () => {
  const dir = join(await emptyDir(), 'node');
  await scaffold({ dir, answers: { ...answers, stack: 'node', kit: KIT } });
  const run = (folder) => promisify(execFile)('npm', ['test'], { cwd: join(dir, folder, '1-first-steps') });

  await run('solutions');
  await assert.rejects(run('workshops'));
});

test('never writes over a folder that already holds something', async () => {
  const dir = await emptyDir();
  await writeFile(join(dir, 'notes.md'), 'mine');

  await assert.rejects(scaffold({ dir, answers: { ...answers, kit: KIT } }), /is not empty/);
  assert.equal(await readFile(join(dir, 'notes.md'), 'utf8'), 'mine');
});
