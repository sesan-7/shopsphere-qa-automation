import { test as setup, expect } from '@playwright/test';

const authFile = 'playwright/.auth/user.json';

setup('authenticate', async ({ page }) => {
    await page.goto('/login');

    await page.locator('input[name="email"]')
        .fill(process.env.USER_EMAIL);

    await page.locator('input[name="password"]')
        .fill(process.env.USER_PASSWORD);

    await page.getByRole('button', { name: /login/i }).click();

    await expect(
        page.getByRole('button', { name: /logout/i })
    ).toBeVisible({ timeout: 15000 });

    await page.context().storageState({
        path: authFile
    });
});