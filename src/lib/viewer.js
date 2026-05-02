export const TIER_ORDER = ['X', 'S+', 'S', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E+', 'E'];

export function tierRank(tier) {
  if (!tier) return -1;
  const value = String(tier).trim().toUpperCase();
  const index = TIER_ORDER.indexOf(value);
  return index >= 0 ? 100 - index : 0;
}

export function scorePart(part, query) {
  if (!query) return 0;
  const q = String(query).trim().toLowerCase();
  if (!q) return 0;

  let best = -1;
  for (const token of part.searchTokens || []) {
    const tokenValue = String(token).toLowerCase();
    if (tokenValue === q) return 3;
    if (tokenValue.startsWith(q)) best = Math.max(best, 2);
    else if (tokenValue.includes(q)) best = Math.max(best, 1);
  }
  return best;
}

export function filterByTypes(parts, activeTypes) {
  const selected = new Set(activeTypes);
  return parts.filter(part => selected.has(part.type));
}

export function sortRows(rows, mode) {
  const out = [...rows];

  if (mode === 'tier-desc') {
    return out.sort((a, b) =>
      tierRank(b.part.tier) - tierRank(a.part.tier)
      || b.score - a.score
      || a.part.abbr.localeCompare(b.part.abbr)
    );
  }

  if (mode === 'tier-asc') {
    return out.sort((a, b) => {
      const ra = tierRank(a.part.tier);
      const rb = tierRank(b.part.tier);
      if (ra < 0 && rb < 0) return a.part.abbr.localeCompare(b.part.abbr);
      if (ra < 0) return 1;
      if (rb < 0) return -1;
      return ra - rb || b.score - a.score || a.part.abbr.localeCompare(b.part.abbr);
    });
  }

  if (mode === 'abbr') {
    return out.sort((a, b) => a.part.abbr.localeCompare(b.part.abbr) || b.score - a.score);
  }

  return out.sort((a, b) =>
    b.score - a.score
    || a.part.abbr.length - b.part.abbr.length
    || a.part.abbr.localeCompare(b.part.abbr)
  );
}

