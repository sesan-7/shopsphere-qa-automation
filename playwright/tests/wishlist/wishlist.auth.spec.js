
import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages/ProductPage';
import { WishlistPage } from '../../pages/WishlistPage';

test.describe('Authenticated Wishlist Tests', () => {

    test('Authenticated user can add and remove product from wishlist @smoke @regression', async ({ page }) => {

        const productPage = new ProductPage(page);
        const wishlistPage = new WishlistPage(page);

        // 1. Verify authenticated session
        await page.goto('/');
        await expect(
            page.getByRole('button', { name: /logout/i })
        ).toBeVisible();

        // 2. Open product details
        await productPage.openProduct();

        // 3. Ensure clean wishlist state
        const heartText = await productPage.wishlistButton.innerText();

        if (heartText.includes('❤️')) {
            await productPage.toggleWishlist();
            await expect(productPage.wishlistButton).toContainText('🤍');
        }

        // 4. Add product to wishlist
        await productPage.toggleWishlist();

        await expect(productPage.wishlistButton)
            .toContainText('❤️');

        // 5. Verify product appears in Wishlist
        await wishlistPage.goto();

        await expect(wishlistPage.heading).toBeVisible();

        const wishlistedItem =
            wishlistPage.getItem('Nike Air Max Running Shoes');

        await expect(wishlistedItem).toBeVisible();

        // 6. Remove product from Wishlist
        await wishlistPage.removeItem('Nike Air Max Running Shoes');

        // 7. Verify product is removed
        await expect(wishlistedItem).not.toBeVisible();
    });
});

