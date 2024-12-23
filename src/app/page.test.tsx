import React from 'react';
import { render, screen } from '@testing-library/react';
import Page from './page';

describe('Page Component', () => {
    it('renders the page correctly', () => {
        render(<Page />);
        expect(screen.getByText(/some text/i)).toBeInTheDocument();
    });
});