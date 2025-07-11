import { faker } from '@faker-js/faker';

export const userFixtures = {
  validUser: {
    id: '123e4567-e89b-12d3-a456-426614174000',
    email: 'test@example.com',
    password: 'TestPassword123!',
    firstName: 'João',
    lastName: 'Silva',
    cpf: '12345678901',
    phone: '11999999999',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  invalidUser: {
    id: '',
    email: 'invalid-email',
    password: '123',
    firstName: '',
    lastName: '',
    cpf: '123',
    phone: '123',
  },

  createUser: () => ({
    id: faker.string.uuid(),
    email: faker.internet.email(),
    password: faker.internet.password({ length: 12 }),
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    cpf: '12345678901', // CPF válido para testes
    phone: `11${faker.string.numeric(9)}`,
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }),

  createManyUsers: (count: number) =>
    Array.from({ length: count }, () => userFixtures.createUser()),
};

export const farmerFixtures = {
  validFarmer: {
    id: '123e4567-e89b-12d3-a456-426614174001',
    name: 'Fazenda São João',
    cpfCnpj: '12345678901234',
    email: 'fazenda@example.com',
    phone: '11999999999',
    address: {
      street: 'Rua das Flores, 123',
      city: 'São Paulo',
      state: 'SP',
      zipCode: '01234567',
    },
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  createFarmer: () => ({
    id: faker.string.uuid(),
    name: faker.company.name(),
    cpfCnpj: faker.string.numeric(14),
    email: faker.internet.email(),
    phone: `11${faker.string.numeric(9)}`,
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('########'),
    },
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }),
};

export const cropFixtures = {
  validCrop: {
    id: '123e4567-e89b-12d3-a456-426614174002',
    crop_name: 'Milho',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  createCrop: () => ({
    id: faker.string.uuid(),
    crop_name: faker.helpers.arrayElement(['Milho', 'Soja', 'Trigo', 'Arroz', 'Feijão']),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }),

  createManyCrops: (count: number) =>
    Array.from({ length: count }, () => cropFixtures.createCrop()),
};

export const propertyFixtures = {
  validProperty: {
    id: '123e4567-e89b-12d3-a456-426614174003',
    name: 'Propriedade Rural São João',
    area: 100.5,
    location: {
      latitude: -23.5505,
      longitude: -46.6333,
    },
    address: {
      street: 'Estrada Rural, Km 15',
      city: 'Campinas',
      state: 'SP',
      zipCode: '13000000',
    },
    farmerId: '123e4567-e89b-12d3-a456-426614174001',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },

  createProperty: () => ({
    id: faker.string.uuid(),
    name: `Propriedade ${faker.location.city()}`,
    area: faker.number.float({ min: 10, max: 1000, fractionDigits: 2 }),
    location: {
      latitude: faker.location.latitude({ min: -35, max: 5 }),
      longitude: faker.location.longitude({ min: -75, max: -30 }),
    },
    address: {
      street: faker.location.streetAddress(),
      city: faker.location.city(),
      state: faker.location.state({ abbreviated: true }),
      zipCode: faker.location.zipCode('########'),
    },
    farmerId: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }),
};

export const harvestFixtures = {
  validHarvest: {
    id: '123e4567-e89b-12d3-a456-426614174004',
    quantity: 1500.75,
    unit: 'kg',
    harvestDate: new Date('2024-06-15'),
    quality: 'A',
    observations: 'Colheita realizada em condições ideais',
    propertyId: '123e4567-e89b-12d3-a456-426614174003',
    cropId: '123e4567-e89b-12d3-a456-426614174002',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-06-15'),
  },

  createHarvest: () => ({
    id: faker.string.uuid(),
    quantity: faker.number.float({ min: 100, max: 5000, fractionDigits: 2 }),
    unit: faker.helpers.arrayElement(['kg', 'ton', 'saca']),
    harvestDate: faker.date.recent(),
    quality: faker.helpers.arrayElement(['A', 'B', 'C']),
    observations: faker.lorem.sentence(),
    propertyId: faker.string.uuid(),
    cropId: faker.string.uuid(),
    createdAt: faker.date.past(),
    updatedAt: faker.date.recent(),
  }),
};

// Cenários de erro para testes
export const errorScenarios = {
  networkError: new Error('Network Error'),
  databaseError: new Error('Database connection failed'),
  validationError: new Error('Validation failed'),
  unauthorizedError: new Error('Unauthorized access'),
  notFoundError: new Error('Resource not found'),
  serverError: new Error('Internal server error'),
};

// Respostas mock para APIs externas
export const externalApiMocks = {
  ibgeSuccess: {
    states: [
      { id: 35, sigla: 'SP', nome: 'São Paulo' },
      { id: 31, sigla: 'MG', nome: 'Minas Gerais' },
    ],
    cities: [
      { id: 3550308, nome: 'São Paulo' },
      { id: 3509502, nome: 'Campinas' },
    ],
  },

  ibgeError: {
    error: 'Service unavailable',
    status: 503,
  },
};
