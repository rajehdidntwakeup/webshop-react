import {ENV} from "@/shared/config/env";

import {Product} from "../model/Product";

const INVENTORY_URL = ENV.INVENTORY_API_URL;

/**
 * API for managing products in the inventory.
 */
export const productApi = {

    /**
     * Retrieves a list of products from the inventory.
     * 
     * @param {boolean} [multiCatalog=false] - Whether to fetch products from multiple catalogs.
     * @returns {Promise<Product[]>} A promise that resolves to an array of products.
     * @throws {Error} If the request fails or the response is not ok.
     */
    async getProducts(multiCatalog: boolean = false): Promise<Product[]> {
        const response = await fetch(`${INVENTORY_URL}?multi-catalog=${multiCatalog}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) throw new Error('Failed to load products');
        return response.json();
    },

    /**
     * Adds a new product to the inventory.
     * 
     * @param {Omit<Product, 'id'>} product - The product data to add (excluding the ID).
     * @returns {Promise<Product>} A promise that resolves to the newly created product.
     * @throws {Error} If the request fails or the response is not ok.
     */
    async addProduct(product: Omit<Product, 'id'>): Promise<Product> {
        const response = await fetch(`${INVENTORY_URL}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });
        if (!response.ok) {
            throw new Error('Failed to add product');
        }
        return response.json();
    }

}
