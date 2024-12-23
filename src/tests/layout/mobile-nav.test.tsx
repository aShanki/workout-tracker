import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MobileNav } from '@/components/layout/mobile-nav';
import { useRouter } from 'next/navigation';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    pathname: '/'
  }))
}));

describe('MobileNav', () => {
  const mockNavItems = [
    { href: '/', label: 'Home' },
    { href: '/workouts', label: 'Workouts' },
    { href: '/profile', label: 'Profile' }
  ];

  beforeEach(() => {
    // Reset mocks before each test
    jest.clearAllMocks();
  });

  it('should render menu button with correct accessibility labels', () => {
    render(<MobileNav items={mockNavItems} />);
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    expect(menuButton).toHaveAttribute('aria-expanded', 'false');
    expect(menuButton).toHaveAttribute('aria-controls', 'mobile-menu');
    expect(menuButton).toHaveAttribute('aria-label', 'Open menu');
  });

  it('should open menu when menu button is clicked', async () => {
    render(<MobileNav items={mockNavItems} />);
    
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    await waitFor(() => {
      expect(menuButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByRole('dialog')).toBeInTheDocument();
    });
  });

  it('should render all navigation items when menu is opened', async () => {
    render(<MobileNav items={mockNavItems} />);
    
    // Open menu
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    
    // Wait for menu items to be visible
    await waitFor(() => {
      mockNavItems.forEach(item => {
        expect(screen.getByRole('link', { name: item.label })).toBeInTheDocument();
      });
    });
  });

  it('should close menu when clicking close button', async () => {
    render(<MobileNav items={mockNavItems} />);
    
    // Open menu
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    
    // Wait for dialog to be visible
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
    
    // Click close button
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);
    
    // Menu should be closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should navigate when menu item is clicked', async () => {
    const mockRouter = { push: jest.fn() };
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    
    render(<MobileNav items={mockNavItems} />);
    
    // Open menu
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    
    // Click a menu item
    const workoutsLink = await screen.findByRole('link', { name: /workouts/i });
    fireEvent.click(workoutsLink);
    
    // Should navigate to workouts page
    expect(mockRouter.push).toHaveBeenCalledWith('/workouts');
  });

  it('should handle keyboard navigation', async () => {
    render(<MobileNav items={mockNavItems} />);
    
    // Open menu with Enter key
    const menuButton = screen.getByRole('button', { name: /menu/i });
    fireEvent.click(menuButton);
    
    // Wait for dialog
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toBeInTheDocument();
    
    // Close with Escape key
    fireEvent.keyDown(dialog, { key: 'Escape' });
    
    // Menu should be closed
    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('should apply proper animation classes when opening/closing', async () => {
    render(<MobileNav items={mockNavItems} />);
    
    // Open menu
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    
    // Check opening animations
    const dialog = await screen.findByRole('dialog');
    expect(dialog).toHaveClass('data-[state=open]:animate-in');
    
    // Close menu
    fireEvent.click(screen.getByRole('button', { name: /close/i }));
    
    // Check closing animations
    await waitFor(() => {
      expect(dialog).toHaveClass('data-[state=closed]:animate-out');
    });
  });

  it('should have smooth scroll behavior', async () => {
    render(<MobileNav items={mockNavItems} />);
    
    // Open menu
    fireEvent.click(screen.getByRole('button', { name: /menu/i }));
    
    // Check scroll area viewport
    const scrollViewport = screen.getByRole('navigation').querySelector('[data-radix-scroll-area-viewport]');
    expect(scrollViewport).toHaveClass('scroll-smooth');
  });
});
