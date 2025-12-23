import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HomePage } from './HomePage';
import { useNavigate } from 'react-router-dom';

// Mock useNavigate
vi.mock('react-router-dom', () => ({
    useNavigate: vi.fn(),
}));

describe('HomePage', () => {
    const mockNavigate = vi.fn();

    beforeEach(() => {
        vi.clearAllMocks();
        vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    });

    it('renders the page header with title', () => {
        render(<HomePage />);

        expect(screen.getByText('Welcome to our Webshop')).toBeInTheDocument();
    });

    it('renders the page description', () => {
        render(<HomePage />);

        expect(
            screen.getByText(
                /Discover our curated collection of premium products/i
            )
        ).toBeInTheDocument();
    });

    it('renders the ShoppingBag icon in the header', () => {
        render(<HomePage />);

        const headerWithIcon = screen.getByText('Welcome to our Webshop').parentElement?.parentElement;
        expect(headerWithIcon).toBeInTheDocument();
    });

    it('renders the "Explore Collection" button', () => {
        render(<HomePage />);

        expect(screen.getByText('Explore Collection')).toBeInTheDocument();
    });

    it('renders the "Create Item" button', () => {
        render(<HomePage />);

        expect(screen.getByText('Create Item')).toBeInTheDocument();
    });

    it('renders the "Orders" button', () => {
        render(<HomePage />);

        expect(screen.getByText('Orders')).toBeInTheDocument();
    });

    it('renders the "Learn More" button', () => {
        render(<HomePage />);

        expect(screen.getByText('Learn More')).toBeInTheDocument();
    });

    it('navigates to /products when "Explore Collection" button is clicked', () => {
        render(<HomePage />);

        const exploreButton = screen.getByText('Explore Collection');
        fireEvent.click(exploreButton);

        expect(mockNavigate).toHaveBeenCalledWith('/products');
    });

    it('navigates to /create when "Create Item" button is clicked', () => {
        render(<HomePage />);

        const createButton = screen.getByText('Create Item');
        fireEvent.click(createButton);

        expect(mockNavigate).toHaveBeenCalledWith('/create');
    });

    it('navigates to /orders when "Orders" button is clicked', () => {
        render(<HomePage />);

        const ordersButton = screen.getByText('Orders');
        fireEvent.click(ordersButton);

        expect(mockNavigate).toHaveBeenCalledWith('/orders');
    });

    it('navigates to /docs when "Learn More" button is clicked', () => {
        render(<HomePage />);

        const learnMoreButton = screen.getByText('Learn More');
        fireEvent.click(learnMoreButton);

        expect(mockNavigate).toHaveBeenCalledWith('/docs');
    });

    it('renders animated background elements', () => {
        const { container } = render(<HomePage />);

        // Check for animated background divs with animate-pulse class
        const animatedElements = container.querySelectorAll('.animate-pulse');
        expect(animatedElements.length).toBe(3);
    });

    it('renders glass card with backdrop blur effect', () => {
        const { container } = render(<HomePage />);

        // Check for glass card with backdrop-blur-xl class
        const glassCard = container.querySelector('.backdrop-blur-xl');
        expect(glassCard).toBeInTheDocument();
    });

    it('renders all navigation buttons in correct order', () => {
        render(<HomePage />);

        const buttons = screen.getAllByRole('button');

        expect(buttons[0]).toHaveTextContent('Explore Collection');
        expect(buttons[1]).toHaveTextContent('Create Item');
        expect(buttons[2]).toHaveTextContent('Orders');
        expect(buttons[3]).toHaveTextContent('Learn More');
    });

    it('renders ArrowRight icon in "Explore Collection" button', () => {
        render(<HomePage />);

        const exploreButton = screen.getByText('Explore Collection');
        expect(exploreButton.parentElement).toBeInTheDocument();
    });

    it('renders Plus icon in "Create Item" button', () => {
        render(<HomePage />);

        const createButton = screen.getByText('Create Item');
        expect(createButton.parentElement).toBeInTheDocument();
    });

    it('renders Package icon in "Orders" button', () => {
        render(<HomePage />);

        const ordersButton = screen.getByText('Orders');
        expect(ordersButton.parentElement).toBeInTheDocument();
    });
});
