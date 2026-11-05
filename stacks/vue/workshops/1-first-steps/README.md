# TP 1 — First steps

> Make the page greet whoever the visitor says they are. One component to
> change, a browser to check it in, and a test that says when it is done.

## Goal

- Keep what the visitor types in the state of a component, with a `ref` and `v-model`
- Update the page without reloading it

## Setup

```bash
npm install
npm run dev
```

Open the address it prints. `npm run test:watch` in a second terminal reruns
the test on every save.

## Steps

1. In `src/App.vue`, keep what is typed in the input in the state of the component.
2. On submit, prevent the page from reloading and keep the name to greet.
3. Show `Hello, <name>!` in the `#greeting` paragraph.

## Done when

- Typing a name and pressing <kbd>Enter</kbd> shows the greeting
- `npm test` passes
