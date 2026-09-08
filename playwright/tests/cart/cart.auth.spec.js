import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages/ProductPage';
import { CartPage } from '../../pages/CartPage';

test.describe('Shopping Cart Tests', () => {

    const productName = 'Puma Classic Suede Shoes';
    const productPrice = '₹5499';

    test('Add product to cart and verify details @smoke @regression', async ({ page }) => {
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);

        // 1. Add in-stock product to cart
        await productPage.goto();
        await productPage.openProduct();
        await productPage.addToCart();

        // 2. Open cart
        await cartPage.goto();
        await expect(cartPage.cartHeading).toBeVisible();

        // 3. Verify product details
        const item = cartPage.getItem(productName);
        await expect(item).toBeVisible();

        const price = cartPage.getItemPrice(productPrice);
        await expect(price).toBeVisible();

        const qty = cartPage.getQuantityValue(productName);
        await expect(qty).toHaveText('1');

        // 4. Verify total amount section
        await expect(cartPage.totalAmountLabel).toBeVisible();
    });


    test('Increase and decrease product quantity in cart @regression', async ({ page }) => {
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);

        // Add in-stock product
        await productPage.goto();
        await productPage.openProduct();
        await productPage.addToCart();

        // Open cart
        await cartPage.goto();
        await expect(cartPage.cartHeading).toBeVisible();

        // Verify initial quantity
        const qty = cartPage.getQuantityValue(productName);
        await expect(qty).toHaveText('1');

        // Increase quantity
        await cartPage.increaseQuantity(productName);
        await expect(qty).toHaveText('2');

        // Decrease quantity
        await cartPage.decreaseQuantity(productName);
        await expect(qty).toHaveText('1');
    });


    test('Remove product from cart and verify empty cart state @regression', async ({ page }) => {
        const productPage = new ProductPage(page);
        const cartPage = new CartPage(page);

        // Add in-stock product
        await productPage.goto();
        await productPage.openProduct();
        await productPage.addToCart();

        // Open cart
        await cartPage.goto();
        await expect(cartPage.cartHeading).toBeVisible();

        // Remove product
        await cartPage.removeItem(productName);

        // Verify empty cart
        await expect(cartPage.emptyCartHeading).toBeVisible();
        await expect(cartPage.startShoppingLink).toBeVisible();
    });

});