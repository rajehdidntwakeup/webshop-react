import {render, screen, waitFor} from '@testing-library/react';
import {OrdersPage} from './OrdersPage';
import {OrderProvider} from '@/entities/order/model/OrderContext';
import {orderApi} from '@/entities/order/api/orderApi';
import {vi, describe, it, expect, beforeEach} from 'vitest';
import {MemoryRouter} from 'react-router-dom';

// Mock the API
vi.mock('@/entities/order/api/orderApi', () => ({
    orderApi: {
        fetchOrders: vi.fn(),
        addOrder: vi.fn(),
    },
}));

// Mock AnimatedBackground to simplify
vi.mock('./ui/AnimatedBackground', () => ({
    AnimatedBackground: () => <div data-testid="animated-background" />
}));

describe('OrdersPage Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('fetches and displays orders from the API on mount', async () => {
        const mockOrders = [
            {
                id: 'ord-123',
                totalPrice: 49.99,
                status: 'PROCESSING',
                orderItems: [{itemName: 'Cool Gadget', quantity: 1, price: 49.99}]
            }
        ];

        vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);

        render(
            <MemoryRouter>
                <OrderProvider>
                    <OrdersPage />
                </OrderProvider>
            </MemoryRouter>
        );

        // Initially shows loading
        expect(screen.getByText(/Loading orders.../i)).toBeInTheDocument();

        // Wait for orders to be displayed
        await waitFor(() => {
            expect(screen.getByText('Cool Gadget')).toBeInTheDocument();
        });

        expect(screen.getByText(/49.99 €/i)).toBeInTheDocument();
        expect(screen.getByText(/PROCESSING/i)).toBeInTheDocument();
        expect(screen.getByText(/#ord-123/)).toBeInTheDocument();
        
        expect(orderApi.fetchOrders).toHaveBeenCalledTimes(1);
    });

    it('shows error message when API call fails', async () => {
        const errorMessage = 'Network Error';
        vi.mocked(orderApi.fetchOrders).mockRejectedValue(new Error(errorMessage));

        render(
            <MemoryRouter>
                <OrderProvider>
                    <OrdersPage />
                </OrderProvider>
            </MemoryRouter>
        );

        await waitFor(() => {
            expect(screen.getByText(/Failed to load orders/i)).toBeInTheDocument();
        });

        expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
});
