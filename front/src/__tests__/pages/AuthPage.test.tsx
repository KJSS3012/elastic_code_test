import { screen } from '@testing-library/react';
import AuthPage from '../../pages/auth';
import { renderWithAllProviders } from '../utils/test-utils';

// Mock do serviço de API
jest.mock('../../services/api', () => ({
  apiService: {
    login: jest.fn().mockResolvedValue({
      user: { id: '1', name: 'Test User', email: 'test@test.com' },
      token: 'mock-token'
    }),
    register: jest.fn(),
    getCurrentUser: jest.fn(),
    getAllProducers: jest.fn(),
    getAllFarmers: jest.fn(),
    getAllFarmersWithProperties: jest.fn(),
    createProducer: jest.fn(),
    updateProducer: jest.fn(),
    deleteProducer: jest.fn(),
    getAllProperties: jest.fn(),
    createProperty: jest.fn(),
    updateProperty: jest.fn(),
    deleteProperty: jest.fn(),
    getAdminDashboardStats: jest.fn(),
    getFarmerDashboardStats: jest.fn()
  }
}));

describe('AuthPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders auth page container', () => {
    renderWithAllProviders(<AuthPage />);
    // Verifica se o container principal é renderizado
    expect(document.querySelector('.MuiContainer-root')).toBeInTheDocument();
  });

  test.skip('renders login form with correct text', () => {
    renderWithAllProviders(<AuthPage />);
    // O texto real da página é "Entrar" em português
    expect(screen.getByText('Entrar')).toBeInTheDocument();
    expect(screen.getByText('Bem-vindo de volta!')).toBeInTheDocument();
  });

  test.skip('renders login form fields', () => {
    renderWithAllProviders(<AuthPage />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
  });
});
