import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ReactNode } from 'react';

import { ProductsProvider, useProducts } from './ProductsContext';
import { productApi } from '../api/productApi';
import { ProductResponseDto, ProductRequestDto } from './Product';

// Mock the API
vi.mock('../api/productApi', () => ({
    productApi: {
        getProducts: vi.fn(),
        addProduct: vi.fn(),
    },
}));

describe('ProductsContext', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
        <ProductsProvider>{children}</ProductsProvider>
    );

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
            externalShopId: null,
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
            externalShopId: 'external-1',
        },
    ];

    beforeEach(() => {
        vi.clearAllMocks();
    });

    describe('useProducts hook', () => {
        it('should throw error when used outside ProductsProvider', () => {
            // Prevent console.error from cluttering the output
            const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            expect(() => renderHook(() => useProducts())).toThrow('useProducts must be used within a ProductsProvider');

            consoleSpy.mockRestore();
        });
    });

    describe('ProductsProvider initialization', () => {
        it('should initialize with default values', () => {
            vi.mocked(productApi.getProducts).mockResolvedValue([]);

            const { result } = renderHook(() => useProducts(), { wrapper });

            expect(result.current.products).toEqual([]);
            expect(result.current.isLoading).toBe(true); // Initially loading
            expect(result.current.error).toBe(null);
            expect(result.current.multiCatalog).toBe(false);
        });

        it('should fetch products on mount', async () => {
            vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.products).toEqual(mockProducts);
            expect(productApi.getProducts).toHaveBeenCalledWith(false);
        });

        it('should handle fetch error on mount', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            vi.mocked(productApi.getProducts).mockRejectedValue(new Error('Network error'));

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.error).toBe('Network error');
            expect(result.current.products).toEqual([]);

            consoleErrorSpy.mockRestore();
        });

        it('should handle non-Error exceptions', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            vi.mocked(productApi.getProducts).mockRejectedValue('String error');

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.error).toBe('An error occurred');

            consoleErrorSpy.mockRestore();
        });
    });

    describe('multiCatalog state', () => {
        it('should update multiCatalog state', async () => {
            vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            act(() => {
                result.current.setMultiCatalog(true);
            });

            expect(result.current.multiCatalog).toBe(true);
        });

        it('should refetch products when multiCatalog changes', async () => {
            vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Initial call with multiCatalog=false
            expect(productApi.getProducts).toHaveBeenCalledTimes(1);
            expect(productApi.getProducts).toHaveBeenLastCalledWith(false);

            // Change multiCatalog
            act(() => {
                result.current.setMultiCatalog(true);
            });

            await waitFor(() => {
                expect(productApi.getProducts).toHaveBeenCalledTimes(2);
            });

            expect(productApi.getProducts).toHaveBeenLastCalledWith(true);
        });
    });

    describe('refreshProducts', () => {
        it('should manually refresh products list', async () => {
            vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const initialCallCount = vi.mocked(productApi.getProducts).mock.calls.length;

            await act(async () => {
                await result.current.refreshProducts();
            });

            expect(productApi.getProducts).toHaveBeenCalledTimes(initialCallCount + 1);
            expect(result.current.products).toEqual(mockProducts);
        });

        it('should set loading state during refresh', async () => {
            let resolveProducts: (value: ProductResponseDto[]) => void;
            const productsPromise = new Promise<ProductResponseDto[]>((resolve) => {
                resolveProducts = resolve;
            });

            vi.mocked(productApi.getProducts).mockReturnValue(productsPromise);

            const { result } = renderHook(() => useProducts(), { wrapper });

            await act(async () => {
                const refreshPromise = result.current.refreshProducts();

                // Should be loading
                expect(result.current.isLoading).toBe(true);

                resolveProducts!(mockProducts);
                await refreshPromise;
            });

            expect(result.current.isLoading).toBe(false);
        });

        it('should clear error before refresh', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            // First call fails
            vi.mocked(productApi.getProducts).mockRejectedValueOnce(new Error('First error'));

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.error).toBe('First error');
            });

            // Second call succeeds
            vi.mocked(productApi.getProducts).mockResolvedValueOnce(mockProducts);

            await act(async () => {
                await result.current.refreshProducts();
            });

            expect(result.current.error).toBe(null);
            expect(result.current.products).toEqual(mockProducts);

            consoleErrorSpy.mockRestore();
        });

        it('should handle refresh failure', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            // Initial load succeeds
            vi.mocked(productApi.getProducts).mockResolvedValueOnce(mockProducts);

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.products).toEqual(mockProducts);
            });

            // Refresh fails
            vi.mocked(productApi.getProducts).mockRejectedValueOnce(new Error('Refresh failed'));

            await act(async () => {
                await result.current.refreshProducts();
            });

            expect(result.current.error).toBe('Refresh failed');
            expect(result.current.isLoading).toBe(false);

            consoleErrorSpy.mockRestore();
        });
    });

    describe('addProduct', () => {
        const newProduct: ProductRequestDto = {
            ean: '5555555555555',
            name: 'New Product',
            description: 'New Description',
            price: 15.99,
            quantity: 75,
            brand: 'New Brand',
        };

        it('should add a product and refresh the list', async () => {
            vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);
            vi.mocked(productApi.addProduct).mockResolvedValue(newProduct);

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const initialCallCount = vi.mocked(productApi.getProducts).mock.calls.length;

            await act(async () => {
                await result.current.addProduct(newProduct);
            });

            expect(productApi.addProduct).toHaveBeenCalledWith(newProduct);
            expect(productApi.getProducts).toHaveBeenCalledTimes(initialCallCount + 1);
            expect(result.current.error).toBe(null);
        });

        it('should clear error before adding product', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            // Initial load fails
            vi.mocked(productApi.getProducts).mockRejectedValueOnce(new Error('Load error'));

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.error).toBe('Load error');
            });

            // Add product succeeds
            vi.mocked(productApi.addProduct).mockResolvedValueOnce(newProduct);
            vi.mocked(productApi.getProducts).mockResolvedValueOnce([...mockProducts]);

            await act(async () => {
                await result.current.addProduct(newProduct);
            });

            expect(result.current.error).toBe(null);

            consoleErrorSpy.mockRestore();
        });

        it('should set error and throw when addProduct fails', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);
            vi.mocked(productApi.addProduct).mockRejectedValue(new Error('Add failed'));

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            await act(async () => {
                await expect(result.current.addProduct(newProduct)).rejects.toThrow('Add failed');
            });

            expect(result.current.error).toBe('Add failed');
            expect(productApi.addProduct).toHaveBeenCalledWith(newProduct);

            consoleErrorSpy.mockRestore();
        });

        it('should handle non-Error exceptions in addProduct', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);
            vi.mocked(productApi.addProduct).mockRejectedValue('String error');

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            await act(async () => {
                await expect(result.current.addProduct(newProduct)).rejects.toBe('String error');
            });

            expect(result.current.error).toBe('An error occurred');

            consoleErrorSpy.mockRestore();
        });

        it('should not refresh products if addProduct fails', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);
            vi.mocked(productApi.addProduct).mockRejectedValue(new Error('Add failed'));

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            const callCountBeforeAdd = vi.mocked(productApi.getProducts).mock.calls.length;

            await act(async () => {
                try {
                    await result.current.addProduct(newProduct);
                } catch (e) {
                    // Expected to throw
                }
            });

            // Should not have called getProducts again since addProduct failed
            expect(productApi.getProducts).toHaveBeenCalledTimes(callCountBeforeAdd);

            consoleErrorSpy.mockRestore();
        });

        it('should handle failure during refresh after successful add', async () => {
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

            // Initial load succeeds
            vi.mocked(productApi.getProducts).mockResolvedValueOnce(mockProducts);

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Add succeeds but refresh fails
            vi.mocked(productApi.addProduct).mockResolvedValueOnce(newProduct);
            vi.mocked(productApi.getProducts).mockRejectedValueOnce(new Error('Refresh after add failed'));

            await act(async () => {
                await result.current.addProduct(newProduct);
            });

            expect(productApi.addProduct).toHaveBeenCalledWith(newProduct);
            expect(result.current.error).toBe('Refresh after add failed');

            consoleErrorSpy.mockRestore();
        });
    });

    describe('Integration scenarios', () => {
        it('should handle multiple operations in sequence', async () => {
            vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);
            const newProduct: ProductRequestDto = {
                ean: '1111111111111',
                name: 'Test Product',
                description: 'Test',
                price: 5.99,
                quantity: 10,
                brand: 'Test Brand',
            };
            vi.mocked(productApi.addProduct).mockResolvedValue(newProduct);

            const { result } = renderHook(() => useProducts(), { wrapper });

            // Wait for initial load
            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            expect(result.current.products).toEqual(mockProducts);

            // Toggle multiCatalog
            act(() => {
                result.current.setMultiCatalog(true);
            });

            await waitFor(() => {
                expect(productApi.getProducts).toHaveBeenCalledWith(true);
            });

            // Add a product
            await act(async () => {
                await result.current.addProduct(newProduct);
            });

            expect(productApi.addProduct).toHaveBeenCalledWith(newProduct);

            // Manually refresh
            await act(async () => {
                await result.current.refreshProducts();
            });

            expect(result.current.error).toBe(null);
        });

        it('should maintain multiCatalog state across operations', async () => {
            vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);
            const newProduct: ProductRequestDto = {
                ean: '2222222222222',
                name: 'Another Product',
                description: 'Another',
                price: 8.99,
                quantity: 20,
                brand: 'Another Brand',
            };
            vi.mocked(productApi.addProduct).mockResolvedValue(newProduct);

            const { result } = renderHook(() => useProducts(), { wrapper });

            await waitFor(() => {
                expect(result.current.isLoading).toBe(false);
            });

            // Enable multiCatalog
            act(() => {
                result.current.setMultiCatalog(true);
            });

            await waitFor(() => {
                expect(productApi.getProducts).toHaveBeenLastCalledWith(true);
            });

            // Add product should use multiCatalog=true for refresh
            await act(async () => {
                await result.current.addProduct(newProduct);
            });

            expect(productApi.getProducts).toHaveBeenLastCalledWith(true);

            // Manual refresh should also use multiCatalog=true
            await act(async () => {
                await result.current.refreshProducts();
            });

            expect(productApi.getProducts).toHaveBeenLastCalledWith(true);
        });
    });
});
