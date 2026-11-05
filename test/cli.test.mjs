import { test } from 'vitest';
import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { chmod, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { delimiter, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { promisify } from 'node:util';

const cli = fileURLToPath(new URL('../bin/create-training-kit.mjs', import.meta.url));

/** Runs the CLI as `<manager> create` would: the manager says who it is in npm_config_user_agent. */
async function create(args, { agent, path = process.env.PATH } = {}) {
  const dir = join(await mkdtemp(join(tmpdir(), 'create-training-kit-')), 'training');
  const env = { ...process.env, PATH: path, npm_config_user_agent: agent };
  const { stdout } = await promisify(execFile)(process.execPath, [cli, dir, '--yes', ...args], { env });
  return { dir, stdout };
}

test.each([
  { agent: 'pnpm/12.3.1 npm/? node/v22.12.0 linux x64', install: 'pnpm install', dev: 'pnpm dev', build: 'pnpm build' },
  { agent: 'yarn/4.9.0 npm/? node/v22.12.0 linux x64', install: 'yarn install', dev: 'yarn dev', build: 'yarn build' },
  { agent: 'npm/11.0.0 node/v22.12.0 linux x64', install: 'npm install', dev: 'npm run dev', build: 'npm run build' },
  // `bun build` is bun's bundler, not the script.
  {
    agent: 'bun/1.3.0 npm/? node/v24.3.0 linux x64',
    install: 'bun install',
    dev: 'bun run dev',
    build: 'bun run build',
  },
])('prints the commands of the manager it was run with: $install', async ({ agent, install, dev, build }) => {
  const { stdout } = await create([], { agent });

  assert.match(stdout, new RegExp(`^  ${install}$`, 'm'));
  assert.match(stdout, new RegExp(`^  ${dev} `, 'm'));
  assert.match(stdout, new RegExp(`^  ${build} `, 'm'));
});

test('prints the npm commands when it cannot tell the manager', async () => {
  const { stdout } = await create([], { agent: 'deno/2.4.0 npm/? deno/2.4.0 linux x86_64' });

  assert.match(stdout, /^ {2}npm install$/m);
  assert.match(stdout, /^ {2}npm run dev /m);
});

test('--install runs the install of the manager it was run with, in the new training', async () => {
  const bin = await mkdtemp(join(tmpdir(), 'fake-pnpm-'));
  await writeFile(join(bin, 'pnpm'), '#!/bin/sh\necho "$PWD $*" > "$PWD/installed.txt"\n');
  await chmod(join(bin, 'pnpm'), 0o755);

  const { dir, stdout } = await create(['--install'], {
    agent: 'pnpm/12.3.1 npm/? node/v22.12.0 linux x64',
    path: `${bin}${delimiter}${process.env.PATH}`,
  });

  assert.equal((await readFile(join(dir, 'installed.txt'), 'utf8')).trim(), `${dir} install`);
  assert.doesNotMatch(stdout, /^ {2}pnpm install$/m);
  assert.match(stdout, /^ {2}pnpm dev /m);
});
