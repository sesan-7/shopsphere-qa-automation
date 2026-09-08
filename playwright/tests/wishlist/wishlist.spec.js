import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages/ProductPage';

test.describe('Wishlist Tests', () => {

    test('Unauthenticated user cannot add product to wishlist @regression', async ({ page }) => {
        const productPage = new ProductPage(page);

        await productPage.goto();
        await productPage.openProduct();

        await productPage.toggleWishlist();

        // Verify authentication prompt modal appears
        const modalTitle = page.getByRole('heading', { name: 'Authentication Required' });
        await expect(modalTitle).toBeVisible();

        const modalMsg = page.getByText('Please log in to add products to your wishlist.');
        await expect(modalMsg).toBeVisible();

        // Dismiss the alert modal
        await page.getByRole('button', { name: 'OK' }).click();
        await expect(modalTitle).not.toBeVisible();
    });
});
