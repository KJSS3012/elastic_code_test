import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { ConfigModule } from '@nestjs/config';

/**
 * Configuração para banco de dados em memória (SQLite) para testes de integração
 */
export const getTestDatabaseConfig = () => ({
  type: 'sqlite' as const,
  database: ':memory:',
  entities: [__dirname + '/../../src/**/*.entity{.ts,.js}'],
  synchronize: true,
  logging: false,
  dropSchema: true,
});

/**
 * Cria um módulo de teste com banco de dados em memória
 */
export const createTestingModule = async (
  modules: any[],
  providers: any[] = [],
  controllers: any[] = [],
) => {
  const moduleBuilder = Test.createTestingModule({
    imports: [
      ConfigModule.forRoot({
        isGlobal: true,
        envFilePath: '.env.test',
      }),
      TypeOrmModule.forRoot(getTestDatabaseConfig()),
      ...modules,
    ],
    providers,
    controllers,
  });

  return moduleBuilder.compile();
};

/**
 * Limpa o banco de dados entre testes
 */
export const cleanDatabase = async (dataSource: DataSource) => {
  const entities = dataSource.entityMetadatas;

  for (const entity of entities) {
    const repository = dataSource.getRepository(entity.name);
    await repository.clear();
  }
};

/**
 * Utilitário para criar mocks de repositórios TypeORM
 */
export const createMockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
  remove: jest.fn(),
  findAndCount: jest.fn(),
  count: jest.fn(),
  query: jest.fn(),
  manager: {
    transaction: jest.fn(),
  },
});

/**
 * Utilitário para esperar por condições em testes assíncronos
 */
export const waitFor = (condition: () => boolean, timeout = 5000): Promise<void> => {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const check = () => {
      if (condition()) {
        resolve();
      } else if (Date.now() - start > timeout) {
        reject(new Error('Timeout waiting for condition'));
      } else {
        setTimeout(check, 100);
      }
    };

    check();
  });
};

/**
 * Mock para services externos
 */
export const createExternalServiceMock = () => ({
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
  patch: jest.fn(),
});

/**
 * Utilitário para simular delays em testes
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Configuração de headers padrão para testes
 */
export const getTestHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
};

/**
 * Utilitário para validar estrutura de resposta da API
 */
export const expectApiResponse = (response: any, expectedKeys: string[]) => {
  expect(response).toBeDefined();
  expect(typeof response).toBe('object');

  for (const key of expectedKeys) {
    expect(response).toHaveProperty(key);
  }
};

/**
 * Utilitário para validar erros de validação
 */
export const expectValidationError = (error: any, field?: string) => {
  expect(error).toBeDefined();
  expect(error.statusCode).toBe(400);
  expect(error.message).toBeDefined();

  if (field) {
    expect(error.message).toContain(field);
  }
};
