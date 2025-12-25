import { expect, test, describe, beforeEach } from "bun:test";
import { store } from "../src/store";

describe("Store", () => {
    beforeEach(() => {
        // Reset state before each test
        localStorage.clear();
        store.update({
            feeds: [
                { name: 'TechCrunch', url: 'https://techcrunch.com/feed/' },
                { name: 'Ars Technica', url: 'https://feeds.arstechnica.com/arstechnica/index' }
            ],
            currentFeed: null,
            articles: [],
            isLoading: false,
            error: null,
            isModalOpen: false
        });
    });

    test("should initialize with default feeds", () => {
        expect(store.state.feeds.length).toBe(2);
        expect(store.state.feeds[0]?.name).toBe("TechCrunch");
    });

    test("should update state correctly", () => {
        store.update({ isLoading: true });
        expect(store.state.isLoading).toBe(true);
    });

    test("should add a new feed and persist to localStorage", () => {
        const newFeed = { name: "Hacker News", url: "https://news.ycombinator.com/rss" };
        store.update({ feeds: [...store.state.feeds, newFeed] });

        expect(store.state.feeds.length).toBe(3);
        expect(store.state.feeds[2]?.name).toBe("Hacker News");

        const saved = JSON.parse(localStorage.getItem('rss-feeds') || '[]');
        expect(saved.length).toBe(3);
        expect(saved[2].name).toBe("Hacker News");
    });
});
