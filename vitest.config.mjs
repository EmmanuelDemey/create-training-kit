import { defineConfig } from 'vitest/config';

export default defineConfig({
  // stacks/ and locales/ hold the starters of the new trainings, tests included: they run
  // in the trainings, not here — the starter ones fail on purpose.
  test: { include: ['test/**/*.test.mjs'] },
});
