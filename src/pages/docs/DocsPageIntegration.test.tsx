import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DocsPage } from './DocsPage';
import { MemoryRouter, Route, Routes } from 'react-router-dom';

describe('DocsPage Integration', () => {
    it('integrates with MemoryRouter and navigates when buttons are clicked', () => {
        render(
            <MemoryRouter initialEntries={['/docs']}>
                <Routes>
                    <Route path="/docs" element={<DocsPage />} />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Verify we are on the docs page
        expect(screen.getByText('How to Use Our Webshop')).toBeInTheDocument();

        // Click "Back to Home"
        const backButton = screen.getByText('Back to Home');
        fireEvent.click(backButton);

        // Verify navigation to home page
        expect(screen.getByText('Home Page')).toBeInTheDocument();
    });

    it('navigates to home when "Start Shopping" is clicked', () => {
        render(
            <MemoryRouter initialEntries={['/docs']}>
                <Routes>
                    <Route path="/docs" element={<DocsPage />} />
                    <Route path="/" element={<div>Home Page</div>} />
                </Routes>
            </MemoryRouter>
        );

        // Click "Start Shopping"
        const startShoppingButton = screen.getByText('Start Shopping');
        fireEvent.click(startShoppingButton);

        // Verify navigation to home page
        expect(screen.getByText('Home Page')).toBeInTheDocument();
    });
});
