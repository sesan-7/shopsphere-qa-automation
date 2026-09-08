export class WishlistPage {
    constructor(page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'My Wishlist' });
        this.emptyMessage = page.getByText('Your wishlist is empty.');
        this.exploreProductsLink = page.getByRole('link', { name: 'Explore Products' });
    }

    async goto() {
        await this.page.goto('/wishlist');
    }

    getItem(productName) {
        return this.page.getByRole('heading', { name: productName });
    }

    getWishlistItem(productName) {
        return this.page
            .locator('div.group')
            .filter({ has: this.page.getByRole('heading', { name: productName }) });
    }

    getRemoveButton(productName) {
        return this.getWishlistItem(productName).getByRole('button', { name: '❤️' });
    }

    getAddToCartButton(productName) {
        return this.getWishlistItem(productName).getByRole('button', { name: 'Add to Cart' });
    }

    async removeItem(productName) {
        const removeBtn = this.getRemoveButton(productName);
        await removeBtn.click();
    }
}
