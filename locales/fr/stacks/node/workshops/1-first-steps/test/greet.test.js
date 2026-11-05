import { test } from 'node:test';
import assert from 'node:assert/strict';
import { greet } from '../src/greet.js';

test('salue la personne par son prénom', () => {
  assert.equal(greet('Ada'), 'Bonjour, Ada !');
});

test('retire les espaces autour du prénom', () => {
  assert.equal(greet('  Ada '), 'Bonjour, Ada !');
});

test('salue tout le monde quand il n’y a pas de prénom', () => {
  assert.equal(greet(''), 'Bonjour, tout le monde !');
});
