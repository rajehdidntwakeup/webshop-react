import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateItemForm } from './CreateItemForm';
import { CreateItemFormData } from './CreateItemFormData';

describe('CreateItemForm', () => {
    const defaultFormData: CreateItemFormData = {
        name: '',
        stock: '',
        price: '',
        description: '',
    };

    const mockUpdateField = vi.fn();
    const mockHandleSubmit = vi.fn((e) => e.preventDefault());

    it('renders all form fields', () => {
        render(
            <CreateItemForm
                formData={defaultFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        expect(screen.getByLabelText(/Product Name/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Stock Quantity/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Price/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /Create Product/i })).toBeInTheDocument();
    });

    it('calls updateField when inputs change', () => {
        render(
            <CreateItemForm
                formData={defaultFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        fireEvent.change(screen.getByLabelText(/Product Name/i), { target: { value: 'Test Product' } });
        expect(mockUpdateField).toHaveBeenCalledWith('name', 'Test Product');

        fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { target: { value: '10' } });
        expect(mockUpdateField).toHaveBeenCalledWith('stock', '10');

        fireEvent.change(screen.getByLabelText(/Description/i), { target: { value: 'Test Desc' } });
        expect(mockUpdateField).toHaveBeenCalledWith('description', 'Test Desc');
    });

    it('validates price input format on change', () => {
        render(
            <CreateItemForm
                formData={defaultFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        const priceInput = screen.getByLabelText(/Price/i);

        fireEvent.change(priceInput, { target: { value: '10.99' } });
        expect(mockUpdateField).toHaveBeenCalledWith('price', '10.99');

        vi.clearAllMocks();
        fireEvent.change(priceInput, { target: { value: 'invalid' } });
        expect(mockUpdateField).not.toHaveBeenCalled();
    });

    it('calls handleSubmit on form submit', () => {
        render(
            <CreateItemForm
                formData={defaultFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        fireEvent.submit(screen.getByRole('button', { name: /Create Product/i }).closest('form')!);
        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('disables fields and shows loading state when isSubmitting is true', () => {
        render(
            <CreateItemForm
                formData={defaultFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={true}
            />
        );

        expect(screen.getByLabelText(/Product Name/i)).toBeDisabled();
        expect(screen.getByLabelText(/Stock Quantity/i)).toBeDisabled();
        expect(screen.getByLabelText(/Price/i)).toBeDisabled();
        expect(screen.getByLabelText(/Description/i)).toBeDisabled();
        expect(screen.getByRole('button', { name: /Creating.../i })).toBeDisabled();
    });
});
