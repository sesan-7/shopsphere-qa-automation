import { test, expect } from '@playwright/test';

test('Open ShopSphere login page', async ({ page }) => {
    await page.goto('/login');
    await expect(page).toHaveURL(/login/);
});