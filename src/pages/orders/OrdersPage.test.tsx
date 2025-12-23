import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrdersPage } from './OrdersPage';
import { OrderProvider } from '@/entities/order/model/OrderContext';
import { MemoryRouter } from 'react-router-dom';

// Mock the child components
vi.mock('./ui/AnimatedBackground', () => ({
    AnimatedBackground: () => <div data-testid="animated-background">AnimatedBackground</div>,
}));

vi.mock('./ui/OrdersEmpty', () => ({
    OrdersEmpty: () => <div data-testid="orders-empty">No orders yet</div>,
}));

vi.mock('./ui/OrdersError', () => ({
    OrdersError: ({ error, onRetry }: { error: string; onRetry: () => void }) => (
        <div data-testid="orders-error">
            <span>{error}</span>
            <button onClick={onRetry}>Try Again</button>
        </div>
    ),
}));

vi.mock('./ui/OrdersHeader', () => ({
    OrdersHeader: ({ ordersCount }: { ordersCount: number }) => (
        <div data-testid="orders-header">Orders: {ordersCount}</div>
    ),
}));

vi.mock('./ui/OrdersList', () => ({
    OrdersList: ({ orders }: { orders: any[] }) => (
        <div data-testid="orders-list">
            {orders.map((order) => (
                <div key={order.orderId} data-testid="order-item">
                    {order.productName}
                </div>
            ))}
        </div>
    ),
}));

vi.mock('./ui/OrdersLoading', () => ({
    OrdersLoading: () => <div data-testid="orders-loading">Loading orders...</div>,
}));

// Mock the orderApi
vi.mock('@/entities/order/api/orderApi', () => ({
    orderApi: {
        fetchOrders: vi.fn(),
        addOrder: vi.fn(),
    },
}));

// Mock the productApi
vi.mock('@/entities/product/api/productApi', () => ({
    productApi: {
        getProductById: vi.fn(),
    },
}));

import { orderApi } from '@/entities/order/api/orderApi';
import { productApi } from '@/entities/product/api/productApi';

describe('OrdersPage', () => {
    const mockOrders = [
        {
            orderId: 'order-1',
            createdAt: '2025-01-15T10:00:00Z',
            updatedAt: '2025-01-15T10:00:00Z',
            status: 'NEW' as const,
            origin: 'INTERNAL' as const,
            items: [
                {
                    orderItemId: 'item-1',
                    productId: 'product-1',
                    quantity: 1,
                },
            ],
        },
        {
            orderId: 'order-2',
            createdAt: '2025-01-16T11:00:00Z',
            updatedAt: '2025-01-16T11:00:00Z',
            status: 'COMPLETED' as const,
            origin: 'INTERNAL' as const,
            items: [
                {
                    orderItemId: 'item-2',
                    productId: 'product-2',
                    quantity: 2,
                },
            ],
        },
    ];

    const mockProduct1 = {
        id: 'product-1',
        name: 'Laptop',
        price: 999.99,
        description: 'High-performance laptop',
        imageUrl: 'laptop.jpg',
    };

    const mockProduct2 = {
        id: 'product-2',
        name: 'Mouse',
        price: 29.99,
        description: 'Wireless mouse',
        imageUrl: 'mouse.jpg',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithProviders = (component: React.ReactElement) => {
        return render(
            <MemoryRouter>
                <OrderProvider>{component}</OrderProvider>
            </MemoryRouter>
        );
    };

    it('renders the page with animated background', () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue([]);

        renderWithProviders(<OrdersPage />);

        expect(screen.getByTestId('animated-background')).toBeInTheDocument();
    });

    it('renders the orders header with orders count', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
        vi.mocked(productApi.getProductById).mockImplementation((id) => {
            if (id === 'product-1') return Promise.resolve(mockProduct1);
            if (id === 'product-2') return Promise.resolve(mockProduct2);
            return Promise.reject(new Error('Product not found'));
        });

        renderWithProviders(<OrdersPage />);

        await waitFor(() => {
            expect(screen.getByTestId('orders-header')).toBeInTheDocument();
            expect(screen.getByText('Orders: 2')).toBeInTheDocument();
        });
    });

    it('displays loading state initially', () => {
        vi.mocked(orderApi.fetchOrders).mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );

        renderWithProviders(<OrdersPage />);

        expect(screen.getByTestId('orders-loading')).toBeInTheDocument();
        expect(screen.getByText('Loading orders...')).toBeInTheDocument();
    });

    it('displays empty state when no orders exist', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue([]);

        renderWithProviders(<OrdersPage />);

        await waitFor(() => {
            expect(screen.getByTestId('orders-empty')).toBeInTheDocument();
            expect(screen.getByText('No orders yet')).toBeInTheDocument();
        });
    });

    it('displays error state when fetch fails', async () => {
        vi.mocked(orderApi.fetchOrders).mockRejectedValue(
            new Error('Failed to fetch orders')
        );

        renderWithProviders(<OrdersPage />);

        await waitFor(() => {
            expect(screen.getByTestId('orders-error')).toBeInTheDocument();
            expect(screen.getByText('Failed to fetch orders')).toBeInTheDocument();
        });
    });

    it('displays orders list when orders are successfully fetched', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
        vi.mocked(productApi.getProductById).mockImplementation((id) => {
            if (id === 'product-1') return Promise.resolve(mockProduct1);
            if (id === 'product-2') return Promise.resolve(mockProduct2);
            return Promise.reject(new Error('Product not found'));
        });

        renderWithProviders(<OrdersPage />);

        await waitFor(() => {
            expect(screen.getByTestId('orders-list')).toBeInTheDocument();
            expect(screen.getByText('Laptop')).toBeInTheDocument();
            expect(screen.getByText('Mouse')).toBeInTheDocument();
        });
    });

    it('fetches orders on component mount', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue([]);

        renderWithProviders(<OrdersPage />);

        await waitFor(() => {
            expect(orderApi.fetchOrders).toHaveBeenCalledTimes(1);
            expect(orderApi.fetchOrders).toHaveBeenCalledWith(false);
        });
    });

    it('calls fetchOrders when retry button is clicked in error state', async () => {
        vi.mocked(orderApi.fetchOrders)
            .mockRejectedValueOnce(new Error('Network error'))
            .mockResolvedValueOnce([]);

        renderWithProviders(<OrdersPage />);

        await waitFor(() => {
            expect(screen.getByTestId('orders-error')).toBeInTheDocument();
        });

        const retryButton = screen.getByText('Try Again');
        retryButton.click();

        await waitFor(() => {
            expect(orderApi.fetchOrders).toHaveBeenCalledTimes(2);
            expect(screen.getByTestId('orders-empty')).toBeInTheDocument();
        });
    });

    it('renders the correct layout structure', () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue([]);

        const { container } = renderWithProviders(<OrdersPage />);

        // Check for main layout structure
        const mainContainer = container.querySelector('.relative.min-h-screen');
        expect(mainContainer).toBeInTheDocument();

        const contentContainer = container.querySelector('.max-w-7xl');
        expect(contentContainer).toBeInTheDocument();
    });

    it('shows header with 0 orders count when loading', () => {
        vi.mocked(orderApi.fetchOrders).mockImplementation(
            () => new Promise(() => {}) // Never resolves
        );

        renderWithProviders(<OrdersPage />);

        expect(screen.getByText('Orders: 0')).toBeInTheDocument();
    });

    it('updates orders count after successful fetch', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
        vi.mocked(productApi.getProductById).mockImplementation((id) => {
            if (id === 'product-1') return Promise.resolve(mockProduct1);
            if (id === 'product-2') return Promise.resolve(mockProduct2);
            return Promise.reject(new Error('Product not found'));
        });

        renderWithProviders(<OrdersPage />);

        // Initially shows 0
        expect(screen.getByText('Orders: 0')).toBeInTheDocument();

        // After fetch, shows 2
        await waitFor(() => {
            expect(screen.getByText('Orders: 2')).toBeInTheDocument();
        });
    });

    it('handles multiple order items correctly', async () => {
        const manyOrders = Array.from({ length: 5 }, (_, i) => ({
            orderId: `order-${i}`,
            createdAt: `2025-01-${i + 10}T10:00:00Z`,
            updatedAt: `2025-01-${i + 10}T10:00:00Z`,
            status: 'NEW' as const,
            origin: 'INTERNAL' as const,
            items: [
                {
                    orderItemId: `item-${i}`,
                    productId: `product-${i}`,
                    quantity: 1,
                },
            ],
        }));

        vi.mocked(orderApi.fetchOrders).mockResolvedValue(manyOrders);
        vi.mocked(productApi.getProductById).mockImplementation((id) =>
            Promise.resolve({
                id,
                name: `Product ${id}`,
                price: 100,
                description: 'Test product',
                imageUrl: 'test.jpg',
            })
        );

        renderWithProviders(<OrdersPage />);

        await waitFor(() => {
            expect(screen.getByText('Orders: 5')).toBeInTheDocument();
            const orderItems = screen.getAllByTestId('order-item');
            expect(orderItems).toHaveLength(5);
        });
    });

    it('renders orders with correct priority order', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
        vi.mocked(productApi.getProductById).mockImplementation((id) => {
            if (id === 'product-1') return Promise.resolve(mockProduct1);
            if (id === 'product-2') return Promise.resolve(mockProduct2);
            return Promise.reject(new Error('Product not found'));
        });

        renderWithProviders(<OrdersPage />);

        await waitFor(() => {
            // OrdersList should be displayed (not loading, error, or empty)
            expect(screen.queryByTestId('orders-loading')).not.toBeInTheDocument();
            expect(screen.queryByTestId('orders-error')).not.toBeInTheDocument();
            expect(screen.queryByTestId('orders-empty')).not.toBeInTheDocument();
            expect(screen.getByTestId('orders-list')).toBeInTheDocument();
        });
    });

    it('maintains header visibility across all states', async () => {
        // Test with loading state
        vi.mocked(orderApi.fetchOrders).mockImplementation(
            () => new Promise(() => {})
        );
        const { unmount } = renderWithProviders(<OrdersPage />);
        expect(screen.getByTestId('orders-header')).toBeInTheDocument();
        unmount();

        // Test with error state
        vi.mocked(orderApi.fetchOrders).mockRejectedValue(new Error('Error'));
        const { unmount: unmount2 } = renderWithProviders(<OrdersPage />);
        await waitFor(() => {
            expect(screen.getByTestId('orders-header')).toBeInTheDocument();
        });
        unmount2();

        // Test with empty state
        vi.mocked(orderApi.fetchOrders).mockResolvedValue([]);
        const { unmount: unmount3 } = renderWithProviders(<OrdersPage />);
        await waitFor(() => {
            expect(screen.getByTestId('orders-header')).toBeInTheDocument();
        });
        unmount3();

        // Test with orders
        vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
        vi.mocked(productApi.getProductById).mockImplementation((id) => {
            if (id === 'product-1') return Promise.resolve(mockProduct1);
            if (id === 'product-2') return Promise.resolve(mockProduct2);
            return Promise.reject(new Error('Product not found'));
        });
        renderWithProviders(<OrdersPage />);
        await waitFor(() => {
            expect(screen.getByTestId('orders-header')).toBeInTheDocument();
        });
    });
});
