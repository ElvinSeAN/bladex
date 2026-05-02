import test from 'node:test';
import assert from 'node:assert/strict';
import { STARTER_ITEMS, filterItems } from '../src/lib/items.js';

test('filterItems returns all items for empty query', () => {
  const out = filterItems(STARTER_ITEMS, '');
  assert.equal(out.length, STARTER_ITEMS.length);
});

test('filterItems finds by tier token', () => {
  const out = filterItems(STARTER_ITEMS, 'x');
  assert.ok(out.length >= 2);
  assert.ok(out.every(item => /x/i.test(item.tier) || /x/i.test(item.code) || /x/i.test(item.name)));
});

test('filterItems matches by code and name', () => {
  const byCode = filterItems(STARTER_ITEMS, 'DrSw');
  const byName = filterItems(STARTER_ITEMS, 'wizard');
  assert.equal(byCode[0]?.code, 'DrSw');
  assert.equal(byName[0]?.name, 'Wizard Rod');
});

