import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { HomePage } from './HomePage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('HomePage', () => {
    describe('Unit Tests', () => {
        it('renders the welcome message and description', () => {
            render(
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            );

            expect(screen.getByText('Welcome to our Webshop')).toBeInTheDocument();
            expect(screen.getByText(/Discover our curated collection/i)).toBeInTheDocument();
        });

        it('renders all navigation buttons', () => {
            render(
                <MemoryRouter>
                    <HomePage />
                </MemoryRouter>
            );

            expect(screen.getByText('Explore Collection')).toBeInTheDocument();
            expect(screen.getByText('Create Item')).toBeInTheDocument();
            expect(screen.getByText('Orders')).toBeInTheDocument();
            expect(screen.getByText('Learn More')).toBeInTheDocument();
        });
    });

    describe('Integration Tests (Navigation)', () => {
        const renderWithRouter = () => {
            return render(
                <MemoryRouter initialEntries={['/']}>
                    <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<div>Products Page</div>} />
                        <Route path="/create" element={<div>Create Page</div>} />
                        <Route path="/orders" element={<div>Orders Page</div>} />
                        <Route path="/docs" element={<div>Docs Page</div>} />
                    </Routes>
                </MemoryRouter>
            );
        };

        it('navigates to /products when "Explore Collection" is clicked', () => {
            renderWithRouter();
            
            fireEvent.click(screen.getByText('Explore Collection'));
            expect(screen.getByText('Products Page')).toBeInTheDocument();
        });

        it('navigates to /create when "Create Item" is clicked', () => {
            renderWithRouter();
            
            fireEvent.click(screen.getByText('Create Item'));
            expect(screen.getByText('Create Page')).toBeInTheDocument();
        });

        it('navigates to /orders when "Orders" is clicked', () => {
            renderWithRouter();
            
            fireEvent.click(screen.getByText('Orders'));
            expect(screen.getByText('Orders Page')).toBeInTheDocument();
        });

        it('navigates to /docs when "Learn More" is clicked', () => {
            renderWithRouter();
            
            fireEvent.click(screen.getByText('Learn More'));
            expect(screen.getByText('Docs Page')).toBeInTheDocument();
        });
    });
});
