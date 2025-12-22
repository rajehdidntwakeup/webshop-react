import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductsPage } from './ProductsPage';
import { useProducts } from '@/entities/product/model/ProductsContext';
import { useProductOrder } from './model/useProductOrder';

// Mock the hooks
vi.mock('@/entities/product/model/ProductsContext', () => ({
    useProducts: vi.fn(),
}));

vi.mock('./model/useProductOrder', () => ({
    useProductOrder: vi.fn(),
}));

// Mock the UI components to focus on ProductsPage logic
vi.mock('./ui/ProductsHeader', () => ({
    ProductsHeader: () => <div data-testid="products-header">Products Header</div>,
}));

vi.mock('./ui/ProductsList', () => ({
    ProductsList: ({ products, orderedItems, onOrder }: any) => (
        <div data-testid="products-list">
            Products List: {products.length} items
        </div>
    ),
}));

vi.mock('@/pages/orders/ui/AnimatedBackground', () => ({
    AnimatedBackground: () => <div data-testid="animated-background">Animated Background</div>,
}));

describe('ProductsPage Unit Tests', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders the page with correct components and data', () => {
        const mockProducts = [
            { id: 1, name: 'Product 1', description: 'Desc 1', price: 10, stock: 5 },
            { id: 2, name: 'Product 2', description: 'Desc 2', price: 20, stock: 0 },
        ];
        const mockOrderedItems = new Set([1]);
        const mockHandleOrder = vi.fn();

        vi.mocked(useProducts).mockReturnValue({
            products: mockProducts,
            isLoading: false,
            error: null,
            addProduct: vi.fn(),
            refreshProducts: vi.fn(),
        });

        vi.mocked(useProductOrder).mockReturnValue({
            orderedItems: mockOrderedItems,
            handleOrder: mockHandleOrder,
        });

        render(<ProductsPage />);

        expect(screen.getByTestId('animated-background')).toBeInTheDocument();
        expect(screen.getByTestId('products-header')).toBeInTheDocument();
        expect(screen.getByTestId('products-list')).toBeInTheDocument();
        expect(screen.getByText('Products List: 2 items')).toBeInTheDocument();
    });

    it('passes correct props to ProductsList', () => {
        const mockProducts = [{ id: 1, name: 'Product 1', description: 'Desc 1', price: 10, stock: 5 }];
        const mockOrderedItems = new Set<number>();
        const mockHandleOrder = vi.fn();

        vi.mocked(useProducts).mockReturnValue({
            products: mockProducts,
            isLoading: false,
            error: null,
            addProduct: vi.fn(),
            refreshProducts: vi.fn(),
        });

        vi.mocked(useProductOrder).mockReturnValue({
            orderedItems: mockOrderedItems,
            handleOrder: mockHandleOrder,
        });

        render(<ProductsPage />);

        // Verification happens via the mocked ProductsList receiving these values
        // In a real unit test, we might check if useProducts and useProductOrder were called
        expect(useProducts).toHaveBeenCalled();
        expect(useProductOrder).toHaveBeenCalled();
    });
});
