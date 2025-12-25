import { serve } from "bun";
import Parser from 'rss-parser';
import path from 'path';

const parser = new Parser();
const PORT = process.env.PORT || 8080;

// Basic Authentication Configuration
const AUTH_USER = process.env.BASIC_AUTH_USER || 'admin';
const AUTH_PASSWORD = process.env.BASIC_AUTH_PASSWORD;

// Simplified cache
interface CachedFeed {
    timestamp: number;
    data: any[];
}
const cache = new Map<string, CachedFeed>();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

export const server = serve({
    port: PORT,
    async fetch(req) {
        const url = new URL(req.url);

        // 1. Basic Auth Check
        if (AUTH_PASSWORD) {
            const auth = req.headers.get("Authorization");
            if (!auth || !auth.startsWith("Basic ")) {
                return new Response("Unauthorized", {
                    status: 401,
                    headers: { "WWW-Authenticate": 'Basic realm="SimpleRSS"' }
                });
            }

            const base64Credentials = auth.split(" ")[1];
            if (!base64Credentials) {
                return new Response("Unauthorized", {
                    status: 401,
                    headers: { "WWW-Authenticate": 'Basic realm="SimpleRSS"' }
                });
            }

            const [user, pass] = Buffer.from(base64Credentials, "base64").toString().split(":");
            if (user !== AUTH_USER || pass !== AUTH_PASSWORD) {
                return new Response("Unauthorized", {
                    status: 401,
                    headers: { "WWW-Authenticate": 'Basic realm="SimpleRSS"' }
                });
            }
        }

        // 2. API Routes
        if (url.pathname === '/api/feed') {
            const feedUrl = url.searchParams.get('url');
            if (!feedUrl) {
                return Response.json({ error: 'URL is required' }, { status: 400 });
            }

            // Check cache
            const cached = cache.get(feedUrl);
            if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
                return Response.json(cached.data);
            }

            try {
                const feed = await parser.parseURL(feedUrl);
                const articles = feed.items.map(item => ({
                    title: item.title || 'No Title',
                    link: item.link || '#',
                    pubDate: item.pubDate || item.isoDate || '',
                    excerpt: item.contentSnippet || item.content || '',
                }));

                // Save to cache
                cache.set(feedUrl, {
                    timestamp: Date.now(),
                    data: articles
                });

                return Response.json(articles);
            } catch (error) {
                console.error(`Error fetching feed from ${feedUrl}:`, error);
                return Response.json({ error: 'Failed to fetch RSS feed' }, { status: 500 });
            }
        }

        // 3. Static Files & SPA Fallback
        // In Bun, we can serve files directly
        const distPath = path.join(import.meta.dir, "dist");
        let filePath = path.join(distPath, url.pathname === "/" ? "index.html" : url.pathname);

        // Attempt to serve the file
        let file = Bun.file(filePath);
        if (await file.exists()) {
            return new Response(file);
        }

        // Fallback to index.html for SPA
        const indexFile = Bun.file(path.join(distPath, "index.html"));
        if (await indexFile.exists()) {
            return new Response(indexFile);
        }

        return new Response("Not Found", { status: 404 });
    },
});

console.log(`Bun server running on port ${server.port}`);
if (!AUTH_PASSWORD) {
    console.warn('WARNING: No BASIC_AUTH_PASSWORD set. Application is unsecured.');
}
