export const STARTER_ITEMS = [
  { code: 'DrSw', name: 'Dran Sword', tier: 'A+' },
  { code: 'WzRd', name: 'Wizard Rod', tier: 'X' },
  { code: 'ShSc', name: 'Shark Scale', tier: 'X' },
  { code: 'KnLn', name: 'Knight Lance', tier: 'A' },
  { code: 'VpTl', name: 'Viper Tail', tier: 'A' },
];

export function filterItems(items, query) {
  const q = String(query || '').trim().toLowerCase();
  if (!q) return items;

  return items.filter(item =>
    item.code.toLowerCase().includes(q) ||
    item.name.toLowerCase().includes(q) ||
    item.tier.toLowerCase().includes(q)
  );
}

