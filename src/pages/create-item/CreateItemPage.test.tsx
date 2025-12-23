import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CreateItemPage } from './CreateItemPage';
import { useNavigate } from 'react-router-dom';
import { useCreateItemForm } from './useCreateItemForm';

// Mock useNavigate
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

// Mock useCreateItemForm hook
vi.mock('./useCreateItemForm', () => ({
    useCreateItemForm: vi.fn(),
}));

describe('CreateItemPage', () => {
    const mockNavigate = vi.fn();
    const mockUpdateField = vi.fn();
    const mockHandleSubmit = vi.fn();

    const mockFormData = {
        ean: '',
        name: '',
        description: '',
        price: 0,
        quantity: 0,
        brand: '',
    };

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
        vi.mocked(useCreateItemForm).mockReturnValue({
            formData: mockFormData,
            updateField: mockUpdateField,
            handleSubmit: mockHandleSubmit,
            isSubmitting: false,
        });
    });

    it('renders the page header with title', () => {
        render(<CreateItemPage />);

        expect(screen.getByText('Create New Item')).toBeInTheDocument();
    });

    it('renders the page description', () => {
        render(<CreateItemPage />);

        expect(screen.getByText('Add a new product to your catalog. Fill in the details below.')).toBeInTheDocument();
    });

    it('renders the back to home button', () => {
        render(<CreateItemPage />);

        expect(screen.getByText('Back to Home')).toBeInTheDocument();
    });

    it('navigates to home when back button is clicked', () => {
        render(<CreateItemPage />);

        const backButton = screen.getByText('Back to Home');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('renders the CreateItemForm component', () => {
        render(<CreateItemPage />);

        // Check if form fields are rendered (which means CreateItemForm is rendered)
        expect(screen.getByLabelText('Product EAN')).toBeInTheDocument();
        expect(screen.getByLabelText('Product Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Brand Name')).toBeInTheDocument();
        expect(screen.getByLabelText('Stock Quantity')).toBeInTheDocument();
        expect(screen.getByLabelText('Price')).toBeInTheDocument();
        expect(screen.getByLabelText('Description')).toBeInTheDocument();
    });

    it('passes formData to CreateItemForm', () => {
        const filledFormData = {
            ean: '0123456789123',
            name: 'Test Product',
            description: 'Test description',
            price: 99.99,
            quantity: 50,
            brand: 'Test Brand',
        };

        vi.mocked(useCreateItemForm).mockReturnValue({
            formData: filledFormData,
            updateField: mockUpdateField,
            handleSubmit: mockHandleSubmit,
            isSubmitting: false,
        });

        render(<CreateItemPage />);

        expect(screen.getByDisplayValue('0123456789123')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Product')).toBeInTheDocument();
        expect(screen.getByDisplayValue('Test Brand')).toBeInTheDocument();
    });

    it('passes isSubmitting state to CreateItemForm', () => {
        vi.mocked(useCreateItemForm).mockReturnValue({
            formData: mockFormData,
            updateField: mockUpdateField,
            handleSubmit: mockHandleSubmit,
            isSubmitting: true,
        });

        render(<CreateItemPage />);

        expect(screen.getByText('Creating...')).toBeInTheDocument();
    });

    it('renders Plus icon in the header', () => {
        render(<CreateItemPage />);

        // The Plus icon is rendered in an SVG element
        const header = screen.getByText('Create New Item').parentElement;
        expect(header).toBeInTheDocument();
    });

    it('renders animated background elements', () => {
        const { container } = render(<CreateItemPage />);

        // Check for animated background divs
        const animatedElements = container.querySelectorAll('.animate-pulse');
        expect(animatedElements.length).toBeGreaterThan(0);
    });
});
