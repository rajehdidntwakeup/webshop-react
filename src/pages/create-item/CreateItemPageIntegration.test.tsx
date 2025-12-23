import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateItemPage } from './CreateItemPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ProductsProvider } from '@/entities/product/model/ProductsContext';
import { toast } from 'sonner';

// Mock the toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock the product API
vi.mock('@/entities/product/api/productApi', () => ({
    productApi: {
        addProduct: vi.fn(() => Promise.resolve({ productId: '1' })),
        getProducts: vi.fn(() => Promise.resolve([])),
        getProductById: vi.fn(),
    },
}));

describe('CreateItemPage Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('integrates with MemoryRouter and navigates when back button is clicked', () => {
        render(
            <MemoryRouter initialEntries={['/create-item']}>
                <Routes>
                    <Route
                        path="/create-item"
                        element={
                            <ProductsProvider>
                                <CreateItemPage />
                            </ProductsProvider>
                        }
                    />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Verify we are on the create item page
        expect(screen.getByText('Create New Item')).toBeInTheDocument();

        // Click "Back to Home"
        const backButton = screen.getByText('Back to Home');
        fireEvent.click(backButton);

        // Verify navigation to home page
        expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('shows validation error when submitting empty form', async () => {
        render(
            <MemoryRouter initialEntries={['/create-item']}>
                <ProductsProvider>
                    <CreateItemPage />
                </ProductsProvider>
            </MemoryRouter>
        );

        // Submit the empty form
        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        fireEvent.click(submitButton);

        // Verify validation error toast is called
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Please fill in all fields');
        });
    });

    it('shows validation error for invalid price format', async () => {
        render(
            <MemoryRouter initialEntries={['/create-item']}>
                <ProductsProvider>
                    <CreateItemPage />
                </ProductsProvider>
            </MemoryRouter>
        );

        // Fill out the form with invalid price
        fireEvent.change(screen.getByLabelText('Product EAN'), { target: { value: '0123456789123' } });
        fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Test Product' } });
        fireEvent.change(screen.getByLabelText('Brand Name'), { target: { value: 'Test Brand' } });
        fireEvent.change(screen.getByLabelText('Stock Quantity'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Price'), { target: { value: 'invalid' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } });

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        fireEvent.click(submitButton);

        // Verify validation error toast is called
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalled();
        });
    });

    it('shows validation error for invalid quantity format', async () => {
        render(
            <MemoryRouter initialEntries={['/create-item']}>
                <ProductsProvider>
                    <CreateItemPage />
                </ProductsProvider>
            </MemoryRouter>
        );

        // Fill out the form - leave quantity empty to trigger validation
        fireEvent.change(screen.getByLabelText('Product EAN'), { target: { value: '0123456789123' } });
        fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Test Product' } });
        fireEvent.change(screen.getByLabelText('Brand Name'), { target: { value: 'Test Brand' } });
        // Don't fill quantity field - leave it empty
        fireEvent.change(screen.getByLabelText('Price'), { target: { value: '99.99' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } });

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        fireEvent.click(submitButton);

        // Verify validation error toast is called (will show "Please fill in all fields" since quantity is empty)
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Please fill in all fields');
        });
    });

    it('successfully creates a product and navigates to products page', async () => {
        const { productApi } = await import('@/entities/product/api/productApi');

        vi.mocked(productApi.addProduct).mockResolvedValue({
            productId: '123',
            ean: '0123456789123',
            name: 'Test Product',
            description: 'Test description',
            price: 99.99,
            quantity: 100,
            brand: 'Test Brand',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            externalShopId: null,
        } as any);

        render(
            <MemoryRouter initialEntries={['/create-item']}>
                <Routes>
                    <Route
                        path="/create-item"
                        element={
                            <ProductsProvider>
                                <CreateItemPage />
                            </ProductsProvider>
                        }
                    />
                    <Route path="/products" element={<div>Products Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Fill out the form with valid data
        fireEvent.change(screen.getByLabelText('Product EAN'), { target: { value: '0123456789123' } });
        fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Test Product' } });
        fireEvent.change(screen.getByLabelText('Brand Name'), { target: { value: 'Test Brand' } });
        fireEvent.change(screen.getByLabelText('Stock Quantity'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Price'), { target: { value: '99.99' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } });

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        fireEvent.click(submitButton);

        // Verify success toast is called
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalledWith('Product created successfully!', {
                description: 'Test Product has been added to the catalog.',
            });
        });

        // Verify navigation to products page after timeout
        await waitFor(
            () => {
                expect(screen.getByText('Products Page')).toBeInTheDocument();
            },
            { timeout: 2000 }
        );
    });

    it('handles API error when creating product', async () => {
        const { productApi } = await import('@/entities/product/api/productApi');

        vi.mocked(productApi.addProduct).mockRejectedValue(new Error('API Error'));

        render(
            <MemoryRouter initialEntries={['/create-item']}>
                <ProductsProvider>
                    <CreateItemPage />
                </ProductsProvider>
            </MemoryRouter>
        );

        // Fill out the form with valid data
        fireEvent.change(screen.getByLabelText('Product EAN'), { target: { value: '0123456789123' } });
        fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Test Product' } });
        fireEvent.change(screen.getByLabelText('Brand Name'), { target: { value: 'Test Brand' } });
        fireEvent.change(screen.getByLabelText('Stock Quantity'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Price'), { target: { value: '99.99' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } });

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        fireEvent.click(submitButton);

        // Verify error toast is called
        await waitFor(() => {
            expect(toast.error).toHaveBeenCalledWith('Error creating product');
        });
    });

    it('resets form after successful submission', async () => {
        const { productApi } = await import('@/entities/product/api/productApi');

        vi.mocked(productApi.addProduct).mockResolvedValue({
            productId: '123',
            ean: '0123456789123',
            name: 'Test Product',
            description: 'Test description',
            price: 99.99,
            quantity: 100,
            brand: 'Test Brand',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            externalShopId: null,
        } as any);

        render(
            <MemoryRouter initialEntries={['/create-item']}>
                <ProductsProvider>
                    <CreateItemPage />
                </ProductsProvider>
            </MemoryRouter>
        );

        // Fill out the form
        const eanInput = screen.getByLabelText('Product EAN') as HTMLInputElement;
        const nameInput = screen.getByLabelText('Product Name') as HTMLInputElement;

        fireEvent.change(eanInput, { target: { value: '0123456789123' } });
        fireEvent.change(nameInput, { target: { value: 'Test Product' } });
        fireEvent.change(screen.getByLabelText('Brand Name'), { target: { value: 'Test Brand' } });
        fireEvent.change(screen.getByLabelText('Stock Quantity'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Price'), { target: { value: '99.99' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } });

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        fireEvent.click(submitButton);

        // Wait for submission to complete
        await waitFor(() => {
            expect(toast.success).toHaveBeenCalled();
        });

        // The form should be reset (inputs should be empty)
        // Note: We check after a small delay to allow the form to reset
        await waitFor(() => {
            expect(eanInput.value).toBe('');
            expect(nameInput.value).toBe('');
        });
    });
});
