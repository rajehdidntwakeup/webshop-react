import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { OrdersPage } from './OrdersPage';
import { OrderProvider } from '@/entities/order/model/OrderContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

// Mock the APIs
vi.mock('@/entities/order/api/orderApi', () => ({
    orderApi: {
        fetchOrders: vi.fn(),
        addOrder: vi.fn(),
    },
}));

vi.mock('@/entities/product/api/productApi', () => ({
    productApi: {
        getProductById: vi.fn(),
    },
}));

import { orderApi } from '@/entities/order/api/orderApi';
import { productApi } from '@/entities/product/api/productApi';

describe('OrdersPage Integration', () => {
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
        name: 'Gaming Laptop',
        price: 1299.99,
        description: 'High-performance gaming laptop',
        imageUrl: 'laptop.jpg',
    };

    const mockProduct2 = {
        id: 'product-2',
        name: 'Wireless Mouse',
        price: 49.99,
        description: 'Ergonomic wireless mouse',
        imageUrl: 'mouse.jpg',
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithRouter = (initialRoute = '/orders') => {
        return render(
            <MemoryRouter initialEntries={[initialRoute]}>
                <OrderProvider>
                    <Routes>
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/" element={<div>Home Page</div>} />
                        <Route path="/products" element={<div>Products Page</div>} />
                    </Routes>
                </OrderProvider>
            </MemoryRouter>
        );
    };

    it('integrates with OrderProvider and fetches orders on mount', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
        vi.mocked(productApi.getProductById).mockImplementation((id) => {
            if (id === 'product-1') return Promise.resolve(mockProduct1);
            if (id === 'product-2') return Promise.resolve(mockProduct2);
            return Promise.reject(new Error('Product not found'));
        });

        renderWithRouter();

        // Verify loading state appears first
        expect(screen.getByText('Loading orders...')).toBeInTheDocument();

        // Wait for orders to load
        await waitFor(() => {
            expect(orderApi.fetchOrders).toHaveBeenCalledTimes(1);
            expect(productApi.getProductById).toHaveBeenCalledWith('product-1');
            expect(productApi.getProductById).toHaveBeenCalledWith('product-2');
        });

        // Verify orders are displayed
        await waitFor(() => {
            expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
            expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
        });
    });

    it('handles navigation from empty state to products page', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue([]);

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText('No orders yet')).toBeInTheDocument();
        });

        const browseButton = screen.getByText('Browse Products');
        fireEvent.click(browseButton);

        await waitFor(() => {
            expect(screen.getByText('Products Page')).toBeInTheDocument();
        });
    });

    it('handles navigation back to home from header', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue([]);

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText('No orders yet')).toBeInTheDocument();
        });

        const backButton = screen.getByText('Back to Home');
        fireEvent.click(backButton);

        await waitFor(() => {
            expect(screen.getByText('Home Page')).toBeInTheDocument();
        });
    });

    it('recovers from error state after retry', async () => {
        // First call fails, second succeeds
        vi.mocked(orderApi.fetchOrders)
            .mockRejectedValueOnce(new Error('Network error'))
            .mockResolvedValueOnce(mockOrders);

        vi.mocked(productApi.getProductById).mockImplementation((id) => {
            if (id === 'product-1') return Promise.resolve(mockProduct1);
            if (id === 'product-2') return Promise.resolve(mockProduct2);
            return Promise.reject(new Error('Product not found'));
        });

        renderWithRouter();

        // Wait for error state
        await waitFor(() => {
            expect(screen.getByText('Failed to load orders')).toBeInTheDocument();
            expect(screen.getByText('Network error')).toBeInTheDocument();
        });

        // Click retry button
        const retryButton = screen.getByText('Try Again');
        fireEvent.click(retryButton);

        // Wait for successful state
        await waitFor(() => {
            expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
            expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
        });

        expect(orderApi.fetchOrders).toHaveBeenCalledTimes(2);
    });

    it('displays correct order details including price and status', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
        vi.mocked(productApi.getProductById).mockImplementation((id) => {
            if (id === 'product-1') return Promise.resolve(mockProduct1);
            if (id === 'product-2') return Promise.resolve(mockProduct2);
            return Promise.reject(new Error('Product not found'));
        });

        renderWithRouter();

        await waitFor(() => {
            // Verify product names
            expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
            expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();

            // Verify prices
            expect(screen.getByText('1299.99 €')).toBeInTheDocument();
            expect(screen.getByText('49.99 €')).toBeInTheDocument();

            // Verify statuses
            expect(screen.getByText('NEW')).toBeInTheDocument();
            expect(screen.getByText('COMPLETED')).toBeInTheDocument();
        });
    });

    it('handles product fetch errors gracefully', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
        vi.mocked(productApi.getProductById).mockRejectedValue(
            new Error('Product not found')
        );

        renderWithRouter();

        await waitFor(() => {
            // Should display error message for failed product fetches (multiple orders)
            const errorMessages = screen.getAllByText('Error loading product');
            expect(errorMessages.length).toBeGreaterThan(0);
        });
    });

    it('handles orders without product IDs', async () => {
        const orderWithoutProduct = {
            orderId: 'order-3',
            createdAt: '2025-01-17T12:00:00Z',
            updatedAt: '2025-01-17T12:00:00Z',
            status: 'NEW' as const,
            origin: 'INTERNAL' as const,
            items: [],
        };

        vi.mocked(orderApi.fetchOrders).mockResolvedValue([orderWithoutProduct]);

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText('Unknown Product')).toBeInTheDocument();
            expect(screen.getByText('0 €')).toBeInTheDocument();
        });
    });

    it('maintains state across route changes', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
        vi.mocked(productApi.getProductById).mockImplementation((id) => {
            if (id === 'product-1') return Promise.resolve(mockProduct1);
            if (id === 'product-2') return Promise.resolve(mockProduct2);
            return Promise.reject(new Error('Product not found'));
        });

        const { unmount } = renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
        });

        // Navigate away
        const backButton = screen.getByText('Back to Home');
        fireEvent.click(backButton);

        await waitFor(() => {
            expect(screen.getByText('Home Page')).toBeInTheDocument();
        });

        unmount();

        // Navigate back to orders
        renderWithRouter();

        // Should fetch again (new mount)
        await waitFor(() => {
            expect(orderApi.fetchOrders).toHaveBeenCalled();
        });
    });

    it('displays order count in header dynamically', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
        vi.mocked(productApi.getProductById).mockImplementation((id) => {
            if (id === 'product-1') return Promise.resolve(mockProduct1);
            if (id === 'product-2') return Promise.resolve(mockProduct2);
            return Promise.reject(new Error('Product not found'));
        });

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText(/Total orders: 2/)).toBeInTheDocument();
        });
    });

    it('handles rapid navigation clicks without breaking', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue([]);

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText('No orders yet')).toBeInTheDocument();
        });

        // Rapid clicks on back button
        const backButton = screen.getByText('Back to Home');
        fireEvent.click(backButton);
        fireEvent.click(backButton);
        fireEvent.click(backButton);

        // Should navigate to home
        await waitFor(() => {
            expect(screen.getByText('Home Page')).toBeInTheDocument();
        });
    });

    it('renders all order details correctly', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
        vi.mocked(productApi.getProductById).mockImplementation((id) => {
            if (id === 'product-1') return Promise.resolve(mockProduct1);
            if (id === 'product-2') return Promise.resolve(mockProduct2);
            return Promise.reject(new Error('Product not found'));
        });

        renderWithRouter();

        await waitFor(() => {
            // Verify order IDs
            expect(screen.getByText('#order-1')).toBeInTheDocument();
            expect(screen.getByText('#order-2')).toBeInTheDocument();

            // Verify timestamps are displayed
            expect(screen.getByText('2025-01-15T10:00:00Z')).toBeInTheDocument();
            expect(screen.getByText('2025-01-16T11:00:00Z')).toBeInTheDocument();
        });
    });

    it('displays animated background in all states', async () => {
        const { container, unmount } = renderWithRouter();

        // Check in loading state - animated background uses absolute positioning
        expect(
            container.querySelector('.absolute.inset-0')
        ).toBeInTheDocument();

        vi.mocked(orderApi.fetchOrders).mockResolvedValue([]);

        // Check in empty state
        await waitFor(() => {
            expect(
                container.querySelector('.absolute.inset-0')
            ).toBeInTheDocument();
        });

        unmount();

        // Check in error state
        vi.mocked(orderApi.fetchOrders).mockRejectedValue(new Error('Error'));
        const { container: container2 } = renderWithRouter();

        await waitFor(() => {
            expect(
                container2.querySelector('.absolute.inset-0')
            ).toBeInTheDocument();
        });
    });

    it('handles concurrent API calls efficiently with caching', async () => {
        const duplicateProductOrders = [
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
                        productId: 'product-1', // Same product
                        quantity: 2,
                    },
                ],
            },
        ];

        vi.mocked(orderApi.fetchOrders).mockResolvedValue(duplicateProductOrders);
        vi.mocked(productApi.getProductById).mockResolvedValue(mockProduct1);

        renderWithRouter();

        await waitFor(() => {
            expect(screen.getAllByText('Gaming Laptop')).toHaveLength(2);
        });

        // Product API should only be called once due to caching
        expect(productApi.getProductById).toHaveBeenCalledTimes(1);
    });

    it('displays layout and styling correctly', async () => {
        vi.mocked(orderApi.fetchOrders).mockResolvedValue(mockOrders);
        vi.mocked(productApi.getProductById).mockImplementation((id) => {
            if (id === 'product-1') return Promise.resolve(mockProduct1);
            if (id === 'product-2') return Promise.resolve(mockProduct2);
            return Promise.reject(new Error('Product not found'));
        });

        const { container } = renderWithRouter();

        await waitFor(() => {
            expect(screen.getByText('Gaming Laptop')).toBeInTheDocument();
        });

        // Check for glass morphism effects
        const glassElements = container.querySelectorAll('.backdrop-blur-xl');
        expect(glassElements.length).toBeGreaterThan(0);

        // Check for responsive layout
        const mainContainer = container.querySelector('.min-h-screen');
        expect(mainContainer).toBeInTheDocument();

        const contentContainer = container.querySelector('.max-w-7xl');
        expect(contentContainer).toBeInTheDocument();
    });
});
