export class OrdersPage {
    constructor(page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'My Orders' });
        this.emptyOrdersMessage = page.getByText("You haven't placed any orders yet.");
    }

    async goto() {
        await this.page.goto('/orders');
    }

    getOrderCard(productName) {
        return this.page
            .locator('div.rounded-2xl.border')
            .filter({ has: this.page.getByRole('heading', { name: productName }) })
            .first();
    }

    getOrderItemName(productName) {
        return this.page.getByRole('heading', { name: productName }).first();
    }
}
