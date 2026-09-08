import { test, expect } from '@playwright/test';

test.describe('Checkout Unauthenticated Tests', () => {

    test('Unauthenticated user is redirected to login when accessing checkout @regression', async ({ page }) => {
        await page.goto('/checkout');
        await expect(page).toHaveURL(/\/login/);
        await expect(page.getByRole('heading', { name: 'Login' })).toBeVisible();
    });
});
