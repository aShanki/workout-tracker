import { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { ToastProvider } from '@/components/ui/toast';

// Create router context
export const RouterContext = jest.fn();

// Mock useRouter hook
const mockRouter = {
  push: jest.fn(),
  replace: jest.fn(),
  prefetch: jest.fn(),
  back: jest.fn(),
};

// Mock the entire next/navigation module
jest.mock('next/navigation', () => ({
  useRouter: () => mockRouter,
  usePathname: () => '',
}));

// Define props interface for Provider
interface ProvidersProps {
  children: React.ReactNode;
}

// Create providers component
function Providers({ children }: ProvidersProps) {
  return (
    <ToastProvider>
      {children}
    </ToastProvider>
  );
}

// Extend render options to include router mock
interface CustomRenderOptions {
  router?: typeof mockRouter;
}

function customRender(
  ui: ReactElement,
  options?: CustomRenderOptions
) {
  return {
    ...render(ui, {
      wrapper: Providers,
      ...options,
    }),
    mockRouter,
  };
}

export * from '@testing-library/react';
export { customRender as render };
