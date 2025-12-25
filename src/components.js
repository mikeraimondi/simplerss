import { store } from './store';
import { parseRSS } from './rss-parser';

export function Sidebar() {
    const { feeds, currentFeed } = store.state;

    const feedItems = feeds.map(feed => `
    <li class="feed-item ${currentFeed?.url === feed.url ? 'active' : ''}" data-url="${feed.url}">
      <span class="feed-icon">📰</span>
      <span class="feed-name">${feed.name}</span>
    </li>
  `).join('');

    return `
    <aside class="sidebar">
      <div class="logo">
        <span class="logo-icon">📡</span>
        SimpleRSS
      </div>
      <ul class="feed-list">
        ${feedItems}
      </ul>
      <button class="btn-add" id="open-modal">
        <span>+</span> Add New Feed
      </button>
    </aside>
  `;
}

export function MainContent() {
    const { articles, isLoading, currentFeed, error } = store.state;

    if (isLoading) {
        return `
      <main class="main-content">
        <div class="header">
          <h1>Loading articles...</h1>
        </div>
        <div class="loader">Loading...</div>
      </main>
    `;
    }

    if (error) {
        return `
      <main class="main-content">
        <div class="header">
          <h1>Error loading feed</h1>
        </div>
        <div class="error-msg">${error}</div>
      </main>
    `;
    }

    const articleCards = articles.map((article, index) => `
    <div class="article-card fade-in" style="animation-delay: ${index * 0.05}s" onclick="window.open('${article.link}', '_blank')">
      <div class="article-meta">
        <span>${new Date(article.pubDate).toLocaleDateString()}</span>
      </div>
      <h2 class="article-title">${article.title}</h2>
      <p class="article-excerpt">${article.excerpt}</p>
    </div>
  `).join('');

    return `
    <main class="main-content">
      <div class="header">
        <h1>${currentFeed ? currentFeed.name : 'Select a feed'}</h1>
      </div>
      <div class="article-grid">
        ${articleCards}
      </div>
    </main>
  `;
}

export function AddFeedModal() {
    const { isModalOpen } = store.state;
    return `
    <div class="modal-overlay ${isModalOpen ? 'active' : ''}" id="modal-overlay">
      <div class="modal">
        <h2>Add New RSS Feed</h2>
        <div class="input-group">
          <label>Feed Name</label>
          <input type="text" id="feed-name-input" placeholder="e.g. Hacker News">
        </div>
        <div class="input-group">
          <label>Feed URL</label>
          <input type="url" id="feed-url-input" placeholder="https://example.com/feed.xml">
        </div>
        <div style="display: flex; gap: 1rem; margin-top: 1rem;">
          <button class="btn-primary" id="add-feed-btn" style="flex: 1;">Add Feed</button>
          <button class="btn-add" id="close-modal" style="flex: 1; margin: 0;">Cancel</button>
        </div>
      </div>
    </div>
  `;
}

export function renderApp() {
    const app = document.querySelector('#app');
    app.innerHTML = `
    ${Sidebar()}
    ${MainContent()}
    ${AddFeedModal()}
  `;

    // Attach event listeners
    document.querySelectorAll('.feed-item').forEach(item => {
        item.addEventListener('click', async () => {
            const url = item.getAttribute('data-url');
            const feed = store.state.feeds.find(f => f.url === url);
            store.update({ currentFeed: feed, isLoading: true, error: null });
            try {
                const articles = await parseRSS(url);
                store.update({ articles, isLoading: false });
            } catch (err) {
                store.update({ error: 'Failed to fetch RSS feed', isLoading: false });
            }
        });
    });

    document.querySelector('#open-modal').addEventListener('click', () => {
        store.update({ isModalOpen: true });
    });

    document.querySelector('#close-modal').addEventListener('click', () => {
        store.update({ isModalOpen: false });
    });

    document.querySelector('#modal-overlay').addEventListener('click', (e) => {
        if (e.target.id === 'modal-overlay') store.update({ isModalOpen: false });
    });

    document.querySelector('#add-feed-btn').addEventListener('click', () => {
        const nameInput = document.querySelector('#feed-name-input');
        const urlInput = document.querySelector('#feed-url-input');
        const name = nameInput.value.trim();
        const url = urlInput.value.trim();

        if (name && url) {
            const newFeeds = [...store.state.feeds, { name, url }];
            store.update({ feeds: newFeeds, isModalOpen: false });
        }
    });
}
