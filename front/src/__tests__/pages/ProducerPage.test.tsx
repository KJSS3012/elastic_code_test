import { screen, waitFor, fireEvent } from '@testing-library/react';
import ProducerPage from '../../pages/producer';
import { renderWithAllProviders } from '../utils/test-utils';

// Mock do serviço de API
jest.mock('../../services/api', () => ({
  apiService: {
    login: jest.fn(),
    register: jest.fn(),
    getCurrentUser: jest.fn(),
    getAllProducers: jest.fn().mockResolvedValue([
      {
        id: '1',
        producer_name: 'João Silva',
        cpf: '12345678901',
        email: 'joao@email.com',
        phone: '(11) 99999-9999'
      },
      {
        id: '2',
        producer_name: 'Maria Santos',
        cpf: '98765432100',
        email: 'maria@email.com',
        phone: '(11) 88888-8888'
      },
      {
        id: '3',
        producer_name: 'Pedro Oliveira',
        cpf: '11122233344',
        email: 'pedro@email.com',
        phone: '(11) 77777-7777'
      }
    ]),
    getAllFarmers: jest.fn().mockResolvedValue({
      data: [
        {
          id: '1',
          producer_name: 'João Silva',
          cpf: '12345678901',
          email: 'joao@email.com',
          phone: '(11) 99999-9999'
        },
        {
          id: '2',
          producer_name: 'Maria Santos',
          cpf: '98765432100',
          email: 'maria@email.com',
          phone: '(11) 88888-8888'
        },
        {
          id: '3',
          producer_name: 'Pedro Oliveira',
          cpf: '11122233344',
          email: 'pedro@email.com',
          phone: '(11) 77777-7777'
        }
      ],
      total: 3,
      page: 1,
      limit: 100
    }),
    getAllFarmersWithProperties: jest.fn(),
    createProducer: jest.fn(),
    updateProducer: jest.fn(),
    deleteProducer: jest.fn(),
    updateFarmer: jest.fn(),
    deleteFarmer: jest.fn(),
    getAllProperties: jest.fn(),
    createProperty: jest.fn(),
    updateProperty: jest.fn(),
    deleteProperty: jest.fn(),
    getAdminDashboardStats: jest.fn(),
    getFarmerDashboardStats: jest.fn()
  }
}));

describe('ProducerPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders producer page container', () => {
    renderWithAllProviders(<ProducerPage />);
    // Verifica se o container principal é renderizado
    expect(document.querySelector('.MuiContainer-root')).toBeInTheDocument();
  });

  test('should call getAllFarmers API', async () => {
    const { apiService } = require('../../services/api');
    renderWithAllProviders(<ProducerPage />);

    // Aguardar a chamada da API que é feita pelo Redux store
    await waitFor(() => {
      expect(apiService.getAllFarmers).toHaveBeenCalled();
    }, { timeout: 5000 });
  });

  test('should handle producer deletion', async () => {
    renderWithAllProviders(<ProducerPage />);

    // Aguardar os dados carregarem e o primeiro card aparecer
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    }, { timeout: 8000 });

    // Aguardar os botões de delete aparecerem
    await waitFor(() => {
      const deleteButtons = screen.getAllByTestId('delete-producer');
      expect(deleteButtons.length).toBeGreaterThan(0);
      return deleteButtons;
    }, { timeout: 3000 });

    const deleteButtons = screen.getAllByTestId('delete-producer');
    fireEvent.click(deleteButtons[0]);

    // Verifica se o modal de confirmação aparece
    await waitFor(() => {
      expect(screen.getByText(/tem certeza que deseja excluir/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  }, 15000); // Timeout maior para este teste

  test('should handle producer editing', async () => {
    renderWithAllProviders(<ProducerPage />);

    // Aguardar os dados carregarem e o primeiro card aparecer
    await waitFor(() => {
      expect(screen.getByText('João Silva')).toBeInTheDocument();
    }, { timeout: 8000 });

    // Aguardar os botões de edit aparecerem
    await waitFor(() => {
      const editButtons = screen.getAllByTestId('edit-producer');
      expect(editButtons.length).toBeGreaterThan(0);
      return editButtons;
    }, { timeout: 3000 });

    const editButtons = screen.getAllByTestId('edit-producer');
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText('Editar Produtor')).toBeInTheDocument();
    }, { timeout: 3000 });
  }, 15000); // Timeout maior para este teste
});
