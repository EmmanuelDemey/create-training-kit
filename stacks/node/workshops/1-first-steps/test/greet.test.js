import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greet } from '../src/greet.js';

test('greets the person by name', () => {
  assert.equal(greet('Ada'), 'Hello, Ada!');
});

test('trims the name it is given', () => {
  assert.equal(greet('  Ada '), 'Hello, Ada!');
});

test('greets the world when there is no name', () => {
  assert.equal(greet(''), 'Hello, world!');
});
