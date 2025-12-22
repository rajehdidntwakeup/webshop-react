import { describe, it, expect, vi, beforeEach } from 'vitest';
import { orderApi } from './orderApi';
import { ENV } from '@/shared/config/env';

describe('orderApi', () => {
    const mockFetch = vi.fn();
    vi.stubGlobal('fetch', mockFetch);

    beforeEach(() => {
        mockFetch.mockClear();
    });

    describe('fetchOrders', () => {
        it('should fetch orders successfully', async () => {
            const mockOrders = [
                {
                    id: 1,
                    totalPrice: '100.00',
                    status: 'PENDING',
                    orderItems: [],
                    items: []
                },
                {
                    id: 2,
                    totalPrice: '200.00',
                    status: 'COMPLETED',
                    orderItems: []
                }
            ];

            mockFetch.mockResolvedValueOnce({
                ok: true,
                json: async () => mockOrders,
            });

            const result = await orderApi.fetchOrders();

            expect(mockFetch).toHaveBeenCalledWith(ENV.ORDER_API_URL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            expect(result).toHaveLength(2);
            expect(result[0].orderItems).toEqual([]);
            expect(result[1].orderItems).toEqual([]);
        });

        it('should throw an error when the response is not ok', async () => {
            mockFetch.mockResolvedValueOnce({
                ok: false,
            });

            await expect(orderApi.fetchOrders()).rejects.toThrow('Failed to fetch orders');
        });

        it('should throw an error when fetch fails', async () => {
            mockFetch.mockRejectedValueOnce(new Error('Network error'));

            await expect(orderApi.fetchOrders()).rejects.toThrow('Network error');
        });
    });

    describe('addOrder', () => {
        it('should add an order successfully', async () => {
            const newOrder = {
                totalPrice: '150.00',
                status: 'PENDING',
                items: []
            };

            mockFetch.mockResolvedValueOnce({
                ok: true,
            });

            await orderApi.addOrder(newOrder);

            expect(mockFetch).toHaveBeenCalledWith(ENV.ORDER_API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrder)
            });
        });

        it('should throw an error when adding an order fails', async () => {
            const newOrder = {
                totalPrice: '150.00',
                status: 'PENDING',
                items: []
            };

            mockFetch.mockResolvedValueOnce({
                ok: false,
            });

            await expect(orderApi.addOrder(newOrder)).rejects.toThrow('Failed to add order');
        });
    });
});
