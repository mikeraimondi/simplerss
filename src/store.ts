// Simple reactive state management
export interface Feed {
  name: string;
  url: string;
}

export interface Article {
  title: string;
  link: string;
  pubDate: string;
  excerpt: string;
}

export interface State {
  feeds: Feed[];
  currentFeed: Feed | null;
  articles: Article[];
  isLoading: boolean;
  error: string | null;
  isModalOpen: boolean;
}

type Listener = (state: State) => void;

class Store {
  state: State;
  private listeners: Listener[] = [];

  constructor() {
    const savedFeeds = localStorage.getItem('rss-feeds');
    const defaultFeeds: Feed[] = [
      { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
      { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' }
    ];

    this.state = {
      feeds: savedFeeds ? JSON.parse(savedFeeds) : defaultFeeds,
      currentFeed: null,
      articles: [],
      isLoading: false,
      error: null,
      isModalOpen: false
    };
  }

  update(newState: Partial<State>) {
    this.state = { ...this.state, ...newState };
    this.notify();
    if (newState.feeds) {
      localStorage.setItem('rss-feeds', JSON.stringify(this.state.feeds));
    }
  }

  subscribe(listener: Listener) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(listener => listener(this.state));
  }
}

export const store = new Store();
