import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { OrderProvider, useOrders } from './OrderContext';
import { orderApi } from '../api/orderApi';
import { ReactNode } from 'react';
import { Order } from './Order';
import { CreateOrderDto } from './CreateOrderDto';

// Mock orderApi
vi.mock('../api/orderApi', () => ({
    orderApi: {
        fetchOrders: vi.fn(),
        addOrder: vi.fn(),
    },
}));

const wrapper = ({ children }: { children: ReactNode }) => (
    <OrderProvider>{children}</OrderProvider>
);

describe('OrderContext', () => {
    let consoleSpy: any;

    beforeEach(() => {
        vi.clearAllMocks();
        consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
        consoleSpy.mockRestore();
    });

    it('should throw an error if useOrders is used outside of OrderProvider', () => {
        expect(() => renderHook(() => useOrders())).toThrow('useOrders must be used within an OrderProvider');
    });

    it('should provide initial state', () => {
        const { result } = renderHook(() => useOrders(), { wrapper });

        expect(result.current.orders).toEqual([]);
        expect(result.current.isLoading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    describe('fetchOrders', () => {
        it('should fetch orders and update state on success', async () => {
            const mockOrders: Order[] = [
                { id: 1, orderItems: [], createdAt: '2023-01-01', totalAmount: 100 },
            ];
            vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);

            const { result } = renderHook(() => useOrders(), { wrapper });

            await act(async () => {
                await result.current.fetchOrders();
            });

            expect(orderApi.fetchOrders).toHaveBeenCalledTimes(1);
            expect(result.current.orders).toEqual(mockOrders);
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBeNull();
        });

        it('should handle error when fetching orders fails', async () => {
            const errorMessage = 'Failed to fetch';
            vi.mocked(orderApi.fetchOrders).mockRejectedValue(new Error(errorMessage));

            const { result } = renderHook(() => useOrders(), { wrapper });

            await act(async () => {
                await result.current.fetchOrders();
            });

            expect(orderApi.fetchOrders).toHaveBeenCalledTimes(1);
            expect(result.current.orders).toEqual([]);
            expect(result.current.isLoading).toBe(false);
            expect(result.current.error).toBe(errorMessage);
        });

        it('should set isLoading during fetching', async () => {
            let resolveFetch: (value: Order[]) => void;
            const fetchPromise = new Promise<Order[]>((resolve) => {
                resolveFetch = resolve;
            });
            vi.mocked(orderApi.fetchOrders).mockReturnValue(fetchPromise);

            const { result } = renderHook(() => useOrders(), { wrapper });

            let callPromise: Promise<void>;
            await act(async () => {
                callPromise = result.current.fetchOrders();
            });

            expect(result.current.isLoading).toBe(true);

            await act(async () => {
                resolveFetch!([]);
                await callPromise;
            });

            expect(result.current.isLoading).toBe(false);
        });
    });

    describe('addOrder', () => {
        it('should add an order and refresh order list on success', async () => {
            const newOrder: CreateOrderDto = { orderItems: [] };
            const mockOrders: Order[] = [
                { id: 1, orderItems: [], createdAt: '2023-01-01', totalAmount: 100 },
            ];
            
            vi.mocked(orderApi.addOrder).mockResolvedValue();
            vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);

            const { result } = renderHook(() => useOrders(), { wrapper });

            await act(async () => {
                await result.current.addOrder(newOrder);
            });

            expect(orderApi.addOrder).toHaveBeenCalledWith(newOrder);
            expect(orderApi.fetchOrders).toHaveBeenCalledTimes(1);
            expect(result.current.orders).toEqual(mockOrders);
            expect(result.current.error).toBeNull();
        });

        it('should handle error when adding order fails', async () => {
            const newOrder: CreateOrderDto = { orderItems: [] };
            const errorMessage = 'Failed to add';
            vi.mocked(orderApi.addOrder).mockRejectedValue(new Error(errorMessage));

            const { result } = renderHook(() => useOrders(), { wrapper });

            await act(async () => {
                try {
                    await result.current.addOrder(newOrder);
                } catch (e) {
                    // Expected error
                }
            });

            expect(orderApi.addOrder).toHaveBeenCalledWith(newOrder);
            expect(result.current.error).toBe(errorMessage);
        });
    });
});
