export class CheckoutPage {
    constructor(page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Checkout' });

        // Address fields
        this.streetAddressInput = page.locator('input[placeholder*="Flat"]');
        this.cityInput = page.locator('input[placeholder="City"]');
        this.pinCodeInput = page.locator('input[placeholder*="ZIP"]');
        this.countryInput = page.locator('input[placeholder="Country"]');
        this.deliverButton = page.getByRole('button', { name: /Deliver/i });

        // Step 2 Summary
        this.continueCheckoutButton = page.getByRole('button', { name: /Continue Checkout/i });

        // Step 3 Payment Options
        this.codPaymentRadio = page.locator('input[value="COD"]');
        this.cardPaymentRadio = page.locator('input[value="Card"]');
        this.placeOrderButton = page.getByRole('button', { name: /Confirm Payment & Place Order/i });

        // Order Success
        this.orderPlacedHeading = page.getByRole('heading', { name: 'Order Placed!' });
    }

    async goto() {
        await this.page.goto('/checkout');
    }

    async fillDeliveryAddress(street, city, pin, country) {
        await this.streetAddressInput.fill(street);
        await this.cityInput.fill(city);
        await this.pinCodeInput.fill(pin);
        await this.countryInput.fill(country);
        await this.deliverButton.click();
    }

    async continueToPayment() {
        await this.continueCheckoutButton.waitFor({ state: 'visible' });
        await this.continueCheckoutButton.click();
    }

    async selectCashOnDelivery() {
        await this.codPaymentRadio.waitFor({ state: 'visible' });
        await this.codPaymentRadio.click();
    }

    async confirmOrder() {
        await this.placeOrderButton.click();
        await this.page.waitForURL(/\/order-success\//);
    }
}
