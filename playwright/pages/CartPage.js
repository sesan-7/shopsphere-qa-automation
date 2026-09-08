export class CartPage {
    constructor(page) {
        this.page = page;
        this.cartHeading = page.getByRole('heading', { name: /Shopping Cart/ });
        this.emptyCartHeading = page.getByRole('heading', { name: 'Your Shopping Cart is Empty' });
        this.startShoppingLink = page.getByRole('link', { name: 'Start Shopping' });
        this.totalAmountLabel = page.getByText('Total Amount');
        this.placeOrderButton = page.getByRole('button', { name: /Place Order|Login to Checkout/i });
    }

    async goto() {
        await this.page.goto('/cart');
    }

    getItem(productName) {
        return this.page.getByRole('heading', { name: productName });
    }

    getItemPrice(price) {
        return this.page.getByText(price).first();
    }

    getCartItem(productName) {
        return this.page
            .locator('div.justify-between')
            .filter({ has: this.page.getByRole('heading', { name: productName }) });
    }

    getQuantityValue(productName) {
        return this.getCartItem(productName).locator('span.w-10');
    }

    getIncreaseButton(productName) {
        return this.getCartItem(productName).getByRole('button', { name: '+', exact: true });
    }

    getDecreaseButton(productName) {
        return this.getCartItem(productName).getByRole('button', { name: '-', exact: true });
    }

    getRemoveButton(productName) {
        return this.getCartItem(productName).getByRole('button', { name: /Remove/i });
    }

    async increaseQuantity(productName) {
        await this.getIncreaseButton(productName).click();
    }

    async decreaseQuantity(productName) {
        await this.getDecreaseButton(productName).click();
    }

    async removeItem(productName) {
        await this.getRemoveButton(productName).click();
    }
}
