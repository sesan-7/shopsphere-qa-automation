export class CatalogPage {
    constructor(page) {
        this.page = page;
        this.heading = page.getByRole('heading', { name: 'Products Catalog' });
        this.searchInput = page.getByPlaceholder('Search items in catalog...');
        this.searchButton = page.getByRole('button', { name: 'Search' });
        this.noProductsMessage = page.getByText('No products found matching the criteria.');
        this.resetFiltersButton = page.getByRole('button', { name: 'Reset All Filters' });
        this.clearAllButton = page.getByRole('button', { name: 'Clear All' });
        this.sortDropdown = page.locator('select');
        this.productPrices = page.locator('span.text-base.font-black');
    }

    async goto() {
        await this.page.goto('/products');
        await this.heading.waitFor({ state: 'visible' });
        await this.page.locator('.animate-spin').waitFor({ state: 'detached' }).catch(() => {});
    }

    async searchProduct(keyword) {
        await this.searchInput.fill(keyword);
        await this.searchButton.click();
        await this.page.locator('.animate-spin').waitFor({ state: 'detached' }).catch(() => {});
    }

    async filterByCategory(categoryName) {
        const categoryRadio = this.page.locator(`input[name="category"][value="${categoryName}"]`);
        await categoryRadio.click();
    }

    async clearFilters() {
        await this.clearAllButton.click();
    }

    async resetAllFilters() {
        await this.resetFiltersButton.click();
    }

    async sortBy(optionValue) {
        await this.sortDropdown.selectOption(optionValue);
    }

    getProductCard(productName) {
        return this.page.getByRole('heading', { name: productName });
    }
}
