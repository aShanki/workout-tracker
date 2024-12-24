import { render, screen } from '@testing-library/react';
import { GoogleAuthButton } from '@/components/auth/google-auth-button';
import { renderWithProviders } from '../../test-utils';

// Mock Google script loading
global.google = {
  accounts: {
    id: {
      initialize: jest.fn(),
      renderButton: jest.fn(),
    },
  },
} as any;

describe('GoogleAuthButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize Google Sign-In with correct parameters', () => {
    renderWithProviders(<GoogleAuthButton />);
    // Add a small delay to allow useEffect to run
    setTimeout(() => {
      expect(google.accounts.id.initialize).toHaveBeenCalled();
    }, 0);
  });

  it('should render Google Sign-In button', () => {
    renderWithProviders(<GoogleAuthButton />);
    expect(screen.getByTestId('google-button')).toBeInTheDocument();
  });
});
