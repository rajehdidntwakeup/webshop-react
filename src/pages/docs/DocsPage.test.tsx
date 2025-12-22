import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DocsPage } from './DocsPage';
import { useNavigate } from 'react-router-dom';

// Mock useNavigate
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

describe('DocsPage', () => {
    it('renders the header and description', () => {
        const mockNavigate = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        render(<DocsPage />);

        expect(screen.getByText('How to Use Our Webshop')).toBeInTheDocument();
        expect(screen.getByText(/Welcome to our comprehensive guide/i)).toBeInTheDocument();
    });

    it('renders all documentation sections', () => {
        const mockNavigate = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        render(<DocsPage />);

        // Check "Browse Products" section
        expect(screen.getByText('Browse Products')).toBeInTheDocument();
        expect(screen.getByText('Use the category cards on the homepage to filter products by type')).toBeInTheDocument();

        // Check "Shopping Cart" section
        expect(screen.getByText('Shopping Cart')).toBeInTheDocument();
        expect(screen.getByText('Click the cart icon on any product to add it to your shopping cart')).toBeInTheDocument();
    });

    it('renders additional tips', () => {
        const mockNavigate = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        render(<DocsPage />);

        expect(screen.getByText('Additional Tips')).toBeInTheDocument();
        expect(screen.getByText('💡 Quick Tip')).toBeInTheDocument();
        expect(screen.getByText('📱 Mobile Friendly')).toBeInTheDocument();
    });

    it('navigates back to home when "Back to Home" button is clicked', () => {
        const mockNavigate = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        render(<DocsPage />);

        const backButton = screen.getByText('Back to Home');
        fireEvent.click(backButton);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    it('navigates to home when "Start Shopping" button is clicked', () => {
        const mockNavigate = vi.fn();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);

        render(<DocsPage />);

        const startShoppingButton = screen.getByText('Start Shopping');
        fireEvent.click(startShoppingButton);

        expect(mockNavigate).toHaveBeenCalledWith('/');
    });
});
