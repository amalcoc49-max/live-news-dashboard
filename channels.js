// ── MASTER CHANNEL POOL ───────────────────────────────────────────────────────
// 50+ channels across categories. Every week, a fresh set of 9 is picked.
// Add more channels here anytime — they'll enter rotation automatically.

const CHANNEL_POOL = [

  // ── WORLD ─────────────────────────────────────────────────────────────────
  { id: 'bbc-world',       name: 'BBC World',         category: 'world',    color: '#bb1919', textColor: '#fff', abbr: 'BBC',  url: 'http://feeds.bbci.co.uk/news/world/rss.xml' },
  { id: 'reuters',         name: 'Reuters',            category: 'world',    color: '#ff8000', textColor: '#fff', abbr: 'RTR',  url: 'https://feeds.reuters.com/reuters/topNews' },
  { id: 'aljazeera',       name: 'Al Jazeera',         category: 'world',    color: '#003366', textColor: '#fff', abbr: 'AJE',  url: 'https://www.aljazeera.com/xml/rss/all.xml' },
  { id: 'guardian-world',  name: 'The Guardian',       category: 'world',    color: '#274e13', textColor: '#fff', abbr: 'GDN',  url: 'https://www.theguardian.com/world/rss' },
  { id: 'npr-world',       name: 'NPR World',          category: 'world',    color: '#4a90d9', textColor: '#fff', abbr: 'NPR',  url: 'https://feeds.npr.org/1004/rss.xml' },
  { id: 'dw-world',        name: 'DW News',            category: 'world',    color: '#c8102e', textColor: '#fff', abbr: 'DW',   url: 'https://rss.dw.com/rdf/rss-en-world' },
  { id: 'france24',        name: 'France 24',          category: 'world',    color: '#003f88', textColor: '#fff', abbr: 'F24',  url: 'https://www.france24.com/en/rss' },
  { id: 'euronews',        name: 'Euronews',           category: 'world',    color: '#ffd700', textColor: '#000', abbr: 'EUR',  url: 'https://www.euronews.com/rss?level=theme&name=news' },
  { id: 'ap-news',         name: 'AP News',            category: 'world',    color: '#cc0000', textColor: '#fff', abbr: 'AP',   url: 'https://rsshub.app/apnews/topics/apf-topnews' },
  { id: 'abc-world',       name: 'ABC News',           category: 'world',    color: '#0057a8', textColor: '#fff', abbr: 'ABC',  url: 'https://feeds.abcnews.com/abcnews/internationalheadlines' },
  { id: 'rt-news',         name: 'RT News',            category: 'world',    color: '#1a1a2e', textColor: '#fff', abbr: 'RT',   url: 'https://www.rt.com/rss/news/' },
  { id: 'times-india',     name: 'Times of India',     category: 'world',    color: '#d44000', textColor: '#fff', abbr: 'TOI',  url: 'https://timesofindia.indiatimes.com/rssfeedstopstories.cms' },
  { id: 'hindu',           name: 'The Hindu',          category: 'world',    color: '#8b0000', textColor: '#fff', abbr: 'HND',  url: 'https://www.thehindu.com/news/international/?service=rss' },
  { id: 'ndtv',            name: 'NDTV',               category: 'world',    color: '#e31837', textColor: '#fff', abbr: 'NDT',  url: 'https://feeds.feedburner.com/ndtvnews-world-news' },

  // ── TECHNOLOGY ────────────────────────────────────────────────────────────
  { id: 'techcrunch',      name: 'TechCrunch',         category: 'tech',     color: '#0a7c3e', textColor: '#fff', abbr: 'TC',   url: 'https://techcrunch.com/feed/' },
  { id: 'theverge',        name: 'The Verge',          category: 'tech',     color: '#e45c10', textColor: '#fff', abbr: 'VRG',  url: 'https://www.theverge.com/rss/index.xml' },
  { id: 'wired',           name: 'Wired',              category: 'tech',     color: '#000000', textColor: '#fff', abbr: 'WRD',  url: 'https://www.wired.com/feed/rss' },
  { id: 'arstechnica',     name: 'Ars Technica',       category: 'tech',     color: '#e45c10', textColor: '#fff', abbr: 'ARS',  url: 'http://feeds.arstechnica.com/arstechnica/index' },
  { id: 'hackernews',      name: 'Hacker News',        category: 'tech',     color: '#ff6600', textColor: '#fff', abbr: 'HN',   url: 'https://hnrss.org/frontpage' },
  { id: 'mit-tech',        name: 'MIT Tech Review',    category: 'tech',     color: '#a31f34', textColor: '#fff', abbr: 'MIT',  url: 'https://www.technologyreview.com/feed/' },
  { id: 'zdnet',           name: 'ZDNet',              category: 'tech',     color: '#e60000', textColor: '#fff', abbr: 'ZDN',  url: 'https://www.zdnet.com/news/rss.xml' },
  { id: 'engadget',        name: 'Engadget',           category: 'tech',     color: '#00adef', textColor: '#fff', abbr: 'ENG',  url: 'https://www.engadget.com/rss.xml' },
  { id: 'gizmodo',         name: 'Gizmodo',            category: 'tech',     color: '#00c89c', textColor: '#fff', abbr: 'GIZ',  url: 'https://gizmodo.com/rss' },

  // ── BUSINESS ─────────────────────────────────────────────────────────────
  { id: 'bbc-business',    name: 'BBC Business',       category: 'business', color: '#007b5e', textColor: '#fff', abbr: 'BBCB', url: 'http://feeds.bbci.co.uk/news/business/rss.xml' },
  { id: 'ft',              name: 'Financial Times',    category: 'business', color: '#fff1e0', textColor: '#c00', abbr: 'FT',   url: 'https://www.ft.com/rss/home' },
  { id: 'bloomberg',       name: 'Bloomberg',          category: 'business', color: '#1b1b1b', textColor: '#fff', abbr: 'BBG',  url: 'https://feeds.bloomberg.com/markets/news.rss' },
  { id: 'economist',       name: 'The Economist',      category: 'business', color: '#e3120b', textColor: '#fff', abbr: 'ECO',  url: 'https://www.economist.com/finance-and-economics/rss.xml' },
  { id: 'forbes',          name: 'Forbes',             category: 'business', color: '#004a97', textColor: '#fff', abbr: 'FOR',  url: 'https://www.forbes.com/real-time/feed2/' },
  { id: 'cnbc',            name: 'CNBC',               category: 'business', color: '#005594', textColor: '#fff', abbr: 'CNBC', url: 'https://feeds.nbcnews.com/nbcnews/public/business' },
  { id: 'marketwatch',     name: 'MarketWatch',        category: 'business', color: '#00b140', textColor: '#fff', abbr: 'MKT',  url: 'https://feeds.marketwatch.com/marketwatch/topstories' },
  { id: 'businessinsider', name: 'Business Insider',   category: 'business', color: '#c00000', textColor: '#fff', abbr: 'BI',   url: 'https://feeds.businessinsider.com/custom/all' },

  // ── SCIENCE ───────────────────────────────────────────────────────────────
  { id: 'nasa',            name: 'NASA',               category: 'science',  color: '#0b3d91', textColor: '#fff', abbr: 'NASA', url: 'https://www.nasa.gov/rss/dyn/breaking_news.rss' },
  { id: 'science-daily',   name: 'Science Daily',      category: 'science',  color: '#6a0dad', textColor: '#fff', abbr: 'SCD',  url: 'https://www.sciencedaily.com/rss/all.xml' },
  { id: 'nature',          name: 'Nature',             category: 'science',  color: '#0e6655', textColor: '#fff', abbr: 'NAT',  url: 'https://www.nature.com/nature.rss' },
  { id: 'newscientist',    name: 'New Scientist',      category: 'science',  color: '#e84c00', textColor: '#fff', abbr: 'NS',   url: 'https://www.newscientist.com/feed/home/' },
  { id: 'popsci',          name: 'Popular Science',    category: 'science',  color: '#00a86b', textColor: '#fff', abbr: 'PSC',  url: 'https://www.popsci.com/feed/' },
  { id: 'phys-org',        name: 'Phys.org',           category: 'science',  color: '#1565c0', textColor: '#fff', abbr: 'PHY',  url: 'https://phys.org/rss-feed/' },
  { id: 'space-com',       name: 'Space.com',          category: 'science',  color: '#001f3f', textColor: '#fff', abbr: 'SPC',  url: 'https://www.space.com/feeds/all' },

  // ── SPORTS ────────────────────────────────────────────────────────────────
  { id: 'espn',            name: 'ESPN',               category: 'sports',   color: '#cc0000', textColor: '#fff', abbr: 'ESPN', url: 'https://www.espn.com/espn/rss/news' },
  { id: 'bbc-sport',       name: 'BBC Sport',          category: 'sports',   color: '#bb1919', textColor: '#fff', abbr: 'BBCS', url: 'http://feeds.bbci.co.uk/sport/rss.xml' },
  { id: 'skysports',       name: 'Sky Sports',         category: 'sports',   color: '#e8000d', textColor: '#fff', abbr: 'SKY',  url: 'https://www.skysports.com/rss/12040' },
  { id: 'goal-com',        name: 'Goal.com',           category: 'sports',   color: '#00a550', textColor: '#fff', abbr: 'GOL',  url: 'https://www.goal.com/feeds/en/news' },
  { id: 'bleacher',        name: 'Bleacher Report',    category: 'sports',   color: '#f26522', textColor: '#fff', abbr: 'BR',   url: 'https://bleacherreport.com/articles/feed' },

  // ── HEALTH ────────────────────────────────────────────────────────────────
  { id: 'who',             name: 'WHO News',           category: 'health',   color: '#009fda', textColor: '#fff', abbr: 'WHO',  url: 'https://www.who.int/rss-feeds/news-english.xml' },
  { id: 'webmd',           name: 'WebMD',              category: 'health',   color: '#e0041a', textColor: '#fff', abbr: 'WMD',  url: 'https://rssfeeds.webmd.com/rss/rss.aspx?RSSSource=RSS_PUBLIC' },
  { id: 'medscape',        name: 'Medscape',           category: 'health',   color: '#007ac2', textColor: '#fff', abbr: 'MED',  url: 'https://www.medscape.com/cx/rssfeeds/2675.xml' },
  { id: 'health-harvard',  name: 'Harvard Health',     category: 'health',   color: '#a41034', textColor: '#fff', abbr: 'HRV',  url: 'https://www.health.harvard.edu/blog/feed' },

  // ── ENTERTAINMENT ─────────────────────────────────────────────────────────
  { id: 'variety',         name: 'Variety',            category: 'entertainment', color: '#5c0d8b', textColor: '#fff', abbr: 'VAR', url: 'https://variety.com/feed/' },
  { id: 'deadline',        name: 'Deadline',           category: 'entertainment', color: '#111111', textColor: '#fff', abbr: 'DDL', url: 'https://deadline.com/feed/' },
  { id: 'hollywood',       name: 'Hollywood Reporter', category: 'entertainment', color: '#c8a951', textColor: '#000', abbr: 'THR', url: 'https://www.hollywoodreporter.com/feed/' },
  { id: 'pitchfork',       name: 'Pitchfork',          category: 'entertainment', color: '#000000', textColor: '#fff', abbr: 'PFM', url: 'https://pitchfork.com/rss/news/feed.xml' },
];

// How many channels to show at once
const CHANNELS_PER_ROTATION = 9;

// Categories in the filter bar
const CATEGORIES = ['all', 'world', 'tech', 'business', 'science', 'sports', 'health', 'entertainment'];

// How often to rotate (milliseconds). Default: 7 days.
const ROTATION_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;