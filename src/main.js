import './style.css';
import { store } from './store';
import { renderApp } from './components';
import { parseRSS } from './rss-parser';

// Initial render
renderApp();

// Subscribe to state changes
store.subscribe(() => {
  renderApp();
});

// Load first feed by default if exists
if (store.state.feeds.length > 0) {
  const initialFeed = store.state.feeds[0];
  store.update({ currentFeed: initialFeed, isLoading: true });

  parseRSS(initialFeed.url)
    .then(articles => {
      store.update({ articles, isLoading: false });
    })
    .catch(err => {
      store.update({ error: 'Failed to load initial feed', isLoading: false });
    });
}
