import assert from 'node:assert/strict';
import test from 'node:test';
import { normalizeAnswer } from './game-logic.js';

test('normalizes currency amounts and thousands separators', () => {
  assert.equal(normalizeAnswer('₱1,200.50'), '1200.50');
});

test('ignores case, punctuation, and repeated whitespace', () => {
  assert.equal(normalizeAnswer('  SUM,   OF TERMS! '), 'sum of terms');
});

test('preserves signs and percentage values', () => {
  assert.equal(normalizeAnswer('-2.50%'), '-2.50%');
});
