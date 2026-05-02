import test from 'node:test';
import assert from 'node:assert/strict';
import { filterByTypes, scorePart, sortRows, tierRank } from '../src/lib/viewer.js';

const sampleParts = [
  { abbr: 'DrSw', type: 'blade', tier: 'A+', searchTokens: ['drsw', 'dran sword', 'tier:a+'] },
  { abbr: 'A', type: 'bit', tier: 'X', searchTokens: ['a', 'accel', 'tier:x'] },
  { abbr: '7-60', type: 'ratchet', tier: 'X', searchTokens: ['7-60', 'tier:x'] },
];

test('filterByTypes keeps only checked types', () => {
  const out = filterByTypes(sampleParts, ['bit', 'ratchet']);
  assert.deepEqual(out.map(item => item.type), ['bit', 'ratchet']);
});

test('scorePart prefers exact match over prefix/contains', () => {
  assert.equal(scorePart(sampleParts[0], 'drsw'), 3);
  assert.equal(scorePart(sampleParts[0], 'dra'), 2);
  assert.equal(scorePart(sampleParts[0], 'swo'), 1);
});

test('tierRank sorts X above A+', () => {
  assert.ok(tierRank('X') > tierRank('A+'));
  assert.equal(tierRank(''), -1);
});

test('sortRows can sort by tier descending', () => {
  const rows = sampleParts.map(part => ({ part, score: 0 }));
  const out = sortRows(rows, 'tier-desc');
  assert.deepEqual(out.slice(0, 2).map(row => row.part.abbr), ['7-60', 'A']);
});


