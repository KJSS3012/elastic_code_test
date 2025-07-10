import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import ProducerPage from '../../pages/producer';
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

describe('ProducerPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should render producer page header', async () => {
    renderWithProviders(<ProducerPage />);

    await waitFor(() => {
      expect(screen.getByText('Meus Dados')).toBeInTheDocument();
    });
  });

  test('should render producer list', async () => {
    renderWithProviders(<ProducerPage />);

    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
      expect(screen.getByText('Maria Santos')).toBeInTheDocument();
      expect(screen.getByText('Pedro Oliveira')).toBeInTheDocument();
    });
  });

  test('should display producer details', async () => {
    renderWithProviders(<ProducerPage />);

    await waitFor(() => {
      expect(screen.getByText('12345678901')).toBeInTheDocument(); // CPF
      expect(screen.getByText('joao@email.com')).toBeInTheDocument(); // Email
    });
  });

  test('should render add producer button', async () => {
    renderWithProviders(<ProducerPage />);

    await waitFor(() => {
      expect(screen.getByText('Adicionar Produtor')).toBeInTheDocument();
    });
  });

  test('should open add producer dialog', async () => {
    renderWithProviders(<ProducerPage />);

    await waitFor(() => {
      const addButton = screen.getByText('Adicionar Produtor');
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByText('Novo Produtor')).toBeInTheDocument();
    });
  });

  test('should render producer form fields', async () => {
    renderWithProviders(<ProducerPage />);

    await waitFor(() => {
      const addButton = screen.getByText('Adicionar Produtor');
      fireEvent.click(addButton);
    });

    await waitFor(() => {
      expect(screen.getByLabelText('Nome')).toBeInTheDocument();
      expect(screen.getByLabelText('CPF')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Telefone')).toBeInTheDocument();
    });
  });

  test('should call getAllProducers API', async () => {
    renderWithProviders(<ProducerPage />);

    await waitFor(() => {
      expect(mockApiService.getAllProducers).toHaveBeenCalled();
    });
  });

  test('should handle producer deletion', async () => {
    renderWithProviders(<ProducerPage />);

    await waitFor(() => {
      const deleteButtons = screen.getAllByTestId('delete-producer');
      if (deleteButtons.length > 0) {
        fireEvent.click(deleteButtons[0]);
      }
    });

    // Verifica se o modal de confirmação aparece
    await waitFor(() => {
      expect(screen.getByText(/tem certeza que deseja excluir/i)).toBeInTheDocument();
    });
  });

  test('should handle producer editing', async () => {
    renderWithProviders(<ProducerPage />);

    await waitFor(() => {
      const editButtons = screen.getAllByTestId('edit-producer');
      if (editButtons.length > 0) {
        fireEvent.click(editButtons[0]);
      }
    });

    await waitFor(() => {
      expect(screen.getByText('Editar Produtor')).toBeInTheDocument();
    });
  });
});
