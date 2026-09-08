import {test, expect} from '@playwright/test'
import {LoginPage} from "../../pages/LoginPage"

test('Login with valid credentials @smoke @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const email = process.env.USER_EMAIL;
    const password = process.env.USER_PASSWORD;

    await loginPage.goto();
    await loginPage.login(email, password);
    await expect(page).toHaveURL('/');
    await expect(loginPage.logoutButton).toBeVisible();
});

// login negative test - wrong password
test('Login with wrong password @regression', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const email = process.env.USER_EMAIL;
    const wrongPassword = 'WrongPassword123!';

    await loginPage.goto();
    await loginPage.login(email, wrongPassword);

    await expect(page).toHaveURL('/login');
    await expect(page.locator('body')).toContainText(/invalid email or password/i);
});

test('Login with invalid email @regression', async ({page})=>{
    const loginPage = new LoginPage(page)
    const email = 'invalid'
    const password = process.env.USER_PASSWORD

    await loginPage.goto()
    await loginPage.login(email,password)

    await expect(page).toHaveURL("/login")

})

test('Login without email @regression', async ({page})=>{
    const loginPage = new LoginPage(page)
    const password = process.env.USER_PASSWORD
    await loginPage.goto()
    await loginPage.login("",password)
    await expect(page).toHaveURL("/login")
})

test('Login without password @regression', async ({page})=>{
    const loginPage = new LoginPage(page)
    const email = process.env.USER_EMAIL
    await loginPage.goto()
    await loginPage.login(email,"")
    await expect(page).toHaveURL("/login")

})

test('Logout Successfully @smoke @regression', async ({page})=>{
    const loginPage = new LoginPage(page)
    const email = process.env.USER_EMAIL
    const password = process.env.USER_PASSWORD
    await loginPage.goto()
    await loginPage.login(email,password)
    await expect(page).toHaveURL("/")
    await loginPage.logout()
    await expect(page).toHaveURL("/")
   // Verify Login link is visible after logout
    await expect(
        page.getByRole('link', { name: 'Login' })
    ).toBeVisible();

})