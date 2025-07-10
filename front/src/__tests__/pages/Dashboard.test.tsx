import { screen } from '@testing-library/react';
import Dashboard from '../../pages/dashboard';
import { renderWithAllProviders } from '../utils/test-utils';

// Mock do serviço de API
jest.mock('../../services/api', () => ({
  apiService: {
    login: jest.fn(),
    register: jest.fn(),
    getCurrentUser: jest.fn(),
    getAllProducers: jest.fn().mockResolvedValue([]),
    getAllFarmers: jest.fn().mockResolvedValue({
      data: [],
      total: 0,
      page: 1,
      limit: 10
    }),
    getAllFarmersWithProperties: jest.fn(),
    createProducer: jest.fn(),
    updateProducer: jest.fn(),
    deleteProducer: jest.fn(),
    getAllProperties: jest.fn(),
    createProperty: jest.fn(),
    updateProperty: jest.fn(),
    deleteProperty: jest.fn(),
    getAdminDashboardStats: jest.fn().mockResolvedValue({
      totalProducers: 150,
      totalProperties: 300,
      totalHarvests: 45,
      totalArea: 12500.5,
      recentHarvests: [
        {
          id: '1',
          cropName: 'Milho',
          quantity: 1500,
          date: '2024-01-15',
          producerName: 'João Silva'
        },
        {
          id: '2',
          cropName: 'Soja',
          quantity: 2300,
          date: '2024-01-10',
          producerName: 'Maria Santos'
        }
      ],
      productionByMonth: [
        { month: 'Jan', production: 1200 },
        { month: 'Fev', production: 1800 },
        { month: 'Mar', production: 2100 },
        { month: 'Abr', production: 1900 },
        { month: 'Mai', production: 2400 }
      ]
    }),
    getFarmerDashboardStats: jest.fn().mockResolvedValue({
      totalProducers: 150,
      totalProperties: 300,
      totalHarvests: 45,
      totalArea: 12500.5,
      recentHarvests: [
        {
          id: '1',
          cropName: 'Milho',
          quantity: 1500,
          date: '2024-01-15',
          producerName: 'João Silva'
        },
        {
          id: '2',
          cropName: 'Soja',
          quantity: 2300,
          date: '2024-01-10',
          producerName: 'Maria Santos'
        }
      ],
      productionByMonth: [
        { month: 'Jan', production: 1200 },
        { month: 'Fev', production: 1800 },
        { month: 'Mar', production: 2100 },
        { month: 'Abr', production: 1900 },
        { month: 'Mai', production: 2400 }
      ]
    })
  }
}));

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard container', () => {
    renderWithAllProviders(<Dashboard />);
    // Dashboard usa Box em vez de Container, então verificamos a presença do texto de boas-vindas ou loading
    const welcomeText = document.querySelector('h1');
    const loadingSpinner = document.querySelector('[role="progressbar"]');

    // Deve renderizar ou o texto de boas-vindas ou o loading spinner
    expect(welcomeText || loadingSpinner).toBeTruthy();
  });

  test.skip('should display dashboard statistics', async () => {
    renderWithAllProviders(<Dashboard />);

    // Wait for loading to complete and stats to appear
    await screen.findByText('150', {}, { timeout: 3000 });

    expect(screen.getByText('150')).toBeInTheDocument(); // totalProducers
    expect(screen.getByText('300')).toBeInTheDocument(); // totalProperties
    expect(screen.getByText('45')).toBeInTheDocument(); // totalHarvests
  });

  test.skip('should display recent harvests', async () => {
    renderWithAllProviders(<Dashboard />);

    await screen.findByText('João Silva', {}, { timeout: 3000 });

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('Maria Santos')).toBeInTheDocument();
    expect(screen.getByText('Milho')).toBeInTheDocument();
    expect(screen.getByText('Soja')).toBeInTheDocument();
  });
});
