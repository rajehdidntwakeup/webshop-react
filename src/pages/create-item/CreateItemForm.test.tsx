import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateItemForm } from './CreateItemForm';
import { ProductRequestDto } from '@/entities/product/model/Product';

describe('CreateItemForm', () => {
    const mockFormData: ProductRequestDto = {
        ean: '',
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        brand: '',
    };

    const mockUpdateField = vi.fn();
    const mockHandleSubmit = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all form fields', () => {
        render(
            <CreateItemForm
                formData={mockFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        expect(screen.getByLabelText('Product EAN')).toBeInTheDocument();
        expect(screen.getByLabelText('Product Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Brand Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Stock Quantity')).toBeInTheDocument();
        expect(screen.getByLabelText('Price')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('renders submit button with correct text', () => {
        render(
            <CreateItemForm
                formData={mockFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        expect(screen.getByText('Create Product')).toBeInTheDocument();
    });

    it('displays "Creating..." when isSubmitting is true', () => {
        render(
            <CreateItemForm
                formData={mockFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={true}
            />
        );

        expect(screen.getByText('Creating...')).toBeInTheDocument();
    });

    it('calls updateField when EAN input changes', () => {
        render(
            <CreateItemForm
                formData={mockFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        const eanInput = screen.getByLabelText('Product EAN');
        fireEvent.change(eanInput, { target: { value: '0123456789123' } });

        expect(mockUpdateField).toHaveBeenCalledWith('ean', '0123456789123');
    });

    it('calls updateField when name input changes', () => {
        render(
            <CreateItemForm
                formData={mockFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        const nameInput = screen.getByLabelText('Product Name');
        fireEvent.change(nameInput, { target: { value: 'Premium Bag' } });

        expect(mockUpdateField).toHaveBeenCalledWith('name', 'Premium Bag');
    });

    it('calls updateField when brand input changes', () => {
        render(
            <CreateItemForm
                formData={mockFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        const brandInput = screen.getByLabelText('Brand Name');
        fireEvent.change(brandInput, { target: { value: 'Prada' } });

        expect(mockUpdateField).toHaveBeenCalledWith('brand', 'Prada');
    });

    it('calls updateField when quantity input changes', () => {
        render(
            <CreateItemForm
                formData={mockFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        const quantityInput = screen.getByLabelText('Stock Quantity');
        fireEvent.change(quantityInput, { target: { value: '50' } });

        expect(mockUpdateField).toHaveBeenCalledWith('quantity', '50');
    });

    it('calls updateField when price input changes with valid format', () => {
        render(
            <CreateItemForm
                formData={mockFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        const priceInput = screen.getByLabelText('Price');
        fireEvent.change(priceInput, { target: { value: '299.99' } });

        expect(mockUpdateField).toHaveBeenCalledWith('price', '299.99');
    });

    it('does not call updateField for invalid price format', () => {
        render(
            <CreateItemForm
                formData={mockFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        const priceInput = screen.getByLabelText('Price');
        fireEvent.change(priceInput, { target: { value: '299.999' } });

        expect(mockUpdateField).not.toHaveBeenCalled();
    });

    it('calls updateField when description changes', () => {
        render(
            <CreateItemForm
                formData={mockFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        const descriptionInput = screen.getByLabelText('Description');
        fireEvent.change(descriptionInput, { target: { value: 'A premium product' } });

        expect(mockUpdateField).toHaveBeenCalledWith('description', 'A premium product');
    });

    it('calls handleSubmit when form is submitted', () => {
        render(
            <CreateItemForm
                formData={mockFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        const form = screen.getByRole('button', { name: /Create Product/i }).closest('form');
        fireEvent.submit(form!);

        expect(mockHandleSubmit).toHaveBeenCalled();
    });

    it('disables all inputs when isSubmitting is true', () => {
        render(
            <CreateItemForm
                formData={mockFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={true}
            />
        );

        expect(screen.getByLabelText('Product EAN')).toBeDisabled();
        expect(screen.getByLabelText('Product Name')).toBeDisabled();
        expect(screen.getByLabelText('Brand Name')).toBeDisabled();
        expect(screen.getByLabelText('Stock Quantity')).toBeDisabled();
        expect(screen.getByLabelText('Price')).toBeDisabled();
        expect(screen.getByLabelText('Description')).toBeDisabled();
        expect(screen.getByRole('button', { name: /Creating.../i })).toBeDisabled();
    });

    it('displays form data values correctly', () => {
        const filledFormData: ProductRequestDto = {
            ean: '0123456789123',
            name: 'Premium Bag',
            description: 'A luxury bag',
            price: 299.99,
            quantity: 50,
            brand: 'Prada',
        };

        render(
            <CreateItemForm
                formData={filledFormData}
                updateField={mockUpdateField}
                handleSubmit={mockHandleSubmit}
                isSubmitting={false}
            />
        );

        expect(screen.getByDisplayValue('0123456789123')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Premium Bag')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Prada')).toBeInTheDocument();
        expect(screen.getByDisplayValue('50')).toBeInTheDocument();
        expect(screen.getByDisplayValue('299.99')).toBeInTheDocument();
        expect(screen.getByDisplayValue('A luxury bag')).toBeInTheDocument();
    });
});
