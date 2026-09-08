import { test, expect } from '@playwright/test';
import { RegisterPage } from '../../pages/RegisterPage';

test('Register with credentials @smoke @regression', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    const email = `playwright${Date.now()}@gmail.com`;
    await registerPage.goto();
    await registerPage.register(
        'Playwright Test-auto',
        email,
        'qwertyuiop[]\\'
    );
    await expect(page).toHaveURL(/\/login/, { timeout: 10000 });
});

// negative testing 

test('Register with existing email @regression', async ({ page }) => {
    const registerPage = new RegisterPage(page);
    await registerPage.goto();
    await registerPage.register(
        'Playwright Test-auto',
        process.env.USER_EMAIL,
        'qwertyuiop[]\\'
    );
    await expect(page.locator('body')).toContainText(/already|exist|registered/i);
});

test('Register with invalid email @regression', async ({page})=>{
    const registerPage = new RegisterPage(page)
    await registerPage.goto()
    await registerPage.register(
        'Playwright Test-auto',
        'invalid-email',
        'qwertyuiop[]\\'
    )

    await expect(page.locator('body')).toContainText(/invalid|email/i);
})

test('Register with weak password @regression', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();

    await registerPage.register(
        'Playwright Test',
        `weakpass${Date.now()}@gmail.com`,
        '123'
    );

    await expect(page.locator('body')).toContainText(
        /password|weak|minimum|invalid/i
    );
});

test('Register without name @regression', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();

    await registerPage.register(
        '',
        `missingname${Date.now()}@gmail.com`,
        'qwertyuiop[]\\'
    );

    await expect(page.locator('body')).toContainText(
        /name|required|enter/i
    );
});

test('Register without email @regression', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();

    await registerPage.register(
        'Playwright Test',
        '',
        'qwertyuiop[]\\'
    );

    await expect(page.locator('body')).toContainText(
        /email|required|enter/i
    );
});


test('Register without password @regression', async ({ page }) => {
    const registerPage = new RegisterPage(page);

    await registerPage.goto();

    await registerPage.register(
        'Playwright Test',
        `missingpassword${Date.now()}@gmail.com`,
        ''
    );

    await expect(page.locator('body')).toContainText(
        /password|required|enter/i
    );
});