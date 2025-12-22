import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { ProductsPage } from './ProductsPage';
import { ProductsProvider } from '@/entities/product/model/ProductsContext';
import { OrderProvider } from '@/entities/order/model/OrderContext';
import { productApi } from '@/entities/product/api/productApi';
import { orderApi } from '@/entities/order/api/orderApi';
import { Toaster } from 'sonner';

// Mock the APIs
vi.mock('@/entities/product/api/productApi', () => ({
    productApi: {
        getProducts: vi.fn(),
        addProduct: vi.fn(),
    },
}));

vi.mock('@/entities/order/api/orderApi', () => ({
    orderApi: {
        fetchOrders: vi.fn(),
        addOrder: vi.fn(),
    },
}));

// Mock AnimatedBackground as it might have complex animations or dependencies
vi.mock('@/pages/orders/ui/AnimatedBackground', () => ({
    AnimatedBackground: () => <div data-testid="animated-background" />,
}));

describe('ProductsPage Integration Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    const renderWithProviders = (ui: React.ReactElement) => {
        return render(
            <MemoryRouter>
                <ProductsProvider>
                    <OrderProvider>
                        {ui}
                    </OrderProvider>
                </ProductsProvider>
                <Toaster />
            </MemoryRouter>
        );
    };

    it('fetches and displays products from the API', async () => {
        const mockProducts = [
            { id: 1, name: 'Standard Widget', description: 'A standard widget', price: 10, stock: 10 },
            { id: 2, name: 'Premium Gadget', description: 'A premium gadget', price: 50, stock: 5 },
        ];

        vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);

        renderWithProviders(<ProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Standard Widget')).toBeInTheDocument();
            expect(screen.getByText('Premium Gadget')).toBeInTheDocument();
        });

        expect(screen.getByText('10 €')).toBeInTheDocument();
        expect(screen.getByText('50 €')).toBeInTheDocument();
        expect(screen.getByText('Stock: 10')).toBeInTheDocument();
        expect(screen.getByText('Stock: 5')).toBeInTheDocument();
    });

    it('handles ordering a product successfully', async () => {
        const mockProducts = [
            { id: 1, name: 'Standard Widget', description: 'A standard widget', price: 10, stock: 10 },
        ];

        vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);
        vi.mocked(orderApi.addOrder).mockResolvedValue({} as any);
        vi.mocked(orderApi.fetchOrders).mockResolvedValue([]);

        renderWithProviders(<ProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Standard Widget')).toBeInTheDocument();
        });

        const orderButton = screen.getByRole('button', { name: /Order Now/i });
        fireEvent.click(orderButton);

        await waitFor(() => {
            expect(orderApi.addOrder).toHaveBeenCalledWith(expect.objectContaining({
                totalPrice: 10,
                status: 'CONFIRMED',
                items: [expect.objectContaining({
                    itemId: 1,
                    itemName: 'Standard Widget',
                    quantity: 1,
                    price: 10
                })]
            }));
        });

        // Check if button changes to "Ordered"
        await waitFor(() => {
            expect(screen.getByText('Ordered')).toBeInTheDocument();
        });

        // Check for success toast
        expect(screen.getByText('Standard Widget ordered successfully!')).toBeInTheDocument();
        
        // Products should have been refreshed
        expect(productApi.getProducts).toHaveBeenCalledTimes(2); // Once on mount, once after order
    });

    it('shows "Out of Stock" and disables button when stock is 0', async () => {
        const mockProducts = [
            { id: 1, name: 'Sold Out Item', description: 'No more left', price: 10, stock: 0 },
        ];

        vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);

        renderWithProviders(<ProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Sold Out Item')).toBeInTheDocument();
        });

        const stockBadge = screen.getByText('Stock: 0');
        expect(stockBadge.parentElement).toHaveClass('bg-red-500/30');

        const orderButton = screen.getByRole('button', { name: /Out of Stock/i });
        expect(orderButton).toBeDisabled();
    });

    it('handles ordering failure gracefully', async () => {
        const mockProducts = [
            { id: 1, name: 'Fail Widget', description: 'Will fail', price: 10, stock: 10 },
        ];

        vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);
        vi.mocked(orderApi.addOrder).mockRejectedValue(new Error('Order failed'));

        renderWithProviders(<ProductsPage />);

        await waitFor(() => {
            expect(screen.getByText('Fail Widget')).toBeInTheDocument();
        });

        const orderButton = screen.getByRole('button', { name: /Order Now/i });
        fireEvent.click(orderButton);

        await waitFor(() => {
            expect(screen.getByText('Failed to order Fail Widget')).toBeInTheDocument();
        });

        // Button should NOT change to "Ordered"
        expect(screen.queryByText('Ordered')).not.toBeInTheDocument();
        expect(screen.getByText('Order Now')).toBeInTheDocument();
    });
});
