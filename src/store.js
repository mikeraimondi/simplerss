// Simple reactive state management
class Store {
  constructor() {
    this.state = {
      feeds: JSON.parse(localStorage.getItem('rss-feeds')) || [
        { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
        { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' }
      ],
      currentFeed: null,
      articles: [],
      isLoading: false,
      error: null,
      isModalOpen: false
    };
    this.listeners = [];
  }

  update(newState) {
    this.state = { ...this.state, ...newState };
    this.notify();
    if (newState.feeds) {
      localStorage.setItem('rss-feeds', JSON.stringify(this.state.feeds));
    }
  }

  subscribe(listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const store = new Store();
