import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProfileForm } from '@/components/profile/profile-form';
import { useProfile } from '@/hooks/use-profile';
import { ToastProvider } from '@/components/ui/toast';

// Mock the profile hook
jest.mock('@/hooks/use-profile');
const mockUseProfile = useProfile as jest.MockedFunction<typeof useProfile>;

describe('ProfileForm', () => {
  const mockProfile = {
    id: '1',
    user_id: '123',
    username: 'testuser',
    full_name: 'Test User',
    bio: 'Test bio',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  beforeEach(() => {
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
      updateProfile: jest.fn(),
      fetchProfile: jest.fn(),
    });
  });

  const renderProfileForm = () => {
    return render(
      <ToastProvider>
        <ProfileForm />
      </ToastProvider>
    );
  };

  it('should render profile form with existing data', () => {
    renderProfileForm();
    
    expect(screen.getByDisplayValue('testuser')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test User')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test bio')).toBeInTheDocument();
  });

  it('should handle form submission', async () => {
    const mockUpdateProfile = jest.fn().mockResolvedValue({ error: null });
    mockUseProfile.mockReturnValue({
      profile: mockProfile,
      isLoading: false,
      error: null,
      updateProfile: mockUpdateProfile,
      fetchProfile: jest.fn(),
    });

    renderProfileForm();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: 'newusername' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        username: 'newusername',
        full_name: 'Test User',
        bio: 'Test bio',
      });
    });
  });

  it('should show validation errors', async () => {
    renderProfileForm();

    fireEvent.change(screen.getByLabelText(/username/i), {
      target: { value: '' },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/username must be at least 3 characters/i)).toBeInTheDocument();
    });
  });

  it('should show bio length validation error', async () => {
    renderProfileForm();

    fireEvent.change(screen.getByLabelText(/bio/i), {
      target: { value: 'a'.repeat(501) },
    });

    fireEvent.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(screen.getByText(/bio must be less than 500 characters/i)).toBeInTheDocument();
    });
  });
});
