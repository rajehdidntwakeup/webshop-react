import { describe, it, expect, vi, beforeEach } from 'vitest';
import { productApi } from './productApi';
import { ProductResponseDto, ProductRequestDto } from '../model/Product';

// Mock ENV
vi.mock('@/shared/config/env', () => ({
    ENV: {
        INVENTORY_API_URL: 'http://api.example.com/inventory'
    }
}));

describe('productApi', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    describe('getProducts', () => {
        it('should fetch products successfully with multiCatalog=true', async () => {
            const mockProducts: ProductResponseDto[] = [
                {
                    productId: '1',
                    ean: '1234567890123',
                    name: 'Product 1',
                    description: 'Description 1',
                    price: 10.99,
                    quantity: 100,
                    brand: 'Brand A',
                    createdAt: '2023-01-01T00:00:00Z',
                    updatedAt: '2023-01-01T00:00:00Z',
                    externalShopId: null
                },
                {
                    productId: '2',
                    ean: '9876543210987',
                    name: 'Product 2',
                    description: 'Description 2',
                    price: 25.50,
                    quantity: 50,
                    brand: 'Brand B',
                    createdAt: '2023-01-02T00:00:00Z',
                    updatedAt: '2023-01-02T00:00:00Z',
                    externalShopId: 'shop-123'
                }
            ];

            (vi.mocked(fetch) as any).mockResolvedValue({
                ok: true,
                json: async () => mockProducts,
            });

            const result = await productApi.getProducts(true);

            expect(fetch).toHaveBeenCalledWith('http://api.example.com/inventory?multiCatalog=true', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            expect(result).toEqual(mockProducts);
            expect(result).toHaveLength(2);
        });

        it('should fetch products successfully with multiCatalog=false', async () => {
            const mockProducts: ProductResponseDto[] = [];

            (vi.mocked(fetch) as any).mockResolvedValue({
                ok: true,
                json: async () => mockProducts,
            });

            const result = await productApi.getProducts(false);

            expect(fetch).toHaveBeenCalledWith('http://api.example.com/inventory?multiCatalog=false', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            expect(result).toEqual([]);
        });

        it('should throw an error when the response is not ok', async () => {
            (vi.mocked(fetch) as any).mockResolvedValue({
                ok: false,
            });

            await expect(productApi.getProducts(true)).rejects.toThrow('Failed to load products');
        });
    });

    describe('addProduct', () => {
        it('should add a product successfully', async () => {
            const newProduct: ProductRequestDto = {
                ean: '1234567890123',
                name: 'New Product',
                description: 'New Description',
                price: 15.99,
                quantity: 75,
                brand: 'New Brand'
            };

            const mockResponse: ProductRequestDto = { ...newProduct };

            (vi.mocked(fetch) as any).mockResolvedValue({
                ok: true,
                json: async () => mockResponse,
            });

            const result = await productApi.addProduct(newProduct);

            expect(fetch).toHaveBeenCalledWith('http://api.example.com/inventory', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newProduct)
            });

            expect(result).toEqual(mockResponse);
        });

        it('should throw an error when the post request fails', async () => {
            const newProduct: ProductRequestDto = {
                ean: '1234567890123',
                name: 'New Product',
                description: 'New Description',
                price: 15.99,
                quantity: 75,
                brand: 'New Brand'
            };

            (vi.mocked(fetch) as any).mockResolvedValue({
                ok: false,
            });

            await expect(productApi.addProduct(newProduct)).rejects.toThrow('Failed to add product');
        });
    });

    describe('getProductById', () => {
        it('should fetch a product by ID successfully', async () => {
            const mockProduct: ProductResponseDto = {
                productId: '123',
                ean: '1234567890123',
                name: 'Single Product',
                description: 'Single Description',
                price: 20.00,
                quantity: 30,
                brand: 'Brand C',
                createdAt: '2023-01-03T00:00:00Z',
                updatedAt: '2023-01-03T00:00:00Z',
                externalShopId: null
            };

            (vi.mocked(fetch) as any).mockResolvedValue({
                ok: true,
                json: async () => mockProduct,
            });

            const result = await productApi.getProductById('123', true);

            expect(fetch).toHaveBeenCalledWith('http://api.example.com/inventory/123?multiCatalog=true', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            expect(result).toEqual(mockProduct);
        });

        it('should always use multiCatalog=true in URL regardless of parameter', async () => {
            const mockProduct: ProductResponseDto = {
                productId: '456',
                ean: '9876543210987',
                name: 'Another Product',
                description: 'Another Description',
                price: 30.00,
                quantity: 40,
                brand: 'Brand D',
                createdAt: '2023-01-04T00:00:00Z',
                updatedAt: '2023-01-04T00:00:00Z',
                externalShopId: 'shop-456'
            };

            (vi.mocked(fetch) as any).mockResolvedValue({
                ok: true,
                json: async () => mockProduct,
            });

            // Note: The implementation hardcodes multiCatalog=true in the URL
            const result = await productApi.getProductById('456', false);

            expect(fetch).toHaveBeenCalledWith('http://api.example.com/inventory/456?multiCatalog=true', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            expect(result).toEqual(mockProduct);
        });

        it('should throw an error when the product is not found', async () => {
            (vi.mocked(fetch) as any).mockResolvedValue({
                ok: false,
            });

            await expect(productApi.getProductById('999', true)).rejects.toThrow('Failed to load product');
        });
    });
});
