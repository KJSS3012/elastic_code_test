import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { type Producer } from '../../stores/producer/slice';
import Producers from '../../pages/producer';

// Mock da API
jest.mock('../../services/api', () => ({
  apiService: {
    updateFarmer: jest.fn(),
    createFarmer: jest.fn(),
    deleteFarmer: jest.fn(),
  }
}));

const mockProducer: Producer = {
  id: '1',
  cpf: '123.456.789-01',
  cnpj: undefined,
  producer_name: 'João Silva',
  email: 'joao@email.com',
  phone: '+55 11 99999-9999',
  farms: []
};

const mockProducerWithCNPJ: Producer = {
  id: '2',
  cpf: '',
  cnpj: '12.345.678/0001-99',
  producer_name: 'Maria Empresa',
  email: 'maria@empresa.com',
  phone: '+55 11 88888-8888',
  farms: []
};

const createMockStore = (initialState = { producers: [mockProducer, mockProducerWithCNPJ], loading: false }) => {
  return configureStore({
    reducer: {
      producerReducer: () => initialState,
      authReducer: () => ({
        user: { role: 'admin' },
        loading: false,
        token: null
      })
    }
  });
};

describe('Producers Component', () => {
  test('should render producer information', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Producers />
      </Provider>
    );

    expect(screen.getByText('João Silva')).toBeInTheDocument();
    expect(screen.getByText('joao@email.com')).toBeInTheDocument();
    expect(screen.getByText('CPF: 123.456.789-01')).toBeInTheDocument();
    expect(screen.getByText('+55 11 99999-9999')).toBeInTheDocument();
  });

  test('should open dialog when add button is clicked', () => {
    const store = createMockStore();

    render(
      <Provider store={store}>
        <Producers />
      </Provider>
    );

    fireEvent.click(screen.getByText('Adicionar Produtor'));
    expect(screen.getByText('Novo Produtor')).toBeInTheDocument();
  });

  test('should render producer with CNPJ', () => {
    const store = createMockStore({
      producers: [mockProducerWithCNPJ],
      loading: false
    });

    render(
      <Provider store={store}>
        <Producers />
      </Provider>
    );

    expect(screen.getByText('Maria Empresa')).toBeInTheDocument();
    expect(screen.getByText('maria@empresa.com')).toBeInTheDocument();
    expect(screen.getByText('CNPJ: 12.345.678/0001-99')).toBeInTheDocument();
    expect(screen.getByText('+55 11 88888-8888')).toBeInTheDocument();
  });
});
