# LivePulse — Live News Dashboard

A real-time news dashboard that auto-refreshes feeds from major global channels every 60 seconds.

## Channels Included
| Channel | Category |
|---|---|
| BBC News | World |
| Reuters | World |
| Al Jazeera | World |
| The Guardian | World |
| TechCrunch | Technology |
| The Verge | Technology |
| BBC Business | Business |
| NASA News | Science |
| ESPN | Sports |

## Features
- Auto-refreshes every 60 seconds
- Breaking news ticker
- Category filter (World, Tech, Business, Science, Sports)
- Click any article for a quick summary modal
- NEW badge on fresh articles since last refresh
- Live clock

## Setup & Run

### Option 1 — Open directly
Just open `index.html` in your browser. Done.

### Option 2 — Live Server in VS Code (recommended)
1. Install the **Live Server** extension in VS Code
2. Right-click `index.html` → **Open with Live Server**
3. It auto-reloads when you edit files

### Option 3 — Deploy to GitHub Pages
```bash
git init
git add .
git commit -m "Initial commit: LivePulse news dashboard"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/live-news-dashboard.git
git push -u origin main
```
Then in GitHub → Settings → Pages → Source: `main` branch → Save.
Your dashboard will be live at: `https://YOUR_USERNAME.github.io/live-news-dashboard/`

## Add More Feeds
In `app.js`, add an entry to the `FEEDS` array:
```js
{
  id: 'my-feed',
  name: 'My Channel',
  category: 'world',       // world | tech | business | science | sports
  color: '#e63946',        // card icon background
  textColor: '#fff',
  abbr: 'MCH',             // short label shown in card
  url: 'https://example.com/rss.xml',  // any RSS feed URL
}
```

## Tech Stack
- Vanilla HTML / CSS / JS — zero dependencies, zero build step
- RSS → JSON via [rss2json.com](https://rss2json.com) (free, no API key)