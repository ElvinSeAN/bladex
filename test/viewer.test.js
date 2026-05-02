import test from 'node:test';
import assert from 'node:assert/strict';
import { filterByTypes, scorePart, sortRows, tierRank, tierRankForPart } from '../src/lib/viewer.js';

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

test('tierRankForPart uses custom bit tier order', () => {
  assert.ok(tierRankForPart({ type: 'bit', tier: 'T0' }) > tierRankForPart({ type: 'bit', tier: 'T1' }));
  assert.ok(tierRankForPart({ type: 'bit', tier: 'T1' }) > tierRankForPart({ type: 'bit', tier: 'T3' }));
  assert.ok(tierRankForPart({ type: 'bit', tier: 'T4' }) > tierRankForPart({ type: 'bit', tier: 'T5' }));
  assert.ok(tierRankForPart({ type: 'bit', tier: 'T4' }) > tierRankForPart({ type: 'bit', tier: '' }));
});

test('sortRows can sort by tier descending', () => {
  const rows = sampleParts.map(part => ({ part, score: 0 }));
  const out = sortRows(rows, 'tier-desc');
  assert.deepEqual(out.map(row => row.part.abbr), ['7-60', 'DrSw', 'A']);
});

test('sortRows puts T1 above T3 for bit-only tier descending', () => {
  const rows = [
    { part: { abbr: 'FB', type: 'bit', tier: 'T0', searchTokens: [] }, score: 0 },
    { part: { abbr: 'RA', type: 'bit', tier: 'T3', searchTokens: [] }, score: 0 },
    { part: { abbr: 'B', type: 'bit', tier: 'T1', searchTokens: [] }, score: 0 },
    { part: { abbr: 'GB', type: 'bit', tier: 'T5', searchTokens: [] }, score: 0 },
    { part: { abbr: 'UF', type: 'bit', tier: 'T4', searchTokens: [] }, score: 0 },
    { part: { abbr: 'X', type: 'bit', tier: '', searchTokens: [] }, score: 0 },
  ];
  const out = sortRows(rows, 'tier-desc');
  assert.deepEqual(out.map(row => row.part.abbr), ['FB', 'B', 'RA', 'UF', 'GB', 'X']);
});





