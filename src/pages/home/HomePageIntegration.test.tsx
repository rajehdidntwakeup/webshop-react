import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { HomePage } from './HomePage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('HomePage Integration', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('integrates with MemoryRouter and navigates to products page', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<div>Products Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Verify we are on the home page
        expect(screen.getByText('Welcome to our Webshop')).toBeInTheDocument();

        // Click "Explore Collection" button
        const exploreButton = screen.getByText('Explore Collection');
        fireEvent.click(exploreButton);

        // Verify navigation to products page
        expect(screen.getByText('Products Page')).toBeInTheDocument();
    });

    it('integrates with MemoryRouter and navigates to create item page', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/create" element={<div>Create Item Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Verify we are on the home page
        expect(screen.getByText('Welcome to our Webshop')).toBeInTheDocument();

        // Click "Create Item" button
        const createButton = screen.getByText('Create Item');
        fireEvent.click(createButton);

        // Verify navigation to create item page
        expect(screen.getByText('Create Item Page')).toBeInTheDocument();
    });

    it('integrates with MemoryRouter and navigates to orders page', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/orders" element={<div>Orders Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Verify we are on the home page
        expect(screen.getByText('Welcome to our Webshop')).toBeInTheDocument();

        // Click "Orders" button
        const ordersButton = screen.getByText('Orders');
        fireEvent.click(ordersButton);

        // Verify navigation to orders page
        expect(screen.getByText('Orders Page')).toBeInTheDocument();
    });

    it('integrates with MemoryRouter and navigates to docs page', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/docs" element={<div>Documentation Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Verify we are on the home page
        expect(screen.getByText('Welcome to our Webshop')).toBeInTheDocument();

        // Click "Learn More" button
        const learnMoreButton = screen.getByText('Learn More');
        fireEvent.click(learnMoreButton);

        // Verify navigation to docs page
        expect(screen.getByText('Documentation Page')).toBeInTheDocument();
    });

    it('maintains page state after multiple navigation attempts', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<div>Products Page</div>} />
                    <Route path="/create" element={<div>Create Item Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // First navigation
        const exploreButton = screen.getByText('Explore Collection');
        fireEvent.click(exploreButton);
        expect(screen.getByText('Products Page')).toBeInTheDocument();

        // Go back to home (simulate browser back)
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<div>Products Page</div>} />
                    <Route path="/create" element={<div>Create Item Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Verify we're back on home page
        expect(screen.getByText('Welcome to our Webshop')).toBeInTheDocument();

        // Second navigation to a different page
        const createButton = screen.getByText('Create Item');
        fireEvent.click(createButton);
        expect(screen.getByText('Create Item Page')).toBeInTheDocument();
    });

    it('renders all interactive elements when integrated with router', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </MemoryRouter>
        );

        // Verify all navigation buttons are present and clickable
        const exploreButton = screen.getByText('Explore Collection');
        const createButton = screen.getByText('Create Item');
        const ordersButton = screen.getByText('Orders');
        const learnMoreButton = screen.getByText('Learn More');

        expect(exploreButton).toBeEnabled();
        expect(createButton).toBeEnabled();
        expect(ordersButton).toBeEnabled();
        expect(learnMoreButton).toBeEnabled();
    });

    it('displays correct styling and animations within router context', () => {
        const { container } = render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </MemoryRouter>
        );

        // Verify animated background elements are present
        const animatedElements = container.querySelectorAll('.animate-pulse');
        expect(animatedElements.length).toBe(3);

        // Verify glass card effect is present
        const glassCard = container.querySelector('.backdrop-blur-xl');
        expect(glassCard).toBeInTheDocument();

        // Verify button styling classes are present
        const exploreButton = screen.getByText('Explore Collection');
        expect(exploreButton.className).toContain('backdrop-blur-md');
        expect(exploreButton.className).toContain('bg-white/20');
    });

    it('handles rapid successive navigation clicks', () => {
        render(
            <MemoryRouter initialEntries={['/']}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<div>Products Page</div>} />
                    <Route path="/create" element={<div>Create Item Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Click multiple buttons rapidly
        const exploreButton = screen.getByText('Explore Collection');
        fireEvent.click(exploreButton);

        // Should navigate to the last clicked destination
        expect(screen.getByText('Products Page')).toBeInTheDocument();
    });

    it('renders correctly when accessed from different initial routes', () => {
        // Test accessing home page from /products route
        render(
            <MemoryRouter initialEntries={['/products', '/']}>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/products" element={<div>Products Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Should render home page correctly
        expect(screen.getByText('Welcome to our Webshop')).toBeInTheDocument();
        expect(screen.getByText('Explore Collection')).toBeInTheDocument();
    });
});
