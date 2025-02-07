import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

describe('Home', () => {
  it('renders without crashing', () => {
    render(<Home />);
    expect(screen.getByText('Workout Tracker')).toBeInTheDocument();
  });
});
