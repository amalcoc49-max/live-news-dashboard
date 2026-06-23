// ── RSS → JSON PROXY ──────────────────────────────────────────────────────────
const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';

// ── ROTATION ENGINE ───────────────────────────────────────────────────────────
const STORAGE_KEY_ACTIVE   = 'livepulse_active_channels';
const STORAGE_KEY_LASTROT  = 'livepulse_last_rotation';
const STORAGE_KEY_HISTORY  = 'livepulse_used_ids';

function getWeekSeed() {
  // Returns a number that changes once per week — used to seed the random pick
  return Math.floor(Date.now() / ROTATION_INTERVAL_MS);
}

function seededShuffle(arr, seed) {
  // Deterministic shuffle using a simple LCG so everyone sees same rotation
  const a = [...arr];
  let s = seed;
  for (let i = a.length - 1; i > 0; i--) {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    const j = Math.abs(s) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickChannelsForThisWeek() {
  const seed    = getWeekSeed();
  const shuffled = seededShuffle(CHANNEL_POOL, seed);

  // Try to ensure category variety — pick from each category round-robin
  const byCategory = {};
  for (const ch of shuffled) {
    if (!byCategory[ch.category]) byCategory[ch.category] = [];
    byCategory[ch.category].push(ch);
  }

  const cats   = Object.keys(byCategory);
  const picked = [];
  let ci = 0;
  while (picked.length < CHANNELS_PER_ROTATION) {
    const cat = cats[ci % cats.length];
    if (byCategory[cat].length) picked.push(byCategory[cat].shift());
    ci++;
  }
  return picked;
}

function loadActiveChannels() {
  try {
    const lastRot = parseInt(localStorage.getItem(STORAGE_KEY_LASTROT) || '0');
    const currentWeek = getWeekSeed();
    if (currentWeek !== lastRot) {
      // New week — pick fresh channels
      const channels = pickChannelsForThisWeek();
      localStorage.setItem(STORAGE_KEY_ACTIVE,  JSON.stringify(channels));
      localStorage.setItem(STORAGE_KEY_LASTROT, String(currentWeek));
      return { channels, isNew: true };
    }
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY_ACTIVE) || 'null');
    return { channels: stored || pickChannelsForThisWeek(), isNew: false };
  } catch {
    return { channels: pickChannelsForThisWeek(), isNew: false };
  }
}

function daysUntilNextRotation() {
  const msLeft = (getWeekSeed() + 1) * ROTATION_INTERVAL_MS - Date.now();
  return Math.ceil(msLeft / (1000 * 60 * 60 * 24));
}

// ── STATE ─────────────────────────────────────────────────────────────────────
const state = {
  feeds:     [],
  articles:  {},
  seen:      {},
  category:  'all',
  countdown: 60,
  countdownTimer: null,
};

// ── DOM REFS ──────────────────────────────────────────────────────────────────
const dashboard    = document.getElementById('dashboard');
const statusText   = document.getElementById('status-text');
const countdownEl  = document.getElementById('countdown');
const refreshBtn   = document.getElementById('refresh-btn');
const tickerTrack  = document.getElementById('ticker-track');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose   = document.getElementById('modal-close');
const rotationInfo = document.getElementById('rotation-info');
const catNav       = document.getElementById('cat-nav');

// ── CLOCK ─────────────────────────────────────────────────────────────────────
function updateClock() {
  const now = new Date();
  document.getElementById('clock').textContent =
    now.toLocaleTimeString('en-US', { hour12: false });
  document.getElementById('clock-date').textContent =
    now.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase();
}
setInterval(updateClock, 1000);
updateClock();

// ── FETCH FEED ────────────────────────────────────────────────────────────────
async function fetchFeed(feed) {
  const apiUrl = `${RSS2JSON}${encodeURIComponent(feed.url)}&count=10`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.status !== 'ok') throw new Error(data.message || 'Feed error');
  return data.items.map(item => ({
    id:     item.guid || item.link,
    title:  item.title,
    desc:   item.description ? stripHtml(item.description).slice(0, 280) : '',
    link:   item.link,
    date:   item.pubDate ? new Date(item.pubDate) : new Date(),
    author: item.author || '',
  }));
}

function stripHtml(html) {
  const t = document.createElement('div');
  t.innerHTML = html;
  return t.textContent || t.innerText || '';
}

// ── RENDER ────────────────────────────────────────────────────────────────────
function escHtml(str) {
  if (!str) return '';
  return String(str).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)    return `${diff}s ago`;
  if (diff < 3600)  return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function buildSkeleton() {
  return [1,2,3,4].map(() => `
    <div class="skeleton-item">
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>`).join('');
}

function renderArticle(article, isNew) {
  return `
    <div class="article-item" data-id="${escHtml(article.id)}">
      <div class="article-title">${escHtml(article.title)}</div>
      <div class="article-meta">
        <span>${timeAgo(article.date)}</span>
        ${article.author ? `<span class="dot">·</span><span>${escHtml(article.author.slice(0,30))}</span>` : ''}
        ${isNew ? '<span class="article-new-badge">NEW</span>' : ''}
      </div>
    </div>`;
}

function renderFeedCard(feed) {
  return `
    <div class="feed-card" id="card-${feed.id}" data-cat="${feed.category}">
      <div class="feed-card-header">
        <div class="feed-channel-info">
          <div class="feed-channel-icon" style="background:${feed.color};color:${feed.textColor}">${feed.abbr}</div>
          <div>
            <div class="feed-channel-name">${feed.name}</div>
            <div class="feed-channel-cat">${feed.category}</div>
          </div>
        </div>
        <div class="feed-status" id="status-${feed.id}">LOADING</div>
      </div>
      <div class="feed-articles" id="articles-${feed.id}">${buildSkeleton()}</div>
    </div>`;
}

// ── CATEGORY NAV ──────────────────────────────────────────────────────────────
function buildCategoryNav() {
  // Build from CATEGORIES but only show ones present in active feeds
  const activeCats = new Set(state.feeds.map(f => f.category));
  catNav.innerHTML = CATEGORIES
    .filter(c => c === 'all' || activeCats.has(c))
    .map(c => `<button class="cat-btn${c === state.category ? ' active' : ''}" data-cat="${c}">${c === 'all' ? 'All Channels' : c.charAt(0).toUpperCase() + c.slice(1)}</button>`)
    .join('');
  catNav.querySelectorAll('.cat-btn').forEach(btn =>
    btn.addEventListener('click', () => applyFilter(btn.dataset.cat))
  );
}

function applyFilter(cat) {
  state.category = cat;
  document.querySelectorAll('.feed-card').forEach(card => {
    card.style.display = (cat === 'all' || card.dataset.cat === cat) ? 'flex' : 'none';
  });
  document.querySelectorAll('.cat-btn').forEach(btn =>
    btn.classList.toggle('active', btn.dataset.cat === cat)
  );
}

// ── DASHBOARD INIT ────────────────────────────────────────────────────────────
function initDashboard() {
  dashboard.innerHTML = state.feeds.map(renderFeedCard).join('');
  buildCategoryNav();
  applyFilter(state.category);

  const days = daysUntilNextRotation();
  rotationInfo.textContent = `Channel rotation in ${days} day${days !== 1 ? 's' : ''}  ·  ${CHANNEL_POOL.length} channels in pool`;
}

// ── LOAD ALL ──────────────────────────────────────────────────────────────────
async function loadAllFeeds() {
  setStatus('Refreshing feeds…');
  refreshBtn.classList.add('spinning');
  await Promise.allSettled(state.feeds.map(loadFeed));
  const ok   = state.feeds.filter(f => (state.articles[f.id]||[]).length > 0).length;
  const fail = state.feeds.length - ok;
  setStatus(`${ok} feeds loaded${fail ? `, ${fail} unavailable` : ''} — ${new Date().toLocaleTimeString()}`);
  refreshBtn.classList.remove('spinning');
  updateTicker();
}

async function loadFeed(feed) {
  const statusEl   = document.getElementById(`status-${feed.id}`);
  const articlesEl = document.getElementById(`articles-${feed.id}`);
  if (!articlesEl) return;
  try {
    const articles = await fetchFeed(feed);
    const prevSeen = state.seen[feed.id] || new Set();
    const newIds   = new Set(articles.map(a => a.id).filter(id => !prevSeen.has(id)));
    state.seen[feed.id]    = new Set(articles.map(a => a.id));
    state.articles[feed.id] = articles;

    articlesEl.innerHTML = articles.map(a => renderArticle(a, newIds.has(a.id) && prevSeen.size > 0)).join('');
    articlesEl.querySelectorAll('.article-item').forEach(el => {
      const article = articles.find(a => a.id === el.dataset.id);
      if (article) el.addEventListener('click', () => openModal(feed, article));
    });
    statusEl.textContent = `${articles.length} stories`;
    statusEl.className = 'feed-status ok';
  } catch (err) {
    statusEl.textContent = 'ERROR';
    statusEl.className = 'feed-status error';
    if (!state.articles[feed.id]) {
      articlesEl.innerHTML = `<div class="feed-error"><span>⚠</span>Feed unavailable. Will retry on next refresh.</div>`;
    }
  }
}

// ── TICKER ────────────────────────────────────────────────────────────────────
function updateTicker() {
  const all = Object.values(state.articles).flat();
  if (!all.length) return;
  const headlines = all.sort((a,b) => b.date - a.date).slice(0, 15).map(a => escHtml(a.title));
  tickerTrack.innerHTML = `<span class="ticker-scroll">${headlines.join('&nbsp;&nbsp;·&nbsp;&nbsp;')}</span>`;
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
function openModal(feed, article) {
  document.getElementById('modal-source').textContent = feed.name.toUpperCase();
  document.getElementById('modal-source').style.color = feed.color;
  document.getElementById('modal-title').textContent  = article.title;
  document.getElementById('modal-meta').textContent   =
    article.date.toLocaleString('en-US', { weekday:'short', month:'short', day:'numeric', year:'numeric', hour:'2-digit', minute:'2-digit' }) +
    (article.author ? ` · ${article.author}` : '');
  document.getElementById('modal-desc').textContent  = article.desc || 'No summary available.';
  document.getElementById('modal-link').href         = article.link;
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
}
modalClose.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', e => { if (e.target === modalOverlay) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

// ── AUTO REFRESH ──────────────────────────────────────────────────────────────
function startCountdown() {
  clearInterval(state.countdownTimer);
  state.countdown = 60;
  countdownEl.textContent = 60;
  state.countdownTimer = setInterval(() => {
    state.countdown--;
    countdownEl.textContent = state.countdown;
    if (state.countdown <= 0) {
      clearInterval(state.countdownTimer);
      loadAllFeeds().then(startCountdown);
    }
  }, 1000);
}
refreshBtn.addEventListener('click', () => {
  clearInterval(state.countdownTimer);
  loadAllFeeds().then(startCountdown);
});

function setStatus(msg) { statusText.textContent = msg; }

// ── BOOT ──────────────────────────────────────────────────────────────────────
(function boot() {
  const { channels, isNew } = loadActiveChannels();
  state.feeds = channels;
  initDashboard();
  if (isNew) setStatus('🔄 New weekly channel rotation loaded!');
  loadAllFeeds().then(startCountdown);
})();