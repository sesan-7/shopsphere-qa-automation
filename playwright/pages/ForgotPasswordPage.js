export class ForgotPasswordPage {
    constructor(page) {
        this.page = page;

        this.emailInput = page.getByRole('textbox', {
            name: 'you@example.com'
        });

        this.sendCodeButton = page.getByRole('button', {
            name: 'Send Verification Code'
        });
    }

    async goto() {
        await this.page.goto('/forgot-password');
    }

    async submitEmail(email) {
        await this.emailInput.fill(email);
        await this.sendCodeButton.click();
    }
}