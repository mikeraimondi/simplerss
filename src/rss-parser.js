export async function parseRSS(url) {
    try {
        const response = await fetch(`/api/feed?url=${encodeURIComponent(url)}`);
        if (!response.ok) throw new Error('Network response was not ok');

        const articles = await response.json();
        return articles;
    } catch (error) {
        console.error("Error fetching feed through internal API:", error);
        throw error;
    }
}

