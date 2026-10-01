# TP 1 — First steps

> Make the page greet whoever the visitor says they are. One file to change,
> and a browser to check it in.

## Goal

- Read a value from a form
- Update the page without reloading it

## Setup

```bash
npm install
npm run dev
```

Open the address it prints.

## Steps

1. In `app.js`, listen to the `submit` event of the form.
2. Prevent the default submission — the page must not reload.
3. Write `Hello, <name>!` into the `#greeting` paragraph.

## Done when

- Typing a name and pressing <kbd>Enter</kbd> shows the greeting
- The page never reloads
