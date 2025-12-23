import { renderHook, act, waitFor } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { ReactNode } from 'react';

import { OrderProvider, useOrders } from './OrderContext';
import { orderApi } from '../api/orderApi';
import { productApi } from '../../product/api/productApi';

// Mock the APIs
vi.mock('../api/orderApi', () => ({
    orderApi: {
        fetchOrders: vi.fn(),
        addOrder: vi.fn(),
    },
}));

vi.mock('../../product/api/productApi', () => ({
    productApi: {
        getProductById: vi.fn(),
    },
}));

describe('OrderContext', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
        <OrderProvider>{children}</OrderProvider>
    );

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useOrders(), { wrapper });

        expect(result.current.orders).toEqual([]);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBe(null);
    });

    it('should throw error when used outside OrderProvider', () => {
        // Prevent console.error from cluttering the output
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
        
        expect(() => renderHook(() => useOrders())).toThrow('useOrders must be used within an OrderProvider');
        
        consoleSpy.mockRestore();
    });

    describe('fetchOrders', () => {
        it('should fetch orders and update state on success', async () => {
            const mockOrders = [
                {
                    orderId: 'order-1',
                    items: [{ productId: 'prod-1', quantity: 1 }],
                    createdAt: '2023-01-01',
                    status: 'COMPLETED',
                },
            ];
            const mockProduct = {
                id: 'prod-1',
                name: 'Test Product',
                price: 100,
            };

            vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
            vi.mocked(productApi.getProductById).mockResolvedValue(mockProduct);

            const { result } = renderHook(() => useOrders(), { wrapper });

            await act(async () => {
                await result.current.fetchOrders();
            });

            expect(result.current.orders).toEqual([
                {
                    orderId: 'order-1',
                    productName: 'Test Product',
                    price: 100,
                    createdAt: '2023-01-01',
                    status: 'COMPLETED',
                },
            ]);
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBe(null);
            expect(orderApi.fetchOrders).toHaveBeenCalledWith(false);
            expect(productApi.getProductById).toHaveBeenCalledWith('prod-1');
        });

        it('should handle missing productId in orders', async () => {
            const mockOrders = [
                {
                    orderId: 'order-2',
                    items: [], // No items, so no productId
                    createdAt: '2023-01-02',
                    status: 'PENDING',
                },
            ];

            vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);

            const { result } = renderHook(() => useOrders(), { wrapper });

            await act(async () => {
                await result.current.fetchOrders();
            });

            expect(result.current.orders[0].productName).toBe('Unknown Product');
            expect(result.current.orders[0].price).toBe(0);
        });

        it('should use cache for products with same ID', async () => {
            const mockOrders = [
                { orderId: 'o1', items: [{ productId: 'p1' }], createdAt: 'c1', status: 's1' },
                { orderId: 'o2', items: [{ productId: 'p1' }], createdAt: 'c2', status: 's2' },
            ];
            const mockProduct = { id: 'p1', name: 'Shared Product', price: 50 };

            vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
            vi.mocked(productApi.getProductById).mockResolvedValue(mockProduct);

            const { result } = renderHook(() => useOrders(), { wrapper });

            await act(async () => {
                await result.current.fetchOrders();
            });

            expect(productApi.getProductById).toHaveBeenCalledTimes(1);
            expect(result.current.orders).toHaveLength(2);
        });

        it('should handle product fetch failure for individual orders', async () => {
            const mockOrders = [
                { orderId: 'o1', items: [{ productId: 'p1' }], createdAt: 'c1', status: 's1' },
            ];

            vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
            vi.mocked(productApi.getProductById).mockRejectedValue(new Error('Product fetch failed'));

            const { result } = renderHook(() => useOrders(), { wrapper });

            await act(async () => {
                await result.current.fetchOrders();
            });

            expect(result.current.orders[0].productName).toBe('Error loading product');
            expect(result.current.orders[0].price).toBe(0);
        });

        it('should handle fetchOrders API failure', async () => {
            vi.mocked(orderApi.fetchOrders).mockRejectedValue(new Error('API Error'));

            const { result } = renderHook(() => useOrders(), { wrapper });

            await act(async () => {
                await result.current.fetchOrders();
            });

            expect(result.current.error).toBe('API Error');
            expect(result.current.isLoading).toBe(false);
        });
    });

    describe('addOrder', () => {
        it('should add an order and refresh list', async () => {
            const newOrder = { items: [{ productId: 'p1', quantity: 1 }] };
            vi.mocked(orderApi.addOrder).mockResolvedValue(undefined);
            vi.mocked(orderApi.fetchOrders).mockResolvedValue([]);

            const { result } = renderHook(() => useOrders(), { wrapper });

            await act(async () => {
                await result.current.addOrder(newOrder);
            });

            expect(orderApi.addOrder).toHaveBeenCalledWith([newOrder]);
            expect(orderApi.fetchOrders).toHaveBeenCalled();
        });

        it('should set error and throw if addOrder fails', async () => {
            const newOrder = { items: [{ productId: 'p1', quantity: 1 }] };
            vi.mocked(orderApi.addOrder).mockRejectedValue(new Error('Add failed'));

            const { result } = renderHook(() => useOrders(), { wrapper });

            // We catch the error to ensure we can check the state afterwards
            await act(async () => {
                try {
                    await result.current.addOrder(newOrder);
                } catch (e) {
                    // Ignore the error as we expect it
                }
            });

            expect(result.current.error).toBe('Add failed');
        });
    });
});
