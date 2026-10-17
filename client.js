/* global TrelloPowerUp */
const { appKey, appName } = window.SHUFFLER_CONFIG;
const API = 'https://api.trello.com/1';
const CONCURRENCY = 4;          // parallel card updates (keeps well under rate limits)
const MAX_RETRIES = 3;          // retries on HTTP 429 / transient errors

// --- helpers --------------------------------------------------------------

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function trello(method, path, token, params = {}) {
  const qs = new URLSearchParams({ ...params, key: appKey, token });
  for (let attempt = 0; ; attempt++) {
    const res = await fetch(`${API}/${path}?${qs}`, { method });
    if (res.ok) return res.json();
    if ((res.status === 429 || res.status >= 500) && attempt < MAX_RETRIES) {
      await sleep(1000 * 2 ** attempt);   // 1s, 2s, 4s
      continue;
    }
    throw new Error(`Trello API ${res.status}: ${await res.text()}`);
  }
}

// Fisher–Yates shuffle (in place)
function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Run async jobs with a small concurrency cap
async function runPool(jobs, limit) {
  let next = 0;
  const workers = Array.from({ length: Math.min(limit, jobs.length) }, async () => {
    while (next < jobs.length) await jobs[next++]();
  });
  await Promise.all(workers);
}

// --- the action -----------------------------------------------------------

async function shuffleList(t) {
  const api = t.getRestApi();

  if (!(await api.isAuthorized())) {
    return t.popup({ title: 'Authorize List Shuffler', url: './authorize.html', height: 150 });
  }

  const token = await api.getToken();
  const list = await t.list('id', 'name');
  t.closePopup();

  const cards = await trello('GET', `lists/${list.id}/cards`, token, { fields: 'pos' });
  if (cards.length < 2) {
    return t.alert({ message: 'Nothing to shuffle: this list has fewer than 2 cards.', duration: 4 });
  }

  // Reuse the list's existing position values, handed out in a random order.
  const slots = cards.map((c) => c.pos).sort((a, b) => a - b);
  const order = shuffle([...cards]);
  const jobs = order
    .map((card, i) => ({ card, pos: slots[i] }))
    .filter(({ card, pos }) => card.pos !== pos)
    .map(({ card, pos }) => () => trello('PUT', `cards/${card.id}`, token, { pos }));

  t.alert({ message: `🎲 Shuffling ${cards.length} cards in “${list.name}”…`, duration: 3 });

  try {
    await runPool(jobs, CONCURRENCY);
    t.alert({ message: `Shuffled “${list.name}”.`, duration: 3, display: 'success' });
  } catch (err) {
    console.error(err);
    if (/API 401/.test(err.message)) await api.clearToken();  // token revoked: re-auth next time
    t.alert({ message: 'Shuffle failed partway. Check the console, then try again.', duration: 6, display: 'error' });
  }
}

// --- register capabilities ------------------------------------------------

TrelloPowerUp.initialize(
  {
    'list-actions': function () {
      return [{ text: '🎲 Shuffle cards', callback: shuffleList }];
    }
  },
  { appKey, appName }
);
