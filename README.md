# create-training-kit

[![CI](https://github.com/EmmanuelDemey/create-training-kit/actions/workflows/ci.yml/badge.svg)](https://github.com/EmmanuelDemey/create-training-kit/actions/workflows/ci.yml)

Scaffolds a training built with
[@emmanueldemey/training-kit](https://www.npmjs.com/package/@emmanueldemey/training-kit):
numbered slides, numbered workshops with their solutions, and everything to turn
them into a deck, a workshops site, PDFs and ZIPs.

```bash
npm create training-kit my-training
# or
pnpm create training-kit my-training
yarn create training-kit my-training
```

It asks for the title, the author, the stack of the workshops, the language,
and whether the workshop pages should carry an online editor, then writes the
project. Then:

```bash
cd my-training
npm install
npm run dev          # the deck and the site, live — http://localhost:3030 and :4321
npm run build        # the deck, the site, the PDFs and the ZIPs, into build/
```

## Options

Options go after `--` with `npm create`:

```bash
npm create training-kit my-training -- --title "Advanced Vue.js" --author "Jane Doe" --yes
```

| Option               |                                                                                                                 |
| -------------------- | --------------------------------------------------------------------------------------------------------------- |
| `[folder]`           | where to write the training — asked if missing. Must be empty or not exist                                      |
| `--title <text>`     | the name of the training — asked otherwise, defaults to the folder name                                         |
| `--author <text>`    | shown on the cover of the deck and of the handbook                                                              |
| `--template <stack>` | the workshop starter, with its solution: `vanilla` (default), `vue`, `react`, `node` or `java` — see below      |
| `--lang <code>`      | the language of the template — slides, READMEs, workshops, comments — and of the site: `en` (default) or `fr`   |
| `--no-playground`    | no online editor on the workshop pages                                                                          |
| `--playground`       | an online editor even for `java`, where it is off by default                                                    |
| `--yes`, `-y`        | take the defaults, ask nothing — also the behaviour without a terminal                                          |
| `--kit <spec>`       | the training-kit dependency to write: a version range, or `file:/path/to/training-kit` to try an unreleased one |
| `--help`, `-h`       | the list of options                                                                                             |

### Stacks

`--template` picks the first workshop and its solution; the deck and the rest
of the project are the same for all. Each starter leaves TODOs that its README
turns into steps, and its solution passes its tests — `npm run verify` checks
them all.

| Stack     | The workshop                                                | Its tests                         | Online editor                                                                                |
| --------- | ----------------------------------------------------------- | --------------------------------- | -------------------------------------------------------------------------------------------- |
| `vanilla` | a form that greets, in `app.js`, served by `serve`          | none — checked in the browser     | on, opens `app.js`                                                                           |
| `vue`     | the same form as a Vue component, `src/App.vue`, on Vite    | Vitest + `@vue/test-utils`        | on, opens `src/App.vue`                                                                      |
| `react`   | the same form as a React component, `src/App.jsx`, on Vite  | Vitest + Testing Library          | on, opens `src/App.jsx`                                                                      |
| `node`    | a `greet()` function, `src/greet.js`, to write test by test | `node --test`, nothing to install | on, opens `src/greet.js`                                                                     |
| `java`    | a `Greeter.greet()` method, Maven, JDK 21+                  | JUnit 6, `mvn test`               | off — Java does not run in StackBlitz (`--playground` shows the code, with a note saying so) |

The Java solution carries a two-line `package.json` whose `test` script runs
`mvn test`: that is what lets `npm run verify` check it.

## What it writes

```
my-training/
  package.json              the scripts, training-kit, and the versions of Slidev and Astro it drives
  training.config.mjs       the title, the folders, the options — commented
  slides/
    1-introduction.md       how the numbering works, as slides
    2-first-steps.md
  workshops/
    README.md               the introduction of the workshops
    1-first-steps/          a complete workshop in the chosen stack: README with steps
                            and a "done when", and a starter with TODOs
  solutions/
    1-first-steps/          its solution — same folder name
  README.md                 how to write, build and deploy the training
  netlify.toml              deploy build/ on Netlify, nothing else to set
  pnpm-workspace.yaml       the pnpm settings Astro needs; ignored by npm
  .vscode/extensions.json   the Slidev and Astro extensions
  .gitignore
```

The example builds as is: `npm run build` produces the deck, the site with the
workshop page and its online editor, both PDFs, and the ZIPs.

### Scripts of the new training

| Script               |                                                                              |
| -------------------- | ---------------------------------------------------------------------------- |
| `npm run list`       | what the numbering picks up, in order, and what it leaves out                |
| `npm run dev`        | the deck and the site, live, side by side                                    |
| `npm run slides`     | the deck alone — adding `slides/3-<name>.md` adds chapter 3 to the open deck |
| `npm run site`       | the workshops site alone                                                     |
| `npm run build`      | everything, into `build/`                                                    |
| `npm run build:fast` | the same without the PDF exports                                             |
| `npm run check`      | what would break — numbers, solutions, links, assets — without building      |
| `npm run verify`     | `npm run test` in every solution                                             |

## Next steps

- Add a chapter: `slides/3-<name>.md`.
- Add a workshop: `workshops/2-<name>/README.md` and its starter code, then its
  solution in `solutions/2-<name>/`.
- Turn one off without deleting it: rename it `_3-<name>`.

The number at the start of a name is its place — in the deck, on the site, in the
PDFs and in the ZIPs. The full reference is the
[training-kit README](https://www.npmjs.com/package/@emmanueldemey/training-kit).

## Contributing

Until `@emmanueldemey/training-kit` is on npm, the tests use it from a sibling
clone (`link:../training-kit`):

```bash
git clone https://github.com/EmmanuelDemey/training-kit.git
git clone https://github.com/EmmanuelDemey/create-training-kit.git
(cd training-kit && pnpm install)
cd create-training-kit
pnpm install       # also installs the pre-commit hook (husky)
pnpm run check     # oxfmt, oxlint, knip, jscpd and Vitest — what the CI and the hook run
```

`template/` is what every training gets; `stacks/<stack>/` is laid over it — the
workshop, its solution, and any file the stack words its own way
(`workshops/README.md`, `slides/2-first-steps.md` for Java). A new stack is a
folder there and an entry in `STACKS` (`src/scaffold.mjs`).

`locales/<lang>/` is laid over both for a language other than English:
`locales/fr/template/` over `template/`, `locales/fr/stacks/<stack>/` over
`stacks/<stack>/`. It holds only the files with words in them — code and
manifests stay those of the English layer. A test fails when a new file with
words has no translation. A new language is a folder there and an entry in
`LANGS`.

To try the generator with a local training-kit:

```bash
node bin/create-training-kit.mjs ../my-training --yes --title "My training" --kit "file:$PWD/../training-kit"
```

## License

MIT
