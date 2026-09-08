export class ResetPasswordPage {
    constructor(page) {
        this.page = page;

        this.otpInput = page.getByRole('textbox', {
            name: 'Enter 6-digit code'
        });

        this.newPasswordInput = page.getByRole('textbox', {
            name: 'At least 6 characters'
        });

        this.confirmPasswordInput = page.getByRole('textbox', {
            name: 'Re-enter password'
        });

        this.resetButton = page.getByRole('button', {
            name: 'Reset Password'
        });

        this.backToRequestCodeButton = page.getByRole('button', {
            name: '← Request a new code'
        });
    }

    async enterOTP(otp) {
        await this.otpInput.fill(otp);
    }

    async resetPassword(password) {
        await this.newPasswordInput.fill(password);
        await this.confirmPasswordInput.fill(password);
        await this.resetButton.click();
    }

    async goBackToRequestCode() {
        await this.backToRequestCodeButton.click();
    }
}