import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ImageUpload } from '@/components/profile/image-upload';
import { ToastProvider } from '@/components/ui/toast';

// Mock the toast hook
const mockToast = jest.fn();
jest.mock('@/components/ui/use-toast', () => ({
  useToast: () => ({ toast: mockToast }),
}));

describe('ImageUpload', () => {
  const mockOnUpload = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderImageUpload = () => {
    return render(
      <ToastProvider>
        <ImageUpload onUpload={mockOnUpload} />
      </ToastProvider>
    );
  };

  it('should render upload button', () => {
    renderImageUpload();
    expect(screen.getByLabelText(/upload image/i)).toBeInTheDocument();
  });

  it('should handle file selection', async () => {
    renderImageUpload();
    
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const input = screen.getByLabelText(/upload image/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(mockOnUpload).toHaveBeenCalled();
    });
  });

  it('should show error for invalid file type', async () => {
    renderImageUpload();
    
    const file = new File(['test'], 'test.txt', { type: 'text/plain' });
    const input = screen.getByLabelText(/upload image/i);
    
    fireEvent.change(input, { target: { files: [file] } });
    
    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        variant: 'destructive',
        description: 'Only image files are allowed',
      });
    });
  });
});
