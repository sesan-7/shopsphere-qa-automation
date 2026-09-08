import { test, expect } from '@playwright/test';
import { ProductPage } from '../../pages/ProductPage';
import { CheckoutPage } from '../../pages/CheckoutPage';
import { OrdersPage } from '../../pages/OrdersPage';

test.describe('Authenticated Checkout and Orders Tests', () => {

    test('Validate shipping address PIN code format @regression', async ({ page }) => {
        const productPage = new ProductPage(page);
        const checkoutPage = new CheckoutPage(page);

        // 1. Add product to cart
        await productPage.goto();
        await productPage.openProduct();
        await productPage.addToCart();

        // 2. Open checkout
        await checkoutPage.goto();
        await expect(checkoutPage.heading).toBeVisible();

        // 3. Fill address with invalid 3-digit PIN code
        await checkoutPage.fillDeliveryAddress('123 Test St', 'Chennai', '123', 'India');

        // 4. Assert validation error is displayed
        const errorMsg = page.getByText(/Invalid PIN \/ ZIP code/i);
        await expect(errorMsg).toBeVisible();
    });

    test('Complete checkout and verify created order in My Orders @smoke @regression', async ({ page }) => {
        const productPage = new ProductPage(page);
        const checkoutPage = new CheckoutPage(page);
        const ordersPage = new OrdersPage(page);

        // 1. Add product to cart
        await productPage.goto();
        await productPage.openProduct();
        await productPage.addToCart();

        // 2. Complete checkout steps
        await checkoutPage.goto();
        await expect(checkoutPage.heading).toBeVisible();

        // Fill valid address
        await checkoutPage.fillDeliveryAddress('77 MG Road', 'Bengaluru', '560001', 'India');

        // Continue past Order Summary
        await checkoutPage.continueToPayment();

        // Select Cash on Delivery
        await checkoutPage.selectCashOnDelivery();

        // Confirm & place order
        await checkoutPage.confirmOrder();

        // 3. Verify Order Placed success page
        await expect(checkoutPage.orderPlacedHeading).toBeVisible();

        // 4. Navigate to My Orders and verify newly placed order
        await ordersPage.goto();
        await expect(ordersPage.heading).toBeVisible();

        const orderItem = ordersPage.getOrderItemName('Nike Air Max Running Shoes');
        await expect(orderItem).toBeVisible();
    });

    test('Prevent checkout when cart is empty for authenticated user @regression', async ({ page }) => {
        const checkoutPage = new CheckoutPage(page);

        // Go to checkout with empty cart
        await checkoutPage.goto();

        const emptyCartWarning = page.getByText(/Your cart is empty\. Cannot checkout\./i);
        await expect(emptyCartWarning).toBeVisible();

        const backLink = page.getByRole('link', { name: /Go back to shopping/i });
        await expect(backLink).toBeVisible();
    });
});
