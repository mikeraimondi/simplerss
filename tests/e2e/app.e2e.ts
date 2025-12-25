import { test, expect } from '@playwright/test';

test.describe('SimpleRSS App', () => {
    test.beforeEach(async ({ page }) => {
        // Clear localStorage before navigation
        await page.addInitScript(() => {
            window.localStorage.clear();
        });
        await page.goto('/');
    });

    test('should load the application design', async ({ page }) => {
        await expect(page).toHaveTitle(/SimpleRSS/);
        await expect(page.locator('.logo')).toContainText('SimpleRSS');
        await expect(page.locator('h1')).toContainText('TechCrunch');

        // Check for default feeds in sidebar
        await expect(page.locator('.feed-item')).toHaveCount(2);
        await expect(page.locator('.feed-item').first()).toContainText('TechCrunch');
    });

    test('should display articles for the default feed', async ({ page }) => {
        // Wait for articles to load
        const articleCards = page.locator('.article-card');
        await expect(articleCards.first()).toBeVisible({ timeout: 10000 });

        const count = await articleCards.count();
        expect(count).toBeGreaterThan(0);
    });

    test('should switch feeds and update content', async ({ page }) => {
        // Click on Ars Technica
        await page.getByText('Ars Technica').click();

        // Wait for loading to finish (or cards to appear)
        await expect(page.locator('.article-card').first()).toBeVisible();

        // Verify the "Now Reading" header or similar indicator if present
        // For now, just check that cards are there
        await expect(page.locator('.article-card')).not.toHaveCount(0);
    });

    test('should add a new feed via modal', async ({ page }) => {
        // Open modal
        await page.click('#open-modal');

        // Fill form
        await page.fill('#feed-name-input', 'Hacker News');
        await page.fill('#feed-url-input', 'https://news.ycombinator.com/rss');

        // Click submit
        await page.click('#add-feed-btn');

        // Check if added to sidebar
        await expect(page.locator('.feed-item')).toHaveCount(3);
        await expect(page.locator('.feed-item')).toContainText(['Hacker News']);
    });
});
