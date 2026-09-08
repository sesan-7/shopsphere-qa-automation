export class ProductPage {
    constructor(page) {
        this.page = page;

        // Catalog link to open product
        this.product = page.getByRole('link', {
            name: 'Nike Air Max Running Shoes'
        }).first();

        // Product Details locators
        this.productName = page.getByRole('heading', {
            level: 1,
            name: 'Nike Air Max Running Shoes'
        });

        this.currentPrice = page.getByText('₹9999', { exact: true });
        this.originalPrice = page.getByText('₹11999', { exact: true });
        this.discount = page.getByText('20% OFF');
        this.rating = page.getByText(/4\.0\s*★/);
        this.reviewsCount = page.getByText('(1 reviews)');

        this.availableOffers = page.getByRole('heading', {
            name: 'Available Offers'
        });

        this.productHighlights = page.getByRole('heading', {
            name: 'Product Highlights'
        });

        this.specifications = page.getByRole('heading', {
            name: 'Specifications'
        });

        this.customerReviews = page.getByRole('heading', {
            name: 'Customer Reviews'
        });

        // Quantity controls
        this.quantityValue = page.locator('span.w-10');
        this.increaseQuantityButton = page.getByRole('button', { name: '+', exact: true });
        this.decreaseQuantityButton = page.getByRole('button', { name: '-', exact: true });

        // Wishlist button
        this.wishlistButton = page.getByRole('button', { name: /❤️|🤍/ });

        // Cart button
        this.addToCartButton = page.getByRole('button', { name: '🛒 Add To Cart' });
    }

    async goto() {
        await this.page.goto('/');
        await this.product.waitFor({ state: 'visible' });
    }

    async openProduct() {
        await this.product.waitFor({ state: 'visible' });
        await this.product.click();
        await this.page.waitForURL(/\/products\//);
        await this.productName.waitFor({ state: 'visible' });
    }

    async increaseQuantity() {
        await this.increaseQuantityButton.click();
    }

    async decreaseQuantity() {
        await this.decreaseQuantityButton.click();
    }

    async toggleWishlist() {
        await this.wishlistButton.click();
    }

    async addToCart() {
        await this.addToCartButton.click();
    }
}