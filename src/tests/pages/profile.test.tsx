import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ProfilePage from '@/app/(protected)/profile/page';
import { useProfile } from '@/hooks/use-profile';
import { useTheme } from 'next-themes';

jest.mock('@/hooks/use-profile');
jest.mock('next-themes');

const mockUseProfile = useProfile as jest.MockedFunction<typeof useProfile>;
const mockUseTheme = useTheme as jest.MockedFunction<typeof useTheme>;

describe('ProfilePage', () => {
  beforeEach(() => {
    mockUseProfile.mockReturnValue({
      profile: {
        id: '1',
        username: 'testuser',
        avatar_url: null,
        full_name: 'Test User',
        bio: 'Test bio',
      },
      isLoading: false,
      error: null,
      updateProfile: jest.fn(),
      fetchProfile: jest.fn(),
    });

    mockUseTheme.mockReturnValue({
      theme: 'light',
      setTheme: jest.fn(),
      themes: ['light', 'dark'],
    } as any);
  });

  it('should render profile information', () => {
    render(<ProfilePage />);
    
    // Check for inputs with default values
    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument();
  });

  it('should handle image upload', async () => {
    const mockUpdateProfile = jest.fn().mockResolvedValue({ error: null });
    mockUseProfile.mockReturnValue({
      profile: {
        id: '1',
        username: 'testuser',
        avatar_url: null,
      },
      isLoading: false,
      error: null,
      updateProfile: mockUpdateProfile,
      fetchProfile: jest.fn(),
    });

    render(<ProfilePage />);
    const fileInput = screen.getByLabelText(/upload image/i);
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    
    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        id: '1',
        username: 'testuser',
        avatar_url: 'placeholder-url',
      });
    });
  });

  it('should switch between tabs', () => {
    render(<ProfilePage />);
    
    // Check if tabs are rendered
    expect(screen.getByRole('tab', { name: /profile/i })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: /settings/i })).toBeInTheDocument();
    
    // Check if profile form is visible by default
    expect(screen.getByRole('button', { name: /save changes/i })).toBeInTheDocument();
  });
});
