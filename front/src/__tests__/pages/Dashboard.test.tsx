import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from '../../pages/dashboard';
import authReducer from '../../stores/auth/slice';
import producerReducer from '../../stores/producer/slice';
import { mockUser, mockDashboardStats } from '../../__mocks__/data';
import { mockApiService } from '../../__mocks__/api';

jest.mock('../../services/api', () => ({
  apiService: mockApiService
}));

const createMockStore = (authState = {}, producerState = {}) => {
  return configureStore({
    reducer: {
      authReducer: authReducer,
      producerReducer: producerReducer
    },
    preloadedState: {
      authReducer: {
        user: mockUser,
        token: 'mock-token',
        isAuthenticated: true,
        loading: false,
        error: null,
        ...authState
      },
      producerReducer: {
        producers: [],
        myFarms: [],
        dashboardStats: mockDashboardStats,
        loading: false,
        error: null,
        ...producerState
      }
    }
  });
};

const renderWithProvider = (component: React.ReactElement, authState = {}, producerState = {}) => {
  const store = createMockStore(authState, producerState);
  return render(
    <Provider store={store}>
      {component}
    </Provider>
  );
};

describe('Dashboard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders dashboard with user name', () => {
    renderWithProvider(<Dashboard />);

    expect(screen.getByText(/bem-vindo, joão silva/i)).toBeInTheDocument();
  });

  test('displays loading state', () => {
    renderWithProvider(<Dashboard />, {}, { loading: true, dashboardStats: null });

    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('renders KPI cards with correct data', () => {
    renderWithProvider(<Dashboard />);

    expect(screen.getByText('Total de Produtores')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();

    expect(screen.getByText('Total de Propriedades')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    expect(screen.getByText('Total de Hectares')).toBeInTheDocument();
    expect(screen.getByText('450.5 ha')).toBeInTheDocument();

    expect(screen.getByText('Total de Culturas')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('renders charts when data is available', () => {
    renderWithProvider(<Dashboard />);

    expect(screen.getByText('Propriedades por Estado')).toBeInTheDocument();
    expect(screen.getByText('Distribuição de Culturas')).toBeInTheDocument();
  });

  test('handles empty dashboard stats gracefully', () => {
    const emptyStats = {
      totalFarmers: 0,
      totalProperties: 0,
      totalHectares: 0,
      totalCrops: 0,
      propertiesByState: [],
      cropDistribution: []
    };

    renderWithProvider(<Dashboard />, {}, { dashboardStats: emptyStats });

    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText('0 ha')).toBeInTheDocument();
  });

  test('fetches dashboard data on mount', async () => {
    renderWithProvider(<Dashboard />);

    await waitFor(() => {
      expect(mockApiService.getAdminDashboardStats).toHaveBeenCalled();
    });
  });
});
