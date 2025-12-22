import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productApi } from './productApi';
import { ENV } from '@/shared/config/env';
import { Product } from '../model/Product';

describe('productApi', () => {
    const mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);

    beforeEach(() => {
        mockFetch.mockClear();
    });

    describe('getProducts', () => {
        it('should fetch products successfully with default multiCatalog', async () => {
            const mockProducts: Product[] = [
                { id: 1, name: 'Product 1', price: '100', stock: 10, description: 'Desc 1' },
                { id: 2, name: 'Product 2', price: '200', stock: 20, description: 'Desc 2' }
            ];

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts,
            });

            const result = await productApi.getProducts();

            expect(mockFetch).toHaveBeenCalledWith(`${ENV.INVENTORY_API_URL}?multi-catalog=false`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            expect(result).toEqual(mockProducts);
        });

        it('should fetch products successfully with multiCatalog=true', async () => {
            const mockProducts: Product[] = [
                { id: 1, name: 'Product 1', price: '100', stock: 10, description: 'Desc 1' }
            ];

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockProducts,
            });

            const result = await productApi.getProducts(true);

            expect(mockFetch).toHaveBeenCalledWith(`${ENV.INVENTORY_API_URL}?multi-catalog=true`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            expect(result).toEqual(mockProducts);
        });

        it('should throw an error when the response is not ok', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
            });

            await expect(productApi.getProducts()).rejects.toThrow('Failed to load products');
        });

        it('should throw an error when fetch fails', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(productApi.getProducts()).rejects.toThrow('Network error');
        });
    });

    describe('addProduct', () => {
        it('should add a product successfully', async () => {
            const newProductData: Omit<Product, 'id'> = {
                name: 'New Product',
                price: '150',
                stock: 15,
                description: 'A description'
            };
            const mockSavedProduct: Product = { ...newProductData, id: 3 };

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockSavedProduct,
            });

            const result = await productApi.addProduct(newProductData);

            expect(mockFetch).toHaveBeenCalledWith(ENV.INVENTORY_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProductData)
            });
            expect(result).toEqual(mockSavedProduct);
        });

        it('should throw an error when adding a product fails', async () => {
            const newProductData: Omit<Product, 'id'> = {
                name: 'New Product',
                price: '150',
                stock: 15,
                description: 'A description'
            };

            mockFetch.mockResolvedValueOnce({
                ok: false,
            });

            await expect(productApi.addProduct(newProductData)).rejects.toThrow('Failed to add product');
        });

        it('should throw an error when fetch fails during addProduct', async () => {
            const newProductData: Omit<Product, 'id'> = {
                name: 'New Product',
                price: '150',
                stock: 15,
                description: 'A description'
            };

            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(productApi.addProduct(newProductData)).rejects.toThrow('Network error');
        });
    });
});
