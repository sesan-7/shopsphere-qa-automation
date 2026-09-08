export class LoginPage {
    constructor(page) {
        this.page = page;

        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.getByRole('button', { name: /login/i });
        this.logoutButton = page.getByRole('button', { name: /logout/i });
        this.errorMessage = page.locator('div.bg-red-50');
    }

    async goto() {
        await this.page.goto("/login");
    }

    async login(email, password) {
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
    }

    async logout(){
        await this.logoutButton.click();
    }
    async isErrorVisible() {
        return await this.errorMessage.isVisible();
    }
}