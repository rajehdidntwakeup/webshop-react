import {render, screen, fireEvent} from '@testing-library/react';
import {OrdersPage} from './OrdersPage';
import {useOrders} from '@/entities/order/model/OrderContext';
import {vi, describe, it, expect, beforeEach, Mock} from 'vitest';
import {MemoryRouter} from 'react-router-dom';

// Mock the hook
vi.mock('@/entities/order/model/OrderContext', () => ({
    useOrders: vi.fn(),
}));

// Mock the sub-components that use useNavigate to avoid router issues if needed, 
// though MemoryRouter should handle it.
// We'll also mock AnimatedBackground as it might have complex animations or styles not needed for unit tests.
vi.mock('./ui/AnimatedBackground', () => ({
    AnimatedBackground: () => <div data-testid="animated-background" />
}));

describe('OrdersPage Unit Tests', () => {
    const mockFetchOrders = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders loading state', () => {
        (useOrders as Mock).mockReturnValue({
            orders: [],
            fetchOrders: mockFetchOrders,
            isLoading: true,
            error: null,
        });

        render(
            <MemoryRouter>
                <OrdersPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/Loading orders.../i)).toBeInTheDocument();
        expect(mockFetchOrders).toHaveBeenCalledTimes(1);
    });

    it('renders error state and handles retry', () => {
        const errorMessage = 'Failed to fetch';
        (useOrders as Mock).mockReturnValue({
            orders: [],
            fetchOrders: mockFetchOrders,
            isLoading: false,
            error: errorMessage,
        });

        render(
            <MemoryRouter>
                <OrdersPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/Failed to load orders/i)).toBeInTheDocument();
        expect(screen.getByText(errorMessage)).toBeInTheDocument();

        const retryButton = screen.getByRole('button', {name: /Try Again/i});
        fireEvent.click(retryButton);

        // One from useEffect, one from button click
        expect(mockFetchOrders).toHaveBeenCalledTimes(2);
    });

    it('renders empty state', () => {
        (useOrders as Mock).mockReturnValue({
            orders: [],
            fetchOrders: mockFetchOrders,
            isLoading: false,
            error: null,
        });

        render(
            <MemoryRouter>
                <OrdersPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/No orders yet/i)).toBeInTheDocument();
        expect(screen.getByText(/Start shopping to see your orders here/i)).toBeInTheDocument();
    });

    it('renders orders list when data is available', () => {
        const mockOrders = [
            {
                id: '1',
                totalPrice: 100,
                status: 'DELIVERED',
                orderItems: [{itemName: 'Product 1', quantity: 1, price: 100}]
            },
            {
                id: '2',
                totalPrice: 200,
                status: 'PENDING',
                orderItems: [{itemName: 'Product 2', quantity: 2, price: 100}]
            }
        ];

        (useOrders as Mock).mockReturnValue({
            orders: mockOrders,
            fetchOrders: mockFetchOrders,
            isLoading: false,
            error: null,
        });

        render(
            <MemoryRouter>
                <OrdersPage />
            </MemoryRouter>
        );

        expect(screen.getByText(/Your Orders/i)).toBeInTheDocument();
        expect(screen.getByText(/Total orders: 2/i)).toBeInTheDocument();
        expect(screen.getByText('Product 1')).toBeInTheDocument();
        expect(screen.getByText('Product 2')).toBeInTheDocument();
        expect(screen.getByText(/100 €/i)).toBeInTheDocument();
        expect(screen.getByText(/200 €/i)).toBeInTheDocument();
    });
});
