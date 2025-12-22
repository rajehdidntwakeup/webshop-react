import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useCreateItemForm } from './useCreateItemForm';
import { useNavigate } from 'react-router-dom';
import { useProducts } from '@/entities/product/model/ProductsContext';
import { toast } from 'sonner';

vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

vi.mock('@/entities/product/model/ProductsContext', () => ({
    useProducts: vi.fn(),
}));

vi.mock('sonner', () => ({
    toast: {
        success: vi.fn(),
        error: vi.fn(),
    },
}));

describe('useCreateItemForm', () => {
    const mockNavigate = vi.fn();
    const mockAddProduct = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        (useNavigate as any).mockReturnValue(mockNavigate);
        (useProducts as any).mockReturnValue({ addProduct: mockAddProduct });
        vi.useFakeTimers();
    });

    it('should initialize with empty form data', () => {
        const { result } = renderHook(() => useCreateItemForm());
        expect(result.current.formData).toEqual({
            name: '',
            stock: '',
            price: '',
            description: '',
        });
        expect(result.current.isSubmitting).toBe(false);
    });

    it('should update form fields', () => {
        const { result } = renderHook(() => useCreateItemForm());
        
        act(() => {
            result.current.updateField('name', 'New Product');
        });
        
        expect(result.current.formData.name).toBe('New Product');
    });

    it('should show error if fields are empty on submit', async () => {
        const { result } = renderHook(() => useCreateItemForm());
        const event = { preventDefault: vi.fn() } as any;

        await act(async () => {
            await result.current.handleSubmit(event);
        });

        expect(toast.error).toHaveBeenCalledWith('Please fill in all fields');
        expect(mockAddProduct).not.toHaveBeenCalled();
    });

    it('should show error if price format is invalid', async () => {
        const { result } = renderHook(() => useCreateItemForm());
        const event = { preventDefault: vi.fn() } as any;

        act(() => {
            result.current.updateField('name', 'Test');
            result.current.updateField('stock', '10');
            result.current.updateField('price', 'invalid');
            result.current.updateField('description', 'Test desc');
        });

        await act(async () => {
            await result.current.handleSubmit(event);
        });

        expect(toast.error).toHaveBeenCalledWith('Invalid price format', expect.any(Object));
        expect(mockAddProduct).not.toHaveBeenCalled();
    });

    it('should call addProduct and navigate on successful submit', async () => {
        const { result } = renderHook(() => useCreateItemForm());
        const event = { preventDefault: vi.fn() } as any;

        act(() => {
            result.current.updateField('name', 'New Product');
            result.current.updateField('stock', '10');
            result.current.updateField('price', '99.99');
            result.current.updateField('description', 'Description');
        });

        mockAddProduct.mockResolvedValueOnce({});

        await act(async () => {
            await result.current.handleSubmit(event);
        });

        expect(mockAddProduct).toHaveBeenCalledWith({
            name: 'New Product',
            stock: 10,
            price: 99.99,
            description: 'Description',
        });
        expect(toast.success).toHaveBeenCalledWith('Product created successfully!', expect.any(Object));
        
        act(() => {
            vi.runAllTimers();
        });
        
        expect(mockNavigate).toHaveBeenCalledWith('/products');
    });

    it('should handle error from addProduct', async () => {
        const { result } = renderHook(() => useCreateItemForm());
        const event = { preventDefault: vi.fn() } as any;

        act(() => {
            result.current.updateField('name', 'New Product');
            result.current.updateField('stock', '10');
            result.current.updateField('price', '99.99');
            result.current.updateField('description', 'Description');
        });

        mockAddProduct.mockRejectedValueOnce(new Error('Failed'));

        await act(async () => {
            await result.current.handleSubmit(event);
        });

        expect(toast.error).toHaveBeenCalledWith('Error creating product');
        expect(result.current.isSubmitting).toBe(false);
    });
});
