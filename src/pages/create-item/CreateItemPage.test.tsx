import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { CreateItemPage } from './CreateItemPage';
import { BrowserRouter } from 'react-router-dom';
import { useProducts } from '@/entities/product/model/ProductsContext';
import { toast } from 'sonner';

vi.mock('@/entities/product/model/ProductsContext', () => ({
    useProducts: vi.fn(),
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

// Mocking useCreateItemForm would make it less of an "integration" test,
// but we need to mock useProducts anyway.
// Let's try to test the real page with mocked context.

const renderPage = () => {
    return render(
        <BrowserRouter>
            <CreateItemPage />
        </BrowserRouter>
    );
};

describe('CreateItemPage Integration', () => {
    const mockAddProduct = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useProducts as any).mockReturnValue({ addProduct: mockAddProduct });
        vi.useFakeTimers();
    });

    it('renders the page and handles back navigation', () => {
        renderPage();

        expect(screen.getByText(/Create New Item/i)).toBeInTheDocument();
        const backButton = screen.getByRole('button', { name: /Back to Home/i });
        expect(backButton).toBeInTheDocument();
        
        // Navigation is harder to test without a memory router or similar, 
        // but we can verify it doesn't crash.
        fireEvent.click(backButton);
    });

    it('successfully creates a product through the UI', async () => {
        renderPage();

        fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Awesome Product' } });
        fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '42' } });
        fireEvent.change(screen.getByLabelText(/Price/i), { target: { value: '19.99' } });
        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Best product ever' } });

        mockAddProduct.mockResolvedValueOnce({});

        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        
        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(mockAddProduct).toHaveBeenCalledWith({
            name: 'Awesome Product',
            stock: 42,
            price: 19.99,
            description: 'Best product ever',
        });

        expect(toast.success).toHaveBeenCalledWith('Product created successfully!', expect.any(Object));
        
        // Check if form is reset
        expect(screen.getByLabelText(/Product Name/i)).toHaveValue('');
    });

    it('shows validation errors when fields are missing', async () => {
        renderPage();

        const submitButton = screen.getByRole('button', { name: /Create Product/i });
        
        await act(async () => {
            fireEvent.click(submitButton);
        });

        expect(toast.error).toHaveBeenCalledWith('Please fill in all fields');
        expect(mockAddProduct).not.toHaveBeenCalled();
    });
});
