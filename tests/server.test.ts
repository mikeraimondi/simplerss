import { expect, test, describe, spyOn, afterAll } from "bun:test";
import Parser from 'rss-parser';

// Spy on Parser prototype BEFORE importing server logic
const parseSpy = spyOn(Parser.prototype, 'parseURL').mockImplementation(async (url: string) => {
    if (url === 'https://error.com') throw new Error('Fetch Error');
    return {
        items: [
            { title: 'Test Article', link: 'http://test.com', pubDate: '2023-01-01', contentSnippet: 'Test snippet' }
        ]
    };
});

import { server } from "../server";

describe("Server Integration", () => {
    const password = process.env.BASIC_AUTH_PASSWORD || '';
    const authHeader = "Basic " + Buffer.from(`admin:${password}`).toString("base64");

    test("should return 401 when no auth header is provided", async () => {
        const req = new Request("http://localhost:8080/api/feed?url=https://test.com");
        const res = await server.fetch(req);
        expect(res.status).toBe(401);
    });

    test("should return 400 when url parameter is missing", async () => {
        const req = new Request("http://localhost:8080/api/feed", {
            headers: { "Authorization": authHeader }
        });
        const res = await server.fetch(req);
        expect(res.status).toBe(400);
        const data = await res.json();
        expect(data.error).toBe("URL is required");
    });

    test("should return articles when authorized and url is valid", async () => {
        const req = new Request("http://localhost:8080/api/feed?url=https://test.com", {
            headers: { "Authorization": authHeader }
        });
        const res = await server.fetch(req);
        expect(res.status).toBe(200);
        const articles = await res.json() as any[];
        expect(Array.isArray(articles)).toBe(true);
        expect(articles[0].title).toBe("Test Article");
    });

    test("should return 500 when parser fails", async () => {
        const req = new Request("http://localhost:8080/api/feed?url=https://error.com", {
            headers: { "Authorization": authHeader }
        });
        const res = await server.fetch(req);
        expect(res.status).toBe(500);
        const data = await res.json();
        expect(data.error).toBe("Failed to fetch RSS feed");
    });

    afterAll(() => {
        server.stop();
        parseSpy.mockRestore();
    });
});
