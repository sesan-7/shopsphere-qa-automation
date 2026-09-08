import { test, expect } from '@playwright/test';
import { ForgotPasswordPage } from '../../pages/ForgotPasswordPage';

test('Forgot Password with valid email @regression', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();

    await expect(forgotPasswordPage.emailInput).toBeVisible();

    await forgotPasswordPage.submitEmail(
        process.env.USER_EMAIL
    );

    await expect(page.getByRole('button', { name: /Reset Password/i })).toBeVisible({ timeout: 20000 });
});

//negative

test('Forgot Password with non-existent email @regression', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();

    await forgotPasswordPage.submitEmail(
        `nonexistent${Date.now()}@gmail.com`
    );

    await expect(page.locator('body')).toContainText(
        /No user found with that email address/i
    );
});


test('Forgot Password with invalid email @regression', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();

    await forgotPasswordPage.submitEmail('invalid-email');

    await expect(page.locator('body')).toContainText(
        /invalid email|valid email|email/i
    );
});

test('Forgot Password with empty email @regression', async ({ page }) => {
    const forgotPasswordPage = new ForgotPasswordPage(page);

    await forgotPasswordPage.goto();

    await forgotPasswordPage.sendCodeButton.click();

    await expect(forgotPasswordPage.emailInput).toBeVisible();
});