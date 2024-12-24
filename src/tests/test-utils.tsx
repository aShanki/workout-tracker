import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import * as ToastPrimitives from "@radix-ui/react-toast";
import { ToastProvider } from '@/components/ui/toast';

// Mock Next.js navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      refresh: jest.fn(),
      back: jest.fn(),
      forward: jest.fn(),
    };
  },
  usePathname() {
    return '';
  },
}));

// Create a mock toast provider
const MockToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastPrimitives.Provider>
      {children}
      <ToastPrimitives.Viewport />
    </ToastPrimitives.Provider>
  );
};

export function renderWithProviders(ui: React.ReactElement) {
  return rtlRender(
    <MockToastProvider>
      <ToastProvider>
        {ui}
      </ToastProvider>
    </MockToastProvider>
  );
}

export * from '@testing-library/react';