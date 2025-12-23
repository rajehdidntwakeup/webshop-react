import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateItemForm } from './CreateItemForm';
import { useCreateItemForm } from './useCreateItemForm';
import { ProductsProvider } from '@/entities/product/model/ProductsContext';
import { MemoryRouter } from 'react-router-dom';

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

// Component that integrates the form with the hook
function IntegratedCreateItemForm() {
    const { formData, updateField, handleSubmit, isSubmitting } = useCreateItemForm();

    return (
        <CreateItemForm
            formData={formData}
            updateField={updateField}
            handleSubmit={handleSubmit}
            isSubmitting={isSubmitting}
        />
    );
}

describe('CreateItemForm Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('integrates with useCreateItemForm hook and updates form state', async () => {
        render(
            <MemoryRouter>
                <ProductsProvider>
                    <IntegratedCreateItemForm />
                </ProductsProvider>
            </MemoryRouter>
        );

        // Fill out the form
        const eanInput = screen.getByLabelText('Product EAN');
        const nameInput = screen.getByLabelText('Product Name');
        const brandInput = screen.getByLabelText('Brand Name');
        const quantityInput = screen.getByLabelText('Stock Quantity');
        const priceInput = screen.getByLabelText('Price');
        const descriptionInput = screen.getByLabelText('Description');

        fireEvent.change(eanInput, { target: { value: '0123456789123' } });
        fireEvent.change(nameInput, { target: { value: 'Test Product' } });
        fireEvent.change(brandInput, { target: { value: 'Test Brand' } });
        fireEvent.change(quantityInput, { target: { value: '100' } });
        fireEvent.change(priceInput, { target: { value: '99.99' } });
        fireEvent.change(descriptionInput, { target: { value: 'Test description' } });

        // Verify the values are updated in the form
        expect(eanInput).toHaveValue('0123456789123');
        expect(nameInput).toHaveValue('Test Product');
        expect(brandInput).toHaveValue('Test Brand');
        expect(quantityInput).toHaveValue(100);
        expect(priceInput).toHaveValue('99.99');
        expect(descriptionInput).toHaveValue('Test description');
    });

    it('validates price format and rejects invalid input', async () => {
        render(
            <MemoryRouter>
                <ProductsProvider>
                    <IntegratedCreateItemForm />
                </ProductsProvider>
            </MemoryRouter>
        );

        const priceInput = screen.getByLabelText('Price');

        // Try to enter a price with more than 2 decimal places
        fireEvent.change(priceInput, { target: { value: '99.999' } });

        // The input should not accept the invalid value
        expect(priceInput).toHaveValue('');
    });

    it('allows valid price format with 2 decimal places', async () => {
        render(
            <MemoryRouter>
                <ProductsProvider>
                    <IntegratedCreateItemForm />
                </ProductsProvider>
            </MemoryRouter>
        );

        const priceInput = screen.getByLabelText('Price');

        // Enter a valid price
        fireEvent.change(priceInput, { target: { value: '99.99' } });

        expect(priceInput).toHaveValue('99.99');
    });

    it('allows whole number price format', async () => {
        render(
            <MemoryRouter>
                <ProductsProvider>
                    <IntegratedCreateItemForm />
                </ProductsProvider>
            </MemoryRouter>
        );

        const priceInput = screen.getByLabelText('Price');

        // Enter a whole number price
        fireEvent.change(priceInput, { target: { value: '99' } });

        expect(priceInput).toHaveValue('99');
    });

    it('disables all inputs during form submission', async () => {
        const { productApi } = await import('@/entities/product/api/productApi');

        // Mock a delayed response
        vi.mocked(productApi.addProduct).mockImplementation(
            () => new Promise((resolve) => setTimeout(() => resolve({ productId: '1' } as any), 500))
        );

        render(
            <MemoryRouter>
                <ProductsProvider>
                    <IntegratedCreateItemForm />
                </ProductsProvider>
            </MemoryRouter>
        );

        // Wait for the component to be ready
        await waitFor(() => {
            expect(screen.getByLabelText('Product EAN')).toBeInTheDocument();
        });

        // Fill out the form
        fireEvent.change(screen.getByLabelText('Product EAN'), { target: { value: '0123456789123' } });
        fireEvent.change(screen.getByLabelText('Product Name'), { target: { value: 'Test Product' } });
        fireEvent.change(screen.getByLabelText('Brand Name'), { target: { value: 'Test Brand' } });
        fireEvent.change(screen.getByLabelText('Stock Quantity'), { target: { value: '100' } });
        fireEvent.change(screen.getByLabelText('Price'), { target: { value: '99.99' } });
        fireEvent.change(screen.getByLabelText('Description'), { target: { value: 'Test description' } });

        // Submit the form
        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        fireEvent.click(submitButton);

        // Wait for the button text to change to "Creating..." and check that inputs are disabled
        await waitFor(() => {
            expect(screen.getByText('Creating...')).toBeInTheDocument();
            expect(screen.getByLabelText('Product EAN')).toBeDisabled();
            expect(screen.getByLabelText('Product Name')).toBeDisabled();
        });
    });
});
