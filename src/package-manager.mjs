// `npm create`, `pnpm create`, `yarn create` and `bun create` all run the CLI
// through their own runner, and each one says who it is in
// npm_config_user_agent: "pnpm/12.3.1 npm/? node/v22.12.0 linux x64".

/** How each manager runs a script. `bun build` and `bun test` are bun's own, so bun needs `run`. */
const RUN = { npm: 'npm run', pnpm: 'pnpm', yarn: 'yarn', bun: 'bun run' };

/** The manager the CLI was run with, and how it runs a script — npm when it cannot tell. */
export function packageManager(userAgent = '') {
  const name = userAgent.split('/')[0];
  return Object.hasOwn(RUN, name) ? { name, run: RUN[name] } : { name: 'npm', run: RUN.npm };
}
