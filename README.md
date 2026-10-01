# create-training-kit

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

It asks for the title, the author, and whether the workshop pages should carry
an online editor, then writes the project. Then:

```bash
cd my-training
npm install
npm run dev          # the deck, live — http://localhost:3030
npm run site         # the workshops site, live — http://localhost:4321
npm run build        # the deck, the site, the PDFs and the ZIPs, into build/
```

## Options

Options go after `--` with `npm create`:

```bash
npm create training-kit my-training -- --title "Advanced Vue.js" --author "Jane Doe" --yes
```

| Option            |                                                                                                                 |
| ----------------- | --------------------------------------------------------------------------------------------------------------- |
| `[folder]`        | where to write the training — asked if missing. Must be empty or not exist                                      |
| `--title <text>`  | the name of the training — asked otherwise, defaults to the folder name                                         |
| `--author <text>` | shown on the cover of the deck and of the handbook                                                              |
| `--no-playground` | no online editor on the workshop pages                                                                          |
| `--yes`, `-y`     | take the defaults, ask nothing — also the behaviour without a terminal                                          |
| `--kit <spec>`    | the training-kit dependency to write: a version range, or `file:/path/to/training-kit` to try an unreleased one |
| `--help`, `-h`    | the list of options                                                                                             |

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
    1-first-steps/          a complete workshop: README with steps and a "done when",
                            and a starter with TODOs
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
| `npm run dev`        | the deck, live — adding `slides/3-<name>.md` adds chapter 3 to the open deck |
| `npm run site`       | the workshops site, live                                                     |
| `npm run build`      | everything, into `build/`                                                    |
| `npm run build:fast` | the same without the PDF exports                                             |

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

To try the generator with a local training-kit:

```bash
node bin/create-training-kit.mjs ../my-training --yes --title "My training" --kit "file:$PWD/../training-kit"
```

## License

MIT
