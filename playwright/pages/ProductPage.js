export class ProductPage {
    constructor(page) {
        this.page = page;

        // Catalog product
        this.product = page.getByRole('link', {
            name: 'Puma Classic Suede Shoes'
        }).first();

        // Product Details
        this.productName = page.getByRole('heading', {
            level: 1,
            name: 'Puma Classic Suede Shoes'
        });

        this.currentPrice = page.getByText('₹5499', {
            exact: true
        });

        // Original price - actual DOM uses span.line-through
        this.originalPrice = page.locator('span.line-through').first();

        this.discount = page.getByText('10% OFF', {
            exact: true
        });

        this.rating = page.getByText(/4\.4\s*★/);

        this.reviewsCount = page.getByText(
            /\(\d+\s+reviews?\)/i
        );

        // Product sections
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

        this.increaseQuantityButton = page.getByRole('button', {
            name: '+',
            exact: true
        });

        this.decreaseQuantityButton = page.getByRole('button', {
            name: '-',
            exact: true
        });

        // Wishlist
        this.wishlistButton = page.getByRole('button', {
            name: /❤️|🤍/
        });

        // Cart
        this.addToCartButton = page.getByRole('button', {
            name: '🛒 Add To Cart'
        });
    }

    async goto() {
        await this.page.goto('/');

        await this.product.waitFor({
            state: 'visible'
        });
    }

    async openProduct() {
        await this.product.waitFor({
            state: 'visible'
        });

        await this.product.click();

        await this.page.waitForURL(/\/products\//);

        await this.productName.waitFor({
            state: 'visible'
        });
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