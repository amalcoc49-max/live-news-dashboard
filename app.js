// ── FEED SOURCES ─────────────────────────────────────────────────────────────
// Uses rss2json.com (free, no sign-up needed) to convert RSS → JSON
const RSS2JSON = 'https://api.rss2json.com/v1/api.json?rss_url=';

const FEEDS = [
  {
    id: 'bbc-world',
    name: 'BBC News',
    category: 'world',
    color: '#bb1919',
    textColor: '#fff',
    abbr: 'BBC',
    url: 'http://feeds.bbci.co.uk/news/world/rss.xml',
  },
  {
    id: 'reuters',
    name: 'Reuters',
    category: 'world',
    color: '#ff8000',
    textColor: '#fff',
    abbr: 'RTR',
    url: 'https://feeds.reuters.com/reuters/topNews',
  },
  {
    id: 'aljazeera',
    name: 'Al Jazeera',
    category: 'world',
    color: '#003366',
    textColor: '#fff',
    abbr: 'AJE',
    url: 'https://www.aljazeera.com/xml/rss/all.xml',
  },
  {
    id: 'techcrunch',
    name: 'TechCrunch',
    category: 'tech',
    color: '#0a7c3e',
    textColor: '#fff',
    abbr: 'TC',
    url: 'https://techcrunch.com/feed/',
  },
  {
    id: 'theverge',
    name: 'The Verge',
    category: 'tech',
    color: '#e45c10',
    textColor: '#fff',
    abbr: 'VRG',
    url: 'https://www.theverge.com/rss/index.xml',
  },
  {
    id: 'bbc-business',
    name: 'BBC Business',
    category: 'business',
    color: '#007b5e',
    textColor: '#fff',
    abbr: 'BBCB',
    url: 'http://feeds.bbci.co.uk/news/business/rss.xml',
  },
  {
    id: 'nasa',
    name: 'NASA News',
    category: 'science',
    color: '#0b3d91',
    textColor: '#fff',
    abbr: 'NASA',
    url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss',
  },
  {
    id: 'espn',
    name: 'ESPN Top',
    category: 'sports',
    color: '#cc0000',
    textColor: '#fff',
    abbr: 'ESPN',
    url: 'https://www.espn.com/espn/rss/news',
  },
  {
    id: 'guardian-world',
    name: 'The Guardian',
    category: 'world',
    color: '#274e13',
    textColor: '#fff',
    abbr: 'GDN',
    url: 'https://www.theguardian.com/world/rss',
  },
];

// ── STATE ─────────────────────────────────────────────────────────────────────
const state = {
  articles: {},       // { feedId: [articles] }
  seen: {},           // { feedId: Set of guids seen in last fetch }
  category: 'all',
  countdown: 60,
  countdownTimer: null,
  refreshTimer: null,
};

// ── DOM REFS ──────────────────────────────────────────────────────────────────
const dashboard   = document.getElementById('dashboard');
const statusText  = document.getElementById('status-text');
const countdownEl = document.getElementById('countdown');
const refreshBtn  = document.getElementById('refresh-btn');
const tickerTrack = document.getElementById('ticker-track');
const modalOverlay = document.getElementById('modal-overlay');
const modalClose   = document.getElementById('modal-close');

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

// ── FETCH ONE FEED ────────────────────────────────────────────────────────────
async function fetchFeed(feed) {
  const apiUrl = `${RSS2JSON}${encodeURIComponent(feed.url)}&count=10`;
  const res = await fetch(apiUrl);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (data.status !== 'ok') throw new Error(data.message || 'Feed error');

  return data.items.map(item => ({
    id:      item.guid || item.link,
    title:   item.title,
    desc:    item.description ? stripHtml(item.description).slice(0, 280) : '',
    link:    item.link,
    date:    item.pubDate ? new Date(item.pubDate) : new Date(),
    author:  item.author || '',
  }));
}

function stripHtml(html) {
  const tmp = document.createElement('div');
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || '';
}

// ── RENDER FUNCTIONS ──────────────────────────────────────────────────────────
function buildSkeleton() {
  return `
    ${[1,2,3,4].map(() => `
      <div class="skeleton-item">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    `).join('')}
  `;
}

function renderArticle(article, isNew) {
  const ago = timeAgo(article.date);
  return `
    <div class="article-item" data-id="${escHtml(article.id)}">
      <div class="article-title">${escHtml(article.title)}</div>
      <div class="article-meta">
        <span>${ago}</span>
        ${article.author ? `<span class="dot">·</span><span>${escHtml(article.author.slice(0, 30))}</span>` : ''}
        ${isNew ? '<span class="article-new-badge">NEW</span>' : ''}
      </div>
    </div>
  `;
}

function renderFeedCard(feed) {
  return `
    <div class="feed-card" id="card-${feed.id}" data-cat="${feed.category}">
      <div class="feed-card-header">
        <div class="feed-channel-info">
          <div class="feed-channel-icon" style="background:${feed.color};color:${feed.textColor}">
            ${feed.abbr}
          </div>
          <div>
            <div class="feed-channel-name">${feed.name}</div>
            <div class="feed-channel-cat">${feed.category}</div>
          </div>
        </div>
        <div class="feed-status" id="status-${feed.id}">LOADING</div>
      </div>
      <div class="feed-articles" id="articles-${feed.id}">
        ${buildSkeleton()}
      </div>
    </div>
  `;
}

function escHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function timeAgo(date) {
  const diff = Math.floor((Date.now() - date.getTime()) / 1000);
  if (diff < 60)   return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

// ── INIT CARDS ────────────────────────────────────────────────────────────────
function initDashboard() {
  dashboard.innerHTML = FEEDS.map(renderFeedCard).join('');
  applyFilter(state.category);
}

// ── LOAD ALL FEEDS ────────────────────────────────────────────────────────────
async function loadAllFeeds() {
  setStatus('Refreshing all feeds…');
  refreshBtn.classList.add('spinning');

  const results = await Promise.allSettled(FEEDS.map(loadFeed));
  const ok    = results.filter(r => r.status === 'fulfilled').length;
  const fail  = results.filter(r => r.status === 'rejected').length;

  setStatus(`${ok} feeds loaded${fail ? `, ${fail} failed` : ''} — last updated ${new Date().toLocaleTimeString()}`);
  refreshBtn.classList.remove('spinning');
  updateTicker();
}

async function loadFeed(feed) {
  const statusEl   = document.getElementById(`status-${feed.id}`);
  const articlesEl = document.getElementById(`articles-${feed.id}`);
  if (!articlesEl) return;

  try {
    const articles = await fetchFeed(feed);

    // Track new articles (not seen in previous fetch)
    const prevSeen = state.seen[feed.id] || new Set();
    const newIds   = new Set(articles.map(a => a.id).filter(id => !prevSeen.has(id)));
    state.seen[feed.id] = new Set(articles.map(a => a.id));
    state.articles[feed.id] = articles;

    articlesEl.innerHTML = articles
      .map(a => renderArticle(a, newIds.has(a.id) && prevSeen.size > 0))
      .join('');

    // Attach click → modal
    articlesEl.querySelectorAll('.article-item').forEach(el => {
      const id = el.dataset.id;
      const article = articles.find(a => a.id === id);
      if (article) el.addEventListener('click', () => openModal(feed, article));
    });

    statusEl.textContent = `${articles.length} stories`;
    statusEl.className = 'feed-status ok';
  } catch (err) {
    console.warn(`[${feed.id}] fetch error:`, err.message);
    statusEl.textContent = 'ERROR';
    statusEl.className = 'feed-status error';
    if (!state.articles[feed.id]) {
      articlesEl.innerHTML = `
        <div class="feed-error">
          <span>⚠</span>
          Unable to load this feed.<br>Check your connection or try refreshing.
        </div>`;
    }
  }
}

// ── TICKER ────────────────────────────────────────────────────────────────────
function updateTicker() {
  const all = Object.values(state.articles).flat();
  if (!all.length) return;
  const headlines = all
    .sort((a, b) => b.date - a.date)
    .slice(0, 15)
    .map(a => escHtml(a.title));
  tickerTrack.innerHTML =
    `<span class="ticker-scroll">${headlines.join('&nbsp;&nbsp;·&nbsp;&nbsp;')}</span>`;
}

// ── MODAL ─────────────────────────────────────────────────────────────────────
function openModal(feed, article) {
  document.getElementById('modal-source').textContent = feed.name.toUpperCase();
  document.getElementById('modal-source').style.color = feed.color;
  document.getElementById('modal-title').textContent = article.title;
  document.getElementById('modal-meta').textContent =
    article.date.toLocaleString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }) +
    (article.author ? ` · ${article.author}` : '');
  document.getElementById('modal-desc').textContent = article.desc || 'No summary available.';
  document.getElementById('modal-link').href = article.link;
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

// ── CATEGORY FILTER ───────────────────────────────────────────────────────────
function applyFilter(cat) {
  state.category = cat;
  document.querySelectorAll('.feed-card').forEach(card => {
    const show = cat === 'all' || card.dataset.cat === cat;
    card.style.display = show ? 'flex' : 'none';
  });
  document.querySelectorAll('.cat-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.cat === cat);
  });
}

document.querySelectorAll('.cat-btn').forEach(btn => {
  btn.addEventListener('click', () => applyFilter(btn.dataset.cat));
});

// ── AUTO REFRESH ──────────────────────────────────────────────────────────────
function startCountdown() {
  clearInterval(state.countdownTimer);
  state.countdown = 60;
  countdownEl.textContent = state.countdown;

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

// ── STATUS ────────────────────────────────────────────────────────────────────
function setStatus(msg) {
  statusText.textContent = msg;
}

// ── BOOT ──────────────────────────────────────────────────────────────────────
initDashboard();
loadAllFeeds().then(startCountdown);