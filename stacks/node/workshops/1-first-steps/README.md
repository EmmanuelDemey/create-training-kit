# TP 1 — First steps

> Write the function that greets whoever it is given. The tests are already
> written: make them pass, one by one.

## Goal

- Read a failing test and make it pass
- Work in a test loop

## Setup

```bash
npm run test:watch
```

Nothing to install: the tests run on Node's own test runner.

## Steps

1. In `src/greet.js`, return `Hello, <name>!`.
2. Trim the spaces around the name.
3. Greet the world when the name is empty.

## Done when

- `npm test` passes, all three tests green
