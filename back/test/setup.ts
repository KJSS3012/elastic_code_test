import { faker } from '@faker-js/faker';

// Configure faker para seed consistente em testes
faker.seed(123);

// Configurações globais para testes
beforeAll(() => {
  // Set timezone para testes consistentes
  process.env.TZ = 'America/Sao_Paulo';
});

// Limpar mocks após cada teste
afterEach(() => {
  jest.clearAllMocks();
});

// Configurar timeouts para testes
jest.setTimeout(30000);
