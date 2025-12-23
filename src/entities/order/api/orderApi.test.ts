import { describe, it, expect, vi, beforeEach } from 'vitest';
import { orderApi } from './orderApi';
import { NewOrderDto } from '../model/CreateOrderDto';
import { OrderResponseDto } from '../model/Order';

// Mock ENV
vi.mock('@/shared/config/env', () => ({
    ENV: {
        ORDER_API_URL: 'http://api.example.com/orders'
    }
}));

describe('orderApi', () => {
    beforeEach(() => {
        vi.stubGlobal('fetch', vi.fn());
    });

    describe('fetchOrders', () => {
        it('should fetch orders successfully and map them correctly', async () => {
            const mockOrders = [
                {
                    id: '1',
                    createdAt: '2023-01-01',
                    updatedAt: '2023-01-01',
                    status: 'NEW',
                    origin: 'INTERNAL',
                    items: []
                },
                {
                    orderId: '2',
                    createdAt: '2023-01-02',
                    updatedAt: '2023-01-02',
                    status: 'COMPLETED',
                    origin: 'EXTERNAL',
                    items: [{ productId: 'p1', quantity: 1 }]
                }
            ];

            (vi.mocked(fetch) as any).mockResolvedValue({
                ok: true,
                json: async () => mockOrders,
            });

            const result = await orderApi.fetchOrders(true);

            expect(fetch).toHaveBeenCalledWith('http://api.example.com/orders?externalOrder=true', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            expect(result).toHaveLength(2);
            expect(result[0].orderId).toBe('1'); // Fallback to id
            expect(result[1].orderId).toBe('2'); // Uses orderId
            expect(result[0].items).toEqual([]);
        });

        it('should throw an error when the response is not ok', async () => {
            (vi.mocked(fetch) as any).mockResolvedValue({
                ok: false,
            });

            await expect(orderApi.fetchOrders(false)).rejects.toThrow('Failed to fetch orders');
        });
    });

    describe('addOrder', () => {
        it('should add an order successfully', async () => {
            const newOrders: NewOrderDto[] = [
                { productId: 'p1', quantity: 2 }
            ];

            (vi.mocked(fetch) as any).mockResolvedValue({
                ok: true,
            });

            await orderApi.addOrder(newOrders);

            expect(fetch).toHaveBeenCalledWith('http://api.example.com/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newOrders)
            });
        });

        it('should throw an error when the post request fails', async () => {
            (vi.mocked(fetch) as any).mockResolvedValue({
                ok: false,
            });

            await expect(orderApi.addOrder([])).rejects.toThrow('Failed to add order');
        });
    });
});
