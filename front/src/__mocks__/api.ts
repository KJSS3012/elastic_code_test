import { mockProducers, mockProperties, mockDashboardStats } from './data';

// Mock do serviço de API
export const mockApiService = {
  // Auth
  login: jest.fn().mockResolvedValue({
    token: 'mock-jwt-token',
    user: mockProducers[0]
  }),

  register: jest.fn().mockResolvedValue({
    message: 'User registered successfully'
  }),

  getCurrentUser: jest.fn().mockResolvedValue(mockProducers[0]),

  // Producers
  getAllProducers: jest.fn().mockResolvedValue({
    data: mockProducers,
    total: mockProducers.length,
    page: 1,
    lastPage: 1
  }),

  createProducer: jest.fn().mockResolvedValue(mockProducers[0]),

  updateProducer: jest.fn().mockResolvedValue({
    ...mockProducers[0],
    producer_name: 'João Silva Updated'
  }),

  deleteProducer: jest.fn().mockResolvedValue({
    message: 'Producer deleted successfully'
  }),

  // Properties
  getAllProperties: jest.fn().mockResolvedValue({
    data: mockProperties,
    total: mockProperties.length,
    page: 1,
    lastPage: 1
  }),

  getPropertyById: jest.fn().mockResolvedValue(mockProperties[0]),

  createProperty: jest.fn().mockResolvedValue(mockProperties[0]),

  updateProperty: jest.fn().mockResolvedValue({
    ...mockProperties[0],
    name: 'Fazenda Updated'
  }),

  deleteProperty: jest.fn().mockResolvedValue({
    message: 'Property deleted successfully'
  }),

  // Dashboard
  getAdminDashboardStats: jest.fn().mockResolvedValue(mockDashboardStats),

  getFarmerDashboardStats: jest.fn().mockResolvedValue({
    ...mockDashboardStats,
    totalFarmers: 1,
    totalProperties: 1
  })
};

// Mock do axios para interceptar requisições
export const mockAxios = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  interceptors: {
    request: {
      use: jest.fn()
    },
    response: {
      use: jest.fn()
    }
  }
};
