import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Shopping Cart Tests', () => {

    test('Add product to cart and verify details @smoke @regression', async ({ page }) => {
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);

        // 1. Add product to cart from product page
        await productPage.goto();
        await productPage.openProduct();
        await productPage.addToCart();

        // 2. Open cart page
        await cartPage.goto();
        await expect(cartPage.cartHeading).toBeVisible();

        // 3. Verify product name, price, and initial quantity
        const item = cartPage.getItem('Nike Air Max Running Shoes');
        await expect(item).toBeVisible();

        const price = cartPage.getItemPrice('₹9999');
        await expect(price).toBeVisible();

        const qty = cartPage.getQuantityValue('Nike Air Max Running Shoes');
        await expect(qty).toHaveText('1');

        // 4. Verify cart total section is displayed
        await expect(cartPage.totalAmountLabel).toBeVisible();
    });

    test('Increase and decrease product quantity in cart @regression', async ({ page }) => {
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);

        // Add product and open cart
        await productPage.goto();
        await productPage.openProduct();
        await productPage.addToCart();

        await cartPage.goto();
        await expect(cartPage.cartHeading).toBeVisible();

        const qty = cartPage.getQuantityValue('Nike Air Max Running Shoes');
        await expect(qty).toHaveText('1');

        // Increase quantity
        await cartPage.increaseQuantity('Nike Air Max Running Shoes');
        await expect(qty).toHaveText('2');

        // Decrease quantity
        await cartPage.decreaseQuantity('Nike Air Max Running Shoes');
        await expect(qty).toHaveText('1');
    });

    test('Remove product from cart and verify empty cart state @regression', async ({ page }) => {
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);

        // Add product and open cart
        await productPage.goto();
        await productPage.openProduct();
        await productPage.addToCart();

        await cartPage.goto();
        await expect(cartPage.cartHeading).toBeVisible();

        // Remove item from cart
        await cartPage.removeItem('Nike Air Max Running Shoes');

        // Verify empty cart message and link
        await expect(cartPage.emptyCartHeading).toBeVisible();
        await expect(cartPage.startShoppingLink).toBeVisible();
    });
});
