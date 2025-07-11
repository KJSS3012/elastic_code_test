import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { store } from '../../stores/store';
import { NotificationProvider } from '../../contexts/NotificationContext';

const theme = createTheme();

export const renderWithAllProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <NotificationProvider>
          <BrowserRouter>
            {ui}
          </BrowserRouter>
        </NotificationProvider>
      </ThemeProvider>
    </Provider>
  );
};

// Test para evitar erro do Jest
describe('test-utils', () => {
  test('should export renderWithAllProviders', () => {
    expect(renderWithAllProviders).toBeDefined();
  });
});
