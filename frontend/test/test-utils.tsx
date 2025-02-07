import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { MantineProvider } from '@mantine/core';

function render(ui: React.ReactElement, options = {}) {
  return rtlRender(
    <MantineProvider withGlobalStyles withNormalizeCSS>
      {ui}
    </MantineProvider>,
    options
  );
}

// re-export everything
export * from '@testing-library/react';

// override render method
export { render };