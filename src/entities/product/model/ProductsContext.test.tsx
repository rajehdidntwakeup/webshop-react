import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProductsProvider, useProducts } from './ProductsContext';
import { productApi } from '../api/productApi';
import { ReactNode } from 'react';
import { Product } from './Product';

// Mock productApi
vi.mock('../api/productApi', () => ({
    productApi: {
        getProducts: vi.fn(),
        addProduct: vi.fn(),
    },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
    <ProductsProvider>{children}</ProductsProvider>
);

describe('ProductsContext', () => {
    let consoleSpy: any;

    beforeEach(() => {
        vi.clearAllMocks();
        // Mock console.error to avoid cluttering test output
        consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should throw an error if useProducts is used outside of ProductsProvider', () => {
        // Suppress console.error for this expected error
        consoleSpy.mockImplementationOnce(() => {});
        expect(() => renderHook(() => useProducts())).toThrow('useProducts must be used within a ProductsProvider');
    });

    it('should fetch products on mount', async () => {
        const mockProducts: Product[] = [
            { id: 1, name: 'Product 1', price: 10, description: 'Desc 1', category: 'Cat 1', image: 'img1.jpg' },
        ];
        vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);

        const { result } = renderHook(() => useProducts(), { wrapper });

        // Initial state before effect completes (might be loading or already done depending on how fast it resolves)
        // Since it's an async call in useEffect, we need to wait for it.
        
        await act(async () => {
            // Wait for the initial refreshProducts call in useEffect
        });

        expect(productApi.getProducts).toHaveBeenCalledWith(false);
        expect(result.current.products).toEqual(mockProducts);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    describe('refreshProducts', () => {
        it('should fetch products and update state on success', async () => {
            const mockProducts: Product[] = [
                { id: 1, name: 'Product 1', price: 10, description: 'Desc 1', category: 'Cat 1', image: 'img1.jpg' },
            ];
            vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);

            const { result } = renderHook(() => useProducts(), { wrapper });

            await act(async () => {
                await result.current.refreshProducts();
            });

            expect(productApi.getProducts).toHaveBeenCalledWith(false);
            expect(result.current.products).toEqual(mockProducts);
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBeNull();
        });

        it('should handle error when fetching products fails', async () => {
            const errorMessage = 'Failed to fetch products';
            vi.mocked(productApi.getProducts).mockRejectedValue(new Error(errorMessage));

            const { result } = renderHook(() => useProducts(), { wrapper });

            await act(async () => {
                await result.current.refreshProducts();
            });

            expect(result.current.error).toBe(errorMessage);
            expect(result.current.isLoading).toBe(false);
        });

        it('should set isLoading during fetching', async () => {
            let resolveFetch: (value: Product[]) => void;
            const fetchPromise = new Promise<Product[]>((resolve) => {
                resolveFetch = resolve;
            });
            vi.mocked(productApi.getProducts).mockReturnValue(fetchPromise);

            const { result } = renderHook(() => useProducts(), { wrapper });

            let callPromise: Promise<void>;
            await act(async () => {
                callPromise = result.current.refreshProducts();
            });

            expect(result.current.isLoading).toBe(true);

            await act(async () => {
                resolveFetch!([]);
                await callPromise!;
            });

            expect(result.current.isLoading).toBe(false);
        });
    });

    describe('addProduct', () => {
        it('should add a product and refresh products list on success', async () => {
            const newProductData: Omit<Product, 'id'> = { 
                name: 'New Product', 
                price: 20, 
                description: 'New Desc', 
                category: 'New Cat', 
                image: 'new.jpg' 
            };
            const mockProducts: Product[] = [
                { id: 2, ...newProductData },
            ];
            
            vi.mocked(productApi.addProduct).mockResolvedValue({ id: 2, ...newProductData });
            vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);

            const { result } = renderHook(() => useProducts(), { wrapper });

            await act(async () => {
                await result.current.addProduct(newProductData);
            });

            expect(productApi.addProduct).toHaveBeenCalledWith(newProductData);
            // Once for mount, once for refresh after add
            expect(productApi.getProducts).toHaveBeenCalledTimes(2);
            expect(result.current.products).toEqual(mockProducts);
            expect(result.current.error).toBeNull();
        });

        it('should handle error when adding product fails', async () => {
            const newProductData: Omit<Product, 'id'> = { 
                name: 'New Product', 
                price: 20, 
                description: 'New Desc', 
                category: 'New Cat', 
                image: 'new.jpg' 
            };
            const errorMessage = 'Failed to add product';
            vi.mocked(productApi.addProduct).mockRejectedValue(new Error(errorMessage));

            const { result } = renderHook(() => useProducts(), { wrapper });

            await act(async () => {
                try {
                    await result.current.addProduct(newProductData);
                } catch (e) {
                    // Expected error
                }
            });

            expect(productApi.addProduct).toHaveBeenCalledWith(newProductData);
            expect(result.current.error).toBe(errorMessage);
        });
    });
});
