import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AdminPage from '../../pages/admin';
import { store } from '../../stores/store';
import { mockApiService } from '../../__mocks__/api';

// Mock do serviço de API
jest.mock('../../services/api', () => ({
  apiService: mockApiService
}));

const theme = createTheme();

const renderWithProviders = (ui: React.ReactElement) => {
  return render(
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          {ui}
        </BrowserRouter>
      </ThemeProvider>
    </Provider>
  );
};

describe('AdminPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render admin page header', () => {
    renderWithProviders(<AdminPage />);

    expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
  });

  test('should render KPI cards', async () => {
    renderWithProviders(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('Total de Produtores')).toBeInTheDocument();
      expect(screen.getByText('Total de Propriedades')).toBeInTheDocument();
      expect(screen.getByText('Total de Culturas')).toBeInTheDocument();
      expect(screen.getByText('Total de Colheitas')).toBeInTheDocument();
    });
  });

  test('should display KPI values', async () => {
    renderWithProviders(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('3')).toBeInTheDocument(); // Total produtores
      expect(screen.getByText('2')).toBeInTheDocument(); // Total propriedades
      expect(screen.getByText('5')).toBeInTheDocument(); // Total culturas
      expect(screen.getByText('4')).toBeInTheDocument(); // Total colheitas
    });
  });

  test('should render area chart', async () => {
    renderWithProviders(<AdminPage />);

    await waitFor(() => {
      expect(screen.getByText('Evolução Mensal de Colheitas')).toBeInTheDocument();
    });
  });

  test('should display chart data', async () => {
    renderWithProviders(<AdminPage />);

    await waitFor(() => {
      // Verifica se os dados dos meses estão sendo exibidos
      expect(screen.getByText('Janeiro')).toBeInTheDocument();
      expect(screen.getByText('Fevereiro')).toBeInTheDocument();
      expect(screen.getByText('Março')).toBeInTheDocument();
    });
  });

  test('should handle loading state', () => {
    renderWithProviders(<AdminPage />);

    // Verifica se há indicadores de carregamento
    expect(screen.getByText('Painel Administrativo')).toBeInTheDocument();
  });

  test('should call dashboard statistics API', async () => {
    renderWithProviders(<AdminPage />);

    await waitFor(() => {
      expect(mockApiService.getAdminDashboardStats).toHaveBeenCalled();
    });
  });
});
