import './style.css';
import { STARTER_ITEMS, filterItems } from './lib/items.js';

const app = document.querySelector('#app');

app.innerHTML = `
  <main class="shell">
    <header>
      <h1>BladeX Starter</h1>
      <p>Minimal Vite project scaffold ready for GitHub Pages deployment.</p>
    </header>

    <section class="controls">
      <label for="q">Quick search</label>
      <input id="q" type="search" placeholder="Try: X, Dr, Wizard" autocomplete="off" />
      <span id="meta"></span>
    </section>

    <section>
      <ul id="list" class="cards"></ul>
    </section>
  </main>
`;

const listEl = document.querySelector('#list');
const metaEl = document.querySelector('#meta');
const inputEl = document.querySelector('#q');

function render(items) {
  metaEl.textContent = `${items.length} item(s)`;
  listEl.innerHTML = items
    .map(item => `
      <li>
        <strong>${item.code}</strong>
        <span>${item.name}</span>
        <em>Tier ${item.tier}</em>
      </li>
    `)
    .join('');
}

inputEl.addEventListener('input', () => {
  render(filterItems(STARTER_ITEMS, inputEl.value));
});

render(STARTER_ITEMS);
