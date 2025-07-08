import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import producerReducer, { type Producer } from '../../stores/producer/slice';
import Producers from '../../pages/producer';

const mockProducer: Producer = {
  id: '1',
  document: '123.456.789-01',
  document_type: 'CPF',
  producer_name: 'João Silva',
  farms: []
};

const createMockStore = (initialState = { producers: [mockProducer], loading: false }) => {
  return configureStore({
    reducer: {
      producerReducer: () => initialState
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
    expect(screen.getByText('CPF: 123.456.789-01')).toBeInTheDocument();
    expect(screen.getByText('Fazendas: 0')).toBeInTheDocument();
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
});
