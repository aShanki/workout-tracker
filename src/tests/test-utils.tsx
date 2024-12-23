import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import * as ToastPrimitives from "@radix-ui/react-toast";

// Create a mock toast provider that implements the Radix UI context
const MockToastProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <ToastPrimitives.Provider>
      {children}
      <ToastPrimitives.Viewport />
    </ToastPrimitives.Provider>
  );
};

// Mock toast context
const ToastContext = React.createContext<{
  toast: (args: { title?: string; description?: string }) => void;
  toasts: any[];
}>({
  toast: () => {},
  toasts: [],
});

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <ToastContext.Provider value={{ toast: () => {}, toasts: [] }}>
      <MockToastProvider>
        {children}
      </MockToastProvider>
    </ToastContext.Provider>
  );
}

export function render(ui: React.ReactElement, options = {}) {
  return rtlRender(ui, {
    wrapper: Wrapper,
    ...options,
  });
}

export * from '@testing-library/react';