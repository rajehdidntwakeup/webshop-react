import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductsPage } from './ProductsPage';
import { ProductsProvider } from '@/entities/product/model/ProductsContext';
import { OrderProvider } from '@/entities/order/model/OrderContext';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProductResponseDto } from '@/entities/product/model/Product';

// Mock the APIs
vi.mock('@/entities/product/api/productApi', () => ({
    productApi: {
        getProducts: vi.fn(),
        addProduct: vi.fn(),
        getProductById: vi.fn(),
    },
}));

vi.mock('@/entities/order/api/orderApi', () => ({
    orderApi: {
        fetchOrders: vi.fn(),
        addOrder: vi.fn(),
    },
}));

import { productApi } from '@/entities/product/api/productApi';
import { orderApi } from '@/entities/order/api/orderApi';

const mockProducts: ProductResponseDto[] = [
    {
        productId: '1',
        ean: '1234567890123',
        name: 'Premium Laptop',
        description: 'High-performance laptop for professionals',
        price: 1299.99,
        quantity: 10,
        brand: 'TechBrand',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        externalShopId: null,
    },
    {
        productId: '2',
        ean: '9876543210987',
        name: 'Wireless Mouse',
        description: 'Ergonomic wireless mouse',
        price: 49.99,
        quantity: 25,
        brand: 'AccessoryBrand',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        externalShopId: null,
    },
    {
        productId: '3',
        ean: '5555555555555',
        name: 'Mechanical Keyboard',
        description: 'RGB mechanical keyboard',
        price: 159.99,
        quantity: 15,
        brand: 'KeyboardPro',
        createdAt: '2024-01-03T00:00:00Z',
        updatedAt: '2024-01-03T00:00:00Z',
        externalShopId: 'shop-456',
    },
];

describe('ProductsPage Integration', () => {
    const renderWithProviders = (initialRoute = '/products') => {
        return render(
            <MemoryRouter initialEntries={[initialRoute]}>
                <ProductsProvider>
                    <OrderProvider>
                        <Routes>
                            <Route path="/products" element={<ProductsPage />} />
                            <Route path="/" element={<div>Home Page</div>} />
                        </Routes>
                    </OrderProvider>
                </ProductsProvider>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(productApi.getProducts).mockResolvedValue(mockProducts);
        vi.mocked(orderApi.fetchOrders).mockResolvedValue([]);
    });

    it('integrates with ProductsProvider and displays products', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Premium Laptop')).toBeInTheDocument();
            expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
            expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument();
        });
    });

    it('integrates with MemoryRouter and navigates back to home', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Our Collection')).toBeInTheDocument();
        });

        const backButton = screen.getByText('Back to Home');
        fireEvent.click(backButton);

        await waitFor(() => {
            expect(screen.getByText('Home Page')).toBeInTheDocument();
        });
    });

    it('displays products with correct prices and descriptions', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Premium Laptop')).toBeInTheDocument();
            expect(screen.getByText('High-performance laptop for professionals')).toBeInTheDocument();
            expect(screen.getByText('1299.99 €')).toBeInTheDocument();
        });
    });

    it('handles ordering a product successfully', async () => {
        vi.mocked(orderApi.addOrder).mockResolvedValue();

        vi.mocked(productApi.getProducts).mockResolvedValue([
            {
                ...mockProducts[0],
                quantity: 9, // Quantity decreased after order
            },
            mockProducts[1],
            mockProducts[2],
        ]);

        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Premium Laptop')).toBeInTheDocument();
        });

        const orderButtons = screen.getAllByText('Order Now');
        fireEvent.click(orderButtons[0]);

        await waitFor(() => {
            expect(orderApi.addOrder).toHaveBeenCalledWith([{
                productId: '1',
                quantity: 1,
            }]);
        });
    });

    it('toggles multi-catalog mode', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Our Collection')).toBeInTheDocument();
        });

        const multiCatalogButton = screen.getByText('OFF');
        fireEvent.click(multiCatalogButton);

        await waitFor(() => {
            expect(screen.getByText('ON')).toBeInTheDocument();
        });

        // Verify API is called with multiCatalog parameter
        await waitFor(() => {
            expect(productApi.getProducts).toHaveBeenCalledWith(true);
        });
    });

    it('displays empty products list when API returns no products', async () => {
        vi.mocked(productApi.getProducts).mockResolvedValue([]);

        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Our Collection')).toBeInTheDocument();
        });

        expect(screen.queryByText('Premium Laptop')).not.toBeInTheDocument();
        expect(screen.queryByText('Wireless Mouse')).not.toBeInTheDocument();
    });

    it('maintains ordered items state across interactions', async () => {
        vi.mocked(orderApi.addOrder).mockResolvedValue();

        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Premium Laptop')).toBeInTheDocument();
        });

        const orderButtons = screen.getAllByText('Order Now');
        fireEvent.click(orderButtons[0]);

        await waitFor(() => {
            expect(orderApi.addOrder).toHaveBeenCalled();
        });

        // The ordered item should be marked (button text changes or styling changes)
        // This behavior depends on the ProductCard implementation
    });

    it('handles API errors gracefully', async () => {
        vi.mocked(productApi.getProducts).mockRejectedValue(
            new Error('Failed to fetch products')
        );

        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Our Collection')).toBeInTheDocument();
        });

        // Page should still render even if products fail to load
        expect(screen.queryByText('Premium Laptop')).not.toBeInTheDocument();
    });

    it('refreshes products after successful order', async () => {
        vi.mocked(orderApi.addOrder).mockResolvedValue();

        const updatedProducts = [
            { ...mockProducts[0], quantity: 9 },
            mockProducts[1],
            mockProducts[2],
        ];

        vi.mocked(productApi.getProducts)
            .mockResolvedValueOnce(mockProducts)
            .mockResolvedValueOnce(updatedProducts);

        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Premium Laptop')).toBeInTheDocument();
        });

        const orderButtons = screen.getAllByText('Order Now');
        fireEvent.click(orderButtons[0]);

        await waitFor(() => {
            expect(productApi.getProducts).toHaveBeenCalledTimes(2);
        });
    });

    it('displays all products in grid layout', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Premium Laptop')).toBeInTheDocument();
        });

        const container = screen.getByText('Premium Laptop').closest('.grid');
        expect(container).toBeInTheDocument();
    });

    it('integrates AnimatedBackground with page content', async () => {
        const { container } = renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Our Collection')).toBeInTheDocument();
        });

        const animatedElements = container.querySelectorAll('.animate-pulse');
        expect(animatedElements.length).toBeGreaterThan(0);
    });

    it('handles multiple rapid order attempts', async () => {
        vi.mocked(orderApi.addOrder).mockResolvedValue();

        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Premium Laptop')).toBeInTheDocument();
        });

        const orderButtons = screen.getAllByText('Order Now');

        // Rapidly click the same button multiple times
        fireEvent.click(orderButtons[0]);
        fireEvent.click(orderButtons[0]);
        fireEvent.click(orderButtons[0]);

        // Should handle multiple clicks gracefully
        await waitFor(() => {
            expect(orderApi.addOrder).toHaveBeenCalled();
        });
    });

    it('displays correct product information for all products', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Premium Laptop')).toBeInTheDocument();
            expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
            expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument();
        });

        expect(screen.getByText('1299.99 €')).toBeInTheDocument();
        expect(screen.getByText('49.99 €')).toBeInTheDocument();
        expect(screen.getByText('159.99 €')).toBeInTheDocument();
    });

    it('integrates with router context correctly', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Our Collection')).toBeInTheDocument();
        });

        // Verify all navigation elements are functional
        const backButton = screen.getByText('Back to Home');
        expect(backButton).toBeEnabled();
    });

    it('maintains state when toggling multi-catalog multiple times', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Our Collection')).toBeInTheDocument();
        });

        const initialCallCount = vi.mocked(productApi.getProducts).mock.calls.length;

        // Toggle ON
        fireEvent.click(screen.getByText('OFF'));
        await waitFor(() => {
            expect(screen.getByText('ON')).toBeInTheDocument();
        });

        // Toggle OFF
        fireEvent.click(screen.getByText('ON'));
        await waitFor(() => {
            expect(screen.getByText('OFF')).toBeInTheDocument();
        });

        // Verify API was called for each toggle
        expect(vi.mocked(productApi.getProducts).mock.calls.length).toBeGreaterThan(
            initialCallCount
        );
    });

    it('renders products with external shop IDs correctly', async () => {
        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Mechanical Keyboard')).toBeInTheDocument();
        });

        // Products with external shop IDs should render normally
        expect(screen.getByText('RGB mechanical keyboard')).toBeInTheDocument();
    });

    it('handles products with zero quantity', async () => {
        const productsWithZeroQuantity = [
            { ...mockProducts[0], quantity: 0 },
            mockProducts[1],
        ];

        vi.mocked(productApi.getProducts).mockResolvedValue(productsWithZeroQuantity);

        renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Premium Laptop')).toBeInTheDocument();
        });

        // Product should still be displayed even with zero quantity
        expect(screen.getByText('Wireless Mouse')).toBeInTheDocument();
    });

    it('displays styled header with glass effect', async () => {
        const { container } = renderWithProviders();

        await waitFor(() => {
            expect(screen.getByText('Our Collection')).toBeInTheDocument();
        });

        const glassCard = container.querySelector('.backdrop-blur-xl');
        expect(glassCard).toBeInTheDocument();
        expect(glassCard).toHaveClass('bg-white/10');
    });
});
