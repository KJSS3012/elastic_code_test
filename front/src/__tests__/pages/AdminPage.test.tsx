import AdminPage from '../../pages/admin';
import { renderWithAllProviders } from '../utils/test-utils';

// Mock do serviço de API
jest.mock('../../services/api', () => ({
  apiService: {
    login: jest.fn(),
    register: jest.fn(),
    getCurrentUser: jest.fn(),
    getAllProducers: jest.fn(),
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
      totalFarmers: 3,
      totalProperties: 0,
      totalHectares: 1200.5,
      totalCrops: 5,
      totalHarvests: 4
    }),
    getFarmerDashboardStats: jest.fn()
  }
}));

describe('AdminPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders admin page container', () => {
    renderWithAllProviders(<AdminPage />);
    // Verifica se o container principal é renderizado
    expect(document.querySelector('.MuiContainer-root')).toBeInTheDocument();
  });
});
