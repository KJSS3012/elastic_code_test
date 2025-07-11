# Elastic Code - Sistema de Gestão Agrícola

Sistema completo de gestão agrícola desenvolvido com NestJS (backend) e React (frontend), incluindo gerenciamento de produtores, propriedades, cultivos e colheitas.

## 🏗️ Arquitetura

### Backend (NestJS)

- **Framework**: NestJS com TypeScript
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT
- **Logging**: Winston com logs estruturados em JSON
- **Validação**: Zod e class-validator

### Frontend (React)

- **Framework**: React 18 com TypeScript
- **Build Tool**: Vite
- **UI**: Material-UI (MUI) v6
- **Estado**: Redux Toolkit
- **Formulários**: React Hook Form + Zod
- **Máscaras**: react-imask

### Funcionalidades Principais

- ✅ Gestão de produtores rurais com validação de CPF/CNPJ
- ✅ Cascade delete para manter integridade dos dados
- ✅ Máscaras automáticas para CPF, CNPJ e telefone
- ✅ Sistema de logging profissional com correlation IDs
- ✅ Dashboard separado para visão pessoal vs admin
- ✅ Validação robusta para evitar dados duplicados

## 🚀 Execução com Docker

### Pré-requisitos

- Docker 20.10+
- Docker Compose 2.0+

### Execução Completa

```bash
git clone <url-do-repositorio>
cd Elastic_Code
docker-compose up --build
```

### Acessos

- **Frontend**: http://localhost
- **Backend API**: http://localhost:3000
- **Documentação API (Swagger)**: http://localhost:3000/api

## 🌐 URLs do Sistema

### Interface Web (Frontend)

| URL                         | Descrição              |
| --------------------------- | ---------------------- |
| http://localhost            | Página inicial         |
| http://localhost/auth/login | Login no sistema       |
| http://localhost/dashboard  | Dashboard principal    |
| http://localhost/producers  | Gestão de produtores   |
| http://localhost/properties | Gestão de propriedades |

### API Backend (Endpoints)

| Endpoint                              | Método           | Descrição                 |
| ------------------------------------- | ---------------- | ------------------------- |
| http://localhost:3000/health          | GET              | Health check do sistema   |
| http://localhost:3000/auth/login      | POST             | Autenticação de usuário   |
| http://localhost:3000/auth/register   | POST             | Registro de novo usuário  |
| http://localhost:3000/farmers         | GET/POST         | Listar/criar produtores   |
| http://localhost:3000/farmers/{id}    | GET/PATCH/DELETE | Operações por ID          |
| http://localhost:3000/properties      | GET/POST         | Listar/criar propriedades |
| http://localhost:3000/properties/{id} | GET/PATCH/DELETE | Operações por ID          |
| http://localhost:3000/dashboard       | GET              | Dados do dashboard        |

### Exemplos de Uso via cURL

```bash
# Health check
curl http://localhost:3000/health

# Login
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@test.com","password":"123456"}'

# Listar produtores (requer token)
curl -X GET http://localhost:3000/farmers \
  -H "Authorization: Bearer YOUR_TOKEN"

# Criar produtor
curl -X POST http://localhost:3000/farmers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"producer_name":"João Silva","email":"joao@email.com","cpf":"52998224725","phone":"11999999999","password":"123456"}'
```

### Dados de Teste

**CPFs Válidos para Teste:**

- 52998224725
- 17033259504
- 46789135006
- 04688910012
- 89675432100

**CNPJs Válidos para Teste:**

- 11222333000181
- 12345678000195
- 98765432000123

## 🚀 Execução Local

#### Pré-requisitos

- Node.js 18+
- PostgreSQL 15+

#### Backend

```bash
cd back

# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
# Editar .env com suas configurações

# Executar migrações
npm run migration:run

# Iniciar em modo desenvolvimento
npm run start:dev
```

#### Frontend

```bash
cd front

# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento
npm run dev
```

## 🧪 Testes

### Com Docker

```bash
# Testes do backend
docker-compose exec backend npm run test

# Testes do frontend
docker-compose exec frontend npm run test

# Testes E2E
docker-compose exec backend npm run test:e2e
```

### Local

```bash
# Backend
cd back
npm run test
npm run test:cov
npm run test:e2e

# Frontend
cd front
npm run test
npm run test:coverage
```

## 🧪 Estrutura de Testes

O projeto implementa uma estrutura completa de testes com **cobertura mínima de 70%**:

### Backend - Testes Implementados

#### 📊 Cobertura e Qualidade

- **Cobertura mínima**: 70% (branches, functions, lines, statements)
- **Ferramentas**: Jest + ts-jest + @nestjs/testing
- **Relatórios**: HTML, LCOV, JSON

#### 🔬 Tipos de Testes

**1. Testes Unitários**

- Localização: `back/src/**/*.spec.ts`
- Testam serviços isoladamente com mocks
- Cobertura de lógica de negócio e funções puras

**2. Testes de Integração**

- Localização: `back/test/integration/*.spec.ts`
- Testam interações reais com banco SQLite em memória
- Validam fluxos completos Controller → Service → Repository

**3. Testes E2E**

- Localização: `back/test/app.e2e-spec.ts`
- Simulam fluxos críticos (autenticação, CRUD)
- Utilizando Pactum.js para APIs REST

#### 🛠️ Comandos de Teste

```bash
# Entrar no container do backend
docker-compose exec backend bash

# Executar todos os testes
npm run test:all

# Testes unitários apenas
npm run test:unit

# Testes de integração
npm run test:integration

# Testes E2E
npm run test:e2e

# Gerar relatório de cobertura
npm run test:cov

# Watch mode para desenvolvimento
npm run test:watch
```

#### 🎯 Cenários Testados

**Casos de Sucesso:**

- CRUD completo (Criar, Ler, Atualizar, Deletar)
- Autenticação e autorização
- Paginação e filtros
- Validação de dados

**Casos de Borda:**

- Validação de campos obrigatórios
- Tipos de dados incorretos
- Limites de tamanho
- Timeouts e erros de rede

**Cenários de Falha:**

- Banco de dados indisponível
- Tokens inválidos
- Dados corrompidos
- Serviços externos offline

#### 📈 Relatórios de Cobertura

```bash
# Gerar e visualizar relatório
npm run test:cov
open coverage/lcov-report/index.html
```

### Frontend - Testes (Em Desenvolvimento)

O frontend possui estrutura básica configurada com:

- Jest + React Testing Library
- Testes de componentes
- Testes de stores Redux
- Testes de utilitários

```bash
# No diretório front/
npm run test
npm run test:coverage
```

### 📋 Fixtures e Mocks

O projeto utiliza:

- **@faker-js/faker**: Geração de dados falsos
- **Fixtures organizadas**: Dados de teste reutilizáveis
- **Mocks de repositórios**: Isolamento de dependências
- **Cenários de erro**: Testes de robustez

### 🏆 Qualidade Assegurada

- ✅ **70%+ de cobertura** em todas as métricas
- ✅ **Testes rápidos** (< 3 minutos total)
- ✅ **CI/CD ready** com relatórios automatizados
- ✅ **Documentação completa** (`back/TESTING.md`)
- ✅ **Mocks e fixtures organizados**
- ✅ **Cenários de erro e edge cases**

## 📊 Monitoramento e Logs

### Logs dos Serviços

```bash
# Todos os serviços
docker-compose logs -f

# Serviço específico
docker-compose logs -f backend
docker-compose logs -f frontend
```

### Health Checks

Todos os serviços possuem health checks configurados:

```bash
# Verificar status
docker-compose ps

# Backend health
curl http://localhost:3000/health

# Frontend health
curl http://localhost/health
```

## 🔒 Segurança

### Variáveis de Ambiente

As seguintes variáveis devem ser configuradas em produção:

```env
# Backend
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=postgresql://user:pass@host:5432/db

# Passwords
POSTGRES_PASSWORD=secure-password
```

### Backup do Banco de Dados

```bash
# Criar backup
docker-compose exec postgres pg_dump -U postgres elastic_code > backup.sql

# Restaurar backup
docker-compose exec -T postgres psql -U postgres elastic_code < backup.sql
```

## 📁 Estrutura do Projeto

```
Elastic_Code/
├── back/                   # Backend NestJS
│   ├── src/
│   ├── test/
│   ├── Dockerfile
│   └── package.json
├── front/                  # Frontend React
│   ├── src/
│   ├── public/
│   ├── Dockerfile
│   ├── nginx.conf
│   └── package.json
├── init-scripts/           # Scripts de inicialização do banco
├── docker-compose.yml      # Orquestração completa
├── docker-compose.dev.yml  # Ambiente de desenvolvimento
├── Makefile               # Comandos auxiliares
└── README.md
```

## 🎯 Funcionalidades

### Backend

- ✅ Autenticação JWT
- ✅ CRUD de Produtores
- ✅ CRUD de Propriedades
- ✅ CRUD de Cultivos
- ✅ CRUD de Colheitas
- ✅ Dashboard com estatísticas
- ✅ Relatórios
- ✅ API RESTful documentada

### Frontend

- ✅ Interface moderna com Material-UI
- ✅ Autenticação e autorização
- ✅ Dashboard interativo
- ✅ Gestão completa de entidades
- ✅ Formulários validados
- ✅ Gráficos e visualizações
- ✅ Responsivo para mobile

## 🚀 Deploy em Produção

### Usando Docker Swarm

```bash
# Inicializar swarm
docker swarm init

# Deploy
docker stack deploy -c docker-compose.yml elastic-stack
```
