import './style.css';
const DATA_URL = 'data/display-data.json';
import { filterByTypes, scorePart, sortRows } from './lib/viewer.js';

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
      <div id="typeFilters" class="filter-group">
        <label class="filter-pill"><input type="checkbox" value="blade" checked /> Blade</label>
        <label class="filter-pill"><input type="checkbox" value="bit" checked /> Bit</label>
        <label class="filter-pill"><input type="checkbox" value="ratchet" checked /> Ratchet</label>
      </div>
      <span id="meta">Loading...</span>
    </section>

    <ul id="list" class="cards"></ul>
  </main>
`;

const listEl = document.querySelector('#list');
const metaEl = document.querySelector('#meta');
const inputEl = document.querySelector('#q');
const sortEl = document.querySelector('#sort');
const typeFiltersEl = document.querySelector('#typeFilters');

let allParts = [];

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function activeTypes() {
  return [...typeFiltersEl.querySelectorAll('input:checked')].map(el => el.value);
}

function viewRows() {
  const query = inputEl.value.trim().toLowerCase();
  const filtered = filterByTypes(allParts, activeTypes());
  const rows = filtered
    .map(part => ({ part, score: scorePart(part, query) }))
    .filter(row => !query || row.score >= 0);
  return sortRows(rows, sortEl.value);
}

function render() {
  const rows = viewRows();
  metaEl.textContent = `${rows.length} / ${allParts.length} items`;

  if (!rows.length) {
    listEl.innerHTML = '<li class="empty-state">No items match the current search/filter.</li>';
    return;
  }

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
typeFiltersEl.addEventListener('change', render);

load().catch(err => {
  metaEl.textContent = 'Load failed';
  listEl.innerHTML = `<li>${escapeHtml(err.message)}</li>`;
});
