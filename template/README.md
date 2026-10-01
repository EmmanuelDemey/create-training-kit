# {{title}}

The material of the **{{title}}** training: a slide deck, hands-on workshops,
and the site that publishes them — built by
[training-kit](https://www.npmjs.com/package/@emmanueldemey/training-kit).

```
slides/            one Markdown file per chapter (Slidev)
workshops/         one folder per workshop: its README.md and the starter code
solutions/         the worked answers, one folder per workshop, same names
training.config.mjs
```

## Write

```bash
npm install
npm run list       # what the numbering picks up, and what it leaves out
npm run dev        # the deck, live — http://localhost:3030
npm run site       # the workshops site, live — http://localhost:4321
```

**The number at the start of a name is its place.** `slides/3-routing.md` is
chapter 3, `workshops/3-routing/` is workshop 3; `10-…` comes after `9-…`. A
name that starts with `_` is turned off — kept on disk, left out of the deck, the
site, the PDFs and the ZIPs. There is no list to maintain anywhere else.

The slides folder is a regular Slidev project: `components/`, `public/`,
`styles/`, `layouts/` next to the chapters work as Slidev documents them.

## Build

```bash
npm run build          # everything, into build/
npm run build:fast     # without the PDF exports (the slow part)
npx serve build        # serve it as the host will
```

```
build/
  index.html                 the workshops site — one page per workshop
  slides/                    the deck
  downloads/
    {{slug}}-slides.pdf        the deck, exported
    {{slug}}-workshops.pdf     the workshops, as one printable handbook
    {{slug}}-solutions.zip     the worked answers
    {{slug}}-participants.zip  both PDFs + the workshop folders, no solutions
    tp/
      1-first-steps-starter.zip     one workshop, ready to work in
      1-first-steps-solution.zip    its solution: solutions/1-first-steps/
```

Each workshop page links its two ZIPs, and the Resources page lists them all.
A solution is paired with its workshop by folder name: keep them identical.

The PDF exports print with Chromium. To use one already on the machine instead
of downloading Playwright's, set `TRAINING_KIT_CHROME` to its path.

## Deploy

`netlify.toml` is ready: connect the repository, nothing else to set. Any static
host works — publish `build/`. `build/_redirects` (the deck's SPA fallback) and
`build/_headers` (what the online editor of the workshop pages needs) use
Netlify's format; translate them for another host.
