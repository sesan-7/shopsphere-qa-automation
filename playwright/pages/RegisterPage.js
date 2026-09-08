import { expect } from '@playwright/test';

export class RegisterPage {
    constructor(page){
        this.page = page
        this.nameInput = page.locator('input[name="name"]')
        this.emailInput = page.locator('input[name="email"]')
        this.passwordInput = page.locator('input[name="password"]')
        this.continueButton = page.getByRole('button', {name : 'Continue'})
    }

    async goto(){
        await this.page.goto('/register')
    }

    async register(name, email, password){
        await this.nameInput.fill(name)
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.continueButton.click()
    }

    async verifyIfonRegisterPage(){
        await expect(this.page).toHaveURL('/register')
    }
    
}