import express from 'express';
import Parser from 'rss-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import basicAuth from 'express-basic-auth';
import dotenv from 'dotenv';

// Load environment variables locally
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const parser = new Parser();
const PORT = process.env.PORT || 8080;

app.use(cors());

// Basic Authentication
const user = process.env.BASIC_AUTH_USER || 'admin';
const password = process.env.BASIC_AUTH_PASSWORD;

if (password) {
    console.log(`Locking down application with Basic Auth (user: ${user})`);
    app.use(basicAuth({
        users: { [user]: password },
        challenge: true,
    }));
} else {
    console.warn('WARNING: No BASIC_AUTH_PASSWORD set. Application is unsecured.');
}
app.use(express.static(path.join(__dirname, 'dist')));

// Simplified cache
const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

app.get('/api/feed', async (req, res) => {
    const { url } = req.query;
    if (!url) {
        return res.status(400).json({ error: 'URL is required' });
    }

    // Check cache
    const cached = cache.get(url);
    if (cached && (Date.now() - cached.timestamp < CACHE_TTL)) {
        return res.json(cached.data);
    }

    try {
        const feed = await parser.parseURL(url);
        const articles = feed.items.map(item => ({
            title: item.title || 'No Title',
            link: item.link || '#',
            pubDate: item.pubDate || item.isoDate || '',
            excerpt: item.contentSnippet || item.content || '',
        }));

        // Save to cache
        cache.set(url, {
            timestamp: Date.now(),
            data: articles
        });

        res.json(articles);
    } catch (error) {
        console.error(`Error fetching feed from ${url}:`, error);
        res.status(500).json({ error: 'Failed to fetch RSS feed' });
    }
});

// Fallback to index.html for SPA routing
app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
