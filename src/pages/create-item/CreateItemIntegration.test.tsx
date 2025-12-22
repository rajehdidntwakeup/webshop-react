import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateItemPage } from './CreateItemPage';
import { MemoryRouter } from 'react-router-dom';
import { ProductsContext } from '@/entities/product/model/ProductsContext';
import { toast } from 'sonner';

// Mock sonner toast
vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
    const actual = await vi.importActual('react-router-dom');
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    };
});

describe('CreateItemPage Integration', () => {
    const mockAddProduct = vi.fn();

    const renderPage = () => {
        return render(
            <MemoryRouter>
                <ProductsContext.Provider value={{ 
                    products: [], 
                    addProduct: mockAddProduct, 
                    refreshProducts: vi.fn(),
                    isLoading: false,
                    error: null
                }}>
                    <CreateItemPage />
                </ProductsContext.Provider>
            </MemoryRouter>
        );
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('successfully creates a product and navigates', async () => {
        renderPage();

        // Fill out the form
        fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'New Gadget' } });
        fireEvent.change(screen.getByLabelText(/stock quantity/i), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText(/price/i), { target: { value: '49.99' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'A very cool gadget.' } });

        // Submit the form
        fireEvent.click(screen.getByRole('button', { name: /create product/i }));

        await waitFor(() => {
            expect(mockAddProduct).toHaveBeenCalledWith({
                name: 'New Gadget',
                stock: 10,
                price: 49.99,
                description: 'A very cool gadget.',
            });
        });

        expect(toast.success).toHaveBeenCalledWith('Product created successfully!', expect.any(Object));

        // Check navigation (it has a 1.5s delay in the code)
        await waitFor(() => {
            expect(mockNavigate).toHaveBeenCalledWith('/products');
        }, { timeout: 2000 });
    });

    it('shows error toast when fields are missing', async () => {
        renderPage();

        // Submit without filling fields
        fireEvent.click(screen.getByRole('button', { name: /create product/i }));

        expect(toast.error).toHaveBeenCalledWith('Please fill in all fields');
        expect(mockAddProduct).not.toHaveBeenCalled();
    });

    it('shows error toast for invalid price format', async () => {
        renderPage();

        // Fill other fields correctly
        fireEvent.change(screen.getByLabelText(/product name/i), { target: { value: 'New Gadget' } });
        fireEvent.change(screen.getByLabelText(/stock quantity/i), { target: { value: '10' } });
        fireEvent.change(screen.getByLabelText(/description/i), { target: { value: 'A very cool gadget.' } });
        
        // Price field has its own validation in CreateItemForm but also in useCreateItemForm
        // Let's try to bypass the CreateItemForm regex by using fireEvent on the input directly 
        // with something that doesn't match the regex but might pass through if not careful
        // Actually, CreateItemForm's onChange prevents invalid input from even reaching state.
        // But if somehow it did, useCreateItemForm also validates it.
        
        const priceInput = screen.getByLabelText(/price/i);
        fireEvent.change(priceInput, { target: { value: '12.345' } }); // More than 2 decimals
        
        // Since CreateItemForm prevents this, the value shouldn't change if it's strictly controlled.
        // But let's see how the component handles it.
        // In CreateItemForm.tsx: if (val === '' || /^\d+\.?\d{0,2}$/.test(val)) { updateField('price', val); }
        // So '12.345' won't call updateField.
        
        fireEvent.click(screen.getByRole('button', { name: /create product/i }));

        expect(toast.error).toHaveBeenCalledWith('Please fill in all fields'); // Because price remained empty
    });
});
