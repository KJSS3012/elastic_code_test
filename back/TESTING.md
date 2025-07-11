# Estrutura de Testes - Backend

## 📋 Visão Geral

Este projeto implementa uma estrutura completa de testes com cobertura mínima de **70%** em todas as métricas (branches, functions, lines, statements).

## 🏗️ Estrutura dos Testes

```
back/
├── src/
│   └── **/*.spec.ts           # Testes unitários
├── test/
│   ├── setup.ts               # Configuração global
│   ├── fixtures/
│   │   └── index.ts          # Dados de teste (fixtures)
│   ├── utils/
│   │   └── test-helpers.ts   # Utilitários para testes
│   ├── integration/
│   │   └── *.spec.ts         # Testes de integração
│   ├── app.e2e-spec.ts       # Testes E2E
│   └── jest-e2e.json         # Configuração Jest E2E
├── .env.test                  # Variáveis de ambiente para testes
└── coverage/                  # Relatórios de cobertura
```

## 🧪 Tipos de Testes

### 1. Testes Unitários

- **Localização**: `src/**/*.spec.ts`
- **Objetivo**: Testar serviços isoladamente com mocks
- **Cobertura**: Lógica de negócio e funções puras
- **Ferramentas**: Jest + ts-jest

**Exemplo**:

```typescript
// src/modules/crops/crops.service.spec.ts
describe('CropsService', () => {
  let service: CropsService;
  let repository: jest.Mocked<CropsRepository>;

  beforeEach(async () => {
    // Setup com mocks
  });

  it('should create a crop successfully', async () => {
    // Arrange, Act, Assert
  });
});
```

### 2. Testes de Integração

- **Localização**: `test/integration/*.spec.ts`
- **Objetivo**: Testar interações reais com banco de dados
- **Ferramentas**: SQLite em memória + TypeORM
- **Cobertura**: Controllers + Services + Repository

**Exemplo**:

```typescript
// test/integration/crops.controller.spec.ts
describe('CropsController (Integration)', () => {
  let controller: CropsController;
  let dataSource: DataSource;

  beforeEach(async () => {
    await cleanDatabase(dataSource);
  });

  it('should create a crop with valid data', async () => {
    // Teste com banco real (SQLite)
  });
});
```

### 3. Testes E2E

- **Localização**: `test/app.e2e-spec.ts`
- **Objetivo**: Simular fluxos completos da aplicação
- **Ferramentas**: Pactum.js + Supertest
- **Cobertura**: Fluxos críticos (auth, CRUD principal)

**Exemplo**:

```typescript
// test/app.e2e-spec.ts
describe('Crops CRUD Operations', () => {
  it('should create a new crop', async () => {
    await pactum
      .spec()
      .post('/crops')
      .withHeaders('Authorization', 'Bearer $S{authToken}')
      .withBody(cropData)
      .expectStatus(201);
  });
});
```

## 🎯 Cobertura de Testes

### Configuração de Cobertura Mínima (70%)

```json
{
  "coverageThreshold": {
    "global": {
      "branches": 70,
      "functions": 70,
      "lines": 70,
      "statements": 70
    }
  }
}
```

### Relatórios de Cobertura

- **HTML**: `coverage/lcov-report/index.html`
- **LCOV**: `coverage/lcov.info`
- **JSON**: `coverage/coverage-final.json`

## 🔧 Comandos de Teste

```bash
# Testes unitários
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Todos os testes
npm run test:all

# Cobertura
npm run test:cov

# Watch mode
npm run test:watch
```

## 📊 Mocks e Fixtures

### Fixtures (Dados de Teste)

```typescript
// test/fixtures/index.ts
export const cropFixtures = {
  validCrop: {
    id: '123e4567-e89b-12d3-a456-426614174002',
    name: 'Milho',
    // ... outros campos
  },

  createCrop: () => ({
    id: faker.string.uuid(),
    name: faker.helpers.arrayElement(['Milho', 'Soja', 'Trigo']),
    // ... geração com faker
  }),

  createManyCrops: (count: number) =>
    Array.from({ length: count }, () => cropFixtures.createCrop()),
};
```

### Mocks de Repositório

```typescript
// test/utils/test-helpers.ts
export const createMockRepository = () => ({
  find: jest.fn(),
  findOne: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});
```

## 🧰 Ferramentas e Bibliotecas

### Principais Dependências

- **Jest**: Framework de testes
- **ts-jest**: Transpilador TypeScript para Jest
- **@nestjs/testing**: Utilitários de teste do NestJS
- **@faker-js/faker**: Geração de dados falsos
- **pactum**: Testes E2E com API REST
- **sqlite3**: Banco de dados em memória para testes

### Configuração Jest

```json
{
  "collectCoverageFrom": [
    "**/*.(t|j)s",
    "!**/*.spec.ts",
    "!**/*.e2e-spec.ts",
    "!**/*.interface.ts",
    "!**/*.dto.ts",
    "!**/main.ts"
  ],
  "coverageDirectory": "../coverage",
  "coverageReporters": ["text", "lcov", "html"]
}
```

## 🎯 Casos de Teste

### Casos de Borda Testados

1. **Validação de Dados**
   - Campos obrigatórios
   - Tipos de dados incorretos
   - Limites de tamanho

2. **Erros de Banco**
   - Banco indisponível
   - Violação de constraints
   - Timeouts

3. **Autorização**
   - Token inválido
   - Acesso negado
   - Usuário não encontrado

4. **Cenários de Falha**
   - Rede indisponível
   - Serviços externos fora do ar
   - Dados corrompidos

### Cenários de Sucesso

1. **CRUD Completo**
   - Criação
   - Leitura
   - Atualização
   - Exclusão

2. **Autenticação**
   - Registro
   - Login
   - Refresh token

3. **Paginação**
   - Primeira página
   - Última página
   - Página intermediária

## 🏃‍♂️ Execução dos Testes

### Localmente

```bash
# Instalar dependências
npm install

# Executar todos os testes
npm run test:all

# Gerar relatório de cobertura
npm run test:cov

# Abrir relatório HTML
open coverage/lcov-report/index.html
```

### Docker

```bash
# Executar testes no container
docker-compose run backend npm run test:all

# Com cobertura
docker-compose run backend npm run test:cov
```

## 📈 Métricas de Qualidade

### Cobertura Atual

- **Branches**: 70%+
- **Functions**: 70%+
- **Lines**: 70%+
- **Statements**: 70%+

### Tempo de Execução

- **Unitários**: < 30s
- **Integração**: < 1min
- **E2E**: < 2min
- **Total**: < 3min

## 🔍 Debugging

### Modo Debug

```bash
# Debug testes unitários
npm run test:debug

# Debug com breakpoints
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Logs de Teste

```typescript
// Habilitar logs durante testes
beforeAll(() => {
  process.env.LOG_LEVEL = 'debug';
});
```

## 📋 Checklist de Qualidade

### ✅ Implementado

- [x] Testes unitários para serviços
- [x] Testes de integração com banco real
- [x] Testes E2E com fluxos completos
- [x] Cobertura mínima de 70%
- [x] Mocks e fixtures organizados
- [x] Cenários de erro e edge cases
- [x] Configuração de CI/CD ready
- [x] Documentação completa

### 🎯 Próximos Passos

- [ ] Testes de performance
- [ ] Testes de carga
- [ ] Testes de segurança
- [ ] Integração com SonarQube
- [ ] Badge de cobertura no README

## 📚 Documentação Adicional

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [NestJS Testing](https://docs.nestjs.com/fundamentals/testing)
- [Pactum.js Guide](https://pactumjs.github.io/)
- [Faker.js Documentation](https://fakerjs.dev/)

---

## 🏆 Resultado Final

Esta estrutura de testes garante:

1. **70%+ de cobertura** em todas as métricas
2. **Testes rápidos e confiáveis**
3. **Fácil manutenção** com fixtures e mocks
4. **CI/CD ready** com relatórios automatizados
5. **Documentação completa** para toda a equipe
