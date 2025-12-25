import { Article } from "./store";

export async function parseRSS(url: string): Promise<Article[]> {
    try {
        const response = await fetch(`/api/feed?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const articles = await response.json() as Article[];
        return articles;
    } catch (error) {
        console.error("Error fetching feed through internal API:", error);
        throw error;
    }
}
