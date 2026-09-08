import { test, expect } from '@playwright/test';
import { CatalogPage } from '../../pages/CatalogPage';

test.describe('Product Catalog Search and Filter Tests', () => {

    test('Search products by keyword returns matching results @smoke @regression', async ({ page }) => {
        const catalogPage = new CatalogPage(page);

        await catalogPage.goto();
        await catalogPage.searchProduct('Nike');

        const resultItem = catalogPage.getProductCard('Nike Air Max Running Shoes');
        await expect(resultItem).toBeVisible({ timeout: 10000 });
    });

    test('Search for non-existent keyword displays empty state @regression', async ({ page }) => {
        const catalogPage = new CatalogPage(page);

        await catalogPage.goto();
        await catalogPage.searchProduct('NonExistentKeywordXYZ123');

        await expect(catalogPage.noProductsMessage).toBeVisible({ timeout: 10000 });
        await expect(catalogPage.resetFiltersButton).toBeVisible();
    });

    test('Filter products by Shoes category @regression', async ({ page }) => {
        const catalogPage = new CatalogPage(page);

        await catalogPage.goto();
        await catalogPage.filterByCategory('Shoes');

        const shoesItem = catalogPage.getProductCard('Nike Air Max Running Shoes');
        await expect(shoesItem).toBeVisible();
    });

    test('Clear all filters restores products catalog @regression', async ({ page }) => {
        const catalogPage = new CatalogPage(page);

        await catalogPage.goto();
        await catalogPage.filterByCategory('Shoes');

        const shoesRadio = page.locator('input[name="category"][value="Shoes"]');
        await expect(shoesRadio).toBeChecked();

        // Clear all filters
        await catalogPage.clearFilters();

        const allRadio = page.locator('input[name="category"][value="all"]');
        await expect(allRadio).toBeChecked();

        const item = catalogPage.getProductCard('MacBook Pro M3 Max');
        await expect(item).toBeVisible();
    });

    test('Sort products by price low to high @regression', async ({ page }) => {
        const catalogPage = new CatalogPage(page);

        await catalogPage.goto();
        await catalogPage.sortBy('priceLowToHigh');

        // Extract displayed prices
        await expect(catalogPage.productPrices.first()).toBeVisible();

        const priceTexts = await catalogPage.productPrices.allInnerTexts();
        const prices = priceTexts.map(p => Number(p.replace(/[^0-9]/g, '')));

        // Verify prices are in ascending order
        for (let i = 0; i < prices.length - 1; i++) {
            expect(prices[i]).toBeLessThanOrEqual(prices[i + 1]);
        }
    });
});
