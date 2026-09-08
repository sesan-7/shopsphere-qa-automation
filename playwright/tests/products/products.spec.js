import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages/ProductPage';

test('Open product details @smoke @regression', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.goto();

    await expect(productPage.product).toBeVisible();

    await productPage.openProduct();

    await expect(productPage.productName).toBeVisible();
});

test('Verify product details @regression', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.goto();
    await productPage.openProduct();

    await expect(productPage.productName).toBeVisible();
    await expect(productPage.currentPrice).toBeVisible();
    await expect(productPage.originalPrice).toBeVisible();
    await expect(productPage.discount).toBeVisible();
    await expect(productPage.rating).toBeVisible();
    await expect(productPage.reviewsCount).toBeVisible();
    await expect(productPage.availableOffers).toBeVisible();
    await expect(productPage.productHighlights).toBeVisible();
    await expect(productPage.specifications).toBeVisible();
    await expect(productPage.customerReviews).toBeVisible();
});

// Product Quantity tests

test('Verify default quantity is 1 @regression', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.goto();
    await productPage.openProduct();

    await expect(productPage.quantityValue).toHaveText('1');
});

test('Increase product quantity @regression', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.goto();
    await productPage.openProduct();

    await productPage.increaseQuantity();
    await expect(productPage.quantityValue).toHaveText('2');

    await productPage.increaseQuantity();
    await expect(productPage.quantityValue).toHaveText('3');
});

test('Decrease product quantity @regression', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.goto();
    await productPage.openProduct();

    await productPage.increaseQuantity();
    await expect(productPage.quantityValue).toHaveText('2');

    await productPage.decreaseQuantity();
    await expect(productPage.quantityValue).toHaveText('1');
});

test('Prevent decreasing quantity below 1 (boundary check) @regression', async ({ page }) => {
    const productPage = new ProductPage(page);

    await productPage.goto();
    await productPage.openProduct();

    await expect(productPage.quantityValue).toHaveText('1');
    await productPage.decreaseQuantity();
    await expect(productPage.quantityValue).toHaveText('1');
});