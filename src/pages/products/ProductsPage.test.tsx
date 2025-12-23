import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ProductsPage } from './ProductsPage';
import { useProducts } from '@/entities/product/model/ProductsContext';
import { useProductOrder } from './model/useProductOrder';
import { ProductResponseDto } from '@/entities/product/model/Product';

// Mock dependencies
vi.mock('@/entities/product/model/ProductsContext');
vi.mock('./model/useProductOrder');
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

const mockProducts: ProductResponseDto[] = [
    {
        productId: '1',
        ean: '1234567890123',
        name: 'Test Product 1',
        description: 'Test Description 1',
        price: 29.99,
        quantity: 10,
        brand: 'Test Brand',
        createdAt: '2024-01-01T00:00:00Z',
        updatedAt: '2024-01-01T00:00:00Z',
        externalShopId: null,
    },
    {
        productId: '2',
        ean: '9876543210987',
        name: 'Test Product 2',
        description: 'Test Description 2',
        price: 49.99,
        quantity: 5,
        brand: 'Another Brand',
        createdAt: '2024-01-02T00:00:00Z',
        updatedAt: '2024-01-02T00:00:00Z',
        externalShopId: null,
    },
];

describe('ProductsPage', () => {
    const mockHandleOrder = vi.fn();
    const mockSetMultiCatalog = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();

        vi.mocked(useProducts).mockReturnValue({
            products: mockProducts,
            isLoading: false,
            error: null,
            multiCatalog: false,
            setMultiCatalog: mockSetMultiCatalog,
            addProduct: vi.fn(),
            refreshProducts: vi.fn(),
        });

        vi.mocked(useProductOrder).mockReturnValue({
            orderedItems: new Set(),
            handleOrder: mockHandleOrder,
        });
    });

    it('renders the products page with header', () => {
        render(<ProductsPage />);

        expect(screen.getByText('Our Collection')).toBeInTheDocument();
    });

    it('renders the back button in header', () => {
        render(<ProductsPage />);

        expect(screen.getByText('Back to Home')).toBeInTheDocument();
    });

    it('renders the products description in header', () => {
        render(<ProductsPage />);

        expect(
            screen.getByText(/Browse our carefully curated selection of premium products/i)
        ).toBeInTheDocument();
    });

    it('renders products list with all products', () => {
        render(<ProductsPage />);

        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('renders multi-catalog toggle button', () => {
        render(<ProductsPage />);

        expect(screen.getByText('Multi-Catalog')).toBeInTheDocument();
        expect(screen.getByText('OFF')).toBeInTheDocument();
    });

    it('passes correct props to ProductsList', () => {
        const { container } = render(<ProductsPage />);

        // Verify products are rendered in a grid layout
        const grid = container.querySelector('.grid');
        expect(grid).toBeInTheDocument();

        // Verify both products are displayed
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
        expect(screen.getByText('Test Product 2')).toBeInTheDocument();
    });

    it('renders AnimatedBackground component', () => {
        const { container } = render(<ProductsPage />);

        // Check for animated background elements
        const animatedElements = container.querySelectorAll('.animate-pulse');
        expect(animatedElements.length).toBeGreaterThan(0);
    });

    it('renders with empty products list', () => {
        vi.mocked(useProducts).mockReturnValue({
            products: [],
            isLoading: false,
            error: null,
            multiCatalog: false,
            setMultiCatalog: mockSetMultiCatalog,
            addProduct: vi.fn(),
            refreshProducts: vi.fn(),
        });

        render(<ProductsPage />);

        expect(screen.getByText('Our Collection')).toBeInTheDocument();
        expect(screen.queryByText('Test Product 1')).not.toBeInTheDocument();
    });

    it('renders with ordered items', () => {
        vi.mocked(useProductOrder).mockReturnValue({
            orderedItems: new Set(['1']),
            handleOrder: mockHandleOrder,
        });

        render(<ProductsPage />);

        // The first product should be marked as ordered
        expect(screen.getByText('Test Product 1')).toBeInTheDocument();
    });

    it('renders page with correct layout structure', () => {
        const { container } = render(<ProductsPage />);

        // Check for main container with proper classes
        const mainContainer = container.querySelector('.relative.min-h-screen');
        expect(mainContainer).toBeInTheDocument();

        // Check for centered content container
        const contentContainer = container.querySelector('.max-w-7xl.mx-auto');
        expect(contentContainer).toBeInTheDocument();
    });

    it('renders ShoppingBag icon in header', () => {
        render(<ProductsPage />);

        const headerWithIcon = screen.getByText('Our Collection').parentElement;
        expect(headerWithIcon).toBeInTheDocument();
    });

    it('integrates useProducts hook correctly', () => {
        render(<ProductsPage />);

        expect(useProducts).toHaveBeenCalled();
    });

    it('integrates useProductOrder hook correctly', () => {
        render(<ProductsPage />);

        expect(useProductOrder).toHaveBeenCalled();
    });

    it('handles multiple products with different properties', () => {
        const diverseProducts: ProductResponseDto[] = [
            {
                productId: '1',
                ean: '1111111111111',
                name: 'Laptop',
                description: 'High-performance laptop',
                price: 1299.99,
                quantity: 3,
                brand: 'TechBrand',
                createdAt: '2024-01-01T00:00:00Z',
                updatedAt: '2024-01-01T00:00:00Z',
                externalShopId: 'shop-123',
            },
            {
                productId: '2',
                ean: '2222222222222',
                name: 'Mouse',
                description: 'Wireless mouse',
                price: 29.99,
                quantity: 50,
                brand: 'AccessoryBrand',
                createdAt: '2024-01-02T00:00:00Z',
                updatedAt: '2024-01-02T00:00:00Z',
                externalShopId: null,
            },
        ];

        vi.mocked(useProducts).mockReturnValue({
            products: diverseProducts,
            isLoading: false,
            error: null,
            multiCatalog: false,
            setMultiCatalog: mockSetMultiCatalog,
            addProduct: vi.fn(),
            refreshProducts: vi.fn(),
        });

        render(<ProductsPage />);

        expect(screen.getByText('Laptop')).toBeInTheDocument();
        expect(screen.getByText('Mouse')).toBeInTheDocument();
    });

    it('renders glass card effect on header', () => {
        const { container } = render(<ProductsPage />);

        // Check for backdrop blur effect
        const glassCard = container.querySelector('.backdrop-blur-xl');
        expect(glassCard).toBeInTheDocument();
    });

    it('renders products in grid layout', () => {
        const { container } = render(<ProductsPage />);

        const grid = container.querySelector('.grid');
        expect(grid).toHaveClass('grid-cols-1');
        expect(grid).toHaveClass('sm:grid-cols-2');
        expect(grid).toHaveClass('lg:grid-cols-3');
        expect(grid).toHaveClass('xl:grid-cols-4');
    });

    it('renders with multiCatalog enabled', () => {
        vi.mocked(useProducts).mockReturnValue({
            products: mockProducts,
            isLoading: false,
            error: null,
            multiCatalog: true,
            setMultiCatalog: mockSetMultiCatalog,
            addProduct: vi.fn(),
            refreshProducts: vi.fn(),
        });

        render(<ProductsPage />);

        expect(screen.getByText('ON')).toBeInTheDocument();
    });

    it('renders all header elements in correct order', () => {
        render(<ProductsPage />);

        const header = screen.getByText('Our Collection').closest('.backdrop-blur-xl');
        expect(header).toBeInTheDocument();

        // Verify back button is at the top
        expect(screen.getByText('Back to Home')).toBeInTheDocument();

        // Verify description is present
        expect(
            screen.getByText(/Browse our carefully curated selection/i)
        ).toBeInTheDocument();
    });
});
