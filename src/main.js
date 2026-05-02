import './style.css';

const DATA_URL = 'data/display-data.json';
const TIER_ORDER = ['X', 'S+', 'S', 'A+', 'A', 'B+', 'B', 'C+', 'C', 'D+', 'D', 'E+', 'E'];

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="shell">
    <header>
      <h1>BladeX Data Viewer</h1>
      <p>Full dataset loaded from <code>${DATA_URL}</code>.</p>
    </header>

    <section class="controls">
      <input id="q" type="search" placeholder="Search by code/name/tier (e.g. Dr, Wizard, tier:x)" autocomplete="off" />
      <select id="sort">
        <option value="relevance" selected>Relevance</option>
        <option value="tier-desc">Tier High -&gt; Low</option>
        <option value="tier-asc">Tier Low -&gt; High</option>
        <option value="abbr">Code A -&gt; Z</option>
      </select>
      <span id="meta">Loading...</span>
    </section>

    <ul id="list" class="cards"></ul>
  </main>
`;

const listEl = document.querySelector('#list');
const metaEl = document.querySelector('#meta');
const inputEl = document.querySelector('#q');
const sortEl = document.querySelector('#sort');

let allParts = [];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function tierRank(tier) {
  if (!tier) return -1;
  const t = String(tier).trim().toUpperCase();
  const index = TIER_ORDER.indexOf(t);
  return index >= 0 ? 100 - index : 0;
}

function score(part, query) {
  if (!query) return 0;
  const q = query.toLowerCase();
  let best = -1;
  for (const token of part.searchTokens || []) {
    const t = String(token).toLowerCase();
    if (t === q) return 3;
    if (t.startsWith(q)) best = Math.max(best, 2);
    else if (t.includes(q)) best = Math.max(best, 1);
  }
  return best;
}

function sortResults(rows, mode) {
  const out = [...rows];
  if (mode === 'tier-desc') {
    return out.sort((a, b) => tierRank(b.part.tier) - tierRank(a.part.tier) || b.score - a.score || a.part.abbr.localeCompare(b.part.abbr));
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
  return out.sort((a, b) => b.score - a.score || a.part.abbr.length - b.part.abbr.length || a.part.abbr.localeCompare(b.part.abbr));
}

function viewRows() {
  const query = inputEl.value.trim().toLowerCase();
  const rows = allParts
    .map(part => ({ part, score: score(part, query) }))
    .filter(row => !query || row.score >= 0);
  return sortResults(rows, sortEl.value);
}

function render() {
  const rows = viewRows();
  metaEl.textContent = `${rows.length} / ${allParts.length} items`;

  listEl.innerHTML = rows.map(({ part }) => `
    <li>
      <strong>${escapeHtml(part.abbr)}</strong>
      <span>${escapeHtml(part.nameEng || part.nameJap || '(no name)')}</span>
      <small>${escapeHtml(part.type)}${part.line ? ` · ${escapeHtml(part.line)}` : ''}</small>
      ${part.tier ? `<em>Tier ${escapeHtml(part.tier)}</em>` : ''}
    </li>
  `).join('');
}

async function load() {
  const response = await fetch(DATA_URL);
  if (!response.ok) throw new Error(`Failed to load ${DATA_URL}: ${response.status}`);
  allParts = await response.json();
  render();
}

inputEl.addEventListener('input', render);
sortEl.addEventListener('change', render);

load().catch(err => {
  metaEl.textContent = 'Load failed';
  listEl.innerHTML = `<li>${escapeHtml(err.message)}</li>`;
});
