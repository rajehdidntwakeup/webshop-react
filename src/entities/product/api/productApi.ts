import {ENV} from "@/shared/config/env";

import {ProductResponseDto, ProductRequestDto} from "../model/Product";

const INVENTORY_URL = ENV.INVENTORY_API_URL;

/**
 * API for managing products in the inventory.
 */
export const productApi = {


    /**
     * Fetches a list of products.
     * @param multiCatalog - Flag to include multiple catalogs.
     * @returns A promise that resolves to an array of ProductResponseDto.
     * @throws Error if the fetch request fails.
     */
    async getProducts(multiCatalog: boolean): Promise<ProductResponseDto[]> {
        const response = await fetch(`${INVENTORY_URL}?multiCatalog=${multiCatalog}`, {
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
     * @param product - The product data to add.
     * @returns A promise that resolves to the added ProductRequestDto.
     * @throws Error if the add request fails.
     */
    async addProduct(product: ProductRequestDto): Promise<ProductRequestDto> {
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
    },

    
    /**
     * Fetches a single product by its ID.
     * @param productId - The unique identifier of the product.
     * @param multiCatalog - Flag to include multiple catalogs.
     * @returns A promise that resolves to the ProductResponseDto.
     * @throws Error if the fetch request fails.
     */
    async getProductById(productId: string, multiCatalog: boolean): Promise<ProductResponseDto> {
        const response = await fetch(`${INVENTORY_URL}/${productId}?multiCatalog=true`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to load product');
        }
        return response.json();
    },
}
